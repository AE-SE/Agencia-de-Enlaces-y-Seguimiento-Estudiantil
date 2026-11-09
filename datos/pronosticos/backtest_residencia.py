"""Prueba retrospectiva del cuarto medio por residencia (2020-2026).

Lee los resúmenes por comuna de residencia (salida de agregar_origen_destino.py)
y prueba dos líneas base para predecir el cuarto medio de cada comuna en t:

- persistencia: igual al valor de t-1;
- persistencia con tendencia nacional: valor de t-1 multiplicado por el
  crecimiento nacional observado entre t-2 y t-1 (lo único disponible ex ante).

Mide el error absoluto porcentual mediano por comuna y la cobertura de un
intervalo empírico calibrado con los cambios logarítmicos de los otros pares.

Solo comunas con al menos UMBRAL estudiantes en ambos años entran en la medición.

Uso:
    python backtest_residencia.py <carpeta_con_resumen_AAAA.csv>
"""

from __future__ import annotations

import csv
import math
import statistics
import sys
from pathlib import Path

UMBRAL = 10


def cargar(carpeta: Path) -> dict[int, dict[str, int]]:
    datos: dict[int, dict[str, int]] = {}
    for p in sorted(carpeta.glob("resumen_*.csv")):
        anio = int(p.stem.split("_")[-1])
        with p.open(encoding="utf-8", newline="") as f:
            datos[anio] = {
                r["codigo_comuna"]: int(r["residentes_en_cuarto"]) for r in csv.DictReader(f)
            }
    return datos


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__)
        return 2
    datos = cargar(Path(argv[1]))
    anios = sorted(datos)
    total = {a: sum(datos[a].values()) for a in anios}
    print("total nacional residentes en cuarto medio:", total)

    # cambios logarítmicos por par, para intervalo empírico
    cambios: dict[tuple[int, int], list[float]] = {}
    for a in anios[1:]:
        p = a - 1
        cambios[(p, a)] = [
            math.log(datos[a][c] / datos[p][c])
            for c in datos[a]
            if datos[a][c] >= UMBRAL and datos[p].get(c, 0) >= UMBRAL
        ]

    for a in anios[2:]:
        p, pp = a - 1, a - 2
        crecimiento = total[p] / total[pp]  # ex ante: t-2 → t-1
        ape_p, ape_t, dentro, medidas = [], [], 0, 0
        otros = [r for par, rs in cambios.items() if par != (p, a) for r in rs]
        q_inf, q_sup = cuantil(otros, 0.025), cuantil(otros, 0.975)
        for c, real in datos[a].items():
            if real < UMBRAL or datos[p].get(c, 0) < UMBRAL:
                continue
            base = datos[p][c]
            tendencia = base * crecimiento
            ape_p.append(abs(base - real) / real)
            ape_t.append(abs(tendencia - real) / real)
            medidas += 1
            if base * math.exp(q_inf) <= real <= base * math.exp(q_sup):
                dentro += 1
        print(
            f"{p}->{a}: persistencia APE mediano {100*statistics.median(ape_p):.1f} % | "
            f"con tendencia nacional {100*statistics.median(ape_t):.1f} % | "
            f"cobertura intervalo empírico {100*dentro/medidas:.1f} % ({medidas} comunas)"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
