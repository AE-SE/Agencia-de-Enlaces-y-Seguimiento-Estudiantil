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

- **Base de datos O*NET:** Creative Commons Attribution 4.0 (CC BY 4.0). Permite uso comercial con atribución, según el texto de la licencia. Atribuir a «O*NET 31.0» y al U.S. Department of Labor, Employment and Training Administration; enlazar la licencia; indicar cambios.
- **Herramientas, incluido el Interest Profiler:** dos licencias alternativas.
  - *CC BY-ND 4.0*: se puede copiar y redistribuir **sin modificar**. No se distribuyen versiones modificadas.
  - *O*NET Tools Developer License*: permite modificar y extender las herramientas, con condiciones (incluida la de «validar» los productos que incorporan contenido de las herramientas, cuyo texto no se leyó).
  - Ninguna de las dos menciona explícitamente el uso comercial, ni la incrustación en sitios de terceros, ni permisos o tarifas.
- **Interest Profiler largo:** figura como retirado y ya no se distribuye.
- **Interest Profiler corto:** sus términos específicos (onetinterestprofiler.org, /IP.html) no se leyeron.
- **Marca:** «O*NET» se usa como adjetivo («con datos de O*NET»), no como sustantivo ni verbo.

**Conclusión de la verificación:** los datos de ocupaciones (base) se pueden usar comercialmente con atribución. El instrumento (el test) **no está aclarado** para uso comercial ni para incrustarlo en el sitio. Eso exige respuesta escrita del National Center for O*NET Development antes de usarlo.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| **A. Instrumento propio**: un cuestionario de intereses de elaboración propia, basado en el modelo RIASEC y redactado en lenguaje claro | Sin problema de licencia; control total del texto; se puede adaptar a Chile | Hay que validarlo (qué mide, a quién sirve); cuesta tiempo de psicología o psicopedagogía; sin cifras de referencia propias |
| **B. Interest Profiler de O*NET** (versión corta) | Ya validado por O*NET; datos comparables con sus ocupaciones | Licencia sin aclarar para uso comercial e incrustación; la versión larga está retirada; podría exigir validar productos |
| **C. Sin test**: la persona elige áreas de interés de una lista, y se usan solo los perfiles ocupacionales de O*NET | Usa datos con licencia clara (CC BY 4.0); no requiere instrumento nuevo; se puede construir pronto | No hay perfil de intereses: la sugerencia depende de la elección de la persona, no de un puntaje |

## Decisión
Propuesta, pendiente de revisión del líder:

1. **Datos:** se usan los perfiles ocupacionales de O*NET (CC BY 4.0), con atribución y versión visibles (O*NET 31.0). Cada cifra o correspondencia lleva fuente, URL y fecha de consulta.
2. **Instrumento:** no se usa el Interest Profiler de O*NET hasta tener respuesta escrita del National Center for O*NET Development sobre uso comercial e incrustación. Mientras tanto, se evalúa la **opción A** (instrumento propio) y se usa la **opción C** como primer paso, porque no depende de la licencia del test.
3. **Cruce con Chile:** cada ocupación se vincula con carreras del catálogo oficial por revisión manual, con criterio documentado y fecha. Se rotula «elaboración propia». Ninguna sugerencia se ordena por la condición de cliente (ADR 0032).
4. **Resultados en el dispositivo:** el perfil o la elección de áreas no se guarda en la cuenta. La lista cerrada del [ADR 0033](0033-cuenta-con-correo-sin-edad.md) no incluye intereses, y agregarlos exigiría un ADR nuevo. Tampoco se envían a ninguna API de IA.
5. **Lenguaje:** el resultado se presenta como exploración de opciones. Nunca como diagnóstico ni predicción de éxito. No se usan estilos de aprendizaje como base (AGENTS.md, 2.4).
6. **Fase:** diseño y revisión en 2026; construcción en 2027, junto con la cuenta. No entra en el núcleo del 19 de diciembre de 2026.

## Justificación
- **Licencia:** la base de datos tiene licencia clara y permite uso comercial con atribución. El test no la tiene clara; construir sobre él sin permiso expone al proyecto a un reclamo y a tener que retirar la función.
- **Trazabilidad (AGENTS.md, 2.1):** O*NET da perfiles ocupacionales versionados, con fuente y fecha, algo que una lista hecha a mano no tiene.
- **Independencia (AGENTS.md, 1):** las sugerencias deben depender de criterios explícitos (afinidad de intereses, cercanía, oferta verificada), no de quién paga.
- **Validación:** que las ocupaciones sugeridas coincidan con las carreras reales se comprueba con revisión manual antes de publicar. No se afirma que el sistema funciona de forma fiable sin evaluación propia.

## Consecuencias
- **Pendiente del líder:** decidir si se pide permiso al National Center for O*NET Development (contacto desde su sitio) y si se inicia la opción A.
- **Pendiente de verificar:** el texto de la «validación» de la licencia de desarrolladores (`license_toolsdev.html`) y la página del Interest Profiler corto (`IP.html`). No se leyeron.
- **Pendiente de verificar:** dos enlaces del texto de referencia sobre CINE-F y la norma del Ministerio no se han abierto; no se citan hasta comprobarlos.
- **Pendiente de evidencia:** el test debe declarar su evidencia en [`docs/evidencia-permanencia.md`](../evidencia-permanencia.md) si se considera componente de acompañamiento (AGENTS.md, 2.4), o en un documento propio si no lo es. Decidirlo antes de construir.
- **Pendiente de datos:** un script de carga de los perfiles de O*NET va en `datos/` y su versión queda en `docs/fuentes.md`. No se escribe en el código.
- Si el líder decide usar el Interest Profiler, este ADR se reemplaza por uno nuevo con la respuesta escrita de O*NET adjunta.
