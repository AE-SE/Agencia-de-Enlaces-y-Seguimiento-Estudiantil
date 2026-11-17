import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

import glosario from '../../datos/ayuda/glosario.json' with { type: 'json' };
import preguntas from '../../datos/ayuda/preguntas.json' with { type: 'json' };
import {
  nombreDelTermino,
  ordenarGlosario,
  textosEnOrdenDeLectura,
  type FuenteDeAyuda,
  type GrupoDePreguntas,
  type TerminoDelGlosario,
} from '../../lib/datos/ayuda.ts';

const GRUPOS: GrupoDePreguntas[] = preguntas.grupos;
const TERMINOS: TerminoDelGlosario[] = glosario.terminos;
const PREGUNTAS = GRUPOS.flatMap((grupo) => grupo.preguntas);
const RUTAS_DEL_PORTAL = new URL('../../app/(portal)/', import.meta.url);

function fuentes(): FuenteDeAyuda[] {
  return [...PREGUNTAS.flatMap((pregunta) => pregunta.fuentes), ...TERMINOS.flatMap((termino) => termino.fuentes)];
}

function sinRepetidos(valores: string[]): string[] {
  return valores.filter((valor, indice) => valores.indexOf(valor) !== indice);
}

test('los identificadores y las siglas no se repiten', () => {
  const ids = [...GRUPOS.map((grupo) => grupo.id), ...PREGUNTAS.map((pregunta) => pregunta.id), ...TERMINOS.map((termino) => `glosario-${termino.id}`)];
  assert.deepEqual(sinRepetidos(ids), []);
  assert.deepEqual(sinRepetidos(TERMINOS.flatMap((termino) => (termino.sigla ? [termino.sigla] : []))), []);
});

test('cada pregunta y cada término tiene texto y al menos una fuente', () => {
  for (const pregunta of PREGUNTAS) {
    assert.ok(pregunta.pregunta.trim().length > 0, `pregunta sin texto: ${pregunta.id}`);
    assert.ok(pregunta.respuesta.length > 0 && pregunta.respuesta.every((parrafo) => parrafo.trim().length > 0), `respuesta vacía: ${pregunta.id}`);
    assert.ok(pregunta.fuentes.length > 0, `sin fuente: ${pregunta.id}`);
  }
  for (const termino of TERMINOS) {
    assert.ok(termino.explicacion.trim().length > 0, `término sin explicación: ${termino.id}`);
    assert.ok(termino.fuentes.length > 0, `sin fuente: ${termino.id}`);
  }
});

test('cada fuente trae nombre, dirección https y una fecha de consulta real que ya pasó', () => {
  const hoy = new Date().toISOString().slice(0, 10);
  for (const fuente of fuentes()) {
    assert.ok(fuente.nombre.trim().length > 0, 'fuente sin nombre');
    assert.match(fuente.url, /^https:\/\/[^\s]+$/, `dirección inválida: ${fuente.url}`);
    assert.match(fuente.fecha_consulta, /^\d{4}-\d{2}-\d{2}$/, `fecha inválida en ${fuente.url}`);
    assert.ok(!Number.isNaN(Date.parse(fuente.fecha_consulta)) && fuente.fecha_consulta <= hoy, `fecha imposible en ${fuente.url}: ${fuente.fecha_consulta}`);
  }
});

test('los enlaces internos llevan a páginas que existen y los externos usan https', () => {
  for (const enlace of PREGUNTAS.flatMap((pregunta) => pregunta.enlaces)) {
    if (enlace.href.startsWith('/')) {
      assert.ok(existsSync(new URL(`.${enlace.href}/page.tsx`, RUTAS_DEL_PORTAL)), `no existe la página ${enlace.href}`);
    } else {
      assert.match(enlace.href, /^https:\/\/[^\s]+$/, `enlace externo inválido: ${enlace.href}`);
    }
  }
});

