# Panel de seguimiento escolar: propuesta para los colegios

Estado: **borrador para revisión del líder (@rafajaque)**. No modifica ningún ADR ni el código. Fecha: 2026-11-11. Extiende el [ADR 0027](decisiones/0027-enfoque-de-transicion-y-plan-colegio.md) y la sección «Qué puede ver y hacer el docente» de [`propuesta-para-liceos.md`](propuesta-para-liceos.md).

Etiquetas de confianza, como en `propuesta-general-agencia.md`: **[Líder]** decisión del líder; **[Repo]** verificado en el repositorio; **[Buscador]** solo se leyó un extracto de buscador, no la fuente; **[Suposición]** inferencia.

## 1. Qué es

Un panel privado para el colegio, centrado en **cumplir las metas vocacionales** de sus estudiantes de 3.º y 4.º medio y construir una buena base para ellas. El estudiante elige una carrera meta, practica con pruebas oficiales y ve su avance. El colegio ve lo que el estudiante comparte o lo que el propio colegio configuró con aviso, y puede **intervenir en persona y a tiempo**.

Ejemplo del foco: si un curso apunta a enfermería, el refuerzo del colegio debería ir a biología y química (las áreas que esa carrera pondera), sin negar que los demás ramos siguen siendo esenciales.

## 2. Alcance decidido [Líder, 2026-11-11]

**Entra en la propuesta:**

1. **Ensayo con la prueba oficial y estimación de puntaje.** El estudiante abre una prueba publicada por DEMRE mediante un enlace al sitio oficial, indica cuántas respuestas acertó y la plataforma estima su Puntaje PAES con la tabla oficial de conversión del clavijero. Se presenta como estimación: un ensayo en casa, sin tiempo, no es la PAES.
2. **Comparación con la meta de carrera.** Con las ponderaciones oficiales de DEMRE y el puntaje de corte del año anterior, muestra qué le falta en cada prueba para llegar a su meta, sin prometer selección.
3. **Resumen para el docente.** Con la autorización del estudiante (botón «Compartir mis puntajes con mi docente»), el docente ve en qué área tuvo cada estudiante qué puntaje y qué requiere su meta.

**Escalabilidad (no entra ahora):** mostrar las preguntas dentro de la plataforma (exige autorización de DEMRE), crear pruebas propias, explicar errores con IA y un chatbot interactivo.

## 3. Cómo funciona

| Pieza | Decisión [Líder] |
|---|---|
| **ID del estudiante** | ID numérico aleatorio al crear la cuenta. La plataforma guarda solo el ID y los datos; **el colegio guarda la tabla ID↔nombre** y nadie del equipo accede a nombres (permisos por rol y cifrado). Sigue siendo dato personal; los derechos del titular se canalizan por el colegio |
| **Autorización de apoderados** | El colegio reparte y recoge el formulario; **la plataforma conserva la prueba** del consentimiento, que debe ser específico por finalidad y revocable. Plantilla redactada por un abogado |
| **Tramo socioeconómico** | Se usa solo en el navegador: el estudiante escribe su tramo (lo informa Mineduc) y ve a qué beneficios podría optar. **No se guarda ni se envía** a nadie |
| **Meta de carrera** | El estudiante la elige al crear su perfil y ve su avance. Por defecto queda solo con él |
| **Foco curricular** | Sí. Se calcula con las ponderaciones de DEMRE de las carreras que eligió el curso. Es una **sugerencia que el colegio decide** |
| **Alertas del docente** | Configurables («sin actividad en N días»). **Transparentes:** se avisa al crear la cuenta y el estudiante ve el mismo estado. Dicen «sin actividad», no «riesgo» |
| **Puntajes individuales** | Los ve el docente solo de quienes los comparten |
| **Psicopedagoga y orientadores** | Reciben derivaciones cuando el estudiante **pide hablar con alguien** y cuando se activa el protocolo de crisis (ADR 0019, con revisión humana). No reciben inferencias sobre salud |
| **Rankings** | Ninguno entre estudiantes ni entre colegios. El Puntaje Ranking de la PAES lo escribe el estudiante, como en el ADR 0024 |
| **Grupos pequeños** | Las cifras agregadas no se muestran bajo un mínimo (propuesto: 10; lo fija el abogado) |
| **Intervención** | Presencial, temprana y con horas protegidas del colegio |

## 4. Lo que no se hace, y por qué

