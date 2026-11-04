# Encuesta escolar (3.° y 4.° medio)

Actualizado: 2026-11-04

## Presentación (se lee al inicio)

Esta encuesta es para estudiantes de 3.° y 4.° medio y dura unos 5 minutos. Forma parte de un proyecto de título de Ingeniería en Informática que estudia cómo los jóvenes deciden qué hacer después del colegio y cuánto saben sobre los beneficios para estudiar.

- **Es anónima:** no te pedimos nombre, RUT, correo ni teléfono.
- **Es voluntaria:** puedes saltarte cualquier pregunta o dejarla en cualquier momento, sin consecuencias en tu colegio.
- **No hay respuestas buenas ni malas:** nos interesa lo que tú vives y sabes hoy.
- **Para qué se usan tus respuestas:** solo se analizan en conjunto, como porcentajes y promedios del grupo. Nadie verá tus respuestas individuales.

> Nota para quien aplica la encuesta: no mencionar ninguna plataforma, aplicación ni servicio. El objetivo es medir la situación actual sin influir en las respuestas (ver la ficha metodológica).

## Autorizaciones (antes de aplicar)

La encuesta se aplica solo con las tres autorizaciones, en este orden. Casi todos los estudiantes de 3.° y 4.° medio son menores de 18 años (AGENTS.md, sección 2.2).

1. **Autorización del colegio:** carta firmada por la dirección del establecimiento, que autoriza aplicar la encuesta en horario de clases o enviarla a los apoderados.
2. **Consentimiento del apoderado:** formulario que el apoderado firma antes de la aplicación. Sin él, el estudiante no responde.
3. **Asentimiento del estudiante:** la primera pantalla de la encuesta. Si marca "No quiero participar", la encuesta termina.

### Texto del consentimiento para el apoderado

Estimado apoderado: invitamos a su pupilo o pupila a responder una encuesta anónima de unos 5 minutos sobre cómo los jóvenes deciden qué estudiar y cuánto conocen los beneficios para la educación superior. Es parte de un proyecto de título de Ingeniería en Informática. No se piden datos que permitan identificar al estudiante, la participación es voluntaria y puede retirarse en cualquier momento. Las respuestas se analizan solo en conjunto.

- [ ] Autorizo que mi pupilo o pupila responda la encuesta.
- [ ] No autorizo.

Contacto del equipo responsable: TODO(contacto): correo institucional del equipo, no personal.

### Asentimiento del estudiante (primera pantalla)

¿Quieres responder esta encuesta? Es anónima, voluntaria y puedes dejarla cuando quieras.

- Sí, quiero participar
- No quiero participar (termina la encuesta)

## Módulo 0: sobre ti

Cuatro preguntas, solo para comparar grupos. No permiten identificarte.

| N.° | Pregunta | Opciones de respuesta |
| --- | --- | --- |
| E0.1 | ¿En qué curso estás? | 3.° medio · 4.° medio |
| E0.2 | ¿En qué región está tu colegio? | Lista de las 16 regiones de Chile |
| E0.3 | ¿Qué tipo de colegio es? | Municipal o Servicio Local de Educación Pública (SLEP) · Particular subvencionado · Particular pagado · Administración delegada · No sé |
| E0.4 | ¿Qué modalidad estudias? | Científico-humanista · Técnico-profesional · Artística · No sé |

No se pregunta edad exacta, género, comuna ni nombre del colegio: no son necesarios para las preguntas de investigación (minimización, AGENTS.md 2.2).

> **Cambio del 2026-11-04:** se eliminó el módulo 1 (escala de falta de información, CDDQ) por decisión del equipo. Los códigos de las preguntas (E2.1 a E2.11) se mantienen para que coincidan con el formulario de Google.

## Módulo 2: beneficios para estudiar (núcleo común)

Preguntas propias. No existe una escala validada en español sobre conocimiento de beneficios estudiantiles, así que estas preguntas se validan con juicio de expertos y un piloto antes de aplicarse (ver la ficha metodológica).

### 2A. Conocimiento declarado

**Instrucción:** ¿Qué tanto conoces cada uno de estos beneficios?

| N.° | Beneficio | 1. No lo conozco | 2. Lo he escuchado | 3. Sé qué es | 4. Sé cómo postular |
| --- | --- | --- | --- | --- | --- |
| E2.1 | Formulario Único de Acreditación Socioeconómica (FUAS) |  |  |  |  |
| E2.2 | Gratuidad |  |  |  |  |
| E2.3 | Becas de arancel del Estado |  |  |  |  |
| E2.4 | Crédito con Garantía Estatal (CAE) |  |  |  |  |

### 2B. Conocimiento comprobado

**Instrucción:** Marca si cada frase es verdadera o falsa. Si no sabes, marca "No sé": es mejor que adivinar.

| N.° | Frase | Opciones | Clave |
| --- | --- | --- | --- |
| E2.5 | Para acceder a la gratuidad hay que completar el FUAS. | Verdadero · Falso · No sé | Verdadero |
| E2.6 | La gratuidad se puede usar en cualquier universidad, instituto o centro de formación técnica. | Verdadero · Falso · No sé | Falso |
| E2.7 | Para postular a beneficios hay que tener primero el puntaje de la prueba de acceso (PAES). | Verdadero · Falso · No sé | Falso |

> **Claves verificadas el 2026-11-04** en fuentes oficiales; el detalle y los enlaces están en la ficha metodológica. La clave no se muestra al estudiante: se usa solo en el análisis. Se revisa de nuevo antes de cada aplicación, porque las reglas de los beneficios cambian.

### 2C. Intención y plazos

| N.° | Pregunta | Opciones de respuesta |
| --- | --- | --- |
| E2.8 | ¿Piensas postular al FUAS? | Sí · No · Todavía no lo sé · No sé qué es el FUAS |
| E2.9 | ¿Sabes en qué fechas se postula al FUAS? | Sí, conozco las fechas · Más o menos · No |
| E2.10 | Si no piensas postular o aún no lo sabes, ¿por qué? (puedes marcar varias) | Creo que no me corresponde · No sé cómo hacerlo · Me parece difícil o largo · No sé si voy a estudiar · No me interesa estudiar · Otra razón |

### 2D. Dónde te informas

| N.° | Pregunta | Opciones de respuesta |
| --- | --- | --- |
| E2.11 | ¿Dónde te has informado sobre qué estudiar y cómo financiarlo? (puedes marcar varias) | Orientador o profesor del colegio · Familia · Amigos · Páginas oficiales del Ministerio de Educación · Redes sociales · Ferias o visitas de instituciones · En ningún lugar todavía |

## Cierre (se lee al final)

¡Gracias por responder! Tus respuestas nos ayudan a entender cómo deciden los jóvenes qué hacer después del colegio.

Si quieres saber más sobre los beneficios para estudiar, la información oficial está en el portal de Beneficios Estudiantiles del Ministerio de Educación (https://portal.beneficiosestudiantiles.cl/). También puedes preguntarle al orientador de tu colegio.

> Nota para quien aplica la encuesta: este cierre no corrige las respuestas del módulo 2 ni entrega la clave de las frases verdaderas o falsas, para no contaminar las respuestas de otros estudiantes del mismo curso.
