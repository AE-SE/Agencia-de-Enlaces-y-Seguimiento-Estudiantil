import type { Metadata } from 'next';
import Link from 'next/link';

import { CabeceraInterior } from '@/app/_componentes/CabeceraInterior';
import { Enlace } from '@/app/_componentes/Enlace';

import datos from '@/lib/datos/ocupaciones-generadas.json';
import {
  AREAS_INTERES,
  MAX_AREAS,
  areasDesdeUrl,
  rankear,
  type AreaInteres,
  type Ocupacion,
} from '@/lib/calculos/ocupaciones';

import styles from './ocupaciones.module.css';

export const metadata: Metadata = {
  title: 'Ocupaciones afines a tus intereses',
  description:
    'Elige hasta tres áreas que te gusten y mira ocupaciones cuyas actividades se parecen a ellas. No es un test ni un diagnóstico.',
};

// Texto de cada área: redactado por la agencia (elaboración propia), no es una cita de O*NET.
const TEXTO_AREA: Record<AreaInteres, string> = {
  realista: 'Realista: trabajar con herramientas, máquinas o la naturaleza',
  investigador: 'Investigador: investigar, analizar datos y resolver problemas',
  artistico: 'Artístico: crear, diseñar y expresar tus ideas',
  social: 'Social: ayudar, enseñar o cuidar a otras personas',
  emprendedor: 'Emprendedor: liderar proyectos, convencer y tomar decisiones',
  convencional: 'Convencional: ordenar información y trabajar con registros o procedimientos',
};

const OCUPACIONES = datos.ocupaciones as Ocupacion[];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function valor(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v.join(',') : v) ?? '';
}

export default async function PaginaOcupaciones({ searchParams }: Props) {
  const params = await searchParams;
  const pedidas = valor(params.areas).split(',').filter(Boolean);
  const areas = areasDesdeUrl(valor(params.areas));
  const demasiadas = new Set(pedidas.filter((a) => (AREAS_INTERES as readonly string[]).includes(a))).size > MAX_AREAS;
  const resultados = rankear(OCUPACIONES, areas);

  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina="ocupaciones" titulo="Ocupaciones afines a tus intereses">
        <p>
          Elige hasta tres áreas que te gusten. Te mostramos ocupaciones cuyas actividades se parecen a ellas.
          <strong> Esto no es un test ni un diagnóstico.</strong> Solo ordena información; no dice qué deberías estudiar.
        </p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina" className={styles.pagina}>

        <form method="get" action="/ocupaciones" className={styles.formulario}>
          <fieldset className={styles.grupo}>
            <legend>¿Qué áreas te gustan? (elige hasta tres)</legend>
            {AREAS_INTERES.map((area) => (
              <label key={area} className={styles.opcion}>
                <input
                  type="checkbox"
                  name="areas"
                  value={area}
                  defaultChecked={areas.includes(area)}
                />
                <span>{TEXTO_AREA[area]}</span>
              </label>
            ))}
          </fieldset>
          <button type="submit" className={styles.accion}>Ver ocupaciones afines</button>
        </form>

        {demasiadas && (
          <p role="status" className={styles.aviso}>
            Elegiste más de tres áreas. Te mostramos solo las tres primeras.
          </p>
        )}

        {areas.length === 0 && (
          <p className={styles.sinDato}>Elige al menos un área para ver resultados.</p>
        )}

        {areas.length > 0 && (
          <section aria-labelledby="resultados">
            <h2 id="resultados">Ocupaciones más cercanas a tus áreas</h2>
            <ol className={styles.lista}>
              {resultados.map((o) => (
                <li key={o.codigo} className={styles.ocupacion}>
                  <h3>{o.titulo}</h3>
                  <p>
                    Área de carreras relacionada: <strong>{o.area}</strong>.
                  </p>
                  <p className={styles.dato}>
                    {o.carreras_en_area > 0
                      ? `Hay ${o.carreras_en_area.toLocaleString('es-CL')} ${o.carreras_en_area === 1 ? 'carrera distinta' : 'carreras distintas'} de esta área en Chile (elaboración propia: nombres oficiales distintos, sin contar cada sede).`
                      : 'No encontramos carreras de esta área en el catálogo.'}
                  </p>
                </li>
              ))}
            </ol>
            <p>
              <Link href="/carreras" className={styles.enlace}>Buscar carreras en el explorador</Link>
            </p>
          </section>
        )}

        <aside className={styles.fuente} aria-label="Fuentes">
          <p>
            Ocupaciones y su perfil: <Enlace href="https://www.onetcenter.org/">O*NET 31.0</Enlace>, del Departamento de Trabajo
            de Estados Unidos (USDOL/ETA), con datos de O*NET bajo licencia CC BY 4.0. Descargados el 14 de noviembre
            de 2026. Títulos en español: traducción oficial de O*NET.
          </p>
          <p>
            Las descripciones de las áreas y el cruce con carreras chilenas son elaboración propia. Asignamos cada
            ocupación a un área con reglas por grupo ocupacional y algunas excepciones documentadas. No hay una revisión
            manual completa de todas las ocupaciones. Usamos como referencia las áreas del catálogo oficial del Servicio
            de Información de Educación Superior (SIES), consultado el 14 de noviembre de 2026.{' '}
            <Enlace href="https://www.mifuturo.cl/buscador-de-carreras/">Ver catálogo del SIES</Enlace>. El SIES no publica este
            cruce y puede no coincidir con tu caso.
          </p>
        </aside>
      </main>
    </div>
  );
}
