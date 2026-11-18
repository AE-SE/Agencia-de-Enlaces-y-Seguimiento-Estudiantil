import assert from 'node:assert/strict';
import test from 'node:test';

import { obtenerCarrera } from '../../lib/datos/carreras.ts';
import { COMO_SE_CALCULA, costoPrimerAnio } from '../../lib/datos/costo.ts';
import { datoDeFila, FILAS_INDICADORES } from '../../lib/datos/indicadores-vista.ts';

process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// Enfermería, Universidad de Chile: arancel 6.388.500 y costo de matrícula 217.600 (carga de Mineduc del 5-nov-2026).
test('el costo del primer año suma el arancel anual y el costo de matrícula', () => {
  const costo = costoPrimerAnio(obtenerCarrera('I70S1C41J1V1')!);
  assert.equal(costo.total, 6388500 + 217600);
});

test('sin costo de matrícula no se calcula el total: se diría menos de lo real', () => {
  const costo = costoPrimerAnio(obtenerCarrera('I915S4C10J1V2')!); // Mineduc informa 0 o no informa la matrícula
  assert.equal(costo.total, null);
  assert.match((costo as { motivo: string }).motivo, /costo de matrícula/);
});

test('sin arancel tampoco se calcula', () => {
  const carrera = obtenerCarrera('I70S1C41J1V1')!;
  const sin = { ...carrera, indicadores: carrera.indicadores.filter((i) => i.tipo !== 'arancel_anual') };
  assert.equal(costoPrimerAnio(sin).total, null);
});

test('se rotula como elaboración propia y dice qué suma', () => {
  assert.match(COMO_SE_CALCULA, /Elaboración propia/);
  const fila = FILAS_INDICADORES.find((f) => f.tipo === 'costo_primer_anio')!;
  assert.match(fila.queMide, /Elaboración propia/);
  assert.match(fila.queMide, /arancel anual más costo de matrícula/i);
});

test('en el comparador y la hoja el total sale formateado, con la fuente de Mineduc', () => {
  const fila = FILAS_INDICADORES.find((f) => f.tipo === 'costo_primer_anio')!;
  const dato = datoDeFila(obtenerCarrera('I70S1C41J1V1')!, fila, false);
  assert.equal(dato.texto, '$6.606.100');
  assert.equal(dato.fuente, 'Datos Abiertos Mineduc');
  const sinDato = datoDeFila(obtenerCarrera('I915S4C10J1V2')!, fila, false);
  assert.equal(sinDato.texto, null);
  assert.match(sinDato.motivo, /no podemos sumar/);
});
