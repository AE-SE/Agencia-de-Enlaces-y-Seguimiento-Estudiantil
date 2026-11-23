'use client';

import Link from 'next/link';

import { hoyEnChile } from '@/app/(portal)/beneficios/beneficios';
import { Enlace } from '@/app/_componentes/Enlace';
import calendario from '@/datos/calendario/plazos_2027.json';
import { fechaLarga } from '@/lib/datos/fechas';
import type { Preferencia } from '@/lib/meta/preferencias';
import { proximoPlazo } from '@/lib/meta/proximo-plazo';

import estilos from './meta.module.css';

// Los plazos son datos públicos del DEMRE: nada de la meta viaja. Si la carrera se postula directo en la
// institución, el calendario centralizado no le aplica y se dice (nunca se inventa un plazo).
export function ProximoPlazo({ meta }: { meta: Preferencia }) {
  const centralizada = meta.admision_centralizada !== false;
  const siguiente = centralizada ? proximoPlazo(calendario.plazos, hoyEnChile()) : null;
  const plazo = siguiente?.plazo;

  return (
    <section className={estilos.bloque} aria-labelledby="titulo-proximo-plazo">
      <h2 id="titulo-proximo-plazo">Tu próximo plazo</h2>
      {!centralizada ? (
        <p>Tu meta se postula directo en la institución, no por el sistema centralizado. Los plazos los publica la institución: revísalos en su sitio.</p>
      ) : !siguiente || !plazo ? (
        <p>Ya pasaron todos los hitos del calendario de admisión 2027 que tienen fecha publicada.</p>
      ) : (
        <>
          <h3>{plazo.proceso}</h3>
          <p>{plazo.descripcion}</p>
          <p>
            {/* Un hito de un día dice su fecha una sola vez; uno en curso dice cuándo termina. */}
            {siguiente.estado === 'en_curso' ? (
              <><strong>Está en curso.</strong> Termina el <time dateTime={plazo.termino!}>{fechaLarga(plazo.termino!)}</time>.</>
            ) : plazo.inicio === plazo.termino ? (
              <>Fecha: <time dateTime={plazo.inicio!}>{fechaLarga(plazo.inicio!)}</time>.</>
            ) : (
              <>Del <time dateTime={plazo.inicio!}>{fechaLarga(plazo.inicio!)}</time> al <time dateTime={plazo.termino!}>{fechaLarga(plazo.termino!)}</time>.</>
            )}
          </p>
          <p>
            Fuente: <Enlace href={plazo.url}>{plazo.fuente}</Enlace>. Consultada el <time dateTime={plazo.fecha_consulta}>{fechaLarga(plazo.fecha_consulta)}</time>.
          </p>
        </>
      )}
      <p><Link className={estilos.enlace} href="/beneficios#calendario-admision" prefetch={false}>Ver el calendario completo</Link></p>
    </section>
  );
}
