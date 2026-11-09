"""Permanencia de primer año 2028 a partir de los alumnos de primer año 2027.

Método:
    permanecen_2028 = primer_año_2027 × Σ_tipo( mezcla_2026(tipo) × retención_2025(tipo) )

- Mezcla 2026: participación de cada tipo de institución en el primer año de
  pregrado (base SIES 2026).
- Retención de primer año de la cohorte 2025 por tipo (informe SIES, agosto 2026):
  universidades 84,7 %, IP 72,5 %, CFT 69,9 %; nacional 77,9 %.

El intervalo sale solo del intervalo de primer año 2027 (entrada_primer_anio.py).
No incluye la variación de la retención entre cohortes, que no se modela aquí.

Uso:
    python permanencia_primer_anio.py <registro.csv> <fecha>
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "datos" / "pronosticos"))

from registro import Pronostico, leer, registrar  # noqa: E402

GEN = "PERMANENCIA-PRIMER-ANIO-2028"
MEZCLA_2026 = {"universidades": 161292, "ip": 166139, "cft": 43636}
RETENCION_2025 = {"universidades": 0.847, "ip": 0.725, "cft": 0.699}
METODO = "permanencia-por-tipo-v1 (primer año 2027 × mezcla × retención 2025)"
VERSION_SUPUESTOS = "mezcla 2026 constante; retención de la cohorte 2025 por tipo; intervalo heredado del primer año 2027"
VERSION_DATOS = "SIES base 2026 (mezcla) e informe de retención de primer año, cohorte 2025 (agosto 2026)"


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    registro, fecha = Path(argv[1]), argv[2]
    total_mezcla = sum(MEZCLA_2026.values())
    tasa = sum(MEZCLA_2026[t] / total_mezcla * RETENCION_2025[t] for t in MEZCLA_2026)

    nacional = next(
        f for f in leer(registro)
        if f["generacion"] == "PRIMER-ANIO-PREGRADO-2027" and f["unidad"] == "NACIONAL"
    )
    previsto = float(nacional["valor_previsto"]) * tasa
    lo = float(nacional["limite_inferior"]) * tasa
    hi = float(nacional["limite_superior"]) * tasa
    print(f"retención ponderada: {100*tasa:.1f} % · permanencia 2028: {previsto:,.0f} ({lo:,.0f} a {hi:,.0f})")

    ids = registrar(registro, [Pronostico(
        fecha_registro=fecha, generacion=GEN, unidad="NACIONAL", variable="permanecen_primer_anio",
        valor_previsto=previsto, limite_inferior=lo, limite_superior=hi,
        metodo=METODO, version_supuestos=VERSION_SUPUESTOS, version_datos=VERSION_DATOS,
    )])
    print(f"registrados: {len(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
