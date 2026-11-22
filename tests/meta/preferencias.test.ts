import assert from "node:assert/strict";
import test from "node:test";

import type { Carrera } from "../../lib/datos/carreras.ts";
import {
  agregarPreferencia, aPreferencia, bajar, fijarComoMeta, leer, quitar, serializar, subir, type Preferencia,
} from "../../lib/meta/preferencias.ts";

const p = (codigo: string): Preferencia => ({
  codigo_sies: codigo, carrera: `Carrera ${codigo}`, institucion: "Universidad X", sede: "Santiago", region: "Metropolitana",
  href: `/carreras/universidad-x/carrera-${codigo.toLowerCase()}`, area: null, puntaje_corte: null,
});
const codigos = (lista: Preferencia[]) => lista.map((i) => i.codigo_sies);

test("fijar como meta la pone primera", () => {
  const { lista, salio } = fijarComoMeta([p("A"), p("B")], p("C"));
  assert.deepEqual(codigos(lista), ["C", "A", "B"]);
  assert.equal(salio, null);
});

test("fijar como meta una que ya estaba la mueve sin duplicar", () => {
  const { lista, salio } = fijarComoMeta([p("A"), p("B"), p("C")], p("C"));
  assert.deepEqual(codigos(lista), ["C", "A", "B"]);
  assert.equal(salio, null);
});

test("fijar como meta con tres distintas recorta y dice cuál salió", () => {
  const { lista, salio } = fijarComoMeta([p("A"), p("B"), p("C")], p("D"));
  assert.deepEqual(codigos(lista), ["D", "A", "B"]);
  assert.equal(salio?.codigo_sies, "C");
});

test("agregar va al final, no repite y no pasa de tres", () => {
  const uno = agregarPreferencia([p("A")], p("B"));
  assert.deepEqual(codigos(uno.lista), ["A", "B"]);
  assert.equal(uno.resultado, "agregada");
  assert.equal(agregarPreferencia(uno.lista, p("A")).resultado, "ya_estaba");
  const llena = agregarPreferencia([p("A"), p("B"), p("C")], p("D"));
  assert.equal(llena.resultado, "llena");
  assert.deepEqual(codigos(llena.lista), ["A", "B", "C"]);
});

test("quitar, subir y bajar no mutan y respetan los bordes", () => {
  const base = [p("A"), p("B"), p("C")];
  assert.deepEqual(codigos(quitar(base, "B")), ["A", "C"]);
  assert.deepEqual(codigos(subir(base, "C")), ["A", "C", "B"]);
  assert.deepEqual(codigos(bajar(base, "A")), ["B", "A", "C"]);
  assert.deepEqual(codigos(subir(base, "A")), ["A", "B", "C"]);
  assert.deepEqual(codigos(bajar(base, "C")), ["A", "B", "C"]);
  assert.deepEqual(codigos(subir(base, "Z")), ["A", "B", "C"]);
  assert.deepEqual(codigos(base), ["A", "B", "C"]);
});

test("serializar y leer son inversas", () => {
  const lista = [{ ...p("A"), area: "Salud", puntaje_corte: 612.5, admision_centralizada: true }, p("B")];
  assert.deepEqual(leer(serializar(lista)), lista);
});

test("leer descarta lo inválido sin romper", () => {
  assert.deepEqual(leer(null), []);
  assert.deepEqual(leer(""), []);
  assert.deepEqual(leer("{no es json"), []);
  assert.deepEqual(leer('{"a":1}'), []);
  const mezcla = [p("A"), { codigo_sies: "B" }, null, 5, { ...p("C"), href: "https://otro.sitio/x" }, { ...p("D"), href: "javascript:alert(1)" }, p("A"), p("E")];
  assert.deepEqual(codigos(leer(JSON.stringify(mezcla))), ["A", "E"]);
});

test("leer corta a tres", () => {
  assert.equal(leer(JSON.stringify([p("A"), p("B"), p("C"), p("D")])).length, 3);
});

test("aPreferencia copia solo lo mínimo de la carrera", () => {
  const carrera = {
    codigo_sies: "I1S1C1J1V1", carrera: "Enfermería", institucion: { nombre: "Universidad de Chile", tipo: "universidad" },
    sede: "Santiago", comuna: "Independencia", region: "Metropolitana", jornada: "Diurno", duracion_semestres: 10, area: "Salud",
    admision_centralizada: true,
    indicadores: [{ tipo: "puntaje_corte", nivel: "variante", valor: 700, unidad: "puntos", periodo: "2026", fuente: "f", url: "u", fecha_consulta: "2026-11-01" }],
  } as unknown as Carrera;
  assert.deepEqual(aPreferencia(carrera), {
    codigo_sies: "I1S1C1J1V1", carrera: "Enfermería", institucion: "Universidad de Chile", sede: "Santiago", region: "Metropolitana",
    href: "/carreras/universidad-de-chile/enfermeria-santiago-i1s1c1j1v1", area: "Salud", puntaje_corte: 700, admision_centralizada: true,
  });
});
