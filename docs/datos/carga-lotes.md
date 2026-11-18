# Carga por lotes de la oferta oficial (lote 1)

Guía paso a paso para generar, probar y cargar la oferta de Mineduc (matrícula 2026) en la base de datos. El lote 1 carga instituciones, carreras genéricas, títulos, variantes (sede y jornada) y aranceles.

**No incluye todavía:** indicadores del SIES (empleabilidad, ingreso, retención), vacantes, requisitos y ponderaciones del DEMRE, ni acreditación detallada (esa es el lote 4, sección 13). Son lotes posteriores (sección 9).

## 0. Resumen

| Paso | Qué hace | Dónde |
|---|---|---|
| 1 | Revisar el archivo de entrada | computador del líder |
| 2 | Generar los lotes SQL | computador del líder |
| 3 | Revisar el informe | computador del líder |
| 4 | Probar en una base de prueba | computador del líder |
| 5 | Comprobar la base de producción antes | editor SQL de Supabase (solo lectura) |
| 6 | Cargar los lotes en producción, en orden | computador del líder con `psql` (sección 6) |
| 7 | Comprobar los conteos después | editor SQL de Supabase (solo lectura) |

## 1. Archivo de entrada

Entrada: `datos/procesados/carga.csv`, producido por `datos/preparar_carga.py`. Cada fila es una variante (sede y jornada) de una carrera.

Comprobar que tiene 11.364 filas de datos:

```bash
python -c "import csv; print(len(list(csv.DictReader(open('datos/procesados/carga.csv', encoding='utf-8')))))"
```

## 2. Modelo de datos que usa el lote

Según las migraciones aplicadas (`20261104000000` y `20261105000000`) y ADR 0011 y 0014:

| Tabla | Qué es | Clave única |
|---|---|---|
| `institucion` | universidad, IP o CFT | `codigo_oficial` |
| `programa_generico` | carrera genérica SIES de una institución | (institución, nombre normalizado) |
| `programa` | título o carrera nombrada en una institución; conserva el nombre Mineduc y su estado de verificación | (institución, nombre normalizado) |
| `programa_variante` | sede y jornada, con su código SIES | `codigo_sies`, `codigo_demre` |
| `arancel_variante` | arancel anual de cada variante | (variante, periodo) |

El nombre normalizado quita tildes, pasa a minúsculas y colapsa espacios (`normalizar()` en el generador). Es la misma regla que usa la base. Si cambia, hay que regenerar los lotes.

La clave de programa **ya está resuelta por el esquema**: un programa es un título único por institución. No hace falta una clave inventada.

## 3. Generar los lotes

Desde la raíz del repositorio:

```bash
python datos/generar_lotes.py
```

Salida en `datos/procesados/lotes/` (fuera de git):

| Archivo | Tabla | Sentencias |
|---|---|---|
| `01_fuentes.sql` | `fuente` | 1 |
| `02_instituciones.sql` | `institucion` | 116 |
| `03_programas_genericos.sql` | `programa_generico` | 3.205 |
| `04_programas.sql` | `programa` | 3.974 |
| `05_variantes.sql` | `programa_variante` | 11.364 |
| `06_aranceles.sql` | `arancel_variante` | 11.364 |
| `12_acreditaciones.sql` | `acreditacion_institucion` | 116 (ver sección 13) |
| `informe.json` | resumen | — |

Si el generador termina con `ERROR:`, no escribió lotes completos. Corrige la causa y repite.

## 4. Revisar el informe

`datos/procesados/lotes/informe.json` debe mostrar:

- `filas_leidas`: 11364
- `instituciones`: 116
- `programas_genericos`: 3205
- `programas`: 3974
- `variantes`: 11364
- `aranceles_con_monto`: 11349 y `aranceles_sin_monto`: 15 (esas 15 quedan nulas con el motivo oficial)
- `nombres_que_se_unifican`: 0

Si una cifra no coincide, el archivo de entrada cambió. No sigas hasta entender por qué.

