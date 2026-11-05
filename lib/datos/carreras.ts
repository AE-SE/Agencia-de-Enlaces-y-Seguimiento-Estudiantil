import datosCarreras from '../../datos/ejemplos/carreras.json' with { type: 'json' };

import type { TipoIndicador, TipoInstitucion, UnidadIndicador } from './tipos.ts';

export type IndicadorConDato = {
  tipo: TipoIndicador;
  // ADR 0011: "programa" = carrera completa en la institución; "variante" = una sede y jornada (código SIES).
  nivel: 'programa' | 'variante';
  valor: number;
  unidad: UnidadIndicador;
  periodo: string;
  fuente: string;
  url: string;
  fecha_consulta: string;
};

export type IndicadorSinDato = Omit<IndicadorConDato, 'valor'> & {
  valor: null;
  motivo_sin_dato: string;
};

export type Indicador = IndicadorConDato | IndicadorSinDato;

export type Carrera = {
  codigo_sies: string;
  carrera: string;
  institucion: { nombre: string; tipo: TipoInstitucion };
  sede: string;
  comuna: string;
  region: string;
  jornada: string;
  duracion_semestres: number;
  indicadores: Indicador[];
};

// TODO(fuente): en el origen, matricula está rotulada como "cupos", pero mide
// estudiantes de toda la carrera; se expone sin cambiar hasta corregir la fuente.
function leerCarreras(): Carrera[] {
  return datosCarreras.carreras as Carrera[];
}

export function listarCarreras(): Carrera[] {
  return leerCarreras();
}

export function obtenerCarrera(codigoSies: string): Carrera | null {
  return leerCarreras().find((carrera) => carrera.codigo_sies === codigoSies) ?? null;
}
