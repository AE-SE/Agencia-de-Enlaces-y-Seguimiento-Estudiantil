import estilos from './Boton.module.css';

type Props = { principal?: boolean; children: React.ReactNode; nota?: string };

// Se reemplaza por los componentes de app/_componentes cuando existan.
export function Boton({ principal = false, children, nota }: Props) {
  return (
    <button className={principal ? estilos.principal : estilos.secundario} disabled>
      {children}
      {nota ? <span className={estilos.nota}>{nota}</span> : null}
    </button>
  );
}
