# Hallazgos: sitios de organismos públicos y afines (visitas del 16-nov-2026)

## Método y límites (leer primero)

- Fecha de todas las visitas: **2026-11-16**. Herramientas: lectura de cada URL con WebFetch (convierte la página a texto y la resume con un modelo pequeño) y `curl` para ver el HTML crudo (etiqueta `viewport`, conteo de imágenes y de `alt=""`).
- **No usé navegador con pantalla**: no evalué diseño visual, contraste real, tamaño de letra ni cómo se ve en celular. Todo lo visual queda sin verificar. Lo "visto" es texto y HTML.
- Etiquetas: **[VISTO]** = lo observé en la página o en su HTML; **[EXTERNO]** = lo afirma una fuente externa (con URL); **[INFERENCIA]** = deducción mía; **[SIN EVIDENCIA]** = busqué y no hay.
- Fallos de acceso: `portal.beneficiosestudiantiles.cl` mostraba aviso de mantención ("temporalmente fuera de servicio"); `chileatiende.gob.cl` devolvió 403 al robot; `www.acceso.mineduc.cl`, `superdesu.cl` y `superdeedu.cl` no existen (error de dominio; me equivoqué de dirección, no es falla del sitio). Orienta.cl resultó ser una empresa de informática (IBM), no orientación vocacional: descartada. Elige Educar solo orienta a futuros docentes.
- Cifras: ninguna es mía. Los conteos de `alt=""` son de la portada y **no equivalen a un fallo**: el `alt` vacío es correcto en imágenes decorativas. Sirve solo como indicio.

---

## 1. DEMRE (https://demre.cl/)

**Visto:** portada «Proceso de Admisión 2027», `lang="es-CL"`.

1. **Qué hace bien**
   - [VISTO] Un **bloque «Calendario» en la portada** con tres fechas próximas (mes, día, hecho): p. ej. «19 nov: Publicación oficial Servicios y Beneficios Universitarios», «30 nov: Rendición PAES Regular - Día 1», y un enlace «Todas las fechas importantes». Es el patrón más útil que vi para plazos.
   - [VISTO] Enlace «Ir al contenido» al inicio, siglas con `<abbr title="...">` (PeSD, NEE), buscador y teléfono de mesa de ayuda visibles arriba.
   - [VISTO] «Accesos directos» por tarea (tablas de transformación, certificados, nombre social, resultados por colegio) y portales separados por tipo de usuario (Inscripción, Colegios, Universidades...).
   - [VISTO] Tono cercano en llamados («¡Ya disponible para que practiques!»).
   - [VISTO] Página ligera: 33 KB de HTML.
2. **Qué falla o confunde**
   - [VISTO, HTML] `viewport` con `user-scalable=no`: impide ampliar con pellizco; choca con WCAG 1.4.4 (cambio de tamaño del texto).
   - [VISTO] Mucho HTML comentado dejado en producción (menús y avisos viejos), señal de mantención manual.
   - [VISTO] No hay «última actualización» en la portada; las fechas del calendario no dicen año.
   - [INFERENCIA] Muchos accesos en una portada de alta densidad; el estudiante nuevo no sabe por dónde empezar.
3. **Evidencia:** URL anterior, visita 16-nov-2026; HTML descargado con `curl`. Cita: «Todas las fechas importantes». No hay estudio de usabilidad (no lo busqué específicamente para DEMRE: [SIN EVIDENCIA]).

## 2. mifuturo.cl / SIES (https://www.mifuturo.cl/)

1. **Qué hace bien**
   - [VISTO] Cuatro buscadores explícitos (Carreras, Instituciones, Empleabilidad e Ingresos, Estadísticas por Carrera). El de carreras filtra por región y área.
   - [VISTO] Pestañas de acceso rápido en la portada (Admisión 2026, Beneficios, Ingresos y Empleabilidad) y menú por etapa de decisión («Dónde y qué estudiar», «Cómo financiar»).
   - [VISTO] Entrega empleabilidad e ingreso promedio por carrera.
   - [VISTO] `viewport` correcto (permite ampliar); 85 KB de HTML, respuesta en ~0,5 s desde mi equipo.
   - [EXTERNO] Es el portal de referencia; prensa y Mineduc citan ~2,5 millones de visitas anuales (cifra de 2016-2019, no auditada): https://portal.beneficiosestudiantiles.cl/print/1715 y https://www.chileatiende.gob.cl/fichas/16563-informacion-sobre-educacion-superior-y-tecnico-profesional (las fichas describen el portal; la cifra de visitas viene del resultado de búsqueda, verificar antes de citarla).
