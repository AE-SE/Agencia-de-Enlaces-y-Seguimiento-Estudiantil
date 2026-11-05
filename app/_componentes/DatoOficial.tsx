import { Enlace } from "./Enlace";
import estilos from "./componentes.module.css";

type Fuente = { nombre: string; url: string; fechaActualizacion: string };
type Props = { medida: string } & (
  | { valor: number | string; periodo: string; fuente: Fuente }
  | { valor: null; motivo: string; periodo?: string; fuente?: Fuente }
);

export function DatoOficial(props: Props) {
  return (
    <article className={estilos.dato} aria-label={props.medida}>
      <h3>{props.medida}</h3>
      {props.valor === null ? <><p className={estilos.sinDato}>Sin datos suficientes</p><p>{props.motivo}</p></> :
        <p className={estilos.cifra}>{typeof props.valor === "number" ? new Intl.NumberFormat("es-CL").format(props.valor) : props.valor}</p>}
      {props.periodo && <p>{props.periodo}</p>}
      {props.fuente && <>
        <p>Fuente: <Enlace href={props.fuente.url}>{props.fuente.nombre}</Enlace></p>
        <p>Actualizado: <time dateTime={props.fuente.fechaActualizacion}>{props.fuente.fechaActualizacion}</time></p>
      </>}
    </article>
  );
}
