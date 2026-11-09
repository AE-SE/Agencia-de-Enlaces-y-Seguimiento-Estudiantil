"""Tabla agregada de rendidores PAES por comuna, con supresión de celdas pequeñas.

Lee los archivos de inscripción (B) y de rendición (C) de DEMRE y produce un
conteo por comuna. No guarda ningún dato individual: ni ingreso, ni sexo, ni
notas, ni identificadores. Las comunas con menos de UMBRAL rendidores quedan
suprimidas en la salida (sin cifra), según la regla de AGENTS.md 2.2.

Uso:
    python agregar_paes.py <archivo_B.csv> <archivo_C.csv> <anexo.xlsx> <salida.csv>
"""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path

UMBRAL = 10  # mínimo de rendidores para publicar una comuna


def codigo_comuna(valor: str) -> str:
    """Los archivos traen el código sin el cero inicial (6301); el anexo usa 06301."""
    return str(valor).strip().zfill(5)


def nombres_comunas(anexo: Path) -> dict[str, tuple[str, str]]:
    """Mapea código de comuna a (región, nombre) desde el anexo oficial de DEMRE."""
    import openpyxl

    wb = openpyxl.load_workbook(anexo, read_only=True, data_only=True)
    ws = wb["Anexo - Region-Provincia-Comuna"]
    salida: dict[str, tuple[str, str]] = {}
    for fila in ws.iter_rows(values_only=True):
        vals = [v for v in fila if v is not None]
        if len(vals) >= 6 and str(vals[-2]).isdigit() and len(str(vals[-2])) == 5:
            salida[str(vals[-2])] = (str(vals[1]), str(vals[-1]))
    return salida


def contar_rendidores(archivo_c: Path) -> Counter:
    """Cuenta filas de rendición por comuna. No conserva nada más."""
    conteo: Counter = Counter()
    with archivo_c.open(encoding="utf-8", newline="") as f:
        for fila in csv.DictReader(f, delimiter=";"):
            conteo[codigo_comuna(fila["CODIGO_COMUNA"])] += 1
    return conteo


def construir_tabla(conteo: Counter, nombres: dict[str, tuple[str, str]]) -> list[dict[str, str]]:
    filas = []
    for codigo in sorted(conteo):
        region, nombre = nombres.get(codigo, ("", "NO EN ANEXO"))
        n = conteo[codigo]
        suprimido = n < UMBRAL
        filas.append(
            {
                "codigo_comuna": codigo,
                "comuna": nombre,
                "region": region,
                "rendidores": "" if suprimido else str(n),
                "estado": "suprimido" if suprimido else "publicable",
            }
        )
    return filas


def main(argv: list[str]) -> int:
    if len(argv) != 5:
        print(__doc__)
        return 2
    archivo_b, archivo_c, anexo, salida = (Path(a) for a in argv[1:])
    conteo = contar_rendidores(archivo_c)
    tabla = construir_tabla(conteo, nombres_comunas(anexo))
    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as f:
        escritor = csv.DictWriter(
            f, fieldnames=["codigo_comuna", "comuna", "region", "rendidores", "estado"]
        )
        escritor.writeheader()
        escritor.writerows(tabla)
    suprimidas = sum(1 for t in tabla if t["estado"] == "suprimido")
    print(f"comunas: {len(tabla)} · suprimidas (<{UMBRAL}): {suprimidas}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
