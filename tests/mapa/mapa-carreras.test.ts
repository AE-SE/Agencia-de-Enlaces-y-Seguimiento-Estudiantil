import assert from "node:assert/strict";
import test from "node:test";

import { buscarCarreras, categoriaZona, nombreRegion, nombresCarreras, radioZona, separarEtiquetas, textosZona, type DatosMapa, type FilaRegion } from "../../lib/datos/mapa-carreras.ts";

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
    fuente_entradas: { fuente: "SIES", url: "https://mifuturo.cl", fecha_consulta: "2026-11-10", nota: "" },
    fuente_empleabilidad: { fuente: "Mi Futuro", url: "https://mifuturo.cl", periodo: "2021-2023", nota: "", fecha_consulta: "2026-11-05" },
    fuente_regiones: { fuente: "BCN", url: "https://www.bcn.cl", fecha_consulta: "2026-11-14" },
    carreras: { Zoología: { regiones: [], mediana_entradas_regionales: null, mediana_empleabilidad_regional_pct: null }, Árbitro: { regiones: [], mediana_entradas_regionales: null, mediana_empleabilidad_regional_pct: null } },
  };
  assert.deepEqual(nombresCarreras(datos), ["Árbitro", "Zoología"]);
});

test("las regiones se muestran con nombre corto, sin «Región de»", () => {
  assert.equal(nombreRegion("07"), "Maule");
  assert.equal(nombreRegion("06"), "O'Higgins");
  assert.ok(!nombreRegion("11").startsWith("Región"));
});

test("la búsqueda ignora tildes, mayúsculas y el orden de las palabras", () => {
  const carreras = ["Enfermería", "Ingeniería Civil en Informática", "Medicina"];
  assert.deepEqual(buscarCarreras(carreras, "enfermeria"), ["Enfermería"]);
  assert.deepEqual(buscarCarreras(carreras, "CIVIL informatica"), ["Ingeniería Civil en Informática"]);
  assert.deepEqual(buscarCarreras(carreras, "enferm"), ["Enfermería"]);
  assert.deepEqual(buscarCarreras(carreras, "xyz"), []);
});

test("sin texto se muestran las primeras carreras y el límite se respeta", () => {
  const muchas = Array.from({ length: 30 }, (_, i) => `Carrera ${i}`);
  assert.equal(buscarCarreras(muchas, "").length, 12);
  assert.equal(buscarCarreras(muchas, "carrera 2", 3).length, 3);
});

test("las etiquetas que se pisan se separan y las que no tienen lugar se ocultan", () => {
  const sueltas = separarEtiquetas([
    { x: 0, y: 0, ancho: 20, alto: 11 },
    { x: 100, y: 0, ancho: 20, alto: 11 },
  ]);
  assert.deepEqual(sueltas, [0, 0]);

  const pisadas = separarEtiquetas([
    { x: 50, y: 50, ancho: 20, alto: 11 },
    { x: 50, y: 52, ancho: 20, alto: 11 },
  ]);
  assert.equal(pisadas[0], 0);
  assert.ok(pisadas[1] !== null && Math.abs(pisadas[1]) >= 12, "la segunda debe moverse fuera de la primera");

  assert.deepEqual(separarEtiquetas([{ x: 0, y: 0, ancho: 20, alto: 11 }, { x: 0, y: 0, ancho: 20, alto: 11 }], 0), [0, null]);
});
