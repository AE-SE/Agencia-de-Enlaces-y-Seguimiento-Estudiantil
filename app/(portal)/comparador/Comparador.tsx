'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { indicadorDe } from '@/lib/datos/comparador';
import { rutaDeLaHoja } from '@/lib/datos/hoja';
import { FILAS_INDICADORES, formatoIndicador, type FilaIndicador } from '@/lib/datos/indicadores-vista';
import type { Carrera, Indicador } from '@/lib/datos/carreras';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';

import estilos from './comparador.module.css';
import { IndicadorEstacion } from '@/app/_componentes/IndicadorEstacion';

type Resultado = { carrera: Carrera; href: string };
type Props = {
  seleccionadas: Carrera[];
  quitarHref: Record<string, string>;
  resultados: Resultado[];
  q: string;
  carrerasActuales: string;
  error?: boolean;
};

function textoLegible(texto: string) {
  return texto === texto.toLocaleUpperCase('es-CL') ? texto.toLocaleLowerCase('es-CL') : texto;
}

function descripcionDeCarrera(carrera: Carrera) {
  return [carrera.carrera, carrera.institucion.nombre, carrera.sede, carrera.jornada].map(textoLegible).join(' · ');
}

function Celda({ carrera, fila }: { carrera: Carrera; fila: FilaIndicador }) {
  const indicador = indicadorDe(carrera, fila.tipo);
  const sinDato = !indicador || indicador.valor === null;

  return (
    <div className={estilos.celda}>
      <p className={sinDato ? estilos.sinDato : estilos.valor}>{sinDato ? 'Sin datos suficientes' : formatoIndicador(indicador)}</p>
      {sinDato ? (
        <p>{indicador && 'motivo_sin_dato' in indicador ? indicador.motivo_sin_dato : 'Este dato aún no está cargado.'}</p>
      ) : (
        <>
          <p>{indicador.nivel === 'programa' ? 'Toda la carrera en esta institución.' : 'Esta sede y jornada.'}</p>
          <p>Período: {indicador.periodo}</p>
          <p>
            Fuente: <a href={indicador.url}>{nombreDeFuente(indicador.fuente)}</a> · Consultada el {fechaLarga(indicador.fecha_consulta)}
          </p>
        </>
      )}
    </div>
  );
}

function FilaComparacion({ carreras, fila }: { carreras: Carrera[]; fila: FilaIndicador }) {
  const periodos = carreras
    .map((carrera) => indicadorDe(carrera, fila.tipo))
    .filter((indicador): indicador is Indicador => Boolean(indicador && indicador.valor !== null))
    .map((indicador) => indicador.periodo);
  const hayPeriodosDistintos = new Set(periodos).size > 1;

  return (
    <section className={estilos.fila} aria-labelledby={`indicador-${fila.tipo}`}>
      <div className={estilos.etiqueta}>
        <h2 id={`indicador-${fila.tipo}`}>{fila.titulo}</h2>
        <p>Unidad: {fila.unidad}</p>
        <p>{fila.queMide}</p>
      </div>
      <div className={estilos.celdas}>
        {carreras.map((carrera) => (
          <Celda
            key={carrera.codigo_sies}
            carrera={carrera}
            fila={fila}
          />
        ))}
      </div>
      {hayPeriodosDistintos ? (
        <p className={estilos.aviso}><AlertTriangle aria-hidden="true" /> <strong>Aviso:</strong> los períodos no son iguales. Revísalos antes de comparar.</p>
      ) : null}
    </section>
  );
}

