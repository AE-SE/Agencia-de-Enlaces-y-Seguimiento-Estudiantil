#!/usr/bin/env python3
"""Extrae del índice de la «Oferta definitiva de carreras» del DEMRE los nombres de las universidades, con sus tildes.

Para qué: `generar_tildes.py` solo tenía nombres de carreras como fuente de tildes, y la oferta de Mineduc y el SIES
escriben los nombres de las instituciones sin tildes. El índice del DEMRE (página 2) los publica con tilde:
«PONTIFICIA UNIVERSIDAD CATÓLICA DE CHILE», «UNIVERSIDAD DE CONCEPCIÓN». Es solo presentación.

Entrada: el PDF oficial (https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf).
Salida (no se sube a git): datos/procesados/demre_universidades.csv, una fila por universidad.

Uso:
    python3 -m pip install -r scripts/requirements.txt      # necesita pypdf
    python3 datos/extraer_universidades_demre.py \\
        datos/crudos/demre/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf --fecha-descarga 2026-11-24

Si el índice no trae una lista numerada de 1 a N sin saltos, se detiene: no se adivina un nombre.
"""

import argparse
import csv
import re
import sys
from pathlib import Path

URL = "https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf"
DESTINO = Path(__file__).resolve().parent / "procesados" / "demre_universidades.csv"
PAGINAS_INDICE = 3  # el índice está en la página 2; se miran las primeras por si cambia de lugar

# «1 PONTIFICIA UNIVERSIDAD CATÓLICA DE CHILE 16»: número, nombre y página de inicio.
FILA = re.compile(r"^(\d{1,2}) ((?:PONTIFICIA )?UNIVERSIDAD .+?) (\d{1,3})$")


def universidades(texto: str) -> list[str]:
    """Nombres del índice, en orden. Falla si la numeración no va de 1 a N sin saltos."""
    nombres = []
    for linea in texto.splitlines():
        # pypdf separa las palabras con tabuladores y espacios mezclados.
        fila = FILA.match(" ".join(linea.split()))
        if fila:
            nombres.append((int(fila.group(1)), fila.group(2)))
    numeros = [n for n, _ in nombres]
    if not nombres or numeros != list(range(1, len(nombres) + 1)):
        raise SystemExit(f"El índice no trae una lista numerada de 1 a N: {numeros}")
    return [nombre for _, nombre in nombres]


def main(argv=None) -> None:
    args = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    args.add_argument("pdf", type=Path)
    args.add_argument("--fecha-descarga", required=True, help="AAAA-MM-DD, la del registro de descargas")
    opciones = args.parse_args(argv)
    try:
        from pypdf import PdfReader
    except ImportError:
        sys.exit("Error: falta pypdf. Instálalo con: python3 -m pip install -r scripts/requirements.txt")

    lector = PdfReader(opciones.pdf)
    texto = "\n".join(lector.pages[i].extract_text() or "" for i in range(min(PAGINAS_INDICE, len(lector.pages))))
    nombres = universidades(texto)
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    with open(DESTINO, "w", encoding="utf-8", newline="") as f:
        escritor = csv.writer(f)
        escritor.writerow(["numero", "institucion", "url_archivo", "fecha_descarga"])
        for i, nombre in enumerate(nombres, start=1):
            escritor.writerow([i, nombre, URL, opciones.fecha_descarga])
    print(f"Universidades: {len(nombres)} -> {DESTINO}")


if __name__ == "__main__":
    main()