2. **Qué falla o confunde**
   - [VISTO] **Pide registro (nivel educacional, región, comuna y fecha de nacimiento) para descargar una búsqueda.** Es lo contrario de nuestro principio de no pedir edad.
   - [VISTO] **No muestra «última actualización»** en la portada ni fecha en noticias destacadas. Fechas de beneficios (12 de febrero) sin año visible en el extracto.
   - [VISTO] Menú duplicado (escritorio y móvil) y carrusel de banners con controles sin texto; imágenes con `alt` genérico («banner sies»). En HTML: 45 imágenes, 20 con `alt=""`.
   - [INFERENCIA] Cuatro buscadores distintos obligan a la persona a saber cuál usar.
3. **Evidencia:** visita 16-nov-2026 a https://www.mifuturo.cl/. **No encontré estudio de usabilidad, encuesta de satisfacción ni evaluación académica** del buscador (búsqueda web 16-nov-2026): [SIN EVIDENCIA] de que «funcione» más allá de las visitas reportadas.

## 3. Beneficios estudiantiles / FUAS (https://www.fuas.cl/; portal.beneficiosestudiantiles.cl)

1. **Qué hace bien**
   - [VISTO] fuas.cl: menú corto (Sobre la postulación, Beneficios, Personas extranjeras, Preguntas frecuentes), videos tutoriales, horario de ayuda y teléfonos con enlace `tel:`. Sección para personas extranjeras: inclusión explícita.
   - [VISTO] Página liviana: 14 KB de HTML, 0,3 s.
2. **Qué falla o confunde**
   - [VISTO] **Las etapas y plazos del proceso 2027 están en imágenes de línea de tiempo**, sin texto legible para el robot; de las 16 imágenes, 15 tienen `alt=""`. Si es información, un lector de pantalla no la recibe. Es una afirmación sobre el HTML; no vi cómo se ve la imagen.
   - [VISTO] Sin fecha de actualización visible.
   - [VISTO] `portal.beneficiosestudiantiles.cl` estaba **fuera de servicio con aviso genérico** sin alternativa ni fecha de regreso.
   - [VISTO, Mineduc] Los plazos de FUAS aparecen dentro de noticias («El 17 de diciembre se publicarán los resultados...»), no en un calendario estructurado.
3. **Evidencia:** visitas 16-nov-2026 a https://www.fuas.cl/ y https://portal.beneficiosestudiantiles.cl. Cita: «temporalmente fuera de servicio».

## 4. INJUV (https://www.injuv.gob.cl)

1. **Qué hace bien**
   - [VISTO] Enlace «Pasar al contenido principal», formulario de búsqueda, vías de contacto múltiples (fono con horario, OIRS, transparencia), Carta de Derechos Ciudadanos.
   - [VISTO] Convocatorias con rango de fechas explícito (microrrelatos: 5 nov a 2 dic).
2. **Qué falla o confunde**
   - [VISTO] **No tiene sección de orientación vocacional ni de educación superior** en la portada; lo más cercano es «Guía Joven» sin descripción. Poco útil como referente funcional para nosotros.
   - [VISTO] Noticias con día y mes pero **sin año**; erratas visibles («insitucional»); varios banners sin `alt`.
3. **Evidencia:** visita 16-nov-2026 a https://www.injuv.gob.cl.

## 5. CNA (https://www.cnachile.cl) y «Ojo dónde estudias» (https://www.ojodondeestudias.cl)

1. **Qué hace bien**
   - [VISTO] «Skip Navigation Links»; buscador de acreditaciones por tipo (Institucional, Pregrado, Postgrado) y «Buscador Avanzado».
   - [VISTO] **Ojo dónde estudias** hace una sola pregunta («Busca acá si está acreditada») con dos listas y un botón: tarea única, clara, para público general. Es el buscador más directo que vi.
