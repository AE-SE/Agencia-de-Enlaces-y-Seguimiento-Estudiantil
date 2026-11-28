"""Pruebas de datos/generar_lotes.py con un archivo de ejemplo inventado.

Los datos no son reales: instituciones, carreras y valores son ficticios.
"""

import csv
import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("generar_lotes", RAIZ / "datos" / "generar_lotes.py")
generar = importlib.util.module_from_spec(spec)
sys.modules["generar_lotes"] = generar
spec.loader.exec_module(generar)

COLUMNAS = [
    "oferta_codigo_sies", "oferta_institucion_codigo", "oferta_institucion_nombre",
    "oferta_institucion_tipo", "oferta_carrera_codigo", "oferta_carrera_nombre_oficial",
    "oferta_carrera_generica", "oferta_sede", "oferta_comuna", "oferta_region", "oferta_jornada",
    "oferta_modalidad", "oferta_vigencia", "oferta_duracion_formal_semestres",
    "oferta_matricula_total", "oferta_arancel_anual_pesos", "oferta_arancel_unidad_original",
    "oferta_arancel_valor_original", "oferta_matricula_inscripcion_pesos", "oferta_uf_valor",
    "oferta_uf_fecha", "oferta_motivo_arancel", "oferta_motivo_matricula_inscripcion",
    "oferta_acreditacion_estado", "oferta_acreditacion_anios", "oferta_acreditacion_desde",
    "oferta_acreditacion_hasta", "oferta_motivo_acreditacion", "oferta_codigo_demre",
    "oferta_fuente", "oferta_url_archivo", "oferta_fecha_descarga", "oferta_periodo",
]



def sin_freno(sentencias):
    """Las sentencias de datos del lote, sin la transacción ni el freno de período (se prueban aparte)."""
    return [s for s in sentencias if s not in ("begin;", "commit;") and not s.startswith("do $$")]

def fila(**cambios):
    base = {c: "" for c in COLUMNAS}
    base.update({
        "oferta_codigo_sies": "I900S1C1J1V1",
        "oferta_institucion_codigo": "900",
        "oferta_institucion_nombre": "Instituto de Ejemplo",
        "oferta_institucion_tipo": "instituto_profesional",
        "oferta_carrera_codigo": "1",
        "oferta_carrera_nombre_oficial": "Carrera Ficticia",
        "oferta_carrera_generica": "Área ficticia",
        "oferta_sede": "Sede A",
        "oferta_comuna": "Comuna A",
        "oferta_region": "Metropolitana",
        "oferta_jornada": "Diurna",
        "oferta_duracion_formal_semestres": "6",
        "oferta_matricula_total": "120",
        "oferta_arancel_anual_pesos": "1000000",
        "oferta_arancel_unidad_original": "pesos",
        "oferta_arancel_valor_original": "1000000",
        "oferta_acreditacion_estado": "acreditada",
        "oferta_acreditacion_anios": "4",
        "oferta_acreditacion_hasta": "2030-01-01",
        "oferta_fuente": "Datos Abiertos Mineduc",
        "oferta_url_archivo": "https://ejemplo.invalid/archivo.rar",
        "oferta_fecha_descarga": "2026-11-05",
        "oferta_periodo": "matrícula 2026",
    })
    base.update(cambios)
    return base


