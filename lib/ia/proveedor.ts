// Única puerta hacia el proveedor de IA (ADR 0004). Cambiar de proveedor es
// escribir otra función que cumpla `ProveedorIA`; el resto del código no cambia.
//
// Este archivo no limpia datos personales ni revisa fuentes: eso lo hace
// `asistente.ts` antes y después de llamarlo, para que ningún proveedor pueda
// saltárselo.

// Trozo de un documento oficial cargado, con lo necesario para citarlo
// (AGENTS.md 2.1: fuente, URL y fecha).
export type Fragmento = {
  id: string;
  texto: string;
  fuente: string;
  url: string;
  actualizadoEl: string; // AAAA-MM-DD
};

export type PeticionIA = {
  pregunta: string; // ya sin datos personales
  fragmentos: Fragmento[];
};

export type RespuestaIA = {
  texto: string;
  fuentes: string[]; // ids de los fragmentos que respaldan la respuesta
};

export type ProveedorIA = (peticion: PeticionIA) => Promise<RespuestaIA>;

export const INSTRUCCIONES = [
  'Eres el asistente de una plataforma gratuita que orienta a personas que quieren entrar a la educación superior en Chile.',
  'Responde solo con la información de los fragmentos oficiales entregados. Si no alcanzan para responder, deja "fuentes" vacío y no inventes.',
  'En "fuentes" pon los id de los fragmentos que usaste.',
  'Nunca inventes fechas, montos, puntajes ni requisitos. Nunca prometas beneficios ni resultados.',
  'No recomiendes instituciones. No diagnostiques ni actúes como terapeuta.',
  'No uses "estilos de aprendizaje" (visual, auditivo, kinestésico); si preguntan cómo estudiar, habla de práctica de recuperación, práctica espaciada, intercalado y autoexplicación.',
  'Escribe en español de Chile, con tuteo, frases cortas y sin siglas sin explicar.',
].join('\n');

const ESQUEMA_RESPUESTA = {
  type: 'object',
  properties: {
    respuesta: { type: 'string' },
    fuentes: { type: 'array', items: { type: 'string' } },
  },
  required: ['respuesta', 'fuentes'],
};

type ConfigGemini = {
  clave: string; // GEMINI_API_KEY, solo en el servidor
  modelo: string; // GEMINI_MODELO; no se fija en el código porque los modelos cambian
  fetch?: typeof fetch;
  milisegundosMaximos?: number; // tope para todos los intentos juntos
  esperar?: (milisegundos: number) => Promise<void>;
};

const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Gemini responde 503 cuando el modelo está saturado ("high demand"), sobre todo
// en el nivel gratuito, y suele pasar en segundos. Se reintenta solo eso: un 429
// (cuota agotada) no se arregla esperando un segundo.
const PAUSAS_ENTRE_INTENTOS = [500, 1_500];
const esSaturacion = (estado: number) => estado === 500 || estado === 503;
const esperarDeVerdad = (milisegundos: number) => new Promise<void>((listo) => setTimeout(listo, milisegundos));

// Referencia: https://ai.google.dev/api/generate-content (consultada 2026-11-03).
export function crearProveedorGemini(config: ConfigGemini): ProveedorIA {
  if (!config.clave || !config.modelo) throw new Error('Falta GEMINI_API_KEY o GEMINI_MODELO');
  const llamar = config.fetch ?? fetch;
  const esperar = config.esperar ?? esperarDeVerdad;

  return async ({ pregunta, fragmentos }) => {
    const contexto = fragmentos
      .map((f) => `[${f.id}] ${f.fuente} (${f.actualizadoEl}): ${f.texto}`)
      .join('\n\n');

    // Un solo tope para todos los intentos: la persona no espera más por reintentar.
    const tope = AbortSignal.timeout(config.milisegundosMaximos ?? 15_000);
    const pedir = () =>
      llamar(`${URL_BASE}/${encodeURIComponent(config.modelo)}:generateContent`, {
        method: 'POST',
        // La clave va en un encabezado y nunca en la URL, que puede quedar en logs.
        headers: { 'content-type': 'application/json', 'x-goog-api-key': config.clave },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: INSTRUCCIONES }] },
          contents: [{ role: 'user', parts: [{ text: `Fragmentos oficiales:\n${contexto}\n\nPregunta: ${pregunta}` }] }],
          generationConfig: { responseMimeType: 'application/json', responseJsonSchema: ESQUEMA_RESPUESTA },
        }),
        signal: tope,
      });

    let respuesta = await pedir();
    for (const pausa of PAUSAS_ENTRE_INTENTOS) {
      if (!esSaturacion(respuesta.status) || tope.aborted) break;
      await esperar(pausa);
      respuesta = await pedir();
    }

    // El mensaje de error no incluye el cuerpo: podría repetir la pregunta.
    if (!respuesta.ok) throw new Error(`Gemini respondió ${respuesta.status}`);

    const datos = await respuesta.json();
    const texto = datos?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof texto !== 'string') throw new Error('Gemini no entregó una respuesta');

    const json = JSON.parse(texto);
    if (typeof json?.respuesta !== 'string' || !Array.isArray(json?.fuentes)) {
      throw new Error('Gemini entregó una respuesta con otra forma');
    }
    return { texto: json.respuesta, fuentes: json.fuentes.filter((f: unknown) => typeof f === 'string') };
  };
}
