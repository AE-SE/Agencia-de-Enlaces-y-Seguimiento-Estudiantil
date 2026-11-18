import type { Carrera, Indicador } from './carreras.ts';
import { COMO_SE_CALCULA, costoPrimerAnio } from './costo.ts';

// Indicadores que el portal muestra al comparar o al armar la hoja de decisión.
// Cada uno dice qué mide, para que nadie lea una cifra por otra (AGENTS.md 2.1).

// «ingreso_tramo» no es un indicador numérico: el SIES publica el ingreso como un tramo en palabras (Carrera.ingreso_tramo).
// «costo_primer_anio» tampoco está en la base: se calcula con el arancel y la matrícula (lib/datos/costo.ts).
export type TipoDeFila = Indicador['tipo'] | 'ingreso_tramo' | 'costo_primer_anio';

export type FilaIndicador = {
  tipo: TipoDeFila;
  titulo: string;
  unidad: string;
  queMide: string;
};

export const FILAS_INDICADORES: FilaIndicador[] = [
  { tipo: 'empleabilidad_1er_anio', titulo: 'Empleabilidad al 1.er año', unidad: 'porcentaje', queMide: 'Porcentaje de personas tituladas que ganaron al menos el sueldo mínimo durante el primer año después de titularse. Solo considera a quienes registran ingresos.' },
  { tipo: 'ingreso_tramo', titulo: 'Ingreso al 4.º año', unidad: 'tramo en pesos chilenos', queMide: 'Tramo del ingreso bruto mensual de las personas tituladas, al cuarto año después de titularse.' },
  { tipo: 'retencion_1er_anio', titulo: 'Retención de primer año', unidad: 'porcentaje', queMide: 'Porcentaje de estudiantes de primer año que siguen matriculados al año siguiente.' },
  { tipo: 'continuidad_estudios', titulo: 'Continuidad de estudios', unidad: 'porcentaje', queMide: 'Porcentaje de personas tituladas que se matriculan al año siguiente de titularse.' },
  { tipo: 'arancel_anual', titulo: 'Costo del arancel anual', unidad: 'pesos chilenos', queMide: 'Lo que pagas cada año, antes de aplicar beneficios.' },
  { tipo: 'matricula_inscripcion', titulo: 'Costo de matrícula', unidad: 'pesos chilenos', queMide: 'Valor en pesos que se paga para hacer efectiva la matrícula, aparte del arancel anual.' },
  { tipo: 'costo_primer_anio', titulo: 'Costo del primer año', unidad: 'pesos chilenos', queMide: `Arancel anual más costo de matrícula, antes de aplicar beneficios. ${COMO_SE_CALCULA}` },
  { tipo: 'duracion_formal_semestres', titulo: 'Duración formal', unidad: 'semestres', queMide: 'Lo que dura la carrera según su plan de estudios, sin contar el proceso de titulación.' },
  { tipo: 'duracion_real_semestres', titulo: 'Duración real', unidad: 'semestres', queMide: 'Tiempo que tardaron en titularse quienes terminaron la carrera.' },
  { tipo: 'vacantes', titulo: 'Vacantes', unidad: 'cupos', queMide: 'Cupos disponibles para postular.' },
  { tipo: 'puntaje_corte', titulo: 'Puntaje de corte', unidad: 'puntos', queMide: 'Puntaje ponderado de la última persona seleccionada por la vía regular el año anterior. Elaboración propia con Datos abiertos DEMRE 2026.' },
  { tipo: 'matricula', titulo: 'Matrícula total', unidad: 'estudiantes', queMide: 'Personas matriculadas en esta carrera, sumando todos sus años.' },
];

// Las filas se agrupan por la pregunta que responden, para que una comparación de once datos no sea una lista larga.
// Cada fila está en un solo grupo (lo comprueba tests/datos/indicadores-vista.test.ts).
export type GrupoDeFilas = { id: string; titulo: string; tipos: TipoDeFila[] };

export const GRUPOS_DE_FILAS: GrupoDeFilas[] = [
  { id: 'costo', titulo: 'Cuánto cuesta', tipos: ['arancel_anual', 'matricula_inscripcion', 'costo_primer_anio'] },
  { id: 'entrada', titulo: 'Cómo entrar', tipos: ['vacantes', 'puntaje_corte'] },
  { id: 'estudiar', titulo: 'Cómo es estudiarla', tipos: ['duracion_formal_semestres', 'duracion_real_semestres', 'retencion_1er_anio', 'matricula'] },
  { id: 'despues', titulo: 'Después de titularte', tipos: ['empleabilidad_1er_anio', 'ingreso_tramo', 'continuidad_estudios'] },
];

