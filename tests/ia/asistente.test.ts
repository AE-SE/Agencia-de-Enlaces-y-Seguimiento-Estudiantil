// Pruebas obligatorias del asistente (skill asistente-seguro): ningún dato
// personal llega al proveedor, el protocolo de crisis funciona con el proveedor
// caído y una respuesta sin fuente nunca se muestra como hecho.
// Todos los datos personales de este archivo son ficticios.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { responder, TEXTO_SIN_CERTEZA, TEXTO_SIN_SERVICIO, type DependenciasAsistente } from '../../lib/ia/asistente.ts';
import { quitarDatosPersonales } from '../../lib/ia/datos-personales.ts';
import { crearProveedorGemini, type Fragmento, type PeticionIA } from '../../lib/ia/proveedor.ts';

const FRAGMENTO: Fragmento = {
  id: 'f1',
  texto: 'Texto de ejemplo de un documento oficial.',
  fuente: 'Documento de prueba',
  url: 'https://ejemplo.cl/documento',
  actualizadoEl: '2026-11-03',
};

function dependencias(cambios: Partial<DependenciasAsistente> = {}) {
  const peticiones: PeticionIA[] = [];
  const busquedas: string[] = [];
  const deps: DependenciasAsistente = {
    proveedor: async (peticion) => {
      peticiones.push(peticion);
      return { texto: 'Respuesta de ejemplo.', fuentes: ['f1'] };
    },
    buscarFragmentos: async (pregunta) => {
      busquedas.push(pregunta);
      return [FRAGMENTO];
    },
    registrarAlerta: async () => {},
    ...cambios,
  };
  return { deps, peticiones, busquedas };
}

// ---------------------------------------------------------------------------
// Datos personales
// ---------------------------------------------------------------------------

const CON_DATOS: [string, string][] = [
  ['mi RUT es 12.345.678-5', 'mi RUT es [RUT]'],
  ['rut 12345678-K', 'rut [RUT]'],
  ['rut 9.876.543 k', 'rut [RUT]'],
  ['llámame al +56 9 1234 5678', 'llámame al [número]'],
  ['mi celular 912345678', 'mi celular [RUT]'],
  ['fijo 22 123 4567', 'fijo [número]'],
  ['escríbeme a ana.perez+beca@correo.cl', 'escríbeme a [correo]'],
  ['vivo en Los Aromos 1234, Maipú', 'vivo en [dirección], Maipú'],
  ['mi casa queda en Pasaje Las Rosas #45', 'mi casa queda en [dirección]'],
  ['Hola, me llamo ana pérez y quiero estudiar', 'Hola, me llamo [nombre] y quiero estudiar'],
  ['Mi nombre es Diego', 'Mi nombre es [nombre]'],
  ['Soy Camila Rojas Soto, de 4° medio', 'Soy [nombre], de 4° medio'],
];

for (const [entrada, esperado] of CON_DATOS) {
  test(`quita datos personales: "${entrada}"`, () => {
    assert.equal(quitarDatosPersonales(entrada), esperado);
  });
}

const SIN_DATOS = [
  '¿Qué puntaje necesito para Enfermería? Saqué 812 en Matemática 1',
  'soy de Temuco y quiero saber de la gratuidad',
  '¿La beca cubre un arancel de $15.000.000?',
  '¿Cambian las ponderaciones entre 2026-2027?',
  'Formulario Único de Acreditación Socioeconómica (FUAS)',
];

for (const entrada of SIN_DATOS) {
  test(`no toca lo que no es personal: "${entrada}"`, () => {
    assert.equal(quitarDatosPersonales(entrada), entrada);
  });
}

test('ningún dato personal llega al proveedor ni a la búsqueda', async () => {
  const { deps, peticiones, busquedas } = dependencias();
  await responder(
    'Hola, me llamo Ana Pérez, RUT 12.345.678-5, fono +56 9 1234 5678, correo ana@correo.cl. ¿Qué es la gratuidad?',
    deps,
  );
  const enviado = JSON.stringify({ peticiones, busquedas });
  assert.equal(peticiones.length, 1);
  assert.doesNotMatch(enviado, /Ana|Pérez|12\.345\.678|1234 5678|ana@correo/);
  assert.match(enviado, /gratuidad/);
});

// ---------------------------------------------------------------------------
// Crisis
// ---------------------------------------------------------------------------

test('con señales de crisis no llama al proveedor ni a la búsqueda', async () => {
  const { deps, peticiones, busquedas } = dependencias();
  const resultado = await responder('me quiero morir', deps);
  assert.equal(resultado.tipo, 'crisis');
  assert.match(resultado.texto, /\*4141/);
  assert.equal(peticiones.length + busquedas.length, 0);
});

test('el protocolo de crisis funciona con el proveedor y la base caídos', async () => {
  const caido = async () => {
    throw new Error('sin conexión');
  };
  const { deps } = dependencias({ proveedor: caido, buscarFragmentos: caido, registrarAlerta: caido });
  const resultado = await responder('quiero matarme', deps);
  assert.equal(resultado.tipo, 'crisis');
  assert.match(resultado.texto, /600 360 7777/);
});

