import assert from "node:assert/strict";
import test from "node:test";

import { filtrarBeneficios, ordenarPlazos } from "../../app/(portal)/beneficios/beneficios.ts";

test("busca beneficios sin distinguir tildes", () => {
  const beneficios = [
    { codigo: "uno", nombre_oficial: "Beca Educación", explicacion_simple: "Podrías recibir apoyo.", requisitos_simples: [], cobertura: { descripcion: "Apoyo" }, postulacion: "Formulario", fuente: "Mineduc", url: "https://ejemplo.cl", fecha_consulta: "2026-11-05" },
  ];

  assert.equal(filtrarBeneficios(beneficios, "educacion").length, 1);
});

test("ordena plazos publicados antes de las fechas pendientes", () => {
  const plazos = [
    { codigo: "pendiente", proceso: "Pendiente", descripcion: "", inicio: null, termino: null, estado: "fecha_pendiente" as const, motivo_sin_fecha: "Sin fecha", fuente: "Mineduc", url: "https://ejemplo.cl", fecha_consulta: "2026-11-05" },
    { codigo: "publicado", proceso: "Publicado", descripcion: "", inicio: "2026-10-01", termino: "2026-10-22", estado: "publicado" as const, motivo_sin_fecha: null, fuente: "Mineduc", url: "https://ejemplo.cl", fecha_consulta: "2026-11-05" },
  ];

  assert.deepEqual(ordenarPlazos(plazos).map((plazo) => plazo.codigo), ["publicado", "pendiente"]);
});
