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
  let carreras: Awaited<ReturnType<typeof buscarCarreras>>['carreras'] = [];
  let error = false;
  try {
    const codigo = (await searchParams).carrera;
    const codigoUnico = Array.isArray(codigo) ? codigo[0] : codigo;
    const [resultado, elegida] = await Promise.all([
      buscarCarreras({ texto: '', regiones: [], tipos: [], jornadas: [] }, 1),
      codigoUnico ? carrerasPorCodigos([codigoUnico]) : Promise.resolve([]),
    ]);
    carreras = [...elegida, ...resultado.carreras.filter((carrera) => carrera.codigo_sies !== codigoUnico)];
  } catch (causa) {
    console.error('simulador: no se pudo consultar la oferta', causa instanceof Error ? causa.message : String(causa));
    error = true;
  }

  return <Simulador carreras={carreras} errorAlCargar={error} />;
}
