// GET /api/alternativas?area=&region=: carreras candidatas a «alternativas cercanas» de la meta.
// Recibe solo área y región (nunca el código ni el corte de la meta) y no los registra en logs:
// la comparación con la meta se hace en el dispositivo. Los datos son públicos y cambian poco.

import { candidatasAlternativas } from '../../../lib/datos/oferta-remota.ts';
import { validarParametros } from '../../../lib/meta/alternativas.ts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const parametros = validarParametros(searchParams.get('area'), searchParams.get('region'));
  if (!parametros) {
    return Response.json({ error: 'Faltan el área y la región, o no son válidas.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  try {
    const datos = await candidatasAlternativas(parametros.area, parametros.region);
    return Response.json(datos, { headers: { 'Cache-Control': 'public, max-age=21600' } });
  } catch {
    // Sin detalles: el error de la base no se devuelve ni se registra con los parámetros.
    return Response.json({ error: 'No pudimos buscar alternativas ahora.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
