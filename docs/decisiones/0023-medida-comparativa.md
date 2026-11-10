# 0023 — Ancho de medida para comparaciones

Fecha: 2026-11-10 · Estado: propuesta

## Contexto
El comparador de carreras muestra hasta tres columnas. Con el único token de ancho (`--medida`, 68ch, pensado para leer texto), en computador quedan márgenes vacíos a ambos lados y las columnas se ven apretadas.

## Opciones evaluadas
- **Usar `--medida` y dejar el espacio vacío.** Simple, pero el espacio no aporta nada al estudiante.
- **Calcular un ancho con `calc()` sobre `--medida`.** Evita un token nuevo, pero el valor queda fuera del sistema de tokens.
- **Agregar `--medida-comparativa` (96ch) en `diseno/tokens.json`.** Un solo valor documentado, usado solo por las pantallas de comparación.

## Decisión
Agregar `medida-comparativa: 96ch`. Lo usan el comparador de carreras, el explorador (listado de resultados en computador) y, cuando exista, cualquier tabla comparativa.

## Justificación
96ch alcanza para tres columnas de unos 28ch cada una, con espacio para las etiquetas de las filas. Es un ancho de lectura de tabla, no de texto corrido, por eso no reemplaza a `--medida`. Se valida con la prueba de contraste y con la revisión visual a 360 px y en computador.

## Consecuencias
- `diseno/tokens.css` se regenera con `python3 scripts/tokens.py`.
- Las pantallas de texto siguen con `--medida`.
