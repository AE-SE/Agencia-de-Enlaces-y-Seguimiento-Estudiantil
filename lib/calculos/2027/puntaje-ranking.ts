/**
 * Puntaje Ranking, Proceso de Admisión 2027.
 * Fuente: https://portaldemre.demre.cl/paes/factores-seleccion/puntaje-ranking
 * Consultada el 2026-11-07.
 *
 * Las poblaciones de referencia las entrega el Ministerio de Educación. Esta
 * función no intenta reconstruirlas ni inferir datos de establecimientos.
 */

const PUNTAJE_MINIMO = 100;
const PUNTAJE_MAXIMO = 1000;

export type NivelDeEnsenanzaMedia = Readonly<{
  nem: number;
  promedioReferencia: number;
  maximoReferencia: number;
}>;

function validarPuntaje(nombre: string, puntaje: number): void {
  if (!Number.isFinite(puntaje) || puntaje < PUNTAJE_MINIMO || puntaje > PUNTAJE_MAXIMO) {
    throw new RangeError(`${nombre} debe estar entre ${PUNTAJE_MINIMO} y ${PUNTAJE_MAXIMO}.`);
  }
}

/** Calcula R1, R2, R3 o R4 según la fórmula publicada por DEMRE. */
export function calcularRankingDelNivel(nivel: NivelDeEnsenanzaMedia): number {
  validarPuntaje('El puntaje NEM', nivel.nem);
  validarPuntaje('El promedio de referencia', nivel.promedioReferencia);
  validarPuntaje('El máximo de referencia', nivel.maximoReferencia);

  if (nivel.maximoReferencia < nivel.promedioReferencia) {
    throw new RangeError('El máximo de referencia no puede ser menor que el promedio de referencia.');
  }
  if (nivel.nem <= nivel.promedioReferencia) return nivel.nem;
  if (nivel.nem >= nivel.maximoReferencia) return PUNTAJE_MAXIMO;
  if (nivel.maximoReferencia === nivel.promedioReferencia) {
    throw new RangeError('La población de referencia no permite calcular el ranking intermedio.');
  }

  return nivel.nem
    + (PUNTAJE_MAXIMO - nivel.nem)
      * ((nivel.nem - nivel.promedioReferencia) / (nivel.maximoReferencia - nivel.promedioReferencia));
}

/** El Ranking final es el promedio de los cuatro niveles de enseñanza media. */
export function calcularPuntajeRanking(niveles: readonly NivelDeEnsenanzaMedia[]): number {
  if (niveles.length !== 4) {
    throw new RangeError('El puntaje Ranking requiere los cuatro niveles de enseñanza media.');
  }

  return niveles.reduce((total, nivel) => total + calcularRankingDelNivel(nivel), 0) / niveles.length;
}
