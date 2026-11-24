import assert from 'node:assert/strict';
import test from 'node:test';

import { textoParaLectura } from '../../lib/datos/texto.ts';
import { rutaDeCarrera } from '../../lib/datos/ruta.ts';

test('normaliza nombres para que el lector anuncie palabras', () => {
  assert.equal(textoParaLectura('DUOC UC'), 'duoc uc');
});

test('devuelve la tilde que publican el DEMRE y el SIES', () => {
  assert.equal(textoParaLectura('ENFERMERIA'), 'enfermería');
  assert.equal(textoParaLectura('TECNICO EN ENFERMERIA'), 'técnico en enfermería');
  assert.equal(textoParaLectura('ENSENANZA'), 'enseñanza');
});

test('una palabra que no está en el diccionario queda igual', () => {
  assert.equal(textoParaLectura('ZZXQ en Duoc'), 'zzxq en duoc');
});

test('conserva puntuación y paréntesis', () => {
  assert.equal(textoParaLectura('PEDAGOGIA EN ARTES (SANTIAGO), MENCION - X'), 'pedagogía en artes (santiago), mención - x');
});

test('es idempotente sobre texto que ya trae tilde', () => {
  const una = textoParaLectura('INGENIERIA CIVIL');
  assert.equal(una, 'ingeniería civil');
  assert.equal(textoParaLectura(una), una);
  assert.equal(textoParaLectura('Enfermería'), 'enfermería');
});

test('no toca la ruta: el slug sale del dato sin tildes', () => {
  const carrera = { carrera: 'ENFERMERIA', sede: 'SANTIAGO', codigo_sies: 'X1', institucion: { nombre: 'DUOC UC' } };
  assert.equal(rutaDeCarrera(carrera as Parameters<typeof rutaDeCarrera>[0]), '/carreras/duoc-uc/enfermeria-santiago-x1');
});
