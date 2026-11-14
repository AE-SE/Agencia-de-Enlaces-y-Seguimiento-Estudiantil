# 0034 — Test vocacional y cruce con carreras chilenas
Fecha: 2026-11-13 · Actualizada: 2026-11-14 · Estado: propuesta (pendiente de revisión del líder) · Relacionado: [ADR 0033](0033-cuenta-con-correo-sin-edad.md), [ADR 0011](0011-comparacion-de-programas.md), [ADR 0009](0009-fuente-de-oferta-academica.md), [ADR 0032](0032-agencia-independiente-y-publico-egresado.md)

## Contexto
El proyecto contempla un cuestionario de intereses vocacionales dentro de la cuenta de la persona que egresa, previsto para 2027 ([AGENTS.md](../../AGENTS.md), sección 1). Se quiere saber si puede existir antes y cómo se conecta con el catálogo de carreras.

La idea en estudio: el test entrega un perfil de intereses (modelo RIASEC de seis áreas); con ese perfil se buscan ocupaciones afines en O*NET (base del Departamento de Trabajo de Estados Unidos); las áreas de esas ocupaciones se traducen a términos cercanos a la persona; y de ahí se llega a carreras chilenas revisadas a mano en el catálogo oficial.

Dos límites, que ninguna opción puede cruzar:

- **El test no diagnostica ni predice.** Mide preferencias declaradas. Un perfil «social e investigador» no demuestra interés en salud ni asegura éxito en una carrera. Lo que sí puede decir es qué ocupaciones aparecen como cercanas. Cualquier texto que diga otra cosa queda fuera (AGENTS.md, 2.4).
- **Las cifras y el cruce son elaboración propia.** O*NET no publica correspondencias con carreras chilenas, y su cruce con programas es estadounidense. Todo vínculo con una carrera de Chile se rotula «elaboración propia» y dice cómo se hizo (AGENTS.md, 2.1).

### Lo que se verificó el 2026-11-13
Lectura de las páginas de licencia de O*NET (onetcenter.org). El resultado es parcial: no se leyeron todas las subpáginas enlazadas.

- **Base de datos O*NET (versión 31.0):** la página de licencia de la base (onetcenter.org/license_db.html) dice que su contenido está bajo la «Creative Commons Attribution 4.0 International License» (CC BY 4.0). La página no habla de uso comercial de forma explícita; el texto general de CC BY 4.0 sí lo permite, con atribución. Atribuir a «O*NET 31.0» y al U.S. Department of Labor, Employment and Training Administration; enlazar la licencia; indicar cambios.
- **Herramientas, incluido el Interest Profiler:** dos licencias alternativas.
  - *CC BY-ND 4.0*: se puede copiar y redistribuir **sin modificar**.
  - *O*NET Tools Developer License* (`license_toolsdev.html`): concesión mundial, libre de regalías y sin permiso previo. No prohíbe el uso comercial ni lo condiciona a permiso. Pero tiene **condiciones de validación** (sección 3(b)): si el material se usa para orientación o exploración vocacional, o se traduce o modifica, hay que hacer un estudio de validación antes de lanzar el producto y avisar en cada producto con un texto fijo.
- **Interest Profiler corto** (`IP.html`): gratuito, en PDF de papel y lápiz (60 preguntas), sin versión web. No hay versión en español indicada.
- **Mini-IP** (30 preguntas): versión web, con versión en español vía Mi Próximo Paso, con widget y API. No se usa aquí sin permiso escrito de O*NET.
- **Marca:** «O*NET» se usa como adjetivo («con datos de O*NET»), no como sustantivo ni verbo.

**Uso declarado (2026-11-14):** la base de datos no se altera. El paso de asociar sus ocupaciones con carreras chilenas es elaboración propia de la agencia: se guarda en archivos derivados propios (`datos/cruce_ocupaciones_areas.py` y sus salidas), con su lista de cambios documentada, que es lo que CC BY 4.0 pide indicar cuando se adapta el material. Los títulos en español son la traducción oficial de O\*NET. No se usa ninguna herramienta de O*NET (ni el Interest Profiler ni el Mini-IP), así que la condición de validación de la Developer License no se activa en la opción elegida.

**Conclusión de la verificación:** los datos de ocupaciones (base) se pueden usar con atribución según CC BY 4.0, sin modificarlos. Ningún test de O*NET se puede publicar sin cumplir la validación.

### Otros candidatos revisados (2026-11-13 y 2026-11-14)
- *TIPOV* (Universidad de Chile, *Psykhe* 2021): validado en 568 estudiantes de colegios públicos científico-humanistas de las regiones Metropolitana y O'Higgins. Mide 13 áreas, no RIASEC. Sin licencia verificada.
- *Marcadores AFPD* (Cupani et al., 2019): versión en español validada en 1107 universitarios argentinos. Sus ítems vienen de O*NET, así que caen bajo la Developer License.
- *Test del CNED (Elige Carrera)*: no se pudo leer el test ni sus términos de uso.
- *Tests comerciales* (IPP, CIPSA, Kuder, SDS, SAAV-R): validados en español, pero de pago.

