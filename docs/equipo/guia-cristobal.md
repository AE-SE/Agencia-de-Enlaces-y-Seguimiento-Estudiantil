# Guía de Cristóbal · Datos y contenido

> **Para la IA que acompaña a Cristóbal:** este documento es tu hoja de ruta hasta el entregable del **19 de diciembre de 2026**. Antes de proponer cualquier cosa, lee `AGENTS.md`, `docs/equipo/README.md`, `docs/fuentes.md` y la skill indicada en cada tarea. **Nunca inventes un dato, una fecha, un monto ni una fórmula**: si no tienes la fuente oficial delante, escribe `TODO(fuente)` y avisa. **Solo fuentes oficiales, primarias o académicas**: nunca prensa, blogs ni calculadoras de terceros. Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`.

Estado verificado el **11 de noviembre de 2026** con `gh pr list` (solo lectura).

---

## 1. Qué se entrega y qué te toca

El producto del 19 de diciembre (ADR 0031, Entregable Parte I): un sitio gratuito para estudiantes de 3.º y 4.º medio de liceos con financiamiento público y un panel de seguimiento para colegios. **Todo lo que el sitio afirma sale de tus datos**, y por eso eres el responsable del primer objetivo.

Según la Matriz RACI (Tabla 3.8) y los entregables (Tabla 3.10):

| Tarea | Tu papel | Entregable y criterio de aceptación | Fecha |
|---|---|---|---|
| Datos oficiales y ficha de carrera (OE1) | **R** (Rafael aprueba) | Ficha que se abre en un teléfono y muestra fuente, enlace y fecha | **23 nov** |
| Cálculo del puntaje ponderado (OE1) | **R** | Casos verificados contra la fuente oficial, todos aprobados | **23 nov** |
| Guía de trámites y calendario del FUAS (OE2) | **C** (consultado; Alejandro ejecuta) | Cada hito con fuente y fecha de vigencia (I-OE2b: 100 %) | 27 nov |
| Panel de seguimiento (OE3) | I (informado) | Que las metas de carrera y ponderaciones que use el panel salgan de tus datos | 27 nov |
| Pruebas con estudiantes y profesionales | **R** (con Alejandro) | Informe: tareas, resultados, hallazgos y limitaciones | 19 dic |
| Informe y presentación | **R** (con Alejandro; Rafael aprueba) | Entrega completa | 19 dic |
| Indicadores I-OE1a, I-OE2b (Anexo 3.A) | Responsable | 100 % de los datos mostrados con fuente, enlace y fecha | 23 nov y 11 dic |

**No te toca** (pídeselo a quien corresponde): pantallas y estilos → Alejandro; esquema de la base de datos, claves, RLS, asistente IA → Rafael.

**Por qué este rol es crítico:** un dato equivocado sobre una carrera puede cambiar la decisión de vida de alguien. La plataforma solo vale si se puede confiar en ella.

---

## 2. Tu hoja de ruta, semana por semana (Gantt, Tabla 3.7)

| Semana | Qué entregas | Criterio de aceptación |
|---|---|---|
| **S2 (10 al 16 nov)** | Cerrar el PR 96 (cita de la fórmula oficial del ranking 2027). Revisar que las cifras publicadas muestren fuente, URL, período y fecha (encargo del 10 nov, sección 4) | Fórmula citada con documento y página del DEMRE |
| **S3 (17 al 23 nov)** | **OE1 completo:** verificación por muestra de las cifras (C12) y casos oficiales del puntaje ponderado; textos de las pantallas revisados con `lenguaje-claro` | **100 % de los datos mostrados con fuente, enlace y fecha el 23 de noviembre**; casos del puntaje ponderado todos aprobados |
| **S3 y S4** | **OE2:** revisar cada hito del FUAS 2027 contra la fuente oficial (consultado por Alejandro) | 100 % de los hitos con fuente y fecha de vigencia (**27 nov**) |
| **S4 (24 al 30 nov)** | **Organizar y aplicar la prueba de uso** con Alejandro (sección 5) | 5 estudiantes y 2 profesionales; 16 de 20 tareas sin ayuda |
| **Vie 27 nov** | **Congelamiento de funciones:** datos, metas de carrera y hitos del FUAS que usa el panel, cargados y con fuente | Ningún dato nuevo después de esta fecha, salvo corrección de un error |
| **Lun 30 nov** | Termina la prueba de uso; hallazgos de datos y textos con gravedad | Lista entregada a Rafael |
| **Mar 1 dic** | Todos tus PR de datos y contenido fusionados a `main` | Ningún PR de datos abierto |
| **1 al 4 dic** | Corregir los hallazgos de datos y textos de la prueba (`fix/…`, `datos/…`) | Hallazgos graves corregidos el vie 4 dic |
| **7 al 11 dic** | **Verificación de datos con fuente** sobre el sitio publicado (C12 final) y mejoras leves de la ficha | 100 % de los datos mostrados con fuente, enlace y fecha el vie 11 dic; coincidencia 100 % en la muestra |
| **14 al 17 dic** | **Informe de datos** (C13) e informe de la prueba con Alejandro; ensayo de la presentación. Último PR de código el mar 15 dic | Informes sin marcas `[COMPLETAR]` el mié 16 dic |
| **Cierre (18 y 19 dic)** | Presentación | Entrega el 19 de diciembre |

**Cómo se usa la ventana del 1 al 17 de diciembre:** el desarrollo de funciones termina el 27 de noviembre y el 1 de diciembre todo debe estar en `main`. Esas semanas son para verificar y pulir, no para cargar datos nuevos ni terminar lo pendiente. Una mejora leve de la ficha cambia textos, etiquetas, orden de lo que ya se muestra o corrige un dato contra su fuente; cabe en un PR de menos de 150 líneas y no agrega tablas ni dependencias. Un dato que no se pueda verificar en una fuente oficial se retira, no se deja con `TODO`. Revisiones de PR: martes 1, 8 y 15 y viernes 4 y 11 de diciembre.

---

## 3. Estado de tus tareas (según los PR)

| Tarea | Estado | Referencia |
|---|---|---|
| C1 a C4 · Términos de uso, descargas, diccionario de datos, datos de ejemplo | **Hechas y fusionadas** (histórico) | PR 16, 22, 59, 60 |
| C5 · Carga de oferta; C6 · Empleabilidad e ingresos (SIES) | Fusionadas | PR 39, 40, 45 |
| C8 · Ponderaciones, vacantes y puntajes de corte (DEMRE 2027) | Fusionada; el PR 62 se cerró y lo reemplazó el **PR 92** (verificación) y el PR 144 (recupera filas partidas) | PR 43, 92, 144 |
| C7 · Validación del Puntaje Ranking (ingreso manual, ADR 0024) | **Fusionada** (PR 61). **Falta el PR 96**, que cita la fórmula oficial del ranking 2027: está **abierto** | PR 61; **PR 96** |
| C9 · Beneficios y plazos; C9b · Corpus del asistente; C10 · Textos | Fusionados | PR 48, 50, 56 |
| C11 · Pruebas con usuarios (guion) | Guion fusionado; el 11 de noviembre se rehízo para las 4 tareas del entregable (ver sección 5). Sesiones pendientes | PR 58; [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md) |
| Nombres de carreras con fuente oficial | Fusionado | PR 109 |
| Tokens de Andén urbano (ADR 0029) | Fusionado (tuyo) | PR 151 |
| C12 · Verificación cruzada final | **Pendiente** | — |
| C13 · Informe de datos | **Pendiente.** Se escribe del 14 al 16 dic y se integra al informe del 19 dic: fuentes, método de verificación, resultados de la muestra, datos no disponibles y limitaciones | — |
| C14 · Calendario de la admisión con campo `estacion` | **En espera:** `datos/calendario/` no existe y el indicador de etapas tiene una decisión pendiente del líder. No lo empieces sin su confirmación | — |

---

## 4. Tareas vigentes, con criterios de aceptación

### C7b · Cerrar el PR 96: cita de la fórmula oficial del ranking 2027
**Skill:** `datos-oficiales` · **Fecha:** viernes 13 nov (para el simulador, PR 132)

Cita la ecuación del Puntaje Ranking con documento, página o sección del DEMRE, y agrega a las pruebas un caso con ejemplo publicado por DEMRE. Si no puedes leer el documento, deja `TODO(fuente)` y dilo en el PR.
- [ ] Cada fórmula cita su documento oficial y año de admisión.
- [ ] Las pruebas con casos oficiales pasan (`lib/calculos/2027/`).
- [ ] Ninguna ponderación escrita en el código: vienen de los datos.

### C15 · Puntaje ponderado: casos verificados (OE1, 23 nov)
**Criterio de la Tabla 3.10:** «Casos verificados contra la fuente oficial, todos aprobados».
- Reúne al menos 5 casos de carreras reales (distintas pruebas electivas, una con requisitos mínimos), cada uno con su fuente, URL y fecha; comprueba que el simulador de Alejandro (PR 132) y `lib/calculos/2027/` den el mismo resultado.
- Quien revisa no es quien cargó los datos.
- [ ] Todos los casos coinciden o el desacuerdo está explicado en el PR.

### C12 · Verificación cruzada final (I-OE1a, 23 nov)
**Rama:** `datos/verificacion-final`
- Elige 30 fichas de carrera al azar **en el sitio publicado**.
- Compara cada cifra mostrada con su fuente oficial. Confirma que las celdas sin dato o suprimidas dicen por qué ([ADR 0025](../decisiones/0025-celdas-suprimidas-visibles-sin-cifra.md)) y que nunca aparece un 0 falso.
- Informe en `docs/datos/verificacion.md`: cifras revisadas, correctas, errores y su corrección.
- **Meta: 100 % de coincidencia y 100 % de los datos mostrados con fuente, enlace y fecha el 23 de noviembre.** Cualquier error se corrige antes.

### C16 · Hitos del FUAS 2027 (OE2, 27 nov)
Alejandro construye la guía y el calendario; tú garantizas los datos.
- Revisa `datos/beneficios/plazos_2027.json` y `beneficios_2027.json` contra el portal de Beneficios Estudiantiles (Mineduc), hito por hito.
- Una fecha no publicada queda en `null` con su motivo; **nunca** se estima por el año anterior.
- [ ] Cada hito con fuente, URL, fecha de consulta y fecha de vigencia (100 %).
- [ ] 3 hitos revisados por otra persona, con su nombre y fecha anotados en el PR.
- [ ] Los requisitos que dependen de la situación personal dicen «podrías», nunca prometen.

### C10 · Revisión de textos (durante todo el proyecto)
**Skill:** `lenguaje-claro`
- Cada vez que Alejandro termina una pantalla, revisas sus textos y le entregas los cambios. Para la prueba de uso, que no queden siglas sin explicar la primera vez ni términos que estigmaticen.
- Mantén `docs/datos/glosario.md`: palabra oficial → explicación simple.

### Encargo del líder del 10 de noviembre: pulir la página publicada
**Rama:** `fix/pulido-contenido-portal` · **Skills:** `datos-oficiales`, `lenguaje-claro`

Que cada página publicada quede impecable en datos y textos: ninguna cifra sin fuente, ninguna frase confusa.
1. Recorre cada página en el sitio publicado, desde el teléfono (o a 360 px) y con teclado.
2. Datos: toda cifra con fuente, URL, período y fecha; compara al menos 10 cifras al azar con su fuente (distintas de las que cargaste tú).
3. Textos: pásalos por `lenguaje-claro`. Indica siempre qué mide cada indicador y el año; ninguna comparación mezcla indicadores o períodos distintos.
4. Registra los hallazgos en el PR en una tabla: página, problema, gravedad, corrección. Lo visual se lo entregas a Alejandro; **tú no lo cambias**.
- [ ] Páginas recorridas a 360 px y con teclado. Lo ya corregido por los PR 116 a 128 no se repite: verifica antes.

---

## 5. Prueba de uso (24 al 30 de noviembre): tú organizas

Eres **R** de las pruebas, con Alejandro. El guion y el registro están en [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md), alineado al Anexo 3.A del entregable.

- **Muestra:** 5 estudiantes y 2 profesionales de colegios (orientador o directivo), por conveniencia. Menores de 18: autorización escrita del tutor, guardada fuera del repositorio (Rafael gestiona la carta a los colegios).
- **Tareas:** T1 encontrar una carrera y leer su fuente y fecha; T2 identificar su puntaje ponderado, arancel y beneficio; T3 identificar el próximo plazo del FUAS; T4 decidir qué compartir con el colegio y revocarlo. Meta: **16 de 20 sin ayuda**.
- **Privacidad:** sin nombres, RUT, colegio ni datos reales en el repositorio; «Participante 1…5» y «Profesional 1…2». No grabes pantalla ni voz sin consentimiento explícito y separado.
- **Hallazgos:** entrégalos a Rafael el lunes 30 de noviembre, con gravedad y arreglo propuesto; las correcciones se hacen del 1 al 4 de diciembre.
- **Informe (14 al 17 dic, entrega el 19):** problemas por gravedad y arreglo propuesto; con Alejandro, cada problema aceptado se convierte en una rama `fix/…`. Declara las limitaciones: muestra por conveniencia, sin estimar efectos.

---

## 6. Qué quedó fuera del alcance, y por qué

No trabajes en: **permanencia en educación superior, pulso de check-in, predicción o riesgo de deserción, panel para instituciones de educación superior y pruebas propias por colegio.** Se descartaron como objetivos por falta de evidencia o de capacidad del equipo (entregable 3.1; ADR 0031) y quedan como proyección. Sus ADR y documentos de evidencia (`docs/evidencia-permanencia.md`) se conservan como historia. El **portal de transparencia** (tablero de pronósticos rediseñado) es una idea acordada que no entra al 19 de diciembre.

---

## 7. Lo que debes dominar (40 minutos, una vez)

1. [`AGENTS.md`](../../AGENTS.md), sobre todo la sección 2.1 (datos oficiales) y 2.2 (privacidad).
2. [`docs/fuentes.md`](../fuentes.md): el catálogo de fuentes que mantienes.
3. [`.claude/skills/datos-oficiales/SKILL.md`](../../.claude/skills/datos-oficiales/SKILL.md) y [`.claude/skills/lenguaje-claro/SKILL.md`](../../.claude/skills/lenguaje-claro/SKILL.md).
4. [`docs/arquitectura.md`](../arquitectura.md), secciones 3 (modelo de datos) y 6 (flujo de datos oficiales).

**Cuatro reglas que guían todo tu trabajo:**
1. **Sin fuente no hay dato.** Cada valor guarda fuente, URL exacta, período que mide y fecha de descarga.
2. **Sin dato no es cero.** Si la fuente no publica un valor, se guarda `null` con el motivo.
3. **No mezclar peras con manzanas.** Empleabilidad al 1.er y al 2.º año son indicadores distintos; titulados 2022 y 2023, períodos distintos.
4. **Repetible.** Todo script se puede correr dos veces y deja el mismo resultado.

### Las fuentes con las que trabajas

| Qué necesitamos | Fuente | Dónde buscar | Notas |
|---|---|---|---|
| Oferta de carreras | **SIES (mifuturo.cl)** o **Datos Abiertos Mineduc** ("Matrícula en educación superior") | https://www.mifuturo.cl/ y https://datosabiertos.mineduc.cl/ | La base de matrícula viene con una fila por estudiante: se agrega en memoria y solo se escriben totales por carrera ([ADR 0009](../decisiones/0009-fuente-de-oferta-academica.md)). **No usar el CNED** hasta que autorice por escrito: sus condiciones prohíben el uso comercial. |
| Empleabilidad e ingresos por carrera e institución | **SIES, Mineduc** | https://www.mifuturo.cl | Cruza por código SIES. Indica siempre qué mide y el año. |
| Ponderaciones, vacantes y carreras del Sistema de Acceso | **DEMRE** | https://demre.cl/publicaciones | Admisión 2027 es el proceso en curso. |
| Puntajes de corte | **DEMRE** | https://demre.cl/publicaciones | Se muestran siempre como «del año anterior». |
| Fórmula del puntaje ranking y del ponderado | **DEMRE** | Documentos oficiales del proceso | Se copia del documento oficial y se cita en el código. |
| Acreditación institucional | **CNA** | https://www.cnachile.cl | Años y fecha de término. |
| Gratuidad, becas, créditos, FUAS y plazos | **Mineduc**, Beneficios Estudiantiles | https://portal.beneficiosestudiantiles.cl | Carga a mano con URL y fecha hasta revisar sus términos de uso. |
| Calendario del proceso de admisión | **Subsecretaría de Educación Superior** | https://acceso.mineduc.cl | Fechas de PAES, resultados y postulación. |
| Magnitud de la brecha (acceso inmediato por tipo de colegio) | **SIES (2023)** | https://www.mifuturo.cl | Para el entregable; cita el documento, no una nota de prensa. |

**Cuidado con las fuentes secundarias:** diarios, blogs, calculadoras de puntaje de terceros y foros sirven, como máximo, para *encontrar* el documento oficial; nunca son fuente del dato ni de una cita en el entregable.

---

## 8. Antes de abrir cada PR

- [ ] La tarea cumple **todos** sus criterios de aceptación.
- [ ] Cada dato nuevo tiene fuente, URL, período y fecha.
- [ ] Ningún archivo crudo ni dato personal en el PR.
- [ ] Ningún valor faltante convertido en 0.
- [ ] Los scripts son repetibles y tienen pruebas.
- [ ] `docs/fuentes.md` y `datos/registro_descargas.md` actualizados si usaste una fuente nueva.
- [ ] Plantilla del PR completa, incluida la IA que usaste.
- [ ] Leíste y entiendes todo el código, incluido el que escribió tu IA.

**Texto base para tu IA:**
> Lee AGENTS.md, la skill datos-oficiales y la tarea [código] de docs/equipo/guia-cristobal.md. Te voy a pegar los textos oficiales con sus URL. Ordénalos en el formato indicado y dime cuáles no traen fuente, período o fecha. No completes, estimes ni inventes ningún valor, y no uses fuentes que no sean oficiales, primarias o académicas. No pegues filas reales de estudiantes en esta conversación.

## 9. Errores comunes que hacen rechazar un PR

| Error | Por qué se rechaza | Cómo evitarlo |
|---|---|---|
| Dato copiado de un diario o calculadora de terceros | No es fuente oficial | Buscar el documento oficial y citarlo |
| Valor ausente guardado como 0 | Información falsa | `null` + motivo |
| Fórmula escrita «de memoria» o por la IA | Puede estar mal y nadie lo notaría | Copiar del documento oficial del DEMRE y citarlo |
| Ponderaciones escritas en el código | Cambian cada año | Vienen de los datos |
| Archivo de Excel abierto y guardado de nuevo | Excel borra ceros a la izquierda de los códigos | Leer siempre el archivo original con el script |
| Mezclar períodos en una comparación | Engaña al estudiante | Mostrar el período y advertir |
| Verificar tus propias filas | No es revisión independiente | Pedir a otra persona 5 filas al azar |
| Nombres reales en pruebas con usuarios | Privacidad | «Participante 1, 2…» |

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
- **C11 Guion de pruebas con usuarios** (PR 58).
