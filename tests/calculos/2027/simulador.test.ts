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

const puntajesDePrueba = {
  nem: 825, ranking: 870, lectora: 700, m1: 900, m2: 840, historia: 850, ciencias: 820,
};

// Los puntajes son ficticios. Las ponderaciones y los mínimos se verificaron el
// 25 de noviembre de 2026 en la Oferta Definitiva DEMRE, Admisión 2027 (URL en requisito()).
const informaticaSantaMaria = {
  nem: 15, ranking: 20, competencia_lectora: 10, matematica_1: 35, matematica_2: 10,
  historia_cs_sociales: 10, ciencias: 10, historia_o_ciencias: true,
  puntaje_ponderado_minimo: 600, puntaje_promedio_minimo: 485,
};

const casosOfertaDefinitiva = [
  {
    carrera: '12057 · Enfermería, Universidad de Chile',
    pagina: 17,
    ponderaciones: {
      nem: 20, ranking: 25, competencia_lectora: 10, matematica_1: 20, ciencias: 25,
      puntaje_promedio_minimo: 485,
    },
    // 165 + 217,5 + 70 + 180 + 205
    esperado: 837.5,
  },
  {
    carrera: '17082 · Derecho, Universidad Austral de Chile',
    pagina: 158,
    ponderaciones: {
      nem: 10, ranking: 30, competencia_lectora: 30, matematica_1: 10, historia_cs_sociales: 20,
      puntaje_promedio_minimo: 500,
    },
    // 82,5 + 261 + 210 + 90 + 170
    esperado: 813.5,
  },
  {
    carrera: '41057 · Nutrición y Dietética, Universidad Andrés Bello',
    pagina: 140,
    ponderaciones: {
      nem: 20, ranking: 30, competencia_lectora: 10, matematica_1: 30, ciencias: 10,
      puntaje_promedio_minimo: 458,
    },
    // 165 + 261 + 70 + 270 + 82
    esperado: 848,
  },
  {
    carrera: '41129 · Ingeniería Comercial, Universidad Andrés Bello',
    pagina: 138,
    ponderaciones: {
      nem: 10, ranking: 40, competencia_lectora: 10, matematica_1: 30,
      historia_cs_sociales: 10, ciencias: 10, historia_o_ciencias: true,
      puntaje_promedio_minimo: 458,
    },
    // 82,5 + 348 + 70 + 270 + 85 (Historia supera a Ciencias).
    esperado: 855.5,
  },
  {
    carrera: '15160 · Ingeniería Civil Informática, Universidad Técnica Federico Santa María',
    pagina: 552,
    ponderaciones: informaticaSantaMaria,
    // 123,75 + 174 + 70 + 315 + 84 + 85
    esperado: 851.75,
  },
] satisfies ReadonlyArray<{
  carrera: string;
  pagina: number;
  ponderaciones: Partial<RequisitoAdmision>;
  esperado: number;
}>;

for (const caso of casosOfertaDefinitiva) {
  test(`${caso.carrera} (Oferta Definitiva DEMRE, p. ${caso.pagina})`, () => {
    const admision = requisito({ ...caso.ponderaciones, fecha_consulta: '2026-11-25' });
    assert.deepEqual(calcularSimulacion(admision, puntajesDePrueba), {
      puntajePonderado: caso.esperado,
      cumpleMinimos: true,
    });
  });
}

test('15160: el promedio puede cumplir mientras el ponderado queda bajo el mínimo', () => {
  const admision = requisito({ ...informaticaSantaMaria, fecha_consulta: '2026-11-25' });
  const puntajes = { nem: 620, ranking: 620, lectora: 620, m1: 560, m2: 490, historia: 550, ciencias: 520 };

  // Promedio: 590 ≥ 485. Ponderado: 93 + 124 + 62 + 196 + 49 + 55 = 579 < 600.
  assert.deepEqual(calcularSimulacion(admision, puntajes), {
    puntajePonderado: 579,
    cumpleMinimos: false,
  });
});
