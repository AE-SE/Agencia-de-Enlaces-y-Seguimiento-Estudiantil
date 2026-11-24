// "2026-11-04" -> "4 de noviembre de 2026" (lenguaje claro). Se fija UTC para que la
// zona horaria del navegador o del servidor no cambie el día.
export function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

// El período viene de la base tal como lo escribe la carga («Admisión 2027, oferta definitiva (2026-09-24)»).
// Para mostrarlo, sus fechas ISO pasan a lenguaje claro; el resto del texto no se toca.
export function periodoLegible(periodo: string): string {
  // Una fecha imposible («2026-02-32») se deja tal cual: un error de formato no debe tumbar la ficha.
  return periodo.replace(/\b(\d{4}-\d{2}-\d{2})\b/g, (iso) => (Number.isNaN(Date.parse(`${iso}T00:00:00Z`)) ? iso : fechaLarga(iso)));
}
