# Anexo de evidencia — Permanencia estudiantil

**Fecha:** 4 de noviembre de 2026
**Propósito:** justificar, con evidencia verificable, qué hace y qué no hace el módulo de seguimiento de la plataforma. Es el respaldo del [ADR 0010](decisiones/0010-modulo-de-permanencia.md) y un capítulo del informe de título.

> **Estado (11-nov-2026): respaldo de proyección.** El producto vigente es el
> sitio gratuito para estudiantes de 3.º y 4.º medio y el panel de seguimiento
> para colegios (cliente: colegios y sostenedores). El módulo de permanencia en
> educación superior, el pulso de check-in y la promesa comercial de este anexo
> quedan **fuera del alcance actual**: son escalabilidad futura y este anexo se
> conserva como su respaldo de evidencia. Lo que sigue siendo vigente es la regla
> de declarar el nivel de evidencia de cada componente (AGENTS.md 2.4) y el límite
> de no prometer predicción. Reemplazado en parte por el ADR 0031 (producto y
> organización).

## Por qué existe este anexo

La etapa "antes de entrar" de la plataforma se apoya en datos oficiales publicados (SIES, DEMRE, CNA). La etapa "después de entrar" no tiene una fuente equivalente: hay que decidir qué intervenciones implementar y justificar por qué. Este anexo ordena las intervenciones candidatas por la fuerza de la evidencia que las respalda y deja escrita la decisión tomada para cada una.

Criterio de clasificación:

| Nivel | Significado |
|---|---|
| **Alta** | Varios ensayos controlados aleatorizados (ECA) con réplica independiente, o metaanálisis de estudios causales |
| **Media** | ECA con efectos condicionados al contexto, o con hipótesis primarias no confirmadas |
| **Baja** | Estudios observacionales o de caso; asociación, no causalidad |
| **Negativa** | ECA a escala con efectos nulos estimados con precisión |
| **Sin evidencia** | No se encontró evidencia que lo respalde como mecanismo de permanencia |

## Jerarquía de la evidencia

### 1. Apoyo integral de alta intensidad — evidencia ALTA

**Qué es.** Programas que combinan apoyo financiero, académico y de servicios al estudiante de forma sostenida. El caso de referencia es ASAP (Accelerated Study in Associate Programs) de la City University of New York.

**Evidencia.** El ECA de MDRC estimó un efecto de 18 puntos porcentuales en titulación a tres años, casi duplicándola: de 22% a 40%. La réplica aleatorizada en Ohio arrojó 16 puntos, confirmando el resultado en otro contexto institucional. A ocho años el efecto persiste: 15 puntos más de titulación y 14% más de ingresos anuales. A catorce años, 57,7% de los del grupo tratado obtuvo un título frente a 50,0% del grupo de control.

**Intensidad y costo.** El modelo incluye consejería personalizada, tutoría, exención de arancel, textos y transporte. En el primer año los estudiantes se reunieron con un tutor unas 24 veces en promedio. CUNY gastó 9.162 dólares adicionales por título obtenido respecto del grupo de control.

**Decisión: fuera de alcance.** La plataforma no puede entregar apoyo financiero ni 24 sesiones de tutoría por estudiante. Se documenta como el techo de referencia contra el cual medir cualquier promesa que hagamos, no como algo a replicar.

### 2. Ayuda financiera — evidencia ALTA

**Qué es.** Becas y ayudas no reembolsables que reducen el costo que enfrenta el estudiante.

**Evidencia.** Un metaanálisis de 43 estudios causales con 75 estimaciones concluye que la ayuda tipo beca aumenta la probabilidad de persistencia y titulación entre 2 y 3 puntos porcentuales, y que cada 1.000 dólares adicionales mejora persistencia y titulación entre 1,5 y 2 puntos. Es la base de evidencia más amplia del área: efectos modestos por estudiante, consistentes y a gran escala.

**Decisión: adoptado en forma adyacente.** La plataforma no entrega dinero, pero sí puede evitar que el estudiante **pierda la ayuda que ya le corresponde**. En Chile la gratuidad y las becas se pierden por no renovar a tiempo, no cumplir el avance académico mínimo, no completar el FUAS o desconocer un plazo. Esa es deserción por causa financiera y administrativa, y es terreno directo de la plataforma.

**Implicación de diseño:** el módulo de beneficios, hoy diseñado solo para la etapa "antes", se extiende a la etapa "después": renovación, requisitos de avance académico para mantener el beneficio, alertas de plazo y qué hacer si se perdió. Es la intervención con mayor respaldo que está efectivamente a nuestro alcance, y es desarrollo incremental sobre un módulo que ya existe.

### 3. Intervenciones de pertenencia — evidencia MEDIA, condicionada al contexto

**Qué es.** Un ejercicio breve de lectura y escritura en el que el estudiante lee relatos de pares contando que dudar de si uno pertenece es común y transitorio, y luego escribe sobre su propia experiencia.

