import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { Carrera, Indicador } from '../../lib/datos/carreras.ts';
import { comparacionDeEmpleabilidad, institucionDeCodigoSies } from '../../lib/datos/comparaciones.ts';
import datos from '../../lib/datos/comparaciones-empleabilidad.json' with { type: 'json' };

// Valores de contraste: lib/datos/comparaciones-empleabilidad.json, que sale de la salida de
// datos/comparar_empleabilidad.py sobre el Buscador de Empleabilidad e Ingresos 2025-2026 del SIES.
const PERIODO = 'titulados 2021 a 2023; años de ingreso 2022 a 2024';
type Cifras = { instituciones: number; minimo_pct: number; mediana_pct: number; maximo_pct: number };
const enfermeria = (datos.por_carrera.enfermeria as unknown as Record<string, { todas: Cifras; otras_por_institucion: Record<string, Cifras> }>)[PERIODO];
const salud = (datos.por_area as unknown as Record<string, Record<string, { instituciones: number; promedio_pct: number }>>)[PERIODO].Salud;

function empleabilidad(valor: number | null, periodo = PERIODO): Indicador {
  const base = { tipo: 'empleabilidad_1er_anio', nivel: 'programa', unidad: 'porcentaje', periodo, fuente: 'SIES', url: 'https://ejemplo.invalid', fecha_consulta: '2026-11-05' } as const;
  return valor === null ? { ...base, valor: null, motivo_sin_dato: 'El SIES no lo publica.' } : { ...base, valor };
}

function carrera(codigo: string, extra: Partial<Carrera>): Carrera {
  return {
    codigo_sies: codigo, carrera: 'Prueba', institucion: { nombre: 'Institución de prueba', tipo: 'universidad' },
    sede: '', comuna: '', region: '', jornada: '', duracion_semestres: 8, indicadores: [], ...extra,
  };
}

test('saca el código de institución del código único del SIES', () => {
  assert.equal(institucionDeCodigoSies('I86S5C208J1V1'), '86');
  assert.equal(institucionDeCodigoSies('I90S1C22J1V1'), '90');
  assert.equal(institucionDeCodigoSies('sin-codigo'), null);
});

test('Enfermería PUC compara con las otras instituciones y con el área Salud', () => {
  const c = comparacionDeEmpleabilidad(carrera('I86S5C208J1V1', { generica: 'enfermeria', area: 'Salud', indicadores: [empleabilidad(85.53)] }));
  const otras = enfermeria.otras_por_institucion['86'];
  assert.deepEqual(c?.otras, { instituciones: otras.instituciones, minimo: otras.minimo_pct, mediana: otras.mediana_pct, maximo: otras.maximo_pct });
  // «Otras» deja fuera a la propia institución: son una menos que «todas».
  assert.equal(c?.otras?.instituciones, enfermeria.todas.instituciones - 1);
  assert.deepEqual(c?.area, { nombre: 'Salud', instituciones: salud.instituciones, promedio: salud.promedio_pct });
  assert.equal(c?.periodo, PERIODO);
  assert.equal(c?.atribucion, 'elaboración propia');
  assert.equal(c?.motivo, null);
});

test('Enfermería Austral usa las cifras de su propia institución excluida', () => {
  const c = comparacionDeEmpleabilidad(carrera('I90S1C22J1V1', { generica: 'enfermeria', area: 'Salud', indicadores: [empleabilidad(82.54)] }));
  const otras = enfermeria.otras_por_institucion['90'];
  assert.equal(c?.otras?.mediana, otras.mediana_pct);
  assert.equal(c?.otras?.instituciones, otras.instituciones);
});

test('sin área, la comparación con las otras instituciones sigue', () => {
  const c = comparacionDeEmpleabilidad(carrera('I86S5C208J1V1', { generica: 'enfermeria', indicadores: [empleabilidad(85.53)] }));
  assert.ok(c?.otras);
  assert.equal(c?.area, null);
});

test('sin carrera genérica no hay comparación', () => {
  assert.equal(comparacionDeEmpleabilidad(carrera('I86S5C208J1V1', { indicadores: [empleabilidad(85.53)] })), null);
});

test('sin indicador o sin cifra propia no hay comparación', () => {
  assert.equal(comparacionDeEmpleabilidad(carrera('I86S5C208J1V1', { generica: 'enfermeria' })), null);
  assert.equal(comparacionDeEmpleabilidad(carrera('I86S5C208J1V1', { generica: 'enfermeria', indicadores: [empleabilidad(null)] })), null);
});

test('con un período distinto al de la comparación no hay comparación', () => {
  assert.equal(comparacionDeEmpleabilidad(carrera('I86S5C208J1V1', { generica: 'enfermeria', indicadores: [empleabilidad(85.53, 'titulados 2019 a 2021')] })), null);
});

test('con menos de dos instituciones dice «Sin datos suficientes» y no inventa cifras', () => {
  const c = comparacionDeEmpleabilidad(carrera('I83S1C1J1V1', { generica: 'bibliotecologia', area: 'Ciencias Sociales', indicadores: [empleabilidad(60)] }));
  assert.equal(c?.otras, null);
  assert.equal(c?.motivo, 'Sin datos suficientes');
});

test('Derecho devuelve su motivo en vez de cifras', () => {
  const periodo = Object.keys(datos.por_carrera.derecho)[0];
  const c = comparacionDeEmpleabilidad(carrera('I86S1C1J1V1', { generica: 'derecho', area: 'Derecho', indicadores: [empleabilidad(50, periodo)] }));
  assert.equal(c?.otras, null);
  assert.equal(c?.area, null);
  assert.equal(c?.motivo, datos.motivo_excepcion_derecho);
});

test('Derecho sin cifra propia y con período distinto igual explica su motivo', () => {
  // Así viene en la muestra local: valor nulo y el período con el aviso de la excepción al final.
  const periodo = 'titulados 2020 a 2022; años de ingreso 2022 a 2024 (excepción de Derecho: indicador equivalente al 2.º año)';
  const c = comparacionDeEmpleabilidad(carrera('I86S1C1J1V1', { generica: 'derecho', indicadores: [empleabilidad(null, periodo)] }));
  assert.equal(c?.otras, null);
  assert.equal(c?.area, null);
  assert.equal(c?.motivo, datos.motivo_excepcion_derecho);
});

test('una entrada con una sola institución no muestra cifras aunque las traiga', () => {
  const generica = Object.entries(datos.por_carrera as unknown as Record<string, Record<string, { otras_por_institucion: Record<string, Cifras> }>>)
    .flatMap(([g, porPeriodo]) => Object.entries(porPeriodo[PERIODO]?.otras_por_institucion ?? {}).map(([inst, o]) => ({ g, inst, o })))
    .find(({ g, o }) => g !== 'derecho' && o.instituciones >= 2);
  assert.ok(generica);
  const original = generica.o;
  const copia = { ...original };
  try {
    Object.assign(original, { instituciones: 1 });
    const c = comparacionDeEmpleabilidad(carrera(`I${generica.inst}S1C1J1V1`, { generica: generica.g, indicadores: [empleabilidad(70)] }));
    assert.equal(c?.otras, null);
    assert.ok(c?.motivo);
  } finally {
    Object.assign(original, copia);
  }
});
