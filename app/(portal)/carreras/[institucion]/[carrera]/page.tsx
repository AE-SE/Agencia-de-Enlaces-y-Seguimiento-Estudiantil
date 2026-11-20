import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Boton } from '@/app/_componentes/Boton';
import { DatoOficial } from '@/app/_componentes/DatoOficial';
import { Acreditacion } from '../../_componentes/Acreditacion';
import { Ponderaciones } from '../../_componentes/Ponderaciones';
import { IngresoTramo } from '../../_componentes/IngresoTramo';
import { Duracion } from '../../_componentes/Duracion';
import type { Carrera, Indicador } from '@/lib/datos/carreras';
import { carrerasPorCodigos } from '@/lib/datos/oferta-remota';
import { COMO_SE_CALCULA, costoPrimerAnio } from '@/lib/datos/costo';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import { rutaDelComparador } from '@/lib/datos/comparador';
import { hoyEnChile } from '../../../beneficios/beneficios';
import { codigoDeSegmento, rutaDeCarrera } from '@/lib/datos/ruta';
import { textoParaLectura } from '@/lib/datos/texto';

import estilos from './FichaCarrera.module.css';
import { CabeceraInterior } from '@/app/_componentes/CabeceraInterior';

// Se atiende en vivo: consulta Supabase por el código SIES de la ruta.
export const dynamic = 'force-dynamic';

type Params = { institucion: string; carrera: string };
type Fuente = Pick<Indicador, 'fuente' | 'url' | 'fecha_consulta'>;

// La ruta termina en el código SIES: se consulta la base por ese código y se verifica la ruta.
async function encontrarCarrera(params: Params): Promise<Carrera | undefined> {
  const codigo = codigoDeSegmento(params.carrera).toUpperCase();
  // El segundo argumento pide también las ponderaciones del DEMRE (tabla requisito_admision).
  const [carrera] = await carrerasPorCodigos([codigo], true);
  if (!carrera) return undefined;
  return rutaDeCarrera(carrera) === `/carreras/${params.institucion}/${params.carrera}` ? carrera : undefined;
}

function indicador(carrera: Carrera, tipo: Indicador['tipo']) {
  return carrera.indicadores.find((item) => item.tipo === tipo);
}

function formatoNumero(valor: number, unidad: Indicador['unidad']) {
  if (unidad === 'pesos') return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);
  if (unidad === 'porcentaje') return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor)} %`;
  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor)} ${unidad}`;
}

function valorTexto(item: Indicador | undefined) {
  return item && item.valor !== null ? formatoNumero(item.valor, item.unidad) : undefined;
}

