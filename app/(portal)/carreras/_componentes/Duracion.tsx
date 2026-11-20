import type { Indicador } from '@/lib/datos/carreras';
import { nombreDeFuente } from '@/lib/datos/fuentes';

import { DatoOficial } from '@/app/_componentes/DatoOficial';
import estilosDato from '@/app/_componentes/DatoOficial.module.css';
import estilos from './Duracion.module.css';

const TITULO = 'Duración de la carrera: plan y realidad';
const ID_TITULO = 'duracion-titulo';
const SIN_REAL = 'Mi Futuro no publica cuánto tardan en titularse en esta carrera, o no pudimos asociarla con seguridad a sus cifras.';

const semestres = (valor: number) => `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(valor)} semestres`;
const nombreDeLaDuracion = (indicador: Indicador) => (indicador.tipo === 'duracion_formal_semestres' ? 'duración formal' : 'duración real');

// Pone lado a lado lo que dura la carrera según su plan (Mineduc) y lo que tardaron en titularse quienes la terminaron
// (SIES). Son dos cifras de dos fuentes que miden cosas distintas: cada una dice qué mide, y no se restan ni se promedian.
export function Duracion({ formal, real }: { formal?: Indicador; real?: Indicador }) {
  const formalValor = formal && formal.valor !== null ? formal.valor : null;
  const realValor = real && real.valor !== null ? real.valor : null;
  if (formalValor === null && realValor === null) {
    return <DatoOficial titulo={TITULO} queMide="Cuánto dura la carrera según su plan y cuánto tardaron en titularse quienes la terminaron." motivo={SIN_REAL} />;
  }
  const fuentes = [formalValor !== null ? formal : undefined, realValor !== null ? real : undefined].filter((i): i is Indicador => Boolean(i));

  return (
    <article className={estilosDato.dato} data-reveal="tarjeta" data-panel aria-labelledby={ID_TITULO}>
      <h3 id={ID_TITULO}>{TITULO}</h3>
      {formalValor !== null && formal ? (
        <>
          <p className={estilosDato.valor}>{semestres(formalValor)}</p>
          <p>Duración formal: lo que dura según su plan de estudios, sin contar el proceso de titulación. {formal.periodo}.</p>
        </>
      ) : <p>Mineduc no informa la duración formal de esta carrera.</p>}
      {realValor !== null && real ? (
        <>
          <p className={`${estilosDato.valor} ${estilos.segundo}`}>{semestres(realValor)}</p>
          <p>Duración real: lo que tardaron en titularse quienes terminaron la carrera. {real.periodo}.</p>
        </>
      ) : <p>{SIN_REAL}</p>}
      {fuentes.map((fuente) => (
        <p key={fuente.tipo}>
          Fuente de la {nombreDeLaDuracion(fuente)}:{' '}
          <a href={fuente.url} aria-label={`Fuente de la ${nombreDeLaDuracion(fuente)}: ${nombreDeFuente(fuente.fuente)}`}>
            {nombreDeFuente(fuente.fuente)}
          </a>
        </p>
      ))}
    </article>
  );
}
