# Análisis de sitios de referencia: qué funciona, qué no y qué incorporar

Fecha: 2026-11-16 · Estado: borrador para revisión del líder · Autoría: Claude (Sonnet 5.5), con tres investigaciones en paralelo.

> **Estado al 17-nov-2026.** De las propuestas de la sección 5: la **3** (ficha completa) está en `main` salvo el costo total: ponderaciones (PR 245), acreditación (PR 247) y puntaje de corte (PR 248); el puntaje de corte resultó calculable con los datos abiertos del DEMRE y se publica como elaboración propia (ver `docs/datos/diccionario.md`). La **5** (preguntas frecuentes y glosario) está en el PR 249. Siguen pendientes la **1** y la **2** (calendarios), la **4** (comparación con rango), la **6** (portada con tres caminos) y la **7** (menú por etapa). Una corrección posterior a este análisis: la sección 2b se hizo en navegador el 16-nov; lo demás de este documento se leyó sin navegador.

Este documento reúne lo que se vio en 14 universidades, 10 institutos y CFT, 9 sitios de organismos públicos y 6 comparadores, chilenos y extranjeros. Termina en propuestas concretas para nuestro sitio, ordenadas por prioridad. Los informes completos, con la URL y la fecha de cada observación, están en [`docs/referentes/`](referentes/).

## 1. Cómo leer este análisis (límites)

- **Las tres investigaciones iniciales no usaron navegador.** Leyeron con WebFetch (texto de la página resumido por un modelo pequeño) y, en algunos casos, con `curl`. Después hice una **segunda pasada en navegador a 360 px** sobre DEMRE, mifuturo, UNAB, UDP y la página de transparencia de la PUC (sección 2b). Corrigió tres afirmaciones de los agentes. Del resto, lo visual, el contraste y la velocidad **siguen sin evaluarse**; la U. Mayor no cargó en el navegador y no se verificó.
- **No hay evidencia publicada de que algún sitio chileno «funcione».** Los tres agentes buscaron estudios de usabilidad, evaluaciones o cifras de uso y no encontraron ninguno. La única cifra (unos 2,5 millones de visitas anuales de mifuturo) viene de prensa y de Mineduc entre 2016 y 2019, y no está auditada. Por eso lo que sigue se llama «lo que se ve bien resuelto» y «lo que se ve mal resuelto», no «lo comprobado».
- **Sí hay evidencia externa, indirecta** (sección 3). Se leyó por resúmenes, no por los artículos completos; hay que verificarla antes de citarla en un documento de la agencia.
- Verifiqué yo el 16-nov-2026, con `curl`: DEMRE y Mineduc bloquean la ampliación con `user-scalable=no`; mifuturo no. El registro obligatorio de mifuturo para descargar una búsqueda quedó **confirmado en navegador** (sección 2b); mi `curl` no lo había encontrado.
- Quedan sin evaluar: INACAP (no cargó), los CFT estatales, College Scorecard, Canadá, la Superintendencia de Educación Superior, ChileAtiende (403), Beneficios Estudiantiles (en mantención) y la U. Mayor.

## 2. Qué se encontró en conjunto

### Lo que casi todos hacen bien

| Patrón | Dónde se vio |
|---|---|
| Separar la vía regular (PAES) de las vías especiales o directas | 14 de 14 universidades |
| Enlazar los beneficios estatales (gratuidad, CAE, becas) | 13 de 14 universidades; 5 de 10 institutos |
| Listado de carreras agrupado por facultad, sede o área, con filtros | 12 de 14 universidades; 6 de 10 institutos |
| Un simulador de puntaje o de beca | 8 de 14 universidades; 1 de 10 institutos (AIEP) |
| Calendario corto en la portada, con enlace a «todas las fechas» | DEMRE |
| Una sola pregunta, dos listas y un botón («¿Está acreditada?») | Ojo dónde estudias |
| Enlace «Ir al contenido» y siglas con `<abbr>` | DEMRE, CNA, UdeC, INJUV |
| Selector combinado por área, carrera y sede | CFT Santo Tomás |
| Jornadas visibles en cada carrera (sábado, vespertina) | IP Los Leones |
| Cifra explicada con su método y su fuente (SII y SIES) | PUC, en su página de transparencia: único caso de la muestra |
| Acreditación con entidad, años y mes de vencimiento | Universidad Mayor (algunas carreras), U. de Chile |

### Lo que casi todos hacen mal

