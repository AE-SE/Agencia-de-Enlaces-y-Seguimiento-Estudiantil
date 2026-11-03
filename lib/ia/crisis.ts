// Protocolo de crisis del asistente (AGENTS.md 2.4 y skill asistente-seguro).
//
// Corre ANTES que todo lo demás en cada mensaje y no llama al proveedor de IA:
// si Gemini, la red o la base de datos fallan, la persona igual recibe las líneas
// de ayuda. Por eso este archivo no importa nada; una prueba lo verifica.
//
// La detección es a propósito generosa: preferimos mostrar las líneas de ayuda a
// alguien que no las necesitaba, antes que no mostrárselas a quien sí. Solo se
// descartan modismos muy comunes que no expresan riesgo ("me muero de risa").
//
// Las frases de detección y el texto de respuesta deben ser revisados por un
// profesional de salud mental antes de publicarse (AGENTS.md 2.4).
// TODO(revisión profesional): pendiente.

export type SenalDeCrisis = 'suicidio' | 'autolesion';

export type ResultadoDeteccion =
  | { hayRiesgo: false }
  | { hayRiesgo: true; senales: SenalDeCrisis[] };

// Las líneas viven en el código y no en la base de datos, contra la regla general
// de AGENTS.md 2.1: el protocolo tiene que funcionar aunque la base no responda.
// Revisar estas fuentes en cada actualización y cambiar `verificadoEl`.
export const LINEAS_DE_AYUDA = [
  {
    nombre: 'Línea de Prevención del Suicidio',
    numero: '*4141',
    detalle: 'gratis, las 24 horas, desde cualquier celular',
    fuente: 'Ministerio de Salud',
    url: 'https://www.minsal.cl/linea-de-atencion-4141-no-estas-solo-no-estas-sola/',
    verificadoEl: '2026-11-03',
  },
  {
    nombre: 'Salud Responde',
    numero: '600 360 7777',
    detalle: 'gratis, todos los días, las 24 horas',
    fuente: 'Ministerio de Salud',
    url: 'https://www.ventanillaunicasocial.gob.cl/ficha/311/fono-salud-responde',
    verificadoEl: '2026-11-03',
  },
] as const;

// Breve y humano: primero reconocer, luego dónde pedir ayuda ahora. No diagnostica,
// no minimiza y no promete que alguien del equipo contactará a la persona, porque
// en el portal puede escribir sin cuenta y no siempre se podrá.
export const RESPUESTA_CRISIS = [
  'Gracias por contármelo. Lo que sientes importa, y no tienes que pasarlo sin ayuda.',
  'Ahora mismo puedes hablar con personas preparadas para escucharte:',
  ...LINEAS_DE_AYUDA.map((linea) => `- ${linea.nombre}: llama al ${linea.numero} (${linea.detalle}).`),
  'Si estás en peligro en este momento, ve a la urgencia más cercana o pide a alguien de confianza que te acompañe.',
  'Si esto le pasa a otra persona, estos números también sirven para ayudarla.',
].join('\n');

// La alerta no lleva el texto del mensaje ni nada que identifique a la persona:
// es un dato sensible (AGENTS.md 2.2). Quien la reciba decide, con los permisos
// que correspondan, cómo seguir.
export type AlertaDeCrisis = {
  senales: SenalDeCrisis[];
  detectadaEl: string; // ISO 8601
};

export type RegistrarAlerta = (alerta: AlertaDeCrisis) => Promise<void>;

export type ResultadoProtocolo =
  | { activado: false }
  | {
      activado: true;
      respuesta: string;
      // Se resuelve en true si la alerta quedó registrada. Nunca se rechaza.
      // La respuesta no la espera: en Cloudflare, pasarla a `ctx.waitUntil()`.
      alertaRegistrada: Promise<boolean>;
    };

// ---------------------------------------------------------------------------
// Detección
// ---------------------------------------------------------------------------

// Escritura informal frecuente en mensajes de teléfono.
const ABREVIATURAS: [RegExp, string][] = [
  [/\b(k|q)\b/g, 'que'],
  [/\b(xq|pq|porq)\b/g, 'porque'],
  [/\bkiero\b/g, 'quiero'],
  [/\bmatarm\b/g, 'matarme'],
];

