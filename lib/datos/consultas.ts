// Consultas al explorador y al comparador, sin acceso a la red. Son puras y tienen pruebas.
// Los valores de región y jornada vienen de la carga oficial (datos/procesados/carga.csv).

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
  'sede',
  'comuna',
  'region',
  'jornada',
  'duracion_semestres',
  'programa_id',
  'programa_generico_id',
  'fuente_id',
  'programa:programa_id!inner(id,nombre,institucion_id,institucion:institucion_id!inner(id,nombre,tipo))',
].join(',');

export function parametrosBusqueda(filtros: FiltrosBusqueda, pagina: number): URLSearchParams {
  const p = new URLSearchParams();
  p.set('select', SELECT_VARIANTE);
  p.set('order', 'codigo_sies.asc');
  p.set('limit', String(POR_PAGINA));
  p.set('offset', String(Math.max(0, pagina - 1) * POR_PAGINA));

  for (const palabra of palabrasSeguras(filtros.texto)) {
    p.append('programa.nombre', `ilike.*${palabra}*`);
  }
  const regiones = filtros.regiones.filter((r) => (REGIONES as readonly string[]).includes(r));
  if (regiones.length) p.set('region', listaPostgrest(regiones));

  const tipos = filtros.tipos.filter((t) => (TIPOS as readonly string[]).includes(t));
  if (tipos.length) p.set('programa.institucion.tipo', listaPostgrest(tipos));

  const jornadas = filtros.jornadas.filter((j) => (JORNADAS as readonly string[]).includes(j));
  if (jornadas.length) p.set('jornada', listaPostgrest(jornadas));

  return p;
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
