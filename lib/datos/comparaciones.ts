// Comparaciones de empleabilidad al 1.er año de una carrera (las genera datos/exportar_comparaciones.py).
// Es elaboración propia con el Buscador de Empleabilidad e Ingresos del SIES: el SIES no publica estas cifras.
import datos from './comparaciones-empleabilidad.json' with { type: 'json' };
import type { Carrera } from './carreras.ts';

type Cifras = { instituciones: number; minimo_pct?: number; mediana_pct?: number; maximo_pct?: number; motivo?: string };
type PorCarrera = {
  todas: Cifras;
  otras_por_institucion: Record<string, Cifras>;
  instituciones_con_excepcion_derecho?: string[];
};
type PromedioArea = { instituciones: number; filas_carrera_institucion: number; promedio_pct?: number; motivo?: string };
type Archivo = {
  fuente: string;
  url: string;
  fecha_descarga: string;
  indicador: string;
  atribucion: string;
  metodo_carrera: string;
  metodo_area: string;
  motivo_sin_tasa: string;
  motivo_excepcion_derecho: string;
  por_carrera: Record<string, Record<string, PorCarrera>>;
  por_area: Record<string, Record<string, PromedioArea>>;
};

const archivo = datos as unknown as Archivo;

export type ComparacionEmpleabilidad = {
  periodo: string;
  // La misma carrera en las demás instituciones. Null si no se puede calcular; entonces «motivo» dice por qué.
  otras: { instituciones: number; minimo: number; mediana: number; maximo: number } | null;
  motivo: string | null;
  // Media simple de las tasas publicadas del área del SIES. Null si la carrera no tiene área o no hay cifra.
  area: { nombre: string; instituciones: number; promedio: number } | null;
  fuente: string;
  url: string;
  fecha_descarga: string;
  atribucion: string;
  metodo_carrera: string;
  metodo_area: string;
};

// «I86S5C208J1V1» -> «86». Es el código de institución del SIES, el mismo que usa la comparación.
export function institucionDeCodigoSies(codigoSies: string): string | null {
  return /^I(\d+)S/.exec(codigoSies)?.[1] ?? null;
}

// Devuelve null cuando no hay nada que comparar: la carrera no tiene cifra propia, no se sabe su genérica o el
// SIES no publica esa genérica en el mismo período. Nunca se compara una carrera sin cifra propia.
export function comparacionDeEmpleabilidad(carrera: Carrera): ComparacionEmpleabilidad | null {
  const propio = carrera.indicadores.find((i) => i.tipo === 'empleabilidad_1er_anio');
  const institucion = institucionDeCodigoSies(carrera.codigo_sies);
  if (!carrera.generica || !institucion) return null;
  const registros = archivo.por_carrera[carrera.generica];
  if (!registros) return null;

  const base = (periodo: string) => ({
    periodo,
    fuente: archivo.fuente,
    url: archivo.url,
    fecha_descarga: archivo.fecha_descarga,
    atribucion: archivo.atribucion,
    metodo_carrera: archivo.metodo_carrera,
    metodo_area: archivo.metodo_area,
  });

  // En Derecho el SIES informa otro año como «1.er año»: no se comparan cifras, se explica. Va antes de mirar la cifra
  // propia y el período, porque en Derecho el período lleva otro texto y la cifra puede faltar: justo el caso a explicar.
  const excepcionDerecho = carrera.generica === 'derecho'
    || Object.values(registros).some((r) => r.instituciones_con_excepcion_derecho?.includes(institucion));
  if (excepcionDerecho) {
    return { ...base(propio?.periodo ?? ''), otras: null, motivo: archivo.motivo_excepcion_derecho, area: null };
  }

  if (!propio || propio.valor == null) return null;
  const periodo = propio.periodo;
  const registro = registros[periodo];
  if (!registro) return null;

  const otras = registro.otras_por_institucion[institucion];
  if (!otras) return null;

  // «!= null» descarta también un null explícito: nunca se muestra un 0 % que no publicó nadie.
  const promedio = carrera.area ? archivo.por_area[periodo]?.[carrera.area] : undefined;
  const area = carrera.area && promedio?.promedio_pct != null
    ? { nombre: carrera.area, instituciones: promedio.instituciones, promedio: promedio.promedio_pct }
    : null;

  if (otras.instituciones < 2 || otras.minimo_pct == null || otras.mediana_pct == null || otras.maximo_pct == null) {
    return { ...base(periodo), otras: null, motivo: otras.motivo ?? archivo.motivo_sin_tasa, area };
  }
  return {
    ...base(periodo),
    otras: { instituciones: otras.instituciones, minimo: otras.minimo_pct, mediana: otras.mediana_pct, maximo: otras.maximo_pct },
    motivo: null,
    area,
  };
}
