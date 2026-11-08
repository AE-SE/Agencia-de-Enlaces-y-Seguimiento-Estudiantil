"""Pruebas de los métodos de pronóstico por carrera y sede (datos/pronosticos)."""

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos" / "pronosticos"))

import cobertura_entrada_sede as cobertura  # noqa: E402
import mejora_sede as primera  # noqa: E402
import mejora_sede_2 as mejora  # noqa: E402


def test_cuantil_interpola_entre_valores():
    assert mejora.cuantil([0.0, 10.0], 0.5) == 5.0
    assert cobertura.cuantil([1.0, 2.0, 3.0, 4.0, 5.0], 0.5) == 3.0


def test_ultimo_anio_usa_solo_el_anio_previo():
    ent = {2023: {"k": 999}, 2024: {"k": 999}, 2025: {"k": 10}, 2026: {"k": 0}}
    total = {2023: 1000, 2024: 1000, 2025: 100, 2026: 100}
    # participación de 2025 = 10 / 100 = 0,1
    assert mejora.prediccion("ultimo", ent, total, "k", 2026) == 0.1


def test_ultimo_anio_sin_casos_previos_no_predice():
    ent = {2023: {"k": 5}, 2024: {"k": 5}, 2025: {}, 2026: {}}
    total = {2023: 100, 2024: 100, 2025: 100, 2026: 100}
    assert mejora.prediccion("ultimo", ent, total, "k", 2026) is None


def test_contraccion_mezcla_ultimo_anio_con_promedio_de_los_otros():
    ent = {2023: {"k": 20}, 2024: {"k": 10}, 2025: {"k": 30}, 2026: {}}
    total = {2023: 100, 2024: 100, 2025: 100, 2026: 100}
    # s1 = 0,30; promedio de s2 (0,10) y s3 (0,20) = 0,15
    esperado = 0.6 * 0.30 + 0.4 * 0.15
    assert math.isclose(mejora.prediccion("contraccion", ent, total, "k", 2026), esperado)


def test_total_honesto_no_usa_el_total_del_anio_predicho():
    total = {2024: 100, 2025: 110, 2026: 999999}
    # crecimiento 2025 / 2024 = 1,1 aplicado a 2025 → 121; el dato de 2026 no entra
    assert math.isclose(primera.total_honesto(total, 2026), 121.0)


def test_intervalo_de_error_cubre_con_error_cero():
    filas = [
        {"anio": y, "real": 100, "previsto": 100.0, "error": 0.0, "vol": 0.1}
        for y in (2023, 2024, 2025, 2026)
    ]
    res = mejora.cobertura_y_ancho(filas, "fijo")
    assert all(r["cubierto"] for r in res)
    assert all(r["ancho"] >= 1.0 for r in res)
