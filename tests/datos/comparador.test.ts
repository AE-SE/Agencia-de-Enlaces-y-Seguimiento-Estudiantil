import assert from 'node:assert/strict';
import { test } from 'node:test';

import { carrerasDesdeCodigos, rutaDelComparador } from '../../lib/datos/comparador.ts';
import { listarCarreras } from '../../lib/datos/carreras.ts';

const carreras = listarCarreras();

test('lee hasta tres carreras únicas desde el enlace compartible', () => {
  const seleccionadas = carrerasDesdeCodigos(
    `${carreras[0].codigo_sies},${carreras[1].codigo_sies},${carreras[0].codigo_sies},${carreras[2].codigo_sies}`,
    carreras,
  );

  assert.deepEqual(seleccionadas.map((carrera) => carrera.codigo_sies), carreras.slice(0, 3).map((carrera) => carrera.codigo_sies));
});

test('descarta códigos que no están en los datos de ejemplo', () => {
  assert.deepEqual(carrerasDesdeCodigos('no-existe', carreras), []);
});

test('crea un enlace sin datos personales', () => {
  assert.equal(
    rutaDelComparador(carreras.slice(0, 2)),
    `/comparador?carreras=${carreras[0].codigo_sies},${carreras[1].codigo_sies}`,
  );
});
