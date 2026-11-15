"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Tren, ComparacionIlustrada, CalendarioIlustrado, FuentesIlustradas } from "./Tren";
import estilos from "./Portada.module.css";

const ESTACIONES = [
  { id: "explorar", nombre: "Explorar" },
  { id: "comparar", nombre: "Comparar" },
  { id: "beneficios", nombre: "Beneficios" },
  { id: "fuentes", nombre: "Fuentes" },
] as const;

const ENLACES = [
  { href: "/carreras", texto: "Carreras" },
  { href: "/comparador", texto: "Comparador" },
  { href: "/beneficios", texto: "Beneficios y plazos" },
] as const;

export function NavegacionPortal({ actual }: { actual?: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function cerrarFuera(evento: PointerEvent) {
      if (menu.current && !menu.current.contains(evento.target as Node)) menu.current.open = false;
    }
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, []);

  return (
    <div className={estilos.navegacion}>
      <Link href="/" aria-label="Agencia de Enlace y Seguimiento Estudiantil, inicio"><Image src="/marca/logo-horizontal-oscuro.svg" alt="Agencia de Enlace & Seguimiento Estudiantil" width={1547} height={314} priority className={estilos.logo} /></Link>
      <nav className={estilos.menuEscritorio} aria-label="Navegación principal">
        {ENLACES.map(({ href, texto }) => <Link key={href} href={href} aria-current={actual === href ? "page" : undefined}>{texto}</Link>)}
      </nav>
      <details key={actual ?? "/"} ref={menu} className={estilos.menuMovil} onKeyDown={(evento) => {
        if (evento.key === "Escape") {
          evento.preventDefault();
          evento.currentTarget.open = false;
          evento.currentTarget.querySelector("summary")?.focus();
        }
      }} onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) evento.currentTarget.open = false;
      }}><summary>Menú</summary><nav aria-label="Navegación móvil">
        {ENLACES.map(({ href, texto }) => <Link key={href} href={href} aria-current={actual === href ? "page" : undefined}>{texto}</Link>)}
      </nav></details>
    </div>
  );
}

export function CabeceraViaje() {
  const cabecera = useRef<HTMLElement>(null);
  const via = useRef<HTMLDivElement>(null);
  const tren = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const encabezado = cabecera.current;
    const contenedor = encabezado?.parentElement;
    if (!encabezado || !contenedor) return;
    const reduccion = matchMedia("(prefers-reduced-motion: reduce)");
    const secciones = ESTACIONES.map(({ id }) => document.getElementById(id));
    let posiciones: number[] = [];
    let anchoVia = 0;
    let cuadro = 0;

    function medir() {
      if (!via.current) return;
      contenedor!.style.setProperty("--alto-cabecera-portal", `${encabezado!.getBoundingClientRect().height}px`);
      const limite = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      posiciones = secciones.map(seccion => seccion ? Math.min(limite, Math.max(0,
        seccion.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(seccion).scrollMarginBlockStart),
      )) : 0);
      anchoVia = via.current.clientWidth;
    }

    function actualizar() {
      cuadro = 0;
      if (!tren.current) return;
      // Compensa el redondeo del desplazamiento al navegar a un ancla.
      const referencia = scrollY + 1;
      let indice = 0;
      for (let i = 1; i < posiciones.length; i++) if (referencia >= posiciones[i]) indice = i;
      const siguiente = posiciones[indice + 1];
      const avance = siguiente === undefined ? 0 : Math.min(1, Math.max(0, (referencia - posiciones[indice]) / Math.max(1, siguiente - posiciones[indice])));
      const progreso = (indice + (reduccion.matches ? 0 : avance)) / (ESTACIONES.length - 1);
      tren.current.style.transform = `translate3d(${progreso * anchoVia}px, 0, 0)`;
      setActual(anterior => anterior === indice ? anterior : indice);
    }

    function programar() {
      if (!cuadro) cuadro = requestAnimationFrame(actualizar);
    }

    function redimensionar() {
      medir();
      programar();
    }

    medir();
    encabezado.dataset.medida = "";
    programar();
    const observador = new ResizeObserver(redimensionar);
    observador.observe(encabezado);
    observador.observe(contenedor);
    addEventListener("scroll", programar, { passive: true });
    addEventListener("resize", redimensionar);
    reduccion.addEventListener("change", programar);
    return () => {
      observador.disconnect();
      delete encabezado.dataset.medida;
      contenedor.style.removeProperty("--alto-cabecera-portal");
      cancelAnimationFrame(cuadro);
      removeEventListener("scroll", programar);
      removeEventListener("resize", redimensionar);
      reduccion.removeEventListener("change", programar);
    };
  }, []);

  return (
    <header ref={cabecera} className={estilos.cabecera}>
      <NavegacionPortal />
      <nav className={estilos.recorrido} aria-label="Estaciones de esta página">
        <div className={estilos.via} ref={via}>
          <div ref={tren} className={estilos.trenPosicion} data-tren><Tren compacto /></div>
          {ESTACIONES.map(({ id, nombre }, indice) => <a key={id} href={`#${id}`} aria-current={actual === indice ? "location" : undefined} className={estilos.parada}><span aria-hidden="true" /><span>{nombre}</span></a>)}
        </div>
      </nav>
    </header>
  );
}

