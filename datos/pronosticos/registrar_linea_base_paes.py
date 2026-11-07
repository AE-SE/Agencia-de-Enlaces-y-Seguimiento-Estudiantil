"""Registra la línea base de rendidores de la PAES Regular 2027 por comuna.

Método: persistencia. El pronóstico de rendidores de la PAES Regular del
proceso 2027 es igual al conteo observado de la PAES Regular del proceso 2026
en la misma comuna. Es la referencia mínima: un modelo que no la supere no
aporta.

Intervalo: solo variabilidad muestral (Poisson, n ± 1,96·√n). No incluye
cambios de cohorte ni de política. La versión de supuestos lo dice.

Solo se registran comunas publicables (≥ 10 rendidores), igual que en la tabla
agregada. El registro es append-only y encadenado (registro.py).

Uso:
    python registrar_linea_base_paes.py <ArchivoC_Adm2026REG.csv> <registro.csv> <fecha AAAA-MM-DD>
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "calibracion"))
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from agregar_paes import UMBRAL, contar_rendidores  # noqa: E402
from registro import Pronostico, registrar  # noqa: E402

GENERACION = "PAES-REGULAR-2027"
METODO = "persistencia-v1"
VERSION_SUPUESTOS = "persistencia-v1 (intervalo Poisson, sin cambio de cohorte)"
VERSION_DATOS = "DEMRE Adm2026REG ArchivoC (publicado 2026-03-19)"


def intervalo(n: int) -> tuple[float, float]:
    """Intervalo de 95 % por variabilidad muestral."""
    delta = 1.96 * math.sqrt(n)
    return max(0.0, n - delta), n + delta


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__)
        return 2
    archivo_c, registro, fecha = Path(argv[1]), Path(argv[2]), argv[3]
    conteo = contar_rendidores(archivo_c)
    pronosticos = []
    for comuna, n in sorted(conteo.items()):
        if n < UMBRAL:
            continue
        inferior, superior = intervalo(n)
        pronosticos.append(
            Pronostico(
                fecha_registro=fecha,
                generacion=GENERACION,
                unidad=comuna,
                variable="rendidores",
                valor_previsto=float(n),
                limite_inferior=inferior,
                limite_superior=superior,
                metodo=METODO,
                version_supuestos=VERSION_SUPUESTOS,
                version_datos=VERSION_DATOS,
            )
        )
    ids = registrar(registro, pronosticos)
    print(f"registrados: {len(ids)} comunas · suprimidas (<{UMBRAL}): {len(conteo) - len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
