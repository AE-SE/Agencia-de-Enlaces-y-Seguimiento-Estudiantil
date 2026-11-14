"""Tabla de agrupación de carreras para las descripciones en lenguaje claro (ADR 0035).

Elaboración propia, sin reglas de nombre propias: el grupo de cada carrera es su
«carrera genérica», campo oficial que ya trae la matrícula de Datos Abiertos
Mineduc (area_carrera_generica en datos/cargar_oferta.py). Así no inventamos
agrupaciones: la tabla solo ordena lo que publica el organismo.

Entrada: datos/procesados/oferta.csv (una fila por programa: carrera,
institución, sede y jornada).

Salidas:
- datos/procesados/grupos_carrera.csv: una fila por grupo.
- datos/procesados/mapeo_nombre_grupo.csv: una fila por par nombre oficial +
  grupo. Un nombre oficial puede estar en más de un grupo (por ejemplo,
  «TRABAJO SOCIAL» es técnico y profesional).

Uso:
    python3 datos/generar_grupos_carrera.py
"""

from __future__ import annotations

import csv
import collections
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "datos" / "procesados" / "oferta.csv"
SALIDA_GRUPOS = RAIZ / "datos" / "procesados" / "grupos_carrera.csv"
SALIDA_MAPEO = RAIZ / "datos" / "procesados" / "mapeo_nombre_grupo.csv"

FUENTE = "Datos Abiertos Mineduc, matrícula de educación superior 2026 (área_carrera_generica)"
URL_FUENTE = "https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar"


def construir(filas):
    """Devuelve (grupos, mapeo) a partir de las filas de la oferta.

    grupos: dict grupo -> {"nombres": set, "programas": int, "areas": set}
    mapeo: dict (nombre_oficial, grupo) -> programas
    """
    grupos: dict[str, dict] = {}
    mapeo: collections.Counter = collections.Counter()
    for f in filas:
        grupo = (f.get("carrera_generica") or "").strip()
        nombre = (f.get("carrera_nombre_oficial") or "").strip()
        if not grupo or not nombre:
            raise ValueError(f"fila sin grupo o sin nombre oficial: {f.get('codigo_sies')}")
        g = grupos.setdefault(grupo, {"nombres": set(), "programas": 0})
        g["nombres"].add(nombre)
        g["programas"] += 1
        mapeo[(nombre, grupo)] += 1
    return grupos, mapeo


def verificar(grupos, mapeo, filas_totales):
    """Invariantes: cada programa cuenta en un solo grupo y cada nombre oficial aparece."""
    total = sum(g["programas"] for g in grupos.values())
    if total != filas_totales:
        raise AssertionError(f"programas en grupos ({total}) != filas de oferta ({filas_totales})")
    nombres_mapeo = {n for (n, _) in mapeo}
    nombres_grupos = set().union(*(g["nombres"] for g in grupos.values()))
    if nombres_mapeo != nombres_grupos:
        raise AssertionError("el mapeo no cubre todos los nombres oficiales")


def main() -> int:
    with ENTRADA.open(encoding="utf-8", newline="") as fh:
        filas = list(csv.DictReader(fh))

    grupos, mapeo = construir(filas)
    verificar(grupos, mapeo, len(filas))

    with SALIDA_GRUPOS.open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["grupo", "nombres_oficiales", "programas", "fuente", "url_fuente"])
        for grupo in sorted(grupos):
            g = grupos[grupo]
            w.writerow([grupo, len(g["nombres"]), g["programas"], FUENTE, URL_FUENTE])

    with SALIDA_MAPEO.open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["carrera_nombre_oficial", "grupo", "programas", "fuente", "url_fuente"])
        for (nombre, grupo) in sorted(mapeo):
            w.writerow([nombre, grupo, mapeo[(nombre, grupo)], FUENTE, URL_FUENTE])

    nombres = {n for (n, _) in mapeo}
    dobles = sum(1 for n in nombres if sum(1 for (m, _) in mapeo if m == n) > 1)
    print(f"programas: {len(filas)}")
    print(f"nombres oficiales distintos: {len(nombres)}")
    print(f"grupos: {len(grupos)}")
    print(f"nombres oficiales en más de un grupo: {dobles}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
