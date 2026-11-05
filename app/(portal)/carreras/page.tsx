import type { Metadata } from 'next';

import { Explorador } from './_componentes/Explorador';
import { listarCarreras } from '@/lib/datos/carreras';

export const metadata: Metadata = {
  title: 'Explorador de carreras',
  description: 'Busca carreras e instituciones de educación superior con datos oficiales.',
};

export default function PaginaExplorador() {
  return <Explorador carreras={listarCarreras()} />;
}
