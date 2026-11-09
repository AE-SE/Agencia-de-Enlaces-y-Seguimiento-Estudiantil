# Bitácora

Memoria de trabajo entre sesiones. Lo más reciente, arriba.

## 2026-11-09 (página pública de transparencia del pronóstico)

**Hecho (sin commit, rama `feat/tablero-pronostico`)**: ruta `/transparencia` en el portal (`app/(portal)/transparencia/`): las dos estimaciones nacionales con su rango, cómo se calculan, qué no se hace, cuánto nos hemos equivocado (error nacional, validación por carrera y sede, error corregido de la PAES, rango descartado), calendario de comparación, límites y fuentes. Gráficos en HTML y CSS (texto normal, sin SVG con etiquetas), cada uno con su tabla. Estática (se prerenderiza). Texto en lenguaje claro, siglas explicadas.
**Datos**: `datos/pronosticos/exportar_transparencia.py` genera `datos/transparencia/pronostico_2027.json` (versionado) con lista blanca de campos: sin instituciones, sedes, carreras, comunas ni sexo. Pruebas: `tests/datos/test_exportar_transparencia.py` (6) y `tests/transparencia/transparencia.test.ts` (9), incluida la que impide llaves prohibidas en el archivo publicado.
**Cambios fuera de la página**: `Encabezado` acepta `estacionActual` opcional (esta página no es parte de la trayectoria); fuentes con siglas explicadas en `cifras_nacionales.json`; limpieza de avisos de lint en `tablero.js`. Se corrió `npm ci` porque faltaba `lucide-react` en `node_modules`.
**Verificado**: `tsc`, `eslint`, `npm test` (165), `pytest tests/datos`, `npm run build` y `tokens.py --check` pasan. En navegador: sin desborde a 360 px, un solo `h1`, anclas sin romper, regiones y gráficos con nombre accesible, sin `tabindex` positivo.
**No verificado**: recorrido con teclado real y lector de pantalla; tema claro con captura; revisión de textos y de lo visual por el líder (AGENTS.md, sección 4).
**Decisiones que son del líder**: (1) publicar o no: fusionar el PR publica cifras que hoy solo están en el repositorio; (2) la página se compromete a publicar la comparación y a versionar correcciones; (3) no hay llamado comercial a instituciones porque el ADR 0018 exige revisión legal antes de cualquier oferta; (4) la página no está enlazada desde la portada ni el menú.

## 2026-11-09 (tablero interactivo del pronóstico)

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

**Hecho**: `entrada_carrera_sede.py` y `cobertura_entrada_sede.py` usan la participación del último año (2026), que fue el método con menor error en la prueba (11,9 % con la validación de celdas; antes 15,9 %). Resultado 2027: 6.961 celdas publicables y 8.082 suprimidas. Se probó también el método de contracción y el intervalo por volatilidad (`mejora_sede_2.py`): no mejoran. Pruebas nuevas: `tests/datos/test_mejora_cobertura.py` y `tests/datos/test_comparar_paes.py` (11 pasan).
**Reproducibilidad**: se clonó la rama en una carpeta limpia y se reprodujeron las salidas del commit anterior (15.043 celdas, 7.574 publicables) y la cadena del registro (válida). `REPRODUCIR.md` se actualizó al método nuevo.
**Verificación directa**: las páginas de DEMRE sí se pudieron abrir con curl. El calendario 2027 dice "Ene 4 08:00 Resultados de Puntajes PAES Regular" y "Ene 4 09:00 Inicio Etapa de Postulaciones". La página de resultados dice "lunes 4 de enero de 2027, 08:00 horas". CNA: el PDF de criterios para universidades publicado no fija umbrales de retención; los 65/60/50 % solo están en el borrador. SIES (superdesuc.cl): sin respuesta; plazo de matrícula sin verificar.
**Comparación de enero 2027**: `datos/pronosticos/comparar_paes_2027.py` compara la línea base DEF2 con las cifras publicadas (no inventa observaciones).
**Pendiente**: plazo SIES (revisar a mano); la prueba de vacantes queda para cuando se publiquen las vacantes 2027 (con una sola cohorte no se puede medir su valor predictivo); revisión del PR #71 por el líder; decisiones de precio, vía de compra y revisión legal (del líder y asesoría legal).

