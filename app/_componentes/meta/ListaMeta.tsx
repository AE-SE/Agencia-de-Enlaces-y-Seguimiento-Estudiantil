'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { Aviso } from '@/app/_componentes/Aviso';
import { Boton } from '@/app/_componentes/Boton';
import { bajar, quitar, subir } from '@/lib/meta/preferencias';
import { textoParaLectura } from '@/lib/datos/texto';

import estilos from './meta.module.css';
import { usePreferencias } from './almacen';
import { AvisoSinAlmacenamiento } from './BotonesMeta';

const ROTULOS = ['Tu meta', '2.ª preferencia', '3.ª preferencia'];

export function ListaMeta() {
  const { lista, listo, bloqueado, guardar, borrar } = usePreferencias();
  const [borrado, setBorrado] = useState(false);
  const [anuncio, setAnuncio] = useState('');
  const titulo = useRef<HTMLHeadingElement>(null);

  // Tras quitar o borrar el botón desaparece: el foco pasa al título de la lista para no perderlo.
  const alQuitar = (codigo: string, nombre: string) => {
    guardar(quitar(lista, codigo));
    setAnuncio(`Quitaste ${nombre}.`);
    setBorrado(false);
    titulo.current?.focus();
  };
  const alMover = (nueva: typeof lista, codigo: string, nombre: string) => {
    guardar(nueva);
    const lugar = nueva.findIndex((p) => p.codigo_sies === codigo) + 1;
    setAnuncio(`${nombre} quedó en el lugar ${lugar}.`);
    setBorrado(false);
  };
  const alBorrar = () => {
    borrar();
    setAnuncio('');
    setBorrado(true);
    titulo.current?.focus();
  };

  return (
    <div className={estilos.lista}>
      {bloqueado ? <AvisoSinAlmacenamiento /> : null}
      <section className={estilos.bloque} aria-labelledby="titulo-lista">
        <h2 id="titulo-lista" tabIndex={-1} ref={titulo}>Tu meta y tus preferencias</h2>
        {!listo ? (
          <p>Cargando lo que guardaste en este dispositivo.</p>
        ) : lista.length ? (
          <ol className={estilos.items}>
            {lista.map((item, i) => {
              const nombre = textoParaLectura(item.carrera);
              return (
                <li key={item.codigo_sies} className={estilos.item}>
                  <p className={estilos.rotulo}>{ROTULOS[i]}</p>
                  {/* Como en la ficha y la hoja: el HTML en minúsculas (el lector de pantalla no deletrea) y el CSS en mayúsculas. */}
                  <h3><Link className={`${estilos.enlace} ${estilos.mayusculas}`} href={item.href} prefetch={false}>{nombre}</Link></h3>
                  <p className={estilos.mayusculas}>{textoParaLectura(item.institucion)}</p>
                  <p><span className={estilos.mayusculas}>{textoParaLectura(item.sede)}</span> · Región: {item.region}</p>
                  <div className={estilos.acciones}>
                    {/* Sin «Subir» en la primera ni «Bajar» en la última: un botón «(No disponible)» en cada tarjeta solo agregaba ruido. */}
                    {i > 0 ? <Boton variante="secundario" aria-label={`Subir ${nombre}`} onClick={() => alMover(subir(lista, item.codigo_sies), item.codigo_sies, nombre)}>Subir</Boton> : null}
                    {i < lista.length - 1 ? <Boton variante="secundario" aria-label={`Bajar ${nombre}`} onClick={() => alMover(bajar(lista, item.codigo_sies), item.codigo_sies, nombre)}>Bajar</Boton> : null}
                    <Boton variante="secundario" aria-label={`Quitar ${nombre}`} onClick={() => alQuitar(item.codigo_sies, nombre)}>Quitar</Boton>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className={estilos.vacia}>
            <p>Todavía no tienes una meta. Abre la ficha de una carrera y elige «Fijar como mi meta». Puedes sumar hasta dos preferencias más con «Agregar a mis preferencias».</p>
            <Boton variante="principal" href="/carreras">Buscar una carrera</Boton>
          </div>
        )}
        {/* N10 parte 2: alternativas cercanas y próximo plazo */}
      </section>

      <p role="status" className={estilos.anuncio}>{anuncio}</p>
      {borrado ? (
        <Aviso tipo="exito" titulo="borramos tus datos de este dispositivo" anunciar>
          <p>Tu meta y tus preferencias ya no están guardadas aquí.</p>
        </Aviso>
      ) : null}

      <section className={estilos.bloque} aria-labelledby="titulo-borrar">
        <h2 id="titulo-borrar">Tus datos en este dispositivo</h2>
        <p>Puedes borrarlos cuando quieras. Se borran de inmediato, sin pedirte confirmación.</p>
        <Boton variante="secundario" onClick={alBorrar}>Borrar mis datos de este dispositivo</Boton>
      </section>
    </div>
  );
}
