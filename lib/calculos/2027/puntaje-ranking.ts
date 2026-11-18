/**
 * Puntaje Ranking, Proceso de Admisión 2027.
 *
 * Según la decisión 0024, la plataforma no calcula este puntaje: la persona
 * estudiante ingresa el valor oficial que recibió. Solo se valida su rango.
 *
 * TODO(fuente): la fórmula que Acceso Mineduc publica como vigente hasta la Admisión 2027 (Acta de la sesión N.º 75
 * del Comité Técnico de Acceso, anexo N.º 4, sección 2.1) no se ha podido verificar en el documento: el sitio
 * devolvía un aviso de mantenimiento el 15 y el 17-nov-2026. Resumen sin verificar, para un mismo establecimiento
 * (PA promedio acumulado, PH promedio histórico, PMH promedio máximo histórico, PNHist puntaje NEM equivalente al PH):
 * si PA <= PH, Ranking = Puntaje NEM; si PH < PA <= PMH, Ranking = b + m * PA con m = (1000 - PNHist) / (PMH - PH)
 * y b = 1000 - m * PMH; si PA > PMH, Ranking = 1000. Esta función no la implementa: ver el ADR 0024.
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
