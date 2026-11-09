// Ruta del asistente (POST /api/asistente). Solo conecta configuración con la lógica
// de lib/ia/endpoint-asistente.ts. Las claves vienen de variables de entorno del
// servidor y nunca se devuelven ni se registran.
//
// Variables: GEMINI_API_KEY, GEMINI_MODELO, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

import { getCloudflareContext } from '@opennextjs/cloudflare';

import documentosJson from '../../../datos/asistente/documentos.json' with { type: 'json' };
import { type DependenciasAsistente } from '../../../lib/ia/asistente.ts';
import { buscarEnCorpus, type DocumentoOficial } from '../../../lib/ia/buscar-fragmentos.ts';
import { atenderMensaje } from '../../../lib/ia/endpoint-asistente.ts';
import { crearProveedorGemini, type ProveedorIA } from '../../../lib/ia/proveedor.ts';
import { crearRegistrarAlerta } from '../../../lib/ia/registrar-alerta.ts';

export const dynamic = 'force-dynamic';

const DOCUMENTOS = documentosJson as DocumentoOficial[];

// Hoy en Chile, para no entregar un documento vencido.
function hoyEnChile(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());
}

function construirDependencias(): DependenciasAsistente {
  const entorno = process.env;

  // Sin clave o modelo, el asistente responde "sin servicio" en vez de fallar.
  let proveedor: ProveedorIA;
  try {
    proveedor = crearProveedorGemini({ clave: entorno.GEMINI_API_KEY ?? '', modelo: entorno.GEMINI_MODELO ?? '' });
  } catch {
    proveedor = async () => {
      throw new Error('proveedor de IA no configurado');
    };
  }

  const registrarAlerta =
    entorno.SUPABASE_URL && entorno.SUPABASE_SERVICE_ROLE_KEY
      ? crearRegistrarAlerta({ urlSupabase: entorno.SUPABASE_URL, claveServicio: entorno.SUPABASE_SERVICE_ROLE_KEY })
      : async () => {
          throw new Error('registro de alertas no configurado');
        };

  return {
    proveedor,
    buscarFragmentos: async (pregunta) => buscarEnCorpus(pregunta, DOCUMENTOS, hoyEnChile()),
    registrarAlerta,
  };
}

export async function POST(request: Request): Promise<Response> {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json(
      { tipo: 'error', texto: 'Envía tu pregunta en formato JSON, en el campo "mensaje".' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const respuesta = await atenderMensaje(cuerpo, construirDependencias());

  // La alerta se termina de escribir después de responder. Fuera de Cloudflare
  // (desarrollo local) no hay contexto: la promesa sigue, pero no se espera.
  if (respuesta.alertaPendiente) {
    try {
      getCloudflareContext().ctx.waitUntil(respuesta.alertaPendiente);
    } catch {
      // Sin contexto de ejecución: nada que hacer más que dejar correr la promesa.
    }
  }

  return Response.json(respuesta.cuerpo, {
    status: respuesta.estado,
    headers: { 'Cache-Control': 'no-store' },
  });
}
