// Pruebas de la búsqueda de fragmentos oficiales (lib/ia/buscar-fragmentos.ts).
// Correr con: node --test tests/

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buscarEnCorpus, type DocumentoOficial } from '../../lib/ia/buscar-fragmentos.ts';
import corpusReal from '../../datos/asistente/documentos.json' with { type: 'json' };

const HOY = '2026-11-09';

function documento(sobrescribe: Partial<DocumentoOficial> = {}): DocumentoOficial {
  return {
    titulo: 'Documento ficticio',
    organismo: 'Organismo ficticio',
    url: 'https://ejemplo.cl/doc',
    publicadoEl: '2026-10-01',
    consultadoEl: '2026-11-01',
    tema: 'plazos',
    venceEl: null,
    fragmentos: [],
    ...sobrescribe,
  };
}

const fragmento = (id: string, texto: string) => ({
  id,
  texto,
  fuente: 'Fuente ficticia',
  url: 'https://ejemplo.cl/doc',
  actualizadoEl: '2026-11-01',
});

test('devuelve el fragmento que contiene las palabras de la pregunta', () => {
  const corpus = [
    documento({ fragmentos: [fragmento('a', 'La matrícula se paga en la institución durante marzo.')] }),
    documento({ fragmentos: [fragmento('b', 'El puntaje ponderado se calcula con las pruebas vigentes.')] }),
  ];
  const resultado = buscarEnCorpus('¿Cuándo pago la matrícula?', corpus, HOY);
  assert.deepEqual(resultado.map((f) => f.id), ['a']);
});

test('un documento vencido no se entrega', () => {
  const corpus = [
    documento({ venceEl: '2026-11-01', fragmentos: [fragmento('vencido', 'La postulación cierra en noviembre.')] }),
    documento({ fragmentos: [fragmento('vigente', 'La postulación se hace en el sitio oficial.')] }),
  ];
  const resultado = buscarEnCorpus('¿Cómo hago la postulación?', corpus, HOY);
  assert.deepEqual(resultado.map((f) => f.id), ['vigente']);
});

test('un documento que vence hoy sigue vigente', () => {
  const corpus = [documento({ venceEl: HOY, fragmentos: [fragmento('hoy', 'La postulación cierra hoy.')] })];
  assert.deepEqual(buscarEnCorpus('postulación', corpus, HOY).map((f) => f.id), ['hoy']);
});

test('una pregunta sin palabras de cuatro letras o más no devuelve nada', () => {
  const corpus = [documento({ fragmentos: [fragmento('a', 'Texto cualquiera de prueba.')] })];
  assert.deepEqual(buscarEnCorpus('¿y de o a?', corpus, HOY), []);
});

test('devuelve como máximo tres fragmentos, los más relevantes primero', () => {
  const corpus = [
    documento({
      fragmentos: [
        fragmento('uno', 'beca y matrícula'),
        fragmento('dos', 'beca matrícula'),
        fragmento('tres', 'beca'),
        fragmento('cuatro', 'beca'),
      ],
    }),
  ];
  // "uno" y "dos" empatan con dos palabras; en empate gana el orden del corpus.
  const resultado = buscarEnCorpus('beca matrícula', corpus, HOY);
  assert.deepEqual(resultado.map((f) => f.id), ['uno', 'dos', 'tres']);
});

test('el corpus oficial tiene fragmentos completos: texto, fuente, URL y fecha', () => {
  for (const doc of corpusReal as DocumentoOficial[]) {
    assert.ok(doc.url.startsWith('https://'), `URL de ${doc.titulo}`);
    assert.ok(doc.consultadoEl, `fecha de consulta de ${doc.titulo}`);
    assert.ok(doc.fragmentos.length > 0, `fragmentos de ${doc.titulo}`);
    for (const f of doc.fragmentos) {
      assert.ok(f.id && f.texto && f.fuente && f.url && f.actualizadoEl, `fragmento ${f.id}`);
    }
  }
});
