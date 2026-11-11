'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

import { IndicadorEstacion } from '@/app/_componentes/IndicadorEstacion';
import { calcularSimulacion, type PuntajesSimulador } from '@/lib/calculos/2027/simulador';
import { validarPuntajeRanking } from '@/lib/calculos/2027/puntaje-ranking';
import type { Carrera, RequisitoAdmision } from '@/lib/datos/carreras';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';

import estilos from './simulador.module.css';

type Puntajes = Record<'nem' | 'ranking' | 'lectora' | 'm1' | 'm2' | 'historia' | 'ciencias', string>;

const VACIO: Puntajes = { nem: '', ranking: '', lectora: '', m1: '', m2: '', historia: '', ciencias: '' };

const CAMPOS = [
  { id: 'nem', etiqueta: 'Puntaje NEM', ayuda: 'Ingresa el puntaje NEM oficial que recibiste.' },
  { id: 'ranking', etiqueta: 'Puntaje Ranking', ayuda: 'Ingresa el puntaje Ranking oficial. No lo calculamos aquí.' },
  { id: 'lectora', etiqueta: 'Competencia Lectora', ayuda: 'Escribe tu puntaje de la prueba.' },
  { id: 'm1', etiqueta: 'Matemática 1', ayuda: 'Escribe tu puntaje de la prueba.' },
  { id: 'm2', etiqueta: 'Matemática 2', ayuda: 'Escribe tu puntaje si la carrera lo pide.' },
  { id: 'historia', etiqueta: 'Historia y Ciencias Sociales', ayuda: 'Escribe tu puntaje si la carrera lo pide.' },
  { id: 'ciencias', etiqueta: 'Ciencias', ayuda: 'Escribe tu puntaje si la carrera lo pide.' },
] as const;

const PONDERACION_POR_CAMPO: Record<keyof Puntajes, keyof RequisitoAdmision> = {
  nem: 'nem', ranking: 'ranking', lectora: 'competencia_lectora', m1: 'matematica_1',
  m2: 'matematica_2', historia: 'historia_cs_sociales', ciencias: 'ciencias',
};

function numero(valor: string, etiqueta: string, requerido: boolean): number | null {
  if (valor.trim() === '') {
    if (requerido) throw new RangeError(`Falta tu puntaje de ${etiqueta}. Escríbelo para calcular.`);
    return null;
  }
  const resultado = Number(valor.replace(',', '.'));
  if (!Number.isFinite(resultado) || resultado < 100 || resultado > 1000) {
    throw new RangeError(`Tu puntaje de ${etiqueta} debe estar entre 100 y 1.000.`);
  }
  return resultado;
}

function ponderacion(requisito: RequisitoAdmision, nombre: keyof RequisitoAdmision): number {
  const valor = requisito[nombre];
  return typeof valor === 'number' ? valor : 0;
}

function calcular(carrera: Carrera, puntajes: Puntajes) {
  const requisito = carrera.requisito_admision;
  if (!requisito) throw new RangeError('Esta carrera aún no tiene ponderaciones oficiales cargadas para simular.');

  const nem = numero(puntajes.nem, 'NEM', ponderacion(requisito, 'nem') > 0);
  const ranking = numero(puntajes.ranking, 'Ranking', ponderacion(requisito, 'ranking') > 0);
  if (ranking !== null) validarPuntajeRanking(ranking);
  const lectora = numero(puntajes.lectora, 'Competencia Lectora', ponderacion(requisito, 'competencia_lectora') > 0);
  const m1 = numero(puntajes.m1, 'Matemática 1', ponderacion(requisito, 'matematica_1') > 0);
  const m2 = numero(puntajes.m2, 'Matemática 2', ponderacion(requisito, 'matematica_2') > 0);
  const historia = numero(puntajes.historia, 'Historia y Ciencias Sociales', ponderacion(requisito, 'historia_cs_sociales') > 0 && !requisito.historia_o_ciencias);
  const ciencias = numero(puntajes.ciencias, 'Ciencias', ponderacion(requisito, 'ciencias') > 0 && !requisito.historia_o_ciencias);

  const puntajesNumericos: PuntajesSimulador = { nem, ranking, lectora, m1, m2, historia, ciencias };
  return calcularSimulacion(requisito, puntajesNumericos);
}

