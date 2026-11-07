import assert from 'node:assert/strict';
import { test } from 'node:test';

import { listarCarreras, obtenerCarrera } from '../../lib/datos/carreras.ts';

test('obtiene una carrera existente', () => {
  const carrera = obtenerCarrera('I70S1C41J1V1');
  assert.equal(carrera?.carrera, 'Enfermería');
  assert.equal(listarCarreras()[0], carrera);
});

test('devuelve null para un código inexistente', () => {
  assert.equal(obtenerCarrera('no-existe'), null);
});

test('conserva los indicadores sin dato y su motivo', () => {
  const carrera = obtenerCarrera('I70S1C41J1V1');
  const indicador = carrera?.indicadores.find((item) => item.tipo === 'ingreso_promedio_4to_anio');
  assert.equal(indicador?.valor, null);
  assert.ok(indicador && 'motivo_sin_dato' in indicador);
  assert.ok(indicador.motivo_sin_dato);
});

test('los motivos sin dato se explican sin lenguaje técnico', () => {
  for (const carrera of listarCarreras()) {
    for (const indicador of carrera.indicadores) {
      if ('motivo_sin_dato' in indicador) {
        assert.doesNotMatch(indicador.motivo_sin_dato, /No se cargó|este campo exige|SIES|DEMRE|'s\/i'/);
      }
    }
  }
});

test('cada indicador conserva fuente, URL y fecha de consulta', () => {
  for (const carrera of listarCarreras()) {
    for (const indicador of carrera.indicadores) {
      assert.ok(indicador.fuente);
      assert.match(indicador.url, /^https:\/\//);
      assert.match(indicador.fecha_consulta, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(indicador.nivel === 'programa' || indicador.nivel === 'variante');
    }
  }
});