test('ningún texto usa el vocabulario que el proyecto prohíbe', () => {
  const prohibido = [/vulnerab/i, /pobreza/i, /clase social/i, /liceo pobre/i, /bajos recursos/i, /por falta de informaci[oó]n/i, /causa\w* (ansiedad|depresi[oó]n)/i];
  for (const texto of textosEnOrdenDeLectura(GRUPOS, TERMINOS)) {
    for (const patron of prohibido) assert.doesNotMatch(texto, patron, `vocabulario prohibido en: ${texto}`);
  }
});

// lenguaje-claro, regla 4: la primera vez que una sigla aparece en la página va con su nombre completo.
test('cada sigla se explica con su nombre completo la primera vez que aparece', () => {
  const textos = textosEnOrdenDeLectura(GRUPOS, TERMINOS);
  for (const termino of TERMINOS.filter((candidato) => candidato.sigla)) {
    const patron = new RegExp(`\\b${termino.sigla}\\b`);
    const texto = textos.find((candidato) => patron.test(candidato));
    assert.ok(texto, `la sigla ${termino.sigla} no aparece en la página`);
    const indice = texto.search(patron);
    const antes = texto.slice(Math.max(0, indice - termino.termino.length - 2), indice);
    // Sin distinguir mayúsculas: a mitad de frase va «un centro de formación técnica (CFT)».
    assert.equal(antes.toLowerCase(), `${termino.termino} (`.toLowerCase(), `la primera vez, ${termino.sigla} debe ir como «${termino.termino} (${termino.sigla})». Aparece en: ${texto}`);
  }
});

test('toda sigla de las respuestas está en el glosario o se explica en el mismo texto', () => {
  // M1 y M2 se explican en la respuesta; PDF, DFL y BEA son parte del nombre de un archivo, una norma y una beca.
  const permitidas = new Set(['M1', 'M2', 'PDF', 'DFL', 'BEA']);
  const conocidas = new Set(TERMINOS.flatMap((termino) => (termino.sigla ? [termino.sigla] : [])));
  const desconocidas = new Set<string>();
  for (const texto of textosEnOrdenDeLectura(GRUPOS, TERMINOS)) {
    for (const sigla of texto.match(/\b[A-ZÁÉÍÓÚÑ]{2,}\d?\b/g) ?? []) {
      if (!conocidas.has(sigla) && !permitidas.has(sigla)) desconocidas.add(sigla);
    }
  }
  assert.deepEqual([...desconocidas], []);
});

test('el glosario se ordena por sigla o por nombre, sin distinguir tildes ni mayúsculas', () => {
  const nombres = ordenarGlosario(TERMINOS).map((termino) => termino.sigla ?? termino.termino);
  assert.equal(nombres[0], 'Acreditación');
  assert.ok(nombres.indexOf('NEM') < nombres.indexOf('PAES'));
  assert.equal(nombreDelTermino(TERMINOS.find((termino) => termino.id === 'nem')!), 'Notas de Enseñanza Media (NEM)');
});

// Ejemplo publicado por el DEMRE (https://demre.cl/paes/factores-seleccion, consultado el 2026-11-16).
test('el ejemplo de puntaje ponderado de las respuestas coincide con el del DEMRE', () => {
  const respuesta = PREGUNTAS.find((pregunta) => pregunta.id === 'como-se-calcula-el-puntaje')!.respuesta.join(' ');
  const pares = [...respuesta.matchAll(/\((\d+) × (0,\d+)\)/g)].map(([, puntaje, ponderacion]) => [Number(puntaje), Number(ponderacion.replace(',', '.'))]);
  assert.equal(pares.length, 6);
  assert.ok(Math.abs(pares.reduce((suma, [, ponderacion]) => suma + ponderacion, 0) - 1) < 1e-9, 'las ponderaciones deben sumar 100 %');
  assert.ok(Math.abs(pares.reduce((suma, [puntaje, ponderacion]) => suma + puntaje * ponderacion, 0) - 848.75) < 1e-9);
  assert.match(respuesta, /= 848,75/);
});
