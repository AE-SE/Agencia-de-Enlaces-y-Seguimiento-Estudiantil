import type { Metadata } from 'next';

import type { Carrera } from '@/lib/datos/carreras';
import { MAXIMO_CARRERAS_COMPARADAS, rutaDelComparadorConBusqueda } from '@/lib/datos/comparador';
import { filtrarCarreras } from '@/lib/datos/buscar';
import { filtrosDesdeUrl } from '@/lib/datos/consultas';
import { carrerasPorCodigos, buscarCarreras } from '@/lib/datos/oferta-remota';

import { Comparador } from './Comparador';

export const metadata: Metadata = {
  title: 'Comparador de carreras',
  description: 'Compara datos oficiales de hasta tres carreras sin rankings ni recomendaciones.',
};

// Se atiende en vivo: consulta Supabase solo por las carreras elegidas y por la búsqueda.
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function valor(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? '';
}

// Cuántas carreras se listan para agregar; el total se informa aparte.
const MAXIMO_RESULTADOS = 10;

export default async function PaginaComparador({ searchParams }: Props) {
  const params = await searchParams;
  const codigos = valor(params.carreras)
    .split(',')
    .filter(Boolean)
    .filter((codigo, i, lista) => lista.indexOf(codigo) === i)
    .slice(0, MAXIMO_CARRERAS_COMPARADAS);
  const filtros = { ...filtrosDesdeUrl(params), texto: valor(params.q).trim() };
  const q = filtros.texto;
  const hayFiltros = filtros.regiones.length + filtros.tipos.length + filtros.jornadas.length > 0;

  let seleccionadas: Carrera[] = [];
  let resultados: { carrera: Carrera; href: string }[] = [];
  let totalResultados = 0;
  let error = false;
  try {
    seleccionadas = await carrerasPorCodigos(codigos);
    if ((q || hayFiltros) && seleccionadas.length < MAXIMO_CARRERAS_COMPARADAS) {
      const { carreras, total } = await buscarCarreras(filtros, 1);
      const disponibles = carreras.filter((carrera) => !seleccionadas.some((item) => item.codigo_sies === carrera.codigo_sies));
      // El total de la búsqueda incluye las carreras ya elegidas, que no se listan: se descuentan para
      // no decir «Mostramos 1 de 2» cuando la otra es la que ya está en la comparación. Se cuentan con
      // el mismo criterio de la búsqueda (filtrarCarreras), aunque no estén en la primera página.
      // Mismo cast que usa oferta-remota.ts: un tipo que no existe en la URL simplemente no coincide.
      const elegidasQueCoinciden = filtrarCarreras(seleccionadas, filtros as Parameters<typeof filtrarCarreras>[1]).length;
      totalResultados = Math.max(disponibles.length, total - elegidasQueCoinciden);
      resultados = disponibles
        .slice(0, MAXIMO_RESULTADOS)
        // Conserva la búsqueda y los filtros para poder agregar la siguiente sin buscar de nuevo.
        .map((carrera) => ({ carrera, href: rutaDelComparadorConBusqueda([...seleccionadas, carrera], filtros) }));
    }
  } catch (e) {
    console.error('comparador: no se pudo consultar la oferta', e instanceof Error ? e.message : String(e));
    error = true;
  }

  const quitarHref = Object.fromEntries(
    seleccionadas.map((carrera) => [
      carrera.codigo_sies,
      rutaDelComparadorConBusqueda(seleccionadas.filter((item) => item.codigo_sies !== carrera.codigo_sies), filtros),
    ]),
  );

  return (
    <Comparador
      seleccionadas={seleccionadas}
      quitarHref={quitarHref}
      resultados={resultados}
      q={q}
      filtros={filtros}
      hayBusqueda={Boolean(q || hayFiltros)}
      totalResultados={totalResultados}
      // Quitar filtros conserva lo escrito: solo limpia región, tipo y jornada.
      quitarFiltrosHref={rutaDelComparadorConBusqueda(seleccionadas, { texto: q, regiones: [], tipos: [], jornadas: [] })}
      carrerasActuales={seleccionadas.map((c) => encodeURIComponent(c.codigo_sies)).join(',')}
      error={error}
    />
  );
}
