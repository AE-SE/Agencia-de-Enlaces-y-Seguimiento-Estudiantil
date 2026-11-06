import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Configuración mínima: sin caché incremental ni colas, porque por ahora el portal
// solo tiene páginas estáticas. Se agrega cuando una página lo necesite.
export default defineCloudflareConfig();
