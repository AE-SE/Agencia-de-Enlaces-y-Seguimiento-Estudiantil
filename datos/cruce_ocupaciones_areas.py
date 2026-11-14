"""Cruce entre ocupaciones de O*NET, áreas de conocimiento del SIES y carreras.

Elaboración propia. Tres pasos:

1. Cada carrera genérica del catálogo (datos/procesados/oferta.csv) se asigna
   a una de las 11 áreas de conocimiento que muestra el buscador de carreras
   del SIES (https://www.mifuturo.cl/buscador-de-carreras/, leído el 2026-11-13).
   La asignación sigue reglas por nombre (prefijos y listas), documentadas
   abajo. No viene del SIES: el buscador no publica la tabla.
2. Cada ocupación de O*NET (datos/procesados/onet_intereses.csv) se asigna a
   un área por su grupo ocupacional SOC (dos primeros dígitos del código), con
   excepciones por código. Una ocupación tiene un solo área.
3. Se cuentan las carreras distintas de cada área: nombres oficiales distintos
   (sin tildes ni mayúsculas). Una carrera que se dicta en varias sedes o
   jornadas cuenta una sola vez. Antes se contaban filas de oferta, lo que
   inflaba el número.

Salida:
- datos/procesados/carreras_areas.csv (una fila por carrera genérica)
- datos/procesados/ocupacion_area.csv (una fila por ocupación)
- datos/procesados/ocupacion_area_meta.json

Limitaciones que deben quedar a la vista:
- La asignación de carreras y ocupaciones es de grupo, no de cada caso: una
  ocupación de un grupo amplio puede no tener relación con la carrera
  sugerida. La revisión manual de los casos dudosos está pendiente y se
  registra en el PR.
- Solo biblioteca estándar de Python.
"""

import csv
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
PROCESADOS = RAIZ / "procesados"

AREAS = [
    "Administración y Comercio",
    "Agropecuaria",
    "Arte y Arquitectura",
    "Ciencias Básicas",
    "Ciencias Sociales",
    "Derecho",
    "Educación",
    "Humanidades",
    "Salud",
    "Tecnología",
    "Sin área definida",
]
AREA_POR_CLASE = {
    "administracion y comercio": "Administración y Comercio",
    "ciencias basicas": "Ciencias Básicas",
    "ciencias sociales": "Ciencias Sociales",
    "derecho": "Derecho",
    "educacion": "Educación",
    "humanidades": "Humanidades",
    "salud": "Salud",
    "tecnologia": "Tecnología",
}


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", s).strip().lower()


