# 0026 — Cupos ofrecidos frente a demanda estimada

Fecha: 2026-11-10 · Estado: aceptada por el líder el 2026-11-10 · ajustada el 2026-11-11 · Relacionado: [ADR 0018](archivo/0018-producto-de-planificacion-de-oferta.md), [ADR 0025](0025-celdas-suprimidas-visibles-sin-cifra.md), [ADR 0009](0009-fuente-de-oferta-academica.md)

> **Nota del 2026-11-13.** Sigue vigente para el tablero de transparencia, que pasa a ser la vitrina de la agencia ([ADR 0032](0032-agencia-independiente-y-publico-egresado.md)) y sigue fuera del alcance del 19 de diciembre. No confundir con la comparación «vacantes frente a postulaciones» de la vista de carrera: esa usa cifras observadas (vacantes del SIES y postulaciones de las bases abiertas del DEMRE), no una estimación.

> **Nota del 2026-11-11.** La brecha entre cupos y demanda estimada sigue siendo válida como contenido del tablero público gratuito, que se rediseña como portal de transparencia ([ADR 0031](0031-producto-y-organizacion.md)), por diseñar y fuera del alcance del 19 de diciembre de 2026. Se rotula siempre como estimación de planificación, con sus supuestos y límites. La condición 7 (no venderla como servicio pagado) se mantiene: el uso comercial para instituciones de educación superior está fuera del alcance actual.

## Contexto

El tablero del pronóstico 2027-2028 entrega la demanda estimada (entrantes) por carrera, sede y jornada, con su intervalo de 95 %. Un rector preguntó qué le aportaría el producto: saber si sus cupos ofrecidos cubren la demanda estimada, por institución, carrera y sede.

La oferta oficial 2027 de DEMRE publica las vacantes por carrera y sede (`2027-26-09-24-oferta-definitiva-carreras-p2027.pdf`). Ese PDF requiere revisión manual para extraer las vacantes (ver `datos/registro_descargas.md`).

Hay que decidir cómo se compara un cupo con una estimación, y qué se muestra cuando falta un dato.

## Opciones evaluadas

**A. Mostrar cupos y demanda en columnas separadas, sin brecha.** El lector compara a ojo.
- Pros: no calcula nada nuevo; el riesgo de malinterpretar es menor.
- Contras: no responde la pregunta directa («¿me faltan cupos?»).

**B. Mostrar la brecha (demanda estimada menos cupos) con su rango, solo cuando ambas cifras existen y cumplen el umbral de 10 estudiantes.** Si falta un dato, la brecha queda sin cifra con su motivo.
- Pros: responde la pregunta directa; sigue la regla de supresión del ADR 0025.
- Contras: la brecha hereda el error de la estimación (mediana 11,9 %) y puede leerse como predicción de admisión.

**C. Mostrar solo la brecha, sin los cupos ni la demanda por separado.**
- Pros: pantalla más simple.
- Contras: una brecha sin sus componentes no se puede verificar. Viola la trazabilidad (AGENTS.md, 2.1).

## Decisión propuesta

Opción **B**, con estas condiciones:

1. La brecha es una **estimación de planificación**, no una predicción de admisión ni de matrícula final. Todo texto que la muestre lo dice.
2. La brecha siempre va junto a sus dos componentes (demanda estimada con intervalo, y cupos ofrecidos con su fuente).
3. Si falta la demanda o los cupos, la brecha queda **sin cifra** con su motivo. Nunca se completa con 0.
4. Se aplica el umbral de ADR 0025: ninguna cifra de demanda, cupo o brecha bajo 10 estudiantes se muestra.
5. Los cupos se extraen del PDF oficial con control de suma por institución. Un cupo no informado queda vacío con su motivo, nunca como 0.
6. El orden de las instituciones en la vista usa solo criterios explícitos (por ejemplo, tamaño de la brecha). Nunca la condición de cliente (AGENTS.md, sección 1, neutralidad).
7. La función no se vende como servicio pagado hasta completar la revisión legal del ADR 0018.

## Justificación

- La brecha responde la pregunta de planificación sin ocultar sus componentes, lo que permite verificarla.
- Cumple el límite de supresión de ADR 0025 y no agrega cruces por variables protegidas (ADR 0018, límite 2).
- La opción A no responde la pregunta principal; la opción C impide verificar el resultado.

## Consecuencias

- Se necesita una extracción nueva de cupos desde el PDF oficial 2027, con su propio control de suma.
- El tablero debe explicar qué es la brecha y qué no es, en el manual y en la vista.
- El error de la estimación se propaga a la brecha: el rango debe mostrarse junto a la cifra central.
- Hasta la revisión legal, la función queda solo en el tablero público gratuito, sin uso comercial.
