# Bitácora

Memoria de trabajo entre sesiones. Lo más reciente, arriba.

## 2026-11-19 (área del SIES en la oferta exportada, PR 277 revisado y fusionado)

**Hecho** (worktree `../wt-area-sies`, desde `origin/main` `2e96542`): cada carrera de la oferta trae `area`, que es el área de conocimiento que el SIES asigna a su carrera genérica. `datos/exportar_areas_sies.py` (7 pruebas) genera `lib/datos/areas-sies.json` (190 genéricas, con fuente, URL y fecha) desde `datos/procesados/empleabilidad.csv`. El mapeo la cruza por `programa_generico.nombre_normalizado`, que leen el exportador y la consulta en vivo (embebido en `SELECT_VARIANTE`). La muestra trae el área de sus 10 carreras. Sin cambios en la base: no hay migración ni lote nuevo.
**Cobertura medida con `datos/procesados/oferta.csv`**: 190 de 256 carreras genéricas tienen área, lo que cubre 10.850 de 11.364 variantes (95,5 %). Las que faltan son genéricas que el SIES no publica («Otras ingenierías», varios técnicos) y quedan sin área, sin inferirla.
**Verificado**: `tsc`, `eslint`, 286 pruebas de TypeScript, 229 de Python y `next build` con la muestra. **No verificado contra Supabase**: las variables de `.env.local` están vacías. Falta comprobar que la consulta embebida `programa_generico:programa_generico_id(nombre_normalizado)` responde y que la exportación real trae el área (lo prueba el build de Cloudflare).
**Revisión** (`revisar-pr`): un Alto sin verificar, la consulta embebida de `SELECT_VARIANTE` contra Supabase. **El líder ordenó fusionar igual**, sin esa prueba. Si el buscador o la ficha en vivo fallan con error 400, el arreglo es leer `programa_generico` aparte en `oferta-remota.ts`, como hace el exportador. Menores pendientes: escribir en la guía de carga cuándo regenerar `areas-sies.json` (al publicarse un buscador nuevo del SIES: `cargar_empleabilidad.py` y luego `exportar_areas_sies.py`), y probar el cruce en `exportar-oferta.ts`. El 276 y el 277 se fusionaron con squash y `--admin`, por orden del líder.
## 2026-11-19 (N6: criterio de alternativas cercanas, PR 276 revisado y fusionado)

**Hecho** (worktree `../wt-alternativas`, desde `origin/main` `2e96542`, PR 276): `lib/calculos/alternativas.ts`, función pura `alternativasCercanas(meta, carreras, { excluir, limite })`, con 12 pruebas en `tests/calculos/alternativas.test.ts`. Criterio: misma área del SIES y misma región que la meta, con puntaje de corte del año anterior igual o menor al de la meta, de la más cercana a la más lejana (empate por código). Las carreras fuera del sistema centralizado van en una lista aparte, porque no piden ese puntaje; las del sistema sin corte publicado no entran. El tipo no tiene ningún campo de cliente, y una prueba lo comprueba. Verificado: `tsc`, `eslint` y 297 pruebas.
**Decisión que tomé y que el líder debe confirmar**: «alcanzable» se compara contra el corte de la meta y no contra el puntaje de la persona. Así no hay umbral inventado y la función no necesita el puntaje de la persona. Si se quiere usar el puntaje simulado, se agrega como filtro opcional.
**Revisión** (`revisar-pr`, confirmada por el líder): se aprobó sin hallazgos Críticos ni Altos. Se aplicaron los Menores: `aComparable(carrera)` para no duplicar la lectura del corte, un límite negativo se trata como cero, y la guía de N10 pide el texto «el año anterior pidieron un puntaje igual o menor» y no «alcanzable», porque cada carrera pondera distinto (era el Medio). Fusionado con squash.
**Pendiente para que Alejandro lo use en N10**: el tipo `Carrera` y la oferta exportada (`scripts/exportar-oferta.ts`) no traen el área. La fuente oficial es la columna `area` del archivo de empleabilidad del SIES (`datos/procesados/empleabilidad.csv`: una sola área por cada una de las 190 carreras genéricas). Falta llevarla a la base o a la exportación. Las carreras sin empleabilidad quedan sin área y no reciben alternativas.

## 2026-11-17 (ADR 0030 aceptado)

**Hecho**: el líder aceptó el ADR 0030, «Continuidad visual y movimiento del portal» (comparte logo, navegación y tren de la portada; cabeceras con ilustración propia; tarjetas con cabecera gráfica; entrada de 850 ms y escalonado de 90 ms limitado a dos posiciones; foco inmediato, movimiento reducido y contenido visible sin JavaScript). Pasó de «propuesta» a «aceptada (2026-11-17, por el líder)». Lo construido en #265, #266 y #267 ya lo cumple y se verifica con `tests/accesibilidad/continuidad.spec.ts`.

## 2026-11-17 (lotes 12 a 15 cargados en Supabase)

**Hecho**: los lotes 12, 13, 14 y 15 quedaron cargados en la base de producción con `scripts/cargar-lotes.mjs`, cada uno en su transacción, con la cadena de conexión en `.env.local` (ignorado por git; el script no la imprime). Primero `--simular` (conexión correcta, sin escribir) y después la carga real. Conteos antes → después: acreditaciones 0 → 116 (82 acreditadas, 19 no acreditadas, 15 bajo tutela); puntaje de corte 0 → 2.138 (1.591 con valor, 547 sin valor con su motivo); costo de matrícula 0 → 11.364 (10.914 con valor, de $40.000 a $3.301.936, y 450 sin valor con su motivo); matrícula total 0 → 11.364 (de 1 a 5.303 estudiantes). El resto de la base no cambió (11.364 variantes, 7.950 indicadores del SIES, 2.086 requisitos, 10.430 vacantes, 1.590 tramos de ingreso).
**Tropiezos**: la cadena de la primera prueba tenía marcadores sin reemplazar (`TU-PROYECTO`, `TU-REGION`); se corrigieron el usuario y el servidor en `.env.local` sin tocar la contraseña. El pooler correcto del proyecto es el de São Paulo (`aws-1-sa-east-1`), puerto 5432.
**Pendiente**: borrar la línea `SUPABASE_DB_URL` de `.env.local` (la contraseña de la base no hace falta guardada); comprobar en el sitio publicado que la ficha, el comparador y la hoja muestran los datos nuevos; regenerar los lotes 7 a 10 si cambia algo (el cambio del PDF del DEMRE del 13-nov no alteró cifras en lo comparable).

## 2026-11-17 (carga de los lotes 12 a 15: preparada, falta que el líder la ejecute)

**Qué pasó**: el líder pidió cargar los lotes 12 a 15 en Supabase. No lo hice: no tengo la cadena de conexión a la base (`.env.local` trae la URL, la clave pública y una clave de servicio, pero no la contraseña de Postgres), los lotes son archivos SQL que PostgREST no ejecuta, y escribir en producción con la clave de servicio saltándose la ruta probada habría sido improvisar sobre la base real. La guía de carga pide que la cadena no pase por ningún chat.
**Lo que sí quedó listo** (rama `docs/cargar-lotes-12-15`): los lotes generados con el código actual en `datos/procesados/lotes/` (12: 116 acreditaciones; 13: 2.138 puntajes de corte; 14: 11.364 matrículas de inscripción; 15: 11.364 matrículas totales) y `scripts/cargar-lotes.mjs`, un cargador sin `psql` que comprueba la base, carga cada lote en una transacción y muestra conteos antes y después. Probado con un sustituto de `pg` sobre un Postgres en memoria: simulación, carga real, reversión ante un error (exit 1, nada a medias) y repetición sin duplicados. **No se probó contra un Postgres real por red** (el servidor de PGlite no es compatible con `pg`).
**Pendiente**: el líder ejecuta `node scripts/cargar-lotes.mjs --simular 12 13 14 15` y luego sin `--simular`, con su cadena en `SUPABASE_DB_URL`.

## 2026-11-17 (costo del primer año repuesto)

