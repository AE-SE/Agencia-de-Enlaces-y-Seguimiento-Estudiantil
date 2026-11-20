import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from comparar_empleabilidad import comparar


def fila(codigo, tasa, carrera="Enfermería", periodo="2021–2023", area="Salud"):
    return {
        "sies_institucion_codigo": codigo,
        "carrera_generica": carrera,
        "area": area,
        "empleabilidad_1er_anio_pct": tasa,
        "periodo_empleabilidad_1er_anio": periodo,
        "url_archivo": "https://ejemplo.invalid/sies.xlsx",
        "fecha_descarga": "2026-11-03",
    }


class Comparaciones(unittest.TestCase):
    def test_carrera_area_periodo_y_sin_dato(self):
        filas = [
            fila("1", "0"),
            fila("2", "60"),
            fila("3", "90"),
            fila("4", "s/i"),
            fila("1", "70", carrera="Medicina"),
            fila("2", "100", periodo="2020–2022"),
            fila("9", "", carrera="Sin área", area=""),
        ]
        resultado = comparar(filas)
        self.assertEqual(resultado, comparar(filas[::-1]))
        self.assertEqual(resultado["fecha_descarga"], "2026-11-03")
        comparacion = resultado["por_carrera"]["enfermeria"]["2021–2023"]
        self.assertEqual(comparacion["instituciones_sin_tasa"], ["4"])
        self.assertEqual(comparacion["todas"], {
            "instituciones": 3, "minimo_pct": 0, "mediana_pct": 60, "maximo_pct": 90, "motivo": None,
        })
        self.assertEqual(comparacion["otras_por_institucion"]["1"]["mediana_pct"], 75)
        area = resultado["por_area"]["2021–2023"]["Salud"]
        self.assertEqual((area["instituciones"], area["filas_carrera_institucion"], area["promedio_pct"]), (3, 4, 55))
        self.assertIsNone(resultado["por_area"]["2020–2022"]["Salud"]["promedio_pct"])
        otra_cohorte = resultado["por_carrera"]["enfermeria"]["2020–2022"]
        self.assertEqual(otra_cohorte["todas"]["motivo"], "Sin datos suficientes")
        self.assertEqual(otra_cohorte["otras_por_institucion"]["2"]["instituciones"], 0)
        self.assertIn("TODO(fuente)", resultado["por_carrera"]["sin area"]["2021–2023"]["motivo_area"])

    def test_rechaza_dobles_y_porcentajes_invalidos(self):
        with self.assertRaises(ValueError):
            comparar([fila("1", "85"), fila("1", "85")])
        for tasa in ("101", "-1", "NaN"):
            with self.subTest(tasa=tasa), self.assertRaises(ValueError):
                comparar([fila("1", tasa)])