// ---------------------------------------------------------------------------
// Fuentes
// ---------------------------------------------------------------------------

test('muestra la respuesta con los fragmentos que la respaldan', async () => {
  const { deps } = dependencias();
  const resultado = await responder('¿Qué es la gratuidad?', deps);
  assert.deepEqual(resultado, { tipo: 'respuesta', texto: 'Respuesta de ejemplo.', fuentes: [FRAGMENTO] });
});

test('una respuesta sin fuente nunca se muestra como hecho', async () => {
  const { deps } = dependencias({ proveedor: async () => ({ texto: 'La gratuidad cubre todo.', fuentes: [] }) });
  assert.deepEqual(await responder('¿Qué es la gratuidad?', deps), { tipo: 'sin_certeza', texto: TEXTO_SIN_CERTEZA });
});

test('una fuente inventada por la IA no cuenta como fuente', async () => {
  const { deps } = dependencias({ proveedor: async () => ({ texto: 'La gratuidad cubre todo.', fuentes: ['f99'] }) });
  assert.equal((await responder('¿Qué es la gratuidad?', deps)).tipo, 'sin_certeza');
});

test('sin fragmentos oficiales no pregunta a la IA', async () => {
  const { deps, peticiones } = dependencias({ buscarFragmentos: async () => [] });
  assert.equal((await responder('¿Qué es la gratuidad?', deps)).tipo, 'sin_certeza');
  assert.equal(peticiones.length, 0);
});

test('si el proveedor falla, lo dice sin mostrar el error', async () => {
  const { deps } = dependencias({
    proveedor: async () => {
      throw new Error('detalle interno con la pregunta');
    },
  });
  assert.deepEqual(await responder('¿Qué es la gratuidad?', deps), { tipo: 'sin_servicio', texto: TEXTO_SIN_SERVICIO });
});

// ---------------------------------------------------------------------------
// Proveedor Gemini (con fetch simulado: sin red ni gasto)
// ---------------------------------------------------------------------------

function fetchSimulado(respuesta: unknown, estado = 200) {
  const llamadas: { url: string; init: RequestInit }[] = [];
  const fn = (async (url: string, init: RequestInit) => {
    llamadas.push({ url, init });
    return new Response(JSON.stringify(respuesta), { status: estado });
  }) as unknown as typeof fetch;
  return { fn, llamadas };
}

const RESPUESTA_GEMINI = {
  candidates: [{ content: { parts: [{ text: JSON.stringify({ respuesta: 'Hola.', fuentes: ['f1'] }) }] } }],
};

test('Gemini: la clave va en un encabezado y nunca en la URL', async () => {
  const { fn, llamadas } = fetchSimulado(RESPUESTA_GEMINI);
  const proveedor = crearProveedorGemini({ clave: 'clave-de-prueba', modelo: 'modelo-de-prueba', fetch: fn });
  assert.deepEqual(await proveedor({ pregunta: '¿Qué es la gratuidad?', fragmentos: [FRAGMENTO] }), {
    texto: 'Hola.',
    fuentes: ['f1'],
  });
  const [{ url, init }] = llamadas;
  assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/modelo-de-prueba:generateContent');
  assert.doesNotMatch(url, /clave-de-prueba/);
  assert.equal((init.headers as Record<string, string>)['x-goog-api-key'], 'clave-de-prueba');
  assert.match(String(init.body), /\[f1\] Documento de prueba \(2026-11-03\)/);
});

test('Gemini: un error HTTP no expone el cuerpo de la respuesta', async () => {
  const { fn } = fetchSimulado({ error: { message: '¿Qué es la gratuidad?' } }, 429);
  const proveedor = crearProveedorGemini({ clave: 'c', modelo: 'm', fetch: fn });
  await assert.rejects(proveedor({ pregunta: 'x', fragmentos: [] }), (error: Error) => {
    assert.equal(error.message, 'Gemini respondió 429');
    return true;
  });
});

test('Gemini: una pregunta bloqueada o una respuesta con otra forma falla', async () => {
  for (const cuerpo of [
    { promptFeedback: { blockReason: 'SAFETY' } },
    { candidates: [{ content: { parts: [{ text: '{"otra":"cosa"}' }] } }] },
    { candidates: [{ content: { parts: [{ text: 'no es JSON' }] } }] },
  ]) {
    const { fn } = fetchSimulado(cuerpo);
    const proveedor = crearProveedorGemini({ clave: 'c', modelo: 'm', fetch: fn });
    await assert.rejects(proveedor({ pregunta: 'x', fragmentos: [] }));
  }
});

test('Gemini: sin clave o sin modelo no se crea el proveedor', () => {
  assert.throws(() => crearProveedorGemini({ clave: '', modelo: 'm' }));
  assert.throws(() => crearProveedorGemini({ clave: 'c', modelo: '' }));
});