**Evidencia a favor.** Una versión personalizada aplicada a 1.063 estudiantes de primer año en una universidad de acceso amplio mejoró la persistencia de estudiantes negros, latinos, indígenas y de primera generación de 76% a 86% al año siguiente, y de 64% a 73% a dos años. El ensayo multisitio, el mayor de su tipo, encontró que el ejercicio en línea aumentó la tasa de finalización del primer año a tiempo completo, sobre todo en grupos históricamente rezagados.

**Condición crítica.** El efecto apareció **solo en instituciones que ya contaban con estrategias y recursos para sostener la pertenencia**. Sin apoyo real detrás, el ejercicio no opera.

**Evidencia en contra.** Una revisión crítica señala que el ensayo multisitio arrojó efecto nulo en una de sus hipótesis primarias preregistradas —que aumentaría la persistencia entre los grupos con menor sentido de pertenencia— y no reporta hallazgos sobre las otras dos hipótesis preespecificadas.

**Decisión: adoptado con la condición explícita.** Se implementa, y se documenta que su efecto depende de que exista derivación real a apoyo institucional. Esto refuerza el rol de puente de la agencia en lugar de contradecirlo.

### 4. Tutoría y mentoría entre pares — evidencia BAJA (asociación), amplia instalación en Chile

**Qué es.** Estudiantes de cursos superiores acompañan a los de primer año en adaptación, estrategias de estudio y nivelación.

**Evidencia.** Es el modelo predominante en Chile: la acción tutorial se concentra en los primeros años bajo el modelo de tutorías entre pares, con foco en adaptación universitaria, estrategias de estudio y nivelación académica. En resultados, se reportan diferencias estadísticamente significativas en rendimiento a favor de quienes participan, y asociación significativa entre participar, aprobar asignaturas clave de primer año y retener al segundo año. En paralelo, los estudiantes que participan en programas de apoyo académico ingresan con mayores desventajas pero igualan sus indicadores de avance curricular y retención respecto del resto.

**Límite metodológico.** Los estudios son observacionales o de caso. Quien busca tutoría ya está más motivado a persistir: la asociación no establece causalidad.

**Decisión: adoptado como derivación, no como construcción propia.** La plataforma identifica qué programa de acompañamiento tiene la institución del estudiante y lo deriva. Nos posiciona como socio de la institución en lugar de competidor, y no exige infraestructura que no tenemos.

### 5. Mensajes y recordatorios automatizados (nudges) — evidencia NEGATIVA a escala

**Qué es.** Mensajes de texto o correos recordando plazos, trámites o recursos disponibles.

**Evidencia.** Los primeros ECA locales mostraron efectos positivos en matrícula. Sin embargo, múltiples estudios experimentales posteriores encontraron que las campañas estatales y nacionales **no replicaron ese impacto** en matrícula ni en persistencia, sin que importara el contenido, el momento, el medio de entrega o la oferta de ayuda individual. Dos ECA a escala no hallaron efecto alguno sobre recepción de ayuda ni matrícula, y el tamaño muestral permitió descartar incluso efectos muy pequeños. Una hipótesis de los autores es que los casos exitosos previos contaban con un socio local con conocimiento y vínculo cercano a los estudiantes tratados.

**Decisión: adoptado con rol redefinido.** El pulso de check-in **no se implementa como intervención**, sino como **sensor**. Su función es construir una serie de tiempo donde hoy no hay ninguna y detectar silencio. La promesa pública correspondiente es "detección por autorreporte y por ausencia de respuesta", nunca "predicción de deserción".

### 6. Foros abiertos y comunidad en línea — SIN EVIDENCIA, riesgo alto

**Qué es.** Espacio de conversación abierta entre estudiantes dentro de la plataforma.

**Evidencia.** No se encontró evidencia que respalde el foro abierto como mecanismo de permanencia en educación superior.

**Riesgos propios identificados:**

1. **Masa crítica.** Un foro con poco volumen se percibe como abandono y daña la confianza más que no tenerlo.
2. **Moderación.** Un espacio abierto sobre carga académica y angustia recibirá mensajes en crisis fuera de horario. Un equipo de tres personas no puede moderar eso, y responderlo mal materializa el riesgo de impacto "muy alto" ya identificado en el plan.
3. **Protección de datos.** Mensajes de usuarios posiblemente menores de edad, con contenido que puede constituir dato sensible bajo la Ley 21.719.

**Decisión: descartado para el MVP.** Se sustituye por **relatos curados**: testimonios breves de estudiantes reales, revisados antes de publicarse, asociados a cada carrera y momento del año. Entrega el mecanismo de pertenencia que sí tiene respaldo sin abrir un canal que no podemos moderar. La conversación abierta queda documentada como fase 2, condicionada a contar con el profesional validador y con volumen suficiente.

## Tabla resumen

