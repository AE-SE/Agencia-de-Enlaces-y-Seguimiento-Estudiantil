"""Convierte las fuentes del ZIP de Google Fonts y comprueba los archivos publicados.

Preparación: python -m pip install -r scripts/requirements-fuentes.txt
Generación: python scripts/fuentes.py ruta/al/archivo.zip
Verificación: python scripts/fuentes.py --check
"""
import argparse
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "public" / "fuentes"
FUENTES = (
    ("Next", "Regular", "atkinson-next-400.woff2", 400),
    ("Next", "Bold", "atkinson-next-700.woff2", 700),
    ("Mono", "Regular", "atkinson-mono-400.woff2", 400),
)
CARACTERES = "áéíóúÁÉÍÓÚüÜñÑ¿¡«»$" + "".join(chr(i) for i in range(32, 127))


def verificar() -> None:
    total = 0
    for familia, _, archivo, peso in FUENTES:
        ruta = DESTINO / archivo
        with TTFont(ruta) as fuente:
            if fuente.flavor != "woff2":
                raise ValueError(f"{archivo}: el formato no es WOFF2")
            if fuente["name"].getDebugName(1) != f"Atkinson Hyperlegible {familia}":
                raise ValueError(f"{archivo}: familia incorrecta")
            if fuente["OS/2"].usWeightClass != peso:
                raise ValueError(f"{archivo}: peso incorrecto")
            faltantes = sorted(set(CARACTERES) - set(map(chr, fuente.getBestCmap())))
            if faltantes:
                raise ValueError(f"{archivo}: faltan {faltantes}")
            if familia == "Mono":
                avances = {fuente["hmtx"][fuente.getBestCmap()[ord(c)]][0] for c in "0123456789"}
                if len(avances) != 1:
                    raise ValueError(f"{archivo}: los dígitos no tienen ancho uniforme")
        total += ruta.stat().st_size
        print(f"[ok] {archivo}: {ruta.stat().st_size} bytes; caracteres y peso correctos")
    if total >= 100_000:
        raise ValueError(f"Las fuentes suman {total} bytes: deben pesar menos de 100 KB")
    print(f"[ok] Las tres fuentes suman {total} bytes, menos de 100 KB")


def generar(archivo_zip: Path) -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    with ZipFile(archivo_zip) as paquete:
        for familia, variante, archivo, _ in FUENTES:
            nombre = f"Atkinson_Hyperlegible_{familia}/static/AtkinsonHyperlegible{familia}-{variante}.ttf"
            with TTFont(BytesIO(paquete.read(nombre)), recalcTimestamp=False) as fuente:
                # Se conserva la cobertura completa; no es necesario recortar caracteres.
                fuente.flavor = "woff2"
                fuente.save(DESTINO / archivo)
        licencias = [paquete.read(f"Atkinson_Hyperlegible_{f}/OFL.txt") for f in ("Next", "Mono")]
        # Cada texto conserva su aviso de autoría y la licencia completa.
        (DESTINO / "LICENCIA-OFL.txt").write_bytes(b"\n\n".join(licencias))
    verificar()


if __name__ == "__main__":
    argumentos = argparse.ArgumentParser(description=__doc__)
    argumentos.add_argument("zip", type=Path, nargs="?")
    argumentos.add_argument("--check", action="store_true")
    opciones = argumentos.parse_args()
    if opciones.check:
        verificar()
    elif opciones.zip:
        generar(opciones.zip)
    else:
        argumentos.error("Indica el ZIP de las fuentes o usa --check")