2. **Qué falla o confunde**
   - [VISTO] CNA: menú institucional (Comisionados, Actas, Circulares, Ley 20.129) mezcla lo del público con lo técnico; **sin fecha de actualización**; aviso de atención presencial suspendida sin fecha.
   - [VISTO] Ojo dónde estudias: **no muestra fuente ni fecha** de los datos de acreditación; etiquetas en inglés («Previous», «Next»); logos con `alt` vacío; no pude ver cómo se presenta el resultado (queda sin evaluar).
   - [INFERENCIA] Hay que saber qué es «acreditación» para entender el resultado; no vi explicación breve en la portada.
3. **Evidencia:** visitas 16-nov-2026 a ambas URL.

## 6. Superintendencia de Educación (https://www.supereduc.cl)

> Ojo: la **Superintendencia de Educación** (escolar) es distinta de la **Superintendencia de Educación Superior** (el organismo que nos interesa; su sitio no lo revisé: dirección no confirmada). Lo anotado corresponde a la primera, solo como referencia de estilo institucional.

1. **Bien:** [VISTO] contenidos por tema («Mediación», guía para apoderados), teléfono clicable.
2. **Falla:** [VISTO] sin sección para estudiantes; noticias sin fecha en el extracto; enlaces con «#»; etiquetas en inglés residuales («Toggle main menu visibility»).
3. **Evidencia:** visita 16-nov-2026. **Pendiente:** revisar el sitio de la Superintendencia de Educación Superior.

## 7. Mineduc (https://www.mineduc.cl)

1. **Qué hace bien**
   - [VISTO] Menú por etapa educativa («Superior», «Técnico Profesional», «Personas Jóvenes y Adultas») y «Servicios y Trámites»; lenguaje es-CL; noticias con fecha (9 a 16 nov 2026).
2. **Qué falla o confunde**
   - [VISTO, HTML] `viewport` con `user-scalable=no` y `maximum-scale=1.0` (bloquea ampliar); 51 imágenes, 25 con `alt=""`.
   - [VISTO] Sitio-portada con muchas secciones (Destacados, Infórmate, Videos, Revista, Servicio Civil...); los plazos dentro de noticias, no estructurados.
   - [VISTO] Enlaces repetidos «Ver más» y menús con «#».
3. **Evidencia:** visita 16-nov-2026 a https://www.mineduc.cl.

## 8. ChileAtiende (fichas de trámite)

