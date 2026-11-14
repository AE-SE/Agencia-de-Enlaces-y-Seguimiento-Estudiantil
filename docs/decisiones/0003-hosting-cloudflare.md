# 0003 — Hosting en Cloudflare (plan gratuito)

Fecha: 2026-11-02 · Estado: aceptada con reservas (2026-11-05) · ajustada el 2026-11-11

> **Nota del 2026-11-11.** La organización pasa a ser una fundación sin fines de lucro (ADR 0031), no un proyecto «comercial». La elección de Cloudflare sigue vigente y las reservas abiertas (tiempo de CPU, decidir el plan de pago antes de publicar a estudiantes reales) no cambian; el criterio «el plan gratuito debe permitir uso comercial» se mantiene como margen de seguridad porque los colegios y sostenedores pagarán por el panel.

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

La actualización del 2026-11-06 solo incorpora una medición adicional de rendimiento. No modifica la decisión de usar Cloudflare ni la reserva pendiente sobre el tiempo de CPU.

| Medición | Resultado |
|---|---|
| Páginas | La portada (estática), una página con código de servidor, el manifiesto de la PWA y sus íconos responden bien |
| Código de servidor | La hora de `/prueba-servidor` cambia en cada visita |
| Tiempo total (10 mediciones desde un computador con buena conexión) | 0,24 a 0,32 s, parecido en la página estática y en la de servidor |
| Tiempo de carga con 4G lenta | `/prueba-servidor` respondió entre 1,81 y 1,87 s |
| Tamaño del paquete (`wrangler deploy --dry-run`) | 4.687 KiB; 996 KiB comprimido |
| Límites del plan gratuito | 10 ms de CPU por solicitud, 64 MiB sin comprimir, 100.000 solicitudes al día. Fuente: https://developers.cloudflare.com/workers/platform/limits/ (actualizada el 2026-10-29) |

**Reservas: lo que esta prueba no midió.**
1. ~~Carga con 4G lenta.~~ **Cumplida el 2026-11-06:** `/prueba-servidor` respondió entre 1,81 y 1,87 s.
2. **Abierta (2026-11-09).** Tiempo de CPU real por solicitud. Lo medido en el panel de Cloudflare (últimos 7 días, solo lectura del líder):
   - Métricas de CPU, primera versión: mediana 37 ms, P90 205 ms, P99 361 ms, P99.9 385 ms. Los picos caen en los días de despliegue.
   - Versión activa `4e73c7f8`: mediana 29,47 ms; 646 invocaciones; 0 errores en 7 días; tasa de error 0 %.
   - Registros del Worker (activados el 2026-11-09 con muestreo al 100 %): 15 solicitudes de prueba correctas y 0 errores de CPU. Se hicieron 22 solicitudes; 7 no aparecen en los registros y no se sabe por qué (posible caché o registro previo a la activación).
   - Segunda prueba (2026-11-09, 18:18): 40 solicitudes más, todas con 200 en la respuesta HTTP. En los registros aparecen 55 eventos correctos en la última hora y 0 errores: las 15 anteriores y las 40 nuevas. Las 7 solicitudes que no aparecían antes probablemente se hicieron antes de activar los registros.
   - Contradicción sin resolver: la mediana (29 ms) supera los 10 ms de la referencia del plan gratuito, y aun así no hay errores. Falta confirmar el límite vigente en la documentación de Cloudflare y qué resultado aparece cuando se excede.
   - Cerrar la reserva requiere: confirmar el límite vigente y revisar de nuevo con más tráfico real (después de la semana 3).
3. ~~Que cada fusión a `main` se despliegue sola.~~ **Cumplida el 2026-11-05:** tras fusionar el PR #28 a `main`, el sitio pasó a servir las páginas y fuentes nuevas en unos dos minutos, sin intervención.

Cuando se cumpla la reserva que queda, se quita "con reservas" de la cabecera.

## Justificación
Única opción gratuita con uso comercial y sin riesgo de pausar toda la cuenta. Las fichas de carrera, que son la mayoría del tráfico, son estáticas y no consumen CPU.

## Consecuencias
- **Adaptador:** OpenNext, porque no cambia el stack. Cloudflare recomienda hoy `vinext` por defecto (https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/, actualizada el 2026-08-25), que reemplaza el build de Next por uno basado en Vite. Solo se evalúa si OpenNext deja de caber en el plan gratuito, y requeriría un ADR.
- **Versión de Next:** el adaptador 1.20.16 exige `next >=16.4.5`; se fijó la 1.20.15 porque el proyecto usa 16.4.4. Subir Next es un cambio aparte.
- Si la prueba falla en alguna de las reservas, alternativa: Netlify, registrada en un nuevo ADR.
- **Términos de servicio revisados el 2026-11-05** (https://www.cloudflare.com/terms/, actualizados el 2025-09-12; https://www.cloudflare.com/service-specific-terms-application-services/, 2026-09-28):
  - No se encontró una prohibición del uso comercial de los servicios gratuitos. Sí se prohíbe revender el acceso (§2.2.1(a)) y eludir los límites del plan (§2.2.1(c)).
  - **No se puede procesar ni recoger datos de tarjetas de crédito** en un sitio que use servicios gratuitos (§2.2.1(h)). Si algún día se cobra algo, debe ir por una pasarela externa. Hoy no aplica: el servicio es gratuito para el estudiante.
  - Cloudflare puede terminar el servicio gratuito "in our sole discretion" (§2.6) y suspender sin aviso (§8). Es un riesgo de continuidad: antes de publicar a estudiantes reales hay que decidir si se paga el plan de pago, que es barato y quita esa incertidumbre.
  - Lectura hecha por un agente automático; conviene que el líder confirme las cláusulas citadas antes de publicar.
