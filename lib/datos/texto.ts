// El HTML usa minúsculas para que lectores de pantalla anuncien palabras, no letras.
export function textoParaLectura(texto: string): string {
  return texto.toLocaleLowerCase('es-CL');
}
