import assert from 'node:assert/strict';
import test from 'node:test';

import { obtenerCarrera, type AcreditacionInstitucion } from '../../lib/datos/carreras.ts';
import { describirAcreditacion, ENLACE_CNA, ENLACE_LEY_20910 } from '../../lib/datos/acreditacion.ts';

// La muestra (datos/ejemplos) trae la acreditación real de sus instituciones, tomada del archivo de Mineduc.
process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const BASE: AcreditacionInstitucion = {
  estado: 'acreditada',
  anios: 7,
  desde: '2025-12-23',
  hasta: '2032-12-23',
  situacion_al: '2026-11-05',
  periodo: 'matrícula 2026',
  fuente: 'Datos Abiertos Mineduc',
  url: 'https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar',
  fecha_consulta: '2026-11-05',
};

// Universidad de Chile, según el archivo de Mineduc de la matrícula 2026 (descargado el 2026-11-05).
test('una institución acreditada muestra los años, el período y la fecha de la situación', () => {
  const vista = describirAcreditacion(BASE, 'universidad', '2026-11-16');
  assert.equal(vista.valor, '7 años');
  assert.deepEqual(vista.detalles, [
    'Acreditada desde el 23 de diciembre de 2025 hasta el 23 de diciembre de 2032.',
    'Situación informada al 5 de noviembre de 2026. La acreditación puede cambiar.',
  ]);
  assert.equal(vista.aviso, undefined);
  assert.deepEqual(vista.enlaces, [ENLACE_CNA]);
});

test('un año de acreditación va en singular', () => {
  assert.equal(describirAcreditacion({ ...BASE, anios: 1 }, 'universidad', '2026-11-16').valor, '1 año');
});

test('una acreditación que ya terminó lo dice y no se muestra como vigente', () => {
  const vista = describirAcreditacion({ ...BASE, anios: 4, desde: '2022-01-10', hasta: '2026-01-10' }, 'universidad', '2026-11-16');
  assert.equal(vista.valor, 'Terminada');
  assert.equal(vista.detalles[0], 'Estuvo acreditada por 4 años desde el 10 de enero de 2022 hasta el 10 de enero de 2026.');
  assert.equal(vista.aviso, 'La acreditación terminó el 10 de enero de 2026. Revisa si se renovó.');
});

test('el mismo día del término todavía no cuenta como terminada', () => {
  assert.equal(describirAcreditacion({ ...BASE, hasta: '2026-11-16' }, 'universidad', '2026-11-16').valor, '7 años');
  assert.equal(describirAcreditacion({ ...BASE, hasta: '2026-11-15' }, 'universidad', '2026-11-16').valor, 'Terminada');
});

test('sin fecha de inicio solo se dice hasta cuándo, y sin ninguna fecha no se inventa ninguna', () => {
  assert.equal(describirAcreditacion({ ...BASE, desde: null }, 'universidad', '2026-11-16').detalles[0], 'Acreditada hasta el 23 de diciembre de 2032.');
  const sinFechas = describirAcreditacion({ ...BASE, desde: null, hasta: null }, 'universidad', '2026-11-16');
  assert.equal(sinFechas.detalles.length, 1);
  assert.match(sinFechas.detalles[0], /^Situación informada al/);
  assert.equal(sinFechas.aviso, undefined);
});

test('una institución no acreditada lo dice sin años ni fechas', () => {
  const vista = describirAcreditacion({ ...BASE, estado: 'no_acreditada', anios: null, desde: null, hasta: null }, 'instituto_profesional', '2026-11-16');
  assert.equal(vista.valor, 'No acreditada');
  assert.equal(vista.detalles[0], 'Mineduc informa que la institución no está acreditada.');
  assert.doesNotMatch(vista.detalles.join(' '), /desde|hasta/);
});

// Ley 20.910, artículo tercero: cada centro de formación técnica estatal es tutelado y acompañado por una universidad del Estado.
test('un centro de formación técnica bajo tutela explica qué significa y enlaza la ley', () => {
  const vista = describirAcreditacion({ ...BASE, estado: 'bajo_tutela', anios: null, desde: null, hasta: null }, 'centro_formacion_tecnica', '2026-11-16');
  assert.equal(vista.valor, 'Bajo tutela');
  assert.match(vista.detalles.join(' '), /tutelados y acompañados por una universidad del Estado/);
  assert.deepEqual(vista.enlaces, [ENLACE_CNA, ENLACE_LEY_20910]);
});

test('«bajo tutela» en otro tipo de institución no afirma nada que la fuente no diga', () => {
  const vista = describirAcreditacion({ ...BASE, estado: 'bajo_tutela', anios: null, desde: null, hasta: null }, 'universidad', '2026-11-16');
  assert.doesNotMatch(vista.detalles.join(' '), /centros de formación técnica/);
  assert.deepEqual(vista.enlaces, [ENLACE_CNA]);
});

test('la muestra cubre una acreditación vigente, una bajo tutela y una que ya terminó', () => {
  const hoy = '2026-11-16';
  const vigente = obtenerCarrera('I70S1C41J1V1')!;
  const bajoTutela = obtenerCarrera('I915S4C10J1V2')!;
  const terminada = obtenerCarrera('I456S2C14J1V1')!;

  assert.equal(describirAcreditacion(vigente.institucion.acreditacion!, vigente.institucion.tipo, hoy).valor, '7 años');
  assert.equal(describirAcreditacion(bajoTutela.institucion.acreditacion!, bajoTutela.institucion.tipo, hoy).valor, 'Bajo tutela');
  const vista = describirAcreditacion(terminada.institucion.acreditacion!, terminada.institucion.tipo, hoy);
  assert.equal(vista.valor, 'Terminada');
  assert.equal(vista.aviso, 'La acreditación terminó el 4 de noviembre de 2026. Revisa si se renovó.');
});
