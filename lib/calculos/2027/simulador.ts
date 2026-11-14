import type { RequisitoAdmision } from '@/lib/datos/carreras.ts';

import { calcularPuntajePonderado, cumpleRequisitosMinimos, elegirMejorPuntajeElectivo, type FactorPonderado } from './puntaje-ponderado.ts';

export type PuntajesSimulador = Readonly<{
  nem: number | null;
  ranking: number | null;
  lectora: number | null;
  m1: number | null;
  m2: number | null;
  historia: number | null;
  ciencias: number | null;
}>;

function ponderacion(requisito: RequisitoAdmision, nombre: keyof RequisitoAdmision): number {
  const valor = requisito[nombre];
  return typeof valor === 'number' ? valor : 0;
}

function agregarFactor(factores: FactorPonderado[], puntaje: number | null, peso: number): void {
  if (puntaje !== null && peso > 0) factores.push({ puntaje, ponderacion: peso });
}

// Arma los factores publicados para una carrera; la fórmula permanece en puntaje-ponderado.ts.
export function calcularSimulacion(requisito: RequisitoAdmision, puntajes: PuntajesSimulador): {
  puntajePonderado: number;
  cumpleMinimos: boolean | null;
} {
  const factores: FactorPonderado[] = [];
  agregarFactor(factores, puntajes.nem, ponderacion(requisito, 'nem'));
  agregarFactor(factores, puntajes.ranking, ponderacion(requisito, 'ranking'));
  agregarFactor(factores, puntajes.lectora, ponderacion(requisito, 'competencia_lectora'));
  agregarFactor(factores, puntajes.m1, ponderacion(requisito, 'matematica_1'));
  agregarFactor(factores, puntajes.m2, ponderacion(requisito, 'matematica_2'));

  if (requisito.historia_o_ciencias) {
    const electiva = elegirMejorPuntajeElectivo(puntajes.ciencias, puntajes.historia);
    factores.push({ puntaje: electiva, ponderacion: Math.max(ponderacion(requisito, 'historia_cs_sociales'), ponderacion(requisito, 'ciencias')) });
  } else {
    agregarFactor(factores, puntajes.historia, ponderacion(requisito, 'historia_cs_sociales'));
    agregarFactor(factores, puntajes.ciencias, ponderacion(requisito, 'ciencias'));
  }

  const puntajePonderado = calcularPuntajePonderado(factores);
  const cumpleMinimos = puntajes.lectora !== null && puntajes.m1 !== null
    ? cumpleRequisitosMinimos(puntajePonderado, { competenciaLectora: puntajes.lectora, matematica1: puntajes.m1 }, {
      puntajePonderadoMinimo: requisito.puntaje_ponderado_minimo,
      puntajePromedioMinimo: requisito.puntaje_promedio_minimo,
    })
    : null;

  return { puntajePonderado, cumpleMinimos };
}
