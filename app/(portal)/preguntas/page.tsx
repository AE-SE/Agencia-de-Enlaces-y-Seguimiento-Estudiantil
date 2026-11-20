import type { Metadata } from "next";

import { CabeceraInterior } from "@/app/_componentes/CabeceraInterior";
import { Enlace } from "@/app/_componentes/Enlace";
import { ConSiglas } from "@/app/_componentes/Sigla";
import glosario from "@/datos/ayuda/glosario.json";
import preguntas from "@/datos/ayuda/preguntas.json";
import {
  nombreDelTermino,
  ordenarGlosario,
  type FuenteDeAyuda,
  type GrupoDePreguntas,
  type TerminoDelGlosario,
} from "@/lib/datos/ayuda";
import { fechaLarga } from "@/lib/datos/fechas";

import estilos from "./preguntas.module.css";

export const metadata: Metadata = {
  title: "Preguntas frecuentes y glosario",
  description: "Respuestas breves, con su fuente oficial, sobre puntaje, beneficios, instituciones y cifras de las carreras.",
};

const GRUPOS: GrupoDePreguntas[] = preguntas.grupos;
const TERMINOS: TerminoDelGlosario[] = ordenarGlosario(glosario.terminos);

// Cada fuente lleva su fecha de consulta (AGENTS.md 2.1).
function Fuentes({ fuentes }: { fuentes: FuenteDeAyuda[] }) {
  return (
    <>
      <p className={estilos.rotulo}>{fuentes.length === 1 ? "Fuente" : "Fuentes"}</p>
      <ul className={estilos.fuentes}>
        {fuentes.map((fuente) => (
          <li key={fuente.url}>
            <Enlace href={fuente.url}>{fuente.nombre}</Enlace>
            <span className={estilos.consulta}>Consultada el <time dateTime={fuente.fecha_consulta}>{fechaLarga(fuente.fecha_consulta)}</time>.</span>
          </li>
        ))}
      </ul>
    </>
  );
}

// El orden de lectura de esta página está fijado en textosEnOrdenDeLectura (lib/datos/ayuda.ts):
// una prueba revisa que cada sigla se explique la primera vez que aparece.
export default function PreguntasFrecuentes() {
  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina="preguntas" titulo="Preguntas frecuentes">
        <p>
          Respuestas cortas a dudas comunes sobre el puntaje, los beneficios, las instituciones y las cifras de una carrera. Cada respuesta dice de dónde sale la información y cuándo la consultamos.
        </p>
        <p>
          ¿Buscas una sigla o un término? Está en el <Enlace href="#glosario">glosario</Enlace>, al final de esta página.
        </p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina" className={estilos.pagina}>

        <nav className={estilos.indice} aria-labelledby="indice">
          <h2 id="indice">En esta página</h2>
          <ol>
            {GRUPOS.map((grupo) => (
              <li key={grupo.id}>
                <h3>{grupo.titulo}</h3>
                <ul>
                  {grupo.preguntas.map((pregunta) => (
                    <li key={pregunta.id}><Enlace href={`#${pregunta.id}`}>{pregunta.pregunta}</Enlace></li>
                  ))}
                </ul>
              </li>
            ))}
            <li><Enlace href="#glosario">Glosario</Enlace></li>
          </ol>
        </nav>

        {GRUPOS.map((grupo) => (
          <section key={grupo.id} className={estilos.grupo} aria-labelledby={`grupo-${grupo.id}`}>
            <h2 id={`grupo-${grupo.id}`}>{grupo.titulo}</h2>
            {grupo.preguntas.map((pregunta) => (
              <article key={pregunta.id} id={pregunta.id} className={estilos.pregunta}>
                <h3><ConSiglas texto={pregunta.pregunta} /></h3>
                {pregunta.respuesta.map((parrafo, indice) => (
                  <p key={indice}><ConSiglas texto={parrafo} /></p>
                ))}
                {pregunta.enlaces.length > 0 ? (
                  <>
                    <p className={estilos.rotulo}>Para seguir</p>
                    <ul className={estilos.para}>
                      {pregunta.enlaces.map((enlace) => (
                        <li key={enlace.href}><Enlace href={enlace.href}>{enlace.texto}</Enlace></li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <Fuentes fuentes={pregunta.fuentes} />
              </article>
            ))}
          </section>
        ))}

        <section id="glosario" className={estilos.glosario} aria-labelledby="titulo-glosario">
          <h2 id="titulo-glosario">Glosario</h2>
          <p>Siglas y términos que verás en el sitio, con una explicación simple y su fuente.</p>
          <dl>
            {TERMINOS.map((termino) => (
              <div key={termino.id} id={`glosario-${termino.id}`} className={estilos.termino}>
                <dt>{nombreDelTermino(termino)}</dt>
                <dd>
                  <p><ConSiglas texto={termino.explicacion} /></p>
                  <Fuentes fuentes={termino.fuentes} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className={estilos.nota}>
          Estas respuestas resumen las fuentes que citan y no las reemplazan. Si algo no coincide, vale la fuente oficial.
        </p>
      </main>
    </div>
  );
}
