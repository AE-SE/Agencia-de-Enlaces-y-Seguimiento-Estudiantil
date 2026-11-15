// La oferta completa NO se importa en el código del sitio: pesa decenas de MB y no cabe
// en el Worker. Solo se lee al compilar (fichas estáticas), con fs. Las pantallas que
// se atienden en vivo consultan Supabase (lib/datos/oferta-remota.ts).
// El archivo lo escribe scripts/exportar-oferta.ts (prebuild).
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

// Ponderaciones oficiales de una variante para un proceso de admisión. No se
// calculan ni se completan en la interfaz: llegan desde la carga DEMRE.
export type RequisitoAdmision = {
  nem: number | null;
  ranking: number | null;
  competencia_lectora: number | null;
  matematica_1: number | null;
  matematica_2: number | null;
  historia_cs_sociales: number | null;
  ciencias: number | null;
  historia_o_ciencias: boolean;
  prueba_especial: number | null;
  asignacion_especial_pedagogia: number | null;
  puntaje_ponderado_minimo: number | null;
  puntaje_promedio_minimo: number | null;
  periodo: string;
  fuente: string;
  url: string;
  fecha_consulta: string;
};

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
  requisito_admision?: RequisitoAdmision;
};

let cache: Carrera[] | null = null;

// Solo para compilar y para pruebas. No llamar desde una página que se atiende en vivo.
function leerCarreras(): Carrera[] {
  if (!cache) {
    // OFERTA_RUTA permite a las pruebas usar la muestra; en el sitio es la oferta exportada.
    const ruta = process.env.OFERTA_RUTA ?? resolve(process.cwd(), 'lib/datos/oferta-generada.json');
    cache = (JSON.parse(readFileSync(ruta, 'utf8')) as { carreras: Carrera[] }).carreras;
  }
  return cache;
}

export function listarCarreras(): Carrera[] {
  return leerCarreras();
}

export function obtenerCarrera(codigoSies: string): Carrera | null {
  return leerCarreras().find((carrera) => carrera.codigo_sies === codigoSies) ?? null;
}
