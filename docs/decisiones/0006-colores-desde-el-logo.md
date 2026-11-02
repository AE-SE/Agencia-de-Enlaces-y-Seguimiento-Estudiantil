# 0006 — Los colores principales se toman del logo, no de Okabe-Ito

Fecha: 2026-11-02 · Estado: propuesta (se acepta al aprobar el PR)

## Contexto
El ADR 0005 eligió azul `#0072B2` y naranja `#E69F00` de la paleta Okabe-Ito, antes de tener el logo. Al recibir el logo (único archivo: JPG de 1600 × 1600 px, fondo negro), sus colores medidos son distintos:

| Elemento del logo | Color medido | Token anterior |
|---|---|---|
| Enlace y texto "AGENCIA DE", "ESTUDIANTIL" | Azul marino `#0D325F` | `#0072B2` |
| Flecha y texto "ENLACE", "SEGUIMIENTO" | Coral `#F46E52` | `#E69F00` |

Medición: mediana de los píxeles de cada color, descartando los bordes suavizados. Margen de ±2 por canal por la compresión JPG.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| Mantener Okabe-Ito y cambiar el logo | Paleta diseñada para daltonismo | El logo ya se usa en redes sociales; cambiarlo rompe el reconocimiento de marca |
| Usar colores distintos en logo y plataforma | Ninguno real | Incoherencia visible: la plataforma no "se parece" a la agencia |
| **Tomar azul y coral del logo; Okabe-Ito para el resto** | Coherencia de marca; el par azul-coral se distingue con daltonismo por luminosidad | El coral queda cerca del rojo de error; requiere un rojo de error distinto |

## Decisión
- `linea` = `#0D325F` (azul del logo); en modo oscuro `#8DB2E6`, azul claro del mismo tono.
- `accion` = `#F46E52` (coral del logo), con texto en tinta encima.
- `alerta` pasa de bermellón a rojo oscuro `#B42318`, para no confundirse con la acción.
- `exito` y `estacion-avanzar` siguen siendo Okabe-Ito.

## Justificación
- **Contraste:** las 36 combinaciones exigidas siguen cumpliendo WCAG 2.2 (`python3 scripts/tokens.py --check`). El azul marino mejora el contraste del texto: 11,99:1 contra 6,92:1 del anterior.
- **Daltonismo** (simulación con matrices de Machado et al., 2009, severidad máxima): azul contra coral ΔE 68 en protanopía, 91 en deuteranopía y 96 en tritanopía. Coral contra rojo de error: ΔE 23 a 25 en las tres. Una diferencia sobre 10 se nota claramente.
- **Debilidad aceptada:** coral contra el verde de éxito en protanopía, ΔE 13. Se mitiga con la regla de nunca usar solo color (estaciones con número y nombre; estados con ícono y palabra).

## Consecuencias
- El logo original tiene azul marino sobre negro (contraste 1,6:1, casi invisible). Se creó `logo-horizontal-oscuro.svg` con el azul claro para fondos oscuros, y se recomienda usarlo también en los videos.
- Si aparece el archivo original del diseñador con los valores exactos, se actualizan los tokens en un PR y se vuelve a correr la verificación.
