"""Pruebas de la exportación pública (datos/pronosticos/exportar_transparencia.py).

Lo que más importa: que nada con nombre de institución, sede, carrera, comuna
o sexo llegue al archivo que lee el portal.
"""

import json
import math
import sys
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

import exportar_transparencia as ex  # noqa: E402
import generar_datos as g  # noqa: E402  (lo agrega exportar_transparencia a sys.path)

PROHIBIDAS = {"institucion", "instituciones", "inst", "sede", "carrera", "comuna", "codigo_comuna",
              "proporcion_mujeres", "mujeres", "sexo", "celdas", "suprimidas", "nombre_institucion"}


def _llaves(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield k
            yield from _llaves(v)
    elif isinstance(obj, list):
        for x in obj:
            yield from _llaves(x)


def _datos():
    nac = json.loads((RAIZ / "datos" / "pronosticos" / "dashboard" / "cifras_nacionales.json").read_text(encoding="utf-8"))
    filas = [{"anio": "2025", "real": str(r), "previsto": str(p), "error_log": str(math.log(p / r)),
              "limite_inferior_log": "-0.7", "limite_superior_log": "0.5", "cubierto": "1"}
             for r, p in [(40, 36), (60, 66), (150, 140), (400, 410), (35, 30)]]
    return {
        "meta": {"fecha_datos": "2026-11-07"},
        "nacional": nac,
        "validacion_celdas": {**g.resumen_validacion(filas), "fuente": "f", "url": "u", "consultado": "2026-11-07"},
        "validacion_comunas": {"pasos": [{"desde": 2024, "hasta": 2025, "comunas": 300, "error_mediano": 0.06,
                                          "cobertura_poisson": 0.7, "cobertura_empirico": 0.97, "extra": "no sale"}],
                               "fuente": "f", "consultado": "2026-11-07"},
        "paes": {"serie": [{"anio": 2025, "filas": 311084, "regulares": 252598}], "definicion": "d",
                 "fuente": "f", "url": "u", "consultado": "2026-11-07"},
        # Datos internos que NO deben aparecer en la salida:
        "celdas": {"filas": [[0, "SEDE SECRETA", "DERECHO", 0, 0, 0, 0, 50, 30, 100, "X"]],
                   "instituciones": [{"nombre": "UNIVERSIDAD SECRETA"}]},
        "comunas": {"filas": [
            {"comuna": "COMUNA GRANDE", "region": "R", "residentes": 1000, "colegio": 1300},
            {"comuna": "COMUNA PAREJA", "region": "R", "residentes": 800, "colegio": 820},
            {"comuna": "COMUNA CHICA", "region": "R", "residentes": 100, "colegio": 400},
            {"comuna": "COMUNA SIN DATO", "region": "R", "residentes": None, "colegio": None},
        ]},
    }


class Pruebas(unittest.TestCase):
    def setUp(self):
        self.pub = ex.construir_publico(_datos())

    def test_no_salen_llaves_de_instituciones_sedes_carreras_comunas_ni_sexo(self):
        self.assertEqual(PROHIBIDAS & set(_llaves(self.pub)), set())

    def test_no_salen_nombres_de_datos_internos(self):
        texto = json.dumps(self.pub, ensure_ascii=False)
        for secreto in ("SEDE SECRETA", "UNIVERSIDAD SECRETA", "COMUNA GRANDE", "COMUNA PAREJA", "DERECHO"):
            self.assertNotIn(secreto, texto)
        self.assertNotIn("no sale", texto)

    def test_cada_estimacion_trae_fuente_url_y_fecha_de_registro(self):
        self.assertEqual({e["codigo"] for e in self.pub["estimaciones"]}, {"primer_anio_2027", "permanencia_2028"})
        for e in self.pub["estimaciones"]:
            self.assertTrue(e["fuente"] and e["url"].startswith("https://") and e["registrado"])
            self.assertLess(e["inferior"], e["valor"])
            self.assertLess(e["valor"], e["superior"])

    def test_residencia_vs_colegio_solo_cuenta_comunas_grandes(self):
        r = self.pub["residencia_vs_colegio"]
        self.assertEqual(r["comunas_comparadas"], 2)  # la chica y la sin dato quedan fuera
        self.assertEqual(r["comunas_con_diferencia_mayor"], 1)

    def test_falta_un_campo_obligatorio_se_nota(self):
        d = _datos()
        del d["nacional"]["pronosticos"]["primer_anio_2027"]["fuente"]
        with self.assertRaises(KeyError):
            ex.construir_publico(d)

    def test_archivo_publicado_no_tiene_llaves_prohibidas(self):
        ruta = ex.SALIDA
        if not ruta.exists():
            self.skipTest("todavía no se exportó")
        publicado = json.loads(ruta.read_text(encoding="utf-8"))
        self.assertEqual(PROHIBIDAS & set(_llaves(publicado)), set())


if __name__ == "__main__":
    unittest.main()
