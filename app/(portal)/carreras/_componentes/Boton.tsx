import estilos from './Boton.module.css';

type Props = { principal?: boolean; children: React.ReactNode };

// Se reemplaza por los componentes de app/_componentes cuando existan.
export function Boton({ principal = false, children }: Props) {
  return (
    <button className={principal ? estilos.principal : estilos.secundario} disabled>
      {children}
    </button>
  );
}
