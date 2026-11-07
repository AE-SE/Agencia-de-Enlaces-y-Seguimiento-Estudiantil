# Bitácora

Memoria de trabajo entre sesiones. Lo más reciente, arriba.

## 2026-11-06 (comprobación humana del corpus C9b)

**Hecho**: Cristóbal informó que comprobó manualmente todos los fragmentos del corpus contra los documentos oficiales originales. La constancia quedó en `datos/asistente/README.md` antes de conectar el buscador al asistente.

## 2026-11-06 (corpus oficial del asistente)

**Hecho**: se agregó `datos/asistente/documentos.json` con fragmentos literales de cuatro documentos oficiales vigentes para admisión, beneficios, carreras y plazos. Cada documento conserva organismo, URL, fechas, tema y vencimiento cuando corresponde; una prueba valida el contrato de `Fragmento` y los identificadores únicos.

**Por qué**: el asistente solo puede responder con trozos oficiales que respalden exactamente cada cita. El corpus queda versionado y separado de la conexión futura al buscador.

**Pendiente**: el líder debe conectar el buscador de fragmentos; antes de reutilizar el corpus en otro proceso de admisión, hay que revisar vigencia y reemplazar los documentos vencidos.

## 2026-11-05 (preparación de carga)

**Hecho**: se agregó `datos/preparar_carga.py`, que deja una fila trazable por código SIES al unir la oferta de Mineduc con las filas cruzadas de SIES y DEMRE. Escribe `datos/procesados/carga.csv` y su reporte; ambas salidas siguen ignoradas por git. Tiene pruebas sintéticas para el cruce, los vacíos y los códigos repetidos.
**Por qué**: los archivos `oferta_empleabilidad.csv` y `oferta_demre.csv` solo contienen las llaves de cruce; el script usa además `empleabilidad.csv` y `demre.csv` para conservar las cifras, su fuente, URL, fecha y período sin inventar valores ni transformar ausencias en cero.
**Pendiente**: verificar a mano `datos/verificacion/demre_muestra.csv`; definir en la migración cómo guardar UF, el tramo de ingreso y los motivos de vacantes vacías; el líder conecta Supabase y después el portal lee la oferta real.
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
