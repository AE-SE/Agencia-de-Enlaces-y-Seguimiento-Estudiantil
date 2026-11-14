// Pruebas del exportador de la oferta (scripts/exportar-oferta.ts) con datos inventados.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { construirOferta, type DatosBase } from '../../lib/datos/oferta-mapeo.ts';

const base = (): DatosBase => ({
  instituciones: [{ id: 'i1', nombre: 'Instituto Ficticio', tipo: 'instituto_profesional' }],
  programas: [{ id: 'p1', institucion_id: 'i1', nombre: 'Carrera Ficticia' }],
  variantes: [
    {
      id: 'v1',
      programa_id: 'p1',
      programa_generico_id: 'g1',
      codigo_sies: 'I900S1C1J1V1',
      sede: 'Sede A',
      comuna: 'Comuna A',
      region: 'Metropolitana',
      jornada: 'Diurna',
      duracion_semestres: 6,
      fuente_id: 'f1',
    },
  ],
  aranceles: [
    {
      variante_id: 'v1',
      valor_pesos: 1000000,
      periodo: 'año 2026',
      fuente_id: 'f1',
      url: 'https://ejemplo.invalid/mineduc',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
  ],
  vacantes: [
    {
      variante_id: 'v1',
      via: 'regular',
      cupos: 50,
      periodo: 'admisión 2027',
      fuente_id: 'f2',
      url: 'https://ejemplo.invalid/demre',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
    {
      variante_id: 'v1',
      via: 'bea',
      cupos: 3,
      periodo: 'admisión 2027',
      fuente_id: 'f2',
      url: 'https://ejemplo.invalid/demre',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
  ],
  indicadores: [
    {
      programa_generico_id: 'g1',
      tipo: 'retencion_1er_anio',
      valor: 80,
      unidad: 'porcentaje',
      periodo: 'año 2024 a 2025',
      fuente_id: 'f3',
      url: 'https://ejemplo.invalid/sies',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
    {
      programa_generico_id: 'g1',
      tipo: 'empleabilidad_1er_anio',
      valor: null,
      unidad: 'porcentaje',
      periodo: 'titulados 2021 a 2023',
      fuente_id: 'f3',
      url: 'https://ejemplo.invalid/sies',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: 'Excepción: indicador de 2.º año.',
    },
  ],
  requisitos: [
    {
      variante_id: 'v1', nem: 10, ranking: 20, competencia_lectora: 20, matematica_1: 20,
      matematica_2: null, historia_cs_sociales: 30, ciencias: 0, historia_o_ciencias: false,
      prueba_especial: null, asignacion_especial_pedagogia: null,
      puntaje_ponderado_minimo: 500, puntaje_promedio_minimo: 458, periodo: 'Admisión 2027',
      fuente_id: 'f2', url: 'https://ejemplo.invalid/demre', fecha_consulta: '2026-11-05',
    },
  ],
  fuentes: [
    { id: 'f1', organismo: 'Mineduc', nombre: 'Datos Abiertos Mineduc: matrícula 2026' },
    { id: 'f2', organismo: 'DEMRE', nombre: 'Oferta definitiva' },
    { id: 'f3', organismo: 'SIES, Mineduc', nombre: 'Buscador de Empleabilidad e Ingresos (Mi Futuro)' },
  ],
});

test('una variante se convierte en una carrera con su institución y ubicación', () => {
  const [c] = construirOferta(base());
  assert.equal(c.codigo_sies, 'I900S1C1J1V1');
  assert.equal(c.carrera, 'Carrera Ficticia');
  assert.deepEqual(c.institucion, { nombre: 'Instituto Ficticio', tipo: 'instituto_profesional' });
  assert.equal(c.sede, 'Sede A');
  assert.equal(c.region, 'Metropolitana');
  assert.equal(c.duracion_semestres, 6);
});

test('el arancel sale con su fuente con sigla del portal', () => {
  const [c] = construirOferta(base());
  const arancel = c.indicadores.find((i) => i.tipo === 'arancel_anual');
  assert.ok(arancel);
  assert.equal(arancel.valor, 1000000);
  assert.equal(arancel.fuente, 'Datos Abiertos Mineduc');
  assert.equal(arancel.nivel, 'variante');
});

test('solo se publica la vía regular de cupos', () => {
  const [c] = construirOferta(base());
  const cupos = c.indicadores.filter((i) => i.tipo === 'vacantes');
  assert.equal(cupos.length, 1);
  assert.equal(cupos[0].valor, 50);
  assert.equal(cupos[0].fuente, 'DEMRE');
});

test('un dato del SIES que falta conserva su motivo y no aparece como cero', () => {
  const [c] = construirOferta(base());
  const emp = c.indicadores.find((i) => i.tipo === 'empleabilidad_1er_anio');
  assert.ok(emp);
  assert.equal(emp.valor, null);
  assert.equal((emp as { motivo_sin_dato: string }).motivo_sin_dato, 'Excepción: indicador de 2.º año.');
});

test('los indicadores del SIES cuelgan de la carrera genérica y llevan nivel programa', () => {
  const [c] = construirOferta(base());
  const ret = c.indicadores.find((i) => i.tipo === 'retencion_1er_anio');
  assert.ok(ret);
  assert.equal(ret.valor, 80);
  assert.equal(ret.nivel, 'programa');
  assert.equal(ret.fuente, 'Mi Futuro');
});

test('las ponderaciones DEMRE quedan disponibles para el simulador con su fuente', () => {
  const [c] = construirOferta(base());
  assert.equal(c.requisito_admision?.matematica_1, 20);
  assert.equal(c.requisito_admision?.fuente, 'DEMRE');
});

test('un dato nulo sin motivo se detiene', () => {
  const datos = base();
  datos.aranceles[0] = { ...datos.aranceles[0], valor_pesos: null, motivo_sin_dato: null };
  assert.throws(() => construirOferta(datos), /sin motivo/);
});

test('una variante sin programa se detiene', () => {
  const datos = base();
  datos.variantes[0] = { ...datos.variantes[0], programa_id: 'no-existe' };
  assert.throws(() => construirOferta(datos), /sin programa o institución/);
});
