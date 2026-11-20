import type { TramoIngreso } from '@/lib/datos/carreras';
import { nombreDeFuente } from '@/lib/datos/fuentes';

import { DatoOficial } from '@/app/_componentes/DatoOficial';
import estilosDato from '@/app/_componentes/DatoOficial.module.css';

const TITULO = 'Ingreso al 4.º año';
const QUE_MIDE = 'Tramo del ingreso bruto mensual de las personas tituladas, al cuarto año después de titularse.';
const ID_TITULO = 'ingreso-titulo';
const SIN_FILA = 'Mi Futuro no publica este dato para esta carrera, o no pudimos asociarla con seguridad a sus cifras.';

// El SIES publica el ingreso como un tramo en palabras, no como un promedio: se muestra tal cual,
// sin convertirlo en un número que la fuente no da.
export function IngresoTramo({ ingreso }: { ingreso?: TramoIngreso }) {
  if (!ingreso) return <DatoOficial titulo={TITULO} queMide={QUE_MIDE} motivo={SIN_FILA} />;
  if (!ingreso.tramo) {
    return <DatoOficial titulo={TITULO} queMide={QUE_MIDE} motivo={ingreso.motivo_sin_dato ?? SIN_FILA} />;
  }

  return (
    <article className={estilosDato.dato} data-reveal="tarjeta" data-panel aria-labelledby={ID_TITULO}>
      <h3 id={ID_TITULO}>{TITULO}</h3>
      <p className={estilosDato.valor}>{ingreso.tramo}</p>
      <p>{QUE_MIDE}</p>
      <p>{ingreso.periodo}</p>
      <p>
        Fuente:{' '}
        <a href={ingreso.url} aria-label={`Fuente de ${TITULO}: ${nombreDeFuente(ingreso.fuente)}`}>
          {nombreDeFuente(ingreso.fuente)}
        </a>
      </p>
    </article>
  );
}
