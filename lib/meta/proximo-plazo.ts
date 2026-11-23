// Próximo plazo del calendario de admisión (N3). Lógica pura: recibe «hoy» como "AAAA-MM-DD" en hora de Chile.
// Un hito sin fecha publicada se ignora: nunca se le supone una.

type Hito = { inicio: string | null; termino: string | null };

export type ProximoPlazo<T extends Hito> = { plazo: T; estado: 'en_curso' | 'proximo' };

export function proximoPlazo<T extends Hito>(plazos: readonly T[], hoy: string): ProximoPlazo<T> | null {
  const conFecha = plazos.filter((p): p is T & { inicio: string; termino: string } => Boolean(p.inicio && p.termino));
  const siguiente = [...conFecha].sort((a, b) => a.inicio.localeCompare(b.inicio)).find((p) => p.termino >= hoy);
  if (!siguiente) return null;
  return { plazo: siguiente, estado: siguiente.inicio <= hoy ? 'en_curso' : 'proximo' };
}
