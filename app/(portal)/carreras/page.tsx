import type { Metadata } from 'next';

import { Explorador } from './_componentes/Explorador';
import { filtrosDesdeUrl, paginaDesdeUrl, totalPaginas } from '@/lib/datos/consultas';
import { buscarCarreras } from '@/lib/datos/oferta-remota';

export const metadata: Metadata = {
  title: 'Explorador de carreras',
  description: 'Busca carreras e instituciones de educación superior con datos oficiales.',
};

// Se atiende en vivo: cada visita consulta Supabase por una página de resultados.
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PaginaExplorador({ searchParams }: Props) {
  const params = await searchParams;
  const filtros = filtrosDesdeUrl(params);
  const pagina = paginaDesdeUrl(params);
  const { carreras, total } = await buscarCarreras(filtros, pagina);

  return (
    <Explorador
      carreras={carreras}
      total={total}
      pagina={pagina}
      paginas={totalPaginas(total)}
      filtros={filtros}
    />
  );
}
