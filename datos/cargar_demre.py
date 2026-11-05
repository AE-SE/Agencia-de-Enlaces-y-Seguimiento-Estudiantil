#!/usr/bin/env python3
"""Carga la «Oferta definitiva de carreras» del DEMRE (Admisión 2027): ponderaciones, requisitos y vacantes.

Entrada: el PDF oficial (https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf).
Salidas (no se suben a git):
  datos/procesados/demre.csv            una fila por carrera del Sistema de Acceso con sus ponderaciones y vacantes
  datos/procesados/demre_revisar.csv    filas que NO se pudieron validar (no se cargan; hay que mirarlas a mano)
  datos/procesados/demre_reporte.json

Uso:
    python3 -m pip install -r scripts/requirements.txt      # necesita pypdf
    python3 datos/cargar_demre.py datos/crudos/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf \\
        --oferta datos/procesados/oferta.csv --fecha-descarga 2026-11-03

POR QUÉ SE LEE POR POSICIÓN. El texto plano de este PDF separa los datos de su código: una fila de la
misma página parecía decir 70 vacantes cuando eran 53. Aquí cada fila se reconstruye con las coordenadas
de cada celda, y se acepta SOLO si las ponderaciones suman 100 (y los requisitos y las vacantes son
números coherentes). Lo que no cuadra va a `demre_revisar.csv`; nunca se adivina.

Cómo se leen las celdas:
- Cada página de tabla tiene sus propias columnas (se reconocen por el encabezado de la página): NEM,
  Ranking, Competencia Lectora, Matemática 1, Historia y Cs. Sociales, Ciencias, Matemática 2, a veces
  una prueba o asignación especial, puntaje ponderado mínimo, puntaje promedio mínimo y las vacantes
  (Regular o «1.er / 2.º semestre», + MC, BEA, PACE). Las cifras van alineadas a la derecha.
- «---» significa que esa celda no aplica: queda VACÍA en el CSV (no es 0 ni dato faltante). Una celda
  sin ningún texto también queda vacía.
- «10 o 10» en Historia/Ciencias significa que el postulante usa la mejor de las dos pruebas con esa
  ponderación; se guarda `historia_o_ciencias = si` y el peso una sola vez.
- Las notas al pie del nombre, como «(15)», se separan en `notas`; no se interpretan aquí.
"""
import argparse
import csv
import json
import os
import re
import statistics
import sys
from collections import Counter, defaultdict

FUENTE = "DEMRE"
URL_ARCHIVO = "https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf"
PERIODO = "Admisión 2027, oferta definitiva (2026-09-24)"
CW = 6.1      # ancho de un dígito en puntos, medido en la propia tabla
GUION = 11.0  # ancho de «---»

# (nombre, patrón del encabezado)
CANON = [
    ("nem", r"^NEM$"), ("ranking", r"^RANKING$"), ("lectora", r"LECTORA"), ("m1", r"MATEM[ÁA]TICA 1"),
    ("historia", r"CIENCIAS\s+SOCIALES"), ("ciencias", r"^CIENCIAS$"), ("m2", r"MATEM[ÁA]TICA 2"),
    ("prueba_especial", r"PRUEBA\s+ESPECIAL"), ("asignacion_especial", r"ASIGNACI[ÓO]N\s+ESPECIAL"),
    ("ponderado", r"PONDERADO"), ("promedio", r"PROMEDIO|C\. LECT\. Y\s+MAT"),
    ("regular_1s", "^1º$"), ("regular_2s", "^2º$"), ("regular", r"^REGULAR$"),
    ("mc", r"^\+\s*MC$"), ("bea", r"^BEA$"), ("pace", r"^PACE$"),
]
PESOS = ["nem", "ranking", "lectora", "m1", "historia", "ciencias", "m2", "prueba_especial", "asignacion_especial"]
# Distancia mediana entre el inicio del encabezado y el borde derecho de las cifras, medida en este PDF.
# Solo se usa cuando una página no tiene ninguna fila completa de la que aprender.
OFFSET_GLOBAL = {"nem": 6.5, "ranking": 5.9, "lectora": 2.5, "m1": 2.0, "historia": 2.5, "ciencias": 6.5, "m2": -2.3,
                 "prueba_especial": 5.9, "asignacion_especial": 5.9, "ponderado": 11.0, "promedio": 19.1, "regular_1s": 10.4, "regular_2s": 10.4,
                 "regular": 5.9, "mc": 1.8, "bea": 1.8, "pace": 2.0}
