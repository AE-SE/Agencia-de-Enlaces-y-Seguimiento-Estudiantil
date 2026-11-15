# Medición con personas: protocolo y registro

Estado (13 de noviembre de 2026): **preparación**. La medición se aplica del **30 de noviembre al 4 de diciembre de 2026**; sus resultados están pendientes. Este documento es el protocolo de la medición descrita en el [Entregable Parte I](entregable/Entregable_Parte_I.md) (punto 2.3.2, Tablas 3.3 y 3.10 y Anexo 3.A). Reemplaza al guion anterior, pensado para estudiantes de liceo y profesionales de colegios, que ya no corresponde ([ADR 0032](decisiones/0032-agencia-independiente-y-publico-egresado.md)).

Responsables: Alejandro escribe la hoja de registro y la aplica (N13 y N15 de [`plan.md`](plan.md)); Cristóbal entrega la lista fija de pares carrera–institución (N5) y aplica con él; Rafael consigue a las 10 personas (N14), aprueba el protocolo y se ocupa de cualquier señal de riesgo (sección «Si aparece una señal de riesgo»).

## Qué se mide

| Indicador | Qué mide | Meta |
|---|---|---|
| I-OG | Tareas centrales completadas sin ayuda = (tareas sin ayuda ÷ 40) × 100; 10 personas × 4 tareas | **80 % (32 de 40)** |
| I-OE1b | Personas que identifican los cuatro datos de una carrera y explican qué mide su empleabilidad = (personas ÷ 10) × 100 | 8 de 10 |
| I-OE2 | Reducción del tiempo para reunir y comparar = ((mediana en sitios oficiales − mediana con el prototipo) ÷ mediana en sitios oficiales) × 100 | **50 % o más** |
| I-OE3a | Personas que identifican su próximo plazo y una alternativa a su primera opción = (personas ÷ 10) × 100 | 8 de 10 |

El indicador principal es el tiempo (I-OE2). Es una **medición de uso con 10 personas por conveniencia**: describe el orden de magnitud del problema y valida si el prototipo se entiende; no estima el tiempo ni el efecto en la población (Tabla 3.11). Con 10 personas en un diseño pareado solo se detectan diferencias grandes (punto 2.3.2).

Se prueba el sitio, no a la persona. No se evalúan sus conocimientos ni sus decisiones.

## Quiénes participan

- **10 personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años**, hayan ingresado o no a la educación superior (actor 1 de la Tabla 2.2).
- Se invita a más personas de las necesarias. **Plan B** (Tabla 3.12): si no se consiguen 10, se mide con las que lleguen, con un mínimo de 6, y se declara en el informe.
- Se confirma la condición con una sola pregunta: «¿Tienes 18 años o más y egresaste de 4.º medio en los últimos cinco años?». Si la respuesta es no, se agradece y se termina; no se anota nada. No se pregunta ni se registra la edad exacta.
- Solo se publican totales (por ejemplo, cuántas personas han ingresado a la educación superior y cuántas no), nunca ligados a un código de participante.

## Qué se hace en cada sesión

1. **Consentimiento informado** (sección siguiente).
2. **Tarea cronometrada, dos veces** (punto 2.3.2 y Anexo 3.A): la misma tarea con dos pares carrera–institución distintos, una vez en los sitios oficiales y otra vez con el sitio de la agencia.
3. **Las cuatro tareas centrales (T1 a T4)** con el sitio de la agencia.
4. **Cierre** con cuatro preguntas.

Planifica cerca de una hora por persona y ajusta el tiempo con el ensayo previo. Las 5 entrevistas del plan (Tabla 2.2) son otra actividad, con su propio consentimiento y el guion del Anexo 2.B; no se mezclan con esta sesión.

## Consentimiento informado

Antes de empezar, lee este texto y espera una respuesta clara. No se avanza sin un sí.

> Gracias por participar. Estamos probando un sitio, no tus conocimientos. Te voy a pedir que busques y compares datos de una carrera, primero en sitios oficiales y después en nuestro sitio, y que hagas cuatro tareas más. Voy a medir cuánto demoras con un cronómetro y a anotar qué te resulta claro o confuso. Es voluntario: puedes parar cuando quieras, sin dar explicación, y si paras no usamos tus datos. No te voy a pedir tu nombre, RUT, correo ni ningún dato personal, y no voy a grabar audio, video ni pantalla. Los resultados se publican solo agregados. Si usas datos de ejemplo, que sean inventados. ¿Aceptas participar y que anote estas observaciones?

