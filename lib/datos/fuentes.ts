// Nombre completo de las fuentes oficiales, para explicar la sigla la primera vez
// que la ve el estudiante (AGENTS.md 2.6). Si aparece una fuente nueva sin nombre
// aquí, se muestra solo su sigla en vez de inventar el nombre.
const NOMBRES: Record<string, string> = {
  'Mi Futuro': 'Mi Futuro, del Servicio de Información de Educación Superior (SIES)',
  DEMRE: 'Departamento de Evaluación, Medición y Registro Educacional (DEMRE)',
  'Datos Abiertos Mineduc': 'Datos Abiertos del Ministerio de Educación (Mineduc)',
};

export function nombreDeFuente(sigla: string): string {
  return NOMBRES[sigla] ?? sigla;
}
