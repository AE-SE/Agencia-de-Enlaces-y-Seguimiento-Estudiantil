import assert from "node:assert/strict";
import test from "node:test";

import { proximoPlazo } from "../../lib/meta/proximo-plazo.ts";

const h = (codigo: string, inicio: string | null, termino: string | null) => ({ codigo, inicio, termino });
const plazos = [
  h("c", "2027-01-04", "2027-01-04"),
  h("sin", null, null),
  h("a", "2026-12-01", "2026-12-10"),
  h("b", "2026-12-15", "2026-12-20"),
];

test("devuelve el hito en curso, aunque termine hoy", () => {
  assert.deepEqual(proximoPlazo(plazos, "2026-12-05"), { plazo: plazos[2], estado: "en_curso" });
  assert.equal(proximoPlazo(plazos, "2026-12-10")?.plazo.codigo, "a");
});

test("devuelve el siguiente que empieza cuando no hay uno en curso", () => {
  assert.deepEqual(proximoPlazo(plazos, "2026-12-12"), { plazo: plazos[3], estado: "proximo" });
});

test("no devuelve nada cuando todos los hitos pasaron", () => {
  assert.equal(proximoPlazo(plazos, "2027-01-05"), null);
  assert.equal(proximoPlazo([], "2026-12-05"), null);
});

test("ignora los hitos sin fecha", () => {
  assert.equal(proximoPlazo([h("sin", null, null)], "2026-01-01"), null);
});
