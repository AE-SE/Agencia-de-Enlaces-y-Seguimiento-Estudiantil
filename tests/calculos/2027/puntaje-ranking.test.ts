import assert from 'node:assert/strict';
import test from 'node:test';

import { validarPuntajeRanking } from '../../../lib/calculos/2027/puntaje-ranking.ts';

// ADR 0024: el Puntaje Ranking lo ingresa la persona estudiante; no se calcula.
// Fuente: Mineduc, Instrumentos de acceso, Admisión 2027, sección 1.2, apartado I.b.
// https://acceso.mineduc.cl/wp-content/uploads/2026/03/INSTRUMENTOS-ACCESO-MARZO-2027.pdf
// Consulta: 2026-11-26. PA 6,33; PH 6,00; PMH 6,86; PNHist 715. Resultado publicado: ≈824.
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
