"""Pruebas de datos/generar_lotes_sies.py con filas inventadas (no son datos reales)."""

import importlib.util
import sys
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos"))
spec = importlib.util.spec_from_file_location("generar_lotes_sies", RAIZ / "datos" / "generar_lotes_sies.py")
sies = importlib.util.module_from_spec(spec)
sys.modules["generar_lotes_sies"] = sies
spec.loader.exec_module(sies)
base = sies.base



def fila(**cambios):
    f = {
        "oferta_codigo_sies": "I900S1C1J1V1",
        "oferta_institucion_codigo": "900",
        "oferta_carrera_generica": "Carrera Genérica Ficticia",
        "oferta_carrera_nombre_oficial": "Título Ficticio",
        "sies_institucion_codigo": "900",
        "sies_institucion_nombre": "Instituto de Ejemplo",
        "sies_institucion_tipo": "instituto_profesional",
        "sies_retencion_1er_anio_pct": "80",
        "sies_periodo_retencion": "estudiantes de primer año 2024 que siguen matriculados en 2025",
        "sies_motivo_retencion": "",
        "sies_empleabilidad_1er_anio_pct": "60",
        "sies_periodo_empleabilidad_1er_anio": "titulados 2021 a 2023; años de ingreso 2022 a 2024",
        "sies_empleabilidad_2do_anio_pct": "",
        "sies_periodo_empleabilidad_2do_anio": "",
        "sies_motivo_empleabilidad_2do_anio": "",
        "sies_continuidad_estudios_pct": "70",
        "sies_periodo_continuidad": "titulados 2021 a 2023, matriculados al año siguiente de titularse",
        "sies_duracion_real_semestres": "9",
        "sies_periodo_duracion_real": "titulados 2024",
        "sies_motivo_duracion_real": "",
        "sies_ingreso_4to_anio_tramo": "De $1 millón 400 mil a $1 millón 500 mil",
        "sies_ingreso_4to_anio_desde_pesos": "1400000",
        "sies_ingreso_4to_anio_hasta_pesos": "1500000",
        "sies_motivo_ingreso": "",
        "sies_periodo_ingreso": "titulados 2018 a 2020; años de ingreso 2022 a 2024; pesos de septiembre de 2025",
        "sies_excepcion_derecho": "no",
        "sies_fuente": "Mi Futuro",
        "sies_url_archivo": "https://ejemplo.invalid/sies.xlsx",
        "sies_fecha_descarga": "2026-11-05",
    }
    f.update(cambios)
    return f


class LotesSiesTest(unittest.TestCase):
    def construir(self, filas):
        return sies.construir(filas)

    def test_una_fila_genera_cinco_indicadores_y_un_tramo(self):
        lotes, informe = self.construir([fila()])
        self.assertEqual(len(lotes["07_indicadores_sies"]), 1 + 5)  # 1 fuente + 5 indicadores
        self.assertEqual(len(lotes["08_ingresos_sies"]), 1)
        self.assertEqual(informe["indicadores"], 5)

    def test_los_indicadores_cuelgan_de_la_carrera_generica(self):
        lotes, _ = self.construir([fila()])
        self.assertIn("programa_generico g", lotes["07_indicadores_sies"][1])
        self.assertNotIn("programa_variante", lotes["07_indicadores_sies"][1])

    def test_excepcion_derecho_deja_empleabilidad_1er_anio_nulo_con_motivo(self):
        lotes, informe = self.construir([fila(sies_excepcion_derecho="si")])
        emp = [s for s in lotes["07_indicadores_sies"] if "'empleabilidad_1er_anio'" in s][0]
        self.assertIn("NULL", emp)
        self.assertIn("equivalente al 2.º año", emp)
        self.assertEqual(informe["indicadores_sin_dato"], 2)  # 1er año de excepción y 2.º año vacío

    def test_sedes_con_valores_distintos_se_detienen(self):
        filas = [
            fila(),
            fila(oferta_codigo_sies="I900S2C1J1V1", oferta_sede="Sede B", sies_retencion_1er_anio_pct="75"),
        ]
        with self.assertRaises(base.ErrorDeLote):
            self.construir(filas)

    def test_carrera_sin_cruce_sies_no_genera_nada(self):
        lotes, informe = self.construir([fila(sies_fuente="", sies_retencion_1er_anio_pct="")])
        self.assertEqual(informe["sin_cruce_sies"], 1)
        self.assertEqual(informe["indicadores"], 0)
        self.assertEqual(len(lotes["08_ingresos_sies"]), 0)

    def test_porcentaje_fuera_de_rango_se_detiene(self):
        with self.assertRaises(base.ErrorDeLote):
            self.construir([fila(sies_retencion_1er_anio_pct="120")])

    def test_tramo_invertido_se_detiene(self):
        with self.assertRaises(base.ErrorDeLote):
            self.construir([fila(sies_ingreso_4to_anio_desde_pesos="2000000")])


if __name__ == "__main__":
    unittest.main()
