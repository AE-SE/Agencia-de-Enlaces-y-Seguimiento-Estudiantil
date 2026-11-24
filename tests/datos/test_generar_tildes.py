"""Pruebas de datos/generar_tildes.py con textos inventados."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from generar_tildes import construir, fuente  # noqa: E402


class Construir(unittest.TestCase):
    def test_asocia_la_palabra_sin_tilde_con_la_que_trae_tilde(self):
        palabras, _ = construir(["ENFERMERÍA (CONCEPCIÓN)", "Técnico en Ingeniería"])
        self.assertEqual(palabras["enfermeria"], "enfermería")
        self.assertEqual(palabras["concepcion"], "concepción")
        self.assertEqual(palabras["tecnico"], "técnico")

    def test_la_enie_cuenta_como_tilde(self):
        palabras, _ = construir(["ENSEÑANZA MEDIA"])
        self.assertEqual(palabras, {"ensenanza": "enseñanza"})

    def test_palabra_ambigua_se_descarta(self):
        palabras, descartadas = construir(["PEDAGOGÍA EN INGLÉS", "TRADUCCIÓN INGLES-ESPAÑOL"])
        self.assertNotIn("ingles", palabras)
        self.assertEqual(descartadas, ["ingles"])
        self.assertEqual(palabras["traduccion"], "traducción")

    def test_dos_formas_con_tilde_se_descartan(self):
        palabras, descartadas = construir(["PÚBLICO", "PUBLICÓ"])
        self.assertEqual(palabras, {})
        self.assertEqual(descartadas, ["publico"])

    def test_palabra_que_solo_aparece_sin_tilde_no_se_inventa(self):
        palabras, _ = construir(["ADMINISTRACION DE EMPRESAS"])
        self.assertEqual(palabras, {})

    def test_sale_ordenado(self):
        palabras, _ = construir(["MÚSICA", "ÁREA"])
        self.assertEqual(list(palabras), ["area", "musica"])


class FuenteUnica(unittest.TestCase):
    def test_falla_si_hay_dos_archivos(self):
        filas = [{"url_archivo": "a", "fecha_descarga": "1"}, {"url_archivo": "b", "fecha_descarga": "1"}]
        with self.assertRaises(SystemExit):
            fuente("X", filas)


if __name__ == "__main__":
    unittest.main()


class SoloPalabrasUsadas(unittest.TestCase):
    def test_solo_entran_las_palabras_de_los_nombres_que_se_muestran(self):
        palabras, _ = construir(["Enfermería", "Tecnnología"], usadas={"enfermeria"})
        self.assertEqual(palabras, {"enfermeria": "enfermería"})
