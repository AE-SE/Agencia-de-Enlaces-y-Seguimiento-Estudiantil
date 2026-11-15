# Reparto de trabajo hasta el 19 de diciembre

Versión del **13 de noviembre de 2026**, alineada con [`docs/plan.md`](../plan.md), con las Tablas 3.7 (Gantt), 3.8 (RACI) y 3.10 (entregables) del [Entregable Parte I](../entregable/Entregable_Parte_I.md) y con el [ADR 0032](../decisiones/0032-agencia-independiente-y-publico-egresado.md). Reemplaza la versión del 11 de noviembre, hecha para el panel de colegios (ADR 0031, hoy reemplazado). Complementa las guías de [Rafael](guia-rafael.md), [Alejandro](guia-alejandro.md) y [Cristóbal](guia-cristobal.md); en cada una están las tareas con sus criterios de aceptación.

**Qué se entrega el 19 de diciembre:** un sitio gratuito y sin cuenta para toda persona que egresa de 4.º medio y no ha ingresado a la educación superior (alcance nacional), con las comparaciones de cada carrera, meta con tres preferencias y alternativas cercanas, calendario y preguntas frecuentes; y una medición con 10 personas de 18 años o más. Meta global (I-OG): **32 de 40 tareas centrales sin ayuda**. Hasta esa fecha es un proyecto de título sin entidad; la sociedad por acciones (SpA) se constituye en 2027.

## 1. Quién es responsable de qué (RACI, Tabla 3.8)

R: ejecuta; A: aprueba (uno por tarea); C: consultado; I: informado.

| Tarea | Rafael | Alejandro | Cristóbal |
|---|---|---|---|
| Datos oficiales de cada carrera | A | I | R |
| Comparación y explicación de cada cifra | A | R | C |
| Meta, alternativas, pasos y plazos | A/R | R | C |
| Protección de datos personales | A/R | I | I |
| Encuesta, medición de tiempo y entrevistas | A | R | R |
| Informe y presentación | A/R | R | R |

Roles: Rafael, arquitectura, privacidad y criterio de alternativas (líder); Alejandro, interfaz y medición con personas; Cristóbal, datos, contenido e identidad visual. Claude revisa y fusiona con la confirmación del líder.

## 2. Calendario y entregables (`plan.md`, Tablas 3.7 y 3.10)