# Una celda es un número de hasta 3 cifras (con un decimal con coma, p. ej. «567,5», en algunos puntajes),
# «---» o la «o» de «10 o 10». Cualquier otro texto con cifras en la zona de datos sería una celda perdida.
TOKEN = re.compile(r"^(\d{1,3}(,\d)?|---|o)$")

SALIDA = [
    "demre_codigo", "carrera", "notas", "lugar", "nem", "ranking", "lectora", "matematica_1", "matematica_2",
    "historia_cs_sociales", "ciencias", "historia_o_ciencias", "prueba_especial", "asignacion_especial_pedagogia",
    "puntaje_ponderado_minimo", "puntaje_promedio_minimo", "vacantes_regular", "vacantes_regular_2do_semestre",
    "vacantes_mc", "vacantes_bea", "vacantes_pace", "pagina_pdf", "fuente", "url_archivo", "fecha_descarga", "periodo",
]


# ------------------------------------------------------------------ lectura del PDF
def extraer_paginas(ruta):
    """Devuelve [{'p', 'w', 'h', 't': [[y, x, texto], ...]}] con la posición de cada trozo de texto."""
    try:
        from pypdf import PdfReader
    except ImportError:
        sys.exit("Error: falta pypdf. Instálalo con: python3 -m pip install -r scripts/requirements.txt")
    paginas = []
    for n, pg in enumerate(PdfReader(ruta).pages, 1):
        trozos = []

        def visitar(texto, cm, tm, fd, fs, trozos=trozos):
            s = texto.replace("\t", " ").strip()
            if s:
                trozos.append([round(tm[5], 1), round(tm[4], 1), s])

        pg.extract_text(visitor_text=visitar)
        paginas.append({"p": n, "w": float(pg.mediabox.width), "h": float(pg.mediabox.height), "t": trozos})
    return paginas


# ------------------------------------------------------------------ reconstrucción de filas
def columnas(pagina, y_primera_fila):
    """Columnas de la página, de izquierda a derecha, según su encabezado: [(x, nombre)]."""
    enc = [(x, re.sub(r"\s+", " ", s)) for y, x, s in pagina["t"] if y_primera_fila + 2 < y < y_primera_fila + 170 and 250 < x < 780]
    cols = []
    for nombre, rx in CANON:
        xs = [x for x, s in enc if re.search(rx, s)]
        if xs:
            cols.append((min(xs), nombre))
    nombres = {n for _, n in cols}
    if nombres & {"regular_1s", "regular_2s"}:
        cols = [c for c in cols if c[1] != "regular"]
    cols.sort()
    return cols


def borde(x, s):
    """Borde derecho estimado de una celda (las cifras y los guiones van alineados a la derecha)."""
    return x + (GUION if s == "---" else CW * len(s))


def asignar(tokens, anclas):
    """Reparte las celdas leídas (ordenadas por x) entre las columnas, en orden, minimizando la distancia a la
    posición esperada de cada columna. Las columnas que no reciben celda quedan vacías.
    tokens: [(x, texto)] sin las «o». anclas: borde derecho esperado de cada columna. Devuelve lista por columna o None."""
    k, m = len(tokens), len(anclas)
    if k > m:
        return None
    inf = float("inf")
    costo = [[inf] * (m + 1) for _ in range(k + 1)]   # costo[i][j]: i celdas puestas en las j primeras columnas
    quien = [[None] * (m + 1) for _ in range(k + 1)]
    for j in range(m + 1):
        costo[0][j] = 0.0
    for i in range(1, k + 1):
        for j in range(i, m + 1):
            dist = abs(borde(*tokens[i - 1]) - anclas[j - 1])
            poner = costo[i - 1][j - 1] + dist
            saltar = costo[i][j - 1]
            if poner <= saltar:
                costo[i][j], quien[i][j] = poner, "p"
            else:
                costo[i][j], quien[i][j] = saltar, "s"
    if costo[k][m] == inf:
        return None
    res, i, j = [None] * m, k, m
    while j > 0 and i > 0:
        if quien[i][j] == "p":
            res[j - 1] = tokens[i - 1][1]
            i, j = i - 1, j - 1
        else:
            j -= 1
    return res


