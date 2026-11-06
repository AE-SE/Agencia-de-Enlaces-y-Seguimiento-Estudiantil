#!/usr/bin/env python3
"""Carga el «Buscador de Empleabilidad e Ingresos 2025-2026» (Mi Futuro, SIES) y lo cruza con la oferta.

Entrada: el XLSX oficial, hoja «Carreras e IES (2025-2026)» (1.690 filas: institución × CARRERA GENÉRICA).
Salidas (no se suben a git):
  datos/procesados/empleabilidad.csv          una fila por institución × carrera genérica, con cada indicador limpio
  datos/procesados/oferta_empleabilidad.csv   qué carreras de la oferta (oferta.csv) reciben cada fila del SIES
  datos/procesados/empleabilidad_reporte.json

Uso:
    python3 datos/cargar_empleabilidad.py datos/crudos/Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx \\
      --oferta datos/procesados/oferta.csv --fecha-descarga 2026-11-03

Por qué el cruce es por «institución + carrera genérica» y no por el nombre del título: la metodología
oficial dice que «los datos de empleabilidad e ingresos se generan a partir de la combinación de carreras
genéricas (y no de nombres de carreras) e instituciones». Una fila del SIES vale entonces para todas las
carreras de esa institución con esa carrera genérica (sedes, jornadas y versiones distintas).

Lo que dice la metodología oficial y este script respeta (los períodos salen de ahí, no del archivo):
https://mifuturo.cl/wp-content/uploads/2025/12/Metodologia-Buscador-Empleabilidad-e-Ingresos_2025-2026.pdf
- «Empleabilidad» es un indicador proxy: % de titulados que, teniendo información de ingresos, obtuvieron
  ingresos iguales o superiores al sueldo mínimo. NO mide «tener trabajo».
- Ingreso al 4.º año: TRAMO del promedio de ingreso BRUTO MENSUAL, en pesos de septiembre de 2025.
- Excepción de Derecho: el SIES informa como «1.er año» el dato del 2.º año después de titularse (y así
  los demás), porque su titulación efectiva ocurre entre 6 meses y un año después del último trámite.
- Mínimos de casos: 25 para retención y duración real; 11 por cohorte para ingreso (ver reporte del SIES).

Reglas (skill datos-oficiales): repetible; vacío con motivo (nunca 0); rangos validados.
Solo biblioteca estándar: el XLSX se lee con zipfile + xml.
"""
import argparse
import csv
import json
import os
import re
import sys
import unicodedata
import zipfile
from collections import Counter, defaultdict
from decimal import ROUND_HALF_UP, Decimal
from xml.etree import ElementTree as ET

HOJA = "Carreras e IES (2025-2026)"
FUENTE = "Mi Futuro"
URL_ARCHIVO = "https://mifuturo.cl/wp-content/uploads/2025/12/Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx"
URL_METODOLOGIA = "https://mifuturo.cl/wp-content/uploads/2025/12/Metodologia-Buscador-Empleabilidad-e-Ingresos_2025-2026.pdf"

# Encabezados esperados (se comparan sin tildes ni espacios raros: el original trae un espacio duro en «1er año»).
COLUMNAS = {
    "codigo": "codigo",
    "tipo": "tipo de institucion",
    "institucion": "nombre de institucion",
    "area": "area",
    "generica": "nombre carrera generica",
    "titulo": "nombre carrera (del titulo)",
    "continuidad": "% titulados con continuidad de estudios",
    "retencion": "retencion 1er ano",
    "duracion": "duracion real (semestres)",
    "emp1": "empleabilidad 1er ano",
    "emp2": "empleabilidad 2 ano",
    "ingreso": "ingreso promedio al 4 ano",
}
TIPOS = {
    "universidades": "universidad",
    "institutos profesionales": "instituto_profesional",
    "insitutos profesionales": "instituto_profesional",  # errata del archivo original
    "centros de formacion tecnica": "centro_formacion_tecnica",
}

# Períodos según la metodología oficial. Derecho se desplaza un año (ver docstring).
PERIODOS = {
    "continuidad": "titulados 2021 a 2023, matriculados al año siguiente de titularse",
    "retencion": "estudiantes de primer año 2024 que siguen matriculados en 2025",
    "duracion": "titulados 2024",
    "emp1": ("titulados 2021 a 2023; años de ingreso 2022 a 2024", "titulados 2020 a 2022; años de ingreso 2022 a 2024"),
    "emp2": ("titulados 2020 a 2022; años de ingreso 2022 a 2024", "titulados 2019 a 2021; años de ingreso 2022 a 2024"),
    "ingreso": ("titulados 2018 a 2020; años de ingreso 2022 a 2024; pesos de septiembre de 2025",
                "titulados 2017 a 2019; años de ingreso 2022 a 2024; pesos de septiembre de 2025"),
}
NOTA_DERECHO = ("Para Derecho el SIES informa como «1.er año» el dato del 2.º año después de titularse "
                "(y como «2.º año» el del 3.º), porque su titulación efectiva ocurre entre 6 meses y un año después del último trámite.")
