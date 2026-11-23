import assert from "node:assert/strict";
import test from "node:test";

// Valores de prueba: fetch está simulado y nunca sale a la red.
process.env.SUPABASE_URL = "https://prueba.invalid";
process.env.SUPABASE_ANON_KEY = "clave-de-prueba";

const { carrerasPorCodigos } = await import("../../lib/datos/oferta-remota.ts");

function simularFetch(respuestas: Array<() => Response>) {
  const llamadas: string[] = [];
  globalThis.fetch = (async (url: string) => {
    llamadas.push(String(url));
    return respuestas[Math.min(llamadas.length - 1, respuestas.length - 1)]();
  }) as typeof fetch;
  return llamadas;
}

test("la misma consulta se hace una sola vez mientras dura la caché", async () => {
  const llamadas = simularFetch([() => Response.json([])]);
  assert.deepEqual(await carrerasPorCodigos(["CACHE1"]), []);
  assert.deepEqual(await carrerasPorCodigos(["CACHE1"]), []);
  assert.equal(llamadas.length, 1);
  await carrerasPorCodigos(["CACHE2"]);
  assert.equal(llamadas.length, 2, "otra consulta sí va a la base");
});

test("dos visitas simultáneas comparten la consulta en curso", async () => {
  const llamadas = simularFetch([() => Response.json([])]);
  await Promise.all([carrerasPorCodigos(["SIMULTANEA"]), carrerasPorCodigos(["SIMULTANEA"])]);
  assert.equal(llamadas.length, 1);
});

test("un error no queda guardado: la siguiente visita vuelve a consultar", async () => {
  const llamadas = simularFetch([() => new Response("caída", { status: 503 }), () => Response.json([])]);
  await assert.rejects(carrerasPorCodigos(["ERROR1"]));
  assert.deepEqual(await carrerasPorCodigos(["ERROR1"]), []);
  assert.equal(llamadas.length, 2);
});

test("una entrada vencida se vuelve a consultar", async (t) => {
  const llamadas = simularFetch([() => Response.json([])]);
  await carrerasPorCodigos(["VENCE"]);
  t.mock.timers.enable({ apis: ["Date"], now: Date.now() + 61 * 60 * 1000 });
  await carrerasPorCodigos(["VENCE"]);
  t.mock.timers.reset();
  assert.equal(llamadas.length, 2);
});
