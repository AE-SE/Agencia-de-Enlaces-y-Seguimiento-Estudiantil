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
