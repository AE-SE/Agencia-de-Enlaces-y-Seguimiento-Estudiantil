"""Matriz de origen y destino de cuarto medio 2026: comuna de residencia → comuna del colegio.

Lee en streaming el archivo oficial de matrícula por estudiante. Solo guarda
conteos agregados por par (residencia, colegio). Las celdas con menos de UMBRAL
estudiantes se suprimen, y las comunas sin estudiantes no aparecen.

Para cada comuna resume:
- residentes_en_cuarto: estudiantes de cuarto medio que viven en la comuna;
- en_colegio_local: de ellos, los que estudian en la misma comuna;
- entrada: estudiantes que estudian en la comuna pero viven en otra;
- salida: residentes que estudian fuera de la comuna.

Uso:
    python agregar_origen_destino.py <matricula.csv> <salida_matriz.csv> <salida_resumen.csv>
"""

from __future__ import annotations

import csv
import sys
from collections import Counter, defaultdict
from pathlib import Path

ENSENANZAS_MEDIA_NINOS = {"310", "410", "510", "610", "710", "810", "910"}
GRADO_CUARTO = "4"
UMBRAL = 10


def codigo(valor: str) -> str:
    return str(valor).strip().zfill(5)


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__)
        return 2
    entrada, salida_matriz, salida_resumen = (Path(a) for a in argv[1:])
    pares: Counter = Counter()
    nombre: dict[str, str] = {}
    with entrada.open(encoding="utf-8", errors="replace", newline="") as f:
        for fila in csv.DictReader(f, delimiter=";"):
            if fila["ESTADO_ESTAB"].strip() != "1":
                continue
            if fila["COD_ENSE"].strip() not in ENSENANZAS_MEDIA_NINOS:
                continue
            if fila["COD_GRADO"].strip() != GRADO_CUARTO:
                continue
            residencia = codigo(fila["COD_COM_ALU"])
            colegio = codigo(fila["COD_COM_RBD"])
            nombre[residencia] = fila["NOM_COM_ALU"].strip() or nombre.get(residencia, "")
            nombre[colegio] = fila["NOM_COM_RBD"].strip() or nombre.get(colegio, "")
            pares[(residencia, colegio)] += 1

    # Matriz con supresión de celdas pequeñas
    salida_matriz.parent.mkdir(parents=True, exist_ok=True)
    with salida_matriz.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["codigo_residencia", "residencia", "codigo_colegio", "colegio", "estudiantes", "estado"])
        for (res, col), n in sorted(pares.items()):
            if n < UMBRAL:
                w.writerow([res, nombre.get(res, ""), col, nombre.get(col, ""), "", "suprimido"])
            else:
                w.writerow([res, nombre.get(res, ""), col, nombre.get(col, ""), n, "publicable"])

    # Resumen por comuna (sobre totales, los totales no revelan individuos)
    residentes: Counter = Counter()
    local: Counter = Counter()
    entrada_cnt: Counter = Counter()
    for (res, col), n in pares.items():
        residentes[res] += n
        if res == col:
            local[res] += n
        else:
            entrada_cnt[col] += n
    comunas = sorted(set(residentes) | set(entrada_cnt))
    with salida_resumen.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["codigo_comuna", "comuna", "residentes_en_cuarto", "en_colegio_local", "entrada", "salida"])
        for c in comunas:
            w.writerow([
                c,
                nombre.get(c, ""),
                residentes[c],
                local[c],
                entrada_cnt[c],
                residentes[c] - local[c],
            ])
    total = sum(pares.values())
    print(f"cuarto medio total: {total} · pares: {len(pares)} · comunas: {len(comunas)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