class GenerarLotesTest(unittest.TestCase):
    def construir(self, filas):
        lotes, informe = generar.construir(filas)
        return lotes, informe

    # --- Freno de período: ninguna carrera puede quedar con dos períodos del mismo dato ---

    def test_el_freno_cierra_el_lote_en_una_transaccion(self):
        lote = generar.con_freno_de_periodo(["insert 1;", "insert 2;"], "indicador", ["matricula", "matricula"])
        self.assertEqual(lote[0], "begin;")
        self.assertEqual(lote[1:3], ["insert 1;", "insert 2;"])
        self.assertTrue(lote[-2].startswith("do $$"))
        self.assertEqual(lote[-1], "commit;")

    def test_el_freno_revisa_carrera_por_carrera_y_tipo_por_tipo(self):
        freno = generar.con_freno_de_periodo([], "indicador", ["matricula", "puntaje_corte"])[-2]
        self.assertIn("from indicador where tipo in ('matricula', 'puntaje_corte') "
                      "group by programa_generico_id, programa_id, variante_id, tipo "
                      "having count(distinct periodo) > 1", freno)
        self.assertIn("raise exception", freno)

    def test_el_freno_sin_tipo_agrupa_por_la_clave_de_la_tabla(self):
        freno = generar.con_freno_de_periodo([], "vacante_admision")[-2]
        self.assertIn("from vacante_admision group by variante_id, via having count(distinct periodo) > 1", freno)

    def test_los_lotes_con_periodo_llevan_su_freno(self):
        lotes, _ = self.construir([fila()])
        esperado = {
            "06_aranceles": "from arancel_variante group by variante_id ",
            "14_matricula_inscripcion": "where tipo in ('matricula_inscripcion') ",
            "15_matricula_total": "where tipo in ('matricula') ",
        }
        for nombre, fragmento in esperado.items():
            self.assertEqual((lotes[nombre][0], lotes[nombre][-1]), ("begin;", "commit;"), nombre)
            self.assertIn(fragmento, lotes[nombre][-2], nombre)
        # La acreditación guarda su historia por fecha a propósito: no lleva freno.
        self.assertFalse(any(s.startswith("do $$") for s in lotes["12_acreditaciones"]))

    def test_una_carrera_en_dos_sedes_es_un_programa_y_dos_variantes(self):
        filas = [
            fila(),
            fila(oferta_codigo_sies="I900S2C1J1V1", oferta_sede="Sede B"),
        ]
        _, informe = self.construir(filas)
        self.assertEqual(informe["programas"], 1)
        self.assertEqual(informe["variantes"], 2)

    def test_el_programa_se_identifica_por_institucion_y_nombre_normalizado(self):
        lotes, _ = self.construir([fila(oferta_carrera_nombre_oficial="Enfermería  Ficticia")])
        self.assertIn("'enfermeria ficticia'", lotes["04_programas"][0])
        self.assertIn("on conflict (institucion_id, nombre_normalizado) do nothing", lotes["04_programas"][0])

    def test_nombres_que_difieren_solo_en_tildes_forman_un_programa(self):
        filas = [
            fila(),
            fila(oferta_codigo_sies="I900S2C1J1V1", oferta_sede="Sede B",
                 oferta_carrera_nombre_oficial="CARRERA FICTICIA"),
        ]
        _, informe = self.construir(filas)
        self.assertEqual(informe["programas"], 1)
        self.assertEqual(informe["nombres_que_se_unifican"], 1)

    def test_normalizar_quita_tildes_y_espacios(self):
        self.assertEqual(generar.normalizar("  Ingeniería   Civil  "), "ingenieria civil")

    def test_programa_conserva_el_nombre_oficial(self):
        lotes, _ = self.construir([fila()])
        sentencia = lotes["04_programas"][0]

        self.assertIn("nombre_oficial", sentencia)
        self.assertEqual(sentencia.count("'Carrera Ficticia'"), 2)

    def test_arancel_en_uf_exige_valor_y_fecha_de_uf(self):
        filas = [fila(oferta_arancel_unidad_original="uf", oferta_arancel_valor_original="30")]
        with self.assertRaises(generar.ErrorDeLote):
            self.construir(filas)

    def test_arancel_en_uf_con_valor_y_fecha_pasa(self):
        filas = [fila(
            oferta_arancel_unidad_original="uf",
            oferta_arancel_valor_original="30",
            oferta_uf_valor="41000",
            oferta_uf_fecha="2026-11-05",
        )]
        lotes, _ = self.construir(filas)
        self.assertIn("'uf'", sin_freno(lotes["06_aranceles"])[0])
        self.assertIn("'2026-11-05'", sin_freno(lotes["06_aranceles"])[0])

    def test_sin_arancel_queda_nulo_con_el_motivo_oficial(self):
        filas = [fila(
            oferta_arancel_anual_pesos="",
            oferta_arancel_unidad_original="",
            oferta_arancel_valor_original="",
            oferta_motivo_arancel="Mineduc informa 0 o no informa este monto",
        )]
        lotes, informe = self.construir(filas)
        self.assertIn("NULL, NULL, NULL, NULL, NULL, 'Mineduc informa 0 o no informa este monto'", sin_freno(lotes["06_aranceles"])[0])
        self.assertEqual(informe["aranceles_sin_monto"], 1)

    def test_matricula_de_inscripcion_se_carga_como_indicador_de_la_variante(self):
        lotes, informe = self.construir([fila(oferta_matricula_inscripcion_pesos="200000")])
        sentencia = sin_freno(lotes["14_matricula_inscripcion"])[0]
        self.assertIn("'matricula_inscripcion', 200000.0, 'pesos'", sentencia)
        self.assertIn("'año 2026'", sentencia)
        self.assertEqual(informe["matriculas_inscripcion_con_monto"], 1)

    def test_sin_matricula_de_inscripcion_queda_nula_con_el_motivo_oficial(self):
        lotes, informe = self.construir([fila(oferta_motivo_matricula_inscripcion="Mineduc informa 0 o no informa este monto")])
        sentencia = sin_freno(lotes["14_matricula_inscripcion"])[0]
        self.assertIn("'matricula_inscripcion', NULL, 'pesos'", sentencia)
        self.assertIn("'Mineduc informa 0 o no informa este monto'", sentencia)
        self.assertEqual(informe["matriculas_inscripcion_sin_monto"], 1)

    def test_matricula_total_se_carga_como_indicador_en_estudiantes(self):
        lotes, _ = self.construir([fila(oferta_matricula_total="617")])
        sentencia = sin_freno(lotes["15_matricula_total"])[0]
        self.assertIn("'matricula', 617, 'estudiantes'", sentencia)
        self.assertIn("todos los años de la carrera", sentencia)

    def test_matricula_total_vacia_o_cero_se_detiene(self):
        for malo in ("", "0", "abc"):
            with self.assertRaises(generar.ErrorDeLote):
                self.construir([fila(oferta_matricula_total=malo)])

    def test_matricula_de_inscripcion_no_positiva_se_detiene(self):
        with self.assertRaises(generar.ErrorDeLote):
            self.construir([fila(oferta_matricula_inscripcion_pesos="-5")])

    def test_codigo_sies_repetido_se_detiene(self):
        with self.assertRaises(generar.ErrorDeLote):
            self.construir([fila(), fila(oferta_sede="Sede B")])

    def test_tipo_de_institucion_invalido_se_detiene(self):
        with self.assertRaises(generar.ErrorDeLote):
            self.construir([fila(oferta_institucion_tipo="escuela")])

    def test_acreditacion_inconsistente_en_una_institucion_se_detiene(self):
        filas = [
            fila(),
            fila(oferta_codigo_sies="I900S2C2J1V1", oferta_carrera_codigo="2", oferta_acreditacion_anios="5"),
        ]
        with self.assertRaises(generar.ErrorDeLote):
            self.construir(filas)

    def test_comilla_simple_en_el_nombre_se_escapa(self):
        lotes, _ = self.construir([fila(oferta_carrera_nombre_oficial="Carrera d'Ejemplo")])
        self.assertIn("'Carrera d''Ejemplo'", lotes["04_programas"][0])

    def test_las_sentencias_son_idempotentes(self):
        lotes, _ = self.construir([fila()])
        for nombre, sentencias in lotes.items():
            for s in sin_freno(sentencias):
                self.assertIn("on conflict", s, nombre)

    # --- Acreditación institucional fechada (lote 12, tabla acreditacion_institucion) ---

    def test_acreditada_se_carga_con_anios_fechas_y_la_fecha_de_la_fuente(self):
        lotes, informe = self.construir([fila(oferta_acreditacion_desde="2026-01-01", oferta_acreditacion_hasta="2030-01-01")])
        sentencia = lotes["12_acreditaciones"][0]
        self.assertIn("insert into acreditacion_institucion", sentencia)
        self.assertIn("'acreditada', 4, '2026-01-01', '2030-01-01', '2026-11-05'", sentencia)
        self.assertIn("codigo_oficial = '900'", sentencia)
        self.assertEqual(informe["acreditaciones_por_estado"], {"acreditada": 1})

    def test_no_acreditada_y_bajo_tutela_se_cargan_sin_anios_ni_fechas(self):
        for estado in ("no_acreditada", "bajo_tutela"):
            with self.subTest(estado=estado):
                lotes, _ = self.construir([fila(
                    oferta_acreditacion_estado=estado, oferta_acreditacion_anios="", oferta_acreditacion_hasta="",
                )])
                self.assertIn(f"'{estado}', NULL, NULL, NULL, '2026-11-05'", lotes["12_acreditaciones"][0])

    def test_acreditada_sin_anios_no_inventa_una_fila_y_queda_en_el_informe(self):
        lotes, informe = self.construir([fila(oferta_acreditacion_anios="", oferta_acreditacion_hasta="")])
        self.assertEqual(lotes["12_acreditaciones"], [])
        self.assertEqual(informe["acreditaciones_sin_dato"], ["900"])

    def test_anios_en_una_institucion_no_acreditada_se_detiene(self):
        with self.assertRaises(generar.ErrorDeLote):
            self.construir([fila(oferta_acreditacion_estado="no_acreditada", oferta_acreditacion_anios="3")])

    def test_acreditacion_que_termina_antes_de_empezar_se_detiene(self):
        with self.assertRaises(generar.ErrorDeLote):
            self.construir([fila(oferta_acreditacion_desde="2031-01-01", oferta_acreditacion_hasta="2030-01-01")])

    def test_estados_distintos_en_una_misma_institucion_se_detienen(self):
        filas = [
            fila(),
            fila(oferta_codigo_sies="I900S2C2J1V1", oferta_carrera_codigo="2", oferta_acreditacion_estado="bajo_tutela",
                 oferta_acreditacion_anios="", oferta_acreditacion_hasta=""),
        ]
        with self.assertRaises(generar.ErrorDeLote):
            self.construir(filas)

    def test_una_fila_por_institucion_aunque_tenga_varias_carreras(self):
        filas = [fila(), fila(oferta_codigo_sies="I900S2C1J1V1", oferta_sede="Sede B")]
        lotes, informe = self.construir(filas)
        self.assertEqual(len(lotes["12_acreditaciones"]), 1)
        self.assertEqual(informe["acreditaciones"], 1)

    def test_cli_escribe_archivos_y_no_cambia_el_csv(self):
        with tempfile.TemporaryDirectory() as tmp:
            carga = Path(tmp) / "carga.csv"
            with carga.open("w", encoding="utf-8", newline="") as f:
                w = csv.DictWriter(f, fieldnames=COLUMNAS)
                w.writeheader()
                w.writerow(fila())
            antes = carga.read_bytes()
            salida = Path(tmp) / "lotes"
            codigo = generar.main(["x", str(carga), str(salida)])
            self.assertEqual(codigo, 0)
            self.assertEqual(carga.read_bytes(), antes)
            informe = json.loads((salida / "informe.json").read_text(encoding="utf-8"))
            self.assertEqual(informe["filas_leidas"], 1)
            self.assertTrue((salida / "06_aranceles.sql").exists())


if __name__ == "__main__":
    unittest.main()
