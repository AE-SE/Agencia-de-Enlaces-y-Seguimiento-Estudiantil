// "2026-11-04" -> "4 de noviembre de 2026" (lenguaje claro). Se fija UTC para que la
// zona horaria del navegador o del servidor no cambie el día.
export function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}
