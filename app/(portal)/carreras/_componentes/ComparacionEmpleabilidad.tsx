import type { ComparacionEmpleabilidad as Comparacion } from '@/lib/datos/comparaciones';
import { fechaLarga, periodoLegible } from '@/lib/datos/fechas';

import { Enlace } from '@/app/_componentes/Enlace';
import estilosDato from '@/app/_componentes/DatoOficial.module.css';
import estilos from './ComparacionEmpleabilidad.module.css';

const TITULO = 'Cómo se compara su empleabilidad';
const ID_TITULO = 'comparacion-empleabilidad-titulo';

// Hasta dos decimales y coma, igual que la cifra propia de la ficha (85,53 %): la medición compara cifras contra la
// clave de pares, y dos redondeos distintos en la misma tarjeta confundirían. «data-cifra» activa la fuente de cifras.
const porcentaje = (valor: number) => `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor)} %`;
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
      {/* Contenedor propio: a 360 px la ficha achica el primer párrafo tras el título (pensado para el valor de cada
          tarjeta, FichaCarrera.module.css). Aquí todo es texto corrido y debe verse del mismo tamaño. */}
      <div className={estilos.cuerpo}>
      {otras ? (
        <p>
          En otras {otras.instituciones} instituciones que imparten esta carrera, la empleabilidad al 1.er año va de <Cifra valor={otras.minimo} /> a{' '}
          <Cifra valor={otras.maximo} />. La mediana es <Cifra valor={otras.mediana} />: la mitad de esas instituciones tiene esa cifra o más, y la otra mitad, esa cifra o menos.
        </p>
      ) : <p>{motivo}</p>}
      {area ? (
        <p>
          En el área {area.nombre} del SIES, que reúne carreras parecidas, el promedio es <Cifra valor={area.promedio} /> ({instituciones(area.instituciones)}).
        </p>
      ) : null}
      {/* Sin ninguna cifra calculada (Derecho, o sin datos suficientes ni área) solo va el motivo y la fuente: decir
          «1.er año» y «elaboración propia» junto al motivo de Derecho, que habla del 2.º año, se contradiría. */}
      {otras || area ? (
        <>
          <p>Mide la empleabilidad al 1.er año: personas tituladas que ganaron al menos el sueldo mínimo el primer año. Período: {periodoLegible(comparacion.periodo)}.</p>
          {/* El método va en palabras simples; el texto técnico (metodo_carrera, metodo_area) queda en el JSON y en docs/datos/diccionario.md. */}
          <p>
            <strong>Elaboración propia.</strong> El SIES publica una tasa por carrera en cada institución, pero no estas comparaciones: las calculamos nosotros con esas tasas.
            {otras ? ' El mínimo, la mediana y el máximo usan la tasa de esta carrera en cada una de las otras instituciones.' : ''}
            {area ? ' El promedio del área suma las tasas de todas sus carreras en todas las instituciones y las divide por cuántas son, sin ponderar por número de personas.' : ''}
          </p>
        </>
      ) : null}
      <p>
        Fuente de las tasas:{' '}
        <Enlace href={comparacion.url} aria-label={`Fuente de ${TITULO}: ${comparacion.fuente}`}>{comparacion.fuente}</Enlace>
        {' '}· Descargada el {fechaLarga(comparacion.fecha_descarga)}
      </p>
      </div>
    </article>
  );
}
