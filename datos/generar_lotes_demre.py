"""Genera los lotes SQL 09 y 10 (vacantes y requisitos de admisión del DEMRE).

Va después de los lotes 1 a 8. No escribe en ninguna base; se detiene ante un
dato que no cumple el esquema.

Uso:
    python datos/generar_lotes_demre.py [ruta_carga.csv] [carpeta_salida]

Reglas:
- Se cruza cada fila DEMRE con la variante por su código DEMRE (codigo_demre).
- Un cupo que el DEMRE no publica se guarda nulo con su motivo.
- Las ponderaciones deben sumar 100 según la regla del esquema; si una fila no
  suma 100, el generador se detiene y la muestra.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import generar_lotes as base

FUENTE_DEMRE = {
    "organismo": "DEMRE",
    "nombre": "Oferta definitiva de carreras, vacantes y ponderaciones (Admisión 2027)",
}

# Vía de admisión -> columna de carga.csv
VIAS = [
    ("regular", "demre_vacantes_regular"),
    ("regular_2do_semestre", "demre_vacantes_regular_2do_semestre"),
    ("mc", "demre_vacantes_mc"),
    ("bea", "demre_vacantes_bea"),
    ("pace", "demre_vacantes_pace"),
]

MOTIVO_CUPOS = "DEMRE no publica cupos para esta vía en esta carrera."


def _entero(valor: str) -> int | None:
    return int(float(valor)) if valor.strip() else None


def _suma_ponderaciones(r: dict[str, str]) -> int:
    v = {k: (_entero(r[k]) or 0) for k in (
        "demre_nem", "demre_ranking", "demre_lectora", "demre_matematica_1", "demre_matematica_2",
        "demre_historia_cs_sociales", "demre_ciencias", "demre_prueba_especial",
        "demre_asignacion_especial_pedagogia")}
    hc = r["demre_historia_o_ciencias"].strip().lower() == "si"
    parte_historia_ciencias = (
        max(v["demre_historia_cs_sociales"], v["demre_ciencias"]) if hc
        else v["demre_historia_cs_sociales"] + v["demre_ciencias"]
    )
    return (
        v["demre_nem"] + v["demre_ranking"] + v["demre_lectora"] + v["demre_matematica_1"]
        + v["demre_matematica_2"] + v["demre_prueba_especial"]
        + v["demre_asignacion_especial_pedagogia"] + parte_historia_ciencias
    )


def construir(filas: list[dict[str, str]]) -> tuple[dict[str, list[str]], dict]:
    con_demre = [r for r in filas if r["demre_codigo"].strip()]
    if not con_demre:
        raise base.ErrorDeLote("la carga no tiene filas DEMRE")

    url = con_demre[0]["demre_url_archivo"]
    fecha = con_demre[0]["demre_fecha_descarga"]
    periodo = con_demre[0]["demre_periodo"]
    if not url or not fecha or not periodo:
        raise base.ErrorDeLote("falta URL, fecha o período DEMRE en la carga")

    malas = [(r["demre_codigo"], _suma_ponderaciones(r)) for r in con_demre if _suma_ponderaciones(r) != 100]
    if malas:
        raise base.ErrorDeLote(f"{len(malas)} carreras no suman 100 en ponderaciones: {malas[:5]}")

    fuente_sql = (
        f"(select id from fuente where organismo = {base.sql_texto(FUENTE_DEMRE['organismo'])} "
        f"and nombre = {base.sql_texto(FUENTE_DEMRE['nombre'])})"
    )
    lotes: dict[str, list[str]] = {"09_vacantes_demre": [], "10_requisitos_demre": []}
    lotes["09_vacantes_demre"].append(
        "insert into fuente (organismo, nombre, url, terminos_de_uso, terminos_revisados_el) values ("
        f"{base.sql_texto(FUENTE_DEMRE['organismo'])}, {base.sql_texto(FUENTE_DEMRE['nombre'])}, "
        f"{base.sql_texto(url)}, NULL, NULL) on conflict (organismo, nombre) do nothing;"
    )

    ref_variante = lambda codigo: f"(select id from programa_variante where codigo_demre = {base.sql_texto(codigo)})"  # noqa: E731

    cupos_filas = 0
    cupos_sin_dato = 0
    for r in con_demre:
        codigo = r["demre_codigo"].strip()
        for via, col in VIAS:
            cupos = _entero(r[col])
            if cupos is None:
                motivo_sql, cupos_sql = base.sql_texto(MOTIVO_CUPOS), "NULL"
                cupos_sin_dato += 1
            else:
                if cupos < 0:
                    raise base.ErrorDeLote(f"cupos negativos en {codigo}, {via}: {cupos}")
                motivo_sql, cupos_sql = "NULL", str(cupos)
            cupos_filas += 1
            lotes["09_vacantes_demre"].append(
                "insert into vacante_admision (variante_id, via, cupos, periodo, fuente_id, url, "
                "fecha_consulta, motivo_sin_dato) values ("
                f"{ref_variante(codigo)}, '{via}', {cupos_sql}, {base.sql_texto(periodo)}, {fuente_sql}, "
                f"{base.sql_texto(url)}, {base.sql_fecha(fecha)}, {motivo_sql}) "
                "on conflict do nothing;"
            )

        hc = "true" if r["demre_historia_o_ciencias"].strip().lower() == "si" else "false"
        lotes["10_requisitos_demre"].append(
            "insert into requisito_admision (variante_id, nem, ranking, competencia_lectora, matematica_1, "
            "matematica_2, historia_cs_sociales, ciencias, historia_o_ciencias, prueba_especial, "
            "asignacion_especial_pedagogia, puntaje_ponderado_minimo, puntaje_promedio_minimo, pagina_pdf, "
            "periodo, fuente_id, url, fecha_consulta) values ("
            f"{ref_variante(codigo)}, {base.sql_entero(r['demre_nem'])}, {base.sql_entero(r['demre_ranking'])}, "
            f"{base.sql_entero(r['demre_lectora'])}, {base.sql_entero(r['demre_matematica_1'])}, "
            f"{base.sql_entero(r['demre_matematica_2'])}, {base.sql_entero(r['demre_historia_cs_sociales'])}, "
            f"{base.sql_entero(r['demre_ciencias'])}, {hc}, {base.sql_entero(r['demre_prueba_especial'])}, "
            f"{base.sql_entero(r['demre_asignacion_especial_pedagogia'])}, "
            f"{base.sql_numero(r['demre_puntaje_ponderado_minimo'])}, {base.sql_numero(r['demre_puntaje_promedio_minimo'])}, "
            f"{base.sql_entero(r['demre_pagina_pdf'])}, {base.sql_texto(periodo)}, {fuente_sql}, "
            f"{base.sql_texto(url)}, {base.sql_fecha(fecha)}) "
            "on conflict (variante_id, periodo) do nothing;"
        )

    informe = {
        "carreras_con_demre": len(con_demre),
        "vacantes": cupos_filas,
        "vacantes_sin_dato": cupos_sin_dato,
        "requisitos": len(con_demre),
        "ponderaciones_que_suman_100": len(con_demre),
    }
    return lotes, informe


def escribir(lotes: dict[str, list[str]], informe: dict, salida: Path) -> None:
    salida.mkdir(parents=True, exist_ok=True)
    for nombre, sentencias in lotes.items():
        (salida / f"{nombre}.sql").write_text("\n".join(sentencias) + "\n", encoding="utf-8")
    (salida / "informe_demre.json").write_text(json.dumps(informe, ensure_ascii=False, indent=2), encoding="utf-8")


def main(argv: list[str]) -> int:
    carga = Path(argv[1]) if len(argv) > 1 else base.CARGA_POR_DEFECTO
    salida = Path(argv[2]) if len(argv) > 2 else base.SALIDA_POR_DEFECTO
    try:
        lotes, informe = construir(base.leer(carga))
    except base.ErrorDeLote as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    escribir(lotes, informe, salida)
    print(json.dumps(informe, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
