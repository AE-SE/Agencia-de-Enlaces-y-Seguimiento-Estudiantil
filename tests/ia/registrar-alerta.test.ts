// Pruebas del registro de alertas en la base (ADR 0019). Sin red: fetch simulado.
// Correr con: node --test tests/

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { crearRegistrarAlerta } from '../../lib/ia/registrar-alerta.ts';

const CONFIG_BASE = { urlSupabase: 'https://proyecto-ficticio.supabase.co/', claveServicio: 'clave-ficticia' };

function fetchSimulado(status: number, capturadas: { url: string; init: RequestInit }[]): typeof fetch {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    capturadas.push({ url: String(url), init: init ?? {} });
    return new Response(null, { status });
  }) as typeof fetch;
}

test('envía solo senales y detectada_el a alerta_crisis', async () => {
  const capturadas: { url: string; init: RequestInit }[] = [];
  const registrar = crearRegistrarAlerta({ ...CONFIG_BASE, fetchFn: fetchSimulado(201, capturadas) });

  await registrar({ senales: ['suicidio'], detectadaEl: '2026-11-09T10:00:00.000Z' });

  assert.equal(capturadas.length, 1);
  assert.equal(capturadas[0].url, 'https://proyecto-ficticio.supabase.co/rest/v1/alerta_crisis');
  assert.equal(capturadas[0].init.method, 'POST');
  const cuerpo = JSON.parse(String(capturadas[0].init.body));
  assert.deepEqual(Object.keys(cuerpo).sort(), ['detectada_el', 'senales']);
  assert.deepEqual(cuerpo.senales, ['suicidio']);
});

test('usa la clave de servicio en las dos cabeceras de autenticación', async () => {
  const capturadas: { url: string; init: RequestInit }[] = [];
  const registrar = crearRegistrarAlerta({ ...CONFIG_BASE, fetchFn: fetchSimulado(201, capturadas) });
  await registrar({ senales: ['autolesion'], detectadaEl: '2026-11-09T10:00:00.000Z' });

  const cabeceras = capturadas[0].init.headers as Record<string, string>;
  assert.equal(cabeceras.apikey, 'clave-ficticia');
  assert.equal(cabeceras.Authorization, 'Bearer clave-ficticia');
});

test('si la base responde con error, lanza sin incluir la respuesta ni la alerta', async () => {
  const registrar = crearRegistrarAlerta({ ...CONFIG_BASE, fetchFn: fetchSimulado(500, []) });

  await assert.rejects(
    () => registrar({ senales: ['suicidio'], detectadaEl: '2026-11-09T10:00:00.000Z' }),
    (error: Error) => {
      assert.equal(error.message, 'No se pudo registrar la alerta (HTTP 500)');
      assert.ok(!error.message.includes('suicidio'));
      return true;
    },
  );
});