## 5. Prueba en una base de prueba

Esta prueba se hizo con **PGlite** (Postgres en WebAssembly, licencia Apache-2.0) sobre el mismo esquema de migraciones. Resultado del 9 de noviembre de 2026:

- Migraciones de datos oficiales: aplican sin error (21 tablas).
- Los seis lotes se cargan en orden sin error.
- Conteos: 116 instituciones, 3.205 genéricos, 3.974 programas, 11.364 variantes, 11.364 aranceles (15 sin monto).
- 16 regiones presentes.
- Sin filas huérfanas.
- 2.138 variantes con código DEMRE.
- 173 aranceles en UF con su valor de UF.

Limitación: PGlite no es el Postgres de Supabase; no tiene RLS ni roles reales. La carga en producción sí debe comprobarse con los conteos del paso 7.

Para repetir la prueba hace falta el shim de `auth` (esquema `auth`, tabla `auth.users`, funciones `auth.uid()` y `auth.role()`, roles `anon`, `authenticated` y `service_role`) y ejecutar las migraciones y los lotes en orden.

## 6. Carga en producción

El editor SQL de Supabase no admite archivos de 17 MB. La carga se hace con `psql` desde el computador del líder, con la cadena de conexión del proyecto (Supabase → Connect). **La cadena contiene la contraseña: no la pegues en chats ni en el repositorio.**

Orden (cada comando debe terminar sin error antes del siguiente):

```bash
psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/01_fuentes.sql
psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/02_instituciones.sql
psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/03_programas_genericos.sql
psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/04_programas.sql
psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/05_variantes.sql
psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/06_aranceles.sql
```

Donde `CADENA` es la variable de entorno con la cadena de conexión, que tú defines en tu terminal.

Antes del paso 1, comprobar que la base está vacía de datos de oferta (paso 5 de la guía, consulta de conteos en el editor SQL). Si algún conteo no es 0, parar y revisar.

### Con el script, sin `psql`

Si no tienes `psql`, `scripts/cargar-lotes.mjs` hace lo mismo para cualquier lote (1 a 10 y 12 a 15), con tres cuidados más: comprueba que la base ya tiene la oferta (0 variantes: se niega a cargar), carga cada archivo en **una transacción** (si falla, ese lote se deshace y la carga se detiene) y muestra los conteos de antes y después. La cadena de conexión va en una variable de entorno; el script nunca la imprime.

```bash
npm install --no-save pg
export SUPABASE_DB_URL="postgresql://..."        # PowerShell: $env:SUPABASE_DB_URL = "postgresql://..."
node scripts/cargar-lotes.mjs --simular 12 13 14 15   # comprueba conexión y archivos; no escribe nada
node scripts/cargar-lotes.mjs 12 13 14 15             # carga en ese orden
```

Los lotes 12 a 15 (acreditación, puntaje de corte, matrícula de inscripción y matrícula total) se generan con `datos/generar_lotes.py` (12, 14 y 15) y `datos/generar_lotes_corte.py` (13). Van después de los lotes 1 a 6 y son repetibles. Probado el 17-nov-2026 con la oferta real sobre un Postgres en memoria: carga correcta, un error en un lote lo revierte entero y repetir la carga no duplica filas.

## 7. Comprobar después

En el editor SQL de Supabase, solo lectura:

```sql
select
  (select count(*) from institucion) as instituciones,
  (select count(*) from programa_generico) as genericos,
  (select count(*) from programa) as programas,
  (select count(*) from programa_variante) as variantes,
  (select count(*) from arancel_variante) as aranceles,
  (select count(distinct region) from programa_variante) as regiones;
```

Resultado esperado: 116, 3205, 3974, 11364, 11364 y 16.

## 8. Deshacer la carga

Solo si el líder lo confirma. Orden inverso, en el editor SQL:

