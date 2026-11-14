import assert from "node:assert/strict";
import test from "node:test";

import { categoriaZona, nombresCarreras, radioZona, textosZona, type DatosMapa, type FilaRegion } from "../../lib/datos/mapa-carreras.ts";

const publicable: FilaRegion = {
  codigo_region: "01",
  entradas: 181,
  entradas_estado: "publicable",
  empleabilidad_pct: 78.2,
  cobertura_empleabilidad_pct: 100,
  cruce: "entradas_bajas_empleabilidad_alta",
};

const sinCifra: FilaRegion = {
  codigo_region: "11",
  entradas: null,
  entradas_estado: "menos_de_10",
  empleabilidad_pct: null,
  cobertura_empleabilidad_pct: null,
  cruce: "sin_cifra",
};

test("compara el empleo de la zona con la mediana de la carrera", () => {
  assert.equal(categoriaZona(publicable, 77.4), "sobre");
  assert.equal(categoriaZona({ ...publicable, empleabilidad_pct: 70 }, 77.4), "bajo");
});

test("una zona sin entradas publicables o sin empleo no se compara", () => {
  assert.equal(categoriaZona(sinCifra, 77.4), "sin_dato");
  assert.equal(categoriaZona({ ...publicable, empleabilidad_pct: null }, 77.4), "sin_dato");
});

test("zonas con menos de 10 estudiantes no muestran la cifra", () => {
  const textos = textosZona(sinCifra, 77.4);
  assert.equal(textos.entradas, "menos de 10 estudiantes nuevos");
});

test("el empleo se explica como de cada 100 titulados", () => {
  const textos = textosZona(publicable, 77.4);
  assert.equal(textos.empleo, "78,2 de cada 100 titulados con empleo al primer año");
  assert.equal(textos.comparacion, "Igual o más empleo que la mayoría de las regiones.");
});

test("el radio crece con las entradas y no existe sin cifra", () => {
  assert.equal(radioZona(null, 100), null);
  assert.ok((radioZona(100, 100) ?? 0) > (radioZona(25, 100) ?? 0));
});

test("las carreras se ordenan en español", () => {
  const datos: DatosMapa = {
    anio_entradas: 2026,
    umbral_entradas: 10,
    fuente_empleabilidad: { fuente: "Mi Futuro", url: "https://mifuturo.cl", periodo: "2021-2023", nota: "" },
    carreras: { Zoología: { regiones: [], mediana_entradas_regionales: null, mediana_empleabilidad_regional_pct: null }, Árbitro: { regiones: [], mediana_entradas_regionales: null, mediana_empleabilidad_regional_pct: null } },
  };
  assert.deepEqual(nombresCarreras(datos), ["Árbitro", "Zoología"]);
});