export function Simulador({ carreras, busqueda, errorAlCargar }: { carreras: Carrera[]; busqueda: string; errorAlCargar: boolean }) {
  const disponibles = useMemo(() => carreras.filter((carrera) => {
    const requisito = carrera.requisito_admision;
    return requisito && ponderacion(requisito, 'prueba_especial') === 0 && ponderacion(requisito, 'asignacion_especial_pedagogia') === 0;
  }), [carreras]);
  const [codigo, setCodigo] = useState(disponibles[0]?.codigo_sies ?? '');
  const [puntajes, setPuntajes] = useState<Puntajes>(VACIO);
  const [estimacion, setEstimacion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [resultado, setResultado] = useState<{ puntajePonderado: number; cumpleMinimos: boolean | null } | null>(null);
  const carrera = disponibles.find((item) => item.codigo_sies === codigo);
  const camposVisibles = CAMPOS.filter(({ id }) => {
    const requisito = carrera?.requisito_admision;
    if (!requisito) return false;
    if (requisito.historia_o_ciencias && (id === 'historia' || id === 'ciencias')) return true;
    return ponderacion(requisito, PONDERACION_POR_CAMPO[id]) > 0;
  });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje('');
    setResultado(null);
    if (!carrera) {
      setMensaje('Elige una carrera con ponderaciones oficiales para calcular.');
      return;
    }
    try {
      setResultado(calcular(carrera, puntajes));
    } catch (causa) {
      setMensaje(causa instanceof Error ? causa.message : 'No pudimos calcular tu puntaje. Revisa los datos ingresados.');
    }
  }

  const corte = carrera?.indicadores.find((indicador) => indicador.tipo === 'puntaje_corte');
  const formato = (valor: number) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor);

  return (
    <main id="contenido" tabIndex={-1} className={estilos.pagina}>
      <IndicadorEstacion actual={2} />
      <header className={estilos.encabezado}>
        <p className={estilos.paso}>Paso 1 de 3 · Tus puntajes</p>
        <h1>Simula tu puntaje</h1>
        <p>Este cálculo es una orientación. No confirma tu selección ni tu matrícula.</p>
      </header>

      {errorAlCargar ? <p className={estilos.error} role="alert">No pudimos cargar las carreras. Inténtalo de nuevo más tarde.</p> : null}

      <form className={estilos.formulario} action="/simulador" method="get">
        <label htmlFor="busqueda">Busca tu carrera</label>
        <input id="busqueda" name="q" defaultValue={busqueda} />
        <button className={estilos.principal} type="submit">Buscar carrera</button>
      </form>

      <form className={estilos.formulario} onSubmit={enviar} noValidate>
        <fieldset>
          <legend>Elige una carrera</legend>
          {disponibles.length ? (
            <>
              <label htmlFor="carrera">Carrera con ponderaciones oficiales</label>
              <select id="carrera" value={codigo} onChange={(evento) => setCodigo(evento.target.value)}>
                {disponibles.map((item) => <option key={item.codigo_sies} value={item.codigo_sies}>{item.carrera} · {item.institucion.nombre} · {item.sede}</option>)}
              </select>
              <p>Mostramos carreras que se pueden calcular solo con puntajes PAES. ¿No aparece la que buscas? <Link href="/carreras">Búscala en el explorador</Link>.</p>
            </>
          ) : <p>{busqueda ? 'No encontramos carreras con ponderaciones oficiales para esa búsqueda.' : 'Escribe el nombre de tu carrera.'}</p>}
        </fieldset>

        <fieldset>
          <legend>Escribe tus puntajes</legend>
          <p>Todos los puntajes van de 100 a 1.000. Solo pedimos los que usa la carrera elegida.</p>
          <label className={estilos.casilla}>
            <input type="checkbox" checked={estimacion} onChange={(evento) => setEstimacion(evento.target.checked)} />
            Aún no doy la PAES: usaré puntajes estimados
          </label>
          {camposVisibles.map(({ id, etiqueta, ayuda }) => (
            <div key={id} className={estilos.campo}>
              <label htmlFor={id}>{etiqueta}</label>
              <input id={id} inputMode="decimal" value={puntajes[id]} onChange={(evento) => setPuntajes({ ...puntajes, [id]: evento.target.value })} aria-describedby={`${id}-ayuda`} />
              <p id={`${id}-ayuda`}>{ayuda}</p>
            </div>
          ))}
        </fieldset>

        <button className={estilos.principal} type="submit" disabled={!carrera}>Calcular mi puntaje</button>
      </form>

      {mensaje ? <p className={estilos.error} role="alert">{mensaje}</p> : null}
      {resultado && carrera?.requisito_admision ? (
        <section className={estilos.resultado} aria-live="polite" aria-labelledby="resultado">
          <p className={estilos.paso}>Paso 3 de 3 · Resultado</p>
          <h2 id="resultado">Tu puntaje ponderado simulado: <span>{formato(resultado.puntajePonderado)}</span></h2>
          {estimacion ? <p>Usaste puntajes estimados. El resultado puede cambiar cuando tengas tus puntajes oficiales.</p> : null}
          {corte?.valor !== null && corte?.valor !== undefined ? (
            <>
              <p>El año pasado el último matriculado tuvo {formato(corte.valor)}. Con tus puntajes simulados tendrías {formato(resultado.puntajePonderado)}.</p>
              <p>Fuente: <a href={corte.url}>{nombreDeFuente(corte.fuente)}</a> · {corte.periodo} · consultada el {fechaLarga(corte.fecha_consulta)}.</p>
              <p>Las ponderaciones de ese año pudieron ser distintas.</p>
            </>
          ) : <p>No hay un puntaje de corte oficial cargado para comparar esta carrera.</p>}
          {resultado.cumpleMinimos === null ? <p className={estilos.aviso}>No pudimos revisar los puntajes mínimos de esta carrera.</p> : null}
          {resultado.cumpleMinimos === false ? <p className={estilos.aviso}>Con estos puntajes no cumples uno o más mínimos publicados para esta carrera.</p> : null}
          <p>Fuente de ponderaciones: <a href={carrera.requisito_admision.url}>{nombreDeFuente(carrera.requisito_admision.fuente)}</a> · {carrera.requisito_admision.periodo} · consultada el {fechaLarga(carrera.requisito_admision.fecha_consulta)}.</p>
          <p>No guardamos esta simulación.</p>
        </section>
      ) : null}
    </main>
  );
}
