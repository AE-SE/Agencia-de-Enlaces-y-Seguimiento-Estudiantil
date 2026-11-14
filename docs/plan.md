# Plan de trabajo

Entrega: **19 de diciembre de 2026**. Un solo producto con tres entregables: sitio público para personas que egresan de 4.º medio, medición con personas reales y entrega académica. Hasta esa fecha es un proyecto de título sin entidad jurídica; la sociedad por acciones (SpA) se constituye en 2027.

Idea vigente desde el 13 de noviembre: [ADR 0032](decisiones/0032-agencia-independiente-y-publico-egresado.md) y [`entregable/Entregable_Parte_I.md`](entregable/Entregable_Parte_I.md). Cómo se llegó a ella y qué cambió: [`plan-giro-agencia-independiente.md`](plan-giro-agencia-independiente.md).

## Calendario

| Semana | Fechas | Foco | Hito que se muestra |
|---|---|---|---|
| 1 | 3 al 9 nov | Cimientos: esquema de datos, primera carga oficial, despliegue en Cloudflare | Hecho |
| 2 | 10 al 16 nov | Explorar: vista de carrera, comparador, simulación de puntaje. **Giro del 13 de noviembre**: ADR 0032 y 0033, entregable reescrito | Entregable Parte I listo para el martes 17 |
| 3 | 17 al 23 nov | Datos de las comparaciones (empleabilidad, duración real, vacantes, arancel), calendario de admisión, criterio de alternativas cercanas, encuesta en línea publicada | Una carrera real muestra sus cuatro comparaciones con fuente |
| 4 | 24 al 27 nov | Pantallas: comparaciones en la vista de carrera, meta con tres preferencias, Quiénes somos, preguntas frecuentes, portada | Recorrido completo en el teléfono |
| 4 (cierre) | **Vie 27 nov** | **Congelamiento de funciones**: desde ese día no entra ninguna función nueva | Todo el núcleo en ramas listas para revisión |
| 5 | 30 nov al 4 dic | **Lun 30 nov: todo fusionado a `main` y publicado; ninguna sesión de medición empieza antes.** Medición con 10 personas de 18 años o más: tiempos con cronómetro y tareas. En cada sesión se anota la versión publicada. Entrevistas. Cierre de la encuesta | Registro de la medición completo |
| 6 | 7 al 11 dic | Corregir lo que dejó la medición (ramas `fix/…`), por gravedad. Accesibilidad (360 px, teclado, lector de pantalla) y verificación de datos con fuente | Cada hallazgo con estado: corregido, aplazado con motivo o descartado |
| 7 | 14 al 17 dic | Informe de la medición, informe final y presentación. Último PR de código el mar 15 dic | Informe y presentación listos |
| Cierre | 18 y 19 dic | Presentación e informe de título | Entrega |

**Regla del 1 al 17 de diciembre:** sirve para medir, pulir y probar, no para terminar lo pendiente. Una mejora leve no agrega pantallas, tablas ni dependencias y cabe en un PR de menos de 150 líneas. Todo lo demás pasa a la lista de proyección. Revisión de PR los martes y los viernes; el jueves 17 no se fusiona código.

## Qué se construye (núcleo) y quién

Las tareas llevan el prefijo N (núcleo). El detalle paso a paso está en la guía de cada persona. Las fechas de esta tabla son internas y dejan holgura: el compromiso del entregable (Tabla 3.10) es tener datos y pantallas el viernes 27 de noviembre. Donde una tarea vence el mismo día que otra de la que depende (N11 con N4, N13 con N5), se construye antes con datos de ejemplo y ese día se cargan los reales.

