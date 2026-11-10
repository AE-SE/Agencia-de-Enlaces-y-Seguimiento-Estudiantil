// Pruebas de las consultas del explorador y del comparador (sin red).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  filtrosDesdeUrl,
  listaPostgrest,
  palabrasSeguras,
  paginaDesdeUrl,
  parametrosBusqueda,
  POR_PAGINA,
  totalPaginas,
} from '../../lib/datos/consultas.ts';
import { codigoDeSegmento, rutaDeCarrera } from '../../lib/datos/ruta.ts';

test('las palabras se limpian de caracteres que rompen la consulta', () => {
  assert.deepEqual(palabrasSeguras('  Enfermería, (a)* %x_ '), ['Enfermería', 'a', 'x']);
});

test('cada palabra busca en el nombre de la carrera, en todas las palabras a la vez', () => {
  const p = parametrosBusqueda({ texto: 'civil informática', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.deepEqual(p.getAll('programa.nombre'), ['ilike.*civil*', 'ilike.*informática*']);
});

test('las regiones desconocidas se descartan', () => {
  const p = parametrosBusqueda({ texto: '', regiones: ['Metropolitana', 'Narnia'], tipos: [], jornadas: [] }, 1);
  assert.equal(p.get('region'), 'in.("Metropolitana")');
});

test('los tipos de institución filtran por la institución del programa', () => {
  const p = parametrosBusqueda({ texto: '', regiones: [], tipos: ['universidad'], jornadas: [] }, 1);
  assert.equal(p.get('programa.institucion.tipo'), 'in.("universidad")');
});

test('la paginación trae 25 por página y calcula el desplazamiento', () => {
  const p = parametrosBusqueda({ texto: '', regiones: [], tipos: [], jornadas: [] }, 3);
  assert.equal(p.get('limit'), String(POR_PAGINA));
  assert.equal(p.get('offset'), String(2 * POR_PAGINA));
});

test('una página inválida vuelve a la primera', () => {
  assert.equal(paginaDesdeUrl({ pagina: 'abc' }), 1);
  assert.equal(paginaDesdeUrl({ pagina: '-4' }), 1);
  assert.equal(paginaDesdeUrl({ pagina: '7' }), 7);
});

test('los filtros se leen de la dirección, con valores repetidos', () => {
  const f = filtrosDesdeUrl({ q: 'enfermería', region: ['Metropolitana', 'Biobío'], jornada: 'Diurna' });
  assert.equal(f.texto, 'enfermería');
  assert.deepEqual(f.regiones, ['Metropolitana', 'Biobío']);
  assert.deepEqual(f.jornadas, ['Diurna']);
});

test('el total de páginas nunca es cero', () => {
  assert.equal(totalPaginas(0), 1);
  assert.equal(totalPaginas(26), 2);
});

test('los valores con comillas no rompen la lista', () => {
  assert.equal(listaPostgrest(['a"b']), 'in.("ab")');
});

test('la ruta incluye el código SIES al final y se puede recuperar', () => {
  const ruta = rutaDeCarrera({
    carrera: 'Enfermería',
    sede: 'Santiago',
    codigo_sies: 'I70S1C41J1V1',
    institucion: { nombre: 'Universidad de Chile', tipo: 'universidad' },
  });
  assert.equal(ruta, '/carreras/universidad-de-chile/enfermeria-santiago-i70s1c41j1v1');
  assert.equal(codigoDeSegmento('enfermeria-santiago-i70s1c41j1v1'), 'i70s1c41j1v1');
});