export function filasDelGrupo(grupo: GrupoDeFilas): FilaIndicador[] {
  return grupo.tipos.map((tipo) => FILAS_INDICADORES.find((fila) => fila.tipo === tipo)!);
}

export function formatoIndicador(indicador: Indicador): string {
  if (indicador.valor === null) return 'Sin datos suficientes';
  if (indicador.unidad === 'pesos') {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(indicador.valor);
  }
  if (indicador.unidad === 'porcentaje') return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor)} %`;
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor);
}

// Valor para la hoja de decisión: además del número, la unidad cuando el número solo no se entiende
// («11,17» no dice nada; «11,17 semestres» sí). Pesos y porcentaje ya la traen en el formato.
export function valorConUnidad(indicador: Indicador, fila: FilaIndicador): string {
  const texto = formatoIndicador(indicador);
  if (indicador.valor === null || indicador.unidad === 'pesos' || indicador.unidad === 'porcentaje') return texto;
  return `${texto} ${fila.unidad}`;
}

const TIPOS_DEL_SIES: TipoDeFila[] = ['empleabilidad_1er_anio', 'ingreso_tramo', 'retencion_1er_anio', 'continuidad_estudios', 'duracion_real_semestres'];
const TIPOS_DE_ADMISION: TipoDeFila[] = ['vacantes', 'puntaje_corte'];

// Qué decir cuando la carrera no tiene fila para este dato: una razón en palabras, nunca un hueco.
export function motivoSinFila(carrera: Carrera, fila: FilaIndicador): string {
  if (TIPOS_DE_ADMISION.includes(fila.tipo) && carrera.admision_centralizada === false) {
    return 'Esta carrera no entra por el sistema de admisión centralizado (el de la Prueba de Acceso a la Educación Superior, PAES): se ingresa directamente en la institución.';
  }
  if (TIPOS_DEL_SIES.includes(fila.tipo)) {
    return 'Mi Futuro no publica este dato para esta carrera, o no pudimos asociarla con seguridad a sus cifras.';
  }
  return 'Este dato aún no está cargado.';
}

// Lo que una fila muestra de una carrera. Une los indicadores numéricos y el tramo de ingreso, que vienen en formas distintas,
// para que el comparador y la hoja de decisión los traten igual. «texto» ya trae la unidad cuando hace falta.
export type DatoDeFila = {
  texto: string | null;
  motivo: string;
  nivel: 'programa' | 'variante';
  periodo: string;
  fuente: string;
  url: string;
  fecha_consulta: string;
};

export function datoDeFila(carrera: Carrera, fila: FilaIndicador, conUnidad: boolean): DatoDeFila {
  if (fila.tipo === 'ingreso_tramo') {
    const t = carrera.ingreso_tramo;
    if (!t) return { texto: null, motivo: motivoSinFila(carrera, fila), nivel: 'programa', periodo: '', fuente: '', url: '', fecha_consulta: '' };
    return { texto: t.tramo, motivo: t.motivo_sin_dato ?? motivoSinFila(carrera, fila), nivel: 'programa', periodo: t.periodo, fuente: t.fuente, url: t.url, fecha_consulta: t.fecha_consulta };
  }
  if (fila.tipo === 'costo_primer_anio') {
    const costo = costoPrimerAnio(carrera);
    if (costo.total === null) return { texto: null, motivo: costo.motivo, nivel: 'variante', periodo: '', fuente: '', url: '', fecha_consulta: '' };
    const { periodo, fuente, url, fecha_consulta } = costo.arancel;
    const texto = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(costo.total);
    return { texto, motivo: '', nivel: 'variante', periodo, fuente, url, fecha_consulta };
  }
  const indicador = carrera.indicadores.find((i) => i.tipo === fila.tipo);
  if (!indicador) return { texto: null, motivo: motivoSinFila(carrera, fila), nivel: 'variante', periodo: '', fuente: '', url: '', fecha_consulta: '' };
  const { nivel, periodo, fuente, url, fecha_consulta } = indicador;
  if (indicador.valor === null) return { texto: null, motivo: indicador.motivo_sin_dato, nivel, periodo, fuente, url, fecha_consulta };
  return { texto: conUnidad ? valorConUnidad(indicador, fila) : formatoIndicador(indicador), motivo: '', nivel, periodo, fuente, url, fecha_consulta };
}