# Excepciones explícitas por nombre normalizado (sin tildes, minúsculas).
EXCEPCIONES = {
    "administracion gastronomica": "Administración y Comercio",
    "administracion publica": "Administración y Comercio",
    "administracion turistica y hotelera": "Administración y Comercio",
    "administracion de empresas e ing. asociadas": "Administración y Comercio",
    "contador auditor": "Administración y Comercio",
    "secretariado bilingue": "Administración y Comercio",
    "secretariado ejecutivo": "Administración y Comercio",
    "ingenieria comercial": "Administración y Comercio",
    "ingenieria en comercio exterior": "Administración y Comercio",
    "ingenieria en control de gestion": "Administración y Comercio",
    "ingenieria en finanzas": "Administración y Comercio",
    "ingenieria en gestion publica": "Administración y Comercio",
    "ingenieria en marketing": "Administración y Comercio",
    "ingenieria en recursos humanos": "Administración y Comercio",
    "tecnico en administracion de redes y soporte": "Tecnología",
    "tecnico en analisis de datos": "Tecnología",
    "tecnico en analisis de sistemas": "Tecnología",
    "tecnico en computacion e informatica": "Tecnología",
    "tecnico en produccion, desarrollo y diseno web": "Tecnología",
    "tecnico en gastronomia y cocina": "Administración y Comercio",
    "tecnico en turismo y hoteleria": "Administración y Comercio",
    "agronomia": "Agropecuaria",
    "medicina veterinaria": "Agropecuaria",
    "ingenieria agricola": "Agropecuaria",
    "ingenieria agroindustrial": "Agropecuaria",
    "ingenieria civil agricola": "Agropecuaria",
    "ingenieria forestal": "Agropecuaria",
    "ingenieria de ejecucion forestal": "Agropecuaria",
    "ingenieria civil en industrias forestales": "Agropecuaria",
    "ingenieria en acuicultura y pesca": "Agropecuaria",
    "ingenieria en alimentos": "Agropecuaria",
    "ingenieria en recursos renovables": "Agropecuaria",
    "ingenieria en sonido": "Arte y Arquitectura",
    "ingenieria civil en sonido y acustica": "Arte y Arquitectura",
    "ingenieria civil matematica y estadistica": "Ciencias Básicas",
    "ingenieria en matematica y estadistica": "Ciencias Básicas",
    "ingenieria en seguridad privada": "Sin área definida",
    "tecnico en seguridad privada": "Sin área definida",
    "tecnico en deporte, recreacion y preparacion fisica": "Sin área definida",
    "tecnico en peluqueria y estetica": "Sin área definida",
    "tecnico en prevencion y rehabilitacion": "Salud",
    "tecnico en podologia": "Salud",
    "tecnico en masoterapia": "Salud",
    "tecnico en terapias naturales y naturopatia": "Salud",
    "tecnico en optica": "Salud",
    "tecnico en radiologia y radioterapia": "Salud",
    "tecnico en farmacia": "Salud",
    "tecnico en nutricion y dietetica": "Salud",
    "tecnico en enfermeria": "Salud",
    "tecnico en laboratorio clinico": "Salud",
    "tecnico dental y asistente de odontologia": "Salud",
    "tecnico laboratorista dental": "Salud",
    "tecnico veterinario": "Agropecuaria",
    "tecnico agropecuario": "Agropecuaria",
    "tecnico en acuicultura y pesca": "Agropecuaria",
    "tecnico en agroindustria": "Agropecuaria",
    "tecnico en alimentos": "Agropecuaria",
    "tecnico en vitivinicultura y/o enologia": "Agropecuaria",
    "tecnico en biotecnologia industrial": "Tecnología",
    "tecnico en medio ambiente (control y gestion)": "Tecnología",
    "tecnico en prevencion de riesgos": "Tecnología",
    "tecnico en quimica (analisis e industrial)": "Tecnología",
    "tecnico en geologia": "Tecnología",
    "tecnico en geomineria": "Tecnología",
    "tecnico en topografia": "Tecnología",
    "tecnico en gestion y control de calidad": "Tecnología",
    "tecnico en proyecto y diseno mecanico": "Tecnología",
    "tecnico en proyectos de ingenieria": "Tecnología",
    "tecnico en dibujo tecnico": "Arte y Arquitectura",
    "tecnico en dibujo arquitectonico": "Arte y Arquitectura",
    "tecnico en diseno de areas verdes y paisajismo": "Arte y Arquitectura",
    "tecnico en produccion de eventos": "Arte y Arquitectura",
    "tecnico en produccion de videojuegos": "Arte y Arquitectura",
    "tecnico en produccion grafica y multimedia": "Arte y Arquitectura",
    "tecnico en comunicacion social": "Ciencias Sociales",
    "tecnico en publicidad": "Ciencias Sociales",
    "tecnico en relaciones publicas": "Ciencias Sociales",
    "tecnico en servicio social": "Ciencias Sociales",
    "tecnico juridico": "Derecho",
    "tecnico en traduccion e interpretariado": "Humanidades",
    "tecnico en bibliotecas y centros de documentacion": "Humanidades",
    "analista quimico": "Ciencias Básicas",
    "construccion civil": "Tecnología",
    "quimica y farmacia": "Salud",
    "biotecnologia": "Ciencias Básicas",
    "geografia": "Ciencias Sociales",
    "arqueologia": "Humanidades",
    "antropologia": "Ciencias Sociales",
    "psicologia": "Ciencias Sociales",
    "psicopedagogia": "Educación",
    "comunicacion social": "Ciencias Sociales",
    "periodismo": "Ciencias Sociales",
    "publicidad": "Ciencias Sociales",
    "relaciones publicas": "Ciencias Sociales",
    "diseno": "Arte y Arquitectura",
    "musica, canto o danza": "Arte y Arquitectura",
    "actuacion y teatro": "Arte y Arquitectura",
    "animacion digital": "Arte y Arquitectura",
    "arquitectura": "Arte y Arquitectura",
    "paisajismo": "Arte y Arquitectura",
    "fotografia": "Arte y Arquitectura",
    "realizador de cine y television": "Arte y Arquitectura",
    "comunicacion audiovisual y/o multimedia": "Arte y Arquitectura",
    "artes y licenciatura en artes": "Arte y Arquitectura",
    "medicina": "Salud",
    "enfermeria": "Salud",
    "fonoaudiologia": "Salud",
    "kinesiologia": "Salud",
    "nutricion y dietetica": "Salud",
    "obstetricia y puericultura": "Salud",
    "odontologia": "Salud",
    "terapia ocupacional": "Salud",
    "tecnologia medica": "Salud",
    "naturopatia": "Salud",
    "derecho": "Derecho",
    "biologia": "Ciencias Básicas",
    "biologia marina y ecologia marina": "Ciencias Básicas",
    "bioquimica": "Ciencias Básicas",
    "fisica y astronomia": "Ciencias Básicas",
    "geologia": "Ciencias Básicas",
    "matematica y/o estadistica": "Ciencias Básicas",
    "quimica, licenciado en quimica": "Ciencias Básicas",
    "quimica ambiental": "Ciencias Básicas",
    "quimica industrial": "Ciencias Básicas",
    "ciencias politicas": "Ciencias Sociales",
    "sociologia": "Ciencias Sociales",
    "trabajo social": "Ciencias Sociales",
    "filosofia": "Humanidades",
    "historia": "Humanidades",
    "licenciatura en letras y literatura": "Humanidades",
    "traduccion e interpretacion": "Humanidades",
    "bibliotecologia": "Humanidades",
}

