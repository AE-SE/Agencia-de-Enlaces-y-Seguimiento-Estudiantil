# Guía de Alejandro · Interfaz y medición con personas

> **Para la IA que acompaña a Alejandro:** este documento es tu hoja de ruta hasta el entregable del **19 de diciembre de 2026**. Antes de proponer cualquier cosa, lee `AGENTS.md`, `docs/equipo/README.md`, [`docs/plan.md`](../plan.md), `docs/diseno.md` (base visual **Andén urbano**, ADR 0029) y la skill indicada en cada tarea. Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`. Si una tarea te pide inventar un dato, un color o una medida, detente y pregunta.

Estado verificado el **13 de noviembre de 2026** con `gh pr list` (solo lectura).

> **Giro del 13 de noviembre (ADR 0032).** Ya no hay panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares ni piloto en liceos. Ahora el sitio es para toda persona que egresa de 4.º medio y no ha ingresado a la educación superior: gratis, sin cuenta y con la meta guardada en el dispositivo. Lo que ya construiste (ficha, explorador, comparador, simulador, hoja de decisión, guía del FUAS) **sigue valiendo**. Las tareas A10 y A12 quedan retiradas; abajo están las nuevas (N9 a N13 y N15).

---

## 1. Qué se entrega y qué te toca

El producto del 19 de diciembre (ADR 0032, Entregable Parte I): un sitio gratuito y sin cuenta que reúne los datos oficiales de cada carrera y los deja comparables, más una **medición con 10 personas de 18 años o más** entre el 30 de noviembre y el 4 de diciembre. Tu rol es **interfaz y medición**: todo lo que la persona ve y toca, en cualquier teléfono y con cualquier conexión, y aplicar la medición.

Según la Matriz RACI (Tabla 3.8) y los entregables (Tabla 3.10), tú eres:

| Tarea | Tu papel | Entregable y criterio de aceptación | Fecha |
|---|---|---|---|
| Comparación y explicación de cada cifra | **R** (Rafael aprueba; Cristóbal, consultado) | Comparación de hasta 3 carreras y bloque de comparaciones; cada indicador con fuente y fecha; no se comparan indicadores distintos entre sí | 25 nov |
| Meta, alternativas, pasos y plazos | **R** (con Rafael) | Meta con tres preferencias y alternativas cercanas; el criterio es explícito y no depende de ningún cliente; se guarda en el dispositivo, sin cuenta | 26 nov |
| Encuesta, medición de tiempo y entrevistas | **R** (con Cristóbal) | Registro de la medición: tiempos, tareas, respuestas y limitaciones | 4 dic |
| Informe y presentación | **R** (con Cristóbal; Rafael aprueba) | Entrega completa | 19 dic |
| Indicadores I-OG, I-OE1b, I-OE2, I-OE3a (Anexo 3.A) | Responsable | 32 de 40 tareas sin ayuda; 8 de 10 identifican los cuatro datos y explican la empleabilidad; reducción de la mediana del tiempo de 50 % o más; 8 de 10 identifican su próximo plazo y una alternativa | 4 dic |

**No te toca** (pídeselo a quien corresponde): datos oficiales, fórmulas y textos finales → Cristóbal. El criterio de alternativas cercanas, el texto de «Quiénes somos», la encuesta y las claves → Rafael. Las fórmulas de puntaje las usas, no las escribes.

---

## 2. Tu hoja de ruta, semana por semana

| Semana | Qué entregas | Criterio de aceptación |
|---|---|---|
| **S2 (10 al 16 nov)** | Probar la ficha, el comparador, el simulador, la hoja y la guía del FUAS a 360 px, con teclado y lector de pantalla (primera pasada de A13) | Lista de fallos por gravedad entregada a Rafael (lunes 16) |
| **S3 (17 al 23 nov)** | Portada (N12) en borrador; hoja de registro de la medición (N13) en borrador; empiezas N9 cuando llegan los datos de Cristóbal | Portada y hoja abiertas como PR en borrador el viernes 20 |
| **S4 (24 al 27 nov)** | **N9** (mié 25), **N11** (mié 25), **N10** (jue 26), **N12** y **N13** (vie 27) | Cada tarea con sus criterios (sección 4). **Vie 27 nov: congelamiento de funciones** |
| **S5 (30 nov al 4 dic)** | **N15:** aplicar la medición con Cristóbal. **Mar 1 dic: todo fusionado a `main`** | Registro completo; hallazgos con gravedad entregados a Rafael el vie 4 dic |
| **S6 (7 al 11 dic)** | Corregir los hallazgos con ramas `fix/…` (los graves primero); auditoría de accesibilidad final (A13) | Cada hallazgo con estado; `docs/auditoria-accesibilidad.md` con 0 fallas AA graves el vie 11 dic |
| **S7 (14 al 17 dic)** | Informe de la medición con Cristóbal; ensayo de la presentación. Último PR de código el mar 15 dic | Informe sin marcas `[COMPLETAR]` el mié 16 dic |
| **Cierre (18 y 19 dic)** | Presentación | Entrega el 19 de diciembre |

**Cómo se usa la ventana del 1 al 17 de diciembre:** el desarrollo de funciones termina el 27 de noviembre y el 1 de diciembre todo debe estar en `main`. Esas semanas son para medir, pulir y probar, no para terminar lo pendiente. Una mejora leve no agrega pantallas, tablas ni dependencias y cabe en un PR de menos de 150 líneas; si necesita más, pasa a proyección. Revisiones de PR: martes 1, 8 y 15 y viernes 4 y 11 de diciembre (y martes 24 y viernes 27 de noviembre).

### Tu ritmo día por día, semana del 16 y semana del 23 de noviembre

Cada día tiene una cosa principal y una entrega concreta. Si algo toma más de lo pensado, avisa **ese mismo día** en el grupo; se reordena sin problema.

| Día | Qué toca hoy | Qué entregas hoy |
|---|---|---|
| **Lun 16 nov** | Recorrer lo que ya existe en el sitio publicado: ficha, comparador, simulador, hoja y guía del FUAS, a 360 px, con teclado y lector de pantalla | Lista de fallos por gravedad (pantalla, qué pasó, gravedad) enviada a Rafael |
| **Mar 17 nov** | Mirar el PR 159 de Cristóbal (portada) y la portada actual; leer N12 y anotar qué mensaje de agencia falta | Una nota de dos líneas en el grupo: qué cambiarías en la portada y qué no |
| **Mié 18 nov** | Escribir el borrador del mensaje de la portada con Rafael (sin afirmar nada que no esté medido) | Borrador de la portada en una rama `feat/portada-agencia`, sin abrir PR todavía |
| **Jue 19 nov** | Copiar las tablas de [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md) a una hoja de registro que se pueda imprimir y llenar a mano (N13); probar el cronómetro del teléfono | Hoja de registro en borrador y la clave de respuestas con su plantilla |
| **Vie 20 nov** | Llegan los datos de Cristóbal (N1, N3) y el criterio de Rafael (N6). Leer el formato de los datos de N1; abrir en borrador el PR de la portada | PR de la portada en borrador; PR de la hoja de registro en borrador |
| **Lun 23 nov** | Llegan vacantes y arancel (N2). Empezar N9: crear la rama `feat/comparaciones-carrera` y armar el bloque con las cifras de N1 y N2 | Bloque de comparaciones mostrando una carrera real, aunque falten estilos |
| **Mar 24 nov** | Seguir con N9: «qué mide» junto a cada cifra y rótulo «elaboración propia»; revisión de PR del martes | PR de N9 abierto para la revisión del martes (puede ir en borrador) |
| **Mié 25 nov** | Cerrar N9; llega N4 (preguntas frecuentes): construir las dos páginas de N11 | N9 y N11 listos para revisión |
| **Jue 26 nov** | N10: meta con tres preferencias y alternativas cercanas, usando la función de N6; guardar en el dispositivo | N10 listo para revisión, con las capturas |
| **Vie 27 nov** | Llega N5 (lista fija de pares): poner los pares reales en la hoja de registro; cerrar la portada (N12). Revisión de PR del viernes. **Congelamiento de funciones** | N12 y N13 listos; ensayo de la medición hecho con una persona que no participará |

La semana del 30 de noviembre empieza la medición: la tabla de N15 en la sección 4 tiene su día a día.

---

## 3. Estado de tus tareas (según los PR)

| Tarea | Estado | Referencia |
|---|---|---|
| A1 a A4 · Proyecto Next.js como PWA, tipografías, componentes base y despliegue en Cloudflare | **Hechas y fusionadas** (histórico) | PR 15, 28, 32, 49, 52 |
| A5 · Ficha de carrera, A6 · Explorador | Fusionadas; rediseñadas con el líder (explorador más ancho, resultados primero, consulta por región y comuna) | PR 35, 36, 104 a 110, 116 a 118, 128 |
| A7 · Comparador | **Fusionado** | PR 57, 67, 68 |
| A11 · Beneficios y calendario | **Fusionado** | PR 69 |
| Hoja de decisión y guía del FUAS según la situación | Fusionadas (las hizo el líder con Claude; tú las revisas a 360 px) | PR 150, 152 |
| **A8 · Simulador de puntaje (pantallas)** | **Fusionado** (el PR 132 se cerró sin fusionar; el simulador entró con el commit `abf7e65` y sus ajustes con el PR 169, tuyo) | PR 169 |
| A9 · Pantalla del asistente | **Fuera del alcance del entregable.** El asistente queda diseñado; no la empieces | — |
| A10 · Consentimientos (T4 antiguo) | **Retirada el 13-nov: ADR 0032 y 0033.** Ya no hay consentimiento para compartir con el colegio ni tutor | — |
| A12 · Panel de seguimiento (pantallas) | **Retirada el 13-nov: ADR 0032.** Ya no hay panel para colegios | — |
| A13 · Auditoría de accesibilidad | Pendiente (primera pasada el lunes 16; final del 7 al 11 dic) | — |
| A14 · Prueba de uso | **Reemplazada por N13 y N15** (medición con 10 personas) | [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md) |
| N9 a N13, N15 | **Nuevas** (sección 4) | [`docs/plan.md`](../plan.md) |

**Próximos pasos, en orden:**
1. Prueba lo que ya está en el sitio publicado y pásale la lista de fallos a Rafael (lunes 16).
2. Adelanta N12 y N13, que no dependen de datos nuevos.
3. Empieza N9, N10 y N11 cuando lleguen los datos y los textos (viernes 20 al miércoles 25).

---

## 4. Tareas con criterios de aceptación

### N9 · Vista de carrera: bloque de comparaciones (mié 25 nov)
**Skills:** `mapa-de-trayecto`, `lenguaje-claro`, `datos-oficiales` · **Depende de:** N1 (vie 20) y N2 (lun 23), de Cristóbal · **Rama:** `feat/comparaciones-carrera`

1. Lee el formato de los datos que dejan N1 (empleabilidad al 1.er año, duración formal y real, comparación con la misma carrera en otras instituciones y con su área) y N2 (vacantes y arancel).
2. Revisa cómo está hoy la vista de carrera (`app/(portal)/carreras/[institucion]/[carrera]/page.tsx`) y qué componentes existen en `app/_componentes`.
3. Agrega un bloque «Comparaciones» con cuatro partes: empleabilidad frente a la misma carrera en otras instituciones (mínimo, mediana y máximo) y frente a su área; duración formal frente a duración real; vacantes; arancel.
4. Junto a cada cifra escribe **qué mide** (por ejemplo, «porcentaje de titulados que ganaron el sueldo mínimo o más en el primer año») y el año de la medición.
5. Cada cifra muestra fuente, enlace y fecha con el componente `DatoOficial`.
6. Toda cifra que calculó el equipo lleva el rótulo «elaboración propia» y una línea de cómo se calculó; nunca se presenta como dato del organismo.
7. Si falta un dato, muestra «Sin datos suficientes» con su motivo. Nunca un 0.
8. No mezcles indicadores ni períodos distintos en una misma comparación; si hay que advertirlo, advierte.
9. Prueba a 360 px, con teclado y en modo oscuro.

- [ ] El bloque se abre en un teléfono con una carrera real.
- [ ] Cada dato muestra fuente, enlace, fecha y qué mide.
- [ ] Las cifras calculadas por el equipo dicen «elaboración propia».
- [ ] El orden de las instituciones nunca favorece a una por ser cliente.

### N10 · Meta con tres preferencias y alternativas cercanas (jue 26 nov)
**Skills:** `mapa-de-trayecto`, `lenguaje-claro` · **Depende de:** N6 (Rafael, vie 20) · **Rama:** `feat/meta-y-alternativas`

1. Desde la vista de carrera, agrega el botón «Fijar esta carrera como mi meta».
2. Permite guardar hasta tres preferencias, en orden, y cambiarlas o quitarlas.
3. Guarda todo **solo en el dispositivo** (almacenamiento local), con manejo de errores si el navegador lo bloquea. No hay cuenta, no se envía nada al servidor y no se usa analítica sobre estos datos.
4. Muestra las alternativas cercanas con la función de N6 y escribe el criterio a la vista, con las palabras de Rafael («misma área, región y puntaje alcanzable»). Nunca se ordena por ser cliente.
5. Muestra el próximo plazo del calendario ya existente que corresponde a la meta (el calendario es la tarea N3 de Cristóbal); no construyas un calendario nuevo.
6. Agrega «Borrar mis datos de este dispositivo», siempre visible, con efecto inmediato.
7. Avisa con un texto claro que la meta se guarda solo en este dispositivo y se pierde si se limpian los datos del navegador.

- [ ] La persona fija una meta y tres preferencias sin crear cuenta y los ve al volver.
- [ ] Ve al menos una alternativa a su primera opción y el criterio por el que se eligió.
- [ ] Borrar los datos funciona y se verifica.
- [ ] 360 px, teclado y lector de pantalla.

### N11 · Páginas «Quiénes somos» y «Preguntas frecuentes» (mié 25 nov)
**Skills:** `mapa-de-trayecto`, `lenguaje-claro` · **Depende de:** N4 (Cristóbal, mié 25) y N7 (Rafael, vie 20)

1. El texto de «Quiénes somos» llega el viernes 20 con Rafael. Construye esa página primero, con los componentes que existen.
2. Prepara la página de preguntas con la estructura final y un par de preguntas de ejemplo claramente marcadas; el miércoles 25 llegan las 10 a 15 preguntas de Cristóbal.
3. Cada respuesta muestra su fuente y fecha con `DatoOficial`.
4. Enlaza las dos páginas desde el pie común.
5. Encabezados reales (`h1`, `h2`), orden lógico y botones con verbo y resultado.

- [ ] Las dos páginas se abren en un teléfono y se recorren con teclado.
- [ ] Ninguna respuesta sin fuente y fecha.
- [ ] Ningún texto promete resultados ni predicción.

### N12 · Portada: mensaje de agencia y entrada al recorrido (vie 27 nov)
**Skills:** `mapa-de-trayecto`, `lenguaje-claro` · **Rama:** `feat/portada-agencia`

1. Antes de empezar, mira el PR 159 de Cristóbal (portada Andén urbano): tu cambio parte de lo que ese PR deje en `main`, para no duplicar trabajo.
2. Escribe el mensaje de agencia con Rafael: qué es, para quién, que es gratis y sin cuenta.
3. Deja **una sola acción principal (coral)**: la entrada al recorrido (buscar una carrera). La excepción de la sección de beneficios con fondo coral está en el ADR 0029.
4. No afirmes cifras de tiempo ni de resultados que aún no se midieron: «nada se afirma antes de medirlo».
5. Conserva el acceso a los plazos del FUAS de la portada actual.
6. **Cambio ya hecho por Claude (PR 188, fusionado el 14 de noviembre):** la portada tiene un enlace secundario, «Ver ocupaciones afines a tus intereses», a `/ocupaciones`, debajo del enlace del FUAS. Es secundario a propósito: «Explorar carreras» sigue siendo la única acción coral. Revisa el texto del enlace y si te parece bien su lugar.

- [ ] Una sola acción principal por pantalla.
- [ ] Todo texto con cifra trae su fuente y fecha.
- [ ] 360 px, teclado y modo oscuro.

### N13 · Protocolo y hoja de registro de la medición (vie 27 nov)
**Skills:** `lenguaje-claro` · **Depende de:** N5 (lista fija de pares, de Cristóbal, vie 27)

El protocolo ya está escrito en [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md). Tu parte es dejarlo listo para usar.
1. Lee el protocolo completo.
2. Arma la **hoja de registro** (en papel o digital) con las Tablas A y B del documento; que no tenga ningún campo de nombre ni contacto.
3. Con Cristóbal, escribe la **clave de respuestas** de cada par: los cuatro datos con su fuente, y pídele a otra persona que la revise.
4. Cuando llegue N5, anota los dos pares (A y B) y la rotación de las 10 personas.
5. Prepara el consentimiento (el texto está en el protocolo) para que Rafael lo apruebe.
6. Haz un **ensayo** con una persona que no participará; mide con cronómetro y anota qué cambiarías.
7. Anota la dirección y el commit de la versión que se probará.

- [ ] Hoja de registro y clave de respuestas listas y revisadas por otra persona.
- [ ] Consentimiento aprobado por Rafael.
- [ ] Ensayo hecho y ajustes anotados.

### N15 · Aplicar la medición y las 5 entrevistas (30 nov al 4 dic)
**Skills:** `lenguaje-claro` · **Depende de:** N13 y N14 · **Con:** Cristóbal

Una persona conduce y la otra anota. El día a día sugerido (se ajusta a las personas confirmadas por Rafael):

| Día | Qué toca | Qué entregas |
|---|---|---|
| **Lun 30 nov** | Primeras sesiones; anotar el commit de la versión probada | Registro de cada sesión del día, el mismo día |
| **Mar 1 dic** | Sesiones del día; revisión de PR del martes (todo se fusiona hoy) | Registro del día; confirmar con Rafael que `main` quedó publicado |
| **Mié 2 dic** | Sesiones y entrevistas | Registro del día |
| **Jue 3 dic** | Sesiones y entrevistas; calcular los indicadores con lo que haya | Tablas del informe con lo parcial |
| **Vie 4 dic** | Última sesión; hallazgos ordenados por gravedad y arreglo propuesto | Lista de hallazgos entregada a Rafael, sin datos identificables |

Las entrevistas (5) usan el guion del Anexo 2.B del entregable, con su propio consentimiento y, solo si la persona lo autoriza, audio.

- [ ] 10 personas (o plan B declarado, con un mínimo de 6) con las dos tareas cronometradas y las cuatro tareas centrales registradas.
- [ ] Nada que identifique a alguien en el repositorio ni en una IA externa.
- [ ] Cada hallazgo con pantalla, tarea, gravedad y arreglo propuesto.
- [ ] Si aparece una señal de riesgo, se aplicó el protocolo de [`pruebas-usuarios.md`](../pruebas-usuarios.md) y se avisó a Rafael el mismo día.

### N19 · Explorador de ocupaciones: revisión de la pantalla (vie 27 nov)
**Nueva el 14 de noviembre; no está en tu hoja de ruta de arriba.** · **Skills:** `mapa-de-trayecto`, `lenguaje-claro` · **Página:** `app/(portal)/ocupaciones/` (ya en `main`: PR 185 y 186)

La página `/ocupaciones` permite elegir hasta tres áreas de interés y muestra ocupaciones de O*NET cercanas, con el área de carreras relacionada y el número de carreras distintas de esa área. Claude la construyó; ahora te toca revisarla:

1. **Textos de las seis áreas** (`TEXTO_AREA` en `page.tsx`): son elaboración propia, no textos de O*NET. Revisa que se lean en lenguaje claro y sin sonar a test.
2. **Lector de pantalla real** (TalkBack o VoiceOver): hasta hoy solo se revisó la estructura y axe. Escucha la página con las tres áreas elegidas y sin ninguna.
3. **Teclado y zoom al 200 %:** Claude ya los probó; vuelve a probarlos antes del 27 de noviembre, sobre `main`.
4. **Pie de página:** debe decir que el cruce con carreras es elaboración propia y mostrar la fuente con fecha.
5. **Reglas que no se pueden romper:** nunca presentarla como test ni diagnóstico; una sola acción coral (el botón «Ver ocupaciones afines» es el único de la página); no guardar nada de quien la usa.

- [ ] Textos revisados en lenguaje claro.
- [ ] Lector de pantalla probado y anotado.
- [ ] Teclado y 200 % probados sobre `main`.
- [ ] Pie con fuente, fecha y «elaboración propia».

### A8 · Simulador de puntaje (pantallas) · histórico
Fusionado (PR 169). Reglas que siguen vigentes: mensaje «El año pasado el último matriculado tuvo X. Con tus puntajes simulados tendrías Y.» (nunca «quedas» o «no quedas»); si no se ha rendido la prueba, avisa que es estimación; rangos válidos y errores que dicen cómo corregir; **nada se guarda** (no hay cuenta); el puntaje ponderado se ve junto al arancel. Las capturas de la descripción del PR usaron datos ficticios solo para probar la interfaz; no forman parte del repositorio ni respaldan datos oficiales. El 14 de noviembre se verificó localmente la exclusión de carreras con una fixture temporal ignorada por Git; se retiró antes del commit y no modificó datos oficiales.

### A13 · Auditoría de accesibilidad y rendimiento
**Rama:** `fix/auditoria-final` · **Fecha:** primera pasada el lunes 16 nov; segunda pasada completa del 7 al 11 dic, sobre `main`

Recorre **todas** las pantallas del entregable (portada, ficha, explorador, comparador, simulador, hoja de decisión, FUAS y calendario, meta, «Quiénes somos», preguntas frecuentes) y deja un informe en `docs/auditoria-accesibilidad.md`:

| Revisión | Herramienta | Meta |
|---|---|---|
| Automática | Pruebas Playwright con axe-core de la CI, axe DevTools, Lighthouse | 0 errores, Accesibilidad 100 |
| Teclado | Manual | Todo alcanzable y operable, foco siempre visible |
| Lector de pantalla | TalkBack (Android) y/o VoiceOver | Cada pantalla se entiende sin verla |
| Zoom | Texto del teléfono al 200 % | Nada se corta ni se superpone |
| Ancho mínimo | 360 px | Sin desplazamiento horizontal (salvo el comparador) |
| Rendimiento | Lighthouse móvil, «4G lenta» | 90 o más; menos de 3 s de carga |
| Modo oscuro | Teléfono en modo oscuro | Todo legible |

Corrige lo que encuentres y anota lo que quede pendiente. Cumple WCAG 2.2 nivel AA. **Del 7 al 11 de diciembre (A13 final):** repite la tabla sobre `main` y corrige solo con mejoras leves. Lo que exceda una mejora leve queda anotado en el informe como limitación o proyección.

### A15 · Indicador de etapas del proceso en la portada
**No está en `plan.md`.** Hay una decisión pendiente del líder sobre **qué estaciones muestra el indicador**. **No cambies el indicador** hasta que la decida (ver `docs/diseno.md` y la skill `mapa-de-trayecto`). El calendario con campo `estacion` es ahora la tarea N3 de Cristóbal.

### Tareas retiradas el 13 de noviembre (ADR 0032)

| # | Tarea | Estado |
|---|---|---|
| A10 | Consentimiento: «decidir qué compartir con el colegio y revocarlo» (T4 antiguo) | **Retirada el 13-nov: ADR 0032 y 0033** |
| A12 | Panel de seguimiento para colegios (pantallas) | **Retirada el 13-nov: ADR 0032** |
| A14 | Prueba de uso con 5 estudiantes y 2 profesionales de colegios | **Retirada el 13-nov: ADR 0032.** La reemplazan N13 y N15 |

---

## 5. La medición (30 de noviembre al 4 de diciembre)

Eres responsable de los indicadores **I-OG, I-OE1b, I-OE2 e I-OE3a**. El protocolo completo, el consentimiento, el registro y qué hacer ante una señal de riesgo están en [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md); Cristóbal te ayuda a aplicarlo.

**Muestra:** 10 personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años (Rafael las consigue, N14). Plan B: un mínimo de 6, declarándolo.

**Cuatro tareas centrales** (Anexo 3.A): T1 encontrar una carrera y leer la fuente y la fecha de uno de sus datos; T2 identificar su empleabilidad, duración, arancel y requisito de ingreso, y explicar qué mide la empleabilidad; T3 compararla con la misma carrera en otra institución y decir cuál tiene mayor empleabilidad; T4 fijarla como meta e identificar el próximo plazo y una alternativa. 10 personas × 4 tareas = 40; la meta es **32 sin ayuda (80 %)**, con un máximo de 5 minutos por tarea.

**Tarea cronometrada:** cada persona reúne y compara cuatro datos de una carrera en dos instituciones, una vez en sitios oficiales y otra con el sitio, con orden y pares alternados. Meta: bajar la mediana del tiempo a la mitad o menos.

**Antes del lunes 30 de noviembre** deben estar publicados: la vista de carrera con las comparaciones, el comparador, el simulador, la meta con alternativas, el calendario, «Quiénes somos» y las preguntas frecuentes. Si falta algo, avisa **ese mismo día**; se reordena el plan con fechas nuevas.

---

## 6. Lo que debes dominar (40 minutos, una vez)

1. [`AGENTS.md`](../../AGENTS.md), sobre todo las secciones 2.5 (diseño) y 2.6 (accesibilidad).
2. [`docs/diseno.md`](../diseno.md): la idea «Mapa de trayecto» con la base visual Andén urbano, y por qué cada color, letra y medida existe.
3. [`.claude/skills/mapa-de-trayecto/SKILL.md`](../../.claude/skills/mapa-de-trayecto/SKILL.md) y [`.claude/skills/lenguaje-claro/SKILL.md`](../../.claude/skills/lenguaje-claro/SKILL.md).
4. [`docs/arquitectura.md`](../arquitectura.md): dónde va cada cosa.

**Tres ideas que guían todo tu trabajo:**
1. **La persona con el teléfono más básico y la conexión más lenta es la medida.** Si funciona ahí y para alguien que nunca ha postulado, funciona para todos.
2. **Nada visual «porque se ve bonito».** Cada elemento se justifica por accesibilidad medible, comprensión, rendimiento o identidad.
3. **Solo tokens.** Cada color, tamaño y espacio sale de `diseno/tokens.css`. Si necesitas uno que no existe, se pide con un ADR (y se corre `python3 scripts/tokens.py`).

---

## 7. Antes de abrir cada PR

- [ ] La tarea cumple **todos** sus criterios de aceptación.
- [ ] `npm run build`, `npm run lint` y `python3 scripts/tokens.py --check` pasan.
- [ ] Probado a 360 px, con teclado y en modo oscuro.
- [ ] Sin colores, tamaños ni espacios escritos a mano (`grep -rn "#[0-9A-Fa-f]\{6\}" app/`).
- [ ] Textos revisados con la skill `lenguaje-claro` (o pedidos a Cristóbal).
- [ ] Capturas de pantalla en el PR (teléfono y escritorio).
- [ ] Plantilla del PR completa, incluida la IA que usaste.
- [ ] Leíste y entiendes todo el código, incluido el que escribió tu IA.

**Texto base para tu IA** (cambia la tarea):
> Lee AGENTS.md, docs/plan.md, docs/diseno.md, las skills mapa-de-trayecto y lenguaje-claro y la tarea [código] de docs/equipo/guia-alejandro.md. Construye solo lo que pide esa tarea, usando los componentes existentes en app/_componentes y solo variables de diseno/tokens.css. Accesible con teclado y lector de pantalla, objetivos táctiles de 44 px, foco visible, 360 px. No escribas ningún dato a mano en el código ni inventes colores o medidas; si falta un token, dímelo. No agregues librerías que no te pida. No guardes nada de la persona fuera de su dispositivo. Al final, dime cada archivo creado y por qué.

## 8. Errores comunes que hacen rechazar un PR

| Error | Por qué se rechaza | Cómo evitarlo |
|---|---|---|
| `color: #333` o `text-gray-700` | Rompe el sistema de diseño y el modo oscuro | Solo `var(--color-…)` |
| Ícono sin texto | Ambiguo para muchas personas | Ícono + palabra |
| `outline: none` | Quien usa teclado se pierde | Foco con `--anillo-foco` |
| Botón «Continuar» o «Aceptar» | No dice qué pasa al tocarlo | Verbo + resultado |
| Mostrar 0 cuando no hay dato | Información falsa | «Sin datos suficientes» |
| Cifra calculada por el equipo sin rótulo | Parece dato del organismo | «Elaboración propia» y cómo se calculó |
| Afirmar un resultado que no se midió (por ejemplo, «ahorra X horas») | Promesa sin respaldo | Esperar a la medición o no decirlo |
| Ordenar o destacar instituciones por ser clientes | Rompe la neutralidad | Solo criterios explícitos |
| Guardar la meta o las preferencias fuera del dispositivo | Datos personales sin justificación | Solo almacenamiento local |
| Librería nueva sin justificar | Peso, seguridad y licencias | Justificarla en el PR o no usarla |
| Datos de ejemplo con nombres reales | Privacidad | Siempre ficticios |

