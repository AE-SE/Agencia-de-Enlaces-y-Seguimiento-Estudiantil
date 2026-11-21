import json
import unittest
from datetime import date
from pathlib import Path

RUTA = Path(__file__).resolve().parents[2] / "datos" / "calendario" / "plazos_2027.json"
URL_DEMRE = "https://demre.cl/calendario/calendario-proceso-2027"
URL_MINEDUC = "https://acceso.mineduc.cl/calendario-universidad/"


class CalendarioAdmision(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalogo = json.loads(RUTA.read_text(encoding="utf-8"))
        cls.plazos = {hito["codigo"]: hito for hito in cls.catalogo["plazos"]}

    def test_fechas_trazables_y_estados(self):
        self.assertEqual(self.catalogo["periodo"], "Admisión universitaria 2027")
        self.assertEqual((self.catalogo["fuente"], self.catalogo["url"]), ("DEMRE", URL_DEMRE))
        self.assertTrue(self.plazos)
        self.assertEqual(len(self.plazos), len(self.catalogo["plazos"]))
        anteriores = []
        for codigo, plazo in self.plazos.items():
            with self.subTest(plazo=codigo):
                fuente = ("Acceso Mineduc", URL_MINEDUC) if codigo == "retracto_matricula" else ("DEMRE", URL_DEMRE)
                self.assertEqual((plazo["fuente"], plazo["url"]), fuente)
                date.fromisoformat(plazo["fecha_consulta"])
                if plazo["estado"] == "fecha_pendiente":
                    self.assertIn(None, (plazo["inicio"], plazo["termino"]))
                    self.assertTrue(plazo["motivo_sin_fecha"])
                else:
                    self.assertEqual(plazo["estado"], "publicado")
                    inicio = date.fromisoformat(plazo["inicio"])
                    self.assertLessEqual(inicio, date.fromisoformat(plazo["termino"]))
                    self.assertIsNone(plazo["motivo_sin_fecha"])
                    anteriores.append(inicio)
        self.assertEqual(anteriores, sorted(anteriores))

    def test_hitos_clave_contrastados_con_las_fuentes(self):
        casos = {
            "inscripcion_paes_regular": ("2026-06-01", "2026-07-27"),
            "rendicion_paes_regular": ("2026-11-30", "2026-12-02"),
            "postulacion_centralizada": ("2027-01-04", "2027-01-07"),
            "matricula_primer_periodo": ("2027-01-19", "2027-01-21"),
            "matricula_segundo_periodo": ("2027-01-22", "2027-01-28"),
            "retracto_matricula": ("2027-01-19", "2027-01-28"),
        }
        for codigo, esperado in casos.items():
            with self.subTest(plazo=codigo):
                hito = self.plazos[codigo]
                self.assertEqual((hito["inicio"], hito["termino"]), esperado)
