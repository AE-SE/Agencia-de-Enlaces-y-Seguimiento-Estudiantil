import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from comparar_empleabilidad import comparar


def fila(codigo, tasa, carrera="Enfermería", periodo="2021–2023", area="Salud", excepcion_derecho="no"):
    return {
        "sies_institucion_codigo": codigo,
        "carrera_generica": carrera,
        "area": area,
        "empleabilidad_1er_anio_pct": tasa,
        "periodo_empleabilidad_1er_anio": periodo,
        "excepcion_derecho": excepcion_derecho,
        "url_archivo": "https://ejemplo.invalid/sies.xlsx",
        "fecha_descarga": "2026-11-03",
    }


class Comparaciones(unittest.TestCase):
    def test_tres_carreras_reales_del_buscador(self):
        # SIES, hoja «Carreras e IES (2025-2026)», aritmética sobre el porcentaje redondeado por el cargador.
        url = "https://mifuturo.cl/wp-content/uploads/2025/12/Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx"
        periodo = "titulados 2021 a 2023; años de ingreso 2022 a 2024"
        casos = [
            # Filas 703, 705 y 707.
            ("Enfermería", "enfermeria", "Salud", [("86", "85.53"), ("20", "74.06"), ("90", "82.54")],
             (74.06, 82.54, 85.53)),
            # Filas 1154, 1155 y 1163.
            ("Nutrición y Dietética", "nutricion y dietetica", "Salud",
             [("86", "58.24"), ("20", "42.58"), ("70", "64.08")], (42.58, 58.24, 64.08)),
            # Filas 1443, 1449 y 1451.
            ("Psicología", "psicologia", "Ciencias Sociales",
             [("86", "69.61"), ("20", "51.87"), ("90", "59.71")], (51.87, 59.71, 69.61)),
        ]
        for carrera, clave, area, tasas, esperados in casos:
            with self.subTest(carrera=carrera):
                filas = [
                    dict(fila(codigo, tasa, carrera, periodo, area), url_archivo=url)
                    for codigo, tasa in tasas
                ]
                resumen = comparar(filas)["por_carrera"][clave][periodo]["todas"]
                self.assertEqual(resumen["instituciones"], 3)
                self.assertEqual((resumen["minimo_pct"], resumen["mediana_pct"], resumen["maximo_pct"]), esperados)

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

    def test_excluye_derecho_de_la_carrera_y_de_su_area(self):
        periodo = "2020–2022"
        resultado = comparar([
            fila("1", "85", "Derecho", periodo, "Derecho", "si"),
            fila("2", "95", "Derecho", periodo, "Derecho", "si"),
            fila("1", "50", "Técnico Jurídico", periodo, "Derecho"),
            fila("2", "70", "Técnico Jurídico", periodo, "Derecho"),
        ])
        derecho = resultado["por_carrera"]["derecho"][periodo]
        self.assertEqual(derecho["todas"]["instituciones"], 0)
        self.assertIsNone(derecho["todas"]["mediana_pct"])
        self.assertIsNone(derecho["otras_por_institucion"]["1"]["mediana_pct"])
        self.assertEqual(derecho["instituciones_con_excepcion_derecho"], ["1", "2"])
        self.assertIn("2.º año", resultado["motivo_excepcion_derecho"])
        referencia = resultado["por_area"][periodo]["Derecho"]
        self.assertEqual((referencia["filas_carrera_institucion"], referencia["promedio_pct"]), (2, 60))

    def test_rechaza_dobles_y_porcentajes_invalidos(self):
        with self.assertRaises(ValueError):
            comparar([fila("1", "85"), fila("1", "85")])
        for tasa in ("101", "-1", "NaN"):
            with self.subTest(tasa=tasa), self.assertRaises(ValueError):
                comparar([fila("1", tasa)])
