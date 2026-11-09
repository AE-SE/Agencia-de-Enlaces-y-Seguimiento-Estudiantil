"""Matrícula de cuarto medio por comuna, desde el archivo oficial de matrícula por estudiante.

El archivo tiene un registro por estudiante, con RUN y datos personales. Este
script lee en streaming y solo guarda conteos agregados por comuna, enseñanza
y grado. No conserva ningún dato individual ni identificador.

Códigos (Anexo V del diccionario oficial de matrícula 2026):
- COD_ENSE de enseñanza media niños y jóvenes: 310 (H-C), 410, 510, 610, 710, 810, 910 (técnicas y artísticas).
- COD_GRADO 4 = 4° medio.

Uso:
    python agregar_cuarto_medio.py <matricula.csv> <salida.csv>
"""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path

ENSENANZAS_MEDIA_NINOS = {"310", "410", "510", "610", "710", "810", "910"}
GRADO_CUARTO = "4"


def codigo_comuna(valor: str) -> str:
    return str(valor).strip().zfill(5)


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    entrada, salida = Path(argv[1]), Path(argv[2])
    conteo: Counter = Counter()
    nombres: dict[str, str] = {}
    total_leidos = 0
    with entrada.open(encoding="utf-8", errors="replace", newline="") as f:
        for fila in csv.DictReader(f, delimiter=";"):
            total_leidos += 1
            if fila["ESTADO_ESTAB"].strip() != "1":
                continue
            ens = fila["COD_ENSE"].strip()
            if ens not in ENSENANZAS_MEDIA_NINOS:
                continue
            comuna = codigo_comuna(fila["COD_COM_RBD"])
            nombres[comuna] = fila["NOM_COM_RBD"].strip()
            if fila["COD_GRADO"].strip() == GRADO_CUARTO:
                conteo[comuna] += 1
            else:
                conteo[comuna] += 0  # registra la comuna aunque no tenga cuarto medio

    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as f:
        escritor = csv.DictWriter(f, fieldnames=["codigo_comuna", "comuna", "cuarto_medio_2026"])
        escritor.writeheader()
        for comuna in sorted(conteo):
            escritor.writerow(
                {"codigo_comuna": comuna, "comuna": nombres.get(comuna, ""), "cuarto_medio_2026": conteo[comuna]}
            )
    print(f"registros leídos: {total_leidos} · comunas: {len(conteo)} · cuarto medio total: {sum(conteo.values())}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
