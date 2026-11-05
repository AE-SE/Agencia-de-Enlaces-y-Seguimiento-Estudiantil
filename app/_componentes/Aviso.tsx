import type { ReactNode } from "react";
import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react";
import estilos from "./componentes.module.css";

type Props = { tipo: "exito" | "error" | "plazo"; titulo: string; children: ReactNode; anunciar?: boolean };
const ICONOS = { exito: CircleCheck, error: CircleAlert, plazo: TriangleAlert };
const PALABRAS = { exito: "Éxito", error: "Error", plazo: "Atención al plazo" };

export function Aviso({ tipo, titulo, children, anunciar = false }: Props) {
  const Icono = ICONOS[tipo];
  return (
    <div className={`${estilos.aviso} ${estilos[tipo]}`} role={anunciar ? (tipo === "error" ? "alert" : "status") : undefined}>
      <p className={estilos.tituloAviso}><Icono className={estilos.icono} aria-hidden="true" /><strong>{PALABRAS[tipo]}: {titulo}</strong></p>
      <div>{children}</div>
    </div>
  );
}
