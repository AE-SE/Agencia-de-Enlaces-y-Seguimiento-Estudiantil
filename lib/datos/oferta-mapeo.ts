// Mapeo de la base a la forma de la oferta del portal (una carrera = una variante).
// Lo usan el exportador (scripts/exportar-oferta.ts) y el portal al consultar Supabase.
// Un cambio aquí cambia lo que ve el estudiante: tiene pruebas en tests/datos/exportar-oferta.test.ts.

import type { AcreditacionInstitucion, Carrera, Indicador, RequisitoAdmision, TramoIngreso } from './carreras.ts';
import { AREA_POR_GENERICA } from './areas-sies.ts';
import type { TipoInstitucion, TipoIndicador, UnidadIndicador } from './tipos.ts';

// ---------------------------------------------------------------------------
// Forma de las filas que devuelve la base (solo las columnas que se usan).
// ---------------------------------------------------------------------------

export type DatosBase = {
  instituciones: { id: string; nombre: string; tipo: TipoInstitucion }[];
  programas: { id: string; institucion_id: string; nombre: string }[];
  variantes: {
    id: string;
    programa_id: string;
    programa_generico_id: string;
    // programa_generico.nombre_normalizado: la clave del área del SIES. Ausente si no se consultó.
    generica_normalizada?: string | null;
    codigo_sies: string;
    codigo_demre?: string | null;
    sede: string | null;
    comuna: string | null;
    region: string | null;
    jornada: string | null;
    duracion_semestres: number | null;
    fuente_id: string;
  }[];
  aranceles: {
    variante_id: string;
    valor_pesos: number | null;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  vacantes: {
    variante_id: string;
    via: string;
    cupos: number | null;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  indicadores: {
    programa_generico_id: string;
    tipo: TipoIndicador;
    valor: number | null;
    unidad: UnidadIndicador;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  // Indicadores de una variante (sede y jornada): hoy solo el puntaje del último seleccionado, calculado por nosotros
  // con los datos abiertos del DEMRE. Son filas de `indicador` con variante_id.
  indicadores_variante: {
    variante_id: string;
    tipo: TipoIndicador;
    valor: number | null;
    unidad: UnidadIndicador;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  // Tramo de ingreso al 4.º año del SIES, por carrera genérica (tabla tramo_ingreso_sies).
  tramos_ingreso: {
    programa_generico_id: string;
    tramo_publicado: string | null;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
    motivo_sin_dato: string | null;
  }[];
  requisitos: {
    variante_id: string;
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
    fuente_id: string;
    url: string;
    fecha_consulta: string;
  }[];
  // Una fila por institución y fecha de la fuente: se usa la más reciente (tabla acreditacion_institucion).
  acreditaciones: {
    institucion_id: string;
    estado: AcreditacionInstitucion['estado'];
    anios: number | null;
    desde: string | null;
    hasta: string | null;
    situacion_al: string;
    periodo: string;
    fuente_id: string;
    url: string;
    fecha_consulta: string;
  }[];
  fuentes: { id: string; organismo: string; nombre: string }[];
};

// Sigla que usa el portal para cada fuente (lib/datos/fuentes.ts).
const SIGLA_POR_ORGANISMO: Record<string, string> = {
  'SIES, Mineduc': 'Mi Futuro',
  Mineduc: 'Datos Abiertos Mineduc',
  DEMRE: 'DEMRE',
  'Datos abiertos DEMRE': 'Datos abiertos DEMRE',
};

const TIPOS_SIES: TipoIndicador[] = [
  'retencion_1er_anio',
  'empleabilidad_1er_anio',
  'empleabilidad_2do_anio',
  'continuidad_estudios',
  'duracion_real_semestres',
];

export function construirOferta(datos: DatosBase): Carrera[] {
  const instPorId = new Map(datos.instituciones.map((i) => [i.id, i]));
  const progPorId = new Map(datos.programas.map((p) => [p.id, p]));
  const fuentePorId = new Map(datos.fuentes.map((f) => [f.id, SIGLA_POR_ORGANISMO[f.organismo] ?? f.organismo]));

  const arancelesPorVariante = agrupar(datos.aranceles, (a) => a.variante_id);
  const vacantesPorVariante = agrupar(
    datos.vacantes.filter((v) => v.via === 'regular'),
    (v) => v.variante_id,
  );
  const indicadoresPorGenerico = agrupar(datos.indicadores, (i) => i.programa_generico_id);
  const requisitoPorVariante = new Map(datos.requisitos.map((r) => [r.variante_id, r]));
  // La acreditación más reciente de cada institución: la fecha de la fuente («situacion_al») manda.
  const acreditacionPorInstitucion = new Map<string, DatosBase['acreditaciones'][number]>();
  for (const a of datos.acreditaciones) {
    const actual = acreditacionPorInstitucion.get(a.institucion_id);
    if (!actual || a.situacion_al > actual.situacion_al) acreditacionPorInstitucion.set(a.institucion_id, a);
  }
  const indicadoresPorVariante = agrupar(datos.indicadores_variante, (i) => i.variante_id);
  const tramoPorGenerico = new Map(datos.tramos_ingreso.map((t) => [t.programa_generico_id, t]));

  const carreras: Carrera[] = [];
  for (const v of datos.variantes) {
    const prog = progPorId.get(v.programa_id);
    const inst = prog ? instPorId.get(prog.institucion_id) : undefined;
    if (!prog || !inst) {
      throw new Error(`variante sin programa o institución: ${v.codigo_sies}`);
    }

    const indicadores: Indicador[] = [];

    // Duración formal: la que informa Mineduc en la carga de matrícula. Va con la fuente del arancel de la misma variante
    // (es el mismo archivo); sin arancel no hay fuente que citar y no se publica.
    const origenDuracion = (arancelesPorVariante.get(v.id) ?? [])[0];
    if (origenDuracion && v.duracion_semestres && v.duracion_semestres > 0) {
      indicadores.push(
        filaIndicador({
          tipo: 'duracion_formal_semestres',
          nivel: 'variante',
          unidad: 'semestres',
          valor: v.duracion_semestres,
          periodo: origenDuracion.periodo,
          fuente: fuentePorId.get(origenDuracion.fuente_id) ?? '',
          url: origenDuracion.url,
          fecha_consulta: origenDuracion.fecha_consulta,
          motivo: null,
        }),
      );
    }

    for (const a of arancelesPorVariante.get(v.id) ?? []) {
      indicadores.push(
        filaIndicador({
          tipo: 'arancel_anual',
          nivel: 'variante',
          unidad: 'pesos',
          valor: a.valor_pesos,
          periodo: a.periodo,
          fuente: fuentePorId.get(a.fuente_id) ?? '',
          url: a.url,
          fecha_consulta: a.fecha_consulta,
          motivo: a.motivo_sin_dato,
        }),
      );
    }

    for (const c of vacantesPorVariante.get(v.id) ?? []) {
      indicadores.push(
        filaIndicador({
          tipo: 'vacantes',
          nivel: 'variante',
          unidad: 'cupos',
          valor: c.cupos,
          periodo: c.periodo,
          fuente: fuentePorId.get(c.fuente_id) ?? '',
          url: c.url,
          fecha_consulta: c.fecha_consulta,
          motivo: c.motivo_sin_dato,
        }),
      );
    }

    for (const i of indicadoresPorVariante.get(v.id) ?? []) {
      indicadores.push(
        filaIndicador({
          tipo: i.tipo,
          nivel: 'variante',
          unidad: i.unidad,
          valor: i.valor,
          periodo: i.periodo,
          fuente: fuentePorId.get(i.fuente_id) ?? '',
          url: i.url,
          fecha_consulta: i.fecha_consulta,
          motivo: i.motivo_sin_dato,
        }),
      );
    }

    for (const i of indicadoresPorGenerico.get(v.programa_generico_id) ?? []) {
      if (!TIPOS_SIES.includes(i.tipo)) continue;
      indicadores.push(
        filaIndicador({
          tipo: i.tipo,
          nivel: 'programa',
          unidad: i.unidad,
          valor: i.valor,
          periodo: i.periodo,
          fuente: fuentePorId.get(i.fuente_id) ?? '',
          url: i.url,
          fecha_consulta: i.fecha_consulta,
          motivo: i.motivo_sin_dato,
        }),
      );
    }

    const acreditada = acreditacionPorInstitucion.get(inst.id);
    const acreditacion: AcreditacionInstitucion | undefined = acreditada && {
      estado: acreditada.estado,
      anios: acreditada.anios,
      desde: acreditada.desde,
      hasta: acreditada.hasta,
      situacion_al: acreditada.situacion_al,
      periodo: acreditada.periodo,
      fuente: fuentePorId.get(acreditada.fuente_id) ?? '',
      url: acreditada.url,
      fecha_consulta: acreditada.fecha_consulta,
    };

    const requisito = requisitoPorVariante.get(v.id);
    const requisito_admision: RequisitoAdmision | undefined = requisito && {
      ...requisito,
      fuente: fuentePorId.get(requisito.fuente_id) ?? '',
    };

    const tramo = tramoPorGenerico.get(v.programa_generico_id);
    const ingreso_tramo: TramoIngreso | undefined = tramo && {
      tramo: tramo.tramo_publicado,
      motivo_sin_dato: tramo.tramo_publicado ? null : (tramo.motivo_sin_dato ?? 'El SIES no publica este dato.'),
      periodo: tramo.periodo,
      fuente: fuentePorId.get(tramo.fuente_id) ?? '',
      url: tramo.url,
      fecha_consulta: tramo.fecha_consulta,
    };

    const area = v.generica_normalizada ? AREA_POR_GENERICA[v.generica_normalizada] : undefined;

    carreras.push({
      codigo_sies: v.codigo_sies,
      carrera: prog.nombre,
      institucion: { nombre: inst.nombre, tipo: inst.tipo, ...(acreditacion ? { acreditacion } : {}) },
      sede: v.sede ?? '',
      comuna: v.comuna ?? '',
      region: v.region ?? '',
      jornada: v.jornada ?? '',
      duracion_semestres: v.duracion_semestres ?? 0,
      indicadores,
      ...(requisito_admision ? { requisito_admision } : {}),
      ...(ingreso_tramo ? { ingreso_tramo } : {}),
      ...(v.codigo_demre === undefined ? {} : { admision_centralizada: v.codigo_demre !== null }),
      ...(area ? { area } : {}),
    });
  }
  return carreras;
}

type Entrada = {
  tipo: TipoIndicador;
  nivel: 'programa' | 'variante';
  unidad: UnidadIndicador;
  valor: number | null;
  periodo: string;
  fuente: string;
  url: string;
  fecha_consulta: string;
  motivo: string | null;
};

function filaIndicador(e: Entrada): Indicador {
  const base = {
    tipo: e.tipo,
    nivel: e.nivel,
    unidad: e.unidad,
    periodo: e.periodo,
    fuente: e.fuente,
    url: e.url,
    fecha_consulta: e.fecha_consulta,
  };
  if (e.valor === null) {
    if (!e.motivo) throw new Error(`dato nulo sin motivo: ${e.tipo}`);
    return { ...base, valor: null, motivo_sin_dato: e.motivo };
  }
  return { ...base, valor: e.valor };
}

function agrupar<T>(filas: T[], clave: (f: T) => string): Map<string, T[]> {
  const mapa = new Map<string, T[]>();
  for (const f of filas) {
    const k = clave(f);
    const lista = mapa.get(k);
    if (lista) lista.push(f);
    else mapa.set(k, [f]);
  }
  return mapa;
}
