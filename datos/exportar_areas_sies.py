"""Exporta el área del SIES de cada carrera genérica a lib/datos/areas-sies.json.

Fuente: columna «área» del Buscador de Empleabilidad e Ingresos 2025-2026 del
SIES (datos/procesados/empleabilidad.csv, que arma cargar_empleabilidad.py).
Es un dato oficial: el SIES asigna una sola área a cada carrera genérica. No
se infiere ninguna área por el nombre: una carrera genérica que el SIES no
publica (por ejemplo «Otras ingenierías») queda sin área.

La clave es el nombre normalizado con la misma regla que la base
(programa_generico.nombre_normalizado), para que el exportador de la oferta
la cruce sin otra normalización. El JSON se versiona: es pequeño y el sitio lo
lee sin base de datos. Solo biblioteca estándar de Python.
"""

import csv
import json
from pathlib import Path

from generar_lotes import normalizar

RAIZ = Path(__file__).resolve().parent
ORIGEN = RAIZ / "procesados" / "empleabilidad.csv"
DESTINO = RAIZ.parent / "lib" / "datos" / "areas-sies.json"


def areas_por_generica(filas: list[dict]) -> dict[str, str]:
    """Área de cada carrera genérica. Falla si una genérica trae dos áreas distintas."""
    areas: dict[str, str] = {}
    for fila in filas:
        generica = normalizar(fila["carrera_generica"])
        area = " ".join(fila["area"].split())
        if not generica or not area:
            continue
        if areas.setdefault(generica, area) != area:
            raise SystemExit(f"La carrera genérica «{generica}» trae dos áreas: {areas[generica]} y {area}")
    return dict(sorted(areas.items()))


def fuente_unica(filas: list[dict]) -> dict[str, str]:
    """URL y fecha de descarga del archivo. Falla si las filas no vienen de un solo archivo."""
    pares = {(f["url_archivo"], f["fecha_descarga"]) for f in filas}
    if len(pares) != 1:
        raise SystemExit(f"Las filas vienen de más de un archivo o fecha: {sorted(pares)}")
    url, fecha = pares.pop()
    return {"fuente": "Mi Futuro", "url": url, "fecha_consulta": fecha}


def main() -> None:
    with open(ORIGEN, encoding="utf-8") as f:
        filas = list(csv.DictReader(f))
    salida = {
        **fuente_unica(filas),
        "que_es": "Área de conocimiento que el SIES asigna a cada carrera genérica en el Buscador de Empleabilidad e Ingresos 2025-2026.",
        "areas": areas_por_generica(filas),
    }
    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"Áreas exportadas: {len(salida['areas'])} carreras genéricas -> {DESTINO}")


if __name__ == "__main__":
    main()