```sql
delete from programa_variante
 where fuente_id = (select id from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc');
delete from programa
 where fuente_id = (select id from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc');
delete from programa_generico
 where fuente_id = (select id from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc');
delete from institucion
 where id not in (select institucion_id from programa)
   and id not in (select institucion_id from programa_generico);
delete from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc';
```

Los aranceles se borran solos (`on delete cascade`).

## 9. Lo que no cubre el lote 1

- Indicadores del SIES: empleabilidad, ingreso al 4.º año, retención, duración real. Lote 2.
- Vacantes, requisitos y ponderaciones del DEMRE. Lote 3.
- Acreditación detallada (`acreditacion_institucion`). Lote 4.

## 10. Pruebas automáticas

`tests/datos/test_generar_lotes.py` cubre 13 casos con datos inventados: unificación de programas, tildes, aranceles en UF, aranceles sin monto, códigos repetidos, tipos inválidos, acreditación inconsistente, comillas simples, idempotencia de las sentencias y la interfaz de línea de comandos. Se corren con:

```bash
python -m unittest tests.datos.test_generar_lotes
```

## 11. Lote 2: indicadores e ingresos del SIES

Se carga después de los lotes 1 a 6, con el mismo procedimiento (secciones 3 a 7).

**Generar:**

```bash
python datos/generar_lotes_sies.py
```

Salida en `datos/procesados/lotes/`: `07_indicadores_sies.sql` (fuente y cinco indicadores por carrera genérica) y `08_ingresos_sies.sql` (tramo de ingreso al 4.º año), más `informe_sies.json`.

Resultado esperado del informe: 3.205 carreras genéricas, 1.590 con cruce SIES, 7.950 indicadores, 1.590 tramos y 1.615 sin cruce SIES (no se les asigna nada).

**Cargar** (en orden, después del lote 6):

```powershell
psql "$env:CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/07_indicadores_sies.sql
psql "$env:CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/08_ingresos_sies.sql
```

**Comprobar:**

```powershell
psql "$env:CADENA" -c "select tipo, count(*) from indicador group by tipo order by tipo;"
psql "$env:CADENA" -c "select count(*) from tramo_ingreso_sies;"
```

Esperado: 1.590 de cada tipo de indicador y 1.590 tramos.

**Reglas aplicadas:**
- Una carrera genérica con varias sedes debe tener los mismos datos SIES en todas sus filas; si no, el generador se detiene.
- La empleabilidad al 1.er año de carreras con excepción (Derecho y similares) queda nula con su motivo.
- El ingreso al 4.º año es un tramo de pesos, no un promedio: va a `tramo_ingreso_sies`.
- Un dato que la fuente no publica queda nulo con su motivo.

**Deshacer** (solo si el líder lo confirma):

```sql
delete from tramo_ingreso_sies where fuente_id = (select id from fuente where organismo = 'SIES, Mineduc' and nombre = 'Buscador de Empleabilidad e Ingresos (Mi Futuro)');
delete from indicador where fuente_id = (select id from fuente where organismo = 'SIES, Mineduc' and nombre = 'Buscador de Empleabilidad e Ingresos (Mi Futuro)');
```

## 12. Lote 3: vacantes y requisitos de admisión del DEMRE

Se carga después de los lotes 1 a 8.

**Generar:**

```bash
python datos/generar_lotes_demre.py
```

Salida: `09_vacantes_demre.sql` (fuente DEMRE y cinco vías de cupos por variante), `10_requisitos_demre.sql` (ponderaciones, puntaje mínimo y página del PDF), `11_nombres_demre.sql` (tildes y mayúsculas verificadas) e `informe_demre.json`.

Resultado esperado: 2.086 carreras con DEMRE, 10.430 registros de vacantes (4.683 sin cupos publicados, nulos con su motivo), 2.086 requisitos, 1.798 nombres corregidos y 2.176 pendientes. Todas las ponderaciones suman 100; si una no suma, el generador se detiene y la muestra.

**Cargar** (en orden, después del lote 8):

```powershell
psql "$env:CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/09_vacantes_demre.sql
psql "$env:CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/10_requisitos_demre.sql
psql "$env:CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/11_nombres_demre.sql
```

