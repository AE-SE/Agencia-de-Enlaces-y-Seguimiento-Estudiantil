"""Pruebas de la plantilla de descripciones por grupo (ADR 0035)."""

import pathlib
import sys
import unittest

RAIZ = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos"))

from generar_plantilla_descripciones import COLUMNAS, combinar  # noqa: E402


class PlantillaDescripciones(unittest.TestCase):
    def test_grupo_nuevo_queda_pendiente_y_sin_texto(self):
        grupos = {"Psicología": {"programas": 168}}
        filas, nuevos, ausentes = combinar({}, grupos)
        self.assertEqual(nuevos, ["Psicología"])
        self.assertEqual(filas[0]["estado"], "pendiente")
        self.assertEqual(filas[0]["que_estudia"], "")
        self.assertEqual(ausentes, [])

    def test_conserva_textos_ya_escritos_y_actualiza_el_conteo(self):
        existente = {c: "" for c in COLUMNAS}
        existente.update({"grupo": "Derecho", "programas": "1", "que_estudia": "texto revisado", "estado": "publicado"})
        filas, nuevos, ausentes = combinar({"Derecho": existente}, {"Derecho": {"programas": 160}})
        self.assertEqual(nuevos, [])
        self.assertEqual(filas[0]["que_estudia"], "texto revisado")
        self.assertEqual(filas[0]["estado"], "publicado")
        self.assertEqual(filas[0]["programas"], "160")

    def test_avisa_de_grupos_que_ya_no_estan_en_la_oferta_sin_borrarlos(self):
        existente = {c: "" for c in COLUMNAS}
        existente.update({"grupo": "Grupo viejo", "estado": "pendiente"})
        filas, nuevos, ausentes = combinar({"Grupo viejo": existente}, {})
        self.assertEqual([f["grupo"] for f in filas], ["Grupo viejo"])
        self.assertEqual(ausentes, ["Grupo viejo"])


if __name__ == "__main__":
    unittest.main()
