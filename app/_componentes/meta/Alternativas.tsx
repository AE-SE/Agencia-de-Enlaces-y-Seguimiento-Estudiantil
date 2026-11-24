'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Aviso } from '@/app/_componentes/Aviso';
import { Boton } from '@/app/_componentes/Boton';
import { Enlace } from '@/app/_componentes/Enlace';
import { alternativasCercanas } from '@/lib/calculos/alternativas';
import { fechaLarga } from '@/lib/datos/fechas';
import { nombreDeFuente } from '@/lib/datos/fuentes';
import { FILAS_INDICADORES } from '@/lib/datos/indicadores-vista';
import { textoParaLectura } from '@/lib/datos/texto';
import type { Candidata, RespuestaAlternativas } from '@/lib/meta/alternativas';
import type { Preferencia } from '@/lib/meta/preferencias';

import estilos from './meta.module.css';

const QUE_MIDE_CORTE = FILAS_INDICADORES.find((f) => f.tipo === 'puntaje_corte')!.queMide;
const LIMITE = 5;
// Igual que la ficha (lib/datos/indicadores-vista.ts): coma decimal y hasta dos decimales.
const puntos = (valor: number | null) => (valor === null ? '' : new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor));

// `pedido` identifica la búsqueda a la que responde: si no coincide con la actual, se está buscando de nuevo.
type Respuesta = { pedido: string } & ({ tipo: 'error' } | { tipo: 'listo'; datos: RespuestaAlternativas });

function Tarjeta({ c, conCorte }: { c: Candidata; conCorte: boolean }) {
  return (
    <li className={estilos.item}>
      <p>
        <Link className={`${estilos.enlace} ${estilos.mayusculas}`} href={c.href} prefetch={false}>{textoParaLectura(c.carrera)}</Link>
      </p>
      <p className={estilos.mayusculas}>{textoParaLectura(c.institucion)}</p>
      <p><span className={estilos.mayusculas}>{textoParaLectura(c.sede)}</span> · Región: {c.region}</p>
      {conCorte ? <p>Puntaje de corte del año anterior: <span className={estilos.cifra}>{puntos(c.puntaje_corte)}</span> puntos</p> : null}
    </li>
  );
}

// Recibe la meta (primera de la lista) y los códigos de toda la lista, para no repetir lo que ya eligió.
// Al servidor solo viajan el área y la región; el corte y los códigos se comparan aquí, en el dispositivo.
export function Alternativas({ meta, codigos }: { meta: Preferencia; codigos: readonly string[] }) {
  const { area, region } = meta;
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [intento, setIntento] = useState(0);
  const titulo = useRef<HTMLHeadingElement>(null);
  const pedido = `${area}|${region}|${intento}`;
  const estado = respuesta?.pedido === pedido ? respuesta : null;

  useEffect(() => {
    if (!area) return;
    const control = new AbortController();
    fetch(`/api/alternativas?${new URLSearchParams({ area, region })}`, { signal: control.signal })
      .then((r) => (r.ok ? (r.json() as Promise<RespuestaAlternativas>) : Promise.reject(new Error('respuesta no válida'))))
      .then((datos) => setRespuesta({ pedido, tipo: 'listo', datos }))
      .catch((e: unknown) => {
        if (!(e instanceof DOMException && e.name === 'AbortError')) setRespuesta({ pedido, tipo: 'error' });
      });
    return () => control.abort();
  }, [area, region, pedido]);

  const clave = codigos.join('|');
  const resultado = useMemo(() => {
    if (estado?.tipo !== 'listo') return null;
    return alternativasCercanas(meta, estado.datos.carreras, { excluir: clave ? clave.split('|') : [], limite: LIMITE });
  }, [estado, meta, clave]);

  const corte = estado?.tipo === 'listo' ? estado.datos.corte : null;
  const hayCorte = meta.puntaje_corte !== null && meta.admision_centralizada !== false;
  const vacio = resultado !== null && resultado.conCorte.length === 0 && resultado.sinPuntajeCentralizado.length === 0;

  return (
    <section className={estilos.bloque} aria-labelledby="titulo-alternativas">
      <h2 id="titulo-alternativas" tabIndex={-1} ref={titulo}>Alternativas cercanas a tu meta</h2>
      {!area ? (
        <p>El Servicio de Información de Educación Superior (SIES) no tiene un área para tu meta, así que no podemos sugerir carreras cercanas.</p>
      ) : (
        <>
          <p>
            Buscamos carreras de la misma área del Servicio de Información de Educación Superior (SIES), {area}, y de la misma región ({region}).{' '}
            {hayCorte ? (
              // La cifra solo aparece cuando ya llegó su fuente, que va en el párrafo siguiente (AGENTS.md 2.1).
              <>El año anterior pidieron un puntaje igual o menor que el de tu meta{corte ? <> (<span className={estilos.cifra}>{puntos(meta.puntaje_corte)}</span> puntos)</> : null}. Eso no asegura que te alcance: el corte cambia cada año y cada carrera pondera las pruebas de forma distinta.</>
            ) : meta.admision_centralizada === false ? (
              <>Tu meta no se postula por el sistema centralizado, así que no tiene puntaje de corte para comparar. Te mostramos solo las carreras que tampoco lo usan.</>
            ) : (
              <>No tenemos el puntaje de corte de tu meta, así que no podemos compararlo. Te mostramos solo las carreras que no usan el sistema centralizado.</>
            )}
          </p>
          {hayCorte && corte ? (
            <p>
              {QUE_MIDE_CORTE} Período: {corte.periodo}. Fuente: <Enlace href={corte.url}>{nombreDeFuente(corte.fuente)}</Enlace>. Consultado el <time dateTime={corte.fecha_consulta}>{fechaLarga(corte.fecha_consulta)}</time>.
            </p>
          ) : null}
          <p role="status">{estado === null ? 'Buscando alternativas…' : ''}</p>
          {estado?.tipo === 'error' ? (
            <Aviso tipo="error" titulo="no pudimos buscar alternativas" anunciar>
              <p>Puede ser un problema pasajero. Tu meta sigue guardada.</p>
              {/* El botón desaparece al reintentar: el foco pasa al título de la sección para no perderse. */}
              <Boton variante="secundario" onClick={() => { setIntento((n) => n + 1); titulo.current?.focus(); }}>Intentar de nuevo</Boton>
            </Aviso>
          ) : null}
          {vacio ? <p>No encontramos carreras de la misma área y región que cumplan este criterio.</p> : null}
          {resultado && resultado.conCorte.length > 0 ? (
            <ul className={estilos.items}>{resultado.conCorte.map((c) => <Tarjeta key={c.codigo_sies} c={c} conCorte />)}</ul>
          ) : null}
          {resultado && resultado.sinPuntajeCentralizado.length > 0 ? (
            <>
              <h3>Se postula directo en la institución</h3>
              <p>Estas carreras no piden puntaje del sistema centralizado. Mostramos una por institución, para que veas opciones de instituciones distintas.</p>
              <ul className={estilos.items}>{resultado.sinPuntajeCentralizado.map((c) => <Tarjeta key={c.codigo_sies} c={c} conCorte={false} />)}</ul>
            </>
          ) : null}
          <p>Para buscar alternativas, de tu dispositivo solo salen el área y la región de tu meta, igual que en cualquier búsqueda del sitio. La carrera, su puntaje y tus preferencias se quedan aquí.</p>
        </>
      )}
    </section>
  );
}
