"""Prueba de métodos alternativos para primer año por carrera y sede.

Compara, con validación hacia atrás 2023-2026:
  - participación: media de 3 años (método actual), último año, tendencia amortiguada
  - total: conocido (optimista) y honesto (crecimiento del último año, sin datos del año)

Para cada combinación mide el error mediano y la cobertura y ancho del intervalo.
El intervalo sale de los errores de los OTROS años (validación dejando un año fuera).

Uso:
    python -I mejora_sede.py <SIES_matricula.csv>
"""

from __future__ import annotations

import math
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from entrada_carrera_sede import MIN_CASOS, leer  # noqa: E402

ANIOS = range(2023, 2027)
PHI = 0.5  # amortiguación de la tendencia


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def participacion(método, ent, total, k, y):
    s = {j: ent[y - j].get(k, 0) / total[y - j] for j in (1, 2, 3)}
    if método == "media3":
        if sum(1 for v in s.values() if v > 0) < 2:
            return None
        return sum(s.values()) / 3
    if método == "ultimo":
        return s[1] if s[1] > 0 else None
    if método == "tendencia":
        if s[1] <= 0 or s[2] <= 0:
            return None
        return max(0.0, s[1] + PHI * (s[1] - s[2]))
    raise ValueError(método)


def total_honesto(total, y):
    """Crecimiento del último año aplicado al total; no usa el total de y."""
    return total[y - 1] * (total[y - 1] / total[y - 2])


def evaluar(total, ent, metodo, total_modo):
    filas = []
    for y in ANIOS:
        t_hat = total[y] if total_modo == "conocido" else total_honesto(total, y)
        for k, n in ent[y].items():
            if n < MIN_CASOS:
                continue
            p = participacion(metodo, ent, total, k, y)
            if p is None or p <= 0:
                continue
            pred = t_hat * p
            filas.append({"anio": y, "real": n, "previsto": pred, "error": math.log(pred / n)})
    res = []
    for f in filas:
        otros = [g["error"] for g in filas if g["anio"] != f["anio"]]
        qlo, qhi = cuantil(otros, 0.025), cuantil(otros, 0.975)
        res.append({**f, "cubierto": qlo <= f["error"] <= qhi, "ancho": math.exp(qhi - qlo)})
    return res


def resumen(res):
    if not res:
        return "sin casos"
    ape = statistics.median(abs(r["previsto"] - r["real"]) / r["real"] for r in res)
    cob = sum(r["cubierto"] for r in res) / len(res)
    anc = statistics.median(r["ancho"] for r in res)
    return (f"n={len(res):>6} · error mediano {100*ape:5.1f} % · "
            f"cobertura {100*cob:5.1f} % · ancho mediano x{anc:.2f}")


def main(argv: list[str]) -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) != 2:
        print(__doc__)
        return 2
    total, ent, _ = leer(Path(argv[1]))
    for total_modo in ("conocido", "honesto"):
        print(f"total {total_modo}:")
        for metodo in ("media3", "ultimo", "tendencia"):
            print(f"  {metodo:<10} {resumen(evaluar(total, ent, metodo, total_modo))}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
