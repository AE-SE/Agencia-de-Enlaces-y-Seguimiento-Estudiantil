# 0034 — Test vocacional y cruce con carreras chilenas
Fecha: 2026-11-13 · Estado: propuesta (pendiente de revisión del líder) · Relacionado: [ADR 0033](0033-cuenta-con-correo-sin-edad.md), [ADR 0011](0011-comparacion-de-programas.md), [ADR 0009](0009-fuente-de-oferta-academica.md), [ADR 0032](0032-agencia-independiente-y-publico-egresado.md)

## Contexto
El proyecto contempla un cuestionario de intereses vocacionales dentro de la cuenta de la persona que egresa, previsto para 2027 ([AGENTS.md](../../AGENTS.md), sección 1). Se quiere saber si puede existir antes y cómo se conecta con el catálogo de carreras.

La idea en estudio: el test entrega un perfil de intereses (modelo RIASEC de seis áreas); con ese perfil se buscan ocupaciones afines en O*NET (base del Departamento de Trabajo de Estados Unidos); las áreas de esas ocupaciones se traducen a términos cercanos a la persona; y de ahí se llega a carreras chilenas revisadas a mano en el catálogo oficial.

Dos límites, que ninguna opción puede cruzar:

- **El test no diagnostica ni predice.** Mide preferencias declaradas. Un perfil «social e investigador» no demuestra interés en salud ni asegura éxito en una carrera. Lo que sí puede decir es qué ocupaciones aparecen como cercanas. Cualquier texto que diga otra cosa queda fuera (AGENTS.md, 2.4).
- **Las cifras y el cruce son elaboración propia.** O*NET no publica correspondencias con carreras chilenas, y su cruce con programas es estadounidense. Todo vínculo con una carrera de Chile se rotula «elaboración propia» y dice cómo se hizo (AGENTS.md, 2.1).

### Lo que se verificó el 2026-11-13
Lectura de las páginas de licencia de O*NET (onetcenter.org). El resultado es parcial: no se leyeron todas las subpáginas enlazadas.

- **Base de datos O*NET (versión 31.0):** la página de licencia de la base (onetcenter.org/license_db.html, leída el 2026-11-13) dice que su contenido está bajo la «Creative Commons Attribution 4.0 International License» (CC BY 4.0). La página no habla de uso comercial de forma explícita; el texto general de CC BY 4.0 sí lo permite, con atribución. Atribuir a «O*NET 31.0» y al U.S. Department of Labor, Employment and Training Administration; enlazar la licencia; indicar cambios.
- **Herramientas, incluido el Interest Profiler:** dos licencias alternativas.
  - *CC BY-ND 4.0*: se puede copiar y redistribuir **sin modificar**. No se distribuyen versiones modificadas.
  - *O*NET Tools Developer License* (leída el 2026-11-13, `license_toolsdev.html`): concesión mundial, libre de regalías y sin permiso previo. Sin cláusula que prohíba el uso comercial ni que lo condicione a permiso, y sin reporte de resultados. Pero tiene **condiciones de validación** (sección 3(b)):
  - **Cambio de propósito:** si el material se usa para orientación, planificación o exploración vocacional, hay que hacer un estudio de validación («Validation Study») consistente con los estándares AERA, APA y NCME.
  - **Modificación:** traducir, alterar o usar solo una parte del material se considera modificación. Hay que hacer el estudio **antes** de lanzar el producto nuevo y avisar en cada producto con un texto fijo («This [page/product/application] includes information from the…»). La traducción al español cae aquí.
  - No se puede imponer términos adicionales a quien usa el material, ni insinuar que el Departamento de Trabajo respalda el producto.
