# 0037 — Tokens de forma y tamaño para el mapa de carreras

Fecha: 2026-11-14 · Estado: aceptada (2026-11-14, por el líder) · Relacionado: [ADR 0036](0036-mapa-carreras-por-region.md), [AGENTS.md 2.5](../../AGENTS.md)

## Contexto

La revisión del PR #228 encontró valores escritos a mano en `app/(portal)/mapa/MapaCarreras.module.css`: anchos y alturas en píxeles, bordes de 2 px, trazos de 1, 1,5 y 3, patrones punteados, un tamaño de letra de 11 px en las cifras del SVG y un desfase de foco de 2 px. AGENTS.md 2.5 prohíbe escribirlos fuera de `diseno/tokens.json`. Las variables CSS no pueden usarse en los puntos de corte de `@media`, por lo que el punto de corte se escribe en `rem`, igual que en el resto del proyecto.

## Opciones evaluadas

- **A. Agregar tokens de forma (elegida).** Pros: una sola fuente de verdad (`diseno/tokens.json`), cambiar un valor se hace en un lugar, y el mapa usa el mismo vocabulario que el resto del sitio. Contras: 13 tokens nuevos que mantener.
- **B. Aceptar excepciones en el CSS del mapa y documentarlas.** Pros: no cambia el sistema de tokens. Contras: cada componente nuevo repetiría la excepción, y la regla 2.5 quedaría sin efecto práctico.
- **C. Reutilizar tokens existentes donde sea parecido.** Pros: sin tokens nuevos. Contras: cambia el aspecto (por ejemplo, `borde-linea` de 4 px en vez de 2 px) y no es un cambio neutro.

## Decisión

Se elige A. Se agregan al grupo `forma` de `diseno/tokens.json`:

| Token | Valor | Uso |
|---|---|---|
| `borde-fuerte` | `2px` | Bordes del campo de búsqueda y de la lista de carreras |
| `trazo-fino` | `1px` | Contorno de regiones, guías de cifra |
| `trazo-medio` | `1.5px` | Contorno de las burbujas |
| `trazo-marcado` | `3px` | Contorno de la región elegida y halo de las cifras |
| `patron-punteado` | `3px 3px` | Regiones sin dato |
| `patron-punteado-bajo` | `4px 3px` | Burbujas con empleo bajo |
| `tamano-muestra` | `18px` | Muestra de color de la leyenda y casilla |
| `desfase-foco` | `2px` | Separación del anillo de foco |
| `ancho-mapa` | `320px` | Ancho máximo del mapa |
| `ancho-controles` | `360px` | Ancho máximo de la columna de controles |
| `ancho-controles-min` | `240px` | Ancho mínimo de la columna de controles |
| `alto-lista` | `260px` | Alto máximo de la lista de carreras, con desplazamiento |
| `texto-cifra-mapa` | `0.6875rem` (11 px) | Cifras sobre las burbujas |

El punto de corte del mapa pasa a `45rem` (720 px con la letra base), como en los demás módulos.

## Justificación

- **Accesibilidad.** Los anillos de foco y los bordes de campo siguen WCAG 2.2 (criterios 1.4.11 y 2.4.7). Los valores no cambian respecto de los que ya se usaban; solo pasan a estar nombrados.
- **Coherencia.** Un valor escrito a mano en un módulo CSS se diferencia del resto del sitio sin que nadie lo decida. Un token lo deja a la vista.
- **Texto.** El tamaño de las cifras se expresa en `rem`, como el resto del texto, para que siga la preferencia de letra de la persona (WCAG 1.4.4). Dentro del SVG equivale a 11 unidades de la vista.

## Consecuencias

- `diseno/tokens.css` se regenera con `python3 scripts/tokens.py`; el contraste de colores no cambia, porque estos tokens no son colores.
- Los trazos y los patrones punteados son valores de forma, no de color: no entran en la verificación de contraste.
- Cualquier valor nuevo de forma en el mapa debe agregarse aquí primero.
