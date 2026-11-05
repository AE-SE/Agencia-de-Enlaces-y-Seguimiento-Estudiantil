/** Convierte nombres visibles en segmentos de URL estables y legibles. */
export function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Agrega el código SIES solo cuando dos valores tendrían el mismo segmento. */
export function slugUnico(texto: string, codigoSies: string, valores: readonly string[]): string {
  const resultado = slug(texto);
  return valores.filter((valor) => slug(valor) === resultado).length > 1
    ? `${resultado}-${slug(codigoSies)}`
    : resultado;
}
