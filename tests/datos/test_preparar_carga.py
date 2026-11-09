"""Pruebas de datos/preparar_carga.py."""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "datos"))
import preparar_carga as c  # noqa: E402


OFERTA = [
    {"codigo_sies": "I2", "carrera_nombre_oficial": "Dos", "fuente": "Mineduc"},
    {"codigo_sies": "I1", "carrera_nombre_oficial": "Uno", "fuente": "Mineduc"},
]
SIES = [
    {"sies_institucion_codigo": "10", "carrera_generica": "Ingeniería", "empleabilidad_1er_anio_pct": "80"},
    {"sies_institucion_codigo": "10", "carrera_generica": "Derecho", "empleabilidad_1er_anio_pct": "70"},
]
DEMRE = [{
    "demre_codigo": "13073", "vacantes_regular": "53", "periodo": "Admisión 2027",
    "prueba_especial": "", "requisito_prueba_especial": "APROBADA",
    "fuente_historia_o_ciencias": "Admisión UACh",
}]
CRUCE_SIES = [{"codigo_sies": "I1", "sies_institucion_codigo": "10", "sies_carrera_generica": "Ingeniería"}]
CRUCE_DEMRE = [{"codigo_sies": "I2", "demre_codigo": "13073"}]


class PrepararCarga(unittest.TestCase):
    def test_une_cada_fuente_por_su_cruce_y_conserva_los_prefijos(self):
        filas, campos, reporte = c.preparar(
            OFERTA, list(OFERTA[0]), SIES, list(SIES[0]), DEMRE, list(DEMRE[0]), CRUCE_SIES, CRUCE_DEMRE
        )
        self.assertEqual([fila["oferta_codigo_sies"] for fila in filas], ["I1", "I2"])
        self.assertIn("sies_empleabilidad_1er_anio_pct", campos)
        self.assertIn("demre_vacantes_regular", campos)
        self.assertEqual(filas[0]["sies_empleabilidad_1er_anio_pct"], "80")
        self.assertEqual(filas[0]["demre_vacantes_regular"], "")
        self.assertEqual(filas[1]["sies_empleabilidad_1er_anio_pct"], "")
        self.assertEqual(filas[1]["demre_vacantes_regular"], "53")
        self.assertEqual(filas[1]["demre_prueba_especial"], "")
        self.assertEqual(filas[1]["demre_requisito_prueba_especial"], "APROBADA")
        self.assertEqual(filas[1]["demre_fuente_historia_o_ciencias"], "Admisión UACh")
        self.assertEqual(reporte["resumen"], {"con indicadores SIES": 1, "sin cruce DEMRE": 1, "sin cruce SIES": 1, "con datos DEMRE": 1})

    def test_no_acepta_codigos_repetidos_en_la_oferta(self):
        with self.assertRaisesRegex(ValueError, "oferta repite"):
            c.preparar(OFERTA + [OFERTA[0]], list(OFERTA[0]), SIES, list(SIES[0]), DEMRE, list(DEMRE[0]), CRUCE_SIES, CRUCE_DEMRE)

    def test_informa_un_cruce_cuyo_origen_no_existe(self):
        filas, _, reporte = c.preparar(
            OFERTA[:1], list(OFERTA[0]), SIES, list(SIES[0]), DEMRE, list(DEMRE[0]),
            [{"codigo_sies": "I2", "sies_institucion_codigo": "999", "sies_carrera_generica": "Ingeniería"}], []
        )
        self.assertEqual(filas[0]["sies_empleabilidad_1er_anio_pct"], "")
        self.assertEqual(reporte["resumen"], {"cruces SIES sin fila de origen": 1, "sin cruce DEMRE": 1})

    def test_no_repite_el_prefijo_cuando_el_campo_ya_lo_trae(self):
        # Estos nombres serán el contrato del cargador a la base: `demre_demre_codigo` no debe existir
        sies = [{"sies_institucion_codigo": "10", "carrera_generica": "Derecho"}]
        _, campos, _ = c.preparar(OFERTA, list(OFERTA[0]), sies, list(sies[0]), DEMRE, list(DEMRE[0]), [], [])
        self.assertIn("sies_institucion_codigo", campos)
        self.assertIn("sies_carrera_generica", campos)
        self.assertIn("demre_codigo", campos)
        self.assertIn("oferta_codigo_sies", campos)
        self.assertNotIn("sies_sies_institucion_codigo", campos)
        self.assertNotIn("demre_demre_codigo", campos)

    def test_dos_campos_que_chocan_tras_el_prefijo_dan_error_en_vez_de_pisarse(self):
        # `codigo_sies` y `oferta_codigo_sies` quedarían con el mismo nombre
        oferta = [{"codigo_sies": "I1", "oferta_codigo_sies": "I1"}]
        with self.assertRaisesRegex(ValueError, "columnas repetidas"):
            c.preparar(oferta, list(oferta[0]), SIES, list(SIES[0]), DEMRE, list(DEMRE[0]), [], [])


if __name__ == "__main__":
    unittest.main()