## 2026-11-07 (cobertura por celda, fechas y aislamiento)

**Hecho**: `datos/pronosticos/cobertura_entrada_sede.py` mide la cobertura del intervalo por carrera y sede (validación dejando un año fuera, 2022-2026, 16.519 casos con ≥30 entrantes). Resultado: cobertura 94,9 % con el total conocido (optimista), pero intervalo mediano de ×3,9. Salida en `datos/procesados/cobertura_entrada_sede.csv` (ignorada por git).
**Fechas (agente de verificación)**: solo la rendición PAES 2027 (30-nov a 2-dic-2026) y la publicación de resultados (4-ene-2027, 08:00) aparecen confirmadas, por extracto que cita el afiche DEMRE; el PDF no se pudo abrir. Matrícula 2026 y retención de la cohorte 2025 no se encontraron en fuentes oficiales. Se publica con esa distinción.
**Aislamiento**: el esquema tiene `organizacion` y `miembro` con RLS, pero no hay tabla de salidas por institución. Se corrige la propuesta: en la entrega por archivo el aislamiento es por entrega; RLS es necesario antes de guardar salidas en la base.
**Precio**: estimación de abajo hacia arriba ≈ $12,1 M anuales (rango razonable de $10 a $14 M), con supuestos de horas y margen explícitos. Coherente con el rango de compras públicas, pero no es prueba de precio.
**Fecha confirmada por el líder**: captura del calendario DEMRE: resultados PAES Regular el 4-ene-2027 a las 08:00 (hora de Chile continental), inicio de postulaciones a las 09:00 del mismo día. Falta registrar la URL de origen.
**Exigencias (agente, leídas en BCN)**: reporte al SIES de matrícula, abandono y duración nominal (Decreto 352; Ley 21.091, art. 105); plan de cierre con retención (art. 25 ter b); apoyo a la retención para gratuidad con 20 % de matrícula en los cuatro primeros deciles (art. 83 d; Decreto 333). No hay meta numérica de retención en texto legal. No verificado: criterios CNA (PDF no abierto), convenios de desempeño, plazo SIES, y Ley 21.850 (BCN indica publicación el 17-oct-2026; falta confirmarla en el Diario Oficial).
**Verificación posterior**: Ley 21.850 verificada en el texto de BCN (idNorma 1229250, publicada el 17-oct-2026 según BCN). Su artículo 20 suspende el ingreso de nuevas instituciones al financiamiento institucional para la gratuidad en 2028 y 2029. Es una ley tributaria y de otras materias, no una ley de educación superior. Texto completo revisado (copia de BCN pegada por el líder); el artículo 20 coincide literalmente. Su artículo 19 ajusta porcentajes del artículo trigésimo cuarto transitorio de la Ley 21.091. Contraloría tomó razón el 16-oct-2026. Diario Oficial no abierto directamente. La nota de BCN sobre la eliminación de los arts. 52 a 54 de la Ley 21.091 no aparece en la 21.850. CNA, convenios de desempeño y plazo SIES: sin verificar en texto. Solo se confirma la regla de 20 días hábiles del Decreto 352.
**Pendiente**: registrar la URL del calendario DEMRE; leer la Ley 21.850 completa y su publicación en el Diario Oficial; leer los PDF de la CNA; revisar indicadores de desempeño 2026 (DIPRES); reducir el ancho del intervalo por celda.

## 2026-11-07 (propuesta institucional completa)

