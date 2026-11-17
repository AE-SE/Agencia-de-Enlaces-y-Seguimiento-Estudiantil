"""Genera el lote SQL 13 (puntaje del último seleccionado por carrera, proceso de admisión 2026).

Va después de los lotes 1 a 11. No escribe en ninguna base; solo genera un archivo SQL y un informe.

Uso:
    python datos/generar_lotes_corte.py [carga.csv] [ArchivoD.csv] [Estadisticas.csv] [carpeta_salida] [AAAA-MM-DD]

Entradas (los archivos del DEMRE no se suben a git; van en datos/crudos/demre/):
- carga.csv: la carga de Mineduc; de ahí sale el cruce código DEMRE -> código SIES de la variante.
- ArchivoD_Adm2026REG.csv: «Archivo D» de los datos abiertos del DEMRE (postulación y selección):
  una fila por preferencia de cada postulante anónimo, con su estado, su tipo y su puntaje ponderado.
- ADM2026_INDICADORES_POR_CARRERA_...csv: «Estadísticas de Selección» del DEMRE (oficial, por carrera),
  de donde se toma el número de seleccionados por la vía regular (NUM_SELEC_REG).
- La fecha es la de descarga de los archivos; va como fecha de consulta.

Qué se calcula: el puntaje ponderado mínimo entre las preferencias con estado 24 («estás
seleccionada/o para esta carrera») y tipo REGULAR de cada carrera. Es el último seleccionado de la
selección del 19 de enero de 2026, no el último matriculado: la lista de espera lo baja un poco.
Es elaboración propia con «Datos abiertos DEMRE 2026».

Reglas (acordadas con el líder el 17-nov-2026):
- El DEMRE quita registros de sus datos abiertos para proteger la identidad. Si el número de
  seleccionados que sale del archivo no es igual a NUM_SELEC_REG oficial, el mínimo podría estar
  sobrestimado: no se publica y se guarda nulo con su motivo. Validado el 17-nov-2026: la cifra
  coincide con la que publica la UDD para Medicina (956,4) y para Ingeniería Civil en Biomedicina (881,4).
- Con menos de 8 seleccionados por la vía regular tampoco se publica: es la regla del propio DEMRE
  para los subgrupos pequeños y evita mostrar el puntaje de una sola persona.
- Una carrera que el DEMRE no incluye en sus estadísticas de 2026, o que no está en la carga de Mineduc,
  no recibe fila: no se dice nada de ella.
- Nunca se identifica a nadie ni se imprime una fila de una persona: solo agregados por carrera
  (condiciones de uso de los datos abiertos del DEMRE).
"""

from __future__ import annotations

import csv
import io
import json
import sys
from collections import defaultdict
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path

import generar_lotes as base

RAIZ = Path(__file__).resolve().parent.parent
CRUDOS = RAIZ / "datos" / "crudos" / "demre"

FUENTE = {
    "organismo": "Datos abiertos DEMRE",
    "nombre": "Postulación y selección (Archivo D) y Estadísticas de Selección, proceso de admisión 2026",
}
URL_PORTAL = "https://portal-transparencia.demre.cl/portal-base-datos"
PERIODO = "selección del 19 de enero de 2026, vía regular"

ESTADO_SELECCIONADO = "24"  # «ESTÁS SELECCIONADA/O PARA ESTA CARRERA» (libro de códigos del Archivo D)
TIPO_REGULAR = "REGULAR"
MINIMO_SELECCIONADOS = 8
PUNTAJE_MINIMO = Decimal("150")
PUNTAJE_MAXIMO = Decimal("1000")

MOTIVO_NO_COINCIDE = (
    "El DEMRE quita registros de sus datos abiertos para proteger la identidad de las personas. "
    "En esta carrera los datos no coinciden con sus estadísticas oficiales, "
    "así que no podemos asegurar el puntaje del último seleccionado."
)
MOTIVO_POCOS = (
    "Esta carrera tuvo menos de 8 personas seleccionadas por la vía regular. "
    "No publicamos su puntaje para no mostrar el de una sola persona."
)
MOTIVO_SIN_SELECCIONADOS = "Esta carrera no tuvo personas seleccionadas por la vía regular en 2026."


def _puntaje(texto: str) -> Decimal | None:
    try:
        return Decimal(texto.strip().replace(",", "."))
    except (InvalidOperation, AttributeError):
        return None


