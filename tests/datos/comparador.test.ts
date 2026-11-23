import assert from 'node:assert/strict';
import { test } from 'node:test';

import { carrerasDesdeCodigos, rutaDelComparador, rutaDelComparadorConBusqueda } from '../../lib/datos/comparador.ts';
import { listarCarreras } from '../../lib/datos/carreras.ts';

// Las pruebas usan la muestra, no la oferta exportada.
process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

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

test('el enlace con búsqueda conserva el texto y los filtros', () => {
  const sinFiltros = { texto: '', regiones: [], tipos: [], jornadas: [] };
  assert.equal(rutaDelComparadorConBusqueda([], sinFiltros), '/comparador');
  assert.equal(
    rutaDelComparadorConBusqueda(carreras.slice(0, 1), sinFiltros),
    `/comparador?carreras=${carreras[0].codigo_sies}`,
  );
  const ruta = rutaDelComparadorConBusqueda(carreras.slice(0, 2), {
    texto: 'enfermería',
    regiones: ['Región Metropolitana de Santiago'],
    tipos: ['universidad'],
    jornadas: ['Diurno', 'Vespertino'],
  });
  const params = new URL(ruta, 'http://x').searchParams;
  assert.equal(params.get('carreras'), `${carreras[0].codigo_sies},${carreras[1].codigo_sies}`);
  assert.equal(params.get('q'), 'enfermería');
  assert.deepEqual(params.getAll('region'), ['Región Metropolitana de Santiago']);
  assert.deepEqual(params.getAll('tipo'), ['universidad']);
  assert.deepEqual(params.getAll('jornada'), ['Diurno', 'Vespertino']);
  // La coma entre carreras queda literal, igual que en rutaDelComparador.
  assert.ok(ruta.startsWith(`/comparador?carreras=${carreras[0].codigo_sies},${carreras[1].codigo_sies}&`));
});

test('el enlace con búsqueda escapa signos del texto sin romper la dirección', () => {
  const ruta = rutaDelComparadorConBusqueda(carreras.slice(0, 1), { texto: 'a&b #c 100% d+e', regiones: [], tipos: [], jornadas: [] });
  const params = new URL(ruta, 'http://x').searchParams;
  assert.equal(params.get('q'), 'a&b #c 100% d+e');
  assert.equal(params.get('carreras'), carreras[0].codigo_sies);
  assert.equal([...params.keys()].length, 2);
});
