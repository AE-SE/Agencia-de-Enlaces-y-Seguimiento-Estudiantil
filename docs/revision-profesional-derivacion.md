# Revisión profesional: alertas de crisis y derivación

> **Nota del 2026-11-13.** Sigue vigente: la derivación no cambia (AGENTS.md 2.4). El público ya no son solo estudiantes de 3.º y 4.º medio, y el ADR 0033 reemplazó la autorización de tutor, así que la pregunta P4 (contacto al tutor de un menor) hay que replantearla con quien revise. Idea vigente: [ADR 0032](decisiones/0032-agencia-independiente-y-publico-egresado.md).

> **Estado frente a la idea final (11-nov-2026): vigente.** El protocolo de crisis y la derivación no cambian (AGENTS.md 2.4) y el asistente sigue en el sitio para estudiantes de 3.º y 4.º medio. Las alertas y la derivación se mantienen; el pulso de check-in que pudiera generar alertas queda fuera del alcance (escalabilidad). Idea final y ADR 0031: [`Entregable_Parte_I.md`](entregable/Entregable_Parte_I.md), [ADR 0031](decisiones/0031-producto-y-organizacion.md).

Para: profesional de salud mental, psicología o psicopedagogía que revise el protocolo.
Estado: **borrador, no implementado en la aplicación**. No cambia el código ni la base de datos en producción.
Complementa a [`docs/revision-profesional-crisis.md`](revision-profesional-crisis.md), que trata la respuesta inmediata del asistente. Este documento trata lo que pasa **después** de esa respuesta: quién revisa, cuándo, y cómo se deriva.
Decisión de respaldo: [ADR 0019](decisiones/0019-alertas-de-crisis-y-derivacion.md).

## 1. Qué hace hoy el sistema, en lenguaje simple

1. Si un mensaje sugiere riesgo de suicidio o autolesión, el asistente responde de inmediato con un mensaje de contención y entrega dos líneas de ayuda: *4141 (Línea de Prevención del Suicidio, Minsal, 24 horas) y Salud Responde 600 360 7777.
2. Al mismo tiempo, se registra una **alerta**. La alerta dice qué señal se detectó (suicidio o autolesión) y cuándo. **No guarda el mensaje.**
3. Si la persona había iniciado sesión, la alerta queda vinculada a ella. Si no, queda anónima.
4. Solo el equipo de acompañamiento de la agencia ve las alertas. Cada vez que alguien las ve o cambia su estado, queda registrado.
5. El equipo puede marcar una alerta como "en revisión", abrir una **derivación** (a la red de apoyo, a una persona de confianza, o a urgencia), seguirla y cerrarla con una nota.

## 2. Escalera propuesta

Esta escalera es una propuesta del equipo técnico. **Cada escalón necesita definición profesional.**

| Escalón | Qué pasa | Quién actúa | Plazo |
|---|---|---|---|
| 0. Respuesta inmediata | El asistente contiene y entrega *4141 y 600 360 7777. Ya implementado. | Sistema | Inmediato |
| 1. Revisión humana | El equipo revisa la alerta y decide si hay derivación. | Acompañante de la agencia | `TODO(profesional)`: plazo máximo de revisión |
| 2. Derivación | Contacto con la red de apoyo o con una persona de confianza, según lo que decida el profesional. | Acompañante | `TODO(profesional)` |
| 3. Urgencia | Si hay riesgo inminente, se indica a la persona ir a urgencia o llamar a emergencias. | Acompañante, con protocolo claro | `TODO(profesional)`: número de emergencia y fuente |
| 4. Cierre | Se cierra la derivación con una nota y la alerta queda cerrada. | Acompañante | Al resolverse |

## 3. Preguntas que necesitan su decisión

Para cada una propongo una opción por defecto. Puede cambiarla.

**Decisión del líder (2026-11-09):** se aceptan P2, P3, P5 y P8 con la opción propuesta. P1, P4, P6 y P7 quedan como `TODO(profesional)` o `TODO(legal)` hasta que la profesional y el abogado los definan con fuente. Ninguna de estas decisiones está implementada en la aplicación todavía.

**P1. ¿En cuánto tiempo debe revisarse una alerta?**
Propuesta: `TODO(profesional)`. No hay plazo en el código. Recomendamos definirlo por tipo de señal (suicidio o autolesión) y por horario (horas hábiles, fines de semana y noche).

