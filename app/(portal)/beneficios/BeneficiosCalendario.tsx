"use client";

import { useMemo, useState } from "react";
import { ArrowDown, CircleCheck, Clock, Search, type LucideIcon } from "lucide-react";

import { Aviso } from "@/app/_componentes/Aviso";
import { CabeceraInterior } from "@/app/_componentes/CabeceraInterior";
import { Enlace } from "@/app/_componentes/Enlace";
import { fechaLarga } from "@/lib/datos/fechas";

import { filtrarBeneficios, plazosPorVigencia, type Beneficio, type EstadoDeHito, type HitoConEstado, type Plazo } from "./beneficios";
import estilos from "./beneficios.module.css";

type Props = { beneficios: Beneficio[]; plazos: Plazo[]; admision: Plazo[]; hoy: string };

// Mismas palabras e íconos que /fuas. El estado va en texto, no solo en un color (AGENTS.md 2.5).
// «Más adelante» no lleva etiqueta; «sin fecha» ya tiene su aviso de fecha pendiente.
const ETIQUETA: Partial<Record<EstadoDeHito, { texto: string; Icono: LucideIcon }>> = {
  en_curso: { texto: "Está en curso", Icono: Clock },
  proximo: { texto: "Próximo plazo", Icono: Clock },
  paso: { texto: "Ya pasó", Icono: CircleCheck },
};

function EstadoDelPlazo({ estado }: { estado: EstadoDeHito }) {
  const etiqueta = ETIQUETA[estado];
  if (!etiqueta) return null;
  return <p className={estilos.estadoPlazo}><etiqueta.Icono aria-hidden="true" /><strong>{etiqueta.texto}</strong></p>;
}

function Fuente({ fuente, url, fecha }: { fuente: string; url: string; fecha: string }) {
  return (
    <p className={estilos.fuente}>
      Fuente: <Enlace href={url}>{fuente}</Enlace><br />
      URL: <Enlace href={url}>{url}</Enlace><br />
      Consultada el <time dateTime={fecha}>{fechaLarga(fecha)}</time>
    </p>
  );
}

// En los calendarios, una línea por hito, como «Tus próximos plazos» de /meta: el enlace lleva a la URL exacta.
// La URL escrita entera ocupaba dos o tres líneas en el teléfono, en cada uno de los 22 hitos.
function FuenteDeHito({ fuente, url, fecha }: { fuente: string; url: string; fecha: string }) {
  return (
    <p className={estilos.fuente}>
      Fuente: <Enlace href={url}>{fuente}</Enlace>. Consultada el <time dateTime={fecha}>{fechaLarga(fecha)}</time>.
    </p>
  );
}

function RangoDeFechas({ plazo }: { plazo: Plazo }) {
  if (!plazo.inicio || !plazo.termino) {
    return (
      <Aviso tipo="plazo" titulo="Fecha pendiente">
        <p>{plazo.motivo_sin_fecha}</p>
        {plazo.periodo_referencial ? <p>Referencia: {plazo.periodo_referencial}.</p> : null}
      </Aviso>
    );
  }

  // Un hito de un solo día (por ejemplo, una publicación de resultados) tiene inicio y término iguales.
  if (plazo.inicio === plazo.termino) {
    return <p><strong>Fecha:</strong> <time dateTime={plazo.inicio}>{fechaLarga(plazo.inicio)}</time>.</p>;
  }

  return <p><strong>Fecha:</strong> <time dateTime={plazo.inicio}>{fechaLarga(plazo.inicio)}</time> al <time dateTime={plazo.termino}>{fechaLarga(plazo.termino)}</time>.</p>;
}

function ListaDePlazos({ plazos }: { plazos: HitoConEstado[] }) {
  return (
    <ol className={estilos.listaPlazos}>
      {plazos.map(({ plazo, estado }) => (
        <li key={plazo.codigo} className={estilos.plazo} data-reveal="plazo" data-estado={estado}>
          <div className={estilos.resumenPlazo}>
            <h3>{plazo.proceso}</h3>
            <EstadoDelPlazo estado={estado} />
            <p>{plazo.descripcion}</p>
          </div>
          <div className={estilos.fechaPlazo}><RangoDeFechas plazo={plazo} /></div>
          <FuenteDeHito fuente={plazo.fuente} url={plazo.url} fecha={plazo.fecha_consulta} />
        </li>
      ))}
    </ol>
  );
}

