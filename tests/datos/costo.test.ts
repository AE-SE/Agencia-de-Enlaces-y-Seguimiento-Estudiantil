import assert from 'node:assert/strict';
import test from 'node:test';

import { obtenerCarrera } from '../../lib/datos/carreras.ts';
import { costoPrimerAnio } from '../../lib/datos/costo.ts';

process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// Enfermería, Universidad de Chile: arancel 6.388.500 y matrícula de inscripción 217.600 (carga de Mineduc del 5-nov-2026).
test('el costo del primer año suma el arancel y la matrícula de inscripción', () => {
  const costo = costoPrimerAnio(obtenerCarrera('I70S1C41J1V1')!);
  assert.equal(costo.total, 6388500 + 217600);
});

test('sin matrícula de inscripción no se calcula el costo: se diría menos de lo real', () => {
  const costo = costoPrimerAnio(obtenerCarrera('I915S4C10J1V2')!); // Mineduc informa 0 o no informa la matrícula
  assert.equal(costo.total, null);
  assert.match((costo as { motivo: string }).motivo, /matrícula de inscripción/);
});

test('sin arancel tampoco se calcula', () => {
  const carrera = obtenerCarrera('I70S1C41J1V1')!;
  const sin = { ...carrera, indicadores: carrera.indicadores.filter((i) => i.tipo !== 'arancel_anual') };
  assert.equal(costoPrimerAnio(sin).total, null);
});
