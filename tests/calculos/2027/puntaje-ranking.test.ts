import assert from 'node:assert/strict';
import { test } from 'node:test';

import { calcularPuntajeRanking, calcularRankingDelNivel } from '../../../lib/calculos/2027/puntaje-ranking.ts';

// Casos sintéticos de la ecuación y sus bordes. DEMRE describe los casos, pero no publica
// un ejemplo numérico resuelto en la sección 3 consultada el 2026-11-07:
// https://portaldemre.demre.cl/paes/factores-seleccion/puntaje-ranking
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
