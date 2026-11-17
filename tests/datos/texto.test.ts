import assert from 'node:assert/strict';
import test from 'node:test';

import { textoParaLectura } from '../../lib/datos/texto.ts';

test('normaliza nombres para que el lector anuncie palabras', () => {
  assert.equal(textoParaLectura('DUOC UC'), 'duoc uc');
});
