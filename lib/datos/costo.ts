import type { Carrera, Indicador } from './carreras.ts';

// Lo que se paga el primer año: la matrícula de inscripción más el arancel anual (el primer año se pagan ambos,
// sea cual sea la frecuencia de la matrícula). Es elaboración propia: ninguna fuente publica esa suma. Solo se calcula cuando Mineduc
// informa los dos montos; con uno solo se mostraría un costo menor al real.
export type CostoPrimerAnio = { total: number; arancel: Indicador } | { total: null; motivo: string };

const buscar = (carrera: Carrera, tipo: Indicador['tipo']) => carrera.indicadores.find((i) => i.tipo === tipo);

export function costoPrimerAnio(carrera: Carrera): CostoPrimerAnio {
  const arancel = buscar(carrera, 'arancel_anual');
  const matricula = buscar(carrera, 'matricula_inscripcion');
  if (!arancel || arancel.valor === null) {
    return { total: null, motivo: 'Mineduc no informa el arancel de esta carrera, así que no podemos sumar el costo del primer año.' };
  }
  if (!matricula || matricula.valor === null) {
    return { total: null, motivo: 'Mineduc no informa la matrícula de inscripción de esta carrera, así que no podemos sumar el costo del primer año.' };
  }
  return { total: arancel.valor + matricula.valor, arancel };
}
