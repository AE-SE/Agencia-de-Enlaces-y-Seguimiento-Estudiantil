import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import estilos from "./componentes.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: "principal" | "secundario";
  // Si viene, se dibuja un enlace con el mismo aspecto de botón.
  href?: string;
};

export function Boton({ variante = "principal", type = "button", className = "", disabled, children, href, ...props }: Props) {
  const clase = `${estilos.boton} ${estilos[variante]} ${className}`;
  if (href) return <Link href={href} className={clase}>{children as ReactNode}</Link>;
  return (
    <button {...props} type={type} disabled={disabled} className={clase}>
      {children}{disabled && <span> (No disponible)</span>}
    </button>
  );
}
