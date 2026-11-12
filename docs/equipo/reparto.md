# Reparto de trabajo hasta el 19 de diciembre

Versión del **11 de noviembre de 2026**, alineada con las Tablas 3.7 (Gantt), 3.8 (RACI) y 3.10 (entregables) del [Entregable Parte I](../entregable/Entregable_Parte_I.md) y con el [ADR 0031](../decisiones/0031-producto-y-organizacion.md). Reemplaza la propuesta del 5 de noviembre (meta de la ficha el 16 de noviembre, cumplida en lo central). Complementa las guías de [Rafael](guia-rafael.md), [Alejandro](guia-alejandro.md) y [Cristóbal](guia-cristobal.md); en cada una están las tareas con sus criterios de aceptación.

**Qué se entrega el 19 de diciembre:** un sitio gratuito para estudiantes de 3.º y 4.º medio de liceos con financiamiento público (O'Higgins, Colchagua) y un panel interactivo de seguimiento para colegios con datos ficticios, validados con 5 estudiantes y 2 profesionales de colegios. Meta global (I-OG): **16 de 20 tareas centrales sin ayuda**.

## 1. Quién es responsable de qué (RACI, Tabla 3.8)

R: ejecuta; A: aprueba (uno por tarea); C: consultado; I: informado.

| Tarea | Rafael | Alejandro | Cristóbal |
|---|---|---|---|
| Datos oficiales y ficha de carrera (OE1) | A | I | R |
| Guía de trámites y calendario del FUAS (OE2) | A | R | C |
| Panel de seguimiento y consentimientos (OE3) | A/R | R | I |
| Pruebas con estudiantes y profesionales | A | R | R |
| Informe y presentación | A/R | R | R |

Roles: Rafael, arquitectura y privacidad (líder); Alejandro, interfaz; Cristóbal, datos y contenido. Claude revisa y fusiona con la confirmación del líder.

## 2. Calendario (Gantt, Tabla 3.7) y entregables (Tabla 3.10)

| Fecha | Entrega | Responsable | Criterio de aceptación |
|---|---|---|---|
| **Lun 16 nov** | Cierre de F1: ficha con fuente, enlace y fecha en un teléfono | Cristóbal (R), Rafael (A) | Se abre en teléfono y muestra fuente, enlace y fecha |
| **Lun 23 nov** | **OE1:** ficha con requisitos, puntaje, arancel y beneficio aplicable; cálculo del puntaje ponderado; I-OE1a = 100 % | Cristóbal | Casos verificados contra la fuente oficial, todos aprobados |
| **Lun 23 nov** | Carta a colegios enviada y 7 participantes confirmados | Rafael | Invitar a más de los necesarios |
| **24 al 30 nov** | **Prueba de uso** con 5 estudiantes y 2 profesionales | Alejandro y Cristóbal | 16 de 20 tareas sin ayuda; 2 de 2 profesionales identifican a quién apoyar |
| **Vie 27 nov** | **OE2:** guía de trámites y calendario del FUAS | Alejandro (R), Cristóbal (C) | Cada hito con fuente y fecha de vigencia |
| **Vie 27 nov** | **OE3:** panel con datos ficticios; consentimiento y aislamiento con pruebas aprobadas | Rafael y Alejandro | El colegio pierde el acceso al revocar |
| **Vie 27 nov** | **Congelamiento de funciones:** termina el desarrollo; desde aquí no entra ninguna función nueva | Todos | Todo lo comprometido en una rama lista para revisión |
| **Lun 30 nov** | Termina la prueba de uso; cada hallazgo con gravedad y arreglo propuesto | Alejandro y Cristóbal | Lista de hallazgos entregada a Rafael |
| **Mar 1 dic** | **Todo fusionado a `main` y publicado.** Es el día de cierre de la construcción | Todos (Rafael fusiona) | Ningún PR de función abierto; `main` pasa lint, pruebas y `tokens.py --check` |
| **Vie 4 dic** | Correcciones de la prueba de uso (ramas `fix/…`); lo que no se corrige queda aplazado con motivo | Alejandro (interfaz), Cristóbal (datos) | Todo hallazgo grave corregido; el resto con estado y motivo |
| **Vie 11 dic** | Pruebas: accesibilidad, consentimiento y aislamiento, verificación de datos; mejoras leves | Alejandro, Rafael, Cristóbal | Pruebas automáticas 100 % aprobadas; 100 % de los datos con fuente, enlace y fecha; auditoría sin fallas AA graves |
| **Mar 15 dic** | **Último PR de código.** Después, solo documentación y textos | Todos | `main` congelado en lo funcional |
| **Mié 16 al jue 17 dic** | Informe de la prueba, informe de datos, informe final y ensayo de la presentación | Alejandro, Cristóbal y Rafael | Sin marcas `[COMPLETAR]`; cifras del informe coinciden con la prueba y los datos |
| **Vie 18 dic** | Revisión final del líder y publicación del cierre | Rafael | Sitio publicado, demo sin errores |
| **Sáb 19 dic** | Informe de la prueba, informe final y presentación | Alejandro, Cristóbal y Rafael | Entrega completa |

### Qué se hace del 1 al 17 de diciembre, por persona

La ventana sirve para **pulir y probar, no para terminar lo pendiente**: el desarrollo de funciones termina el 27 de noviembre y el 1 de diciembre todo debe estar fusionado. Una *mejora leve* no agrega pantallas, tablas ni dependencias, cabe en un PR de menos de 150 líneas y no toca consentimiento ni aislamiento. Lo que no cumpla eso pasa a proyección.

| Persona | Tareas del 1 al 17 de diciembre | Criterio de aceptación |
|---|---|---|
| **Rafael** | Revisión y fusión de todos los PR (martes y viernes); revisión de privacidad (datos mínimos, menores, ausencia de datos personales en URL, logs y analítica); verificar el panel con datos ficticios, la revocación y el aislamiento entre colegios; informe final | Pruebas de consentimiento y aislamiento 100 % aprobadas; revocar quita el acceso al colegio; informe final sin marcas pendientes |
| **Alejandro** | Corregir los hallazgos de la prueba de uso; auditoría de accesibilidad (360 px, teclado, lector de pantalla); pulido de interfaz con los tokens existentes; informe de la prueba | Sin barra horizontal a 360 px; foco visible; hallazgos graves corregidos; informe con tareas, resultados y limitaciones |
| **Cristóbal** | Verificación de datos con fuente (muestra y 100 % de los visibles); informe de datos; mejoras leves de la ficha (textos, etiquetas de qué mide cada indicador, año de la medición) | 100 % de los datos mostrados con fuente, enlace y fecha; informe de datos con método, fuentes y datos no disponibles |

## 3. Estado al 11 de noviembre

- **Fusionado:** carga de oferta, empleabilidad y ponderaciones DEMRE 2027; ficha, explorador y comparador; cálculo y validación del Puntaje Ranking (PR 61); beneficios y calendario (PR 69); portada con entrada a los plazos del FUAS y calendario corregido (PR 141, 142, 146); hoja de decisión (PR 150); guía del FUAS según la situación (PR 152); tokens de Andén urbano (PR 151).
- **Abierto:** PR 132 (simulador de puntaje, de Alejandro, con la CI en verde y esperando revisión), PR 96 (cita de la fórmula del ranking 2027, de Cristóbal), PR 153 (propuesta del panel), PR 155 (reescritura del entregable), PR 149 (bitácora), PR 139 y 140 (repositorio público y CI).
- **Pendiente y crítico:** el panel de seguimiento (interfaz, meta de carrera, resumen para el docente), el consentimiento en la interfaz, sus pruebas automáticas y la prueba de uso. Es lo que decide si se llega al 19 de diciembre.

## 4. Qué quedó fuera del alcance, y por qué

Se conserva la historia y se proyecta; no se construye antes del 19 de diciembre (entregable 3.1; ADR 0031):

- **Permanencia en educación superior y pulso de check-in:** exigen profesionales y evidencia que el equipo no tiene (ADR 0010, `docs/evidencia-permanencia.md`).
- **Predicción o riesgo de deserción:** nunca se promete predicción (AGENTS.md 2.4).
- **Panel para instituciones de educación superior:** el cliente es el colegio o sostenedor.
- **Pruebas propias de ensayo por colegio:** hoy solo se enlaza una prueba oficial publicada.
- **Portal de transparencia del pronóstico:** idea acordada, por diseñar.
- **Asistente IA en pantalla:** existe el endpoint y el protocolo de crisis, pero no está entre los entregables de la Tabla 3.10.
- **Documentos nuevos (ADR, informes):** solo los que cambien una regla de `AGENTS.md` o que pida el entregable.

## 5. Revisión

- Ventanas **martes y viernes**. Un PR abierto antes de esa ventana se revisa en ella. Detalle en [`docs/protocolo-revision-prs-equipo.md`](../protocolo-revision-prs-equipo.md).
- Cada encargo se manda por escrito, con la fecha de cada paso, y se cierra con lo que hay que arreglar antes de la próxima ventana.
- Los PR que solo cambian documentación no corren la CI completa (PR 130); los que cambian código, sí.

## 6. Cómo saber si funciona

- Ningún PR del equipo espera más de 3 días hábiles sin primera revisión.
- El 23 de noviembre: 100 % de los datos mostrados con fuente, enlace y fecha.
- El 24 de noviembre: todo lo que se prueba está fusionado y publicado.
- El 27 de noviembre: termina el desarrollo de funciones. El 1 de diciembre: todo fusionado a `main`. Del 1 al 17: solo correcciones, pruebas, mejoras leves, documentación e informe.
- Lo que cada uno aporta queda identificable para el informe de título: datos verificados y cálculos con pruebas (Cristóbal), interfaz, accesibilidad y pruebas de uso (Alejandro), arquitectura, privacidad y consentimiento (Rafael).
- Si una tarea toma más de lo planeado, se avisa **ese mismo día** en el grupo y se reordena el plan con fechas nuevas y qué sale del alcance.
