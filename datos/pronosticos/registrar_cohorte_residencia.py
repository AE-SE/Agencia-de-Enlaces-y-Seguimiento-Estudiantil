"""Registra el pronóstico de cuarto medio 2027 por comuna de residencia.

Método (persistencia con tendencia nacional, validado en backtest_residencia.py):
    pronóstico_2027(comuna) = cuarto_medio_2026(comuna) × crecimiento_nacional(2025→2026)

El crecimiento se conoce antes de pronosticar, así que es ex ante.

Intervalo: cuantiles empíricos 2,5 % y 97,5 % de los cambios logarítmicos de la
cohorte entre años consecutivos, aplicados al pronóstico. Solo comunas con al
menos UMBRAL estudiantes entran al registro.

Uso:
    python registrar_cohorte_residencia.py <carpeta_resumenes> <registro.csv> <fecha>
"""

from __future__ import annotations

import csv
import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from registro import Pronostico, registrar  # noqa: E402

UMBRAL = 10
GENERACION = "4TO-MEDIO-2027-RESIDENCIA"
METODO = "persistencia-tendencia-nacional-v1"
VERSION_SUPUESTOS = "persistencia con tendencia nacional; intervalo empírico 2,5-97,5 % de cambios logarítmicos 2021-2026"
VERSION_DATOS = "Mineduc matrícula por estudiante 2020-2026 (corte 30 abril), residencia del alumno"


def cargar(carpeta: Path) -> dict[int, dict[str, int]]:
    datos: dict[int, dict[str, int]] = {}
    for p in sorted(carpeta.glob("resumen_*.csv")):
        anio = int(p.stem.split("_")[-1])
        with p.open(encoding="utf-8", newline="") as f:
            datos[anio] = {r["codigo_comuna"]: int(r["residentes_en_cuarto"]) for r in csv.DictReader(f)}
    return datos


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__)
        return 2
    datos = cargar(Path(argv[1]))
    registro, fecha = Path(argv[2]), argv[3]
    anios = sorted(datos)
    ultimo = anios[-1]  # 2026
    total = {a: sum(datos[a].values()) for a in anios}
    crecimiento = total[ultimo] / total[ultimo - 1]

    cambios = []
    for a in anios[1:]:
        cambios += [
            math.log(datos[a][c] / datos[a - 1][c])
            for c in datos[a]
            if datos[a][c] >= UMBRAL and datos[a - 1].get(c, 0) >= UMBRAL
        ]
    q_inf, q_sup = cuantil(cambios, 0.025), cuantil(cambios, 0.975)

    pronosticos = []
    for comuna, base in sorted(datos[ultimo].items()):
        if base < UMBRAL:
            continue
        previsto = base * crecimiento
        pronosticos.append(
            Pronostico(
                fecha_registro=fecha,
                generacion=GENERACION,
                unidad=comuna,
                variable="cuarto_medio_residentes",
                valor_previsto=previsto,
                limite_inferior=previsto * math.exp(q_inf),
                limite_superior=previsto * math.exp(q_sup),
                metodo=METODO,
                version_supuestos=VERSION_SUPUESTOS,
                version_datos=VERSION_DATOS,
            )
        )
    ids = registrar(registro, pronosticos)
    print(f"crecimiento nacional {ultimo-1}→{ultimo}: {crecimiento:.4f} · intervalo x{math.exp(q_inf):.3f} a x{math.exp(q_sup):.3f} · registrados: {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
