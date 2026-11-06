import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url));

// Evita que archivos de bloqueo ajenos al repositorio cambien la raíz del proyecto.
const configuracion = {
  // Conserva las directrices del equipo sin bloques añadidos por next dev.
  agentRules: false,
  turbopack: { root: raiz },
  outputFileTracingRoot: raiz,
};

export default configuracion;
