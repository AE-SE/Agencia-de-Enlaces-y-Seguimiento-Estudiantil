# Plan de trabajo

Documento completo (alcance, roles, presupuesto, riesgos, modelo de negocio): https://claude.ai/artifact/GhbK5ZzJJNaQVHGHW9ZN4h

Entrega: **2 de diciembre de 2026**. Tres entregables de un mismo producto: sitio público para estudiantes, demo del panel de seguimiento para colegios y entrega académica. Hasta esa fecha es un proyecto de título sin entidad jurídica; la fundación sin fines de lucro se constituye en 2027 y el piloto 2027 va por convenio de colaboración. Idea final del 11 de noviembre: [`entregable/Entregable_Parte_I.md`](entregable/Entregable_Parte_I.md).

> Nota del 11 de noviembre: la tabla siguiente es el plan original. Lo que ahora cuenta como alcance es el sitio para estudiantes y el panel de seguimiento para colegios; el módulo de permanencia, el pulso de check-in y el panel para instituciones de educación superior pasan a proyección (reemplazado en parte por el ADR 0031, producto y organización).

| Semana | Fechas | Foco | Hito que se muestra |
|---|---|---|---|
| 1 | 3 al 9 nov | Cimientos: esquema de datos, RLS, primera carga oficial, prueba de despliegue en Cloudflare | Página de una carrera real con datos oficiales |
| 2 | 10 al 16 nov | Explorar: ficha, comparador, simulador de puntaje y ranking | Portal navegable en el teléfono |
| 3 | 17 al 23 nov | Acompañar: asistente IA con protocolo de crisis, registro, Ficha de Trayectoria, beneficios de postulación y de mantención | Un estudiante de prueba recorre todo el flujo |
| 4 | 24 al 30 nov | Seguir y presentar: panel de seguimiento para colegios (demo con datos de ejemplo), pruebas con 5 usuarios reales. *(Original: módulo de permanencia, [ADR 0010](decisiones/0010-modulo-de-permanencia.md), ahora proyección)* | Demo completa grabada |
| Cierre | 1 y 2 dic | Publicación, presentación comercial, informe de título | Entrega |

## Estado al 9 de noviembre de 2026

Se adelantó trabajo de las semanas 3 y 4. Las fechas de la tabla no cambian; esta sección dice qué está hecho, qué no y qué depende de una decisión del líder. Verificado en `main` (commit `9ad2924`) y en GitHub.

**Semana 1 (cimientos):** hecho. Esquema base con RLS y pruebas en CI. Datos oficiales cargados; la migración `20261105000000` se aplicó en Supabase (BITACORA, 2026-11-07). **No verificado:** el despliegue en Cloudflare de punta a punta.

**Semana 2 (explorar):** en `main`: comparador de carreras (#57), beneficios y calendario (#69, Alejandro), puntaje ponderado 2027 y ranking (`lib/calculos/2027`, #61 de Cristóbal). **No verificado por nosotros:** navegación completa en teléfono.

**Semana 3 (acompañar), adelantado:**
- Tabla de alertas y derivación, con pruebas RLS: #72, fusionado.
- Exportación de datos y solicitudes de derechos del titular: #73, fusionado.
- Registro de alertas desde el servidor, endpoint `POST /api/asistente` y búsqueda de fragmentos: #74, en borrador, CI en verde.
- **Pendiente:** Ficha de Trayectoria en la interfaz (las tablas existen), flujo de tutor para menores de 18, revisión profesional del protocolo de crisis (el documento está listo, no enviado), y vincular alertas a la persona (depende de la cuenta).

**Semana 4 (seguir y vender):**
- ADR 0010 aceptado.
- Pulso de check-in: sin implementar; ahora es proyección, fuera del alcance actual.
- Panel de seguimiento para colegios (antes «panel de agencia»): sin implementar.
- Pruebas con usuarios: `docs/pruebas-usuarios.md` preparado (#58); las sesiones con personas reales no han ocurrido.

**Decisiones y aprobaciones que dependen del líder:**
- Aprobar y fusionar #74, en GitHub con otra cuenta de revisor.
- Confirmar qué migraciones están aplicadas en Supabase: `20261108100000_alertas_y_derivacion.sql` y `20261108110000_derechos_del_titular.sql`, en ese orden. La `20261109000000_correcciones_alertas_y_exportacion.sql` sirve con o sin las anteriores.
- Aceptar o rechazar los ADR propuestos: 0015 (cuenta y vínculo institucional), 0019 (alertas y derivación) y 0020 (derechos del titular).
- Definir los plazos marcados como `TODO(profesional)` y `TODO(legal)` en los ADR 0019 y 0020, con la revisión profesional y legal.
- Configurar en el despliegue: `GEMINI_API_KEY`, `GEMINI_MODELO`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.

**Próximos pasos, desde el lunes (fecha exacta por confirmar):** lo que queda de la semana 3 y el flujo de menores, después del ADR 0015.

## Equipo

| Persona | Rol | Guía |
|---|---|---|
| Líder (@rafajaque) | Arquitectura, base de datos, privacidad, asistente IA | [`equipo/guia-rafael.md`](equipo/guia-rafael.md) |
| Alejandro | Interfaz y diseño | [`equipo/guia-alejandro.md`](equipo/guia-alejandro.md) |
| Cristóbal | Datos y contenido | [`equipo/guia-cristobal.md`](equipo/guia-cristobal.md) |

Forma de trabajo común: [`equipo/README.md`](equipo/README.md).

## Qué sostiene el seguimiento (proyección)

*Reemplazado en parte por el ADR 0031 (producto y organización): esta sección describe una fase posterior, no el alcance actual.*

El módulo de permanencia se construye sobre evidencia revisada, no sobre intuición: [`evidencia-permanencia.md`](evidencia-permanencia.md) y [ADR 0010](decisiones/0010-modulo-de-permanencia.md). En orden de prioridad: beneficios extendidos a la mantención, pertenencia con relatos curados, escalera de derivación y pulso de check-in como sensor.

Lo que prometemos: reducir la deserción por pérdida de beneficios y por desconexión no detectada. **No** prometemos mejorar la retención en general ni predecir la deserción.

## Fuera del MVP (fase 2)

Pruebas propias por colegio, panel para instituciones de educación superior, módulo de permanencia, test vocacional validado, modelo predictivo de deserción, integración con sistemas de instituciones, WhatsApp conectado, contenido psicoeducativo extenso, foros y conversación abierta entre estudiantes (ADR 0010).
