import sys
import unittest
from datetime import date
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from verificar_oferta_sies import COLUMNAS, extraer_muestra

FECHA = date(2026, 11, 20)
ENCABEZADO = [*COLUMNAS.values(), "Nivel Global"]


def variante(codigo, primero, segundo, monto=Decimal("100.5"), nivel="Pregrado"):
    return [codigo, "Institución", "Carrera", "Sede", "Jornada",
            primero, segundo, "Monto en UF", monto, nivel]


class MuestraOfertaSies(unittest.TestCase):
    def test_muestra_repetible_conserva_semestres_y_unidad(self):
        elegibles = [variante(str(i), Decimal(0), Decimal(i)) for i in range(1, 11)]
        otras = [
            variante("sin dato", None, Decimal(5)),
            variante("sin oferta", Decimal(0), Decimal(0)),
            variante("sin arancel", Decimal(15), Decimal(0), monto=Decimal(0)),
            variante("posgrado", Decimal(10), Decimal(0), nivel="Posgrado"),
        ]
        filas = [ENCABEZADO, *elegibles, *otras]
        muestra = extraer_muestra(filas, FECHA)
        self.assertEqual(muestra, extraer_muestra(filas, FECHA))
        self.assertEqual({f["codigo_sies"] for f in muestra}, {str(i) for i in range(1, 11)})
        fila = muestra[0]
        self.assertEqual(fila["vacantes_semestre_uno"], 0)
        self.assertEqual(fila["vacantes_semestre_dos"], Decimal(fila["codigo_sies"]))
        self.assertEqual(fila["formato_arancel"], "Monto en UF")
        self.assertEqual(fila["arancel_anual"], Decimal("100.5"))
        self.assertEqual(fila["fecha_descarga"], "2026-11-20")
        self.assertEqual(filas[fila["fila_xlsx"] - 1][0], fila["codigo_sies"])

    def test_rechaza_codigos_duplicados_y_muestra_insuficiente(self):
        fila = variante("01", Decimal(10), Decimal(0))
        with self.assertRaisesRegex(ValueError, "repetido"):
            extraer_muestra([ENCABEZADO, fila, fila], FECHA)
        with self.assertRaisesRegex(ValueError, "menos de diez"):
            extraer_muestra([ENCABEZADO, fila], FECHA)
