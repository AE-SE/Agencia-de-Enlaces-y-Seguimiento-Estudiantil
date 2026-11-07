import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { AnchorHTMLAttributes } from "react";
import estilos from "./componentes.module.css";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & { href: string };

export function Enlace({ href, className = "", children, ...props }: Props) {
  const externo = /^https?:\/\//i.test(href);
  return (
    <Link {...props} href={href} className={`${estilos.enlace} ${className}`} target={externo ? "_blank" : undefined} rel={externo ? "noopener noreferrer" : undefined}>
      {children}
      {externo && <><ExternalLink className={estilos.icono} aria-hidden="true" /><span className={estilos.soloLectores}> (se abre en otra pestaña)</span></>}
    </Link>
  );
}
