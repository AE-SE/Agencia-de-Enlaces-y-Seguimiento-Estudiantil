import type { Metadata } from 'next';
import Link from 'next/link';

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
  realista: 'Realista: trabajar con las manos, máquinas, herramientas o la naturaleza',
  investigador: 'Investigador: entender cómo funcionan las cosas, analizar datos y resolver problemas',
  artistico: 'Artístico: crear, diseñar y expresarte con ideas propias',
  social: 'Social: ayudar, enseñar y cuidar a otras personas',
  emprendedor: 'Emprendedor: liderar, convencer y tomar decisiones',
  convencional: 'Convencional: ordenar información, llevar registros y seguir procedimientos',
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
    <main id="contenido" className={styles.pagina}>
      <h1>Ocupaciones afines a tus intereses</h1>
      <p>
        Elige hasta tres áreas que te gusten. Te mostramos ocupaciones cuyas actividades se parecen a ellas.
        <strong> Esto no es un test ni un diagnóstico.</strong> Solo ordena información; no dice qué deberías estudiar.
      </p>

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
          Ocupaciones y su perfil: O*NET 31.0, del Departamento de Trabajo de Estados Unidos (USDOL/ETA), con datos
          de O*NET bajo licencia CC BY 4.0. Descargados el 14 de noviembre de 2026. Títulos en español: traducción
          oficial de O*NET.
        </p>
        <p>
          Las descripciones de las áreas y la relación con las carreras chilenas son elaboración propia, por grupo
          de ocupación. Pueden no coincidir con tu caso.
        </p>
      </aside>
    </main>
  );
}
