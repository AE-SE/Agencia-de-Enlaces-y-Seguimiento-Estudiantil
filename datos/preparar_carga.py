#!/usr/bin/env python3
"""Une los resultados de oferta, SIES y DEMRE en una fila trazable por código SIES.

Entrada: `oferta.csv`, sus cruces `oferta_empleabilidad.csv` y `oferta_demre.csv`,
y los archivos completos `empleabilidad.csv` y `demre.csv`. Los archivos de cruce
solo contienen llaves, por lo que no bastan por sí solos para recuperar los valores.

Salida: `datos/procesados/carga.csv`, con una fila por carrera de la oferta. Cada
columna conserva el prefijo de su fuente (`oferta_`, `sies_`, `demre_`) para que el
cargador de Supabase posterior pueda conservar la trazabilidad y el nivel del dato.
"""
import argparse
import csv
import json
import os
import sys
from collections import Counter


def leer_csv(ruta, requeridas):
    with open(ruta, encoding="utf-8", newline="") as archivo:
        lector = csv.DictReader(archivo)
        campos = lector.fieldnames or []
        faltan = [campo for campo in requeridas if campo not in campos]
        if faltan:
            raise ValueError(f"Faltan columnas en {ruta}: " + ", ".join(faltan))
        return list(lector), campos


def indice_unico(filas, clave, nombre):
    indice = {}
    for fila in filas:
        valor = fila.get(clave, "")
        if not valor:
            raise ValueError(f"{nombre} tiene una fila sin «{clave}»")
        if valor in indice:
            raise ValueError(f"{nombre} repite «{clave}»: {valor}")
        indice[valor] = fila
    return indice


def indice_sies(filas):
    indice = {}
    for fila in filas:
        clave = (fila.get("sies_institucion_codigo", ""), fila.get("carrera_generica", ""))
        if not all(clave):
            raise ValueError("empleabilidad tiene una fila sin código institucional o carrera genérica")
        if clave in indice:
            raise ValueError("empleabilidad repite institución y carrera genérica: " + " | ".join(clave))
        indice[clave] = fila
    return indice


def mapa_cruce(filas, destino, nombre):
    mapa = {}
    for fila in filas:
        codigo = fila.get("codigo_sies", "")
        referencia = fila.get(destino, "")
        if not codigo or not referencia:
            raise ValueError(f"{nombre} tiene una fila sin «codigo_sies» o «{destino}»")
        if codigo in mapa:
            raise ValueError(f"{nombre} repite «codigo_sies»: {codigo}")
        mapa[codigo] = referencia
    return mapa


def mapa_cruce_sies(filas):
    mapa = {}
    for fila in filas:
        codigo = fila.get("codigo_sies", "")
        clave = (fila.get("sies_institucion_codigo", ""), fila.get("sies_carrera_generica", ""))
        if not codigo or not all(clave):
            raise ValueError("oferta_empleabilidad tiene una fila sin código SIES, institución o carrera genérica")
        if codigo in mapa:
            raise ValueError(f"oferta_empleabilidad repite «codigo_sies»: {codigo}")
        mapa[codigo] = clave
    return mapa


def columnas(prefijo, campos):
    return [prefijo + campo for campo in campos]


def preparar(oferta, campos_oferta, empleabilidad, campos_sies, demre, campos_demre, cruce_sies, cruce_demre):
    """Devuelve (filas, campos, reporte), sin convertir vacíos en ceros ni inventar motivos."""
    ofertas = indice_unico(oferta, "codigo_sies", "oferta")
    sies = indice_sies(empleabilidad)
    demre_por_codigo = indice_unico(demre, "demre_codigo", "demre")
    sies_por_oferta = mapa_cruce_sies(cruce_sies)
    demre_por_oferta = mapa_cruce(cruce_demre, "demre_codigo", "oferta_demre")

    campos = columnas("oferta_", campos_oferta) + columnas("sies_", campos_sies) + columnas("demre_", campos_demre)
    salida = []
    resumen = Counter()
    for codigo, fila_oferta in sorted(ofertas.items()):
        fila_sies = sies.get(sies_por_oferta.get(codigo, ""))
        fila_demre = demre_por_codigo.get(demre_por_oferta.get(codigo, ""))
        if fila_sies:
            resumen["con indicadores SIES"] += 1
        elif codigo in sies_por_oferta:
            resumen["cruces SIES sin fila de origen"] += 1
        else:
            resumen["sin cruce SIES"] += 1
        if fila_demre:
            resumen["con datos DEMRE"] += 1
        elif codigo in demre_por_oferta:
            resumen["cruces DEMRE sin fila de origen"] += 1
        else:
            resumen["sin cruce DEMRE"] += 1
        salida.append({
            **{f"oferta_{campo}": fila_oferta.get(campo, "") for campo in campos_oferta},
            **{f"sies_{campo}": (fila_sies or {}).get(campo, "") for campo in campos_sies},
            **{f"demre_{campo}": (fila_demre or {}).get(campo, "") for campo in campos_demre},
        })
    return salida, campos, {"carreras_de_oferta": len(ofertas), "resumen": dict(resumen)}


def escribir(filas, campos, ruta):
    os.makedirs(os.path.dirname(ruta) or ".", exist_ok=True)
    with open(ruta, "w", encoding="utf-8", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=campos, lineterminator="\n")
        escritor.writeheader()
        escritor.writerows(filas)


def main(argv=None):
    argumentos = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    argumentos.add_argument("--oferta", default="datos/procesados/oferta.csv")
    argumentos.add_argument("--empleabilidad", default="datos/procesados/empleabilidad.csv")
    argumentos.add_argument("--demre", default="datos/procesados/demre.csv")
    argumentos.add_argument("--cruce-sies", default="datos/procesados/oferta_empleabilidad.csv")
    argumentos.add_argument("--cruce-demre", default="datos/procesados/oferta_demre.csv")
    argumentos.add_argument("--salida", default="datos/procesados/carga.csv")
    argumentos.add_argument("--reporte", default="datos/procesados/carga_reporte.json")
    opciones = argumentos.parse_args(argv)
    try:
        oferta, campos_oferta = leer_csv(opciones.oferta, ["codigo_sies"])
        empleabilidad, campos_sies = leer_csv(opciones.empleabilidad, ["sies_institucion_codigo"])
        demre, campos_demre = leer_csv(opciones.demre, ["demre_codigo"])
        cruce_sies, _ = leer_csv(opciones.cruce_sies, ["codigo_sies", "sies_institucion_codigo", "sies_carrera_generica"])
        cruce_demre, _ = leer_csv(opciones.cruce_demre, ["codigo_sies", "demre_codigo"])
        filas, campos, reporte = preparar(oferta, campos_oferta, empleabilidad, campos_sies, demre, campos_demre, cruce_sies, cruce_demre)
    except (OSError, ValueError, csv.Error) as error:
        sys.exit(f"Error: {error}")
    escribir(filas, campos, opciones.salida)
    with open(opciones.reporte, "w", encoding="utf-8", newline="") as archivo:
        json.dump(reporte, archivo, ensure_ascii=False, indent=2, sort_keys=True)
        archivo.write("\n")
    print(f"Carreras de oferta: {reporte['carreras_de_oferta']:,}".replace(",", "."))
    for nombre, cantidad in reporte["resumen"].items():
        print(f"  {nombre}: {cantidad:,}".replace(",", "."))
    print(f"Escrito: {opciones.salida} y {opciones.reporte}")


if __name__ == "__main__":
    main()