def leer_archivo_d(ruta: Path) -> dict[str, dict]:
    """Por carrera: cuántas preferencias regulares quedaron seleccionadas, cuántas sin puntaje y el mínimo."""
    por_carrera: dict[str, dict] = defaultdict(lambda: {"seleccionados": 0, "sin_puntaje": 0, "minimo": None})
    with io.open(ruta, encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            if r["ESTADO_PREF"] != ESTADO_SELECCIONADO or r["TIPO_PREF"] != TIPO_REGULAR:
                continue
            datos = por_carrera[r["COD_CARRERA_PREF"]]
            datos["seleccionados"] += 1
            puntaje = _puntaje(r["PTJE_PREF"])
            if puntaje is None:
                datos["sin_puntaje"] += 1
            elif datos["minimo"] is None or puntaje < datos["minimo"]:
                datos["minimo"] = puntaje
    return por_carrera


def leer_estadisticas(ruta: Path) -> dict[str, int | None]:
    """NUM_SELEC_REG oficial por código de carrera DEMRE."""
    oficiales: dict[str, int | None] = {}
    with io.open(ruta, encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            texto = r["NUM_SELEC_REG"].strip()
            oficiales[r["CODIGO_CARRERA"]] = int(float(texto)) if texto else None
    return oficiales


def leer_variantes(ruta: Path) -> dict[str, str]:
    """Código DEMRE -> código SIES de la variante, desde la carga de Mineduc."""
    variantes: dict[str, str] = {}
    for r in base.leer(ruta):
        demre = r.get("oferta_codigo_demre", "").strip()
        if demre:
            if demre in variantes and variantes[demre] != r["oferta_codigo_sies"]:
                raise base.ErrorDeLote(f"el código DEMRE {demre} corresponde a más de una variante")
            variantes[demre] = r["oferta_codigo_sies"]
    return variantes


def calcular(archivo_d: dict[str, dict], oficiales: dict[str, int | None], variantes: dict[str, str]) -> tuple[list[dict], dict]:
    resultados: list[dict] = []
    informe = {
        "carreras_en_estadisticas": len(oficiales),
        "sin_variante_en_la_carga": 0,
        "publicadas": 0,
        "sin_datos_no_coincide": 0,
        "sin_datos_pocos_seleccionados": 0,
        "sin_datos_sin_seleccionados": 0,
        "no_estan_en_estadisticas_2026": 0,
    }
    informe["no_estan_en_estadisticas_2026"] = sum(1 for demre in variantes if demre not in oficiales)
    for demre in sorted(oficiales):
        codigo_sies = variantes.get(demre)
        if codigo_sies is None:
            informe["sin_variante_en_la_carga"] += 1
            continue
        esperado = oficiales[demre]
        datos = archivo_d.get(demre, {"seleccionados": 0, "sin_puntaje": 0, "minimo": None})
        valor, motivo = None, None
        if esperado == 0 and datos["seleccionados"] == 0:
            motivo = MOTIVO_SIN_SELECCIONADOS
            informe["sin_datos_sin_seleccionados"] += 1
        elif esperado is None or datos["seleccionados"] != esperado or datos["sin_puntaje"] > 0 or datos["minimo"] is None:
            motivo = MOTIVO_NO_COINCIDE
            informe["sin_datos_no_coincide"] += 1
        elif esperado < MINIMO_SELECCIONADOS:
            motivo = MOTIVO_POCOS
            informe["sin_datos_pocos_seleccionados"] += 1
        else:
            valor = datos["minimo"]
            if not (PUNTAJE_MINIMO <= valor <= PUNTAJE_MAXIMO):
                raise base.ErrorDeLote(f"puntaje fuera del rango oficial en la carrera DEMRE {demre}: {valor}")
            informe["publicadas"] += 1
        resultados.append({"codigo_demre": demre, "codigo_sies": codigo_sies, "valor": valor, "motivo": motivo,
                           "seleccionados": datos["seleccionados"]})
    return resultados, informe


def construir(resultados: list[dict], fecha_consulta: str) -> dict[str, list[str]]:
    base.sql_fecha(fecha_consulta)  # lanza si la fecha es inválida
    lotes: dict[str, list[str]] = {"13_puntajes_corte": []}
    lotes["13_puntajes_corte"].append(
        "insert into fuente (organismo, nombre, url, terminos_de_uso, terminos_revisados_el) values ("
        f"{base.sql_texto(FUENTE['organismo'])}, {base.sql_texto(FUENTE['nombre'])}, {base.sql_texto(URL_PORTAL)}, "
        "'Citar «Datos abiertos DEMRE 2026»; prohibido identificar postulantes; el DEMRE retira registros y las cifras pueden no coincidir con las oficiales', "
        "'2026-11-17') on conflict (organismo, nombre) do nothing;"
    )
    for r in resultados:
        valor_sql = "NULL" if r["valor"] is None else base.sql_numero(str(r["valor"]))
        motivo_sql = base.sql_texto(r["motivo"]) if r["motivo"] else "NULL"
        lotes["13_puntajes_corte"].append(
            "insert into indicador (programa_id, variante_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta, motivo_sin_dato) "
            f"select v.programa_id, v.id, 'puntaje_corte', {valor_sql}, 'puntos', {base.sql_texto(PERIODO)}, "
            f"(select id from fuente where organismo = {base.sql_texto(FUENTE['organismo'])} and nombre = {base.sql_texto(FUENTE['nombre'])}), "
            f"{base.sql_texto(URL_PORTAL)}, {base.sql_fecha(fecha_consulta)}, {motivo_sql} "
            f"from programa_variante v where v.codigo_sies = {base.sql_texto(r['codigo_sies'])} "
            "on conflict on constraint indicador_unico do nothing;"
        )
    return lotes


def main(argv: list[str]) -> int:
    carga = Path(argv[1]) if len(argv) > 1 else base.CARGA_POR_DEFECTO
    archivo_d = Path(argv[2]) if len(argv) > 2 else CRUDOS / "ArchivoD_Adm2026REG.csv"
    estadisticas = Path(argv[3]) if len(argv) > 3 else next(CRUDOS.glob("ADM2026_INDICADORES_POR_CARRERA_*.csv"), CRUDOS / "estadisticas.csv")
    salida = Path(argv[4]) if len(argv) > 4 else base.SALIDA_POR_DEFECTO
    fecha = argv[5] if len(argv) > 5 else date.today().isoformat()
    try:
        resultados, informe = calcular(leer_archivo_d(archivo_d), leer_estadisticas(estadisticas), leer_variantes(carga))
        lotes = construir(resultados, fecha)
    except (base.ErrorDeLote, FileNotFoundError, KeyError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    salida.mkdir(parents=True, exist_ok=True)
    (salida / "13_puntajes_corte.sql").write_text("\n".join(lotes["13_puntajes_corte"]) + "\n", encoding="utf-8")
    (salida / "informe_corte.json").write_text(json.dumps(informe, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(informe, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
