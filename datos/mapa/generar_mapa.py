"""Genera el JSON del mapa de carreras por región (elaboración propia, ADR 0036).

Entradas: matrícula de primer año observada (cobertura_entrada_sede.csv, año más
reciente) por código SIES de la carrera. Solo cuentan las filas con cobertura
verificada (cubierto = 1). La región sale de oferta.csv.
Empleabilidad: SIES, al primer año, por institución y carrera genérica
(empleabilidad.csv); se pondera por entradas de cada sede. Las zonas con menos
de 10 entradas no muestran cifra (ADR 0025, opción B).

Uso (desde la raíz del repositorio):
  python datos/mapa/generar_mapa.py --procesados <carpeta datos/procesados>

Salida: lib/datos/mapa/carreras-regiones.json (sin nombres de instituciones ni sedes).
Los datos procesados no están en el repositorio: se regeneran con los scripts de datos/.
"""
import csv
import json
import statistics
import unicodedata
from collections import defaultdict
from pathlib import Path

import argparse

RAIZ = Path(__file__).resolve().parents[2]
PROC = RAIZ / "datos" / "procesados"
DIR_MAPA = RAIZ / "datos" / "mapa"
SALIDA = RAIZ / "lib" / "datos" / "mapa" / "carreras-regiones.json"
UMBRAL = 10

# Nombre corto de región en oferta.csv (sin tildes) -> código CUT, igual que regiones.geojson.
CODIGO_REGION = {
    "arica y parinacota": "15", "tarapaca": "01", "antofagasta": "02", "atacama": "03",
    "coquimbo": "04", "valparaiso": "05", "metropolitana": "13",
    "lib. gral. b. o'higgins": "06", "maule": "07", "biobio": "08", "nuble": "16",
    "la araucania": "09", "los rios": "14", "los lagos": "10", "aysen": "11",
    "magallanes": "12",
}

def clave(texto):
    sin_tildes = "".join(c for c in unicodedata.normalize("NFKD", texto) if not unicodedata.combining(c))
    return sin_tildes.strip().lower()

def leer(nombre):
    with open(PROC / nombre, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

def celda():
    return {"n": 0, "ponderado": 0.0, "peso_emp": 0}

def sumar(celda_, n, emp):
    celda_["n"] += n
    if emp is not None:
        celda_["ponderado"] += emp * n
        celda_["peso_emp"] += n

def cifras(celda_):
    """Entradas y empleabilidad de una celda, con la regla de supresión."""
    if celda_["n"] == 0:
        return None
    publica = celda_["n"] >= UMBRAL
    emp = round(celda_["ponderado"] / celda_["peso_emp"], 1) if publica and celda_["peso_emp"] > 0 else None
    return {
        "entradas": celda_["n"] if publica else None,
        "entradas_estado": "publicable" if publica else "menos_de_10",
        "empleabilidad_pct": emp,
        "cobertura_empleabilidad_pct": round(100 * celda_["peso_emp"] / celda_["n"], 1) if publica else None,
    }

def main():
    global PROC, SALIDA
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--procesados", type=Path, default=PROC, help="carpeta con cobertura, oferta y empleabilidad")
    parser.add_argument("--salida", type=Path, default=SALIDA)
    args = parser.parse_args()
    PROC, SALIDA = args.procesados, args.salida

    oferta = {}
    for r in leer("oferta.csv"):
        oferta.setdefault(r["codigo_sies"], r)

    emp = {}
    fuente_emp = None
    for r in leer("empleabilidad.csv"):
        v = r["empleabilidad_1er_anio_pct"]
        if v:
            emp[(r["sies_institucion_codigo"], r["carrera_generica"])] = float(v)
            fuente_emp = fuente_emp or (r["fuente"], r["url_archivo"], r["periodo_empleabilidad_1er_anio"])

    cob = leer("cobertura_entrada_sede.csv")
    anio = max(int(r["anio"]) for r in cob)
    por_region = defaultdict(lambda: defaultdict(celda))   # carrera -> región -> celda
    sin_region = 0

    excluidas_no_cubiertas = 0
    for r in cob:
        if int(r["anio"]) != anio:
            continue
        if r.get("cubierto") == "0":
            # Sin cobertura verificada: no se publica (ver ADR 0036).
            excluidas_no_cubiertas += 1
            continue
        o = oferta.get(r["carrera"])
        if not o:
            sin_region += 1
            continue
        n = int(r["real"])
        e = emp.get((o["institucion_codigo"], o["carrera_generica"]))
        codigo_region = CODIGO_REGION.get(clave(o["region"]))
        if codigo_region is None:
            sin_region += 1
            continue
        sumar(por_region[o["carrera_generica"]][codigo_region], n, e)

    carreras = {}
    for carrera, regiones in por_region.items():
        filas = []
        for codigo_region, c in regiones.items():
            f = cifras(c)
            if f is None:
                continue
            f["codigo_region"] = codigo_region
            filas.append(f)
        cifras_n = [f["entradas"] for f in filas if f["entradas"] is not None]
        emps = [f["empleabilidad_pct"] for f in filas if f["empleabilidad_pct"] is not None]
        mediana_n = statistics.median(cifras_n) if cifras_n else None
        mediana_e = statistics.median(emps) if emps else None
        for f in filas:
            if f["entradas"] is None or f["empleabilidad_pct"] is None:
                f["cruce"] = "sin_cifra"
                continue
            alta = f["entradas"] >= mediana_n
            baja = f["empleabilidad_pct"] < mediana_e
            f["cruce"] = ("entradas_altas" if alta else "entradas_bajas") + "_empleabilidad_" + ("baja" if baja else "alta")
        carreras[carrera] = {
            "regiones": sorted(filas, key=lambda f: f["codigo_region"]),
            "mediana_entradas_regionales": mediana_n,
            "mediana_empleabilidad_regional_pct": mediana_e,
        }

    salida = {
        "anio_entradas": anio,
        "fuente_entradas": "SIES, matrícula de primer año (cobertura_entrada_sede.csv), elaboración propia",
        "fuente_empleabilidad": {"fuente": fuente_emp[0], "url": fuente_emp[1], "periodo": fuente_emp[2],
                                  "nota": "elaboración propia: promedio ponderado por entradas de cada sede"},
        "umbral_entradas": UMBRAL,
        "registros_sin_region": sin_region,
        "registros_excluidos_sin_cobertura": excluidas_no_cubiertas,
        "carreras": carreras,
    }
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_bytes((json.dumps(salida, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8"))
    print(f"{len(carreras)} carreras, año {anio}; sin región {sin_region}")

if __name__ == "__main__":
    main()
