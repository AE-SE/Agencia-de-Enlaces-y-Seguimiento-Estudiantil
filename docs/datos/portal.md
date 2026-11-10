# Cómo el portal lee la oferta

El portal no lee la base en cada visita. Antes de compilar el sitio, `scripts/exportar-oferta.ts` lee la base con la clave pública de lectura y escribe `lib/datos/oferta-generada.json`. Las fichas y el explorador se generan desde ese archivo.

## Variables de compilación (Cloudflare)

| Variable | Qué es | Dónde se obtiene |
|---|---|---|
| `SUPABASE_URL` | URL del proyecto | Supabase → Connect |
| `SUPABASE_ANON_KEY` | Clave pública de lectura (publishable) | Supabase → Settings → API Keys |

**Nunca** se usa la clave de servicio (secret) aquí. La clave pública puede estar en el sitio porque RLS solo da lectura en estas tablas.

## Comandos

```bash
npm run datos:exportar          # lee la base y escribe la oferta (requiere las dos variables)
npm run datos:ejemplo           # desarrollo: copia la muestra, sobrescribe
npm run datos:ejemplo-si-falta  # desarrollo y pruebas: copia la muestra si no existe
npm run build                   # ejecuta antes datos:exportar (prebuild); sin variables, se detiene
```

Importante: la compilación de Cloudflare debe ejecutar `npm run build` (o `npm run prebuild` antes de `opennextjs-cloudflare build`) para que la oferta se exporte antes.

## Qué se publica y qué no

- **Una carrera del portal es una variante** (sede y jornada), como en la muestra.
- **Arancel, cupos y los indicadores del SIES** se publican con su fuente, su período, su fecha y su motivo cuando falta el dato.
- **Cupos:** solo la vía regular. Las vías MC, BEA, PACE y el segundo semestre no tienen campo en la ficha todavía.
- **Ingreso al 4.º año:** es un tramo de pesos, no un promedio. No se publica hasta que la ficha tenga un bloque para tramos.
- **Matrícula total:** no está en los lotes cargados. No se publica.
- **Derecho y carreras con excepción:** la empleabilidad al 1.er año queda sin valor, con su motivo.

## Pendiente antes de publicar en producción

- **Explorador:** la página recibe las 11.364 carreras en el HTML. Hace falta paginar o filtrar en el servidor antes de publicar (AGENTS.md 2.6: páginas livianas, y 10.000 resultados exigen paginación).
- **Comparador:** mismo tamaño de datos; revisar después del explorador.
- **Tiempo de compilación:** unas 11.364 fichas estáticas. Medir en Cloudflare.
- **Tramos de ingreso, vía MC/BEA/PACE y matrícula:** bloques nuevos de la ficha, con su revisión.
