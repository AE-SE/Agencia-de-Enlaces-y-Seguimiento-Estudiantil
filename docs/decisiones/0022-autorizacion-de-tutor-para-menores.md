# 0022 — Autorización de madre, padre o tutor para menores de 18 años

Fecha: 2026-11-09 · Estado: aceptada por el líder (@rafajaque) el 2026-11-11 en la parte A (opción A1); la forma de probar la autorización (B2 al comienzo) sigue sujeta a asesoría legal. Relacionado: [ADR 0015](0015-cuenta-del-estudiante-y-vinculo-institucional.md), [ADR 0020](0020-derechos-del-titular.md), AGENTS.md 2.2.

> **Nota del 2026-11-11.** Sigue pendiente de revisión legal y de la decisión del líder (A1 o A3), pero pasa a ser central: los usuarios del producto son estudiantes de 3.º y 4.º medio, muchos menores, y el panel del colegio solo muestra a quienes lo autorizan ([ADR 0031](0031-producto-y-organizacion.md)). Donde el texto dice «institución» se lee «colegio». La obligación especial del artículo 16 quáter alcanza directamente a los establecimientos educacionales.

## Contexto

El ADR 0015 (punto 5) dejó pendiente el flujo de autorización para menores de 18 años, y pide revisión legal antes de implementarlo. AGENTS.md 2.2 pide autorización de padre, madre o tutor «para datos que lo exijan» y no asumir nunca la mayoría de edad. Muchas personas que usan el portal están en 3.º o 4.º medio.

### Hallazgo: hoy el menor puede autorizarse a sí mismo

La regla actual dice que un menor solo puede otorgar consentimientos si existe una fila en `autorizacion_tutor` (`consentimiento_otorgar`). Pero la política `tutor_propio` del esquema base, junto con los permisos de la migración `20261104010000`, permite que **la propia persona inserte esa fila**. Un menor puede escribir un nombre y un contacto inventados y saltarse la regla. La prueba 5 de `supabase/tests/pruebas_rls.sql` lo hacía como el menor, así que la prueba pasaba sin probar nada.

No se ha verificado si ya hay filas en la base de Supabase. Se cierra el hueco en este mismo cambio (migración `20261109100000`): la persona solo puede ver su autorización, y la registra el servidor. Eso no implementa el flujo, que sigue esperando la revisión legal del ADR 0015.

### Lo que dice la ley (verificado)

Artículo 16 quáter de la Ley 19.628, según el texto de la Ley 21.719 publicado en el Diario Oficial núm. 44.023 del 13 de diciembre de 2024 (CVE 2583630), leído el 2026-11-09:

- El tratamiento de datos de niños, niñas y adolescentes solo puede hacerse atendiendo a su **interés superior** y al respeto de su **autonomía progresiva**.
- **Menores de 14 años** (niños y niñas): se necesita el consentimiento de sus padres, representantes legales o quien tiene su cuidado personal.
- **De 14 a 17 años** (adolescentes): sus datos se pueden tratar con las mismas normas de autorización que para los adultos, **salvo los datos sensibles de menores de 16 años**, que requieren el consentimiento de sus padres o representantes.
- Quienes traten datos de niños, niñas y adolescentes tienen la obligación especial de velar por el uso lícito y la protección de esa información, incluidos los establecimientos educacionales.

La regla actual del proyecto (todo menor de 18 necesita autorización) es **más estricta que la ley**. Eso es lícito, pero tiene un costo: frena a jóvenes de 16 y 17 años que la ley deja decidir.

## Opciones evaluadas

### A. Quién necesita autorización

| Opción | A favor | En contra |
|---|---|---|
| A1. Todo menor de 18, para todo (regla actual) | Simple y protectora | Más estricta que la ley; mucha fricción justo en el público principal; poco coherente con la autonomía progresiva |
| **A2. Según la ley:** menores de 14 siempre; de 14 y 15 solo para datos sensibles; de 16 y 17 como adultos | Coincide con el artículo 16 quáter y respeta la autonomía progresiva | Hay que decidir qué datos son sensibles; más reglas que explicar |
| **A3. Según la ley, con regla propia más estricta para la capa 3** (datos sensibles del ADR 0015): todo menor de 18 con autorización | Conserva la protección máxima donde el daño sería mayor | Los de 16 y 17 años necesitan al adulto solo para la capa 3 |

### B. Cómo se prueba la autorización

| Opción | A favor | En contra |
|---|---|---|
| B1. La declara el propio menor (estado actual) | — | **Descartada.** No es una autorización: la puede inventar el menor |
| **B2. Confirmación por correo del adulto**, con un enlace de un solo uso que emite el servidor | Barata, sin cuenta del adulto, el adulto ve qué autoriza y puede decir que no | No prueba parentesco: el correo puede ser de cualquier persona |
| B3. Cuenta sin contraseña del adulto, vinculada al menor | Más verificable y permite revocar desde su propia cuenta | Guarda más datos de un tercero; más pasos |
| B4. Verificación documental o por el establecimiento o la institución | La más robusta | Costosa, con datos más sensibles, y obliga a depender de terceros |

