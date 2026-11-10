# Cómo el portal lee la oferta

El portal lee la oferta de dos formas, según la pantalla:

| Pantalla | Cómo obtiene los datos | Cuándo |
|---|---|---|
| Explorador (`/carreras`) | Consulta Supabase con filtros y paginación (25 por página) | En vivo, en cada visita |
| Comparador (`/comparador`) | Consulta Supabase solo por las carreras elegidas y por la búsqueda | En vivo |
| Fichas (`/carreras/...`) | Páginas estáticas generadas al compilar | Al compilar |

La oferta completa **no** se incluye en el código del sitio: pesa decenas de MB y no cabe en el Worker. Por eso el explorador y el comparador consultan la base en vivo, y las fichas se generan al compilar con `scripts/exportar-oferta.ts`.

## Variables

| Variable | Dónde se usa | Qué es |
|---|---|---|
| `SUPABASE_URL` | compilación **y** ejecución | URL del proyecto |
| `SUPABASE_ANON_KEY` | compilación **y** ejecución | Clave pública de lectura (publishable) |

En Cloudflare hay que definirlas como variables de **compilación** (para las fichas) y como variables de **ejecución** (para el explorador y el comparador). Nunca se usa la clave secreta.

## Comandos

```bash
npm run datos:exportar          # lee la base y escribe lib/datos/oferta-generada.json (requiere las variables)
npm run datos:ejemplo           # desarrollo: copia la muestra y la sobrescribe
npm run datos:ejemplo-si-falta  # desarrollo y pruebas: copia la muestra si no existe
npm run build                   # ejecuta antes datos:exportar (prebuild); sin variables, se detiene
```

La compilación de Cloudflare debe ejecutar `npm run build` para que las fichas se exporten antes.

## Rutas

Una ficha es `/carreras/{institución}/{carrera}-{sede}-{código SIES}`. El código SIES va al final: cada ruta sale sola, sin mirar otras carreras.

## Qué se publica y qué no

- **Una carrera del portal es una variante** (sede y jornada).
- **Arancel, cupos y los indicadores del SIES** se publican con su fuente, período, fecha y motivo cuando falta el dato.
- **Cupos:** solo la vía regular. MC, BEA, PACE y el segundo semestre no tienen campo en la ficha todavía.
- **Ingreso al 4.º año:** es un tramo de pesos, no un promedio. No se publica hasta tener un bloque para tramos.
- **Matrícula total:** no está en los lotes cargados.
- **Derecho y carreras con excepción:** la empleabilidad al 1.er año queda sin valor, con su motivo.

## Límites conocidos

- **Búsqueda sin tildes:** la búsqueda en vivo distingue tildes (la base no tiene la extensión `unaccent`).
- **Orden:** el explorador ordena por código SIES, no por nombre.
- **Regiones y jornadas** del filtro están fijas en el código (`lib/datos/consultas.ts`), tomadas de la carga oficial.

## Pendiente antes de publicar

- Medir el tiempo de respuesta y el uso de CPU del explorador en el plan gratuito de Cloudflare.
- Medir el tiempo de compilación con las ~11.364 fichas.
- Bloques de la ficha para tramos de ingreso, vacantes MC/BEA/PACE y matrícula.
