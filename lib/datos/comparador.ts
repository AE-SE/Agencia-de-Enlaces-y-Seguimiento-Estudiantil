import type { Carrera, Indicador } from './carreras.ts';

export const MAXIMO_CARRERAS_COMPARADAS = 3;

export function carrerasDesdeCodigos(codigos: string | null, carreras: readonly Carrera[]): Carrera[] {
  if (!codigos) return [];

  const porCodigo = new Map(carreras.map((carrera) => [carrera.codigo_sies, carrera]));
  const vistos = new Set<string>();

  return codigos.split(',').flatMap((codigo) => {
    if (vistos.has(codigo) || !porCodigo.has(codigo) || vistos.size >= MAXIMO_CARRERAS_COMPARADAS) return [];
    vistos.add(codigo);
    return [porCodigo.get(codigo)!];
  });
}

export function rutaDelComparador(carreras: readonly Carrera[]): string {
  return `/comparador?carreras=${carreras.map((carrera) => encodeURIComponent(carrera.codigo_sies)).join(',')}`;
}

export function indicadorDe(carrera: Carrera, tipo: Indicador['tipo']): Indicador | undefined {
  return carrera.indicadores.find((indicador) => indicador.tipo === tipo);
}

// Igual que rutaDelComparador, pero conserva la búsqueda y los filtros: así, al agregar o quitar
// una carrera no hay que volver a buscar para elegir la siguiente.
export function rutaDelComparadorConBusqueda(
  carreras: readonly Carrera[],
  busqueda: { texto: string; regiones: readonly string[]; tipos: readonly string[]; jornadas: readonly string[] },
): string {
  const p = new URLSearchParams();
  if (busqueda.texto) p.set('q', busqueda.texto);
  for (const r of busqueda.regiones) p.append('region', r);
  for (const t of busqueda.tipos) p.append('tipo', t);
  for (const j of busqueda.jornadas) p.append('jornada', j);
  // `carreras` se arma igual que en rutaDelComparador (coma literal), para que las direcciones coincidan.
  const partes = [
    carreras.length ? `carreras=${carreras.map((carrera) => encodeURIComponent(carrera.codigo_sies)).join(',')}` : '',
    p.toString(),
  ].filter(Boolean);
  return partes.length ? `/comparador?${partes.join('&')}` : '/comparador';
}