const DIAPOSITIVAS = [
  { titulo: "Elige dónde empieza tu camino.", texto: "Explora carreras, instituciones y lugares para estudiar.", accion: "Encontrar una carrera", href: "/carreras", clase: "laminaExplorar", Arte: Tren },
  { titulo: "Mira tus opciones en perspectiva.", texto: "Pon hasta tres carreras frente a frente con datos oficiales.", accion: "Comparar carreras", href: "/comparador", clase: "laminaComparar", Arte: ComparacionIlustrada },
  { titulo: "Haz espacio para tu próxima oportunidad.", texto: "Revisa beneficios, requisitos y plazos de postulación.", accion: "Ver beneficios y plazos", href: "/beneficios", clase: "laminaBeneficios", Arte: CalendarioIlustrado },
  { titulo: "Sigue la línea hasta la fuente.", texto: "Conoce de dónde viene la información que te ayuda a decidir.", accion: "Consultar las fuentes", href: "#fuentes", clase: "laminaFuentes", Arte: FuentesIlustradas },
] as const;

export function Carrusel() {
  const pista = useRef<HTMLDivElement>(null);
  const cuadroScroll = useRef(0);
  const [actual, setActual] = useState(0);
  const [mejorado, setMejorado] = useState(false);
  useEffect(() => {
    const cuadro = requestAnimationFrame(() => setMejorado(true));
    return () => {
      cancelAnimationFrame(cuadro);
      cancelAnimationFrame(cuadroScroll.current);
    };
  }, []);

  function actualizarPorScroll() {
    if (cuadroScroll.current) return;
    cuadroScroll.current = requestAnimationFrame(() => {
      cuadroScroll.current = 0;
      const elemento = pista.current;
      if (!elemento?.clientWidth) return;
      const indice = Math.max(0, Math.min(DIAPOSITIVAS.length - 1, Math.round(elemento.scrollLeft / elemento.clientWidth)));
      setActual(anterior => anterior === indice ? anterior : indice);
    });
  }

  function ir(indice: number) {
    const destino = Math.max(0, Math.min(DIAPOSITIVAS.length - 1, indice));
    pista.current?.scrollTo({ left: destino * pista.current.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function teclado(evento: KeyboardEvent<HTMLDivElement>) {
    if ((evento.target as HTMLElement).closest("a")) return;
    const destinos: Record<string, number> = { ArrowLeft: actual - 1, ArrowRight: actual + 1, Home: 0, End: DIAPOSITIVAS.length - 1 };
    if (!(evento.key in destinos)) return;
    evento.preventDefault();
    ir(destinos[evento.key]);
  }

  return (
    <div className={estilos.carrusel} role="region" aria-roledescription="carrusel" aria-label="Encuentra tu próximo paso" onKeyDown={teclado}>
      <div className={estilos.pista} ref={pista} tabIndex={0} aria-label="Diapositivas. Usa las flechas para avanzar o retroceder." onScroll={actualizarPorScroll}>
        {DIAPOSITIVAS.map(({ titulo, texto, accion, href, clase, Arte }, indice) => (
          <div key={href} role="group" aria-roledescription="diapositiva" aria-label={`${indice + 1} de ${DIAPOSITIVAS.length}`} aria-hidden={mejorado && actual !== indice ? true : undefined} className={`${estilos.lamina} ${estilos[clase]}`}>
            <div className={estilos.arteLamina}><Arte /></div>
            <div className={estilos.textoLamina}><h2>{titulo}</h2><p>{texto}</p><Link href={href} tabIndex={mejorado && actual !== indice ? -1 : undefined}>{accion}<ArrowUpRight aria-hidden="true" /></Link></div>
          </div>
        ))}
      </div>
      <div className={estilos.controlesCarrusel} hidden={!mejorado}>
        <button type="button" onClick={() => ir(actual - 1)} disabled={actual === 0} aria-label="Diapositiva anterior"><ArrowLeft aria-hidden="true" /></button>
        <div className={estilos.indicadores}>{DIAPOSITIVAS.map((item, indice) => <button type="button" key={item.href} aria-label={`Ir a diapositiva ${indice + 1}`} aria-pressed={actual === indice} onClick={() => ir(indice)}><span /></button>)}</div>
        <span className={estilos.cuentaCarrusel} aria-hidden="true">{actual + 1} / {DIAPOSITIVAS.length}</span>
        <button type="button" onClick={() => ir(actual + 1)} disabled={actual === DIAPOSITIVAS.length - 1} aria-label="Diapositiva siguiente"><ArrowRight aria-hidden="true" /></button>
      </div>
      <p className={estilos.soloLectores} role="status" aria-live="polite" aria-atomic="true">Diapositiva {actual + 1} de {DIAPOSITIVAS.length}: {DIAPOSITIVAS[actual].titulo}</p>
    </div>
  );
}