MINIMOS = {"retencion": 25, "duracion": 25, "ingreso": 11}

SALIDA = [
    "sies_institucion_codigo", "institucion_nombre", "institucion_tipo", "area", "carrera_generica", "carrera_titulo_ejemplo",
    "continuidad_estudios_pct", "retencion_1er_anio_pct", "duracion_real_semestres", "empleabilidad_1er_anio_pct",
    "empleabilidad_2do_anio_pct", "ingreso_4to_anio_tramo", "ingreso_4to_anio_desde_pesos", "ingreso_4to_anio_hasta_pesos",
    "motivo_retencion", "motivo_duracion_real", "motivo_empleabilidad_2do_anio", "motivo_ingreso",
    "periodo_continuidad", "periodo_retencion", "periodo_duracion_real", "periodo_empleabilidad_1er_anio",
    "periodo_empleabilidad_2do_anio", "periodo_ingreso", "excepcion_derecho", "nota_derecho",
    "fuente", "url_archivo", "url_metodologia", "fecha_descarga",
]


def base(texto) -> str:
    """Minúsculas, sin tildes, espacios normalizados (incluye el espacio duro)."""
    t = unicodedata.normalize("NFKD", str(texto if texto is not None else "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", t.replace("\xa0", " ")).strip()


def clave(texto) -> str:
    """Para comparar nombres: solo letras y números."""
    return re.sub(r"[^a-z0-9]+", " ", base(texto)).strip()


# ---------------------------------------------------------------- lector mínimo de XLSX (solo biblioteca estándar)
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def _col(ref: str) -> int:
    n = 0
    for ch in re.match(r"[A-Z]+", ref).group(0):
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def leer_hoja(ruta: str, nombre: str):
    """Devuelve las filas de la hoja como listas de valores (texto o número). Celdas vacías = None."""
    with zipfile.ZipFile(ruta) as z:
        wb = ET.fromstring(z.read("xl/workbook.xml"))
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        destino = {r.get("Id"): r.get("Target") for r in rels}
        rid = None
        for s in wb.find("m:sheets", NS):
            if s.get("name") == nombre:
                rid = s.get("{%s}id" % NS["r"])
        if rid is None:
            raise ValueError(f"No existe la hoja «{nombre}» en el archivo")
        objetivo = destino[rid].lstrip("/")
        objetivo = objetivo if objetivo.startswith("xl/") else "xl/" + objetivo
        compartidas = []
        if "xl/sharedStrings.xml" in z.namelist():
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
                compartidas.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
        filas = []
        for fila in ET.fromstring(z.read(objetivo)).find("m:sheetData", NS):
            valores = {}
            for c in fila.findall("m:c", NS):
                tipo, v = c.get("t"), c.find("m:v", NS)
                if tipo == "inlineStr":
                    val = "".join(t.text or "" for t in c.iter("{%s}t" % NS["m"]))
                elif v is None or v.text is None:
                    continue
                elif tipo == "s":
                    val = compartidas[int(v.text)]
                elif tipo in ("str", "e"):
                    val = v.text
                elif tipo == "b":
                    val = bool(int(v.text))
                else:
                    val = Decimal(v.text)
                valores[_col(c.get("r"))] = val
            filas.append([valores.get(i) for i in range(max(valores) + 1)] if valores else [])
        return filas


# ---------------------------------------------------------------- limpieza de indicadores
def porcentaje(valor):
    """0,5979… -> Decimal('59.79'). Devuelve (valor, motivo). No numérico o fuera de 0 a 1 -> vacío con motivo."""
    if isinstance(valor, Decimal) and Decimal(0) <= valor <= Decimal(1):
        return (valor * 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), ""
    if isinstance(valor, str) and valor.strip():
        return None, f"El SIES informa «{valor.strip()}» para este indicador"
    return None, "El SIES no informa este indicador"


def semestres(valor):
    if isinstance(valor, Decimal) and Decimal(1) <= valor <= Decimal(30):
        return valor.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), ""
    if isinstance(valor, str) and valor.strip():
        return None, f"El SIES informa «{valor.strip()}» para este indicador"
    return None, "El SIES no informa este indicador"


def monto(texto: str):
    """'$1 millón 100 mil' -> 1100000; '$900 mil' -> 900000; '$2 millones' -> 2000000. None si no se entiende."""
    t = base(texto).replace("$", " ")
    total, hallado = 0, False
    m = re.search(r"(\d+)\s+millon(?:es)?", t)
    if m:
        total += int(m.group(1)) * 1_000_000
        hallado = True
    m = re.search(r"(\d+)\s+mil\b", t)
    if m:
        total += int(m.group(1)) * 1_000
        hallado = True
    return total if hallado else None


