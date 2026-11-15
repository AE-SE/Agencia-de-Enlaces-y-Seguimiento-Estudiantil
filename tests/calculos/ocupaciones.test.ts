import assert from "node:assert/strict";
import test from "node:test";

import { areasDesdeUrl, puntuacion, rankear, type Ocupacion } from "../../lib/calculos/ocupaciones.ts";

const perfil = (r: number, i: number, a: number, s: number, e: number, c: number) => ({
  realista: r, investigador: i, artistico: a, social: s, emprendedor: e, convencional: c,
});

const ocupaciones: Ocupacion[] = [
  { codigo: "1", titulo: "Mecánico", area: "Tecnología", carreras_en_area: 10, perfil: perfil(7, 2, 1, 1, 2, 3) },
  { codigo: "2", titulo: "Enfermero", area: "Salud", carreras_en_area: 5, perfil: perfil(2, 3, 1, 7, 2, 4) },
  { codigo: "3", titulo: "Profesor", area: "Educación", carreras_en_area: 8, perfil: perfil(1, 2, 3, 6, 3, 3) },
  { codigo: "4", titulo: "Científico", area: "Ciencias Básicas", carreras_en_area: 4, perfil: perfil(2, 7, 2, 2, 1, 3) },
];

test("areasDesdeUrl acepta solo áreas válidas, sin repetidos y con máximo tres", () => {
  assert.deepEqual(areasDesdeUrl(undefined), []);
  assert.deepEqual(areasDesdeUrl(""), []);
  assert.deepEqual(areasDesdeUrl("realista,inventado,social"), ["realista", "social"]);
  assert.deepEqual(areasDesdeUrl("social,social,realista"), ["social", "realista"]);
  assert.deepEqual(
    areasDesdeUrl("realista,social,artistico,emprendedor"),
    ["realista", "social", "artistico"],
  );
});

test("puntuacion promedia solo las áreas elegidas", () => {
  assert.equal(puntuacion(perfil(7, 2, 1, 1, 2, 3), ["realista"]), 7);
  assert.equal(puntuacion(perfil(7, 2, 1, 1, 2, 3), ["realista", "investigador"]), 4.5);
  assert.equal(puntuacion(perfil(7, 2, 1, 1, 2, 3), []), 0);
});

test("rankear ordena por afinidad con las áreas elegidas", () => {
  assert.deepEqual(rankear(ocupaciones, ["realista"]).map((o) => o.codigo), ["1", "4", "2", "3"]);
  assert.deepEqual(rankear(ocupaciones, ["social"]).map((o) => o.codigo), ["2", "3", "4", "1"]);
  assert.deepEqual(rankear(ocupaciones, ["investigador"]).map((o) => o.codigo), ["4", "2", "1", "3"]);
});

test("rankear sin áreas no devuelve nada y respeta el límite", () => {
  assert.deepEqual(rankear(ocupaciones, []), []);
  assert.equal(rankear(ocupaciones, ["realista"], 2).length, 2);
});

test("rankear no cambia la lista original", () => {
  const antes = ocupaciones.map((o) => o.codigo).join(",");
  rankear(ocupaciones, ["social"]);
  assert.equal(ocupaciones.map((o) => o.codigo).join(","), antes);
});