**Hecho** (rama `feat/costo-primer-anio`): por decisión del líder, ahora que el diccionario oficial define `VALOR_MATRICULA` (#269), se repone «Costo del primer año» = arancel anual + costo de matrícula, **elaboración propia** con datos de Mineduc (`lib/datos/costo.ts`). Va en la ficha (tarjeta propia) y en el comparador y la hoja (fila del grupo «Cuánto cuesta», calculada en `datoDeFila`). Solo se calcula si Mineduc informa los dos montos; con uno solo diría menos de lo real y la tarjeta dice por qué no. Se habla del «primer año» porque el diccionario no dice si la matrícula se repite cada año.
**Verificado**: `tsc`, `eslint`, tokens, 285 pruebas de TypeScript (5 nuevas), build y 114 de accesibilidad; Enfermería U. de Chile: $6.388.500 + $217.600 = $6.606.100.
**Pendiente**: cargar los lotes 12 a 15 en Supabase (líder); sin el lote 14 el costo del primer año dirá «sin datos» en producción.

## 2026-11-17 (definición oficial de la matrícula confirmada)

**Hecho** (rama `docs/matricula-definicion`): el RAR de Matrícula 2026 respondió esta noche (34 MB, descargado en una carpeta aislada del scratchpad; solo se extrajo el diccionario). El diccionario oficial (`ER_Matricula_Educacion_Superior_2007_2026_PUBL_MRUN.pdf`, página 3) define `VALOR_MATRICULA` como el «valor en pesos que el estudiante debe pagar para hacer efectiva su matrícula» y `VALOR_ARANCEL` como el «arancel anual de la carrera o programa»; `FORMATO_VALORES` es la moneda (pesos o UF) de ambos. Con eso el texto de la tarjeta «Costo de matrícula» dice ahora «Valor en pesos que se paga para hacer efectiva la matrícula, aparte del arancel anual» (ficha, comparador y hoja), el glosario público trae «Costo de matrícula» y «Costo del arancel anual» con esta fuente, y el diccionario y la guía de carga dejan de marcar la definición como pendiente.
**Lo que el diccionario NO dice**: si la matrícula se repite cada año. Dice que es lo que se paga para hacerla efectiva.
**Decisión del líder pendiente**: reponer «Costo del primer año» (arancel anual + matrícula). Con la definición oficial la suma tiene sentido para el primer año; es elaboración propia y se rotularía así.
**Verificado**: `tsc`, `eslint`, tokens, 280 pruebas de TypeScript, 114 de accesibilidad (la prueba de siglas del glosario obligó a escribir «Unidad de Fomento» sin sigla).

## 2026-11-17 (trazabilidad del Puntaje Ranking: se cerró el #234 y se rehízo con TODO(fuente))

**Hecho** (rama `docs/trazabilidad-puntaje-ranking`): el #234 de Cristóbal se cerró porque las citas de Acceso Mineduc (Acta N.º 75, Instrumentos 2023 e Instrumentos marzo 2027) no se pueden verificar: los PDF devuelven un aviso de mantenimiento. Su contenido se rehízo sobre `main` sin afirmar nada que no se haya comprobado: el ADR 0024 conserva su contexto verificado y agrega un bloque «Citas de Acceso Mineduc pendientes de verificar» con cada atribución y `TODO(fuente)`; el módulo y la prueba del ranking llevan el mismo `TODO(fuente)`. La aritmética del ejemplo de 824 puntos sí se comprobó (m = 331,4; b + m × 6,33 = 824,36). La fuente del ejemplo del ponderado (848,75) **sí** se verificó el 17-nov en el PDF del DEMRE, página 5, y quedó citada.
**Verificado**: `tsc`, `eslint`, tokens y las pruebas de TypeScript.
**Pendiente**: abrir los tres PDF de Acceso Mineduc cuando el sitio responda y anotar página y sección exactas; ahí se quitan los `TODO(fuente)`.

## 2026-11-17 (ADR 0030 y prueba de continuidad visual; reemplaza el #168)

**Hecho** (rama `feat/continuidad-visual`): el ADR 0030 (estado propuesta, a la espera del líder) y `tests/accesibilidad/continuidad.spec.ts` de Cristóbal, aplicados sobre `main` una vez integrados el comparador (#266) y beneficios (#265). La prueba se adaptó a la ficha actual (12 paneles en vez de 9; el título se compara sin distinguir mayúsculas, porque el HTML va en minúsculas). Al correrla apareció un desborde real: a 375 px con el texto al 200 %, la tarjeta «Matrícula total» no cabía («473 estudiantes»). Se corrigió con `overflow-wrap: anywhere` en el valor de las tarjetas.
**Verificado**: `tsc`, `eslint`, tokens, build y 114 de accesibilidad (103 más 11 de navegación).
**Pendiente**: el líder acepta o rechaza el ADR 0030; cerrar los PR 164 a 168 de Cristóbal con un comentario.

## 2026-11-17 (comparador con la cabecera compartida; reemplaza el #164 y el #165)

**Hecho** (rama `feat/comparador-cabecera`): el comparador usa `CabeceraInterior`, tarjetas de carreras con ícono, estados de error y de «sin resultados», celdas con borde discontinuo cuando falta el dato y la cuadrícula 1/4 + 3/4 de la tabla en escritorio. Es el contenido propio del #164 (CSS de tabla y celdas) y del #165 (integración) de Cristóbal, adaptado a la estructura actual de `main` (grupos del #263 y bloque por carrera en teléfono, que reemplazó a las casillas «elige dos carreras»). La prueba `tests/accesibilidad/comparador.spec.ts` del #165 se adaptó: ya no hay casillas en teléfono, y los encabezados son grupos (nivel 2) y filas (nivel 3).
**Verificado**: `tsc`, `eslint`, tokens, build y 102 de accesibilidad (91 más 11 de navegación); comparador con tres carreras a 1280 px y a 360 px sin desborde.
**Pendiente**: cerrar el #164 y el #165 con un comentario; el #168 (ADR 0030 y prueba de continuidad) depende de que este y el de beneficios (#265) estén fusionados.

## 2026-11-17 (beneficios con la cabecera compartida; reemplaza el #166 y el #167)

**Hecho** (rama `feat/beneficios-cabecera`): la página de beneficios usa `CabeceraInterior` con dos accesos («Ver calendario» y «Buscar beneficios»), y sus tarjetas y plazos tienen los estilos del sistema visual. Es el contenido propio del #166 (estilos) y del #167 (integración) de Cristóbal, aplicado limpio sobre `main` (el parche se aplicó sin conflictos). Se agregó la prueba de accesibilidad `tests/accesibilidad/beneficios.spec.ts` (catálogo y plazos con fuente y fecha sin JavaScript; búsqueda) y la sección «Beneficios» de `docs/diseno.md`; el párrafo del #167 quedaba mal ubicado bajo «Pendientes».
**Verificado**: `tsc`, `eslint`, tokens, build y 100 de accesibilidad (89 más 11 de navegación); beneficios a 360 px sin desborde.
**Pendiente**: cerrar el #166 y el #167 con un comentario que explique el reemplazo.

## 2026-11-17 (hoja de decisión en secciones)

**Hecho** (rama `feat/hoja-secciones`): la hoja de decisión usa los mismos cuatro grupos que el comparador (`GRUPOS_DE_FILAS`), en pantalla (encabezados de nivel 3 dentro de cada opción) y en el texto descargable, que ahora trae el título de cada grupo antes de sus datos. La primera fila de cada grupo no repite el borde de la línea del título.
**Verificado**: `tsc`, `eslint`, tokens, 279 pruebas de TypeScript (1 nueva), build y 95 de accesibilidad; hoja con dos carreras revisada a 360 px sin desborde.
**Pendiente**: cargar los lotes 12 a 15 en Supabase (líder); confirmar qué mide `valor_matricula`.

## 2026-11-17 (comparador en secciones)

**Hecho** (rama `feat/comparador-secciones`): las 11 filas del comparador van en cuatro grupos: «Cuánto cuesta», «Cómo entrar», «Cómo es estudiarla» y «Después de titularte» (`GRUPOS_DE_FILAS` en `lib/datos/indicadores-vista.ts`). La tabla de escritorio y el bloque por carrera del teléfono usan los mismos grupos, con encabezados de nivel 2 y 3 (escritorio) o 3 y 4 (teléfono). El tramo de ingreso, que es texto largo, ahora parte en los espacios en vez de salirse de su celda. Documentado en `docs/diseno.md`.
**Verificado**: `tsc`, `eslint`, tokens, 278 pruebas de TypeScript (2 nuevas: cada fila está en un solo grupo), build y 95 de accesibilidad; comparador con tres carreras revisado a 360 px (sin desborde horizontal) y a 1280 px.
**Pendiente**: la hoja de decisión sigue con la lista plana de filas; decidir si también se agrupa. Cargar los lotes 12 a 15 en Supabase (líder).

## 2026-11-17 (comparador y hoja de decisión con los datos nuevos)

**Hecho** (rama `feat/comparador-datos-nuevos`): el comparador y la hoja leen ahora las mismas 11 filas que la ficha: se sumaron ingreso al 4.º año (tramo en palabras), retención de primer año, continuidad de estudios, costo de matrícula, duración formal y matrícula total. Antes la fila de ingreso decía «sin datos» en todas las carreras porque buscaba un indicador numérico que no existe. Un solo lugar arma el dato de cada fila (`datoDeFila` en `lib/datos/indicadores-vista.ts`) para el comparador, la hoja y el texto descargable. Cuando falta un dato dice por qué (fuera del sistema de admisión centralizado, o sin cifras del SIES). El título «Arancel anual» pasó a «Costo del arancel anual», igual que en la ficha.
**Verificado**: `tsc`, `eslint`, tokens, 276 pruebas de TypeScript (7 nuevas), build y 95 de accesibilidad; comparador con tres carreras revisado en pantalla.
**Pendiente**: cargar los lotes 12 a 15 en Supabase (líder); confirmar qué mide `valor_matricula`; regenerar los lotes 7 a 10; con 11 filas × 3 carreras el comparador queda largo en teléfono, conviene mirarlo con una persona real.

## 2026-11-17 (matrícula total: lote 15)

**Hecho** (rama `feat/matricula-total`): la «Matrícula total» de la ficha tenía 0 % de cobertura porque nadie la cargaba, aunque `carga.csv` trae el recuento de las 11.364 carreras y la unidad `estudiantes` ya existía en la base. `generar_lotes.py` escribe ahora `15_matricula_total.sql` (indicador de variante, de 1 a 5.303 estudiantes, fuente Mineduc). Probado en Postgres en memoria (PGlite): 11.364 filas y repetible. La ficha no cambia: ya leía ese indicador. Documentado en la guía de carga (sección 16), el diccionario y `portal.md`.
**Aviso**: hay carreras con muy pocos estudiantes (el mínimo es 1). Es un recuento por carrera y no identifica a nadie, pero una cifra tan baja puede leerse como «carrera casi sin estudiantes» cuando solo refleja el último año de una carrera nueva.
**Pendiente**: cargar el lote 15 junto con el 12, 13 y 14 en Supabase (lo hace el líder).

## 2026-11-17 (noche: 162 cerrado, 163 rehecho y fusionado como 259)

**Hecho**: el **162** se cerró (lo reemplazó el 255). El **163** de Cristóbal se rehízo desde `main` como el **259** (mío, con su diseño): tarjetas de carrera elegida con colores de marca, buscador y resultados para agregar; fusionado con squash y `--admin` a las 22:59 UTC, CI completo en verde, y el 163 se cerró con un comentario. Verificado en local: `tsc`, `eslint`, `next build`, `tokens.py --check`, pruebas de accesibilidad del comparador, y el estado con dos carreras y resultados con axe en tema claro y oscuro, sin desborde a 360 y 1280 px al 100 % y 200 %, con capturas revisadas.
**Por qué**: el 163 estaba escrito sobre el CSS del comparador anterior al 244 y su base era la pila antigua. **No se portó** el `overflow-wrap: break-word` de la tabla (habría revertido el arreglo del 244 a 200 %), ni el ancho de página (`.contenido`) ni el CSS de `.elegirMovil`: eso queda para el 165 (cabecera compartida).
**Pendiente**: el 164 (tabla y celdas) lo rehace Cristóbal desde `main`, avisado en el comentario; después 165 a 168, de a uno. El 234 sigue bloqueado: desde esta máquina `acceso.mineduc.cl` rechaza la conexión (curl, agente de lectura web y navegador integrado), así que no se pudieron verificar las páginas de las tres citas; alguien debe abrir los PDF desde un navegador normal. El 256 (del líder) está sin revisar. No se probó en lector de pantalla ni en teléfono real.
**Lección**: un cambio de rama con archivos sin commit en el árbol aborta y un script posterior editó la rama equivocada; para tocar `BITACORA.md` o armar un PR limpio, usar un worktree desde `origin/main`. El archivo usa saltos CRLF: insertar texto con `
`.

## 2026-11-17 (ficha: ingreso, retención, continuidad, duración formal frente a real y por qué faltan datos del DEMRE)

**Hecho** (rama `feat/ficha-ingreso-retencion`): medí qué datos hay en las 11.364 carreras y encontré que la ficha mostraba «Sin datos suficientes» en el ingreso al 4.º año en el 100 % de ellas, aunque el tramo está cargado para 7.299. Ahora la ficha lee `tramo_ingreso_sies` y muestra el tramo en palabras tal como lo publica el SIES. También muestra **retención de primer año** (59,8 % de las carreras) y **continuidad de estudios** (64,2 %), que estaban cargadas pero no se veían. **Duración formal y real** van juntas en una tarjeta, cada una con su fuente y sin restarse (la formal sale de Mineduc, con la fuente del arancel de la misma variante). Las carreras sin código DEMRE explican en palabras por qué no tienen vacantes, puntaje de corte ni ponderaciones. Sin fila del SIES, la tarjeta dice que Mi Futuro no publica el dato o que no pudimos asociar la carrera.
**Cobertura medida** (Postgres de prueba con los lotes 1 a 14): acreditación 100 %; arancel 99,9 %; costo de matrícula 96,0 %; empleabilidad 63,1 %; duración real 57,4 %; ingreso (tramo) 64,2 %; solo carreras DEMRE (2.086): vacantes y ponderaciones 100 %, puntaje de corte 74 %; matrícula total 0 % (no está cargada).
**Cambios de código**: `codigo_demre` y `tramos_ingreso` en el mapeo, la consulta remota y el exportador; tipos `TramoIngreso` y `duracion_formal_semestres` (este último no está en la base: lo arma el mapeo); componentes `IngresoTramo` y `Duracion`; muestra de desarrollo con tramos y continuidad reales y sin vacantes ni puntaje en las carreras sin código DEMRE.
**Verificado**: `tsc`, `eslint`, tokens, 269 pruebas de TypeScript, 220 de Python, build y 89 de accesibilidad; ficha de IP Duoc UC revisada a 360 px.
**Pendiente**: la carga de los lotes 12, 13 y 14 en Supabase es del líder (no tengo acceso a la base); los lotes 7 a 10 son del 9-nov y no traen el cambio del PDF del DEMRE del 13-nov; la matrícula total sigue sin cargarse; el comparador no muestra los datos nuevos; textos de las tarjetas para tu revisión.

## 2026-11-17 (cierre: 255 fusionado, el 162 queda reemplazado)

**Hecho**: Cristóbal abrió el **255**, el reemplazo del 162 desde `main` (un commit propio, cinco archivos, Next 16.4.6 intacto); se revisó con `revisar-pr` (aprobable, sin hallazgos Críticos, Altos ni Medios) y se fusionó con squash y `--admin` a las 22:51 UTC, con el CI completo en verde. Trae la cabecera compartida del explorador, la espera accesible al enviar el formulario («Buscando carreras…», tres tarjetas decorativas, movimiento reducido, `pageshow` al volver), el error y el vacío con título, y la sigla SIES explicada. Se borró la rama del 254 en el fork del líder.
**Pendiente**: cerrar el 162 en GitHub. El líder debe ver cómo se ve la espera y leer los textos (AGENTS.md 4.6.4); confirmar que la cabecera compartida da salida clara a la portada, porque se quitó «Volver al inicio». El 163 y los siguientes (164 a 168) se rehacen desde `main`, de a uno, cada uno después de fusionar el anterior. El 234 sigue bloqueado: sus tres PDF de Acceso Mineduc no se pudieron verificar y falta el rebase.
**Por qué**: rehacer cada tramo desde `main` con solo el aporte propio evita revertir trabajo ya fusionado; el 162 antiguo habría borrado unas 3.700 líneas.

## 2026-11-17 (noche: 251 fusionado, 162 devuelto para rehacerlo desde main)

**Hecho**: el **251** (Cristóbal, reemplazo limpio del 161) quedó fusionado en `main` con squash y `--admin` a las 22:36 UTC, con los siete checks en verde, tras retirar la espera del alcance de las tarjetas y actualizar la rama. El **162** (espera accesible del explorador) se revisó y se devolvió: su base es la rama antigua del 161 y contra el `main` actual revertiría unas 3.700 líneas (acreditación, ponderaciones, puntaje de corte, ayuda, y `next` de 16.4.6 a 16.4.4). Se publicaron en el 162 dos comentarios: los cambios exactos para rehacerlo desde `main` y el mensaje para Cristóbal.
**Pendiente**: Cristóbal abre un 162 nuevo desde `main` con solo `CargaExplorador.tsx`, `Explorador.tsx`, la espera en el CSS, una sección en `docs/diseno.md` y `carreras.spec.ts` (cinco archivos, un commit propio). Los textos y cómo se ve la espera los revisa el líder. Las ramas 163 a 168 se rehacen igual, de a una, cada una después de fusionar la anterior. El 234 sigue bloqueado: sus tres PDF de Acceso Mineduc no se pudieron verificar y falta el rebase.
**Nota**: la rama `fix/pila-limpia-pr161` está en el fork de Cristóbal y no la puedo borrar desde aquí.

## 2026-11-17 (tercera pasada: 244 fusionado, 251 con cambios menores)

**Hecho**: el **244** (comparador a 200 %) quedó fusionado en `main` con squash y `--admin`, por orden del líder; Ale resolvió las rutas sin auditar. El **251** (Cristóbal, reemplazo limpio del 161) recibió comentario con «requiere cambios menores»: unas 80 líneas de CSS de espera accesible que pertenecen al #162 y no se usan, formato y descripción. El **234** recibió recordatorio (fuentes de Acceso Mineduc sin verificar, rebase). Comentarios publicados en GitHub.
**Pendiente**: Cristóbal arregla el 251; la pila 162-168 espera a que se fusione. Ale: probar nombre y arancel más largos a 200 % y 320 px, y unificar la función de minúsculas (ficha y comparador). La rama `fix/comparador-zoom-200` no se borró.

## 2026-11-17 (segunda pasada sobre los PR de Alejandro y Cristóbal: nada nuevo que revisar salvo el 242)

**Hecho**: sin commits nuevos desde las revisiones previas en el **244** (Alejandro), el **234** y la pila **161 → 168** (Cristóbal). El **242** (`next` 16.4.5) es nuevo y quedó obsoleto: `main` ya trae 16.4.6 por el #243 y el PR tiene conflicto; se recomienda cerrarlo. Los PDF de Acceso Mineduc que bloquean el 234 siguen devolviendo la página de mantenimiento (probado el 17-nov). No se publicó ningún comentario en GitHub.

## 2026-11-17 (revisión de los PR de Alejandro: 241 fusionado, 244 con cambios pedidos)

**Hecho**: revisé con `revisar-pr` los dos PR abiertos de Alejandro. El **241** (título de la ficha sin partir palabras, mayúsculas por CSS) quedó fusionado en `main` con squash y `--admin`, porque la regla de la rama exigía una aprobación que no existía; el líder autorizó el `--admin` en el chat. El **244** (comparador a 200 % de zoom) recibió un comentario con veredicto «requiere cambios» y sigue abierto.
**Por qué se pidieron cambios en el 244**: la fuente visible pasó a ser la sigla cruda (se perdió `nombreDeFuente()`), la fecha perdió «Consultada el» y duplica `lib/datos/fechas.ts`, y `textoLegible` deja todo en minúsculas con otro criterio que la ficha. El 244 también choca con `main` en `docs/auditoria-accesibilidad-2026-11-14.md` (el 241 edita filas contiguas), así que Alejandro debe rebasar.
**Pendiente**: Alejandro corrige y rebasa el 244; el líder decide si acepta que en teléfono el comparador deje de mostrar dos carreras lado a lado (queda un bloque vertical por carrera). Unificar en una sola función compartida el pasaje a minúsculas del nombre de la carrera (hoy está duplicado en la ficha y en el comparador). La rama `fix/zoom-200-accesibilidad` del 241 no se borró.
**Siguiente**: cuando Alejandro suba el rebase del 244, revisar solo los tres puntos medios (siglas, fecha, minúsculas) y el conflicto resuelto.

## 2026-11-17 (lotes 12, 13 y 14 probados contra Postgres)

**Hecho**: con PGlite (Postgres en WebAssembly, instalado solo en la carpeta temporal, no es dependencia del repo) se aplicaron las 11 migraciones y los lotes 1 a 6, 12, 13 y 14 con la carga real del 5-nov, sin errores. Resultados: 11.364 variantes; 116 acreditaciones; 2.138 puntajes de corte (1.591 con valor); 11.364 matrículas de inscripción (10.914 con valor, 450 nulas con motivo). El lote 14 es repetible: una segunda carga no agrega filas. Se usó un esquema `auth` simulado y sin las pruebas de RLS.
**Qué no prueba**: el comportamiento de RLS con usuarios reales de Supabase ni el rendimiento en la base de producción. Los lotes 7 a 11 (SIES y DEMRE) no se incluyeron.
**Pendiente**: cargar los lotes en Supabase (lo hace el líder); confirmar qué mide `valor_matricula` (el RAR no se pudo bajar: Mineduc y Mi Futuro rechazan la conexión desde este equipo); glosario público y comparador sin los términos nuevos.

## 2026-11-17 (matrícula en la ficha: lote 14 y dos tarjetas; el total se quitó; PR 252)

**Hecho** (rama `feat/costo-total`, PR 252): `generar_lotes.py` escribe `14_matricula_inscripcion.sql` (indicador de variante, pesos, Mineduc; con la carga real, 10.914 variantes con monto y 450 nulas con el motivo oficial). La ficha muestra «Costo de matrícula» y «Costo del arancel anual», cada uno con su fuente. La muestra trae la matrícula real de sus 10 carreras. Documentado en la guía de carga (sección 15), el diccionario y el glosario de datos.
**Decisión del líder**: «Costo del primer año» (arancel + matrícula) se sacó porque no se pudo confirmar qué mide `valor_matricula`. Los sitios de Mineduc y Mi Futuro rechazaron la conexión desde este equipo (curl, navegador y agentes de lectura); Internet Archive no tiene el RAR, y su copia del glosario de matrícula 2025 solo define conteos de estudiantes. Una página de la U. de Concepción muestra el mismo monto (52.795) como «Valor Matrícula», pero no es fuente.
**Verificado**: `tsc`, `eslint`, pruebas de TypeScript y Python, build y accesibilidad (ver el PR).
**Pendiente**: ejecutar el lote 14 contra Postgres de prueba; si se consigue el diccionario del RAR (`ER_Matricula_Educacion_Superior_2007_2026_PUBL_MRUN.pdf`, descargado desde otra red) y define la matrícula como cobro anual o único, volver a evaluar el total; glosario público y comparador sin los términos nuevos.

## 2026-11-17 (cierre: PR 243, 245, 247 y 248 fusionados a `main` con permisos de administrador)

**Hecho**: el líder autorizó fusionar con `--admin` cuando todo estuviera en verde. Se fusionaron con squash, en orden: [243](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/243) `next` 16.4.6 (`310288f`), [245](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/245) ponderaciones (`92d51c6`), [247](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/247) acreditación y lote 12 (`70abcef`) y [248](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/248) puntaje de corte y lote 13 (`0d80f43`). Los checks de cada uno estaban en verde (7 de 7) antes de fusionar.
**Qué hubo que resolver**: al fusionarse el 245 con squash, el 247 quedó con conflicto de contenido idéntico (llevaba los commits del 245). Se rebasó solo su commit propio sobre `main` (`git rebase --onto`, `--force-with-lease` sobre mi propia rama) y se verificó el estado combinado antes de fusionar. La rama del puntaje de corte se rebasó igual; su árbol resultó idéntico al ya verificado.
**Verificado en `main` (`0d80f43`) tras las cuatro fusiones**: `tsc`, `eslint`, tokens, 254 pruebas de TypeScript, 217 de Python, build con `next` 16.4.6 sin el aviso de seguridad y 60 de accesibilidad. El CI de GitHub de los tres primeros terminó en éxito; el del último seguía corriendo al escribir esto.
**Pendiente de datos (no es código)**: cargar en Supabase los lotes 12 (acreditaciones) y 13 (puntajes de corte, ya generado en `datos/procesados/lotes/`), previa prueba en una base de prueba (no se ejecutaron contra Postgres), y recargar vacantes y ponderaciones del DEMRE (el PDF cambió el 13-nov). Hasta entonces la ficha en producción dice «Mineduc no informa la acreditación» y «El DEMRE solo publica datos de las carreras…» para todas las carreras.
**Después del cierre, el mismo día**: la página `/preguntas` (con «puntaje de corte» y «bajo tutela» en el glosario y una pregunta sobre el puntaje de corte) se subió en el [PR 249](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/249), y el análisis de sitios de referencia con estas entradas, en otro PR de documentos. Las entradas que siguen se escribieron antes de subir cada rama: donde dicen «sin subir» o «sin commit», ya están fusionadas.
**Pendiente de producto**: pedir al DEMRE que confirme el método del puntaje de corte; costo total (matrícula), que tiene fuente pero no cargador; el resto de las propuestas del análisis (calendario, comparación con rango, portada y menú por etapa).
**Limpieza**: los worktrees `../feat-ficha-completa` y `../fix-next-16-4-6` y las ramas fusionadas pueden borrarse cuando el líder quiera; no se borró nada de lo fusionado. Los archivos individuales del DEMRE ya se borraron.

## 2026-11-17 (puntaje de corte: calculado, validado y construido en `feat/puntaje-de-corte`, 1 commit local sin subir)

**Hecho** (worktree `../feat-ficha-completa`, rama `feat/puntaje-de-corte` `33cd307`, apilada sobre `feat/ficha-acreditacion`; sin push ni PR): cargador `datos/generar_lotes_corte.py` (lote 13, 17 pruebas), lectura de indicadores de variante, tarjeta de la ficha con «Elaboración propia con Datos abiertos DEMRE 2026», muestra con los cortes reales de sus cuatro universidades y documentación (diccionario, guía de carga sección 14, fuentes, diseño). Se aplicaron las reglas acordadas: publicar solo si el conteo de seleccionados iguala a `NUM_SELEC_REG` oficial y hay al menos 8. **Con los datos reales: 1.591 de 2.138 carreras se publican; 497 sin dato por no coincidir con el conteo oficial, 47 por tener menos de 8 seleccionados, 3 sin seleccionados regulares.** Verificado: `tsc`, `eslint`, tokens, 254 pruebas de TypeScript, 217 de Python, build y 60 de accesibilidad; capturas a 360 px revisadas.
**Dos cosas más que salieron**: (1) axe marcó que los enlaces de «¿De dónde salen estos datos?» no se distinguían del texto sin color; ya existía, lo destapó la fuente nueva; se subrayaron. (2) La rama `docs/puntaje-de-corte`, que afirmaba que no había fuente, se borró (su único commit quedó obsoleto).
**Lote real generado** en `datos/procesados/lotes/13_puntajes_corte.sql` (1,4 MB) e `informe_corte.json` de tu checkout principal (carpeta ignorada por git); solo trae códigos de carrera y un puntaje por carrera, ningún dato de personas. **No se ejecutó contra Postgres**: probarlo en una base de prueba (guía, sección 5) antes de producción. Los archivos individuales del DEMRE (Archivo D) se borraron de la carpeta temporal; quedan las estadísticas oficiales agregadas (300 KB).
**Orden de los PR**: 245 (ponderaciones, abierto) → acreditación → puntaje de corte; cada una se abre cuando la anterior se fusione. Las dos últimas tocan `oferta-remota`, `oferta-mapeo` y `exportar-oferta`, por eso van en cadena.
**Pendiente**: subir y abrir los PR en ese orden; cargar los lotes 12 y 13 y los datos actualizados del DEMRE en Supabase; sumar al glosario público «puntaje de corte» (ahora con su definición real), «bajo tutela» y los estados de acreditación; pedir al DEMRE que confirme el método (no es obligatorio). Los textos de la ficha deben pasar por el líder.
**Cambio de conclusión**: la entrada de abajo dice que no hay fuente oficial del puntaje de corte. Sigue siendo cierto que el DEMRE no publica **agregado** el puntaje ponderado del último seleccionado, pero sí publica los datos desde los que se calcula, y el cálculo se pudo validar. [Resuelto: la rama `docs/puntaje-de-corte` se borró y el cálculo se construyó.]
**Qué se descargó** (con permiso del líder, desde `portal-transparencia.demre.cl`, proceso de admisión 2026; carpetas aisladas en el scratchpad, fuera del repositorio): «Estadísticas de Selección» (87,9 KB; CSV oficial por carrera con vacantes, `NUM_SELEC_REG`, promedio de obligatorias del último seleccionado y percentiles) y el «Archivo D», postulación y selección (12,6 MB comprimido, 78,9 MB, 1.686.689 filas anónimas: `ID_aux`, orden, carrera, estado, tipo y puntaje ponderado de cada preferencia). Condiciones de uso releídas el 17-nov: no identificar personas, citar «Datos abiertos DEMRE XXXXX», no interpretar los resultados como calidad de la educación escolar.
**Método**: puntaje ponderado mínimo entre las preferencias con estado 24 («estás seleccionada/o para esta carrera») y tipo REGULAR, por carrera. Es el último seleccionado de la selección del 19-ene-2026, no el último matriculado (la lista de espera lo baja un poco).
**Validación**: (1) el número de seleccionados que sale del archivo coincide **exactamente** con `NUM_SELEC_REG` del archivo oficial de estadísticas en 1.650 de 2.147 carreras (76,9 %); en las otras 497 faltan entre 1 y 7 registros (mediana 1), que es lo que el DEMRE dice haber retirado para proteger identidades, y ahí el mínimo podría estar sobrestimado. (2) Medicina de la UDD da 956,4 (101 de 101 seleccionados) y la UDD publica «puntaje de corte de 956,4 puntos» en su sitio; Ingeniería Civil en Biomedicina da 881,4 (25 de 25) y la UDD publica 881,4. (3) Medicina de la U. de Chile da 931,1, con percentiles 934,5 / 939,0 / 942,4 y máximo 979,6, que coinciden con lo que muestra Resulta (que parece calcular lo mismo; no es fuente: no cita ninguna ni explica su método). (4) `VACANTES_REG` oficial de Enfermería U. de Chile es 97: confirma la corrección del PR 245.
**Lo que mide Resulta como «Corte» no es el estadístico oficial `PROM_OBLIGATORIAS_ULTIMO_SELEC`** (Medicina U. de Chile: 982), que es un promedio de dos pruebas y mide otra cosa.
**Reglas propuestas** (a decidir por el líder): rotular «puntaje del último seleccionado, selección del 19 de enero de 2026, vía regular» y «elaboración propia con Datos abiertos DEMRE 2026»; publicar solo las carreras donde el conteo del archivo iguala a `NUM_SELEC_REG` y hay al menos 8 seleccionados; en las demás, «Sin datos suficientes» con el motivo (el DEMRE retiró registros). Hay que mapear el código DEMRE a la variante (lo hace `generar_lotes_demre.py`), guardar el resultado como indicador de variante (`puntaje_corte`, unidad puntos) y escribir su cargador y pruebas.
**Pendiente**: decisión del líder; implementar cargador, lectura, tarjeta y pruebas; reescribir `docs/datos/diccionario.md`, el texto de la tarjeta y `docs/fuentes.md`; borrar de la carpeta temporal los archivos individuales cuando termine; pedir al DEMRE (`solicituddatos@demre.cl`) que confirme el método, que no es obligatorio pero lo haría más sólido.

## 2026-11-17 (corrección de un error mío en el PR 245: ponderaciones de la universidad equivocada)

**Qué pasó**: en la muestra puse como ponderaciones de Enfermería, Universidad de Chile, la fila 12057 de la Oferta Definitiva del DEMRE, que es de la Pontificia Universidad Católica (los códigos 12xxx son de la UC; los de la U. de Chile son 11xxx, y su Enfermería es la 11080). Además cambié las vacantes de 97 a 120, que son las de la UC, y lo conté como un cambio del DEMRE entre versiones del PDF. **Ambas cosas eran falsas**; las dije al líder en varios mensajes y están en la descripción y los commits del PR 245, en `docs/fuentes.md` y en esta bitácora.
**Cómo se detectó**: al revisar si una página de terceros (Resulta) era fuente del puntaje de corte, sus ponderaciones de la U. de Chile coincidían con la fila 11083 de la Oferta y no con la que yo había usado. Debí comprobar a qué universidad pertenece un código antes de atribuirlo.
**Corregido**: commit `10acba2` en `feat/ficha-ponderaciones` (subido, PR 245): la muestra vuelve a 97 vacantes con su fecha original y trae las ponderaciones reales de la 11080 (NEM 10, Ranking 20, Lectora 15, M1 20, Ciencias 35, promedio mínimo 458); las pruebas atribuyen a la UC sus tres filas y fijan la de la U. de Chile; `docs/fuentes.md` ya no afirma el cambio de vacantes. La descripción del PR 245 se corrigió. Las ramas `feat/ficha-acreditacion` y `docs/puntaje-de-corte` (sin subir) se rebasaron sobre la corrección; un conflicto en `docs/fuentes.md` se resolvió a mano. Verificado en la rama del PR: `tsc`, `eslint`, 233 pruebas, 193 de Python, build y 60 de accesibilidad; en la de acreditación, 246 y 200.
**Qué no cambia**: lo demás del PR 245 (la lógica, la tarjeta, las capturas) no dependía de ese dato. La conclusión sobre el puntaje de corte tampoco.
**Lección**: un código de otra fuente se atribuye a una institución solo después de leer el encabezado de su sección, no por parecerse a otros que ya conocía.

## 2026-11-17 (puntaje de corte: no existe fuente oficial; la ficha lo dice)

**Hecho** (worktree `../feat-ficha-completa`, rama `docs/puntaje-de-corte`, apilada sobre `feat/ficha-ponderaciones` / PR 245, 1 commit local, sin push): se buscó una fuente oficial del «puntaje de la última persona matriculada por carrera» y **no existe**. La Oferta Definitiva 2027 (PDF modificado el 13-nov) no lo trae; las publicaciones del DEMRE 2026 no incluyen puntajes de corte; el glosario de oferta del SIES solo define el «requisito de ingreso»; los datos abiertos del DEMRE son individuales, filtrados y advierten que las cifras derivadas pueden no coincidir con las oficiales. Coincide con lo que el diccionario ya decía el 5-nov. No se construyó cargador: un mínimo calculado desde datos abiertos sería «elaboración propia» sin poder verificarse y mezclaría vías especiales (AGENTS.md 2.1).
**Cambio**: la tarjeta de la ficha dice «No hay una fuente oficial que publique el puntaje de la última persona matriculada en cada carrera, y por eso no lo mostramos. Si lo necesitas, consúltalo en el sitio de la universidad.» en vez de «todavía no mostramos este dato». `docs/datos/diccionario.md` registra lo que se buscó; `docs/fuentes.md` anota la verificación.
**Verificado**: `tsc`, `eslint`, 233 pruebas, build y 60 de accesibilidad; captura a 360 px revisada. No se revisaron las fichas de resultados de Mi Futuro, solo la página del buscador.
**Decisión que queda en manos del líder**: si se quiere el dato, el camino es pedírselo al DEMRE (`solicituddatos@demre.cl`, o una solicitud de transparencia como la del FUAS en `docs/solicitud-transparencia-fuas.md`). Lo que sí es oficial y ya se muestra: el puntaje ponderado mínimo y el promedio mínimo de postulación, en «Ponderaciones para postular».
**Corrección**: dije que las ramas del bloque 1 y de ponderaciones no chocarían en `docs/fuentes.md`; sí chocan (ambas agregan filas de verificación después de la fila del «Informe de acceso»). Es un conflicto trivial de resolver a mano.
**Siguiente**: costo total (la matrícula), que tiene fuente (el CSV de Mineduc) pero no cargador.

## 2026-11-17 (bloque 2 partido en dos ramas con commit, sin subir)

**Hecho** (worktree `../feat-ficha-completa`): el trabajo del bloque 2 quedó en dos ramas apiladas, con un commit cada una y sin push ni PR. `feat/ficha-ponderaciones` (`86c302c`, 280 líneas) sale de `origin/main` `6efd979`; `feat/ficha-acreditacion` (`715055f`, 566 líneas, 160 de ellas son la muestra JSON) sale de la anterior. La rama original `feat/ficha-completa` quedó vacía y se borró. Cada una se verificó sola: la de ponderaciones con 233 pruebas de TypeScript, 193 de Python y 60 de accesibilidad; la de acreditación con 246, 200 y 60, más `tsc`, `eslint`, tokens y `next build`.
**Orden de los PR**: primero ponderaciones, contra `main`. La de acreditación depende de ella (la página, la muestra y dos documentos mezclan ambos cambios), así que se abre después, cuando la primera se fusione, o con la rama de ponderaciones como base. El PR 243 (`next` 16.4.6) es independiente.
**Aviso**: el aviso de seguridad intermitente de `next` 16.4.4 sigue apareciendo en el build de estas ramas (se reintenta y compila); desaparece cuando se fusione el PR 243.
**Pendiente**: subir y abrir los PR; cargar el lote 12 y los datos actualizados del DEMRE en Supabase (el lote 12 no se probó contra Postgres); sumar al glosario público «bajo tutela» y los estados de acreditación; unir con la rama del bloque 1 (`feat/glosario-y-preguntas`), que toca `docs/fuentes.md` y `docs/diseno.md` en otras líneas.

## 2026-11-16 (bloque 2, parte 2: acreditación en la ficha y lote 12; hoy en la rama `feat/ficha-acreditacion`)

**Hecho** (worktree `../feat-ficha-completa`, rama `feat/ficha-completa`, sin commit): la ficha muestra la acreditación de la institución con su estado, años, fechas y fecha de la situación, y enlaza la CNA. Estados: «7 años» con fechas, «No acreditada», «Bajo tutela», «Terminada» (cuando la fecha de término ya pasó; el titular lo dice y un aviso lo repite) y «Sin datos suficientes» si Mineduc no informa. Para que haya datos, `datos/generar_lotes.py` genera el lote nuevo `12_acreditaciones.sql` (tabla `acreditacion_institucion`, que existía y nadie llenaba); la aplicación lo lee (`oferta-remota.ts`, `oferta-mapeo.ts`, `scripts/exportar-oferta.ts`) y usa la fecha más reciente por institución. Guía en `docs/datos/carga-lotes.md`, sección 13.
**Con la carga real del 5-nov** (`datos/procesados/carga.csv`) el lote da 116 filas: 82 acreditadas, 19 no acreditadas, 15 «bajo tutela», sin descartes ni contradicciones. Los 15 «bajo tutela» son los CFT estatales: la Ley 20.910, art. tercero, dice que cada uno es «tutelado y acompañado por una universidad del Estado» (leído en LeyChile). La muestra trae la acreditación real de sus 10 instituciones, con tres casos útiles: vigente, bajo tutela (CFT Biobío) y terminada (CFT Ceduc UCN, que figura hasta el 4-nov-2026, un día antes de la fecha del archivo).
**Verificado**: `tsc`, `eslint`, tokens, 246 pruebas de TypeScript, 200 de Python (21 en el cargador, 7 nuevas) y 60 de accesibilidad con `OFERTA_LOCAL=1`. Capturas a 360 px en claro y oscuro de los tres estados, revisadas; corregí dos textos que contradecían el titular. No se probó con lector de pantalla.
**No verificado**: el SQL del lote 12 **no se ejecutó contra Postgres** (no hay `psql` local); el generador reproduce en Python las restricciones de la tabla. Falta cargarlo en una base de prueba (guía, sección 5) antes de producción. Hasta que el líder cargue el lote 12 en Supabase, la ficha en producción mostrará «Mineduc no informa la acreditación» para todas las instituciones.
**Límites**: `situacion_al` es la fecha de descarga del archivo de Mineduc, la única que da la fuente. El tamaño del cambio (672 líneas más la muestra) supera las 400 de AGENTS.md: conviene partirlo en dos PR, ponderaciones por un lado y acreditación con su lote por otro. Los archivos `docs/fuentes.md` y `docs/diseno.md` también cambian en la rama del bloque 1 (en otras líneas), y habrá que fusionar a mano si chocan.
**Pendiente**: cargar vacantes y ponderaciones del DEMRE (el PDF cambió el 13-nov) y el lote 12 en Supabase; sumar al glosario público «bajo tutela» y los estados de acreditación; puntaje de corte y costo total (matrícula) siguen sin cargador; la duración formal sigue sin fuente.
**Siguiente**: partir en dos PR y revisarlos; después, puntaje de corte o costo total, que piden leer fuente y escribir cargador.

## 2026-11-16 (bloque 2, parte 1: ponderaciones en la ficha, en rama sin commit)

**Hecho** (worktree `../feat-ficha-completa`, rama `feat/ficha-completa` desde `origin/main` `6efd979`, sin commit): la ficha de carrera muestra las ponderaciones del DEMRE (`lib/datos/ponderaciones.ts`, componente `Ponderaciones`, lista de definiciones en vez de tabla porque la tabla desbordaba a 360 px con texto al 200 %). La ficha ahora pide los requisitos a la base (`carrerasPorCodigos(..., true)`), suma la fuente del DEMRE a «¿De dónde salen estos datos?» y, si la carrera no tiene ponderaciones, dice «Sin datos suficientes» con su motivo. `DatoOficial` acepta un `motivo`. La muestra (`datos/ejemplos/carreras.json`) trae las ponderaciones reales de Enfermería, U. de Chile (código DEMRE 11080). [Corregido el 17-nov: este texto decía 12057, que es de la UC; ver la entrada «corrección» de arriba.]
**Verificado**: `tsc`, `eslint`, tokens, 233 pruebas (7 nuevas) y las 60 de accesibilidad con `OFERTA_LOCAL=1`. Capturas a 360 px en claro, oscuro y sin datos, revisadas. No se probó con lector de pantalla.
**Hallazgo importante**: el DEMRE **reemplazó el PDF de la Oferta Definitiva en la misma dirección el 13-nov** (`Last-Modified` y fecha de creación del PDF). ~~La muestra, del 4-nov, decía 97 vacantes para Enfermería; hoy el PDF dice 120.~~ **FALSO, retirado el 17-nov:** las 120 vacantes eran de Enfermería de la UC; las de la U. de Chile son 97, como decía la muestra. Lo que sigue siendo cierto es que el PDF se reemplazó el 13-nov; no se sabe qué cambió, así que conviene comparar con él las vacantes y ponderaciones de la base de Supabase, que se cargó antes.
**Qué falta del bloque 2 y por qué no está**: (1) **Acreditación**: la base guarda solo años y fecha final en `institucion`, sin estado, sin fuente enlazada y sin distinguir «no acreditada» de «sin información»; la tabla `acreditacion_institucion` ya existe con todo eso, pero ningún cargador la llena. Hay que cambiar `datos/generar_lotes.py` y recargar la base. (2) **Puntaje de corte**: existe el tipo de indicador, pero no hay cargador ni fuente leída. (3) **Costo total**: el CSV de Mineduc trae `matricula_inscripcion_pesos`, pero el cargador no lo guarda; el arancel anual ya se muestra. La duración formal sigue sin fuente.
**Pendiente**: decidir el camino de la acreditación (llenar `acreditacion_institucion`: cambio de cargador y recarga de la base por el líder); recargar vacantes y ponderaciones del DEMRE; revisar los textos; agregar al glosario público «ponderación» y «puntaje ponderado» ya están (rama del bloque 1), y falta sumar los términos nuevos cuando haya acreditación.
**Siguiente**: acreditación, con la tabla `acreditacion_institucion`.

## 2026-11-16 (actualización de next a 16.4.6, commit local sin subir)

**Hecho** (worktree `../fix-next-16-4-6`, rama `fix/next-16-4-6` desde `origin/main` `6efd979`, 1 commit local, sin push ni PR): `next` pasa de 16.4.4 a 16.4.6 en `package.json` y `package-lock.json` (el lock solo sube versiones de `next` y de sus paquetes `@next/swc`). `npm audit` ya no lista a `next` (de 14 avisos a 13; quedan 9 moderados y 4 altos de otros paquetes, sin tocar).
**Por qué**: GHSA-mfr8-8qww-v76h (moderada, filtración de información entre parámetros raíz con `use cache` a través de `unstable_cache()`). El proyecto no usa `unstable_cache`, `use cache` ni `cacheComponents` en `app/`, `lib/` ni `next.config.*`, así que el aviso no lo afectaba en la práctica. `@opennextjs/cloudflare` 1.20.15 acepta `next >=16.4.1`.
**Verificado**: `tsc`, `eslint`, 226 pruebas y `next build` con la muestra, sin menciones de seguridad en el build. Accesibilidad: 51 pruebas pasan y fallan 9, todas de la ficha de carrera; fallan igual con 16.4.4 (la ficha responde 500 sin `SUPABASE_URL`), así que no son de este cambio.
**No verificado**: el build de Cloudflare. `npm run cf:build` se detiene en el paso previo que exige `SUPABASE_URL`, y `--skipNextBuild` no sirve porque OpenNext necesita su propia salida `standalone`. El CI no ejecuta `cf:build`, así que hay que mirar el primer despliegue. `eslint-config-next` sigue en 16.4.4 (existe la 16.4.6; no se tocó para mantener el cambio mínimo).
**Pendiente**: el líder decide si se sube la rama y se abre el PR; el PR debe contar lo anterior y la sección de IA utilizada. Los 13 avisos restantes de `npm audit` son otra tarea.

## 2026-11-16 (bloque 1: glosario y preguntas frecuentes, en rama sin commit)

**Hecho** (worktree `../feat-preguntas`, rama `feat/glosario-y-preguntas` desde `origin/main` `6efd979`, sin commit): página `/preguntas` con 11 preguntas en 4 grupos y un glosario de 20 términos. Los textos viven en `datos/ayuda/glosario.json` y `preguntas.json`, cada uno con fuente, URL y fecha de consulta. Componente `Sigla` y `ConSiglas` (`<abbr>` con subrayado punteado), enlace en el pie del portal, ruta en la prueba de accesibilidad, `lib/datos/ayuda.ts` y `tests/datos/ayuda.test.ts` (9 pruebas). Documentado en `docs/componentes.md`, `docs/diseno.md`, `docs/fuentes.md` (fuente nueva: LeyChile, y 5 verificaciones) y `docs/datos/glosario.md`.
**Verificado**: `tsc`, `eslint` y `scripts/tokens.py --check` limpios; 235 pruebas pasan; `next build` compila y `/preguntas` sale estática; 5 pruebas de accesibilidad (axe WCAG 2.2 AA claro y oscuro, 360 px sin desborde, teclado). Capturas a 360 px en claro y oscuro revisadas a mano. No se probó con lector de pantalla ni al 200 % de zoom.
**Fuentes leídas hoy** (en navegador o PDF): páginas del DEMRE (factores de selección, PAES, NEM, Puntaje Ranking, Nuevo Ranking), CNA (acreditación institucional), artículo 54 de la Ley General de Educación (LeyChile) y la metodología del SIES. Dato nuevo para recordar: el Nuevo Ranking rige desde el proceso de admisión 2028, y la metodología del SIES da dos motivos oficiales por los que una carrera queda sin dato (pocos casos o grupo genérico muy amplio).
**Límites**: los textos de beneficios salen del catálogo revisado el 5-nov y del documento del 6-nov, porque el portal de Beneficios Estudiantiles y Acceso Mineduc estaban en mantención. Hay que releerlos cuando vuelvan. Se agregó la fuente LeyChile a `docs/fuentes.md` en el mismo PR; la skill pide un PR aparte, y se puede separar. La definición de CNA como «comisión que se encarga de la acreditación institucional» se apoya en su propia página, sin leer su buscador.
**Aviso de seguridad**: `npm audit` confirma que `next` 16.4.4 está afectado (GHSA-mfr8-8qww-v76h, moderada); la 16.4.6 la corrige sin cambio mayor. Una vez el `next build` falló con ese aviso y al repetirlo compiló. No es de este cambio; queda como tarea aparte.
**Pendiente**: el líder revisa los textos (tono, fuentes) y decide si abre el PR; después se agregan al glosario los términos de la ficha (acreditación con vigencia, puntaje de corte, duración formal) cuando el bloque 2 los muestre.
**Siguiente**: bloque 2, la ficha completa (acreditación, ponderaciones, puntaje de corte y costo total).

## 2026-11-16 (análisis de sitios de referencia)

**Hecho** (sin commit, rama `datos/tabla-agrupacion-carreras`): [`docs/analisis-sitios-de-referencia.md`](docs/analisis-sitios-de-referencia.md) y tres informes crudos en `docs/referentes/` (gobierno, universidades, institutos y comparadores). Tres agentes revisaron 14 universidades, 10 institutos y CFT, 9 sitios públicos y 6 comparadores; el análisis conjunto cruza eso con lo que ya tiene `app/` y propone 16 ideas en tres prioridades.
**Por qué**: el líder pidió buscar lo que funciona y lo que no en los sitios de educación superior y del Estado, y cómo incorporarlo (diseño y secciones).
**Hallazgos clave**: ninguna universidad muestra datos por carrera en una pantalla ni compara con otra institución; 11 de 14 usan cifras sin fuente; «empleabilidad» tiene tres definiciones; casi nadie pone fuente y fecha junto al dato (nosotros sí). DEMRE y Mineduc bloquean el zoom (verificado con `curl`).
**Límites**: nadie vio las páginas en navegador, así que lo visual y lo móvil no están evaluados. No hay estudio de usabilidad de ningún sitio chileno. La evidencia externa (College Scorecard, Hoxby y Turner) se leyó por resúmenes y hay que verificarla antes de citarla. Por confirmar: que mifuturo exija registro para descargar (no aparece en el HTML crudo).
**Segunda pasada en navegador (360 px, mismo día)**: confirmé que mifuturo exige registro con fecha de nacimiento y comuna para descargar, y que el calendario de DEMRE no trae año. Corregí tres afirmaciones de los agentes: UNAB sí cita su empleabilidad en la ficha, UDP sí muestra arancel y acreditación con fecha (y pide email y teléfono para la malla), y las fichas de UDP viven en `/carrera/`. La conclusión se mantiene pero se dice distinto: las fichas muestran datos sueltos, sin año ni definición, no «ningún dato». La U. Mayor no cargó y la nota de empleabilidad de la PUC no se pudo ver; ambas sin verificar.
**Pendiente**: el líder decide qué propuestas entran antes del 19 de diciembre; completar la pasada en navegador (otras universidades, institutos, CFT, Lighthouse, axe); revisar la Superintendencia de Educación Superior, INACAP y los CFT estatales. Mover estos archivos a una rama `docs/` antes de hacer commit: la rama actual es de datos.
**Siguiente**: revisión del líder del análisis y elección de las primeras propuestas (calendario corto en portada, ficha completa, glosario y preguntas frecuentes).

## 2026-11-16 (pruebas del resto del cruce de ocupaciones y áreas: PR 238 fusionado)

**Hecho** (rama `datos/pruebas-cruce-areas`, [PR 238](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/238)): `tests/datos/test_cruce_ocupaciones.py` pasa de 5 a 23 pruebas. Cubre cada rama de `area_de_carrera`, las excepciones de gerentes 11-9xxx, la regla del prefijo más largo, el grupo 19, el grupo desconocido y que toda tabla use solo áreas de `AREAS`.
**Por qué**: la entrada del cruce N18 decía que solo la regla de artistas tenía pruebas.
**Arreglado después** (a pedido del líder): las claves de `CLAVES_ARTE` se buscan como palabra completa (antes «partes» calzaba con «artes»), y se quitó la entrada muerta `"19"` de `GRUPO_SOC`. En las 256 carreras genéricas reales ningún área cambia. Prueba nueva con «Técnico en Partes y Piezas».
**Ordenado**: la prueba de niñeras pasó de la clase de artistas a `PruebasAreaDeOcupacion`. `ocupacion_area.csv` regenerado el 16-nov en `datos/procesados/` de la copia principal (ignorado por Git): solo cambió la niñera (39-9011.01) a Educación; `carreras_areas.csv` salió idéntico. El JSON versionado de la página ya tenía ese cambio.
**Pendiente** (revisión del commit 847a37d): la prueba fija que «Otros Profesionales de Ingeniería» devuelve (None, None), y con ese resultado `main()` termina con `SystemExit`. Hoy no ocurre: esa carrera no está en `oferta.csv`, y las 22 genéricas «Otros… de X» o «Bachillerato y/o Licenciatura en X» de la oferta 2026 usan como X el nombre de un área, así que todas tienen regla. Decidir si una genérica nueva de ese tipo necesita una regla propia o si el `SystemExit` es el aviso buscado. Las pruebas comparan contra las tablas del propio código, no contra una fuente oficial (el cruce es elaboración propia). Lo de «256 carreras sin cambio» se verificó contra `datos/procesados/` de la copia principal, porque el worktree no tiene esa carpeta.
**Fusionado** (16-nov): el [PR 238](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/238) entró a `main` como `52f2e90` (squash, con bypass de administrador, tras la revisión `revisar-pr` y los 7 checks en verde). La rama se borró del fork y de local.
**Decidido** (16-nov, líder): se deja el `SystemExit`. Una genérica nueva sin regla detiene el script y se revisa a mano antes de asignarle área; un comentario en `main()` de `datos/cruce_ocupaciones_areas.py` lo dice.

## 2026-11-14 (nombres de áreas del ADR 0035: cita verificada)

**Hecho** (rama `docs/adr-0035-areas-sies`, sobre `main`): la lista de 11 áreas se toma del filtro «Área de conocimiento» de https://www.mifuturo.cl/buscador-de-carreras/ (leída literal el 14-nov). `docs/fuentes.md` cita la URL y la fecha de lectura. El ADR 0035 tiene una nota: solo se copian nombres, no descripciones, y los nombres no requieren revisión profesional.
**Por qué**: el líder pidió citar la lista oficial en vez de usar nombres sin fuente, y que no se revise cada área.
**Pendiente**: la página no muestra fecha de actualización; se leyó solo la primera mitad (el resumen automático dijo que no hay filtro de área, y se descartó porque contradice el texto literal); la diferencia de mayúsculas «Sin Área definida» (página) frente a «Sin área definida» (código).
**Siguiente**: decidir con el líder si la interfaz muestra otro nombre para esa área.

## 2026-11-14 (plantilla de descripciones por grupo: PR 224 fusionado)

**Hecho**: [PR 224](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/224) fusionado. `datos/descripciones_grupos.csv` tiene los 256 grupos de carrera en estado «pendiente», sin texto. `datos/generar_plantilla_descripciones.py` la crea o actualiza sin borrar textos ya escritos; sus pruebas corren en `tests/datos`.
**Por qué**: el ADR 0035 pide un texto por grupo, revisado y rotulado. Dejar los campos vacíos evita publicar algo sin fuente ni revisión.
**Pendiente**: quién revisa cada área; de dónde salen las fuentes (planes de estudio o una descripción oficial en mifuturo.cl); por qué grupos empezar. Las descripciones no están redactadas.
**Siguiente**: validar el tono con tres o cuatro grupos antes de hacer los 256.

## 2026-11-14 (ADR 0035 ajustado a la carrera genérica oficial: PR 222 fusionado)

**Hecho**: [PR 222](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/222) fusionado. El [ADR 0035](docs/decisiones/0035-descripcion-de-carreras.md) ya dice que el grupo es la carrera genérica oficial de Mineduc, no una normalización propia. Se documentan las cifras (11.364 programas, 1.957 nombres, 256 grupos), los 15 nombres en dos grupos y la separación de «Derecho» y «Bachillerato y/o Licenciatura en Derecho».
**Por qué**: el ADR debe decir lo mismo que el código del PR 218. Inventar reglas de nombre sin fuente iba contra AGENTS.md 2.1.
**Pendiente**: decidir si «Derecho» y «Bachillerato y/o Licenciatura en Derecho» se unen; la tabla de descripciones por grupo, con revisión profesional y rotulado.
**Siguiente**: empezar la tabla de descripciones por grupo cuando el equipo lo decida.

## 2026-11-14 (tabla de agrupación de carreras: PR 218 fusionado)

**Hecho**: [PR 218](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/218) fusionado: `datos/generar_grupos_carrera.py` y sus pruebas. El grupo de cada carrera es su «carrera genérica» oficial (`area_carrera_generica` de la matrícula Mineduc 2026). Resultado: 11.364 programas, 1.957 nombres oficiales, 256 grupos; 15 nombres oficiales caen en dos grupos (por ejemplo, «TRABAJO SOCIAL»: técnico y profesional). Los CSV se generan en `datos/procesados/`, ignorado por Git.
**Por qué**: el ADR 0035 pide agrupar sin inventar nombres. Usar el campo oficial evita reglas propias. Es una desviación del ADR, que dice «normaliza el nombre».
**Callejón**: el PR 217 salió con commits viejos porque la rama se creó desde `docs/bitacora-n17` en vez de `main` (un `git checkout -B` falló sin avisar). Se cerró y se rehízo desde `main` como PR 218. El CI falló por importar `pytest`, que no está en el entorno de `tests/datos` (se usa `unittest`).
**Pendiente**: decidir si el ADR 0035 se ajusta a la desviación; la casilla «Leí y entiendo todo el código» del PR 218 quedó sin marcar, para que la marque el líder.
**Siguiente**: tabla de descripciones por grupo, con revisión profesional y rotulado.

## 2026-11-14 (ADR 0035 aceptado: descripción de carreras por grupo)

**Hecho**: el líder aceptó el [ADR 0035](docs/decisiones/0035-descripcion-de-carreras.md). Fusionados el [PR 213](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/213) (el ADR), el [PR 214](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/214) (la entrada de propuesta) y el [PR 215](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/215) (estado aceptada).
**Por qué**: la fusión de la rama `main` exige una aprobación que la cuenta autora no puede dar, así que el líder fusionó desde GitHub.
**Pendiente**: tabla de agrupación en `datos/`; verificar si mifuturo.cl ya publica descripciones de carreras; medir cuántos grupos resultan de la base de oferta; definir qué profesionales revisan cada área.
**Siguiente**: construir la tabla de agrupación en `datos/`.

## 2026-11-14 (propuesta de ADR 0035: descripción de carreras por grupo)

**Hecho**: [ADR 0035](docs/decisiones/0035-descripcion-de-carreras.md) en estado propuesta, en el [PR 213](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/213). Propone describir cada grupo de carrera (nombre normalizado, sin menciones ni sedes) en lenguaje claro, con un bloque «Títulos parecidos» que explica las diferencias, en vez de describir las ~11 mil carreras una a una. Cada texto se rotula (fuente citada o «elaboración propia») y lo revisa un profesional antes de publicarse. Revisado con `revisar-pr` y `lenguaje-claro`; la confirmación del líder está pendiente.
**Por qué**: los nombres parecidos (Ingeniería Informática, Civil en Informática, de Ejecución en Informática) confunden a quien egresa. Describir cada programa no es revisable a tiempo, y una descripción generada por IA sin revisión infringe AGENTS.md 2.1 y 7.3.
**Pendiente**: aceptar el ADR (líder); verificar si mifuturo.cl ya publica descripciones de carreras; medir cuántos grupos resultan de la base de oferta; definir qué profesionales revisan cada área.
**Siguiente**: construir la tabla de agrupación en `datos/` si se acepta el ADR. Fusionar primero el PR 213 y después este PR, para que el enlace al ADR no quede roto en `main`.

## 2026-11-14 (cruce N18: artistas de espectáculo sin área; revisión de alcance)

**Hecho**: bailarines, coreógrafos y músicos quedaban en «Sin área definida» por la regla de subgrupo `27-2`, que tapaba todo el grupo. Se agregaron `27-203` y `27-204` a Arte y Arquitectura (fusionado en el [PR 210](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/210), commit `91faf3b`).
**Por qué**: una regla por subgrupo SOC gana sobre el área de la carrera. Un prefijo amplio puede tapar subgrupos que sí tienen área. Al tocar una regla así, revisa los títulos del subgrupo, no solo el prefijo.
**Callejón**: `codex exec review --base main` revisó solo el último commit más el cambio sin commitear, y dijo «sin problemas» sobre una rama de 46 archivos. Antes de creer un veredicto de revisión, mira la línea `git diff` del log y confirma que sea `main...HEAD`.
**Pendiente**: el pinchadiscos (27-2091) sigue en «Sin área definida»; no decidido. `datos/procesados/` está en `.gitignore`: el CSV se regenera con el script. La regla de artistas tiene pruebas en `tests/datos/test_cruce_ocupaciones.py`; el resto del cruce no.
**Siguiente**: decidir con el líder el pinchadiscos.

## 2026-11-14 (N17: perfiles de O*NET cargados, fusionado)

**Hecho**: N17 ya estaba terminada antes de esta sesión. [PR 181](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/181) (`datos/cargar_onet_intereses.py`, perfil RIASEC, escala OI) y [PR 182](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/182) (títulos en español) se fusionaron el 14-nov. Se volvió a correr el script: 923 ocupaciones con perfil completo, 0 descartadas, 0 sin título en español; el CSV salió idéntico. Los crudos están en `datos/crudos/` y el registro en `datos/registro_descargas.md`.
**Siguiente**: N18 (cruce con las 11 áreas del SIES, ya hecho en `datos/cruce_ocupaciones_areas.py`, pendiente de revisión humana). N19 (página `/ocupaciones`) ya está fusionada en el [PR 185](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/185).

## 2026-11-14 (licencia de O*NET verificada; ADR 0034 ajustado)

**Hecho** (rama `docs/adr-0034-uso-declarado-onet`, [PR 207](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/207)): la licencia de la base de O*NET 31.0 se leyó en onetcenter.org (license_db.html): CC BY 4.0, sin cláusula de validación. La validación solo aplica a las herramientas, que no se usan. El ADR 0034 ya no dice «tal cual, sin modificarla»: la base no se altera y el cruce con carreras chilenas es un archivo derivado propio, con su lista de cambios.
**Confirmado** (14-nov): el líder confirma que el explorador no copia ítems ni textos del Interest Profiler.
**Revisión** (`revisar-pr`): requiere cambios menores. Aplicados: lista de cambios de O*NET en `docs/fuentes.md` (y fila de la base en el catálogo); el ADR apunta a esa lista.
**Fusionado** (14-nov): el [PR 207](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/207) entró a `main` (squash, con bypass de administrador, tras la revisión del líder).
**Siguiente**: N17, carga de los perfiles de O\*NET en `datos/` (líder).

## 2026-11-14 (uso declarado de O*NET en el ADR 0034)

**Hecho** (rama `docs/adr-0034-uso-declarado-onet`, sobre `main`): el ADR 0034 declara que la base de datos de O*NET se usa tal cual, sin modificarla, y que el cruce con carreras chilenas es elaboración propia. Se aclara que no se usa ninguna herramienta de O*NET, así que la validación de la Developer License no se activa en la opción C.
**Pendiente**: confirmar en el texto completo de la licencia de la base (CC BY 4.0) que no hay cláusula de validación para uso de datos, y que el líder confirme que el explorador no reutiliza materiales de las herramientas de O*NET (por ejemplo, los ítems del Interest Profiler). El comentario del PR 174 ya se corrigió.

## 2026-11-14 (aviso a Alejandro en su guía: portada y N19)

**Hecho** (rama `docs/aviso-alejandro-portada`): `docs/equipo/guia-alejandro.md` ahora dice que la portada (N12) tiene un enlace secundario a `/ocupaciones` (PR 188) y agrega N19: revisión de la pantalla del explorador, que no estaba en su hoja de ruta. Incluye sus textos, el lector de pantalla real, teclado y 200 %, el pie y las reglas de la pantalla.
**Pendiente**: que Alejandro lo lea y confirme. Sin lector de pantalla real todavía.
**Siguiente**: revisión del PR.

## 2026-11-14 (enlace al explorador de ocupaciones desde la portada)

**Hecho** (rama `feat/enlace-explorador-portada`): la portada tiene un enlace secundario, «Ver ocupaciones afines a tus intereses», a `/ocupaciones`. Es secundario (borde, no coral) para no competir con «Explorar carreras». Revisado en 375 px. tsc, eslint y tokens pasan.
**Pendiente**: la portada es de Alejandro (N12); avisarle del cambio. Revisión del texto del enlace.
**Siguiente**: revisión del PR.

## 2026-11-14 (revisión de Administración y Comercio y Salud en el cruce, N18)

**Hecho** (rama `datos/revision-admin-salud`): revisé por título las 195 ocupaciones de Administración y Comercio y las 109 de Salud. Corregí 13 casos: gerentes de educación a Educación; directores de servicios sociales a Ciencias Sociales; directores de servicios médicos y de salud, y coordinadores de salud, a Salud; gerentes de construcción y de arquitectura e ingeniería a Tecnología; directores de ciencias naturales a Ciencias Básicas; directores de emergencias a Sin área definida; tecnólogos y asistentes de veterinaria a Agropecuaria. Administración y Comercio queda en 185 y Salud en 109.
**Pendiente**: el criterio sigue por grupo SOC, con excepciones por código; la revisión es por título y no por cada carrera.
**Siguiente**: revisión del PR.

## 2026-11-14 (conteo corregido en /ocupaciones: carreras distintas, no filas de oferta)

**Hecho** (rama `fix/conteo-carreras-distintas`): la página decía «programas» y contaba filas de oferta (sede, jornada e institución), lo que inflaba la cifra (Salud: 1.335 filas frente a 104 nombres de carrera distintos). Ahora cuenta nombres oficiales distintos por área, sin tildes ni mayúsculas. Cambió el script de cruce, el exportador, el tipo y la prueba. Texto: «carreras distintas… (elaboración propia: nombres oficiales distintos, sin contar cada sede)».
**Pendiente**: lector de pantalla real (no se probó); el recorrido con teclado y axe ya pasaron.
**Siguiente**: revisión del PR.

## 2026-11-14 (N19: página del explorador de ocupaciones, /ocupaciones)

**Hecho** (rama `feat/explorador-ocupaciones`): página `/ocupaciones` que deja elegir hasta tres áreas de interés (formulario GET, sin JavaScript) y muestra las ocupaciones más cercanas, con su área de carreras y el número de programas. El orden está en `lib/calculos/ocupaciones.ts` con 5 pruebas. Los datos salen de `datos/exportar_ocupaciones.py` a `lib/datos/ocupaciones-generadas.json` (923 ocupaciones, 226 KB, versionado con fuente y fecha). Pruebas: tsc, eslint, tokens y las pruebas de cálculo pasan. Revisado a 375 px y en modo oscuro en el navegador.
**Pendiente**: la guía de Alejandro no tiene N19 (se agregó al plan); revisar la pantalla con las skills de mapa de trayecto y de lenguaje claro; falta la prueba de accesibilidad con axe y teclado; no hay enlace a la página desde la portada (N12). Las descripciones de áreas son elaboración propia y se rotulan así.
**Siguiente**: revisión del PR y, después, la revisión de Administración y Comercio y Salud del cruce.

## 2026-11-14 (revisión de los grupos amplios del cruce, N18)

**Hecho** (rama `datos/revision-grupos-amplios`): revisé por título en español los grupos SOC que concentraban casos, sobre todo Tecnología (376). Corregí: agrónomos, forestales, científicos de suelos y panaderos a Agropecuaria; científicos médicos a Salud; arquitectos, técnicos de audio y actores a Arte; deporte, lavandería y servicios a Sin área definida. Tecnología queda con ingeniería, construcción, mantenimiento y transporte. Después de la revisión: Tecnología 324, Sin área 98, Salud 109, Administración y Comercio 195.
**Pendiente**: revisar a mano los casos de Administración y Comercio y de Salud, que también son grupos amplios; el cruce sigue siendo elaboración propia por grupo, no por caso.
**Siguiente**: fusionar este PR y después N19.

## 2026-11-14 (N18: cruce de ocupaciones con áreas SIES y carreras, elaboración propia)

**Hecho** (rama `datos/cruce-ocupaciones-areas`): `datos/cruce_ocupaciones_areas.py` asigna cada carrera genérica (256) a una de las 11 áreas del buscador del SIES y cada ocupación de O*NET (923) a un área por grupo SOC, con excepciones. Genera `carreras_areas.csv`, `ocupacion_area.csv` y su meta. Ambos CSV quedan fuera del repositorio (`datos/procesados/`).
**Por qué así**: el catálogo no trae área de conocimiento y el buscador no publica la tabla. La asignación es por nombre y por grupo ocupacional: es elaboración propia.
**Pendiente**: revisión manual de los casos asignados por grupo SOC (grupos amplios, como Tecnología con 376 ocupaciones); confirmar con el líder si el criterio sirve para la pantalla. N18 estaba asignado a Cristóbal; lo hicimos nosotros. Si él revisa, que lo confirme en su guía.
**Siguiente**: revisión humana y, después, N19 (pantalla de Alejandro).

## 2026-11-14 (explorador de ocupaciones entra al núcleo, antes del 27 de noviembre)

**Hecho** (rama `docs/explorador-al-nucleo`): el líder decidió que el explorador (opción C del ADR 0034) entra al núcleo antes del congelamiento del 27 de noviembre. Plan: N17 carga de O*NET en `datos/` (líder, 18 nov), N18 cruce con las 11 áreas del SIES (Cristóbal, 25 nov), N19 pantalla (Alejandro, 27 nov). `docs/plan.md` y ADR 0034 actualizados.
**Pendiente**: que cada persona confirme su tarea en su guía; la pantalla debe cumplir las skills de mapa de trayecto y de lenguaje claro.
**Siguiente**: fusionar este PR y empezar N17.

## 2026-11-14 (plan: estudio de validación y explorador registrados; PR 178)

**Hecho** (`docs/plan.md`, PR 178 fusionado con admin por autorización del líder, commit `2fd564a`): el plan registra que ningún test vocacional se publica sin licencia confirmada por escrito y el estudio de validación que la licencia exija. El estudio, con egresados chilenos, queda para 2027. El explorador de ocupaciones (opción C) no entra en el núcleo; su orden de publicación lo decide el líder.
**Pendiente**: el líder decide si el explorador entra antes del 19 de diciembre o después; confirmar con Cristóbal quién carga los perfiles de O*NET en `datos/`.
**Siguiente**: según esas decisiones.

## 2026-11-14 (ADR 0034: se elige la opción C, sin test por ahora)

**Hecho** (rama `docs/adr-0034-opcion-c`, sobre `main`): el líder eligió la opción C. El explorador usa solo los perfiles ocupacionales de O*NET (CC BY 4.0) y la elección de áreas por la persona. No se publica test hasta tener licencia confirmada y, si la licencia lo pide, el estudio de validación.
**Verificado**: la Developer License de O*NET no pide permiso, pero exige estudio de validación y aviso si el material se usa para orientación o se traduce. AFPD, TIPOV, test del CNED y los comerciales no tienen licencia libre verificada.
**Pendiente**: aprobar el orden de publicación; estudio de validación en `docs/plan.md`; CINE-F y la norma de la BCN sin verificar.
**Siguiente**: revisión y fusión del PR de esta rama.

## 2026-11-13 (ADR 0034 actualizado: test estandarizado y validación propia del cruce)

**Hecho** (rama `docs/adr-0034-opcion-3`, sobre `main`): el líder descartó el instrumento propio y pidió un test estandarizado, validado en español, publicado oficialmente y de uso libre y comercial. Ninguno de los candidatos lo cumple hoy. El ADR 0034 ahora dice: test libre para intereses generales (pendiente de licencia), y validación propia del cruce con egresados, sin decir «tu carrera más afín es…» hasta tenerla.
**Verificado**: TIPOV (Carrasco, Zúñiga y Asún, *Psykhe* 2021): 13 áreas, validado en 568 estudiantes de colegios públicos científico-humanistas de RM y O'Higgins; el artículo no dice nada de licencia. Interest Profiler en español: licencia no aclarada.
**Pendiente**: el líder aprueba la solicitud de licencia a los autores del TIPOV; decide si se pide permiso a O*NET; el estudio de validación con egresados no está en `docs/plan.md`.
**Siguiente**: redactar el correo a los autores del TIPOV si el líder lo aprueba.

## 2026-11-13 (propuesta de test vocacional: ADR 0034)

**Hecho** (rama `docs/adr-0034-test-vocacional`, commit `f37090b`, sobre `main`): se redactó `docs/decisiones/0034-test-vocacional.md` en estado propuesta. Compara tres opciones: instrumento propio, Interest Profiler de O*NET y un paso sin test que usa solo los perfiles ocupacionales de O*NET.
**Verificado**: licencias de O*NET leídas en onetcenter.org. La base es CC BY 4.0 según su página de licencia (license_db.html); la página no habla de uso comercial de forma explícita. Las herramientas, incluido el Interest Profiler, tienen licencia CC BY-ND o Developer License, sin mención explícita de uso comercial ni de incrustación en sitios de terceros. El Interest Profiler largo está retirado.
**Leído después**: `license_toolsdev.html` e `IP.html`. La Developer License exige un estudio de validación si se traduce o se usa para orientación vocacional, y un aviso en cada producto. El Interest Profiler corto es gratuito en PDF, sin versión web. CINE-F no se confirmó en el SIES; el buscador usa 11 áreas propias. La norma de la BCN y la metodología del SIES no cargaron.
**Pendiente**: respuesta escrita del National Center for O*NET Development antes de usar el Interest Profiler; confirmar CINE-F con la fuente de UNESCO o del SIES.
**Siguiente**: que el líder revise la propuesta y decida si se pide permiso a O*NET y se inicia el instrumento propio.

## 2026-11-13 (mejoras tomadas de documentos de trabajo: medición, difusión e informes)

**Hecho** (rama `docs/mejoras-medicion-difusion-informes`, sin commit): se revisaron tres documentos de trabajo que el líder tenía fuera del repositorio y se trajo solo lo que mejora el proyecto con el modelo vigente (ADR 0032). (1) `docs/pruebas-usuarios.md`: pregunta de entrada, dos preguntas de cierre con tres marcas (alternativa compatible, fuente de un dato, próximo paso), registro de búsquedas sin resultado y de cómo llegó cada persona, y la regla «primero correcto, después rápido»: el tiempo se compara además solo entre quienes dieron los cuatro datos correctos. (2) `docs/equipo/guia-rafael.md`: en N14, las oficinas municipales de juventud de San Fernando y Santa Cruz como vía para completar el cupo de la medición; en N6, sin puntaje único. (3) Documento nuevo `docs/difusion-e-informes.md`: cómo darse a conocer sin avisos, cómo debe ser el primer informe de muestra y qué hacer si alguien pide uno. (4) Entregable, punto 9.1: dos adjudicaciones públicas como antecedente de que hay organismos que encargan estudios de oferta educativa. (5) Skill `datos-oficiales`: cada cifra conserva su nivel de origen.
**Por qué**: el líder pidió tomar de esos documentos lo que sirviera y descartar todo lo ligado a postular a un fondo.
**Verificado**: las dos adjudicaciones se leyeron en el registro de datos abiertos de ChileCompra. La de Huasco coincide entera. La de Aysén coincide en comprador, proveedor, monto y fecha, pero el documento de trabajo describía mal su tema: es un diagnóstico de formación técnica, no un estudio de preferencias de egresados. Quedó corregido en `docs/verificacion-de-cifras.md`.
**Fuera a propósito**: vender una misma «edición de datos» a varias organizaciones como oferta principal (cambiaría el modelo del ADR 0032), las campañas pagadas y un ejercicio adicional de «cambiar una condición» en la medición, que alargaba la sesión.
**Pendiente**: que el líder confirme si quiere la vía municipal para N14 (las llamadas serían del 16 al 18 de noviembre); los teléfonos y las unidades municipales no se copiaron al repositorio, se confirman en el sitio de cada municipio.
**Siguiente**: commit y PR de esta rama; fase 3 (N6 y N7 del líder, viernes 20).

## 2026-11-13 (fase 2: documentos alineados con el giro)

**Hecho** (rama `docs/alinear-documentos-giro`, reubicada sobre `main` tras fusionarse el PR 171): `AGENTS.md` (sección 1, 2.1, 2.2 y 2.6), `README.md` y `docs/plan.md` reescritos, este último con el calendario y las tareas N1 a N16 con responsable y fecha. Guías de Rafael, Alejandro y Cristóbal, reparto y protocolo de revisión rehechos sobre esas tareas; `docs/pruebas-usuarios.md` pasó a ser el protocolo de la medición con cronómetro. La encuesta quedó para personas egresadas (`encuesta-egresados.md`, `ficha-metodologica.md`, script y correo de permiso): los 55 ítems son idénticos a los anteriores, comprobado con el hash del arreglo del script. `docs/arquitectura.md`, `docs/privacidad.md` y `docs/fuentes.md` al día. Cinco documentos de mercado y propuestas pasaron a `docs/archivo/`; catorce que siguen sirviendo llevan nota fechada. ADR 0031 y 0022 marcados como reemplazados; notas en 0002, 0012, 0015, 0019, 0020 y 0026; 0032 y 0033 marcados como aceptados. Cuatro skills actualizadas. Sin enlaces rotos en ningún `.md` (barrido con script).
**Por qué**: el líder pidió alinear `AGENTS.md` y los demás documentos con el ADR 0032 para que el equipo y sus IA trabajen desde el lunes 16 con la idea vigente.
**Hallazgos**: (1) la tabla `persona` exige `nombre` y `fecha_nacimiento`, lo contrario del ADR 0033; hay que migrarla antes de construir la cuenta. (2) No hay decisión sobre las tablas `seguimiento` y `registro_acceso`. (3) No existe código que guarde la meta en el dispositivo: es parte de N10. (4) Google Forms registra el «No» de quien declara menos de 18 años; el entregable ya no dice «sin guardar nada». (5) El enlace al ADR en la skill `revisar-pr` estaba roto desde antes (faltaba un nivel de carpeta).
**Aprendido de los agentes**: cuatro subagentes Sonnet en paralelo sobre el mismo árbol, cada uno con una lista cerrada de archivos y otra de prohibidos; no hubo choques. Tardaron entre 2 y 9 minutos. Funcionó darles primero los documentos rectores ya escritos (`AGENTS.md`, ADR, `plan.md`) y pedirles que reportaran lo que no podían verificar en el código: de ahí salieron los hallazgos 1 a 3.
**Pendiente**: que el líder confirme las fechas de N1 a N16 y el reparto; decidir el destino de `seguimiento` y `registro_acceso`; el año de egreso de la encuesta se pregunta de 2021 a 2025 (decisión del agente, por confirmar); `plan-cupos-y-demanda-por-institucion.md`, `cierre-de-pendientes.md` y `revision-final.md` se conservaron con nota y podrían archivarse; los textos del sitio publicado (portada) siguen hablando a estudiantes de liceo hasta que se haga N12.
**Siguiente**: revisión y fusión del PR de esta rama; después, fase 3 (N6 y N7 son del líder y vencen el viernes 20).

## 2026-11-13 (giro: agencia independiente, SpA y público egresado)

**Hecho**: el líder cambió la idea. Agencia independiente (SpA, ya no fundación) para toda persona que egresa de 4.º medio y no entra a la educación superior. No se buscan colegios ni instituciones: la agencia publica datos, gana credibilidad y vende informes (BI) y asesorías a quien llegue (referente: Libertad y Desarrollo). El plan está en [`docs/plan-giro-agencia-independiente.md`](docs/plan-giro-agencia-independiente.md), rama `docs/giro-agencia-independiente`, sin commit.
**Decisiones del líder**: «publicidad» es darse a conocer, sin avisos en el sitio; el versus de empleabilidad es carrera frente a su área, ambas del SIES; el Avance 2 del martes 17 va con la idea nueva; para el 19-dic se construye el núcleo acotado (ficha con versus, meta con 3 preferencias, calendario, Quiénes somos, preguntas frecuentes, portada). Lo demás queda diseñado.
**Por qué**: volver al problema de origen (desinformación al egresar y sus consecuencias) y no depender de vender a colegios.
**Segunda ronda (13-nov)**: territorio nacional; el nombre se mantiene; cuenta solo con correo y lugar de estudio, sin edad; nada escolar; todo dato medible y sin prensa; el entregable se escribe desde el problema. Quedaron escritos el ADR 0032 (agencia, público y SpA) y el ADR 0033 (cuenta sin edad, con los artículos 3, 12, 14 ter y 16 quáter de la Ley 21.719 leídos en la BCN), y el `Entregable_Parte_I.md` se reescribió completo. Se eliminaron con `git rm` la carta a colegios, el consentimiento de apoderados y las propuestas para liceos, del panel escolar y del estándar de transición. Todo sin commit.
**Hallazgos que cambian el relato**: (1) hay edición 2026 del informe de acceso del SIES: 49,6 % no ingresa al año siguiente (137.237 de 276.509, egreso 2025) y 26,9 % no ingresó en cinco años (egreso 2021); reemplaza al 55,4 % de Evidencias 55. (2) Casen 2024 no tiene categoría de «información» entre las razones de no asistir (personales 60,7 %, económicas 34,1 %): no se puede decir que la gente no entra por desinformación; se trata como causa posible que se mide. (3) No estudiar ni trabajar y salud mental es asociación, no causa (Gariépy y otros, 2022). (4) El SIES no publica promedio de empleabilidad por área: el versus será elaboración propia. Detalle en `docs/verificacion-de-cifras.md`.
**Aprendido de los agentes**: tres subagentes Sonnet con web en paralelo (cifras, ley de datos y fuentes, SpA). Volvieron en 5, 9 y 20 minutos con PDF leídos con pypdf y marcas «leído» o «solo buscador». La API SDMX de la OCDE sirve cuando el sitio da 403; los textos de leychile.cl se leen bajando el XML (`obtxml?opt=7&idNorma=…`), y la BCN corta si se piden muchos seguidos.
**Pendiente**: las del punto 7 del plan. El bloque «Estado vigente» de abajo queda superado en producto, organización y cliente; se reescribe cuando se acepte el ADR 0032.
**Siguiente**: revisión del entregable por el líder antes del martes 17; después, fase 2 (alinear `AGENTS.md`, plan, guías y demás documentos) y fase 3 (núcleo).

## Estado vigente (13-nov-2026)

Las entradas de abajo son historia: no se reescriben. Lo que vale hoy:

- **Producto**: agencia independiente que reúne, explica y deja comparable la información oficial de la educación superior, gratis y sin cuenta, para toda persona que egresa de 4.º medio y no ha ingresado. Alcance nacional. Decisión: [ADR 0032](docs/decisiones/0032-agencia-independiente-y-publico-egresado.md).
- **Organización y negocio**: sociedad por acciones (SpA) en 2027; hasta el 19-dic-2026, proyecto de título sin entidad. No se sale a buscar clientes: se publica, y quien quiera encarga informes o asesorías. Sin avisos. Nadie ha encargado nada: es hipótesis.
- **Fecha de entrega**: Entregable II el **19 de diciembre de 2026**. Congelamiento de funciones el viernes 27 de noviembre. Medición con 10 personas del 30-nov al 4-dic.
- **Núcleo del 19-dic** (tareas N1 a N16 en [`docs/plan.md`](docs/plan.md)): comparaciones en la vista de carrera, meta con tres preferencias y alternativas, calendario, Quiénes somos, preguntas frecuentes, portada, medición con cronómetro.
- **Diseñado, sin construir**: cuenta con correo y sin edad ([ADR 0033](docs/decisiones/0033-cuenta-con-correo-sin-edad.md)), cuestionario de intereses, simulación de beneficios, asistente, noticias, tablero de transparencia, informes.
- **Ya no existe**: fundación, panel para colegios, cliente colegio, autorización de tutor, encuesta a escolares, piloto en liceos de Colchagua. Las tablas de eso siguen en la base, sin uso.
- **Dos límites de relato**: no decir que la gente no ingresa *por* desinformación, ni que quedar fuera *causa* problemas de salud mental. Cifras vigentes en [`docs/verificacion-de-cifras.md`](docs/verificacion-de-cifras.md), sección del 13-nov.
- **PR**: [171](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/171) (giro: entregable y ADR 0032 y 0033), fusionado el 13-nov. La fase 2 va en la rama `docs/alinear-documentos-giro`. También se fusionó el 156 (Andén urbano, parte 2). Siguen abiertos los 157 a 168 (Andén urbano, Cristóbal), el 139 y el 96.
- **Pendientes del líder**: segunda lectura de las cifras del 13-nov; abogado y contador para estatutos, pacto y régimen tributario; acuerdo de los tres sobre el reparto de la SpA; permiso de los autores de la escala EAEC; conseguir a las 10 personas de la medición; decidir qué pasa con `docs/panel-seguimiento-escolar-borrador.md` (sin commit).
- **Leer**: `AGENTS.md` (sección 1), el ADR 0032 y [`docs/plan.md`](docs/plan.md). Todo lo fechado antes del 13-nov describe ideas anteriores.

## 2026-11-11 (¿repositorio público? Revisión y ADR 0028)

**Hecho**: GitHub mostraba los presupuestos de AE&SE en $0 con "uso bloqueado" y se evaluó hacer público el repo para tener Actions gratis. Se revisaron 399 commits y todas las ramas: sin claves ni `.env`, los RUT y correos son de prueba, sin datos de estudiantes. Se redacta `docs/decisiones/0028-repositorio-publico.md` como propuesta (rama `docs/adr-repositorio-publico`, sin commit). La `LICENSE` ya era propietaria; el ADR propone una frase de "solo lectura".
**Por qué**: publicar tal cual contradice el ADR 0017 (el nombre de la sede piloto no sale del repo sin autorización escrita) y publica material marcado "Uso interno. No publicar" (`docs/mercado/resumen-interno-oferta.md`, `docs/manual-tablero-pronostico.md`, el tablero) más estimaciones de precio en esta bitácora y en `docs/mercado/`. Todo está también en el historial, así que ocultarlo en un commit nuevo no basta.
**Decisión (14-nov)**: el líder indica mantener el repositorio público por la limitante de los commits; el ADR 0028 queda como propuesta hasta cumplir sus condiciones. El material marcado "no publicar" sigue visible: queda como deuda del ADR 0028 (retirarlo de los archivos, autorización de la sede piloto, correos de la UADY, licencia).
**Siguiente**: revisar el ADR; si se publica, avisar a Alejandro y Cristóbal por sus forks.
**Pendiente (numeración)**: los ADR 0026 y 0027 ya existen en otras ramas y hay dos 0025 (celdas suprimidas y tablero interno). Al fusionar esas ramas, renumerar para evitar choques; este PR usa 0028.
## 2026-11-11 (CI: los checks obligatorios deben reportarse siempre)

**Hecho**: `.github/workflows/verificar.yml` ya no usa `paths-ignore`. Un job nuevo, `cambios`, detecta si el cambio toca algo fuera de `docs/` y de los `.md`; los otros seis jobs se saltan con `if` cuando solo hay documentación.
**Por qué**: el filtro del #130 dejaba el workflow sin arrancar en PR de solo documentación; como `main` exige esos checks, quedaban "esperados" para siempre y el PR #139 no se podía fusionar, ni siquiera como administrador. Un job saltado por `if` cuenta como aprobado; un workflow que no arranca, no.
**Pendiente**: confirmar en el primer PR de solo documentación posterior que los checks aparecen como saltados y no bloquean. El ahorro de minutos se mantiene (cada PR de solo docs gasta solo el job `cambios`).

## 2026-11-11 (idea final: sitio para estudiantes, panel para colegios y fundación)

**Hecho**: el líder fijó la idea final: sitio gratuito para estudiantes de 3.º y 4.º medio de liceos con financiamiento público (O'Higgins, Colchagua) más panel interactivo de seguimiento para colegios, operados por una fundación sin fines de lucro (confirmada). Se reescribió `docs/entregable/Entregable_Parte_I.md` completo (problema primero, objetivos sobre el problema, alineación con la misión y los valores de AIEP, fundación, presupuesto con fuentes; sin menciones al repositorio) y se alinearon `AGENTS.md` (sección 1), `README.md`, el plan, el equipo, las propuestas, el análisis de mercado y la evidencia. Nuevo ADR 0031 (producto y organización); los ADR 0010, 0012 y 0013 no se reescriben y quedan como historia y proyección.
**Por qué**: el docente tutor dijo que el planteamiento era amplio y poco específico («vacilamos mucho»).
**Decisiones del líder (11-nov, tarde)**: ADR 0022 aceptado en la parte A con la opción A1 (todo menor de 18 años necesita autorización de su madre, padre o tutor, sin excepciones); ADR 0023 (ancho de medida) aceptado; alcance del panel confirmado para el 18 de noviembre (ensayo oficial por enlace, estimación de puntaje frente a la meta de la carrera y resumen para el docente); las cartas a los colegios las redacta y envía el líder.
**Rediseño de documentos (11-nov, tarde)**: guías de Rafael, Alejandro y Cristóbal, reparto, pruebas de uso y protocolo de revisión rehechos sobre las Tablas 3.7, 3.8 y 3.10 del entregable; skills con la regla de fuentes oficiales, primarias o académicas; 6 ADR (0010, 0013, 0016, 0017, 0018 y 0027) movidos a `docs/decisiones/archivo/` y 9 reajustados con nota; propuesta del portal de transparencia; la ronda 12 del Termómetro y las cifras de prensa se retiraron. Decisión: el indicador de etapas mantiene las 4 estaciones (Llegar y Avanzar quedan como futuras).
**Pendiente**: del líder: fuente y año del perfil de egreso de AIEP, permiso del docente para dejar encuesta y entrevistas solo como método, si se mantiene la escala EAEC (no validada en Chile). Del entregable: dólar observado real (se usó $950), tercera referencia de sueldo, cotizar revisión profesional, asesoría legal y constitución de la fundación, URL del plan estratégico de AIEP, de El Desconcierto y del Decreto 193, y verificar la ficha de PACE y Nickow et al. (2024). Del plan de cinco conversaciones: invertir el orden (colegios y sostenedores primero). No se generó el PDF.
**Siguiente**: revisión del líder, PR de esta rama (la identidad visual Andén urbano ya se alineó en otro PR).

## 2026-11-11 (Andén urbano fusionado y documentos alineados)

**Hecho**: el PR #151 de Cristóbal (parte 1 de 14: tokens y ADR 0029) quedó fusionado en `9012ddf`. Revisión: el bloque de `prefers-reduced-motion` solo anulaba 2 de las 6 duraciones (ahora `tokens.py` lo genera desde `tokens.json`), el ADR decía 60 ms y los tokens 90 ms, y el ADR tenía 266 líneas contando pantallas que el PR no traía (quedó en 73). `docs/diseno.md`, la skill `mapa-de-trayecto` y `AGENTS.md` se alinearon con la identidad nueva; las cifras de contraste sobre blanco se recalcularon con `tokens.py`, no se copiaron.
**Por qué**: el líder pidió actualizarlos justo después de fusionar, y no antes, para no describir una identidad que `main` aún no tenía.
**Pendiente**: Cris abre la parte 2 (estilos comunes) sobre `main` actualizado, una parte a la vez; cada token sin uso (`--ancho-logo`, `--alto-arte`, `--texto-5`, espacios 20 y 24) debe usarse en las partes siguientes o salir. Falta renombrar el título de la comprobación coral del ADR 0029 en la parte de portada.
**Siguiente**: revisar la parte 2 cuando se abra. Fusionar el PR de estos documentos.

## 2026-11-11 (calendario del FUAS, portada y PR abiertos)

**Hecho**: el calendario del FUAS se contrastó con https://postulacion.beneficiosestudiantiles.cl/fuas/ el 2026-11-11. `plazos_2027.json` ahora tiene la extensión (22 oct al 6 nov), nivel socioeconómico (17 dic 2026), preselección (15 ene 2027), asignación (10 mar 2027) y apelación (10 al 25 mar 2027); el segundo período sigue pendiente. `BeneficiosCalendario.tsx` muestra un hito de un solo día sin «X al X». La portada avisa que el primer período ya cerró (la fecha viene de los datos; si no hay término publicado no lo afirma) y pasó a `force-dynamic` porque depende de la fecha de hoy en Chile. Las ramas fusionadas se limpiaron (69 locales y 4 carpetas de trabajo).
**PR abiertos, todos con Auto-fix**: [#142](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/142) calendario del FUAS · [#143](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/143) este de documentos · [#144](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/144) filas partidas de la oferta DEMRE y `pdfplumber` en `scripts/requirements.txt` · [#145](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/145) revisión legal del 9 de noviembre · [#146](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/146) aviso de cierre en la portada · [#147](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/147) aceptación de ADR del 9 de noviembre · [#141](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/141) entrada a los plazos del FUAS en la portada. **Dependencias**: el 146 depende del 142, el 141 del 146 y el 147 del 145; fusionar en ese orden. Los PR 133 a 138 se cerraron y se reabrieron con estos números: `rafajaque/Agencia-de-Enlaces-y-Seguimiento-Estudiantil` pasó a privado y GitHub lo desvinculó de AE-SE, así que los PR salen ahora de `rafajaque/Agencia-fork`. La rama `feat/tablero-pronostico` (única copia de la página de transparencia retirada) quedó respaldada en ambos repositorios.
**Pendiente**: la guía del FUAS por situación (quien ya postuló y quien no) sigue sin existir: la entrada de la portada lleva por ahora al calendario; el 144 pide contrastar las 9 filas con la página 157 del PDF, confirmar la licencia MIT de `pdfplumber` y saber por qué se omiten 7 pruebas; verificar en los originales el ensayo de CEP/LSE, Formando Chile 2026, PISA, Ley 21.801 y Acceso Mineduc; decidir si el repositorio queda público (ADR 0028 propuesto en el PR 139). Las ramas locales antiguas ya se limpiaron; queda la carpeta `Agencia-adr23`, del PR 93.
**Siguiente**: decidir si se reemplaza la frase «el Estado no muestra cuánto me falta» del documento general y si el requisito de PC dentro del liceo merece un ADR.

## 2026-11-11 (versión para liceos de la propuesta)

**Hecho**: `docs/propuesta-para-liceos.md`, a partir del texto que un experto externo revisó (`Downloads/propuesta-general-agencia-revisada.md`). Se le aplicaron los ajustes acordados: cifras y Ley 21.801 marcadas «por verificar», PC y teclado dentro del liceo pero 360 px en el portal abierto, jornada de ayuda con el FUAS repuesta en el piloto, rol del liceo en los accesos acotado, piloto en dos etapas, y nota de que no hay entidad jurídica para cobrar. Al final lleva «Notas internas» que se retiran antes de enviarlo. Va en el PR 143. No reemplaza a `propuesta-general-agencia.md`, que sigue siendo la base interna.
**Por qué**: el experto mejoró el texto como propuesta para liceos, pero dejó fuera la jornada FUAS, el vehículo legal y el rol de datos del liceo.

## 2026-11-11 (propuesta general de la agencia)

**Hecho**: `docs/propuesta-general-agencia.md`, el documento único con el problema, lo que se hará, cómo se hará, la innovación, el posicionamiento, el financiamiento y la venta, el marco legal, el cronograma, la medición, los riesgos, las decisiones y lo que no se sabe. Consolida las dos propuestas anteriores (`propuesta-ruta-de-ingreso-asistido.md` y `propuesta-estandar-de-transicion.md`), que quedan como anexos. Va en el PR 143.
**Por qué**: el líder pidió un solo MD que reuniera todo. La sección de venta se rehízo con lo aprendido después: la publicidad se descartó, el modelo base pasa a ser filantropía y empresas (el de Por Una Carrera: 76 % del ingreso en dos fuentes), el cobro a colegios es solo hipótesis, y los fondos exigen 1 a 2 años de personalidad jurídica, así que constituir la entidad corre contra el tiempo.
**Pendiente**: las decisiones del líder de la sección 13.2 (vehículo legal, frase pública, financiamiento institucional, autoevaluación del colegio, cambios al entregable); verificar lo de la sección 14 (Resolución 2076, PME, tres estudios, datos por colegio, estado de la ley y de la reforma de admisión).
**Siguiente**: cinco conversaciones con fundaciones, un sostenedor y una dirección de vinculación; empezar por la Fundación Luksic; y resolver el vehículo legal.

## 2026-11-11 (estándar de transición para colegios)

**Hecho**: `docs/propuesta-estandar-de-transicion.md`: seis componentes (T1 a T6) adaptados de los Gatsby Benchmarks del Reino Unido y alineados con el estándar chileno 7.3, más panel agregado, autoevaluación y seguimiento. Verificado en el original: guía estatutaria británica, informe CEC 2021 (asociación de 0,7 puntos, no causal), decretos y leyes chilenas, y estudios de H&R Block, Hastings, Carrell y Sacerdote, Bottom Line y Dinkelman y Martínez. Va en el PR 143.
**Por qué**: el líder quiso aterrizar el panel y el seguimiento con evidencia de grupos similares. Hallazgos que cambian lo dicho: los estándares británicos no son obligatorios y su efecto es una asociación pequeña; ningún estudio aísla el efecto de un panel; la ayuda con el trámite sí tiene respaldo; no hay ley que obligue a tener orientador en Chile; el EID 7.3 solo habla de visitas a *sitios web*. El +8 puntos de permanencia de H&R Block (ADR 0012) sí está respaldado por J-PAL.
**Aprendido de los agentes**: Codex y Antigravity coincidieron en cortar T3 y T6 y en que "medimos y publicamos resultados" sobrepromete. Pegar el contenido en el mensaje, sin pedirle leer archivos ni ejecutar comandos, resolvió el problema de Antigravity. Los subagentes con web abren pocos PDF completos: marcar siempre lo leído frente a lo de buscador.
**Pendiente**: decisión del líder sobre la frase pública; texto oficial de la Resolución 2076 y del PME; Castleman y Page, Owen y Westlund, Mulhern en el original; solicitud de transparencia por datos por colegio; revisión legal del protocolo T4.
**Siguiente**: definir el primer piloto con T1, T2 y T4 y los descriptores de los niveles.

## 2026-11-11 (propuesta integral "Ruta de Ingreso Asistido")

**Hecho**: `docs/propuesta-ruta-de-ingreso-asistido.md`, con 21 secciones: problema, objetivos, MVP del 2 de diciembre (cuatro tareas centrales, sin cuenta ni datos personales), capa 2 como intención con go/no-go, venta, posicionamiento, ley, decisiones D1 a D15, cronograma y revisión. Va en el PR 143. Este documento supera al ADR 0027 de la entrada siguiente (propuesta sin fusionar, a eliminar o enmendar). No se tocó el entregable ni ningún ADR.
**Por qué**: el líder pidió que la propuesta partiera del problema (desinformación de jóvenes de colegios vulnerables) y que el MVP fueran tareas medibles; las propuestas anteriores vendían solo información y no había comprador demostrado.
**Aprendido de los agentes**: Codex revisó el documento y encontró errores reales. Los dos más útiles: el simulador no calcula el Ranking (ADR 0024) y el PR 62 de la carga DEMRE figura cerrado sin fusionar. Antigravity falló dos veces al revisar el documento leyendo muchos archivos: la primera, bloqueado por permiso de comandos; la segunda, 500 s sin respuesta. Para él conviene un encargo corto con el texto pegado, no pedirle que recorra el repo. Una de las críticas de Codex (vigencia legal "imposible") fue solo una redacción mía ambigua.
**Pendiente**: decisiones del líder (vehículo legal, capa 2, cambios al entregable, contenido PAES fuera, umbral del piloto). Verificar la carga DEMRE en producción, los puntajes de corte, la ley en fuente oficial y las cifras de H&R Block. Alguien con acceso debe filtrar el buscador oficial de Mercado Público.
**Siguiente**: revisar el PR 132 (simulador), que toca la capa de datos de la oferta y desbloquea el resto.

## 2026-11-11 (enfoque de transición y uso de agentes)

**Hecho**: `docs/decisiones/archivo/0027-enfoque-de-transicion-y-plan-colegio.md`, estado propuesta, sin tocar AGENTS.md ni el ADR 0010. Propone acompañar de 3° medio a la renovación de beneficios del primer año, y vender un Plan Colegio donde el estudiante no paga y el colegio recibe solo agregados. Se descartó el pre universitario pagado por apoderados (rompe "gratis siempre") y se descartó solo media (pierde la renovación, lo mejor respaldado).
**Por qué**: el repo ya tenía fuera lo psicosocial pesado; la confusión era de relato. La evidencia citada favorece postulación y renovación. Claude, Codex y Antigravity recomendaron lo mismo para el pagador.
**Aprendido de los agentes**:
- Antigravity: `--print-timeout` exige unidad (`300s`); con `300` falla al instante y sin respuesta. Tardó unos 110 s. Devuelve JSON con el texto en `response`. Fue el único en detectar el registro ATE para fondos SEP, pero afirma cosas legales sin fuente (autonomía progresiva, Ley 21.719): verificarlas siempre.
- Codex (`codex exec`): no editó nada y marcó él mismo qué era suposición. Lo más útil fue operativo: piloto manual midiendo horas del equipo y carta de intención.
- Mi encargo incluía mi inclinación (transición) y las restricciones, así que la coincidencia entre los tres es débil como confirmación. Para una segunda opinión de verdad, no adelantar la conclusión.
- Método que funcionó: prompt en un archivo del scratchpad, agente lanzado desde la raíz del repo con rutas relativas (así no viajan rutas con el nombre de usuario), los dos en paralelo y en segundo plano. Una sola muestra: no sirve para decidir quién es mejor en general.
**Investigación posterior**: tres subagentes propios (productos, licitaciones, fuentes) y uno más que leyó la Ley 21.719. Para investigación web conviene usar subagentes propios: Antigravity sin interfaz no puede navegar y Codex no tiene opción de búsqueda. Resultado: licitaciones con alcance bajo (el buscador oficial no se pudo usar; solo preuniversitarios PAES municipales, uno de ellos de monto no revelado); posible hueco en la renovación de beneficios; evidencia a favor de ayudar con el trámite y en contra de los mensajes a escala; sin causas de deserción con fuente oficial. La matriz ley a producto quedó en el ADR 0027, con artículos de un consolidado NO oficial. Corregido en el ADR 0027: la cifra "+8 puntos de permanencia" del experimento FAFSA parece ser de matrícula; el ADR 0012 todavía la escribe así.
**Pendiente**: decisiones del líder (desde qué curso se crea la Ficha; contenido académico fuera). Cotejar la ley con la BCN y asesoría legal. Verificar mifuturo.cl, Acceso Mineduc y PACE, el registro ATE y el PDF de H&R Block. Fijar umbrales de las fases 0 y 1. Alguien con acceso debe filtrar el buscador oficial de Mercado Público por orientación y permanencia.
**Siguiente**: elegir con qué colegios se hacen las cinco entrevistas con el mockup en PDF del panel agregado.

## 2026-11-10 (encargo de pulido para Cristóbal y estación del proceso)

**Hecho**: `docs/equipo/guia-cristobal.md` tiene una sección nueva, "Encargo del líder (10 de noviembre)". Le pide llevar al máximo nivel de calidad los datos y los textos de las cinco páginas publicadas (portada, explorador, fichas, comparador y beneficios), con pasos, criterios de aceptación y un texto para su IA.
**Por qué**: el líder pidió "tunear la página al máximo". Se acotó a lo que le toca a Cristóbal (datos y contenido). Lo visual se deriva a Alejandro, según el reparto.
También se agregó la tarea C14 (etapas del proceso de admisión): Cristóbal carga el calendario oficial de la Admisión 2027 en `datos/calendario/admision_2027.json`, con la forma de `plazos_2027.json` y un campo `estacion` (explorar, postular, llegar o avanzar) en ambos archivos. Se usan las mismas cuatro estaciones de `IndicadorEstacion.tsx` para no tener dos clasificaciones. Las animaciones de estación decorativas se descartaron porque `docs/diseno.md`, sección 7, prohíbe el movimiento decorativo. A cambio, se mostrará la estación del proceso. En la guía de Alejandro se agregó la A15: en la portada, la estación actual del proceso y el próximo plazo, con una función pura y probada en `lib/calendario/`. El movimiento se limita al avance de la línea. Depende de la C14.
**Pendiente**: rama `docs/estacion-del-proceso`, con PR abierto. El encargo de pulido y la C14 no tienen fecha límite: la fija el líder.

## 2026-11-10 (fusiones y prueba de accesibilidad en la CI)

**Hecho**: fusionados con squash, en este orden, #114 (ADR 0024), #111 (segmento), #112 (instrumento único) y #113 (guía del líder). Los conflictos se resolvieron así: en la Tabla 1.1, los actores 3 y 5 del #111 y el 4 del #112; en la Tabla 2.4, la fila del #112; en la bitácora, todas las entradas. Rama `fix/ci-accesibilidad-sin-supabase`: `lib/datos/oferta-remota.ts` gana un modo local (`OFERTA_LOCAL=1`) que lee la muestra en vez de Supabase, y el flujo de la CI lo activa solo en la tarea de accesibilidad. Las 25 pruebas pasan en local (Edge, puerto 3217).
**Por qué**: desde el #103 las fichas, el explorador y el comparador consultan Supabase en vivo, y la CI no tiene `SUPABASE_URL` ni `SUPABASE_ANON_KEY`. Las páginas respondían con error y la prueba de accesibilidad fallaba en todos los PR. No se agregaron secretos: los PR que llegan desde las copias del repositorio (Alejandro y Cristóbal) no los reciben, y la prueba no debe depender de la red.
**Pendiente**: confirmar que el siguiente despliegue en Cloudflare compila bien con la importación dinámica de `carreras.ts` (usa `node:fs`; el Worker tiene `nodejs_compat`). En local no se pudo correr `cf:build`, porque su paso previo exige las claves de Supabase. En modo local, la búsqueda también compara institución y sede, y ordena alfabéticamente; la remota solo busca por nombre de carrera y ordena por código. No afecta la prueba.

## 2026-11-10 (guía del líder)

**Hecho** (rama `docs/guia-rafael`): `docs/equipo/guia-rafael.md`, con el mismo formato que las guías de Alejandro y Cristóbal. Incluye el estado al 10 de noviembre por área con sus PR, lo urgente, el rol, las decisiones que solo toma el líder, los riesgos abiertos, las tareas R1 a R20 por semana (lo adelantado marcado como tal), cómo se revisa un PR y los errores ya ocurridos. Se enlaza desde `docs/plan.md`, `docs/equipo/README.md` y el reparto.
**Por qué**: el líder pidió que su avance se vea igual que el del equipo. Los conteos salen de GitHub: 101 PR fusionados, 82 desde la cuenta del líder (con apoyo de IA, declarado), 9 de Alejandro y 10 de Cristóbal.
**Hallazgo y arreglo**: había dos ADR con el número 0018, y el PR 93 proponía un 0023 que ya existía (`0023-medida-comparativa.md`). El Puntaje Ranking pasa a 0024 (PR 114): se movió ese y no el de planificación porque solo lo citaban dos comentarios de código, y el otro unos 15 documentos. El ADR del PR 93 pasa a 0025, con un commit en su rama; la copia `Agencia-adr23`, que estaba limpia, queda un commit atrás y se pone al día con `git pull`. El borrador del correo a los autores de la EAEC está en `docs/encuestas/solicitud-permiso-eaec.md` (PR 112) y declara el posible uso comercial del proyecto para que el permiso sea válido.
**Pendiente**: confirmar en el sitio publicado que la ficha real funciona a 360 px y con teclado; verificar las variables de Gemini en Cloudflare. Esta entrada choca con las de los PR 111 y 112 al inicio de la bitácora: conservar las tres.
**Siguiente**: el líder revisa los PR 111, 112 y este en la ventana del martes.

## 2026-11-10 (entregable: un solo instrumento estandarizado)

**Hecho** (rama `docs/instrumento-unico`): la encuesta escolar pasa a ser un solo instrumento estandarizado, completo: la Escala de Autoeficacia para la Elección de Carrera (EAEC) de Ramírez Dorantes y Canto (2007). Son 55 ítems de 0 a 9, con α = 0,95 en 343 estudiantes de bachillerato de México, más tres preguntas de clasificación. Se retiró la encuesta de adultos y se quitaron los ítems de FUAS, gratuidad, becas y CAE. Se reescribieron `docs/encuestas/` (encuesta, ficha, README y `crear_encuestas.gs`) y se ajustaron la carta y el consentimiento. En el entregable cambiaron 2.3.1, 2.3.2, la Tabla 2.5, el árbol de problemas, el FODA, la Tabla 2.C.2, el Anexo 2.A y las referencias.
**Por qué**: la revisión del capítulo 2 pidió un solo instrumento estandarizado en español, no un conjunto de ítems de varias fuentes. El líder decidió aplicarlo solo a escolares y quitar FUAS, porque no existe una escala validada de conocimiento de beneficios. Se eligió la EAEC porque sus ítems están publicados textualmente (Anexo 1 del artículo, leído con pypdf el 2026-11-10) y su subescala de Información ocupacional corresponde a la causa 1 del árbol. Se descartaron la versión corta del CDMSE (sin ítems), la EPEV (CC BY-NC-SA, sin uso comercial) y la E-DTDC (ítems no publicados).
**Pendiente**: permiso de los autores (el artículo no declara licencia); confirmar con ellos qué ítems forman cada subescala (se dedujo de la Tabla 1); juicio de expertos sobre la adaptación de vocabulario; medir el tiempo real en el piloto (hoy se estima entre 10 y 15 minutos); recrear el formulario en Google Forms con el script nuevo.
**Ojo al fusionar**: esta rama y `docs/capitulo-1-segmento` (PR 111) tocan la misma fila de la Tabla 2.4 y el inicio de esta bitácora. En la Tabla 2.4 gana la versión de esta rama, que ya incluye el segmento.
**Siguiente**: `docs/equipo/guia-rafael.md`.

## 2026-11-10 (entregable: segmento por edad y sector social)

**Hecho** (rama `docs/capitulo-1-segmento`, sin PR): el capítulo 1 del entregable define el segmento objetivo. Es para personas de 16 a 24 años de establecimientos municipales, SLEP, particulares subvencionados y de administración delegada: 3.º y 4.º medio, egresados de hasta cinco años y primer año de educación superior. Los particulares pagados quedan fuera del objetivo, pero el portal sigue abierto a todos. Nueva Tabla 1.0 con el acceso por dependencia. Se ajustaron Tabla 1.1, 1.2, 1.4, 2.1, Tabla 2.1, Tabla 2.4, OG del 3.2, 5.1, 6.2 y 8.1. Se registraron las cifras en `docs/verificacion-de-cifras.md`.
**Por qué**: la revisión del profesor pidió acotar el objetivo, porque las justificaciones solo sostienen el caso de colegios vulnerables. El líder eligió acotar en vez de justificar colegios de altos recursos. Fuente: SIES, *Acceso a la Educación Superior en Chile 2022* (enero de 2023), Tablas 3 y 12. El acceso inmediato es de 37,8 % en municipales y 68,7 % en particulares pagados. Claude también abrió *Evidencias 55*: su Tabla 10 coincide y solo desagrega por sexo.
**Fracaso a evitar**: WebFetch devuelve los PDF como binario. Hay que leerlos con pypdf sobre el archivo que guarda la herramienta. La API de medios de mifuturo.cl quedó bloqueada por el modo automático.
**Pendiente**: el rango de 16 a 24 años es decisión del equipo, no un dato. Hay que buscar ediciones del informe SIES posteriores a 2022, elegir un índice de vulnerabilidad para escoger liceos (`[CONFIRMAR]`) y definir el territorio (O'Higgins sigue en `[CONFIRMAR]`).
**Siguiente**: capítulo 2 con un solo instrumento estandarizado en español (decidir la población y qué pasa con los ítems de conocimiento de FUAS). Después, `docs/equipo/guia-rafael.md`.

## 2026-11-09 (tarde y noche: PR fusionados, retiro de /transparencia y verificación DEMRE)

**Hecho (fusionado)**:
- #88 (reserva de CPU del ADR 0003): fusionado con squash. La reserva 2 queda abierta: mediana de CPU de 29,47 ms frente al límite de 10 ms del plan gratuito, 0 errores en 7 días, 55 eventos correctos en la última hora. Falta confirmar el límite vigente en la documentación de Cloudflare.
- #89 (retira `/transparencia`): fusionado a las 21:22 UTC. `/transparencia` responde 404 tras el despliegue. El PR 78 lo fusionó el líder a las 15:26 UTC (12:26 hora de Chile); no fue una sesión de Claude.
- #90 (renombra la migración de la nota de cierre a `20261109110000`): fusionado a las 21:38 UTC. Ya no hay dos migraciones con el prefijo `20261109100000`.
- #79 (resumen interno del pronóstico): fusionado.

**Hecho (cerrado y revisado)**:
- #75 (estado del plan al 9 de noviembre): cerrado. Su sección de estado en `docs/plan.md` quedó desactualizada frente a `main`.
- #83 (hoja de una página para la revisión profesional): sin conflictos, CI en verde. El líder lo aprobó; GitHub no deja aprobar el propio PR. Falta decidir cuándo se envía a la profesional.

**Verificación manual de la carga DEMRE (PR 62)**: el líder informó que verificó cinco filas de `datos/verificacion/demre_muestra.csv` contra el PDF oficial: código 46505 (página 234), 44007 (441), 16047 (385), 11082 (269) y 12070 (19). El detalle por fila no quedó registrado en el repositorio. Antes, la fila 12070 figuraba como verificada por el propio autor de la carga, y eso no cuenta como revisión independiente.

**Corrección**: las entradas anteriores de esta bitácora decían que el PR 78 seguía en borrador y que la migración de la nota de cierre estaba pendiente de renombrar. Ambas quedaron superadas por los hechos de arriba.

**Supabase**: el proyecto no usa el registro de migraciones del CLI (la tabla `supabase_migrations.schema_migrations` no existe). Las migraciones se aplican a mano en el editor SQL, así que no hace falta `supabase migration repair`.

**Pendiente**:
- PR 67 (Ale): actualizar su rama con `main` y tomar la versión de `main` en `docs/errores-pr-57.md`.
- PR 62 (Cristóbal): resolver el conflicto de esta bitácora manteniendo las dos partes; revisión independiente de las filas de la muestra restantes; decisión del líder sobre 17074 y 32012.
- Profesional: P1, P4, P6 y P7, y el texto de contención (P2). Sin esto no avanza la app de crisis.
- Legal: ADR 0022, retención de alertas y revisión antes de usar cifras con una institución.
- Despliegue: variables `GEMINI_API_KEY`, `GEMINI_MODELO`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el panel de Cloudflare.
- Rama `docs/estado-9-nov` creada por error en `origin` (AE-SE): borrar si el líder lo confirma.

## 2026-11-09 (noche: rendimiento de las políticas, aplicado en producción)

**Hecho**: #86 fusionado y `20261109200000_rendimiento_politicas_e_indices.sql` aplicada en Supabase por orden del líder. Verificado: 15 políticas, ninguna con `auth.uid()` sin envolver; la prueba de RLS contra producción (revertida) da lo mismo que antes; asesor de rendimiento en 0 errores y 0 avisos.
**Pendiente**: quedan 36 sugerencias del asesor, sin urgencia: índices sin uso (la base está vacía) y claves foráneas sin índice en `seguimiento`, `solicitud_derecho`, `requisito_admision`, `tramo_ingreso_sies` y `vacante_admision`; revisarlas con datos reales. Siguiente paso real: cargar los datos oficiales en producción. Antes de datos personales hay que resolver los respaldos (el plan gratuito no los tiene).

## 2026-11-09 (noche: rendimiento de las políticas RLS antes de cargar datos)

**Hecho (rama `feat/rendimiento-politicas-rls`)**: migración `20261109200000_rendimiento_politicas_e_indices.sql`. Envuelve `auth.uid()` en `(select auth.uid())` en las 9 políticas avisadas, une las lecturas duplicadas de `persona`, `ficha_trayectoria` y `consentimiento` (el "o" de dos políticas permisivas equivale a una con "o") y crea 17 índices de claves foráneas. No cambia quién puede leer o escribir.
**Pendiente**: que pase el job de RLS del CI, fusionar y aplicar a mano en Supabase; luego revisar el asesor de rendimiento (deben quedar 0 avisos de políticas) y probar la RLS en producción otra vez con el mismo bloque que se revierte.

## 2026-11-09 (noche: revisión de Supabase en producción)

**Hecho**: revisión de solo lectura desde el panel (detalle en `supabase/README.md`). Asesor de seguridad: 0 errores. Prueba de RLS contra producción, revertida: `anon` y una sesión sin pertenencia no leen alertas, derivaciones, seguimientos ni autorización de tutor, y no pueden escribir en ellas. Toda la base está vacía.
**Pendiente**: antes de cargar datos reales, cambiar `auth.uid()` por `(select auth.uid())` en las políticas (9 avisos), unificar las políticas permisivas múltiples de `persona`, `ficha_trayectoria` y `consentimiento`, e indexar las claves foráneas que se consulten. Cargar en producción los datos oficiales (`programa`, `institucion`, etc.) es un paso aparte.

## 2026-11-09 (noche: migración del tutor aplicada en Supabase)

**Hecho**: el líder inició sesión en el panel y se aplicó `20261109100000_autorizacion_tutor_no_autodeclarada.sql` en producción (editor SQL). Verificado: política única `tutor_ver_propio` (SELECT) y `authenticated` solo con SELECT. La tabla tenía 0 filas, no había nada que revisar. El hueco del menor que se autorizaba solo queda cerrado en la base real.
**Hecho (después)**: se aplicaron en orden las cuatro migraciones que faltaban (`20261108100000`, `20261108110000`, `20261109000000`, `20261109100000_nota_de_cierre_estructurada`). Antes de cada una se comprobó que el SQL cargado en el editor tenía el mismo hash que el archivo de `main`. Verificado: 25 tablas, 0 sin RLS, sin permisos de tabla ni EXECUTE para `anon` en lo nuevo, y `cerrar_derivacion` con una sola firma. Ya existe el destino de las alertas del endpoint del asistente (#74).
**Pendiente**: renumerar una de las dos `20261109100000` antes de usar `supabase db push`; configurar las variables de entorno del despliegue (GEMINI_API_KEY, GEMINI_MODELO, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY); probar el flujo de alertas con un usuario del equipo real.

## 2026-11-09 (flujo de tutor para menores: hallazgo de seguridad y ADR 0022)

**Hallazgo (Alto)**: `autorizacion_tutor` dejaba que la propia persona insertara su fila (política `tutor_propio` y permisos de `20261104010000`), así que un menor podía autorizarse solo y saltarse `consentimiento_otorgar`. La prueba 5 de RLS lo hacía como el menor. No se verificó si hay filas en Supabase.
**Hecho (rama `feat/diseno-flujo-tutor`, PR en borrador)**: migración `20261109100000_autorizacion_tutor_no_autodeclarada.sql` (la persona solo ve su autorización; la escribe el rol de servicio) y prueba 5 reescrita (el menor no inserta, modifica ni borra; el servidor sí). ADR 0022 (propuesta): quién necesita autorización según la ley y cómo se prueba, con flujo, modelo de datos esbozado y preguntas para asesoría legal.
**Ley verificada** en el texto del Diario Oficial núm. 44.023 (13-dic-2024, CVE 2583630), artículo 16 quáter: menores de 14, consentimiento de padres; de 14 a 17, como adultos salvo datos sensibles de menores de 16. La regla del proyecto (todo menor de 18) es más estricta que la ley; el ADR propone A3 (ley, más capa 3 para todo menor de 18) y deja la decisión al líder.
**No verificado**: la migración y la prueba no se corrieron aquí (no hay PostgreSQL en esta máquina); las corre la CI (trabajo de reglas de privacidad). No se implementó el flujo: el ADR 0015 pide revisión legal antes.
**Pendiente**: revisión legal (5 preguntas en el ADR 0022); decisión del líder entre A1 y A3; proveedor de correo; después, solicitudes pendientes, enlace de un solo uso, vigencia y revocación con sus pruebas, y actualizar `docs/privacidad.md` y AGENTS.md 2.2.

## 2026-11-09 (mezcla de ingreso 2026 verificada en el informe del SIES, #78)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: se leyó el «Informe de Matrícula en Educación Superior en Chile 2026» (SIES, julio de 2026; https://www.mifuturo.cl/wp-content/uploads/2026/07/Informe-de-Matr%C3%ADcula-2026.pdf). Su tabla 7 trae el primer año de pregrado 2026: universidades 161.292 (43,5 %), IP 166.139 (44,8 %), CFT 43.636 (11,8 %), total 371.067. Con esos conteos exactos y las tasas de retención por tipo, 382.725 × 77,497 % da 296.601, la permanencia registrada: el cálculo se reproduce sin redondeos. La base de matrícula histórica está en https://www.mifuturo.cl/bases-de-datos-de-matriculados/ (`Matricula_2007_2026_WEB_10_07_2026.zip`).
**Corregido**: la página decía que el 77,5 % era menor que el 77,9 % del SIES «porque la mezcla de 2026 tiene más IP y CFT»; no se comprobó y el efecto de la mezcla (56,5 % frente a 56,0 %) explica solo una fracción de los 0,4 puntos. Ahora dice que la diferencia no se ha desglosado. Se quitó la nota de «la mezcla suma 100,1 %» del tablero (ya no hace falta: se usan los conteos).
**Límite nuevo, publicado**: unas 26 mil matrículas de primer año pasaron de un CFT a un IP de la misma institución en 2026 (lo dice el informe); la retención por tipo es de la cohorte 2025 y no lo refleja. Va en el texto de la página y en la lista de límites.
**Verificado después (los 0,4 puntos)**: la nota 1 del informe de retención dice que el SIES excluyó del cálculo de la cohorte 2025 la matrícula de primer año del CFT que cerró (sin matrícula en 2026). Comprobación con los conteos de la tabla 7 del informe de matrícula y las tasas de la tabla 2: ponderando con la mezcla 2025 completa (159.167 / 133.532 / 68.900) da 77,37 %; para llegar al 77,9 % del SIES hay que sacar unos 23.700 estudiantes de primer año del CFT (con 26.000 da 77,95 %), cifra coherente con «alrededor de 26 mil» del informe de matrícula. Nuestro 77,5 % usa la mezcla 2026, que ya incluye esos estudiantes como IP. Si tuvieran la retención de los CFT y no la de los IP, la retención ponderada bajaría 0,18 puntos (unas 700 personas), dentro del rango publicado. Es una estimación propia, no una cifra del SIES. La página lo explica con esos términos.
**Pendiente**: ninguno de fuente.

## 2026-11-09 (fuente de la retención verificada, #78)

**Contexto previo a la idea final del 11-nov**: describe permanencia en educación superior y predicción, hoy fuera del alcance (escalabilidad). El pronóstico agregado se conserva solo como base del portal de transparencia.

**Hecho**: se encontró y leyó el informe oficial del SIES «Informe de Retención de 1er Año de Pregrado, cohortes 2021-2025» (agosto de 2026), en https://www.mifuturo.cl/informes-retencion-de-primer-ano/ (PDF: `.../wp-content/uploads/2026/08/Informe-de-Retención-de-1er-Año-de-Pregrado-2026.pdf`). Verificado en el texto: cohorte 2025 con universidades 84,7 %, IP 72,5 %, CFT 69,9 %, total 77,9 % y jornada diurna 82,9 % frente a vespertina 70,2 %. Se retiró el `TODO(fuente)` y la página enlaza al informe.
**Corregido**: la definición del SIES es seguir matriculado en la misma institución como estudiante de la misma cohorte (no dice «misma carrera»); se cambió el texto de la página y del tablero. La página explica que el total de la cohorte (77,9 %) es mayor que nuestro 77,5 % porque aplicamos la mezcla de ingreso de 2026.
**Sigue sin fuente directa**: la mezcla de ingreso 2026 (43,5 / 44,8 / 11,8 %) sale de la base de matrícula 2007-2026 del SIES, calculada aquí; el enlace es la página de informes de matrícula. Falta citar la URL exacta de ese archivo (`datos/registro_descargas.md`).
**Nota técnica**: el PDF se leyó con `pypdf` (no hay `pdftoppm` en esta máquina).

## 2026-11-09 (página pública de transparencia del pronóstico)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho (sin commit, rama `feat/tablero-pronostico`)**: ruta `/transparencia` en el portal (`app/(portal)/transparencia/`): las dos estimaciones nacionales con su rango, cómo se calculan, qué no se hace, cuánto nos hemos equivocado (error nacional, validación por carrera y sede, error corregido de la PAES, rango descartado), calendario de comparación, límites y fuentes. Gráficos en HTML y CSS (texto normal, sin SVG con etiquetas), cada uno con su tabla. Estática (se prerenderiza). Texto en lenguaje claro, siglas explicadas.
**Datos**: `datos/pronosticos/exportar_transparencia.py` genera `datos/transparencia/pronostico_2027.json` (versionado) con lista blanca de campos: sin instituciones, sedes, carreras, comunas ni sexo. Pruebas: `tests/datos/test_exportar_transparencia.py` (6) y `tests/transparencia/transparencia.test.ts` (9), incluida la que impide llaves prohibidas en el archivo publicado.
**Cambios fuera de la página**: `Encabezado` acepta `estacionActual` opcional (esta página no es parte de la trayectoria); fuentes con siglas explicadas en `cifras_nacionales.json`; limpieza de avisos de lint en `tablero.js`. Se corrió `npm ci` porque faltaba `lucide-react` en `node_modules`.
**Verificado**: `tsc`, `eslint`, `npm test` (165), `pytest tests/datos`, `npm run build` y `tokens.py --check` pasan. En navegador: sin desborde a 360 px, un solo `h1`, anclas sin romper, regiones y gráficos con nombre accesible, sin `tabindex` positivo.
**Revisión propia con `revisar-pr` (2026-11-09)**: veredicto **requiere cambios antes de fusionar**, por tres puntos que no puedo cerrar yo:
- *Alto, datos oficiales*: la retención por tipo (84,7 / 72,5 / 69,9 %, cohorte 2025) no se pudo confirmar en una fuente oficial con URL (búsqueda en mifuturo.cl: el último informe encontrado llega a la cohorte 2024, total 77,3 %). La página enlaza solo al sitio general y lleva un `TODO(fuente)` en `page.tsx`. Hay que poner la URL del informe o retirar la tabla (AGENTS.md 2.1: lo que no se puede verificar no se publica).
- *Medio, calidad*: el PR pasa de 3.700 líneas (límite orientativo: 400). Proponer dos PR apilados: primero el tablero (`datos/pronosticos/dashboard/` y su prueba), después la página (`app/(portal)/transparencia/`, `datos/transparencia/` y sus pruebas). La segunda depende de la primera porque el exportador reusa `generar_datos.py`.
- *Medio*: falta la plantilla del PR con la sección de IA utilizada (Claude Sonnet 5.5 y Haiku 5.5).
Corregido en esta pasada: definición de retención del SIES (misma carrera e institución, no «sigue en el sistema»), fecha de consulta en cada insumo, enlaces en las fuentes de validación, «cohorte» y «rendidor» reescritos en lenguaje claro.
**Verificado después**: recorrido con teclado (Tab recorre 40 controles en orden lógico, todos con foco visible salvo el botón de desarrollo de Next.js), tema claro con captura. **Sigue sin verificar**: lector de pantalla; revisión de textos y de lo visual por el líder (AGENTS.md, sección 4).
**Decisiones que son del líder**: (1) publicar o no: fusionar el PR publica cifras que hoy solo están en el repositorio; (2) la página se compromete a publicar la comparación y a versionar correcciones; (3) no hay llamado comercial a instituciones porque el ADR 0018 exige revisión legal antes de cualquier oferta; (4) la página no está enlazada desde la portada ni el menú.

## 2026-11-09 (decisiones del líder: #74 fusionado, ADR 0015/0019/0020 aceptados)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: #74 (endpoint del asistente y registro de alertas) se marcó como listo y se fusionó a `main` con squash (commit `383b603`). Estaba en borrador y con el CI en verde. Los ADR 0015, 0019 y 0020 pasan de «propuesta» a «aceptada» (edición de la línea de estado; sin commit, en `feat/tablero-pronostico`).
**Pendiente del líder**: (1) la aprobación de #74 con otra cuenta de revisor no se hizo: GitHub no la exige para fusionar, pero el plan la pedía; (2) confirmar en Supabase las migraciones `20261108100000_alertas_y_derivacion.sql` y `20261108110000_derechos_del_titular.sql`; (3) definir los `TODO(profesional)` del ADR 0019 y los `TODO(legal)` del ADR 0020, que siguen abiertos aunque los ADR estén aceptados.
**No hecho**: publicar la página de transparencia y el tablero del pronóstico. La decisión del líder es «publicar solo si es win-win»; falta definir ese criterio.

## 2026-11-09 (pruebas automáticas de accesibilidad, rama `feat/prueba-accesibilidad`)

**Hecho (sin commit, rama desde `main`)**: `@playwright/test` 1.65.0 y `@axe-core/playwright` 4.14.0 como dependencias de desarrollo. `tests/accesibilidad/` revisa las 6 páginas públicas de `main` con axe (WCAG 2.2 AA) en tema claro y oscuro, estructura (idioma, título, un `h1`, `main#contenido`), 360 px sin desborde horizontal y foco visible por teclado: 30 pruebas, todas pasan. `npm run test:a11y` compila y prueba; `playwright.config.ts` acepta `PLAYWRIGHT_CANAL=msedge` para no descargar Chromium. Trabajo nuevo `accesibilidad` en `.github/workflows/verificar.yml`. ADR 0021 y README de la carpeta.
**Comprobado**: con una página de prueba que trae una imagen sin texto alternativo y texto con poco contraste, axe las detecta (`image-alt`, `color-contrast`), así que «todo pasa» no es una prueba ciega. Las pruebas son `*.spec.ts` y no se mezclan con `node --test "tests/**/*.test.ts"`.
**Decisión del líder**: axe-core es MPL-2.0 y AGENTS.md 2.3 lista MIT, Apache y BSD. Es solo de desarrollo y no se entrega, pero pide excepción (ADR 0021).
**No verificado**: la corrida en la integración continua (aquí fue en local con Edge, no con el Chromium de Playwright en Linux); un lector de pantalla.
**Pendiente**: sumar `/transparencia` a `tests/accesibilidad/rutas.ts` cuando se fusione esa rama; decidir si `npm run test:a11y` entra en la lista de «terminado» de AGENTS.md. Ojo: en esta rama `main`, `datos/pronosticos/dashboard/datos.js` aparece como no rastreado (se ignora solo en la otra rama): no hacer `git add -A`.

## 2026-11-09 (tablero interactivo del pronóstico)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho (sin commit, rama `docs/estado-9-nov`)**: `datos/pronosticos/dashboard/` con un tablero de uso interno: `generar_datos.py` (sin dependencias) lee `datos/procesados/` y escribe `datos.js`; `index.html`, `tablero.css` y `tablero.js` (gráficos en SVG propio, solo tokens de `diseno/`). 12 secciones: cifras nacionales, calendario de verificación, método, serie PAES, validación por comuna y por carrera y sede, explorador con filtros y CSV, planificador de capacidad, escenarios de permanencia, cohorte por comuna, usos permitidos y límites. `tests/datos/test_dashboard_datos.py` (8 pruebas pasan). `datos.js` queda en `.gitignore`.
**Verificado**: el generador reproduce el informe (18.178 casos, error mediano 11,9 %, cobertura 94,8 %, intervalo ×3,2, 236.962 residentes, San Fernando +26,6 % por colegio). Probado en navegador: sin errores de consola, sin desborde horizontal a 360 px, tema claro y oscuro, filtros, agrupación y escenarios. `python scripts/tokens.py --check` pasa.
**Decisiones**: el intervalo por celda lo calcula el tablero con los cuantiles de todos los errores 2022-2026 (el script de pronóstico no lo escribe); no se trae la proporción de mujeres (ADR 0018); las cifras nacionales viven en `cifras_nacionales.json`, copiadas del informe.
**No verificado**: recorrido solo con teclado y lector de pantalla (se revisó la estructura, no se usó uno); la vista a 360 px se comprobó midiendo el DOM, no con captura; la URL específica de cada archivo de SIES y Mineduc sigue en `datos/registro_descargas.md`, no en el tablero.
**Pendiente**: decidir si el tablero se comparte (hoy trae nombres de instituciones y cifras sin verificar); sumar la comparación con lo observado cuando haya resultados de 2027. Detalle menor: el docstring de `entrada_carrera_sede.py` aún dice «promedio 2024-2026» aunque el código usa el último año.

## 2026-11-09 (alertas, derechos y endpoint del asistente; estado del plan)

**Hecho (en `main`)**: #72 tabla de alertas y derivación con pruebas RLS (fusionado); #73 exportación de datos y solicitudes de derechos (fusionado, con corrección de la función de equipo y merge con #72).
**Hecho (en #74, borrador, CI en verde)**: correcciones de la revisión (no cerrar una alerta con derivaciones abiertas, no reabrir una cerrada, no exportar `autor_id`); `lib/ia/registrar-alerta.ts` escribe la alerta con la clave de servicio; `app/api/asistente` (POST) conecta el protocolo de crisis con el registro; `lib/ia/buscar-fragmentos.ts` busca en `datos/asistente/documentos.json` y no entrega documentos vencidos. `npm test`: 172 pruebas en local.
**Por qué**: la revisión de #72 y #73 encontró que nada escribía alertas y que había dos huecos en las funciones.
**Pendiente**: aprobar #74 (otra cuenta de revisor); confirmar migraciones aplicadas en Supabase; revisión profesional de `docs/revision-profesional-derivacion.md`; configurar variables de entorno en el despliegue; probar `/api/asistente` en Cloudflare; flujo de tutor para menores (depende del ADR 0015); pulso de check-in (revisión legal antes).
**Siguiente**: desde el lunes, lo que queda de la semana 3 de `docs/plan.md`.

## 2026-11-08 (método del último año, pruebas y verificación directa)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `entrada_carrera_sede.py` y `cobertura_entrada_sede.py` usan la participación del último año (2026), que fue el método con menor error en la prueba (11,9 % con la validación de celdas; antes 15,9 %). Resultado 2027: 6.961 celdas publicables y 8.082 suprimidas. Se probó también el método de contracción y el intervalo por volatilidad (`mejora_sede_2.py`): no mejoran. Pruebas nuevas: `tests/datos/test_mejora_cobertura.py` y `tests/datos/test_comparar_paes.py` (11 pasan).
**Reproducibilidad**: se clonó la rama en una carpeta limpia y se reprodujeron las salidas del commit anterior (15.043 celdas, 7.574 publicables) y la cadena del registro (válida). `REPRODUCIR.md` se actualizó al método nuevo.
**Verificación directa**: las páginas de DEMRE sí se pudieron abrir con curl. El calendario 2027 dice "Ene 4 08:00 Resultados de Puntajes PAES Regular" y "Ene 4 09:00 Inicio Etapa de Postulaciones". La página de resultados dice "lunes 4 de enero de 2027, 08:00 horas". CNA: el PDF de criterios para universidades publicado no fija umbrales de retención; los 65/60/50 % solo están en el borrador. SIES (superdesuc.cl): sin respuesta; plazo de matrícula sin verificar.
**Comparación de enero 2027**: `datos/pronosticos/comparar_paes_2027.py` compara la línea base DEF2 con las cifras publicadas (no inventa observaciones).
**Pendiente**: plazo SIES (revisar a mano); la prueba de vacantes queda para cuando se publiquen las vacantes 2027 (con una sola cohorte no se puede medir su valor predictivo); revisión del PR #71 por el líder; decisiones de precio, vía de compra y revisión legal (del líder y asesoría legal).

## 2026-11-07 (cobertura por celda, fechas y aislamiento)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/cobertura_entrada_sede.py` mide la cobertura del intervalo por carrera y sede (validación dejando un año fuera, 2022-2026, 16.519 casos con ≥30 entrantes). Resultado: cobertura 94,9 % con el total conocido (optimista), pero intervalo mediano de ×3,9. Salida en `datos/procesados/cobertura_entrada_sede.csv` (ignorada por git).
**Fechas (agente de verificación)**: solo la rendición PAES 2027 (30-nov a 2-dic-2026) y la publicación de resultados (4-ene-2027, 08:00) aparecen confirmadas, por extracto que cita el afiche DEMRE; el PDF no se pudo abrir. Matrícula 2026 y retención de la cohorte 2025 no se encontraron en fuentes oficiales. Se publica con esa distinción.
**Aislamiento**: el esquema tiene `organizacion` y `miembro` con RLS, pero no hay tabla de salidas por institución. Se corrige la propuesta: en la entrega por archivo el aislamiento es por entrega; RLS es necesario antes de guardar salidas en la base.
**Precio**: estimación de abajo hacia arriba [cifra retirada] anuales (rango razonable de [cifra retirada] a [cifra retirada]), con supuestos de horas y margen explícitos. Coherente con el rango de compras públicas, pero no es prueba de precio.
**Fecha confirmada por el líder**: captura del calendario DEMRE: resultados PAES Regular el 4-ene-2027 a las 08:00 (hora de Chile continental), inicio de postulaciones a las 09:00 del mismo día. Falta registrar la URL de origen.
**Exigencias (agente, leídas en BCN)**: reporte al SIES de matrícula, abandono y duración nominal (Decreto 352; Ley 21.091, art. 105); plan de cierre con retención (art. 25 ter b); apoyo a la retención para gratuidad con 20 % de matrícula en los cuatro primeros deciles (art. 83 d; Decreto 333). No hay meta numérica de retención en texto legal. No verificado: criterios CNA (PDF no abierto), convenios de desempeño, plazo SIES, y Ley 21.850 (BCN indica publicación el 17-oct-2026; falta confirmarla en el Diario Oficial).
**Verificación posterior**: Ley 21.850 verificada en el texto de BCN (idNorma 1229250, publicada el 17-oct-2026 según BCN). Su artículo 20 suspende el ingreso de nuevas instituciones al financiamiento institucional para la gratuidad en 2028 y 2029. Es una ley tributaria y de otras materias, no una ley de educación superior. Texto completo revisado (copia de BCN pegada por el líder); el artículo 20 coincide literalmente. Su artículo 19 ajusta porcentajes del artículo trigésimo cuarto transitorio de la Ley 21.091. Contraloría tomó razón el 16-oct-2026. Diario Oficial no abierto directamente. La nota de BCN sobre la eliminación de los arts. 52 a 54 de la Ley 21.091 no aparece en la 21.850. CNA, convenios de desempeño y plazo SIES: sin verificar en texto. Solo se confirma la regla de 20 días hábiles del Decreto 352.
**Pendiente**: registrar la URL del calendario DEMRE; leer la Ley 21.850 completa y su publicación en el Diario Oficial; leer los PDF de la CNA; revisar indicadores de desempeño 2026 (DIPRES); reducir el ancho del intervalo por celda.

## 2026-11-07 (propuesta institucional completa)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: `docs/mercado/propuesta-institucional.md` (borrador) reúne qué recibe la institución, qué no hace el producto, respuestas a las cuatro preguntas, calendario de verificación 2027-2028, compromisos de neutralidad, integración, precio y vía de compra, criterios de piloto, cláusula de salida y pendientes. Se agregó un anexo al ADR 0018 con las respuestas y lo que falta. Sin nombrar institución. Sin commit.
**Por qué**: la oferta necesita responder a una institución sin depender de una sola. Lo que no está implementado (aislamiento por institución, cobertura de intervalos de primer año por celda) queda escrito como pendiente, no como hecho.
**Pendiente**: decisión del líder sobre precio y vía de compra; revisión legal (cláusula de salida, roles de la Ley 21.719, art. 8° bis); RLS antes de un segundo cliente; mapeo de exigencias de Mineduc y CNA; fechas de publicación del calendario por verificar en cada fuente.

## 2026-11-07 (ADR 0018: producto de planificación de oferta)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: `docs/decisiones/archivo/0018-producto-de-planificacion-de-oferta.md` (propuesta). Finalidad: planificación de oferta y apoyo, solo agregados. Descarta perfiles por variables protegidas y etiquetas por jornada. Documenta fuentes con URL y fecha, método, resultados y límites. Sin commit.
**Art. 8° bis leído completo en BCN**: derecho a no ser objeto de decisiones automatizadas que produzcan efectos jurídicos o afecten significativamente, con excepciones (contrato, consentimiento, ley con salvaguardas) y garantías en todos los casos (explicación, intervención humana, revisión). El producto agregado no activa el artículo; un sistema de alerta individual sí.
**Precio por compras públicas**: sin adjudicaciones comparables. Anclas: soporte U+ [cifra retirada] (DGAC) y presupuesto implícito de la licitación desierta de un CFT estatal regional, [cifra retirada] anuales. Rango propuesto, no decidido: [cifra retirada] a [cifra retirada].
**Contacto enviado (2026-11-07, por el líder)**: correo a info@cfta.cl (canal institucional de cfta.cl), con las tres preguntas del borrador. Sin respuesta registrada todavía. Pendiente: seguimiento y resultado de la conversación.
**Institución para validar**: un CFT estatal regional (nombre omitido), por su licitación desierta. Alternativa privada: una institución que use U+. Requiere autorización del líder y asesoría legal.
**Pendiente**: revisión legal (preguntas en el ADR 0018), decisión del líder sobre precio y validación.

## 2026-11-07 (entrantes por carrera y sede, y marco legal verificado)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: `datos/pronosticos/entrada_carrera_sede.py` genera entrantes 2027 y proporción de mujeres por carrera y sede (15.043 celdas; 7.574 publicables con ≥10; 7.469 suprimidas). Validación 2022-2026 (celdas ≥30 entrantes): error mediano de entrantes 15,9 %; error mediano de proporción de mujeres 4,7 puntos. Salida interna en `datos/procesados/`, sin registrar aún por celda.
**Marco legal, verificado en BCN**: Ley 20.609, art. 2: la discriminación arbitraria puede fundarse en sexo, edad, situación socioeconómica, apariencia personal o discapacidad, entre otros. Ley 21.719 (BCN, idNorma 1209272): entra en vigencia el **1-dic-2026**; define "elaboración de perfiles" (art. 2 w, incluye rendimiento, situación económica, intereses y comportamiento) y considera dato sensible la situación socioeconómica (art. 2 g). Art. 8° bis (decisiones individuales automatizadas): título verificado; el texto completo no se pudo leer desde el navegador.
**Dato que justifica la advertencia**: en la cohorte 2025 la retención de mujeres supera a la de hombres por 3,3 puntos (informe SIES 2026). Un perfil por sexo ya correlaciona con resultados; usarlo en admisión afectaría a personas por una característica protegida.
**Pendiente**: leer el texto completo del art. 8° bis en BCN y revisar cumplimiento antes del 1-dic-2026.

## 2026-11-07 (permanencia de primer año 2028)

**Contexto previo a la idea final del 11-nov**: describe permanencia en educación superior y predicción, hoy fuera del alcance (escalabilidad). El pronóstico agregado se conserva solo como base del portal de transparencia.

**Hecho**: `datos/pronosticos/permanencia_primer_anio.py`. Retención de primer año de la cohorte 2025 (informe SIES, agosto 2026): universidades 84,7 %, IP 72,5 %, CFT 69,9 %; nacional 77,9 %. Mezcla 2026 (SIES): 43,5 % universidades, 44,8 % IP, 11,8 % CFT. Retención ponderada 77,5 %. Permanencia 2028 nacional: 296.601 (277.434 a 300.588), a partir del primer año 2027. Registrado. Cadena válida, 1.723 filas. Sin publicar.
**Límites**: el intervalo viene solo del primer año 2027; no incluye la variación de la retención entre cohortes. La mezcla se mantiene constante.
**Fuente**: informe SIES de retención 2026 (`https://www.mifuturo.cl/wp-content/uploads/2026/08/Informe-de-Retenci%C3%B3n-de-1er-A%C3%B1o-de-Pregrado-2026.pdf`).

## 2026-11-07 (primer año de pregrado 2027, sin PAES)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/entrada_primer_anio.py`. Base SIES 2007-2026 (matrícula de primer año de pregrado): 2024 suma 350.682, frente a 350.683 del informe oficial. Tasa de entrada = primer año / cohorte de cuarto medio del año anterior: 1,499 (2021), 1,486, 1,597, 1,608, 1,638 y 1,615 (2026). Regla del último año. Error en 2022-2026: +0,9 %, −7,0 % (2023), −0,7 %, −1,8 % y +1,4 %. Pronóstico nacional 2027: 382.725 (357.992 a 387.869). Registrado nacional y por región de la sede. Cadena válida, 1.722 filas. Sin publicar.
**Límites**: cinco años de prueba; intervalo provisional. La base reparte por sede, no por residencia. El total incluye estudiantes de otras vías y edades.
**Verificación**: la matrícula 2027 del SIES (publicación del año siguiente).

## 2026-11-07 (estimación PAES por residencia, regional)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/paes_residencia_regional.py` estima rendidores regulares por región de residencia aplicando la tasa de rendición por colegio a la matriz residencia → colegio (2026), escalada con la cohorte 2027 por residencia. Registradas 16 regiones (generación PAES-REGULAR-2027-RESIDENCIA-REGIONAL). Intervalo regional con pandemia. Validación: 2026 estimado vs observado por colegio entre −5,8 % y +9,6 %. 2027, residencia vs colegio: dentro de ±3 % en 10 regiones; +5,7 % Metropolitana, +12,4 % Arica, +12,6 % Magallanes (flujos entre regiones). Cadena válida, 1.705 filas.
**Límite**: es una estimación con supuesto (la tasa depende del colegio). No es validable con DEMRE porque no publica residencia. Solo se cita a nivel regional.
**Decisión**: criterio de cita "lo más confiable siempre" (plan, A7). Citables: cohorte de cuarto medio por residencia (comunal y regional) y PAES Regular por región del colegio. No citable: PAES por residencia (supuesto no validable). Sin publicar. Sin commit.

## 2026-11-07 (intervalos con y sin pandemia)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/intervalos_con_sin_pandemia.py` calcula ambos intervalos y registra la variante sin pandemia (generaciones ...-DEF2-SIN-PANDEMIA). Comunal con pandemia x0,615 a x1,584; sin pandemia x0,753 a x1,644. Regional con pandemia x0,759 a x1,083; sin pandemia x0,959 a x1,087. San Fernando 1.632: con pandemia 1.004 a 2.586; sin pandemia 1.230 a 2.682. Cadena válida, 1.689 filas.
**Por qué**: el par 2020→2021 explica la cola inferior, no la superior. Excluirlo estrecha la región (±5-9 %) y no la comuna en su cola alta.
**Confirmado**: DEMRE confirmó la definición de rendidor regular (fila con puntaje regular). Ya no está pendiente.

## 2026-11-07 (quiebre 2022-2023 explicado: definición de rendidor; corrección de líneas base)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Causa**: a partir de 2023 el archivo de rendición combina PAES Regular e Invierno. Contar filas incluye a personas sin puntaje regular (solo Invierno o sin puntaje). Con filas: 2026 = 317.700; con puntaje regular: 254.177 (−20 %). El salto 2022→2023 que parecía un quiebre era ese cambio de definición.
**Definición usada** (`datos/pronosticos/definicion_rendidor.py`): fila con al menos un puntaje regular distinto de vacío y cero. Pendiente confirmar con DEMRE.
**Validación con la definición consistente** (`recalcular_paes_definicion.py`): comunal, APE mediano 6–8 % en años normales, 2022→2023 = 7,7 % con cobertura 94 %; regional, APE 1,5–5,4 %, cobertura 88–100 %; el quiebre desaparece. Intervalos: comunal ×0,615 a ×1,584; regional ×0,759 a ×1,083.
**Líneas base corregidas (filas nuevas, append-only)**: San Fernando 1.632 (1.004 a 2.586), antes 2.140; O'Higgins 13.666 (10.378 a 14.806), antes 17.323. Las filas anteriores quedan como historial con su motivo.
**Pendiente**: confirmar con DEMRE la definición de rendidor; decidir si se mantiene el intervalo comunal ancho (incluye 2020-2021).

## 2026-11-07 (pronóstico regional PAES Regular 2027, registrado)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/registrar_paes_regional.py` valida y registra el pronóstico regional de rendidores (17 regiones, persistencia regional, intervalo x0,770 a x1,209). Validación: error mediano 1,7 % a 7,2 % en años normales y cobertura 94 % a 100 %. La transición 2022→2023 falla de nuevo (13,3 % de error, 11,8 % de cobertura) y no tiene causa identificada. Ejemplo: O'Higgins (06) 17.323 (13.343 a 20.948); Metropolitana (13) 121.716 (93.749 a 147.187). Cadena válida. Sin publicar.
**Pendiente**: investigar el quiebre de 2022→2023 (cambio de proceso, de cohorte o de conteo) antes de citar cualquier cifra.

## 2026-11-07 (pronóstico de cuarto medio 2027 por residencia, registrado)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/registrar_cohorte_residencia.py` registró en el registro append-only el pronóstico de cuarto medio 2027 por comuna de residencia (334 comunas, método persistencia con tendencia nacional, crecimiento 2025→2026 de 1,0314, intervalo x0,802 a x1,355). San Fernando: 1.196 (960 a 1.621). Cadena válida. Sin publicar.
**Por qué**: unidad decidida en A7 del plan. Se registró antes de que existan datos de 2027 (matrícula de abril de 2027).
**Límite**: los rendidores PAES por comuna del colegio que están en el registro (PAES-REGULAR-2027) se mantienen como registro interno. Por la decisión de A7, solo se citan a nivel regional o nacional.
**Siguiente**: verificar el pronóstico en la matrícula 2027 por residencia (abril-mayo de 2027).

## 2026-11-07 (matrículas 2020-2025 por residencia y unidad del pronóstico)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: se descargaron de datosabiertos.mineduc.cl las matrículas por estudiante 2020 a 2025 (cada una ~34 MB comprimida) y se agregó cuarto medio por residencia (`datos/procesados/residencia_4to/`). Totales: 209.732 (2020), 214.339, 216.397, 218.133, 220.811, 229.744 y 236.962 (2026). Backtest residencial (`datos/pronosticos/backtest_residencia.py`): error mediano 5,6 % a 6,4 %, cobertura del intervalo empírico 93 % a 97 %, intervalo ±20 % a 35 %. Decisión propuesta de unidad en `docs/analisis/plan-de-analisis.md` (A7). Sin publicar. Sin commit.
**Por qué**: la comuna del colegio sobreestima la cohorte local. La residencia es más estable y calibrable.
**Pendiente**: revisión del líder de la unidad propuesta; los rendidores PAES solo a nivel regional o nacional.

## 2026-11-07 (calibración del intervalo y unidad de análisis)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/calibrar_intervalos.py` calibra intervalos empíricos con el cambio logarítmico entre procesos PAES Regular, con validación dejando un par fuera. Cobertura: 96,5 % (2021→2022), 90,1 % (2022→2023), 95,1 % (2023→2024), 97,5 % (2024→2025) y 99,7 % (2025→2026); 51,9 % en 2020→2021 (pandemia). `corregir_intervalos_paes.py` registró 327 correcciones como filas nuevas (append-only). San Fernando: 2.140 con intervalo 1.332 a 3.603 (antes 2.049 a 2.231). La cadena verifica.
**Unidad de análisis**: DEMRE asigna la comuna del colegio de egreso (confirmado en el libro de códigos). Las pruebas previas usan esa unidad; la matriz de residencia (Mineduc 2026) no es comparable directamente con DEMRE.
**Implicación**: por comuna, los intervalos son muy anchos (±40-70 %). La utilidad está en agregados regionales o nacionales.
**Pendiente**: pronóstico por cohorte de residencia; backtest residencial requiere matrículas por estudiante de 2020-2025 (archivos grandes, pedir permiso). Sin publicar.

## 2026-11-07 (cohortes por comuna y cuarto medio 2026)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: se descargó desde datosabiertos.mineduc.cl la matrícula por estudiante 2026 (3.467.024 registros) y se agregó con `datos/calibracion/agregar_cuarto_medio.py` (solo conteos por comuna; ningún dato individual se guarda). Cuarto medio 2026: 236.962 en el país y 1.468 en San Fernando. También se procesó el Censo 2024 con edad simple (`datos/procesados/cohorte_17_18_censo.csv` y `cohorte_17_18_2026.csv`). Sin commit.
**Por qué**: la matrícula cuenta por **ubicación del establecimiento**, no por residencia. San Fernando tiene 1.468 de cuarto medio y 2.448 de 17-18 años residentes: la razón es 1,20, frente a 0,89 en el país. Eso sugiere que la comuna recibe alumnos de otras comunas.
**Resuelto**: el mismo archivo trae la comuna de residencia del alumno. `datos/calibracion/agregar_origen_destino.py` produce la matriz residencia → colegio (celdas <10 suprimidas). San Fernando: 1.160 residentes en cuarto medio, 1.028 estudian en su comuna, 440 llegan de otras comunas y 132 de sus residentes estudian fuera. Por residencia, el cuarto medio por edad es 0,95 (país 0,89), así que es coherente con el censo. Por colegio, la cifra inflaba el cálculo en 27 %. El pronóstico debe usar residencia.
**Pendiente**: revisar la supresión antes de publicar cualquier resumen por comuna.

## 2026-11-07 (prueba retrospectiva de la línea base PAES)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: `datos/pronosticos/backtest_persistencia.py` aplica persistencia a pares de procesos consecutivos de la PAES Regular (2020 a 2026; falta 2022). Resultados: APE mediano por comuna de 24,6 % (2020→2021), 7,0 % (2023→2024), 6,0 % (2024→2025) y 6,2 % (2025→2026). Cobertura del intervalo registrado (n ± 1,96·√n): 23,9 %, 61,7 %, 71,7 % y 67,6 %.
**Actualización con 2022**: se agregó el proceso 2022. Nuevos pares: 2021→2022 con APE mediano 9,3 % (cobertura 57,8 %) y 2022→2023 con 16,9 % (cobertura 23,9 %). La causa del salto de 2022→2023 no está investigada.
**Por qué**: es la evidencia que existe hoy. Mide el pasado, no el futuro.
**Problema**: el intervalo registrado el 2026-11-07 es demasiado estrecho. Cubre 62-72 % de los casos, no el 95 % que declara. Por eso el error real es mayor que la variabilidad muestral.
**Siguiente**: los pronósticos nuevos usarán un intervalo empírico calibrado con estas pruebas. El registro es append-only: la corrección de la línea base se registra como fila nueva con su motivo. Sin commit.

## 2026-11-07 (primer pronóstico registrado: PAES Regular 2027)

**Contexto previo a la idea final del 11-nov**: trabajo del tablero de pronóstico, hoy base de la idea del portal de transparencia (por diseñar, fuera del alcance del 2-dic). No es el alcance actual.

**Hecho**: se registró la línea base de rendidores PAES Regular 2027 por comuna (327 comunas, con supresión de las que tienen menos de 10). Método: persistencia sobre la PAES Regular 2026 (317.700 rendidores). San Fernando: 2.140, intervalo 2.049 a 2.231. El registro es append-only, con cadena de hash verificada. Sin commit.
**Por qué**: la rendición regular es el 30 de nov a 2 dic de 2026, así que el pronóstico se registró antes de ese plazo. Es una referencia mínima para superar.
**Límite**: el intervalo solo refleja variabilidad muestral; no incluye cambios de cohorte ni de política, y probablemente subestima el error real.
**Siguiente**: comparar con la rendición regular 2027 cuando DEMRE la publique (enero de 2027). Actualizar el calendario en el plan (A6) si cambian las fechas.
**Fracaso a evitar**: la rendición de invierno (proceso 2027) está observada; no se registra como pronóstico.

## 2026-11-07 (plan de análisis y requisito de datos institucionales)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: se crea `docs/analisis/plan-de-analisis.md` con dos vías: pronóstico generacional con datos públicos (A0-A4) y análisis individual con datos de la institución (B0-B5). La IA ejecuta casi todo; las personas aprueban los checkpoints de la tabla final. El ADR 0016 agrega que el análisis individual necesita datos de la institución, no solo de la plataforma. Sin commit.
**Por qué**: los datos de la plataforma tienen sesgo de selección y señales débiles; los predictores fuertes (notas, asistencia) solo los tiene la institución.
**Pendiente**: revisión legal (Ley 21.719), acuerdo institucional y gate del ADR 0016 antes de cualquier modelo individual; inventario de fuentes en `docs/fuentes.md` (aún sin verificar la desagregación de las bases).

## 2026-11-07 (propuesta ADR 0017: pronóstico agregado y piloto en una sede privada)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: se redacta `docs/decisiones/archivo/0017-pronostico-agregado-piloto-sede-privada.md` como propuesta. El piloto usa solo datos públicos al principio; no se publica el nombre de la institución sin autorización escrita; si no hay casos suficientes, se cancela. Sin commit.
**Por qué**: el pedido fue un piloto con una sede privada. Un análisis con una institución concreta exige declarar la relación y cuidar la neutralidad del portal.
**Pendiente**: verificar en SIES la sede San Fernando (no encontrada en fuente oficial; solo un directorio sin fecha); definir el umbral mínimo de casos; decidir si se pide conversación formal con la institución.

## 2026-11-07 (análisis de mercado y propuesta ADR 0016)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: se creó `docs/mercado/analisis-mercado.md` con datos verificados en fuente oficial (matrícula 2025, retención 2022) y con las bases de una licitación desierta (código omitido). Los requisitos de integración con U+ son habilitantes; las bases piden analítica predictiva. Se propone `docs/decisiones/archivo/0016-prediccion-condicionada-de-riesgo.md`: revisión condicionada de la prohibición de predicción, con ocho precondiciones. Sin commit.
**Por qué**: el mercado de licitaciones exige predicción, y los competidores la venden. Pero hoy no hay datos a nivel de estudiante que la respalden: el ADR 0016 lo declara y no habilita nada todavía.
**Pendiente**: revisión del líder de los ADR 0015 y 0016; revisión legal de la Ley 21.719 sobre decisiones automatizadas; cambio de AGENTS.md 2.4 si se acepta el 0016; causal de la declaración desierta (resolución en Mercado Público).
**Fracaso a evitar**: Antigravity no pudo buscar en Mercado Público por permisos de modo headless; no se cambió la configuración sin decisión del usuario.

## 2026-11-07 (propuesta ADR 0015: cuenta y vínculo institucional)

**Contexto previo a la idea final del 11-nov**: describe un panel o producto para instituciones de educación superior (o el piloto en una sede privada, SpA), hoy escalabilidad y fuera del alcance del 2-dic.

**Hecho**: se redacta `docs/decisiones/0015-cuenta-del-estudiante-y-vinculo-institucional.md` en estado propuesta. Define: cuenta del estudiante por correo sin contraseña; vínculo con la institución de educación superior por correo institucional o código de invitación (nunca búsqueda por la institución); Ficha compartida por capas, cada una con consentimiento propio y revocable; ningún servicio depende de compartir la Ficha. Sin commit.
**Por qué**: la Ficha pertenece al estudiante y necesita un titular identificable para revocar y exportar datos. El consentimiento tiene que ser libre (Ley 19.628 y 21.719), y la capa sensible requiere consentimiento separado.
**Pendiente**: revisión del líder (@rafajaque); flujo de menores de 18; lista de dominios institucionales verificada con fuente y fecha (los dominios de ejemplo de la conversación no están verificados); definición de campos por capa; revisión legal de la capa sensible; reflejar la propuesta en `docs/privacidad.md`.
**Siguiente**: el líder decide si acepta la propuesta; después se diseñan las tablas RLS de vínculos y consentimientos.

## 2026-11-07 (migración de datos oficiales aplicada)

**Hecho**: se aplicó `20261105000000_datos_oficiales_completos.sql` en el proyecto de Supabase de São Paulo, desde el editor SQL, con confirmación del líder. Antes se verificó que `programa` estaba vacía y que las 6 tablas nuevas no existían. Después: 21 tablas con RLS activado y 0 sin RLS.

**Por qué**: el esquema de datos oficiales (ADR 0014) tiene que existir en la base real antes de cargar la oferta.

**Pendiente**: generar los lotes de carga desde `datos/procesados/carga.csv`. La base no tiene respaldo automático porque el plan es gratuito; el líder decidió aplicarla así.

## 2026-11-06 (revisión de textos C10)

**Hecho**: se revisaron los textos de la portada, el explorador y la ficha de carrera con la skill `lenguaje-claro`. Se explicaron las siglas de las fuentes en pantalla, se simplificaron los indicadores y mensajes sin datos, y se creó `docs/datos/glosario.md` con los términos oficiales usados por la interfaz.

**Por qué**: los nombres oficiales siguen visibles, pero cada uno necesita una explicación que una persona pueda entender sin conocer el sistema de educación superior.

**Pendiente**: repetir esta revisión cuando se agreguen pantallas nuevas. No se cambiaron los textos de páginas técnicas de prueba porque no forman parte del recorrido estudiantil.

## 2026-11-06 (comprobación humana del corpus C9b)

**Hecho**: Cristóbal informó que comprobó manualmente todos los fragmentos del corpus contra los documentos oficiales originales. La constancia quedó en `datos/asistente/README.md` antes de conectar el buscador al asistente.

## 2026-11-06 (corpus oficial del asistente)

**Hecho**: se agregó `datos/asistente/documentos.json` con fragmentos literales de cuatro documentos oficiales vigentes para admisión, beneficios, carreras y plazos. Cada documento conserva organismo, URL, fechas, tema y vencimiento cuando corresponde; una prueba valida el contrato de `Fragmento` y los identificadores únicos.

**Por qué**: el asistente solo puede responder con trozos oficiales que respalden exactamente cada cita. El corpus queda versionado y separado de la conexión futura al buscador.

**Pendiente**: el líder debe conectar el buscador de fragmentos; antes de reutilizar el corpus en otro proceso de admisión, hay que revisar vigencia y reemplazar los documentos vencidos.

## 2026-11-06 (revisión manual de beneficios C9)

**Hecho**: Cristóbal informó que revisó manualmente los ocho montos máximos del catálogo contra sus páginas oficiales, incluida la Beca Juan Gómez Millas para Estudiantes Extranjeros (BJGME). La revisión quedó documentada en `datos/beneficios/README.md` y protegida por una prueba con los ocho valores.

**Pendiente**: Mineduc aún debe publicar las fechas exactas de las etapas que siguen en `null` y actualizar las fechas de acreditación de las páginas Juan Gómez Millas. Esos datos no se completaron ni estimaron.

## 2026-11-05 (C8: verificación manual DEMRE)
**Hecho**: Codex hizo una revisión visual automatizada de las 258 filas de `datos/verificacion/demre_muestra.csv`; esto no reemplaza la verificación manual pedida. `datos/verificacion/demre_revision_humana_pendiente.csv` deja preparadas 15 filas para una persona: 5 con requisito `SI`, las 2 con `APROBADA`, los códigos 17074, 32012 y 17004, y 5 al azar.
**Corrección**: las ponderaciones numéricas `prueba_especial` y `asignacion_especial_pedagogia` ya no mezclan texto. `APROBADA` y `SI` viven en `requisito_prueba_especial` y `requisito_asignacion_pedagogia`. Las excepciones 17074 y 32012 salieron del código y viven en `datos/correcciones/demre_2027.csv`, con fuente, URL y fecha propias. También se separa la nota al pie `(10` cuyo cierre falta en la capa de texto del PDF para el código 17004.
**Resultado técnico**: el cargador conserva tipos compatibles con el esquema numérico y agrega una prueba contra el PDF para los 220 requisitos `SI` y los 2 `APROBADA`. La revisión humana de las 15 filas sigue pendiente; no se declara como terminada hasta que una persona complete responsable, fecha y resultado.

## 2026-11-05 (C9: beneficios y plazos)

**Hecho**: se agregaron catálogos versionados de beneficios estudiantiles y plazos FUAS del proceso 2027, con fuente, URL y fecha de consulta por beneficio. Las pruebas validan trazabilidad, lenguaje sin promesas y valores contrastados con las páginas oficiales.
**Por qué**: los beneficios, montos y fechas cambian por proceso y no deben quedar escritos en el código. Cuando Mineduc no ha publicado una fecha exacta, el dato queda `null` con su motivo.
**Pendiente**: Mineduc aún no publica las fechas exactas del segundo FUAS, nivel socioeconómico, resultados y apelaciones. Las páginas de las becas Juan Gómez Millas conservan fechas de acreditación de 2025; los beneficios se incluyeron porque la guía 2027 confirma su vigencia, pero esas fechas desactualizadas no se copiaron.
**Siguiente**: una persona debe revisar el catálogo y, cuando Mineduc actualice el calendario o las páginas pendientes, crear un nuevo cambio conservando la trazabilidad del proceso.

## 2026-11-05 (esquema de datos oficiales)

**Hecho**: se propone ADR 0014 y una migración para cargar los datos oficiales en sus niveles correctos: institución, carrera genérica SIES, título y variante. Añade trazabilidad para arancel/UF, tramos de ingreso, requisitos y vacantes DEMRE, y acreditación fechada; las pruebas RLS verifican lectura pública, escritura bloqueada, nulos con motivo, rangos y claves únicas.
**Por qué**: un título no determina una carrera genérica, y el código de carrera Mineduc no es una clave estable. La variante concentra las relaciones de la oferta: código SIES, código Mineduc, código DEMRE y carrera genérica; así las cifras SIES no se atribuyen a una sede.
**Pendiente**: la migración debe pasar la integración continua con PostgreSQL; después se genera la carga SQL por lotes, sin credenciales en el repositorio. Sigue pendiente la verificación manual de la muestra DEMRE.
**Siguiente**: revisar el resultado del PR de migración; si la CI pasa y el líder lo fusiona, generar los lotes de carga desde `datos/procesados/carga.csv`.

**Corrección posterior a la CI**: se ajusta la acreditación para aceptar instituciones no acreditadas o bajo tutela sin años ni motivo, porque así viene Mineduc; los aranceles 0 pasan a ser inválidos y deben cargarse como `NULL` con motivo. También se agregan pruebas reales de tramos, UF, claves DEMRE y niveles de indicador. Un segundo ajuste corrige el `VALUES` del fixture de la variante vespertina, que tenía omitido el código DEMRE nulo y detenía la prueba antes de correr. Límite anotado: la matrícula de inscripción convertida desde UF no conserva su monto original.

## 2026-11-05 (herramientas y asistente con fuentes)

**Hecho**: se documenta el orden de evaluación de Supabase CLI, Playwright y Lighthouse CI, dejando Pandera y Vercel AI SDK para una necesidad repetida. También queda el diseño mínimo del asistente: documentos oficiales versionados, fragmentos trazables, Gemini con contexto acotado y rechazo de respuestas sin cita válida; se anotan Gemini Cookbook, Promptfoo, Vercel Chatbot y Ragas como referencias, no como dependencias.
**Por qué**: el siguiente riesgo verificable es probar migraciones y políticas RLS en local. Un asistente no necesita entrenamiento propio para información oficial cambiante: necesita recuperar fuentes vigentes y conservar las barreras deterministas de crisis y privacidad.
**Pendiente**: el líder conecta Supabase; después se evalúa Supabase CLI. El asistente sigue sin interfaz ni corpus de documentos, por lo que ninguna de las herramientas de chat se instala todavía.
**Siguiente**: al tener Supabase local, ejecutar las pruebas SQL con pgTAP; al diseñar la interfaz del asistente, definir el corpus oficial y casos sintéticos de evaluación antes de agregar dependencias.

## 2026-11-06 (entregable Parte I integral)

**Hecho (encuestas)**: encuestas rehechas con respaldo en instrumentos publicados; lista de pendientes: permisos a autores, ítems de intención de abandono y E-DTDC, listado textual de aspectos de Luksic. Ninguna pregunta es propia (niveles A a D); claves de verdadero o falso verificadas el 2026-11-06; se actualizaron fichas, README, `crear_encuestas.gs` y el Anexo 2.A del entregable. Sin commit.

**Hecho**: `docs/entregable/Entregable_Parte_I.md` es el documento vivo con los puntos 1 a 8 del Entregable Parte I (un solo archivo; los próximos puntos se agregan ahí), escritos contra las guías Word de los capítulos 1 a 5 y auditados punto por punto. Sin commit.
**Por qué**: los borradores de `%TEMP%\Entregable_Parte_*.md` traían datos primarios inventados (encuesta n = 112 y sus porcentajes, entrevistas E1-E6, focus group, ratio 1:450, piloto de 100 estudiantes, fecha 19 de diciembre). Se descartaron: las encuestas están diseñadas, no aplicadas. Los resultados quedan como `[COMPLETAR]`; las decisiones del equipo (socios, vesting, precios) como `[CONFIRMAR]`.
**Pendiente**: aplicar encuesta y entrevistas y completar las tablas del punto 2; portada (escuela, sección, apellidos); puntos 9 (valorización y factibilidad) y 10 (presupuesto) cuando lleguen sus guías; gráficos propios del punto 2; confirmar fecha de entrega (el repo dice 2 de diciembre).
**Siguiente**: el líder decide los `[CONFIRMAR]` y revisa el cuerpo del punto 2, que excede las 4-7 páginas de la guía.


## 2026-11-05 (preparación de carga)

**Hecho**: se agregó `datos/preparar_carga.py`, que deja una fila trazable por código SIES al unir la oferta de Mineduc con las filas cruzadas de SIES y DEMRE. Escribe `datos/procesados/carga.csv` y su reporte; ambas salidas siguen ignoradas por git. Tiene pruebas sintéticas para el cruce, los vacíos y los códigos repetidos.
**Por qué**: los archivos `oferta_empleabilidad.csv` y `oferta_demre.csv` solo contienen las llaves de cruce; el script usa además `empleabilidad.csv` y `demre.csv` para conservar las cifras, su fuente, URL, fecha y período sin inventar valores ni transformar ausencias en cero.
**Pendiente**: completar la muestra humana de 15 filas en `datos/verificacion/demre_revision_humana_pendiente.csv`; definir en la migración cómo guardar UF, el tramo de ingreso y los motivos de vacantes vacías; el líder conecta Supabase y después el portal lee la oferta real.
**Siguiente**: el script ya se ejecutó con los datos reales (11.364 filas y 89 columnas; 7.299 con indicadores SIES y 2.086 con datos DEMRE; los cruces son coherentes y la salida es repetible byte a byte). Usar `carga.csv` como entrada del cargador de Supabase cuando exista el esquema final. Los nombres de columna (`oferta_`, `sies_`, `demre_`; sin prefijos repetidos) son el contrato con ese cargador.

## 2026-11-05 (tarde: carga de datos reales)

**Hecho**: fusionados #38 (portada enlaza al explorador), #39 (`datos/cargar_oferta.py`: 11.364 carreras de pregrado desde Mineduc, 23 s), #40 (`datos/cargar_empleabilidad.py`: SIES y cruce) y #41 (corrige el texto de empleabilidad). Las pruebas de Python corren en la CI. Salidas en `datos/procesados/` (ignorada por git); todavía NADA se carga a la base ni se muestra en el portal: el portal sigue con las 10 carreras de ejemplo.
**Por qué**: (1) el SIES publica por institución × carrera genérica, no por título: ese es el cruce correcto (94,1 % de las filas; 7.299 de 11.364 carreras reciben indicadores). (2) «Empleabilidad» = % de titulados que, con ingresos informados, ganó al menos el sueldo mínimo; no mide «tener trabajo». (3) Derecho: el SIES informa como «1.er año» el dato del 2.º; la nota de Cristóbal era correcta y mi cambio a `empleabilidad_2do_anio` fue un error (revertido). (4) Aranceles en UF (173 de pregrado): se guardan en UF y en pesos con la UF del día ($41.274,20 el 2026-11-05), aproximados.
**Fracasos a evitar**: Antigravity no puede abrir archivos oficiales en modo automático (pide ejecutar comandos); el texto plano del PDF del DEMRE separa los datos de su código (daba 70 vacantes en vez de 53: leer por posición con pypdf). En este entorno las barras invertidas dobles en comandos se reducen a una: escribir regex con la herramienta de archivos, no con heredocs.
**DEMRE (C8, PR #43)**: `datos/cargar_demre.py` lee el PDF por posición (el texto plano mezcla los datos entre filas vecinas): 2.157 de 2.159 filas validadas con la suma de ponderaciones = 100; 2.086 de las 2.138 carreras con código DEMRE reciben ponderaciones y vacantes. Un puntaje como «567,5» se perdía en silencio por no ser un entero: ahora se lee, y todo texto con cifras que no se reconozca manda la fila a revisión. **Falta verificar a mano el 10 %** (`datos/verificacion/demre_muestra.csv`, 258 filas): en esta máquina no hay renderizador de PDF y el navegador solo descarga. Tampoco se confirmó el significado de las columnas «especial», ni por qué 52 códigos DEMRE de la oferta no están en el PDF.
**Pendiente**: cargar a Supabase (paso del líder: aplicar migraciones y conectar); mostrar la oferta completa en el portal (hoy `lib/datos/carreras.ts` lee el JSON de ejemplo); nombres de carrera con tildes (usar la carrera genérica de Mineduc); mostrar la acreditación «al 30 de abril de 2026»; motivo de las vacantes `null` y de la matrícula de inscripción en 0 (450 carreras); cómo mostrar un indicador del SIES que aplica a una carrera genérica y no a un título exacto.
**Siguiente**: que una persona verifique la hoja del DEMRE; después, conectar la base (paso del líder) y hacer que el portal lea la oferta real.

## 2026-11-05 (mediodía, ya despierto el líder)

**Hecho**: fusionados #28 (tipografías) y #22 (datos de ejemplo, verificados contra los archivos oficiales). #35 (ficha) y #36 (explorador) actualizados sobre el nuevo `main`; la ficha muestra la matrícula total en su bloque. CI en verde en ambos.
**Por qué**: la verificación de #22 se hizo leyendo los tres archivos oficiales: arancel (Mineduc, `valor_arancel`), 53 vacantes (DEMRE, página 296) y 59,79 % (SIES, fila 97); y arancel y matrícula de las 10 carreras coinciden con el CSV de Mineduc. Antigravity no pudo hacerlo: abrir archivos exige ejecutar comandos y el modo automático se lo niega. El texto plano del PDF del DEMRE separa los datos de su código (daba 70 en vez de 53): hay que leerlo por posición en la página.
**Fracaso a evitar**: cambié Derecho a `empleabilidad_2do_anio` por fiarme de una nota de Cristóbal; el SIES trae ese valor en la columna del 1.er año. Revertido. No cambiar un dato por una nota sin mirarlo en la fuente. Tampoco `push --force` a ramas de PR: el modo automático lo bloquea; usar fusión de `main` en la rama.
**Pendiente**: Cristóbal debe aclarar la nota «excepción de Derecho» (las cohortes miden otro período) y el motivo de las vacantes `null` de institutos y CFT. #35 y #36 siguen en borrador. Lighthouse, 4G lenta y lector de pantalla sin medir. Reservas 1 y 2 del ADR 0003 (#33) sin medir.
**Después (mismo día)**: fusionados #29 (ADR 0013), #30 (cifras con su fuente original), #31 (reparto y bitácora), #33 (ADR 0003 aceptada con reservas) y #34 (insumos para la revisión profesional). #30 estaba apilado sobre #29 y por eso nunca había corrido su CI: tras fusionar #29 hubo que reapuntarlo a `main` y fusionar `main` en su rama (`-X ours`) antes de que pasara. Para la próxima vez: no apilar PR de documentación; abrirlos todos contra `main`.
**Ficha y explorador en producción**: #35 (ficha, A5) y #36 (explorador, A6) fusionados; Cloudflare los despliega solos en unos 4 minutos. `/carreras` y las 10 fichas responden en `agencia-de-enlace.rafajaqued.workers.dev`. La ficha y el explorador comparten `lib/datos/ruta.ts` y `fechas.ts`: no duplicar esa lógica (al fusionar `main` con `-X theirs` se había duplicado y hubo que reaplicarlo).
**Siguiente**: enlazar `/carreras` desde la portada; resolver con Cristóbal lo de Derecho y las vacantes de institutos y CFT; pedir la revisión profesional del protocolo de crisis (insumos en `docs/revision-profesional-crisis.md`).

## 2026-11-05 (noche)

**Hecho**: sitio desplegado en `agencia-de-enlace.rafajaqued.workers.dev` (PR #32 fusionado). PR #33 acepta con reservas el ADR 0003 y anota los términos de Cloudflare: no prohíben uso comercial, pero prohíben procesar tarjetas en el plan gratuito y pueden terminar el servicio gratuito sin aviso. PR #34 reúne insumos para la revisión profesional del protocolo de crisis.
**Por qué**: se ejecutaron 24 frases contra `detectarCrisis()`: `me voy a ahorcar` no se detecta (el patrón busca "ahorcarme"); es un error del patrón, no una cuestión clínica. No se corrigió: `lib/ia/` necesita tu decisión y la revisión profesional.
**Fracaso a evitar**: `codex exec` lanzado en segundo plano se colgó horas sin avisar (esperaba entrada por consola) y después se detuvo a pedir aprobación de su propio plan. Regla: pasar el prompt por archivo (`-`), decirle "no pidas confirmación" y revisar su CPU y su salida a los pocos minutos, en vez de esperar un aviso que no llega si el proceso no termina. Antigravity: usar `--mode plan` y `--print-timeout 8m` (con unidad). Sus respuestas se verifican antes de usarse: se equivocó con el adaptador de Cloudflare.
**Pendiente**: ficha de carrera en construcción por Codex (copia temporal, rama `feat/ficha-carrera`, base: datos de #22 y `lib/datos/carreras.ts`); reservas del ADR 0003 (4G lenta, CPU real, segundo despliegue automático); #22 espera la corrección de `matricula` y la verificación de tres valores; #28 espera que se aprueben sus verificaciones.
**Siguiente**: el viernes 6, revisar #22 y #28 y decidir qué fusionar de #29 a #34. Después, los borradores apilados: #35 (ficha, A5) y #36 (explorador, A6, sobre #35). Ambos dependen de #22 y deben actualizarse con `main` cuando se fusione.
**Por qué**: la ficha y el explorador salen de Codex en copias aparte (carpetas temporales); Claude los revisó y corrigió. Antigravity detectó problemas reales en la ficha (siglas sin explicar, duración formal sin fuente, tarjeta que podía quedar en blanco), todos arreglados; sobre el botón `disabled` y las cifras sin período se equivocó o exageró. La duración formal se quitó de la ficha: AGENTS.md 2.1 prohíbe publicar lo que no se verifica.
**Pendiente (datos)**: Derecho en la Universidad de Antofagasta muestra empleabilidad "al primer año" pero el período dice que es el indicador equivalente al 2.º año; mezcla dos indicadores. Falta decidirlo con Cristóbal. Sin medir: Lighthouse, 4G lenta y lector de pantalla (una llamada a `npx lighthouse` fue bloqueada por el modo automático; correrlo a mano desde Chrome DevTools).
**Fracaso a evitar**: `agy` no puede leer archivos fuera del repositorio en modo automático (devuelve vacío); hay que pegarle el código dentro del prompt.

## 2026-11-05 (tarde)

**Hecho**: PR #32 prepara el despliegue en Cloudflare con OpenNext (A4). En local compila, responde y el paquete pesa 4.687 KiB (996 KiB comprimido). Codex escribió `lib/datos/carreras.ts` con pruebas (rama `feat/lib-datos-carreras`, solo en una copia temporal, sin commit; depende de #22).
**Por qué**: Cloudflare ya recomienda `vinext` (build con Vite) y no OpenNext; se probó OpenNext primero porque no cambia el stack. Antigravity afirmó lo contrario y erró; sus límites del plan gratuito sí eran correctos. OpenNext 1.20.15 y no la 1.20.16, porque esta exige `next >=16.4.5`.
**Pendiente**: conectar el repo en el panel de Cloudflare y medir el despliegue real (carga en 4G lenta, 10 ms de CPU). Cristóbal debe corregir la unidad de `matricula` en #22 y alguien verificar tres valores. Alejandro: #28 espera que se aprueben sus verificaciones. Revisión profesional del protocolo de crisis: se pide el 6 de nov.
**Siguiente**: fusionar #32 tras tu revisión, conectar Cloudflare y, con #22 corregido, commitear la rama de Codex y construir la ficha de carrera (A5).

## 2026-11-05

**Hecho**: revisión de puntos fuertes y débiles del proyecto (sin cambios de código). Se crea esta bitácora; las entradas anteriores no se reconstruyeron desde los commits.
**Por qué**: el diagnóstico es que el proyecto tiene buena base (reglas, RLS probado, protocolo de crisis, trazabilidad de datos) pero casi nada de producto: la única página es un título y una frase, y no hay datos oficiales cargados. Quedan 4 semanas hasta la entrega del 2 de diciembre.
**Pendiente**: PR #28 (tipografías, Alejandro) y #22 (carreras de ejemplo, Cristóbal) abiertos esperando revisión. Los PR #29 y #30 (ADR 0013 y cifras) son documentación del líder. Sigue pendiente la revisión profesional del protocolo de crisis y la autorización escrita del CNED (ADR 0009).
**Siguiente**: revisar #28 y #22 el viernes 6 de nov. `docs/equipo/reparto.md` (PR #31) saca a Alejandro y Cristóbal del camino crítico: la meta es una ficha real desplegada el 16 de nov, construida por el líder, Claude y Codex o Antigravity; ellos entregan tareas cortas con fecha. La vía verde de revisión quedó como propuesta para después (necesita un ADR que cambie `AGENTS.md` 4.6).
**Por qué cambió el enfoque**: el primer borrador del reparto asumía que ambos entregarían a tiempo; el líder dijo que van retrasados y que parte del atraso son sus PR esperando revisión.
**Fracaso a evitar**: seguir sumando documentos (los últimos 5 commits fueron `docs:`) mientras la única página del portal es un título.