| Problema | Alcance |
|---|---|
| **El listado y la portada no muestran datos por carrera** (vacantes, puntajes, arancel, duración, empleabilidad). En la ficha aparecen algunos, repartidos: pestañas plegadas, PDF o otra sección (ver 2b) | 14 de 14 universidades en portada y listado; 9 de 10 institutos no muestran arancel en la portada |
| **Ninguno permite comparar con otra institución** | Todos los sitios institucionales |
| **Cifras de marketing sin fuente o sin fecha** | 11 de 14 universidades |
| **«Empleabilidad» sin definición común**: tres definiciones distintas o ninguna | USM y UDP dan 93 %; solo la PUC explica cómo la mide |
| **Años mezclados (2026 y 2027)** en un mismo sitio | 7 de 14 universidades |
| **Sin «última actualización» ni fuente junto al dato** | Casi todos los sitios de gobierno |
| **Fechas sin año** | INJUV, mifuturo, DEMRE |
| **Plazos dentro de noticias o de imágenes** sin texto | Mineduc, fuas.cl (15 de 16 imágenes con `alt=""`, según el HTML) |
| **Se pide un dato personal a cambio de información** (RUT, teléfono, malla) | USM pide RUT; al menos 4 institutos piden datos para dar una malla o llamar |
| **Gancho de descuento o plazo** como lo más visible | CFT Santo Tomás, ENAC, AIEP |
| **Zoom bloqueado** | DEMRE, Mineduc (verificado) |
| **Contadores en «0»** o marcadores sin rellenar | UFRO, UCEN, USS (pueden ser carga diferida) |
| **Tablas anchas** que no sirven en teléfono | PUC (7 columnas, más de 30 filas) |

### Una lectura de conjunto

1. **El hueco más claro es el de nuestra propuesta:** reunir en una pantalla los datos oficiales de una carrera, con su definición, año y fuente, y compararlos con otras instituciones. Cada ficha institucional que se abrió muestra algunos datos propios (duración, arancel, a veces empleabilidad con fuente), pero repartidos, sin año ni definición y sin compararse con nadie; es lógico, porque su incentivo es otro. Lo único que se acerca son los comparadores públicos (mifuturo, QILT), que separan sus herramientas y no explican qué mide cada cifra.
2. **El segundo hueco es la confianza en la cifra.** Casi nadie dice qué mide, de qué año es y de dónde viene. Hacerlo siempre, y con el mismo formato, es una ventaja que nos cuesta poco.
3. **La independencia se nota por contraste.** Studyportals depende de instituciones clientes y no explica cómo ordena; los institutos dependen de captar matrículas. Mostrar cómo ordenamos y no pedir datos a cambio de información son señales visibles de lo que somos.

## 2b. Segunda pasada en navegador (16-nov-2026, 360 px de ancho)

Hecha por mí en el navegador integrado, con la ventana a 360 × 800. No envié ningún formulario y en UNAB rechacé las cookies opcionales.

**Confirmado**
- **DEMRE** (`demre.cl`): el calendario de la portada muestra mes y día, **sin año** («OCT 13», «NOV 19»), y trae un botón de accesibilidad. El `viewport` bloquea el zoom (verificado con `curl`).
- **mifuturo** (`/buscador-de-empleabilidad-e-ingresos/`): la página dice «Para descargar esta búsqueda usted debe haber iniciado sesión o registrarse», y el formulario de registro incluye **fecha de nacimiento** y comuna. Los tres selectores (tipo de institución, institución, carrera) se usan sin registro. El menú móvil muestra cuatro buscadores en bloques de igual peso.
- **UNAB** (`/carreras/ingenieria-comercial/`): sin desborde horizontal a 360 px y con zoom permitido. Ponderaciones y vacantes salen de un PDF enlazado (`ponderaciones-y-puntajes-UNAB-2027.pdf`). Una pregunta frecuente de la misma página habla del proceso **2026** dentro de una ficha «Admisión 2027».
- **UDP** (`/carrera/contador-auditor/`): **pide email y teléfono, marcados obligatorios, para ver o descargar la malla**. El arancel aparece como tarjetas grandes sin año ni explicación de qué incluye el «Total».

**Correcciones a lo que dijeron los agentes**
1. **UNAB sí cita su empleabilidad en la ficha:** «84,1 % de empleabilidad al segundo año de egreso (www.mifuturo.cl, 2026)». No es verdad que mostraran cifras sin fuente en todas las fichas; el cuadro «11 de 14 con cifras sin fuente» se refiere a portadas e informes, y conviene citarlo así.
2. **UDP sí muestra arancel en la ficha** ($4.824.000 y un «Total» de $5.307.000), además de duración (8 semestres), jornada, **código SIES** y dirección. Su acreditación aparece en el pie con entidad y fecha («Excelencia… hasta noviembre de 2029»).
3. **Las fichas de UDP están en `/carrera/` (singular), no en `/carreras/`.** Por eso el agente vio 404. La URL de la U. Mayor que citó el agente (`/um/carreras`) da 404 hoy, y su portada no cargó en el navegador.

