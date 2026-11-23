import assert from "node:assert/strict";
import test from "node:test";

import { conCache, VIGENCIA_CONSULTA_MS } from "../../lib/datos/cache-consultas.ts";

function contador(respuestas: Array<() => Promise<{ filas: unknown[] }>> = [async () => ({ filas: [] })]) {
  const llamadas: string[] = [];
  const consultar = conCache(
    (clave: string) => {
      llamadas.push(clave);
      return respuestas[Math.min(llamadas.length - 1, respuestas.length - 1)]();
    },
    (clave) => clave,
    { maximoConsultas: 3, maximoFilas: 5 },
  );
  return { consultar, llamadas };
}

test("la misma consulta se hace una sola vez mientras dura la caché", async () => {
  const { consultar, llamadas } = contador();
  await consultar("a");
  await consultar("a");
  assert.equal(llamadas.length, 1);
  await consultar("b");
  assert.equal(llamadas.length, 2, "otra consulta sí se hace");
});

test("dos visitas simultáneas comparten la consulta en curso", async () => {
  const { consultar, llamadas } = contador();
  await Promise.all([consultar("a"), consultar("a")]);
  assert.equal(llamadas.length, 1);
});

test("un error no queda guardado: la siguiente visita vuelve a consultar", async () => {
  const { consultar, llamadas } = contador([async () => { throw new Error("caída"); }, async () => ({ filas: [] })]);
  await assert.rejects(consultar("a"));
  await consultar("a");
  assert.equal(llamadas.length, 2);
});

test("una entrada vencida se vuelve a consultar", async (t) => {
  const { consultar, llamadas } = contador();
  await consultar("a");
  t.mock.timers.enable({ apis: ["Date"], now: Date.now() + VIGENCIA_CONSULTA_MS + 1000 });
  await consultar("a");
  t.mock.timers.reset();
  assert.equal(llamadas.length, 2);
});

test("al pasar el tope de consultas sale la más antigua", async () => {
  const { consultar, llamadas } = contador();
  for (const c of ["a", "b", "c", "d"]) await consultar(c);
  await consultar("d");
  await consultar("a");
  assert.deepEqual(llamadas, ["a", "b", "c", "d", "a"]);
});

test("al pasar el tope de filas salen las más antiguas", async () => {
  const { consultar, llamadas } = contador([async () => ({ filas: [1, 2, 3] })]);
  await consultar("a");
  await consultar("b"); // 6 filas > 5: sale «a»
  await consultar("b");
  await consultar("a");
  assert.deepEqual(llamadas, ["a", "b", "a"]);
});
