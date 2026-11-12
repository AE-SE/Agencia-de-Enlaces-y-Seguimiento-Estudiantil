import type { Metadata } from 'next';

import { buscarCarreras, carrerasPorCodigos } from '@/lib/datos/oferta-remota';

import { Simulador } from './Simulador';

export const metadata: Metadata = {
  title: 'Simulador de puntaje',
  description: 'Calcula un puntaje ponderado con las ponderaciones oficiales disponibles.',
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PaginaSimulador({ searchParams }: Props) {
  const params = await searchParams;
  const busqueda = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? '';
  let carreras: Awaited<ReturnType<typeof buscarCarreras>>['carreras'] = [];
  let error = false;
  try {
    const codigo = params.carrera;
    const codigoUnico = Array.isArray(codigo) ? codigo[0] : codigo;
    const [resultado, elegida] = await Promise.all([
      busqueda ? buscarCarreras({ texto: busqueda, regiones: [], tipos: [], jornadas: [] }, 1, true) : Promise.resolve({ carreras: [], total: 0 }),
      codigoUnico ? carrerasPorCodigos([codigoUnico], true) : Promise.resolve([]),
    ]);
    carreras = [...elegida, ...resultado.carreras.filter((carrera) => carrera.codigo_sies !== codigoUnico)];
  } catch (causa) {
    console.error('simulador: no se pudo consultar la oferta', causa instanceof Error ? causa.message : String(causa));
    error = true;
  }

  return <Simulador carreras={carreras} busqueda={busqueda} errorAlCargar={error} />;
}