**Qué cambia en la conclusión**
- Se mantiene: ninguna ficha reúne vacantes, puntaje de corte, arancel, duración real y empleabilidad **con definición, año y fuente en una sola pantalla**, y ninguna compara con otra institución.
- Se corrige la forma de decirlo: no es «no muestran datos por carrera», sino «los muestran sueltos, sin año ni definición, a veces tras un formulario o en un PDF».
- **No verificado en navegador:** la nota de empleabilidad de la PUC (está en pestañas que no cargaron en el texto), la tabla ancha de la PUC, y todo el resto de los sitios universitarios, institutos y CFT.

## 3. Evidencia externa: qué nos enseña y qué no

| Estudio | Qué dice | Qué implica para nosotros | Estado de la verificación |
|---|---|---|---|
| Hurwitz y Smith (2018), College Scorecard | Efecto pequeño de publicar ingresos de egresados sobre las decisiones | Publicar la cifra **no basta**: hay que acompañar con pasos y plazos | Resumen de buscador; leer el artículo |
| Mabel, Libassi y Hurwitz (2019) | Las comparaciones de ingresos entre instituciones se explican en gran parte por factores observables y cambian mucho según el percentil que se muestre | **Mostrar el rango, no solo el promedio**, y advertir cuando la muestra es pequeña. Comparar solo la misma carrera | Resumen de buscador |
| Departamento de Educación de EE. UU. | Retiró la comparación con la mediana nacional porque inducía a error | Cuidado con la comparación «frente al área»: debe rotularse «elaboración propia» y explicar el método | Nota de un centro de estudios (cappsonline.org) |
| Hoxby y Turner (experimento con unos 40.000 estudiantes) | Información personalizada sobre costos y proceso aumentó las postulaciones (la cifra citada fue 48 %) | Lo que mueve decisiones es la información **activa y a tiempo** (pasos, plazos, costos), no solo un buscador | Resumen de prensa o de los autores; **verificar la cifra antes de citarla** |
| Hastings y Weinstein (2008), escuelas de EE. UU. | Dar información simple sobre puntajes de escuelas cambió las elecciones | Apoya la idea general. **No es educación superior ni Chile**, y no prueba que nuestro sitio funcione | Resumen vía NBER |
| UCAS (quiz de carrera) | Se basa en los temas ocupacionales de Holland; no publica cifras de validez | El cuestionario de 2027 ([ADR 0034](decisiones/0034-test-vocacional.md)) debe declarar su respaldo y no usar tipos ni etiquetas | Dicho por UCAS; sin validación independiente |
| Tests vocacionales chilenos | No se encontró validación de ninguno | Igual que arriba | Solo se vio un listado de La Tercera |

**Conclusión honesta:** no podemos afirmar que nuestras decisiones de diseño «funcionan» por haber copiado un sitio. Lo que sí hay es evidencia de que cifras sin contexto confunden y de que la información entregada a tiempo ayuda. La validación propia sigue en [`docs/pruebas-usuarios.md`](pruebas-usuarios.md).

## 4. Qué ya hacemos y qué nos falta

Revisé el código (`app/`) para no proponer lo que ya existe.

**Ya lo hacemos** (verificado en el código):
- Cada dato lleva fuente con enlace, fecha de actualización y qué mide ([`DatoOficial.tsx`](../app/_componentes/DatoOficial.tsx), [ficha de carrera](../app/(portal)/carreras/[institucion]/[carrera]/page.tsx)). Si no hay dato, dice «Sin datos suficientes» y el motivo. Ningún sitio revisado lo hace.
- Duración real y empleabilidad con su definición, y la ficha cita las fuentes con fecha de consulta.
- Comparador de hasta tres carreras, con la selección en la URL (se puede compartir el enlace sin cuenta).
- Explorador con búsqueda por carrera, institución, sede o comuna, y filtros de región, tipo de institución y jornada.
- Simulador del puntaje ponderado, página de FUAS y de beneficios con calendario, y un aviso de plazo que depende de la fecha de hoy.
- «Ir al contenido», `lang="es-CL"` y zoom permitido.

