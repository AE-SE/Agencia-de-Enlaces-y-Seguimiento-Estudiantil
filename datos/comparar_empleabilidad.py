"""Genera las comparaciones N1 a partir del CSV ya validado por cargar_empleabilidad.py."""

import csv
import json
from collections import defaultdict
from decimal import Decimal, InvalidOperation
from statistics import mean, median

from cargar_empleabilidad import NOTA_DERECHO
from exportar_areas_sies import ORIGEN, areas_por_generica, fuente_unica
from generar_lotes import normalizar

DESTINO = ORIGEN.with_name("comparaciones_empleabilidad.json")


def resumen(valores):
    suficiente = len(valores) >= 2
    return {
        "instituciones": len(valores),
        "minimo_pct": float(min(valores)) if suficiente else None,
        "mediana_pct": float(median(valores)) if suficiente else None,
        "maximo_pct": float(max(valores)) if suficiente else None,
        "motivo": None if suficiente else "Sin datos suficientes",
    }


def comparar(filas):
    fuente = fuente_unica(filas)
    areas = areas_por_generica(filas)
    carreras = defaultdict(dict)
    por_area = defaultdict(list)
    excepciones = defaultdict(set)

    for fila in filas:
        generica = normalizar(fila["carrera_generica"])
        periodo = fila["periodo_empleabilidad_1er_anio"]
        institucion = fila["sies_institucion_codigo"]
        tasas = carreras[generica, periodo]
        if not generica or not periodo or not institucion.isdecimal() or institucion in tasas:
            raise ValueError(f"Clave inválida o repetida: {generica}, {periodo}, {institucion}")
        if fila["excepcion_derecho"] == "si":
            tasas[institucion] = None
            excepciones[generica, periodo].add(institucion)
            continue
        try:
            tasa = Decimal(fila["empleabilidad_1er_anio_pct"])
            if not tasa.is_finite() or not 0 <= tasa <= 100:
                raise ValueError(f"Porcentaje fuera de rango: {tasa}")
        except InvalidOperation:
            tasa = None
        tasas[institucion] = tasa
        area = areas.get(generica)
        if area:
            tasas_area = por_area[area, periodo]
            if tasa is not None:
                tasas_area.append((institucion, tasa))

    referencias = {}
    for (area, periodo), tasas in sorted(por_area.items()):
        instituciones = len({codigo for codigo, _ in tasas})
        referencias.setdefault(periodo, {})[area] = {
            "instituciones": instituciones,
            "filas_carrera_institucion": len(tasas),
            "promedio_pct": float(round(mean(tasa for _, tasa in tasas), 2)) if instituciones >= 2 else None,
            "motivo": None if instituciones >= 2 else "Sin datos suficientes",
        }

    comparaciones = {}
    for (generica, periodo), tasas in sorted(carreras.items()):
        validas = {codigo: tasa for codigo, tasa in tasas.items() if tasa is not None}
        area = areas.get(generica)
        comparaciones.setdefault(generica, {})[periodo] = {
            "todas": resumen(list(validas.values())),
            "otras_por_institucion": {
                codigo: resumen([tasa for otra, tasa in validas.items() if otra != codigo])
                for codigo in sorted(tasas)
            },
            "instituciones_sin_tasa": sorted(tasas.keys() - validas.keys()),
            "instituciones_con_excepcion_derecho": sorted(excepciones.get((generica, periodo), ())),
            "area_sies": area,
            "motivo_area": None if area else "TODO(fuente): el SIES no informa el área",
        }

    return {
        "fuente": fuente["fuente"],
        "url": fuente["url"],
        "fecha_descarga": fuente["fecha_consulta"],
        "indicador": "Empleabilidad al 1.er año",
        "atribucion": "elaboración propia",
        "metodo_carrera": "Mínimo, mediana y máximo de las tasas publicadas por institución para la misma carrera y período.",
        "metodo_area": "Media simple de las tasas publicadas por par carrera–institución de la misma área y período.",
        "motivo_sin_tasa": "El SIES no informa una tasa utilizable para esta comparación.",
        "motivo_excepcion_derecho": NOTA_DERECHO,
        "por_carrera": comparaciones,
        "por_area": referencias,
    }


def main():
    with ORIGEN.open(encoding="utf-8", newline="") as archivo:
        comparaciones = comparar(list(csv.DictReader(archivo)))
    DESTINO.write_text(json.dumps(comparaciones, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Comparaciones de {len(comparaciones['por_carrera'])} carreras escritas en {DESTINO}")


if __name__ == "__main__":
    main()
