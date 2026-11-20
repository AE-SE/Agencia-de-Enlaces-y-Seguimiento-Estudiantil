# Encuesta del estudio

Una sola encuesta mide el problema que aborda el proyecto, sin mencionar la plataforma ni ninguna solución. Se aplica **en línea, por invitación abierta, a personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años**, en todo Chile, hayan ingresado o no a la educación superior ([ADR 0032](../decisiones/0032-agencia-independiente-y-publico-egresado.md); punto 2.3.3 y Anexo 2.A del entregable). Es **un solo instrumento estandarizado, completo**: la Escala de Autoeficacia para la Elección de Carrera (EAEC) de Ramírez Dorantes y Canto (2007), con 55 ítems y respuesta de 0 a 9. Se agregan una pregunta filtro de edad y cuatro preguntas de clasificación.

**Estado:** no se ha aplicado. El lunes 23 de noviembre de 2026 se envía el correo a los autores y se crea el formulario **cerrado**. Se abre a respuestas solo cuando llegue el permiso, y queda abierto hasta el 4 de diciembre. Si el permiso no llega, la encuesta no se aplica (decisión del líder, 20 de noviembre de 2026).

Actualizado: 2026-11-20.

| Archivo | Qué es |
|---|---|
| [`encuesta-egresados.md`](encuesta-egresados.md) | Presentación y consentimiento, filtro de edad, preguntas de clasificación y los 55 ítems de la EAEC |
| [`ficha-metodologica.md`](ficha-metodologica.md) | Por qué la EAEC, objetivo, muestra, adaptación de vocabulario ítem por ítem, puntuación, análisis, ética y limitaciones |
| [`crear_encuestas.gs`](crear_encuestas.gs) | Script de Google Apps Script que crea el formulario en Google Forms |
| [`solicitud-permiso-eaec.md`](solicitud-permiso-eaec.md) | Borrador del correo a los autores de la escala, con el registro de envío y respuesta |

## Decisiones que conviene conocer

- **Un solo instrumento estandarizado (2026-11-10, decisión del líder).** Reemplaza la versión del 2026-11-06, que combinaba ítems de seis fuentes sin validación como conjunto. Se aplica completo; solo se adapta el vocabulario de México a Chile, con cada cambio declarado en la ficha.
- **Personas egresadas de 18 años o más, en línea (2026-11-13, ADR 0032).** Ya no hay escolares, colegios, carta de colegio, consentimiento de apoderado ni asentimiento de menores. El consentimiento informado va en la primera pantalla y la primera pregunta confirma la edad.
- **Anónima y mínima.** Sin nombre, RUT, correo, edad exacta, comuna, nombre del establecimiento ni dirección IP; sin preguntas de salud ni de situación económica. Solo se publican resultados agregados, sin grupos de menos de cinco respuestas.
- **Muestra:** al menos 96 respuestas; con 128 (64 que no han ingresado y 64 que sí) se comparan los dos grupos. Muestreo por conveniencia, no representativo.
- **Sin ítems de conocimiento de beneficios** (Formulario Único de Acreditación Socioeconómica, gratuidad, becas, Crédito con Aval del Estado): no existe una escala validada que los mida. Esa pregunta queda para las entrevistas y la medición con datos administrativos (folio AJ025T0003786).
- **El juicio de expertos y la prueba previa son controles adicionales**, no el respaldo (Escobar-Pérez y Cuervo-Martínez, 2008).
- **Sin comité de ética:** la institución no lo exige para este proyecto. La revisión la hace el profesor guía.

## Pendientes

- Permiso de los autores para usar la EAEC con la adaptación de vocabulario y con un posible uso comercial posterior, y confirmación de qué ítems forman cada subescala.
- Umbral del juicio de expertos.
- Tiempo real de respuesta (se mide en la prueba previa; hoy se estima entre 10 y 15 minutos).
- Que el líder confirme dos decisiones abiertas de esta versión: las opciones de año de egreso (2021 a 2025 y «Otro año») y que «ha ingresado» se mida con la situación actual.

## Los formularios en uso

Están en Google Forms, en la cuenta institucional del líder, junto con sus planillas de respuestas. **Sus enlaces no se guardan aquí**: si el repositorio es público, cualquiera podría responder y contaminar los datos. Se piden al líder. Los formularios creados con versiones anteriores hay que reemplazarlos por el que genere el script nuevo.

## Antes de aplicar

- [ ] Permiso de los autores de la EAEC (borrador del correo en [`solicitud-permiso-eaec.md`](solicitud-permiso-eaec.md)).
- [ ] Juicio de expertos sobre la adaptación de vocabulario (plantilla en la ficha).
- [ ] Prueba previa con 10 personas.
- [ ] Revisión del profesor guía.
- [ ] Crear el formulario nuevo con el script (queda cerrado) y borrar de la planilla las respuestas de prueba.
- [ ] Con el permiso en la mano, abrirlo en Respuestas → «Aceptando respuestas».

Si cambia un ítem, se cambia aquí, en el formulario (`crear_encuestas.gs`) y en la ficha a la vez.
