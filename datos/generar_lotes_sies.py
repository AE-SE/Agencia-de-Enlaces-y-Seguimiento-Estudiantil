"""Genera los lotes SQL 07 y 08 (indicadores y tramos de ingreso del SIES).

Va después del lote 1 (datos/generar_lotes.py). Igual que el lote 1: no escribe
en ninguna base y se detiene ante cualquier dato que no cumple el esquema.

Uso:
    python datos/generar_lotes_sies.py [ruta_carga.csv] [carpeta_salida]

Cómo se guarda cada dato (ADR 0014):
- El SIES publica por carrera genérica e institución, así que sus indicadores
  van a `programa_generico` (no a la variante ni al título).
- Cada carrera genérica aparece en varias filas de la carga (una por sede y
  jornada). Sus valores deben ser idénticos en todas; si no, se detiene.
- Un dato que la fuente no publica se guarda nulo con su motivo.
- Derecho y carreras con «excepción» (columna sies_excepcion_derecho = si):
  el empleabilidad al 1.er año de la fuente es de 2.º año. Se guarda nulo con
  motivo, igual que en la ficha (PR 94).
"""

from __future__ import annotations

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

import generar_lotes as base  # noqa: E402 — mismo directorio

RAIZ = base.RAIZ
CARGA_POR_DEFECTO = base.CARGA_POR_DEFECTO
SALIDA_POR_DEFECTO = base.SALIDA_POR_DEFECTO

FUENTE_SIES = {
    "organismo": "SIES, Mineduc",
    "nombre": "Buscador de Empleabilidad e Ingresos (Mi Futuro)",
}

MOTIVO_SIN_DATO = "La fuente SIES no publica este dato para esta carrera e institución."
MOTIVO_EXCEPCION = (
    "La fuente publica para esta carrera un indicador equivalente al 2.º año, "
    "no al 1.er año. No lo mostramos como si fuera de 1.er año."
)

# Columnas de carga.csv -> (tipo de indicador, unidad).
INDICADORES = [
    ("sies_retencion_1er_anio_pct", "sies_periodo_retencion", "retencion_1er_anio", "porcentaje", "sies_motivo_retencion"),
    ("sies_empleabilidad_1er_anio_pct", "sies_periodo_empleabilidad_1er_anio", "empleabilidad_1er_anio", "porcentaje", None),
    ("sies_empleabilidad_2do_anio_pct", "sies_periodo_empleabilidad_2do_anio", "empleabilidad_2do_anio", "porcentaje", "sies_motivo_empleabilidad_2do_anio"),
    ("sies_continuidad_estudios_pct", "sies_periodo_continuidad", "continuidad_estudios", "porcentaje", None),
    ("sies_duracion_real_semestres", "sies_periodo_duracion_real", "duracion_real_semestres", "semestres", "sies_motivo_duracion_real"),
]


def _nulo(valor: str) -> bool:
    return valor is None or valor.strip() == ""


def _numero(valor: str) -> float:
    return float(valor.replace(",", "."))


def _clave(r: dict[str, str]) -> tuple[str, str]:
    return (r["oferta_institucion_codigo"], base.normalizar(r["oferta_carrera_generica"]))


def _agrupar(filas: list[dict[str, str]]) -> dict[tuple[str, str], dict[str, str]]:
    """Una fila por carrera genérica; exige que todas sus filas digan lo mismo."""
    grupos: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for r in filas:
        grupos[_clave(r)].append(r)

    columnas = [c for c in filas[0].keys() if c.startswith("sies_") and c not in ("sies_institucion_codigo",)]
    conflictos = []
    unicas: dict[tuple[str, str], dict[str, str]] = {}
    for clave, lista in grupos.items():
        primera = lista[0]
        for c in columnas:
            if any(r[c] != primera[c] for r in lista):
                conflictos.append({"carrera_generica": clave, "columna": c})
                break
        unicas[clave] = primera
    if conflictos:
        raise base.ErrorDeLote(f"{len(conflictos)} conflictos SIES entre sedes de una misma carrera: {conflictos[:3]}")
    return unicas


