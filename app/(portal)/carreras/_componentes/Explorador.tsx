'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { filtrarCarreras } from '@/lib/datos/buscar';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import type { Carrera, Indicador } from '@/lib/datos/carreras';
import { rutaDeCarrera } from '@/lib/datos/ruta';
import type { TipoInstitucion } from '@/lib/datos/tipos';

import estilos from './Explorador.module.css';

type Props = { carreras: Carrera[] };
type Filtros = { texto: string; regiones: string[]; tipos: TipoInstitucion[]; jornadas: string[] };

const nombresTipo: Record<TipoInstitucion, string> = {
  universidad: 'Universidad',
  instituto_profesional: 'Instituto profesional (IP): carreras profesionales y técnicas, sin licenciatura',
  centro_formacion_tecnica: 'Centro de formación técnica (CFT): carreras técnicas de nivel superior',
};

function cambiarSeleccion<T extends string>(seleccion: T[], valor: T): T[] {
  return seleccion.includes(valor) ? seleccion.filter((item) => item !== valor) : [...seleccion, valor];
}

function formatoNumero(indicador: Indicador): string {
  if (indicador.valor === null) return 'Sin datos suficientes';
  if (indicador.unidad === 'pesos') return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(indicador.valor);
  if (indicador.unidad === 'porcentaje') return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor)} %`;
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor);
}

function DatoClave({ carrera, tipo, titulo, queMide }: { carrera: Carrera; tipo: Indicador['tipo']; titulo: string; queMide: string }) {
  const indicador = carrera.indicadores.find((item) => item.tipo === tipo);
  return (
    <div className={estilos.dato}>
      <h3>{titulo}</h3>
      <p className={estilos.valor}>{indicador ? formatoNumero(indicador) : 'Sin datos suficientes'}</p>
      {indicador && indicador.valor !== null ? (
        <>
          <p>{queMide}</p>
          <p>{indicador.periodo}</p>
          <p className={estilos.fuente}>
            Fuente:{' '}
            <a href={indicador.url}>{nombreDeFuente(indicador.fuente)}</a>
            {' '}· Consultada el {fechaLarga(indicador.fecha_consulta)}
          </p>
        </>
      ) : (
        <p>{indicador && 'motivo_sin_dato' in indicador ? indicador.motivo_sin_dato : 'Todavía no tenemos este dato.'}</p>
      )}
    </div>
  );
}

export function Explorador({ carreras }: Props) {
  const [filtros, setFiltros] = useState<Filtros>({ texto: '', regiones: [], tipos: [], jornadas: [] });
  const resultados = useMemo(() => filtrarCarreras(carreras, filtros), [carreras, filtros]);
  const regiones = useMemo(() => [...new Set(carreras.map((carrera) => carrera.region))].sort((a, b) => a.localeCompare(b, 'es')), [carreras]);
  const tipos = useMemo(() => [...new Set(carreras.map((carrera) => carrera.institucion.tipo))].sort(), [carreras]);
  const jornadas = useMemo(() => [...new Set(carreras.map((carrera) => carrera.jornada))].sort((a, b) => a.localeCompare(b, 'es')), [carreras]);
  const hayFiltros = Boolean(filtros.texto || filtros.regiones.length || filtros.tipos.length || filtros.jornadas.length);
  const sugerencia = filtros.regiones.length === 1 && !filtros.texto && !filtros.tipos.length && !filtros.jornadas.length
    ? 'Prueba quitando la región.'
    : 'Prueba quitando algunos filtros.';

  // TODO(fuente): no se filtra por área ni arancel; falta el área y el criterio oficial para comparar aranceles.
  // TODO(rendimiento): con más resultados, mostrar carga progresiva antes de renderizar toda la lista.
  return (
    <main id="contenido" tabIndex={-1} className={estilos.explorador}>
      <Link className={estilos.volver} href="/">Volver al inicio</Link>
      <header className={estilos.encabezado}>
        <p className={estilos.estacion}>1 · Explorar</p>
        <h1>Explora carreras</h1>
        <p>Busca por carrera, institución, sede o comuna.</p>
      </header>

      <section className={estilos.filtros} aria-label="Filtros de carreras">
        <div className={estilos.campo}>
          <label htmlFor="busqueda">Busca por carrera, institución, sede o comuna</label>
          <input id="busqueda" value={filtros.texto} onChange={(evento) => setFiltros({ ...filtros, texto: evento.target.value })} />
        </div>
        <fieldset>
          <legend>Región</legend>
          {regiones.map((region) => <label key={region}><input type="checkbox" checked={filtros.regiones.includes(region)} onChange={() => setFiltros({ ...filtros, regiones: cambiarSeleccion(filtros.regiones, region) })} />{region}</label>)}
        </fieldset>
        <fieldset>
          <legend>Tipo de institución</legend>
          {tipos.map((tipo) => <label key={tipo}><input type="checkbox" checked={filtros.tipos.includes(tipo)} onChange={() => setFiltros({ ...filtros, tipos: cambiarSeleccion(filtros.tipos, tipo) })} />{nombresTipo[tipo]}</label>)}
        </fieldset>
        <fieldset>
          <legend>Jornada</legend>
          {jornadas.map((jornada) => <label key={jornada}><input type="checkbox" checked={filtros.jornadas.includes(jornada)} onChange={() => setFiltros({ ...filtros, jornadas: cambiarSeleccion(filtros.jornadas, jornada) })} />{jornada}</label>)}
        </fieldset>
        {hayFiltros ? <button className={estilos.quitar} type="button" onClick={() => setFiltros({ texto: '', regiones: [], tipos: [], jornadas: [] })}>Quitar filtros</button> : null}
      </section>

      <section className={estilos.resultados} aria-labelledby="resultados">
        <div className={estilos.resumen}>
          <h2 id="resultados">Resultados</h2>
          <p aria-live="polite">{resultados.length} {resultados.length === 1 ? 'carrera encontrada' : 'carreras encontradas'}</p>
          <p>Las carreras están ordenadas por nombre.</p>
        </div>
        {resultados.length ? resultados.map((carrera) => (
          <article className={estilos.tarjeta} key={carrera.codigo_sies}>
            <div>
              <h3>{carrera.carrera}</h3>
              <p className={estilos.institucion}>{carrera.institucion.nombre}</p>
              <p>{carrera.comuna} · Región: {carrera.region}</p>
            </div>
            <div className={estilos.datos}>
              <DatoClave carrera={carrera} tipo="empleabilidad_1er_anio" titulo="Empleabilidad al 1.er año" queMide="Porcentaje de personas tituladas que ganaron al menos el sueldo mínimo durante el primer año después de titularse. Solo considera a quienes registran ingresos." />
              <DatoClave carrera={carrera} tipo="arancel_anual" titulo="Arancel anual" queMide="Precio de un año de la carrera, antes de aplicar beneficios." />
            </div>
            <Link className={estilos.enlace} href={rutaDeCarrera(carrera, carreras)}>Ver ficha de carrera</Link>
          </article>
        )) : <p className={estilos.vacio}>No encontramos carreras con esos filtros. {sugerencia}</p>}
      </section>
    </main>
  );
}
