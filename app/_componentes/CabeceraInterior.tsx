import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { Tren, ComparacionIlustrada, CalendarioIlustrado } from "./Tren";
import { IndicadorEstacion } from "./IndicadorEstacion";
import estilos from "./CabeceraInterior.module.css";

type Pagina = "carreras" | "comparador" | "beneficios" | "ficha";
const PARADAS = [
  { href: "/", nombre: "Inicio" },
  { href: "/carreras", nombre: "Carreras" },
  { href: "/comparador", nombre: "Comparador" },
  { href: "/beneficios", nombre: "Beneficios" },
];
const ILUSTRACIONES = { carreras: Tren, comparador: ComparacionIlustrada, beneficios: CalendarioIlustrado, ficha: Tren };

export function CabeceraInterior({ pagina, titulo, children, acciones }: { pagina: Pagina; titulo: string; children: ReactNode; acciones?: ReactNode }) {
  const ruta = pagina === "ficha" ? "/carreras" : `/${pagina}`;
  const Arte = ILUSTRACIONES[pagina];
  return (
    <>
      <header className={estilos.cabecera} data-cabecera-portal>
        <div className={estilos.marca}>
          <Link href="/" aria-label="Agencia de Enlace y Seguimiento Estudiantil, inicio">
            <Image src="/marca/logo-horizontal-oscuro.svg" alt="Agencia de Enlace & Seguimiento Estudiantil" width={1547} height={314} priority className={estilos.logo} />
          </Link>
        </div>
        <nav className={estilos.recorrido} aria-label="Recorrido del portal">
          {PARADAS.map(({ href, nombre }) => (
            <Link key={href} href={href} className={estilos.parada} aria-current={href === ruta ? "page" : undefined}>
              <span className={estilos.nodo} aria-hidden="true">{href === ruta ? <span className={estilos.tren}><Tren compacto /></span> : null}</span>
              <span>{nombre}</span>
            </Link>
          ))}
        </nav>
      </header>
      <section className={estilos.hero} aria-labelledby="titulo-pagina">
        <div className={estilos.interior}>
          <div className={estilos.texto}>
            <h1 id="titulo-pagina">{titulo}</h1>
            {children}
            <div className={estilos.etapas}><IndicadorEstacion actual={pagina === "beneficios" ? 2 : 1} /></div>
            {acciones}
          </div>
          <div className={estilos.arte} aria-hidden="true"><Arte /></div>
        </div>
      </section>
    </>
  );
}
