import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';

import { JORNADAS, REGIONES, TIPOS, type FiltrosBusqueda } from '@/lib/datos/consultas';
import type { TipoInstitucion } from '@/lib/datos/tipos';

import estilos from './FiltrosCarreras.module.css';

// Bloque de filtros compartido por el explorador y el comparador. Va dentro de un formulario GET
// del llamador (funciona sin JavaScript): los campos son region, tipo y jornada.
type Props = {
  filtros: FiltrosBusqueda;
  // Destino de «Quitar filtros»: cada página decide qué conserva (por ejemplo, las carreras elegidas).
  quitarHref: string;
};

const nombresTipo: Record<TipoInstitucion, string> = {
  universidad: 'Universidad',
  instituto_profesional: 'Instituto profesional (IP): carreras profesionales y técnicas, sin licenciatura',
  centro_formacion_tecnica: 'Centro de formación técnica (CFT): carreras técnicas de nivel superior',
};

export function FiltrosCarreras({ filtros, quitarHref }: Props) {
  const filtrosActivos = filtros.regiones.length + filtros.tipos.length + filtros.jornadas.length;
  const hayFiltros = Boolean(filtros.texto || filtrosActivos);

  return (
    <details className={estilos.filtros}>
      <summary>
        <SlidersHorizontal aria-hidden="true" /> Filtros{filtrosActivos ? ` (${filtrosActivos} activos)` : ''}
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
          <button className={estilos.aplicar} type="submit">Aplicar filtros</button>
          {hayFiltros ? <Link className={estilos.quitar} href={quitarHref}>Quitar filtros</Link> : null}
        </div>
      </div>
    </details>
  );
}
