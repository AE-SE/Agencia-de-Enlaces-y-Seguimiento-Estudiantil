"""Cuenta colisiones en la salida agregada del cargador de oferta.

Uso:
  python3 datos/diagnosticos/contar_colisiones_oferta.py datos/procesados/oferta.csv
"""

import argparse
import csv
import json
from collections import defaultdict
from pathlib import Path


COLUMNAS = (
    "institucion_codigo",
    "sede",
    "carrera_codigo",
    "carrera_nombre_oficial",
    "jornada",
    "codigo_sies",
)
COLUMNAS_PERSONALES = {"id", "mrun", "gen_alu", "fec_nac_alu", "rango_edad"}
SALIDA_PREDETERMINADA = Path("datos/diagnosticos/salidas/colisiones_oferta.json")


def contar(archivo):
    lector = csv.reader(archivo)
    encabezado = next(lector, None)
    if encabezado is None:
        raise ValueError("el CSV está vacío")
    personales = sorted(COLUMNAS_PERSONALES.intersection(encabezado))
    if personales:
        raise ValueError("la entrada contiene columnas personales: " + ", ".join(personales))

    faltantes = [columna for columna in COLUMNAS if columna not in encabezado]
    if faltantes:
        raise ValueError("faltan columnas requeridas: " + ", ".join(faltantes))

    indices = [encabezado.index(columna) for columna in COLUMNAS]
    codigos_carrera = defaultdict(set)
    codigos_sies = defaultdict(set)

    for numero, fila in enumerate(lector, start=2):
        if len(fila) != len(encabezado):
            raise ValueError(f"la fila {numero} tiene {len(fila)} columnas; se esperaban {len(encabezado)}")
        institucion, sede, cod_carrera, nombre, jornada, codigo_sies = (
            fila[indice].strip() for indice in indices
        )
        codigos_carrera[(institucion, nombre)].add(cod_carrera)
        codigos_sies[(institucion, nombre, sede, jornada)].add(codigo_sies)

    return {
        "grupos_con_nombre_repetido": sum(len(codigos) > 1 for codigos in codigos_carrera.values()),
        "grupos_con_varios_codigos_sies": sum(len(codigos) > 1 for codigos in codigos_sies.values()),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("entrada", help="datos/procesados/oferta.csv")
    parser.add_argument("--salida", type=Path, default=SALIDA_PREDETERMINADA)
    args = parser.parse_args()

    with open(args.entrada, encoding="utf-8-sig", newline="") as archivo:
        resumen = contar(archivo)

    args.salida.parent.mkdir(parents=True, exist_ok=True)
    args.salida.write_text(json.dumps(resumen, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Diagnóstico escrito en {args.salida}")
    print(json.dumps(resumen, ensure_ascii=False))


if __name__ == "__main__":
    main()
