import type { Metadata } from "next";
import Link from "next/link";
import estilos from "./tipografia.module.css";

export const metadata: Metadata = {
  title: "Prueba de tipografía | Agencia de Enlace",
  robots: { index: false, follow: false },
};

export default function PruebaTipografia() {
  return (
    <main id="contenido" tabIndex={-1} className={`portada ${estilos.prueba}`}>
      <Link href="/" className={estilos.enlace}>Volver al inicio</Link>
      <h1 className="text-titulo">Prueba de tipografía</h1>
      <p>Revisa las letras, los signos y las cifras. Todos son ejemplos para comprobar que puedes leerlos con claridad.</p>

      <section className={estilos.seccion} aria-labelledby="caracteres">
        <h2 id="caracteres" className="text-destacado">Letras y signos del español</h2>
        <p>á é í ó ú Á É Í Ó Ú · ü Ü · ñ Ñ · ¿ ¡ · « » · $</p>
        <p><strong>á é í ó ú Á É Í Ó Ú · ü Ü · ñ Ñ · ¿ ¡ · « » · $</strong></p>
        <p className={estilos.cifras}>á é í ó ú Á É Í Ó Ú · ü Ü · ñ Ñ · ¿ ¡ · « » · $</p>
        <p>¿Qué camino quieres explorar? ¡Tú eliges! «Educación», «año» y «pingüino» incluyen signos y letras para revisar.</p>
      </section>

      <section className={estilos.seccion} aria-labelledby="lectura">
        <h2 id="lectura" className="text-destacado">Lectura de un párrafo largo</h2>
        <p>Antes de postular, puedes revisar las opciones que te interesan y anotar tus preguntas. Compara las carreras, sus jornadas y los lugares donde se imparten. Lee los requisitos con calma y vuelve a la información cuando lo necesites. Si un término no queda claro, busca su explicación o pide ayuda. Puedes ampliar el texto de esta página para comprobar que las palabras siguen completas y que cada línea se lee con comodidad.</p>
      </section>

      <section className={estilos.seccion} aria-labelledby="montos">
        <h2 id="montos" className="text-destacado">Cifras en pesos chilenos</h2>
        <table className={estilos.tabla}>
          <caption>Ejemplos ficticios para probar la tipografía; no representan aranceles reales.</caption>
          <thead><tr><th scope="col">Ejemplo</th><th scope="col">Monto (pesos chilenos)</th></tr></thead>
          <tbody>
            <tr><th scope="row">Primero</th><td>$4.250.000</td></tr>
            <tr><th scope="row">Segundo</th><td>$850.000</td></tr>
            <tr><th scope="row">Tercero</th><td>$12.345</td></tr>
          </tbody>
        </table>
        <p className={estilos.cifras}>0123456789 · $4.250.000</p>
      </section>
    </main>
  );
}
