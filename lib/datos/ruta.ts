import type { Carrera } from './carreras.ts';
import { slug, slugUnico } from './slug.ts';

export function rutaDeCarrera(carrera: Carrera, carreras: readonly Carrera[]): string {
  const segmento = slugUnico(
    `${carrera.carrera}-${carrera.sede}`,
    carrera.codigo_sies,
    carreras
      .filter((item) => slug(item.institucion.nombre) === slug(carrera.institucion.nombre))
      .map((item) => `${item.carrera}-${item.sede}`),
  );

  return `/carreras/${slug(carrera.institucion.nombre)}/${segmento}`;
}
