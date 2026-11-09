"""Recalcula la validación y la línea base PAES con la definición consistente de rendidor.

Usa rendidor regular = fila con puntaje regular (definicion_rendidor.py).

Para comuna del colegio y para región, hace:
1. Validación de persistencia: APE mediano y cobertura del intervalo empírico,
   con un par de años dejado fuera cada vez.
2. Registro de la línea base corregida para PAES Regular 2027 (fila nueva, con
   motivo que apunta a la línea base anterior). Nunca edita filas existentes.

Uso:
    python recalcular_paes_definicion.py <carpeta_con_ArchivoC> <registro.csv> <fecha>
"""

from __future__ import annotations

import csv
import math
import statistics
import sys
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from definicion_rendidor import contar_con_puntaje  # noqa: E402
from registro import Pronostico, leer, registrar  # noqa: E402

UMBRAL = 10
GEN_COMUNA = "PAES-REGULAR-2027-DEF2"
GEN_REGION = "PAES-REGULAR-2027-REGIONAL-DEF2"
METODO = "persistencia-def2-v1 (intervalo empírico)"
VERSION_DATOS = "DEMRE ArchivoC PAES Regular 2020-2026, definición de rendidor con puntaje regular"


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def region(c: str) -> str:
    return c.zfill(5)[:2]


def validar(serie: dict[int, dict[str, int]], nombre: str) -> dict[str, tuple[float, float]]:
    """Imprime la validación y devuelve los cuantiles del intervalo final."""
    anios = sorted(serie)
    cambios: dict[tuple[int, int], list[float]] = {}
    for a in anios[1:]:
        p = a - 1
        cambios[(p, a)] = [
            math.log(serie[a][c] / serie[p][c])
            for c in serie[a]
            if serie[a][c] >= UMBRAL and serie[p].get(c, 0) >= UMBRAL
        ]
    print(f"validación {nombre} (persistencia, intervalo dejando un par fuera):")
    for a in anios[1:]:
        p = a - 1
        otros = [x for par, rs in cambios.items() if par != (p, a) for x in rs]
        if len(otros) < 10:
            continue
        qi, qs = cuantil(otros, 0.025), cuantil(otros, 0.975)
        apes, dentro, total = [], 0, 0
        for c in serie[a]:
            if serie[a][c] < UMBRAL or serie[p].get(c, 0) < UMBRAL:
                continue
            base, real = serie[p][c], serie[a][c]
            apes.append(abs(base - real) / real)
            total += 1
            if base * math.exp(qi) <= real <= base * math.exp(qs):
                dentro += 1
        if total:
            print(f"  {p}->{a}: APE mediano {100*statistics.median(apes):.1f} % | "
                  f"cobertura {100*dentro/total:.1f} % ({total} unidades)")
    todos = [x for rs in cambios.values() for x in rs]
    return cuantil(todos, 0.025), cuantil(todos, 0.975)


def main(argv: list[str]) -> int:
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

    comunas: dict[int, dict[str, int]] = {}
    for anio, p in sorted(archivos.items()):
        conteo, _ = contar_con_puntaje(p)
        comunas[anio] = dict(conteo)
    regiones = {a: dict(Counter({r: 0 for r in []})) for a in comunas}
    for a, conteo in comunas.items():
        acc: Counter = Counter()
        for c, n in conteo.items():
            acc[region(c)] += n
        regiones[a] = dict(acc)

    qi_c, qs_c = validar(comunas, "por comuna del colegio")
    qi_r, qs_r = validar(regiones, "por región del colegio")
    print(f"intervalo comunal final: x{math.exp(qi_c):.3f} a x{math.exp(qs_c):.3f}")
    print(f"intervalo regional final: x{math.exp(qi_r):.3f} a x{math.exp(qs_r):.3f}")

    # Líneas base anteriores para referenciar en el motivo
    anteriores = {
        (f["unidad"], f["variable"]): f["id"]
        for f in leer(registro)
        if f["generacion"] in ("PAES-REGULAR-2027", "PAES-REGULAR-2027-REGIONAL")
    }

    ultimo = max(comunas)
    nuevos = []
    for c, n in sorted(comunas[ultimo].items()):
        if n < UMBRAL:
            continue
        ref = anteriores.get((c, "rendidores"), "sin referencia")
        nuevos.append(Pronostico(
            fecha_registro=fecha, generacion=GEN_COMUNA, unidad=c, variable="rendidores",
            valor_previsto=float(n), limite_inferior=n * math.exp(qi_c), limite_superior=n * math.exp(qs_c),
            metodo=METODO, version_supuestos="persistencia def2; intervalo empírico comunal",
            version_datos=VERSION_DATOS,
            motivo_correccion=f"corrige la fila {ref} (conteo de filas sin definición de rendidor)",
        ))
    for r, n in sorted(regiones[ultimo].items()):
        if n < UMBRAL:
            continue
        ref = anteriores.get((r, "rendidores_region"), "sin referencia")
        nuevos.append(Pronostico(
            fecha_registro=fecha, generacion=GEN_REGION, unidad=r, variable="rendidores_region",
            valor_previsto=float(n), limite_inferior=n * math.exp(qi_r), limite_superior=n * math.exp(qs_r),
            metodo=METODO, version_supuestos="persistencia def2; intervalo empírico regional",
            version_datos=VERSION_DATOS,
            motivo_correccion=f"corrige la fila {ref} (conteo de filas sin definición de rendidor)",
        ))
    ids = registrar(registro, nuevos)
    print(f"correcciones registradas: {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
