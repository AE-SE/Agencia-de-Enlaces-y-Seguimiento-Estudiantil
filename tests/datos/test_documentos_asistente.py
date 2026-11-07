import json
import unittest
from datetime import date
from pathlib import Path


RUTA = Path(__file__).parents[2] / "datos" / "asistente" / "documentos.json"
TEMAS = {"admisión", "beneficios", "carreras", "plazos"}
CAMPOS_DOCUMENTO = {
    "titulo",
    "organismo",
    "url",
    "publicadoEl",
    "consultadoEl",
    "tema",
    "venceEl",
    "fragmentos",
}
CAMPOS_FRAGMENTO = {"id", "texto", "fuente", "url", "actualizadoEl"}


class DocumentosAsistenteTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.documentos = json.loads(RUTA.read_text(encoding="utf-8"))

    def test_cubre_los_temas_y_respeta_el_formato(self):
        self.assertEqual({documento["tema"] for documento in self.documentos}, TEMAS)

        for documento in self.documentos:
            self.assertEqual(set(documento), CAMPOS_DOCUMENTO)
            self.assertTrue(documento["titulo"])
            self.assertTrue(documento["organismo"])
            self.assertTrue(documento["url"].startswith("https://"))
            date.fromisoformat(documento["publicadoEl"])
            date.fromisoformat(documento["consultadoEl"])
            if documento["venceEl"] is not None:
                date.fromisoformat(documento["venceEl"])
            self.assertTrue(documento["fragmentos"])

    def test_fragmentos_cumplen_el_contrato_y_no_repiten_id(self):
        identificadores = []

        for documento in self.documentos:
            for fragmento in documento["fragmentos"]:
                self.assertEqual(set(fragmento), CAMPOS_FRAGMENTO)
                self.assertTrue(fragmento["texto"].strip())
                self.assertEqual(fragmento["url"], documento["url"])
                self.assertGreaterEqual(
                    date.fromisoformat(fragmento["actualizadoEl"]),
                    date.fromisoformat(documento["publicadoEl"]),
                )
                identificadores.append(fragmento["id"])

        self.assertEqual(len(identificadores), len(set(identificadores)))


if __name__ == "__main__":
    unittest.main()