export function BeneficiosCalendario({ beneficios, plazos, admision, hoy }: Props) {
  const [consulta, setConsulta] = useState("");
  const resultados = useMemo(() => filtrarBeneficios(beneficios, consulta), [beneficios, consulta]);
  const plazosOrdenados = useMemo(() => plazosPorVigencia(plazos, hoy), [plazos, hoy]);
  const admisionOrdenada = useMemo(() => plazosPorVigencia(admision, hoy), [admision, hoy]);

  return (
    <div className={estilos.pagina} data-pagina-interior>
      <CabeceraInterior pagina="beneficios" titulo="Beneficios y plazos 2027" acciones={
          <nav className={estilos.accesos} aria-label="En esta página">
            <a className={estilos.accion} href="#calendario-plazos">Ver calendario<ArrowDown aria-hidden="true" /></a>
            <a className={estilos.enlaceHero} href="#calendario-admision">Ver calendario de admisión<ArrowDown aria-hidden="true" /></a>
            <a className={estilos.enlaceHero} href="#buscar-beneficios">Buscar beneficios<ArrowDown aria-hidden="true" /></a>
          </nav>
      }><p>Revisa opciones oficiales. Cumplir requisitos no asegura un beneficio: podrías acceder si el Ministerio de Educación (Mineduc) confirma tus antecedentes.</p></CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina">
        <div className={estilos.contenido}>
          <section aria-labelledby="buscar-beneficios" className={estilos.seccion}>
            <h2 id="buscar-beneficios" tabIndex={-1}>Busca beneficios</h2>
            <noscript><p>La búsqueda necesita JavaScript. Puedes revisar todos los beneficios y plazos a continuación.</p></noscript>
            <div className={estilos.buscador}>
              <label htmlFor="consulta-beneficios">Escribe el nombre o una palabra del beneficio</label>
              <div className={estilos.campo}>
                <Search aria-hidden="true" />
                <input
                  id="consulta-beneficios"
                  className={estilos.busqueda}
                  type="search"
                  value={consulta}
                  onChange={(evento) => setConsulta(evento.target.value)}
                />
              </div>
              <p className={estilos.conteo} role="status">{resultados.length} {resultados.length === 1 ? "beneficio encontrado" : "beneficios encontrados"}.</p>
            </div>
            <div className={estilos.listaBeneficios}>
              {resultados.map((beneficio) => (
                <article key={beneficio.codigo} className={estilos.tarjeta} data-reveal="tarjeta" data-panel>
                  <div className={estilos.resumenBeneficio}>
                    <h3>{beneficio.nombre_oficial}</h3>
                    <p>{beneficio.explicacion_simple}</p>
                  </div>
                  <div className={estilos.detalleBeneficio}>
                    <div className={estilos.requisitos}><h4>Requisitos</h4><ul>{beneficio.requisitos_simples.map((requisito) => <li key={requisito}>{requisito}</li>)}</ul></div>
                    <div><h4>Cobertura</h4><p>{beneficio.cobertura.descripcion}</p></div>
                    <div><h4>Cómo postular</h4><p>{beneficio.postulacion}</p></div>
                  </div>
                  <Fuente fuente={beneficio.fuente} url={beneficio.url} fecha={beneficio.fecha_consulta} />
                </article>
              ))}
            </div>
            {!resultados.length ? <div className={estilos.vacio}><Search aria-hidden="true" /><p>No encontramos beneficios con esa búsqueda. Prueba con otro nombre.</p></div> : null}
          </section>

          <section aria-labelledby="calendario-plazos" className={estilos.seccion}>
            <h2 id="calendario-plazos" tabIndex={-1}>Calendario de plazos</h2>
            <p>Primero van los plazos en curso o por venir; los que ya pasaron quedan al final. Revisa la fuente antes de hacer una postulación.</p>
            <ListaDePlazos plazos={plazosOrdenados} />
          </section>

          <section aria-labelledby="calendario-admision" className={estilos.seccion}>
            <h2 id="calendario-admision" tabIndex={-1}>Calendario de admisión universitaria 2027</h2>
            <p>Son las fechas del proceso del Departamento de Evaluación, Medición y Registro Educacional (DEMRE) para postular a las universidades por el sistema centralizado, con la Prueba de Acceso a la Educación Superior (PAES). Los que ya pasaron quedan al final. Revisa la fuente antes de cada paso.</p>
            <ListaDePlazos plazos={admisionOrdenada} />
          </section>
        </div>
      </main>
    </div>
  );
}