**Nos falta** (la portada tiene tres enlaces y un aviso; el resto son piezas de la tabla de «Núcleo» de `AGENTS.md` aún sin ruta):
- Calendario de admisión y beneficios con fechas de toda la admisión (hoy solo FUAS).
- Preguntas frecuentes y glosario de siglas.
- Acreditación y ponderaciones: la ficha ya tiene la tarjeta, pero sin dato.
- Comparación de empleabilidad con la misma carrera en otras instituciones y con su área.
- Tablero público de transparencia y página «cómo ordenamos».
- Filtro por área de conocimiento en el explorador.
- Un «¿a qué carreras podría postular?» a partir del puntaje.

## 5. Propuestas, por prioridad

Cada propuesta indica de dónde sale, qué regla de `AGENTS.md` la respalda y si exige un ADR o datos nuevos. Ninguna requiere cuenta, anuncios ni venta de datos.

### Prioridad alta (completan el núcleo del 19 de diciembre)

1. **Calendario corto en la portada, con año y en texto.** Tres próximas fechas con «Ver todas». *Origen: DEMRE; lo que falla en FUAS y Mineduc.* Resuelve la causa 4 del problema (los pasos y plazos no se conocen a tiempo). Los plazos de FUAS ya están en `datos/beneficios/plazos_2027.json`; las fechas de DEMRE necesitan su propio archivo con fuente y fecha (`TODO(fuente)`, no inventar). Respeta 2.1.
2. **Calendario completo de admisión y beneficios**, filtrable, con lista numerada y sin depender de una imagen. *Origen: UAI (fecha y hora), USM (remite a DEMRE sin duplicar), fuas.cl (a evitar).* Cada fecha, con fuente y fecha de consulta.
3. **Ficha de carrera completa**: acreditación con entidad, años y vencimiento; ponderaciones; puntaje de corte; costo total (arancel anual y matrícula aparte, con la aclaración de que un descuento de matrícula no es el arancel). *Origen: Universidad Mayor y U. de Chile (acreditación), CFT Santo Tomás y ENAC (el descuento que se lee como «gratis»).* Es el hueco de los 14 de 14. La acreditación se verifica en el CNA.
4. **Comparación con la misma carrera en otras instituciones y con su área, mostrando el rango y avisando cuando la muestra es pequeña.** Es lo que promete `AGENTS.md` para la vista de carrera. *Origen: Mabel y colaboradores (2019).* Toda cifra calculada por nosotros se rotula «elaboración propia», con los datos y el método. Es el cambio más delicado de la lista: se revisa con cuidado antes de publicar.
5. **Preguntas frecuentes y glosario con `<abbr>`** (PAES, NEM, FUAS, CAE, acreditación) y una frase por término. *Origen: DEMRE (`abbr`); lo que falta en CNA y Ojo dónde estudias.* Cumple 2.6 (siglas explicadas).
6. **Portada con una sola pregunta y tres caminos de entrada**: «Ya sé qué quiero», «Tengo dudas», «No sé por dónde empezar». *Origen: UCAS («Not sure where to start?»), «Soy…» de Elige Educar, la pregunta única de Ojo dónde estudias.* Los caminos no piden ni guardan datos. **Ojo con 2.5**: una sola acción principal (coral) por pantalla; los otros dos caminos deben ser secundarios. Hoy la portada ya tiene esa jerarquía, y hay que conservarla.
7. **Menú por etapa de la decisión, en lugar de por organismo.** *Origen: mifuturo («Dónde y qué estudiar», «Cómo financiar») y Mineduc.* La portada actual no tiene menú. El indicador de estaciones ya nombra el recorrido («Explorar, Postular, Llegar, Avanzar»; [`IndicadorEstacion.tsx`](../app/_componentes/IndicadorEstacion.tsx)), así que el menú debe usar esos mismos nombres y no inventar otros. «Comparar» y «Financiar» quedarían como accesos dentro de «Explorar» y «Postular».

### Prioridad media

8. **Filtro por área y por sede en el explorador**, con nombres únicos de facultad o área. *Origen: UNAB, UDP, CFT Santo Tomás; el error de nombres que no coinciden de UDP.* Las 11 áreas del SIES ya se documentaron en el [ADR 0035](decisiones/0035-descripcion-de-carreras.md).
9. **«¿A qué carreras podría postular?» a partir del puntaje**, calculado en el dispositivo. *Origen: UDP.* Los puntajes no se guardan ni viajan en la URL (2.2). Conecta con «alternativas cercanas» de la meta.
10. **Botón «Copiar enlace» y vista para imprimir en el comparador**, sin pedir cuenta. *Origen: mifuturo exige registro para descargar (por confirmar).* El enlace ya existe; falta el botón y una hoja de estilo para imprimir. Sin puntajes en la URL.
11. **Datos de vigencia visibles y aviso cuando un dato vence o la fuente está caída**, con la fecha de nuestra última copia. *Origen: los 7 sitios con años mezclados; Beneficios Estudiantiles en mantención sin alternativa.* Hoy cada dato muestra su fecha; falta el aviso global.
12. **Tablas largas como tarjetas apiladas en 360 px**, con «sin información» escrito en palabras y no «s/i» ni «n/a». *Origen: la tabla de transparencia de la PUC.* Ya usamos tarjetas; es una regla a mantener en el tablero de transparencia.

