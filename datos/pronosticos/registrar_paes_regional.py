"""Pronóstico regional de rendidores de la PAES Regular 2027 y su validación.

Unidad: región del establecimiento de egreso (DEMRE). Así se decidió en A7 del
plan: a nivel regional la precisión es validable; por comuna no lo es.

Método: persistencia regional (igual al conteo de 2026 en la región). El
intervalo se calibra con los cambios logarítmicos regionales entre años
consecutivos, con validación dejando un par fuera.

Uso:
    python registrar_paes_regional.py <carpeta_con_ArchivoC> <registro.csv> <fecha> [--solo-validar]
"""

from __future__ import annotations

import csv
import math
import statistics
import sys
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "calibracion"))
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from agregar_paes import contar_rendidores  # noqa: E402
from registro import Pronostico, registrar  # noqa: E402

UMBRAL = 10
GENERACION = "PAES-REGULAR-2027-REGIONAL"
METODO = "persistencia-regional-v1"
VERSION_SUPUESTOS = "persistencia regional; intervalo empírico de cambios logarítmicos regionales 2021-2026"
VERSION_DATOS = "DEMRE ArchivoC PAES Regular 2020-2026 (comuna del colegio agregada a región)"


def region_de(codigo_comuna: str) -> str:
    return codigo_comuna.zfill(5)[:2]


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def main(argv: list[str]) -> int:
    solo_validar = "--solo-validar" in argv
    argv = [a for a in argv if a != "--solo-validar"]
    if len(argv) != 4:
        print(__doc__)
        return 2
    carpeta, registro, fecha = Path(argv[1]), Path(argv[2]), argv[3]

    archivos: dict[int, Path] = {}
    for p in carpeta.rglob("ArchivoC*.csv"):
        marca = "".join(ch for ch in p.parent.parent.name if ch.isdigit())[:4]
        if not marca or "2027" in p.parent.parent.name:
            continue
        archivos.setdefault(int(marca), p)

    regional: dict[int, dict[str, int]] = {}
    for anio, p in sorted(archivos.items()):
        conteo = Counter()
        for c, n in contar_rendidores(p).items():
            conteo[region_de(c)] += n
        regional[anio] = dict(conteo)

    anios = sorted(regional)
    cambios: dict[tuple[int, int], list[float]] = {}
    for a in anios[1:]:
        p = a - 1
        cambios[(p, a)] = [
            math.log(regional[a][r] / regional[p][r])
            for r in regional[a]
            if regional[a][r] >= UMBRAL and regional[p].get(r, 0) >= UMBRAL
        ]

    print("validación regional (persistencia; intervalo calibrado dejando un par fuera):")
    for a in anios[1:]:
        p = a - 1
        otros = [x for par, rs in cambios.items() if par != (p, a) for x in rs]
        if len(otros) < 10:
            continue
        qi, qs = cuantil(otros, 0.025), cuantil(otros, 0.975)
        apes, dentro, total = [], 0, 0
        for r in regional[a]:
            if regional[a][r] < UMBRAL or regional[p].get(r, 0) < UMBRAL:
                continue
            base, real = regional[p][r], regional[a][r]
            apes.append(abs(base - real) / real)
            total += 1
            if base * math.exp(qi) <= real <= base * math.exp(qs):
                dentro += 1
        print(f"  {p}->{a}: APE mediano {100*statistics.median(apes):.1f} % | "
              f"cobertura {100*dentro/total:.1f} % ({total} regiones)")

    todos = [x for rs in cambios.values() for x in rs]
    qi, qs = cuantil(todos, 0.025), cuantil(todos, 0.975)
    print(f"intervalo regional final: x{math.exp(qi):.3f} a x{math.exp(qs):.3f}")

    if solo_validar:
        return 0

    pronosticos = []
    for r, base in sorted(regional[anios[-1]].items()):
        if base < UMBRAL:
            continue
        pronosticos.append(
            Pronostico(
                fecha_registro=fecha,
                generacion=GENERACION,
                unidad=r,
                variable="rendidores_region",
                valor_previsto=float(base),
                limite_inferior=base * math.exp(qi),
                limite_superior=base * math.exp(qs),
                metodo=METODO,
                version_supuestos=VERSION_SUPUESTOS,
                version_datos=VERSION_DATOS,
            )
        )
    ids = registrar(registro, pronosticos)
    print(f"regiones registradas: {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
