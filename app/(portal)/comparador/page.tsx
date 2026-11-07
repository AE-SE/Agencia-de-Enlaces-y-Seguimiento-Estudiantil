import type { Metadata } from 'next';
import { Suspense } from 'react';

import { listarCarreras } from '@/lib/datos/carreras';

import { Comparador } from './Comparador';

export const metadata: Metadata = {
  title: 'Comparador de carreras',
  description: 'Compara datos oficiales de hasta tres carreras sin rankings ni recomendaciones.',
};

export default function PaginaComparador() {
  return (
    <Suspense fallback={<main id="contenido" />}>
      <Comparador carreras={listarCarreras()} />
    </Suspense>
  );
}
