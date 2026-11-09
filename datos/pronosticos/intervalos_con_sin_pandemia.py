"""Intervalos de la línea base PAES 2027 con y sin el par pandémico 2020→2021.

Calcula dos intervalos empíricos sobre el cambio logarítmico entre procesos,
con la definición consistente de rendidor:
- con pandemia: todos los pares 2021-2026 más 2020→2021;
- sin pandemia: excluye 2020→2021.

Registra, como filas nuevas y sin editar lo anterior, la línea base de 2027
con el intervalo sin pandemia (generación ...-SIN-PANDEMIA). Las filas con
pandemia ya están registradas en PAES-REGULAR-2027-DEF2.

Uso:
    python intervalos_con_sin_pandemia.py <carpeta_con_ArchivoC> <registro.csv> <fecha>
"""

from __future__ import annotations

import csv
import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from definicion_rendidor import contar_con_puntaje  # noqa: E402
from registro import Pronostico, registrar  # noqa: E402

UMBRAL = 10
PAR_PANDEMIA = (2020, 2021)
GEN_COMUNA = "PAES-REGULAR-2027-DEF2-SIN-PANDEMIA"
GEN_REGION = "PAES-REGULAR-2027-REGIONAL-DEF2-SIN-PANDEMIA"
METODO = "persistencia-def2-sin-pandemia-v1 (intervalo empírico)"
VERSION_DATOS = "DEMRE ArchivoC PAES Regular 2020-2026, definición de rendidor con puntaje regular"


def cuantil(valores: list[float], q: float) -> float:
    s = sorted(valores)
    pos = (len(s) - 1) * q
    bajo, alto = math.floor(pos), math.ceil(pos)
    return s[bajo] + (s[alto] - s[bajo]) * (pos - bajo)


def region(c: str) -> str:
    return c.zfill(5)[:2]


def cambios(serie: dict[int, dict[str, int]], excluir: tuple[int, int] | None) -> list[float]:
    salida = []
    for a in sorted(serie)[1:]:
        if excluir == (a - 1, a):
            continue
        salida += [
            math.log(serie[a][c] / serie[a - 1][c])
            for c in serie[a]
            if serie[a][c] >= UMBRAL and serie[a - 1].get(c, 0) >= UMBRAL
        ]
    return salida


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

    comunas = {a: dict(contar_con_puntaje(p)[0]) for a, p in sorted(archivos.items())}
    regiones = {}
    for a, conteo in comunas.items():
        acc: dict[str, int] = {}
        for c, n in conteo.items():
            acc[region(c)] = acc.get(region(c), 0) + n
        regiones[a] = acc

    resultados = {}
    for nombre, serie in (("comuna", comunas), ("region", regiones)):
        con = cambios(serie, None)
        sin = cambios(serie, PAR_PANDEMIA)
        resultados[nombre] = {
            "con": (cuantil(con, 0.025), cuantil(con, 0.975)),
            "sin": (cuantil(sin, 0.025), cuantil(sin, 0.975)),
        }
        for etiqueta in ("con", "sin"):
            qi, qs = resultados[nombre][etiqueta]
            print(f"{nombre} {etiqueta} pandemia: x{math.exp(qi):.3f} a x{math.exp(qs):.3f}")

    ultimo = max(comunas)
    qi_c, qs_c = resultados["comuna"]["sin"]
    qi_r, qs_r = resultados["region"]["sin"]
    nuevos = []
    for c, n in sorted(comunas[ultimo].items()):
        if n < UMBRAL:
            continue
        nuevos.append(Pronostico(
            fecha_registro=fecha, generacion=GEN_COMUNA, unidad=c, variable="rendidores",
            valor_previsto=float(n), limite_inferior=n * math.exp(qi_c), limite_superior=n * math.exp(qs_c),
            metodo=METODO, version_supuestos="persistencia def2; intervalo empírico comunal sin 2020→2021",
            version_datos=VERSION_DATOS,
            motivo_correccion="variante sin el par pandémico 2020→2021 de la fila de PAES-REGULAR-2027-DEF2",
        ))
    for r, n in sorted(regiones[ultimo].items()):
        if n < UMBRAL:
            continue
        nuevos.append(Pronostico(
            fecha_registro=fecha, generacion=GEN_REGION, unidad=r, variable="rendidores_region",
            valor_previsto=float(n), limite_inferior=n * math.exp(qi_r), limite_superior=n * math.exp(qs_r),
            metodo=METODO, version_supuestos="persistencia def2; intervalo empírico regional sin 2020→2021",
            version_datos=VERSION_DATOS,
            motivo_correccion="variante sin el par pandémico 2020→2021 de la fila de PAES-REGULAR-2027-REGIONAL-DEF2",
        ))
    ids = registrar(registro, nuevos)
    print(f"registradas variantes sin pandemia: {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
