# 0010 — Módulo de permanencia basado en evidencia

Fecha: 2026-11-04 · Estado: reemplazada por el ADR 0031 y fuera del alcance actual (escalabilidad) el 2026-11-11 (antes: aceptada)

> **Nota del 2026-11-11.** El módulo de permanencia (mantención de beneficios, relatos de pares, escalera de derivación y pulso de check-in) queda fuera del alcance actual por el [ADR 0031](../0031-producto-y-organizacion.md): el producto se acota a 3.º y 4.º medio de liceos con financiamiento público. Se conserva como historia y como proyección de escalabilidad. Siguen vigentes las reglas de AGENTS.md 2.4 que este ADR fundó: la agencia es puente y no tratante, no se promete predicción, sin neuromitos y lenguaje sin estigma. La evidencia por componente sigue en `docs/evidencia-permanencia.md`.

## Contexto

La etapa "antes" se apoya en datos oficiales publicados (SIES, DEMRE, CNA, Beneficios Estudiantiles). La etapa "después" estaba definida por su propósito (acompañamiento psicosocial, psicoeducativo y psicolaboral) pero no por un mecanismo justificado. Al revisarla aparecieron tres problemas:

1. **El módulo no tiene señal propia.** El diseño dependía de que el estudiante iniciara el contacto para reportar dificultades, que es justamente lo que el estudiante en riesgo de desertar no hace: deja de responder. Un panel que espera al estudiante queda vacío.
2. **La propuesta institucional no se sostenía.** Ofrecer alertas a una institución que ya tiene notas, asistencia y estado de pago en su propio sistema, construidas con menos datos que los suyos, no responde para qué servimos.
3. **No había justificación de evidencia**, que AGENTS.md sección 6 exige para toda decisión.

Se revisó la evidencia sobre permanencia en educación superior. El detalle, con fuentes y nivel de evidencia por intervención, está en [`docs/evidencia-permanencia.md`](../../evidencia-permanencia.md).

El hallazgo determinante: las dos intervenciones con mayor respaldo causal están fuera del alcance de la plataforma. El apoyo integral de alta intensidad (modelo ASAP de CUNY) elevó la titulación a tres años en 18 puntos porcentuales, con réplica aleatorizada independiente de 16 puntos, pero implica del orden de 24 sesiones de tutoría por estudiante en el primer año y un costo adicional cercano a 9.000 dólares por título. La ayuda financiera directa aumenta persistencia y titulación entre 2 y 3 puntos porcentuales según metaanálisis de 43 estudios causales. No entregamos dinero ni podemos financiar esa intensidad de tutoría.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| **Cuatro componentes priorizados por evidencia, con beneficios extendidos a la etapa "después"** | Se apoya en lo que sí está a nuestro alcance: evitar que el estudiante pierda la ayuda que ya tiene. Extiende un módulo que ya existe en el MVP. Permite una promesa verificable | Amplía el alcance de beneficios en plena semana 1; exige conseguir relatos reales con consentimiento |
| Construir un programa de tutoría propio | Es la intervención con mayor efecto comprobado | Intensidad y costo imposibles para tres personas sin financiamiento; duplicaría lo que la institución ya tiene |
| Modelo predictivo de deserción | Vendible como diferenciador | Sin datos históricos propios y con menos señal que la institución, cualquier modelo sería inferior al que ella ya puede calcular. Prometería una precisión que no podemos sostener |
| Foro o comunidad abierta entre estudiantes | Intuitivamente atractivo; sensación de comunidad | Sin evidencia que lo respalde como mecanismo de permanencia. Tres personas no pueden moderar un espacio donde se hablará de angustia fuera de horario. Mensajes de usuarios posiblemente menores con contenido sensible bajo la Ley 21.719 |
| Mensajes automatizados como intervención principal | Barato de implementar | Evidencia negativa: las campañas a escala no replicaron el efecto de los ensayos locales, sin que importara contenido, momento, medio ni oferta de ayuda individual |

## Decisión

El seguimiento se organiza en cuatro componentes, en este orden de prioridad:

