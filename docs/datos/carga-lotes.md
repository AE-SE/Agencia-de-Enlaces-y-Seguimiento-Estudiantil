# Carga por lotes de la oferta oficial (lote 1)

Documento paso a paso para generar y cargar la oferta de Mineduc en la base. Quien ejecuta la carga en producción es el líder del proyecto. Este documento no autoriza a nadie a escribir en la base sin revisar antes los conteos de la sección 5.

Alcance del lote 1: fuente, instituciones, programas, variantes (sede y jornada) y aranceles. **No incluye** todavía indicadores del SIES, vacantes, requisitos ni ponderaciones del DEMRE, que son lotes posteriores (sección 7).

## 0. Qué hay en cada paso

| Paso | Qué hace | Quién | Dónde |
|---|---|---|---|
| 1 | Verificar el archivo de entrada | quien genera | computador del líder |
| 2 | Generar los lotes SQL | quien genera | computador del líder |
| 3 | Revisar el informe | quien genera | computador del líder |
| 4 | Decidir la clave de programa (sección 2) | líder | — |
| 5 | Comprobar la base antes de cargar | líder | editor SQL de Supabase |
| 6 | Ejecutar los lotes en orden | líder | editor SQL de Supabase |
| 7 | Comprobar los conteos después | líder | editor SQL de Supabase |

## 1. Verificar el archivo de entrada

Entrada: `datos/procesados/carga.csv`, producido por `datos/preparar_carga.py` a partir de `datos/cargar_oferta.py`, `datos/cargar_empleabilidad.py` y `datos/cargar_demre.py`. Cada fila es una variante de carrera (sede y jornada).

Comprobar que tiene 11.364 filas de datos más el encabezado:

```bash
python -c "import csv; print(len(list(csv.DictReader(open('datos/procesados/carga.csv', encoding='utf-8')))))"
```

Resultado esperado: `11364`.

## 2. Decisión abierta: clave de programa

La tabla `programa` exige un `codigo_sies` único, pero una misma carrera aparece en varias sedes y jornadas, y el código SIES del archivo es de cada variante.

El generador usa como **clave interna** la combinación código de institución + código de carrera del Mineduc (por ejemplo `100-111`). Esa clave **no es un código SIES oficial**. Antes de cargar, el líder debe confirmarla o cambiarla por una de las opciones de la sección 8.

Si la clave cambia, hay que regenerar los lotes (paso 2).

## 3. Generar los lotes

Desde la raíz del repositorio:

```bash
python datos/generar_lotes.py
```

Salida: cinco archivos SQL y un `informe.json` en `datos/procesados/lotes/`. La carpeta está fuera de git (`.gitignore`).

Si el generador termina con `ERROR:`, no escribió nada completo. Lee el mensaje y corrige la causa antes de repetir.

## 4. Revisar el informe

`datos/procesados/lotes/informe.json` debe mostrar:

```json
{
  "filas_leidas": 11364,
  "errores": [],
  "fuentes": 1,
  "instituciones": 116,
  "programas": 3898,
  "variantes": 11364,
  "aranceles_con_monto": 11349,
  "aranceles_sin_monto": 15
}
```

Si cambia alguna cifra, el archivo de entrada es distinto de lo esperado. No sigas hasta entender por qué.

Cada archivo tiene una sentencia por fila:

| Archivo | Sentencias | Tabla |
|---|---|---|
| `01_fuentes.sql` | 1 | `fuente` |
| `02_instituciones.sql` | 116 | `institucion` |
| `03_programas.sql` | 3.898 | `programa` |
| `04_variantes.sql` | 11.364 | `programa_variante` |
| `05_aranceles.sql` | 11.364 | `arancel_variante` |

Las sentencias usan `on conflict … do nothing`, así que volver a ejecutar un archivo no duplica filas.

## 5. Comprobar la base antes de cargar

En el editor SQL de Supabase, proyecto de producción, ejecuta solo lectura:

```sql
select
  (select count(*) from institucion) as instituciones,
  (select count(*) from programa) as programas,
  (select count(*) from programa_variante) as variantes,
  (select count(*) from arancel_variante) as aranceles,
  (select count(*) from fuente) as fuentes;
```

Antes de cargar, todas deben ser 0 (o la fuente de Mineduc no debe existir). Si alguna no es 0, para: ya hay datos y hay que entender de dónde vienen antes de sumar más.

## 6. Ejecutar los lotes en orden

En el editor SQL, pega y ejecuta **uno por uno**, en este orden:

1. `01_fuentes.sql`
2. `02_instituciones.sql`
3. `03_programas.sql`
4. `04_variantes.sql`
5. `05_aranceles.sql`

Si un lote falla, no ejecutes el siguiente. Como cada sentencia es independiente, el lote que falló puede reejecutarse.

## 7. Comprobar los conteos después

Ejecuta la consulta de la sección 5. Resultado esperado:

| Tabla | Esperado |
|---|---|
| instituciones | 116 |
| programas | 3.898 |
| variantes | 11.364 |
| aranceles | 11.364 |
| fuentes | 1 |

Y revisa las regiones:

```sql
select region, count(*) from programa_variante group by region order by region;
```

Deben aparecer las 16 regiones.

Si algún conteo no coincide, no sigas con el siguiente lote. Anota el número y revisa el informe antes de ejecutar nada más.

## 8. Opciones para la clave de programa

1. **Mantener la clave interna** `institución-carrera` (la del generador). Simple y repetible. No es un código oficial.
2. **Quitar la restricción única de `programa.codigo_sies`** con una migración nueva, y usar el código de carrera del Mineduc junto con la institución. Requiere un ADR, según AGENTS.md.
3. **Usar el código SIES de la primera variante.** Descartada: oculta las demás sedes.

## 9. Deshacer la carga

Si hay que revertir el lote 1, en este orden, en el editor SQL (solo si el líder lo confirma):

```sql
delete from programa_variante
 where fuente_id = (select id from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc');
delete from programa
 where fuente_id = (select id from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc');
delete from institucion
 where id not in (select institucion_id from programa);
delete from fuente where organismo = 'Mineduc' and nombre = 'Datos Abiertos Mineduc';
```

Los aranceles se borran solos (`on delete cascade`).

## 10. Lo que el lote 1 no cubre

- Indicadores del SIES: empleabilidad, ingreso al 4.º año, retención, duración real. Lote 2.
- Vacantes, requisitos y ponderaciones del DEMRE (`requisito_admision`, `vacante_admision`). Lote 3.
- Acreditación detallada (`acreditacion_institucion`). Lote 4.
- Programas con sede propia: el lote 1 guarda la sede en la variante, no en el programa.
- La duración de cada programa se toma de su primera fila. Si una carrera tiene duraciones distintas por sede, la fila de la variante la conserva y el programa no.

## 11. Pruebas

Estado actual: el generador **no tiene pruebas automáticas** todavía, y los lotes **no se han ejecutado en una base de prueba**. Las restricciones del esquema (enumerados, valores válidos, motivos cuando falta un dato) las hará cumplir la base al cargar. Si una sentencia viola una restricción, el lote falla y hay que revisarlo antes de seguir.

Pendiente antes de la primera carga: pruebas de `datos/generar_lotes.py` con un archivo de ejemplo inventado, y una ejecución de los lotes en una base de prueba.