# Prefijos (normalizados) que determinan el área por nombre.
PREFIJOS_EDUCACION = (
    "pedagogia", "programas de formacion pedagogica",
    "tecnico asistente del educador", "otros profesionales de educacion",
    "otros tecnicos de educacion", "bachillerato y/o licenciatura en educacion",
)
AREA_POR_SUFIJO = {
    "administracion y comercio": "Administración y Comercio",
    "arte": "Arte y Arquitectura",
    "arte y arquitectura": "Arte y Arquitectura",
    "ciencias basicas": "Ciencias Básicas",
    "ciencias sociales": "Ciencias Sociales",
    "derecho": "Derecho",
    "educacion": "Educación",
    "humanidades": "Humanidades",
    "salud": "Salud",
    "tecnologia": "Tecnología",
}


def area_de_carrera(nombre):
    n = norm(nombre)
    if n in EXCEPCIONES:
        return EXCEPCIONES[n], "excepción por nombre"
    if n.startswith(PREFIJOS_EDUCACION):
        return "Educación", "prefijo pedagógico"
    for prefijo in ("otros profesionales de ", "otros tecnicos de ", "bachillerato y/o licenciatura en "):
        if n.startswith(prefijo):
            resto = n[len(prefijo):]
            if resto in AREA_POR_SUFIJO:
                return AREA_POR_SUFIJO[resto], "grupo declarado en el nombre"
    if n.startswith("ingenieria") or n.startswith("otras ingenierias"):
        return "Tecnología", "ingeniería por defecto"
    if n.startswith("tecnico en administracion") or n.startswith("tecnico en contabilidad") \
            or n.startswith("tecnico en comercio exterior"):
        return "Administración y Comercio", "técnico en administración o comercio"
    if n.startswith("tecnico") and any(k in n for k in CLAVES_ARTE):
        return "Arte y Arquitectura", "técnico en arte o diseño por palabra clave"
    if n.startswith("diseno"):
        return "Arte y Arquitectura", "diseño por nombre"
    if n.startswith("tecnico"):
        return "Tecnología", "técnico por defecto"
    return None, None


CLAVES_ARTE = (
    "diseno", "dibujo", "fotografia", "sonido", "ambientes", "vestuario",
    "audiovisual", "grafica", "eventos", "videojuegos", "musica", "teatro",
    "animacion", "paisajismo", "arquitectura", "artes",
)


