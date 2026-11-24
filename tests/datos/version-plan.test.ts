import assert from 'node:assert/strict';
import test from 'node:test';

import { codigosRepetidos, textoDeVersion, versionDelPlan } from '../../lib/datos/version-plan.ts';

const oferta = (codigo_sies: string, sede = 'Santiago', jornada = 'Diurna') => ({
  codigo_sies, carrera: 'ACTUACION TEATRAL', institucion: { nombre: 'UNIVERSIDAD DE CHILE' }, sede, jornada,
});

test('lee la versión del plan desde el final del código SIES', () => {
  assert.equal(versionDelPlan('I70S1C68J1V2'), 2);
  assert.equal(versionDelPlan('I10S7C380J4V12'), 12);
  assert.equal(versionDelPlan('sin-version'), null);
  assert.equal(textoDeVersion('I70S1C68J1V2'), 'Versión 2 del plan de estudios');
  assert.equal(textoDeVersion('sin-version'), '');
});

test('marca solo las ofertas que a la vista son iguales', () => {
  const lista = [oferta('I70S1C68J1V1'), oferta('I70S1C68J1V2'), oferta('I70S2C68J1V1', 'Otra sede'), oferta('I70S1C68J2V1', 'Santiago', 'Vespertina')];
  assert.deepEqual([...codigosRepetidos(lista)], ['I70S1C68J1V1', 'I70S1C68J1V2']);
});

test('sin gemelas en la lista no marca ninguna', () => {
  assert.equal(codigosRepetidos([oferta('I70S1C68J1V2')]).size, 0);
});

test('junta igual que la pantalla (mayúsculas y tildes) y no marca códigos sin versión', () => {
  const conTilde = { ...oferta('I70S1C68J1V2'), carrera: 'Actuación Teatral' };
  assert.equal(codigosRepetidos([oferta('I70S1C68J1V1'), conTilde]).size, 2);
  assert.equal(codigosRepetidos([oferta('SIN-V'), oferta('SIN-V2X')]).size, 0);
});

test('la hoja suma la versión al nombre solo de las opciones gemelas', async () => {
  const { nombreCompleto } = await import('../../lib/datos/hoja.ts');
  const gemela = oferta('I70S1C68J1V2') as unknown as Parameters<typeof nombreCompleto>[0];
  assert.equal(nombreCompleto(gemela), 'ACTUACION TEATRAL · UNIVERSIDAD DE CHILE · Santiago · Diurna');
  assert.equal(nombreCompleto(gemela, new Set(['I70S1C68J1V2'])), 'ACTUACION TEATRAL · UNIVERSIDAD DE CHILE · Santiago · Diurna · Versión 2 del plan de estudios');
});
