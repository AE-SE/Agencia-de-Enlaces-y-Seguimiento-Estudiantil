"""Comparación de los pronósticos PAES Regular 2027 con las cifras publicadas por DEMRE.

Se ejecuta una vez publicados los resultados (4-ene-2027, 08:00 hrs, según DEMRE). No inventa
observaciones: solo compara lo que el archivo de entrada trae.

Entrada: CSV con columnas `unidad`, `variable`, `observado` (cifras publicadas, por comuna
o región). La comparación usa solo la generación indicada (por defecto la línea base DEF2).

Salida: resumen en pantalla y CSV con el detalle, en la ruta indicada.

Uso:
    python -I comparar_paes_2027.py <registro.csv> <observados.csv> <salida.csv> [generacion]
"""

from __future__ import annotations

import csv
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from registro import comparar, leer  # noqa: E402

GENERACION_POR_DEFECTO = "PAES-REGULAR-2027-DEF2"


def cargar_observados(ruta: Path) -> dict[tuple[str, str], float]:
    obs: dict[tuple[str, str], float] = {}
    with ruta.open(encoding="utf-8", newline="") as f:
        for fila in csv.DictReader(f):
            obs[(fila["unidad"].strip(), fila["variable"].strip())] = float(fila["observado"])
    return obs


def resumen(filas: list[dict]) -> str:
    if not filas:
        return "sin pronósticos con observación"
    ape = statistics.median(
        abs(f["previsto"] - f["observado"]) / f["observado"] for f in filas if f["observado"] > 0
    )
    cobertura = sum(f["dentro_intervalo"] for f in filas) / len(filas)
    return f"n={len(filas)} · error mediano {100*ape:.1f} % · cobertura {100*cobertura:.1f} %"


def main(argv: list[str]) -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) not in (4, 5):
        print(__doc__)
        return 2
    registro_ruta, observados_ruta, salida = Path(argv[1]), Path(argv[2]), Path(argv[3])
    generacion = argv[4] if len(argv) == 5 else GENERACION_POR_DEFECTO

    filas_registro = [f for f in leer(registro_ruta) if f["generacion"] == generacion]
    filas = comparar(filas_registro, cargar_observados(observados_ruta))
    print(f"generación {generacion}: {resumen(filas)}")

    salida.parent.mkdir(parents=True, exist_ok=True)
    if filas:
        with salida.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
            w.writeheader()
            w.writerows(filas)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