| Tarea | Qué | Quién | Fecha | Depende de |
|---|---|---|---|---|
| N1 | Empleabilidad al 1.er año y duración real por carrera e institución (SIES), con fuente, enlace y fecha. Cálculo de la comparación: misma carrera en otras instituciones (mínimo, mediana y máximo) y su área, rotulado «elaboración propia» | Cristóbal | Vie 20 nov | — |
| N2 | Vacantes y arancel (SIES, oferta académica) verificados. Postulaciones del DEMRE: evaluar si se pueden mostrar con sus filtros y condiciones; si no, documentarlo y no mostrarlas | Cristóbal | Lun 23 nov | — |
| N3 | Calendario de admisión 2027 con la forma de `plazos_2027.json` (tarea C14) | Cristóbal | Vie 20 nov | — |
| N4 | Preguntas frecuentes: 10 a 15, cada respuesta con su fuente y fecha | Cristóbal | Mié 25 nov | — |
| N5 | Lista fija de pares carrera–institución para la medición (que tengan los cuatro datos) | Cristóbal | Vie 27 nov | N1, N2 |
| N6 | Criterio de «alternativas cercanas» como función pura y probada en `lib/`: misma área, región y puntaje alcanzable; nunca la condición de cliente | Rafael | Vie 20 nov | — |
| N7 | Texto de «Quiénes somos»: qué es la agencia, quiénes la componen, por qué se hizo, cómo trata los datos | Rafael | Vie 20 nov | — |
| N8 | Permiso de los autores de la escala y encuesta en línea publicada para personas de 18 años o más | Rafael | Lun 23 nov | — |
| N9 | Vista de carrera: bloque de comparaciones, con «qué mide» junto a cada cifra | Alejandro | Mié 25 nov | N1, N2 |
| N10 | Meta con tres preferencias y alternativas cercanas, guardada en el dispositivo, sin cuenta | Alejandro | Jue 26 nov | N6 |
| N11 | Páginas «Quiénes somos» y «Preguntas frecuentes» | Alejandro | Mié 25 nov | N4, N7 |
| N12 | Portada: mensaje de agencia y entrada al recorrido | Alejandro | Vie 27 nov | — |
| N13 | Protocolo y hoja de registro de la medición (tiempos, tareas, datos correctos) | Alejandro | Vie 27 nov | N5 |
| N14 | Conseguir a las 10 personas de la medición (18 años o más, egresadas en los últimos cinco años) | Rafael, con el equipo | Vie 27 nov | — |
| N15 | Aplicar la medición y las 5 entrevistas | Alejandro, Cristóbal | 30 nov al 4 dic | N13, N14 |
| N16 | Informe final y presentación | Rafael | 17 dic | N15 |
| N17 | Carga de los perfiles ocupacionales de O*NET 31.0 en `datos/`, con atribución, fuente, URL y fecha por dato (CC BY 4.0) | Rafael | Mié 18 nov | — |
| N18 | Cruce de cada ocupación con carreras del catálogo por las 11 áreas del SIES, revisado a mano y rotulado «elaboración propia» | Cristóbal | Mié 25 nov | N17 |
| N19 | Pantalla del explorador de ocupaciones: la persona elige áreas de interés y ve ocupaciones relacionadas, sin presentarlo como test ni diagnóstico (ADR 0034, opción C) | Alejandro | Vie 27 nov | N17, N18 |

Siguen su curso las 12 partes de la identidad visual Andén urbano (PR 157 a 168, Cristóbal): el estilo de metro y estaciones no cambia.

**Queda diseñado, sin construir en este período:** cuenta con correo ([ADR 0033](decisiones/0033-cuenta-con-correo-sin-edad.md)), cuestionario de intereses vocacionales, simulación de beneficios, asistente conversacional, noticias de educación superior, tablero público de transparencia e informes de datos.

**Explorador de ocupaciones ([ADR 0034](decisiones/0034-test-vocacional.md), opción C):** entra en el núcleo y se publica antes del congelamiento del viernes 27 de noviembre (N17 a N19). Usa datos de O*NET bajo CC BY 4.0 y la elección de áreas por la persona. No es un test ni un diagnóstico, y no dice «tu carrera más afín es…».

**Vocacional, con condiciones ([ADR 0034](decisiones/0034-test-vocacional.md)):** ningún test vocacional se publica antes de tener licencia confirmada por escrito y el estudio de validación que la licencia exija. Ese estudio, con egresados chilenos, no está en el calendario de este período: se planea para 2027, junto con la cuenta.

## Qué ya no se hace

Panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares, cartas y convenios con liceos, fundación. Todo eso quedó fuera con el ADR 0032. Las tablas y pruebas que existían para ello no se borran en este período: se retiran en una migración aparte.

## Equipo

| Persona | Rol | Guía |
|---|---|---|
| Líder (@rafajaque) | Arquitectura, privacidad, criterio de alternativas, documentos | [`equipo/guia-rafael.md`](equipo/guia-rafael.md) |
| Alejandro | Interfaz y medición con personas | [`equipo/guia-alejandro.md`](equipo/guia-alejandro.md) |
| Cristóbal | Datos, contenido e identidad visual | [`equipo/guia-cristobal.md`](equipo/guia-cristobal.md) |

Forma de trabajo común: [`equipo/README.md`](equipo/README.md).

## Qué medimos

El indicador principal es el **tiempo que toma reunir y comparar los datos de una carrera en dos instituciones**: se mide con cronómetro en los sitios oficiales y con el sitio, con las mismas 10 personas. Meta: bajar la mediana a la mitad o menos. Los demás indicadores y sus fichas están en el punto 3 del entregable. Nada se afirma antes de medirlo.

## Cómo nos damos a conocer

Sin avisos y sin salir a vender: se comparten respuestas concretas, se escribe a partir de las dudas reales y se publica cuando cambia un dato oficial. Las oficinas municipales de juventud son una vía para difundir y para completar el cupo de la medición (N14). Guía: [`difusion-e-informes.md`](difusion-e-informes.md), que también dice cómo debe ser el primer informe de muestra y qué hacer si alguien pide uno.

## Fuera del alcance (proyección)

Permanencia en la educación superior, pulso de check-in, modelo predictivo, integración con sistemas de instituciones, WhatsApp conectado, contenido psicoeducativo extenso, foros entre estudiantes ([ADR 0010](decisiones/archivo/0010-modulo-de-permanencia.md)).
