import assert from 'node:assert/strict';
import test from 'node:test';

import { nombreDeFuente } from '../../lib/datos/fuentes.ts';

test('explica la sigla de las fuentes conocidas', () => {
  assert.match(nombreDeFuente('SIES'), /Servicio de Información de Educación Superior/);
  assert.match(nombreDeFuente('DEMRE'), /Departamento de Evaluación, Medición y Registro Educacional/);
  assert.match(nombreDeFuente('Mineduc'), /Ministerio de Educación/);
});

test('una fuente desconocida se muestra tal cual, sin inventar su nombre', () => {
  assert.equal(nombreDeFuente('Otra'), 'Otra');
});
