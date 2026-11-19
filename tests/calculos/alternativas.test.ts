import assert from "node:assert/strict";
import test from "node:test";

import { aComparable, alternativasCercanas, type CarreraComparable } from "../../lib/calculos/alternativas.ts";

const carrera = (
  codigo_sies: string,
  area: string | null,
  region: string,
  puntaje_corte: number | null,
  admision_centralizada?: boolean,
): CarreraComparable => ({ codigo_sies, area, region, puntaje_corte, admision_centralizada });

const meta = carrera("META", "Salud", "Región de Valparaíso", 700, true);

test("solo entran carreras de la misma área", () => {
  const { conCorte } = alternativasCercanas(meta, [
    carrera("A", "Salud", "Región de Valparaíso", 650, true),
    carrera("B", "Educación", "Región de Valparaíso", 650, true),
    carrera("C", null, "Región de Valparaíso", 650, true),
  ]);
  assert.deepEqual(conCorte.map((c) => c.codigo_sies), ["A"]);
});

test("solo entran carreras de la misma región", () => {
  const { conCorte } = alternativasCercanas(meta, [
    carrera("A", "Salud", "Región de Valparaíso", 650, true),
    carrera("B", "Salud", "Región Metropolitana de Santiago", 650, true),
  ]);
  assert.deepEqual(conCorte.map((c) => c.codigo_sies), ["A"]);
});

test("alcanzable: el corte del año anterior es igual o menor al de la meta", () => {
  const { conCorte } = alternativasCercanas(meta, [
    carrera("IGUAL", "Salud", "Región de Valparaíso", 700, true),
    carrera("MENOR", "Salud", "Región de Valparaíso", 600, true),
    carrera("MAYOR", "Salud", "Región de Valparaíso", 700.1, true),
  ]);
  assert.deepEqual(conCorte.map((c) => c.codigo_sies), ["IGUAL", "MENOR"]);
});

test("se ordenan del corte más cercano al de la meta al más lejano, con empate por código", () => {
  const { conCorte } = alternativasCercanas(meta, [
    carrera("LEJOS", "Salud", "Región de Valparaíso", 500, true),
    carrera("B", "Salud", "Región de Valparaíso", 690, true),
    carrera("A", "Salud", "Región de Valparaíso", 690, true),
    carrera("CERCA", "Salud", "Región de Valparaíso", 699, true),
  ]);
  assert.deepEqual(conCorte.map((c) => c.codigo_sies), ["CERCA", "A", "B", "LEJOS"]);
});

test("las carreras fuera del sistema centralizado van aparte, porque no piden ese puntaje", () => {
  const { conCorte, sinPuntajeCentralizado } = alternativasCercanas(meta, [
    carrera("CFT-B", "Salud", "Región de Valparaíso", null, false),
    carrera("CFT-A", "Salud", "Región de Valparaíso", null, false),
  ]);
  assert.deepEqual(conCorte, []);
  assert.deepEqual(sinPuntajeCentralizado.map((c) => c.codigo_sies), ["CFT-A", "CFT-B"]);
});

test("una carrera del sistema centralizado sin corte publicado no entra: no se puede decir si es alcanzable", () => {
  const resultado = alternativasCercanas(meta, [
    carrera("SIN-DATO", "Salud", "Región de Valparaíso", null, true),
    carrera("NO-SE-SABE", "Salud", "Región de Valparaíso", null),
  ]);
  assert.deepEqual(resultado, { conCorte: [], sinPuntajeCentralizado: [] });
});

test("si la meta no tiene corte, no se compara puntaje y solo quedan las que no lo piden", () => {
  const metaSinCorte = carrera("META", "Salud", "Región de Valparaíso", null, false);
  const resultado = alternativasCercanas(metaSinCorte, [
    carrera("A", "Salud", "Región de Valparaíso", 500, true),
    carrera("CFT", "Salud", "Región de Valparaíso", null, false),
  ]);
  assert.deepEqual(resultado.conCorte, []);
  assert.deepEqual(resultado.sinPuntajeCentralizado.map((c) => c.codigo_sies), ["CFT"]);
});

