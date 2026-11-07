# Encuesta escolar (3.° y 4.° medio)

Actualizado: 2026-11-06

Cada pregunta viene de un instrumento publicado o de una encuesta oficial, adaptada lo mínimo y con la adaptación declarada. El respaldo de cada una (fuente, nivel A/B/C/D y cifras de la fuente original) está en la [ficha metodológica](ficha-metodologica-escolar.md). Ninguna pregunta es de elaboración propia.

## Presentación (se lee al inicio)

Esta encuesta es para estudiantes de 3.° y 4.° medio y dura unos 6 minutos. Forma parte de un proyecto de título de Ingeniería en Informática que estudia cómo los jóvenes buscan información para decidir qué hacer después del colegio y cuánto saben sobre los beneficios para estudiar.

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

Estimado apoderado: invitamos a su pupilo o pupila a responder una encuesta anónima de unos 6 minutos sobre cómo los jóvenes buscan información para decidir qué estudiar y cuánto conocen los beneficios para la educación superior. Es parte de un proyecto de título de Ingeniería en Informática. No se piden datos que permitan identificar al estudiante, la participación es voluntaria y puede retirarse en cualquier momento. Las respuestas se analizan solo en conjunto.

- [ ] Autorizo que mi pupilo o pupila responda la encuesta.
- [ ] No autorizo.

Contacto del equipo responsable: TODO(contacto): correo institucional del equipo, no personal.

### Asentimiento del estudiante (primera pantalla)

¿Quieres responder esta encuesta? Es anónima, voluntaria y puedes dejarla cuando quieras.

- Sí, quiero participar
- No quiero participar (termina la encuesta)

## Módulo 0: sobre ti (nivel D)

Cuatro preguntas, solo para comparar grupos. No permiten identificarte.

| N.° | Pregunta | Opciones de respuesta |
| --- | --- | --- |
| E0.1 | ¿En qué curso estás? | 3.° medio · 4.° medio |
| E0.2 | ¿En qué región está tu colegio? | Lista de las 16 regiones de Chile |
| E0.3 | ¿Qué tipo de colegio es? | Municipal o Servicio Local de Educación Pública (SLEP) · Particular subvencionado · Particular pagado · Administración delegada · No sé |
| E0.4 | ¿Qué modalidad estudias? | Científico-humanista · Técnico-profesional · Artística · No sé |

No se pregunta edad exacta, género, comuna ni nombre del colegio: no son necesarios para las preguntas de investigación (minimización, AGENTS.md 2.2).

## Módulo 1: confianza para obtener información de carreras (nivel A)

**Instrucción:** ¿Cuánta confianza tienes de que podrías…? Marca de 0 (ninguna confianza) a 9 (confianza absoluta).

| N.° | Ítem | Ítem original (Ramírez Dorantes y Canto, 2007) |
| --- | --- | --- |
| E1.1 | Encontrar información acerca de las ocupaciones que te interesan | 12, sin cambios |
| E1.2 | Obtener información acerca de instituciones de educación superior (universidades, institutos profesionales o centros de formación técnica) | 14, "escuelas profesionales o universitarias" |
| E1.3 | Asistir a alguna institución de educación superior a obtener información de las carreras que ofrecen | 15, "escuela" |
| E1.4 | Asistir a charlas que proporcionen información acerca de las carreras que te interesan | 17, "pláticas" |
| E1.5 | Asistir a algún evento vocacional (feria, expo, etc.) | 19, "muestra" |
| E1.6 | Preguntarle a algún profesor acerca de las oportunidades de trabajo | 21, "maestro" |

Los cambios de vocabulario (mexicano a chileno) y de contexto (instituciones de los tres tipos) están declarados en la ficha. Son 6 de los 10 ítems de la subescala "Información ocupacional": no es una versión corta validada.

## Módulo 2: cuánto crees conocer (nivel C)

**Instrucción:** ¿Qué tan bien crees que conoces…?

| N.° | Aspecto | Muy poco | Poco | Bien | Muy bien |
| --- | --- | --- | --- | --- | --- |
| E2.1 | El Formulario Único de Acreditación Socioeconómica (FUAS) |  |  |  |  |
| E2.2 | La gratuidad |  |  |  |  |
| E2.3 | Las becas de arancel del Estado |  |  |  |  |
| E2.4 | El Crédito con Garantía Estatal (CAE) |  |  |  |  |

La escala de 4 niveles es la de Fundación Luksic (2025). La Fundación no publica el listado textual de aspectos: se pedirá a la Fundación (TODO(fuente): pendiente) y mientras tanto se usan los cuatro beneficios que el proyecto necesita medir.

## Módulo 3: cuánto sabes (nivel C)

**Instrucción:** Marca si cada frase es verdadera o falsa. Si no sabes, marca "No sé": es mejor que adivinar.

