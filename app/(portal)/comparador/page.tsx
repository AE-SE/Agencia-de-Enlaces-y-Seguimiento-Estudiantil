import type { Metadata } from 'next';

import type { Carrera } from '@/lib/datos/carreras';
import { rutaDelComparador } from '@/lib/datos/comparador';
import { MAXIMO_CARRERAS_COMPARADAS } from '@/lib/datos/comparador';
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

export default async function PaginaComparador({ searchParams }: Props) {
  const params = await searchParams;
  const codigos = valor(params.carreras)
    .split(',')
    .filter(Boolean)
    .filter((codigo, i, lista) => lista.indexOf(codigo) === i)
    .slice(0, MAXIMO_CARRERAS_COMPARADAS);
  const q = valor(params.q).trim();

  let seleccionadas: Carrera[] = [];
  let resultados: { carrera: Carrera; href: string }[] = [];
  let error = false;
  try {
    seleccionadas = await carrerasPorCodigos(codigos);
    if (q && seleccionadas.length < MAXIMO_CARRERAS_COMPARADAS) {
      const { carreras } = await buscarCarreras({ texto: q, regiones: [], tipos: [], jornadas: [] }, 1);
      resultados = carreras
        .filter((carrera) => !seleccionadas.some((item) => item.codigo_sies === carrera.codigo_sies))
        .slice(0, 10)
        .map((carrera) => ({ carrera, href: rutaDelComparador([...seleccionadas, carrera]) }));
    }
  } catch (e) {
    console.error('comparador: no se pudo consultar la oferta', e);
    error = true;
  }

  const quitarHref = Object.fromEntries(
    seleccionadas.map((carrera) => [
      carrera.codigo_sies,
      rutaDelComparador(seleccionadas.filter((item) => item.codigo_sies !== carrera.codigo_sies)),
    ]),
  );

  return (
    <Comparador
      seleccionadas={seleccionadas}
      quitarHref={quitarHref}
      resultados={resultados}
      q={q}
      carrerasActuales={seleccionadas.map((c) => encodeURIComponent(c.codigo_sies)).join(',')}
      error={error}
    />
  );
}
