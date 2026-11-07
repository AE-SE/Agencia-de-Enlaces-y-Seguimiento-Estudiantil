'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';

import { carrerasDesdeCodigos, indicadorDe, rutaDelComparador } from '@/lib/datos/comparador';
import type { Carrera, Indicador } from '@/lib/datos/carreras';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';

import estilos from './comparador.module.css';

type Props = { carreras: Carrera[] };

type Fila = {
  tipo: Indicador['tipo'];
  titulo: string;
  unidad: string;
  queMide: string;
};

const filas: Fila[] = [
  { tipo: 'empleabilidad_1er_anio', titulo: 'Empleabilidad al 1.er año', unidad: 'porcentaje', queMide: 'Porcentaje de personas tituladas que ganaron al menos el sueldo mínimo durante el primer año después de titularse. Solo considera a quienes registran ingresos.' },
  { tipo: 'ingreso_promedio_4to_anio', titulo: 'Ingreso al 4.º año', unidad: 'pesos chilenos', queMide: 'Tramo del ingreso bruto mensual al cuarto año después de titularse.' },
  { tipo: 'arancel_anual', titulo: 'Arancel anual', unidad: 'pesos chilenos', queMide: 'Lo que pagas cada año.' },
  { tipo: 'duracion_real_semestres', titulo: 'Duración real', unidad: 'semestres', queMide: 'Tiempo que tardaron en titularse quienes terminaron la carrera.' },
  { tipo: 'puntaje_corte', titulo: 'Puntaje de corte', unidad: 'puntos', queMide: 'Puntaje del último matriculado el año anterior.' },
  { tipo: 'vacantes', titulo: 'Vacantes', unidad: 'cupos', queMide: 'Cupos disponibles para postular.' },
];

