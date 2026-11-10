import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  calcularPuntajePonderado,
  calcularPuntajePromedio,
  cumpleRequisitosMinimos,
  elegirMejorPuntajeElectivo,
} from '../../../lib/calculos/2027/puntaje-ponderado.ts';

// Ejemplo publicado por DEMRE: (825×0,15)+(870×0,20)+(700×0,10)+(900×0,35)+(820×0,10)+(840×0,10)=848,75.
// Fuente: «Oferta Definitiva de Carreras, Vacantes y Ponderaciones»,
// Admisión 2027, página 5.
// https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf
test('calcula el ejemplo oficial del puntaje ponderado', () => {
  const resultado = calcularPuntajePonderado([
    { puntaje: 825, ponderacion: 15 },
    { puntaje: 870, ponderacion: 20 },
    { puntaje: 700, ponderacion: 10 },
    { puntaje: 900, ponderacion: 35 },
    { puntaje: 820, ponderacion: 10 },
    { puntaje: 840, ponderacion: 10 },
  ]);

  assert.equal(resultado, 848.75);
});

test('usa la electiva de mayor puntaje cuando se rindieron Ciencias e Historia', () => {
  assert.equal(elegirMejorPuntajeElectivo(650, 820), 820);
  assert.equal(elegirMejorPuntajeElectivo(650, null), 650);
});

test('evalúa los mínimos ponderado y promedio de Competencia Lectora y M1', () => {
  const puntajes = { competenciaLectora: 650, matematica1: 550 };
  assert.equal(calcularPuntajePromedio(puntajes), 600);
  assert.equal(
    cumpleRequisitosMinimos(650, puntajes, { puntajePonderadoMinimo: 650, puntajePromedioMinimo: 600 }),
    true,
  );
  assert.equal(
    cumpleRequisitosMinimos(649, puntajes, { puntajePonderadoMinimo: 650, puntajePromedioMinimo: 600 }),
    false,
  );
});

test('rechaza ponderaciones que no representan la oferta publicada', () => {
  assert.throws(
    () => calcularPuntajePonderado([{ puntaje: 700, ponderacion: 99 }]),
    /deben sumar 100/i,
  );
});