**P2. ¿Quién recibe la alerta fuera de horario?**
Opciones: (a) nadie: la alerta espera al siguiente día hábil; (b) un turno de guardia con un número de contacto; (c) solo las líneas de ayuda, sin revisión humana fuera de horario.
Recomendación: la opción (b) si la agencia puede sostenerla, y la (c) como mínimo explícito. Hoy no hay turno de guardia definido.

**P3. ¿Cuándo se contacta a la persona?**
Opciones: (a) el equipo llama o escribe sin preguntar, si la alerta tiene datos de contacto; (b) solo si la persona tiene sesión y ha dado su consentimiento para ser contactada; (c) nunca sin consentimiento, salvo riesgo inminente.
Recomendación: definir el riesgo inminente con un profesional, y mientras tanto usar (b).

**P4. ¿Cuándo se contacta a un tutor de una persona menor de 18 años?**
Este es el punto más sensible. Un menor puede estar en riesgo en su casa, y el tutor puede ser parte del problema.
Opciones: (a) siempre; (b) solo si hay riesgo inminente y se evalúa con profesional; (c) nunca sin consentimiento del menor, salvo obligación legal.
Recomendación: (b). Requiere revisión legal además de profesional (Ley 21.719 y el deber de protección). Ver también AGENTS.md 2.2 sobre menores.

**P5. ¿Debe la persona poder ver su propia alerta?**
Opciones: (a) sí, en su cuenta; (b) no, solo el equipo la ve; (c) se le informa que hubo una revisión, sin el detalle.
Riesgo: ver una alerta de riesgo sin contexto puede angustiar. Recomendación: (c), con texto redactado por el profesional.

**P6. ¿Cuánto tiempo se guardan las alertas?**
Opciones: (a) mientras la persona tenga cuenta; (b) un plazo fijo después de cerrar la alerta, por ejemplo `TODO(legal)`; (c) se borran al cerrar.
Recomendación: (b), con plazo que defina la revisión legal. El registro de accesos también debe tener plazo.

**P7. ¿Qué pasa cuando la persona no responde al contacto?**
Opciones: (a) se reintenta en un plazo; (b) se deriva a la red de apoyo; (c) se cierra con nota.
Recomendación: definir reintentos y plazos con el profesional. No cerrar sin nota.

**P8. ¿Qué nota de cierre es válida?**
La nota de cierre debe servir para seguir el caso sin repetir el relato de la persona. Proponga un formato mínimo (por ejemplo: contactada sí o no, derivada a qué red, fecha de seguimiento).

## 4. Datos que el sistema guarda y que no guarda

| Dato | ¿Se guarda? | Por qué |
|---|---|---|
| Texto del mensaje | **No** | Es el dato más sensible y no hace falta para revisar. |
| Señal detectada (suicidio o autolesión) | Sí | Para priorizar la revisión. |
| Fecha y hora de la detección | Sí | Para medir plazos. |
| Persona (si tenía sesión) | Sí, solo si tenía sesión | Para contactarla. Ver P3 y P5. |
| Quién revisó y cuándo | Sí | Responsabilidad y registro de acceso. |
| Derivación: tipo y nota | Sí, nota corta | Para seguir el caso. Ver P8. |
| Datos de contacto de un tutor | **No, por ahora** | Hasta definir P4. |

## 5. Lo que el sistema no hace

- No diagnostica ni evalúa el riesgo. Lo detecta por palabras y lo deriva.
- No decide por sí solo el cierre de una alerta.
- No envía mensajes a la persona ni a su tutor.
- No reemplaza a un profesional ni a los servicios de emergencia.

## 6. Qué necesitamos de usted

1. Responder P1 a P8, o marcar las que no le corresponden.
2. Revisar la escalera de la sección 2 y decir qué escalón falta o sobra.
3. Indicar las fuentes para los plazos y los números de emergencia (`TODO(fuente)`). No los inventamos.
4. Revisar la lista de qué datos se guardan (sección 4).
5. Decir si el mensaje de contención actual en `lib/ia/crisis.ts` le parece adecuado. La revisión de ese texto está en el documento anterior.

Una vez respondido, el equipo actualiza el ADR 0019 y la migración, y la pregunta queda registrada con la fecha de la revisión.
