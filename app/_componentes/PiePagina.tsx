import { Enlace } from "./Enlace";
import estilos from "./componentes.module.css";

type Props = { privacidad: string; fuentes: string; contacto: string };

export function PiePagina({ privacidad, fuentes, contacto }: Props) {
  return (
    <footer className={estilos.pie}>
      <nav aria-label="Información y contacto"><ul className={estilos.navegacion}>
        <li><Enlace href={privacidad}>Privacidad</Enlace></li>
        <li><Enlace href={fuentes}>Fuentes</Enlace></li>
        <li><Enlace href={contacto}>Contacto</Enlace></li>
      </ul></nav>
    </footer>
  );
}
