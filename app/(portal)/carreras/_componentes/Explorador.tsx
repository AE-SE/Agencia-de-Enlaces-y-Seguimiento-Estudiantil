import Link from 'next/link';

import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import type { Carrera, Indicador } from '@/lib/datos/carreras';
import { JORNADAS, REGIONES, TIPOS, type FiltrosBusqueda } from '@/lib/datos/consultas';
import { rutaDeCarrera } from '@/lib/datos/ruta';
import type { TipoInstitucion } from '@/lib/datos/tipos';

import estilos from './Explorador.module.css';
import { IndicadorEstacion } from '@/app/_componentes/IndicadorEstacion';

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

const nombresTipo: Record<TipoInstitucion, string> = {
  universidad: 'Universidad',
  instituto_profesional: 'Instituto profesional (IP): carreras profesionales y técnicas, sin licenciatura',
  centro_formacion_tecnica: 'Centro de formación técnica (CFT): carreras técnicas de nivel superior',
};

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
        <p>{indicador && 'motivo_sin_dato' in indicador ? indicador.motivo_sin_dato : 'Todavía no mostramos este dato en el portal.'}</p>
      )}
    </div>
  );
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
  const filtrosActivos = filtros.regiones.length + filtros.tipos.length + filtros.jornadas.length;
  const hayFiltros = Boolean(filtros.texto || filtrosActivos);
  const sugerencia = filtros.regiones.length === 1 && !filtros.texto && !filtros.tipos.length && !filtros.jornadas.length
    ? 'Prueba quitando la región.'
    : 'Prueba quitando algunos filtros.';

  return (
    <main id="contenido" tabIndex={-1} className={estilos.explorador}>
      <div className={estilos.contenido}>
        <Link className={estilos.volver} href="/">Volver al inicio</Link>
        <header className={estilos.encabezado}>
        <IndicadorEstacion actual={1} />
        <h1>Explora carreras</h1>
        <p>Busca por carrera, institución, sede o comuna.</p>
      </header>

      <form className={estilos.buscador} method="get" action="/carreras" aria-label="Buscar y filtrar carreras">
        <div className={estilos.campo}>
          <label htmlFor="busqueda">Busca por carrera, institución, sede o comuna</label>
          <div className={estilos.entrada}>
            <input id="busqueda" name="q" defaultValue={filtros.texto} />
            <button className={estilos.buscar} type="submit">Buscar</button>
          </div>
        </div>

        <details className={estilos.filtros}>
          <summary>
            Filtros{filtrosActivos ? ` (${filtrosActivos} activos)` : ''}
          </summary>
          <div className={estilos.cuerpoFiltros}>
            <fieldset>
              <legend>Región</legend>
              <div className={estilos.opciones}>
                {REGIONES.map((region) => (
                  <label key={region}>
                    <input type="checkbox" name="region" value={region} defaultChecked={filtros.regiones.includes(region)} />
                    {region}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Tipo de institución</legend>
              <div className={estilos.opciones}>
                {TIPOS.map((tipo) => (
                  <label key={tipo}>
                    <input type="checkbox" name="tipo" value={tipo} defaultChecked={filtros.tipos.includes(tipo)} />
                    {nombresTipo[tipo]}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Jornada</legend>
              <div className={estilos.opciones}>
                {JORNADAS.map((jornada) => (
                  <label key={jornada}>
                    <input type="checkbox" name="jornada" value={jornada} defaultChecked={filtros.jornadas.includes(jornada)} />
                    {jornada}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className={estilos.acciones}>
              <button className={estilos.buscar} type="submit">Aplicar filtros</button>
              {hayFiltros ? <Link className={estilos.quitar} href="/carreras">Quitar filtros</Link> : null}
            </div>
          </div>
        </details>
      </form>

      {error ? (
        <p role="alert" className={estilos.vacio}>No pudimos cargar las carreras en este momento. Intenta de nuevo en unos minutos.</p>
      ) : null}

      <section className={estilos.resultados} aria-labelledby="resultados">
        <div className={estilos.resumen}>
          <h2 id="resultados">Resultados</h2>
          <p aria-live="polite">{total} {total === 1 ? 'carrera encontrada' : 'carreras encontradas'}</p>
          <p>Las carreras están ordenadas por código SIES. Mostramos {carreras.length} por página.</p>
        </div>
        {carreras.length ? <div className={estilos.listaResultados}>{carreras.map((carrera) => (
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
            <Link className={estilos.enlace} href={rutaDeCarrera(carrera)}>Ver ficha de carrera</Link>
          </article>
        ))}</div> : <p className={estilos.vacio}>No encontramos carreras con esos filtros. {sugerencia}</p>}
      </section>

        {paginas > 1 ? (
        <nav className={estilos.paginacion} aria-label="Páginas de resultados">
          {pagina > 1 ? <Link href={hrefConPagina(filtros, pagina - 1)}>Página anterior</Link> : null}
          <p>Página {pagina} de {paginas}</p>
          {pagina < paginas ? <Link href={hrefConPagina(filtros, pagina + 1)}>Página siguiente</Link> : null}
        </nav>
        ) : null}
      </div>
    </main>
  );
}
