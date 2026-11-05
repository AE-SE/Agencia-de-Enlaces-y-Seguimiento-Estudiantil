"""Pruebas de datos/cargar_oferta.py. Correr con:

    python3 -m unittest discover -s tests/datos -p "test_*.py"

Las filas de estas pruebas son INVENTADAS: nunca se pegan filas reales de estudiantes (AGENTS.md 2.2).
Una prueba adicional compara contra el archivo oficial real y se omite si no está disponible.
"""
import csv
import io
import os
import sys
import tempfile
import unittest
from decimal import Decimal

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "datos"))
import cargar_oferta as c  # noqa: E402

URL = "https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar"
UF = Decimal("41274.20")
ENCABEZADO = c.COLUMNAS + ["mrun", "gen_alu", "fec_nac_alu"]  # columnas personales: deben ignorarse


def fila(**kw):
    base = {
        "codigo_unico": "I1S1C1J1V1", "cat_periodo": "2026", "cod_inst": "1", "nomb_inst": "UNIVERSIDAD DE PRUEBA",
        "tipo_inst_1": "Universidades", "nomb_sede": "SEDE UNO", "cod_carrera": "1", "nomb_carrera": "CARRERA UNO",
        "modalidad": "Presencial", "jornada": "Diurna", "vigencia_carrera": "VIGENTE CON ALUMNOS NUEVOS",
        "nivel_global": "Pregrado", "dur_estudio_carr": "10", "region_sede": "Metropolitana", "comuna_sede": "Santiago",
        "formato_valores": "Monto en Pesos", "valor_matricula": "200000", "valor_arancel": "3000000",
        "codigo_demre": "0", "area_carrera_generica": "Carrera genérica de prueba", "acreditada_inst": "ACREDITADA", "acre_inst_anio": "5",
        "acre_inst_desde_hasta": "01/03/2024 - 01/03/2029", "mrun": "SECRETO-1", "gen_alu": "X", "fec_nac_alu": "2000-01-01",
    }
    base.update(kw)
    return [base[k] for k in ENCABEZADO]


def correr(*filas):
    return c.procesar([ENCABEZADO, *filas], UF, "2026-11-05", URL, "2026-11-05")