**Hecho**: `docs/mercado/propuesta-institucional.md` (borrador) reúne qué recibe la institución, qué no hace el producto, respuestas a las cuatro preguntas, calendario de verificación 2027-2028, compromisos de neutralidad, integración, precio y vía de compra, criterios de piloto, cláusula de salida y pendientes. Se agregó un anexo al ADR 0018 con las respuestas y lo que falta. Sin nombrar institución. Sin commit.
**Por qué**: la oferta necesita responder a una institución sin depender de una sola. Lo que no está implementado (aislamiento por institución, cobertura de intervalos de primer año por celda) queda escrito como pendiente, no como hecho.
**Pendiente**: decisión del líder sobre precio y vía de compra; revisión legal (cláusula de salida, roles de la Ley 21.719, art. 8° bis); RLS antes de un segundo cliente; mapeo de exigencias de Mineduc y CNA; fechas de publicación del calendario por verificar en cada fuente.

## 2026-11-07 (ADR 0018: producto de planificación de oferta)

**Hecho**: `docs/decisiones/0018-producto-de-planificacion-de-oferta.md` (propuesta). Finalidad: planificación de oferta y apoyo, solo agregados. Descarta perfiles por variables protegidas y etiquetas por jornada. Documenta fuentes con URL y fecha, método, resultados y límites. Sin commit.
**Art. 8° bis leído completo en BCN**: derecho a no ser objeto de decisiones automatizadas que produzcan efectos jurídicos o afecten significativamente, con excepciones (contrato, consentimiento, ley con salvaguardas) y garantías en todos los casos (explicación, intervención humana, revisión). El producto agregado no activa el artículo; un sistema de alerta individual sí.
**Precio por compras públicas**: sin adjudicaciones comparables. Anclas: soporte U+ $11,9 M CLP (DGAC) y presupuesto implícito de la licitación desierta de un CFT estatal regional, ≈ $13,7 M anuales. Rango propuesto, no decidido: $11,9 a $13,7 M.
**Contacto enviado (2026-11-07, por el líder)**: correo a info@cfta.cl (canal institucional de cfta.cl), con las tres preguntas del borrador. Sin respuesta registrada todavía. Pendiente: seguimiento y resultado de la conversación.
**Institución para validar**: un CFT estatal regional (nombre omitido), por su licitación desierta. Alternativa privada: una institución que use U+. Requiere autorización del líder y asesoría legal.
**Pendiente**: revisión legal (preguntas en el ADR 0018), decisión del líder sobre precio y validación.

## 2026-11-07 (entrantes por carrera y sede, y marco legal verificado)

**Hecho**: `datos/pronosticos/entrada_carrera_sede.py` genera entrantes 2027 y proporción de mujeres por carrera y sede (15.043 celdas; 7.574 publicables con ≥10; 7.469 suprimidas). Validación 2022-2026 (celdas ≥30 entrantes): error mediano de entrantes 15,9 %; error mediano de proporción de mujeres 4,7 puntos. Salida interna en `datos/procesados/`, sin registrar aún por celda.
**Marco legal, verificado en BCN**: Ley 20.609, art. 2: la discriminación arbitraria puede fundarse en sexo, edad, situación socioeconómica, apariencia personal o discapacidad, entre otros. Ley 21.719 (BCN, idNorma 1209272): entra en vigencia el **1-dic-2026**; define "elaboración de perfiles" (art. 2 w, incluye rendimiento, situación económica, intereses y comportamiento) y considera dato sensible la situación socioeconómica (art. 2 g). Art. 8° bis (decisiones individuales automatizadas): título verificado; el texto completo no se pudo leer desde el navegador.
**Dato que justifica la advertencia**: en la cohorte 2025 la retención de mujeres supera a la de hombres por 3,3 puntos (informe SIES 2026). Un perfil por sexo ya correlaciona con resultados; usarlo en admisión afectaría a personas por una característica protegida.
**Pendiente**: leer el texto completo del art. 8° bis en BCN y revisar cumplimiento antes del 1-dic-2026.

## 2026-11-07 (permanencia de primer año 2028)

