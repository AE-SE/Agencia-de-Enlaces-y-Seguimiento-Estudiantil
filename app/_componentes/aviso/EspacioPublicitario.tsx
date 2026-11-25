import { Enlace } from "@/app/_componentes/Enlace";
import estilos from "./EspacioPublicitario.module.css";

// ADR 0040: un aviso como máximo por página, solo en la portada, /beneficios y /preguntas.
// Hoy no hay anunciante: el espacio dice para qué sirve y cómo se eligen los avisos.
// Es contenido del propio sitio: nada de scripts, cookies ni iframes de terceros.
export function EspacioPublicitario() {
  return (
    <aside className={estilos.espacio} aria-label="Publicidad">
      <p className={estilos.rotulo}>Publicidad</p>
      <p className={estilos.texto}>
        Este espacio es para servicios educativos que no son instituciones de educación superior. Los avisos no usan tus datos.
      </p>
      <p className={estilos.texto}>
        <Enlace href="/quienes-somos#avisos">Cómo elegimos los avisos</Enlace>
      </p>
    </aside>
  );
}
