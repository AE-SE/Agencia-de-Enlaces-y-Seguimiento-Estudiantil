"""Pruebas de la tabla agregada de PAES (datos/calibracion/agregar_paes.py)."""

import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos" / "calibracion"))

from agregar_paes import UMBRAL, codigo_comuna, construir_tabla  # noqa: E402


def test_codigo_comuna_recupera_el_cero_inicial():
    assert codigo_comuna("6301") == "06301"
    assert codigo_comuna("13101") == "13101"


def test_suprime_comunas_bajo_el_umbral():
    conteo = Counter({"06301": 264, "06114": UMBRAL - 1})
    nombres = {"06301": ("R6", "SAN FERNANDO"), "06114": ("R6", "QUINTA DE TILCOCO")}
    tabla = {f["codigo_comuna"]: f for f in construir_tabla(conteo, nombres)}
    assert tabla["06301"]["rendidores"] == "264"
    assert tabla["06301"]["estado"] == "publicable"
    assert tabla["06114"]["rendidores"] == ""
    assert tabla["06114"]["estado"] == "suprimido"


def test_umbral_exacto_se_publica():
    conteo = Counter({"06301": UMBRAL})
    tabla = construir_tabla(conteo, {"06301": ("R6", "SAN FERNANDO")})
    assert tabla[0]["estado"] == "publicable"


def test_comuna_fuera_de_anexo_queda_marcada():
    tabla = construir_tabla(Counter({"99999": 50}), {})
    assert tabla[0]["comuna"] == "NO EN ANEXO"
