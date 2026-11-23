import assert from "node:assert/strict";
import test from "node:test";

import calendario from "../../datos/calendario/plazos_2027.json" with { type: "json" };
import { proximosPlazos } from "../../lib/meta/proximo-plazo.ts";

const h = (codigo: string, inicio: string | null, termino: string | null) => ({ codigo, inicio, termino });
const plazos = [
  h("c", "2027-01-04", "2027-01-04"),
  h("sin", null, null),
  h("a", "2026-12-01", "2026-12-10"),
  h("b", "2026-12-15", "2026-12-20"),
];
const codigos = (r: { estado: string; plazos: { codigo: string }[] } | null) => r && { estado: r.estado, codigos: r.plazos.map((p) => p.codigo) };

test("devuelve el hito en curso, aunque termine hoy", () => {
  assert.deepEqual(codigos(proximosPlazos(plazos, "2026-12-05")), { estado: "en_curso", codigos: ["a"] });
  assert.deepEqual(codigos(proximosPlazos(plazos, "2026-12-10")), { estado: "en_curso", codigos: ["a"] });
});

test("devuelve el siguiente que empieza cuando no hay uno en curso", () => {
  assert.deepEqual(codigos(proximosPlazos(plazos, "2026-12-12")), { estado: "proximo", codigos: ["b"] });
});

test("no devuelve nada cuando todos los hitos pasaron", () => {
  assert.equal(proximosPlazos(plazos, "2027-01-05"), null);
  assert.equal(proximosPlazos([], "2026-12-05"), null);
});

test("ignora los hitos sin fecha", () => {
  assert.equal(proximosPlazos([h("sin", null, null)], "2026-01-01"), null);
});

// Con el calendario real: los hitos simultáneos o solapados aparecen todos.
test("calendario 2027: muestra juntos los hitos del mismo día y los que se solapan", () => {
  const real = calendario.plazos;
  assert.deepEqual(codigos(proximosPlazos(real, "2026-12-20")), { estado: "proximo", codigos: ["resultados_paes_regular", "postulacion_centralizada"] });
  assert.deepEqual(codigos(proximosPlazos(real, "2027-01-04")), { estado: "en_curso", codigos: ["resultados_paes_regular", "postulacion_centralizada"] });
  assert.deepEqual(codigos(proximosPlazos(real, "2027-01-07")), { estado: "en_curso", codigos: ["postulacion_centralizada", "instrucciones_matricula"] });
  assert.deepEqual(codigos(proximosPlazos(real, "2027-01-25")), { estado: "en_curso", codigos: ["retracto_matricula", "matricula_segundo_periodo"] });
  assert.equal(proximosPlazos(real, "2027-01-29"), null);
});