**Comprobar:**

```powershell
psql "$env:CADENA" -c "select (select count(*) from vacante_admision) as vacantes, (select count(*) from requisito_admision) as requisitos, (select count(*) from programa where nombre_verificado) as nombres_corregidos, (select count(*) from programa where not nombre_verificado) as nombres_pendientes;"
```

Esperado: 10.430, 2.086, 1.798 y 2.176.

**Reglas aplicadas:**
- Una vía sin cupos publicados queda nula con el motivo «DEMRE no publica cupos para esta vía en esta carrera».
- El enlace y la fecha son los del PDF de la oferta definitiva (Admisión 2027).
- El nombre original de Mineduc siempre queda en `programa.nombre_oficial`. `programa.nombre` cambia solo cuando DEMRE contiene las mismas palabras y respalda la ortografía; si no, queda original con `nombre_verificado = false`.

## 13. Lote 4: acreditación fechada (archivo `12_acreditaciones.sql`)

`generar_lotes.py` también escribe `12_acreditaciones.sql`, con una fila por institución en la tabla `acreditacion_institucion` (estado, años, inicio, término, fecha de la fuente y fuente). Antes solo se guardaban los años y la fecha final dentro de `institucion`, sin estado ni fuente, y no se distinguía una institución no acreditada de una sin información.

- **Se carga después del lote 2** (necesita `fuente` e `institucion`). No hace falta repetir los demás lotes: `psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/12_acreditaciones.sql`.
- **Con la carga real del 5-nov-2026 genera 116 filas:** 82 acreditadas, 19 no acreditadas y 15 «bajo tutela», sin filas descartadas. Los 15 «bajo tutela» son los centros de formación técnica estatales; la Ley 20.910 (artículo tercero) dice que cada uno es tutelado y acompañado por una universidad del Estado.
- **`situacion_al` es la fecha de descarga del archivo de Mineduc**, la única fecha que la fuente da de esa situación. La acreditación cambia: la ficha lo dice y enlaza la CNA.
- **Sin estado, o «acreditada» sin años, no se inventa nada:** no hay fila, se anota en `informe.json` (`acreditaciones_sin_dato`) y la ficha dice que Mineduc no informa la acreditación. Años en una institución no acreditada, o un término anterior al inicio, detienen el generador.
- **Repetible:** `on conflict (institucion_id, situacion_al) do nothing`. Una descarga nueva trae otra fecha y agrega otra fila; la aplicación usa la más reciente. Corregir una fila de la misma fecha exige borrarla antes.
- **Probado en Postgres (17-nov-2026):** las migraciones y los lotes 1 a 6, 12, 13 y 14 se aplicaron en orden sobre un Postgres en memoria (PGlite) sin errores: 116 acreditaciones. Sigue conviniendo repetir la prueba en la base de prueba de la sección 5 antes de producción.

## 14. Lote 13: puntaje de corte (archivo `13_puntajes_corte.sql`)

`datos/generar_lotes_corte.py` calcula el puntaje del último seleccionado de cada carrera y escribe una fila de `indicador` por variante (`tipo = puntaje_corte`, `unidad = puntos`). Va después de los lotes 1 a 11.

```bash
python datos/generar_lotes_corte.py [carga.csv] [ArchivoD.csv] [Estadisticas.csv] [carpeta_salida] [AAAA-MM-DD]
```

