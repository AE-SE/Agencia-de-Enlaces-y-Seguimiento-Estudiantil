"""Registro de pronósticos, solo para agregar y verificable.

Cada pronóstico se escribe una vez, con su fecha y sus versiones de datos y
supuestos, y encadena el hash de la fila anterior. Así, cualquier cambio
posterior en el archivo rompe la cadena y se detecta. Nunca se reescriben
filas: una corrección se registra como una fila nueva que apunta a la
anterior.

Solo biblioteca estándar, para no agregar dependencias (AGENTS.md 2.3).
"""

from __future__ import annotations

import csv
import hashlib
import uuid
from dataclasses import dataclass, asdict
from pathlib import Path

ENCABEZADO = [
    "id",
    "fecha_registro",
    "generacion",
    "unidad",
    "variable",
    "valor_previsto",
    "limite_inferior",
    "limite_superior",
    "metodo",
    "version_supuestos",
    "version_datos",
    "motivo_correccion",
    "hash_previo",
    "hash_propio",
]


@dataclass(frozen=True)
class Pronostico:
    fecha_registro: str  # AAAA-MM-DD
    generacion: str  # p. ej. "PAES-2026"
    unidad: str  # código de comuna o región
    variable: str  # p. ej. "rendidores"
    valor_previsto: float
    limite_inferior: float
    limite_superior: float
    metodo: str
    version_supuestos: str
    version_datos: str
    motivo_correccion: str = ""


def _hash_fila(campos: dict[str, str]) -> str:
    """Hash estable de una fila, sin su propio hash."""
    base = "|".join(f"{k}={campos[k]}" for k in ENCABEZADO if k != "hash_propio")
    return hashlib.sha256(base.encode("utf-8")).hexdigest()


def _ultimo_hash(ruta: Path) -> str:
    if not ruta.exists():
        return "INICIO"
    with ruta.open(newline="", encoding="utf-8") as f:
        filas = list(csv.DictReader(f))
    return filas[-1]["hash_propio"] if filas else "INICIO"


def registrar(ruta: Path, pronosticos: list[Pronostico]) -> list[str]:
    """Agrega pronósticos al final del archivo. Devuelve sus ids."""
    for p in pronosticos:
        if not (p.limite_inferior <= p.valor_previsto <= p.limite_superior):
            raise ValueError(
                f"Intervalo inválido para {p.unidad}/{p.variable}: "
                f"{p.limite_inferior} ≤ {p.valor_previsto} ≤ {p.limite_superior} no se cumple"
            )

    ruta.parent.mkdir(parents=True, exist_ok=True)
    nuevo_archivo = not ruta.exists()
    previo = _ultimo_hash(ruta)
    ids: list[str] = []

    with ruta.open("a", newline="", encoding="utf-8") as f:
        escritor = csv.DictWriter(f, fieldnames=ENCABEZADO)
        if nuevo_archivo:
            escritor.writeheader()
        for p in pronosticos:
            fila = {k: str(v) for k, v in asdict(p).items()}
            fila["id"] = uuid.uuid4().hex
            fila["hash_previo"] = previo
            fila["hash_propio"] = ""
            fila["hash_propio"] = _hash_fila(fila)
            escritor.writerow(fila)
            previo = fila["hash_propio"]
            ids.append(fila["id"])
    return ids


def verificar_cadena(ruta: Path) -> bool:
    """True si ninguna fila fue alterada, borrada ni reordenada."""
    if not ruta.exists():
        return True
    with ruta.open(newline="", encoding="utf-8") as f:
        filas = list(csv.DictReader(f))
    previo = "INICIO"
    for fila in filas:
        if fila["hash_previo"] != previo:
            return False
        if fila["hash_propio"] != _hash_fila(fila):
            return False
        previo = fila["hash_propio"]
    return True


def leer(ruta: Path) -> list[dict[str, str]]:
    if not ruta.exists():
        return []
    with ruta.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def comparar(registro: list[dict[str, str]], observados: dict[tuple[str, str], float]) -> list[dict]:
    """Compara cada pronóstico con su valor observado, cuando existe.

    `observados` mapea (unidad, variable) a la cifra publicada. Los pronósticos
    sin observación quedan fuera: no se inventa un valor.
    """
    salida = []
    for fila in registro:
        clave = (fila["unidad"], fila["variable"])
        if clave not in observados:
            continue
        real = observados[clave]
        previsto = float(fila["valor_previsto"])
        inferior = float(fila["limite_inferior"])
        superior = float(fila["limite_superior"])
        salida.append(
            {
                "id": fila["id"],
                "generacion": fila["generacion"],
                "unidad": fila["unidad"],
                "variable": fila["variable"],
                "previsto": previsto,
                "observado": real,
                "error_absoluto": abs(previsto - real),
                "dentro_intervalo": inferior <= real <= superior,
            }
        )
    return salida