**Hecho**: `datos/pronosticos/permanencia_primer_anio.py`. Retención de primer año de la cohorte 2025 (informe SIES, agosto 2026): universidades 84,7 %, IP 72,5 %, CFT 69,9 %; nacional 77,9 %. Mezcla 2026 (SIES): 43,5 % universidades, 44,8 % IP, 11,8 % CFT. Retención ponderada 77,5 %. Permanencia 2028 nacional: 296.601 (277.434 a 300.588), a partir del primer año 2027. Registrado. Cadena válida, 1.723 filas. Sin publicar.
**Límites**: el intervalo viene solo del primer año 2027; no incluye la variación de la retención entre cohortes. La mezcla se mantiene constante.
**Fuente**: informe SIES de retención 2026 (`https://www.mifuturo.cl/wp-content/uploads/2026/08/Informe-de-Retenci%C3%B3n-de-1er-A%C3%B1o-de-Pregrado-2026.pdf`).

## 2026-11-07 (primer año de pregrado 2027, sin PAES)

**Hecho**: `datos/pronosticos/entrada_primer_anio.py`. Base SIES 2007-2026 (matrícula de primer año de pregrado): 2024 suma 350.682, frente a 350.683 del informe oficial. Tasa de entrada = primer año / cohorte de cuarto medio del año anterior: 1,499 (2021), 1,486, 1,597, 1,608, 1,638 y 1,615 (2026). Regla del último año. Error en 2022-2026: +0,9 %, −7,0 % (2023), −0,7 %, −1,8 % y +1,4 %. Pronóstico nacional 2027: 382.725 (357.992 a 387.869). Registrado nacional y por región de la sede. Cadena válida, 1.722 filas. Sin publicar.
**Límites**: cinco años de prueba; intervalo provisional. La base reparte por sede, no por residencia. El total incluye estudiantes de otras vías y edades.
**Verificación**: la matrícula 2027 del SIES (publicación del año siguiente).

## 2026-11-07 (estimación PAES por residencia, regional)

**Hecho**: `datos/pronosticos/paes_residencia_regional.py` estima rendidores regulares por región de residencia aplicando la tasa de rendición por colegio a la matriz residencia → colegio (2026), escalada con la cohorte 2027 por residencia. Registradas 16 regiones (generación PAES-REGULAR-2027-RESIDENCIA-REGIONAL). Intervalo regional con pandemia. Validación: 2026 estimado vs observado por colegio entre −5,8 % y +9,6 %. 2027, residencia vs colegio: dentro de ±3 % en 10 regiones; +5,7 % Metropolitana, +12,4 % Arica, +12,6 % Magallanes (flujos entre regiones). Cadena válida, 1.705 filas.
**Límite**: es una estimación con supuesto (la tasa depende del colegio). No es validable con DEMRE porque no publica residencia. Solo se cita a nivel regional.
**Decisión**: criterio de cita "lo más confiable siempre" (plan, A7). Citables: cohorte de cuarto medio por residencia (comunal y regional) y PAES Regular por región del colegio. No citable: PAES por residencia (supuesto no validable). Sin publicar. Sin commit.

## 2026-11-07 (intervalos con y sin pandemia)

**Hecho**: `datos/pronosticos/intervalos_con_sin_pandemia.py` calcula ambos intervalos y registra la variante sin pandemia (generaciones ...-DEF2-SIN-PANDEMIA). Comunal con pandemia x0,615 a x1,584; sin pandemia x0,753 a x1,644. Regional con pandemia x0,759 a x1,083; sin pandemia x0,959 a x1,087. San Fernando 1.632: con pandemia 1.004 a 2.586; sin pandemia 1.230 a 2.682. Cadena válida, 1.689 filas.
**Por qué**: el par 2020→2021 explica la cola inferior, no la superior. Excluirlo estrecha la región (±5-9 %) y no la comuna en su cola alta.
**Confirmado**: DEMRE confirmó la definición de rendidor regular (fila con puntaje regular). Ya no está pendiente.

## 2026-11-07 (quiebre 2022-2023 explicado: definición de rendidor; corrección de líneas base)