- *CC BY-ND 4.0* no permite modificar ni redistribuir versiones modificadas, así que una versión en español no cabe bajo esa licencia.
- **Interest Profiler corto** (`IP.html`, leída el 2026-11-13): gratuito, en PDF de papel y lápiz (60 preguntas), sin versión web. Se pide registrar el uso («please register», sin ser condición). No hay versión en español indicada. Para incrustar en sitios de terceros, la tabla de la página marca «No»; esa lectura es ambigua y debe confirmarse con O*NET.
- **Mini-IP** (30 preguntas): la versión web, disponible gratis vía My Next Move (Mi Próximo Paso, con versión en español), con widget y API. No se usa aquí sin permiso escrito de O*NET.
- **Respaldo psicométrico:** la página de O*NET afirma evidencia de validez de constructo y confiabilidad, con reportes técnicos de la versión corta. Los reportes no se leyeron; es una afirmación del sitio, no verificada.
- **Interest Profiler largo:** figura como retirado y ya no se distribuye.
- **Página del Interest Profiler (onetinterestprofiler.org):** carga con JavaScript y no se pudo leer.
- **Marca:** «O*NET» se usa como adjetivo («con datos de O*NET»), no como sustantivo ni verbo.

**Conclusión de la verificación:** los datos de ocupaciones (base) se pueden usar con atribución según CC BY 4.0; la página no menciona el uso comercial, y eso se toma del texto general de la licencia. El instrumento (el test) **no está aclarado** para uso comercial ni para incrustarlo en el sitio. Eso exige respuesta escrita del National Center for O*NET Development antes de usarlo.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| **A. Instrumento propio** (descartada por el líder el 2026-11-13: el test debe ser estandarizado): un cuestionario de elaboración propia | Sin problema de licencia; control total del texto; se puede adaptar a Chile | Hay que validarlo (qué mide, a quién sirve); cuesta tiempo de psicología o psicopedagogía; sin cifras de referencia propias |
| **B. Interest Profiler de O*NET** (versión corta) | Afirma validez y confiabilidad (reportes no leídos); datos comparables con sus ocupaciones; gratuito | Traducir o cambiar ítems exige estudio de validación y aviso (Developer License, 3(b)); el uso como orientación vocacional también activa el estudio; incrustación sin aclarar; la versión larga está retirada |
| **C. Sin test**: la persona elige áreas de interés de una lista, y se usan solo los perfiles ocupacionales de O*NET | Usa datos con licencia clara (CC BY 4.0); no requiere instrumento nuevo; se puede construir pronto | No hay perfil de intereses: la sugerencia depende de la elección de la persona, no de un puntaje |

## Decisión
Actualizada el 2026-11-13 a pedido del líder (opción 3 de la conversación: test libre para intereses generales y validación propia del cruce). Pendiente de revisión.

1. **Datos:** se usan los perfiles ocupacionales de O*NET (CC BY 4.0), con atribución y versión visibles (O*NET 31.0). Cada cifra o correspondencia lleva fuente, URL y fecha de consulta.
2. **Instrumento:** un test **estandarizado, validado en español, publicado oficialmente y de uso libre y comercial** para medir intereses generales. Ningún candidato cumple hoy todo eso:
   - *TIPOV* (Universidad de Chile, publicado en *Psykhe* 2021): validado en 568 estudiantes de colegios públicos científico-humanistas de las regiones Metropolitana y O'Higgins. Mide 13 áreas, no RIASEC. Su licencia no aparece en el artículo.
   - *Interest Profiler en español* (vía Mi Próximo Paso): licencia no aclarada. No se usa sin permiso escrito de O*NET.
   
   Se elige uno solo cuando su licencia esté confirmada por escrito. Ninguna sugerencia de carrera se muestra basada en un test hasta entonces.
