import assert from 'node:assert/strict';
import { test } from 'node:test';

import { filtrarCarreras, normalizar, ordenarAlfabetico } from '../../lib/datos/buscar.ts';
import { listarCarreras } from '../../lib/datos/carreras.ts';
import { rutaDeCarrera } from '../../lib/datos/ruta.ts';

const carreras = listarCarreras();

test('normaliza tildes, mayusculas y signos', () => {
  assert.equal(normalizar('Enfermería: ¡TÉCNICA!'), 'enfermeria tecnica');
  assert.equal(filtrarCarreras(carreras, { texto: 'ENFERMERIA' })[0]?.carrera, 'Enfermería');
});

test('encuentra todas las palabras en carrera, institucion, sede o comuna', () => {
  const resultados = filtrarCarreras(carreras, { texto: 'enfermeria concepcion' });
  assert.equal(resultados.length, 1);
  assert.ok(resultados.every((carrera) => carrera.comuna === 'Concepción'));
});

test('combina los filtros de region, tipo y jornada sin aplicar seleccion vacia', () => {
  const resultados = filtrarCarreras(carreras, {
    regiones: ['Biobío'],
    tipos: ['centro_formacion_tecnica'],
    jornadas: ['diurna'],
  });
  assert.equal(resultados.length, 2);
  assert.equal(filtrarCarreras(carreras, { regiones: [], tipos: [], jornadas: [] }).length, carreras.length);
});

test('devuelve una lista vacia cuando no hay coincidencias', () => {
  assert.deepEqual(filtrarCarreras(carreras, { texto: 'carrera inexistente' }), []);
});

test('ordena solo por carrera y luego institucion en espanol', () => {
  const ordenadas = ordenarAlfabetico(carreras);
  for (let indice = 1; indice < ordenadas.length; indice += 1) {
    const anterior = ordenadas[indice - 1];
    const actual = ordenadas[indice];
    assert.ok(
      anterior.carrera.localeCompare(actual.carrera, 'es') < 0
        || (anterior.carrera === actual.carrera
          && anterior.institucion.nombre.localeCompare(actual.institucion.nombre, 'es') <= 0),
    );
  }
});

test('crea la misma ruta que usa la ficha de carrera', () => {
  const carrera = carreras.find((item) => item.codigo_sies === 'I70S1C41J1V1');
  assert.equal(rutaDeCarrera(carrera!, carreras), '/carreras/universidad-de-chile/enfermeria-santiago');
});
