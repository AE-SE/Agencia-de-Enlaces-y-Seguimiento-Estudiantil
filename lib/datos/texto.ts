import tildes from './tildes.json' with { type: 'json' };

// El Map se crea una vez. El diccionario (datos/generar_tildes.py) sale solo de DEMRE y SIES: es presentación.
const TILDES = new Map<string, string>(Object.entries(tildes.palabras));
const PALABRA = /[\p{L}]+/gu;

// El HTML usa minúsculas para que lectores de pantalla anuncien palabras, no letras.
// Mineduc guarda los nombres sin tildes; aquí se les devuelve la que el DEMRE y el SIES publican.
// Lo que no está en el diccionario se deja tal cual (no se adivina una tilde).
export function textoParaLectura(texto: string): string {
  return texto.toLocaleLowerCase('es-CL').replace(PALABRA, (palabra) => TILDES.get(palabra) ?? palabra);
}