---

## Anexo histórico: tareas ya hechas (3 al 10 de noviembre)

Se conservan como registro; ya están fusionadas. El detalle de cada una está en su PR.

- **A1 · Proyecto Next.js como PWA** (PR 15): Tailwind leyendo `diseno/tokens.css`, manifiesto, íconos, `allowImportingTsExtensions` para que `lib/ia/` importe con `.ts`.
- **A2 · Tipografías alojadas** (PR 28): Atkinson Hyperlegible Next y Mono en `woff2`, sin Google Fonts en línea, licencia OFL declarada.
- **A3 · Componentes base y `/componentes`** (PR 49): `Boton`, `Enlace`, `Encabezado`, `IndicadorEstacion`, `DatoOficial`, `Aviso`, `PiePagina`. La página `/componentes` es la guía viva.
- **A4 · Despliegue en Cloudflare** (PR 32, 52; ADR 0003 aceptado con reservas): el líder conecta el repositorio a su cuenta y el sitio se despliega al fusionar a `main`. Nadie del equipo crea cuentas a nombre de la agencia.
- **A5 · Ficha de carrera, A6 · Explorador, A7 · Comparador, A11 · Beneficios y calendario**: fusionados (ver sección 3). Reglas que siguen vigentes: cada cifra muestra qué mide, su período y su fuente; sin dato se muestra «Sin datos suficientes» con su motivo; el orden por defecto nunca favorece instituciones; el comparador no mezcla períodos sin advertirlo.
