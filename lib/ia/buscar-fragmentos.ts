// Búsqueda de fragmentos oficiales para el asistente (docs/asistente-con-fuentes.md).
//
// Es determinista y sin red: puntúa cada fragmento por las palabras de la pregunta
// que aparecen en su texto, su fuente o su tema. No usa IA para elegir fuentes:
// el modelo solo recibe lo que esta función devuelve.
//
// Un documento vencido no se entrega: su plazo o monto ya no vale.

import { normalizar } from '../datos/buscar.ts';
import type { Fragmento } from './proveedor.ts';

export type DocumentoOficial = {
  titulo: string;
  organismo: string;
  url: string;
  publicadoEl: string;   // AAAA-MM-DD
  consultadoEl: string;  // AAAA-MM-DD
  tema: string;
  venceEl: string | null; // AAAA-MM-DD; null si no vence
  fragmentos: Fragmento[];
};

const MAXIMO_FRAGMENTOS = 3;
// Palabras muy cortas ("de", "el", "que") aportan ruido: no cuentan.
const LARGO_MINIMO_PALABRA = 4;

function palabras(texto: string): string[] {
  return normalizar(texto)
    .split(' ')
    .filter((p) => p.length >= LARGO_MINIMO_PALABRA);
}

function vigente(documento: DocumentoOficial, hoy: string): boolean {
  return documento.venceEl === null || documento.venceEl >= hoy;
}

export function buscarEnCorpus(
  pregunta: string,
  corpus: readonly DocumentoOficial[],
  hoy: string,
): Fragmento[] {
  const buscadas = new Set(palabras(pregunta));
  if (buscadas.size === 0) return [];

  const puntuados: { fragmento: Fragmento; puntos: number }[] = [];
  for (const documento of corpus) {
    if (!vigente(documento, hoy)) continue;
    for (const fragmento of documento.fragmentos) {
      const enFragmento = new Set(palabras(`${fragmento.texto} ${fragmento.fuente} ${documento.tema}`));
      let puntos = 0;
      for (const palabra of buscadas) if (enFragmento.has(palabra)) puntos += 1;
      if (puntos > 0) puntuados.push({ fragmento, puntos });
    }
  }

  // Empate: el orden del corpus, para que la respuesta sea repetible.
  return puntuados
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, MAXIMO_FRAGMENTOS)
    .map((p) => p.fragmento);
}
