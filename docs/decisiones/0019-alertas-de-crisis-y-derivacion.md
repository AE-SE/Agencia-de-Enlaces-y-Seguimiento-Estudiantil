# 0019 — Alertas de crisis y derivación en la base de datos

Fecha: 2026-11-08 · Estado: propuesta (pendiente de revisión profesional y de aprobación del líder)

## Contexto

El protocolo de crisis ([`lib/ia/crisis.ts`](../../lib/ia/crisis.ts)) entrega de inmediato las líneas de ayuda y dice que debe crear "una alerta para revisión humana del equipo" (AGENTS.md 2.4). Hasta ahora esa alerta solo existía como una función inyectada (`RegistrarAlerta`). No había tabla, ni quién la revisa, ni cómo se deriva ni cómo se cierra. Sin eso, el protocolo termina en el mensaje a la persona, y nadie del equipo sabe que hay un caso.

## Opciones evaluadas

1. **Guardar la alerta en una tabla con acceso directo por RLS** (como `seguimiento`, pero para el equipo). Pros: simple. Contras: la política tendría que decidir sobre cada fila y no deja registro de lectura.
2. **Tablas sin acceso directo, todo por funciones que verifican permiso y registran cada acción** (elegida). Pros: el mismo patrón que `ver_seguimientos()` ya usado en el esquema base; cada lectura y cada cambio queda en un registro append-only. Contras: más funciones que mantener.
3. **Enviar la alerta a un servicio externo** (correo, herramienta de tickets). Pros: rápido de montar. Contras: datos sensibles fuera de la base, sin control de acceso ni registro. Se descarta por AGENTS.md 2.2.

## Decisión

Se crean tres tablas, sin permisos directos para la página:

- `alerta_crisis`: señales (suicidio o autolesión), fecha de detección, estado (pendiente, en revisión, derivada, cerrada) y, solo si había sesión, la persona. No guarda el mensaje.
- `derivacion`: a qué red o persona se deriva, quién la lleva, y su cierre con nota propia.
- `registro_acceso_alerta`: cada lectura y cada cambio, con usuario y fecha. Solo se agrega.

Solo el equipo de la agencia (rol administrador o acompañante) puede usar las funciones `ver_alertas`, `cambiar_estado_alerta`, `registrar_derivacion` y `cerrar_derivacion`. Las instituciones clientes no ven alertas. El lector de la agencia tampoco.

El servidor registra las alertas nuevas con la clave de servicio. Ninguna página puede crearlas.

## Justificación

- AGENTS.md 2.2: los datos sensibles necesitan acceso restringido y registro de quién accede. Por eso la lectura pasa por función y queda en `registro_acceso_alerta`.
- AGENTS.md 2.4: la alerta es para revisión humana. El diseño no permite que la IA ni la página decidan el cierre.
- ADR 0002: el aislamiento se impone en la base de datos, no en la página.
- El riesgo de guardar `persona_id` está declarado: si la persona tenía sesión, la alerta queda vinculada a ella. Es la única forma de que el equipo pueda contactarla, y la decisión de guardarlo requiere revisión profesional (ver `docs/revision-profesional-derivacion.md`).

## Consecuencias

- Cualquier cambio en la escalera de derivación (plazos, quién recibe, cuándo se contacta a un tutor) toca las funciones y el documento de revisión profesional.
- Los plazos de revisión humana no están en el código. Quedan como `TODO(profesional)` hasta que un profesional los defina con fuente.
- La revisión del protocolo de crisis (AGENTS.md 2.4) sigue pendiente. Este ADR no la reemplaza.
- Las pruebas de estas reglas corren en `supabase/tests/pruebas_rls.sql`, sección 9.
- Antes de datos reales: aplicar la migración `20261108100000_alertas_y_derivacion.sql` en Supabase (lo hace el líder) y definir la retención de las alertas.
