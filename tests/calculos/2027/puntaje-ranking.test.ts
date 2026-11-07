import assert from 'node:assert/strict';
import { test } from 'node:test';

import { calcularPuntajeRanking, calcularRankingDelNivel } from '../../../lib/calculos/2027/puntaje-ranking.ts';

// Casos de borde publicados por DEMRE: NEM <= PROM conserva NEM; NEM >= MAX obtiene 1.000.
// Fuente: https://portaldemre.demre.cl/paes/factores-seleccion/puntaje-ranking
test('calcula el ranking de un nivel y conserva los límites oficiales', () => {
  assert.equal(calcularRankingDelNivel({ nem: 700, promedioReferencia: 700, maximoReferencia: 900 }), 700);
  assert.equal(calcularRankingDelNivel({ nem: 900, promedioReferencia: 700, maximoReferencia: 900 }), 1000);
  assert.equal(calcularRankingDelNivel({ nem: 825, promedioReferencia: 700, maximoReferencia: 900 }), 934.375);
});

test('promedia los cuatro rankings de enseñanza media', () => {
  const nivel = { nem: 700, promedioReferencia: 700, maximoReferencia: 900 };
  assert.equal(calcularPuntajeRanking([nivel, nivel, nivel, nivel]), 700);
});

test('rechaza referencias imposibles o una enseñanza media incompleta', () => {
  assert.throws(
    () => calcularRankingDelNivel({ nem: 700, promedioReferencia: 800, maximoReferencia: 700 }),
    /máximo de referencia/i,
  );
  assert.throws(() => calcularPuntajeRanking([]), /cuatro niveles/i);
});
