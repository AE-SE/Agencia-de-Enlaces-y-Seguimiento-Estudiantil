# 0005 — Sistema visual "Mapa de trayecto" con paleta Okabe-Ito y tipografía Atkinson Hyperlegible

Fecha: 2026-11-02 · Estado: aceptada

## Contexto
Toda decisión visual debe justificarse. La plataforma debe ser igual de comprensible para alguien de Santiago y alguien de un sector rural, con cualquier teléfono.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| Paleta elegida por "psicología del color" | Fácil de explicar | Evidencia incipiente (Elliot, 2015); no verificable |
| Copiar la estética de sitios del Gobierno | Familiar | Puede confundirse con un sitio oficial; sin identidad propia |
| **Concepto de señalética de transporte + paleta para daltonismo + tipografía para baja visión** | Cada decisión es medible o verificable; identidad propia; coherente con el logo | Requiere disciplina para no agregar colores |

## Decisión
Sistema "Mapa de trayecto", documentado en [`docs/diseno.md`](../diseno.md), con valores en `diseno/tokens.json`.

## Justificación
- Colores de la paleta de Diseño Universal del Color (Okabe e Ito), distinguibles con daltonismo.
- Contraste verificado automáticamente: 36 de 36 combinaciones cumplen WCAG 2.2 en modo claro y oscuro.
- Atkinson Hyperlegible, diseñada por el Braille Institute para baja visión.
- La metáfora de línea y estaciones viene de la señalética de transporte, pensada para orientar a cualquier persona sin ayuda.

## Consecuencias
- Ningún color fuera de `tokens.json`. Agregar uno requiere un ADR nuevo.
- `scripts/tokens.py --check` corre en cada PR.
- Pendiente: comparar con los valores exactos del logo.