**Causa**: a partir de 2023 el archivo de rendición combina PAES Regular e Invierno. Contar filas incluye a personas sin puntaje regular (solo Invierno o sin puntaje). Con filas: 2026 = 317.700; con puntaje regular: 254.177 (−20 %). El salto 2022→2023 que parecía un quiebre era ese cambio de definición.
**Definición usada** (`datos/pronosticos/definicion_rendidor.py`): fila con al menos un puntaje regular distinto de vacío y cero. Pendiente confirmar con DEMRE.
**Validación con la definición consistente** (`recalcular_paes_definicion.py`): comunal, APE mediano 6–8 % en años normales, 2022→2023 = 7,7 % con cobertura 94 %; regional, APE 1,5–5,4 %, cobertura 88–100 %; el quiebre desaparece. Intervalos: comunal ×0,615 a ×1,584; regional ×0,759 a ×1,083.
**Líneas base corregidas (filas nuevas, append-only)**: San Fernando 1.632 (1.004 a 2.586), antes 2.140; O'Higgins 13.666 (10.378 a 14.806), antes 17.323. Las filas anteriores quedan como historial con su motivo.
**Pendiente**: confirmar con DEMRE la definición de rendidor; decidir si se mantiene el intervalo comunal ancho (incluye 2020-2021).

## 2026-11-07 (pronóstico regional PAES Regular 2027, registrado)

**Hecho**: `datos/pronosticos/registrar_paes_regional.py` valida y registra el pronóstico regional de rendidores (17 regiones, persistencia regional, intervalo x0,770 a x1,209). Validación: error mediano 1,7 % a 7,2 % en años normales y cobertura 94 % a 100 %. La transición 2022→2023 falla de nuevo (13,3 % de error, 11,8 % de cobertura) y no tiene causa identificada. Ejemplo: O'Higgins (06) 17.323 (13.343 a 20.948); Metropolitana (13) 121.716 (93.749 a 147.187). Cadena válida. Sin publicar.
**Pendiente**: investigar el quiebre de 2022→2023 (cambio de proceso, de cohorte o de conteo) antes de citar cualquier cifra.

## 2026-11-07 (pronóstico de cuarto medio 2027 por residencia, registrado)

**Hecho**: `datos/pronosticos/registrar_cohorte_residencia.py` registró en el registro append-only el pronóstico de cuarto medio 2027 por comuna de residencia (334 comunas, método persistencia con tendencia nacional, crecimiento 2025→2026 de 1,0314, intervalo x0,802 a x1,355). San Fernando: 1.196 (960 a 1.621). Cadena válida. Sin publicar.
**Por qué**: unidad decidida en A7 del plan. Se registró antes de que existan datos de 2027 (matrícula de abril de 2027).
**Límite**: los rendidores PAES por comuna del colegio que están en el registro (PAES-REGULAR-2027) se mantienen como registro interno. Por la decisión de A7, solo se citan a nivel regional o nacional.
**Siguiente**: verificar el pronóstico en la matrícula 2027 por residencia (abril-mayo de 2027).

## 2026-11-07 (matrículas 2020-2025 por residencia y unidad del pronóstico)

**Hecho**: se descargaron de datosabiertos.mineduc.cl las matrículas por estudiante 2020 a 2025 (cada una ~34 MB comprimida) y se agregó cuarto medio por residencia (`datos/procesados/residencia_4to/`). Totales: 209.732 (2020), 214.339, 216.397, 218.133, 220.811, 229.744 y 236.962 (2026). Backtest residencial (`datos/pronosticos/backtest_residencia.py`): error mediano 5,6 % a 6,4 %, cobertura del intervalo empírico 93 % a 97 %, intervalo ±20 % a 35 %. Decisión propuesta de unidad en `docs/analisis/plan-de-analisis.md` (A7). Sin publicar. Sin commit.
**Por qué**: la comuna del colegio sobreestima la cohorte local. La residencia es más estable y calibrable.
**Pendiente**: revisión del líder de la unidad propuesta; los rendidores PAES solo a nivel regional o nacional.