class PruebasDeCarga(unittest.TestCase):
    def test_una_fila_por_carrera_y_matricula_es_el_numero_de_estudiantes(self):
        salida, rep = correr(fila(), fila(), fila(), fila(codigo_unico="I1S1C2J1V1", nomb_carrera="OTRA"))
        self.assertEqual([r["codigo_sies"] for r in salida], ["I1S1C1J1V1", "I1S1C2J1V1"])
        self.assertEqual(salida[0]["matricula_total"], 3)
        self.assertEqual(rep["filas_leidas"], 4)

    def test_no_sale_ningun_dato_de_estudiantes(self):
        salida, _ = correr(fila())
        texto = " ".join(map(str, salida[0].values()))
        self.assertNotIn("SECRETO-1", texto)
        for personal in ("mrun", "gen_alu", "fec_nac_alu"):
            self.assertNotIn(personal, c.SALIDA)

    def test_arancel_en_pesos_pasa_tal_cual(self):
        salida, _ = correr(fila(valor_arancel="6388500"))
        r = salida[0]
        self.assertEqual((r["arancel_anual_pesos"], r["arancel_unidad_original"], r["uf_valor"]), (6388500, "pesos", ""))

    def test_arancel_en_uf_se_convierte_y_guarda_el_original_con_su_fecha(self):
        salida, _ = correr(fila(formato_valores="Monto en UF", valor_arancel="232"))
        r = salida[0]
        self.assertEqual(r["arancel_anual_pesos"], 9575614)  # 232 x 41.274,20 = 9.575.614,4
        self.assertEqual((r["arancel_unidad_original"], r["arancel_valor_original"]), ("uf", "232"))
        self.assertEqual((r["uf_valor"], r["uf_fecha"]), ("41274.20", "2026-11-05"))

    def test_arancel_cero_o_vacio_queda_vacio_con_motivo_nunca_cero(self):
        for malo in ("0", "", "abc"):
            salida, _ = correr(fila(valor_arancel=malo))
            self.assertEqual(salida[0]["arancel_anual_pesos"], "", malo)
            self.assertTrue(salida[0]["motivo_arancel"], malo)

    def test_matricula_de_inscripcion_cero_queda_vacia_con_motivo(self):
        salida, _ = correr(fila(valor_matricula="0"))
        self.assertEqual(salida[0]["matricula_inscripcion_pesos"], "")
        self.assertTrue(salida[0]["motivo_matricula_inscripcion"])

    def test_postgrado_y_postitulo_quedan_fuera_y_se_cuentan(self):
        salida, rep = correr(fila(), fila(codigo_unico="I1S1C9J1V1", nivel_global="Postgrado"))
        self.assertEqual(len(salida), 1)
        self.assertEqual(sum(rep["descartadas"].values()), 1)

    def test_una_carrera_con_valores_contradictorios_se_descarta_entera(self):
        salida, rep = correr(fila(valor_arancel="1000000"), fila(valor_arancel="2000000"))
        self.assertEqual(salida, [])
        self.assertIn("valor_arancel", " ".join(rep["descartadas"]))

    def test_duracion_ausente_o_fuera_de_rango_se_descarta(self):
        for dur in ("", "0", "99", "x"):
            salida, rep = correr(fila(dur_estudio_carr=dur))
            self.assertEqual(salida, [], dur)

    def test_acreditacion_se_lee_con_fechas_iso(self):
        r = correr(fila())[0][0]
        self.assertEqual((r["acreditacion_estado"], r["acreditacion_anios"], r["acreditacion_desde"], r["acreditacion_hasta"]),
                         ("acreditada", "5", "2024-03-01", "2029-03-01"))

    def test_sin_acreditacion_queda_vacia_con_motivo(self):
        r = correr(fila(acreditada_inst="", acre_inst_anio="", acre_inst_desde_hasta=""))[0][0]
        self.assertEqual(r["acreditacion_estado"], "")
        self.assertTrue(r["motivo_acreditacion"])

    def test_institucion_no_acreditada_no_lleva_anios(self):
        r = correr(fila(acreditada_inst="NO ACREDITADA", acre_inst_anio="0", acre_inst_desde_hasta=""))[0][0]
        self.assertEqual((r["acreditacion_estado"], r["acreditacion_anios"]), ("no_acreditada", ""))

    def test_codigo_demre_cero_es_vacio(self):
        self.assertEqual(correr(fila(codigo_demre="0"))[0][0]["codigo_demre"], "")
        self.assertEqual(correr(fila(codigo_demre="44006"))[0][0]["codigo_demre"], "44006")

    def test_la_carrera_generica_llega_a_la_salida(self):
        self.assertEqual(correr(fila())[0][0]["carrera_generica"], "Carrera genérica de prueba")

    def test_tipo_de_institucion_con_tildes_se_reconoce(self):
        r = correr(fila(tipo_inst_1="Centros de Formación Técnica"))[0][0]
        self.assertEqual(r["institucion_tipo"], "centro_formacion_tecnica")

    def test_faltan_columnas_da_error_claro(self):
        with self.assertRaises(ValueError):
            c.procesar([["codigo_unico"], ["x"]], UF, "2026-11-05", URL, "2026-11-05")

    def test_es_repetible_mismas_entradas_mismo_archivo(self):
        entradas = [fila(), fila(), fila(codigo_unico="I1S1C2J1V1", valor_arancel="0")]
        with tempfile.TemporaryDirectory() as d:
            contenidos = []
            for n in (1, 2):
                salida, _ = correr(*entradas)
                ruta = os.path.join(d, f"salida{n}.csv")
                c.escribir(salida, ruta)
                with open(ruta, "rb") as f:
                    contenidos.append(f.read())
        self.assertEqual(contenidos[0], contenidos[1])

    def test_el_orden_de_las_filas_de_entrada_no_cambia_el_resultado(self):
        a = correr(fila(), fila(codigo_unico="I1S1C2J1V1"))[0]
        b = correr(fila(codigo_unico="I1S1C2J1V1"), fila())[0]
        self.assertEqual(a, b)


@unittest.skipUnless(os.environ.get("MATRICULA_CSV"), "defina MATRICULA_CSV con la ruta del CSV oficial extraído")
class PruebaContraElArchivoOficial(unittest.TestCase):
    """Valores verificados a mano el 2026-11-05 contra el archivo oficial.
    Fuente: https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar"""

    def test_valores_verificados(self):
        with open(os.environ["MATRICULA_CSV"], "r", encoding="utf-8", newline="") as f:
            salida, _ = c.procesar(csv.reader(f, delimiter=";"), UF, "2026-11-05", URL, "2026-11-05")
        por_codigo = {r["codigo_sies"]: r for r in salida}
        esperados = {
            "I70S1C41J1V1": (6388500, 617),    # Enfermería, Universidad de Chile
            "I87S1C49J1V3": (7422393, 70),     # Ingeniería Civil Informática, Universidad de Concepción
            "I260S45C47J1V1": (2763000, 336),  # Técnico en Enfermería, CFT Santo Tomás
        }
        for codigo, (arancel, matricula) in esperados.items():
            self.assertEqual(por_codigo[codigo]["arancel_anual_pesos"], arancel, codigo)
            self.assertEqual(por_codigo[codigo]["matricula_total"], matricula, codigo)


if __name__ == "__main__":
    unittest.main()
