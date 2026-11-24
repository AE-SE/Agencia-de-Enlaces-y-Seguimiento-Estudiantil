# Calendario de admisión universitaria

`plazos_2027.json` sigue la estructura de `datos/beneficios/plazos_2027.json`. Reúne los hitos de la Prueba de Acceso a la Educación Superior (PAES) de Invierno y Regular de 2026 que corresponden a la Admisión 2027, además de la postulación centralizada, la selección, la matrícula y el retracto universitario.

- `inicio` y `termino` son las fechas de vigencia del hito, inclusive, en formato `AAAA-MM-DD`. Para un hito de un día ambas fechas coinciden.
- Cada hito registra su propia fuente, URL y fecha de consulta. El período del catálogo identifica el proceso completo.
- El [calendario del DEMRE](https://demre.cl/calendario/calendario-proceso-2027) respalda los hitos de la PAES, la postulación, la selección y la matrícula.
- El plazo del retracto es **elaboración propia**. Los resultados de selección se publican el 18 de enero, según el DEMRE. El día 1 del plazo es el 19 y el día 10 es el 28 de enero, al aplicar el [artículo 3 ter de la Ley 19.496](https://www.bcn.cl/leychile/navegar?idNorma=61438&idParte=8542451). Ambas fuentes se consultaron el 22 de noviembre de 2026.
- Si una fecha pendiente se incorpora al catálogo, se guarda como `null` con estado `fecha_pendiente` y un motivo basado en la fuente.
- El cierre de la inscripción a la PAES Regular se actualizó al 27 de julio conforme a la [prórroga publicada por Acceso Mineduc](https://acceso.mineduc.cl/blog/2026/07/22/por-contingencia-climatica-se-extiende-la-inscripcion-a-la-paes-regular-2026/). La resolución original informaba el 22 de julio.
- Los llamados de lista de espera se consultan en cada universidad durante el segundo período de matrícula. El calendario registra el período común.
