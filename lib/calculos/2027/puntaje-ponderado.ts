/**
 * Puntaje ponderado de selección, Proceso de Admisión 2027.
 * Fuente: https://portaldemre.demre.cl/paes/factores-seleccion/
 * Consultada el 2026-11-07.
 *
 * Cada carrera entrega sus factores y ponderaciones desde la carga DEMRE; no
 * hay ponderaciones ni requisitos fijos en este módulo.
 */

const PUNTAJE_MINIMO = 100;
const PUNTAJE_MAXIMO = 1000;

export type FactorPonderado = Readonly<{
  puntaje: number;
  ponderacion: number;
}>;

export type RequisitosMinimos = Readonly<{
  puntajePonderadoMinimo?: number | null;
  puntajePromedioMinimo?: number | null;
}>;

export type PuntajesObligatorios = Readonly<{
  competenciaLectora: number;
  matematica1: number;
}>;

function validarPuntaje(nombre: string, puntaje: number): void {
  if (!Number.isFinite(puntaje) || puntaje < PUNTAJE_MINIMO || puntaje > PUNTAJE_MAXIMO) {
    throw new RangeError(`${nombre} debe estar entre ${PUNTAJE_MINIMO} y ${PUNTAJE_MAXIMO}.`);
  }
}

/** DEMRE usa la electiva de mayor puntaje cuando una carrera admite ambas. */
export function elegirMejorPuntajeElectivo(ciencias: number | null, historia: number | null): number {
  if (ciencias === null && historia === null) {
    throw new RangeError('Debes indicar Ciencias o Historia y Ciencias Sociales.');
  }
  if (ciencias !== null) validarPuntaje('El puntaje de Ciencias', ciencias);
  if (historia !== null) validarPuntaje('El puntaje de Historia y Ciencias Sociales', historia);

  return Math.max(ciencias ?? PUNTAJE_MINIMO, historia ?? PUNTAJE_MINIMO);
}

/** Suma los factores publicados por la carrera; sus ponderaciones deben totalizar 100 %. */
export function calcularPuntajePonderado(factores: readonly FactorPonderado[]): number {
  if (factores.length === 0) throw new RangeError('Debes indicar al menos un factor de selección.');

  const sumaPonderaciones = factores.reduce((total, factor) => {
    validarPuntaje('Cada puntaje', factor.puntaje);
    if (!Number.isInteger(factor.ponderacion) || factor.ponderacion < 0 || factor.ponderacion > 100) {
      throw new RangeError('Cada ponderación debe ser un porcentaje entero entre 0 y 100.');
    }
    return total + factor.ponderacion;
  }, 0);

  if (sumaPonderaciones !== 100) {
    throw new RangeError(`Las ponderaciones deben sumar 100; suman ${sumaPonderaciones}.`);
  }

  return factores.reduce((total, factor) => total + factor.puntaje * (factor.ponderacion / 100), 0);
}

export function calcularPuntajePromedio({ competenciaLectora, matematica1 }: PuntajesObligatorios): number {
  validarPuntaje('El puntaje de Competencia Lectora', competenciaLectora);
  validarPuntaje('El puntaje de Matemática 1', matematica1);
  return (competenciaLectora + matematica1) / 2;
}

/** Indica si se cumplen los mínimos publicados por una carrera, cuando existan. */
export function cumpleRequisitosMinimos(
  puntajePonderado: number,
  puntajesObligatorios: PuntajesObligatorios,
  requisitos: RequisitosMinimos,
): boolean {
  validarPuntaje('El puntaje ponderado', puntajePonderado);
  const puntajePromedio = calcularPuntajePromedio(puntajesObligatorios);

  for (const requisito of [requisitos.puntajePonderadoMinimo, requisitos.puntajePromedioMinimo]) {
    if (requisito !== null && requisito !== undefined) validarPuntaje('Cada requisito mínimo', requisito);
  }

  return (requisitos.puntajePonderadoMinimo === null
      || requisitos.puntajePonderadoMinimo === undefined
      || puntajePonderado >= requisitos.puntajePonderadoMinimo)
    && (requisitos.puntajePromedioMinimo === null
      || requisitos.puntajePromedioMinimo === undefined
      || puntajePromedio >= requisitos.puntajePromedioMinimo);
}
