import { Enlace } from '@/app/_componentes/Enlace';
import { describirAcreditacion } from '@/lib/datos/acreditacion';
import type { AcreditacionInstitucion } from '@/lib/datos/carreras';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import type { TipoInstitucion } from '@/lib/datos/tipos';

import { DatoOficial } from '@/app/_componentes/DatoOficial';
import estilosDato from '@/app/_componentes/DatoOficial.module.css';

const TITULO = 'Acreditación de la institución';
const QUE_MIDE = 'Situación de acreditación de la institución, con sus años y fechas, según Mineduc.';
const ID_TITULO = 'acreditacion-titulo';

// Acreditación de la institución en una fecha. Si la fuente no la informa, no hay fila en la base
// y la tarjeta lo dice: nunca se supone que la institución está acreditada ni que no lo está.
export function Acreditacion({ acreditacion, tipo, hoy }: { acreditacion?: AcreditacionInstitucion; tipo: TipoInstitucion; hoy: string }) {
  if (!acreditacion) {
    return <DatoOficial titulo={TITULO} queMide={QUE_MIDE} motivo="Mineduc no informa la acreditación de esta institución." />;
  }
  const vista = describirAcreditacion(acreditacion, tipo, hoy);

  return (
    <article className={estilosDato.dato} data-reveal="tarjeta" data-panel aria-labelledby={ID_TITULO}>
      <h3 id={ID_TITULO}>{TITULO}</h3>
      <p className={estilosDato.valor}>{vista.valor}</p>
      <p>{QUE_MIDE}</p>
      {vista.detalles.map((detalle) => <p key={detalle}>{detalle}</p>)}
      {vista.aviso ? <p><strong>{vista.aviso}</strong></p> : null}
      <p>{acreditacion.periodo}</p>
      <p>
        Fuente:{' '}
        <a href={acreditacion.url} aria-label={`Fuente de ${TITULO}: ${nombreDeFuente(acreditacion.fuente)}`}>
          {nombreDeFuente(acreditacion.fuente)}
        </a>
      </p>
      {vista.enlaces.map((enlace) => <p key={enlace.href}><Enlace href={enlace.href}>{enlace.texto}</Enlace></p>)}
    </article>
  );
}
