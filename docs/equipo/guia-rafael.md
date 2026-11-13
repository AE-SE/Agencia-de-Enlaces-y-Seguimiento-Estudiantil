# Guía de Rafael · Líder de arquitectura

> **Para la IA que acompaña a Rafael:** este documento es la hoja de ruta del líder hasta el entregable del **19 de diciembre de 2026**. Antes de proponer cualquier cosa, lee `AGENTS.md`, `BITACORA.md`, [`docs/plan.md`](../plan.md), `docs/entregable/Entregable_Parte_I.md` (puntos 2.3, 3, 8, 9 y 10) y los ADR [0032](../decisiones/0032-agencia-independiente-y-publico-egresado.md) y [0033](../decisiones/0033-cuenta-con-correo-sin-edad.md). Rafael decide y aprueba; tú propones, verificas y declaras lo que no pudiste comprobar. Lo que **no se delega** a otra herramienta: `lib/ia/`, las políticas de Row Level Security (RLS) y todo lo que toque datos personales ([reparto](reparto.md)). Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`.

Estado verificado el **13 de noviembre de 2026** con `gh pr list` (solo lectura). La tabla de PR de la sección 3 se actualiza cada vez que se fusiona algo.

> **Giro del 13 de noviembre (ADR 0032).** Ya no hay fundación, panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares ni piloto en liceos. Ahora: agencia independiente (sociedad por acciones, SpA, en 2027), público = toda persona que egresa de 4.º medio y no ha ingresado a la educación superior, alcance nacional, sitio gratis y sin cuenta. El ingreso vendría de informes y asesorías que encargue quien llegue; nadie sale a vender. Las tareas que dependían de lo anterior quedan marcadas «Retirada el 13-nov» y se conservan como historia.

---

## 1. Qué se entrega el 19 de diciembre y qué te toca

Producto acordado (ADR 0032): sitio gratuito y sin cuenta para quien egresa de 4.º medio, con las comparaciones de cada carrera (empleabilidad frente a la misma carrera en otras instituciones y a su área, duración formal y real, vacantes, arancel), meta con tres preferencias y alternativas cercanas, calendario y preguntas frecuentes; más una medición con 10 personas de 18 años o más. Hasta el 19 de diciembre es un proyecto de título sin entidad; la SpA se constituye en 2027.

**Tu rol:** arquitectura, privacidad, criterio de alternativas y documentos. Según la Matriz RACI (Tabla 3.8) eres **A (aprueba)** de todo y **A/R** de «Meta, alternativas, pasos y plazos», «Protección de datos personales» e «Informe y presentación». En la tabla de tareas de [`plan.md`](../plan.md) ejecutas N6, N7, N8, N14 (con el equipo) y N16.

| Tarea (Tabla 3.8) | Tú | Alejandro | Cristóbal |
|---|---|---|---|
| Datos oficiales de cada carrera | A | I | R |
| Comparación y explicación de cada cifra | A | R | C |
| Meta, alternativas, pasos y plazos | **A/R** | R | C |
| Protección de datos personales | **A/R** | I | I |
| Encuesta, medición de tiempo y entrevistas | A | R | R |
| Informe y presentación | **A/R** | R | R |

**No te toca hacerlo tú** (pero sí revisarlo): pantallas, estilos, accesibilidad y la aplicación de la medición (Alejandro); datos oficiales, fórmulas y textos (Cristóbal).

**Riesgo del rol:** el proyecto avanza al ritmo de una sola persona si todo pasa por ti. Meta: ningún PR de Alejandro o Cristóbal pasa más de 3 días hábiles sin primera revisión.

---

## 2. Tu hoja de ruta (Tablas 3.7 y 3.10 del entregable, y `plan.md`)

| Semana | Fechas | Tu parte | Criterio de aceptación |
|---|---|---|---|
| 2 | 10 al 16 nov | Cerrar la revisión del PR 96 (R1); confirmar la ficha a 360 px y con teclado (R2). **Giro del 13 nov**: revisar el ADR 0032 y 0033 y el entregable reescrito | Entregable Parte I listo para el martes 17 |
| 3 | 17 al 23 nov | **N6** criterio de alternativas (vie 20), **N7** «Quiénes somos» (vie 20), **N8** permiso de los autores de la escala y encuesta publicada (lun 23). Revisar los PR de Cristóbal (N1 a N3) | Cada tarea con su criterio de aceptación (sección 4) |
| 4 | 24 al 27 nov | **N14** conseguir a las 10 personas (vie 27). Revisar los PR de pantallas (martes 24 y viernes 27) | 10 personas confirmadas con día y hora. **Vie 27 nov: congelamiento de funciones** |
| 5 | 30 nov al 4 dic | **Mar 1 dic: todo fusionado a `main` y publicado (R12).** Medición con 10 personas (la aplican Alejandro y Cristóbal) y cierre de la encuesta. Estás disponible para cualquier señal de riesgo | `main` pasa lint, pruebas y `tokens.py --check`; registro de la medición completo |
| 6 | 7 al 11 dic | Revisión de PR (martes 8 y viernes 11); revisión de privacidad sobre `main` (R14) | Cada hallazgo con estado: corregido, aplazado con motivo o descartado |
| 7 | 14 al 17 dic | **N16** informe final y presentación. Último PR de código el mar 15 dic; el jueves 17 no se fusiona código | Informe sin marcas `[COMPLETAR]` |
| Cierre | 18 y 19 dic | Revisión final y presentación | Entrega el 19 de diciembre |

### Hitos con fecha

| Fecha | Qué debe estar | Verificación |
|---|---|---|
| **Vie 13 nov** | PR 96 revisado (R1) | Fórmula citada de DEMRE con página |
| **Lun 16 nov** | Ficha en el sitio publicado a 360 px y con teclado (R2) | Revisión en el sitio publicado |
| **Mar 17 nov** | Entrega del Avance 2 con la idea nueva | Entregable Parte I |
| **Vie 20 nov** | N6 y N7 listas; N1 y N3 de Cristóbal | PR abiertos contra `main` |
| **Lun 23 nov** | N8: permiso pedido y encuesta publicada; N2 de Cristóbal | Enlace de la encuesta; correo enviado a los autores |
| **Vie 27 nov** | Congelamiento de funciones; N14: 10 personas confirmadas | Lista sin nombres en el repositorio |
| **Mar 1 dic** | Todo fusionado a `main` y publicado | `main` pasa lint, pruebas y `tokens.py --check` |
| **30 nov al 4 dic** | Medición con 10 personas; cierre de la encuesta | Registro en [`pruebas-usuarios.md`](../pruebas-usuarios.md) |
| **Vie 11 dic** | Revisión de privacidad hecha | Informe corto de la revisión |
| **Mar 15 dic** | Último PR de código fusionado | `main` sin PR de código abiertos |
| **Jue 17 dic** | Informe final y presentación listos (N16) | Sin marcas pendientes |
| **Sáb 19 dic** | Informe final y presentación | Entrega |

---

## 3. Estado de los PR (verificado el 13 de noviembre)

**Fusionados desde el 9 de noviembre** (los más relevantes): oferta y datos (PR 95, 97, 98, 99, 103, 109, 116, 117, 118, 121, 126, 127, 128, 144), tablero interno y pronósticos (PR 77, 79, 129), simulador de puntaje (commit `abf7e65`, con los ajustes del PR 169), comparador y componentes (PR 49, 57, 69), calendario y portada del FUAS (PR 141, 142, 146), hoja de decisión (PR 150), guía del FUAS (PR 152), tokens de Andén urbano (PR 151, 156), alineación visual (PR 154), reescritura del entregable (PR 155, 170), CI de documentación (PR 140).

**Abiertos y esperando una acción tuya:**

| PR | Qué es | Acción |
|---|---|---|
| **171** | Giro a agencia independiente, público egresado y SpA (documentos) | Revisar y fusionar en cuanto aceptes el ADR 0032 |
| **96** | Cita de la fórmula oficial del ranking 2027 (Cristóbal) | Revisar |
| **157 a 168** | Las 12 partes de la identidad visual Andén urbano (Cristóbal) | Revisar en las ventanas del martes y el viernes |
| **139** | ADR 0028 sobre la visibilidad del repositorio | Decidir |

Cerrados sin fusionar: PR 62 (por 92), 119 (por 121), 133 a 138 (por 142 a 147), 132 (el simulador entró por otra vía; ver arriba) y 149 (bitácora). No los reabras. El PR 153 (propuesta del panel escolar) ya está fusionado y quedó **retirado por el ADR 0032**.

---

## 4. Tus tareas, en orden

### Tareas vigentes (de `plan.md`)

| # | Tarea | Fecha | Depende de | Skill | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| R1 | Revisar el PR 96 (cita de la fórmula del ranking 2027). El simulador ya está en `main` | Vie 13 nov | — | `revisar-pr`, `datos-oficiales` | Fórmula citada de DEMRE con página; casos oficiales pasan | Pendiente |
| R2 | Confirmar en el sitio publicado la ficha a 360 px y con teclado | Lun 16 nov | — | `mapa-de-trayecto` | Sin desplazamiento horizontal; foco visible | Pendiente |
| **N6** | **Criterio de «alternativas cercanas»** como función pura y probada en `lib/` | Vie 20 nov | — | `datos-oficiales` | Ver detalle abajo | Pendiente |
| **N7** | **Texto de «Quiénes somos»** | Vie 20 nov | — | `lenguaje-claro` | Ver detalle abajo | Pendiente |
| **N8** | **Permiso de los autores de la escala y encuesta en línea publicada** | Lun 23 nov | — | `lenguaje-claro` | Ver detalle abajo | Pendiente |
| **N14** | **Conseguir a las 10 personas de la medición** (con el equipo) | Vie 27 nov | — | `lenguaje-claro` | Ver detalle abajo | Pendiente |
| R12 | **Fusionar todo a `main`**: revisar y fusionar cada PR de función abierto; decidir qué pasa a proyección | Mar 1 dic | Congelamiento del 27 nov | `revisar-pr` | Ningún PR de función abierto; `main` pasa lint, pruebas y `tokens.py --check` | Pendiente |
| R13 | **Revisión de PR** de las correcciones y mejoras leves (martes y viernes) | 1, 4, 8, 11 y 15 dic | — | `revisar-pr` | Cada PR con primera revisión en la ventana; una mejora leve no agrega pantallas, tablas ni dependencias (menos de 150 líneas) | Pendiente |
| R14 | **Revisión de privacidad** sobre `main` (reformulada el 13-nov: ADR 0032 y 0033) | Vie 11 dic | R12 | `asistente-seguro` | Sin datos personales en URL, logs, errores ni analítica; la meta y las preferencias solo en el dispositivo; el sitio no pide cuenta, edad ni datos sensibles; la encuesta no guarda nombre, correo ni dirección IP; informe corto con lo verificado | Pendiente |
| R10 | Completar el entregable con los resultados de la encuesta, las entrevistas y la medición (los `[COMPLETAR]`) | Primer borrador con lo disponible el 4 dic; final el 17 dic | N15 | `lenguaje-claro` | Sin marcas pendientes | Pendiente |
| **N16** | **Informe final y presentación** (ensayo el 17 dic; revisión final el 18) | Jue 17 dic (entrega 19 dic) | N15 | `lenguaje-claro`, `revisar-pr` | Entrega completa; cifras coinciden con la medición y los datos; nada se afirma antes de medirlo | Pendiente |

### N6 · Criterio de «alternativas cercanas» (vie 20 nov)

Función pura, probada, en `lib/` (carpeta nueva `lib/calculos/` o la que corresponda según [`docs/arquitectura.md`](../arquitectura.md)). Alejandro la usa en N10.
1. Escribe en un párrafo el criterio, en español claro: misma área, misma región y puntaje alcanzable. Define «alcanzable» contra un dato oficial con su año (por ejemplo, el puntaje del último seleccionado del año anterior, rotulado «del año anterior»). Si necesitas un umbral que no existe en una fuente, no lo inventes: deja `TODO(fuente)` y pregunta.
2. Escribe primero las pruebas: una por criterio, más una que demuestre que **la condición de cliente no influye** (la función no recibe ningún campo de cliente; el resultado no cambia si una institución lo fuera).
3. Implementa la función sin acceso a la red ni a la base de datos: recibe la carrera meta y la lista de carreras, devuelve las alternativas ordenadas por criterios explícitos.
4. Documenta el criterio en el código (el porqué) y en una línea de `docs/arquitectura.md`.
- [ ] Pruebas aprobadas para misma área, región y puntaje.
- [ ] Prueba de que ningún campo de cliente entra al cálculo.
- [ ] El orden de los resultados es explicable en una frase.

### N7 · Texto de «Quiénes somos» (vie 20 nov)

Entrega el texto a Cristóbal (revisión con `lenguaje-claro`) y a Alejandro, que construye la página (N11, miércoles 25).
1. Cuatro partes cortas: qué es la agencia, quiénes la componen, por qué se hizo, cómo trata los datos.
2. Di que es un proyecto de título hasta el 19 de diciembre y que la sociedad se constituye en 2027; no digas que ya existe.
3. Cómo trata los datos: el sitio no pide cuenta ni edad; la meta y las preferencias se guardan en el dispositivo (ADR 0033).
4. Di el límite: la agencia mejora la información, no garantiza el ingreso; no se afirma que la gente no ingrese por desinformación (AGENTS.md, sección 1).
- [ ] Sin siglas sin explicar la primera vez; sin «vulnerable», «pobreza» ni «clase social».
- [ ] Toda cifra con su fuente oficial o académica; nada de prensa.
- [ ] No promete predicción ni resultados.

### N8 · Permiso de los autores de la escala y encuesta publicada (lun 23 nov)

1. Envía la solicitud de permiso a los autores de la Escala de Autoeficacia para la Elección de Carrera (EAEC) con el texto de [`docs/encuestas/solicitud-permiso-eaec.md`](../encuestas/solicitud-permiso-eaec.md). Tú la envías, no la IA.
2. Prepara la encuesta con [`docs/encuestas/encuesta-egresados.md`](../encuestas/encuesta-egresados.md) y el Anexo 2.A del entregable: consentimiento en la primera pantalla; la primera pregunta confirma 18 años o más y, si no, el cuestionario termina sin guardar nada; sin nombre, RUT, correo, edad exacta ni dirección IP; sin preguntas de salud ni de situación económica.
3. Verifica que la herramienta elegida no recoja correo ni dirección IP, y publícala. Meta: al menos 96 respuestas (punto 2.3.3).
4. Si el permiso no llega, **la encuesta no se aplica** y se declara (Tabla 3.12); el diagnóstico se apoya en la medición de tiempo y en las entrevistas.
- [ ] Permiso pedido y fecha anotada; encuesta publicada con consentimiento en la primera pantalla.
- [ ] Solo se publican resultados agregados, sin grupos de menos de cinco respuestas.

### N14 · Conseguir a las 10 personas de la medición (vie 27 nov)

1. Haz una lista **fuera del repositorio** de personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años; invita a 15 o más, hayan ingresado o no a la educación superior.
2. Invítalas con un mensaje corto: qué es (probar un sitio, no sus conocimientos), cuánto dura (cerca de una hora), que es voluntario y que no se pide ningún dato personal. Sin pagos ni ofertas.
3. Confirma que cumplen la condición con una sola pregunta (sección «Quiénes participan» de [`pruebas-usuarios.md`](../pruebas-usuarios.md)).
4. Agenda cada sesión entre el lunes 30 de noviembre y el viernes 4 de diciembre con Alejandro y Cristóbal; deja 2 o 3 personas de reserva.
- [ ] 10 personas confirmadas con día y hora (o un mínimo de 6 con el plan B declarado).
- [ ] Ningún nombre ni contacto en el repositorio.

### Tareas retiradas el 13 de noviembre (ADR 0032)

Se conservan como historia; no se hacen.

| # | Tarea | Estado |
|---|---|---|
| R3 | Decidir el alcance del panel (PR 153) | **Retirada el 13-nov: ADR 0032.** Ya no hay panel para colegios |
| R4 | Consentimiento del estudiante en la interfaz y flujo del tutor para menores (ADR 0015, 0022) | **Retirada el 13-nov: ADR 0032 y 0033.** La cuenta no pide edad ni tutor y no se construye para el 19 de diciembre |
| R5 | Panel de seguimiento con datos ficticios | **Retirada el 13-nov: ADR 0032** |
| R6 | Pruebas automáticas de consentimiento y aislamiento (I-OE3b antiguo) | **Retirada el 13-nov: ADR 0032.** Las tablas y pruebas existentes no se borran; se retiran en una migración aparte (`plan.md`) |
| R7 | Pasar Gemini al nivel pagado y verificar variables del despliegue | **En pausa el 13-nov: ADR 0032.** El asistente conversacional queda diseñado, no se construye. Lo que sigue vigente: ninguna clave en el repositorio |
| R8 | Reclutar a 5 estudiantes y 2 profesionales de colegios; carta formal; autorizaciones de tutores | **Retirada el 13-nov: ADR 0032.** La reemplaza N14 |
| R9 | Sesión de validación del panel con 2 profesionales | **Retirada el 13-nov: ADR 0032** |
| R15 | Verificar el panel con datos ficticios tras las correcciones | **Retirada el 13-nov: ADR 0032** |
| R11 | Informe final y presentación | Pasa a **N16** |
| R1 (parte del PR 132) | Revisar el simulador de puntaje | Hecho: el simulador está en `main`; el PR 132 se cerró sin fusionar |

---

## 5. Qué quedó fuera del alcance del 19 de diciembre, y por qué

Se conserva la historia (los ADR no se borran); no se construye ni se promete.

**Queda diseñado, sin construir en este período:** cuenta con correo ([ADR 0033](../decisiones/0033-cuenta-con-correo-sin-edad.md)), cuestionario de intereses vocacionales, simulación de beneficios, asistente conversacional, noticias de educación superior, tablero público de transparencia e informes de datos.

**Ya no se hace** (ADR 0032): panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares, cartas y convenios con liceos, fundación.

| Fuera del alcance | Por qué | Dónde queda |
|---|---|---|
| Permanencia en educación superior y pulso de check-in | Exige profesionales y evidencia que el equipo no tiene | ADR 0010, `docs/evidencia-permanencia.md` (proyección) |
| Predicción o riesgo de deserción | Sin evidencia ni capacidad; nunca se promete predicción (AGENTS.md 2.4) | ADR 0012 y 0013 (historia) |
| Avisos de plazos por correo, seguimiento de la postulación | Necesitan la cuenta, que no se construye ahora | Proyección (AGENTS.md, sección 1) |
| Portal de transparencia rediseñado | Idea acordada; falta diseñarlo; los datos son del Estado y el aporte es el proceso | [`propuesta-portal-de-transparencia.md`](../propuesta-portal-de-transparencia.md); no entra al 19 dic |
| Informes de datos y asesorías | Hipótesis comercial sin validar; nadie ha encargado uno | Entregable, punto 8 |

Decisiones que solo tú tomas: aceptar los ADR 0032 y 0033 (y los demás que sigan abiertos), la excepción de licencia MPL-2.0 de axe-core (ADR 0021), el respaldo de los códigos DEMRE 17074 y 32012, el reparto de acciones entre los tres socios y la forma jurídica (con validación de un abogado y un contador antes de constituir), y los plazos `TODO(legal)` de la cuenta (conservación de cuentas inactivas, política de datos).

---

## 6. Riesgos abiertos (Tabla 3.12 del entregable)

- **No se consiguen 10 personas** (impacto alto). Control: invitar a más. Plan B: medir con las que lleguen, con un mínimo de 6, y declararlo.
- **Los autores de la EAEC no autorizan** (impacto medio). Plan B: declarar que la encuesta no se aplicó; el diagnóstico se apoya en la medición de tiempo y en las entrevistas.
- **La versión probada cambia durante la semana de medición** (la medición parte el lunes 30 y todo se fusiona el martes 1). Control: publicar una versión estable antes del lunes 30 y anotar el commit de cada sesión.
- **CPU de Cloudflare:** la mediana medida es de 29,47 ms frente al límite de 10 ms del plan gratuito (reserva 2 del ADR 0003). Confirmar el límite vigente. Plan B: demostración grabada.
- **Revisión profesional del protocolo de crisis y de los contenidos:** el protocolo de la medición ([`pruebas-usuarios.md`](../pruebas-usuarios.md)) usa los números del protocolo del proyecto. Solicitar la revisión profesional cuanto antes; el documento de una página está en [`docs/revision-profesional-una-pagina.md`](../revision-profesional-una-pagina.md).
- **Respuesta de Mineduc a la solicitud sobre el FUAS** (folio AJ025T0003786): vence cerca del 2 de diciembre; si no llega, la cifra se declara como no disponible.
- **Ley 21.719 (vigencia prevista el 1 de diciembre de 2026):** los artículos que se citen salen de la ley publicada, no de resúmenes. Verificar antes de citar.
- **Alguien encargue informes** (hipótesis, probabilidad alta de que no ocurra pronto): el entregable la declara sin cifras de venta inventadas.

---

## 7. Cómo revisas un PR

1. Ventanas de revisión: **martes y viernes**. Un PR abierto antes de la ventana se revisa en ella. Detalle en [`docs/protocolo-revision-prs-equipo.md`](../protocolo-revision-prs-equipo.md).
2. Claude revisa con la pauta [`revisar-pr`](../../.claude/skills/revisar-pr/SKILL.md) y te entrega el informe. Tú confirmas o rechazas.
3. Con tu confirmación, Claude aplica los arreglos acordados y fusiona a `main` en un solo commit.
4. Si Claude es autor de la rama, lo declara en el informe y tú revisas además lo subjetivo (lo visual, los textos).
5. Cada encargo al equipo se manda por escrito, con la fecha de cada paso, y se cierra con lo que hay que arreglar antes de la próxima ventana.

---

## 8. Errores que ya pasaron y no deben repetirse

Tomados de la [bitácora](../../BITACORA.md).

- **Cambiar un dato por una nota sin mirarlo en la fuente:** pasó con la empleabilidad de Derecho y se revirtió.
- **Apilar PR de documentación:** nunca corrieron su CI. Ábrelos todos contra `main`.
- **Duplicar lógica al resolver conflictos con `-X theirs`:** pasó con `lib/datos/ruta.ts` y `fechas.ts`.
- **Contar como revisión independiente la que hace el propio autor de la carga:** pasó con la fila 12070 del DEMRE.
- **Confiar en la respuesta de una herramienta de IA sin verificarla:** Antigravity se equivocó con el adaptador de Cloudflare y Codex se colgó horas esperando una entrada.
- **Sumar documentos mientras el producto no avanza:** el 5 de noviembre, cinco commits seguidos fueron de documentación y el portal tenía una sola página. A 5 semanas de un cambio de idea, lo que falta es construir el núcleo y medirlo, no más texto.
- **Cambiar la idea del proyecto por tercera vez en dos semanas:** el docente tutor ya observó la falta de foco. El ADR 0032 no se reabre antes del 19 de diciembre.
- **Citar fuentes que no son oficiales, primarias o académicas:** prensa y resúmenes de terceros no son fuente de ningún dato ni artículo de ley.

---

## Anexo histórico: lo que ya se hizo (3 al 10 de noviembre)

Se conserva para el informe de título; no son tareas vigentes. Todo aplicado en Supabase (São Paulo). Parte de lo construido (alertas, tutor, flujo de la Ficha con el colegio) responde a la idea del 11 de noviembre y queda sin uso; se retira en una migración aparte.

| Área | Qué quedó hecho | Referencia |
|---|---|---|
| Reglas del proyecto | `AGENTS.md`, skills, plantilla de PR, CI de verificación, repositorio en la organización AE-SE | PR 6; ADR 0008 |
| Base de datos y privacidad | Esquema con RLS y pruebas en CI; alertas y derivación; derechos del titular; nota de cierre estructurada; flujo de tutor (retirado por el ADR 0033); rendimiento de políticas e índices | PR 3, 25, 23, 46, 72, 73, 81, 82, 86; ADR 0002, 0011, 0014, 0015, 0019, 0020, 0022 |
| Asistente IA | Protocolo de crisis con pruebas (\*4141 y 600 360 7777), proveedor de IA tras una interfaz, limpieza de datos personales, endpoint y registro de alertas | PR 8, 9, 11, 12, 13, 74; ADR 0004 |
| Datos oficiales | Cargas de oferta (Mineduc), empleabilidad e ingresos (SIES), ponderaciones y vacantes (DEMRE 2027, corregida y verificada); lotes SQL; el portal lee la base; celdas suprimidas con nombre y sin cifra | PR 39, 40, 43, 45, 92, 95 a 99, 103, 121; ADR 0025 |
| Portal | Despliegue en Cloudflare con OpenNext, ficha, explorador, consulta por región y comuna, comparador con medida comparativa, indicador de etapas, pie común, pruebas de accesibilidad (Playwright y axe-core), simulador de puntaje | PR 32, 35, 36, 38, 76, 104 a 108, 110, 116 a 118, 128, 169; ADR 0003, 0021, 0023 |
| Pronóstico (uso interno) | Plan de análisis, pronósticos 2027-2028, tablero interactivo y manual. La página pública se retiró por ser de uso interno | PR 77, 79, 89, 129; ADR 0016 a 0018 |
| Documentos | Entregable Parte I, encuesta con instrumento único, verificación de cifras, propuestas anteriores (hoy archivadas) | PR 24, 29, 30, 51, 71, 111, 112, 143, 155, 170 |
| Coordinación | Guías del equipo, reparto, protocolo de revisión de PR | PR 31, 55, 63 a 65, 131 |
