// Próximos plazos del calendario de admisión (N3). Lógica pura: recibe «hoy» como "AAAA-MM-DD" en hora de Chile.
// Un hito sin fecha publicada se ignora: nunca se le supone una.
//
// Varios hitos pueden empezar el mismo día o solaparse (el 4 de enero salen los puntajes y abre la postulación;
// del 22 al 28 corren el retracto y la segunda etapa de matrícula): se devuelven todos, no solo el primero.
// Si hay hitos en curso, son esos; si no, los que empiezan en la fecha futura más cercana.

type Hito = { inicio: string | null; termino: string | null };

export type ProximosPlazos<T extends Hito> = { plazos: T[]; estado: 'en_curso' | 'proximo' };

export function proximosPlazos<T extends Hito>(plazos: readonly T[], hoy: string): ProximosPlazos<T> | null {
  const conFecha = plazos
    .filter((p): p is T & { inicio: string; termino: string } => Boolean(p.inicio && p.termino))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  const enCurso = conFecha.filter((p) => p.inicio <= hoy && p.termino >= hoy);
  if (enCurso.length) return { plazos: enCurso, estado: 'en_curso' };
  const siguiente = conFecha.find((p) => p.inicio > hoy);
  if (!siguiente) return null;
  return { plazos: conFecha.filter((p) => p.inicio === siguiente.inicio), estado: 'proximo' };
}
