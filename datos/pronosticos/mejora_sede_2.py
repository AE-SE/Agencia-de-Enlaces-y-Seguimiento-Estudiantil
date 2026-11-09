"""Segunda ronda de mejoras para primer año por carrera y sede.

1. Comparación justa: los métodos se evalúan solo en celdas que tienen los tres
   (el método del último año cubría más celdas, lo que sesgaba la comparación).
2. Intervalo por volatilidad de la celda: cada error se divide por la volatilidad
   histórica de la participación de esa celda (cambios absolutos de su log-participación
   en los años previos). Así las celdas estables tienen intervalos más angostos.
3. Estimador de contracción: mezcla el último año con el promedio de los otros dos
   años, con peso 0,6 y 0,4.

El total usa el crecimiento del último año (sin datos del año a predecir).
Validación hacia atrás 2023-2026; el intervalo de cada año sale de los otros años.

Uso:
    python -I mejora_sede_2.py <SIES_matricula.csv>
"""

from __future__ import annotations

import math
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from entrada_carrera_sede import MIN_CASOS, leer  # noqa: E402

ANIOS = range(2023, 2027)
Z_NIVEL = 0.95


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def part(ent, total, k, y):
    return ent[y].get(k, 0) / total[y]


def prediccion(metodo, ent, total, k, y):
    s1, s2, s3 = (part(ent, total, k, y - j) for j in (1, 2, 3))
    if metodo == "ultimo":
        return s1 if s1 > 0 else None
    if metodo == "contraccion":
        if s1 <= 0 or (s2 <= 0 and s3 <= 0):
            return None
        otros = [v for v in (s2, s3) if v > 0]
        return 0.6 * s1 + 0.4 * (sum(otros) / len(otros))
    raise ValueError(metodo)


def volatilidad(ent, total, k, y):
    """Promedio de |Δ log-participación| en los años previos (mínimo dos cambios)."""
    cambios = []
    for j in (1, 2, 3, 4):
        a, b = part(ent, total, k, y - j), part(ent, total, k, y - j - 1)
        if a > 0 and b > 0:
            cambios.append(abs(math.log(a / b)))
    if len(cambios) < 2:
        return None
    return sum(cambios) / len(cambios)


def celdas_comunes(total, ent):
    """Celdas con predicción por los tres métodos en cada año de validación."""
    comunes = {}
    for y in ANIOS:
        ok = set()
        for k, n in ent[y].items():
            if n < MIN_CASOS:
                continue
            if all(prediccion(m, ent, total, k, y) for m in ("ultimo", "contraccion")):
                ok.add(k)
        comunes[y] = ok
    return comunes


def filas_para(metodo, total, ent, comunes, modo):
    filas = []
    for y in ANIOS:
        t_hat = total[y - 1] * (total[y - 1] / total[y - 2])
        for k in comunes[y]:
            n = ent[y][k]
            if modo == "volatilidad":
                v = volatilidad(ent, total, k, y)
                if v is None or v <= 0:
                    continue
            else:
                v = None
            p = prediccion(metodo, ent, total, k, y)
            if p is None:
                continue
            pred = t_hat * p
            filas.append({"anio": y, "real": n, "previsto": pred,
                          "error": math.log(pred / n), "vol": v})
    return filas


def cobertura_y_ancho(filas, modo):
    """Cuantiles de error por año (dejando uno fuera) calculados una sola vez por año."""
    por_anio = {y: [] for y in ANIOS}
    for f in filas:
        por_anio[f["anio"]].append(f)
    res = []
    for y in ANIOS:
        otros = [g for g in filas if g["anio"] != y]
        if modo == "volatilidad":
            escala = [g["error"] / g["vol"] for g in otros]
            zlo, zhi = cuantil(escala, 0.025), cuantil(escala, 0.975)
            for f in por_anio[y]:
                lo, hi = zlo * f["vol"], zhi * f["vol"]
                res.append({**f, "cubierto": lo <= f["error"] <= hi, "ancho": math.exp(hi - lo)})
        else:
            errores = [g["error"] for g in otros]
            lo, hi = cuantil(errores, 0.025), cuantil(errores, 0.975)
            for f in por_anio[y]:
                res.append({**f, "cubierto": lo <= f["error"] <= hi, "ancho": math.exp(hi - lo)})
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
    comunes = celdas_comunes(total, ent)
    print(f"celdas comunes por año: {({y: len(c) for y, c in comunes.items()})}")
    for metodo in ("ultimo", "contraccion"):
        for modo in ("fijo", "volatilidad"):
            filas = filas_para(metodo, total, ent, comunes, modo)
            print(f"{metodo:<12} intervalo {modo:<12} {resumen(cobertura_y_ancho(filas, modo))}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