## 2026-11-07 (calibración del intervalo y unidad de análisis)

**Hecho**: `datos/pronosticos/calibrar_intervalos.py` calibra intervalos empíricos con el cambio logarítmico entre procesos PAES Regular, con validación dejando un par fuera. Cobertura: 96,5 % (2021→2022), 90,1 % (2022→2023), 95,1 % (2023→2024), 97,5 % (2024→2025) y 99,7 % (2025→2026); 51,9 % en 2020→2021 (pandemia). `corregir_intervalos_paes.py` registró 327 correcciones como filas nuevas (append-only). San Fernando: 2.140 con intervalo 1.332 a 3.603 (antes 2.049 a 2.231). La cadena verifica.
**Unidad de análisis**: DEMRE asigna la comuna del colegio de egreso (confirmado en el libro de códigos). Las pruebas previas usan esa unidad; la matriz de residencia (Mineduc 2026) no es comparable directamente con DEMRE.
**Implicación**: por comuna, los intervalos son muy anchos (±40-70 %). La utilidad está en agregados regionales o nacionales.
**Pendiente**: pronóstico por cohorte de residencia; backtest residencial requiere matrículas por estudiante de 2020-2025 (archivos grandes, pedir permiso). Sin publicar.

## 2026-11-07 (cohortes por comuna y cuarto medio 2026)

**Hecho**: se descargó desde datosabiertos.mineduc.cl la matrícula por estudiante 2026 (3.467.024 registros) y se agregó con `datos/calibracion/agregar_cuarto_medio.py` (solo conteos por comuna; ningún dato individual se guarda). Cuarto medio 2026: 236.962 en el país y 1.468 en San Fernando. También se procesó el Censo 2024 con edad simple (`datos/procesados/cohorte_17_18_censo.csv` y `cohorte_17_18_2026.csv`). Sin commit.
**Por qué**: la matrícula cuenta por **ubicación del establecimiento**, no por residencia. San Fernando tiene 1.468 de cuarto medio y 2.448 de 17-18 años residentes: la razón es 1,20, frente a 0,89 en el país. Eso sugiere que la comuna recibe alumnos de otras comunas.
**Resuelto**: el mismo archivo trae la comuna de residencia del alumno. `datos/calibracion/agregar_origen_destino.py` produce la matriz residencia → colegio (celdas <10 suprimidas). San Fernando: 1.160 residentes en cuarto medio, 1.028 estudian en su comuna, 440 llegan de otras comunas y 132 de sus residentes estudian fuera. Por residencia, el cuarto medio por edad es 0,95 (país 0,89), así que es coherente con el censo. Por colegio, la cifra inflaba el cálculo en 27 %. El pronóstico debe usar residencia.
**Pendiente**: revisar la supresión antes de publicar cualquier resumen por comuna.

## 2026-11-07 (prueba retrospectiva de la línea base PAES)

**Hecho**: `datos/pronosticos/backtest_persistencia.py` aplica persistencia a pares de procesos consecutivos de la PAES Regular (2020 a 2026; falta 2022). Resultados: APE mediano por comuna de 24,6 % (2020→2021), 7,0 % (2023→2024), 6,0 % (2024→2025) y 6,2 % (2025→2026). Cobertura del intervalo registrado (n ± 1,96·√n): 23,9 %, 61,7 %, 71,7 % y 67,6 %.
**Actualización con 2022**: se agregó el proceso 2022. Nuevos pares: 2021→2022 con APE mediano 9,3 % (cobertura 57,8 %) y 2022→2023 con 16,9 % (cobertura 23,9 %). La causa del salto de 2022→2023 no está investigada.
**Por qué**: es la evidencia que existe hoy. Mide el pasado, no el futuro.
**Problema**: el intervalo registrado el 2026-11-07 es demasiado estrecho. Cubre 62-72 % de los casos, no el 95 % que declara. Por eso el error real es mayor que la variabilidad muestral.
**Siguiente**: los pronósticos nuevos usarán un intervalo empírico calibrado con estas pruebas. El registro es append-only: la corrección de la línea base se registra como fila nueva con su motivo. Sin commit.

