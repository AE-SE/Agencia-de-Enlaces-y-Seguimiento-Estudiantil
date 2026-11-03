// Quita datos personales de un mensaje antes de que salga hacia el proveedor de IA
// (AGENTS.md 2.2, minimización; skill asistente-seguro, paso 3).
//
// Es a propósito generosa: borrar de más solo empeora un poco la respuesta,
// borrar de menos expone a la persona. No detecta nombres sueltos sin una pista
// ("me llamo…", "soy…", "mi mamá se llama…"); por eso el asistente tampoco pide nombres.

const REEMPLAZOS: [RegExp, string][] = [
  [/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[correo]'],
  // RUT con o sin puntos y guion: 12.345.678-5, 12345678-K, 9.876.543 k
  [/\b\d{1,2}\.?\d{3}\.?\d{3}\s?-?\s?[\dkK]\b/g, '[RUT]'],
  // Sin dígito verificador solo se reconoce si viene anunciado: "mi rut 12.345.678".
  [/\b(rut|run)(\s*(?:es\s*)?:?\s*)\d{1,2}\.?\d{3}\.?\d{3}\b/gi, '$1$2[RUT]'],
  // Hasta cuatro palabras entre la calle y el número, para no comerse el resto de
  // la frase. Sin "villa" ni "camino": chocan con comunas como Villa Alemana.
  [/\b(calle|avenida|av\.?|pasaje|pje\.?|poblaci[oó]n|block|depto\.?|departamento)(\s+[\p{L}'.]+){1,4}\s*#?\s*\d+/giu, '[dirección]'],
  [/\bvivo en(\s+[\p{L}'.]+){1,4}\s*#?\s*\d+/giu, 'vivo en [dirección]'],
  [/\b(mi direcci[oó]n( es)?:?|mi casa (queda|est[aá]) en)(\s+[\p{L}'.]+){1,4}\s*#?\s*\d+/giu, '$1 [dirección]'],
  // "nací el 14-02-2009", "mi fecha de nacimiento es 14 de febrero de 2009":
  // junto a otros datos identifica a la persona y revela si es menor de edad.
  [/\b(nac[ií]( el)?|fecha de nacimiento( es)?:?|cumplo años el|mi cumplea[nñ]os es( el)?)\s*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4}|\d{1,2} de \p{L}+( del? \d{4})?)/giu, '$1 [fecha]'],
  // Con "me llamo" o "mi nombre es" lo que sigue siempre es un nombre.
  [/\b(me llamo|mi nombre es)\s+\p{L}+(\s+\p{L}+)?/giu, '$1 [nombre]'],
  // "Mi mamá se llama Rosa", pero no "la carrera se llama Enfermería".
  [/\b([Mm]i|[Ss]u|[Tt]u)\s+(\p{L}+)\s+(se llaman?)\s+\p{L}+(\s+\p{L}+)?/gu, '$1 $2 $3 [nombre]'],
  // Frecuente cuando escribe un apoderado: "mi hijo Tomás quiere…", "soy la mamá de
  // Benjamín". Solo con mayúscula inicial, para no borrar "mi hijo quiere estudiar".
  [/\b([Mm]i|[Ss]u|[Tt]u)\s+(hij[oa]|herman[oa]|sobrin[oa]|niet[oa]|pupil[oa]|alumn[oa]|amig[oa]|poloh?l[oa]|novi[oa]|pareja|mam[aá]|pap[aá])\s+\p{Lu}\p{L}+(\s+\p{Lu}\p{L}+)?/gu, '$1 $2 [nombre]'],
  [/\b(mam[aá]|pap[aá]|madre|padre|apoderad[oa]|tutor[a]?|abuel[oa]|t[ií][oa]|herman[oa]) de\s+\p{Lu}\p{L}+(\s+\p{Lu}\p{L}+)?/gu, '$1 de [nombre]'],
];

// Palabras que suelen ir después de "soy" sin ser un nombre ("soy de Temuco",
// "soy estudiante"). Cualquier otra se trata como nombre: si no está en la lista,
// se borra, que es el error seguro.
const NO_ES_NOMBRE = new Set(
  (
    'de del la el los las un una uno al a en con sin para por que yo muy bien mal mas menos tan re super ' +
    'demasiado bastante solo sola nuevo nueva quien como alguien parte capaz bueno buena malo mala ' +
    'estudiante alumno alumna apoderado apoderada mama papa madre padre tutor tutora hijo hija hermano hermana ' +
    'profe profesor profesora orientador orientadora egresado egresada postulante mayor menor primer primera ' +
    'chileno chilena extranjero extranjera persona mujer hombre joven adulto adulta trabajador trabajadora ' +
    'becado becada titulado titulada tecnico tecnica ingeniero ingeniera'
  ).split(' '),
);

// Palabras que cortan un nombre: "soy ana y quiero…" borra solo "ana".
const FIN_DE_NOMBRE = new Set(
  'y e o u de del la el los las en con que pero tengo quiero estoy voy me mi a al para por no si ya desde porque'.split(' '),
);

const sinTildes = (palabra: string) => palabra.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function quitarNombreTrasSoy(texto: string): string {
  return texto.replace(/\b([Ss]oy)((?:\s+\p{L}+){1,4})/gu, (completo, soy: string, resto: string) => {
    const palabras = resto.trim().split(/\s+/);
    if (NO_ES_NOMBRE.has(sinTildes(palabras[0]))) return completo;
    let largo = 1;
    while (largo < palabras.length && !FIN_DE_NOMBRE.has(sinTildes(palabras[largo]))) largo++;
    const despues = palabras.slice(largo);
    return [soy, '[nombre]', ...despues].join(' ');
  });
}

// Cualquier número de 8 o más dígitos (con espacios, puntos o guiones) se trata
// como teléfono o documento: +56 9 1234 5678, 22 123 4567, 912345678.
const NUMERO_LARGO = /\+?\d[\d\s.-]{6,}\d/g;

// Si justo antes se anuncia un teléfono, el número se borra aunque parezca un
// puntaje: "mi celular es 912 345 678" tiene la misma forma que "850 900 750".
// El \b evita que "aran-cel es 15.000.000" se lea como "cel es…".
const ANUNCIA_TELEFONO = /\b(cel(ular)?|fono|tel[eé]fono|whats?app|wsp|ll[aá]ma(me|nos)|n[uú]mero|contacto)\W*(es|:)?\W*$/i;

function esNumeroLargo(coincidencia: string, texto: string, posicion: number): boolean {
  const numero = coincidencia.trim();
  if (numero.replace(/\D/g, '').length < 8) return false;
  if (ANUNCIA_TELEFONO.test(texto.slice(Math.max(0, posicion - 25), posicion))) return true;
  // Lo que el asistente necesita para responder y no identifica a nadie:
  if (/\$\s*$/.test(texto.slice(Math.max(0, posicion - 2), posicion))) return false; // "$15.000.000"
  if (/^\d{1,3}(\.\d{3})+$/.test(numero)) return false; // "15.000.000" (montos con puntos de miles)
  if (/^\d{4}\s*-\s*\d{4}$/.test(numero)) return false; // "2026-2027"
  if (/^\d{1,2}[-.]\d{1,2}[-.]\d{2,4}$/.test(numero)) return false; // "03-11-2026"
  if (numero.split(/\s+/).every((grupo) => /^(\d{3}|1000)$/.test(grupo))) return false; // puntajes "850 900 750"
  return true;
}

export function quitarDatosPersonales(texto: string): string {
  let limpio = texto;
  for (const [patron, reemplazo] of REEMPLAZOS) limpio = limpio.replace(patron, reemplazo);
  limpio = quitarNombreTrasSoy(limpio);
  return limpio.replace(NUMERO_LARGO, (coincidencia, posicion: number, completo: string) =>
    esNumeroLargo(coincidencia, completo, posicion) ? '[número]' : coincidencia,
  );
}
