import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { Tren, ComparacionIlustrada, CalendarioIlustrado, FuentesIlustradas } from "./Tren";
import { IndicadorEstacion } from "./IndicadorEstacion";
import estilos from "./CabeceraInterior.module.css";

type Pagina = "carreras" | "comparador" | "beneficios" | "ficha" | "simulador" | "fuas" | "preguntas" | "hoja" | "ocupaciones" | "mapa";
const PARADAS = [
  { href: "/", nombre: "Inicio" },
  { href: "/carreras", nombre: "Carreras" },
  { href: "/comparador", nombre: "Comparador" },
  { href: "/beneficios", nombre: "Beneficios" },
];
// Parada exacta (aria-current="page") o parada madre (aria-current="true"); preguntas no cuelga de ninguna.
const PARADA_DE: Record<Pagina, { href: string; exacta: boolean } | null> = {
  carreras: { href: "/carreras", exacta: true },
  comparador: { href: "/comparador", exacta: true },
  beneficios: { href: "/beneficios", exacta: true },
  // La ficha conserva "page" en Carreras, como antes de este cambio (lo cubre tests/navegacion/cabeceras.spec.ts).
  ficha: { href: "/carreras", exacta: true },
  ocupaciones: { href: "/carreras", exacta: false },
  mapa: { href: "/carreras", exacta: false },
  hoja: { href: "/comparador", exacta: false },
  simulador: { href: "/beneficios", exacta: false },
  fuas: { href: "/beneficios", exacta: false },
  preguntas: null,
};
// Estación del recorrido; preguntas no es parte de la trayectoria y no lleva indicador.
const ESTACION: Record<Pagina, 1 | 2 | null> = {
  carreras: 1, ficha: 1, comparador: 1, hoja: 1, ocupaciones: 1, mapa: 1,
  beneficios: 2, simulador: 2, fuas: 2,
  preguntas: null,
};
const ILUSTRACIONES = {
  carreras: Tren, ficha: Tren, simulador: Tren, ocupaciones: Tren, mapa: Tren,
  comparador: ComparacionIlustrada, hoja: ComparacionIlustrada,
  beneficios: CalendarioIlustrado, fuas: CalendarioIlustrado,
  preguntas: FuentesIlustradas,
};

export function CabeceraInterior({ pagina, titulo, children, acciones }: { pagina: Pagina; titulo: string; children: ReactNode; acciones?: ReactNode }) {
  const parada = PARADA_DE[pagina];
  const estacion = ESTACION[pagina];
  const Arte = ILUSTRACIONES[pagina];
  return (
    <>
      <header className={estilos.cabecera} data-cabecera-portal>
        <div className={estilos.marca}>
          <Link href="/" aria-label="Agencia de Enlace y Seguimiento Estudiantil, inicio">
            <Image src="/marca/logo-horizontal-oscuro.svg" alt="Agencia de Enlace y Seguimiento Estudiantil" width={1547} height={314} priority className={estilos.logo} />
          </Link>
        </div>
        <nav className={estilos.recorrido} aria-label="Recorrido del portal">
          {PARADAS.map(({ href, nombre }) => (
            <Link key={href} href={href} className={estilos.parada} aria-current={href === parada?.href ? (parada.exacta ? "page" : "true") : undefined}>
              <span className={estilos.nodo} aria-hidden="true">{href === parada?.href ? <span className={estilos.tren}><Tren compacto /></span> : null}</span>
              <span>{nombre}</span>
            </Link>
          ))}
        </nav>
      </header>
      <section className={estilos.hero}>
        <div className={estilos.interior}>
          <div className={estilos.texto}>
            <h1 id="titulo-pagina">{titulo}</h1>
            {children}
            {estacion ? <div className={estilos.etapas}><IndicadorEstacion actual={estacion} /></div> : null}
            {acciones}
          </div>
          <div className={estilos.arte} aria-hidden="true"><Arte /></div>
        </div>
      </section>
    </>
  );
}
