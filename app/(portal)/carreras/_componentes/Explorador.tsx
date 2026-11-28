import Link from 'next/link';
import { ArrowUpRight, Columns2, Search, MapPin, CircleAlert } from 'lucide-react';

import { fechaLarga, periodoLegible } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import type { Carrera, Indicador } from '@/lib/datos/carreras';
import { parametrosPorGrupos, usaOrdenPorRelevancia, type FiltrosBusqueda } from '@/lib/datos/consultas';
import { FILAS_INDICADORES, motivoSinFila } from '@/lib/datos/indicadores-vista';
import { rutaDelComparador } from '@/lib/datos/comparador';
import { rutaDeCarrera } from '@/lib/datos/ruta';
import { textoParaLectura } from '@/lib/datos/texto';
import { codigosRepetidos, textoDeVersion } from '@/lib/datos/version-plan';

import estilos from './Explorador.module.css';
import { CabeceraInterior } from '@/app/_componentes/CabeceraInterior';
import { FiltrosCarreras } from '@/app/_componentes/FiltrosCarreras';
import { CargaExplorador } from './CargaExplorador';

// Explorador del lado del servidor: los filtros son un formulario GET (funciona sin JavaScript)
// y la paginación son enlaces. Cada visita trae solo una página de resultados.
type Props = {
  carreras: Carrera[];
  total: number;
  pagina: number;
  paginas: number;
  filtros: FiltrosBusqueda;
  error?: boolean;
};

