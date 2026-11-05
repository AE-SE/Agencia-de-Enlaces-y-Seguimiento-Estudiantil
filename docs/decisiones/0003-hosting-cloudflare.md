# 0003 — Hosting en Cloudflare (plan gratuito)

Fecha: 2026-11-02 · Estado: aceptada con reservas (2026-11-05)

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

## Resultado de la prueba (2026-11-05)
Despliegue en Cloudflare Workers con el adaptador OpenNext (`@opennextjs/cloudflare` 1.20.15), conectado al repositorio de GitHub ([PR #32](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/32)). Dirección de prueba: `agencia-de-enlace.rafajaqued.workers.dev`.

| Medición | Resultado |
|---|---|
| Páginas | La portada (estática), una página con código de servidor, el manifiesto de la PWA y sus íconos responden bien |
| Código de servidor | La hora de `/prueba-servidor` cambia en cada visita |
| Tiempo total (10 mediciones desde un computador con buena conexión) | 0,24 a 0,32 s, parecido en la página estática y en la de servidor |
| Tamaño del paquete (`wrangler deploy --dry-run`) | 4.687 KiB; 996 KiB comprimido |
| Límites del plan gratuito | 10 ms de CPU por solicitud, 64 MiB sin comprimir, 100.000 solicitudes al día. Fuente: https://developers.cloudflare.com/workers/platform/limits/ (actualizada el 2026-10-29) |

**Reservas: lo que esta prueba no midió.**
1. Carga en un teléfono con red "4G lenta".
2. El tiempo de CPU real por solicitud (veinte solicitudes no dieron ningún error 1102, pero eso no lo mide; se ve en las métricas del panel).
3. Que cada fusión a `main` se despliegue sola (solo hubo un despliegue).

Cuando las tres se cumplan, se quita "con reservas" de la cabecera.

## Justificación
Única opción gratuita con uso comercial y sin riesgo de pausar toda la cuenta. Las fichas de carrera, que son la mayoría del tráfico, son estáticas y no consumen CPU.

## Consecuencias
- **Adaptador:** OpenNext, porque no cambia el stack. Cloudflare recomienda hoy `vinext` por defecto (https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/, actualizada el 2026-08-25), que reemplaza el build de Next por uno basado en Vite. Solo se evalúa si OpenNext deja de caber en el plan gratuito, y requeriría un ADR.
- **Versión de Next:** el adaptador 1.20.16 exige `next >=16.4.5`; se fijó la 1.20.15 porque el proyecto usa 16.4.4. Subir Next es un cambio aparte.
- Si la prueba falla en alguna de las reservas, alternativa: Netlify, registrada en un nuevo ADR.
- Antes de publicar, confirmar en los términos de servicio de Cloudflare que el uso comercial sigue permitido en el plan gratuito.
