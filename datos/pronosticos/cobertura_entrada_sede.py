"""Cobertura del intervalo de primer año por carrera y sede (validación hacia atrás).

Método:
    previsto(y, celda) = total(y) × participación promedio de la celda en y-1, y-2, y-3
    error(y, celda)    = log(previsto / observado)
    intervalo          = cuantiles 2,5 % y 97,5 % de los errores de los OTROS años
                         (validación dejando un año fuera)

Supuesto de prueba: el total del año se conoce (no se estima). Por eso la cobertura
medida es optimista: en el pronóstico real el total también tiene incertidumbre.

Se reporta por tamaño de celda, porque las celdas pequeñas tienen más variabilidad.

Uso:
    python -I cobertura_entrada_sede.py <SIES_matricula.csv> <salida.csv>
"""

from __future__ import annotations

import csv
import math
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from entrada_carrera_sede import MIN_CASOS, leer  # noqa: E402

ANIOS = range(2022, 2027)
NOMINAL = 0.95
TAMANOS = ((MIN_CASOS, 99, "30-99"), (100, math.inf, "100 o más"))


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def main(argv: list[str]) -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) != 3:
        print(__doc__)
        return 2
    total, ent, _ = leer(Path(argv[1]))
    salida = Path(argv[2])

    # previsión y error por año y celda
    filas = []
    for y in ANIOS:
        for k, n in ent[y].items():
            if n < MIN_CASOS:
                continue
            # mismo método que el pronóstico: participación del último año
            hist = ent[y - 1].get(k, 0) / total[y - 1]
            if hist <= 0:
                continue
            pred = total[y] * hist
            if pred <= 0:
                continue
            filas.append({"anio": y, "clave": k, "real": n, "previsto": pred,
                          "error": math.log(pred / n)})

    resultados = []
    for f in filas:
        otros = [g["error"] for g in filas if g["anio"] != f["anio"]]
        qlo, qhi = cuantil(otros, 0.025), cuantil(otros, 0.975)
        cubierto = qlo <= f["error"] <= qhi
        ancho = math.exp(qhi - qlo)
        resultados.append({**f, "qlo": qlo, "qhi": qhi, "cubierto": cubierto, "ancho": ancho})

    def resumen(sub: list[dict], titulo: str) -> None:
        if not sub:
            print(f"{titulo}: sin casos")
            return
        ape = statistics.median(abs(r["previsto"] - r["real"]) / r["real"] for r in sub)
        cob = sum(r["cubierto"] for r in sub) / len(sub)
        anc = statistics.median(r["ancho"] for r in sub)
        print(f"{titulo}: {len(sub)} casos · error mediano {100*ape:.1f} % · "
              f"cobertura {100*cob:.1f} % (nominal {100*NOMINAL:.0f} %) · "
              f"ancho mediano x{anc:.2f}")

    print(f"validación hacia atrás 2022-2026, celdas ≥{MIN_CASOS} entrantes, total conocido")
    resumen(resultados, "todas")
    for lo, hi, etiqueta in TAMANOS:
        resumen([r for r in resultados if lo <= r["real"] <= hi], f"tamaño {etiqueta}")
    for y in ANIOS:
        resumen([r for r in resultados if r["anio"] == y], f"año {y}")

    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["anio", "institucion", "sede", "carrera", "real", "previsto",
                    "error_log", "limite_inferior_log", "limite_superior_log", "cubierto"])
        for r in resultados:
            w.writerow([r["anio"], *r["clave"], r["real"], round(r["previsto"], 1),
                        round(r["error"], 4), round(r["qlo"], 4), round(r["qhi"], 4),
                        int(r["cubierto"])])
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
