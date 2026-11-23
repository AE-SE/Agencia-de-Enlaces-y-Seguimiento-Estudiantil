// Meta y preferencias de la persona (N10). Lógica pura: no toca `window` ni la red.
// La primera de la lista es «tu meta»; caben hasta tres. Cada elemento guarda una copia mínima de la
// carrera para mostrarse sin consultar al servidor, y nada de la persona (AGENTS.md 2.2).

import type { Carrera } from '../datos/carreras.ts';
import { rutaDeCarrera } from '../datos/ruta.ts';
import { aComparable } from '../calculos/alternativas.ts';

export const MAXIMO_PREFERENCIAS = 3;

export type Preferencia = {
  codigo_sies: string;
  carrera: string;
  institucion: string;
  sede: string;
  region: string;
  // Ruta de su ficha dentro del sitio.
  href: string;
  // Los tres siguientes los usará N10 parte 2 (alternativas cercanas) sin volver a consultar la carrera.
  area: string | null;
  puntaje_corte: number | null;
  admision_centralizada?: boolean;
};

export function aPreferencia(carrera: Carrera): Preferencia {
  const { area, puntaje_corte, admision_centralizada } = aComparable(carrera);
  const base = {
    codigo_sies: carrera.codigo_sies,
    carrera: carrera.carrera,
    institucion: carrera.institucion.nombre,
    sede: carrera.sede,
    region: carrera.region,
    href: rutaDeCarrera(carrera),
    area,
    puntaje_corte,
  };
  return admision_centralizada === undefined ? base : { ...base, admision_centralizada };
}

export type ResultadoFijar = { lista: Preferencia[]; salio: Preferencia | null };
export type ResultadoAgregar = { lista: Preferencia[]; resultado: 'agregada' | 'ya_estaba' | 'llena' };

const sinEl = (lista: readonly Preferencia[], codigo: string) => lista.filter((p) => p.codigo_sies !== codigo);

// La pone primera; si ya estaba, la mueve. Si la lista queda con más de tres, sale la última y se devuelve.
export function fijarComoMeta(lista: readonly Preferencia[], item: Preferencia): ResultadoFijar {
  const nueva = [item, ...sinEl(lista, item.codigo_sies)];
  return { lista: nueva.slice(0, MAXIMO_PREFERENCIAS), salio: nueva[MAXIMO_PREFERENCIAS] ?? null };
}

// Al final de la lista. Si ya estaba no cambia nada; si ya hay tres, no agrega.
export function agregarPreferencia(lista: readonly Preferencia[], item: Preferencia): ResultadoAgregar {
  if (lista.some((p) => p.codigo_sies === item.codigo_sies)) return { lista: [...lista], resultado: 'ya_estaba' };
  if (lista.length >= MAXIMO_PREFERENCIAS) return { lista: [...lista], resultado: 'llena' };
  return { lista: [...lista, item], resultado: 'agregada' };
}

export function quitar(lista: readonly Preferencia[], codigo: string): Preferencia[] {
  return sinEl(lista, codigo);
}

function mover(lista: readonly Preferencia[], codigo: string, paso: -1 | 1): Preferencia[] {
  const i = lista.findIndex((p) => p.codigo_sies === codigo);
  const j = i + paso;
  const copia = [...lista];
  if (i < 0 || j < 0 || j >= copia.length) return copia;
  [copia[i], copia[j]] = [copia[j], copia[i]];
  return copia;
}

export const subir = (lista: readonly Preferencia[], codigo: string) => mover(lista, codigo, -1);
export const bajar = (lista: readonly Preferencia[], codigo: string) => mover(lista, codigo, 1);

export function serializar(lista: readonly Preferencia[]): string {
  return JSON.stringify(lista);
}

const esTexto = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

function comoPreferencia(v: unknown): Preferencia | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Record<string, unknown>;
  if (!esTexto(o.codigo_sies) || !esTexto(o.carrera) || !esTexto(o.institucion) || !esTexto(o.sede) || !esTexto(o.region)) return null;
  // Solo rutas de ficha del propio sitio, con los caracteres que produce slug() (lib/datos/slug.ts): un valor manipulado
  // en el almacenamiento no debe producir otro enlace («..», «?», «#» quedan fuera).
  if (!esTexto(o.href) || !/^\/carreras\/[a-z0-9-]+\/[a-z0-9-]+$/.test(o.href)) return null;
  const item: Preferencia = {
    codigo_sies: o.codigo_sies,
    carrera: o.carrera,
    institucion: o.institucion,
    sede: o.sede,
    region: o.region,
    href: o.href,
    area: esTexto(o.area) ? o.area : null,
    puntaje_corte: typeof o.puntaje_corte === 'number' && Number.isFinite(o.puntaje_corte) ? o.puntaje_corte : null,
  };
  if (typeof o.admision_centralizada === 'boolean') item.admision_centralizada = o.admision_centralizada;
  return item;
}

// Lee lo guardado. Lo que no se pueda leer se descarta sin romper: devuelve una lista (a lo más, vacía).
export function leer(texto: string | null | undefined): Preferencia[] {
  if (!texto) return [];
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return [];
  }
  if (!Array.isArray(datos)) return [];
  const vistos = new Set<string>();
  const lista: Preferencia[] = [];
  for (const v of datos) {
    const item = comoPreferencia(v);
    if (!item || vistos.has(item.codigo_sies)) continue;
    vistos.add(item.codigo_sies);
    lista.push(item);
  }
  return lista.slice(0, MAXIMO_PREFERENCIAS);
}
