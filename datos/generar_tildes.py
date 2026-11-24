"""Genera lib/datos/tildes.json: palabras con su tilde, para mostrar los nombres.

La oferta de Mineduc guarda los nombres en mayúsculas y sin tildes (ENFERMERIA). El DEMRE y el SIES
publican los mismos nombres con tildes. Este diccionario sale SOLO de esas dos fuentes oficiales:
  datos/procesados/demre.csv          columna «carrera» (DEMRE, Oferta definitiva 2027)
  datos/procesados/empleabilidad.csv  columnas «carrera_generica» y «carrera_titulo_ejemplo»
                                      (SIES, Buscador de Empleabilidad e Ingresos)

La columna «institucion_nombre» del SIES NO se usa: viene en mayúsculas y sin tildes (solo conserva la Ñ; igual que
Mineduc), así que no es fuente de tildes y sus formas sin tilde descartarían palabras como «educación».

Es solo presentación: la base de datos y las rutas no cambian.

Reglas para no inventar:
- Entra una palabra solo si en alguna fuente aparece CON tilde o ñ.
- Se descarta si su forma sin tilde también aparece escrita tal cual en alguna fuente (ambigua,
  p. ej. «continua» y «continúa»).
- Se descarta si tiene más de una forma con tilde.
- Solo entran palabras que aparecen en los nombres que muestra el sitio (oferta de Mineduc: carrera,
  institución y sede de `datos/procesados/oferta.csv`). Así quedan fuera las erratas de las fuentes
  («Tecnnología», «Traduccción» en el SIES), que nunca coincidirían con un nombre real.
Limitación conocida: «inglés» queda sin tilde, porque el DEMRE también lo escribe «INGLES».
Solo biblioteca estándar de Python.
"""

import csv
import json
import re
import unicodedata
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
DEMRE = RAIZ / "procesados" / "demre.csv"
EMPLEABILIDAD = RAIZ / "procesados" / "empleabilidad.csv"
OFERTA = RAIZ / "procesados" / "oferta.csv"
COLUMNAS_OFERTA = ["carrera_nombre_oficial", "institucion_nombre", "sede"]
DESTINO = RAIZ.parent / "lib" / "datos" / "tildes.json"

COLUMNAS_DEMRE = ["carrera"]
COLUMNAS_SIES = ["carrera_generica", "carrera_titulo_ejemplo"]

PALABRA = re.compile(r"[^\W\d_]+")


def sin_tilde(palabra: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", palabra) if not unicodedata.combining(c))


def construir(textos: list[str], usadas: set[str] | None = None) -> tuple[dict[str, str], list[str]]:
    """Devuelve (diccionario, palabras descartadas por ambiguas), ambos ordenados.

    Con `usadas`, solo entran las palabras (sin tilde, en minúsculas) que aparecen en esos nombres."""
    con_tilde: dict[str, set[str]] = {}
    escritas_sin_tilde: set[str] = set()
    for texto in textos:
        for palabra in PALABRA.findall(texto.lower()):
            base = sin_tilde(palabra)
            if base == palabra:
                escritas_sin_tilde.add(palabra)
            else:
                con_tilde.setdefault(base, set()).add(palabra)
    palabras: dict[str, str] = {}
    descartadas: list[str] = []
    for base in sorted(con_tilde):
        formas = con_tilde[base]
        if base in escritas_sin_tilde or len(formas) > 1:
            descartadas.append(base)
        elif usadas is not None and base not in usadas:
            continue
        else:
            palabras[base] = next(iter(formas))
    return palabras, descartadas


def leer(ruta: Path, columnas: list[str]) -> tuple[list[dict], list[str]]:
    with open(ruta, encoding="utf-8") as f:
        filas = list(csv.DictReader(f))
    return filas, [f[c] for f in filas for c in columnas if f.get(c)]


def fuente(nombre: str, filas: list[dict]) -> dict[str, str]:
    pares = {(f["url_archivo"], f["fecha_descarga"]) for f in filas}
    if len(pares) != 1:
        raise SystemExit(f"Las filas de {nombre} vienen de más de un archivo o fecha: {sorted(pares)}")
    url, fecha = pares.pop()
    return {"nombre": nombre, "url": url, "fecha_consulta": fecha}


def main() -> None:
    filas_demre, textos_demre = leer(DEMRE, COLUMNAS_DEMRE)
    filas_sies, textos_sies = leer(EMPLEABILIDAD, COLUMNAS_SIES)
    _, textos_oferta = leer(OFERTA, COLUMNAS_OFERTA)
    usadas = {sin_tilde(p) for t in textos_oferta for p in PALABRA.findall(t.lower())}
    palabras, descartadas = construir(textos_demre + textos_sies, usadas)
    salida = {
        "fuentes": [
            fuente("DEMRE, Oferta definitiva de carreras, vacantes y ponderaciones 2027", filas_demre),
            fuente("SIES (Mineduc), Mi Futuro: Buscador de Empleabilidad e Ingresos 2025-2026", filas_sies),
        ],
        "generado": date.today().isoformat(),
        "que_es": "Palabras de los nombres de carreras e instituciones con su tilde, tomadas solo de las fuentes. Es solo presentación.",
        "palabras": palabras,
    }
    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"Palabras: {len(palabras)}; descartadas por ambiguas: {len(descartadas)} -> {DESTINO}")
    print("Descartadas:", ", ".join(descartadas))


if __name__ == "__main__":
    main()
