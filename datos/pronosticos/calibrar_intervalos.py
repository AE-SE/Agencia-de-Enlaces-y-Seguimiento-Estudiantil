"""Calibra intervalos empíricos para la línea base de persistencia.

Para cada par de procesos consecutivos, calcula el cambio logarítmico por
comuna: r = ln(rendidores_t / rendidores_{t-1}). Con esos cambios, el intervalo
de un pronóstico n es n·exp(q_inf) a n·exp(q_sup), con los cuantiles empíricos.

Validación: para cada par, se calibra con los demás pares (validación dejando
uno fuera) y se mide qué fracción de los valores reales cae dentro del
intervalo. Si la cobertura se aproxima al 95 %, el intervalo es honesto.

Solo comunas con al menos UMBRAL rendidores en ambos años entran en el cálculo.

Uso:
    python calibrar_intervalos.py <carpeta_con_ArchivoC> <salida.csv>
"""

from __future__ import annotations

import csv
import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "calibracion"))

from agregar_paes import UMBRAL, contar_rendidores  # noqa: E402


def cuantil(valores: list[float], q: float) -> float:
    """Cuantil por interpolación lineal (sin dependencias)."""
    s = sorted(valores)
    if not s:
        raise ValueError("sin valores")
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def cambios(previo: dict[str, int], real: dict[str, int]) -> list[float]:
    return [
        math.log(real[c] / previo[c])
        for c in real
        if real[c] >= UMBRAL and previo.get(c, 0) >= UMBRAL
    ]


def intervalo_empirico(n: int, r: list[float]) -> tuple[float, float]:
    return n * math.exp(cuantil(r, 0.025)), n * math.exp(cuantil(r, 0.975))


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
    conteos = {a: dict(contar_rendidores(p)) for a, p in sorted(archivos.items())}

    pares = [(a - 1, a) for a in sorted(conteos) if a - 1 in conteos]
    cambios_por_par = {par: cambios(conteos[par[0]], conteos[par[1]]) for par in pares}

    filas = []
    for par in pares:
        # Calibración con todos los demás pares, sin el que se evalúa
        otros = [r for p, rs in cambios_por_par.items() if p != par for r in rs]
        if len(otros) < 20:
            continue
        previo, real = conteos[par[0]], conteos[par[1]]
        dentro = 0
        total = 0
        for c in real:
            if real[c] < UMBRAL or previo.get(c, 0) < UMBRAL:
                continue
            inf, sup = intervalo_empirico(previo[c], otros)
            total += 1
            if inf <= real[c] <= sup:
                dentro += 1
        filas.append(
            {
                "desde": par[0],
                "hasta": par[1],
                "comunas": total,
                "cobertura_intervalo_empirico": round(100 * dentro / total, 1) if total else None,
            }
        )
        print(f"{par[0]}->{par[1]}: cobertura {filas[-1]['cobertura_intervalo_empirico']} % ({total} comunas)")

    # Intervalo final con todos los cambios observados
    todos = [r for rs in cambios_por_par.values() for r in rs]
    print(f"cuantiles de cambio logarítmico (todos los pares, {len(todos)} observaciones): "
          f"q2.5={cuantil(todos, 0.025):.3f}, q97.5={cuantil(todos, 0.975):.3f}")

    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["desde", "hasta", "comunas", "cobertura_intervalo_empirico"])
        w.writeheader()
        w.writerows(filas)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
