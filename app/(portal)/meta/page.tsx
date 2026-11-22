import type { Metadata } from 'next';

import { CabeceraInterior } from '@/app/_componentes/CabeceraInterior';
import { ListaMeta } from '@/app/_componentes/meta/ListaMeta';

import estilos from './meta.module.css';

export const metadata: Metadata = {
  title: 'Mi meta y mis preferencias',
  description: 'Tu meta y hasta dos preferencias más, guardadas solo en tu dispositivo.',
};

// La lista vive en el dispositivo: el servidor no recibe ni conoce lo que la persona guardó.
export default function PaginaMeta() {
  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina="meta" titulo="Mi meta y mis preferencias">
        <p>Tu meta y tus preferencias se guardan solo en este teléfono o computador. No las vemos nosotros. Si borras los datos del navegador, se pierden.</p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina" className={estilos.pagina}>
        <ListaMeta />
      </main>
    </div>
  );
}
