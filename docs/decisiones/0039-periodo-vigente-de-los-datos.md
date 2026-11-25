# 0039 — Período vigente de los datos oficiales

Fecha: 2026-11-25 · Estado: propuesta · Relacionado: [ADR 0014](0014-esquema-de-los-datos-oficiales.md), [ADR 0038](0038-cifras-sies-de-la-institucion-anterior.md), [AGENTS.md 2.1](../../AGENTS.md), [`docs/datos/carga-lotes.md`, sección 17](../datos/carga-lotes.md)

## Contexto

Las tablas de datos oficiales guardan un período por fila: `indicador`, `arancel_variante`, `vacante_admision`, `requisito_admision` y `tramo_ingreso_sies`. El período es texto libre que copia lo que dice la fuente («selección del 19 de enero de 2026, vía regular», «titulados 2021 a 2023; años de ingreso 2022 a 2024»). No se puede ordenar, y en el SIES un mismo dato trae períodos distintos según la carrera (Derecho mide al 2.º año).

El sitio no mira el período: la ficha, el comparador, el simulador, la meta y las alternativas toman la primera fila de cada dato (`lib/datos/oferta-remota.ts`). Las claves únicas incluyen el período, así que cargar una publicación nueva agrega filas en vez de reemplazarlas. Con dos períodos para una carrera, cada pantalla mostraría uno de los dos sin criterio.

Hoy hay un solo período por dato. El [PR 329](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/329) frena la carga: un lote se deshace si alguna carrera queda con dos períodos. Eso evita el error, pero tampoco deja cargar el año siguiente. Esta decisión define cómo se cargará.

Las próximas publicaciones son, por ejemplo, la oferta definitiva de la Admisión 2028 del DEMRE (vacantes y requisitos), la matrícula 2027 de Mineduc, la siguiente versión del buscador de empleabilidad del SIES y los datos abiertos de la Admisión 2027 del DEMRE, con los que se calcula el puntaje de corte. `TODO(fuente)`: falta confirmar en qué mes publica cada organismo, para saber cuál llega primero.

## Opciones evaluadas

- **A. Borrar el período anterior al cargar el nuevo.** La base guarda solo lo vigente; la historia queda en los archivos crudos registrados con su SHA-256. Pros: no cambia el esquema ni el sitio. Contras: se pierde en la base la historia de cada carrera (por ejemplo, el corte de varios años) y un borrado mal acotado deja carreras sin dato.
- **B. Columna `vigente_hasta` (fecha) en cada tabla con período, más un índice único parcial para que cada dato tenga a lo sumo una fila vigente (elegida).** Una fila con `vigente_hasta` nula es la vigente. Pros: la historia queda en la base. La regla «un solo período vigente» la impone la base y no depende de que alguien recuerde el freno. Es la misma forma que ya usa la tabla `beneficio` (`vigente_desde`, `vigente_hasta`) y cumple lo que pide AGENTS.md 2.1: datos con fecha de vigencia. Contras: una migración en cinco tablas, un filtro en cada consulta del sitio y un paso más en los lotes.
- **C. Columna `anio_referencia` (número), y el sitio muestra el mayor.** Pros: ordena. Contras: hay que interpretar el período para sacar un año, y en el SIES no hay uno solo (años de titulación y años de ingreso). Elegir «el mayor» por carrera con la API de Supabase exige una vista nueva por tabla.
- **D. Tabla aparte con el período vigente de cada conjunto de datos.** Pros: cambiar de período es una sola fila. Contras: el SIES tiene varios períodos vigentes por dato (Derecho), así que la tabla deja de ser una fila por conjunto. Además, filtrar con ella obliga a unir tablas en cada consulta.

## Decisión

Opción B.

1. **Migración**: `vigente_hasta date` (nula por defecto) en `indicador`, `arancel_variante`, `vacante_admision`, `requisito_admision` y `tramo_ingreso_sies`, y un índice único parcial `where vigente_hasta is null` sobre la clave de cada dato. Las claves son las de `CLAVES_DE_PERIODO` en `datos/generar_lotes.py`, por ejemplo `(programa_generico_id, programa_id, variante_id, tipo)` en `indicador`, con `nulls not distinct`. Las filas de hoy quedan vigentes.
2. **Carga de una publicación nueva**: en la misma transacción del lote, primero se cierran las filas vigentes de ese dato cuyo período no viene en el lote, con `vigente_hasta` igual a la fecha de consulta del lote. Después se insertan las nuevas. Una publicación nueva reemplaza a la anterior completa. Una carrera que ya no aparece queda sin dato vigente y la ficha la muestra como sin dato, en vez de mostrar el dato de un año viejo. Recargar el mismo período no cierra nada. Si un lote mezcla períodos y deja dos filas vigentes para una carrera, el índice lo rechaza y el lote se deshace.
3. **Sitio**: toda consulta a esas tablas filtra `vigente_hasta=is.null`. Son las consultas de `cargar` y `candidatasAlternativas` en `lib/datos/oferta-remota.ts`, el embebido `indicador!inner` de las alternativas (`indicador.vigente_hasta=is.null`) y `scripts/exportar-oferta.ts`.
4. **El freno del PR 329 se reemplaza por el índice**: deja de hacer falta, porque la regla queda en la base.

## Justificación

El problema no es guardar dos años, sino que el sitio no sepa cuál mostrar. B lo resuelve con una regla que la base cumple sola (un vigente por dato) y con un filtro simple en el sitio, sin interpretar el texto del período. Conserva la historia, que AGENTS.md 2.1 exige poder rastrear («fuente, URL y fecha») y que servirá si algún día se muestra cómo cambió un dato. La tabla `beneficio` ya resolvió lo mismo con `vigente_hasta`; usar el mismo nombre evita una segunda convención.

## Consecuencias

- **Orden de publicación**: la migración va primero. El código que filtra por `vigente_hasta` falla si la columna no existe (como en el ADR 0038).
- **Lotes**: cada generador agrega, antes de sus inserts, el `update … set vigente_hasta = <fecha> where vigente_hasta is null and periodo not in (<períodos del lote>)`, acotado al dato del lote (tabla y, en `indicador`, tipo). Se quita el freno del PR 329. Hay que probarlo en una base de prueba con dos períodos antes de usarlo en producción.
- **Texto de interfaz**: «Puntaje de corte del año anterior» (`app/_componentes/meta/Alternativas.tsx`) sigue siendo cierto solo si el período vigente es el del año anterior. Al cargar un corte nuevo, revisar ese texto con la skill `lenguaje-claro`.
- **ADR 0038**: cuando el SIES publique las cifras de IP INACAP bajo su propio código, la fila con nota se cierra con `vigente_hasta` si cambia el período. Si el período es el mismo, sigue haciendo falta el borrado que describe ese ADR.
- **Archivos derivados**: `datos/procesados/comparaciones_empleabilidad.json` y los demás que se generan desde `carga.csv` no leen la base. Al cambiar de período se regeneran con la carga nueva, como hoy.
- **Cuándo**: después del 19 de diciembre de 2026 y antes de cargar la primera publicación nueva. Mientras tanto, el freno del PR 329 impide cargarla por error.
