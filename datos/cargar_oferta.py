#!/usr/bin/env python3
"""Carga la oferta de carreras de pregrado desde "Matrícula en educación superior" (Datos Abiertos Mineduc).

Entrada: el CSV de matrícula, que trae UNA FILA POR ESTUDIANTE. Este script lo lee en flujo,
agrupa por código de carrera (`codigo_unico`) y escribe UNA FILA POR CARRERA con datos de la
carrera y de la institución. Nunca escribe ni imprime nada de un estudiante: las columnas
personales (mrun, género, fecha de nacimiento, edad) ni siquiera se leen (AGENTS.md 2.2).

Uso (el .rar se abre en flujo, sin guardar en disco el CSV de ~1 GB):

    tar -xOf datos/crudos/Matricula-Ed-Superior-2026.rar "*PUBL_MRUN.csv" | \\
      python3 datos/cargar_oferta.py - \\
        --uf 41274.20 --fecha-uf 2026-11-05 \\
        --url-archivo https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar \\
        --fecha-descarga 2026-11-05

También acepta la ruta de un CSV ya extraído en lugar de "-". Salida (no se sube a git):
`datos/procesados/oferta.csv` y `datos/procesados/oferta_reporte.json`.

Reglas (skill datos-oficiales):
- Repetible: mismas entradas, mismo archivo de salida (orden por código, sin fechas de ejecución).
- Un valor ausente queda vacío con su motivo; nunca 0.
- Si una carrera trae valores contradictorios en una columna, se descarta entera: no se elige uno.
- Aranceles en UF: se guarda el monto original en UF Y su equivalente en pesos con el valor de la
  UF y su fecha. El valor en pesos es aproximado: la UF cambia a diario.
"""
import argparse
import csv
import io
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation

FUENTE = "Datos Abiertos Mineduc"
PERIODO = "matrícula 2026"

# Solo se leen estas columnas. Las personales (mrun, gen_alu, fec_nac_alu, rango_edad...) quedan fuera.
COLUMNAS = [
    "codigo_unico", "cat_periodo", "cod_inst", "nomb_inst", "tipo_inst_1", "nomb_sede", "cod_carrera",
    "nomb_carrera", "modalidad", "jornada", "vigencia_carrera", "nivel_global", "dur_estudio_carr",
    "region_sede", "comuna_sede", "formato_valores", "valor_matricula", "valor_arancel", "codigo_demre",
    "acreditada_inst", "acre_inst_anio", "acre_inst_desde_hasta",
]
# Las que describen a la carrera o a su institución y por tanto no pueden variar dentro de un mismo código.
# `cat_periodo` se valida aparte (ver más abajo).
COLUMNAS_DE_CARRERA = [c for c in COLUMNAS if c not in ("codigo_unico", "cat_periodo")]

TIPOS_INSTITUCION = {
    "universidades": "universidad",
    "institutos profesionales": "instituto_profesional",
    "centros de formacion tecnica": "centro_formacion_tecnica",
}
ESTADOS_ACREDITACION = {"acreditada": "acreditada", "no acreditada": "no_acreditada", "bajo tutela": "bajo_tutela"}
CODIGO_RE = re.compile(r"^I\d+S\d+C\d+J\d+V\d+$")

SALIDA = [
    "codigo_sies", "institucion_codigo", "institucion_nombre", "institucion_tipo", "carrera_codigo",
    "carrera_nombre_oficial", "sede", "comuna", "region", "jornada", "modalidad", "vigencia",
    "duracion_formal_semestres", "matricula_total", "arancel_anual_pesos", "arancel_unidad_original",
    "arancel_valor_original", "matricula_inscripcion_pesos", "uf_valor", "uf_fecha", "motivo_arancel",
    "motivo_matricula_inscripcion", "acreditacion_estado", "acreditacion_anios", "acreditacion_desde",
    "acreditacion_hasta", "motivo_acreditacion", "codigo_demre", "fuente", "url_archivo",
    "fecha_descarga", "periodo",
]


def sin_tildes(texto: str) -> str:
    import unicodedata
    return unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode().lower().strip()


def limpiar(valor: str) -> str:
    return re.sub(r"\s+", " ", valor or "").strip()


def a_decimal(texto: str):
    """'232' -> Decimal(232); '12,5' o '12.5' -> Decimal('12.5'); vacío o ilegible -> None."""
    t = limpiar(texto).replace(",", ".")
    if not t:
        return None
    try:
        return Decimal(t)
    except InvalidOperation:
        return None


