import Link from 'next/link';

import estilos from './Boton.module.css';

type Props = { principal?: boolean; children: React.ReactNode; nota?: string; href?: string };

// Se reemplaza por los componentes de app/_componentes cuando existan.
export function Boton({ principal = false, children, nota, href }: Props) {
  const clase = principal ? estilos.principal : estilos.secundario;

  if (href) return <Link className={clase} href={href}>{children}</Link>;

  return (
    <button className={clase} disabled>
      {children}
      {nota ? <span className={estilos.nota}>{nota}</span> : null}
    </button>
  );
}