function Fuentes({ carrera }: { carrera: Carrera }) {
  // Las ponderaciones del DEMRE, la acreditación de Mineduc y el tramo de ingreso del SIES también son fuentes de la ficha, aunque no sean indicadores.
  const origenes: Fuente[] = [
    ...carrera.indicadores,
    ...(carrera.requisito_admision ? [carrera.requisito_admision] : []),
    ...(carrera.institucion.acreditacion ? [carrera.institucion.acreditacion] : []),
    ...(carrera.ingreso_tramo?.tramo ? [carrera.ingreso_tramo] : []),
  ];
  const fuentes = origenes.reduce<Fuente[]>((acumuladas, item) => {
    if (!acumuladas.some((fuente) => fuente.url === item.url)) acumuladas.push(item);
    return acumuladas;
  }, []);

  return (
    <section className={estilos.fuentes} aria-labelledby="fuentes">
      <h2 id="fuentes">¿De dónde salen estos datos?</h2>
      <ul>
        {fuentes.map((fuente) => (
          <li key={fuente.url}>
            <a href={fuente.url}>{nombreDeFuente(fuente.fuente)}</a> · Consultada el {fechaLarga(fuente.fecha_consulta)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const carrera = await encontrarCarrera(await params);
  if (!carrera) return {};
  return {
    title: `${carrera.carrera} en ${carrera.institucion.nombre}`,
    description: `Datos oficiales de ${carrera.carrera} en ${carrera.institucion.nombre}, sede ${carrera.sede}.`,
  };
}

export default async function PaginaCarrera({ params }: { params: Promise<Params> }) {
  const carrera = await encontrarCarrera(await params);
  if (!carrera) notFound();

  const empleabilidad = indicador(carrera, 'empleabilidad_1er_anio');
  const retencion = indicador(carrera, 'retencion_1er_anio');
  const continuidad = indicador(carrera, 'continuidad_estudios');
  const duracionFormal = indicador(carrera, 'duracion_formal_semestres');
  // Una carrera sin código DEMRE no se postula por el sistema de admisión centralizado: se dice, en vez de dejar un hueco.
  const fueraDelSistema = carrera.admision_centralizada === false;
  const sinSistema = (dato: string) => fueraDelSistema
    ? `Esta carrera no entra por el sistema de admisión centralizado, el de la Prueba de Acceso a la Educación Superior (PAES): se ingresa directamente en la institución. Por eso no tiene ${dato}.`
    : undefined;
  const sinSies = 'Mi Futuro no publica este dato para esta carrera, o no pudimos asociarla con seguridad a sus cifras.';
  const arancel = indicador(carrera, 'arancel_anual');
  const matriculaInscripcion = indicador(carrera, 'matricula_inscripcion');
  const costo = costoPrimerAnio(carrera);
  const duracionReal = indicador(carrera, 'duracion_real_semestres');
  const vacantes = indicador(carrera, 'vacantes');
  const matricula = indicador(carrera, 'matricula');
  const nombreCarrera = textoParaLectura(carrera.carrera);

  // TODO(fuente): la duración formal (campo duracion_semestres) no se muestra: el dato no registra fuente ni período
  // y AGENTS.md 2.1 prohíbe publicar lo que no se puede verificar. Vuelve cuando C3 documente su origen.
  return (
    <div className={estilos.ficha} data-pagina-interior>
      <CabeceraInterior pagina="ficha" titulo={nombreCarrera}>
        <p className={estilos.institucion}>{carrera.institucion.nombre}</p>
        <p className={estilos.ubicacion}>{carrera.sede} · {carrera.comuna} · Región: {carrera.region}</p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina">
        <div className={estilos.contenido}>

          <section className={estilos.seccion} aria-labelledby="datos-principales">
            <h2 id="datos-principales">Datos para comparar</h2>
            <div className={estilos.datos}>
              <DatoOficial titulo="Empleabilidad al 1.er año" queMide="Porcentaje de personas tituladas que ganaron al menos el sueldo mínimo durante el primer año después de titularse. Solo considera a quienes registran ingresos." indicador={empleabilidad} valor={empleabilidad?.valor === null || !empleabilidad ? undefined : formatoNumero(empleabilidad.valor, empleabilidad.unidad)} motivo={sinSies} />
              <IngresoTramo ingreso={carrera.ingreso_tramo} />
              <DatoOficial titulo="Retención de primer año" queMide="Porcentaje de estudiantes de primer año que siguen matriculados al año siguiente." indicador={retencion} valor={valorTexto(retencion)} motivo={sinSies} />
              <DatoOficial titulo="Continuidad de estudios" queMide="Porcentaje de personas tituladas que se matriculan al año siguiente de titularse." indicador={continuidad} valor={valorTexto(continuidad)} motivo={sinSies} />
              <DatoOficial titulo="Costo del arancel anual" queMide="Precio de un año de la carrera, antes de aplicar beneficios." indicador={arancel} valor={arancel?.valor === null || !arancel ? undefined : formatoNumero(arancel.valor, arancel.unidad)} />
              <DatoOficial titulo="Costo de matrícula" queMide="Valor en pesos que se paga para hacer efectiva la matrícula, aparte del arancel anual." indicador={matriculaInscripcion} valor={valorTexto(matriculaInscripcion)} />
              <DatoOficial titulo="Costo del primer año" queMide={`Arancel anual más costo de matrícula, antes de aplicar beneficios. ${COMO_SE_CALCULA}`} indicador={costo.total === null ? undefined : costo.arancel} valor={costo.total === null ? undefined : formatoNumero(costo.total, 'pesos')} motivo={costo.total === null ? costo.motivo : undefined} />
              <Duracion formal={duracionFormal} real={duracionReal} />
              <DatoOficial titulo="Vacantes" queMide="Cupos disponibles para postular" indicador={vacantes} valor={vacantes?.valor === null || !vacantes ? undefined : formatoNumero(vacantes.valor, vacantes.unidad)} motivo={sinSistema('vacantes publicadas ahí. Consulta los cupos en la institución')} />
              <Acreditacion acreditacion={carrera.institucion.acreditacion} tipo={carrera.institucion.tipo} hoy={hoyEnChile()} />
              <DatoOficial titulo="Puntaje de corte del año anterior" queMide="Puntaje ponderado de la última persona seleccionada por la vía regular. Elaboración propia con Datos abiertos DEMRE 2026." indicador={indicador(carrera, 'puntaje_corte')} valor={valorTexto(indicador(carrera, 'puntaje_corte'))} motivo={sinSistema('puntaje de corte') ?? 'El DEMRE solo publica datos de las carreras que se postulan por su sistema de admisión.'} />
              <Ponderaciones requisito={carrera.requisito_admision} sinSistema={sinSistema('ponderaciones')} />
            </div>
          </section>

          <section className={estilos.seccion} aria-labelledby="matricula">
            <h2 id="matricula">Cuántas personas estudian aquí</h2>
            <div className={estilos.datos}>
              <DatoOficial titulo="Matrícula total" queMide="Personas matriculadas en esta carrera, sumando todos sus años." indicador={matricula} valor={valorTexto(matricula)} />
            </div>
          </section>

          <section className={estilos.acciones} aria-label="Próximas acciones">
            <Boton variante="principal" href={rutaDelComparador([carrera])}>Comparar con otra carrera</Boton>
            <Boton variante="secundario" href={`/simulador?carrera=${encodeURIComponent(carrera.codigo_sies)}`}>Simular mi puntaje para esta carrera</Boton>
          </section>

          <Fuentes carrera={carrera} />
        </div>
      </main>
    </div>
  );
}
