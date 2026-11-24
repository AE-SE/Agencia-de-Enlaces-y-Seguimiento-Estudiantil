// Forma y reglas puras de las «alternativas cercanas» (N10, parte 2). Las usan el servidor (lectura de la
// base y ruta) y el cliente (la pantalla /meta), por eso no tocan la red ni `window`.
//
// Privacidad: al servidor solo viaja el área y la región de la meta. El corte y el resto de la lista se
// comparan en el dispositivo (lib/calculos/alternativas.ts).

import { AREA_POR_GENERICA } from '../datos/areas-sies.ts';
import { REGIONES } from '../datos/consultas.ts';
import { rutaDeCarrera } from '../datos/ruta.ts';
import type { CarreraComparable } from '../calculos/alternativas.ts';

export type Candidata = CarreraComparable & {
  carrera: string;
  institucion: string;
  sede: string;
  href: string;
  admision_centralizada: boolean;
};

// Dato del corte, una vez para toda la lista: viene de la misma fuente y período.
export type FuenteCorte = { periodo: string; fuente: string; url: string; fecha_consulta: string };

export type RespuestaAlternativas = { carreras: Candidata[]; corte: FuenteCorte | null };

// Área y región válidas, o null. Solo valores conocidos: nada de lo que llega se usa tal cual en la consulta.
export function validarParametros(area: string | null, region: string | null): { area: string; region: string } | null {
  if (!area || !region) return null;
  if (!Object.values(AREA_POR_GENERICA).includes(area)) return null;
  if (!(REGIONES as readonly string[]).includes(region)) return null;
  return { area, region };
}

type Fila = Record<string, unknown>;

// Una fila de programa_variante (consulta A o B) a candidata. En B (sin sistema centralizado) no hay indicador.
// `fuentePorId` pasa el id de la fuente a la sigla que usa el portal.
export function filaACandidata(
  fila: Fila,
  area: string,
  centralizada: boolean,
  fuentePorId: ReadonlyMap<string, string>,
): { candidata: Candidata; corte: FuenteCorte | null } {
  const programa = fila.programa as Fila;
  const institucion = (programa.institucion as Fila).nombre as string;
  const carrera = programa.nombre as string;
  const codigo_sies = String(fila.codigo_sies);
  const sede = (fila.sede as string | null) ?? '';
  const indicador = (fila.indicador as Fila[] | undefined)?.[0];
  const valor = centralizada && typeof indicador?.valor === 'number' ? indicador.valor : null;
  return {
    candidata: {
      codigo_sies,
      carrera,
      institucion,
      sede,
      href: rutaDeCarrera({ carrera, sede, codigo_sies, institucion: { nombre: institucion } as never }),
      area,
      region: (fila.region as string | null) ?? '',
      puntaje_corte: valor,
      admision_centralizada: centralizada,
    },
    corte:
      valor === null || !indicador
        ? null
        : {
            periodo: String(indicador.periodo),
            fuente: fuentePorId.get(String(indicador.fuente_id)) ?? '',
            url: String(indicador.url),
            fecha_consulta: String(indicador.fecha_consulta),
          },
  };
}

// Arma la respuesta: el corte es el de la primera fila que lo trae (todas vienen del mismo archivo del DEMRE).
export function armarRespuesta(
  filasA: readonly Fila[],
  filasB: readonly Fila[],
  area: string,
  fuentePorId: ReadonlyMap<string, string>,
): RespuestaAlternativas {
  const a = filasA.map((f) => filaACandidata(f, area, true, fuentePorId));
  const b = filasB.map((f) => filaACandidata(f, area, false, fuentePorId));
  return {
    carreras: [...a, ...b].map((x) => x.candidata),
    corte: a.find((x) => x.corte)?.corte ?? null,
  };
}
