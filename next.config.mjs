import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url));

// Evita que archivos de bloqueo ajenos al repositorio cambien la raíz del proyecto.
const configuracion = {
  turbopack: { root: raiz },
  outputFileTracingRoot: raiz,
};

export default configuracion;
