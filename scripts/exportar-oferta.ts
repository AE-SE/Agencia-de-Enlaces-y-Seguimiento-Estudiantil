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

import type { Carrera, Indicador } from '../lib/datos/carreras.ts';
import type { TipoInstitucion, TipoIndicador, UnidadIndicador } from '../lib/datos/tipos.ts';

// ---------------------------------------------------------------------------
// Forma de las filas que devuelve la base (solo las columnas que se usan).
// ---------------------------------------------------------------------------

export type DatosBase = {
  instituciones: { id: string; nombre: string; tipo: TipoInstitucion }[];
  programas: { id: string; institucion_id: string; nombre: string }[];
  variantes: {
    id: string;
    programa_id: string;
    programa_generico_id: string;
    codigo_sies: string;
    sede: string | null;
    comuna: string | null;
    region: string | null;
    jornada: string | null;
    duracion_semestres: number | null;
    fuente_id: string;
  }[];
  aranceles: {
    variante_id: string;
    valor_pesos: number | null;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  vacantes: {
    variante_id: string;
    via: string;
    cupos: number | null;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  indicadores: {
    programa_generico_id: string;
    tipo: TipoIndicador;
    valor: number | null;
    unidad: UnidadIndicador;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  fuentes: { id: string; organismo: string; nombre: string }[];
};

// Sigla que usa el portal para cada fuente (lib/datos/fuentes.ts).
const SIGLA_POR_ORGANISMO: Record<string, string> = {
  'SIES, Mineduc': 'Mi Futuro',
  Mineduc: 'Datos Abiertos Mineduc',
  DEMRE: 'DEMRE',
};

const TIPOS_SIES: TipoIndicador[] = [
  'retencion_1er_anio',
  'empleabilidad_1er_anio',
  'empleabilidad_2do_anio',
  'continuidad_estudios',
  'duracion_real_semestres',
];

export function construirOferta(datos: DatosBase): Carrera[] {
  const instPorId = new Map(datos.instituciones.map((i) => [i.id, i]));
  const progPorId = new Map(datos.programas.map((p) => [p.id, p]));
  const fuentePorId = new Map(datos.fuentes.map((f) => [f.id, SIGLA_POR_ORGANISMO[f.organismo] ?? f.organismo]));

  const arancelesPorVariante = agrupar(datos.aranceles, (a) => a.variante_id);
  const vacantesPorVariante = agrupar(
    datos.vacantes.filter((v) => v.via === 'regular'),
    (v) => v.variante_id,
  );
  const indicadoresPorGenerico = agrupar(datos.indicadores, (i) => i.programa_generico_id);

  const carreras: Carrera[] = [];
  for (const v of datos.variantes) {
    const prog = progPorId.get(v.programa_id);
    const inst = prog ? instPorId.get(prog.institucion_id) : undefined;
    if (!prog || !inst) {
      throw new Error(`variante sin programa o institución: ${v.codigo_sies}`);
    }

    const indicadores: Indicador[] = [];

    for (const a of arancelesPorVariante.get(v.id) ?? []) {
      indicadores.push(
        filaIndicador({
          tipo: 'arancel_anual',
          nivel: 'variante',
          unidad: 'pesos',
          valor: a.valor_pesos,
          periodo: a.periodo,
          fuente: fuentePorId.get(a.fuente_id) ?? '',
          url: a.url,
          fecha_consulta: a.fecha_consulta,
          motivo: a.motivo_sin_dato,
        }),
      );
    }

    for (const c of vacantesPorVariante.get(v.id) ?? []) {
      indicadores.push(
        filaIndicador({
          tipo: 'vacantes',
          nivel: 'variante',
          unidad: 'cupos',
          valor: c.cupos,
          periodo: c.periodo,
          fuente: fuentePorId.get(c.fuente_id) ?? '',
          url: c.url,
          fecha_consulta: c.fecha_consulta,
          motivo: c.motivo_sin_dato,
        }),
      );
    }

    for (const i of indicadoresPorGenerico.get(v.programa_generico_id) ?? []) {
      if (!TIPOS_SIES.includes(i.tipo)) continue;
      indicadores.push(
        filaIndicador({
          tipo: i.tipo,
          nivel: 'programa',
          unidad: i.unidad,
          valor: i.valor,
          periodo: i.periodo,
          fuente: fuentePorId.get(i.fuente_id) ?? '',
          url: i.url,
          fecha_consulta: i.fecha_consulta,
          motivo: i.motivo_sin_dato,
        }),
      );
    }

    carreras.push({
      codigo_sies: v.codigo_sies,
      carrera: prog.nombre,
      institucion: { nombre: inst.nombre, tipo: inst.tipo },
      sede: v.sede ?? '',
      comuna: v.comuna ?? '',
      region: v.region ?? '',
      jornada: v.jornada ?? '',
      duracion_semestres: v.duracion_semestres ?? 0,
      indicadores,
    });
  }
  return carreras;
}

type Entrada = {
  tipo: TipoIndicador;
  nivel: 'programa' | 'variante';
  unidad: UnidadIndicador;
  valor: number | null;
  periodo: string;
  fuente: string;
  url: string;
  fecha_consulta: string;
  motivo: string | null;
};

function filaIndicador(e: Entrada): Indicador {
  const base = {
    tipo: e.tipo,
    nivel: e.nivel,
    unidad: e.unidad,
    periodo: e.periodo,
    fuente: e.fuente,
    url: e.url,
    fecha_consulta: e.fecha_consulta,
  };
  if (e.valor === null) {
    if (!e.motivo) throw new Error(`dato nulo sin motivo: ${e.tipo}`);
    return { ...base, valor: null, motivo_sin_dato: e.motivo };
  }
  return { ...base, valor: e.valor };
}

function agrupar<T>(filas: T[], clave: (f: T) => string): Map<string, T[]> {
  const mapa = new Map<string, T[]>();
  for (const f of filas) {
    const k = clave(f);
    const lista = mapa.get(k);
    if (lista) lista.push(f);
    else mapa.set(k, [f]);
  }
  return mapa;
}

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