def monto_en_pesos(texto: str, formato: str, uf):
    """Devuelve (pesos, unidad_original, valor_original, motivo). Un 0 o un valor ausente NO es un monto."""
    valor = a_decimal(texto)
    if valor is None or valor <= 0:
        return None, "", "", "Mineduc informa 0 o no informa este monto"
    es_uf = "uf" in sin_tildes(formato).split()
    if es_uf:
        pesos = (valor * uf).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        return int(pesos), "uf", format(valor.normalize(), "f"), ""
    if valor != valor.to_integral_value():
        return None, "pesos", format(valor, "f"), "El monto en pesos no es un número entero"
    return int(valor), "pesos", str(int(valor)), ""


def fecha_iso(dmy: str):
    try:
        return datetime.strptime(dmy.strip(), "%d/%m/%Y").date().isoformat()
    except ValueError:
        return ""


def acreditacion(estado: str, anios: str, desde_hasta: str):
    """(estado, años, desde, hasta, motivo). Si falta algo, queda vacío con motivo; nunca 0."""
    est = ESTADOS_ACREDITACION.get(sin_tildes(estado), "")
    if not est:
        return "", "", "", "", "Mineduc no informa la acreditación de la institución"
    n = limpiar(anios)
    if est == "acreditada" and (not n.isdigit() or int(n) <= 0):
        return est, "", "", "", "Mineduc no informa los años de acreditación"
    partes = [p.strip() for p in desde_hasta.split("-")] if desde_hasta else []
    desde = fecha_iso(partes[0]) if len(partes) == 2 else ""
    hasta = fecha_iso(partes[1]) if len(partes) == 2 else ""
    return est, (n if est == "acreditada" else ""), desde, hasta, ""


def procesar(lineas, uf: Decimal, fecha_uf: str, url_archivo: str, fecha_descarga: str):
    """lineas: iterable de filas (listas) de un CSV con encabezado. Devuelve (filas_de_salida, reporte)."""
    lector = iter(lineas)
    encabezado = next(lector)
    faltan = [c for c in COLUMNAS if c not in encabezado]
    if faltan:
        raise ValueError("Faltan columnas en el archivo: " + ", ".join(faltan))
    ix = {c: encabezado.index(c) for c in COLUMNAS}

    filas = Counter()                                   # codigo -> estudiantes (filas) de la carrera
    valores = defaultdict(lambda: defaultdict(set))      # codigo -> columna -> valores distintos
    periodos = defaultdict(set)
    leidas = 0
    for fila in lector:
        leidas += 1
        codigo = fila[ix["codigo_unico"]]
        filas[codigo] += 1
        periodos[codigo].add(fila[ix["cat_periodo"]])
        v = valores[codigo]
        for c in COLUMNAS_DE_CARRERA:
            v[c].add(fila[ix[c]])

    descartes = Counter()
    ejemplos = defaultdict(list)

    def descartar(motivo, codigo):
        descartes[motivo] += 1
        if len(ejemplos[motivo]) < 3:
            ejemplos[motivo].append(codigo)

    salida = []
    resumen = Counter()
    for codigo in sorted(filas):
        v = valores[codigo]
        if sin_tildes(next(iter(v["nivel_global"]))) != "pregrado":
            descartar("fuera de alcance: no es pregrado (postgrado o postítulo)", codigo)
            continue
        if not CODIGO_RE.match(codigo):
            descartar("código de carrera con formato inesperado", codigo)
            continue
        contradictorias = sorted(c for c in COLUMNAS_DE_CARRERA if len(v[c]) > 1)
        if contradictorias or len(periodos[codigo]) > 1:
            descartar("valores contradictorios dentro de una misma carrera: " + ", ".join(contradictorias or ["cat_periodo"]), codigo)
            continue
        u = {c: limpiar(next(iter(v[c]))) for c in COLUMNAS_DE_CARRERA}
        tipo = TIPOS_INSTITUCION.get(sin_tildes(u["tipo_inst_1"]))
        if not tipo:
            descartar("tipo de institución desconocido", codigo)
            continue
        if not u["region_sede"] or not u["nomb_carrera"] or not u["nomb_sede"]:
            descartar("faltan región, sede o nombre de la carrera", codigo)
            continue

        dur = u["dur_estudio_carr"]
        if not (dur.isdigit() and 1 <= int(dur) <= 24):
            descartar("duración formal fuera de rango o ausente", codigo)
            continue

        arancel, unidad, original, motivo_a = monto_en_pesos(u["valor_arancel"], u["formato_valores"], uf)
        inscripcion, _, _, motivo_m = monto_en_pesos(u["valor_matricula"], u["formato_valores"], uf)
        est, anios, desde, hasta, motivo_ac = acreditacion(u["acreditada_inst"], u["acre_inst_anio"], u["acre_inst_desde_hasta"])
        demre = "" if u["codigo_demre"] in ("", "0") else u["codigo_demre"]

        resumen["carreras cargadas"] += 1
        resumen["con arancel"] += 1 if arancel is not None else 0
        resumen["sin arancel (queda vacío con motivo)"] += 1 if arancel is None else 0
        resumen["arancel convertido desde UF"] += 1 if unidad == "uf" else 0
        resumen["sin matrícula de inscripción (vacío con motivo)"] += 1 if inscripcion is None else 0
        resumen["con acreditación institucional"] += 1 if est else 0
        resumen["sin acreditación institucional (vacío con motivo)"] += 0 if est else 1
        resumen["con código DEMRE"] += 1 if demre else 0
        salida.append({
            "codigo_sies": codigo, "institucion_codigo": u["cod_inst"], "institucion_nombre": u["nomb_inst"],
            "institucion_tipo": tipo, "carrera_codigo": u["cod_carrera"], "carrera_nombre_oficial": u["nomb_carrera"],
            "sede": u["nomb_sede"], "comuna": u["comuna_sede"], "region": u["region_sede"], "jornada": u["jornada"],
            "modalidad": u["modalidad"], "vigencia": u["vigencia_carrera"], "duracion_formal_semestres": int(dur),
            "matricula_total": filas[codigo],
            "arancel_anual_pesos": "" if arancel is None else arancel,
            "arancel_unidad_original": unidad, "arancel_valor_original": original,
            "matricula_inscripcion_pesos": "" if inscripcion is None else inscripcion,
            "uf_valor": format(uf, "f") if unidad == "uf" else "", "uf_fecha": fecha_uf if unidad == "uf" else "",
            "motivo_arancel": motivo_a, "motivo_matricula_inscripcion": motivo_m,
            "acreditacion_estado": est, "acreditacion_anios": anios, "acreditacion_desde": desde,
            "acreditacion_hasta": hasta, "motivo_acreditacion": motivo_ac, "codigo_demre": demre,
            "fuente": FUENTE, "url_archivo": url_archivo, "fecha_descarga": fecha_descarga, "periodo": PERIODO,
        })

    reporte = {
        "filas_leidas": leidas,
        "carreras_distintas": len(filas),
        "resumen": dict(resumen),
        "descartadas": dict(descartes),
        "ejemplos_de_descartes": {k: v for k, v in ejemplos.items()},
        "uf": {"valor": format(uf, "f"), "fecha": fecha_uf},
    }
    return salida, reporte


