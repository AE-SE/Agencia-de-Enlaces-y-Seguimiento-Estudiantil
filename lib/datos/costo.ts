import type { Carrera, Indicador } from './carreras.ts';

// Costo del primer año: el arancel anual más el valor que se paga para hacer efectiva la matrícula. Es elaboración
// propia: ninguna fuente publica esa suma. Mineduc define ambos campos en el diccionario de la base de Matrícula 2026
// (página 3): VALOR_ARANCEL es el «arancel anual» y VALOR_MATRICULA el «valor en pesos que el estudiante debe pagar
// para hacer efectiva su matrícula». El diccionario no dice si la matrícula se repite cada año; por eso se habla solo
// del primer año, en que se pagan ambos. Solo se calcula cuando Mineduc informa los dos montos: con uno solo se
// mostraría un costo menor al real.
export type CostoPrimerAnio = { total: number; arancel: Indicador } | { total: null; motivo: string };

export const COMO_SE_CALCULA = 'Elaboración propia: arancel anual más costo de matrícula, con los datos de Mineduc.';

const buscar = (carrera: Carrera, tipo: Indicador['tipo']) => carrera.indicadores.find((i) => i.tipo === tipo);

export function costoPrimerAnio(carrera: Carrera): CostoPrimerAnio {
  const arancel = buscar(carrera, 'arancel_anual');
  const matricula = buscar(carrera, 'matricula_inscripcion');
  if (!arancel || arancel.valor === null) {
    return { total: null, motivo: 'Mineduc no informa el arancel de esta carrera, así que no podemos sumar el costo del primer año.' };
  }
  if (!matricula || matricula.valor === null) {
    return { total: null, motivo: 'Mineduc no informa el costo de matrícula de esta carrera, así que no podemos sumar el costo del primer año.' };
  }
  return { total: arancel.valor + matricula.valor, arancel };
}
