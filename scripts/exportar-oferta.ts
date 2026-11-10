// Exporta la oferta oficial desde Supabase a lib/datos/oferta-generada.json.
//
// Corre antes de `next build` (prebuild). Lee solo con la clave pública de lectura
// (RLS da SELECT a anon en estas tablas). No escribe nada en la base.
//
// Variables: SUPABASE_URL y SUPABASE_ANON_KEY (en Cloudflare, en la compilación).
// Sin variables, el script se detiene: no se publica la muestra por error.
// Para desarrollo local: `node scripts/exportar-oferta.ts --ejemplo` copia la muestra.
//
// Decisiones (ver docs/datos/portal.md):
// - Una carrera del portal es una variante (sede y jornada), como en la muestra.
// - Cupos: solo la vía regular. Las demás vías no tienen campo en la ficha todavía.
// - Ingreso al 4.º año: es un tramo (tramo_ingreso_sies), no un promedio. Queda
//   fuera hasta que la ficha tenga un bloque para tramos.
// - Matrícula total: no está en los lotes cargados; queda fuera.

import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { construirOferta, type DatosBase } from '../lib/datos/oferta-mapeo.ts';

// ---------------------------------------------------------------------------
// Lectura de la base (solo SELECT, con paginación de 1.000 filas por página).
// ---------------------------------------------------------------------------

async function leerTabla<T>(url: string, clave: string, tabla: string, select: string): Promise<T[]> {
  const filas: T[] = [];
  const pagina = 1000;
  for (let desde = 0; ; desde += pagina) {
    const r = await fetch(`${url}/rest/v1/${tabla}?select=${encodeURIComponent(select)}`, {
      headers: {
        apikey: clave,
        Authorization: `Bearer ${clave}`,
        Range: `${desde}-${desde + pagina - 1}`,
        'Range-Unit': 'items',
      },
    });
    if (!r.ok) throw new Error(`${tabla}: HTTP ${r.status} ${await r.text()}`);
    const lote = (await r.json()) as T[];
    filas.push(...lote);
    if (lote.length < pagina) break;
  }
  return filas;
}

async function leerBase(url: string, clave: string): Promise<DatosBase> {
  return {
    instituciones: await leerTabla(url, clave, 'institucion', 'id,nombre,tipo'),
    programas: await leerTabla(url, clave, 'programa', 'id,institucion_id,nombre'),
    variantes: await leerTabla(
      url,
      clave,
      'programa_variante',
      'id,programa_id,programa_generico_id,codigo_sies,sede,comuna,region,jornada,duracion_semestres,fuente_id',
    ),
    aranceles: await leerTabla(
      url,
      clave,
      'arancel_variante',
      'variante_id,valor_pesos,periodo,fuente_id,url,fecha_consulta,motivo_sin_dato',
    ),
    vacantes: await leerTabla(
      url,
      clave,
      'vacante_admision',
      'variante_id,via,cupos,periodo,fuente_id,url,fecha_consulta,motivo_sin_dato',
    ),
    indicadores: await leerTabla(
      url,
      clave,
      'indicador',
      'programa_generico_id,tipo,valor,unidad,periodo,fuente_id,url,fecha_consulta,motivo_sin_dato',
    ),
    fuentes: await leerTabla(url, clave, 'fuente', 'id,organismo,nombre'),
  };
}

// ---------------------------------------------------------------------------
// Punto de entrada
// ---------------------------------------------------------------------------

const DESTINO = resolve(import.meta.dirname, '..', 'lib', 'datos', 'oferta-generada.json');
const EJEMPLO = resolve(import.meta.dirname, '..', 'datos', 'ejemplos', 'carreras.json');

async function main(): Promise<void> {
  if (process.argv.includes('--ejemplo')) {
    copyFileSync(EJEMPLO, DESTINO);
    console.log('Oferta de ejemplo copiada (solo desarrollo).');
    return;
  }
  if (process.argv.includes('--ejemplo-si-falta')) {
    if (!existsSync(DESTINO)) copyFileSync(EJEMPLO, DESTINO);
    console.log('Oferta de desarrollo lista.');
    return;
  }

  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_ANON_KEY;
  if (!url || !clave) {
    console.error('Faltan SUPABASE_URL o SUPABASE_ANON_KEY. No se publica la muestra por error.');
    process.exit(1);
  }

  const datos = await leerBase(url.replace(/\/$/, ''), clave);
  const carreras = construirOferta(datos);
  if (carreras.length === 0) {
    console.error('La base no devolvió carreras. Revisa que el lote 1 esté cargado.');
    process.exit(1);
  }
  const regiones = new Set(carreras.map((c) => c.region));
  writeFileSync(
    DESTINO,
    JSON.stringify({ generado: new Date().toISOString().slice(0, 10), carreras }),
    'utf8',
  );
  console.log(`Oferta exportada: ${carreras.length} carreras, ${regiones.size} regiones.`);
}

if (process.argv[1]?.endsWith('exportar-oferta.ts')) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
