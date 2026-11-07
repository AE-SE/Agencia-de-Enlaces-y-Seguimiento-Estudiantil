"""Estimación regional de rendidores PAES Regular por comuna de residencia.

Supuesto (declarado): la tasa de rendición de un estudiante depende de su
colegio, no de dónde vive. Entonces:

    rendidores_estimados(c) = Σ_k  alumnos_4to(residencia c → colegio k) × tasa(k)
    tasa(k) = rendidores_regulares(colegio k) / cuarto_medio(colegio k)

Ambos términos salen de 2026: la matriz de residencia → colegio (Mineduc) y
los rendidores regulares por comuna del colegio (DEMRE, definición confirmada).

Para 2027, la cohorte por residencia se escala con el pronóstico ya registrado
(4TO-MEDIO-2027-RESIDENCIA), manteniendo la tasa de rendición de cada comuna.

No es validable directamente: DEMRE no publica la residencia de quien rinde.
Por eso el resultado se cita solo a nivel regional. El intervalo es el regional
con pandemia ya registrado, por ser el más conservador.

Uso:
    python paes_residencia_regional.py <matricula_2026.csv> <carpeta_ArchivoC> <registro.csv> <fecha>
"""

from __future__ import annotations

import csv
import math
import sys
from collections import Counter, defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from definicion_rendidor import contar_con_puntaje  # noqa: E402
from registro import Pronostico, leer, registrar  # noqa: E402

ENSENANZAS_MEDIA_NINOS = {"310", "410", "510", "610", "710", "810", "910"}
UMBRAL = 10
GENERACION = "PAES-REGULAR-2027-RESIDENCIA-REGIONAL"
METODO = "tasa-por-colegio-residencia-v1 (estimación con supuesto)"
VERSION_SUPUESTOS = "tasa de rendición por colegio aplicada a residencia; intervalo regional con pandemia"
VERSION_DATOS = "Mineduc matrícula 2026 (residencia × colegio) y DEMRE ArchivoC PAES Regular 2026 (definición confirmada)"


def region(c: str) -> str:
    return c.zfill(5)[:2]


def pares_4to(matricula: Path) -> tuple[Counter, Counter]:
    """Pares (residencia, colegio) de cuarto medio, sin suprimir nada."""
    pares: Counter = Counter()
    en_colegio: Counter = Counter()
    with matricula.open(encoding="utf-8", errors="replace", newline="") as f:
        for fila in csv.DictReader(f, delimiter=";"):
            if fila["ESTADO_ESTAB"].strip() != "1":
                continue
            if fila["COD_ENSE"].strip() not in ENSENANZAS_MEDIA_NINOS:
                continue
            if fila["COD_GRADO"].strip() != "4":
                continue
            res = fila["COD_COM_ALU"].strip().zfill(5)
            col = fila["COD_COM_RBD"].strip().zfill(5)
            pares[(res, col)] += 1
            en_colegio[col] += 1
    return pares, en_colegio


def cargar_regional_pronostico(registro: Path, unidad: str) -> float | None:
    for f in leer(registro):
        if f["generacion"] == "4TO-MEDIO-2027-RESIDENCIA" and f["unidad"] == unidad:
            return float(f["valor_previsto"])
    return None


def main(argv: list[str]) -> int:
    if len(argv) != 5:
        print(__doc__)
        return 2
    matricula, carpeta, registro, fecha = Path(argv[1]), Path(argv[2]), Path(argv[3]), argv[4]

    pares, en_colegio = pares_4to(matricula)

    archivos: dict[int, Path] = {}
    for p in carpeta.rglob("ArchivoC*.csv"):
        marca = "".join(ch for ch in p.parent.parent.name if ch.isdigit())[:4]
        if not marca or "2027" in p.parent.parent.name:
            continue
        archivos.setdefault(int(marca), p)
    rend_2026, _ = contar_con_puntaje(archivos[max(archivos)])

    # tasa por colegio (comuna del colegio)
    tasa = {k: rend_2026.get(k, 0) / en_colegio[k] for k in en_colegio if en_colegio[k] > 0}

    # estimación 2026 por comuna de residencia
    residentes_2026: Counter = Counter()
    estimado_2026: Counter = Counter()
    for (res, col), n in pares.items():
        residentes_2026[res] += n
        estimado_2026[res] += n * tasa.get(col, 0.0)

    # escalar a 2027 con el pronóstico de cohorte registrado
    estimado_2027: Counter = Counter()
    for c, est in estimado_2026.items():
        pron = cargar_regional_pronostico(registro, c)
        if pron is None or residentes_2026[c] == 0:
            continue
        estimado_2027[c] = est * pron / residentes_2026[c]

    # agregar por región de residencia
    reg_2026: Counter = Counter()
    reg_2027: Counter = Counter()
    for c, v in estimado_2026.items():
        reg_2026[region(c)] += v
    for c, v in estimado_2027.items():
        reg_2027[region(c)] += v

    # comparación 2026: estimado por residencia vs observado por colegio
    obs_colegio: Counter = Counter()
    for k, n in rend_2026.items():
        obs_colegio[region(k)] += n
    print("comparación 2026 (regional): estimado por residencia vs observado por colegio")
    for r in sorted(reg_2026):
        print(f"  región {r}: estimado {reg_2026[r]:.0f} · observado colegio {obs_colegio[r]} · "
              f"dif {100*(reg_2026[r]-obs_colegio[r])/max(obs_colegio[r],1):+.1f} %")

    # intervalo regional con pandemia ya registrado (generación DEF2)
    base = {f["unidad"]: f for f in leer(registro) if f["generacion"] == "PAES-REGULAR-2027-REGIONAL-DEF2"}
    if not base:
        print("sin intervalo regional registrado; no se registra nada")
        return 1
    ejemplo = next(iter(base.values()))
    ratio_inf = float(ejemplo["limite_inferior"]) / float(ejemplo["valor_previsto"])
    ratio_sup = float(ejemplo["limite_superior"]) / float(ejemplo["valor_previsto"])

    pronosticos = []
    for r, v in sorted(reg_2027.items()):
        if v < UMBRAL:
            continue
        pronosticos.append(Pronostico(
            fecha_registro=fecha, generacion=GENERACION, unidad=r, variable="rendidores_region_residencia",
            valor_previsto=v, limite_inferior=v * ratio_inf, limite_superior=v * ratio_sup,
            metodo=METODO, version_supuestos=VERSION_SUPUESTOS, version_datos=VERSION_DATOS,
            motivo_correccion="",
        ))
    ids = registrar(registro, pronosticos)
    print(f"regiones registradas (por residencia, estimación): {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
