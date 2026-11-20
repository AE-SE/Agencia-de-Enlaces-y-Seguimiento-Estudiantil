'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';

import { Boton } from '@/app/_componentes/Boton';
import { CabeceraInterior } from '@/app/_componentes/CabeceraInterior';
import type { Carrera } from '@/lib/datos/carreras';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import { nombreCompleto, textoDeLaHoja, type Anotaciones } from '@/lib/datos/hoja';
import { datoDeFila, filasDelGrupo, GRUPOS_DE_FILAS } from '@/lib/datos/indicadores-vista';
import { textoParaLectura } from '@/lib/datos/texto';

import { hoyEnChile } from '../beneficios/beneficios';
import estilos from './hoja.module.css';

type Props = {
  opciones: Carrera[];
  respaldo: Carrera | null;
  resultados: { carrera: Carrera; href: string }[];
  q: string;
  codigosActuales: string;
  quitarRespaldoHref: string;
  volverAComparar: string;
  error?: boolean;
};

// Las anotaciones viven solo en la pestaña (sessionStorage): se cierran con ella y no viajan a ningún servidor.
// Si el navegador no deja usar sessionStorage, se conservan en memoria mientras la página siga abierta.
const CLAVE = 'hoja-de-decision-v1';
const VACIAS: Anotaciones = { influencia: '', pregunta: '' };
const LIMITE = 600;

let memoria = '';
const oyentes = new Set<() => void>();

function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => { oyentes.delete(oyente); };
}

function leerCrudo(): string {
  try {
    const guardado = window.sessionStorage.getItem(CLAVE);
    if (guardado !== null) return guardado;
  } catch {
    /* sin almacenamiento: se usa la memoria */
  }
  return memoria;
}

function escribirCrudo(valor: string): void {
  memoria = valor;
  try {
    if (valor) window.sessionStorage.setItem(CLAVE, valor);
    else window.sessionStorage.removeItem(CLAVE);
  } catch {
    /* la hoja funciona igual con la memoria */
  }
  oyentes.forEach((oyente) => oyente());
}

function leerAnotaciones(crudo: string): Anotaciones {
  try {
    const guardado = JSON.parse(crudo || 'null') as Partial<Anotaciones> | null;
    return { influencia: String(guardado?.influencia ?? '').slice(0, LIMITE), pregunta: String(guardado?.pregunta ?? '').slice(0, LIMITE) };
  } catch {
    return VACIAS;
  }
}

function nombreParaLectura(carrera: Carrera): string {
  return textoParaLectura(nombreCompleto(carrera)).replaceAll(' · ', '\u00a0· ');
}

function valorVisible(valor: string, esMonto: boolean, clave: string) {
  if (!esMonto) return valor;
  return valor.split(/(?=\.)/u).map((grupo, indice) => <span className={estilos.grupoCifra} key={`${clave}-${indice}`}>{grupo}</span>);
}

