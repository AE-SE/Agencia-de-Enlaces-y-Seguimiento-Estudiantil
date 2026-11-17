// Tipos y orden de lectura de la página de preguntas frecuentes y glosario.
// Los textos viven en datos/ayuda/*.json, con la fuente y la fecha de consulta de cada uno.

export type FuenteDeAyuda = { nombre: string; url: string; fecha_consulta: string };

export type TerminoDelGlosario = {
  id: string;
  termino: string;
  sigla?: string;
  explicacion: string;
  fuentes: FuenteDeAyuda[];
};

export type Pregunta = {
  id: string;
  pregunta: string;
  respuesta: string[];
  enlaces: { texto: string; href: string }[];
  fuentes: FuenteDeAyuda[];
};

export type GrupoDePreguntas = { id: string; titulo: string; preguntas: Pregunta[] };

// «Notas de Enseñanza Media (NEM)»: el nombre completo y la sigla juntos, como pide lenguaje-claro.
export function nombreDelTermino(termino: TerminoDelGlosario): string {
  return termino.sigla ? `${termino.termino} (${termino.sigla})` : termino.termino;
}

// Orden alfabético por sigla o, si no tiene, por nombre: quien busca «NEM» lo encuentra en la N.
export function ordenarGlosario(terminos: TerminoDelGlosario[]): TerminoDelGlosario[] {
  const clave = (termino: TerminoDelGlosario) => termino.sigla ?? termino.termino;
  return [...terminos].sort((a, b) => clave(a).localeCompare(clave(b), 'es', { sensitivity: 'base' }));
}

// Cada texto de la página, en el orden en que una persona lo lee: el índice de preguntas, las
// respuestas con sus enlaces y fuentes, y al final el glosario. La prueba que revisa que cada
// sigla se explique la primera vez recorre este orden, así que la página debe respetarlo.
export function textosEnOrdenDeLectura(grupos: GrupoDePreguntas[], terminos: TerminoDelGlosario[]): string[] {
  const textos: string[] = [];
  for (const grupo of grupos) for (const pregunta of grupo.preguntas) textos.push(pregunta.pregunta);
  for (const grupo of grupos) {
    textos.push(grupo.titulo);
    for (const pregunta of grupo.preguntas) {
      textos.push(pregunta.pregunta, ...pregunta.respuesta);
      for (const enlace of pregunta.enlaces) textos.push(enlace.texto);
      for (const fuente of pregunta.fuentes) textos.push(fuente.nombre);
    }
  }
  for (const termino of ordenarGlosario(terminos)) {
    textos.push(nombreDelTermino(termino), termino.explicacion);
    for (const fuente of termino.fuentes) textos.push(fuente.nombre);
  }
  return textos;
}
