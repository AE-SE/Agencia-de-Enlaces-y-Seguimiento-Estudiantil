"""Exporta las ocupaciones del explorador a lib/datos/ocupaciones-generadas.json.

Une dos archivos de datos/procesados/ (no versionados):
- onet_intereses.csv: perfil RIASEC por ocupación (O*NET 31.0, escala OI).
- ocupacion_area.csv: área SIES y número de programas de esa área.

El JSON sí se versiona: es pequeño, y el sitio lo lee sin base de datos.
Fuente y fecha van dentro del archivo. Solo biblioteca estándar de Python.
"""

import csv
import json
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
PROCESADOS = RAIZ / "procesados"
DESTINO = RAIZ.parent / "lib" / "datos" / "ocupaciones-generadas.json"
AREAS_INTERES = ["realista", "investigador", "artistico", "social", "emprendedor", "convencional"]


def main():
    with open(PROCESADOS / "onet_intereses.csv", encoding="utf-8") as f:
        perfiles = {r["codigo_onet"]: r for r in csv.DictReader(f)}
    with open(PROCESADOS / "ocupacion_area.csv", encoding="utf-8") as f:
        areas = {r["codigo_onet"]: r for r in csv.DictReader(f)}

    ocupaciones = []
    for codigo in sorted(areas):
        if codigo not in perfiles:
            continue
        a, p = areas[codigo], perfiles[codigo]
        ocupaciones.append({
            "codigo": codigo,
            "titulo": a["titulo_es"],
            "area": a["area_sies"],
            "programas_en_area": int(a["programas_en_area"]),
            "perfil": {area: float(p[area]) for area in AREAS_INTERES},
        })

    salida = {
        "fuente": {
            "ocupaciones": "O*NET 31.0 Database (agosto de 2026), USDOL/ETA, con datos de O*NET 31.0 del U.S. Department of Labor, Employment and Training Administration",
            "url": "https://www.onetcenter.org/database.html",
            "licencia": "CC BY 4.0 (https://www.onetcenter.org/license_db.html)",
            "titulos": "Traducción oficial de O*NET (taxonomía 2019), CC BY 4.0",
            "fecha_descarga": "2026-11-14",
            "fecha_exportacion": date.today().isoformat(),
            "cruce_con_carreras": "Elaboración propia (ver datos/cruce_ocupaciones_areas.py)",
        },
        "areas_interes": AREAS_INTERES,
        "ocupaciones": ocupaciones,
    }
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Ocupaciones exportadas: {len(ocupaciones)} -> {DESTINO}")


if __name__ == "__main__":
    main()