function BloqueDeCarrera({ etiqueta, carrera }: { etiqueta: string; carrera: Carrera }) {
  return (
    <article className={estilos.opcion} aria-labelledby={`opcion-${carrera.codigo_sies}`}>
      <h2 id={`opcion-${carrera.codigo_sies}`}>
        <span className={estilos.etiqueta}>{etiqueta}</span>{' '}
        <span className={estilos.nombreCarrera}>{nombreParaLectura(carrera)}</span>
      </h2>
      {GRUPOS_DE_FILAS.map((grupo) => (
        <section key={grupo.id} className={estilos.grupo} aria-labelledby={`grupo-${carrera.codigo_sies}-${grupo.id}`}>
          <h3 id={`grupo-${carrera.codigo_sies}-${grupo.id}`} className={estilos.tituloDeGrupo}>{grupo.titulo}</h3>
          <dl className={estilos.datos}>
            {filasDelGrupo(grupo).map((fila) => {
              const dato = datoDeFila(carrera, fila, true);
              const sinDato = dato.texto === null;
              return (
                <div key={fila.tipo} className={estilos.dato}>
                  <dt>{fila.titulo}</dt>
                  <dd className={sinDato ? estilos.sinDato : estilos.valor}>{sinDato ? 'Sin datos suficientes' : valorVisible(dato.texto!, fila.unidad === 'pesos chilenos', `${carrera.codigo_sies}-${fila.tipo}`)}</dd>
                  <dd className={estilos.nota}>{fila.queMide}</dd>
                  {sinDato ? (
                    <dd className={estilos.nota}>{dato.motivo}</dd>
                  ) : (
                    <dd className={estilos.nota}>
                      Período: {dato.periodo}. Fuente: <a href={dato.url}>{nombreDeFuente(dato.fuente)}</a>. Consultada el {fechaLarga(dato.fecha_consulta)}.
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </article>
  );
}

export function Hoja({ opciones, respaldo, resultados, q, codigosActuales, quitarRespaldoHref, volverAComparar, error }: Props) {
  const crudo = useSyncExternalStore(suscribir, leerCrudo, () => '');
  const anotaciones = useMemo(() => leerAnotaciones(crudo), [crudo]);
  const [aviso, setAviso] = useState('');

  function cambiar(campo: keyof Anotaciones, valor: string) {
    escribirCrudo(JSON.stringify({ ...anotaciones, [campo]: valor.slice(0, LIMITE) }));
    setAviso('');
  }

  function borrar() {
    escribirCrudo('');
    setAviso('Borramos tus anotaciones de este navegador.');
  }

  function descargar() {
    const texto = textoDeLaHoja({ opciones, respaldo, anotaciones, fecha: hoyEnChile() });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
    enlace.download = 'mi-hoja-de-decision.txt';
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina="hoja" titulo="Mi hoja de decisión">
        <p>Reúne tus tres opciones y una de respaldo para decidir con calma. Tú eliges el orden: esta página no ordena ni recomienda carreras ni instituciones.</p>
        <p>Tus anotaciones quedan solo en este navegador mientras la pestaña esté abierta. No las guardamos en ningún servidor. Si usas un computador compartido, imprime o descarga tu hoja y luego borra tus anotaciones.</p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina" className={estilos.hoja}>

        {error ? <p role="alert">No pudimos cargar las carreras en este momento. Intenta de nuevo en unos minutos.</p> : null}

        {opciones.length === 0 && !error ? (
          <section className={estilos.vacia}>
            <h2>Todavía no elegiste carreras</h2>
            <p>Compara hasta tres carreras y vuelve aquí con el botón «Usar estas carreras en mi hoja».</p>
            <Link className={estilos.enlaceBoton} href="/comparador">Ir al comparador</Link>
          </section>
        ) : null}

        {opciones.map((carrera, i) => <BloqueDeCarrera key={carrera.codigo_sies} etiqueta={`Opción ${i + 1}`} carrera={carrera} />)}

        {opciones.length ? (
          respaldo ? (
            <>
              <BloqueDeCarrera etiqueta="Respaldo" carrera={respaldo} />
              <p className={estilos.noImprimir}><Link className={estilos.enlaceSuelto} href={quitarRespaldoHref}>Quitar el respaldo</Link></p>
            </>
          ) : (
            <section className={`${estilos.respaldo} ${estilos.noImprimir}`} aria-labelledby="busca-respaldo">
              <h2 id="busca-respaldo">Elige una carrera de respaldo</h2>
              <p>Es la opción a la que podrías recurrir si las tres anteriores no resultan.</p>
              <form method="get" action="/hoja" className={estilos.buscar}>
                <input type="hidden" name="carreras" value={codigosActuales} />
                <label htmlFor="buscar-respaldo">Busca una carrera</label>
                <div className={estilos.entrada}>
                  <input id="buscar-respaldo" name="q" defaultValue={q} />
                  <button type="submit">Buscar</button>
                </div>
              </form>
              {q ? (
                resultados.length ? (
                  <ul aria-label="Resultados para el respaldo">
                    {resultados.map(({ carrera, href }) => (
                      <li key={carrera.codigo_sies}><Link href={href}>Elegir como respaldo: {nombreParaLectura(carrera)}</Link></li>
                    ))}
                  </ul>
                ) : <p>No encontramos carreras con «{q}». Prueba con otra palabra.</p>
              ) : null}
            </section>
          )
        ) : null}

        {opciones.length ? (
          <>
            <section className={estilos.anotaciones} aria-labelledby="anota">
              <h2 id="anota">Anota tus ideas</h2>
              <div className={estilos.campo}>
                <label htmlFor="influencia">¿Qué dato influyó más en tu primera opción?</label>
                <p id="influencia-ayuda">Por ejemplo: el arancel, el puntaje de corte o la jornada. Escríbelo con tus palabras.</p>
                <textarea id="influencia" rows={4} maxLength={LIMITE} value={anotaciones.influencia} onChange={(e) => cambiar('influencia', e.target.value)} aria-describedby="influencia-ayuda" />
                <p className={estilos.soloImprimir}>{anotaciones.influencia.trim() || '(sin anotar)'}</p>
              </div>
              <div className={estilos.campo}>
                <label htmlFor="pregunta">¿Qué pregunta te falta resolver?</label>
                <p id="pregunta-ayuda">Puede ser algo que preguntarías a la institución o a tu orientador.</p>
                <textarea id="pregunta" rows={3} maxLength={LIMITE} value={anotaciones.pregunta} onChange={(e) => cambiar('pregunta', e.target.value)} aria-describedby="pregunta-ayuda" />
                <p className={estilos.soloImprimir}>{anotaciones.pregunta.trim() || '(sin anotar)'}</p>
              </div>
            </section>

            <section className={`${estilos.acciones} ${estilos.noImprimir}`} aria-label="Qué puedes hacer con tu hoja">
              <Boton onClick={() => window.print()}>Imprimir o guardar como PDF</Boton>
              <Boton variante="secundario" onClick={descargar}>Descargar como texto</Boton>
              <Boton variante="secundario" onClick={borrar}>Borrar mis anotaciones</Boton>
              <Link className={estilos.enlaceBoton} href={volverAComparar}>Volver a comparar</Link>
              <Link className={estilos.enlaceBoton} href="/beneficios#calendario-plazos">Revisar mis plazos de becas y gratuidad (FUAS)</Link>
              <p role="status">{aviso}</p>
            </section>

            <p className={estilos.pieImpreso}>Hoja generada con datos oficiales del portal. Cada cifra indica su fuente y la fecha en que se consultó; los datos pueden cambiar.</p>
          </>
        ) : null}
      </main>
    </div>
  );
}
