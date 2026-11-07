# Diccionario de datos oficiales

Actualizado: 2026-11-06.

Este documento mapea los campos públicos del esquema vigente después de las migraciones `20261103000000_esquema_base.sql` y `20261104000000_variantes_de_programa.sql`. No cubre tablas de personas, beneficios ni plazos.

## Fuentes y archivos intermedios

| Nombre corto | Archivo oficial | Salida del cargador | Cobertura |
|---|---|---|---|
| Mineduc | `Matricula-Ed-Superior-2026.rar` | `datos/procesados/oferta.csv` | Instituciones, programas, variantes, arancel, matrícula y acreditación institucional |
| SIES | `Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx` | `datos/procesados/empleabilidad.csv` | Empleabilidad, ingreso, retención, duración real y área por carrera genérica e institución |
| DEMRE | `2027-26-09-24-oferta-definitiva-carreras-p2027.pdf` | `datos/procesados/demre.csv` | Ponderaciones, requisitos y vacantes de la Admisión 2027 |

Las URL, fechas de descarga, períodos y condiciones de uso están en [`datos/registro_descargas.md`](../../datos/registro_descargas.md) y [`docs/fuentes.md`](../fuentes.md).

Los campos `id` y las referencias terminadas en `_id` son llaves internas. No reemplazan los códigos oficiales.

## `fuente`

| Nuestro campo | Fuente | Columna original | Tipo | Unidad | Transformación | Ejemplo |
|---|---|---|---|---|---|---|
| `id` | Sistema | No aplica | UUID | No aplica | Generado por PostgreSQL | UUID generado |
| `organismo` | Catálogo `docs/fuentes.md` | Nombre del organismo | Texto | No aplica | Se usa el nombre oficial del organismo | `Ministerio de Educación` |
| `nombre` | Archivo o página oficial | Título del conjunto | Texto | No aplica | Se conserva el título publicado | `Matrícula en educación superior 2026` |
| `url` | Registro de descargas | `url_archivo` | URL | No aplica | URL exacta del archivo; si es temporal, página estable y nombre exacto | URL de Datos Abiertos Mineduc |
| `terminos_de_uso` | `docs/fuentes.md` | Resumen verificado | Texto o nulo | No aplica | Copia del resumen vigente; no se deduce una licencia ausente | `Sin licencia explícita; citar la fuente` |
| `terminos_revisados_el` | `docs/fuentes.md` | Fecha de revisión | Fecha | No aplica | ISO 8601, `AAAA-MM-DD` | `2026-11-03` |
| `creada_el` | Sistema | No aplica | Fecha y hora | No aplica | Generada por PostgreSQL | Fecha y hora de carga |

## `institucion`

| Nuestro campo | Fuente | Columna original | Tipo | Unidad | Transformación | Ejemplo |
|---|---|---|---|---|---|---|
| `id` | Sistema | No aplica | UUID | No aplica | Generado por PostgreSQL | UUID generado |
| `codigo_oficial` | Mineduc | `cod_inst` → `institucion_codigo` | Texto | Código | Se conserva como texto para no perder ceros a la izquierda | `100` |
| `nombre` | Mineduc | `nomb_inst` → `institucion_nombre` | Texto | No aplica | Se recortan extremos y espacios repetidos; no se cambia el significado | `IP INACAP` |
| `tipo` | Mineduc | `tipo_inst_1` → `institucion_tipo` | Enum | No aplica | `Universidades`, `Institutos Profesionales` y `Centros de Formación Técnica` se normalizan a los tres valores del esquema | `instituto_profesional` |
| `anios_acreditacion` | Mineduc | `acre_inst_anio` → `acreditacion_anios` | Entero pequeño o nulo | Años | Se acepta de 0 a 7; vacío queda nulo con motivo en la salida intermedia | `6` |
| `acreditada_hasta` | Mineduc | `acre_inst_desde_hasta` → `acreditacion_hasta` | Fecha o nulo | No aplica | Se separa el intervalo y se convierte de `DD/MM/AAAA` a ISO 8601 | `2027-11-20` |
| `fuente_acreditacion_id` | Mineduc | Fuente de `acre_inst_anio` y `acre_inst_desde_hasta` | UUID o nulo | No aplica | Referencia a la fila de `fuente` de Matrícula 2026 | UUID de Mineduc |
| `actualizada_el` | Mineduc | `fecha_descarga` | Fecha y hora | No aplica | Fecha de la carga basada en el archivo descargado | `2026-11-04` |