- **Detectar riesgo de TDAH o TDA desde el uso de la app.** Sería dato de salud inferido (la matriz interna lo limita a fines sanitarios, art. 16 bis), es perfilado (art. 8 bis), no hay respaldo de que el uso de una app sirva para eso y daría falsos positivos. La psicopedagoga evalúa con sus propios medios.
- **Seguimiento oculto al estudiante.** El estudiante sabe qué ve su orientador. Lo que el docente no necesita es decir «vi que no usas la app» al acercarse.
- **Etiquetas de vulnerabilidad o riesgo por estudiante**, y rankings entre estudiantes.
- **Aconsejar «sube tu NEM y relájate en la PAES».** El simulador de escenarios muestra los números y la persona concluye.

## 5. Evidencia

Todas las fuentes de esta sección están en estado **[Buscador]**: se verificó su existencia y lo central en extractos, no el texto completo.

- **Tutoría y aprendizaje:** [Nickow, Oreopoulos y Quan](https://www.nber.org/papers/w27476): 96 ensayos aleatorios en la versión de 2020, efecto de 0,37 desviaciones estándar; la [versión publicada en 2024](https://nssa.stanford.edu/studies/promise-tutoring-prek-12-learning-systematic-review-and-metaanalysis-experimental-evidence) da 0,288. Los efectos son mayores con docentes o paraprofesionales, en horario escolar y al menos tres días por semana. Apoya la tutoría académica estructurada, no cualquier contacto.
- **Ayuda con trámites:** Bettinger et al. (2012) y el ensayo chileno de 229 liceos (CEP/LSE, 2026) muestran efectos en **postulación y matrícula**, no en aprendizaje. Hay que leer el segundo en el original antes de citarlo.
- **Alertas tempranas:** [Bowers, Sprott y Taff (2013)](https://academiccommons.columbia.edu/doi/10.7916/D86W9N4X) revisa la precisión de los indicadores de abandono. Una cifra de «más de 50 % de falsos positivos» atribuida a esa revisión no se pudo confirmar.
- **Rankings dentro del curso:** [Murphy y Weinhardt (2020)](https://www.nber.org/papers/w24958): la posición ordinal en primaria afecta los puntajes y el autoconcepto años después, aunque el ranking no sea público.
- **Chatbots:** el ensayo de Georgia State con unos 7.500 admitidos muestra menos abandono entre admisión y matrícula (en torno a un 21 % según [reportes secundarios](https://www.ecampusnews.com/campus-leadership/2017/03/09/gsu-summer-melt-enrollment/)). Son recordatorios de trámites, en Estados Unidos y con interés comercial del proveedor. No sustenta que un chatbot suba el aprendizaje.
- **Pruebas de DEMRE:** [publica las pruebas de años anteriores](https://portaldemre.demre.cl/publicaciones/pdf/2025-24-12-03-paes-regular-competencia-lectora-p2025.pdf) y los [clavijeros con la tabla de conversión](https://portaldemre.demre.cl/publicaciones/pdf/2026-26-01-05-clavijero-paes-regular-competencia-lectora.pdf). Los PDF declaran «Universidad de Chile, derechos reservados, prohibida su reproducción total o parcial».

## 6. Segunda opinión

Antigravity opinó sobre 13 ideas (ver el apartado de síntesis en la conversación del 11 de noviembre). Sus mejoras adoptadas aquí: tramo calculado solo en el navegador, aviso primero al estudiante, puntajes visibles solo si el estudiante los comparte, y horas protegidas de intervención. **Codex no pudo responder** por su límite de uso hasta el 12 de noviembre a las 00:58; queda pendiente repetir la consulta.

## 7. Qué falta antes de construir

1. **Consulta a DEMRE:** si se pueden enlazar y usar las pruebas publicadas en una plataforma gratuita; si se pueden usar los clavijeros y las tablas de conversión para estimar puntajes; y qué condiciones habría para mostrar preguntas dentro de la plataforma.
2. **Abogado, antes del 1 de diciembre de 2026.** Preguntas concretas:
   - Con un ID cuya llave guarda solo el colegio, ¿es la plataforma responsable o encargada del tratamiento de datos de menores?
   - ¿Es válido que el colegio recoja en papel los consentimientos de los tutores, o la plataforma debe registrar una confirmación verificable de cada uno?
   - ¿Procesar en el navegador, sin guardar, el tramo socioeconómico y las notas constituye tratamiento sujeto a consentimiento y evaluación de impacto?
   - ¿Qué mínimo de grupo basta para mostrar un agregado?
3. **Protocolo de intervención humana del colegio:** cuántas horas protegidas tendrán orientadores y psicopedagogos y quién atiende cada solicitud. Es lo más importante que falta definir.
4. Confirmar que las ponderaciones de DEMRE (`requisito_admision`) están cargadas en producción.
5. Un ADR que registre esta propuesta; número por asignar (el 0028 a 0030 están tomados por propuestas abiertas).
