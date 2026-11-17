"""Pruebas de datos/generar_lotes_corte.py con archivos inventados (no son datos reales)."""

import csv
import importlib.util
import json
import sys
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos"))
spec = importlib.util.spec_from_file_location("generar_lotes_corte", RAIZ / "datos" / "generar_lotes_corte.py")
corte = importlib.util.module_from_spec(spec)
sys.modules["generar_lotes_corte"] = corte
spec.loader.exec_module(corte)
base = corte.base

COLUMNAS_D = ["ID_aux", "ORDEN_PREF", "COD_CARRERA_PREF", "ESTADO_PREF", "TIPO_PREF", "PTJE_PREF"]


def escribir_d(ruta: Path, filas: list[list[str]]) -> None:
    with ruta.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=";", quoting=csv.QUOTE_ALL)
        w.writerow(COLUMNAS_D)
        w.writerows(filas)


def escribir_estadisticas(ruta: Path, filas: list[tuple[str, str]]) -> None:
    with ruta.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["ANYO_PROCESO", "CODIGO_CARRERA", "NUM_SELEC_REG"])
        for codigo, n in filas:
            w.writerow(["2026", codigo, n])


def escribir_carga(ruta: Path, pares: list[tuple[str, str]]) -> None:
    with ruta.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["oferta_codigo_sies", "oferta_codigo_demre"])
        w.writeheader()
        for sies, demre in pares:
            w.writerow({"oferta_codigo_sies": sies, "oferta_codigo_demre": demre})


def seleccionados(carrera: str, puntajes: list[str], estado="24", tipo="REGULAR") -> list[list[str]]:
    return [[f"id{carrera}{i}", "1", carrera, estado, tipo, p] for i, p in enumerate(puntajes)]


class CorteTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def calcular(self, filas_d, estadisticas, variantes):
        d, e, c = self.dir / "d.csv", self.dir / "e.csv", self.dir / "c.csv"
        escribir_d(d, filas_d)
        escribir_estadisticas(e, estadisticas)
        escribir_carga(c, variantes)
        return corte.calcular(corte.leer_archivo_d(d), corte.leer_estadisticas(e), corte.leer_variantes(c))

    PUNTAJES = ["800.5", "812.3", "799.9", "850", "901.2", "777.4", "820", "830"]  # 8 personas

    def test_el_ultimo_seleccionado_es_el_minimo_de_la_via_regular(self):
        resultados, informe = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8")], [("I1S1C1J1V1", "1001")])
        self.assertEqual(resultados[0]["valor"], Decimal("777.4"))
        self.assertIsNone(resultados[0]["motivo"])
        self.assertEqual(informe["publicadas"], 1)

    def test_ignora_otras_vias_y_a_quienes_no_quedaron_seleccionados(self):
        filas = (seleccionados("1001", self.PUNTAJES)
                 + seleccionados("1001", ["500"], tipo="PACE") + seleccionados("1001", ["510"], tipo="BEA")
                 + seleccionados("1001", ["520"], tipo="GENERO") + seleccionados("1001", ["530"], estado="25"))
        resultados, _ = self.calcular(filas, [("1001", "8")], [("I1S1C1J1V1", "1001")])
        self.assertEqual(resultados[0]["valor"], Decimal("777.4"))

    def test_si_el_conteo_no_coincide_con_el_oficial_no_se_publica(self):
        # El DEMRE quitó una persona de sus datos abiertos: el mínimo podría estar sobrestimado.
        resultados, informe = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "9")], [("I1S1C1J1V1", "1001")])
        self.assertIsNone(resultados[0]["valor"])
        self.assertEqual(resultados[0]["motivo"], corte.MOTIVO_NO_COINCIDE)
        self.assertEqual(informe["sin_datos_no_coincide"], 1)

    def test_con_menos_de_ocho_seleccionados_no_se_publica_aunque_coincida(self):
        resultados, informe = self.calcular(seleccionados("1001", self.PUNTAJES[:7]), [("1001", "7")], [("I1S1C1J1V1", "1001")])
        self.assertIsNone(resultados[0]["valor"])
        self.assertEqual(resultados[0]["motivo"], corte.MOTIVO_POCOS)
        self.assertEqual(informe["sin_datos_pocos_seleccionados"], 1)

    def test_ocho_seleccionados_es_el_minimo_que_se_publica(self):
        resultados, _ = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8")], [("I1S1C1J1V1", "1001")])
        self.assertIsNotNone(resultados[0]["valor"])

    def test_una_carrera_sin_seleccionados_regulares_lo_dice(self):
        resultados, informe = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8"), ("1002", "0")],
                                            [("I1S1C1J1V1", "1001"), ("I1S1C2J1V1", "1002")])
        sin = [r for r in resultados if r["codigo_demre"] == "1002"][0]
        self.assertIsNone(sin["valor"])
        self.assertEqual(sin["motivo"], corte.MOTIVO_SIN_SELECCIONADOS)
        self.assertEqual(informe["sin_datos_sin_seleccionados"], 1)

    def test_un_seleccionado_sin_puntaje_impide_publicar(self):
        filas = seleccionados("1001", self.PUNTAJES[:-1] + ["NA"])
        resultados, _ = self.calcular(filas, [("1001", "8")], [("I1S1C1J1V1", "1001")])
        self.assertIsNone(resultados[0]["valor"])
        self.assertEqual(resultados[0]["motivo"], corte.MOTIVO_NO_COINCIDE)

    def test_acepta_coma_decimal_y_no_pierde_decimales(self):
        resultados, _ = self.calcular(seleccionados("1001", ["931,1", "940", "941", "942", "943", "944", "945", "946"]), [("1001", "8")], [("I1S1C1J1V1", "1001")])
        self.assertEqual(resultados[0]["valor"], Decimal("931.1"))

    def test_una_carrera_sin_variante_en_la_carga_no_recibe_fila(self):
        resultados, informe = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8"), ("1003", "8")], [("I1S1C1J1V1", "1001")])
        self.assertEqual([r["codigo_demre"] for r in resultados], ["1001"])
        self.assertEqual(informe["sin_variante_en_la_carga"], 1)

    def test_una_carrera_de_la_carga_que_no_esta_en_las_estadisticas_se_cuenta_y_no_recibe_fila(self):
        resultados, informe = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8")],
                                            [("I1S1C1J1V1", "1001"), ("I1S1C9J1V1", "9009")])
        self.assertEqual(len(resultados), 1)
        self.assertEqual(informe["no_estan_en_estadisticas_2026"], 1)

    def test_un_puntaje_fuera_del_rango_oficial_se_detiene(self):
        with self.assertRaises(base.ErrorDeLote):
            self.calcular(seleccionados("1001", ["100"] + self.PUNTAJES[:7]), [("1001", "8")], [("I1S1C1J1V1", "1001")])

    def test_un_codigo_demre_en_dos_variantes_se_detiene(self):
        with self.assertRaises(base.ErrorDeLote):
            self.calcular([], [], [("I1S1C1J1V1", "1001"), ("I1S2C1J1V1", "1001")])

    def test_el_sql_es_idempotente_y_cita_la_fuente(self):
        resultados, _ = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8")], [("I1S1C1J1V1", "1001")])
        lotes = corte.construir(resultados, "2026-11-17")["13_puntajes_corte"]
        self.assertIn("insert into fuente", lotes[0])
        self.assertIn("'Datos abiertos DEMRE'", lotes[0])
        indicador = lotes[1]
        self.assertIn("'puntaje_corte', 777.4, 'puntos'", indicador)
        self.assertIn("'selección del 19 de enero de 2026, vía regular'", indicador)
        self.assertIn("v.codigo_sies = 'I1S1C1J1V1'", indicador)
        self.assertIn("'2026-11-17'", indicador)
        for sentencia in lotes:
            self.assertIn("on conflict", sentencia)

    def test_un_dato_nulo_lleva_su_motivo_y_un_dato_con_valor_no(self):
        # La tabla indicador exige motivo si no hay valor y ninguno si lo hay.
        resultados, _ = self.calcular(seleccionados("1001", self.PUNTAJES) + seleccionados("1002", ["800"]),
                                      [("1001", "8"), ("1002", "1")], [("I1S1C1J1V1", "1001"), ("I1S1C2J1V1", "1002")])
        sentencias = corte.construir(resultados, "2026-11-17")["13_puntajes_corte"][1:]
        con_valor = [s for s in sentencias if "777.4" in s][0]
        sin_valor = [s for s in sentencias if "777.4" not in s][0]
        self.assertIn("'2026-11-17', NULL from programa_variante", con_valor)  # sin motivo
        self.assertNotIn("'2026-11-17', NULL from programa_variante", sin_valor)  # con motivo
        self.assertIn("'puntaje_corte', NULL, 'puntos'", sin_valor)
        self.assertIn("menos de 8 personas", sin_valor)

    def test_la_fecha_de_consulta_invalida_se_detiene(self):
        with self.assertRaises(ValueError):
            corte.construir([], "no-es-fecha")

    def test_cli_escribe_el_lote_y_el_informe_sin_tocar_los_archivos(self):
        d, e, c = self.dir / "d.csv", self.dir / "e.csv", self.dir / "c.csv"
        escribir_d(d, seleccionados("1001", self.PUNTAJES))
        escribir_estadisticas(e, [("1001", "8")])
        escribir_carga(c, [("I1S1C1J1V1", "1001")])
        antes = d.read_bytes()
        salida = self.dir / "lotes"
        codigo = corte.main(["x", str(c), str(d), str(e), str(salida), "2026-11-17"])
        self.assertEqual(codigo, 0)
        self.assertEqual(d.read_bytes(), antes)
        self.assertTrue((salida / "13_puntajes_corte.sql").exists())
        informe = json.loads((salida / "informe_corte.json").read_text(encoding="utf-8"))
        self.assertEqual(informe["publicadas"], 1)

    def test_el_informe_no_trae_filas_de_personas(self):
        _, informe = self.calcular(seleccionados("1001", self.PUNTAJES), [("1001", "8")], [("I1S1C1J1V1", "1001")])
        self.assertTrue(all(isinstance(v, int) for v in informe.values()))


if __name__ == "__main__":
    unittest.main()
