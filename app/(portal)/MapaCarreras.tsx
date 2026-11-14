'use client';

import { useMemo, useState } from 'react';

import { Enlace } from '@/app/_componentes/Enlace';
import datosJson from '@/lib/datos/mapa/carreras-regiones.json';
import regionesJson from '@/lib/datos/mapa/regiones.json';
import {
  buscarCarreras,
  categoriaZona,
  nombreRegion,
  nombresCarreras,
  radioZona,
  textosZona,
  type DatosMapa,
  type FilaRegion,
} from '@/lib/datos/mapa-carreras';

import estilos from './MapaCarreras.module.css';

const datos = datosJson as DatosMapa;
const mapa = regionesJson as { viewBox: string; regiones: { codigo: string; nombre: string; d: string; cx: number; cy: number }[] };
const CARRERAS = nombresCarreras(datos);
const CARRERA_INICIAL = CARRERAS.includes('Enfermería') ? 'Enfermería' : CARRERAS[0];

const SIN_FILA = (codigo: string): FilaRegion => ({
  codigo_region: codigo,
  entradas: null,
  entradas_estado: 'menos_de_10',
  empleabilidad_pct: null,
  cobertura_empleabilidad_pct: null,
  cruce: 'sin_cifra',
});

const LEYENDA_CATEGORIA = {
  sobre: 'Igual o más empleo que la mayoría de las regiones.',
  bajo: 'Menos empleo que la mayoría de las regiones (línea punteada).',
  sin_dato: 'Menos de 10 estudiantes nuevos o sin datos: no mostramos la cifra.',
} as const;