test("si la meta no tiene área, no hay alternativas: no se puede decir qué es cercano", () => {
  const metaSinArea = carrera("META", null, "Región de Valparaíso", 700, true);
  const resultado = alternativasCercanas(metaSinArea, [carrera("A", null, "Región de Valparaíso", 600, true)]);
  assert.deepEqual(resultado, { conCorte: [], sinPuntajeCentralizado: [] });
});

test("excluye la meta y las carreras que la persona ya eligió", () => {
  const { conCorte } = alternativasCercanas(
    meta,
    [meta, carrera("YA", "Salud", "Región de Valparaíso", 650, true), carrera("A", "Salud", "Región de Valparaíso", 640, true)],
    { excluir: ["YA"] },
  );
  assert.deepEqual(conCorte.map((c) => c.codigo_sies), ["A"]);
});

test("el límite corta cada lista por separado", () => {
  const { conCorte, sinPuntajeCentralizado } = alternativasCercanas(
    meta,
    [
      carrera("A", "Salud", "Región de Valparaíso", 690, true),
      carrera("B", "Salud", "Región de Valparaíso", 680, true),
      carrera("C", "Salud", "Región de Valparaíso", null, false),
      carrera("D", "Salud", "Región de Valparaíso", null, false),
    ],
    { limite: 1 },
  );
  assert.deepEqual(conCorte.map((c) => c.codigo_sies), ["A"]);
  assert.deepEqual(sinPuntajeCentralizado.map((c) => c.codigo_sies), ["C"]);
});

test("la condición de cliente no influye: un campo extra no cambia el resultado", () => {
  const base = [
    carrera("A", "Salud", "Región de Valparaíso", 600, true),
    carrera("B", "Salud", "Región de Valparaíso", 690, true),
    carrera("C", "Salud", "Región de Valparaíso", null, false),
  ];
  // La función no recibe ningún campo de cliente; aunque llegara uno, no se lee.
  const conCliente = base.map((c, i) => ({ ...c, es_cliente: i === 0, institucion_cliente: i === 0 }));
  const codigos = (r: ReturnType<typeof alternativasCercanas>) => ({
    conCorte: r.conCorte.map((c) => c.codigo_sies),
    sinPuntajeCentralizado: r.sinPuntajeCentralizado.map((c) => c.codigo_sies),
  });
  assert.deepEqual(codigos(alternativasCercanas(meta, conCliente)), codigos(alternativasCercanas(meta, base)));
  assert.deepEqual(codigos(alternativasCercanas(meta, base)).conCorte, ["B", "A"]);
});

test("no modifica la lista que recibe", () => {
  const lista = [carrera("B", "Salud", "Región de Valparaíso", 600, true), carrera("A", "Salud", "Región de Valparaíso", 690, true)];
  const copia = structuredClone(lista);
  alternativasCercanas(meta, lista);
  assert.deepEqual(lista, copia);
});

test("un límite negativo devuelve listas vacías, no corta desde el final", () => {
  const resultado = alternativasCercanas(meta, [carrera("A", "Salud", "Región de Valparaíso", 690, true)], { limite: -1 });
  assert.deepEqual(resultado, { conCorte: [], sinPuntajeCentralizado: [] });
});

test("aComparable toma el corte de los indicadores y deja null si falta el dato o el área", () => {
  const indicador = { tipo: "puntaje_corte" as const, nivel: "variante" as const, unidad: "puntos" as const, periodo: "admisión 2026", fuente: "Datos abiertos DEMRE", url: "https://ejemplo.invalid", fecha_consulta: "2026-11-17" };
  assert.deepEqual(
    aComparable({ codigo_sies: "A", region: "Región de Valparaíso", area: "Salud", admision_centralizada: true, indicadores: [{ ...indicador, valor: 650.5 }] }),
    { codigo_sies: "A", area: "Salud", region: "Región de Valparaíso", puntaje_corte: 650.5, admision_centralizada: true },
  );
  assert.deepEqual(
    aComparable({ codigo_sies: "B", region: "Región de Valparaíso", indicadores: [{ ...indicador, valor: null, motivo_sin_dato: "Sin datos suficientes" }] }),
    { codigo_sies: "B", area: null, region: "Región de Valparaíso", puntaje_corte: null, admision_centralizada: undefined },
  );
});
