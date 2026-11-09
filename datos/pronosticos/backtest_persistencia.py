"""Prueba retrospectiva (backtest) de la línea base de persistencia.

Para cada par de procesos consecutivos (t-1, t) con datos disponibles, aplica
el método de persistencia: el pronóstico de rendidores de la comuna en t es el
conteo observado en t-1. Luego mide:

- error absoluto porcentual mediano (APE mediano) por comuna;
- cobertura del intervalo que se registra (n ± 1,96·√n): qué fracción de los
  valores reales cae dentro del intervalo.

Esto no prueba que el método prediga bien el futuro. Mide cuánto se equivocó
en el pasado, con datos públicos de DEMRE. Solo comunas con al menos UMBRAL
rendidores en ambos años entran en la medición.

Uso:
    python backtest_persistencia.py <carpeta_con_ArchivoC> <salida.csv>
"""

from __future__ import annotations

import csv
import math
import statistics
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "calibracion"))

from agregar_paes import UMBRAL, contar_rendidores  # noqa: E402


def intervalo(n: int) -> tuple[float, float]:
    delta = 1.96 * math.sqrt(n)
    return max(0.0, n - delta), n + delta


def evaluar_par(previo: dict[str, int], real: dict[str, int]) -> dict:
    comunas = [c for c in real if real[c] >= UMBRAL and previo.get(c, 0) >= UMBRAL]
    apes = []
    dentro = 0
    for c in comunas:
        pronostico = previo[c]
        observado = real[c]
        apes.append(abs(pronostico - observado) / observado)
        inferior, superior = intervalo(pronostico)
        if inferior <= observado <= superior:
            dentro += 1
    return {
        "comunas_medidas": len(comunas),
        "ape_mediano": round(statistics.median(apes) * 100, 1) if apes else None,
        "cobertura_intervalo": round(100 * dentro / len(comunas), 1) if comunas else None,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    carpeta, salida = Path(argv[1]), Path(argv[2])
    # Archivos ArchivoC de la PAES Regular, por año de proceso.
    archivos: dict[int, Path] = {}
    for p in carpeta.rglob("ArchivoC*.csv"):
        marca = "".join(ch for ch in p.parent.parent.name if ch.isdigit())[:4]
        if not marca or "2027" in p.parent.parent.name:
            continue
        archivos.setdefault(int(marca), p)

    conteos = {anio: dict(contar_rendidores(p)) for anio, p in sorted(archivos.items())}
    filas = []
    for anio in sorted(conteos):
        if anio - 1 in conteos:
            r = evaluar_par(conteos[anio - 1], conteos[anio])
            filas.append({"desde": anio - 1, "hasta": anio, **r})
            print(f"{anio-1}->{anio}: {r}")

    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as f:
        escritor = csv.DictWriter(
            f, fieldnames=["desde", "hasta", "comunas_medidas", "ape_mediano", "cobertura_intervalo"]
        )
        escritor.writeheader()
        escritor.writerows(filas)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