- [VISTO] La ficha https://www.chileatiende.gob.cl/fichas/ver/8300 devolvió **403 al robot**: no pude evaluarla. No afirmo nada de su estructura.
- [EXTERNO, solo existencia] Tiene fichas de trámite (p. ej. https://www.chileatiende.gob.cl/fichas/16563-informacion-sobre-educacion-superior-y-tecnico-profesional). Pendiente de revisar con navegador.

## 9. Elige Educar (https://eligeeducar.cl) y Orienta

- **Elige Educar [VISTO]:** segmentación «Soy…» (Docentes, Estudiantes, Investigadores, Instituciones); selector ES/EN; «Buscador de Carreras» enlazado pero sin descripción; cifras en portada (valoración docente de 52 sobre 100, +120.000 educadores) **sin fuente ni metodología**; pie con «© 2025» y noticias de 2026. Útil para ver el patrón «Soy…», **no como referente de datos** (es para futuros docentes).
- **Orienta [VISTO]:** `orienta.cl` es una consultora de TI; no es un sitio de orientación vocacional. Descartado.

---

## Patrones comunes

**Lo que casi todos hacen bien**
- Lenguaje en español de Chile y tono institucional correcto.
- Enlace «saltar al contenido» (DEMRE, INJUV, CNA).
- Teléfono clicable y mesa de ayuda a la vista (DEMRE, FUAS, INJUV).
- Menús por etapa o por tipo de usuario (mifuturo, Mineduc, DEMRE, Elige Educar).

**Lo que casi todos hacen mal**
- **Casi ninguno muestra «última actualización»** ni fuente junto al dato (DEMRE, mifuturo, CNA, FUAS, Mineduc, INJUV, Ojo dónde estudias). Es el hueco mayor y nuestra regla 2.1 lo llena.
- **Fechas sin año** en noticias y calendarios (INJUV, mifuturo, DEMRE).
- **Plazos dentro de noticias o imágenes** en vez de un calendario con texto (Mineduc, FUAS).
- `viewport` que bloquea la ampliación (DEMRE, Mineduc) [VISTO en HTML].
- Imágenes sin alternativa y enlaces genéricos «Ver más»; carruseles con controles sin texto.
- Restos de interfaz en inglés y de HTML comentado.
- Pedir registro y fecha de nacimiento para usar una función (mifuturo, para descargar).
- Falta de evidencia pública de usabilidad: [SIN EVIDENCIA] de estudios en todos los sitios revisados.

---

## Ideas accionables para nuestro sitio

1. **Calendario corto en portada, con año, como texto** (3 próximas fechas + «Ver todas»). *Sale de DEMRE.* Resuelve «los pasos y plazos no se conocen a tiempo»; hacerlo con texto y año corrige lo que fallan FUAS y Mineduc.
2. **Sello «Fuente · fecha de actualización» pegado a cada dato**, incluso en el calendario. *Hueco de todos los sitios.* Nuestra regla 2.1 ya lo exige; mostrarlo igual en todas partes se vuelve una marca de confianza.
3. **Una pregunta, un campo, un botón en la portada** («¿Qué quieres estudiar?» o «¿Está acreditada?»). *Sale de Ojo dónde estudias.* Tarea única; evita los cuatro buscadores de mifuturo.
4. **Menú por etapa de la decisión**: «Elegir», «Comparar», «Financiar», «Postular». *Sale de mifuturo («Dónde y qué estudiar», «Cómo financiar») y Mineduc.* Mapea el recorrido, no la estructura del organismo.
5. **Descargas y comparaciones sin registro.** *Contraste con mifuturo.* Es nuestro diferencial: exportar o compartir la comparación sin dar edad ni cuenta.
6. **Pasos y plazos de FUAS en texto con lista numerada** (la línea de tiempo, además de imagen, con `alt` descriptivo). *Falla de fuas.cl.* Accesible y legible para lectores de pantalla.
7. **«Accesos directos» por tarea al final de la portada** («Simular mi puntaje», «Ver beneficios», «Certificados y documentos»). *Sale de DEMRE.* Usa verbos, no nombres de organismos.
8. **Glosario en línea con `<abbr>` y explicación en una frase** (acreditación, PAES, NEM, FUAS). *Sale de DEMRE (`abbr`) y de lo que falta en CNA.* Cubre la regla de siglas sin explicar.
9. **Aviso de «Qué mide esta cifra»** en empleabilidad e ingresos, con año de medición. *Sale del vacío en mifuturo, que muestra los indicadores en buscadores separados.* Respeta la regla de no mezclar indicadores.
10. **Estado de servicio y plan B**: si una fuente oficial está caída o desactualizada, decirlo con fecha de nuestra última copia. *Sale de la mantención sin fecha de portal.beneficiosestudiantiles.cl.*
11. **Segmentación «Soy…» solo como atajo opcional** («Estoy en 4.º medio», «Ya egresé», «Soy apoderado/a»), sin pedir datos y sin guardarlos. *Sale de Elige Educar.* Útil para entrar; no exige cuenta.
12. **Diseño que permita ampliar el texto** (nunca `user-scalable=no`), con prueba en 360 px y al 200 %. *Contraste con DEMRE y Mineduc.* Cumple WCAG 1.4.4 y sirve a quien lee con baja visión.

## Pendientes de investigación (no resueltos)

- Evaluar con navegador real: resultados del buscador de mifuturo, ficha de carrera, contraste y móvil.
- Revisar la **Superintendencia de Educación Superior** (sitio correcto), Beneficios Estudiantiles cuando vuelva a estar en línea, y ChileAtiende con navegador.
- Buscar estudios de usabilidad de portales públicos chilenos (no encontré ninguno para mifuturo).
