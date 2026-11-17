import assert from 'node:assert/strict';
import test from 'node:test';

import { obtenerCarrera, type RequisitoAdmision } from '../../lib/datos/carreras.ts';
import { filasDePonderaciones, minimosDeAdmision } from '../../lib/datos/ponderaciones.ts';

// La muestra de desarrollo y de la CI (datos/ejemplos) trae las ponderaciones de una carrera.
process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const BASE: RequisitoAdmision = {
  nem: null,
  ranking: null,
  competencia_lectora: null,
  matematica_1: null,
  matematica_2: null,
  historia_cs_sociales: null,
  ciencias: null,
  historia_o_ciencias: false,
  prueba_especial: null,
  asignacion_especial_pedagogia: null,
  puntaje_ponderado_minimo: null,
  puntaje_promedio_minimo: null,
  periodo: 'Proceso de Admisión 2027',
  fuente: 'DEMRE',
  url: 'https://demre.cl/publicaciones/2027/2027-26-09-24-oferta-carreras-vacantes-ponderaciones-p2027',
  fecha_consulta: '2026-11-16',
};

const suma = (filas: { porcentaje: number }[]) => filas.reduce((total, fila) => total + fila.porcentaje, 0);

// Enfermería, Pontificia Universidad Católica de Chile, sede Santiago (código DEMRE 12057): fila de la Oferta Definitiva de
// Carreras, Vacantes y Ponderaciones del proceso 2027, https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf
// (leída el 2026-11-16): NEM 20, Ranking 25, Lectora 10, M1 20, Ciencias 25 y promedio mínimo 485.
// Los códigos 12xxx son de la UC; los de la Universidad de Chile son 11xxx (Enfermería es la 11080, ver el último caso).
test('muestra los factores en el orden del DEMRE y suman 100 %', () => {
  const filas = filasDePonderaciones({ ...BASE, nem: 20, ranking: 25, competencia_lectora: 10, matematica_1: 20, ciencias: 25, puntaje_promedio_minimo: 485 });
  assert.deepEqual(
    filas.map((fila) => [fila.factor, fila.porcentaje]),
    [
      ['Notas de Enseñanza Media (NEM)', 20],
      ['Puntaje Ranking', 25],
      ['Competencia Lectora', 10],
      ['Competencia Matemática 1 (M1)', 20],
      ['Ciencias', 25],
    ],
  );
  assert.equal(suma(filas), 100);
});

test('un factor sin dato o en cero no aparece como fila', () => {
  const filas = filasDePonderaciones({ ...BASE, nem: 50, ranking: 0, competencia_lectora: 50, matematica_2: null });
  assert.deepEqual(filas.map((fila) => fila.factor), ['Notas de Enseñanza Media (NEM)', 'Competencia Lectora']);
});

// Diseño, Pontificia Universidad Católica de Chile, sede Santiago (código DEMRE 12006), misma fuente: 25 25 20 20 y «10 o 10».
test('Historia o Ciencias cuenta una sola vez y explica cuál se usa', () => {
  const filas = filasDePonderaciones({ ...BASE, nem: 25, ranking: 25, competencia_lectora: 20, matematica_1: 20, historia_cs_sociales: 10, ciencias: 10, historia_o_ciencias: true });
  const fila = filas.find((candidata) => candidata.factor.startsWith('Historia'));
  assert.equal(fila?.factor, 'Historia y Ciencias Sociales, o Ciencias');
  assert.equal(fila?.porcentaje, 10);
  assert.match(fila?.nota ?? '', /mayor puntaje/);
  assert.equal(filas.length, 5);
  assert.equal(suma(filas), 100);
});

// Estadística, Pontificia Universidad Católica de Chile, sede Santiago (código DEMRE 12049), misma fuente: 20 10 10 45 y Ciencias 10, M2 5.
test('Matemática 2 aparece cuando la carrera la pide', () => {
  const filas = filasDePonderaciones({ ...BASE, nem: 20, ranking: 10, competencia_lectora: 10, matematica_1: 45, ciencias: 10, matematica_2: 5 });
  assert.ok(filas.some((fila) => fila.factor === 'Competencia Matemática 2 (M2)' && fila.porcentaje === 5));
  assert.equal(suma(filas), 100);
});

test('Prueba especial y Asignación especial se nombran como los encabezados del DEMRE', () => {
  const filas = filasDePonderaciones({ ...BASE, nem: 30, ranking: 20, competencia_lectora: 20, matematica_1: 10, prueba_especial: 10, asignacion_especial_pedagogia: 10 });
  assert.deepEqual(filas.slice(-2).map((fila) => fila.factor), ['Prueba especial', 'Asignación especial']);
  assert.equal(suma(filas), 100);
});

test('los mínimos de postulación se devuelven tal como llegan, sin inventar ninguno', () => {
  assert.deepEqual(minimosDeAdmision({ ...BASE, puntaje_promedio_minimo: 485 }), { puntajePonderado: null, puntajePromedio: 485 });
  assert.deepEqual(minimosDeAdmision(BASE), { puntajePonderado: null, puntajePromedio: null });
});

// Enfermería, Universidad de Chile, sede Santiago (código DEMRE 11080), misma fuente, sección «Universidad de Chile»
// (leída el 2026-11-16): NEM 10, Ranking 20, Lectora 15, M1 20, Ciencias 35, promedio mínimo 458 y 97 vacantes regulares.
test('la muestra trae las ponderaciones de Enfermería de la Universidad de Chile', () => {
  const carrera = obtenerCarrera('I70S1C41J1V1');
  assert.equal(carrera?.institucion.nombre, 'Universidad de Chile');
  const requisito = carrera?.requisito_admision;
  assert.ok(requisito);
  const filas = filasDePonderaciones(requisito);
  assert.deepEqual(
    filas.map((fila) => [fila.factor, fila.porcentaje]),
    [
      ['Notas de Enseñanza Media (NEM)', 10],
      ['Puntaje Ranking', 20],
      ['Competencia Lectora', 15],
      ['Competencia Matemática 1 (M1)', 20],
      ['Ciencias', 35],
    ],
  );
  assert.equal(suma(filas), 100);
  assert.equal(requisito.fuente, 'DEMRE');
  assert.equal(minimosDeAdmision(requisito).puntajePromedio, 458);
  assert.equal(carrera.indicadores.find((indicador) => indicador.tipo === 'vacantes')?.valor, 97);
});
