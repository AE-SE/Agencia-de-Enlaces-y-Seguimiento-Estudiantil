# Guía de Cristóbal · Datos y contenido

> **Para la IA que acompaña a Cristóbal:** este documento es tu hoja de ruta hasta el entregable del **19 de diciembre de 2026**. Antes de proponer cualquier cosa, lee `AGENTS.md`, `docs/equipo/README.md`, [`docs/plan.md`](../plan.md), `docs/fuentes.md` y la skill indicada en cada tarea. **Nunca inventes un dato, una fecha, un monto ni una fórmula**: si no tienes la fuente oficial delante, escribe `TODO(fuente)` y avisa. **Solo fuentes oficiales, primarias o académicas**: nunca prensa, blogs ni calculadoras de terceros. Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`.

Estado verificado el **13 de noviembre de 2026** con `gh pr list` (solo lectura).

> **Giro del 13 de noviembre (ADR 0032).** Ya no hay panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares ni piloto en liceos. Ahora el sitio es para toda persona que egresa de 4.º medio y no ha ingresado a la educación superior, y su dato central es la **comparación de cada carrera** (empleabilidad frente a la misma carrera en otras instituciones y a su área, duración formal frente a real, vacantes, arancel). Todo eso sale de tus datos. Lo que ya cargaste **sigue valiendo**. Las tareas nuevas son N1 a N5 y N15.

---

## 1. Qué se entrega y qué te toca

El producto del 19 de diciembre (ADR 0032, Entregable Parte I): un sitio gratuito y sin cuenta que reúne los datos oficiales de cada carrera y los deja comparables, y una medición con 10 personas. **Todo lo que el sitio afirma sale de tus datos**, y por eso eres el responsable del primer objetivo.

Según la Matriz RACI (Tabla 3.8) y los entregables (Tabla 3.10):

| Tarea | Tu papel | Entregable y criterio de aceptación | Fecha |
|---|---|---|---|
| Datos oficiales de cada carrera (OE1) | **R** (Rafael aprueba) | Vista de carrera con empleabilidad comparada, duración, arancel, requisitos y vacantes; cada dato con fuente, enlace, fecha y qué mide; lo calculado por el equipo, rotulado «elaboración propia» | 27 nov |
| Cálculo del puntaje ponderado (OE1) | **R** | Casos verificados contra la fuente oficial, todos aprobados | 27 nov |
| Comparación y explicación de cada cifra | **C** (consultado; Alejandro ejecuta) | Que lo que se muestre coincida con tus datos | 25 nov |
| Calendario de admisión y de beneficios, y preguntas frecuentes (OE3) | **R** | Cada plazo y cada respuesta con fuente y fecha de vigencia (I-OE3b: 100 %) | 27 nov |
| Encuesta, medición de tiempo y entrevistas | **R** (con Alejandro) | Registro de la medición | 4 dic |
| Informe y presentación | **R** (con Alejandro; Rafael aprueba) | Entrega completa | 19 dic |
| Indicadores I-OE1a, I-OE3b (Anexo 3.A) | Responsable | 100 % de los datos mostrados con fuente, enlace y fecha | 27 nov |

**No te toca** (pídeselo a quien corresponde): pantallas y estilos → Alejandro; esquema de la base de datos, claves, RLS, criterio de alternativas cercanas → Rafael. Las 12 partes de la identidad visual Andén urbano (PR 157 a 168) siguen su curso con tu autoría.

**Por qué este rol es crítico:** un dato equivocado sobre una carrera puede cambiar la decisión de vida de alguien. La plataforma solo vale si se puede confiar en ella.

---

## 2. Tu hoja de ruta, semana por semana

| Semana | Qué entregas | Criterio de aceptación |
|---|---|---|
| **S2 (10 al 16 nov)** | Cerrar el PR 96 (cita de la fórmula oficial del ranking 2027). Seguir con las partes de la identidad visual (PR 157 a 168) | Fórmula citada con documento y página del DEMRE |
| **S3 (17 al 23 nov)** | **N1** empleabilidad y duración con la comparación (vie 20); **N3** calendario de admisión (vie 20); **N2** vacantes, arancel y postulaciones (lun 23) | 100 % con fuente, enlace y fecha; lo calculado, rotulado «elaboración propia» |
| **S4 (24 al 27 nov)** | **N4** preguntas frecuentes (mié 25); **N5** lista fija de pares para la medición (vie 27); casos del puntaje ponderado (C15) y hitos del FUAS (C16) | **Vie 27 nov: congelamiento de funciones.** Ningún dato nuevo después de esta fecha, salvo corrección de un error |
| **S5 (30 nov al 4 dic)** | **N15:** aplicar la medición con Alejandro y las 5 entrevistas. **Mar 1 dic: todo fusionado a `main`** | Registro completo; hallazgos de datos y textos entregados a Rafael el vie 4 dic |
| **S6 (7 al 11 dic)** | Corregir los hallazgos de datos y textos (`fix/…`, `datos/…`); **verificación de datos con fuente** sobre el sitio publicado (C12 final) | 100 % de los datos mostrados con fuente, enlace y fecha el vie 11 dic; coincidencia 100 % en la muestra |
| **S7 (14 al 17 dic)** | **Informe de datos** (C13) e informe de la medición con Alejandro; ensayo de la presentación. Último PR de código el mar 15 dic | Informes sin marcas `[COMPLETAR]` el mié 16 dic |
| **Cierre (18 y 19 dic)** | Presentación | Entrega el 19 de diciembre |

**Cómo se usa la ventana del 1 al 17 de diciembre:** el desarrollo de funciones termina el 27 de noviembre y el 1 de diciembre todo debe estar en `main`. Esas semanas son para verificar y pulir, no para cargar datos nuevos ni terminar lo pendiente. Una mejora leve de la ficha cambia textos, etiquetas, orden de lo que ya se muestra o corrige un dato contra su fuente; cabe en un PR de menos de 150 líneas y no agrega tablas ni dependencias. Un dato que no se pueda verificar en una fuente oficial se retira, no se deja con `TODO`. Revisiones de PR: martes 24 de noviembre y 1, 8 y 15 de diciembre; viernes 27 de noviembre y 4 y 11 de diciembre.

---

## 3. Estado de tus tareas (según los PR)

| Tarea | Estado | Referencia |
|---|---|---|
| C1 a C4 · Términos de uso, descargas, diccionario de datos, datos de ejemplo | **Hechas y fusionadas** (histórico) | PR 16, 22, 59, 60 |
| C5 · Carga de oferta; C6 · Empleabilidad e ingresos (SIES) | Fusionadas | PR 39, 40, 45 |
| C8 · Ponderaciones, vacantes y puntajes de corte (DEMRE 2027) | Fusionada; el PR 62 se cerró y lo reemplazó el **PR 92** (verificación) y el PR 144 (recupera filas partidas) | PR 43, 92, 144 |
| C7 · Validación del Puntaje Ranking (ingreso manual, ADR 0024) | **Fusionada** (PR 61). **Falta el PR 96**, que cita la fórmula oficial del ranking 2027: está **abierto** | PR 61; **PR 96** |
| C9 · Beneficios y plazos; C9b · Corpus del asistente; C10 · Textos | Fusionados | PR 48, 50, 56 |
| C11 · Guion de pruebas con usuarios | Guion fusionado (PR 58). **Reemplazado el 13-nov** por el protocolo de la medición con 10 personas | [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md) |
| Nombres de carreras con fuente oficial | Fusionado | PR 109 |
| Tokens de Andén urbano (ADR 0029) | Fusionado (tuyo) | PR 151, 156 |
| Identidad visual Andén urbano, partes 1 a 12 | **Abiertos**, en revisión | PR 157 a 168 |
| C12 · Verificación cruzada final | **Pendiente** | — |
| C13 · Informe de datos | **Pendiente.** Se escribe del 14 al 16 dic y se integra al informe del 19 dic: fuentes, método de verificación, resultados de la muestra, datos no disponibles y limitaciones | — |
| C14 · Calendario de la admisión | **Pasa a ser N3** (vie 20 nov) | `plan.md` |
| N1 a N5, N15 | **Nuevas** (sección 4) | `plan.md` |

---

## 4. Tareas con criterios de aceptación

### N1 · Empleabilidad al 1.er año y duración real, con la comparación (vie 20 nov)
**Skill:** `datos-oficiales` · **Rama:** `datos/empleabilidad-y-duracion`

Qué dice cada fuente (verificado el 13 de noviembre): el SIES publica empleabilidad al 1.er año **por carrera genérica e institución**; **no publica un promedio por área**. La comparación con «la misma carrera en otras instituciones» (mínimo, mediana y máximo) y con «su área» es **cálculo nuestro** y se rotula «elaboración propia». Definición oficial: porcentaje de titulados que, teniendo información de ingresos, ganaron el sueldo mínimo o más en el primer año tras titularse (*Metodología del Buscador de Empleabilidad e Ingresos 2025-2026*, https://mifuturo.cl/wp-content/uploads/2025/12/Metodologia-Buscador-Empleabilidad-e-Ingresos_2025-2026.pdf).

1. **Primero, resuelve el riesgo de las condiciones de uso.** La descarga masiva del buscador pide registro y no se encontraron sus condiciones de uso. Revisa qué pide el registro, busca los términos de uso del sitio de mifuturo.cl y anota en `docs/fuentes.md` lo que encuentres, con fecha. Si no hay condiciones publicadas, dilo tal cual y avísale a Rafael antes de publicar una carga nueva. No automatices la lectura de páginas web (AGENTS.md 2.1). Plan B de la Tabla 3.12: cargar a mano de 5 a 10 carreras reales con su fuente.
2. Revisa lo ya cargado (`datos/cargar_empleabilidad.py`, PR 40 y 45) y qué archivo y año usó, para no duplicar.
3. La duración formal y la duración real salen de la base de **Oferta Académica del SIES** (https://www.mifuturo.cl/bases-de-datos-de-oferta-academica/); es la misma base de N2.
4. Calcula, para cada carrera genérica, el **mínimo, la mediana y el máximo** de la empleabilidad al 1.er año entre las instituciones que la imparten, y la cifra de **su área** con la clasificación de área que traiga el SIES. Si la clasificación no viene en los archivos, deja `TODO(fuente)`.
5. Reglas del cálculo: una celda sin dato o suprimida por el SIES **no cuenta como 0**: queda fuera del cálculo y se muestra el motivo (ADR 0025). Guarda también **cuántas instituciones entran** al cálculo; con una sola, no hay comparación y se escribe «Sin datos suficientes».
6. Guarda todo con fuente, URL, período que mide («empleabilidad al 1.er año»), año de titulación y fecha de descarga. Lo calculado lleva el campo «elaboración propia» y una línea de cómo se calculó.
7. El script debe poder correrse dos veces con el mismo resultado y tener pruebas. Actualiza `docs/fuentes.md`, `datos/registro_descargas.md` y `docs/datos/diccionario.md`.

- [ ] Condiciones de uso revisadas y documentadas antes de publicar.
- [ ] Cada valor con fuente, URL, período y fecha; nada de empleabilidad al 2.º año mezclada con la del 1.er año.
- [ ] Toda cifra calculada rotulada «elaboración propia», con método y número de instituciones.
- [ ] Ningún valor faltante convertido en 0.
- [ ] 10 carreras al azar contrastadas con la fuente por otra persona (no quien cargó).

### N2 · Vacantes, arancel y postulaciones (lun 23 nov)
**Skill:** `datos-oficiales` · **Rama:** `datos/vacantes-arancel-postulaciones`

Fuentes: vacantes y arancel, base de **Oferta Académica del SIES**; postulaciones, **bases abiertas del DEMRE** (Archivo D).

1. Descarga la base de Oferta Académica del SIES, regístrala en `datos/registro_descargas.md` y verifica **vacantes y arancel** contra la fuente en 10 programas al azar. Lee siempre el archivo original con el script; no lo abras ni lo guardes en Excel.
2. **Postulaciones.** Lee primero las condiciones de uso de los datos abiertos del DEMRE (https://demre.cl/portales/condiciones-uso-informacion-datos-abiertos). Lo verificado el 13 de noviembre: el Archivo D es a nivel de persona, con identificador anónimo; se eliminan los subgrupos de menos de 8 casos; las cifras pueden no cuadrar con las oficiales; hay que citar «Datos abiertos DEMRE»; y **está prohibido intentar identificar postulantes**.
3. El archivo de postulaciones **no se sube al repositorio**. Se agrega en memoria y solo se escriben totales por carrera (mismo criterio del ADR 0009 con la matrícula).
4. Decide, y deja por escrito en `docs/fuentes.md`, si las postulaciones se pueden mostrar bien (solo carreras del sistema centralizado, cifras con la nota de que pueden no cuadrar con las oficiales, nada de celdas con menos de 8 casos). **Si no se puede mostrar bien, se documenta el motivo y no se muestra.**
5. Si se muestran, la cifra lleva «Datos abiertos DEMRE», el año y qué mide («postulantes», no «demanda»).

- [ ] Vacantes y arancel verificados en la muestra, con fuente, URL y fecha.
- [ ] Decisión sobre las postulaciones documentada: se muestran con sus condiciones, o no se muestran y se dice por qué.
- [ ] Ningún dato de nivel persona en el repositorio; ningún intento de identificar a alguien.

### N3 · Calendario de admisión 2027 (vie 20 nov)
**Skill:** `datos-oficiales` · **Rama:** `datos/calendario-admision-2027`

Es la antigua tarea C14. Fuente: Subsecretaría de Educación Superior (https://acceso.mineduc.cl) y DEMRE.
1. Mira la forma de `datos/beneficios/plazos_2027.json` y úsala como modelo.
2. Crea `datos/calendario/` con las fechas de la admisión 2027 (PAES, resultados, postulación, matrícula), cada una con fuente, URL, fecha de consulta y fecha de vigencia.
3. Una fecha no publicada queda en `null` con su motivo; **nunca** se estima por el año anterior.
4. El campo `estacion` (para el indicador de etapas) solo se agrega si Rafael confirma la decisión pendiente del indicador (A15). Si no la ha tomado, déjalo fuera.
- [ ] Cada fecha con fuente, URL, fecha de consulta y fecha de vigencia (I-OE3b: 100 %).
- [ ] 3 fechas revisadas por otra persona, con su nombre y fecha en el PR.

### N4 · Preguntas frecuentes (mié 25 nov)
**Skills:** `lenguaje-claro`, `datos-oficiales` · **Rama:** `datos/preguntas-frecuentes`

1. Escribe de 10 a 15 preguntas que haría alguien que egresa. Temas posibles: qué mide la empleabilidad, diferencia entre duración formal y real, qué es el Formulario Único de Acreditación Socioeconómica (FUAS), qué es el puntaje ponderado y el puntaje de corte, qué pasa si no ingreso este año. Son ideas, no respuestas: cada respuesta sale de una fuente oficial.
2. Cada respuesta lleva fuente, URL, fecha de consulta y fecha de vigencia, en un archivo de datos versionado (confirma la ubicación con Alejandro y Rafael).
3. Pásalas por `lenguaje-claro`: español de Chile, tuteo, siglas explicadas la primera vez, sin «vulnerable», «pobreza» ni «clase social».
4. No digas que la gente no ingresa *por* desinformación ni que quedar fuera *causa* problemas de salud mental. Evita preguntas de salud mental; si una la exige, va con la nota «pendiente de revisión profesional».
5. Entrégaselas a Alejandro el miércoles 25, que arma la página (N11).
- [ ] 10 a 15 preguntas, cada una con fuente y fecha de vigencia (100 %).
- [ ] Revisadas por otra persona antes de fusionar.

### N5 · Lista fija de pares carrera–institución para la medición (vie 27 nov)
**Skill:** `datos-oficiales` · **Depende de:** N1 y N2 · **Con:** Alejandro (N13)

1. Elige **al menos dos pares** (A y B): cada par es una carrera en dos instituciones, y las carreras de A y B son distintas. Si puedes, deja pares de reemplazo.
2. Para cada par, comprueba que las cuatro piezas de la tarea existen **en los sitios oficiales y en el sitio de la agencia**: empleabilidad al 1.er año, duración formal y real, arancel anual, y puntaje del último seleccionado o requisito de ingreso. Un par al que le falte una no sirve.
3. Escribe la **clave**: los cuatro datos de cada institución, con fuente, URL y fecha.
4. Pide a otra persona que revise la clave contra las fuentes.
5. Entrega la lista a Alejandro el viernes 27 para su hoja de registro.
- [ ] Pares con los cuatro datos en ambas instituciones y en ambas condiciones.
- [ ] Clave con fuente y fecha, revisada por otra persona.

### C7b · Cerrar el PR 96: cita de la fórmula oficial del ranking 2027
**Skill:** `datos-oficiales` · **Fecha:** viernes 13 nov (el PR sigue abierto)

Cita la ecuación del Puntaje Ranking con documento, página o sección del DEMRE, y agrega a las pruebas un caso con ejemplo publicado por DEMRE. Si no puedes leer el documento, deja `TODO(fuente)` y dilo en el PR.
- [ ] Cada fórmula cita su documento oficial y año de admisión.
- [ ] Las pruebas con casos oficiales pasan (`lib/calculos/2027/`).
- [ ] Ninguna ponderación escrita en el código: vienen de los datos.

### C15 · Puntaje ponderado: casos verificados (OE1, 27 nov)
**Criterio de la Tabla 3.10:** «Casos verificados contra la fuente oficial, todos aprobados».
- Reúne al menos 5 casos de carreras reales (distintas pruebas electivas, una con requisitos mínimos), cada uno con su fuente, URL y fecha; comprueba que el simulador (ya en `main`) y `lib/calculos/2027/` den el mismo resultado.
- Quien revisa no es quien cargó los datos.
- [ ] Todos los casos coinciden o el desacuerdo está explicado en el PR.

### C12 · Verificación cruzada (I-OE1a, 27 nov y 11 dic)
**Rama:** `datos/verificacion-final`
- Elige 30 fichas de carrera al azar **en el sitio publicado**.
- Compara cada cifra mostrada con su fuente oficial. Confirma que las celdas sin dato o suprimidas dicen por qué ([ADR 0025](../decisiones/0025-celdas-suprimidas-visibles-sin-cifra.md)), que nunca aparece un 0 falso y que las cifras calculadas dicen «elaboración propia».
- Informe en `docs/datos/verificacion.md`: cifras revisadas, correctas, errores y su corrección.
- **Meta: 100 % de coincidencia y 100 % de los datos mostrados con fuente, enlace y fecha el 27 de noviembre**, y de nuevo sobre el sitio publicado el 11 de diciembre. Cualquier error se corrige antes.

### C16 · Hitos del FUAS 2027 (OE3, 27 nov)
Alejandro construye la guía y el calendario; tú garantizas los datos.
- Revisa `datos/beneficios/plazos_2027.json` y `beneficios_2027.json` contra el portal de Beneficios Estudiantiles (Mineduc), hito por hito.
- Una fecha no publicada queda en `null` con su motivo; **nunca** se estima por el año anterior.
- [ ] Cada hito con fuente, URL, fecha de consulta y fecha de vigencia (100 %).
- [ ] 3 hitos revisados por otra persona, con su nombre y fecha anotados en el PR.
- [ ] Los requisitos que dependen de la situación personal dicen «podrías», nunca prometen.

### C10 · Revisión de textos (durante todo el proyecto)
**Skill:** `lenguaje-claro`
- Cada vez que Alejandro termina una pantalla, revisas sus textos y le entregas los cambios. Para la medición, que no queden siglas sin explicar la primera vez ni términos que estigmaticen.
- Mantén `docs/datos/glosario.md`: palabra oficial → explicación simple.

### N15 · Aplicar la medición y las 5 entrevistas (30 nov al 4 dic)
**Con:** Alejandro · **Protocolo:** [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md)

Tu parte: comparar con la clave de N5 los cuatro datos que encuentra cada persona (cuántos encontró y cuántos son correctos), anotar los sitios que visita, cronometrar cuando conduce Alejandro y conducir cuando él anota. Los hallazgos de datos y textos van a Rafael el viernes 4 de diciembre, con gravedad y arreglo propuesto. Un dato incorrecto o un texto que lleva a un dato equivocado se corrige siempre, aunque sea un caso grave.
- [ ] Cada sesión con datos correctos contrastados con la clave.
- [ ] Nada que identifique a alguien en el repositorio; «P1 … P10».
- [ ] Si aparece una señal de riesgo, se aplica el protocolo de `pruebas-usuarios.md` y se avisa a Rafael el mismo día.

### Encargo del líder del 10 de noviembre: pulir la página publicada
**Rama:** `fix/pulido-contenido-portal` · **Skills:** `datos-oficiales`, `lenguaje-claro`

Que cada página publicada quede impecable en datos y textos: ninguna cifra sin fuente, ninguna frase confusa.
1. Recorre cada página en el sitio publicado, desde el teléfono (o a 360 px) y con teclado.
2. Datos: toda cifra con fuente, URL, período y fecha; compara al menos 10 cifras al azar con su fuente (distintas de las que cargaste tú).
3. Textos: pásalos por `lenguaje-claro`. Indica siempre qué mide cada indicador y el año; ninguna comparación mezcla indicadores o períodos distintos.
4. Registra los hallazgos en el PR en una tabla: página, problema, gravedad, corrección. Lo visual se lo entregas a Alejandro; **tú no lo cambias**.
- [ ] Páginas recorridas a 360 px y con teclado. Lo ya corregido por los PR 116 a 128 no se repite: verifica antes.

### Tareas retiradas el 13 de noviembre (ADR 0032)

| # | Tarea | Estado |
|---|---|---|
| C11 | Pruebas con 5 estudiantes y 2 profesionales de colegios | **Retirada el 13-nov: ADR 0032.** La reemplazan el protocolo de [`pruebas-usuarios.md`](../pruebas-usuarios.md) y N15 |
| — | Metas de carrera, ponderaciones y hitos del FUAS «que usa el panel» (congelamiento del 27 nov) | **Retirada el 13-nov: ADR 0032.** Ya no hay panel; los datos siguen sirviendo a la ficha y al calendario |
| — | Autorizaciones de tutores y carta a colegios (gestionadas por Rafael) | **Retirada el 13-nov: ADR 0032** |

---

## 5. La medición (30 de noviembre al 4 de diciembre): tú aplicas con Alejandro

El protocolo, el consentimiento, el registro y el procedimiento ante una señal de riesgo están en [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md), alineado al punto 2.3.2 y al Anexo 3.A del entregable.

- **Muestra:** 10 personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años (Rafael las consigue). Plan B: un mínimo de 6, declarándolo.
- **Tarea cronometrada:** cuatro datos de una carrera en dos instituciones, en sitios oficiales y con el sitio de la agencia, con orden y pares alternados; máximo 20 minutos.
- **Cuatro tareas centrales:** T1 encontrar una carrera y leer la fuente y la fecha; T2 empleabilidad, duración, arancel y requisito, y qué mide la empleabilidad; T3 comparar con otra institución; T4 meta, próximo plazo y alternativa. Meta: **32 de 40 sin ayuda**.
- **Privacidad:** sin nombres, RUT, correo, colegio ni datos reales en el repositorio; «P1 … P10». No grabes audio, video ni pantalla sin consentimiento explícito y aparte.
- **Hallazgos:** entrégalos a Rafael el viernes 4 de diciembre, con gravedad y arreglo propuesto; las correcciones se hacen del 7 al 11 de diciembre.
- **Informe (14 al 17 dic, entrega el 19):** problemas por gravedad y arreglo propuesto; con Alejandro, cada problema aceptado se convierte en una rama `fix/…`. Declara las limitaciones: muestra por conveniencia, sin estimar efectos.

---

## 6. Qué quedó fuera del alcance, y por qué

**Ya no se hace** (ADR 0032): panel de seguimiento para colegios, consentimiento para compartir con el colegio, autorización de tutor, encuesta a escolares, cartas y convenios con liceos, fundación.

**Queda diseñado, sin construir en este período:** cuenta con correo, cuestionario de intereses vocacionales, simulación de beneficios, asistente conversacional, noticias de educación superior, tablero público de transparencia e informes de datos.

No trabajes en: **permanencia en educación superior, pulso de check-in y predicción o riesgo de deserción.** Se descartaron como objetivos por falta de evidencia o de capacidad del equipo (entregable 3.1) y quedan como proyección. Sus ADR y documentos de evidencia (`docs/evidencia-permanencia.md`) se conservan como historia.

---

## 7. Lo que debes dominar (40 minutos, una vez)

1. [`AGENTS.md`](../../AGENTS.md), sobre todo la sección 2.1 (datos oficiales) y 2.2 (privacidad).
2. [`docs/fuentes.md`](../fuentes.md): el catálogo de fuentes que mantienes.
3. [`.claude/skills/datos-oficiales/SKILL.md`](../../.claude/skills/datos-oficiales/SKILL.md) y [`.claude/skills/lenguaje-claro/SKILL.md`](../../.claude/skills/lenguaje-claro/SKILL.md).
4. [`docs/arquitectura.md`](../arquitectura.md), secciones 3 (modelo de datos) y 6 (flujo de datos oficiales).

**Cinco reglas que guían todo tu trabajo:**
1. **Sin fuente no hay dato.** Cada valor guarda fuente, URL exacta, período que mide y fecha de descarga.
2. **Sin dato no es cero.** Si la fuente no publica un valor, se guarda `null` con el motivo.
3. **No mezclar peras con manzanas.** Empleabilidad al 1.er y al 2.º año son indicadores distintos; titulados 2022 y 2023, períodos distintos.
4. **Lo calculado por nosotros se dice.** Toda cifra que no publica un organismo se rotula «elaboración propia» y dice cómo se calculó.
5. **Repetible.** Todo script se puede correr dos veces y deja el mismo resultado.

### Las fuentes con las que trabajas

| Qué necesitamos | Fuente | Dónde buscar | Notas |
|---|---|---|---|
| Oferta de carreras, duración formal y real, vacantes y arancel | **SIES (mifuturo.cl)**, base de Oferta Académica | https://www.mifuturo.cl/bases-de-datos-de-oferta-academica/ | Y **Datos Abiertos Mineduc** ("Matrícula en educación superior"): la base de matrícula viene con una fila por estudiante, se agrega en memoria y solo se escriben totales por carrera ([ADR 0009](../decisiones/0009-fuente-de-oferta-academica.md)). **No usar el CNED** hasta que autorice por escrito: sus condiciones prohíben el uso comercial. |
| Empleabilidad e ingresos por carrera e institución | **SIES, Mineduc** (Buscador de Empleabilidad e Ingresos) | https://www.mifuturo.cl y la metodología 2025-2026 (enlace en N1) | Publica empleabilidad al 1.er año por carrera genérica e institución; **no** promedios por área. La descarga masiva pide registro y no se encontraron sus condiciones de uso: se resuelve en N1. |
| Postulaciones por carrera | **DEMRE**, bases abiertas (Archivo D) | https://demre.cl/portales/condiciones-uso-informacion-datos-abiertos | Nivel persona con identificador anónimo; subgrupos de menos de 8 casos eliminados; citar «Datos abiertos DEMRE»; prohibido identificar postulantes. |
| Ponderaciones, vacantes y carreras del Sistema de Acceso | **DEMRE** | https://demre.cl/publicaciones | Admisión 2027 es el proceso en curso. |
| Puntajes de corte | **DEMRE** | https://demre.cl/publicaciones | Se muestran siempre como «del año anterior». |
| Fórmula del puntaje ranking y del ponderado | **DEMRE** | Documentos oficiales del proceso | Se copia del documento oficial y se cita en el código. |
| Acreditación institucional | **CNA** | https://www.cnachile.cl | Años y fecha de término. |
| Gratuidad, becas, créditos, FUAS y plazos | **Mineduc**, Beneficios Estudiantiles | https://portal.beneficiosestudiantiles.cl | Carga a mano con URL y fecha hasta revisar sus términos de uso. |
| Calendario del proceso de admisión | **Subsecretaría de Educación Superior** | https://acceso.mineduc.cl | Fechas de PAES, resultados y postulación. |
| Magnitud del problema (egreso y no ingreso) | **SIES**, *Acceso a la Educación Superior en Chile 2026* | https://www.mifuturo.cl | Para el entregable; cita el documento, no una nota de prensa. |

**Cuidado con las fuentes secundarias:** diarios, blogs, calculadoras de puntaje de terceros y foros sirven, como máximo, para *encontrar* el documento oficial; nunca son fuente del dato ni de una cita en el entregable.

---

## 8. Antes de abrir cada PR

- [ ] La tarea cumple **todos** sus criterios de aceptación.
- [ ] Cada dato nuevo tiene fuente, URL, período y fecha.
- [ ] Lo calculado por el equipo está rotulado «elaboración propia».
- [ ] Ningún archivo crudo ni dato personal en el PR.
- [ ] Ningún valor faltante convertido en 0.
- [ ] Los scripts son repetibles y tienen pruebas.
- [ ] `docs/fuentes.md` y `datos/registro_descargas.md` actualizados si usaste una fuente nueva.
- [ ] Plantilla del PR completa, incluida la IA que usaste.
- [ ] Leíste y entiendes todo el código, incluido el que escribió tu IA.

**Texto base para tu IA:**
> Lee AGENTS.md, la skill datos-oficiales y la tarea [código] de docs/equipo/guia-cristobal.md. Te voy a pegar los textos oficiales con sus URL. Ordénalos en el formato indicado y dime cuáles no traen fuente, período o fecha. No completes, estimes ni inventes ningún valor, y no uses fuentes que no sean oficiales, primarias o académicas. Lo que calcules tú se rotula «elaboración propia». No pegues filas a nivel de persona (como el Archivo D del DEMRE) ni datos de la medición en esta conversación.

## 9. Errores comunes que hacen rechazar un PR

| Error | Por qué se rechaza | Cómo evitarlo |
|---|---|---|
| Dato copiado de un diario o calculadora de terceros | No es fuente oficial | Buscar el documento oficial y citarlo |
| Valor ausente guardado como 0 | Información falsa | `null` + motivo |
| Cifra calculada por el equipo presentada como del SIES | Atribuye al organismo algo que no publicó | «Elaboración propia» y método |
| Fórmula escrita «de memoria» o por la IA | Puede estar mal y nadie lo notaría | Copiar del documento oficial del DEMRE y citarlo |
| Ponderaciones escritas en el código | Cambian cada año | Vienen de los datos |
| Archivo de Excel abierto y guardado de nuevo | Excel borra ceros a la izquierda de los códigos | Leer siempre el archivo original con el script |
| Subir al repositorio el Archivo D o un archivo a nivel de persona | Datos de personas | Agregar en memoria y subir solo totales |
| Mezclar períodos o indicadores en una comparación | Engaña a quien lee | Mostrar el período y advertir |
| Verificar tus propias filas | No es revisión independiente | Pedir a otra persona 5 filas al azar |
| Nombres reales en la medición | Privacidad | «P1, P2…» |

---

## Anexo histórico: tareas ya hechas (3 al 10 de noviembre)

Registro de lo que se hizo; el detalle y los criterios de cada una están en su PR.

- **C1 Términos de uso** (PR 16): licencia de cada fuente en `docs/fuentes.md`.
- **C2 Descargas** (PR 59): `datos/registro_descargas.md`; los archivos crudos no se suben (`datos/crudos/` está en `.gitignore`).
- **C3 Diccionario de datos** (PR 60): `docs/datos/diccionario.md`, de cada columna oficial a cada campo de la base.
- **C4 Datos de ejemplo** (PR 22): 10 carreras verificadas a mano en `datos/ejemplos/`.
- **C5 y C6 Cargas de oferta y SIES** (PR 39, 40, 45): scripts repetibles con resumen de filas válidas y descartadas. Los valores que el SIES no publica por muestra pequeña quedan en `null` con el motivo «Muestra insuficiente según SIES».
- **C8 Ponderaciones y puntajes de corte** (PR 43, 92, 144): carga DEMRE 2027 corregida y verificada por muestra. El PR 62 se cerró porque lo reemplazó el 92.
- **C9 Beneficios y plazos** (PR 48), **C9b Corpus del asistente** (PR 50, formato `Fragmento` de `lib/ia/proveedor.ts`) y **C10 Textos** (PR 56).
- **C11 Guion de pruebas con usuarios** (PR 58): reemplazado el 13 de noviembre por el protocolo de la medición con personas egresadas.
