import assert from 'node:assert/strict';
import test from 'node:test';

import { obtenerCarrera } from '../../lib/datos/carreras.ts';
import { nombreDeFuente } from '../../lib/datos/fuentes.ts';
import { FILAS_INDICADORES, formatoIndicador } from '../../lib/datos/indicadores-vista.ts';

// La muestra (datos/ejemplos) trae los puntajes de corte reales de sus cuatro universidades.
process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const corte = (codigo: string) => obtenerCarrera(codigo)?.indicadores.find((indicador) => indicador.tipo === 'puntaje_corte');

// Enfermería, Universidad de Chile (código DEMRE 11080): 117 seleccionados regulares en el Archivo D, igual a
// NUM_SELEC_REG de las Estadísticas de Selección 2026; el puntaje ponderado mínimo es 781,4.
test('el puntaje de corte de la muestra es de una variante y cita los datos abiertos del DEMRE', () => {
  const indicador = corte('I70S1C41J1V1');
  assert.ok(indicador);
  assert.equal(indicador.valor, 781.4);
  assert.equal(indicador.unidad, 'puntos');
  assert.equal(indicador.nivel, 'variante');
  assert.equal(indicador.fuente, 'Datos abiertos DEMRE');
  assert.equal(indicador.periodo, 'selección del 19 de enero de 2026, vía regular');
  assert.equal(formatoIndicador(indicador), '781,4');
});

test('la fuente se cita como piden las condiciones de uso del DEMRE', () => {
  assert.equal(nombreDeFuente('Datos abiertos DEMRE'), 'Datos abiertos DEMRE 2026');
});

test('una carrera fuera del sistema de admisión del DEMRE no tiene puntaje de corte', () => {
  assert.equal(corte('I111S4C39J1V1'), undefined); // IP Duoc UC
});

test('los textos hablan del último seleccionado y dicen que es elaboración propia, nunca «matriculado»', () => {
  const fila = FILAS_INDICADORES.find((candidata) => candidata.tipo === 'puntaje_corte');
  assert.ok(fila);
  assert.match(fila.queMide, /seleccionada/);
  assert.match(fila.queMide, /Elaboración propia/);
  assert.doesNotMatch(fila.queMide, /matricul/i);
});
