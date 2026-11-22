// Consultas al explorador y al comparador, sin acceso a la red. Son puras y tienen pruebas.
// Los valores de región y jornada vienen de la carga oficial (datos/procesados/carga.csv).

import { normalizar } from './buscar.ts';

export const POR_PAGINA = 25;

export const REGIONES = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  "Lib. Gral. B. O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
] as const;

export const JORNADAS = ['Diurna', 'Vespertina', 'A Distancia', 'Semipresencial', 'Otra'] as const;

export const TIPOS = ['universidad', 'instituto_profesional', 'centro_formacion_tecnica'] as const;

export type FiltrosBusqueda = {
  texto: string;
  regiones: string[];
  tipos: string[];
  jornadas: string[];
};

// Palabras para buscar: se quitan los caracteres que tienen sentido en PostgREST o en LIKE.
export function palabrasSeguras(texto: string): string[] {
  return texto
    .split(/\s+/)
    .map((palabra) => palabra.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
    .slice(0, 5);
}

// Lista para el operador in.(...) de PostgREST, con comillas para valores con espacios o tildes.
export function listaPostgrest(valores: readonly string[]): string {
  return `in.(${valores.map((valor) => `"${valor.replace(/"/g, '')}"`).join(',')})`;
}

const SELECT_VARIANTE = [
  'id',
  'codigo_sies',
  'codigo_demre',
  'sede',
  'comuna',
  'region',
  'jornada',
  'duracion_semestres',
  'programa_id',
  'programa_generico_id',
  'fuente_id',
  'programa_generico:programa_generico_id(nombre_normalizado)',
  'programa:programa_id!inner(id,nombre,nombre_normalizado,institucion_id,institucion:institucion_id!inner(id,nombre,tipo))',
].join(',');

// Con una sola palabra (casi siempre la carrera) el largo del nombre de la institución no dice nada y
// dejaría primero a una institución cualquiera; con dos o más, lo usual es que incluyan la institución.
export function usaOrdenPorRelevancia(texto: string): boolean {
  return palabrasSeguras(normalizar(texto)).length >= 2;
}

export function parametrosBusqueda(filtros: FiltrosBusqueda, pagina: number): URLSearchParams {
  const p = new URLSearchParams();
  p.set('select', SELECT_VARIANTE);
  const palabras = palabrasSeguras(normalizar(filtros.texto));
  // Orden neutro y explícito: carrera, luego institución (el código SIES solo desempata). Con dos o más
  // palabras, dentro de cada carrera va primero la institución de nombre más corto que las contiene:
  // «enfermería u chile» deja primero a la Universidad de Chile y no a la Austral de Chile.
  p.set('order', usaOrdenPorRelevancia(filtros.texto)
    ? 'orden_carrera.asc,largo_institucion.asc,orden_institucion.asc,codigo_sies.asc'
    : 'orden_carrera.asc,orden_institucion.asc,codigo_sies.asc');
  p.set('limit', String(POR_PAGINA));
  p.set('offset', String(Math.max(0, pagina - 1) * POR_PAGINA));

  // Se busca en `texto_busqueda` de la vista variante_busqueda (carrera, institución, sede y comuna, sin
  // tildes ni mayúsculas), con las palabras normalizadas igual. Todas deben aparecer (Y lógico), en
  // cualquiera de esos campos: «enfermería u chile» encuentra Enfermería de la U. de Chile.
  for (const palabra of palabras) {
    p.append('texto_busqueda', `ilike.*${palabra}*`);
  }
  const regiones = filtros.regiones.filter((r) => (REGIONES as readonly string[]).includes(r));
  if (regiones.length) p.set('region', listaPostgrest(regiones));

  const tipos = filtros.tipos.filter((t) => (TIPOS as readonly string[]).includes(t));
  if (tipos.length) p.set('programa.institucion.tipo', listaPostgrest(tipos));

  const jornadas = filtros.jornadas.filter((j) => (JORNADAS as readonly string[]).includes(j));
  if (jornadas.length) p.set('jornada', listaPostgrest(jornadas));

  return p;
}

// Con texto, primero van las carreras cuyo nombre empieza con la primera palabra buscada (grupo A) y
// luego el resto (grupo B); dentro de cada grupo rige el orden de parametrosBusqueda. PostgREST no ordena
// por expresiones, así que son dos consultas. La palabra ya viene sin signos (palabrasSeguras), por eso
// no necesita más escape para like. Sin texto devuelve null: una sola consulta, como siempre.
export function parametrosPorGrupos(filtros: FiltrosBusqueda, pagina: number): { a: URLSearchParams; b: URLSearchParams } | null {
  const primera = palabrasSeguras(normalizar(filtros.texto))[0];
  if (!primera) return null;
  const a = parametrosBusqueda(filtros, pagina);
  a.set('orden_carrera', `like.${primera}*`);
  const b = parametrosBusqueda(filtros, pagina);
  b.set('orden_carrera', `not.like.${primera}*`);
  return { a, b };
}

// Ubicación del grupo B en la página: salta lo que A ya mostró en páginas anteriores y llena solo lo que
// A dejó libre. Con limit 0 la consulta igual devuelve el conteo (content-range: */N).
export function ventanaGrupoB(pagina: number, totalA: number, filasA: number): { offset: number; limit: number } {
  const desde = Math.max(0, pagina - 1) * POR_PAGINA;
  return { offset: Math.max(0, desde - totalA), limit: POR_PAGINA - filasA };
}

// Total que informa PostgREST en content-range: «0-24/3224» o «*/100» (limit 0). Sin dato, el largo de la página.
export function totalDesdeRango(rango: string | null, respaldo: number): number {
  const total = rango?.includes('/') ? Number(rango.split('/')[1]) : respaldo;
  return Number.isFinite(total) ? total : respaldo;
}

// Parámetros para traer carreras concretas por código SIES (comparador y enlaces).
export function parametrosPorCodigos(codigos: readonly string[]): URLSearchParams {
  const p = new URLSearchParams();
  p.set('select', SELECT_VARIANTE);
  p.set('limit', String(Math.max(1, codigos.length)));
  p.set('codigo_sies', listaPostgrest(codigos));
  return p;
}

// Lee los filtros de la dirección (searchParams de Next). Valores repetidos son listas.
export function filtrosDesdeUrl(params: Record<string, string | string[] | undefined>): FiltrosBusqueda {
  const lista = (clave: string) => {
    const valor = params[clave];
    if (!valor) return [];
    return Array.isArray(valor) ? valor : [valor];
  };
  const texto = params.q;
  return {
    texto: (Array.isArray(texto) ? texto[0] : texto) ?? '',
    regiones: lista('region'),
    tipos: lista('tipo'),
    jornadas: lista('jornada'),
  };
}

export function paginaDesdeUrl(params: Record<string, string | string[] | undefined>): number {
  const valor = Array.isArray(params.pagina) ? params.pagina[0] : params.pagina;
  const numero = Number.parseInt(valor ?? '1', 10);
  return Number.isFinite(numero) && numero > 0 ? numero : 1;
}

export function totalPaginas(total: number): number {
  return Math.max(1, Math.ceil(total / POR_PAGINA));
}
