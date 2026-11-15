"""Plantilla versionada de descripciones por grupo de carrera (ADR 0035).

Crea o actualiza `datos/descripciones_grupos.csv` con una fila por grupo
(carrera genérica oficial). Las filas que ya existen conservan sus textos,
rotulado y revisión: el script solo agrega grupos nuevos y avisa de los que
ya no aparecen en la oferta.

Los textos no se generan aquí. Cada descripción empieza en estado «pendiente»
y no se publica hasta que un profesional del área la revise (AGENTS.md 2.4 y
ADR 0035, decisión 4).

Uso:
    python3 datos/generar_plantilla_descripciones.py [ruta/a/oferta.csv]
"""

from __future__ import annotations

import csv
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from generar_grupos_carrera import construir  # noqa: E402

RAIZ = pathlib.Path(__file__).resolve().parent.parent
OFERTA_POR_OMISION = RAIZ / "datos" / "procesados" / "oferta.csv"
SALIDA = RAIZ / "datos" / "descripciones_grupos.csv"

COLUMNAS = [
    "grupo",
    "programas",
    "que_estudia",
    "que_hace_al_egresar",
    "titulos_parecidos",
    "rotulo",
    "fuente_url",
    "fecha_fuente",
    "revisado_por",
    "fecha_revision",
    "estado",
]


def combinar(existentes: dict[str, dict], grupos: dict) -> tuple[list[dict], list[str], list[str]]:
    """Devuelve (filas, nuevos, ausentes). Conserva los textos ya escritos."""
    filas: list[dict] = []
    nuevos: list[str] = []
    for grupo in sorted(grupos):
        conteo = grupos[grupo]["programas"]
        if grupo in existentes:
            fila = dict(existentes[grupo])
            fila["programas"] = str(conteo)
        else:
            fila = {c: "" for c in COLUMNAS}
            fila.update({"grupo": grupo, "programas": str(conteo), "estado": "pendiente"})
            nuevos.append(grupo)
        filas.append(fila)
    ausentes = sorted(set(existentes) - set(grupos))
    # Los grupos ausentes se conservan tal cual: no se borra un texto revisado.
    filas.extend(dict(existentes[g]) for g in ausentes)
    return filas, nuevos, ausentes


def leer_existentes(ruta: pathlib.Path) -> dict[str, dict]:
    if not ruta.exists():
        return {}
    with ruta.open(encoding="utf-8", newline="") as fh:
        return {r["grupo"]: r for r in csv.DictReader(fh)}


def main() -> int:
    oferta = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else OFERTA_POR_OMISION
    with oferta.open(encoding="utf-8", newline="") as fh:
        filas_oferta = list(csv.DictReader(fh))

    grupos, _ = construir(filas_oferta)
    existentes = leer_existentes(SALIDA)
    filas, nuevos, ausentes = combinar(existentes, grupos)

    with SALIDA.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=COLUMNAS)
        w.writeheader()
        w.writerows(filas)

    print(f"grupos en la oferta: {len(grupos)}")
    print(f"grupos nuevos en la plantilla: {len(nuevos)}")
    if ausentes:
        print(f"grupos que ya no aparecen en la oferta (se conservan): {len(ausentes)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
