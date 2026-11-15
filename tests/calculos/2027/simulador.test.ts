import assert from 'node:assert/strict';
import { test } from 'node:test';

import { calcularSimulacion } from '../../../lib/calculos/2027/simulador.ts';
import type { RequisitoAdmision } from '../../../lib/datos/carreras.ts';

function requisito(valores: Partial<RequisitoAdmision>): RequisitoAdmision {
  return {
    nem: null, ranking: null, competencia_lectora: null, matematica_1: null, matematica_2: null,
    historia_cs_sociales: null, ciencias: null, historia_o_ciencias: false, prueba_especial: null,
    asignacion_especial_pedagogia: null, puntaje_ponderado_minimo: null, puntaje_promedio_minimo: null,
    periodo: 'Admisión 2027', fuente: 'DEMRE',
    url: 'https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf',
    fecha_consulta: '2026-11-03',
    ...valores,
  };
}

test('calcula Historia o Ciencias con la electiva más alta', () => {
  // Ponderaciones: DEMRE, Oferta Definitiva de Carreras, Vacantes y Ponderaciones
  // Admisión 2027, código 17074 (PDF oficial: URL en datos/registro_descargas.md).
  // La marca «o» se verificó con Admisión UACh porque el PDF la omite: ver datos/correcciones/demre_2027.csv.
  const resultado = calcularSimulacion(requisito({
    nem: 20, ranking: 40, competencia_lectora: 15, matematica_1: 10,
    historia_cs_sociales: 15, ciencias: 15, historia_o_ciencias: true,
  }), { nem: 700, ranking: 800, lectora: 600, m1: 650, m2: null, historia: 620, ciencias: 780 });

  // 700×20 % + 800×40 % + 600×15 % + 650×10 % + 780×15 % = 732.
  assert.deepEqual(resultado, { puntajePonderado: 732, cumpleMinimos: true });
});

test('informa que no cumple el mínimo promedio', () => {
  // Ponderaciones y mínimos: DEMRE, Oferta Definitiva de Carreras, Vacantes y
  // Ponderaciones Admisión 2027, código 13073, página 1 del PDF oficial:
  // https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf
  const resultado = calcularSimulacion(requisito({
    nem: 20, ranking: 15, competencia_lectora: 15, matematica_1: 25, matematica_2: 15, ciencias: 10,
    puntaje_ponderado_minimo: 500, puntaje_promedio_minimo: 485,
  }), { nem: 600, ranking: 600, lectora: 480, m1: 480, m2: 480, historia: null, ciencias: 480 });

  // 600×20 % + 600×15 % + 480×15 % + 480×25 % + 480×15 % + 480×10 % = 522.
  // El ponderado supera 500, pero (480 + 480) / 2 = 480 no supera el mínimo 485.
  assert.deepEqual(resultado, { puntajePonderado: 522, cumpleMinimos: false });
});
