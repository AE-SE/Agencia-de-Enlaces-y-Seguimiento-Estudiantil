import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Revisa el JSON publicado: lo que sale del script no debe traer nombres de instituciones
// ni cifras bajo el umbral (ADR 0025 y ADR 0036).
type FilaPublicada = Record<string, unknown> & { entradas: number | null; entradas_estado: string };
type DatosPublicados = {
  umbral_entradas: number;
  fuente_empleabilidad: { url: string };
  registros_excluidos_sin_cobertura: number;
  carreras: Record<string, { regiones: FilaPublicada[] }>;
};

const datos: DatosPublicados = JSON.parse(readFileSync(new URL("../../lib/datos/mapa/carreras-regiones.json", import.meta.url), "utf-8"));

const CAMPOS_PERMITIDOS = new Set([
  "codigo_region",
  "entradas",
  "entradas_estado",
  "empleabilidad_pct",
  "cobertura_empleabilidad_pct",
  "cruce",
]);

test("el JSON publicado tiene el umbral de 10 y la fuente de empleo", () => {
  assert.equal(datos.umbral_entradas, 10);
  assert.match(datos.fuente_empleabilidad.url, /^https:\/\//);
  assert.ok(Number.isInteger(datos.registros_excluidos_sin_cobertura));
});

test("cada fila solo trae campos agregados, sin nombres de instituciones ni sedes", () => {
  for (const [carrera, bloque] of Object.entries(datos.carreras)) {
    for (const fila of bloque.regiones) {
      for (const campo of Object.keys(fila)) {
        assert.ok(CAMPOS_PERMITIDOS.has(campo), `${carrera}: campo no permitido «${campo}»`);
      }
    }
  }
});

test("una zona con menos de 10 entradas no publica la cifra", () => {
  for (const [carrera, bloque] of Object.entries(datos.carreras)) {
    for (const fila of bloque.regiones) {
      if (fila.entradas_estado === "menos_de_10") {
        assert.equal(fila.entradas, null, `${carrera}: cifra publicada bajo el umbral`);
      } else {
        assert.ok((fila.entradas ?? 0) >= 10, `${carrera}: entradas publicables bajo 10`);
      }
    }
  }
});