Limitación: el esquema no tiene un `fuente_id` para el nombre, código y tipo de la institución. `fuente_acreditacion_id` solo respalda la acreditación.

## `programa`

Después del ADR 0011, un programa representa una carrera en una institución. La sede y la jornada viven en `programa_variante`.

| Nuestro campo | Fuente | Columna original | Tipo | Unidad | Transformación | Ejemplo |
|---|---|---|---|---|---|---|
| `id` | Sistema | No aplica | UUID | No aplica | Generado por PostgreSQL | UUID generado |
| `institucion_id` | Mineduc | `institucion_codigo` | UUID | No aplica | Cruce con `institucion.codigo_oficial` | UUID de `IP INACAP` |
| `nombre` | Mineduc | `nomb_carrera` → `carrera_nombre_oficial` | Texto | No aplica | Se agrupan bajo un programa las filas con la misma institución y el mismo nombre oficial; no se usa el nombre para cruzar entre instituciones | `INGENIERIA EN CONSTRUCCION` |
| `area` | SIES | `area` | Texto o nulo | No aplica | Cruce por institución y `carrera_generica`; queda nulo si no hay cruce inequívoco | `Tecnología` |
| `fuente_id` | Mineduc | `fuente` | UUID | No aplica | Referencia a Matrícula 2026, fuente base del programa | UUID de Mineduc |
| `actualizada_el` | Mineduc | `fecha_descarga` | Fecha y hora | No aplica | Fecha de la carga basada en el archivo descargado | `2026-11-04` |

Limitación: `area` puede venir del SIES, pero `programa` admite un solo `fuente_id`. Hasta que el líder defina trazabilidad por campo, `area` debe quedar nula cuando se perdería el origen SIES.

## `programa_variante`

Cada código SIES identifica una variante de institución, sede, carrera, jornada y versión. El código completo se mantiene como texto.

El diccionario oficial `ER_Matricula_Educacion_Superior_2007_2026_PUBL_MRUN.pdf`, incluido en el RAR de Matrícula 2026, define `CODIGO_UNICO` como el código que considera institución, sede, carrera, jornada y versión. Esa definición respalda que el código viva en `programa_variante` y no en `programa`.

| Nuestro campo | Fuente | Columna original | Tipo | Unidad | Transformación | Ejemplo |
|---|---|---|---|---|---|---|
| `id` | Sistema | No aplica | UUID | No aplica | Generado por PostgreSQL | UUID generado |
| `programa_id` | Mineduc | `institucion_codigo` + `carrera_nombre_oficial` | UUID | No aplica | Cruce con la pareja usada para crear `programa` | UUID del programa |
| `codigo_sies` | Mineduc | `codigo_unico` → `codigo_sies` | Texto | Código | Debe cumplir `I…S…C…J…V…`; no se convierte a número | `I100S10C111J4V1` |
| `sede` | Mineduc | `nomb_sede` → `sede` | Texto o nulo | No aplica | Se recortan extremos y espacios repetidos | `SEDE PUNTA ARENAS` |
| `comuna` | Mineduc | `comuna_sede` → `comuna` | Texto o nulo | No aplica | Se conserva el nombre oficial normalizado | `PUNTA ARENAS` |
| `region` | Mineduc | `region_sede` → `region` | Texto o nulo | No aplica | Se conserva el nombre oficial normalizado | `Magallanes` |
| `jornada` | Mineduc | `jornada` | Texto o nulo | No aplica | Se conserva la categoría oficial | `A Distancia` |
| `direccion` | Sin fuente disponible | No existe en Matrícula 2026 | Texto o nulo | No aplica | Queda nulo; no se infiere desde el nombre de la sede | `null` |
| `duracion_semestres` | Mineduc | `dur_estudio_carr` → `duracion_formal_semestres` | Entero pequeño | Semestres | Debe estar entre 1 y 24; la fuente excluye el proceso de titulación | `8` |
| `fuente_id` | Mineduc | `fuente` | UUID | No aplica | Referencia a Matrícula 2026 | UUID de Mineduc |
| `actualizada_el` | Mineduc | `fecha_descarga` | Fecha y hora | No aplica | Fecha de la carga basada en el archivo descargado | `2026-11-04` |

