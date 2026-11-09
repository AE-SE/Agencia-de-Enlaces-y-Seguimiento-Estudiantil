# Revisión profesional: cuatro decisiones y un texto (una página)

Para: profesional de salud mental, psicología o psicopedagogía.
Tiempo estimado: 30 minutos. Puedes responder con «acepto», «cambio» o «no me corresponde» en cada punto.
Documento completo, con todas las preguntas: [`revision-profesional-derivacion.md`](revision-profesional-derivacion.md). Protocolo de respuesta inmediata: [`revision-profesional-crisis.md`](revision-profesional-crisis.md).

## Qué ya está decidido por el equipo (no hace falta revisar)

- Las alertas no guardan el texto del mensaje.
- Solo el equipo de la agencia ve las alertas, y cada acceso queda registrado.
- Al cerrar una derivación se registran tres datos: si la persona fue contactada, a qué red se derivó y la fecha de seguimiento (ya en la base de datos).

## Lo que necesitamos de usted

**1. Texto que ve la persona cuando el mensaje sugiere riesgo.**
Texto actual (en `lib/ia/crisis.ts`):

> Gracias por contármelo. Lo que sientes importa, y no tienes que pasarlo sin ayuda.
> Ahora mismo puedes hablar con personas preparadas para escucharte:
> - Línea de Prevención del Suicidio: llama al *4141 (gratis, las 24 horas, desde cualquier celular).
> - Salud Responde: llama al 600 360 7777 (gratis, todos los días, las 24 horas).
> Si estás en peligro en este momento, ve a la urgencia más cercana o pide a alguien de confianza que te acompañe.
> Si esto le pasa a otra persona, estos números también sirven para ayudarla.

Pregunta: ¿lo mantiene, lo cambia o agrega algo? Propuesta de agregado para fuera de horario: «Fuera de horario, el equipo no revisa mensajes en el momento. Las líneas de arriba siguen disponibles.» Si no lo considera adecuado, lo quitamos.

**2. Plazo de revisión de una alerta (P1).**
Pregunta: ¿en cuánto tiempo debe revisar una persona del equipo una alerta, por tipo de señal (suicidio o autolesión) y por horario? No ponemos un número sin fuente.

**3. Contacto a un menor de 18 y a su tutor (P4).**
Propuesta: contactar al tutor solo si hay riesgo inminente y usted lo evalúa. Pregunta: ¿qué criterio usaría, y qué debe revisar el abogado además?

**4. Qué pasa si la persona no responde (P7).**
Pregunta: ¿cuántos reintentos y en qué plazo? Propuesta: no cerrar sin nota.

## Plazos y fuentes

- Los números de emergencia y de las líneas se mantienen con su fuente oficial (Minsal). Si usted sabe de un número más adecuado, dígalo con la fuente.
- Respuesta que necesitamos antes del **23 de noviembre de 2026** (fin de la semana 3, según la planificación). Es una fecha de trabajo del equipo, no una exigencia legal.

Responder a: [líder del proyecto, @rafajaque]. Sus respuestas quedan registradas en el ADR 0019 con la fecha.