function normalizar(texto: string): string {
  let t = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // sin tildes: "mí" y "mi" cuentan igual
    .replace(/(.)\1{2,}/g, '$1') // "moriiiir" → "morir"
    .replace(/([a-z])-([a-z])/g, '$1$2') // "auto-lesión" → "autolesion"
    // La puntuación queda como marca de corte y no como espacio: así una excepción
    // como "todo el papeleo" no se confunde con "acabar con todo. El lunes…".
    .replace(/[^a-z0-9\s]+/g, ' . ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const [patron, reemplazo] of ABREVIATURAS) t = t.replace(patron, reemplazo);
  return t;
}

// Modismos que contienen palabras de riesgo pero no lo expresan. Se borran antes
// de buscar. Son pocos y precisos a propósito: cada uno es un posible punto ciego.
const MODISMOS: RegExp[] = [
  /\b(morir|morirme|muero|muriendo|morire)( me)? de (la )?(risa|hambre|sueno|calor|frio|verguenza|lata|envidia|ternura)\b/g,
  // "me muero de ganas de ir", pero no "me muero de ganas de morir".
  /\b(morir|morirme|muero|muriendo)( me)? de ganas\b(?! de (morir|matarme|desaparecer|suicidarme|no))/g,
  /\b(me mato|matarme|me estoy matando|me voy a matar|me mate) (estudiando|trabajando|de la risa|de risa)\b/g,
  /\b(cortarme|me corto|me corte|me (voy a|quiero|quisiera) cortar) (el|la|las|los|mi|mis) (pelo|cabello|chasquilla|flequillo|barba|unas|puntas)\b/g,
];

const PATRONES: Record<SenalDeCrisis, RegExp[]> = {
  suicidio: [
    /\bsui[cs]id\w*/,
    /\bmatarme\b/,
    /\bme (voy a |quiero |quisiera |pienso )?matar\b/,
    /\bme mato\b/,
    /\bme matare\b/,
    // "kms" (de "kill myself") solo cuenta con un verbo delante: sola es la
    // abreviatura de kilómetros, muy común al preguntar por una sede.
    /\b(me (quiero|voy a)|quiero|voy a|ganas de) kms\b/,
    /\bquitar(me|se)? la vida\b/, // "me quiero quitar la vida", "quitarse la vida"
    // "quiero dejar de vivir", pero no "voy a dejar de vivir con mis papás".
    /\bdejar de vivir\b(?! (con|en|aca|aqui|alla|solo|sola|junto|cerca|lejos)\b)/,
    // "quisiera estar muerta", pero no "el teléfono va a estar muerto".
    /\b(quiero|quisiera|prefiero|preferiria|me gustaria|ojala|ganas de) (estar|estuviera|estuviese) muert[oa]s?\b/,
    /\bmejor muert[oa]s?\b/,
    /\bmejor me muero\b/,
    // "acabar con todo esto" sí; "terminar con todo el papeleo" no.
    /\b(acabar|terminar|ponerle fin|poner fin) (con|a) (mi vida|todo\b(?! (el|la|los|las|mi|mis|tu|tus)\b))/,
    /\b(quiero|quisiera|deseo|ganas de|pienso en|pensando en|prefiero|me gustaria) (me )?morir(me)?\b/,
    /\bojala (me muera|morirme|no despertar)\b/,
    /\bno (quiero|quisiera) (seguir )?viv(ir|iendo)\b/,
    /\bno (tiene|le veo) sentido (seguir )?viv(ir|iendo)\b/,
    /\bno vale la pena (seguir )?viv(ir|iendo)\b/,
    /\bno aguanto (mas )?(vivir|seguir viviendo|la vida)\b/,
    /\b(cansad[oa]|hart[oa]) de vivir\b/,
    /\b(quiero|quisiera|ganas de|me gustaria) desaparecer( para siempre| del mundo)?\b/,
    /\b(quiero|quisiera|preferiria|me gustaria|ojala) (no existir|dejar de existir|no haber nacido)\b/,
    /\bojala no (existiera|hubiera nacido)\b/,
    /\bno (quiero|quisiera) (seguir )?(existir|estar viv[oa])\b/,
    /\b(ir|irme|salir|voy) de este mundo\b/,
    // "estarían mejor sin mí", pero no "estoy mejor sin mi ex".
    /\bmejor sin mi\b(?! (ex|pareja|pololo|polola|novio|novia|celular|telefono|auto|jefe|trabajo)\b)/,
    /\b(dormir|dormirme) y no despertar\b/,
    /\bno (volver a )?despertar (mas|nunca)\b/,
    /\b(tirarme|lanzarme|botarme) (al|a la|del|de la|de un|de una|desde (el|la|un|una)) (metro|tren|puente|edificio|balcon|ventana|piso|techo|vacio|rio|mar|camion|micro|auto)\b/,
    // "me tiro al metro", "me voy a tirar por la ventana". Sin mar ni río: "me
    // tiré al mar" es casi siempre un baño de verano.
    /\bme (tiro|tire|lanzo|lance|boto|bote|(voy a|quiero|quisiera) (tirar|lanzar|botar)) (al|a la|a un|a una|del|de la|de un|de una|por (el|la|un|una)|desde (el|la|un|una)) (metro|tren|puente|edificio|balcon|ventana|piso|techo|vacio|camion|micro|auto)\b/,
    /\bahorcarme\b/,
    /\b(tomarme|me tome|me voy a tomar|me quiero tomar) (todas (las|mis)|un frasco de|una caja de|muchas|demasiadas) (pastillas|remedios|medicamentos)\b/,
    /\bno (quiero|quisiera) (volver a )?despertar\b/,
    /\bsobredosis\b/,
    // Cuando la persona cuenta lo que le pasa a otra.
    /\bse (quiere|va a) (matar|suicidar|morir)\b/,
    /\bquiere (matarse|suicidarse|morirse)\b/,
  ],
  autolesion: [
    /\bautolesi\w*/,
    /\bcortarme\b/,
    /\bme (corto|corte|he cortado|sigo cortando|estoy cortando|voy a cortar)\b/,
    /\bvolvi a cortarme\b/,
    /\b(hacerme|haciendome|me (hago|hice|estoy haciendo|sigo haciendo|voy a hacer|quiero hacer)) dano\b/,
    /\b(cort|abr)\w*( me)? las venas\b/, // "me quiero cortar las venas"
    /\bme (quiero|quisiera|voy a|dan ganas de) cortar\b/,
    /\b(lastimarme|me lastimo|golpearme|me golpeo)\b/,
    /\bse (corta|esta cortando|hace dano)\b/,
  ],
};

export function detectarCrisis(mensaje: string): ResultadoDeteccion {
  let texto = normalizar(mensaje);
  for (const modismo of MODISMOS) texto = texto.replace(modismo, ' ');

  const senales = (Object.keys(PATRONES) as SenalDeCrisis[]).filter((senal) =>
    PATRONES[senal].some((patron) => patron.test(texto)),
  );
  return senales.length > 0 ? { hayRiesgo: true, senales } : { hayRiesgo: false };
}

// ---------------------------------------------------------------------------
// Protocolo
// ---------------------------------------------------------------------------

// Si se activa, quien llama entrega `respuesta` y NO sigue con la conversación
// normal ni envía el mensaje al proveedor de IA.
export function aplicarProtocoloDeCrisis(
  mensaje: string,
  registrarAlerta: RegistrarAlerta,
  ahora: () => Date = () => new Date(),
): ResultadoProtocolo {
  const deteccion = detectarCrisis(mensaje);
  if (!deteccion.hayRiesgo) return { activado: false };

  const alerta: AlertaDeCrisis = { senales: deteccion.senales, detectadaEl: ahora().toISOString() };
  // Un fallo al registrar no puede impedir la respuesta ni dejar rastro del
  // mensaje en los logs: se informa solo con el booleano.
  const alertaRegistrada = Promise.resolve()
    .then(() => registrarAlerta(alerta))
    .then(
      () => true,
      () => false,
    );

  return { activado: true, respuesta: RESPUESTA_CRISIS, alertaRegistrada };
}
