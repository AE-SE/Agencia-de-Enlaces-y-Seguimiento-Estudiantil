import type { Metadata } from "next";

import { CabeceraInterior } from "@/app/_componentes/CabeceraInterior";
import { Enlace } from "@/app/_componentes/Enlace";
import { ConSiglas } from "@/app/_componentes/Sigla";
import { fechaLarga } from "@/lib/datos/fechas";

import estilos from "./quienes-somos.module.css";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Qué es la Agencia de Enlace y Seguimiento Estudiantil, quiénes la hacemos, por qué la hicimos y cómo tratamos tus datos.",
};

// Cifras del SIES, Tabla 1, p. 8 (docs/quienes-somos.md). La resta es nuestra: se rotula «elaboración propia» (AGENTS.md 2.1).
const CONSULTA_SIES = "2026-11-13";
const URL_SIES = "https://www.mifuturo.cl/wp-content/uploads/2026/10/Informe-de-Acceso-a-la-Educaci%C3%B3n-Superior.pdf";

// Texto de docs/quienes-somos.md, «Texto de la página».
export default function QuienesSomos() {
  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina="quienes" titulo="Quiénes somos">
        <p>
          Una agencia independiente que reúne la información oficial de las carreras y la deja lista para comparar. Aquí te contamos quiénes somos, por qué la hicimos y qué hacemos con tus datos.
        </p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina" className={estilos.pagina}>
        <section className={estilos.seccion} aria-labelledby="que-es">
          <h2 id="que-es">Qué es la Agencia</h2>
          <p>
            La Agencia de Enlace y Seguimiento Estudiantil reúne en un solo lugar la información oficial de las carreras de educación superior en Chile. La explicamos y la dejamos lista para comparar.
          </p>
          {/* TODO(N10): reponer «y fijar una meta» al fusionar N10 */}
          <p>
            Aquí puedes buscar una carrera, compararla con otras y simular tu puntaje. Cada cifra dice qué mide, de qué organismo viene y en qué fecha la consultamos. Si una cifra la calculamos nosotros, lo decimos: «elaboración propia».
          </p>
          <p>Es gratis, no pide cuenta y no tiene avisos.</p>
          <p>
            Somos independientes. Ninguna universidad, instituto profesional ni centro de formación técnica paga por aparecer, por salir primero o por recibir un trato distinto. Cuando ordenamos carreras, te decimos con qué criterio.
          </p>
        </section>

        <section className={estilos.seccion} aria-labelledby="quienes">
          <h2 id="quienes">Quiénes la hacemos</h2>
          <p>Somos tres estudiantes de Ingeniería de Ejecución en Informática, mención Desarrollo de Sistemas, de AIEP, sede San Fernando:</p>
          {/* TODO(equipo): apellidos cuando Alejandro y Cristóbal confirmen */}
          <ul>
            <li><strong>Rafael</strong>: arquitectura del sitio y cuidado de los datos.</li>
            <li><strong>Alejandro</strong>: pantallas y pruebas con personas.</li>
            <li><strong>Cristóbal</strong>: datos oficiales y contenido.</li>
          </ul>
          <p>
            Hoy la Agencia es nuestro proyecto de título, que entregamos el 19 de diciembre de 2026. Todavía no es una empresa. En 2027 queremos formar una sociedad por acciones (SpA). Sus estatutos dirán que el sitio es gratis para ti y que nadie puede comprar un lugar en él.
          </p>
        </section>

        <section className={estilos.seccion} aria-labelledby="por-que">
          <h2 id="por-que">Por qué la hicimos</h2>
          <p>
            Casi una de cada dos personas que terminan 4.º medio no entra a la educación superior al año siguiente. De las 276.509 que egresaron en 2025, 139.272 ingresaron en 2026 (50,4 %). Las otras 137.237 (49,6 %) no lo hicieron.
          </p>
          <p className={estilos.fuente}>
            Fuente: Servicio de Información de Educación Superior (<ConSiglas texto="SIES" />), <Enlace href={URL_SIES}>Informe de Acceso a la Educación Superior en Chile 2026</Enlace>, Tabla 1, página 8. Consultado el <time dateTime={CONSULTA_SIES}>{fechaLarga(CONSULTA_SIES)}</time>. Las 137.237 personas y el 49,6 % son <strong>elaboración propia</strong>: la resta entre quienes egresaron y quienes ingresaron.
          </p>
          <p>
            Hay muchas razones para no entrar, y no sabemos cuántas tienen que ver con la información. Lo que sí sabemos es que, para decidir qué estudiar y dónde, hay que reunir datos que publican organismos distintos: el Departamento de Evaluación, Medición y Registro Educacional (<ConSiglas texto="DEMRE" />), el <ConSiglas texto="SIES" />, el Ministerio de Educación (<ConSiglas texto="Mineduc" />) y la Comisión Nacional de Acreditación (<ConSiglas texto="CNA" />). Hay que entender qué mide cada uno. Y muchas veces se hace después de egresar, sin nadie a cargo de orientarte.
          </p>
          <p>Queremos que ese trabajo te tome menos tiempo. Lo estamos midiendo con personas reales antes de decir que lo logramos.</p>
        </section>

        <section className={estilos.seccion} aria-labelledby="datos">
          <h2 id="datos">Cómo tratamos tus datos</h2>
          {/* TODO(N10): reponer las viñetas de la meta y el botón de borrar al fusionar N10 */}
          <ul>
            <li>Usas todo el sitio sin cuenta. No te pedimos tu nombre, tu RUT, tu edad, tu correo ni tu teléfono.</li>
            <li>Cuando simulas tu puntaje, el cálculo se hace en tu dispositivo. Tus puntajes no se envían ni se guardan.</li>
            <li>No vendemos datos.</li>
          </ul>
        </section>

        <section className={estilos.seccion} aria-labelledby="no-hace">
          <h2 id="no-hace">Lo que la Agencia no hace</h2>
          <ul>
            <li>No te asegura un cupo ni un beneficio. Eso lo deciden las instituciones y el Estado.</li>
            <li>No te dice qué estudiar. Te muestra la información para que decidas tú.</li>
            <li>No reemplaza a una orientadora o un orientador.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
