import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  anchoBarra,
  cambioEntre,
  columnasHistograma,
  decimal,
  miles,
  porcentaje,
  porcentajeConSigno,
  posicionEje,
  posicionEnRango,
  rangoCobertura,
} from "../../app/(portal)/transparencia/transparencia.ts";

const datos = JSON.parse(readFileSync(new URL("../../datos/transparencia/pronostico_2027.json", import.meta.url), "utf8"));

const LLAVES_PROHIBIDAS = new Set([
  "institucion", "instituciones", "inst", "sede", "carrera", "comuna", "codigo_comuna",
  "proporcion_mujeres", "mujeres", "sexo", "celdas", "suprimidas", "nombre_institucion",
]);

function llaves(valor: unknown, acumulado: string[] = []): string[] {
  if (Array.isArray(valor)) valor.forEach((x) => llaves(x, acumulado));
  else if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      acumulado.push(k);
      llaves(v, acumulado);
    }
  }
  return acumulado;
}

function textos(valor: unknown, acumulado: string[] = []): string[] {
  if (typeof valor === "string") acumulado.push(valor);
  else if (Array.isArray(valor)) valor.forEach((x) => textos(x, acumulado));
  else if (valor && typeof valor === "object") Object.values(valor).forEach((x) => textos(x, acumulado));
  return acumulado;
}

test("da formato chileno a miles, decimales y porcentajes", () => {
  assert.equal(miles(382725), "382.725");
  assert.equal(miles(1234), "1.234");
  assert.equal(miles(999), "999");
  assert.equal(decimal(1.615, 1), "1,6");
  assert.equal(decimal(1.615, 3), "1,615");
  assert.equal(porcentaje(0.775), "77,5 %");
  assert.equal(porcentajeConSigno(0.014), "+1,4 %");
  assert.equal(porcentajeConSigno(-0.07), "−7,0 %");
});

test("el cambio de la PAES 2022 a 2023 coincide con lo que dice el informe", () => {
  const serie = datos.paes.serie;
  // docs/analisis/informe-pronostico-2027.md: el salto de filas era un cambio de definición.
  assert.equal(porcentajeConSigno(cambioEntre(serie, 2022, 2023, "filas")), "+15,6 %");
  assert.equal(porcentajeConSigno(cambioEntre(serie, 2022, 2023, "regulares")), "+2,2 %");
  assert.throws(() => cambioEntre(serie, 1999, 2023, "filas"));
});

test("el rango simple se queda corto y el adoptado llega cerca del 95 % en los pasos recientes", () => {
  const simple = rangoCobertura(datos.validacion_comunas.pasos, "cobertura_poisson", 2024);
  const adoptado = rangoCobertura(datos.validacion_comunas.pasos, "cobertura_empirico", 2024);
  assert.ok(simple.maximo < 0.8, "el simple no debería pasar de 80 %");
  assert.ok(adoptado.minimo > 0.9, "el adoptado debería superar 90 %");
  assert.throws(() => rangoCobertura(datos.validacion_comunas.pasos, "cobertura_empirico", 2100));
});

test("las barras y el rango nunca se salen de 0 a 100", () => {
  assert.equal(anchoBarra(50, 100), 50);
  assert.equal(anchoBarra(150, 100), 100);
  assert.equal(anchoBarra(-5, 100), 0);
  assert.equal(anchoBarra(5, 0), 0);
  assert.equal(posicionEnRango(50, 0, 100), 50);
  assert.equal(posicionEnRango(-10, 0, 100), 0);
  assert.equal(posicionEnRango(10, 5, 5), 50);
});

test("el histograma marca como «dentro» las columnas entre los cortes", () => {
  const vc = datos.validacion_carrera_sede;
  const columnas = columnasHistograma(vc.histograma, vc.q_bajo, vc.q_alto);
  assert.equal(columnas.length, vc.histograma.conteos.length);
  assert.ok(columnas.some((c) => c.dentro) && columnas.some((c) => !c.dentro));
  assert.equal(Math.max(...columnas.map((c) => c.altura)), 100);
  assert.equal(posicionEje(vc.histograma.inicio, vc.histograma), 0);
});

test("el archivo público no trae instituciones, sedes, carreras, comunas ni sexo", () => {
  const encontradas = llaves(datos).filter((k) => LLAVES_PROHIBIDAS.has(k));
  assert.deepEqual(encontradas, []);
  const todo = textos(datos).join(" ").toLowerCase();
  assert.ok(!todo.includes("mujeres"), "no debe haber cifras por sexo");
  assert.ok(!/\.py\b|datos\/(procesados|pronosticos)/.test(todo), "no debe mostrar rutas internas del repositorio");
});

test("cada estimación publicada trae fuente, enlace, fecha de registro y un rango que la contiene", () => {
  assert.deepEqual(datos.estimaciones.map((e: { codigo: string }) => e.codigo), ["primer_anio_2027", "permanencia_2028"]);
  for (const e of datos.estimaciones) {
    assert.ok(e.fuente.length > 0);
    assert.match(e.url, /^https:\/\//);
    assert.match(e.registrado, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(e.inferior < e.valor && e.valor < e.superior, `${e.codigo}: el valor debe estar dentro del rango`);
  }
  // La permanencia no puede ser mayor que el ingreso del que sale.
  assert.ok(datos.estimaciones[1].valor < datos.estimaciones[0].valor);
});

test("la retención por tipo son fracciones y la mezcla suma 100 % (con tolerancia de redondeo)", () => {
  const { valores } = datos.retencion_por_tipo;
  for (const v of valores) assert.ok(v.retencion > 0 && v.retencion < 1);
  const suma = valores.reduce((a: number, v: { mezcla_2026: number }) => a + v.mezcla_2026, 0);
  assert.ok(Math.abs(suma - 1) < 0.005, `la mezcla suma ${suma}`);
});

test("el calendario solo usa los estados que la página sabe mostrar", () => {
  for (const c of datos.calendario) assert.ok(["confirmada", "por verificar"].includes(c.estado), c.estado);
});
