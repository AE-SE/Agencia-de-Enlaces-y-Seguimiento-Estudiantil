import assert from 'node:assert/strict';
import { test } from 'node:test';

import { slug, slugUnico } from '../../lib/datos/slug.ts';

test('crea un slug sin tildes, ñ, espacios ni paréntesis', () => {
  assert.equal(slug('Técnico en Niñez (Ñuble)'), 'tecnico-en-ninez-nuble');
});

test('agrega el código SIES cuando dos valores generan el mismo slug', () => {
  const valores = ['Ingeniería Civil', 'Ingenieria Civil'];
  assert.equal(slugUnico(valores[0], 'SIES-123', valores), 'ingenieria-civil-sies-123');
});