def escribir(salida, ruta_csv: str):
    with open(ruta_csv, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=SALIDA, lineterminator="\n")
        w.writeheader()
        w.writerows(salida)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("entrada", help='Ruta del CSV de matrícula, o "-" para leerlo desde la entrada estándar')
    ap.add_argument("--uf", required=True, help="Valor de la UF en pesos, con punto decimal (ej. 41274.20)")
    ap.add_argument("--fecha-uf", required=True, help="Fecha de ese valor de la UF (AAAA-MM-DD)")
    ap.add_argument("--url-archivo", required=True)
    ap.add_argument("--fecha-descarga", required=True, help="AAAA-MM-DD")
    ap.add_argument("--codificacion", default="utf-8")
    ap.add_argument("--salida", default="datos/procesados/oferta.csv")
    ap.add_argument("--reporte", default="datos/procesados/oferta_reporte.json")
    a = ap.parse_args(argv)

    try:
        uf = Decimal(a.uf)
        datetime.strptime(a.fecha_uf, "%Y-%m-%d")
        datetime.strptime(a.fecha_descarga, "%Y-%m-%d")
    except (InvalidOperation, ValueError):
        sys.exit("Error: --uf debe ser un número (ej. 41274.20) y las fechas AAAA-MM-DD.")
    if uf <= 0:
        sys.exit("Error: la UF debe ser mayor que 0.")

    binario = sys.stdin.buffer if a.entrada == "-" else open(a.entrada, "rb")
    texto = io.TextIOWrapper(binario, encoding=a.codificacion, errors="strict", newline="")
    try:
        salida, reporte = procesar(csv.reader(texto, delimiter=";"), uf, a.fecha_uf, a.url_archivo, a.fecha_descarga)
    except UnicodeDecodeError as e:
        sys.exit(f"Error: el archivo no está en {a.codificacion} ({e.reason} en la posición {e.start}). Prueba con --codificacion latin-1.")
    except ValueError as e:
        sys.exit(f"Error: {e}")

    import os
    os.makedirs(os.path.dirname(a.salida) or ".", exist_ok=True)
    escribir(salida, a.salida)
    with open(a.reporte, "w", encoding="utf-8", newline="") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")

    print(f"Filas leídas: {reporte['filas_leidas']:,} | carreras distintas: {reporte['carreras_distintas']:,}".replace(",", "."))
    for k, v in reporte["resumen"].items():
        print(f"  {k}: {v:,}".replace(",", "."))
    print("Descartadas:")
    for k, v in reporte["descartadas"].items():
        print(f"  {k}: {v:,}".replace(",", "."))
    print(f"Escrito: {a.salida} y {a.reporte}")


if __name__ == "__main__":
    main()