| Fecha | Tarea | Responsable | Criterio de aceptación |
|---|---|---|---|
| **Vie 13 nov** | Cerrar el PR 96 (fórmula oficial del ranking 2027) | Cristóbal (R), Rafael (A) | Fórmula citada con documento y página |
| **Mar 17 nov** | Entrega del Avance 2 con la idea nueva | Todos | Entregable Parte I |
| **Vie 20 nov** | **N1** empleabilidad al 1.er año y duración real, con la comparación (misma carrera en otras instituciones y su área, «elaboración propia») | Cristóbal | Cada dato con fuente, enlace, fecha y qué mide |
| **Vie 20 nov** | **N3** calendario de admisión 2027 | Cristóbal | Cada fecha con fuente y fecha de vigencia |
| **Vie 20 nov** | **N6** criterio de alternativas cercanas (función pura, con pruebas) | Rafael | Misma área, región y puntaje alcanzable; nunca la condición de cliente |
| **Vie 20 nov** | **N7** texto de «Quiénes somos» | Rafael | Sin siglas sin explicar; sin promesas |
| **Lun 23 nov** | **N2** vacantes, arancel y postulaciones del DEMRE (si se pueden mostrar) | Cristóbal | Verificados con fuente; decisión sobre las postulaciones documentada |
| **Lun 23 nov** | **N8** permiso de los autores de la escala y encuesta en línea publicada | Rafael | Permiso pedido; encuesta con consentimiento en la primera pantalla |
| **Mié 25 nov** | **N4** preguntas frecuentes (10 a 15) | Cristóbal | Cada respuesta con fuente y fecha |
| **Mié 25 nov** | **N9** vista de carrera con el bloque de comparaciones | Alejandro | «Qué mide» junto a cada cifra |
| **Mié 25 nov** | **N11** páginas «Quiénes somos» y «Preguntas frecuentes» | Alejandro | Cada respuesta con fuente y fecha |
| **Jue 26 nov** | **N10** meta con tres preferencias y alternativas cercanas, guardada en el dispositivo | Alejandro | Sin cuenta; criterio a la vista |
| **Vie 27 nov** | **N5** lista fija de pares carrera–institución para la medición | Cristóbal | Pares con los cuatro datos; clave revisada |
| **Vie 27 nov** | **N12** portada con mensaje de agencia | Alejandro | Una sola acción principal |
| **Vie 27 nov** | **N13** protocolo y hoja de registro de la medición | Alejandro | Ensayo hecho; hoja y clave revisadas |
| **Vie 27 nov** | **N14** 10 personas confirmadas para la medición | Rafael, con el equipo | 18 años o más, egresadas en los últimos cinco años |
| **Vie 27 nov** | **Congelamiento de funciones:** desde aquí no entra ninguna función nueva | Todos | Todo lo comprometido en una rama lista para revisión |
| **30 nov al 4 dic** | **N15** medición con 10 personas y 5 entrevistas; cierre de la encuesta | Alejandro y Cristóbal | Registro completo; hallazgos con gravedad entregados el vie 4 dic |
| **Mar 1 dic** | **Todo fusionado a `main` y publicado.** Es el día de cierre de la construcción | Todos (Rafael fusiona) | Ningún PR de función abierto; `main` pasa lint, pruebas y `tokens.py --check` |
| **7 al 11 dic** | Correcciones de la medición (ramas `fix/…`); accesibilidad (360 px, teclado, lector de pantalla); verificación de datos con fuente; revisión de privacidad | Alejandro, Cristóbal y Rafael | Cada hallazgo con estado: corregido, aplazado con motivo o descartado; 100 % de los datos con fuente, enlace y fecha |
| **Mar 15 dic** | **Último PR de código.** Después, solo documentación y textos | Todos | `main` congelado en lo funcional |
| **Mié 16 al jue 17 dic** | Informe de la medición, informe de datos, **N16** informe final y presentación; ensayo | Alejandro, Cristóbal y Rafael | Sin marcas `[COMPLETAR]`; cifras del informe coinciden con la medición y los datos |
| **Vie 18 dic** | Revisión final del líder y publicación del cierre | Rafael | Sitio publicado, demo sin errores |
| **Sáb 19 dic** | Informe final y presentación | Alejandro, Cristóbal y Rafael | Entrega completa |

Siguen su curso las 12 partes de la identidad visual Andén urbano (PR 157 a 168, de Cristóbal): el estilo de metro y estaciones no cambia.

### Qué se hace del 1 al 17 de diciembre, por persona

La ventana sirve para **medir, pulir y probar, no para terminar lo pendiente**: el desarrollo de funciones termina el 27 de noviembre y el 1 de diciembre todo debe estar fusionado. Una *mejora leve* no agrega pantallas, tablas ni dependencias y cabe en un PR de menos de 150 líneas. Lo que no cumpla eso pasa a proyección.

| Persona | Tareas del 1 al 17 de diciembre | Criterio de aceptación |
|---|---|---|
| **Rafael** | Revisión y fusión de todos los PR (martes y viernes); revisión de privacidad (sin datos personales en URL, logs, errores ni analítica; la meta solo en el dispositivo); informe final y presentación (N16) | `main` sin PR de función abiertos; revisión de privacidad con informe corto; informe final sin marcas pendientes |
| **Alejandro** | Medición con personas (N15); corregir los hallazgos; auditoría de accesibilidad (360 px, teclado, lector de pantalla); informe de la medición | Hallazgos graves corregidos; sin barra horizontal a 360 px; foco visible; informe con tareas, resultados y limitaciones |
| **Cristóbal** | Medición con personas (N15); verificación de datos con fuente (muestra y 100 % de los visibles); informe de datos; mejoras leves de la ficha (textos, etiquetas de qué mide cada indicador, año de la medición) | 100 % de los datos mostrados con fuente, enlace y fecha; informe de datos con método, fuentes y datos no disponibles |