def numero(texto):
    """'53' -> 53; '567,5' -> 567.5; vacío o ilegible -> None."""
    if not texto:
        return None
    if texto.isdigit():
        return int(texto)
    if re.fullmatch(r"\d+,\d", texto):
        return float(texto.replace(",", "."))
    return None


CODIGO = re.compile(r"^\d{5}$")
X_NOMBRE_MAX = 170  # el nombre empieza en x≈103-108 y el lugar mucho más a la derecha (x≈260-340)


def filas_de_pagina(pagina):
    """Filas de una página: [{'codigo','y','tokens','nombre','lugar'}] y sus columnas. Vacío si no es una página de tabla."""
    if pagina["w"] <= pagina["h"]:
        return [], []
    trozos = pagina["t"]
    codigos = sorted({y for y, x, s in trozos if 55 < x < 95 and CODIGO.match(s)}, reverse=True)
    if not codigos:
        return [], []
    cols = columnas(pagina, codigos[0])
    filas = []
    for y in codigos:
        cod = next(s for yy, x, s in trozos if yy == y and 55 < x < 95 and CODIGO.match(s))
        filas.append({"codigo": cod, "y": y, "tokens": [], "nombre": [], "lugar": []})
    ys = [f["y"] for f in filas]
    for y, x, s in trozos:
        if x <= 95 or x >= 780 or CODIGO.match(s):
            continue
        if x > 250 and TOKEN.match(s):
            # celda numérica: pertenece a la fila que está a su misma altura
            cerca = [f for f in filas if abs(f["y"] - y) <= 3]
            if cerca:
                cerca[0]["tokens"].append((x, s))
            continue
        if x >= 395 and re.search(r"\d", s) and not re.search(r"[A-Za-zÁÉÍÓÚÑáéíóúñ]{3,}", s):
            # cifras en la zona de datos que no son una celda conocida: se avisa, no se descartan en silencio
            cerca = [f for f in filas if abs(f["y"] - y) <= 3]
            if cerca:
                cerca[0].setdefault("raros", []).append(s)
            continue
        if x >= 395 or len(s) > 90 or TOKEN.match(s):
            continue
        # texto del nombre o del lugar: la fila más cercana si está a menos de 8 puntos; si no, es una
        # línea de continuación justo debajo de una fila (sin otra fila de por medio)
        dist = min(ys, key=lambda yy: abs(yy - y))
        if abs(dist - y) <= 8:
            destino = dist
        else:
            arriba = [yy for yy in ys if 0 < yy - y <= 24]
            if not arriba or min(yy for yy in ys if yy > y) != min(arriba, key=lambda yy: yy - y):
                continue
            destino = min(arriba, key=lambda yy: yy - y)
        f = next(f for f in filas if f["y"] == destino)
        (f["nombre"] if x < X_NOMBRE_MAX else f["lugar"]).append((y, x, s))
    for f in filas:
        f["tokens"].sort()
    return filas, cols


def texto_de(partes):
    """Une las partes de un nombre o de un lugar, de arriba hacia abajo y de izquierda a derecha."""
    return re.sub(r"\s+", " ", " ".join(s for y, x, s in sorted(partes, key=lambda p: (-p[0], p[1])))).strip()


