"""Pruebas de datos/extraer_universidades_demre.py con el formato que entrega pypdf (tabuladores y espacios)."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from extraer_universidades_demre import universidades  # noqa: E402

# Copia de las primeras filas del índice (página 2) del PDF oficial, tal como las entrega pypdf.
INDICE = (
    "OFERTA DEFINITIVA DE CARRERAS PROCESO DE ADMISIÓN 2027\n2\nINDICE\nIntroducción\t\n"
    "\t 1\t PONTIFICIA \tUNIVERSIDAD\t CATÓLICA \tDE\t CHILE\t \t 16\t\n"
    "\t 2\t PONTIFICIA\t UNIVERSIDAD \tCATÓLICA\tDE\t VALPARAÍSO \t\t 49\t\n"
    "\t 3\t UNIVERSIDAD\t CATÓLICA \tDE\t LA\tSANTÍSIMA\t CONCEPCIÓN \t\t 204\t \t\n"
)


class Universidades(unittest.TestCase):
    def test_lee_nombre_con_tildes_sin_numero_ni_pagina(self):
        self.assertEqual(
            universidades(INDICE),
            [
                "PONTIFICIA UNIVERSIDAD CATÓLICA DE CHILE",
                "PONTIFICIA UNIVERSIDAD CATÓLICA DE VALPARAÍSO",
                "UNIVERSIDAD CATÓLICA DE LA SANTÍSIMA CONCEPCIÓN",
            ],
        )

    def test_ignora_lineas_que_no_son_del_indice(self):
        texto = INDICE + "PUNTAJES MÍNIMOS PARA POSTULAR A LA UNIVERSIDAD DE CONCEPCIÓN\n"
        self.assertEqual(len(universidades(texto)), 3)

    def test_falla_si_la_numeracion_salta(self):
        sin_la_dos = "\n".join(l for l in INDICE.splitlines() if "VALPARAÍSO" not in l)
        with self.assertRaises(SystemExit):
            universidades(sin_la_dos)

    def test_falla_si_no_hay_indice(self):
        with self.assertRaises(SystemExit):
            universidades("Introducción")


if __name__ == "__main__":
    unittest.main()
