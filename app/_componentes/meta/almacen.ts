'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { leer, serializar, type Preferencia } from '@/lib/meta/preferencias';

// La meta y las preferencias viven solo en este dispositivo (localStorage). No viajan a ningún servidor,
// ni en la URL, ni en analítica, ni en registros (AGENTS.md 2.2). Si el navegador bloquea el
// almacenamiento, se conservan en memoria mientras la página siga abierta y se avisa.
const CLAVE = 'agencia:preferencias:v1';

let memoria: string | null = null;
let bloqueado = false;
// Si una escritura falla (cuota llena, navegador que bloquea setItem pero no getItem), lo guardado en memoria es lo
// último que eligió la persona: releer el almacenamiento lo pisaría con el valor anterior y escondería el aviso.
let escrituraFallida = false;
const oyentes = new Set<() => void>();

function leerCrudo(): string | null {
  if (escrituraFallida) return memoria;
  try {
    const texto = window.localStorage.getItem(CLAVE);
    bloqueado = false;
    memoria = texto;
    return texto;
  } catch {
    bloqueado = true;
    return memoria;
  }
}

function escribir(texto: string | null) {
  memoria = texto;
  try {
    if (texto === null) window.localStorage.removeItem(CLAVE);
    else window.localStorage.setItem(CLAVE, texto);
    escrituraFallida = false;
  } catch {
    bloqueado = true;
    escrituraFallida = true;
  }
  oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente);
  // «storage» avisa los cambios hechos desde otra pestaña.
  const alCambiar = (evento: StorageEvent) => {
    if (evento.key === CLAVE || evento.key === null) oyente();
  };
  window.addEventListener('storage', alCambiar);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener('storage', alCambiar);
  };
}

export function usePreferencias() {
  // En el servidor y en la primera pasada del cliente no se sabe qué hay guardado: `listo` es falso.
  const crudo = useSyncExternalStore(suscribir, leerCrudo, () => undefined);
  const lista = useMemo(() => leer(crudo), [crudo]);
  const guardar = useCallback((nueva: Preferencia[]) => escribir(nueva.length ? serializar(nueva) : null), []);
  const borrar = useCallback(() => escribir(null), []);
  return { lista, listo: crudo !== undefined, bloqueado: bloqueado || escrituraFallida, guardar, borrar };
}
