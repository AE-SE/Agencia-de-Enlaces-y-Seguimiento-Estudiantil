"""Estimación de alumnos de primer año de pregrado 2027, sin depender de la PAES.

Método:
    primer_año(t) = cohorte_4to_residencia(t-1) × tasa(t)
    tasa(t) = primer_año(t-1) / cohorte_4to_residencia(t-2)   (regla: último año observado)

La regla del último año se eligió frente al promedio de tres años porque en la
prueba retrospectiva tuvo menor error (2023-2026). El intervalo sale de los
cambios de la tasa entre años consecutivos.

Desagregación: el total nacional se reparte por región y comuna de la SEDE,
con la participación promedio de 2024-2026 (la base SIES no trae residencia).

Uso:
    python entrada_primer_anio.py <SIES_matricula.csv> <residencia_4to_dir> <registro.csv> <fecha>
"""

from __future__ import annotations

import csv
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from registro import Pronostico, registrar  # noqa: E402

UMBRAL = 10
GEN = "PRIMER-ANIO-PREGRADO-2027"
METODO = "tasa-ultimo-anio-v1 (cohorte 4to residencia × tasa de entrada)"
VERSION_SUPUESTOS = "tasa de entrada del último año observado; intervalo empírico de cambios de tasa; reparto por sede (2024-2026)"
VERSION_DATOS = "SIES base de matrícula 2007-2026 (pregrado, primer año) y Mineduc cuarto medio por residencia 2020-2026"


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def leer_sies(ruta: Path):
    pre: dict[int, int] = defaultdict(int)
    reg: dict[int, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    com: dict[int, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    with ruta.open(encoding="utf-8-sig", errors="replace", newline="") as f:
        rd = csv.DictReader(f, delimiter=";")
        cols = rd.fieldnames or []
        ycol = cols[0]
        m1 = next(c for c in cols if "PRIMER" in c and c.startswith("TOTAL MATR")
                  and "MUJER" not in c and "HOMBRE" not in c and "BINARIO" not in c)
        niv = next(c for c in cols if c.startswith("NIVEL GLOBAL"))
        rcol = next(c for c in cols if c.strip().startswith("REG"))
        ccol = next(c for c in cols if c.strip() == "COMUNA")
        for r in rd:
            m = re.search(r"(\d{4})", r[ycol])
            if not m or r[niv].strip() != "Pregrado":
                continue
            y = int(m.group(1))
            try:
                v = int(float(r[m1].replace(",", ".") or 0))
            except ValueError:
                v = 0
            pre[y] += v
            reg[y][r[rcol].strip()] += v
            com[y][r[ccol].strip().zfill(5) if r[ccol].strip().isdigit() else r[ccol].strip()] += v
    return pre, reg, com


def cohorte(dir_res: Path) -> dict[int, int]:
    salida = {}
    for p in sorted(dir_res.glob("resumen_*.csv")):
        y = int(p.stem.split("_")[-1])
        with p.open(encoding="utf-8", newline="") as f:
            salida[y] = sum(int(r["residentes_en_cuarto"]) for r in csv.DictReader(f))
    return salida


def main(argv: list[str]) -> int:
    if len(argv) != 5:
        print(__doc__)
        return 2
    sies, dir_res, registro, fecha = Path(argv[1]), Path(argv[2]), Path(argv[3]), argv[4]
    pre, reg, com = leer_sies(sies)
    coh = cohorte(dir_res)

    tasas = {y: pre[y] / coh[y - 1] for y in range(2021, 2027) if y in pre and (y - 1) in coh}
    print("tasa de entrada (primer año / cohorte del año anterior):", {y: round(t, 3) for y, t in tasas.items()})

    # validación: regla del último año, para 2022-2026
    errores = []
    for y in range(2022, 2027):
        pred = coh[y - 1] * tasas[y - 1]
        err = math.log(pred / pre[y])
        errores.append(err)
        print(f"  {y}: previsto {pred:,.0f} · real {pre[y]:,} · error {100*(pred/pre[y]-1):+.1f} %")
    qi, qs = cuantil(errores, 0.025), cuantil(errores, 0.975)
    print(f"intervalo de error de la regla: x{math.exp(qi):.3f} a x{math.exp(qs):.3f}")

    # pronóstico 2027
    cohorte_2026 = coh[2026]
    tasa_2026 = tasas[2026]
    total_2027 = cohorte_2026 * tasa_2026
    lo, hi = total_2027 * math.exp(qi), total_2027 * math.exp(qs)
    print(f"primer año pregrado 2027 nacional: {total_2027:,.0f} ({lo:,.0f} a {hi:,.0f})")

    # reparto por sede: participación promedio 2024-2026
    def participacion(dic: dict[int, dict[str, int]]) -> dict[str, float]:
        acum: dict[str, float] = defaultdict(float)
        for y in (2024, 2025, 2026):
            total = sum(dic[y].values())
            for k, v in dic[y].items():
                acum[k] += v / total / 3
        return acum

    part_reg = participacion(reg)
    part_com = participacion(com)

    pronosticos = []
    for r, p in sorted(part_reg.items()):
        v = total_2027 * p
        if v < UMBRAL:
            continue
        pronosticos.append(Pronostico(
            fecha_registro=fecha, generacion=GEN, unidad=r, variable="primer_anio_region",
            valor_previsto=v, limite_inferior=v * math.exp(qi), limite_superior=v * math.exp(qs),
            metodo=METODO, version_supuestos=VERSION_SUPUESTOS, version_datos=VERSION_DATOS,
        ))
    pronosticos.append(Pronostico(
        fecha_registro=fecha, generacion=GEN, unidad="NACIONAL", variable="primer_anio_nacional",
        valor_previsto=total_2027, limite_inferior=lo, limite_superior=hi,
        metodo=METODO, version_supuestos=VERSION_SUPUESTOS, version_datos=VERSION_DATOS,
    ))
    ids = registrar(registro, pronosticos)
    print(f"registrados: {len(ids)} (nacional, regiones)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