- La aceptación queda por escrito (formulario en papel o digital) **guardado fuera del repositorio y sin relación con el código del participante**. En el registro solo se anota «consentimiento: sí».
- Grabar audio, video o pantalla exige un consentimiento aparte, explícito y opcional. Por defecto no se graba.
- Si la persona no acepta, se termina la sesión y no se registra nada.

## Datos que no se registran

- nombre, RUT, correo, teléfono o dirección;
- edad exacta, colegio, institución donde estudia o estudió, situación económica o de salud;
- puntajes reales ni otros datos reales ingresados durante la sesión (se usan datos inventados);
- audio, video o pantalla, salvo consentimiento aparte.

En el repositorio se usan únicamente los códigos `P1` a `P10`. Si una cita permite reconocer a alguien, se resume sin datos identificables. Nunca se pegan datos de la medición en una IA externa.

## Antes de aplicar la medición (hasta el viernes 27 de noviembre)

- [ ] La versión que se probará está **publicada** y se anotó su dirección y su commit (N13).
- [ ] Existe la **lista fija de pares carrera–institución** (N5): al menos dos pares, cada uno con los cuatro datos disponibles en las fuentes oficiales y en el sitio.
- [ ] Alguien del equipo encontró y anotó, con su fuente, las respuestas correctas de cada par (la «clave»), y otra persona las revisó. Sin clave no se puede decir si un dato es correcto.
- [ ] Hay 10 personas confirmadas (N14), más algunas de reserva.
- [ ] Se hizo un **ensayo** con una persona del equipo o conocida que no participará; sus tiempos no cuentan. Sirve para afinar el texto, el cronómetro y la hoja de registro.
- [ ] El teléfono o computador está listo, sin sesiones abiertas ni datos de otra persona.
- [ ] Quien aplica leyó la sección «Si aparece una señal de riesgo».

## Antes de las tareas: una pregunta de entrada

Pregunta: «Piensa en una carrera que te interese. ¿Qué sabes de ella y qué te falta averiguar?». Anota en pocas palabras solo lo que le falta averiguar, sin ningún dato personal. Sirve para comparar con lo que diga al cierre.

## La tarea cronometrada

**Qué se le pide a la persona:**

> Para esta carrera en estas dos instituciones, encuentra: (1) la empleabilidad al primer año, (2) la duración formal y la duración real, (3) el arancel anual y (4) el puntaje del último seleccionado o el requisito de ingreso. Después dime en cuál de las dos la empleabilidad es mayor. Puedes usar los sitios oficiales que quieras.

Con el sitio de la agencia se pide lo mismo, con el otro par, y la persona solo usa ese sitio.

**Cómo se aplica:**

- El tiempo parte cuando terminas de leer la tarea y se detiene cuando la persona dice «terminé» o a los **20 minutos**, lo que ocurra primero. Si llega a 20 minutos, se anota 20 y «no completó»; esa cifra se declara en el informe, porque acorta el tiempo real.
- No ayudes ni señales dónde mirar. Si la persona se bloquea, pregunta: «¿Qué buscarías ahora?».
- Anota cuántos **sitios distintos** visitó (en la condición con sitios oficiales).
- Al terminar, compara cada dato con la clave: **encontrado** (lo dio) y **correcto** (coincide con la fuente). Un dato con un indicador equivocado (por ejemplo, empleabilidad al segundo año en lugar de al primero) cuenta como encontrado pero no correcto.
- Anota las **búsquedas sin resultado**: qué buscó y no encontró, en cualquiera de las dos condiciones.
- **Primero que sea correcto, después que sea rápido.** Un tiempo corto con datos equivocados no es una mejora. Por eso el informe compara además el tiempo solo entre quienes dieron los cuatro datos correctos en las dos condiciones, y dice cuántas personas entran en esa comparación.

**Orden y pares, para que el aprendizaje y la dificultad de cada carrera no favorezcan a una condición** (Anexo 3.A): hay dos pares de la lista fija, A y B. Cada persona usa uno en cada condición.