# Grupo ocupacional SOC (dos primeros dígitos) -> área. Excepciones por código.
GRUPO_SOC = {
    "11": "Administración y Comercio", "13": "Administración y Comercio",
    "15": "Tecnología", "17": "Tecnología",
    "19": "Ciencias Básicas", "21": "Ciencias Sociales", "23": "Derecho",
    "25": "Educación", "27": "Arte y Arquitectura", "29": "Salud", "31": "Salud",
    "33": "Sin área definida", "35": "Administración y Comercio",
    "37": "Sin área definida", "39": "Sin área definida",
    "41": "Administración y Comercio", "43": "Administración y Comercio",
    "45": "Agropecuaria", "47": "Tecnología", "49": "Tecnología",
    "51": "Tecnología", "53": "Tecnología",
}
# Revisión de los grupos amplios (2026-11-14). Las claves son prefijos de
# subgrupo SOC ("19-101") o códigos completos ("11-9013.00"). Gana el prefijo
# más largo. Cada entrada se revisó por su título en español.
EXCEPCIONES_SOC = {
    # Agropecuaria: agrónomos, forestales, científicos de suelos y alimentos.
    "11-9013.00": "Agropecuaria",
    "17-2021": "Agropecuaria",
    "19-101": "Agropecuaria", "19-103": "Agropecuaria",
    "19-401": "Agropecuaria",
    "29-1131.00": "Agropecuaria",
    "51-3": "Agropecuaria",
    # Salud: científicos médicos y epidemiólogos.
    "19-104": "Salud",
    # Ciencias Básicas: biólogos, físicos, químicos y técnicos de ciencias.
    "19-4": "Ciencias Básicas",
    "15-2021": "Ciencias Básicas", "15-2041": "Ciencias Básicas",
    # Administración y Comercio: actuarios.
    "15-2011": "Administración y Comercio",
    # Tecnología: investigación de operaciones y analítica de datos.
    "15-2031": "Tecnología", "15-2051": "Tecnología",
    # Arte y Arquitectura: arquitectos, diseñadores y técnicos de medios.
    "17-101": "Arte y Arquitectura",
    "51-5": "Arte y Arquitectura",
    "27-1": "Arte y Arquitectura", "27-4": "Arte y Arquitectura",
    # Ciencias Sociales: periodistas, psicólogos, geógrafos y científicos sociales.
    "19-3": "Ciencias Sociales",
    "27-3": "Ciencias Sociales",
    # Sin área definida: deporte, cuidado de servicios, lavandería y transporte de servicio.
    "27-2": "Sin área definida",
    # Bailarines, coreógrafos y músicos: las carreras de música y danza son Arte (2026-11-14).
    "27-203": "Arte y Arquitectura",
    "27-204": "Arte y Arquitectura",
    "27-2011.00": "Arte y Arquitectura",
    "39-": "Sin área definida",
    # Tecnología: técnicos de salud y seguridad ocupacional.
    "19-5": "Tecnología",
    "51-6": "Sin área definida",
    "53-6": "Sin área definida",
    # Humanidades: bibliotecarios y archiveros.
    "25-4": "Humanidades",
    # Administración y Comercio: gastronomía (cocineros, panaderos ya en Agro arriba).
    "39-6": "Administración y Comercio",
    # Educación: cuidado infantil.
    "39-9011.00": "Educación",
    # Revisión de Administración y Comercio y Salud (2026-11-14): gerentes que
    # dirigen otro tipo de servicio, no vender ni administrar negocios.
    "11-9021.00": "Tecnología",
    "11-9041.00": "Tecnología",
    "11-9031.00": "Educación",
    "11-9032.00": "Educación",
    "11-9033.00": "Educación",
    "11-9111.00": "Salud",
    "11-9121.00": "Ciencias Básicas",
    "11-9151.00": "Ciencias Sociales",
    "11-9161.00": "Sin área definida",
    "11-9179.01": "Salud",
    "29-2056.00": "Agropecuaria",
    "31-9096.00": "Agropecuaria",
}