function BloqueCarrera({ carrera }: { carrera: Carrera }) {
  return (
    <article className={estilos.bloqueCarrera}>
      <h2>{descripcionDeCarrera(carrera)}</h2>
      {FILAS_INDICADORES.map((fila) => (
        <section className={estilos.indicadorMovil} key={fila.tipo} aria-labelledby={`indicador-${carrera.codigo_sies}-${fila.tipo}`}>
          <div className={estilos.etiqueta}>
            <h3 id={`indicador-${carrera.codigo_sies}-${fila.tipo}`}>{fila.titulo}</h3>
            <p>Unidad: {fila.unidad}</p>
            <p>{fila.queMide}</p>
          </div>
          <Celda carrera={carrera} fila={fila} />
        </section>
      ))}
    </article>
  );
}



export function Comparador({ seleccionadas, quitarHref, resultados, q, carrerasActuales, error }: Props) {
  return (
    <main id="contenido" tabIndex={-1} className={estilos.comparador}>
      <Link className={estilos.volver} href="/carreras">Volver al explorador</Link>
      <header className={estilos.encabezado}>
        <IndicadorEstacion actual={1} />
        <h1>Compara carreras</h1>
        <p>Revisa los datos de hasta tres opciones. Esta página no ordena ni recomienda instituciones.</p>
      </header>

      {error ? <p role="alert">No pudimos cargar las carreras en este momento. Intenta de nuevo en unos minutos.</p> : null}

      <section className={estilos.selector} aria-labelledby="elige-carreras">
        <h2 id="elige-carreras">Elige hasta tres carreras</h2>
        {seleccionadas.length ? (
          <ul className={estilos.seleccionadas}>
            {seleccionadas.map((carrera) => (
              <li key={carrera.codigo_sies}>
                <span>{descripcionDeCarrera(carrera)}</span>
                <Link href={quitarHref[carrera.codigo_sies]}>Quitar carrera</Link>
              </li>
            ))}
          </ul>
        ) : <p>Agrega carreras para comparar sus datos oficiales.</p>}

        {seleccionadas.length ? <Link className={estilos.usarEnHoja} href={rutaDeLaHoja(seleccionadas)}>Usar estas carreras en mi hoja</Link> : null}
        {seleccionadas.length < 3 ? (
          <form method="get" action="/comparador" className={estilos.buscarCarrera}>
            {carrerasActuales ? <input type="hidden" name="carreras" value={carrerasActuales} /> : null}
            <label htmlFor="buscar-carrera">Busca una carrera para agregar</label>
            <div className={estilos.entrada}>
              <input id="buscar-carrera" name="q" defaultValue={q} />
              <button type="submit">Buscar</button>
            </div>
          </form>
        ) : <p>Ya elegiste tres carreras. Quita una para agregar otra.</p>}

        {q && seleccionadas.length < 3 ? (
          resultados.length ? (
            <ul className={estilos.resultadosComparador} aria-label="Resultados para agregar">
              {resultados.map(({ carrera, href }) => (
                <li key={carrera.codigo_sies}>
                  <Link href={href}>Agregar: {descripcionDeCarrera(carrera)}</Link>
                </li>
              ))}
            </ul>
          ) : <p>No encontramos carreras con «{q}». Prueba con otra palabra.</p>
        ) : null}

        {seleccionadas.length ? <p>La dirección de esta página guarda solo las carreras elegidas. Puedes copiarla para compartir esta comparación.</p> : null}
      </section>

      {seleccionadas.length ? (
        <section className={estilos.tabla} aria-label="Datos comparados">
          <div className={estilos.columnas}>
            {seleccionadas.map((carrera) => (
              <p key={carrera.codigo_sies}>{descripcionDeCarrera(carrera)}</p>
            ))}
          </div>
          {FILAS_INDICADORES.map((fila) => <FilaComparacion key={fila.tipo} carreras={seleccionadas} fila={fila} />)}
        </section>
      ) : null}
      {seleccionadas.length ? (
        <section className={estilos.bloquesMoviles} aria-label="Datos comparados por carrera">
          {seleccionadas.map((carrera) => <BloqueCarrera key={carrera.codigo_sies} carrera={carrera} />)}
        </section>
      ) : null}
    </main>
  );
}
