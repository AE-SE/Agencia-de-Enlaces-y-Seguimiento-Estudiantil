import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Boton } from '../../_componentes/Boton';
import { DatoOficial } from '../../_componentes/DatoOficial';
import { listarCarreras, type Carrera, type Indicador } from '@/lib/datos/carreras';
import { slug, slugUnico } from '@/lib/datos/slug';

import estilos from './FichaCarrera.module.css';

export const dynamicParams = false;

type Params = { institucion: string; carrera: string };
type Fuente = Pick<Indicador, 'fuente' | 'url' | 'fecha_consulta'>;

function segmentoCarrera(carrera: Carrera, carreras: readonly Carrera[]) {
  return slugUnico(
    `${carrera.carrera}-${carrera.sede}`,
    carrera.codigo_sies,
    carreras
      .filter((item) => slug(item.institucion.nombre) === slug(carrera.institucion.nombre))
      .map((item) => `${item.carrera}-${item.sede}`),
  );
}

function encontrarCarrera(params: Params) {
  const carreras = listarCarreras();
  return carreras.find(
    (item) => slug(item.institucion.nombre) === params.institucion && segmentoCarrera(item, carreras) === params.carrera,
  );
}

function indicador(carrera: Carrera, tipo: Indicador['tipo']) {
  return carrera.indicadores.find((item) => item.tipo === tipo);
}

function formatoNumero(valor: number, unidad: Indicador['unidad']) {
  if (unidad === 'pesos') return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);
  if (unidad === 'porcentaje') return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor)} %`;
  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor)} ${unidad}`;
}

function Fuentes({ carrera }: { carrera: Carrera }) {
  const fuentes = carrera.indicadores.reduce<Fuente[]>((acumuladas, item) => {
    if (!acumuladas.some((fuente) => fuente.url === item.url)) acumuladas.push(item);
    return acumuladas;
  }, []);

  return (
    <section className={estilos.fuentes} aria-labelledby="fuentes">
      <h2 id="fuentes">¿De dónde salen estos datos?</h2>
      <ul>
        {fuentes.map((fuente) => (
          <li key={fuente.url}>
            <a href={fuente.url}>{fuente.fuente}</a> · Consultada el {fuente.fecha_consulta}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function generateStaticParams(): Params[] {
  const carreras = listarCarreras();
  return carreras.map((carrera) => ({
    institucion: slug(carrera.institucion.nombre),
    carrera: segmentoCarrera(carrera, carreras),
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const carrera = encontrarCarrera(await params);
  if (!carrera) return {};
  return {
    title: `${carrera.carrera} en ${carrera.institucion.nombre}`,
    description: `Datos oficiales de ${carrera.carrera} en ${carrera.institucion.nombre}, sede ${carrera.sede}.`,
  };
}

export default async function PaginaCarrera({ params }: { params: Promise<Params> }) {
  const carrera = encontrarCarrera(await params);
  if (!carrera) notFound();

  const empleabilidad = indicador(carrera, 'empleabilidad_1er_anio');
  const ingreso = indicador(carrera, 'ingreso_promedio_4to_anio');
  const arancel = indicador(carrera, 'arancel_anual');
  const duracionReal = indicador(carrera, 'duracion_real_semestres');
  const vacantes = indicador(carrera, 'vacantes');

  // TODO(fuente): matrícula no se muestra porque el origen la rotula como cupos y mide estudiantes.
  return (
    <main id="contenido" tabIndex={-1} className={estilos.ficha}>
      <header className={estilos.encabezado}>
        <h1>{carrera.carrera}</h1>
        <p className={estilos.institucion}>{carrera.institucion.nombre}</p>
        <p className={estilos.ubicacion}>{carrera.sede} · {carrera.comuna} · Región: {carrera.region}</p>
      </header>

      <section className={estilos.seccion} aria-labelledby="datos-principales">
        <h2 id="datos-principales">Datos para comparar</h2>
        <div className={estilos.datos}>
          <DatoOficial titulo="Empleabilidad al 1.er año" queMide="Tenía trabajo al primer año" indicador={empleabilidad} valor={empleabilidad?.valor === null || !empleabilidad ? undefined : formatoNumero(empleabilidad.valor, empleabilidad.unidad)} />
          <DatoOficial titulo="Ingreso promedio al 4.º año" queMide="Ingreso promedio al cuarto año" indicador={ingreso} valor={ingreso?.valor === null || !ingreso ? undefined : formatoNumero(ingreso.valor, ingreso.unidad)} />
          <DatoOficial titulo="Arancel anual" queMide="Lo que pagas cada año" indicador={arancel} valor={arancel?.valor === null || !arancel ? undefined : formatoNumero(arancel.valor, arancel.unidad)} />
          <DatoOficial titulo="Duración formal" queMide="Semestres que declara la carrera" valor={`${carrera.duracion_semestres} semestres`} periodo="Este dato aún no tiene período ni fuente cargados." />
          <DatoOficial titulo="Duración real" queMide="Semestres que tardaron quienes se titularon" indicador={duracionReal} valor={duracionReal?.valor === null || !duracionReal ? undefined : formatoNumero(duracionReal.valor, duracionReal.unidad)} />
          <DatoOficial titulo="Vacantes" queMide="Cupos disponibles para postular" indicador={vacantes} valor={vacantes?.valor === null || !vacantes ? undefined : formatoNumero(vacantes.valor, vacantes.unidad)} />
          <DatoOficial titulo="Acreditación de la institución" queMide="Años y vigencia de la acreditación" />
          <DatoOficial titulo="Puntaje de corte del año anterior" queMide="Puntaje del último matriculado" indicador={indicador(carrera, 'puntaje_corte')} />
          <DatoOficial titulo="Ponderaciones de la prueba" queMide="Porcentaje de cada prueba para postular" />
        </div>
      </section>

      <section className={estilos.acciones} aria-label="Próximas acciones">
        <Boton principal>Comparar con otra carrera</Boton>
        <p className={estilos.disponible}>Disponible pronto</p>
        <Boton>Simular mi puntaje para esta carrera</Boton>
        <p className={estilos.disponible}>Disponible pronto</p>
      </section>

      <Fuentes carrera={carrera} />
    </main>
  );
}
