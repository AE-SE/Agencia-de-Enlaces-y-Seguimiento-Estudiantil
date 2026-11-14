"""Pruebas de la tabla de agrupación de carreras (ADR 0035)."""

import pathlib
import sys

import pytest

RAIZ = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos"))

from generar_grupos_carrera import construir, verificar  # noqa: E402


def fila(nombre, generica):
    return {"carrera_nombre_oficial": nombre, "carrera_generica": generica}


def test_cuenta_programas_por_grupo():
    filas = [
        fila("TRABAJO SOCIAL", "Trabajo Social"),
        fila("TRABAJO SOCIAL", "Trabajo Social"),
        fila("TRABAJO SOCIAL", "Técnico en Servicio Social"),
    ]
    grupos, mapeo = construir(filas)
    assert grupos["Trabajo Social"]["programas"] == 2
    assert grupos["Técnico en Servicio Social"]["programas"] == 1
    verificar(grupos, mapeo, len(filas))


def test_un_nombre_puede_estar_en_dos_grupos():
    filas = [
        fila("TRABAJO SOCIAL", "Trabajo Social"),
        fila("TRABAJO SOCIAL", "Técnico en Servicio Social"),
    ]
    grupos, mapeo = construir(filas)
    assert len({g for (n, g) in mapeo if n == "TRABAJO SOCIAL"}) == 2


def test_rechaza_fila_sin_grupo():
    with pytest.raises(ValueError):
        construir([fila("PSICOLOGIA", "")])


def test_verificar_detecta_conteo_distinto():
    filas = [fila("PSICOLOGIA", "Psicología")]
    grupos, mapeo = construir(filas)
    with pytest.raises(AssertionError):
        verificar(grupos, mapeo, 2)
