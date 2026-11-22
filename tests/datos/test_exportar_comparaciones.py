"""Pruebas de datos/exportar_comparaciones.py con un origen inventado."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from exportar_comparaciones import CAMPOS_GENERALES, exportar  # noqa: E402

PERIODO = "titulados 2021 a 2023; años de ingreso 2022 a 2024"


def origen() -> dict:
    base = {campo: f"valor {campo}" for campo in CAMPOS_GENERALES}
    cifras = {"instituciones": 3, "minimo_pct": 50.0, "mediana_pct": 60.5, "maximo_pct": 70.0, "motivo": None}
    sin_datos = {"instituciones": 1, "minimo_pct": None, "mediana_pct": None, "maximo_pct": None, "motivo": "Sin datos suficientes"}
    return {
        **base,
        "por_carrera": {
            "enfermeria": {PERIODO: {
                "todas": cifras, "otras_por_institucion": {"86": {**cifras, "instituciones": 2}, "90": sin_datos},
                "instituciones_sin_tasa": ["5"], "instituciones_con_excepcion_derecho": [], "area_sies": "Salud", "motivo_area": None,
            }},
        },
        "por_area": {PERIODO: {"Salud": {"instituciones": 40, "filas_carrera_institucion": 90, "promedio_pct": 71.2, "motivo": None}}},
    }


class Exportar(unittest.TestCase):
    def test_conserva_los_campos_generales(self):
        salida = exportar(origen())
        for campo in CAMPOS_GENERALES:
            self.assertEqual(salida[campo], f"valor {campo}")

    def test_conserva_los_valores_de_una_carrera(self):
        c = exportar(origen())["por_carrera"]["enfermeria"][PERIODO]
        self.assertEqual(c["todas"], {"instituciones": 3, "minimo_pct": 50.0, "mediana_pct": 60.5, "maximo_pct": 70.0})
        self.assertEqual(c["otras_por_institucion"]["86"]["instituciones"], 2)
        self.assertEqual(c["otras_por_institucion"]["86"]["mediana_pct"], 60.5)

    def test_omite_nulos_pero_conserva_el_motivo(self):
        c = exportar(origen())["por_carrera"]["enfermeria"][PERIODO]
        self.assertEqual(c["otras_por_institucion"]["90"], {"instituciones": 1, "motivo": "Sin datos suficientes"})
        self.assertNotIn("instituciones_sin_tasa", c)
        self.assertNotIn("area_sies", c)

    def test_conserva_el_area(self):
        self.assertEqual(exportar(origen())["por_area"][PERIODO]["Salud"], {"instituciones": 40, "filas_carrera_institucion": 90, "promedio_pct": 71.2})

    def test_origen_incompleto_detiene_la_exportacion(self):
        with self.assertRaises(SystemExit):
            exportar({"fuente": "x"})


if __name__ == "__main__":
    unittest.main()