function formatoNumero(indicador: Indicador): string {
  if (indicador.valor === null) return 'Sin datos suficientes';
  if (indicador.unidad === 'pesos') {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(indicador.valor);
  }
  if (indicador.unidad === 'porcentaje') return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor)} %`;
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor);
}

function Celda({ carrera, fila, ocultaEnMovil }: { carrera: Carrera; fila: Fila; ocultaEnMovil: boolean }) {
  const indicador = indicadorDe(carrera, fila.tipo);
  const sinDato = !indicador || indicador.valor === null;

  return (
    <div className={`${estilos.celda} ${ocultaEnMovil ? estilos.ocultaEnMovil : ''}`}>
      <p className={sinDato ? estilos.sinDato : estilos.valor}>{sinDato ? 'Sin datos suficientes' : formatoNumero(indicador)}</p>
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

function FilaComparacion({ carreras, fila, visiblesEnMovil }: { carreras: Carrera[]; fila: Fila; visiblesEnMovil: string[] }) {
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
            ocultaEnMovil={!visiblesEnMovil.includes(carrera.codigo_sies)}
          />
        ))}
      </div>
      {hayPeriodosDistintos ? (
        <p className={estilos.aviso}><AlertTriangle aria-hidden="true" /> <strong>Aviso:</strong> los períodos no son iguales. Revísalos antes de comparar.</p>
      ) : null}
    </section>
  );
}

export function Comparador({ carreras }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seleccionadas = carrerasDesdeCodigos(searchParams.get('carreras'), carreras);
  const [elegidasEnMovil, setElegidasEnMovil] = useState<string[]>([]);
  const visiblesEnMovil = (elegidasEnMovil.length ? elegidasEnMovil : seleccionadas.slice(0, 2).map((carrera) => carrera.codigo_sies))
    .filter((codigo) => seleccionadas.some((carrera) => carrera.codigo_sies === codigo));

  function actualizar(siguiente: Carrera[]) {
    router.replace(rutaDelComparador(siguiente), { scroll: false });
  }

  function agregar(codigo: string) {
    const carrera = carreras.find((item) => item.codigo_sies === codigo);
    if (carrera && !seleccionadas.some((item) => item.codigo_sies === codigo)) actualizar([...seleccionadas, carrera]);
  }

  function alternarVisible(codigo: string) {
    if (visiblesEnMovil.includes(codigo)) {
      setElegidasEnMovil(visiblesEnMovil.filter((item) => item !== codigo));
      return;
    }
    if (visiblesEnMovil.length < 2) setElegidasEnMovil([...visiblesEnMovil, codigo]);
  }

  return (
    <main id="contenido" tabIndex={-1} className={estilos.comparador}>
      <Link className={estilos.volver} href="/carreras">Volver al explorador</Link>
      <header className={estilos.encabezado}>
        <p className={estilos.estacion}>1 · Explorar</p>
        <h1>Compara carreras</h1>
        <p>Revisa los datos de hasta tres opciones. Esta página no ordena ni recomienda instituciones.</p>
      </header>

      <section className={estilos.selector} aria-labelledby="elige-carreras">
        <h2 id="elige-carreras">Elige hasta tres carreras</h2>
        {seleccionadas.length ? (
          <ul className={estilos.seleccionadas}>
            {seleccionadas.map((carrera) => (
              <li key={carrera.codigo_sies}>
                <span>{carrera.carrera} · {carrera.institucion.nombre} · {carrera.sede} · {carrera.jornada}</span>
                <button type="button" onClick={() => actualizar(seleccionadas.filter((item) => item.codigo_sies !== carrera.codigo_sies))}>Quitar carrera</button>
              </li>
            ))}
          </ul>
        ) : <p>Agrega carreras para comparar sus datos oficiales.</p>}
        <label htmlFor="agregar-carrera">Agregar una carrera</label>
        <select id="agregar-carrera" value="" disabled={seleccionadas.length === 3} onChange={(evento) => agregar(evento.target.value)}>
          <option value="">{seleccionadas.length === 3 ? 'Ya elegiste tres carreras' : 'Elige una carrera'}</option>
          {carreras.filter((carrera) => !seleccionadas.some((item) => item.codigo_sies === carrera.codigo_sies)).map((carrera) => (
            <option key={carrera.codigo_sies} value={carrera.codigo_sies}>{carrera.carrera} · {carrera.institucion.nombre} · {carrera.sede}</option>
          ))}
        </select>
        {seleccionadas.length === 3 ? (
          <fieldset className={estilos.elegirMovil}>
            <legend>En teléfono, elige dos carreras para ver lado a lado</legend>
            {seleccionadas.map((carrera) => {
              const estaVisible = visiblesEnMovil.includes(carrera.codigo_sies);
              const estaDeshabilitada = !estaVisible && visiblesEnMovil.length === 2;
              const idDeAyuda = `limite-visible-${carrera.codigo_sies}`;

              return (
                <Fragment key={carrera.codigo_sies}>
                  <label>
                    <input
                      type="checkbox"
                      checked={estaVisible}
                      disabled={estaDeshabilitada}
                      aria-describedby={estaDeshabilitada ? idDeAyuda : undefined}
                      onChange={() => alternarVisible(carrera.codigo_sies)}
                    />
                    {carrera.carrera} · {carrera.institucion.nombre}
                  </label>
                  {estaDeshabilitada ? <p id={idDeAyuda} role="status">Ya ves dos carreras. Quita una para ver esta.</p> : null}
                </Fragment>
              );
            })}
          </fieldset>
        ) : null}
        {seleccionadas.length ? <p>La dirección de esta página guarda solo las carreras elegidas. Puedes copiarla para compartir esta comparación.</p> : null}
      </section>

      {seleccionadas.length ? (
        <section className={estilos.tabla} aria-label="Datos comparados">
          <div className={estilos.columnas}>
            {seleccionadas.map((carrera) => (
              <p className={visiblesEnMovil.includes(carrera.codigo_sies) ? '' : estilos.ocultaEnMovil} key={carrera.codigo_sies}>
                {carrera.carrera} · {carrera.institucion.nombre} · {carrera.sede} · {carrera.jornada}
              </p>
            ))}
          </div>
          {filas.map((fila) => <FilaComparacion key={fila.tipo} carreras={seleccionadas} fila={fila} visiblesEnMovil={visiblesEnMovil} />)}
        </section>
      ) : null}
    </main>
  );
}
