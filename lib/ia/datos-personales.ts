// Quita datos personales de un mensaje antes de que salga hacia el proveedor de IA
// (AGENTS.md 2.2, minimización; skill asistente-seguro, paso 3).
//
// Es a propósito generosa: borrar de más solo empeora un poco la respuesta,
// borrar de menos expone a la persona. No detecta nombres sueltos sin una pista
// ("me llamo…", "soy…"); por eso el asistente tampoco pide nombres.

const REEMPLAZOS: [RegExp, string][] = [
  [/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[correo]'],
  // RUT con o sin puntos y guion: 12.345.678-5, 12345678-K, 9.876.543 k
  [/\b\d{1,2}\.?\d{3}\.?\d{3}\s?-?\s?[\dkK]\b/g, '[RUT]'],
  [/\b(calle|avenida|av\.?|pasaje|pje\.?|camino|villa|poblaci[oó]n|block|depto\.?|departamento)\s+[^\d,\n]{0,40}?#?\s*\d+/gi, '[dirección]'],
  [/\bvivo en\s+[^\d,\n]{1,40}?#?\s*\d+/gi, 'vivo en [dirección]'],
  // Con "me llamo" o "mi nombre es" lo que sigue siempre es un nombre, aunque
  // venga en minúscula. Con "soy" solo si va con mayúscula: "soy de Temuco" no.
  [/\b([Mm]e llamo|[Mm]i nombre es)\s+[\p{L}]+(\s+[\p{L}]+)?/gu, '$1 [nombre]'],
  [/\b([Ss]oy)\s+\p{Lu}\p{Ll}+(\s+\p{Lu}\p{Ll}+){0,3}/gu, '$1 [nombre]'],
];

// Cualquier número de 8 o más dígitos (con espacios, puntos o guiones) se trata
// como teléfono o documento: +56 9 1234 5678, 22 123 4567, 912345678.
const NUMERO_LARGO = /\+?\d[\d\s.-]{6,}\d/g;

function esNumeroLargo(coincidencia: string, texto: string, posicion: number): boolean {
  if (coincidencia.replace(/\D/g, '').length < 8) return false;
  // Montos ("$15.000.000") y años ("2026-2027") no identifican a nadie.
  if (/\$\s*$/.test(texto.slice(Math.max(0, posicion - 2), posicion))) return false;
  if (/^\d{4}\s*-\s*\d{4}$/.test(coincidencia.trim())) return false;
  return true;
}

export function quitarDatosPersonales(texto: string): string {
  let limpio = texto;
  for (const [patron, reemplazo] of REEMPLAZOS) limpio = limpio.replace(patron, reemplazo);
  return limpio.replace(NUMERO_LARGO, (coincidencia, posicion: number, completo: string) =>
    esNumeroLargo(coincidencia, completo, posicion) ? '[número]' : coincidencia,
  );
}
