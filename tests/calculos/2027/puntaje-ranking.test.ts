import assert from 'node:assert/strict';
import test from 'node:test';

import { validarPuntajeRanking } from '../../../lib/calculos/2027/puntaje-ranking.ts';

// Ejemplo oficial: PA 6,33; PH 6,00; PMH 6,86; Puntaje Ranking aproximado 824.
// Fuente: «Instrumentos de acceso, especificaciones y procedimientos»,
// Admisión 2023, sección 1.2, página 9. La fórmula sigue vigente hasta la
// Admisión 2027 según el Acta N.º 75, anexo N.º 4, sección 2.1, páginas 53-55.
// https://acceso.mineduc.cl/wp-content/uploads/2022/06/2.-INSTRUMENTOS-ACCESO-ADM-2023.pdf
// https://acceso.mineduc.cl/wp-content/uploads/2025/10/Acta-sesion-N%C2%B075-10-de-septiembre-del-2025.pdf
// ADR 0018: la plataforma acepta el resultado oficial; no lo recalcula.
test('acepta el resultado del ejemplo oficial de Puntaje Ranking', () => {
  assert.equal(validarPuntajeRanking(824), 824);
});

test('acepta los límites oficiales del Puntaje Ranking', () => {
  assert.equal(validarPuntajeRanking(100), 100);
  assert.equal(validarPuntajeRanking(1000), 1000);
});

test('rechaza un Puntaje Ranking fuera de rango o que no es un número', () => {
  const mensaje = /Puntaje Ranking debe ser un número entre 100 y 1000/i;

  assert.throws(() => validarPuntajeRanking(99), mensaje);
  assert.throws(() => validarPuntajeRanking(1001), mensaje);
  assert.throws(() => validarPuntajeRanking(Number.NaN), mensaje);
  assert.throws(() => validarPuntajeRanking('700' as unknown as number), mensaje);
});
