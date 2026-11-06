"use client";

import { useEffect, useState } from "react";
import { Aviso } from "@/app/_componentes/Aviso";
import { Boton } from "@/app/_componentes/Boton";
import { DatoOficial } from "@/app/_componentes/DatoOficial";
import { Encabezado } from "@/app/_componentes/Encabezado";
import { Enlace } from "@/app/_componentes/Enlace";
import type { Estacion } from "@/app/_componentes/IndicadorEstacion";
import { PiePagina } from "@/app/_componentes/PiePagina";
import estilos from "./galeria.module.css";

type Tema = "sistema" | "claro" | "oscuro";
const FUENTE = {
  nombre: "W3C, criterio 2.5.5",
  url: "https://www.w3.org/TR/2023/REC-WCAG22-20231005/#target-size-enhanced",
  fechaActualizacion: "2023-10-05",
};

export function GaleriaComponentes() {
  const [tema, setTema] = useState<Tema>("sistema");
  const [ampliado, setAmpliado] = useState(false);
  const [estacion, setEstacion] = useState<Estacion>(1);
  const [pruebas, setPruebas] = useState(0);

  useEffect(() => {
    const raiz = document.documentElement;
    const anterior = raiz.getAttribute("data-tema");
    const anteriorTamano = raiz.style.fontSize;
    if (tema === "sistema") raiz.removeAttribute("data-tema");
    else raiz.setAttribute("data-tema", tema);
    // Control de prueba local a esta guía; restaura las preferencias al salir.
    raiz.style.fontSize = ampliado ? "200%" : anteriorTamano;
    return () => {
      if (anterior === null) raiz.removeAttribute("data-tema");
      else raiz.setAttribute("data-tema", anterior);
      raiz.style.fontSize = anteriorTamano;
    };
  }, [tema, ampliado]);

  return (
    <div className={estilos.pagina}>
      <Encabezado estacionActual={estacion} navegacion={[{ href: "#botones", texto: "Botones" }, { href: "#avisos", texto: "Avisos" }, { href: "#datos", texto: "Datos" }]} />
      <main id="contenido" tabIndex={-1} className={estilos.contenido}>
        <h1 className="text-titulo">Guía de componentes</h1>
        <p>Prueba las piezas de la plataforma con teclado, texto ampliado y distintos temas.</p>
        <fieldset className={estilos.controles}>
          <legend>Opciones de prueba</legend>
          <label>Tema <select value={tema} onChange={e => setTema(e.target.value as Tema)}><option value="sistema">Según el sistema</option><option value="claro">Claro</option><option value="oscuro">Oscuro</option></select></label>
          <label className={estilos.casilla}><input type="checkbox" checked={ampliado} onChange={e => setAmpliado(e.target.checked)} />Ampliar texto al 200 %</label>
          <label>Estación actual <select value={estacion} onChange={e => setEstacion(Number(e.target.value) as Estacion)}><option value={1}>1 Explorar</option><option value={2}>2 Postular</option><option value={3}>3 Llegar</option><option value={4}>4 Avanzar</option></select></label>
        </fieldset>

        <section id="botones" className={estilos.seccion} aria-labelledby="titulo-botones">
          <h2 id="titulo-botones" className="text-subtitulo">Botones</h2>
          <div className={estilos.fila}>
            <Boton onClick={() => setPruebas(v => v + 1)}>Probar confirmación</Boton>
            <Boton variante="secundario" onClick={() => setPruebas(0)}>Restablecer demostración</Boton>
            <Boton disabled>Guardar cambios</Boton>
            <Boton variante="secundario" disabled>Comparar carreras</Boton>
          </div>
          <div role="status" aria-live="polite" aria-atomic="true">
            {pruebas > 0 && <Aviso tipo="exito" titulo="Botón probado"><p>Activaciones en esta demostración: {pruebas}. No se guardan datos.</p></Aviso>}
          </div>
        </section>

        <section className={estilos.seccion} aria-labelledby="titulo-enlaces">
          <h2 id="titulo-enlaces" className="text-subtitulo">Enlaces</h2>
          <p><Enlace href="#datos">Ir a los ejemplos de datos</Enlace></p>
          <p><Enlace href={FUENTE.url}>Consultar el criterio de tamaño táctil del W3C</Enlace></p>
        </section>

        <section id="datos" className={estilos.seccion} aria-labelledby="titulo-datos">
          <h2 id="titulo-datos" className="text-subtitulo">Dato oficial y ausencia de datos</h2>
          <p>La cifra siguiente corresponde a una norma de accesibilidad. No representa una carrera.</p>
          <DatoOficial valor="44 × 44 px" medida="Tamaño táctil de referencia" periodo="WCAG 2.2, criterio 2.5.5, nivel AAA" fuente={FUENTE} />
          <DatoOficial valor={null} medida="Empleabilidad al primer año" motivo="Esta demostración no contiene datos de carreras. Solo se mostrarán cifras cuando exista una fuente verificada." />
        </section>

        <section id="avisos" className={estilos.seccion} aria-labelledby="titulo-avisos">
          <h2 id="titulo-avisos" className="text-subtitulo">Avisos</h2>
          <p>Ejemplos de mensajes; no corresponden a una postulación real.</p>
          <Aviso tipo="exito" titulo="Cambios guardados"><p>Así se presenta una confirmación de éxito.</p></Aviso>
          <Aviso tipo="error" titulo="Falta elegir una carrera"><p>Elige una carrera para poder compararla.</p></Aviso>
          <Aviso tipo="plazo" titulo="Revisa el cierre de la postulación"><p>Consulta la fecha y los requisitos en la fuente oficial antes de postular.</p></Aviso>
        </section>

        <section className={estilos.seccion} aria-labelledby="titulo-trayecto">
          <h2 id="titulo-trayecto" className="text-subtitulo">Encabezado e indicador de estación</h2>
          <p>El encabezado muestra las cuatro estaciones. Cambia la estación en las opciones de prueba para revisar cada estado.</p>
          <p>La estación actual tiene la etiqueta «Estás aquí» y se identifica también para lectores de pantalla.</p>
        </section>

        <section id="privacidad" className={estilos.seccion} aria-labelledby="titulo-privacidad">
          <h2 id="titulo-privacidad" className="text-subtitulo">Privacidad</h2>
          <p>Esta guía no recopila datos personales ni guarda las opciones de prueba.</p>
          <Enlace href="https://github.com/JovenGit/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/blob/main/docs/privacidad.md">Consultar la documentación de privacidad del equipo</Enlace>
        </section>
        <section id="fuentes" className={estilos.seccion} aria-labelledby="titulo-fuentes">
          <h2 id="titulo-fuentes" className="text-subtitulo">Fuentes</h2>
          <p>La cifra del ejemplo procede de la recomendación del W3C del 5 de octubre de 2023.</p>
          <Enlace href={FUENTE.url}>Consultar la fuente de accesibilidad</Enlace>
        </section>
        <section id="contacto" className={estilos.seccion} aria-labelledby="titulo-contacto">
          <h2 id="titulo-contacto" className="text-subtitulo">Contacto</h2>
          <p>El canal público de contacto está pendiente de definición por el equipo.</p>
        </section>
      </main>
      <PiePagina privacidad="#privacidad" fuentes="#fuentes" contacto="#contacto" />
    </div>
  );
}
