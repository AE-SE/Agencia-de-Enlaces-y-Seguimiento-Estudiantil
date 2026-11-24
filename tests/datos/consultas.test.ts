// Pruebas de las consultas del explorador y del comparador (sin red).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  parametrosPorGrupos,
  ventanaGrupoB,
  totalDesdeRango,
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

test('con dos o más palabras, dentro de cada carrera va primero la institución de nombre más corto', () => {
  const p = parametrosBusqueda({ texto: 'enfermería u chile', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.equal(p.get('order'), 'orden_carrera.asc,largo_institucion.asc,orden_institucion.asc,codigo_sies.asc');
});

test('con una sola palabra se mantiene el orden alfabético por institución', () => {
  const p = parametrosBusqueda({ texto: 'enfermería', regiones: [], tipos: [], jornadas: [] }, 1);
  assert.equal(p.get('order'), 'orden_carrera.asc,orden_institucion.asc,codigo_sies.asc');
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

const sinFiltros = { regiones: [], tipos: [], jornadas: [] };

test('con texto, el grupo A pide las carreras que empiezan con la primera palabra y el B las demás', () => {
  const grupos = parametrosPorGrupos({ texto: 'Ínge civil', ...sinFiltros }, 1)!;
  assert.equal(grupos.a.get('orden_carrera'), 'like.inge*');
  assert.equal(grupos.b.get('orden_carrera'), 'not.like.inge*');
  for (const p of [grupos.a, grupos.b]) {
    assert.deepEqual(p.getAll('texto_busqueda'), ['ilike.*inge*', 'ilike.*civil*']);
    assert.equal(p.get('order'), 'orden_carrera.asc,largo_institucion.asc,orden_institucion.asc,codigo_sies.asc');
  }
});

test('sin texto no hay grupos: una sola consulta', () => {
  assert.equal(parametrosPorGrupos({ texto: '  ', ...sinFiltros }, 1), null);
});

test('la ventana de B en la página 1 empieza en 0 y llena lo que A dejó libre', () => {
  assert.deepEqual(ventanaGrupoB(1, 10, 10), { offset: 0, limit: 15 });
});

test('en una página que cruza de A a B, B salta solo lo que A ya mostró antes', () => {
  // A tiene 30: la página 2 (filas 25 a 49) trae 5 de A y 20 de B desde su inicio.
  assert.deepEqual(ventanaGrupoB(2, 30, 5), { offset: 0, limit: 20 });
  // Página 3: A ya se agotó (0 filas); B salta las 20 que mostró antes.
  assert.deepEqual(ventanaGrupoB(3, 30, 0), { offset: 20, limit: 25 });
});

test('bordes de la ventana de B: A múltiplo exacto de la página y sin resultados', () => {
  // A tiene 25: la página 2 ya es solo B, desde su inicio.
  assert.deepEqual(ventanaGrupoB(2, 25, 0), { offset: 0, limit: 25 });
  // Sin resultados en A: B ocupa la página completa.
  assert.deepEqual(ventanaGrupoB(1, 0, 0), { offset: 0, limit: 25 });
});

test('cuando A llena la página, B pide limit 0 solo para contar', () => {
  assert.deepEqual(ventanaGrupoB(1, 100, 25), { offset: 0, limit: 0 });
});

test('el total se lee de content-range con o sin filas', () => {
  assert.equal(totalDesdeRango('0-24/3224', 25), 3224);
  assert.equal(totalDesdeRango('*/100', 0), 100);
  assert.equal(totalDesdeRango('0-24/*', 25), 25);
  assert.equal(totalDesdeRango(null, 7), 7);
});
