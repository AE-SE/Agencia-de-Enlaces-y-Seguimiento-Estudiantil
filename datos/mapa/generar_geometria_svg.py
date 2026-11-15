"""Contornos de las regiones de Chile en SVG, desde el shapefile oficial de la BCN.

Uso: python datos/mapa/generar_geometria_svg.py <carpeta con Regional.shp> <salida.json>
Solo la librería estándar. Proyecta con Mercator inversa, descarta las islas
(lon < -76: Juan Fernández y Pascua) y simplifica el contorno (Douglas-Peucker).
Salida: JSON con viewBox, y por región: código CUT, nombre, path «d» y centro para la etiqueta.
"""
import json
import math
import struct
import sys
from pathlib import Path

R = 6378137.0
TOLERANCIA = 0.01   # grados (~1 km)
LON0, LON1, LAT0, LAT1 = -76.0, -66.0, -56.0, -17.0
K = 20.0
FACTOR = math.cos(35 * math.pi / 180)

def inversa(x, y):
    return (math.degrees(x / R), math.degrees(2 * math.atan(math.exp(y / R)) - math.pi / 2))

def dp(puntos, tol):
    if len(puntos) < 3:
        return puntos
    ini, fin = puntos[0], puntos[-1]
    dx, dy = fin[0] - ini[0], fin[1] - ini[1]
    norma = math.hypot(dx, dy)
    maxd, idx = 0.0, 0
    for i in range(1, len(puntos) - 1):
        px, py = puntos[i]
        d = math.hypot(px - ini[0], py - ini[1]) if norma == 0 else abs(dy * px - dx * py + fin[0] * ini[1] - fin[1] * ini[0]) / norma
        if d > maxd:
            maxd, idx = d, i
    if maxd > tol:
        return dp(puntos[: idx + 1], tol)[:-1] + dp(puntos[idx:], tol)
    return [ini, fin]

def a_svg(lon, lat):
    return ((lon - LON0) * FACTOR * K, (LAT1 - lat) * K)

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
            try:
                fila[nombre] = reg[off: off + ln].decode("utf-8")
            except UnicodeDecodeError:
                fila[nombre] = reg[off: off + ln].decode("cp1252", errors="replace")
            off += ln
        filas.append(fila)
        q += rl
    return filas

def main():
    carpeta, salida = Path(sys.argv[1]), Path(sys.argv[2])
    shp = open(carpeta / "Regional.shp", "rb").read()
    atributos = leer_dbf(carpeta / "Regional.dbf")
    regiones, pos, i = [], 100, 0
    while pos < len(shp):
        _, clen = struct.unpack(">ii", shp[pos: pos + 8])
        cont = pos + 8
        if struct.unpack("<i", shp[cont: cont + 4])[0] == 5 and atributos[i]["codregion"].strip() not in ("", "0"):
            n_partes, n_puntos = struct.unpack("<ii", shp[cont + 36: cont + 44])
            partes = struct.unpack(f"<{n_partes}i", shp[cont + 44: cont + 44 + 4 * n_partes])
            pts_ini = cont + 44 + 4 * n_partes
            pts = [struct.unpack_from("<dd", shp, pts_ini + 16 * k) for k in range(n_puntos)]
            lim = list(partes) + [n_puntos]
            anillos = [[inversa(x, y) for x, y in pts[lim[k]: lim[k + 1]]] for k in range(n_partes)]
            continental = [a for a in anillos if len(a) >= 4 and max(p[0] for p in a) > -76]
            trazos, mayor, mayor_n = [], None, -1
            for a in continental:
                s = dp(a, TOLERANCIA)
                if len(s) < 4:
                    continue
                if len(a) > mayor_n:
                    mayor, mayor_n = s, len(a)
                xy = [a_svg(lon, lat) for lon, lat in s]
                trazos.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in xy) + "Z")
            if trazos:
                xs = [a_svg(lon, lat)[0] for lon, lat in mayor]
                ys = [a_svg(lon, lat)[1] for lon, lat in mayor]
                regiones.append({
                    "codigo": atributos[i]["codregion"].strip().zfill(2),
                    "nombre": atributos[i]["Region"].strip(),
                    "d": "".join(trazos),
                    "cx": round((min(xs) + max(xs)) / 2, 1),
                    "cy": round((min(ys) + max(ys)) / 2, 1),
                })
        pos += 8 + 2 * clen
        i += 1
    ancho = (LON1 - LON0) * FACTOR * K
    alto = (LAT1 - LAT0) * K
    salida.write_text(json.dumps({"viewBox": f"0 0 {ancho:.0f} {alto:.0f}", "regiones": sorted(regiones, key=lambda r: r["codigo"])},
                                 ensure_ascii=False), encoding="utf-8")
    print(f"{len(regiones)} regiones -> {salida}")

if __name__ == "__main__":
    main()