| Intervención | Evidencia | Efecto reportado | Decisión |
|---|---|---|---|
| Apoyo integral intensivo (ASAP) | Alta | 16–18 pp en titulación | Fuera de alcance; techo de referencia |
| Ayuda financiera | Alta | 2–3 pp | Adyacente: evitar pérdida de beneficios |
| Pertenencia | Media, condicionada | 2–10 pp según contexto | Adoptado con condición explícita |
| Tutoría entre pares | Baja (asociación) | Sin estimación causal limpia | Derivación, no construcción |
| Nudges / mensajes | Negativa a escala | Nulo | Sensor, no intervención |
| Foros abiertos | Sin evidencia | — | Descartado; relatos curados en su lugar |

## Prioridad resultante para el MVP

1. **Beneficios extendidos a la etapa "después"** — mayor evidencia disponible dentro de nuestro alcance, menor costo de desarrollo (extiende un módulo existente).
2. **Módulo de pertenencia** — relatos curados y ejercicio breve de escritura.
3. **Derivación a tutoría y apoyo institucional** — escalera de respuesta escrita.
4. **Pulso de check-in como sensor** — detección por autorreporte y por silencio.

## Consecuencias para la promesa comercial (cuando el módulo se active)

Esta sección aplica solo si el módulo de permanencia se activa en una etapa futura; hoy no es parte de la oferta a colegios.

No afirmamos "mejoramos la retención": no podemos probarlo y las dos intervenciones de mayor efecto están fuera de nuestro alcance. Afirmamos: **reducimos la deserción por pérdida de beneficios y por desconexión no detectada**. Es verificable contra datos de la propia institución, es defendible ante la comisión de título y no promete efectos que la evidencia no respalda.

## Limitaciones de este anexo

- La mayor parte de la evidencia causal de alta calidad proviene de Estados Unidos. Su transferencia al sistema chileno de educación superior es una suposición razonable, no un hecho demostrado.
- La evidencia chilena disponible es predominantemente observacional o de estudio de caso.
- **Por verificar antes de usar como argumento de venta:** si la Ley 21.091 obliga efectivamente a las instituciones a contar con planes de acompañamiento de primer año. Esta afirmación se encontró en fuentes secundarias y debe confirmarse contra el texto en la Biblioteca del Congreso Nacional.
- **Por obtener:** el último informe de retención del SIES, para establecer la línea base real del sistema chileno.

## Fuentes

**Apoyo integral**
- MDRC. Evaluación de los efectos académicos y económicos de CUNY ASAP y sus réplicas. https://www.mdrc.org/work/projects/evaluating-academic-and-economic-effects-cunys-accelerated-study-associate-programs
- MDRC. Efectos a 14 años de CUNY ASAP. https://www.mdrc.org/work/publications/14-year-effects-cuny-asap-educational-and-labor-market-outcomes
- MDRC. Análisis de costos a ocho años de un ECA de CUNY ASAP. https://www.mdrc.org/work/publications/eight-year-cost-analysis-randomized-controlled-trial-cunys-accelerated-study
- IES. Seguimiento a diez años de los dos ECA del modelo ASAP. https://ies.ed.gov/use-work/awards/ten-year-follow-two-rcts-cunys-asap-model-educational-and-labor-market-outcomes
- EdNC. Componentes del modelo ASAP. https://www.ednc.org/edexplainer-what-is-cuny-asap-the-model-boost-will-replicate-at-15-n-c-community-colleges/

**Ayuda financiera**
- Nguyen, Kramer y Evans (2019). The Effects of Grant Aid on Student Persistence and Degree Attainment. Review of Educational Research. https://journals.sagepub.com/doi/10.3102/0034654319877156

**Pertenencia**
- Ensayo multisitio de la intervención de pertenencia, publicado en Science. https://www.sciencedaily.com/releases/2023/05/230508114026.htm
- Murphy et al., Science Advances: intervención personalizada en universidad de acceso amplio. https://www.psu.edu/news/research/story/intervention-improves-sense-belonging-minoritized-students
- Revisión crítica del ensayo multisitio. https://nospin.evidencebasedpolicy.org/articles/brief-social-belonging-intervention-promote-college-persistence-among-incoming-students

**Tutoría entre pares y acompañamiento en Chile**
- Aproximación al estado de la acción tutorial en universidades chilenas. https://www.redalyc.org/journal/132/13271607007/
- La tutoría entre pares y su incidencia sobre el rendimiento académico (Educare). https://www.redalyc.org/journal/1941/194170643020/html/
- Factores asociados a la deserción/retención y programas de apoyo académico, Universidad de La Frontera. Calidad en la Educación. https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0718-45652013000200003
- CIAE. Revisión de estrategias nacionales de retención de estudiantes en educación superior. https://intranet.ciae.cl/uploads/resources/426/00_1680555735.pdf

**Nudges**
- Castleman. Why Aren't Text Message Interventions Designed to Boost College Success Working at Scale? https://behavioralscientist.org/why-arent-text-message-interventions-designed-to-boost-college-success-working-at-scale/
- Nudging at scale: Experimental evidence from FAFSA completion campaigns. https://www.sciencedirect.com/science/article/abs/pii/S0167268120304819
