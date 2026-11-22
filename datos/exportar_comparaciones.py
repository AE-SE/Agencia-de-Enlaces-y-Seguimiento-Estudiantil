"""Exporta las comparaciones de empleabilidad de la ficha a lib/datos/comparaciones-empleabilidad.json.

Origen: datos/procesados/comparaciones_empleabilidad.json, que genera comparar_empleabilidad.py
(elaboración propia con el Buscador de Empleabilidad e Ingresos del SIES). Esa carpeta no se
versiona; el JSON de lib/datos/ sí, para que el sitio lo lea sin base de datos.

Uso (desde datos/):  python exportar_comparaciones.py [ruta del JSON de origen]
También acepta la variable COMPARACIONES_ORIGEN. De cada carrera se conservan solo «todas» y
«otras_por_institucion»; las claves con valor nulo se omiten (una cifra ausente no se lee como cero).
Solo biblioteca estándar de Python.
"""

import json
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
ORIGEN = RAIZ / "procesados" / "comparaciones_empleabilidad.json"
DESTINO = RAIZ.parent / "lib" / "datos" / "comparaciones-empleabilidad.json"

CAMPOS_GENERALES = (
    "fuente", "url", "fecha_descarga", "indicador", "atribucion", "metodo_carrera",
    "metodo_area", "motivo_sin_tasa", "motivo_excepcion_derecho",
)


def sin_nulos(valor: dict) -> dict:
    return {k: v for k, v in valor.items() if v is not None}


def exportar(origen: dict) -> dict:
    """Arma el JSON del sitio a partir del de comparar_empleabilidad.py."""
    faltan = [c for c in (*CAMPOS_GENERALES, "por_carrera", "por_area") if c not in origen]
    if faltan:
        raise SystemExit(f"Al archivo de origen le faltan campos: {faltan}")
    salida = {campo: origen[campo] for campo in CAMPOS_GENERALES}
    salida["por_carrera"] = {
        generica: {
            periodo: {
                "todas": sin_nulos(c["todas"]),
                "otras_por_institucion": {i: sin_nulos(o) for i, o in c["otras_por_institucion"].items()},
                # Se conserva para que el sitio avise de Derecho sin mostrar cifras de otro año.
                **({"instituciones_con_excepcion_derecho": c["instituciones_con_excepcion_derecho"]} if c["instituciones_con_excepcion_derecho"] else {}),
            }
            for periodo, c in periodos.items()
        }
        for generica, periodos in origen["por_carrera"].items()
    }
    salida["por_area"] = {periodo: {area: sin_nulos(a) for area, a in areas.items()} for periodo, areas in origen["por_area"].items()}
    return salida


def main() -> None:
    ruta = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("COMPARACIONES_ORIGEN", ORIGEN))
    with open(ruta, encoding="utf-8") as f:
        salida = exportar(json.load(f))
    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(f"Comparaciones exportadas: {len(salida['por_carrera'])} carreras genéricas, {DESTINO.stat().st_size} bytes -> {DESTINO}")


if __name__ == "__main__":
    main()
