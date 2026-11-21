import type { Carrera } from './carreras.ts';
import type { TipoInstitucion } from './tipos.ts';

export type FiltrosCarreras = {
  texto?: string;
  regiones?: readonly string[];
  tipos?: readonly TipoInstitucion[];
  jornadas?: readonly string[];
};

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ordenarAlfabetico(carreras: readonly Carrera[]): Carrera[] {
  return [...carreras].sort(
    (a, b) => a.carrera.localeCompare(b.carrera, 'es') || a.institucion.nombre.localeCompare(b.institucion.nombre, 'es'),
  );
}

export function filtrarCarreras(carreras: readonly Carrera[], filtros: FiltrosCarreras): Carrera[] {
  const palabras = normalizar(filtros.texto ?? '').split(' ').filter(Boolean);
  const coincide = (seleccion: readonly string[] | undefined, valor: string) => !seleccion?.length || seleccion.includes(valor);

  const filtradas = carreras.filter((carrera) => {
    const texto = normalizar(`${carrera.carrera} ${carrera.institucion.nombre} ${carrera.sede} ${carrera.comuna}`);
    return palabras.every((palabra) => texto.includes(palabra))
      && coincide(filtros.regiones, carrera.region)
      && coincide(filtros.tipos, carrera.institucion.tipo)
      && coincide(filtros.jornadas, carrera.jornada);
  });
  // Primero las carreras cuyo nombre empieza con la primera palabra (igual que la consulta en línea).
  const empieza = (c: Carrera) => (palabras[0] && normalizar(c.carrera).startsWith(palabras[0]) ? 0 : 1);
  const porPrefijo = (lista: Carrera[]) => [...lista].sort((a, b) => empieza(a) - empieza(b));
  if (palabras.length < 2) return porPrefijo(ordenarAlfabetico(filtradas));
  // Mismo orden que la consulta en línea (usaOrdenPorRelevancia en lib/datos/consultas.ts): con dos o
  // más palabras, dentro de cada carrera va primero la institución de nombre más corto.
  return porPrefijo([...filtradas].sort(
    (a, b) => a.carrera.localeCompare(b.carrera, 'es')
      || a.institucion.nombre.length - b.institucion.nombre.length
      || a.institucion.nombre.localeCompare(b.institucion.nombre, 'es')
      // Mismo desempate final que en línea (codigo_sies), para que el orden sea siempre el mismo.
      || a.codigo_sies.localeCompare(b.codigo_sies),
  ));
}
