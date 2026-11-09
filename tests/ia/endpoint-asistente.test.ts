// Pruebas del endpoint del asistente (lib/ia/endpoint-asistente.ts). Sin red ni base:
// proveedor, búsqueda y registro de alertas son simulados.
// Correr con: node --test tests/

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { atenderMensaje, LARGO_MAXIMO_MENSAJE } from '../../lib/ia/endpoint-asistente.ts';
import type { DependenciasAsistente } from '../../lib/ia/asistente.ts';
import type { AlertaDeCrisis } from '../../lib/ia/crisis.ts';
import type { Fragmento, PeticionIA } from '../../lib/ia/proveedor.ts';

const FRAGMENTO: Fragmento = {
  id: 'plazos-ficticio-1',
  texto: 'La postulación se realiza por el sitio oficial durante el período de postulación.',
  fuente: 'Documento ficticio',
  url: 'https://ejemplo.cl/documento',
  actualizadoEl: '2026-11-01',
};

function dependencias(sobrescribe: Partial<DependenciasAsistente> & { peticiones?: PeticionIA[]; alertas?: AlertaDeCrisis[] } = {}): DependenciasAsistente {
  const peticiones = sobrescribe.peticiones ?? [];
  const alertas = sobrescribe.alertas ?? [];
  return {
    proveedor:
      sobrescribe.proveedor ??
      (async (peticion) => {
        peticiones.push(peticion);
        return { texto: 'Postulas por el sitio oficial.', fuentes: [FRAGMENTO.id] };
      }),
    buscarFragmentos: sobrescribe.buscarFragmentos ?? (async () => [FRAGMENTO]),
    registrarAlerta:
      sobrescribe.registrarAlerta ??
      (async (alerta) => {
        alertas.push(alerta);
      }),
  };
}

test('una entrada sin texto válido devuelve 400 y no repite lo que llegó', async () => {
  for (const cuerpo of [null, {}, { mensaje: 123 }, { mensaje: '   ' }]) {
    const r = await atenderMensaje(cuerpo, dependencias());
    assert.equal(r.estado, 400);
    assert.equal(r.cuerpo.tipo, 'error');
  }
});

test('un mensaje largo sin señales de crisis se rechaza sin llamar al proveedor', async () => {
  const peticiones: PeticionIA[] = [];
  const largo = 'a'.repeat(LARGO_MAXIMO_MENSAJE + 1);
  const r = await atenderMensaje({ mensaje: largo }, dependencias({ peticiones }));
  assert.equal(r.estado, 400);
  assert.equal(peticiones.length, 0);
  assert.ok(!JSON.stringify(r.cuerpo).includes('aaaa'));
});

test('un mensaje largo con señales de crisis activa el protocolo igual', async () => {
  const peticiones: PeticionIA[] = [];
  const alertas: AlertaDeCrisis[] = [];
  const mensaje = 'Relleno. '.repeat(200) + 'Me quiero morir';
  const r = await atenderMensaje({ mensaje }, dependencias({ peticiones, alertas }));
  assert.equal(r.estado, 200);
  assert.equal(r.cuerpo.tipo, 'crisis');
  assert.equal(peticiones.length, 0);
  assert.ok(r.alertaPendiente);
  assert.equal(await r.alertaPendiente, true);
  assert.equal(alertas.length, 1);
});

test('en crisis, la respuesta no espera a la alerta y la alerta no lleva el mensaje', async () => {
  const alertas: AlertaDeCrisis[] = [];
  let registrada = false;
  const lenta = dependencias({
    alertas,
    registrarAlerta: async (alerta) => {
      await new Promise((resolver) => setTimeout(resolver, 20));
      registrada = true;
      alertas.push(alerta);
    },
  });

  const r = await atenderMensaje({ mensaje: 'Quiero matarme' }, lenta);
  assert.equal(r.cuerpo.tipo, 'crisis');
  assert.equal(registrada, false, 'la respuesta no debe esperar al registro');

  assert.equal(await r.alertaPendiente, true);
  assert.deepEqual(Object.keys(alertas[0]).sort(), ['detectadaEl', 'senales']);
  assert.ok(!JSON.stringify(alertas[0]).includes('matarme'));
});

test('si registrar la alerta falla, la persona igual recibe la respuesta de crisis', async () => {
  const r = await atenderMensaje(
    { mensaje: 'Quiero matarme' },
    dependencias({ registrarAlerta: async () => { throw new Error('caída'); } }),
  );
  assert.equal(r.cuerpo.tipo, 'crisis');
  assert.equal(await r.alertaPendiente, false);
});

test('una pregunta normal llega al proveedor sin datos personales y devuelve las fuentes completas', async () => {
  const peticiones: PeticionIA[] = [];
  const r = await atenderMensaje(
    { mensaje: '¿Cómo postulo? Soy Ana Pérez, RUT 12.345.678-5' },
    dependencias({ peticiones }),
  );
  assert.equal(r.estado, 200);
  assert.equal(r.cuerpo.tipo, 'respuesta');
  assert.equal(peticiones.length, 1);
  assert.ok(!peticiones[0].pregunta.includes('12.345.678-5'));
  assert.deepEqual(r.cuerpo.fuentes, [FRAGMENTO]);
  assert.equal(r.alertaPendiente, undefined);
});

test('sin fragmentos que respalden la respuesta, responde sin certeza', async () => {
  const r = await atenderMensaje({ mensaje: '¿Cuánto cuesta?' }, dependencias({ buscarFragmentos: async () => [] }));
  assert.equal(r.cuerpo.tipo, 'sin_certeza');
});
