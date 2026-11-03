// Pruebas obligatorias del protocolo de crisis (AGENTS.md 2.4).
// Correr con: node --test tests/
//
// Las frases son ficticias, escritas para estas pruebas y revisadas por el líder.
// No se copian de foros ni de conversaciones reales.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  aplicarProtocoloDeCrisis,
  detectarCrisis,
  LINEAS_DE_AYUDA,
  RESPUESTA_CRISIS,
  type AlertaDeCrisis,
} from '../../lib/ia/crisis.ts';

const EXPLICITAS = [
  'Me quiero morir',
  'estoy pensando en suicidarme',
  'Quiero matarme',
  'me voy a matar',
  'he pensado en quitarme la vida',
  'quiero acabar con mi vida',
  'ya no kiero vivir',
  'me quiero moriiiir',
  'Me corto los brazos cuando estoy mal',
  'volví a cortarme',
  'a veces me hago daño a propósito',
  'tengo ganas de autolesionarme',
  'q ganas de morirme',
  'ya me quiero kms',
  'pienso en tirarme del puente',
  'me voy a tomar todas las pastillas',
];

const IMPLICITAS = [
  'No le veo sentido seguir viviendo',
  'todos estarían mejor sin mí',
  'Ojalá pudiera dormir y no despertar más',
  'quisiera desaparecer para siempre',
  'estoy cansada de vivir',
  'no aguanto más la vida',
  'quiero acabar con todo esto',
  'ojalá no hubiera nacido',
  'no vale la pena seguir viviendo',
  'no quiero existir',
  'ya no quiero estar viva',
  'me quiero ir de este mundo',
];

// La puntuación no puede hacer que una excepción ("todo el papeleo") oculte una señal.
const CON_PUNTUACION = [
  'quiero acabar con todo. El lunes no voy a ir',
  'todos estarían mejor sin mí. Trabajo y nadie lo nota',
  'me dan ganas de auto-lesionarme',
];

const DE_OTRA_PERSONA = [
  'mi amiga dice que se quiere matar',
  'creo que mi hermano se está cortando',
];

// Modismos frecuentes que no expresan riesgo: no deben bloquear una pregunta normal.
const SIN_RIESGO = [
  '¿Cuándo se postula a la gratuidad?',
  'Me muero de risa con el simulador',
  'me muero de ganas de estudiar medicina',
  'me mato estudiando para la PAES',
  'mañana voy a cortarme el pelo antes de la entrevista',
  'quiero terminar con todo el papeleo del FUAS',
  'estoy mejor sin mi ex, ahora quiero enfocarme en la carrera',
  '¿Qué pasa si la beca deja de existir?',
];

for (const frase of [...EXPLICITAS, ...IMPLICITAS, ...DE_OTRA_PERSONA, ...CON_PUNTUACION]) {
  test(`activa el protocolo: "${frase}"`, () => {
    assert.equal(detectarCrisis(frase).hayRiesgo, true);
  });
}

for (const frase of SIN_RIESGO) {
  test(`no activa el protocolo: "${frase}"`, () => {
    assert.equal(detectarCrisis(frase).hayRiesgo, false);
  });
}

test('un modismo no oculta una señal real en el mismo mensaje', () => {
  assert.equal(detectarCrisis('me muero de risa, pero en serio me quiero morir').hayRiesgo, true);
  assert.equal(detectarCrisis('me muero de ganas de morir').hayRiesgo, true);
  assert.equal(detectarCrisis('me corté el pelo y después me corté el brazo').hayRiesgo, true);
});

test('distingue suicidio y autolesión', () => {
  assert.deepEqual(detectarCrisis('quiero suicidarme'), { hayRiesgo: true, senales: ['suicidio'] });
  assert.deepEqual(detectarCrisis('me sigo cortando'), { hayRiesgo: true, senales: ['autolesion'] });
});

test('la respuesta entrega el *4141 y Salud Responde', () => {
  assert.match(RESPUESTA_CRISIS, /\*4141/);
  assert.match(RESPUESTA_CRISIS, /600 360 7777/);
});

test('cada línea de ayuda tiene fuente oficial, URL y fecha de verificación', () => {
  for (const linea of LINEAS_DE_AYUDA) {
    assert.ok(linea.fuente);
    assert.match(linea.url, /^https:\/\/www\.(minsal\.cl|ventanillaunicasocial\.gob\.cl)\//);
    assert.match(linea.verificadoEl, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('activa el protocolo y registra una alerta sin el texto del mensaje', async () => {
  const alertas: AlertaDeCrisis[] = [];
  const resultado = aplicarProtocoloDeCrisis(
    'Soy Ana Pérez, RUT 12.345.678-5, y me quiero morir',
    async (alerta) => {
      alertas.push(alerta);
    },
    () => new Date('2026-11-03T12:00:00Z'),
  );

  assert.equal(resultado.activado, true);
  if (!resultado.activado) return;
  assert.equal(resultado.respuesta, RESPUESTA_CRISIS);
  assert.equal(await resultado.alertaRegistrada, true);
  assert.deepEqual(alertas, [{ senales: ['suicidio'], detectadaEl: '2026-11-03T12:00:00.000Z' }]);
  assert.doesNotMatch(JSON.stringify(alertas), /Ana|Pérez|12\.345|morir/);
});

test('responde aunque registrar la alerta falle (base de datos caída)', async () => {
  const resultado = aplicarProtocoloDeCrisis('quiero matarme', async () => {
    throw new Error('sin conexión');
  });
  assert.equal(resultado.activado, true);
  if (!resultado.activado) return;
  assert.match(resultado.respuesta, /\*4141/);
  assert.equal(await resultado.alertaRegistrada, false);
});

test('responde aunque registrar la alerta falle de forma síncrona', async () => {
  const resultado = aplicarProtocoloDeCrisis('me quiero morir', () => {
    throw new Error('sin conexión');
  });
  assert.equal(resultado.activado, true);
  if (!resultado.activado) return;
  assert.equal(await resultado.alertaRegistrada, false);
});

test('la respuesta no espera a que la alerta termine de registrarse', () => {
  const resultado = aplicarProtocoloDeCrisis('me quiero morir', () => new Promise(() => {}));
  assert.equal(resultado.activado, true);
});

test('sin señales no activa el protocolo ni registra alertas', () => {
  let llamadas = 0;
  const resultado = aplicarProtocoloDeCrisis('¿Qué puntaje necesito para Enfermería?', async () => {
    llamadas++;
  });
  assert.deepEqual(resultado, { activado: false });
  assert.equal(llamadas, 0);
});

test('no depende del proveedor de IA ni de ningún otro módulo', () => {
  // Si crisis.ts importara algo, una caída de ese módulo podría dejar a la
  // persona sin las líneas de ayuda.
  const codigo = readFileSync(new URL('../../lib/ia/crisis.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(codigo, /^\s*import\s/m);
  assert.doesNotMatch(codigo, /\brequire\(|\bimport\(|\bfetch\(/);
});