## 2026-11-07 (primer pronóstico registrado: PAES Regular 2027)

**Hecho**: se registró la línea base de rendidores PAES Regular 2027 por comuna (327 comunas, con supresión de las que tienen menos de 10). Método: persistencia sobre la PAES Regular 2026 (317.700 rendidores). San Fernando: 2.140, intervalo 2.049 a 2.231. El registro es append-only, con cadena de hash verificada. Sin commit.
**Por qué**: la rendición regular es el 30 de nov a 2 dic de 2026, así que el pronóstico se registró antes de ese plazo. Es una referencia mínima para superar.
**Límite**: el intervalo solo refleja variabilidad muestral; no incluye cambios de cohorte ni de política, y probablemente subestima el error real.
**Siguiente**: comparar con la rendición regular 2027 cuando DEMRE la publique (enero de 2027). Actualizar el calendario en el plan (A6) si cambian las fechas.
**Fracaso a evitar**: la rendición de invierno (proceso 2027) está observada; no se registra como pronóstico.

## 2026-11-07 (plan de análisis y requisito de datos institucionales)

**Hecho**: se crea `docs/analisis/plan-de-analisis.md` con dos vías: pronóstico generacional con datos públicos (A0-A4) y análisis individual con datos de la institución (B0-B5). La IA ejecuta casi todo; las personas aprueban los checkpoints de la tabla final. El ADR 0016 agrega que el análisis individual necesita datos de la institución, no solo de la plataforma. Sin commit.
**Por qué**: los datos de la plataforma tienen sesgo de selección y señales débiles; los predictores fuertes (notas, asistencia) solo los tiene la institución.
**Pendiente**: revisión legal (Ley 21.719), acuerdo institucional y gate del ADR 0016 antes de cualquier modelo individual; inventario de fuentes en `docs/fuentes.md` (aún sin verificar la desagregación de las bases).

## 2026-11-07 (propuesta ADR 0017: pronóstico agregado y piloto en una sede privada)

**Hecho**: se redacta `docs/decisiones/0017-pronostico-agregado-piloto-sede-privada.md` como propuesta. El piloto usa solo datos públicos al principio; no se publica el nombre de la institución sin autorización escrita; si no hay casos suficientes, se cancela. Sin commit.
**Por qué**: el pedido fue un piloto con una sede privada. Un análisis con una institución concreta exige declarar la relación y cuidar la neutralidad del portal.
**Pendiente**: verificar en SIES la sede San Fernando (no encontrada en fuente oficial; solo un directorio sin fecha); definir el umbral mínimo de casos; decidir si se pide conversación formal con la institución.

## 2026-11-07 (análisis de mercado y propuesta ADR 0016)

**Hecho**: se creó `docs/mercado/analisis-mercado.md` con datos verificados en fuente oficial (matrícula 2025, retención 2022) y con las bases de una licitación desierta (código omitido). Los requisitos de integración con U+ son habilitantes; las bases piden analítica predictiva. Se propone `docs/decisiones/0016-prediccion-condicionada-de-riesgo.md`: revisión condicionada de la prohibición de predicción, con ocho precondiciones. Sin commit.
**Por qué**: el mercado de licitaciones exige predicción, y los competidores la venden. Pero hoy no hay datos a nivel de estudiante que la respalden: el ADR 0016 lo declara y no habilita nada todavía.
**Pendiente**: revisión del líder de los ADR 0015 y 0016; revisión legal de la Ley 21.719 sobre decisiones automatizadas; cambio de AGENTS.md 2.4 si se acepta el 0016; causal de la declaración desierta (resolución en Mercado Público).
**Fracaso a evitar**: Antigravity no pudo buscar en Mercado Público por permisos de modo headless; no se cambió la configuración sin decisión del usuario.

## 2026-11-07 (propuesta ADR 0015: cuenta y vínculo institucional)

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