export function MapaCarreras() {
  const [carrera, setCarrera] = useState<string>(CARRERA_INICIAL);
  const [busqueda, setBusqueda] = useState<string>('');
  const [region, setRegion] = useState<string | null>(null);

  const resultados = useMemo(() => buscarCarreras(CARRERAS, busqueda), [busqueda]);
  const bloque = datos.carreras[carrera];
  const filas = useMemo(() => {
    const porCodigo = new Map(bloque.regiones.map((f) => [f.codigo_region, f]));
    return mapa.regiones.map((r) => ({ region: r, fila: porCodigo.get(r.codigo) as FilaRegion | undefined }));
  }, [bloque]);

  const maximo = Math.max(0, ...bloque.regiones.map((f) => f.entradas ?? 0));
  const seleccionada = filas.find((x) => x.region.codigo === region);

  return (
    <section className={estilos.seccion} aria-labelledby="mapa-carreras-titulo">
      <h2 id="mapa-carreras-titulo" className="text-titulo">Dónde estudian y dónde hay empleo</h2>
      <p>
        Elige una carrera. Cada círculo es una región: más grande, más estudiantes nuevos en 2026. Solo muestra datos:
        no ordena ni recomienda carreras ni lugares.
      </p>

      <div className={estilos.controles}>
        <div className={estilos.campo}>
          <label htmlFor="buscar-carrera">Busca tu carrera</label>
          <p id="ayuda-buscar" className={estilos.ayuda}>
            Escribe una parte del nombre, por ejemplo «enferm» o «ingenie». No importan las tildes ni las mayúsculas.
          </p>
          <input
            id="buscar-carrera"
            type="search"
            autoComplete="off"
            value={busqueda}
            aria-describedby="ayuda-buscar resultados-estado"
            aria-controls="resultados-carrera"
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && resultados.length > 0) {
                e.preventDefault();
                setCarrera(resultados[0]);
              }
            }}
          />
          <p id="resultados-estado" className={estilos.ayuda} aria-live="polite">
            {resultados.length === 0
              ? `No encontramos carreras con «${busqueda}». Prueba con una palabra más corta.`
              : `${resultados.length === 1 ? '1 carrera encontrada' : `${resultados.length} carreras encontradas`}${resultados.length === 12 ? ' (se muestran las primeras 12; escribe más para afinar)' : ''}.`}
          </p>
          <ul id="resultados-carrera" className={estilos.resultados} aria-label="Carreras encontradas">
            {resultados.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  className={estilos.opcion}
                  aria-pressed={c === carrera}
                  onClick={() => setCarrera(c)}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
          <p className={estilos.ayuda}>Carrera elegida: <strong>{carrera}</strong></p>
        </div>
        <p className={estilos.resumen}>
          Empleo de referencia de la carrera (la mitad de las regiones tiene más y la mitad, menos):{' '}
          <strong>{bloque.mediana_empleabilidad_regional_pct === null ? 'sin dato' : `${bloque.mediana_empleabilidad_regional_pct.toLocaleString('es-CL')} de cada 100`}</strong>
        </p>
      </div>

      <div className={estilos.mapa}>
        <svg viewBox={mapa.viewBox} role="img" aria-label={`Mapa de Chile por región para ${carrera}. La tabla de abajo tiene las mismas cifras.`}>
          {mapa.regiones.map((r) => {
            const fila = filas.find((x) => x.region.codigo === r.codigo)?.fila;
            const categoria = fila ? categoriaZona(fila, bloque.mediana_empleabilidad_regional_pct) : 'sin_dato';
            return (
              <path
                key={r.codigo}
                d={r.d}
                className={`${estilos.region} ${estilos[categoria]} ${region === r.codigo ? estilos.seleccionada : ''}`}
                onClick={() => setRegion(r.codigo)}
              />
            );
          })}
          {[...filas]
            .sort((x, y) => (y.fila?.entradas ?? 0) - (x.fila?.entradas ?? 0))
            .map(({ region: r, fila }) => {
            const radio = fila ? radioZona(fila.entradas, maximo) : null;
            if (!fila || radio === null) return null;
            const categoria = categoriaZona(fila, bloque.mediana_empleabilidad_regional_pct);
            return (
              <g key={r.codigo} transform={`translate(${r.cx} ${r.cy})`} aria-hidden="true">
                <circle r={radio} className={`${estilos.burbuja} ${categoria === 'bajo' ? estilos.burbujaBaja : ''}`} />
                <text className={estilos.etiqueta} y={4}>{fila.entradas}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={estilos.detalle} aria-live="polite">
        {seleccionada ? (
          <p>
            <strong>{nombreRegion(seleccionada.region.codigo)}:</strong>{' '}
            {textosZona(seleccionada.fila ?? SIN_FILA(seleccionada.region.codigo), bloque.mediana_empleabilidad_regional_pct).resumen}
          </p>
        ) : (
          <p>Toca una región en el mapa o en la tabla para ver su detalle.</p>
        )}
      </div>

      <ul className={estilos.leyenda}>
        <li><span className={`${estilos.muestra} ${estilos.muestraSobre}`} aria-hidden="true" />{LEYENDA_CATEGORIA.sobre}</li>
        <li><span className={`${estilos.muestra} ${estilos.muestraBajo}`} aria-hidden="true" />{LEYENDA_CATEGORIA.bajo}</li>
        <li><span className={`${estilos.muestra} ${estilos.muestraSinDato}`} aria-hidden="true" />{LEYENDA_CATEGORIA.sin_dato}</li>
      </ul>

      <div className={estilos.tablaCaja}>
        <table className={estilos.tabla}>
          <caption>Mismos datos que el mapa, en texto.</caption>
          <thead>
            <tr>
              <th scope="col">Región</th>
              <th scope="col">Estudiantes nuevos en 2026</th>
              <th scope="col">Empleo al primer año (de cada 100 titulados)</th>
            </tr>
          </thead>
          <tbody>
            {filas.map(({ region: r, fila }) => {
              const t = textosZona(fila ?? SIN_FILA(r.codigo), bloque.mediana_empleabilidad_regional_pct);
              return (
                <tr key={r.codigo} className={region === r.codigo ? estilos.filaSeleccionada : ''}>
                  <td>
                    <button type="button" className={estilos.botonFila} aria-pressed={region === r.codigo} onClick={() => setRegion(r.codigo)}>
                      {nombreRegion(r.codigo)}
                    </button>
                  </td>
                  <td>{t.entradas}</td>
                  <td>{t.empleo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={estilos.notas}>
        <p>
          <strong>Estudiantes nuevos:</strong> personas que empezaron primer año en 2026. Fuente:{' '}
          <Enlace href="https://www.mifuturo.cl/bases-de-datos-de-matriculados/">
            Servicio de Información de Educación Superior (SIES), matrícula histórica
          </Enlace>
          , consultada el 10 de noviembre de 2026. Las sumas por región son elaboración propia.
        </p>
        <p>
          <strong>Empleo al primer año:</strong> de cada 100 titulados de la carrera, cuántos tenían empleo al primer año. Fuente:{' '}
          <Enlace href={datos.fuente_empleabilidad.url}>{datos.fuente_empleabilidad.fuente}</Enlace> (SIES), periodo{' '}
          {datos.fuente_empleabilidad.periodo}, consultada el 5 de noviembre de 2026. La cifra por región es elaboración propia:
          promedio de las instituciones, ponderado por sus estudiantes nuevos.
        </p>
        <p>
          <strong>Regiones:</strong>{' '}
          <Enlace href="https://www.bcn.cl/siit/mapoteca/index.html">división regional de la Biblioteca del Congreso Nacional (BCN)</Enlace>
          , consultada el 14 de noviembre de 2026.
        </p>
      </div>
    </section>
  );
}