1. **Beneficios extendidos a la etapa "después".** El módulo de beneficios deja de cubrir solo la postulación y cubre también la mantención: renovación, avance académico mínimo exigido para conservar el beneficio, alertas de plazo y qué hacer si se perdió. Los plazos y requisitos son datos con fecha de vigencia, nunca en el código (AGENTS.md 2.1).
2. **Pertenencia.** Relatos curados de estudiantes reales, revisados antes de publicarse, asociados a carrera y momento del año, más un ejercicio breve de escritura. Se presenta al registrarse y al inicio de cada período.
3. **Escalera de derivación.** Niveles de respuesta escritos, con responsable en cada uno, terminando en la red de apoyo de la institución o en la red pública (\*4141, Salud Responde 600 360 7777). La plataforma identifica qué programa de acompañamiento tiene la institución del estudiante y deriva hacia allá.
4. **Pulso de check-in, como sensor.** Pregunta breve en momentos clave del calendario académico. Su función es construir una serie de tiempo donde hoy no hay ninguna y tratar el silencio como señal: dos o tres pulsos sin respuesta, habiendo respondido antes, es el indicador más fuerte disponible en el MVP.

**Se descartan** los foros y la conversación abierta. Quedan en fase 2, condicionados a contar con el profesional validador y con volumen suficiente para moderar.

**La agencia es puente, no tratante.** Mientras no exista profesional de psicología o psicopedagogía que valide el contenido, la escalera termina siempre en derivación, nunca en consejo propio (AGENTS.md 2.4).

## Justificación

- AGENTS.md sección 6 exige que toda decisión quede justificada y trazable. Cada componente queda con su nivel de evidencia declarado en `docs/evidencia-permanencia.md`.
- El componente 1 es el de mayor respaldo dentro de nuestro alcance y el de menor costo de desarrollo, porque extiende un módulo ya planificado. En Chile la gratuidad y las becas se pierden por no renovar a tiempo, no cumplir el avance mínimo o desconocer un plazo: eso es deserción por causa financiera y administrativa, y es nuestro terreno.
- El componente 2 se adopta con su condición explícita: la evidencia muestra efecto **solo** donde la institución ya cuenta con apoyos reales detrás. Por eso el componente 3 no es opcional.
- El componente 4 cambia de rol en vez de descartarse: la evidencia es negativa para los mensajes como intervención, no como instrumento de medición.
- Los foros se descartan por ausencia de evidencia sumada a riesgo de moderación y de protección de datos, no solo por lo segundo.
- La derivación en vez de la construcción propia nos pone como socio de la unidad de acompañamiento de la institución en lugar de competidor.

## Consecuencias

- **La promesa pública cambia.** No afirmamos que mejoramos la retención: afirmamos que reducimos la deserción por pérdida de beneficios y por desconexión no detectada. Es verificable contra los datos de la propia institución. Ningún texto de interfaz, documento comercial ni respuesta del asistente puede describir el pulso como predicción de deserción.
- El módulo de beneficios crece en alcance en la semana 3; el módulo de permanencia entra en la semana 4. `docs/plan.md` actualizado.
- Se requieren relatos reales con **consentimiento escrito por relato**, guardado con la misma protección que la Ficha de Trayectoria. Es trabajo de contenido que no estaba presupuestado.
- Preguntar por estado anímico convierte la respuesta en **dato sensible de salud** bajo la Ley 21.719, con consentimiento explícito y separado (AGENTS.md 2.2). Las preguntas del pulso se redactan con criterio legal además de pedagógico: una pregunta sobre dificultad percibida de la semana no equivale a un tamizaje de síntomas. No se implementan antes de esa revisión.
- El componente 2 no se publica hasta que la escalera del componente 3 esté escrita y con responsables asignados.
- El encargo al profesional validador se reduce de "escribir contenido psicoeducativo" a "revisar material con respaldo publicado", lo que lo hace alcanzable dentro del plazo.
- **Verificado en el [ADR 0012](../0012-cadena-causal-y-promesa.md):** la Ley 21.091 no obliga a las instituciones a tener planes de acompañamiento (el Art. 8 letra c encarga promover la permanencia a la Subsecretaría). El argumento comercial es la acreditación, no el cumplimiento de una obligación legal.
- **Pendiente de obtener:** último informe de retención del SIES, para la línea base del sistema chileno.
- **Pendiente de diseño:** tablas y políticas RLS de mantención de beneficios, pulso y escalera de derivación.
- Las estrategias de estudio que acompañen al componente 2 siguen sujetas a AGENTS.md 2.4: metacognición y estrategias con evidencia, nunca estilos de aprendizaje.
