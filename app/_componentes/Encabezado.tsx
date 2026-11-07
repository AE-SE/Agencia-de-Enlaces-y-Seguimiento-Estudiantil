import Image from "next/image";
import { Enlace } from "./Enlace";
import { IndicadorEstacion, type Estacion } from "./IndicadorEstacion";
import estilos from "./componentes.module.css";

type Props = {
  estacionActual: Estacion;
  navegacion: { href: string; texto: string }[];
};

export function Encabezado({ estacionActual, navegacion }: Props) {
  return (
    <header className={estilos.encabezado}>
      <Enlace href="/" aria-label="Agencia de Enlace & Seguimiento Estudiantil: inicio">
        <Image className={`${estilos.logo} ${estilos.logoClaro}`} src="/marca/logo-horizontal.svg" alt="Agencia de Enlace & Seguimiento Estudiantil" width={1547} height={314} />
        <Image className={`${estilos.logo} ${estilos.logoOscuro}`} src="/marca/logo-horizontal-oscuro.svg" alt="Agencia de Enlace & Seguimiento Estudiantil" width={1547} height={314} />
      </Enlace>
      <nav aria-label="Navegación principal"><ul className={estilos.navegacion}>{navegacion.map(enlace => <li key={enlace.href}><Enlace href={enlace.href}>{enlace.texto}</Enlace></li>)}</ul></nav>
      <IndicadorEstacion actual={estacionActual} />
    </header>
  );
}