def tramo_de_ingreso(valor):
    """(texto, desde, hasta, motivo). 'De $A a $B' / 'Desde $A a $B' / 'Sobre $A'. Nunca se inventa un monto exacto."""
    if not isinstance(valor, str) or not valor.strip():
        return "", None, None, "El SIES no informa este indicador"
    texto = re.sub(r"\s+", " ", valor).strip()
    b = base(texto)
    if b == "s/i":
        return "", None, None, "El SIES informa «s/i» para este indicador; solo lo publica con un mínimo de casos"
    m = re.fullmatch(r"(?:de|desde) (\$.+?) a (\$.+)", b)
    if m and monto(m.group(1)) is not None and monto(m.group(2)) is not None:
        desde, hasta = monto(m.group(1)), monto(m.group(2))
        if desde < hasta:
            return texto, desde, hasta, ""
    m = re.fullmatch(r"sobre (\$.+)", b)
    if m and monto(m.group(1)) is not None:
        return texto, monto(m.group(1)), None, ""
    return texto, None, None, f"No se pudo leer el tramo «{texto}»"


def es_derecho(generica: str) -> bool:
    return clave(generica) == "derecho"


def procesar(filas, fecha_descarga: str):
    """filas: lista de filas (listas) con encabezado. Devuelve (salida, reporte)."""
    if not filas:
        raise ValueError("La hoja está vacía")
    # El original escribe «2°» y «4°» con el signo de grado; se normaliza para aceptar también «2º» o «2o».
    enc = {re.sub(r"(\d)o\b", r"\1", base(c)): i for i, c in enumerate(filas[0]) if c is not None}
    ix = {}
    for nombre, esperado in COLUMNAS.items():
        if esperado not in enc:
            raise ValueError(f"Falta la columna «{esperado}» en el archivo")
        ix[nombre] = enc[esperado]

    salida, descartes, vistos = [], Counter(), set()
    resumen = Counter()
    for n, f in enumerate(filas[1:], start=2):
        if not any(c is not None for c in f):
            continue
        g = lambda k: f[ix[k]] if ix[k] < len(f) else None  # noqa: E731
        if g("codigo") is None and any(isinstance(c, str) and c.strip().upper().startswith("FUENTE") for c in f):
            resumen["notas al pie ignoradas"] += 1  # «FUENTE: Portal mifuturo.cl…»: no es una fila de datos
            continue
        codigo = str(int(g("codigo"))) if isinstance(g("codigo"), Decimal) else str(g("codigo") or "").strip()
        generica = re.sub(r"\s+", " ", str(g("generica") or "")).strip()
        tipo = TIPOS.get(base(g("tipo")))
        if not codigo.isdigit() or not generica or not tipo:
            descartes["fila con código, carrera genérica o tipo de institución ilegible"] += 1
            continue
        k = (codigo, clave(generica))
        if k in vistos:
            descartes["institución y carrera genérica repetidas"] += 1
            continue
        vistos.add(k)

        der = es_derecho(generica)
        cont, _ = porcentaje(g("continuidad"))
        ret, m_ret = porcentaje(g("retencion"))
        dur, m_dur = semestres(g("duracion"))
        e1, m_e1 = porcentaje(g("emp1"))
        e2, m_e2 = porcentaje(g("emp2"))
        tramo, desde, hasta, m_ing = tramo_de_ingreso(g("ingreso"))
        if e1 is None:
            descartes["sin empleabilidad al 1.er año (el SIES solo publica filas que la tienen)"] += 1
            continue
        resumen["filas cargadas"] += 1
        for nombre, v in (("retención", ret), ("duración real", dur), ("empleabilidad 2.º año", e2)):
            resumen[f"con {nombre}"] += v is not None
        resumen["con tramo de ingreso"] += bool(tramo)
        resumen["de Derecho (período desplazado)"] += der
        sal = {
            "sies_institucion_codigo": codigo, "institucion_nombre": re.sub(r"\s+", " ", str(g("institucion"))).strip(),
            "institucion_tipo": tipo, "area": re.sub(r"\s+", " ", str(g("area") or "")).strip(), "carrera_generica": generica,
            "carrera_titulo_ejemplo": re.sub(r"\s+", " ", str(g("titulo") or "")).strip(),
            "continuidad_estudios_pct": "" if cont is None else cont, "retencion_1er_anio_pct": "" if ret is None else ret,
            "duracion_real_semestres": "" if dur is None else dur, "empleabilidad_1er_anio_pct": e1,
            "empleabilidad_2do_anio_pct": "" if e2 is None else e2, "ingreso_4to_anio_tramo": tramo,
            "ingreso_4to_anio_desde_pesos": "" if desde is None else desde, "ingreso_4to_anio_hasta_pesos": "" if hasta is None else hasta,
            "motivo_retencion": m_ret, "motivo_duracion_real": m_dur, "motivo_empleabilidad_2do_anio": m_e2, "motivo_ingreso": m_ing,
            "periodo_continuidad": PERIODOS["continuidad"], "periodo_retencion": PERIODOS["retencion"],
            "periodo_duracion_real": PERIODOS["duracion"],
            "periodo_empleabilidad_1er_anio": PERIODOS["emp1"][der], "periodo_empleabilidad_2do_anio": PERIODOS["emp2"][der],
            "periodo_ingreso": PERIODOS["ingreso"][der], "excepcion_derecho": "si" if der else "no",
            "nota_derecho": NOTA_DERECHO if der else "",
            "fuente": FUENTE, "url_archivo": URL_ARCHIVO, "url_metodologia": URL_METODOLOGIA, "fecha_descarga": fecha_descarga,
        }
        salida.append(sal)
    salida.sort(key=lambda r: (int(r["sies_institucion_codigo"]), clave(r["carrera_generica"])))
    return salida, {"filas_leidas": len(filas) - 1, "resumen": dict(resumen), "descartadas": dict(descartes)}


