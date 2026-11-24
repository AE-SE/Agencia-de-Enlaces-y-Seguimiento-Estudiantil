# Cómo el portal lee la oferta

Todas las pantallas consultan Supabase en vivo, en cada visita (`lib/datos/oferta-remota.ts`, con caché en memoria de 1 hora):

| Pantalla | Qué consulta |
|---|---|
| Explorador (`/carreras`) | Filtros y paginación (25 por página) |
| Comparador (`/comparador`) | Solo las carreras elegidas y la búsqueda |
| Fichas (`/carreras/...`) | Solo la carrera de la ficha |

La oferta completa **no** se incluye en el código del sitio: pesa decenas de MB y no cabe en el Worker. `lib/datos/oferta-generada.json` solo se lee con `OFERTA_LOCAL=1` (prueba de accesibilidad de la CI y pruebas locales).

La compilación **no** exporta la base: `prebuild` solo copia la muestra si falta. Exportar en cada compilación gastaba unos 33 MB de tráfico de salida de Supabase por despliegue, sin que el sitio publicado usara el archivo (registros de Supabase del 24 de noviembre de 2026).

## Variables

| Variable | Dónde se usa | Qué es |
|---|---|---|
| `SUPABASE_URL` | ejecución (y `datos:exportar` a mano) | URL del proyecto |
| `SUPABASE_ANON_KEY` | ejecución (y `datos:exportar` a mano) | Clave pública de lectura (publishable) |

En Cloudflare basta con definirlas como variables de **ejecución**. Nunca se usa la clave secreta.

## Comandos

```bash
npm run datos:exportar          # lee la base y escribe lib/datos/oferta-generada.json (requiere las variables)
npm run datos:ejemplo           # desarrollo: copia la muestra y la sobrescribe
npm run datos:ejemplo-si-falta  # desarrollo y pruebas: copia la muestra si no existe
npm run build                   # ejecuta antes datos:ejemplo-si-falta (prebuild); no lee la base
```

## Rutas

Una ficha es `/carreras/{institución}/{carrera}-{sede}-{código SIES}`. El código SIES va al final: cada ruta sale sola, sin mirar otras carreras.

## Qué se publica y qué no

- **Una carrera del portal es una variante** (sede y jornada).
- **Arancel, cupos y los indicadores del SIES** se publican con su fuente, período, fecha y motivo cuando falta el dato.
- **Cupos:** solo la vía regular. MC, BEA, PACE y el segundo semestre no tienen campo en la ficha todavía.
- **Ingreso al 4.º año:** es un tramo en palabras («De $1 millón a $1 millón 100 mil»), no un promedio. La ficha lo muestra tal como lo publica el SIES (tabla `tramo_ingreso_sies`, por carrera genérica).
- **Retención de primer año y continuidad de estudios** (SIES) se muestran en la ficha. **Duración formal** (Mineduc) y **duración real** (SIES) van juntas en una tarjeta, cada una con su fuente; no se restan ni se promedian.
- **Carreras fuera del sistema de admisión centralizado** (sin código DEMRE): la ficha dice por qué no hay vacantes, puntaje de corte ni ponderaciones, en vez de «sin datos».
- **Comparador y hoja de decisión** muestran las mismas filas que la ficha, definidas en `lib/datos/indicadores-vista.ts`: empleabilidad, ingreso (tramo en palabras), retención, continuidad, arancel, matrícula, costo del primer año (elaboración propia), duración formal y real, vacantes, puntaje de corte y matrícula total. Cuando falta un dato dicen por qué: carrera fuera del sistema de admisión centralizado, o sin cifras del SIES.
- **Matrícula total:** viene del lote 15 (recuento de personas matriculadas en la carrera, sumando todos sus años).
- **Área:** cada carrera lleva el área de conocimiento que el SIES asigna a su carrera genérica (Buscador de Empleabilidad e Ingresos 2025-2026), desde `lib/datos/areas-sies.json`, que genera `datos/exportar_areas_sies.py`. No se infiere por el nombre: si el SIES no publica la carrera genérica (por ejemplo «Otras ingenierías»), la carrera queda sin área. La usa el criterio de alternativas cercanas (N6).
- **Derecho y carreras con excepción:** la empleabilidad al 1.er año queda sin valor, con su motivo.

## Límites conocidos

- **Búsqueda sin tildes:** la búsqueda en vivo distingue tildes (la base no tiene la extensión `unaccent`).
- **Orden:** el explorador ordena por código SIES, no por nombre.
- **Regiones y jornadas** del filtro están fijas en el código (`lib/datos/consultas.ts`), tomadas de la carga oficial.

## Pendiente antes de publicar

- Medir el tiempo de respuesta y el uso de CPU del explorador en el plan gratuito de Cloudflare.
- Medir el tiempo de compilación con las ~11.364 fichas.
- Bloques de la ficha para vacantes MC/BEA/PACE y matrícula.
