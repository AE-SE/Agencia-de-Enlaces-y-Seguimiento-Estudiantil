/**
 * Puntaje Ranking, Proceso de Admisión 2027.
 *
 * Según la decisión 0024, la plataforma no calcula este puntaje: la persona
 * estudiante ingresa el valor oficial que recibió. Solo se valida su rango.
 *
 * Fuente: Acta de la sesión N.º 75 del Comité Técnico de Acceso, anexo 4,
 * sección 2.1, letra a), página 54 (consulta: 2026-11-26). El ADR 0024
 * documenta la fórmula y el enlace oficial para la Admisión 2027.
 */
const PUNTAJE_MINIMO = 100;
const PUNTAJE_MAXIMO = 1000;

export function validarPuntajeRanking(puntaje: number): number {
  if (
    typeof puntaje !== 'number' ||
    !Number.isFinite(puntaje) ||
    puntaje < PUNTAJE_MINIMO ||
    puntaje > PUNTAJE_MAXIMO
  ) {
    throw new RangeError(
      `El Puntaje Ranking debe ser un número entre ${PUNTAJE_MINIMO} y ${PUNTAJE_MAXIMO}.`,
    );
  }

  return puntaje;
}
