import type { MetadataRoute } from "next";
import tokens from "@/diseno/tokens.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Agencia de Enlace & Seguimiento Estudiantil",
    short_name: "Agencia de Enlace",
    lang: "es-CL",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: tokens.color.claro.linea,
    background_color: tokens.color.claro.fondo,
    icons: [
      { src: "/iconos/icono-192.png", sizes: "192x192", type: "image/png" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png" },
      { src: "/iconos/icono-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