def construir(filas: list[dict[str, str]]) -> tuple[dict[str, list[str]], dict]:
    if not filas:
        raise base.ErrorDeLote("el archivo de carga está vacío")
    lotes: dict[str, list[str]] = {"07_indicadores_sies": [], "08_ingresos_sies": []}
    informe: dict = {"carreras_genericas_sies": 0, "indicadores": 0, "indicadores_sin_dato": 0, "tramos": 0, "tramos_sin_dato": 0}

    url = next((r["sies_url_archivo"] for r in filas if r["sies_url_archivo"].strip()), "")
    fecha = next((r["sies_fecha_descarga"] for r in filas if r["sies_fecha_descarga"].strip()), "")
    if not url or not fecha:
        raise base.ErrorDeLote("falta la URL o la fecha de descarga del SIES en la carga")

    fuente_sql = (
        f"(select id from fuente where organismo = {base.sql_texto(FUENTE_SIES['organismo'])} "
        f"and nombre = {base.sql_texto(FUENTE_SIES['nombre'])})"
    )
    lotes["07_indicadores_sies"].append(
        "insert into fuente (organismo, nombre, url, terminos_de_uso, terminos_revisados_el) values ("
        f"{base.sql_texto(FUENTE_SIES['organismo'])}, {base.sql_texto(FUENTE_SIES['nombre'])}, "
        f"{base.sql_texto(url)}, NULL, NULL) on conflict (organismo, nombre) do nothing;"
    )

    unicas = _agrupar(filas)
    informe["carreras_genericas_sies"] = len(unicas)
    informe["sin_cruce_sies"] = 0

    for (cod_inst, norm), r in unicas.items():
        if not r["sies_fuente"].strip():
            # Sin cruce con el SIES: no se dice nada sobre esta carrera (no es «la fuente no publica»).
            informe["sin_cruce_sies"] += 1
            continue
        ref_generica = (
            "(select g.id from programa_generico g join institucion i on i.id = g.institucion_id "
            f"where i.codigo_oficial = {base.sql_texto(cod_inst)} and g.nombre_normalizado = {base.sql_texto(norm)})"
        )
        excepcion = r["sies_excepcion_derecho"].strip().lower() == "si"

        for col_valor, col_periodo, tipo, unidad, col_motivo in INDICADORES:
            valor_txt = r[col_valor]
            periodo = r[col_periodo].strip()
            motivo_fuente = r[col_motivo].strip() if col_motivo else ""

            if tipo == "empleabilidad_1er_anio" and excepcion:
                valor_txt, motivo = "", MOTIVO_EXCEPCION
            elif _nulo(valor_txt):
                motivo = motivo_fuente or MOTIVO_SIN_DATO
            else:
                motivo = None
                valor = _numero(valor_txt)
                if unidad == "porcentaje" and not (0 <= valor <= 100):
                    raise base.ErrorDeLote(f"porcentaje fuera de rango en {norm}: {valor}")
                if unidad == "semestres" and valor <= 0:
                    raise base.ErrorDeLote(f"duración no positiva en {norm}: {valor}")

            if _nulo(valor_txt) or motivo is not None:
                if not periodo:
                    periodo = "sin período informado por la fuente"
                informe["indicadores_sin_dato"] += 1
                valor_sql, motivo_sql = "NULL", base.sql_texto(motivo)
            else:
                if not periodo:
                    raise base.ErrorDeLote(f"valor sin período en {norm}, {tipo}")
                valor_sql, motivo_sql = base.sql_numero(valor_txt), "NULL"

            informe["indicadores"] += 1
            lotes["07_indicadores_sies"].append(
                "insert into indicador (programa_generico_id, tipo, valor, unidad, periodo, fuente_id, url, "
                "fecha_consulta, motivo_sin_dato) values ("
                f"{ref_generica}, '{tipo}', {valor_sql}, '{unidad}', {base.sql_texto(periodo)}, {fuente_sql}, "
                f"{base.sql_texto(url)}, {base.sql_fecha(fecha)}, {motivo_sql}) "
                "on conflict do nothing;"
            )

        # Ingreso al 4.º año: es un tramo de ingreso, no un promedio (tabla tramo_ingreso_sies).
        tramo = r["sies_ingreso_4to_anio_tramo"].strip()
        periodo_ingreso = r["sies_periodo_ingreso"].strip() or "sin período informado por la fuente"
        desde, hasta = r["sies_ingreso_4to_anio_desde_pesos"], r["sies_ingreso_4to_anio_hasta_pesos"]
        if excepcion:
            motivo_tramo = MOTIVO_EXCEPCION
            desde_sql = hasta_sql = tramo_sql = "NULL"
        elif _nulo(desde) or _nulo(hasta) or not tramo:
            motivo_tramo = r["sies_motivo_ingreso"].strip() or MOTIVO_SIN_DATO
            desde_sql = hasta_sql = tramo_sql = "NULL"
        else:
            motivo_tramo = None
            if _numero(hasta) <= _numero(desde):
                raise base.ErrorDeLote(f"tramo de ingreso inválido en {norm}: {desde}-{hasta}")
            desde_sql, hasta_sql = base.sql_numero(desde), base.sql_numero(hasta)
            tramo_sql = base.sql_texto(tramo)
        if motivo_tramo:
            informe["tramos_sin_dato"] += 1
        informe["tramos"] += 1
        lotes["08_ingresos_sies"].append(
            "insert into tramo_ingreso_sies (programa_generico_id, tramo_publicado, desde_pesos, hasta_pesos, "
            "periodo, fuente_id, url, fecha_consulta, motivo_sin_dato) values ("
            f"{ref_generica}, {tramo_sql}, {desde_sql}, {hasta_sql}, {base.sql_texto(periodo_ingreso)}, "
            f"{fuente_sql}, {base.sql_texto(url)}, {base.sql_fecha(fecha)}, {base.sql_texto(motivo_tramo)}) "
            "on conflict (programa_generico_id, periodo) do nothing;"
        )

    return lotes, informe


def escribir(lotes: dict[str, list[str]], informe: dict, salida: Path) -> None:
    salida.mkdir(parents=True, exist_ok=True)
    for nombre, sentencias in lotes.items():
        (salida / f"{nombre}.sql").write_text("\n".join(sentencias) + "\n", encoding="utf-8")
    (salida / "informe_sies.json").write_text(json.dumps(informe, ensure_ascii=False, indent=2), encoding="utf-8")


def main(argv: list[str]) -> int:
    carga = Path(argv[1]) if len(argv) > 1 else CARGA_POR_DEFECTO
    salida = Path(argv[2]) if len(argv) > 2 else SALIDA_POR_DEFECTO
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