def cruzar(salida, oferta):
    """oferta: lista de dicts (oferta.csv). Devuelve (pares, reporte). Un SIES puede aplicar a muchas carreras."""
    indice = defaultdict(list)
    for o in oferta:
        indice[(o["institucion_codigo"], clave(o["carrera_generica"]))].append(o["codigo_sies"])
    pares, sin_cruce = [], []
    for s in salida:
        k = (s["sies_institucion_codigo"], clave(s["carrera_generica"]))
        if k in indice:
            pares += [{"codigo_sies": c, "sies_institucion_codigo": k[0], "sies_carrera_generica": s["carrera_generica"]} for c in indice[k]]
        else:
            sin_cruce.append(f"{s['institucion_nombre']} | {s['carrera_generica']}")
    pares.sort(key=lambda p: p["codigo_sies"])
    cruzadas = len(salida) - len(sin_cruce)
    return pares, {
        "filas_sies_que_cruzan": cruzadas, "filas_sies_sin_cruce": len(sin_cruce),
        "carreras_de_la_oferta_con_indicadores": len(pares), "carreras_en_la_oferta": len(oferta),
        "ejemplos_sin_cruce": sin_cruce[:15],
    }


def escribir(filas, campos, ruta):
    os.makedirs(os.path.dirname(ruta) or ".", exist_ok=True)
    with open(ruta, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=campos, lineterminator="\n")
        w.writeheader()
        w.writerows(filas)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("entrada", help="Ruta del XLSX oficial del SIES")
    ap.add_argument("--oferta", help="datos/procesados/oferta.csv, para cruzar (opcional)")
    ap.add_argument("--fecha-descarga", required=True, help="AAAA-MM-DD")
    ap.add_argument("--salida", default="datos/procesados/empleabilidad.csv")
    ap.add_argument("--salida-cruce", default="datos/procesados/oferta_empleabilidad.csv")
    ap.add_argument("--reporte", default="datos/procesados/empleabilidad_reporte.json")
    a = ap.parse_args(argv)
    try:
        salida, reporte = procesar(leer_hoja(a.entrada, HOJA), a.fecha_descarga)
    except (ValueError, KeyError, zipfile.BadZipFile) as e:
        sys.exit(f"Error: {e}")
    escribir(salida, SALIDA, a.salida)
    if a.oferta:
        with open(a.oferta, encoding="utf-8", newline="") as f:
            oferta = list(csv.DictReader(f))
        pares, rc = cruzar(salida, oferta)
        escribir(pares, ["codigo_sies", "sies_institucion_codigo", "sies_carrera_generica"], a.salida_cruce)
        reporte["cruce"] = rc
    with open(a.reporte, "w", encoding="utf-8", newline="") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2, sort_keys=True, default=str)
        f.write("\n")
    pt = lambda n: f"{n:,}".replace(",", ".")  # noqa: E731
    print(f"Filas leídas: {pt(reporte['filas_leidas'])}")
    for k, v in reporte["resumen"].items():
        print(f"  {k}: {pt(v)}")
    print("Descartadas:", {k: v for k, v in reporte["descartadas"].items()} or "ninguna")
    if "cruce" in reporte:
        c = reporte["cruce"]
        print(f"Cruce con la oferta: {pt(c['filas_sies_que_cruzan'])} filas del SIES cruzan, {pt(c['filas_sies_sin_cruce'])} no; "
              f"{pt(c['carreras_de_la_oferta_con_indicadores'])} de {pt(c['carreras_en_la_oferta'])} carreras reciben indicadores")
    print(f"Escrito: {a.salida}")


if __name__ == "__main__":
    main()
