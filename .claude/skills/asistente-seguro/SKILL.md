---
name: asistente-seguro
description: Reglas para el asistente IA, el protocolo de crisis y cualquier código que toque datos sensibles (salud, bienestar, situación socioeconómica, menores). Úsala en toda tarea dentro de lib/ia/ o que trate datos sensibles.
---

# Asistente seguro y datos sensibles

> **Alcance:** el asistente IA es parte del diseño del producto, no su núcleo ([ADR 0031](../../../docs/decisiones/0031-producto-y-organizacion.md)). El protocolo de crisis y todas las reglas de esta skill siguen vigentes sin cambios para cualquier mensaje que reciba el asistente. Los datos sensibles de los estudiantes (p. ej. en el panel de seguimiento) siguen con consentimiento explícito y separado; los menores requieren autorización de su tutor.

## Orden obligatorio en cada mensaje al asistente

1. **Detección de crisis** (`lib/ia/crisis.ts`), antes de todo y sin llamar a la IA.
2. Si hay señales de riesgo de suicidio o autolesión:
   - Responder de inmediato con un mensaje de contención breve y humano.
   - Entregar la **Línea de Prevención del Suicidio \*4141** (Minsal, gratuita, 24 horas, desde celulares) y **Salud Responde 600 360 7777**.
   - Crear una alerta para revisión humana del equipo.
   - **No** continuar la conversación normal ni minimizar lo que la persona dijo.
3. Si no hay señales: **quitar datos personales** (nombres, RUT, teléfonos, correos, direcciones) antes de enviar a la IA.
4. Buscar fragmentos en documentos oficiales cargados y enviarlos junto a la pregunta.
5. Mostrar la respuesta **solo si cita una fuente**. Si no, responder que no hay certeza y ofrecer hablar con una persona.

## Lo que el asistente nunca hace

- Diagnosticar, tratar, ni actuar como terapeuta.
- Prometer beneficios, puntajes o resultados.
- Inventar fechas, montos o requisitos.
- Recomendar instituciones por ser clientes de la fundación.
- Usar "estilos de aprendizaje" (visual/auditivo/kinestésico): no tienen respaldo empírico. En su lugar: metacognición y estrategias con evidencia (práctica de recuperación, práctica espaciada, intercalado, autoexplicación).

## Pruebas obligatorias (`tests/ia/`)

- Frases de riesgo explícitas e implícitas → siempre activan el protocolo.
- El protocolo funciona aunque el proveedor de IA esté caído.
- Ningún dato personal llega a la llamada al proveedor (prueba con RUT, teléfono y correo de ejemplo).
- Una respuesta sin fuente nunca se muestra como hecho.

Las frases de prueba de crisis se escriben con cuidado y las revisa el líder; no se copian de foros.

## Datos sensibles en general

- Consentimiento explícito y separado antes de guardarlos.
- Cifrados en la base de datos; cada lectura queda en `registro_acceso`.
- Nunca en logs, URLs, mensajes de error, analítica ni en una IA externa durante el desarrollo.
- Datos de prueba: siempre ficticios.
