"""Pruebas de datos/generar_lotes_demre.py con filas inventadas (no son datos reales)."""

import importlib.util
import sys
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos"))
spec = importlib.util.spec_from_file_location("generar_lotes_demre", RAIZ / "datos" / "generar_lotes_demre.py")
demre = importlib.util.module_from_spec(spec)
sys.modules["generar_lotes_demre"] = demre
spec.loader.exec_module(demre)
base = demre.base


def fila(**cambios):
    f = {
        "demre_codigo": "9001", "demre_carrera": "Carrera Ficticia", "demre_notas": "", "demre_lugar": "Sede A",
        "demre_nem": "10", "demre_ranking": "20", "demre_lectora": "20", "demre_matematica_1": "20",
        "demre_matematica_2": "10", "demre_historia_cs_sociales": "10", "demre_ciencias": "10",
        "demre_historia_o_ciencias": "no", "demre_prueba_especial": "", "demre_asignacion_especial_pedagogia": "",
        "demre_puntaje_ponderado_minimo": "", "demre_puntaje_promedio_minimo": "",
        "demre_vacantes_regular": "50", "demre_vacantes_regular_2do_semestre": "", "demre_vacantes_mc": "",
        "demre_vacantes_bea": "", "demre_vacantes_pace": "", "demre_pagina_pdf": "12",
        "demre_fuente": "DEMRE", "demre_url_archivo": "https://ejemplo.invalid/demre.pdf",
        "demre_fecha_descarga": "2026-11-05", "demre_periodo": "Admisión 2027, oferta definitiva (2026-09-24)",
    }
    f.update(cambios)
    return f


class LotesDemreTest(unittest.TestCase):
    def test_cada_carrera_genera_cinco_vacantes_y_un_requisito(self):
        lotes, informe = demre.construir([fila()])
        self.assertEqual(len(lotes["09_vacantes_demre"]), 1 + 5)  # fuente + 5 vías
        self.assertEqual(len(lotes["10_requisitos_demre"]), 1)
        self.assertEqual(informe["vacantes_sin_dato"], 4)

    def test_cupos_no_publicados_quedan_nulos_con_motivo(self):
        lotes, _ = demre.construir([fila()])
        pace = [s for s in lotes["09_vacantes_demre"] if "'pace'" in s][0]
        self.assertIn("'pace', NULL", pace)
        self.assertIn("DEMRE no publica cupos", pace)

    def test_ponderaciones_que_no_suman_100_se_detienen(self):
        with self.assertRaises(base.ErrorDeLote):
            demre.construir([fila(demre_nem="11")])

    def test_historia_o_ciencias_usa_el_maximo(self):
        # Con historia_o_ciencias = si, la suma usa el máximo de historia y ciencias.
        r = fila(demre_historia_o_ciencias="si", demre_historia_cs_sociales="30", demre_ciencias="20",
                 demre_nem="10", demre_ranking="20", demre_lectora="20", demre_matematica_1="20",
                 demre_matematica_2="0", demre_prueba_especial="0", demre_asignacion_especial_pedagogia="0")
        self.assertEqual(demre._suma_ponderaciones(r), 100)

    def test_sin_filas_demre_se_detiene(self):
        with self.assertRaises(base.ErrorDeLote):
            demre.construir([fila(demre_codigo="")])

    def test_cupos_negativos_se_detienen(self):
        with self.assertRaises(base.ErrorDeLote):
            demre.construir([fila(demre_vacantes_regular="-1")])


if __name__ == "__main__":
    unittest.main()
