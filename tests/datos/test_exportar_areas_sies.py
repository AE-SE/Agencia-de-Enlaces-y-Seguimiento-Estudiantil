"""Pruebas de datos/exportar_areas_sies.py con filas inventadas."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from exportar_areas_sies import areas_por_generica, fuente_unica  # noqa: E402


def fila(generica: str, area: str, url: str = "https://ejemplo.invalid/sies.xlsx", fecha: str = "2026-11-05") -> dict:
    return {"carrera_generica": generica, "area": area, "url_archivo": url, "fecha_descarga": fecha}


class AreasPorGenerica(unittest.TestCase):
    def test_normaliza_la_clave_como_la_base(self):
        self.assertEqual(areas_por_generica([fila("  Enfermería ", "Salud")]), {"enfermeria": "Salud"})

    def test_repetidas_con_la_misma_area_quedan_una_vez(self):
        filas = [fila("Enfermería", "Salud"), fila("ENFERMERIA", "Salud")]
        self.assertEqual(areas_por_generica(filas), {"enfermeria": "Salud"})

    def test_dos_areas_para_una_generica_detiene_la_exportacion(self):
        with self.assertRaises(SystemExit):
            areas_por_generica([fila("Enfermería", "Salud"), fila("Enfermería", "Educación")])

    def test_sin_area_no_se_inventa(self):
        self.assertEqual(areas_por_generica([fila("Otras Ingenierías", "")]), {})

    def test_espacios_del_area_se_limpian(self):
        self.assertEqual(areas_por_generica([fila("Derecho", " Derecho  ")]), {"derecho": "Derecho"})


class FuenteUnica(unittest.TestCase):
    def test_devuelve_url_y_fecha(self):
        self.assertEqual(
            fuente_unica([fila("A", "Salud"), fila("B", "Salud")]),
            {"fuente": "Mi Futuro", "url": "https://ejemplo.invalid/sies.xlsx", "fecha_consulta": "2026-11-05"},
        )

    def test_dos_archivos_detienen_la_exportacion(self):
        with self.assertRaises(SystemExit):
            fuente_unica([fila("A", "Salud"), fila("B", "Salud", fecha="2026-11-06")])


if __name__ == "__main__":
    unittest.main()
