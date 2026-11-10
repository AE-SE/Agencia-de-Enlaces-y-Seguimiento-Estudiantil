"""Pruebas de datos/pronosticos/nombres_celdas.py con un archivo de ejemplo en latin-1."""
import importlib.util
from pathlib import Path

import pytest

RAIZ = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("nombres_celdas", RAIZ / "datos/pronosticos/nombres_celdas.py")
nc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(nc)

CABECERA = [
    "AÑO", "NIVEL GLOBAL", "CÓDIGO DE INSTITUCIÓN", "NOMBRE INSTITUCIÓN", "NOMBRE SEDE",
    "NOMBRE CARRERA", "CÓDIGO CARRERA", "REGIÓN", "COMUNA", "JORNADA", "CLASIFICACIÓN INSTITUCIÓN NIVEL 1",
]


def escribir(tmp_path: Path, filas: list[list[str]]) -> Path:
    ruta = tmp_path / "matricula.csv"
    texto = ";".join(CABECERA) + "\n" + "\n".join(";".join(f) for f in filas) + "\n"
    ruta.write_bytes(texto.encode("latin-1"))
    return ruta


def fila(anio, nivel, codigo, sede="SEDE ÑUÑOA", nombre="PSICOLOGÍA", inst="430", clasif="Universidades"):
    return [f"MAT_{anio}", nivel, inst, "UNIVERSIDAD DE PRUEBA", sede, nombre, codigo,
            "Metropolitana", "ÑUÑOA", "Diurna", clasif]


def test_toma_el_anio_mas_reciente(tmp_path):
    ruta = escribir(tmp_path, [
        fila(2024, "Pregrado", "I430S22C280J1V1", nombre="NOMBRE VIEJO"),
        fila(2025, "Pregrado", "I430S22C280J1V1", nombre="NOMBRE NUEVO"),
    ])
    filas = nc.leer_nombres(ruta)
    assert len(filas) == 1
    assert filas[0]["carrera_nombre"] == "NOMBRE NUEVO"
    assert filas[0]["anio_referencia"] == 2025


def test_conserva_tildes_y_enie_desde_latin1(tmp_path):
    ruta = escribir(tmp_path, [fila(2026, "Pregrado", "I430S22C280J1V1")])
    f = nc.leer_nombres(ruta)[0]
    assert f["sede"] == "SEDE ÑUÑOA"
    assert f["carrera_nombre"] == "PSICOLOGÍA"
    assert f["comuna"] == "ÑUÑOA"


def test_excluye_lo_que_no_es_pregrado(tmp_path):
    ruta = escribir(tmp_path, [
        fila(2026, "Postgrado", "I430S22C280J1V1"),
        fila(2026, "Pregrado", "I430S22C281J1V1"),
    ])
    filas = nc.leer_nombres(ruta)
    assert [f["codigo_sies"] for f in filas] == ["I430S22C281J1V1"]


def test_salta_filas_sin_codigo(tmp_path):
    ruta = escribir(tmp_path, [fila(2026, "Pregrado", "")])
    assert nc.leer_nombres(ruta) == []


def test_falta_una_columna_es_error_claro(tmp_path):
    ruta = tmp_path / "malo.csv"
    ruta.write_bytes("AÑO;OTRA\n2026;x\n".encode("latin-1"))
    with pytest.raises(SystemExit):
        nc.leer_nombres(ruta)


def test_tipo_de_institucion_usa_el_mismo_codigo_que_la_oferta():
    assert nc.tipo_institucion("Universidades") == "universidad"
    assert nc.tipo_institucion("Institutos Profesionales") == "instituto_profesional"
    assert nc.tipo_institucion("Centros de Formaci�n T�cnica") == "centro_formacion_tecnica"
    assert nc.tipo_institucion("otra cosa") == ""


def test_guarda_el_tipo_de_institucion(tmp_path):
    ruta = escribir(tmp_path, [fila(2026, "Pregrado", "I430S22C280J1V1", clasif="Institutos Profesionales")])
    assert nc.leer_nombres(ruta)[0]["institucion_tipo"] == "instituto_profesional"
