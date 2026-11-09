// Páginas del portal que se revisan. Al agregar una página pública nueva, súmala aquí.
// No se incluyen las páginas de prueba interna (prueba-servidor, prueba-tipografia).
export const RUTAS: { ruta: string; nombre: string }[] = [
  { ruta: "/", nombre: "Portada" },
  { ruta: "/carreras", nombre: "Explorador de carreras" },
  { ruta: "/carreras/universidad-de-chile/enfermeria-santiago", nombre: "Ficha de carrera" },
  { ruta: "/comparador", nombre: "Comparador" },
  { ruta: "/beneficios", nombre: "Beneficios y plazos" },
  { ruta: "/componentes", nombre: "Galería de componentes" },
];

// Etiquetas de reglas axe que cubren WCAG 2.2 nivel AA (AGENTS.md 2.6).
export const ETIQUETAS_WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
