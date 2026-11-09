"""Registra la corrección del intervalo de la línea base PAES Regular 2027.

El registro es append-only: no se edita la fila original. La corrección es una
fila nueva para la misma comuna y variable, con el intervalo empírico calibrado
(calibrar_intervalos.py) y motivo_correccion que apunta a la fila original.

Uso:
    python corregir_intervalos_paes.py <ArchivoC_Adm2026REG.csv> <registro.csv> <fecha> <q_inf> <q_sup>
donde q_inf y q_sup son los cuantiles del cambio logarítmico (p. ej. -0.474 y 0.521).
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "calibracion"))
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from agregar_paes import UMBRAL, contar_rendidores  # noqa: E402
from registro import Pronostico, leer, registrar  # noqa: E402

GENERACION = "PAES-REGULAR-2027"
METODO = "persistencia-v2 (intervalo empírico)"
VERSION_SUPUESTOS = "persistencia-v2: cuantiles 2,5 % y 97,5 % del cambio logarítmico entre procesos (1.926 observaciones, 2020-2026)"
VERSION_DATOS = "DEMRE Adm2026REG ArchivoC (publicado 2026-03-19)"


def main(argv: list[str]) -> int:
    if len(argv) != 6:
        print(__doc__)
        return 2
    archivo_c, registro, fecha = Path(argv[1]), Path(argv[2]), argv[3]
    q_inf, q_sup = float(argv[4]), float(argv[5])
    conteo = contar_rendidores(archivo_c)

    originales = {
        (f["unidad"], f["variable"]): f["id"]
        for f in leer(registro)
        if f["generacion"] == GENERACION and f["metodo"] == "persistencia-v1"
    }

    pronosticos = []
    for comuna, n in sorted(conteo.items()):
        if n < UMBRAL:
            continue
        clave = (comuna, "rendidores")
        if clave not in originales:
            continue
        pronosticos.append(
            Pronostico(
                fecha_registro=fecha,
                generacion=GENERACION,
                unidad=comuna,
                variable="rendidores",
                valor_previsto=float(n),
                limite_inferior=n * math.exp(q_inf),
                limite_superior=n * math.exp(q_sup),
                metodo=METODO,
                version_supuestos=VERSION_SUPUESTOS,
                version_datos=VERSION_DATOS,
                motivo_correccion=f"corrige intervalo de la fila {originales[clave]} (persistencia-v1)",
            )
        )
    ids = registrar(registro, pronosticos)
    print(f"correcciones registradas: {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