## Decisión propuesta

1. **Quién (A1, decidido por el líder el 2026-11-11):** todo menor de 18 años necesita la autorización de su madre, padre o tutor para guardar o compartir datos, sin excepciones por edad. Es más estricto que el artículo 16 quáter, lo que es lícito. Lo público (explorar, simular, consultar beneficios) sigue abierto sin cuenta. Las opciones A2 y A3 quedan descartadas.
2. **Cómo (B2 al comienzo):** el adulto confirma por correo con un enlace de un solo uso. Para menores de 14 años y para la capa 3, se decide con asesoría legal si B2 basta o si hace falta B3 o B4.
3. **Qué no puede hacer el menor:** escribir, modificar ni borrar su autorización. Solo puede **pedirla**. Esto ya se aplica con la migración `20261109100000`.
4. **Quién escribe la autorización:** solo el servidor (rol de servicio), después de que el adulto confirma.

### Flujo (esbozo, sin implementar)

1. La fecha de nacimiento decide qué reglas aplican. Todo lo público sigue abierto sin cuenta ni autorización: explorar, simular, consultar beneficios.
2. Cuando la persona quiere guardar o compartir algo que lo exige, aparece una pantalla con lenguaje claro: «Para esto necesitamos a tu mamá, papá o tutor». Escribe el nombre y el correo del adulto.
3. El servidor registra una **solicitud pendiente**, que no habilita nada, y envía al adulto un correo con un enlace que vence en 7 días.
4. El correo explica qué datos se piden, para qué, quién los verá y que el adulto puede decir que no. Solo el servidor guarda el resultado.
5. La persona ve el estado («pendiente», «aceptada», «rechazada») sin culpas ni etiquetas.
6. Cada correo posterior trae un enlace para **revocar**. Al revocar, la autorización deja de valer desde ese momento.
7. Al cumplir 18 años, el consentimiento pasa a ser de la persona y se le pide confirmarlo de nuevo.

### Modelo de datos (esbozo)

Una tabla de solicitudes (pendientes) y la tabla de autorizaciones otorgadas, con: persona, relación del adulto (madre, padre, tutor legal), alcance (qué finalidades y qué organización), huella del enlace (nunca el enlace), vencimiento, fecha de otorgamiento, fecha de revocación y versión del texto informado. `tengo_autorizacion_tutor()` solo debe contar autorizaciones **otorgadas, no revocadas y vigentes**, y por finalidad. El contacto del adulto es dato de un tercero: no lo ve ninguna institución y no sale en la exportación de datos (ya excluido en el ADR 0020).

### Reglas que no se negocian

- Ningún servicio, beneficio o acompañamiento depende de que el adulto autorice (ADR 0015).
- El correo del adulto no puede ser el de la propia persona. Es un control básico, no una prueba de parentesco.
- Límite de solicitudes por persona y por correo, y registro de cada intento.
- Sin lenguaje de etiqueta: nunca «menor en riesgo» ni parecidos (AGENTS.md 2.4).

## Justificación

- Un consentimiento que el propio menor puede fabricar no protege a nadie. Cerrar ese hueco es lo primero y no depende de decisiones legales.
- A3 cumple la ley, respeta la autonomía progresiva que ella exige y pone la mayor protección en los datos sensibles.
- B2 es el único mecanismo que se puede construir hoy con las herramientas del proyecto (Supabase y correo). No prueba parentesco, y por eso se deja como pregunta legal en lugar de darlo por suficiente.

## Consecuencias

- Hay que enviar correos desde el servidor. Falta decidir el proveedor, con los criterios del proyecto: costo, región de los datos (Sudamérica cuando se pueda) y que no use el contenido para entrenar sus productos.
- Las pruebas de RLS deben cubrir: el menor no se autoriza solo, una solicitud pendiente no habilita nada, una autorización revocada o vencida deja de habilitar, y otro usuario no ve la autorización ajena. Falta construirlas junto con el flujo.
- `docs/privacidad.md` (sección 3) y AGENTS.md 2.2 deben alinearse con la decisión final (hoy dicen «menores de 18» sin distinguir edades).
- Las instituciones tienen la obligación especial del artículo 16 quáter: conviene reflejarla en los contratos.

## Pendiente

Preguntas para la revisión legal (no son decisión de código):

1. ¿Basta la confirmación por correo del adulto (B2), o la ley exige algo más para menores de 14 años y para datos sensibles de 14 y 15 años?
2. ¿Qué datos de la Ficha son sensibles? La capa 1 incluye «beneficios vigentes», que podría revelar la situación socioeconómica, que la ley trata como dato sensible.
3. ¿Cuánto tiempo se puede guardar el contacto del adulto y con qué base?
4. ¿La autorización sigue valiendo después de cumplir 18 años, o debe confirmarla la propia persona?
5. ¿Qué obligaciones concretas pone el último inciso del artículo 16 quáter a la plataforma y a las instituciones clientes?

Además: decisión del líder entre A1 y A3, y elección del proveedor de correo.
