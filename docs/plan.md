# Plan de trabajo

Documento completo (alcance, roles, presupuesto, riesgos, modelo de negocio): https://claude.ai/artifact/GhbK5ZzJJNaQVHGHW9ZN4h

Entrega: **2 de diciembre de 2026**. Tres entregables de un mismo producto: portal público, demo vendible y entrega académica.

| Semana | Fechas | Foco | Hito que se muestra |
|---|---|---|---|
| 1 | 3 al 9 nov | Cimientos: esquema de datos, RLS, primera carga oficial, prueba de despliegue en Cloudflare | Página de una carrera real con datos oficiales |
| 2 | 10 al 16 nov | Explorar: ficha, comparador, simulador de puntaje y ranking | Portal navegable en el teléfono |
| 3 | 17 al 23 nov | Acompañar: asistente IA con protocolo de crisis, registro, Ficha de Trayectoria, beneficios de postulación y de mantención | Un estudiante de prueba recorre todo el flujo |
| 4 | 24 al 30 nov | Seguir y vender: módulo de permanencia ([ADR 0010](decisiones/0010-modulo-de-permanencia.md)), panel agencia, demo institucional, pruebas con 5 usuarios reales | Demo completa grabada |
| Cierre | 1 y 2 dic | Publicación, presentación comercial, informe de título | Entrega |

## Equipo

| Persona | Rol | Guía |
|---|---|---|
| Líder (@rafajaque) | Arquitectura, base de datos, privacidad, asistente IA | — |
| Alejandro | Interfaz y diseño | [`equipo/guia-alejandro.md`](equipo/guia-alejandro.md) |
| Cristóbal | Datos y contenido | [`equipo/guia-cristobal.md`](equipo/guia-cristobal.md) |

Forma de trabajo común: [`equipo/README.md`](equipo/README.md).

## Qué sostiene el seguimiento

El módulo de permanencia se construye sobre evidencia revisada, no sobre intuición: [`evidencia-permanencia.md`](evidencia-permanencia.md) y [ADR 0010](decisiones/0010-modulo-de-permanencia.md). En orden de prioridad: beneficios extendidos a la mantención, pertenencia con relatos curados, escalera de derivación y pulso de check-in como sensor.

Lo que prometemos: reducir la deserción por pérdida de beneficios y por desconexión no detectada. **No** prometemos mejorar la retención en general ni predecir la deserción.

## Fuera del MVP (fase 2)

Test vocacional validado, modelo predictivo de deserción, integración con sistemas de instituciones, WhatsApp conectado, contenido psicoeducativo extenso, foros y conversación abierta entre estudiantes (ADR 0010).
