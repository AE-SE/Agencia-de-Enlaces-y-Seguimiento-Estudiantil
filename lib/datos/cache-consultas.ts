// Caché en memoria de cada proceso del Worker para las lecturas de Supabase. Sin dependencias: se prueba sola.
//
// Por qué: el plan gratuito de Supabase pasó su cuota de tráfico de salida (5,61 de 5 GB en el ciclo del 3-nov al
// 3-dic) y las páginas son dinámicas, así que cada visita repetía las mismas consultas. Los datos son públicos
// (clave anon) y cambian solo cuando se carga un lote: una hora basta. No se usa la Cache API de Cloudflare:
// en un subdominio workers.dev no guarda nada.
//
// Reglas: solo se guardan respuestas correctas; la promesa en curso se comparte (dos visitas simultáneas a la
// misma ficha hacen una consulta); hay tope de consultas y de filas (una consulta puede traer 1000), y al
// pasarlo salen las más antiguas.

export const VIGENCIA_CONSULTA_MS = 60 * 60 * 1000;
const MAXIMO_CONSULTAS = 500;
const MAXIMO_FILAS = 20_000;

type Resultado = { filas: unknown[] };

export function conCache<A extends unknown[], R extends Resultado>(
  consultar: (...args: A) => Promise<R>,
  claveDe: (...args: A) => string,
  { maximoConsultas = MAXIMO_CONSULTAS, maximoFilas = MAXIMO_FILAS } = {},
): (...args: A) => Promise<R> {
  const guardadas = new Map<string, { vence: number; filas: number; respuesta: Promise<R> }>();
  let filasGuardadas = 0;

  const olvidar = (clave: string) => {
    const entrada = guardadas.get(clave);
    if (!entrada) return;
    filasGuardadas -= entrada.filas;
    guardadas.delete(clave);
  };

  return (...args: A) => {
    const clave = claveDe(...args);
    const ahora = Date.now();
    const guardada = guardadas.get(clave);
    if (guardada && guardada.vence > ahora) return guardada.respuesta;

    const respuesta = consultar(...args);
    olvidar(clave);
    const entrada = { vence: ahora + VIGENCIA_CONSULTA_MS, filas: 0, respuesta };
    guardadas.set(clave, entrada);
    respuesta.then(
      (r) => {
        if (guardadas.get(clave) !== entrada) return;
        entrada.filas = r.filas.length;
        filasGuardadas += r.filas.length;
        // Map conserva el orden de inserción: al pasar un tope salen las más antiguas.
        while (guardadas.size > maximoConsultas || filasGuardadas > maximoFilas) {
          const masAntigua = guardadas.keys().next().value;
          if (masAntigua === undefined || masAntigua === clave) break;
          olvidar(masAntigua);
        }
      },
      // Un error no queda guardado: la próxima visita vuelve a intentar.
      () => {
        if (guardadas.get(clave) === entrada) olvidar(clave);
      },
    );
    return respuesta;
  };
}
