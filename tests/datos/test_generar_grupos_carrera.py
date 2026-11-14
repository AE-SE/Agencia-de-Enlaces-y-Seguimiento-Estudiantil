"""Pruebas de la tabla de agrupación de carreras (ADR 0035)."""

import pathlib
import sys
import unittest

RAIZ = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos"))

from generar_grupos_carrera import construir, verificar  # noqa: E402


def fila(nombre, generica):
    return {"carrera_nombre_oficial": nombre, "carrera_generica": generica}


class GruposCarrera(unittest.TestCase):
    def test_cuenta_programas_por_grupo(self):
        filas = [
            fila("TRABAJO SOCIAL", "Trabajo Social"),
            fila("TRABAJO SOCIAL", "Trabajo Social"),
            fila("TRABAJO SOCIAL", "Técnico en Servicio Social"),
        ]
        grupos, mapeo = construir(filas)
        self.assertEqual(grupos["Trabajo Social"]["programas"], 2)
        self.assertEqual(grupos["Técnico en Servicio Social"]["programas"], 1)
        verificar(grupos, mapeo, len(filas))

    def test_un_nombre_puede_estar_en_dos_grupos(self):
        filas = [
            fila("TRABAJO SOCIAL", "Trabajo Social"),
            fila("TRABAJO SOCIAL", "Técnico en Servicio Social"),
        ]
        grupos, mapeo = construir(filas)
        self.assertEqual(len({g for (n, g) in mapeo if n == "TRABAJO SOCIAL"}), 2)

    def test_rechaza_fila_sin_grupo(self):
        with self.assertRaises(ValueError):
            construir([fila("PSICOLOGIA", "")])

    def test_verificar_detecta_conteo_distinto(self):
        filas = [fila("PSICOLOGIA", "Psicología")]
        grupos, mapeo = construir(filas)
        with self.assertRaises(AssertionError):
            verificar(grupos, mapeo, 2)


if __name__ == "__main__":
    unittest.main()