| N.° | Frase | Opciones | Clave |
| --- | --- | --- | --- |
| E3.1 | Debo matricularme en instituciones de educación superior acreditadas para poder optar a becas y créditos del Estado. | Verdadero · Falso · No sé | Verdadero |
| E3.2 | El ingreso mensual de los egresados de las carreras universitarias siempre es mayor que el de los egresados de carreras de institutos profesionales. | Verdadero · Falso · No sé | Falso |
| E3.3 | Debo postular a cada beneficio de financiamiento del Estado por separado. | Verdadero · Falso · No sé | Falso |
| E3.4 | Existe un sistema centralizado para postular a carreras de Institutos Profesionales y Centros de Formación Técnica. | Verdadero · Falso · No sé | Falso |

> Las claves se verificaron el 2026-11-06 en fuentes oficiales; el detalle y los enlaces están en la ficha metodológica. La clave no se muestra al estudiante: se usa solo en el análisis. Se revisa de nuevo antes de cada aplicación, porque las reglas de los beneficios cambian.

## Módulo 4: qué te preocupa (nivel C)

**Instrucción:** Pensando en estudiar después del colegio, ¿qué tanto te preocupa…?

| N.° | Ítem | Nada | Poco | Bastante | Mucho |
| --- | --- | --- | --- | --- | --- |
| E4.1 | Cumplir con los requisitos académicos para ser admitido |  |  |  |  |
| E4.2 | Financiar otros gastos asociados a mis estudios |  |  |  |  |
| E4.3 | Financiar el arancel y matrícula |  |  |  |  |

## Módulo 5: de dónde sacas la información (nivel A y C)

**Instrucción:** ¿Qué tan de acuerdo estás con cada frase? Marca de 1 (nada de acuerdo) a 5 (muy de acuerdo).

| N.° | Frase |
| --- | --- |
| E5.1 | La información que tengo de la carrera que pretendo elegir la obtengo de mis profesores |
| E5.2 | La información que tengo de la carrera que pretendo elegir la obtengo del orientador/a de mi colegio |
| E5.3 | La información que tengo de la carrera que pretendo elegir la obtengo de las ferias de orientación |
| E5.4 | La información que tengo de la carrera que pretendo elegir la obtengo de mi familia |
| E5.5 | La información que tengo de la carrera que pretendo elegir la obtengo de páginas web o redes sociales oficiales |

## Módulo 6: una razón posible para no seguir (nivel B)

Una sola pregunta, de respuesta única. Es sobre el futuro: no preguntamos si te pasó.

| N.° | Pregunta | Opciones de respuesta |
| --- | --- | --- |
| E6.1 | Después de salir de 4.° medio, ¿cuál sería la principal razón por la que podrías no seguir estudiando? | Ayuda en la casa o quehaceres del hogar · Embarazo, maternidad o paternidad · Tengo una discapacidad, requiero establecimiento de educación especial · Una enfermedad que me inhabilita · Problemas familiares · No me interesa · A mi edad no me sirve estudiar o no conozco la manera para completar mis estudios · Dificultad económica · Trabajo o busco trabajo · Problemas de rendimiento · Expulsión o cancelación de matrícula · No existe establecimiento cercano · Dificultad de acceso o movilización · Otra razón · No lo sé |

Son las categorías de la pregunta e5 de la Encuesta CASEN 2011, sin "Terminó de estudiar" (no aplica a quien aún estudia). Algunas categorías mencionan salud o discapacidad: son opciones de una lista, la respuesta es anónima y se puede omitir. Esto se informa a los apoderados en el consentimiento.

## Cierre (se lee al final)

¡Gracias por responder! Tus respuestas nos ayudan a entender cómo buscan información los jóvenes para decidir qué hacer después del colegio.

Si quieres saber más sobre los beneficios para estudiar, la información oficial está en el portal de Beneficios Estudiantiles del Ministerio de Educación (https://portal.beneficiosestudiantiles.cl/). También puedes preguntarle al orientador de tu colegio.

> Nota para quien aplica la encuesta: este cierre no corrige las respuestas del módulo 3 ni entrega la clave de las frases verdaderas o falsas, para no contaminar las respuestas de otros estudiantes del mismo curso.

## Qué se eliminó respecto de la versión del 2026-11-04

Las preguntas de intención de postular al FUAS, conocimiento de plazos, barreras al FUAS y "dónde te has informado" (E2.8 a E2.11 antiguas), y las frases de verdadero o falso del equipo (E2.5 a E2.7 antiguas), no tienen un instrumento publicado que las respalde y se quitaron. Quedan como pregunta de investigación para la medición con datos administrativos (solicitud de transparencia sobre el FUAS, folio AJ025T0003786). Los códigos E2.x actuales corresponden al módulo 2 nuevo.
