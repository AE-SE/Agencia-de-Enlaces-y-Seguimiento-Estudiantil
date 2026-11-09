// Lógica del endpoint del asistente, sin nada específico de Cloudflare ni de Next.
// La ruta (app/api/asistente/route.ts) solo lee la configuración y la conecta aquí.
//
// Reglas (AGENTS.md 2.2 y 2.4):
// - La entrada se valida antes de tocar nada.
// - La respuesta nunca repite el mensaje de la persona, ni en la salida ni en errores.
// - Si hay crisis, la respuesta no espera a que se registre la alerta.

import { responder, type DependenciasAsistente, type RespuestaAsistente } from './asistente.ts';
import { detectarCrisis } from './crisis.ts';
import type { Fragmento } from './proveedor.ts';

export const LARGO_MAXIMO_MENSAJE = 1000;

export type RespuestaEndpoint = {
  estado: number;
  cuerpo: Record<string, unknown>;
  // Solo en crisis: se resuelve en true si la alerta quedó registrada.
  // La ruta lo pasa a ctx.waitUntil para no retrasar la respuesta.
  alertaPendiente?: Promise<boolean>;
};

function fragmentoPublico(f: Fragmento) {
  return { id: f.id, texto: f.texto, fuente: f.fuente, url: f.url, actualizadoEl: f.actualizadoEl };
}

// Devuelve el texto sin espacios de los extremos, o null si no es un texto no vacío.
// El largo no se revisa aquí: ver atenderMensaje.
export function leerMensaje(cuerpo: unknown): string | null {
  if (typeof cuerpo !== 'object' || cuerpo === null || !('mensaje' in cuerpo)) return null;
  const mensaje = (cuerpo as { mensaje: unknown }).mensaje;
  if (typeof mensaje !== 'string') return null;
  const limpio = mensaje.trim();
  return limpio.length === 0 ? null : limpio;
}

const RESPUESTA_ERROR_ENTRADA: RespuestaEndpoint = {
  estado: 400,
  // Mensaje fijo: no se devuelve lo que llegó.
  cuerpo: { tipo: 'error', texto: `Escribe tu pregunta en "mensaje", con hasta ${LARGO_MAXIMO_MENSAJE} caracteres.` },
};

export async function atenderMensaje(cuerpo: unknown, dependencias: DependenciasAsistente): Promise<RespuestaEndpoint> {
  const mensaje = leerMensaje(cuerpo);
  if (mensaje === null) return RESPUESTA_ERROR_ENTRADA;

  // Un mensaje demasiado largo no va a la IA. Pero si trae señales de crisis,
  // el protocolo tiene que activarse igual: no se rechaza sin responder.
  if (mensaje.length > LARGO_MAXIMO_MENSAJE && !detectarCrisis(mensaje).hayRiesgo) {
    return RESPUESTA_ERROR_ENTRADA;
  }

  const resultado: RespuestaAsistente = await responder(mensaje, dependencias);

  if (resultado.tipo === 'crisis') {
    return {
      estado: 200,
      cuerpo: { tipo: 'crisis', texto: resultado.texto },
      alertaPendiente: resultado.alertaRegistrada,
    };
  }
  if (resultado.tipo === 'respuesta') {
    return {
      estado: 200,
      cuerpo: { tipo: 'respuesta', texto: resultado.texto, fuentes: resultado.fuentes.map(fragmentoPublico) },
    };
  }
  return { estado: 200, cuerpo: { tipo: resultado.tipo, texto: resultado.texto } };
}