- **Entradas:** la carga de Mineduc (`datos/procesados/carga.csv`, para cruzar el código DEMRE con la variante) y, en `datos/crudos/demre/` (fuera de git), el «Archivo D» y las «Estadísticas de Selección» del proceso 2026, que se bajan del portal de datos abiertos del DEMRE. La fecha es la de descarga y va como fecha de consulta.
- **Reglas:** se publica el mínimo solo si el conteo de seleccionados del archivo es igual a `NUM_SELEC_REG` oficial y hay al menos 8; si no, queda nulo con su motivo. Una carrera sin variante en la carga, o que no está en las estadísticas, no recibe fila. El detalle y la validación están en `docs/datos/diccionario.md`.
- **Fuente nueva:** inserta (si no existe) la fuente «Datos abiertos DEMRE» y cita el portal. Hay que respetar sus condiciones de uso: citar «Datos abiertos DEMRE 2026», no identificar personas y no guardar ni subir los archivos individuales.
- **Informe:** `informe_corte.json` con solo conteos; nunca filas de personas.
- **Repetible:** `on conflict on constraint indicador_unico do nothing`. Un proceso nuevo trae otro `periodo` y agrega otra fila.
- **Probado en Postgres (17-nov-2026):** 2.138 filas, 1.591 con puntaje y el resto nulo con su motivo; `indicador_nivel_valido` se cumple. Repetir en la base de prueba (sección 5) antes de producción.
- **Pruebas:** `tests/datos/test_generar_lotes_corte.py` (17 casos con datos inventados).

## 15. Lote 14: matrícula de inscripción (archivo `14_matricula_inscripcion.sql`)

`generar_lotes.py` también escribe `14_matricula_inscripcion.sql`: una fila de `indicador` por variante (`tipo = matricula_inscripcion`, `unidad = pesos`, `periodo = año 2026`) con el valor de matrícula que informa Mineduc. El tipo ya existía en la base; faltaba el cargador.

- **Se carga después de los lotes 1 a 6** (necesita `fuente` y `programa_variante`): `psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/14_matricula_inscripcion.sql`. No hace falta repetir los demás.
- **Con la carga real del 5-nov-2026:** 10.914 variantes con monto y 450 sin él (Mineduc informa 0 o no informa); estas quedan nulas con ese motivo. Los montos van de $40.000 a $3.301.936.
- **Repetible:** `on conflict on constraint indicador_unico do nothing`.
- **La ficha** muestra «Costo de matrícula» junto a «Costo del arancel anual» y, con los dos, «Costo del primer año» (elaboración propia: su suma; `lib/datos/costo.ts`). Solo se calcula si Mineduc informa ambos montos.
- **Probado en Postgres (17-nov-2026):** 11.364 filas (10.914 con monto, de $40.000 a $3.301.936, y 450 nulas con motivo); una segunda carga no agrega filas. Repetir en la base de prueba (sección 5) antes de producción.
- **Definición confirmada el 17-nov-2026** en el diccionario oficial del RAR de Matrícula 2026 (`ER_Matricula_Educacion_Superior_2007_2026_PUBL_MRUN.pdf`, página 3): `VALOR_MATRICULA` es el «valor en pesos que el estudiante debe pagar para hacer efectiva su matrícula» y `VALOR_ARANCEL` es el «arancel anual de la carrera o programa». El diccionario no dice si la matrícula se repite cada año; sí dice que es lo que se paga para hacerla efectiva.

## 16. Lote 15: matrícula total (archivo `15_matricula_total.sql`)

`generar_lotes.py` también escribe `15_matricula_total.sql`: una fila de `indicador` por variante (`tipo = matricula`, `unidad = estudiantes`, `periodo = matrícula total 2026, todos los años de la carrera`). La unidad `estudiantes` ya existe en la base (migración `20261104000000`).

- **Se carga después de los lotes 1 a 6**: `psql "$CADENA" -v ON_ERROR_STOP=1 -f datos/procesados/lotes/15_matricula_total.sql`.
- **Con la carga real del 5-nov-2026:** 11.364 filas, de 1 a 5.303 estudiantes. Un valor vacío, cero o que no sea un número detiene el generador.
- **Qué es:** el número de registros del archivo de Matrícula 2026 con el código de la carrera (`CODIGO_UNICO`), es decir, personas matriculadas sumando todos sus años. Es un recuento: no se guarda ni se muestra nada de ninguna persona.
- **Repetible:** `on conflict on constraint indicador_unico do nothing`.