| Persona | Primero | Pares |
|---|---|---|
| P1, P5, P9 | Sitios oficiales, luego sitio de la agencia | A en oficiales, B en la agencia |
| P2, P6, P10 | Sitio de la agencia, luego sitios oficiales | B en oficiales, A en la agencia |
| P3, P7 | Sitios oficiales, luego sitio de la agencia | B en oficiales, A en la agencia |
| P4, P8 | Sitio de la agencia, luego sitios oficiales | A en oficiales, B en la agencia |

Así cada orden y cada par quedan en cinco de las diez personas por condición. Si participan menos de 10 (plan B), se reparte lo más parejo posible y se declara.

## Las cuatro tareas centrales (Anexo 3.A)

Se hacen con el sitio de la agencia, una a la vez y después de la tarea cronometrada. El tiempo parte al terminar de leer la tarea. **«Sin ayuda»** significa sin intervención del equipo y en un máximo de **5 minutos** por tarea.

| Tarea | Qué se le pide | Se considera completada sin ayuda cuando… |
|---|---|---|
| **T1** | «Encuentra una carrera que te interese y dime de dónde sale uno de sus datos y de qué fecha es.» | Encuentra una carrera y lee la **fuente y la fecha** de un dato |
| **T2** | «En esa carrera, dime su empleabilidad, su duración, su arancel y qué se pide para ingresar. Y explícame qué mide la empleabilidad.» | Identifica los **cuatro datos** y explica correctamente **qué mide** la empleabilidad (I-OE1b) |
| **T3** | «Compárala con la misma carrera en otra institución y dime cuál tiene mayor empleabilidad.» | Hace la comparación y nombra la institución correcta |
| **T4** | «Deja esa carrera como tu meta y dime cuál es el próximo plazo que te toca y una alternativa a tu primera opción.» | Fija la meta, identifica el **próximo plazo** y **una alternativa** (I-OE3a) |

