import type { Carrera } from './carreras.ts';
import { textoParaLectura } from './texto.ts';

// La «V» final del código SIES (I70S1C68J1V2) es la versión del plan de estudios: el diccionario de Matrícula
// de Mineduc define CODIGO_UNICO por institución, sede, carrera, jornada y versión (docs/datos/diccionario.md).
// La fuente no trae otra etiqueta para la versión: se muestra el número tal cual, sin interpretarlo.
export function versionDelPlan(codigoSies: string): number | null {
  const coincidencia = /V(\d+)$/i.exec(codigoSies);
  return coincidencia ? Number(coincidencia[1]) : null;
}

export function textoDeVersion(codigoSies: string): string {
  const version = versionDelPlan(codigoSies);
  return version === null ? '' : `Versión ${version} del plan de estudios`;
}

type Oferta = Pick<Carrera, 'codigo_sies' | 'carrera' | 'sede' | 'jornada'> & { institucion: { nombre: string } };

// Lo que muestran todas las vistas (explorador, comparador, hoja), normalizado igual que en pantalla.
const claveVisible = (oferta: Oferta) =>
  [oferta.carrera, oferta.institucion.nombre, oferta.sede, oferta.jornada].map(textoParaLectura).join('|');

// Códigos de las ofertas que en esta lista tienen otra con la misma carrera, institución, sede y jornada: a la vista
// son iguales y solo las separa la versión del plan. Las demás no llevan la versión, para no sumar ruido. Un código
// sin «V» final no se marca: no habría versión que mostrar.
export function codigosRepetidos(ofertas: readonly Oferta[]): Set<string> {
  const porClave = new Map<string, string[]>();
  for (const oferta of ofertas) {
    if (versionDelPlan(oferta.codigo_sies) === null) continue;
    const clave = claveVisible(oferta);
    porClave.set(clave, [...(porClave.get(clave) ?? []), oferta.codigo_sies]);
  }
  return new Set([...porClave.values()].filter((codigos) => codigos.length > 1).flat());
}