def procesar(paginas, fecha_descarga):
    validas, revisar = [], []
    resumen = Counter()
    for pagina in paginas:
        filas, cols = filas_de_pagina(pagina)
        if not filas:
            continue
        resumen["páginas de tabla"] += 1
        nombres = [n for _, n in cols]
        hx = {n: x for x, n in cols}
        # anclas: lo que aprenden las filas completas de ESTA página; si no hay ninguna, el desplazamiento global
        muestras = defaultdict(list)
        for f in filas:
            datos = [t for t in f["tokens"] if t[1] != "o"]
            if len(datos) == len(nombres):
                for (x, s), n in zip(datos, nombres):
                    muestras[n].append(borde(x, s))
        anclas = [statistics.median(muestras[n]) if muestras[n] else hx[n] + OFFSET_GLOBAL[n] for n in nombres]
        for f in filas:
            resumen["filas leídas"] += 1
            datos = [t for t in f["tokens"] if t[1] != "o"]
            tiene_o = any(s == "o" for _, s in f["tokens"])
            base = {"demre_codigo": f["codigo"], "pagina_pdf": pagina["p"], "carrera": texto_de(f["nombre"]), "lugar": texto_de(f["lugar"])}
            asignadas = asignar(datos, anclas)
            if asignadas is None:
                revisar.append({**base, "motivo": f"{len(datos)} celdas para {len(nombres)} columnas"})
                continue
            v = {n: (None if s in (None, "---") else s) for n, s in zip(nombres, asignadas)}
            p = {n: numero(v.get(n)) for n in PESOS}
            suma = sum(x for x in (p["nem"], p["ranking"], p["lectora"], p["m1"], p["m2"], p["prueba_especial"], p["asignacion_especial"]) if x)
            hist, cien = p["historia"], p["ciencias"]
            suma += (max(hist or 0, cien or 0)) if tiene_o else (hist or 0) + (cien or 0)
            ponderado, promedio = numero(v.get("ponderado")), numero(v.get("promedio"))
            regular = numero(v.get("regular")) if "regular" in nombres else numero(v.get("regular_1s"))
            problemas = []
            if f.get("raros"):
                problemas.append("texto con cifras que no se reconoce como celda: " + " ".join(f["raros"]))
            decimales = [n for n in PESOS + ["regular", "regular_1s", "regular_2s", "mc", "bea", "pace"] if isinstance(numero(v.get(n)), float)]
            if decimales:
                problemas.append("decimal en una columna que debe ser entera: " + ", ".join(decimales))
            if suma != 100:
                problemas.append(f"las ponderaciones suman {suma}, no 100")
            for nombre, val in (("puntaje ponderado mínimo", ponderado), ("puntaje promedio mínimo", promedio)):
                if val is not None and not 150 <= val <= 1000:
                    problemas.append(f"{nombre} fuera de rango ({val})")
            if not base["carrera"] or not base["lugar"]:
                problemas.append("falta el nombre de la carrera o el lugar")
            if problemas:
                revisar.append({**base, "motivo": "; ".join(problemas)})
                continue
            m = re.findall(r"\((\d+)\)", base["carrera"])
            validas.append({
                **base, "carrera": re.sub(r"\s*\(\d+\)", "", base["carrera"]).strip(), "notas": " ".join(m),
                "nem": p["nem"], "ranking": p["ranking"], "lectora": p["lectora"], "matematica_1": p["m1"], "matematica_2": p["m2"],
                "historia_cs_sociales": hist, "ciencias": cien, "historia_o_ciencias": "si" if tiene_o else "no",
                "prueba_especial": p["prueba_especial"], "asignacion_especial_pedagogia": p["asignacion_especial"],
                "puntaje_ponderado_minimo": ponderado, "puntaje_promedio_minimo": promedio, "vacantes_regular": regular,
                "vacantes_regular_2do_semestre": numero(v.get("regular_2s")), "vacantes_mc": numero(v.get("mc")),
                "vacantes_bea": numero(v.get("bea")), "vacantes_pace": numero(v.get("pace")),
                "fuente": FUENTE, "url_archivo": URL_ARCHIVO, "fecha_descarga": fecha_descarga, "periodo": PERIODO,
            })
    # un código no puede repetirse: si pasa, son filas ambiguas y no se carga ninguna
    veces = Counter(r["demre_codigo"] for r in validas)
    repetidos = {c for c, n in veces.items() if n > 1}
    for r in [r for r in validas if r["demre_codigo"] in repetidos]:
        revisar.append({"demre_codigo": r["demre_codigo"], "pagina_pdf": r["pagina_pdf"], "carrera": r["carrera"], "lugar": r["lugar"], "motivo": "código repetido en el PDF"})
    validas = sorted((r for r in validas if r["demre_codigo"] not in repetidos), key=lambda r: r["demre_codigo"])
    revisar.sort(key=lambda r: (r["pagina_pdf"], r["demre_codigo"]))
    resumen["filas cargadas"] = len(validas)
    resumen["filas a revisar a mano"] = len(revisar)
    return validas, revisar, dict(resumen)