`modalidad`, `vigencia`, `carrera_codigo`, `codigo_demre`, el valor de matrícula de inscripción y los datos originales de conversión de UF existen en `oferta.csv`, pero el esquema todavía no tiene campos para conservarlos.

## `indicador`

Un indicador corresponde al programa completo cuando el SIES publica por institución y carrera genérica. Corresponde a una variante cuando Mineduc o DEMRE distinguen el código SIES.

| Nuestro campo | Fuente | Columna original | Tipo | Unidad | Transformación | Ejemplo |
|---|---|---|---|---|---|---|
| `id` | Sistema | No aplica | UUID | No aplica | Generado por PostgreSQL | UUID generado |
| `programa_id` | Mineduc + cruce | Institución y carrera | UUID | No aplica | Referencia al programa al que pertenece el dato | UUID del programa |
| `variante_id` | Cruce por código | `codigo_sies` o `codigo_demre` | UUID o nulo | No aplica | Variante para arancel, matrícula y datos DEMRE; nulo para indicadores SIES de programa completo | UUID o `null` |
| `tipo` | Regla de carga | Columna de origen | Enum | No aplica | Se asigna según la correspondencia de indicadores de abajo | `empleabilidad_1er_anio` |
| `valor` | Fuente del indicador | Columna indicada abajo | Número o nulo | Según `unidad` | Se valida el rango; ausencia queda nula con motivo, nunca cero | `87.50` |
| `unidad` | Regla de carga | No aplica | Enum | No aplica | Constante según el tipo: porcentaje, pesos, puntos, semestres o cupos | `porcentaje` |
| `periodo` | SIES, Mineduc o DEMRE | `periodo_*` o `periodo` | Texto | No aplica | Se conserva la cohorte, año de medición y moneda cuando corresponda | `estudiantes de primer año 2024 que siguen matriculados en 2025` |
| `fuente_id` | Fuente del indicador | `fuente` | UUID | No aplica | Referencia a la fuente que publicó el valor | UUID de SIES |
| `url` | Fuente del indicador | `url_archivo` | URL | No aplica | URL exacta del archivo oficial | URL del XLSX del SIES |
| `fecha_consulta` | Registro de descarga | `fecha_descarga` | Fecha | No aplica | Fecha en que se descargó y consultó el archivo | `2026-11-03` |
| `motivo_sin_dato` | Cargador | `motivo_*` | Texto o nulo | No aplica | Obligatorio cuando `valor` es nulo; vacío cuando existe valor | `Muestra insuficiente según SIES` |

### Correspondencia de indicadores

| `tipo` | Nivel | Fuente y columna | `unidad` | Período | Regla |
|---|---|---|---|---|---|
| `empleabilidad_1er_anio` | Programa | SIES `empleabilidad_1er_anio_pct` | `porcentaje` | `periodo_empleabilidad_1er_anio` | Por institución y carrera genérica; Derecho usa el período desplazado declarado por el SIES |
| `empleabilidad_2do_anio` | Programa | SIES `empleabilidad_2do_anio_pct` | `porcentaje` | `periodo_empleabilidad_2do_anio` | Nulo con `motivo_empleabilidad_2do_anio` cuando no se publica |
| `retencion_1er_anio` | Programa | SIES `retencion_1er_anio_pct` | `porcentaje` | `periodo_retencion` | Nulo con `motivo_retencion` cuando no cumple el mínimo de casos |
| `duracion_real_semestres` | Programa | SIES `duracion_real_semestres` | `semestres` | `periodo_duracion_real` | No se confunde con la duración formal de Mineduc |
| `arancel_anual` | Variante | Mineduc `arancel_anual_pesos` | `pesos` | `periodo` | Pesos se conservan; UF se multiplica por la UF oficial del 2026-11-05 y se redondea al peso con `ROUND_HALF_UP` |
| `matricula` | Variante | Mineduc `matricula_total` | Sin unidad compatible | `periodo` | **Sin carga segura:** el enum no tiene una unidad para cantidad de estudiantes; `cupos` significaría otra cosa |
| `vacantes` | Variante | DEMRE `vacantes_regular` y otros cupos | `cupos` | `periodo` | **Pendiente de decisión:** el esquema no distingue primer y segundo semestre ni cupos regulares, MC, BEA y PACE; no se suman por cuenta propia |
| `puntaje_corte` | Variante | Sin fuente oficial equivalente | `puntos` | No aplica | No se carga: la estadística disponible es el promedio de pruebas obligatorias del último seleccionado, que mide otra cosa |
| `ingreso_promedio_4to_anio` | Programa | SIES `ingreso_4to_anio_desde_pesos` y `ingreso_4to_anio_hasta_pesos` | `pesos` | `periodo_ingreso` | **Sin carga segura:** el SIES publica un tramo, pero el esquema admite un solo número; no se calcula un promedio ni un punto medio |

