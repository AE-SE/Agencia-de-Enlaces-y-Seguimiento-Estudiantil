# 0035 — Descripción de carreras en lenguaje claro, por grupo de carrera

Fecha: 2026-11-14 · Estado: propuesta

## Contexto

Los nombres oficiales de las carreras no bastan para decidir. En la oferta chilena conviven títulos muy parecidos. Entregan grados, títulos y perfiles distintos: «Ingeniería Informática», «Ingeniería Civil en Informática» e «Ingeniería de Ejecución en Informática», además de sus menciones. Una persona que egresa de 4.º medio y no conoce esas diferencias puede elegir una carrera por el nombre, sin saber qué estudia ni qué título obtiene.

La oferta cubierta por el proyecto tiene del orden de 11 mil carreras y programas (cifra por verificar contra la base de oferta cargada). Escribir y revisar una descripción para cada uno no es viable antes del lanzamiento, y una descripción generada sin revisión infringiría AGENTS.md 2.1 y 7.3.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| **Descripción por grupo de carrera (nombre normalizado, sin menciones ni sedes), revisada por profesionales, mostrada en todas las carreras del grupo, más un bloque «títulos parecidos» que explica las diferencias** | Pocos textos (cientos, no miles) que se pueden revisar bien; el bloque comparativo responde la confusión real; se mantiene con el mismo flujo de revisión que el contenido psicoeducativo | Un grupo puede agrupar programas con planes distintos; hay que mantener la tabla de agrupación |
| Descripción por cada una de las ~11 mil carreras | Máxima precisión por programa | Inviable de revisar; alto riesgo de textos inventados o desactualizados; mantenimiento permanente |
| Descripción generada por inteligencia artificial (IA) a partir del plan de estudios, sin revisión humana | Rápido y barato | Viola AGENTS.md 2.1 (todo dato verificado en fuente) y 2.4 (contenido revisado por profesional); el texto aparenta ser oficial |
| No describir; mostrar solo el nombre y los datos oficiales | Cero riesgo de redacción | Deja sin resolver la causa del problema: la persona no sabe qué es la carrera |

## Decisión

1. **Unidad de descripción: el grupo de carrera.** Se define una tabla de agrupación. Asigna cada carrera oficial a un grupo y normaliza el nombre (sin menciones, sin sede, sin jornada). La tabla es versionada en `datos/` y cada asignación se revisa con el equipo. Una carrera sin grupo asignado no muestra descripción, nunca una inventada.

2. **Contenido de cada descripción.** Breve, en lenguaje claro (`lenguaje-claro`):
   - Qué estudia la persona y qué suele hacer al egresar, en dos o tres frases. Describe actividades típicas de la profesión y no promete resultados. Si el texto menciona empleo, solo puede hacerlo con el indicador oficial de empleabilidad, con qué mide y su año (AGENTS.md 2.1), nunca como afirmación del texto.
   - **Qué la distingue de los títulos parecidos**, con un bloque propio «Títulos parecidos» que compara con los grupos de nombre similar.
   - Grado y título que entrega y duración formal: son datos oficiales, no del texto. Se muestran con fuente, URL y fecha de actualización (AGENTS.md 2.1), nunca copiados dentro del texto.

3. **Rotulado.**
   - Si el texto se basa en una fuente oficial que describe la carrera, se cita esa fuente con URL y fecha.
   - Si lo redacta el equipo, se rotula «elaboración propia» e indica en qué se basó (por ejemplo, el plan de estudios publicado por la institución, citado).
   - Un plan de estudios se usa como base solo si su fuente permite reutilizarlo. Varias fuentes oficiales no publican licencia de reutilización (ADR 0014); esa licencia se confirma por escrito antes de publicar el texto. Mientras no esté confirmada, el texto no se publica.
   - Ningún texto redactado se presenta como dato de un organismo.

4. **Revisión antes de publicar.** Cada texto lo revisa un profesional del área del grupo y una persona del equipo que verifique el lenguaje claro y el rotulado. Se registra quién revisó y cuándo. La IA puede redactar borradores a partir de fuentes oficiales citadas, pero no publica nada sin esa revisión.

5. **Neutralidad.** La descripción nunca menciona instituciones ni las ordena, y su texto no puede favorecer a una institución cliente (AGENTS.md sección 1).

6. **Vigencia.** Cada texto lleva fecha de última revisión. Si cambia el plan de estudios de la fuente, el texto se revisa antes de seguir mostrándose.

## Justificación

- Resuelve la confusión donde ocurre: al comparar el nombre con sus parecidos. Un texto por carrera individual no lo hace mejor, solo más caro de sostener.
- Mantiene la trazabilidad exigida: todo dato oficial se muestra con su fuente, y todo texto redactado se rotula.
- Cumple la regla de no publicar datos no verificables (AGENTS.md 2.1) y la de revisión profesional de contenido dirigido a estudiantes (AGENTS.md 2.4).
- Escala por grupos: el trabajo crece con la cantidad de nombres distintos, no con la cantidad de programas.

## Consecuencias

- Hay que construir y mantener la tabla de agrupación. Es trabajo de datos y se hace antes de publicar descripciones.
- Un grupo puede tener programas con planes distintos. Si la diferencia importa para elegir, se abre un grupo propio; no se resuelve con texto genérico.
- Hay que definir qué profesionales revisan cada área. Pendiente de decisión del líder.
- **Por verificar:** si mifuturo.cl u otra fuente oficial ya publica descripciones de carreras. Si las publica, se citan en lugar de redactar, y este ADR se ajusta.
- **Por verificar:** la cifra exacta de carreras y programas en la base de oferta, y cuántos nombres normalizados resultan.
- Las descripciones van en el esquema de datos versionado (ADR 0014), no en el código fuente.
