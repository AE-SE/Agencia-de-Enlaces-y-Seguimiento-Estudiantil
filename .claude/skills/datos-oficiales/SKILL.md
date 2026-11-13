---
name: datos-oficiales
description: Cómo cargar, actualizar y mostrar datos de fuentes oficiales (DEMRE, SIES/mifuturo.cl, Mineduc, CNA). Úsala en cualquier tarea que toque datos de carreras, puntajes, aranceles, empleabilidad o beneficios.
---

# Datos oficiales

Un dato equivocado sobre una carrera puede cambiar la decisión de vida de alguien. Por eso estas reglas no tienen excepciones.

## Qué fuentes valen

Solo fuentes oficiales, primarias o académicas (DEMRE, Mineduc, SIES, CNA, leyes y reglamentos, publicaciones y estudios revisados). Nunca notas de prensa, columnas de opinión, blogs ni agregadores, aunque citen una cifra oficial: se va a la fuente original.

## Antes de cargar

1. La fuente debe estar en `docs/fuentes.md`. Si no está, agrégala primero en un PR aparte.
2. Si sus términos de uso dicen "Por verificar", no automatices la descarga. Carga a mano y anota la URL y la fecha.
3. Descarga el archivo a `datos/crudos/` (esa carpeta no se sube a git).

## Al escribir el script (`datos/cargar_<fuente>.py`)

- **Repetible:** correrlo dos veces deja el mismo resultado (usa `upsert` por clave oficial, no `insert`).
- **Valida antes de escribir:**
  - Tipos: un arancel es un entero en pesos chilenos.
  - Rangos: porcentajes entre 0 y 100; puntajes en el rango oficial del proceso.
  - Nulos: un valor ausente queda `null` con un `motivo` ("muestra insuficiente según SIES"). **Nunca 0.**
- **Cada fila guarda** `fuente_id`, `url_archivo`, `fecha_descarga`, `periodo` (ej. "titulados 2023").
- **Imprime un resumen:** filas leídas, cargadas, descartadas y por qué.
- **Prueba:** al menos 3 valores verificados a mano contra el sitio oficial, escritos en `tests/datos/` con su URL.

## Al mostrar un dato

- Siempre: la cifra + qué mide + período + fuente con enlace.
  - Bien: "78% · empleabilidad al 1.er año · titulados 2023 · Fuente: SIES"
  - Mal: "78% empleabilidad"
- Nunca compares indicadores de distinta definición o período en la misma fila sin advertirlo.
- Montos en pesos chilenos con separador de miles (`$4.250.000`), usando `Intl.NumberFormat('es-CL')`.

## Cálculos (puntaje ponderado, ranking)

- Viven en `lib/calculos/` y no conocen la interfaz.
- Las ponderaciones y tablas vienen de la base de datos, nunca escritas en el código.
- Cada fórmula tiene pruebas con casos tomados de publicaciones oficiales del DEMRE, citadas en el archivo de prueba.
- Si la fórmula oficial cambia de un proceso a otro, se versiona por año de admisión.

## Si no encuentras la fuente oficial

No publiques el dato. Deja `TODO(fuente)` en el código y avísalo en el PR.
