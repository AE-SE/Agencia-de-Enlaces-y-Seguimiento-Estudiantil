import estilos from "./componentes.module.css";

export type Estacion = 1 | 2 | 3 | 4;
const ESTACIONES = ["Explorar", "Postular", "Llegar", "Avanzar"] as const;

export function IndicadorEstacion({ actual }: { actual: Estacion }) {
  return (
    <nav aria-label="Etapas de tu trayectoria" className={estilos.trayecto}>
      <ol className={estilos.estaciones}>
        {ESTACIONES.map((nombre, indice) => {
          const numero = indice + 1;
          return (
            <li key={nombre} data-estacion={numero} aria-current={actual === numero ? "step" : undefined} className={estilos.estacion}>
              <span className={estilos.numero} aria-hidden="true">{numero}</span>
              <span className={estilos.nombre}><span className={estilos.soloLectores}>Estación {numero}: </span>{nombre}</span>
              {actual === numero && <span className={estilos.actual}>Estás aquí</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
