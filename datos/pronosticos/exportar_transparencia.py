"""Exporta los datos PÚBLICOS de la página de transparencia del pronóstico.

Toma lo que calcula datos/pronosticos/dashboard/generar_datos.py y deja solo
agregados nacionales y estadísticas de validación. Elige campo por campo (lista
blanca): no copia instituciones, sedes, carreras, comunas ni proporciones por
sexo. Lo que no está en la lista no sale, aunque exista en el origen.

Salida (versionada, la lee el portal): datos/transparencia/pronostico_2027.json

Uso (desde la raíz del repositorio, con datos/procesados/ generado):
    python -I datos/pronosticos/exportar_transparencia.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
SALIDA = RAIZ / "datos" / "transparencia" / "pronostico_2027.json"

sys.path.insert(0, str(AQUI / "dashboard"))
import generar_datos as g  # noqa: E402

MIN_RESIDENTES_COMPARACION = 500  # igual que el gráfico del tablero: evita comunas muy pequeñas
DIFERENCIA_GRANDE = 0.25  # «más de 25 %» en el texto de la página

CAMPOS_ESTIMACION = ("titulo", "mide", "valor", "inferior", "superior", "registrado", "metodo", "fuente", "url")
CAMPOS_INSUMO = ("valor", "mide", "fuente", "url", "consultado")
CAMPOS_VALIDACION_NACIONAL = ("periodo", "error_minimo", "error_maximo", "mide", "fuente", "url", "consultado")
CAMPOS_VERIFICACION = ("comparacion", "cuando", "estado", "detalle")
CAMPOS_FUENTE = ("nombre", "url", "nota")


def _tomar(origen: dict, campos: tuple[str, ...]) -> dict:
    faltan = [c for c in campos if c not in origen]
    if faltan:
        raise KeyError(f"falta {faltan} en {sorted(origen)}")
    return {c: origen[c] for c in campos}


def residencia_vs_colegio(comunas: list[dict]) -> dict:
    """Cuántas comunas grandes tienen una diferencia grande entre colegio y residencia."""
    grandes = [c for c in comunas
               if c["residentes"] is not None and c["colegio"] is not None
               and c["residentes"] >= MIN_RESIDENTES_COMPARACION]
    con_diferencia = [c for c in grandes if c["colegio"] / c["residentes"] - 1 > DIFERENCIA_GRANDE]
    return {
        "minimo_residentes": MIN_RESIDENTES_COMPARACION,
        "diferencia_considerada": DIFERENCIA_GRANDE,
        "comunas_comparadas": len(grandes),
        "comunas_con_diferencia_mayor": len(con_diferencia),
        "mide": "Comunas donde contar por colegio da más estudiantes de cuarto medio que contar por residencia",
        "fuente": "Ministerio de Educación (Mineduc), matrícula por estudiante 2026",
        "url": "https://datosabiertos.mineduc.cl/",
    }


def construir_publico(datos: dict) -> dict:
    """Arma el JSON público a partir de lo que devuelve generar_datos.generar()."""
    nac = datos["nacional"]
    v = datos["validacion_celdas"]
    fi = v["intervalo_2027"]
    hist = v["histograma"]
    return {
        "version": nac["version"],
        "fecha_datos": datos["meta"]["fecha_datos"],
        "estimaciones": [
            {"codigo": codigo, **_tomar(e, CAMPOS_ESTIMACION)}
            for codigo, e in nac["pronosticos"].items()
        ],
        "insumos": {
            "cohorte_residencia": _tomar(nac["insumos"]["cohorte_residencia_2026"], CAMPOS_INSUMO),
            "tasa_entrada": _tomar(nac["insumos"]["tasa_entrada_2026"], CAMPOS_INSUMO),
            "retencion_ponderada": _tomar(nac["insumos"]["retencion_ponderada"], CAMPOS_INSUMO),
        },
        "retencion_por_tipo": {
            **_tomar(nac["retencion_por_tipo"], ("cohorte", "fuente", "url", "consultado")),
            "valores": [_tomar(x, ("clave", "nombre", "retencion", "mezcla_2026"))
                        for x in nac["retencion_por_tipo"]["valores"]],
        },
        "residencia_vs_colegio": residencia_vs_colegio(datos["comunas"]["filas"]),
        "validacion_nacional": _tomar(nac["validacion_nacional"], CAMPOS_VALIDACION_NACIONAL),
        "validacion_carrera_sede": {
            "casos": v["casos"],
            "minimo_entrantes": g.MIN_CASOS,
            "error_mediano": v["error_mediano"],
            "cobertura": v["cobertura"],
            "ancho_mediano": v["ancho_mediano"],
            "factor_bajo": fi["factor_bajo"],
            "factor_alto": fi["factor_alto"],
            "q_bajo": fi["q_bajo"],
            "q_alto": fi["q_alto"],
            "por_anio": [_tomar(a, ("anio", "casos", "error_mediano", "cobertura", "ancho")) for a in v["por_anio"]],
            "por_tramo": [_tomar(t, ("tramo", "casos", "error_mediano", "cobertura")) for t in v["por_tramo"]],
            "histograma": _tomar(hist, ("inicio", "paso", "conteos", "fuera_bajo", "fuera_alto")),
            "fuente": v["fuente"],
            "url": v["url"],
            "consultado": v["consultado"],
        },
        "validacion_comunas": {
            "pasos": [_tomar(p, ("desde", "hasta", "comunas", "error_mediano", "cobertura_poisson", "cobertura_empirico"))
                      for p in datos["validacion_comunas"]["pasos"]],
            "fuente": datos["validacion_comunas"]["fuente"],
            "consultado": datos["validacion_comunas"]["consultado"],
        },
        "paes": {
            "serie": [_tomar(s, ("anio", "filas", "regulares")) for s in datos["paes"]["serie"]],
            "definicion": datos["paes"]["definicion"],
            "fuente": datos["paes"]["fuente"],
            "url": datos["paes"]["url"],
            "consultado": datos["paes"]["consultado"],
        },
        "calendario": [_tomar(c, CAMPOS_VERIFICACION) for c in nac["verificacion"]],
        "fuentes": [_tomar(f, CAMPOS_FUENTE) for f in nac["fuentes"]],
    }


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    try:
        datos = g.generar()
    except FileNotFoundError as e:
        print(f"Falta un archivo de datos/procesados/: {e.filename}")
        return 1
    publico = construir_publico(datos)
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(json.dumps(publico, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    rv = publico["residencia_vs_colegio"]
    print(f"{SALIDA.relative_to(RAIZ)}: {SALIDA.stat().st_size / 1024:.0f} KB")
    print(f"validación por carrera y sede: {publico['validacion_carrera_sede']['casos']} casos")
    print(f"comunas con diferencia colegio-residencia mayor a {int(rv['diferencia_considerada'] * 100)} %: "
          f"{rv['comunas_con_diferencia_mayor']} de {rv['comunas_comparadas']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