### Prioridad baja o fuera del alcance actual

13. **Página «Cómo ordenamos» y «Cómo leer las cifras de los sitios de las instituciones»** (qué mide, qué año, qué fuente), sin nombrar instituciones. *Origen: Studyportals como contraste; 11 de 14 con cifras sin fuente.* Refuerza la independencia, pero **tiene riesgo de reclamo**: pasa por revisión del líder y, si corresponde, legal (hay una [revisión legal pendiente](revision-legal-adr-pendientes.md)). Va junto al tablero de transparencia.
14. **Cuestionario de intereses opcional (2027)**, con resultado en forma de «áreas para explorar» y la lista de carreras reales detrás. *Origen: UCAS, ENAC.* Ya está decidido en el [ADR 0034](decisiones/0034-test-vocacional.md). Sin estilos de aprendizaje ni etiquetas (2.4), y declarando su respaldo.
15. **Simulador de financiamiento** que explique qué cubre cada beneficio y qué sigue pagando la persona. *Origen: AIEP (que además pide teléfono; nosotros no).* La página de beneficios ya existe; es una extensión.
16. **Guías por área con «qué se estudia el primer año» y qué trabajo hay.** *Origen: guías por materia de UCAS.* Necesita contenido revisado por un profesional (2.4) y fuente oficial.

## 6. Qué no copiar

- Ventanas emergentes de registro (ENAC) y formularios que piden teléfono, RUT o datos a cambio de una malla o de información (USM, PUCV, AIEP, IPP). Rompen 2.2 y nuestra promesa de gratuidad sin cuenta.
- Descuentos o plazos como gancho principal (CFT Santo Tomás, ENAC): contradicen el tono de información neutral.
- Cifras de empleabilidad propias sin método (INACAP, IPP, USM, UDP) y rankings por «popularidad».
- `user-scalable=no` (DEMRE, Mineduc).
- Plazos solo en imagen (fuas.cl).
- WhatsApp con asesor: hoy el equipo no tiene a nadie que atienda, así que no se promete un canal humano que no existe. Se reevalúa cuando haya quién responda y con qué protocolo.
- Un solo número de «empleabilidad» sin rango ni método.

## 7. Pendientes de investigación

1. **Completar la segunda pasada con navegador**: ya se hizo en DEMRE, mifuturo, UNAB, UDP y PUC (parcial). Faltan las fichas de las otras universidades, los institutos y los CFT, el contraste, el foco con teclado y el peso de página (Lighthouse y axe).
2. ~~Confirmar en navegador que mifuturo exige registro con fecha de nacimiento para descargar.~~ Confirmado el 16-nov-2026 (sección 2b).
3. Revisar la Superintendencia de Educación Superior (sitio correcto), ChileAtiende, Beneficios Estudiantiles (cuando vuelva), INACAP, los CFT estatales, College Scorecard, QILT y Canadá.
4. Leer los artículos completos de Hurwitz y Smith, Mabel y colaboradores, Hoxby y Turner, y Hastings y Weinstein antes de citarlos en cualquier documento de la agencia.
5. Verificar los contadores en «0» de UFRO, UCEN y USS (pueden ser carga diferida).
6. Pruebas de uso con personas que egresan: es lo único que dirá si las ideas anteriores funcionan para nuestro público (ver [`docs/pruebas-usuarios.md`](pruebas-usuarios.md)).

## 8. Cómo pasar esto a trabajo

Las propuestas 1 a 7 tocan pantallas y datos del núcleo; cada una es un PR pequeño (AGENTS.md, sección 4). Las que agregan una pantalla o un patrón visual nuevo pasan por la skill `mapa-de-trayecto`, usan solo tokens de `diseno/tokens.json` y se justifican en `docs/diseno.md`. Las que muestran datos nuevos, por la skill `datos-oficiales`. Si el líder aprueba el análisis, el siguiente paso es elegir cuáles entran antes del 19 de diciembre.