def cruzar(validas, oferta):
    """Une con la oferta de Mineduc por `codigo_demre`. Devuelve (pares, reporte)."""
    por_demre = defaultdict(list)
    for o in oferta:
        if o.get("codigo_demre"):
            por_demre[o["codigo_demre"]].append(o["codigo_sies"])
    codigos = {r["demre_codigo"] for r in validas}
    pares = sorted(({"codigo_sies": c, "demre_codigo": d} for d, cs in por_demre.items() if d in codigos for c in cs), key=lambda p: p["codigo_sies"])
    sin_demre = sorted(c for c in por_demre if c not in codigos)
    return pares, {
        "carreras_de_la_oferta_con_codigo_demre": sum(len(v) for v in por_demre.values()),
        "carreras_de_la_oferta_con_ponderaciones_y_vacantes": len(pares),
        "codigos_demre_de_la_oferta_que_no_estan_en_el_pdf": len(sin_demre), "ejemplos_sin_pdf": sin_demre[:15],
        "filas_del_pdf_que_ninguna_carrera_de_la_oferta_usa": len(codigos - set(por_demre)),
    }


def escribir(filas, campos, ruta):
    os.makedirs(os.path.dirname(ruta) or ".", exist_ok=True)
    with open(ruta, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=campos, lineterminator="\n", extrasaction="ignore")
        w.writeheader()
        for r in filas:
            w.writerow({k: ("" if v is None else v) for k, v in r.items()})


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("entrada", help="Ruta del PDF oficial del DEMRE")
    ap.add_argument("--oferta", help="datos/procesados/oferta.csv, para cruzar por código DEMRE (opcional)")
    ap.add_argument("--fecha-descarga", required=True, help="AAAA-MM-DD")
    ap.add_argument("--salida", default="datos/procesados/demre.csv")
    ap.add_argument("--revisar", default="datos/procesados/demre_revisar.csv")
    ap.add_argument("--salida-cruce", default="datos/procesados/oferta_demre.csv")
    ap.add_argument("--reporte", default="datos/procesados/demre_reporte.json")
    a = ap.parse_args(argv)
    validas, revisar, resumen = procesar(extraer_paginas(a.entrada), a.fecha_descarga)
    escribir(validas, SALIDA, a.salida)
    escribir(revisar, ["demre_codigo", "pagina_pdf", "carrera", "lugar", "motivo"], a.revisar)
    reporte = {"resumen": resumen, "motivos_de_revision": dict(Counter(r["motivo"].split(";")[0][:60] for r in revisar))}
    if a.oferta:
        with open(a.oferta, encoding="utf-8", newline="") as f:
            pares, rc = cruzar(validas, list(csv.DictReader(f)))
        escribir(pares, ["codigo_sies", "demre_codigo"], a.salida_cruce)
        reporte["cruce"] = rc
    with open(a.reporte, "w", encoding="utf-8", newline="") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")
    pt = lambda n: f"{n:,}".replace(",", ".")  # noqa: E731
    for k, v in resumen.items():
        print(f"  {k}: {pt(v)}")
    if "cruce" in reporte:
        c = reporte["cruce"]
        print(f"Cruce con la oferta: {pt(c['carreras_de_la_oferta_con_ponderaciones_y_vacantes'])} de {pt(c['carreras_de_la_oferta_con_codigo_demre'])} "
              f"carreras con código DEMRE reciben ponderaciones y vacantes; {pt(c['codigos_demre_de_la_oferta_que_no_estan_en_el_pdf'])} códigos no están en el PDF")
    print(f"Escrito: {a.salida} y {a.revisar}")


if __name__ == "__main__":
    main()
