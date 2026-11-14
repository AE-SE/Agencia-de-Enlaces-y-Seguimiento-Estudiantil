// Cálculo del explorador de ocupaciones (ADR 0034, opción C).
// Ordena ocupaciones por qué tan altas son sus puntuaciones en las áreas que
// la persona elige. No es un test ni un diagnóstico: solo ordena datos de O*NET.

export const AREAS_INTERES = [
  'realista',
  'investigador',
  'artistico',
  'social',
  'emprendedor',
  'convencional',
] as const;

export type AreaInteres = (typeof AREAS_INTERES)[number];

export const MAX_AREAS = 3;

export type Ocupacion = {
  codigo: string;
  titulo: string;
  area: string;
  carreras_en_area: number;
  perfil: Record<AreaInteres, number>;
};

// Lee las áreas de la URL («realista,social»). Descarta lo que no existe,
// quita repetidos y deja como máximo MAX_AREAS.
export function areasDesdeUrl(valor: string | undefined): AreaInteres[] {
  if (!valor) return [];
  const vistas = new Set<AreaInteres>();
  for (const parte of valor.split(',')) {
    const area = parte.trim() as AreaInteres;
    if ((AREAS_INTERES as readonly string[]).includes(area)) vistas.add(area);
    if (vistas.size === MAX_AREAS) break;
  }
  return [...vistas];
}

// Promedio de las puntuaciones en las áreas elegidas (escala O*NET de 1 a 7).
export function puntuacion(perfil: Record<AreaInteres, number>, areas: AreaInteres[]): number {
  if (areas.length === 0) return 0;
  const suma = areas.reduce((total, area) => total + perfil[area], 0);
  return suma / areas.length;
}

// Ocupaciones más cercanas a las áreas elegidas. Sin áreas, no devuelve nada.
export function rankear(ocupaciones: Ocupacion[], areas: AreaInteres[], limite = 10): Ocupacion[] {
  if (areas.length === 0) return [];
  return [...ocupaciones]
    .sort((a, b) => {
      const diferencia = puntuacion(b.perfil, areas) - puntuacion(a.perfil, areas);
      return diferencia !== 0 ? diferencia : a.titulo.localeCompare('es');
    })
    .slice(0, limite);
}
