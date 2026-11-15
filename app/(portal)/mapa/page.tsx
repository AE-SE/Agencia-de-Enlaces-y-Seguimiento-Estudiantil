import type { Metadata } from 'next';

import { MapaCarreras } from './MapaCarreras';

export const metadata: Metadata = {
  title: 'Dónde estudian y dónde hay empleo',
  description:
    'Por región: estudiantes nuevos de 2026 y empleo declarado al primer año de los titulados. Elaboración propia con datos del SIES y Mi Futuro.',
};

export default function PaginaMapa() {
  return (
    <main id="contenido" tabIndex={-1} className="contenido">
      <h1 className="text-titulo">Dónde estudian y dónde hay empleo</h1>
      <MapaCarreras />
    </main>
  );
}