def area_de_ocupacion(codigo):
    if codigo in EXCEPCIONES_SOC:
        return EXCEPCIONES_SOC[codigo], "excepción por código"
    candidatas = [c for c in EXCEPCIONES_SOC if "-" in c and not c.endswith(".00") and codigo.startswith(c)]
    if candidatas:
        clave = max(candidatas, key=len)
        return EXCEPCIONES_SOC[clave], "excepción por subgrupo SOC"
    if codigo[:2] == "19":
        return "Ciencias Básicas", "grupo SOC 19-1 y 19-2"
    grupo = codigo[:2]
    if grupo in GRUPO_SOC:
        return GRUPO_SOC[grupo], "grupo SOC"
    return None, None


def main():
    PROCESADOS.mkdir(exist_ok=True)

    with open(PROCESADOS / "oferta.csv", encoding="utf-8") as f:
        filas_oferta = list(csv.DictReader(f))
    programas = Counter(r["carrera_generica"] for r in filas_oferta)
    nombres_por_generica = {}
    for r in filas_oferta:
        nombres_por_generica.setdefault(r["carrera_generica"], set()).add(norm(r["carrera_nombre_oficial"]))

    carreras = []
    sin_area = []
    for nombre in sorted(programas):
        area, regla = area_de_carrera(nombre)
        if area is None:
            sin_area.append(nombre)
            continue
        carreras.append((nombre, area, programas[nombre], regla))
    if sin_area:
        raise SystemExit(f"Carreras sin área asignada: {sin_area}")

    with open(PROCESADOS / "carreras_areas.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["carrera_generica", "area_sies", "filas_oferta", "regla"])
        for fila in carreras:
            w.writerow(fila)

    nombres_por_area = {}
    for generica, _, _, _ in carreras:
        area = next(a for g, a, _, _ in carreras if g == generica)
        nombres_por_area.setdefault(area, set()).update(nombres_por_generica.get(generica, set()))
    carreras_por_area = {area: len(nombres) for area, nombres in nombres_por_area.items()}
    programas_por_area = Counter()
    for _, area, n, _ in carreras:
        programas_por_area[area] += n

    with open(PROCESADOS / "onet_intereses.csv", encoding="utf-8") as f:
        ocupaciones = list(csv.DictReader(f))

    filas = []
    sin_area_ocup = []
    for o in ocupaciones:
        area, regla = area_de_ocupacion(o["codigo_onet"])
        if area is None:
            sin_area_ocup.append(o["codigo_onet"])
            continue
        filas.append({
            "codigo_onet": o["codigo_onet"],
            "titulo_es": o["titulo_es"] or o["titulo_en"],
            "titulo_en": o["titulo_en"],
            "area_sies": area,
            "regla": regla,
            "carreras_en_area": carreras_por_area.get(area, 0),
        })
    if sin_area_ocup:
        raise SystemExit(f"Ocupaciones sin área: {sin_area_ocup[:10]}")

    with open(PROCESADOS / "ocupacion_area.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
        w.writeheader()
        w.writerows(filas)

    meta = {
        "elaboracion": "Elaboración propia: asignación por nombre de carrera y por grupo ocupacional SOC, sin tabla oficial del SIES.",
        "areas_sies": AREAS,
        "carreras_genericas": len(carreras),
        "ocupaciones": len(filas),
        "ocupaciones_por_area": dict(Counter(f["area_sies"] for f in filas)),
        "carreras_distintas_por_area": carreras_por_area,
        "revision_manual": "pendiente: revisar a mano los casos marcados con regla por grupo SOC antes de publicar",
        "fuentes": {
            "areas": "https://www.mifuturo.cl/buscador-de-carreras/ (leído el 2026-11-13)",
            "carreras": "datos/procesados/oferta.csv (Matrícula de educación superior 2026, Datos Abiertos Mineduc)",
            "ocupaciones": "datos/procesados/onet_intereses.csv (O*NET 31.0, CC BY 4.0, con atribución al USDOL/ETA)",
        },
    }
    with open(PROCESADOS / "ocupacion_area_meta.json", "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f"Carreras genéricas: {len(carreras)}")
    print(f"Ocupaciones: {len(filas)}")
    print("Ocupaciones por área:", dict(Counter(f["area_sies"] for f in filas)))


if __name__ == "__main__":
    main()
