import assert from "node:assert/strict";
import test from "node:test";

import { paginar } from "../../lib/datos/paginar.ts";

function origen(total: number) {
  const pedidas: Array<[number, number]> = [];
  const consultarPagina = async (desde: number, porPagina: number) => {
    pedidas.push([desde, porPagina]);
    return { filas: Array.from({ length: Math.max(0, Math.min(porPagina, total - desde)) }, (_, i) => desde + i) };
  };
  return { consultarPagina, pedidas };
}

test("junta varias páginas en orden hasta una incompleta", async () => {
  const { consultarPagina, pedidas } = origen(2500);
  const { filas } = await paginar(consultarPagina, 1000);
  assert.equal(filas.length, 2500);
  assert.deepEqual(filas.slice(995, 1005), [995, 996, 997, 998, 999, 1000, 1001, 1002, 1003, 1004]);
  assert.deepEqual(pedidas, [[0, 1000], [1000, 1000], [2000, 1000]]);
});

test("si la última página trae justo el máximo, pide una más y vacía", async () => {
  const { consultarPagina, pedidas } = origen(2000);
  const { filas } = await paginar(consultarPagina, 1000);
  assert.equal(filas.length, 2000);
  assert.deepEqual(pedidas, [[0, 1000], [1000, 1000], [2000, 1000]]);
});

test("una sola página incompleta hace una sola consulta", async () => {
  const { consultarPagina, pedidas } = origen(40);
  const { filas } = await paginar(consultarPagina, 1000);
  assert.equal(filas.length, 40);
  assert.equal(pedidas.length, 1);
});

test("sin filas devuelve una lista vacía", async () => {
  const { filas } = await paginar(origen(0).consultarPagina, 1000);
  assert.deepEqual(filas, []);
});

test("el error de una página se propaga y no se devuelven filas parciales", async () => {
  let llamadas = 0;
  const falla = async (_desde: number, porPagina: number) => {
    llamadas += 1;
    if (llamadas === 2) throw new Error("Supabase no responde");
    return { filas: new Array(porPagina).fill(0) };
  };
  await assert.rejects(paginar(falla, 1000), /Supabase no responde/);
  assert.equal(llamadas, 2);
});
