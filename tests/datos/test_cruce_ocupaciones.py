"""Pruebas de la asignación de ocupaciones a áreas (datos/cruce_ocupaciones_areas.py).

Las excepciones por subgrupo SOC se buscan por prefijo; por eso un código
concreto (27-2031.00) debe caer en la excepción más específica (27-203) y no
en la general (27-2).
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from cruce_ocupaciones_areas import area_de_ocupacion  # noqa: E402

ARTE = "Arte y Arquitectura"
SIN_AREA = "Sin área definida"


class PruebasArtistas(unittest.TestCase):
    def test_bailarines_y_coreografos_son_arte(self):
        self.assertEqual(area_de_ocupacion("27-2031.00")[0], ARTE)
        self.assertEqual(area_de_ocupacion("27-2032.00")[0], ARTE)

    def test_musicos_y_directores_musicales_son_arte(self):
        self.assertEqual(area_de_ocupacion("27-2041.00")[0], ARTE)
        self.assertEqual(area_de_ocupacion("27-2042.00")[0], ARTE)

    def test_el_resto_del_subgrupo_27_2_sigue_sin_area(self):
        # Productores, atletas, entrenadores y pinchadiscos no son arte.
        self.assertEqual(area_de_ocupacion("27-2012.00")[0], SIN_AREA)
        self.assertEqual(area_de_ocupacion("27-2021.00")[0], SIN_AREA)
        self.assertEqual(area_de_ocupacion("27-2091.00")[0], SIN_AREA)

    def test_actores_siguen_por_codigo_exacto(self):
        self.assertEqual(area_de_ocupacion("27-2011.00")[0], ARTE)


if __name__ == "__main__":
    unittest.main()
