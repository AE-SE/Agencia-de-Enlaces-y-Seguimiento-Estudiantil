import type { Metadata } from "next";

// Página solo para la prueba de despliegue (A4): comprueba que una página con
// código de servidor corre en el plan gratuito de Cloudflare. Se borra al terminar.
export const metadata: Metadata = {
  title: "Prueba de servidor | Agencia de Enlace",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function PruebaServidor() {
  const ahora = new Date().toISOString();
  return (
    <main id="contenido" tabIndex={-1} className="portada">
      <h1 className="text-titulo">Prueba de servidor</h1>
      <p>Esta página se genera en cada visita. Hora del servidor: {ahora}</p>
    </main>
  );
}
