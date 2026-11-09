/**
 * Puntaje Ranking, Proceso de Admisión 2027.
 *
 * La fórmula vigente hasta la Admisión 2027 está publicada en el Acta de la
 * sesión N.º 75 del Comité Técnico de Acceso, anexo N.º 4, sección 2.1,
 * páginas 53 a 55:
 * https://acceso.mineduc.cl/wp-content/uploads/2025/10/Acta-sesion-N%C2%B075-10-de-septiembre-del-2025.pdf
 *
 * Para un mismo establecimiento:
 * PA = Promedio Acumulado; PH = Promedio Histórico; PMH = Promedio Máximo
 * Histórico; PNHist = Puntaje NEM equivalente al PH.
 * - si PA <= PH, Ranking = Puntaje NEM;
 * - si PH < PA <= PMH, Ranking = b + m * PA, donde
 *   m = (1000 - PNHist) / (PMH - PH) y b = 1000 - m * PMH;
 * - si PMH < PA, Ranking = 1000.
 *
 * Según la decisión 0018, la plataforma no calcula este puntaje: la persona
 * estudiante ingresa el valor oficial que recibió. Solo se valida su rango.
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
