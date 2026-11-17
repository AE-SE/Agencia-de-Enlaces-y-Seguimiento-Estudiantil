import glosario from "@/datos/ayuda/glosario.json";
import type { TerminoDelGlosario } from "@/lib/datos/ayuda";
import estilos from "./componentes.module.css";

const TERMINOS: TerminoDelGlosario[] = glosario.terminos;
const SIGLAS = TERMINOS.flatMap((termino) => (termino.sigla ? [termino.sigla] : []));
// Con paréntesis de captura, split() deja las siglas en las posiciones impares.
const PATRON = new RegExp(`\\b(${SIGLAS.join("|")})\\b`);

// <abbr> con el nombre completo en `title`. El `title` no aparece en pantallas táctiles ni lo
// leen todos los lectores de pantalla, así que la primera vez que una sigla aparece en una
// página el texto igual lleva el nombre completo (lenguaje-claro, regla 4).
export function Sigla({ sigla }: { sigla: string }) {
  const termino = TERMINOS.find((candidato) => candidato.sigla === sigla);
  if (!termino) throw new Error(`La sigla «${sigla}» no está en datos/ayuda/glosario.json.`);
  return <abbr className={estilos.sigla} title={termino.termino}>{sigla}</abbr>;
}

// Envuelve en <Sigla> cada sigla del glosario que aparezca dentro de un texto corrido.
export function ConSiglas({ texto }: { texto: string }) {
  return <>{texto.split(PATRON).map((parte, indice) => (indice % 2 === 1 ? <Sigla key={indice} sigla={parte} /> : parte))}</>;
}
