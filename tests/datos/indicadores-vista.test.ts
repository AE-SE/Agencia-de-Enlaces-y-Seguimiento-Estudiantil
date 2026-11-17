import assert from 'node:assert/strict';
import test from 'node:test';

import { listarCarreras } from '../../lib/datos/carreras.ts';
import { datoDeFila, FILAS_INDICADORES, filasDelGrupo, GRUPOS_DE_FILAS, motivoSinFila } from '../../lib/datos/indicadores-vista.ts';

process.env.OFERTA_RUTA = new URL('../../datos/ejemplos/carreras.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const carreras = listarCarreras();
const fila = (tipo: string) => FILAS_INDICADORES.find((candidata) => candidata.tipo === tipo)!;
const enfermeria = carreras.find((c) => c.codigo_sies === 'I70S1C41J1V1')!; // U. de Chile
const duoc = carreras.find((c) => c.codigo_sies === 'I111S4C39J1V1')!; // IP Duoc UC, sin código DEMRE
const sinSies = carreras.find((c) => c.codigo_sies === 'I915S4C10J1V2')!; // sin fila del SIES

test('el ingreso al 4.º año se compara como el tramo en palabras que publica el SIES, no como un número', () => {
  const dato = datoDeFila(enfermeria, fila('ingreso_tramo'), false);
  assert.match(dato.texto ?? '', /^De \$/);
  assert.equal(dato.fuente, 'Mi Futuro');
  assert.equal(dato.nivel, 'programa');
});

test('las filas nuevas existen y cada una dice qué mide', () => {
  for (const tipo of ['retencion_1er_anio', 'continuidad_estudios', 'matricula_inscripcion', 'duracion_formal_semestres', 'matricula']) {
    const f = fila(tipo);
    assert.ok(f, tipo);
    assert.ok(f.queMide.length > 20, tipo);
  }
});

test('la duración formal y la real son filas separadas, cada una con su fuente', () => {
  const formal = datoDeFila(enfermeria, fila('duracion_formal_semestres'), true);
  const real = datoDeFila(enfermeria, fila('duracion_real_semestres'), true);
  assert.match(formal.texto ?? '', /semestres$/);
  assert.match(real.texto ?? '', /semestres$/);
  assert.notEqual(formal.fuente, real.fuente);
});

test('sin dato, la razón depende de por qué falta', () => {
  assert.match(motivoSinFila(duoc, fila('puntaje_corte')), /sistema de admisión centralizado/);
  assert.match(motivoSinFila(duoc, fila('vacantes')), /PAES/);
  assert.match(motivoSinFila(sinSies, fila('retencion_1er_anio')), /Mi Futuro no publica/);
  assert.match(motivoSinFila(sinSies, fila('ingreso_tramo')), /Mi Futuro no publica/);
  assert.equal(motivoSinFila(enfermeria, fila('arancel_anual')), 'Este dato aún no está cargado.');
});

test('una carrera sin fila del SIES no inventa un tramo', () => {
  const dato = datoDeFila(sinSies, fila('ingreso_tramo'), false);
  assert.equal(dato.texto, null);
  assert.match(dato.motivo, /Mi Futuro no publica/);
});

test('cada fila del comparador está en un solo grupo y ningún grupo apunta a una fila que no existe', () => {
  const enGrupos = GRUPOS_DE_FILAS.flatMap((grupo) => grupo.tipos);
  assert.deepEqual([...enGrupos].sort(), FILAS_INDICADORES.map((f) => f.tipo).sort());
  assert.equal(new Set(enGrupos).size, enGrupos.length);
  for (const grupo of GRUPOS_DE_FILAS) assert.equal(filasDelGrupo(grupo).length, grupo.tipos.length);
});

test('los grupos responden preguntas de la persona: costo, entrada, estudio y después de titularse', () => {
  assert.deepEqual(GRUPOS_DE_FILAS.map((g) => g.titulo), ['Cuánto cuesta', 'Cómo entrar', 'Cómo es estudiarla', 'Después de titularte']);
});
