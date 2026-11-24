import assert from 'node:assert/strict';
import test from 'node:test';

import { fechaLarga, periodoLegible } from '../../lib/datos/fechas.ts';

test('escribe la fecha en lenguaje claro', () => {
  assert.equal(fechaLarga('2026-11-04'), '4 de noviembre de 2026');
});

test('no cambia de día por la zona horaria', () => {
  assert.equal(fechaLarga('2026-01-01'), '1 de enero de 2026');
});

test('el período muestra sus fechas en lenguaje claro y deja el resto igual', () => {
  assert.equal(periodoLegible('Admisión 2027, oferta definitiva (2026-09-24)'), 'Admisión 2027, oferta definitiva (24 de septiembre de 2026)');
  assert.equal(periodoLegible('titulados 2021 a 2023; años de ingreso 2022 a 2024'), 'titulados 2021 a 2023; años de ingreso 2022 a 2024');
  assert.equal(periodoLegible('corte (2026-02-32)'), 'corte (2026-02-32)');
});
