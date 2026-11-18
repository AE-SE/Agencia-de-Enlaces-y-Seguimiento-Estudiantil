import assert from 'node:assert/strict';
import test from 'node:test';

import { validarPuntajeRanking } from '../../../lib/calculos/2027/puntaje-ranking.ts';

// ADR 0024: el Puntaje Ranking lo ingresa la persona estudiante; no se calcula.
// Ejemplo de Mineduc: PA 6,33; PH 6,00; PMH 6,86; PNHist 715; Ranking aproximado 824 (m = 331,4; b = 1000 − m × 6,86).
// TODO(fuente): la cita exacta de este ejemplo no se ha podido verificar. Se atribuye a «Instrumentos de acceso,
// especificaciones y procedimientos», Admisión 2023, sección 1.2, página 9, y a las publicaciones de Acceso Mineduc,
// pero esos PDF no estaban disponibles el 15 y el 17-nov-2026. Confirmar página y sección antes de citarlo como fuente.
test('acepta el resultado del ejemplo de Puntaje Ranking', () => {
  assert.equal(validarPuntajeRanking(824), 824);
});

test('acepta los límites oficiales del Puntaje Ranking', () => {
  assert.equal(validarPuntajeRanking(100), 100);
  // Caso interior genérico, separado del ejemplo.
  assert.equal(validarPuntajeRanking(700), 700);
  assert.equal(validarPuntajeRanking(1000), 1000);
});

test('rechaza un Puntaje Ranking fuera de rango o que no es un número', () => {
  const mensaje = /Puntaje Ranking debe ser un número entre 100 y 1000/i;

  assert.throws(() => validarPuntajeRanking(99), mensaje);
  assert.throws(() => validarPuntajeRanking(1001), mensaje);
  assert.throws(() => validarPuntajeRanking(Number.NaN), mensaje);
  assert.throws(() => validarPuntajeRanking('700' as unknown as number), mensaje);
});
