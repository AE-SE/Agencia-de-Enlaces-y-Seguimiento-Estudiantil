import type { ButtonHTMLAttributes } from "react";
import estilos from "./componentes.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: "principal" | "secundario";
};

export function Boton({ variante = "principal", type = "button", className = "", disabled, children, ...props }: Props) {
  return (
    <button {...props} type={type} disabled={disabled} className={`${estilos.boton} ${estilos[variante]} ${className}`}>
      {children}{disabled && <span> (No disponible)</span>}
    </button>
  );
}
