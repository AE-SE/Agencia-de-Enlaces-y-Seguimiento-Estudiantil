import type { ComparacionEmpleabilidad as Comparacion } from '@/lib/datos/comparaciones';
import { fechaLarga } from '@/lib/datos/fechas';

import { Enlace } from '@/app/_componentes/Enlace';
import estilosDato from '@/app/_componentes/DatoOficial.module.css';
import estilos from './ComparacionEmpleabilidad.module.css';

const TITULO = 'Cómo se compara su empleabilidad';
const ID_TITULO = 'comparacion-empleabilidad-titulo';

// Una cifra decimal y coma, como el resto de la ficha. «data-cifra» activa la fuente de cifras.
const porcentaje = (valor: number) => `${new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(valor)} %`;
const Cifra = ({ valor }: { valor: number }) => <span className={estilos.cifra} data-cifra>{porcentaje(valor)}</span>;
const instituciones = (n: number) => (n === 1 ? '1 institución' : `${n} instituciones`);

// Solo texto con cifras: no ordena, no destaca ni nombra otras instituciones. Son cifras calculadas por nosotros
// con tasas que el SIES publica por institución (AGENTS.md 2.1), por eso llevan «Elaboración propia» y su método.
export function ComparacionEmpleabilidad({ comparacion }: { comparacion: Comparacion | null }) {
  if (!comparacion) return null;
  const { otras, area, motivo } = comparacion;

  return (
    <article className={estilosDato.dato} data-reveal="tarjeta" data-panel aria-labelledby={ID_TITULO}>
      <h3 id={ID_TITULO}>{TITULO}</h3>
      {otras ? (
        <p>
          En otras {otras.instituciones} instituciones que imparten esta carrera, la empleabilidad al 1.er año va de <Cifra valor={otras.minimo} /> a{' '}
          <Cifra valor={otras.maximo} />. La mediana es <Cifra valor={otras.mediana} />: la mitad de esas instituciones está sobre esa cifra y la otra mitad bajo ella.
        </p>
      ) : <p>{motivo}</p>}
      {area ? (
        <p>
          En el área {area.nombre} del SIES, el promedio es <Cifra valor={area.promedio} /> ({instituciones(area.instituciones)}). Es un promedio simple de las tasas que el SIES publica para cada carrera en cada institución.
        </p>
      ) : null}
      <p>Mide la empleabilidad al 1.er año: personas tituladas que ganaron al menos el sueldo mínimo el primer año. {comparacion.periodo}.</p>
      <p><strong>Elaboración propia.</strong> {comparacion.metodo_carrera}{area ? ` ${comparacion.metodo_area}` : ''}</p>
      <p>
        Fuente de las tasas:{' '}
        <Enlace href={comparacion.url} aria-label={`Fuente de ${TITULO}: ${comparacion.fuente}`}>{comparacion.fuente}</Enlace>
        {' '}· Descargada el {fechaLarga(comparacion.fecha_descarga)}
      </p>
    </article>
  );
}
