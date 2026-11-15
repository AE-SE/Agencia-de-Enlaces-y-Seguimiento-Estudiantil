"""Extrae el perfil de intereses RIASEC por ocupación desde O*NET 31.0.

Fuente: O*NET 31.0 Database (agosto de 2026), archivo de texto
`datos/crudos/db_31_0_text.zip`, descargado el 2026-11-14 desde
https://www.onetcenter.org/dl_files/database/db_31_0_text.zip.
Licencia: CC BY 4.0 (https://www.onetcenter.org/license_db.html).
Atribución: «con datos de O*NET 31.0 del U.S. Department of Labor,
Employment and Training Administration (USDOL/ETA)».

Títulos en español: de la traducción oficial de O*NET (taxonomía O*NET-SOC
2019, noviembre de 2020), `datos/crudos/spanish_taxonomy.zip`, descargada
el 2026-11-14 desde https://www.onetcenter.org/dl_files/2019/spanish_taxonomy.zip.
Las ocupaciones sin título en español quedan con el título en inglés y se
marcan en el reporte.

Salida: datos/procesados/onet_intereses.csv y onet_intereses_meta.json.
Solo biblioteca estándar de Python (sin dependencias nuevas).

Usa la escala OI (intereses ocupacionales, 1 a 7) de «Career Interest Types».
Las ocupaciones sin las seis áreas completas se descartan y se cuentan
en el reporte, para no mostrar un perfil incompleto.
"""

import csv
import json
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
ZIP = RAIZ / "crudos" / "db_31_0_text.zip"
ZIP_ES = RAIZ / "crudos" / "spanish_taxonomy.zip"
SALIDA = RAIZ / "procesados"
PREFIJO = "db_31_0_text/"
PREFIJO_ES = "spanish_taxonomy/"

AREAS = {
    "Realistic": "realista",
    "Investigative": "investigador",
    "Artistic": "artistico",
    "Social": "social",
    "Enterprising": "emprendedor",
    "Conventional": "convencional",
}
ESCALA_MIN, ESCALA_MAX = 1, 7


def leer(z, nombre):
    return z.read(PREFIJO + nombre).decode("utf-8", "replace").splitlines()


def main():
    SALIDA.mkdir(exist_ok=True)
    with zipfile.ZipFile(ZIP) as z:
        titulos = {}
        for linea in leer(z, "Occupation Data.txt")[1:]:
            if not linea.strip():
                continue
            codigo, titulo, _ = (linea.split("\t") + [""])[:3]
            titulos[codigo] = titulo

        perfiles = {}
        for linea in leer(z, "Career Interest Types.txt")[1:]:
            if not linea.strip():
                continue
            codigo, _, nombre, escala, valor, _, _ = (linea.split("\t") + [""] * 3)[:7]
            if escala != "OI" or nombre not in AREAS:
                continue
            perfiles.setdefault(codigo, {})[AREAS[nombre]] = float(valor)

    with zipfile.ZipFile(ZIP_ES) as z:
        titulos_es = {}
        for linea in z.read(PREFIJO_ES + "Occupation Data Translations.txt").decode("utf-8", "replace").splitlines()[1:]:
            partes = linea.split("\t")
            if len(partes) >= 3 and partes[0].strip() and partes[2].strip():
                titulos_es[partes[0]] = partes[2]

    completas = {
        c: p for c, p in perfiles.items()
        if len(p) == len(AREAS) and all(ESCALA_MIN <= v <= ESCALA_MAX for v in p.values())
    }
    descartadas = len(perfiles) - len(completas)
    sin_traduccion = [c for c in completas if c not in titulos_es]

    columnas = ["codigo_onet", "titulo_es", "titulo_en"] + list(AREAS.values())
    with open(SALIDA / "onet_intereses.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(columnas)
        for codigo in sorted(completas):
            p = completas[codigo]
            w.writerow([codigo, titulos_es.get(codigo, ""), titulos.get(codigo, "")] + [p[a] for a in AREAS.values()])

    meta = {
        "fuente": "O*NET 31.0 Database (agosto de 2026), archivo Career Interest Types",
        "url": "https://www.onetcenter.org/dl_files/database/db_31_0_text.zip",
        "fecha_descarga": "2026-11-14",
        "licencia": "CC BY 4.0 (https://www.onetcenter.org/license_db.html)",
        "atribucion": "con datos de O*NET 31.0 del U.S. Department of Labor, Employment and Training Administration (USDOL/ETA)",
        "escala": "OI, intereses ocupacionales, 1 a 7",
        "ocupaciones_con_perfil_completo": len(completas),
        "ocupaciones_descartadas_incompletas": descartadas,
        "titulos_es": {
            "fuente": "O*NET Spanish Translation of the O*NET-SOC Taxonomy (taxonomía 2019, noviembre de 2020)",
            "url": "https://www.onetcenter.org/dl_files/2019/spanish_taxonomy.zip",
            "fecha_descarga": "2026-11-14",
            "licencia": "CC BY 4.0 (https://www.onetcenter.org/license_db.html, que cubre Spanish Language Resources)",
            "ocupaciones_sin_titulo_es": len(sin_traduccion),
        },
        "elaboracion": "Extracción directa, sin cálculos propios. Títulos en español de la traducción oficial de O*NET; los que faltan quedan en inglés.",
    }
    with open(SALIDA / "onet_intereses_meta.json", "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f"Ocupaciones con perfil completo: {len(completas)}")
    print(f"Descartadas por perfil incompleto: {descartadas}")


if __name__ == "__main__":
    main()
