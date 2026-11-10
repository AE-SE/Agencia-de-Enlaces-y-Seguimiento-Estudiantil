import type { Carrera } from './carreras.ts';
import { slug } from './slug.ts';

// Ruta de la ficha: /carreras/{institución}/{carrera}-{sede}-{código SIES}.
// El código SIES va siempre al final: así cada ruta se calcula sola, sin mirar otras
// carreras, y sirve tanto para el explorador en vivo como para las fichas estáticas.
export function rutaDeCarrera(carrera: Pick<Carrera, 'carrera' | 'sede' | 'codigo_sies' | 'institucion'>): string {
  const segmento = [slug(carrera.carrera), slug(carrera.sede), slug(carrera.codigo_sies)]
    .filter(Boolean)
    .join('-');
  return `/carreras/${slug(carrera.institucion.nombre)}/${segmento}`;
}

// El código SIES es el último tramo del segmento de la ruta.
export function codigoDeSegmento(segmento: string): string {
  return segmento.split('-').at(-1) ?? '';
}
