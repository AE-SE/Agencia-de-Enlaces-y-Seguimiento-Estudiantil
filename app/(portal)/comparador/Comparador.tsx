import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { rutaDeLaHoja } from '@/lib/datos/hoja';
import { datoDeFila, filasDelGrupo, GRUPOS_DE_FILAS, type FilaIndicador } from '@/lib/datos/indicadores-vista';
import type { Carrera } from '@/lib/datos/carreras';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import { textoParaLectura } from '@/lib/datos/texto';

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

function descripcionDeCarrera(carrera: Carrera) {
  return [carrera.carrera, carrera.institucion.nombre, carrera.sede, carrera.jornada].map(textoParaLectura).join(' · ');
}

function DescripcionDeCarrera({ carrera }: { carrera: Carrera }) {
  return <span className={estilos.descripcionCarrera}>{descripcionDeCarrera(carrera)}</span>;
}

function Celda({ carrera, fila }: { carrera: Carrera; fila: FilaIndicador }) {
  const dato = datoDeFila(carrera, fila, false);
  const sinDato = dato.texto === null;

  return (
    <div className={estilos.celda}>
      <p className={sinDato ? estilos.sinDato : estilos.valor}>{sinDato ? 'Sin datos suficientes' : dato.texto}</p>
      {sinDato ? (
        <p>{dato.motivo}</p>
      ) : (
        <>
          <p>{dato.nivel === 'programa' ? 'Toda la carrera en esta institución.' : 'Esta sede y jornada.'}</p>
          <div className={estilos.metadatos}>
            <p>Período: {dato.periodo}</p>
            <p>Fuente: <a href={dato.url}>{nombreDeFuente(dato.fuente)}</a> · Consultada el <time dateTime={dato.fecha_consulta}>{fechaLarga(dato.fecha_consulta)}</time>.</p>
          </div>
        </>
      )}
    </div>
  );
}

function FilaComparacion({ carreras, fila }: { carreras: Carrera[]; fila: FilaIndicador }) {
  const periodos = carreras
    .map((carrera) => datoDeFila(carrera, fila, false))
    .filter((dato) => dato.texto !== null)
    .map((dato) => dato.periodo);
  const hayPeriodosDistintos = new Set(periodos).size > 1;

  return (
    <section className={estilos.fila} aria-labelledby={`indicador-${fila.tipo}`}>
      <div className={estilos.etiqueta}>
        <h3 id={`indicador-${fila.tipo}`}>{fila.titulo}</h3>
        <p>Unidad: {fila.unidad}</p>
        <p>{fila.queMide}</p>
      </div>
      <div className={estilos.celdas}>
        {carreras.map((carrera) => (
          <Celda key={carrera.codigo_sies} carrera={carrera} fila={fila} />
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
      <h2><DescripcionDeCarrera carrera={carrera} /></h2>
      {GRUPOS_DE_FILAS.map((grupo) => (
        <section className={estilos.grupo} key={grupo.id} aria-labelledby={`grupo-${carrera.codigo_sies}-${grupo.id}`}>
          <h3 id={`grupo-${carrera.codigo_sies}-${grupo.id}`} className={estilos.tituloDeGrupo}>{grupo.titulo}</h3>
          {filasDelGrupo(grupo).map((fila) => (
            <section className={estilos.indicadorMovil} key={fila.tipo} aria-labelledby={`indicador-${carrera.codigo_sies}-${fila.tipo}`}>
              <div className={estilos.etiqueta}>
                <h4 id={`indicador-${carrera.codigo_sies}-${fila.tipo}`}>{fila.titulo}</h4>
                <p>Unidad: {fila.unidad}</p>
                <p>{fila.queMide}</p>
              </div>
              <Celda carrera={carrera} fila={fila} />
            </section>
          ))}
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
                <DescripcionDeCarrera carrera={carrera} />
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
                  <Link href={href}>Agregar: <DescripcionDeCarrera carrera={carrera} /></Link>
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
              <p key={carrera.codigo_sies}><DescripcionDeCarrera carrera={carrera} /></p>
            ))}
          </div>
          {GRUPOS_DE_FILAS.map((grupo) => (
            <section className={estilos.grupo} key={grupo.id} aria-labelledby={`grupo-${grupo.id}`}>
              <h2 id={`grupo-${grupo.id}`} className={estilos.tituloDeGrupo}>{grupo.titulo}</h2>
              {filasDelGrupo(grupo).map((fila) => <FilaComparacion key={fila.tipo} carreras={seleccionadas} fila={fila} />)}
            </section>
          ))}
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
