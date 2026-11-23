import assert from "node:assert/strict";
import test from "node:test";

import { AREA_POR_GENERICA } from "../../lib/datos/areas-sies.ts";
import { armarRespuesta, validarParametros } from "../../lib/meta/alternativas.ts";

const AREA = Object.values(AREA_POR_GENERICA)[0];

test("validarParametros acepta un área del SIES y una región conocida", () => {
  assert.deepEqual(validarParametros(AREA, "Metropolitana"), { area: AREA, region: "Metropolitana" });
});

test("validarParametros rechaza vacíos, áreas inventadas y regiones desconocidas", () => {
  assert.equal(validarParametros(null, "Metropolitana"), null);
  assert.equal(validarParametros(AREA, null), null);
  assert.equal(validarParametros("", ""), null);
  assert.equal(validarParametros("Área inventada", "Metropolitana"), null);
  assert.equal(validarParametros(AREA, "Atlántida"), null);
  assert.equal(validarParametros(AREA, 'Maule","x'), null);
});

const programa = (nombre: string, institucion: string) => ({ nombre, institucion: { nombre: institucion } });
const FUENTES = new Map([["f1", "Datos abiertos DEMRE"]]);

test("armarRespuesta mapea filas de centralizadas (A) y no centralizadas (B)", () => {
  const filasA = [
    {
      codigo_sies: "I1S1C1J1V1", sede: "Santiago", region: "Metropolitana", programa: programa("Enfermería", "Universidad X"),
      indicador: [{ valor: 650.5, periodo: "2026", fuente_id: "f1", url: "https://demre.cl/datos", fecha_consulta: "2026-11-10" }],
    },
  ];
  const filasB = [
    { codigo_sies: "I2S1C1J1V1", sede: null, region: "Metropolitana", programa: programa("Técnico en Enfermería", "CFT Y") },
  ];
  const { carreras, corte } = armarRespuesta(filasA, filasB, AREA, FUENTES);
  assert.equal(carreras.length, 2);
  assert.deepEqual(carreras[0], {
    codigo_sies: "I1S1C1J1V1", carrera: "Enfermería", institucion: "Universidad X", sede: "Santiago",
    href: carreras[0].href, area: AREA, region: "Metropolitana", puntaje_corte: 650.5, admision_centralizada: true,
  });
  assert.match(carreras[0].href, /^\/carreras\/universidad-x\/enfermeria-santiago-/);
  assert.equal(carreras[1].puntaje_corte, null);
  assert.equal(carreras[1].admision_centralizada, false);
  assert.equal(carreras[1].sede, "");
  assert.deepEqual(corte, { periodo: "2026", fuente: "Datos abiertos DEMRE", url: "https://demre.cl/datos", fecha_consulta: "2026-11-10" });
});

test("armarRespuesta sin filas de corte deja la fuente en null", () => {
  assert.deepEqual(armarRespuesta([], [], AREA, FUENTES), { carreras: [], corte: null });
});
