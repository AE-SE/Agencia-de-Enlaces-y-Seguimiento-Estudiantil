import Image from "next/image";
import Link from "next/link";

import { Aviso } from "@/app/_componentes/Aviso";
import { Enlace } from "@/app/_componentes/Enlace";
import plazos from "@/datos/beneficios/plazos_2027.json";
import { fechaLarga } from "@/lib/datos/fechas";

import { hoyEnChile, primerPeriodoCerrado } from "./beneficios/beneficios";
import { MapaCarreras } from "./MapaCarreras";
import estilos from "./Portada.module.css";

// El aviso depende de la fecha de hoy: la página no puede quedar fija desde el momento de la compilación.
export const dynamic = "force-dynamic";

export default function Inicio() {
  const cerrado = primerPeriodoCerrado(plazos.plazos, hoyEnChile());

  return (
    <div className="portada">
      <header className="marca">
        <Image className="logo" src="/marca/logo-horizontal.svg" alt="Agencia de Enlace & Seguimiento Estudiantil" width={1547} height={314} priority />
      </header>
      <main id="contenido" tabIndex={-1} className="contenido">
        <h1 className="text-titulo">Tu camino a la educación superior</h1>
        <p>Encuentra información oficial y apoyo para elegir, postular y avanzar en la educación superior.</p>
        <Link className={estilos.accion} href="/carreras">Explorar carreras</Link>
        <Link className={estilos.accionSecundaria} href="/fuas">Revisar mi próximo paso para becas y gratuidad (FUAS)</Link>
        <MapaCarreras />
        {cerrado ? (
          <Aviso tipo="plazo" titulo="el primer período de postulación ya cerró">
            <div className={estilos.textoAviso}>
              <p>
                La postulación al Formulario Único de Acreditación Socioeconómica (FUAS) cerró el{" "}
                <time dateTime={cerrado.cierre}>{fechaLarga(cerrado.cierre)}</time>, con su extensión incluida.
              </p>
              {cerrado.nivelSocioeconomico ? (
                <p>
                  Si ya postulaste, el Ministerio de Educación (Mineduc) informa tu nivel socioeconómico el{" "}
                  <time dateTime={cerrado.nivelSocioeconomico}>{fechaLarga(cerrado.nivelSocioeconomico)}</time>.
                </p>
              ) : null}
              {cerrado.segundoPeriodo ? (
                <p>Si no alcanzaste a postular, Mineduc informa un segundo período de {cerrado.segundoPeriodo}. Aún no publica las fechas exactas.</p>
              ) : null}
              <p>
                Fuente: <Enlace href={cerrado.url}>{cerrado.fuente}</Enlace>. Consultada el{" "}
                <time dateTime={cerrado.fechaConsulta}>{fechaLarga(cerrado.fechaConsulta)}</time>.
              </p>
            </div>
          </Aviso>
        ) : null}
      </main>
    </div>
  );
}