Qué es «explicar correctamente qué mide la empleabilidad»: el SIES (Servicio de Información de Educación Superior) la define como el porcentaje de titulados que, teniendo información de ingresos, ganaron el sueldo mínimo o más en el primer año tras titularse. La persona no tiene que repetir la definición; basta que entienda que es un porcentaje de titulados y que se mide al primer año. Fuente: *Metodología del Buscador de Empleabilidad e Ingresos 2025-2026* (https://mifuturo.cl/wp-content/uploads/2025/12/Metodologia-Buscador-Empleabilidad-e-Ingresos_2025-2026.pdf).

No corrijas una respuesta durante la tarea. Registra si la completó **sin ayuda**, cuánto tardó y dónde dudó. Si necesitó ayuda o pasó de 5 minutos, no cuenta como completada para el I-OG.

En T4, si ninguna alternativa cumple lo que la persona necesita (por ejemplo, la región), decirlo correctamente cuenta como completada. Un dato que el sitio no tiene se anota como pregunta abierta, no como error de la persona.

## Cierre de la sesión

Pregunta:

1. ¿Qué fue lo más difícil?
2. ¿Hubo alguna palabra o dato que no entendieras?
3. ¿Qué esperabas encontrar y no encontraste?
4. Si pudieras cambiar una cosa, ¿cuál sería?
5. ¿Qué alternativa mantienes abierta y qué dato influyó?
6. ¿Qué vas a hacer después? (un paso concreto)

Con las respuestas 5 y 6 marca tres cosas, sí o no: identificó una alternativa compatible con lo que necesita; pudo mostrar la fuente de un dato; dijo un próximo paso concreto. Que la persona no haya elegido una carrera no es un fracaso: avanzar es saber qué le falta y dónde confirmarlo.

Después de guardar las notas, cierra la sesión del navegador y borra cualquier dato que haya quedado escrito en el dispositivo. Agradece y recuerda que puede pedir que no se use su sesión.

## Si aparece una señal de riesgo

El tema (quedar fuera de estudiar, decidir sin información) puede tocar emociones fuertes. Si durante una sesión o una entrevista la persona dice que no ve salida, que no quiere seguir o que piensa en hacerse daño o quitarse la vida:

1. **Detén la sesión** y deja de cronometrar. La prioridad es la persona, no la medición.
2. **Escucha con calma.** No hagas diagnósticos, no minimices («no es para tanto») y no prometas que todo saldrá bien.
3. **Entrégale los dos números y quédate con ella:** Línea de Prevención del Suicidio **\*4141** (Minsal, gratuita, 24 horas) y Salud Responde **600 360 7777**. Ofrece llamar juntos.
4. Si hay peligro inmediato, no la dejes sola y pide ayuda a una persona cercana que esté presente.
5. **Avisa a Rafael el mismo día**, sin nombres ni datos que identifiquen a la persona. En el registro solo escribe «se aplicó el protocolo de riesgo» con el código; no copies lo que dijo.
6. Pregúntale si quiere continuar otro día. Si no, no se usan sus datos.

Quien aplica no es terapeuta y no debe actuar como tal: orienta y deriva. El texto y el protocolo están pendientes de revisión profesional (riesgo abierto en [`equipo/guia-rafael.md`](equipo/guia-rafael.md)); hasta entonces se aplican tal cual.

## Registro de las sesiones

Dirección probada: pendiente  
Versión o commit: pendiente (si cambia durante la semana, anota con cuál versión hizo cada persona)  
Fechas de aplicación: pendientes (30 de noviembre al 4 de diciembre de 2026)  
Dispositivo y navegador: pendientes

Resumen de la muestra:

| Criterio | Total |
|---|---:|
| Personas que participaron | Pendiente (meta: 10; mínimo del plan B: 6) |
| Han ingresado a la educación superior | Pendiente |
| No han ingresado | Pendiente |
| Sesiones con señal de riesgo (solo el total) | Pendiente |
| Cómo llegaron: por una oficina municipal, por otra persona o por otro canal (solo los totales) | Pendiente |

**Tabla A. Tarea cronometrada.** Una fila por persona y condición.

| Código | Condición | Par | Tiempo (min:s) | Datos encontrados (de 4) | Datos correctos (de 4) | Sitios visitados | ¿Terminó en 20 min? | Dónde dudó |
|---|---|---|---|---|---|---|---|---|
| P1 | Sitios oficiales | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| P1 | Sitio de la agencia | Pendiente | Pendiente | Pendiente | Pendiente | No aplica | Pendiente | Pendiente |

(Repite el par de filas para P2 a P10.)

**Tabla B. Tareas centrales.** Una fila por persona y tarea.

| Código | Tarea | ¿Sin ayuda? | Tiempo (min:s) | Punto de duda u observación |
|---|---|---|---|---|
| P1 | T1 | Pendiente | Pendiente | Pendiente |
| P1 | T2 | Pendiente | Pendiente | Pendiente |
| P1 | T3 | Pendiente | Pendiente | Pendiente |
| P1 | T4 | Pendiente | Pendiente | Pendiente |

(Repite las cuatro filas para P2 a P10.)

**Tabla C. Entrada y cierre.** Una fila por persona, sin datos personales.

| Código | Qué le faltaba averiguar al inicio | ¿Alternativa compatible? | ¿Mostró la fuente de un dato? | ¿Próximo paso concreto? | Búsquedas sin resultado |
|---|---|---|---|---|---|
| P1 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

(Repite la fila para P2 a P10.)

## Informe de resultados

Sesiones completadas: **0 de 10**.

### Resumen contra las metas

| Indicador | Resultado | Meta | ¿Se cumplió? |
|---|---|---|---|
| I-OG: tareas sin ayuda | Pendiente de 40 | 32 de 40 (80 %) | Pendiente |
| I-OE1b: identifican los cuatro datos y explican la empleabilidad | Pendiente de 10 | 8 de 10 | Pendiente |
| I-OE2: reducción de la mediana del tiempo | Pendiente | 50 % o más | Pendiente |
| I-OE3a: identifican su próximo plazo y una alternativa | Pendiente de 10 | 8 de 10 | Pendiente |

| Medida de la tarea cronometrada | Sitios oficiales | Sitio de la agencia |
|---|---|---|
| Mediana del tiempo | Pendiente | Pendiente |
| Mínimo y máximo | Pendiente | Pendiente |
| Personas que terminan dentro de 20 minutos | Pendiente | Pendiente |
| Datos correctos (de 40) | Pendiente | Pendiente |
| Mediana del tiempo, solo personas con los cuatro datos correctos en ambas condiciones (y cuántas son) | Pendiente | Pendiente |

**Regla de lectura.** Si el sitio de la agencia resulta más rápido pero con más datos incorrectos, el ahorro de tiempo no se usa como argumento: primero se corrigen etiquetas, unidades y alcance, y se vuelve a medir.

| Al cierre | Personas (de 10) |
|---|---:|
| Identificaron una alternativa compatible | Pendiente |
| Mostraron la fuente de un dato | Pendiente |
| Dijeron un próximo paso concreto | Pendiente |

| Tarea | Personas que la completaron sin ayuda | Tiempo mediano | Dificultad más frecuente |
|---|---:|---|---|
| T1 Encontrar una carrera y leer su fuente y fecha | Pendiente | Pendiente | Pendiente |
| T2 Cuatro datos y qué mide la empleabilidad | Pendiente | Pendiente | Pendiente |
| T3 Comparar con otra institución | Pendiente | Pendiente | Pendiente |
| T4 Meta, próximo plazo y alternativa | Pendiente | Pendiente | Pendiente |

### Problemas y arreglos propuestos

Ordena los problemas por gravedad:

- **Grave:** impide completar una tarea, muestra un dato incorrecto o expone datos personales.
- **Moderada:** la persona completa la tarea solo con ayuda o se equivoca de dato.
- **Leve:** la completa sin ayuda pero con confusión.

| Gravedad | Problema observado | Evidencia anónima | Arreglo propuesto | Rama de corrección | Estado (corregido, aplazado con motivo o descartado) |
|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

### Limitaciones que el informe debe declarar

- Muestra por conveniencia de 10 personas: valida el uso y da una primera medida del problema; no estima el tiempo ni el efecto en la población.
- Quien participa sabe que lo están midiendo, y la tarea es de laboratorio: no reproduce la búsqueda real, que se hace en varios días.
- Las personas que llegaron al máximo de 20 minutos quedan registradas con 20, lo que acorta el tiempo real de los sitios oficiales.
- Si se aplicó el plan B (menos de 10 personas), se dice.
- Si la versión del sitio cambió durante la semana, se dice con cuántas personas.

## Cierre de la medición

Se considera terminada cuando:

- [ ] participaron 10 personas (o se declaró el plan B, con un mínimo de 6);
- [ ] las dos tareas cronometradas y las cuatro tareas centrales de cada persona tienen resultado y tiempo;
- [ ] se calcularon I-OG, I-OE1b, I-OE2 e I-OE3a contra sus metas;
- [ ] los datos de cada tarea cronometrada se compararon con la clave y otra persona revisó la comparación;
- [ ] el registro no contiene datos identificables;
- [ ] los consentimientos están guardados fuera del repositorio;
- [ ] los problemas están ordenados por gravedad.

## Después de la medición (4 al 17 de diciembre)

El desarrollo de funciones terminó el 27 de noviembre y todo quedó en `main` el 1 de diciembre. Esta ventana sirve para corregir, probar y documentar, no para agregar funciones ([`plan.md`](plan.md)).

| Fecha | Paso | Responsable | Criterio de aceptación |
|---|---|---|---|
| **Vie 4 dic** | Termina la última sesión; cada problema se anota con tarea, gravedad y arreglo propuesto | Alejandro y Cristóbal | Todos los problemas en el registro, sin datos identificables |
| **7 al 11 dic** | Correcciones en ramas `fix/…`, por gravedad (interfaz: Alejandro; datos y textos: Cristóbal). Revisión de PR el martes 8 y el viernes 11 | Alejandro y Cristóbal; Rafael aprueba | Cada hallazgo con estado: corregido, aplazado con motivo o descartado |
| **Mar 15 dic** | Último PR de código | Todos | `main` congelado en lo funcional |
| **14 al 17 dic** | Informe de la medición: tareas, resultados, hallazgos, correcciones hechas y no hechas, limitaciones | Alejandro y Cristóbal (R), Rafael (A) | Informe sin marcas `[COMPLETAR]`; el jueves 17 no se fusiona código |

**Qué es una mejora leve:** no agrega pantallas, tablas ni dependencias y cabe en un PR de menos de 150 líneas. Lo que no cumpla eso pasa a la lista de proyección. Un dato incorrecto o un texto que lleva a un dato equivocado se corrige siempre, aunque sea un caso grave.
