# 0020 — Derechos del titular en la base de datos

Fecha: 2026-11-08 · Estado: propuesta (pendiente de revisión legal y de aprobación del líder)

## Contexto

`docs/privacidad.md` (sección 5) promete que la persona puede ver, corregir, exportar, oponerse y eliminar sus datos, y que las solicitudes se responden "en el plazo que fije la ley". Hasta ahora eso no estaba implementado en la base de datos: no había una función de exportación ni un registro de solicitudes. AGENTS.md 2.2 exige implementar los derechos de acceso, rectificación, supresión, oposición y portabilidad.

## Opciones evaluadas

1. **Solo una página de perfil** que muestre y descargue los datos. Pros: visible para la persona. Contras: sin una función en la base, cada página podría armar la exportación de forma distinta, y no hay registro de solicitudes.
2. **Funciones en la base de datos y constancia de solicitudes** (elegida). Pros: la exportación sale siempre igual y con las mismas reglas de acceso; cada solicitud queda registrada. Contras: la supresión física la hace el servidor, no la página.
3. **Eliminar todo al instante desde la página.** Pros: rápido. Contras: borra la prueba de que se atendió la solicitud, y puede chocar con deberes de conservación que todavía no se han revisado.

## Decisión

- `exportar_mis_datos()`: devuelve en JSON el registro de persona, la ficha, los datos del tutor (sin el contacto del tutor, que es dato de un tercero), los consentimientos, los seguimientos sobre la persona, los accesos a sus datos y sus solicitudes. Cada exportación queda registrada.
- `solicitar_derecho(tipo)`: registra una solicitud de acceso, rectificación, supresión, oposición o portabilidad. Una persona no puede tener dos solicitudes abiertas del mismo tipo.
- `ver_solicitudes_abiertas()` y `resolver_solicitud()`: solo para el equipo de la agencia.
- La corrección y la oposición ya existen en el esquema (perfil propio y revocación de consentimiento). La solicitud solo deja constancia.
- La supresión física (borrar la cuenta de autenticación) la ejecuta el servidor con la clave de servicio, al resolver la solicitud.

## Justificación

- AGENTS.md 2.2: los derechos del titular se implementan, y la exportación es portabilidad.
- Minimización: la exportación no incluye el contacto del tutor, que pertenece a otra persona.
- Trazabilidad: cada exportación y cada solicitud quedan con fecha y responsable.

## Consecuencias

- Antes de ejecutar una supresión real, hay que definir qué se conserva y por cuánto tiempo. Es probable que la constancia de la solicitud y el registro de accesos deban conservarse, y eso requiere revisión legal (`TODO(legal)`).
- El plazo de respuesta a las solicitudes lo fija la ley aplicable. No lo fijamos aquí (`TODO(legal)`).
- La página de perfil que use estas funciones depende de la cuenta de la persona (ADR 0015, pendiente). Hasta entonces, las funciones no tienen una puerta de entrada pública.
- Las pruebas corren en `supabase/tests/pruebas_rls.sql`, sección 10.
