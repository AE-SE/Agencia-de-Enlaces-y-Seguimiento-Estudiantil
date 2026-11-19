// Criterio de «alternativas cercanas» a la meta (N6). Función pura: no lee la red ni la base.
//
// Criterio, en una frase: carreras de la misma área y la misma región que la meta, cuyo puntaje de
// corte del año anterior fue igual o menor al de la meta, ordenadas de la más cercana a la más lejana.
//
// Por qué así:
// - «Área» es el área oficial del SIES (archivo de empleabilidad e ingresos, una por carrera genérica),
//   no una agrupación nuestra. Si una carrera no tiene área, no se puede decir qué es cercano y no entra.
// - «Región» es la de la sede (Mineduc): la persona suele poder estudiar donde vive.
// - «Alcanzable» se mide contra un dato publicado con su año: el puntaje ponderado de la última persona
//   seleccionada por la vía regular el año anterior (elaboración propia con Datos abiertos DEMRE 2026).
//   Se compara con el corte de la meta, no con un umbral inventado. No promete que alcance: el corte
//   cambia cada año y cada carrera pondera las pruebas distinto.
// - Las carreras que no se postulan por el sistema centralizado (muchas de CFT e IP) no piden ese
//   puntaje: van en una lista aparte, en orden de código, sin compararlas por puntaje.
// - Una carrera del sistema centralizado sin corte publicado no entra: no se puede decir si es alcanzable.
// - Sin puntaje único: no se mezclan empleabilidad, duración ni arancel en una nota con pesos que la
//   persona no eligió. Y el tipo no tiene ningún campo de cliente: la condición de cliente no puede
//   influir (AGENTS.md, 1).

import type { Carrera } from '../datos/carreras.ts';

export type CarreraComparable = {
  codigo_sies: string;
  area: string | null;
  region: string;
  puntaje_corte: number | null;
  // Verdadero si se postula por el sistema centralizado del DEMRE; ausente si no se sabe.
  admision_centralizada?: boolean;
};

export type Alternativas<T extends CarreraComparable> = {
  // Del sistema centralizado, con corte igual o menor al de la meta, de la más cercana a la más lejana.
  conCorte: T[];
  // Fuera del sistema centralizado: no piden ese puntaje.
  sinPuntajeCentralizado: T[];
};

export type OpcionesAlternativas = {
  // Códigos que no deben aparecer, por ejemplo las preferencias que la persona ya eligió.
  excluir?: readonly string[];
  // Máximo por lista. Sin límite si no se indica.
  limite?: number;
};

// Pasa una carrera de la oferta a la forma que compara el criterio. El corte viene de sus indicadores;
// si no tiene valor (sin dato o fuera del sistema centralizado), queda null.
export function aComparable(carrera: Pick<Carrera, 'codigo_sies' | 'region' | 'indicadores' | 'admision_centralizada'> & { area?: string }): CarreraComparable {
  const corte = carrera.indicadores.find((i) => i.tipo === 'puntaje_corte');
  return {
    codigo_sies: carrera.codigo_sies,
    area: carrera.area ?? null,
    region: carrera.region,
    puntaje_corte: corte?.valor ?? null,
    admision_centralizada: carrera.admision_centralizada,
  };
}

const porCodigo = (a: CarreraComparable, b: CarreraComparable) => a.codigo_sies.localeCompare(b.codigo_sies);

export function alternativasCercanas<T extends CarreraComparable>(
  meta: CarreraComparable,
  carreras: readonly T[],
  { excluir = [], limite }: OpcionesAlternativas = {},
): Alternativas<T> {
  const vacio: Alternativas<T> = { conCorte: [], sinPuntajeCentralizado: [] };
  if (meta.area === null) return vacio;

  const fuera = new Set([meta.codigo_sies, ...excluir]);
  const cercanas = carreras.filter(
    (c) => !fuera.has(c.codigo_sies) && c.area === meta.area && c.region === meta.region,
  );

  const corteMeta = meta.puntaje_corte;
  const conCorte =
    corteMeta === null
      ? []
      : cercanas
          .filter((c) => c.admision_centralizada !== false && c.puntaje_corte !== null && c.puntaje_corte <= corteMeta)
          .sort((a, b) => corteMeta - a.puntaje_corte! - (corteMeta - b.puntaje_corte!) || porCodigo(a, b));

  const sinPuntajeCentralizado = cercanas.filter((c) => c.admision_centralizada === false).sort(porCodigo);

  // Un límite negativo no debe cortar desde el final (slice lo haría): se trata como cero.
  const tope = limite === undefined ? undefined : Math.max(0, limite);
  return {
    conCorte: conCorte.slice(0, tope),
    sinPuntajeCentralizado: sinPuntajeCentralizado.slice(0, tope),
  };
}
