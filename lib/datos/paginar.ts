// Pide de a `porPagina` filas hasta que una página venga incompleta. Sin dependencias: se prueba sola.
// Si la última página trae justo `porPagina` filas, se pide una más (vacía) para confirmar que no hay otra.
export async function paginar<F>(
  consultarPagina: (desde: number, porPagina: number) => Promise<{ filas: F[] }>,
  porPagina: number,
): Promise<{ filas: F[] }> {
  const filas: F[] = [];
  for (let desde = 0; ; desde += porPagina) {
    const pagina = await consultarPagina(desde, porPagina);
    filas.push(...pagina.filas);
    if (pagina.filas.length < porPagina) return { filas };
  }
}
