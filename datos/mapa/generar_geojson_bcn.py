"""Convierte los shapefiles oficiales de la BCN (regiones y comunas) a GeoJSON.

Usa solo la librería estándar: polígonos tipo shapefile y tabla dBase.
La proyección del archivo es WGS84 Web Mercator (esfera auxiliar); se invierte a grados.
Simplifica los contornos (Douglas-Peucker, ~200 m) para que el mapa sea liviano.

Uso:
  python datos/mapa/generar_geojson_bcn.py regiones datos/crudos/bcn/regiones
  python datos/mapa/generar_geojson_bcn.py comunas datos/crudos/bcn/comunas

Salidas en datos/mapa/: <nombre>.geojson, <nombre>.js (envoltorio para file://).
Para comunas también <comunas_indice.json> (código, nombre y región, sin geometría).
"""
import json
import math
import struct
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SALIDA_DIR = RAIZ / "datos" / "mapa"
R = 6378137.0
TOLERANCIA = 0.002  # grados

# Campos de la tabla BCN por tipo de capa.
CAMPOS = {
    "regiones": {"codigo": "codregion", "nombre": "Region", "region": None, "largo": 2, "excluir": "0"},
    "comunas": {"codigo": "cod_comuna", "nombre": "Comuna", "region": "codregion", "largo": 5, "excluir": None},
}

def inversa_mercator(x, y):
    lon = math.degrees(x / R)
    lat = math.degrees(2 * math.atan(math.exp(y / R)) - math.pi / 2)
    return (lon, lat)

def dp(puntos, tol):
    if len(puntos) < 3:
        return puntos
    ini, fin = puntos[0], puntos[-1]
    dx, dy = fin[0] - ini[0], fin[1] - ini[1]
    norma = math.hypot(dx, dy)
    maxd, idx = 0.0, 0
    for i in range(1, len(puntos) - 1):
        px, py = puntos[i]
        if norma == 0:
            d = math.hypot(px - ini[0], py - ini[1])
        else:
            d = abs(dy * px - dx * py + fin[0] * ini[1] - fin[1] * ini[0]) / norma
        if d > maxd:
            maxd, idx = d, i
    if maxd > tol:
        return dp(puntos[: idx + 1], tol)[:-1] + dp(puntos[idx:], tol)
    return [ini, fin]

def decodificar(bruto):
    """El dBase de la BCN trae UTF-8 (CPG); si no lo es, cae a cp1252."""
    try:
        return bruto.decode("utf-8")
    except UnicodeDecodeError:
        return bruto.decode("cp1252", errors="replace")

def leer_dbf(ruta):
    d = open(ruta, "rb").read()
    n = struct.unpack("<I", d[4:8])[0]
    hl, rl = struct.unpack("<HH", d[8:12])
    campos, p = [], 32
    while d[p] != 0x0D:
        campos.append((d[p: p + 11].split(b"\0")[0].decode("latin1"), d[p + 16]))
        p += 32
    filas, q = [], hl
    for _ in range(n):
        reg, off, fila = d[q: q + rl], 1, {}
        for nombre, ln in campos:
            fila[nombre] = decodificar(reg[off: off + ln]).strip()
            off += ln
        filas.append(fila)
        q += rl
    return filas

def main():
    tipo, carpeta = sys.argv[1], Path(sys.argv[2])
    cfg = CAMPOS[tipo]
    base = next(carpeta.glob("*.shp")).with_suffix("")
    shp = open(base.with_suffix(".shp"), "rb").read()
    atributos = leer_dbf(base.with_suffix(".dbf"))
    rasgos, indice, islas = [], [], []
    pos, i = 100, 0
    while pos < len(shp):
        _, clen = struct.unpack(">ii", shp[pos: pos + 8])
        cont = pos + 8
        if struct.unpack("<i", shp[cont: cont + 4])[0] == 5:
            n_partes, n_puntos = struct.unpack("<ii", shp[cont + 36: cont + 44])
            partes = struct.unpack(f"<{n_partes}i", shp[cont + 44: cont + 44 + 4 * n_partes])
            pts_ini = cont + 44 + 4 * n_partes
            pts = [struct.unpack_from("<dd", shp, pts_ini + 16 * k) for k in range(n_puntos)]
            lim = list(partes) + [n_puntos]
            anillos = [[inversa_mercator(x, y) for x, y in pts[lim[k]: lim[k + 1]]] for k in range(n_partes)]
            anillos = [dp(a, TOLERANCIA) for a in anillos]
            # Las islas de Juan Fernández y Pascua (lon < -76) van a un recuadro aparte.
            isla = [a for a in anillos if len(a) >= 4 and max(p[0] for p in a) <= -76]
            anillos = [a for a in anillos if len(a) >= 4 and max(p[0] for p in a) > -76]
            atr = atributos[i]
            codigo = atr[cfg["codigo"]].zfill(cfg["largo"])
            if atr[cfg["codigo"]] != cfg["excluir"]:
                region = atr[cfg["region"]].zfill(2) if cfg["region"] else codigo
                props = {"codigo": codigo, "nombre": atr[cfg["nombre"]]}
                if cfg["region"]:
                    props["codigo_region"] = region
                if anillos:
                    rasgos.append({"type": "Feature", "properties": props,
                                   "geometry": {"type": "MultiPolygon", "coordinates": [[a] for a in anillos]}})
                if isla:
                    islas.append({"type": "Feature", "properties": props,
                                  "geometry": {"type": "MultiPolygon", "coordinates": [[a] for a in isla]}})
                if tipo == "comunas":
                    indice.append({"codigo": codigo, "nombre": atr[cfg["nombre"]], "codigo_region": region})
        pos += 8 + 2 * clen
        i += 1
    nombre = "comunas" if tipo == "comunas" else "regiones"
    geo = {"type": "FeatureCollection", "features": rasgos}
    (SALIDA_DIR / f"{nombre}.geojson").write_text(json.dumps(geo, ensure_ascii=False), encoding="utf-8")
    (SALIDA_DIR / f"{nombre}.js").write_text(
        f"window.{'COMUNAS_CHILE' if tipo == 'comunas' else 'REGIONES_CHILE'} = " + json.dumps(geo, ensure_ascii=False) + ";\n",
        encoding="utf-8")
    if islas:
        (SALIDA_DIR / "islas.js").write_text(
            "window.ISLAS_CHILE = " + json.dumps({"type": "FeatureCollection", "features": islas}, ensure_ascii=False) + ";\n",
            encoding="utf-8")
    if indice:
        (SALIDA_DIR / "comunas_indice.json").write_text(json.dumps(indice, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{tipo}: {len(rasgos)} rasgos")

if __name__ == "__main__":
    main()
