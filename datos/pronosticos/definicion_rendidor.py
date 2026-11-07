"""Definición consistente de rendidor regular de la PAES, 2020-2026.

Problema: a partir de 2023 el archivo de rendición combina la PAES Regular y
la de Invierno. Contar filas incluye a personas sin puntaje regular (por
ejemplo, quienes solo rindieron Invierno), y eso produce un salto artificial
entre 2022 y 2023.

Definición (confirmada por DEMRE el 2026-11-07): rendidor regular = la fila tiene al menos un puntaje regular
distinto de vacío y de cero en las columnas *_ACTUAL de la prueba regular.
La definición se aplica igual a todos los años.

Uso:
    python definicion_rendidor.py <carpeta_con_ArchivoC> <salida_series.csv>
"""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path

PREFIJOS_REGULARES = ("CLEC", "MATE", "HCSO", "HCSOC", "CIEN", "MODULO", "PROMEDIO", "PERCENTIL")


def columnas_regulares(encabezado: list[str]) -> list[str]:
    cols = []
    for c in encabezado:
        if not c.endswith("_ACTUAL") or "_INV_" in c or "ANTERIOR" in c:
            continue
        if c.split("_")[0] in PREFIJOS_REGULARES:
            cols.append(c)
    return cols


def contar_con_puntaje(archivo: Path) -> tuple[Counter, int]:
    """Cuenta por comuna las filas con puntaje regular. Devuelve (conteo, total de filas)."""
    conteo: Counter = Counter()
    total = 0
    with archivo.open(encoding="utf-8", errors="replace", newline="") as f:
        rd = csv.DictReader(f, delimiter=";")
        cols = columnas_regulares(rd.fieldnames or [])
        for fila in rd:
            total += 1
            if any(fila[c].strip() not in ("", "0") for c in cols):
                conteo[fila["CODIGO_COMUNA"].strip().zfill(5)] += 1
    return conteo, total


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    carpeta, salida = Path(argv[1]), Path(argv[2])
    archivos: dict[int, Path] = {}
    for p in carpeta.rglob("ArchivoC*.csv"):
        marca = "".join(ch for ch in p.parent.parent.name if ch.isdigit())[:4]
        if not marca or "2027" in p.parent.parent.name:
            continue
        archivos.setdefault(int(marca), p)

    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["anio", "filas_archivo", "rendidores_regulares"])
        for anio, p in sorted(archivos.items()):
            conteo, total = contar_con_puntaje(p)
            w.writerow([anio, total, sum(conteo.values())])
            print(f"{anio}: filas {total} · rendidores regulares {sum(conteo.values())}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
