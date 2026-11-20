"""Prepara la muestra N2 de vacantes y arancel desde la Oferta Académica 2026 original."""

import argparse
import csv
from datetime import date
from decimal import Decimal
from pathlib import Path
from random import Random

from cargar_empleabilidad import leer_hoja

FUENTE = "SIES (Mineduc), Oferta Académica 2026"
URL = "https://www.mifuturo.cl/wp-content/uploads/2026/06/Oferta_Academica_2026_SIES_05_06_2026_WEB_E.xlsx"
SALIDA = Path("datos/procesados/muestra_oferta_sies_2026.csv")
COLUMNAS = {
    "codigo_sies": "Código Único",
    "institucion": "Nombre IES",
    "carrera": "Nombre Carrera",
    "sede": "Nombre Sede",
    "jornada": "Jornada",
    "vacantes_semestre_uno": "Vacantes Semestre Uno",
    "vacantes_semestre_dos": "Vacantes Semestre Dos",
    "formato_arancel": "Formato Valor",
    "arancel_anual": "Arancel Anual",
}


def extraer_muestra(filas, fecha_descarga):
    encabezado, *datos = filas
    posiciones = {campo: encabezado.index(titulo) for campo, titulo in COLUMNAS.items()}
    nivel = encabezado.index("Nivel Global")
    candidatas = {}

    for numero, fila in enumerate(datos, start=2):
        if nivel >= len(fila) or fila[nivel] != "Pregrado":
            continue
        valores = {campo: fila[i] if i < len(fila) else None for campo, i in posiciones.items()}
        codigo = valores["codigo_sies"]
        if not isinstance(codigo, str) or not codigo.strip():
            raise ValueError(f"Falta el código único en la fila {numero}")
        if codigo in candidatas:
            raise ValueError(f"Código único repetido en pregrado: {codigo}")
        vacantes = (valores["vacantes_semestre_uno"], valores["vacantes_semestre_dos"])
        arancel = valores["arancel_anual"]
        formato = valores["formato_arancel"]
        candidatas[codigo] = None
        # La muestra exige datos contrastables de ambos campos, incluidos los ceros explícitos por semestre.
        if (
            all(isinstance(v, Decimal) and v >= 0 and v == v.to_integral_value() for v in vacantes)
            and any(vacantes)
            and isinstance(arancel, Decimal) and arancel > 0
            and formato in {"Monto en Pesos", "Monto en UF"}
        ):
            candidatas[codigo] = {
                "fila_xlsx": numero,
                **valores,
                "fuente": FUENTE,
                "url": URL,
                "periodo": "Oferta 2026",
                "fecha_descarga": fecha_descarga.isoformat(),
            }

    disponibles = sorted(codigo for codigo, fila in candidatas.items() if fila is not None)
    if len(disponibles) < 10:
        raise ValueError("Hay menos de diez variantes de pregrado con vacantes y arancel verificables.")
    return [candidatas[codigo] for codigo in Random(20261120).sample(disponibles, 10)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archivo", type=Path)
    parser.add_argument("--fecha-descarga", type=date.fromisoformat, required=True)
    args = parser.parse_args()

    muestra = extraer_muestra(leer_hoja(args.archivo, "in"), args.fecha_descarga)
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    with SALIDA.open("w", encoding="utf-8", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=muestra[0])
        escritor.writeheader()
        escritor.writerows(muestra)
    print(f"{len(muestra)} variantes de pregrado en {SALIDA}")


if __name__ == "__main__":
    main()