function formatoNumero(indicador: Indicador): string {
  if (indicador.valor === null) return 'Sin datos suficientes';
  if (indicador.unidad === 'pesos') return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(indicador.valor);
  if (indicador.unidad === 'porcentaje') return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor)} %`;
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(indicador.valor);
}

// El mismo motivo que dan la ficha y el comparador cuando la carrera no trae el dato.
function motivoDeLaTarjeta(carrera: Carrera, tipo: Indicador['tipo']): string {
  const fila = FILAS_INDICADORES.find((f) => f.tipo === tipo);
  return fila ? motivoSinFila(carrera, fila) : 'Este dato aún no está cargado.';
}

function DatoClave({ carrera, tipo, titulo, queMide }: { carrera: Carrera; tipo: Indicador['tipo']; titulo: string; queMide: string }) {
  const indicador = carrera.indicadores.find((item) => item.tipo === tipo);
  return (
    <div className={estilos.dato} data-sin-dato={!indicador || indicador.valor === null || undefined}>
      <h4>{titulo}</h4>
      <p className={estilos.valor}>{indicador ? formatoNumero(indicador) : 'Sin datos suficientes'}</p>
      {indicador && indicador.valor !== null ? (
        <>
          <p>{queMide}</p>
          <p>{indicador.nivel === 'programa' ? 'Toda la carrera en esta institución.' : 'Esta sede y jornada.'}</p>
          <p>Período: {periodoLegible(indicador.periodo)}</p>
          {indicador.nota ? <p>{indicador.nota}</p> : null}
          <p className={estilos.fuente}>
            Fuente:{' '}
            <a href={indicador.url}>{nombreDeFuente(indicador.fuente)}</a>
            {' '}· Consultada el {fechaLarga(indicador.fecha_consulta)}
          </p>
        </>
      ) : (
        <p>{indicador && 'motivo_sin_dato' in indicador ? indicador.motivo_sin_dato : motivoDeLaTarjeta(carrera, tipo)}</p>
      )}
    </div>
  );
}

// La sede se dice si no se llama como la comuna (como en la ficha): distingue ofertas de una misma comuna
// y es parte de la clave de las ofertas gemelas, así que la nota que las explica habla de algo visible.
function ubicacionVisible(carrera: Carrera): string {
  const sede = textoParaLectura(carrera.sede);
  const comuna = textoParaLectura(carrera.comuna);
  return sede === comuna ? comuna : `${sede} · ${comuna}`;
}

// Enlace a otra página de resultados, manteniendo los filtros.
function hrefConPagina(filtros: FiltrosBusqueda, pagina: number): string {
  const p = new URLSearchParams();
  if (filtros.texto) p.set('q', filtros.texto);
  for (const r of filtros.regiones) p.append('region', r);
  for (const t of filtros.tipos) p.append('tipo', t);
  for (const j of filtros.jornadas) p.append('jornada', j);
  if (pagina > 1) p.set('pagina', String(pagina));
  const texto = p.toString();
  return texto ? `/carreras?${texto}` : '/carreras';
}

export function Explorador({ carreras, total, pagina, paginas, filtros, error }: Props) {
  const sugerencia = filtros.regiones.length === 1 && !filtros.texto && !filtros.tipos.length && !filtros.jornadas.length
    ? 'Prueba quitando la región.'
    : 'Prueba quitando algunos filtros.';
  // Ofertas que en esta página se verían iguales (misma carrera, institución, sede y jornada).
  const repetidos = codigosRepetidos(carreras);

  return (
    <div className={estilos.explorador} data-pagina-interior>
      <CabeceraInterior pagina="carreras" titulo="Explora carreras">
        <p>Escribe la carrera, la institución o la comuna, y filtra por región, tipo de institución o jornada.</p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina">
        <CargaExplorador>
          <form className={estilos.buscador} method="get" action="/carreras" aria-label="Buscar y filtrar carreras">
            <div className={estilos.campo}>
              <label htmlFor="busqueda">Busca por carrera, institución o comuna</label>
              {/* El ejemplo describe el campo; fuera de la etiqueta para que no alargue su nombre accesible. */}
              <p id="busqueda-ejemplo" className={estilos.ejemplo}>Por ejemplo: enfermería u de chile</p>
              <div className={estilos.entrada}>
                <input id="busqueda" name="q" defaultValue={filtros.texto} aria-describedby="busqueda-ejemplo" />
                <button className={estilos.buscar} type="submit"><Search aria-hidden="true" />Buscar</button>
              </div>
            </div>

            <FiltrosCarreras filtros={filtros} quitarHref="/carreras" />
          </form>

          {error ? (
            <div role="alert" className={estilos.vacio}>
              <CircleAlert aria-hidden="true" />
              <div><h2>No pudimos cargar las carreras</h2><p>Intenta de nuevo en unos minutos.</p></div>
            </div>
          ) : null}

          {!error ? <section className={estilos.resultados} aria-labelledby="resultados">
            <div className={estilos.resumen}>
              <h2 id="resultados">Resultados</h2>
              <p aria-live="polite">{total.toLocaleString('es-CL')} {total === 1 ? 'carrera encontrada' : 'carreras encontradas'}</p>
              <p className={estilos.orden}>
                {usaOrdenPorRelevancia(filtros.texto)
                  ? 'Las carreras están ordenadas alfabéticamente por nombre. Dentro de cada carrera aparece primero la institución de nombre más corto que contiene tus palabras.'
                  : 'Las carreras están ordenadas alfabéticamente por nombre de carrera y, dentro de cada una, por nombre de institución.'}
                {parametrosPorGrupos(filtros, 1) ? ' Primero aparecen las carreras cuyo nombre empieza con la primera palabra que buscaste.' : ''}
                {' '}Mostramos {carreras.length} por página.
              </p>
              {repetidos.size ? <p className={estilos.orden}>Algunas carreras aparecen más de una vez con la misma sede y jornada: son versiones distintas de su plan de estudios, según el código de Mineduc. Pueden cambiar en duración, arancel o vacantes: revisa cada ficha.</p> : null}
            </div>
            {carreras.length ? <div className={estilos.listaResultados}>{carreras.map((carrera) => (
              <article className={estilos.tarjeta} key={carrera.codigo_sies} data-reveal="tarjeta" data-panel>
                <div className={estilos.identidad}>
                  <h3>{textoParaLectura(carrera.carrera)}</h3>
                  <p className={estilos.institucion}>{textoParaLectura(carrera.institucion.nombre)}</p>
                  <p className={estilos.ubicacion}><MapPin aria-hidden="true" /><span>{ubicacionVisible(carrera)} · Región: {carrera.region}{carrera.jornada ? ` · Jornada: ${carrera.jornada}` : ''}</span></p>
                  {repetidos.has(carrera.codigo_sies) ? <p className={estilos.version}>{textoDeVersion(carrera.codigo_sies)}</p> : null}
                </div>
                <div className={estilos.datos}>
                  <DatoClave carrera={carrera} tipo="empleabilidad_1er_anio" titulo="Empleabilidad al 1.er año" queMide="Porcentaje de personas tituladas que ganaron al menos el sueldo mínimo durante el primer año después de titularse. Solo considera a quienes registran ingresos." />
                  <DatoClave carrera={carrera} tipo="arancel_anual" titulo="Arancel anual" queMide="Precio de un año de la carrera, antes de aplicar beneficios." />
                </div>
                <div className={estilos.pie}>
                  <Link className={estilos.enlace} href={rutaDeCarrera(carrera)}>Ver ficha de carrera<ArrowUpRight aria-hidden="true" /></Link>
                  <Link className={estilos.enlace} href={rutaDelComparador([carrera])} aria-label={`Comparar ${textoParaLectura(carrera.carrera)}, ${textoParaLectura(carrera.institucion.nombre)}${carrera.sede ? `, sede ${textoParaLectura(carrera.sede)}` : ''}`}>Comparar<Columns2 aria-hidden="true" /></Link>
                </div>
              </article>
            ))}</div> : <div className={estilos.vacio}>
              <Search aria-hidden="true" />
              <div><h3>No encontramos carreras con esos filtros</h3><p>{sugerencia}</p></div>
            </div>}
          </section> : null}

          {paginas > 1 ? (
            <nav className={estilos.paginacion} aria-label="Páginas de resultados">
              {pagina > 1 ? <Link href={hrefConPagina(filtros, pagina - 1)}>Página anterior</Link> : null}
              <p>Página {pagina} de {paginas}</p>
              {pagina < paginas ? <Link href={hrefConPagina(filtros, pagina + 1)}>Página siguiente</Link> : null}
            </nav>
          ) : null}
        </CargaExplorador>
      </main>
    </div>
  );
}