## 3. Estado al 13 de noviembre

- **Fusionado:** carga de oferta, empleabilidad y ponderaciones DEMRE 2027; ficha, explorador y comparador; cálculo y validación del Puntaje Ranking (PR 61); simulador de puntaje (commit `abf7e65`, con los ajustes del PR 169); beneficios y calendario (PR 69); portada con entrada a los plazos del FUAS y calendario corregido (PR 141, 142, 146); hoja de decisión (PR 150); guía del FUAS según la situación (PR 152); tokens de Andén urbano (PR 151, 156); reescritura del entregable (PR 155, 170).
- **Abierto:** PR 96 (cita de la fórmula del ranking 2027, de Cristóbal), PR 157 a 168 (identidad visual Andén urbano, de Cristóbal), PR 171 (giro a agencia independiente, documentos) y PR 139 (visibilidad del repositorio).
- **Retirado el 13 de noviembre (ADR 0032):** panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares, cartas y convenios con liceos, fundación.
- **Pendiente y crítico:** los datos de las comparaciones (N1 y N2), las pantallas que los muestran (N9 a N12) y la medición con 10 personas (N14 y N15). Es lo que decide si se llega al 19 de diciembre.

## 4. Qué quedó fuera del alcance, y por qué

Se conserva la historia y se proyecta; no se construye antes del 19 de diciembre (ADR 0032; entregable 3.1).

**Queda diseñado, sin construir en este período:** cuenta con correo ([ADR 0033](../decisiones/0033-cuenta-con-correo-sin-edad.md)), cuestionario de intereses vocacionales, simulación de beneficios, asistente conversacional, noticias de educación superior, tablero público de transparencia e informes de datos.

- **Permanencia en educación superior y pulso de check-in:** exigen profesionales y evidencia que el equipo no tiene (ADR 0010, `docs/evidencia-permanencia.md`).
- **Predicción o riesgo de deserción:** nunca se promete predicción (AGENTS.md 2.4).
- **Informes de datos y asesorías:** hipótesis comercial sin validar; nadie ha encargado uno y el equipo no sale a buscar clientes.
- **Documentos nuevos (ADR, informes):** solo los que cambien una regla de `AGENTS.md` o que pida el entregable.

## 5. Revisión

- Ventanas **martes y viernes**. Un PR abierto antes de esa ventana se revisa en ella. Detalle en [`docs/protocolo-revision-prs-equipo.md`](../protocolo-revision-prs-equipo.md).
- Cada encargo se manda por escrito, con la fecha de cada paso, y se cierra con lo que hay que arreglar antes de la próxima ventana.
- Los PR que solo cambian documentación no corren la CI completa (PR 130 y 140); los que cambian código, sí.

## 6. Cómo saber si funciona

- Ningún PR del equipo espera más de 3 días hábiles sin primera revisión.
- El 27 de noviembre: termina el desarrollo de funciones y 100 % de los datos mostrados con fuente, enlace y fecha. El 1 de diciembre: todo fusionado a `main`. Del 1 al 17: solo medición, correcciones, pruebas, mejoras leves, documentación e informe.
- Del 30 de noviembre al 4 de diciembre: la medición con 10 personas y su registro completo.
- Lo que cada uno aporta queda identificable para el informe de título: datos verificados y cálculos con pruebas (Cristóbal), interfaz, accesibilidad y medición con personas (Alejandro), arquitectura, privacidad y criterio de alternativas (Rafael).
- Si una tarea toma más de lo planeado, se avisa **ese mismo día** en el grupo y se reordena el plan con fechas nuevas y qué sale del alcance.
