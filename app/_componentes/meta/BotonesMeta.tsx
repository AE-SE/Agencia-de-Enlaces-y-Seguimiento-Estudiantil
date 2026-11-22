'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Aviso } from '@/app/_componentes/Aviso';
import { Boton } from '@/app/_componentes/Boton';
import { agregarPreferencia, fijarComoMeta, type Preferencia } from '@/lib/meta/preferencias';
import { textoParaLectura } from '@/lib/datos/texto';

import estilos from './meta.module.css';
import { usePreferencias } from './almacen';

type Mensaje = { tipo: 'exito' | 'error'; titulo: string; texto: string };

export function AvisoSinAlmacenamiento() {
  return (
    <Aviso tipo="error" titulo="tu navegador no deja guardar en este dispositivo">
      <p>Tu meta y tus preferencias solo duran mientras no cierres esta página. Revisa si el navegador bloquea los datos del sitio, o abre la Agencia en otra ventana.</p>
    </Aviso>
  );
}

// Botones de la ficha y del comparador. Ambos son secundarios: la ficha ya tiene su acción principal.
export function BotonesMeta({ item, soloMeta = false }: { item: Preferencia; soloMeta?: boolean }) {
  const { lista, bloqueado, guardar } = usePreferencias();
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const posicion = lista.findIndex((p) => p.codigo_sies === item.codigo_sies);
  const nombre = textoParaLectura(item.carrera);

  const fijar = () => {
    const { lista: nueva, salio } = fijarComoMeta(lista, item);
    guardar(nueva);
    setMensaje({
      tipo: 'exito',
      titulo: 'fijaste tu meta',
      texto: `${nombre} es ahora tu meta.${salio ? ` Salió de tus preferencias ${textoParaLectura(salio.carrera)}, porque caben tres.` : ''}`,
    });
  };
  const agregar = () => {
    const { lista: nueva, resultado } = agregarPreferencia(lista, item);
    if (resultado === 'llena') {
      setMensaje({ tipo: 'error', titulo: 'ya tienes tres preferencias', texto: 'Quita una en tu meta y tus preferencias para agregar otra.' });
      return;
    }
    guardar(nueva);
    setMensaje({ tipo: 'exito', titulo: 'agregaste una preferencia', texto: nueva.length === 1 ? `${nombre} quedó como tu meta, porque la primera de la lista es tu meta.` : `${nombre} quedó en el lugar ${nueva.length} de tus preferencias.` });
  };

  return (
    <div className={estilos.botones}>
      {/* Si ya es la meta, el botón sigue en su lugar (con el foco) y lo dice con texto. */}
      {posicion === 0 ? (
        <Boton variante="secundario" aria-disabled="true" className={estilos.inactivo}>Esta es tu meta</Boton>
      ) : (
        <Boton variante="secundario" onClick={fijar}>Fijar como mi meta</Boton>
      )}
      {soloMeta || posicion === 0 ? null : posicion > 0 ? (
        <Boton variante="secundario" aria-disabled="true" className={estilos.inactivo}>Ya está en tus preferencias (lugar {posicion + 1})</Boton>
      ) : (
        <Boton variante="secundario" onClick={agregar}>Agregar a mis preferencias</Boton>
      )}
      {bloqueado ? <AvisoSinAlmacenamiento /> : null}
      {mensaje ? (
        <Aviso tipo={mensaje.tipo} titulo={mensaje.titulo} anunciar>
          <p>{mensaje.texto}</p>
          <p><Link className={estilos.enlace} href="/meta">Ver mi meta</Link></p>
        </Aviso>
      ) : null}
    </div>
  );
}
