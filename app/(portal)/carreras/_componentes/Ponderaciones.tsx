import type { RequisitoAdmision } from '@/lib/datos/carreras';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import { filasDePonderaciones, minimosDeAdmision } from '@/lib/datos/ponderaciones';

import { DatoOficial } from '@/app/_componentes/DatoOficial';
import estilosDato from '@/app/_componentes/DatoOficial.module.css';
import estilos from './Ponderaciones.module.css';

const TITULO = 'Ponderaciones para postular';
const QUE_MIDE = 'Porcentaje que aporta cada factor al cálculo de tu puntaje ponderado en esta carrera.';
const ID_TITULO = 'ponderaciones-titulo';

// Ponderaciones oficiales de la carrera para un proceso de admisión. Solo muestra lo que llega
// de la carga del DEMRE; si no hay nada, lo dice con una frase en vez de dejar un hueco.
export function Ponderaciones({ requisito, sinSistema }: { requisito?: RequisitoAdmision; sinSistema?: string }) {
  const filas = requisito ? filasDePonderaciones(requisito) : [];
  if (!requisito || filas.length === 0) {
    return <DatoOficial titulo={TITULO} queMide={QUE_MIDE} motivo={sinSistema ?? 'No hay ponderaciones de esta carrera cargadas en el portal.'} />;
  }
  const minimos = minimosDeAdmision(requisito);

  return (
    <article className={estilosDato.dato} data-reveal="tarjeta" data-panel aria-labelledby={ID_TITULO}>
      <h3 id={ID_TITULO}>{TITULO}</h3>
      <p>{QUE_MIDE}</p>
      <dl className={estilos.lista}>
        {filas.map((fila) => (
          <div key={fila.factor} className={estilos.fila}>
            <dt>
              {fila.factor}
              {fila.nota ? <span className={estilos.nota}>{fila.nota}</span> : null}
            </dt>
            <dd>{fila.porcentaje} %</dd>
          </div>
        ))}
      </dl>
      {minimos.puntajePonderado !== null ? <p>Puntaje ponderado mínimo para postular: <strong className={estilos.cifra}>{minimos.puntajePonderado}</strong></p> : null}
      {minimos.puntajePromedio !== null ? <p>Promedio mínimo entre Competencia Lectora y Matemática 1: <strong className={estilos.cifra}>{minimos.puntajePromedio}</strong></p> : null}
      <p>{requisito.periodo}</p>
      <p>
        Fuente:{' '}
        <a href={requisito.url} aria-label={`Fuente de ${TITULO}: ${nombreDeFuente(requisito.fuente)}`}>
          {nombreDeFuente(requisito.fuente)}
        </a>
      </p>
    </article>
  );
}
