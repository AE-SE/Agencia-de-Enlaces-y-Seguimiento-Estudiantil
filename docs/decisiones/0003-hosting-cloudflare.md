# 0003 — Hosting en Cloudflare (plan gratuito)

Fecha: 2026-11-02 · Estado: propuesta (se acepta tras la prueba de la semana 1)

## Contexto
Presupuesto cero para hosting. El proyecto es comercial, así que el plan gratuito debe permitir uso comercial.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| Vercel Hobby | Integración natural con Next.js | Restringido a uso personal no comercial (https://vercel.com/docs/limits/fair-use-guidelines) → descartado |
| Netlify Free | Permite uso comercial | 300 créditos al mes con tope duro; un proyecto excedido pausa la cuenta |
| **Cloudflare Pages + Workers** | Permite uso comercial; red rápida en Sudamérica; 100.000 solicitudes diarias a funciones | 10 ms de CPU por solicitud en plan gratuito; Next.js requiere adaptador |

Fuente de la comparación: https://flaviocopes.com/hosting-free-tiers.md (septiembre 2026).

## Decisión
Cloudflare, sujeto a una prueba en la semana 1: desplegar una ficha de carrera estática y una página con sesión, y medir que no se exceda el límite de CPU.

## Justificación
Única opción gratuita con uso comercial y sin riesgo de pausar toda la cuenta. Las fichas de carrera, que son la mayoría del tráfico, son estáticas y no consumen CPU.

## Consecuencias
- Si la prueba falla, alternativa: Netlify, registrada en un nuevo ADR.
- Antes de publicar, confirmar en los términos de servicio de Cloudflare que el uso comercial sigue permitido en el plan gratuito.
