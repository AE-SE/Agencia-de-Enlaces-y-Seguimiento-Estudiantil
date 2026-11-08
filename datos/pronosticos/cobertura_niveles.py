"""Ancho y cobertura del intervalo de primer año por nivel de agregación.

Compara tres niveles: carrera-sede (celda), sede (suma de carreras) e institución
(suma de sedes y carreras). Para cada nivel usa la misma validación hacia atrás
que cobertura_entrada_sede.py: previsión con la participación de los tres años
anteriores, intervalo con cuantiles de los errores de los otros años.

Supuesto de prueba: el total del año se conoce. La cobertura es optimista.

Uso:
    python -I cobertura_niveles.py <SIES_matricula.csv>
"""

from __future__ import annotations

import math
import statistics
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from entrada_carrera_sede import MIN_CASOS, leer  # noqa: E402

ANIOS = range(2022, 2027)
CLASES = ((30, 99, "30-99"), (100, 499, "100-499"), (500, math.inf, "500 o más"))


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def agregar(ent, nivel):
    """ent[y][(inst, sede, carrera)] -> ent2[y][clave_nivel]."""
    out = defaultdict(lambda: defaultdict(int))
    for y, celdas in ent.items():
        for (inst, sede, carrera), n in celdas.items():
            if nivel == "celda":
                k = (inst, sede, carrera)
            elif nivel == "sede":
                k = (inst, sede)
            else:
                k = (inst,)
            out[y][k] += n
    return out


def evaluar(ent, total, nivel):
    ent2 = agregar(ent, nivel)
    filas = []
    for y in ANIOS:
        for k, n in ent2[y].items():
            if n < MIN_CASOS:
                continue
            hist = [ent2[y - j].get(k, 0) / total[y - j] for j in (1, 2, 3)]
            if sum(1 for h in hist if h > 0) < 2:
                continue
            pred = total[y] * sum(hist) / 3
            if pred <= 0:
                continue
            filas.append({"anio": y, "real": n, "previsto": pred, "error": math.log(pred / n)})
    res = []
    for f in filas:
        otros = [g["error"] for g in filas if g["anio"] != f["anio"]]
        qlo, qhi = cuantil(otros, 0.025), cuantil(otros, 0.975)
        res.append({**f, "cubierto": qlo <= f["error"] <= qhi, "ancho": math.exp(qhi - qlo)})
    return res


def resumen(res, titulo):
    if not res:
        print(f"{titulo}: sin casos")
        return
    cob = sum(r["cubierto"] for r in res) / len(res)
    anc = statistics.median(r["ancho"] for r in res)
    ape = statistics.median(abs(r["previsto"] - r["real"]) / r["real"] for r in res)
    print(f"{titulo}: {len(res)} casos · error mediano {100*ape:.1f} % · "
          f"cobertura {100*cob:.1f} % · ancho mediano x{anc:.2f}")


def main(argv: list[str]) -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) != 2:
        print(__doc__)
        return 2
    total, ent, _ = leer(Path(argv[1]))
    for nivel in ("celda", "sede", "institucion"):
        res = evaluar(ent, total, nivel)
        resumen(res, f"nivel {nivel}")
        if nivel == "celda":
            for lo, hi, etiqueta in CLASES:
                resumen([r for r in res if lo <= r["real"] <= hi], f"  celda, tamaño {etiqueta}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
