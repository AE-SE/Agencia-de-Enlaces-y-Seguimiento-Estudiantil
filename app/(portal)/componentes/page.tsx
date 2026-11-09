import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GaleriaComponentes } from "./GaleriaComponentes";

// Guía interna del equipo: en producción no se publica (AGENTS.md 2.5, guía viva).
// En desarrollo sigue disponible en /componentes.
export const metadata: Metadata = {
  title: "Componentes | Agencia de Enlace",
  robots: { index: false, follow: false },
};

export default function Componentes() {
  if (process.env.NODE_ENV === "production") notFound();
  return <GaleriaComponentes />;
}