Ninguno tiene una licencia de uso libre y comercial verificada.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| **A. Instrumento propio** (descartada por el líder el 2026-11-13: el test debe ser estandarizado) | Sin problema de licencia; control total del texto | Hay que validarlo; sin cifras de referencia propias |
| **B. Interest Profiler de O*NET o AFPD** | Validación publicada (en el caso del AFPD, en universitarios argentinos) | Exige estudio de validación y aviso antes de publicar (Developer License, 3(b)); no es válido para egresados chilenos sin estudio propio |
| **C. Sin test**: la persona elige áreas de interés de una lista, y se usan solo los perfiles ocupacionales de O*NET | Usa datos con licencia clara (CC BY 4.0); no requiere instrumento; se puede publicar ya | No hay perfil de intereses: la sugerencia depende de la elección de la persona, no de un puntaje |

## Decisión
Se elige la **opción C** (2026-11-14, a pedido del líder):

1. **Datos:** se usan los perfiles ocupacionales de O*NET (CC BY 4.0) sin alterar la base; el cruce con carreras chilenas es un archivo derivado propio, con su lista de cambios. El sitio declara su uso: atribución, versión (O*NET 31.0), enlace a la licencia y fecha de consulta. Cada cifra o correspondencia lleva fuente, URL y fecha de consulta.
2. **Explorador:** la persona elige áreas de interés de una lista, y el sitio le muestra ocupaciones relacionadas, con su fuente. No se presenta como test, ni como diagnóstico, ni como resultado validado.
3. **Test, más adelante:** ningún test se publica hasta tener una licencia de uso confirmada por escrito y el estudio de validación que la licencia exija. Ninguna sugerencia dice «tu carrera más afín es…» hasta que exista esa validación.
4. **Cruce con carreras:** cada ocupación se vincula con carreras del catálogo oficial por revisión manual, con criterio documentado y fecha. Se rotula «elaboración propia». Las áreas para agrupar carreras son las 11 «Área de conocimiento» que el buscador del SIES muestra (mifuturo.cl/buscador-de-carreras, leído el 2026-11-13). No se usa CINE-F hasta verificar que el SIES lo emplea. Ninguna sugerencia se ordena por la condición de cliente (ADR 0032).
5. **Resultados en el dispositivo:** la elección de áreas no se guarda en la cuenta. La lista cerrada del [ADR 0033](0033-cuenta-con-correo-sin-edad.md) no incluye intereses, y agregarlos exigiría un ADR nuevo. Tampoco se envían a ninguna API de IA.
6. **Lenguaje:** el resultado se presenta como exploración de opciones. Nunca como diagnóstico ni predicción de éxito. No se usan estilos de aprendizaje como base (AGENTS.md, 2.4).
7. **Fase:** el explorador entra al núcleo del 19 de diciembre de 2026 y se publica antes del congelamiento del 27 de noviembre (plan, N17 a N19; carga de datos a cargo del líder, cruce a cargo de Cristóbal, pantalla a cargo de Alejandro). El test y la cuenta, en 2027 o después.

## Justificación
- **Licencia:** la opción C solo usa datos con licencia clara (CC BY 4.0). Cualquier test requiere licencia confirmada y, en el caso de O*NET, un estudio de validación antes de publicar.
- **Trazabilidad (AGENTS.md, 2.1):** O*NET da perfiles ocupacionales versionados, con fuente y fecha.
- **Independencia (AGENTS.md, 1):** las sugerencias dependen de criterios explícitos (elección de la persona, cercanía, oferta verificada), no de quién paga.
- **Validación:** que las ocupaciones sugeridas coincidan con las carreras reales se comprueba con revisión manual antes de publicar.

## Consecuencias
- **Pendiente del líder:** aprobar esta decisión y el orden de publicación.
- **Pendiente de planificación:** el estudio de validación del cruce con egresados no está en el plan actual; se fija en `docs/plan.md` antes de la fase de 2027.
- **Pendiente de verificar:** la norma de la BCN (idNorma=1201168) no cargó, y la metodología del buscador del SIES (PDF) devolvió una página de mantenimiento. No se cita ninguna de las dos.
- **Pendiente de verificar:** CINE-F. La fuente oficial de UNESCO (ISCED-F 2013) no se encontró, y el SIES no lo menciona en las páginas leídas.
- **Pendiente de evidencia:** si el explorador o un test futuro se considera componente de acompañamiento, debe declarar su evidencia en [`docs/evidencia-permanencia.md`](../evidencia-permanencia.md) (AGENTS.md, 2.4).
- **Pendiente de datos:** un script de carga de los perfiles de O*NET va en `datos/` y su versión queda en `docs/fuentes.md`. No se escribe en el código.
- Si en el futuro se elige un test, este ADR se reemplaza por uno nuevo con la licencia confirmada por escrito adjunta.