La continuidad de estudios del SIES no tiene un valor en `tipo_indicador`, por lo que se conserva solo en la salida intermedia hasta que exista una decisión de esquema.

## Transformaciones comunes

1. Los códigos se leen como texto. Nunca se abren y guardan con Excel ni se convierten a número.
2. Los textos pierden espacios repetidos, pero no se traducen ni se corrigen por semejanza.
3. Las fechas se convierten a `AAAA-MM-DD`.
4. Los porcentajes deben estar entre 0 y 100. Montos, semestres y cupos no pueden ser negativos.
5. Un dato ausente queda nulo con un motivo. No se convierte en cero.
6. Los aranceles informados en UF se convierten con el valor oficial del Servicio de Impuestos Internos y conservan en la salida intermedia el valor, unidad y fecha originales.
7. El cruce SIES usa institución y carrera genérica porque ese es el nivel publicado por su metodología. No atribuye la cifra a una sede.
8. El cruce DEMRE usa `codigo_demre`. Una fila que no valida o no cruza se revisa; no se empareja por parecido de nombres.

## Colisiones de nombre verificadas

La salida de Matrícula 2026 contiene **40 grupos** donde una institución usa el mismo nombre oficial para más de un `carrera_codigo`. También contiene **808 grupos** con más de un `codigo_sies` para la misma institución, nombre, sede y jornada. El último componente `V…` distingue versiones del plan, pero la fuente no entrega una etiqueta clara para mostrarlas al estudiante.

Ejemplos:

| Institución | Nombre oficial | Códigos distintos observados | Qué cambia |
|---|---|---|---|
| IP Santo Tomás | Administración Pública | `228`, `288` | Los códigos aparecen en sedes o modalidades distintas |
| IP Diego Portales | Contador Auditor | `7`, `101` | Semipresencial y a distancia |
| Universidad Gabriela Mistral | Ingeniería en Computación e Informática | `I1S1C250J4V2`, `I1S1C250J4V4` | Misma sede y jornada; cambia la versión `V` |
| Universidad Mayor | Administración Pública | `I10S7C380J4V2`, `I10S7C380J4V3`, `I10S7C380J4V5` | Misma sede y jornada; versiones y vigencias distintas |

No se deduplican estas filas. El esquema conserva cada `codigo_sies` como `programa_variante`, pero todavía falta una decisión del líder sobre cómo distinguir versiones con igual sede y jornada en la interfaz.

## Brechas que requieren decisión

- Agregar trazabilidad de fuente para los datos base de `institucion` y para campos de `programa` que vengan de otra fuente.
- Decidir cómo representar versiones de plan con igual institución, nombre, sede y jornada.
- Decidir si se guardan modalidad, vigencia, código DEMRE y matrícula de inscripción.
- Definir una unidad para matrícula total sin llamarla `cupos`.
- Modelar los tramos de ingreso del SIES sin inventar un promedio.
- Modelar ponderaciones, requisitos mínimos y los distintos tipos de vacantes del DEMRE.
- Mantener `puntaje_corte` sin datos hasta encontrar una fuente oficial que publique esa definición exacta.
