import assert from 'node:assert/strict';
import test from 'node:test';

import { fechaLarga } from '../../lib/datos/fechas.ts';

test('escribe la fecha en lenguaje claro', () => {
  assert.equal(fechaLarga('2026-11-04'), '4 de noviembre de 2026');
});

test('no cambia de día por la zona horaria', () => {
  assert.equal(fechaLarga('2026-01-01'), '1 de enero de 2026');
});
