import type { Indicador } from '@/lib/datos/carreras';

import estilos from './DatoOficial.module.css';

type Props = {
  titulo: string;
  queMide: string;
  indicador?: Indicador;
  valor?: string;
  periodo?: string;
};

// Se reemplaza por los componentes de app/_componentes cuando existan.
export function DatoOficial({ titulo, queMide, indicador, valor, periodo }: Props) {
  const sinDato = (!indicador && !valor) || indicador?.valor === null;

  return (
    <article className={estilos.dato}>
      <h3>{titulo}</h3>
      {sinDato ? (
        <>
          <p className={estilos.sinDato}>Sin datos suficientes</p>
          <p>{indicador && 'motivo_sin_dato' in indicador ? indicador.motivo_sin_dato : 'Este dato aún no está cargado.'}</p>
        </>
      ) : (
        <>
          <p className={estilos.valor}>{valor}</p>
          <p>{queMide}</p>
          <p>{periodo ?? indicador?.periodo}</p>
          {indicador ? (
            <p>
              Fuente: <a href={indicador.url}>{indicador.fuente}</a>
            </p>
          ) : <p>Fuente aún no cargada.</p>}
        </>
      )}
    </article>
  );
}
