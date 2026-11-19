import { Encabezado } from './_componentes/Encabezado';
import { Enlace } from './_componentes/Enlace';
import componentes from './_componentes/componentes.module.css';
import estilos from './no-encontrada.module.css';

// Reemplaza la página 404 de Next, que está en inglés y no deja volver al sitio.
// Ofrece las mismas entradas que el menú y el pie del portal.
const NAVEGACION = [
  { href: '/carreras', texto: 'Carreras' },
  { href: '/comparador', texto: 'Comparador' },
  { href: '/beneficios', texto: 'Beneficios y plazos' },
];

export const metadata = { title: 'Página no encontrada · Agencia de Enlace & Seguimiento Estudiantil' };

export default function PaginaNoEncontrada() {
  return (
    <>
      <Encabezado navegacion={NAVEGACION} />
      <main id="contenido" tabIndex={-1} className={estilos.pagina}>
        <h1>No encontramos esta página</h1>
        <p>Puede que la dirección esté mal escrita o que la página ya no exista.</p>
        <nav aria-label="Seguir en el sitio">
          <ul className={componentes.navegacion}>
            <li><Enlace href="/">Volver al inicio</Enlace></li>
            <li><Enlace href="/carreras">Explorar carreras</Enlace></li>
            <li><Enlace href="/preguntas">Ver preguntas frecuentes</Enlace></li>
          </ul>
        </nav>
      </main>
    </>
  );
}
