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

test('cada palabra busca en el texto de carrera, institución, sede y comuna, todas a la vez', () => {
  const p = parametrosBusqueda({ texto: 'civil informática', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.deepEqual(p.getAll('texto_busqueda'), ['ilike.*civil*', 'ilike.*informatica*']);
  assert.deepEqual(p.getAll('programa.nombre_normalizado'), []);
});

test('«enfermería u chile» genera tres filtros sobre texto_busqueda', () => {
  const p = parametrosBusqueda({ texto: 'enfermería u chile', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.deepEqual(p.getAll('texto_busqueda'), ['ilike.*enfermeria*', 'ilike.*u*', 'ilike.*chile*']);
});

test('los resultados se ordenan por carrera, luego institución y al final por código SIES', () => {
  const p = parametrosBusqueda({ texto: '', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.equal(p.get('order'), 'orden_carrera.asc,orden_institucion.asc,codigo_sies.asc');
});

test('con texto de búsqueda, dentro de cada carrera va primero la institución de nombre más corto', () => {
  const p = parametrosBusqueda({ texto: 'enfermería u chile', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.equal(p.get('order'), 'orden_carrera.asc,largo_institucion.asc,orden_institucion.asc,codigo_sies.asc');
});

test('con tilde, mayúsculas o eñe la búsqueda es la misma que sin ellas', () => {
  const buscar = (texto: string) => parametrosBusqueda({ texto, regiones: [], tipos: [], jornadas: [] }, 1).getAll('texto_busqueda');
  assert.deepEqual(buscar('Enfermería'), buscar('enfermeria'));
  assert.deepEqual(buscar('DISEÑO'), ['ilike.*diseno*']);
  assert.deepEqual(buscar('  Ingeniería,  (Civil)* '), ['ilike.*ingenieria*', 'ilike.*civil*']);
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