3. **Cruce con carreras:** ningún test estandarizado relaciona intereses con carreras chilenas. Ese vínculo se valida con un estudio propio con egresados, que mida si las áreas sugeridas coinciden con sus preferencias declaradas. Hasta que ese estudio exista, la sugerencia no dice «tu carrera más afín es…»; muestra áreas relacionadas con su perfil, rotuladas «elaboración propia». La **opción C** (sin test) queda como alternativa si no se consigue la licencia a tiempo.
3. **Cruce con Chile:** cada ocupación se vincula con carreras del catálogo oficial por revisión manual, con criterio documentado y fecha. Se rotula «elaboración propia». Las áreas para agrupar carreras son las 11 «Área de conocimiento» que el buscador del SIES muestra (mifuturo.cl/buscador-de-carreras, leído el 2026-11-13: Administración y Comercio; Agropecuaria; Arte y Arquitectura; Ciencias Básicas; Ciencias Sociales; Derecho; Educación; Humanidades; Salud; Tecnología; Sin Área definida). No se usa CINE-F hasta verificar que el SIES lo emplea. Ninguna sugerencia se ordena por la condición de cliente (ADR 0032).
4. **Resultados en el dispositivo:** el perfil o la elección de áreas no se guarda en la cuenta. La lista cerrada del [ADR 0033](0033-cuenta-con-correo-sin-edad.md) no incluye intereses, y agregarlos exigiría un ADR nuevo. Tampoco se envían a ninguna API de IA.
5. **Lenguaje:** el resultado se presenta como exploración de opciones. Nunca como diagnóstico ni predicción de éxito. No se usan estilos de aprendizaje como base (AGENTS.md, 2.4).
6. **Fase:** diseño y revisión en 2026; construcción en 2027, junto con la cuenta. No entra en el núcleo del 19 de diciembre de 2026.

## Justificación
- **Licencia:** la base de datos tiene licencia clara (CC BY 4.0, con atribución). El test, bajo la Developer License, no prohíbe el uso comercial, pero exige un estudio de validación y un aviso si se traduce o se usa para orientación vocacional. Ese costo, más la falta de respuesta sobre incrustación, justifica no construir sobre él sin antes hablar con O*NET.
- **Trazabilidad (AGENTS.md, 2.1):** O*NET da perfiles ocupacionales versionados, con fuente y fecha, algo que una lista hecha a mano no tiene.
- **Independencia (AGENTS.md, 1):** las sugerencias deben depender de criterios explícitos (afinidad de intereses, cercanía, oferta verificada), no de quién paga.
- **Validación:** que las ocupaciones sugeridas coincidan con las carreras reales se comprueba con revisión manual antes de publicar. No se afirma que el sistema funciona de forma fiable sin evaluación propia.

## Consecuencias
- **Pendiente del líder:** aprobar el envío de la solicitud de licencia a los autores del TIPOV y decidir si se pide permiso a O*NET para el Interest Profiler en español.
- **Pendiente de planificación:** el estudio de validación del cruce con egresados no está en el plan actual. Se fija en `docs/plan.md` antes de la fase de 2027.
- **Pendiente de verificar:** la norma de la BCN (idNorma=1201168) no cargó (la página quedó en «cargando»), y la metodología del buscador del SIES (PDF) devolvió una página de mantenimiento. No se cita ninguna de las dos.
- **Pendiente de verificar:** CINE-F. La fuente oficial de UNESCO (ISCED-F 2013) no se encontró en la página consultada, y el SIES no lo menciona en las páginas leídas. Hasta confirmarlo, el ADR no afirma que el SIES use CINE-F.
- **Pendiente del líder:** la traducción al español del Interest Profiler es una modificación con estudio de validación. Si se elige la opción B, el estudio y el aviso son obligatorios antes de publicar.
- **Pendiente de evidencia:** el test debe declarar su evidencia en [`docs/evidencia-permanencia.md`](../evidencia-permanencia.md) si se considera componente de acompañamiento (AGENTS.md, 2.4), o en un documento propio si no lo es. Decidirlo antes de construir.
- **Pendiente de datos:** un script de carga de los perfiles de O*NET va en `datos/` y su versión queda en `docs/fuentes.md`. No se escribe en el código.
- Si el líder decide usar el Interest Profiler, este ADR se reemplaza por uno nuevo con la respuesta escrita de O*NET adjunta.
