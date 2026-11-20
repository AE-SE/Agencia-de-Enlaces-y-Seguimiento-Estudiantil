import type { Metadata } from 'next';

import { CabeceraInterior } from '@/app/_componentes/CabeceraInterior';
import { MapaCarreras } from './MapaCarreras';

export const metadata: Metadata = {
  title: 'Dónde estudian y dónde hay empleo',
  description:
    'Por región: estudiantes nuevos de 2026 y empleo declarado al primer año de los titulados. Elaboración propia con datos del SIES y Mi Futuro.',
};

export default function PaginaMapa() {
  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina="mapa" titulo="Dónde estudian y dónde hay empleo">
        <p>
          Elige una carrera. Cada círculo es una región: más grande, más estudiantes nuevos en 2026. Solo muestra datos:
          no ordena ni recomienda carreras ni lugares.
        </p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina" className="contenido">
        <MapaCarreras />
      </main>
    </div>
  );
}
