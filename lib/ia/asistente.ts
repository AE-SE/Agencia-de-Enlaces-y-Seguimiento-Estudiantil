// Orden obligatorio de cada mensaje al asistente (skill asistente-seguro):
// 1. protocolo de crisis, 2. quitar datos personales, 3. buscar fragmentos
// oficiales, 4. preguntar a la IA, 5. mostrar solo si cita una fuente.
//
// Las dependencias llegan como parámetros para poder probar el flujo sin red,
// sin base de datos y sin gastar en el proveedor.

import { aplicarProtocoloDeCrisis, type RegistrarAlerta } from './crisis.ts';
import { quitarDatosPersonales } from './datos-personales.ts';
import type { Fragmento, ProveedorIA } from './proveedor.ts';

export type DependenciasAsistente = {
  proveedor: ProveedorIA;
  buscarFragmentos: (pregunta: string) => Promise<Fragmento[]>;
  registrarAlerta: RegistrarAlerta;
};

export type RespuestaAsistente =
  | { tipo: 'crisis'; texto: string; alertaRegistrada: Promise<boolean> }
  | { tipo: 'respuesta'; texto: string; fuentes: Fragmento[] }
  | { tipo: 'sin_certeza'; texto: string }
  | { tipo: 'sin_servicio'; texto: string };

// TODO(canal humano): todavía no existe la vía para escribirle al equipo; cuando
// exista, este texto debe llevar a ella.
export const TEXTO_SIN_CERTEZA =
  'No encontré información oficial para responderte esto con certeza. Puedes escribirle a una persona de nuestro equipo.';

export const TEXTO_SIN_SERVICIO =
  'No pude responderte en este momento. Intenta de nuevo en unos minutos o escríbele a una persona de nuestro equipo.';

export async function responder(mensaje: string, dependencias: DependenciasAsistente): Promise<RespuestaAsistente> {
  // 1. Antes que todo y sin la IA: si hay señales, aquí termina la conversación normal.
  const crisis = aplicarProtocoloDeCrisis(mensaje, dependencias.registrarAlerta);
  if (crisis.activado) {
    return { tipo: 'crisis', texto: crisis.respuesta, alertaRegistrada: crisis.alertaRegistrada };
  }

  // 2. De aquí en adelante solo circula la pregunta limpia.
  const pregunta = quitarDatosPersonales(mensaje);

  try {
    // 3. Sin documentos oficiales que la respalden, no vale la pena preguntar a la IA.
    const fragmentos = await dependencias.buscarFragmentos(pregunta);
    if (fragmentos.length === 0) return { tipo: 'sin_certeza', texto: TEXTO_SIN_CERTEZA };

    // 4.
    const respuesta = await dependencias.proveedor({ pregunta, fragmentos });

    // 5. Solo cuentan como fuentes los fragmentos que realmente le entregamos:
    // un id inventado por la IA no respalda nada.
    const fuentes = fragmentos.filter((f) => respuesta.fuentes.includes(f.id));
    if (fuentes.length === 0 || respuesta.texto.trim() === '') {
      return { tipo: 'sin_certeza', texto: TEXTO_SIN_CERTEZA };
    }
    return { tipo: 'respuesta', texto: respuesta.texto, fuentes };
  } catch {
    // Sin detalles del error: podrían incluir la pregunta.
    return { tipo: 'sin_servicio', texto: TEXTO_SIN_SERVICIO };
  }
}
