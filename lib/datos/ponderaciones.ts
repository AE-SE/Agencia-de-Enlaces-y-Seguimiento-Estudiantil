// Cómo se muestran las ponderaciones de una carrera en su ficha. Los valores llegan de la
// carga del DEMRE (lib/datos/carreras.ts, RequisitoAdmision): aquí solo se ordenan y se nombran.
// Los nombres de «Prueba especial» y «Asignación especial» son los encabezados que usa el DEMRE
// en su Oferta Definitiva de Carreras, Vacantes y Ponderaciones.
import type { RequisitoAdmision } from './carreras.ts';

export type FilaDePonderacion = {
  factor: string;
  // Porcentaje entero, de 1 a 100.
  porcentaje: number;
  nota?: string;
};

export type MinimosDeAdmision = {
  puntajePonderado: number | null;
  puntajePromedio: number | null;
};

const NOTA_HISTORIA_O_CIENCIAS = 'Cuenta la prueba en que tengas mayor puntaje.';

// Un factor con 0 o sin dato no aporta al puntaje: no se muestra una fila vacía.
function aporta(porcentaje: number | null): porcentaje is number {
  return porcentaje !== null && porcentaje > 0;
}

export function filasDePonderaciones(requisito: RequisitoAdmision): FilaDePonderacion[] {
  const filas: FilaDePonderacion[] = [];
  const agregar = (factor: string, porcentaje: number | null, nota?: string) => {
    if (aporta(porcentaje)) filas.push({ factor, porcentaje, ...(nota ? { nota } : {}) });
  };

  agregar('Notas de Enseñanza Media (NEM)', requisito.nem);
  agregar('Puntaje Ranking', requisito.ranking);
  agregar('Competencia Lectora', requisito.competencia_lectora);
  agregar('Competencia Matemática 1 (M1)', requisito.matematica_1);
  agregar('Competencia Matemática 2 (M2)', requisito.matematica_2);

  if (requisito.historia_o_ciencias) {
    // La base guarda el mismo porcentaje en las dos pruebas: cuenta una sola vez (la de mayor puntaje).
    agregar(
      'Historia y Ciencias Sociales, o Ciencias',
      Math.max(requisito.historia_cs_sociales ?? 0, requisito.ciencias ?? 0),
      NOTA_HISTORIA_O_CIENCIAS,
    );
  } else {
    agregar('Historia y Ciencias Sociales', requisito.historia_cs_sociales);
    agregar('Ciencias', requisito.ciencias);
  }

  agregar('Prueba especial', requisito.prueba_especial);
  agregar('Asignación especial', requisito.asignacion_especial_pedagogia);
  return filas;
}

export function minimosDeAdmision(requisito: RequisitoAdmision): MinimosDeAdmision {
  return { puntajePonderado: requisito.puntaje_ponderado_minimo, puntajePromedio: requisito.puntaje_promedio_minimo };
}
