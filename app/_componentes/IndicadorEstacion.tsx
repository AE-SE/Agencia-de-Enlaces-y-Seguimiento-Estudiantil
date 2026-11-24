import estilos from "./componentes.module.css";

export type Estacion = 1 | 2 | 3 | 4;
const ESTACIONES = ["Explorar", "Postular", "Llegar", "Avanzar"] as const;
// Etapas con pantallas hoy (ADR 0031: alcance «Explorar» y «Postular»). Las siguientes se muestran como próximas.
const ESTACIONES_CON_PANTALLAS = 2;

// En teléfono los nombres no caben bajo los círculos: el resumen nombra las cuatro etapas, también
// la que sigue (antes omitía «Postular» y dejaba un círculo sin nombre).
export function resumenMovil(actual: Estacion): string {
  const siguen = ESTACIONES.slice(actual, ESTACIONES_CON_PANTALLAS);
  const proximas = ESTACIONES.slice(Math.max(actual, ESTACIONES_CON_PANTALLAS));
  return [
    `Estás en ${ESTACIONES[actual - 1]} (etapa ${actual} de ${ESTACIONES.length}).`,
    siguen.length ? `Sigue: ${siguen.join(" y ")}.` : "",
    proximas.length ? `Próximamente: ${proximas.join(" y ")}.` : "",
  ].filter(Boolean).join(" ");
}

export function IndicadorEstacion({ actual }: { actual: Estacion }) {
  return (
    <nav aria-label="Etapas de tu trayectoria" className={estilos.trayecto}>
      <ol className={estilos.estaciones}>
        {ESTACIONES.map((nombre, indice) => {
          const numero = indice + 1;
          return (
            <li key={nombre} data-estacion={numero} aria-current={actual === numero ? "step" : undefined} className={estilos.estacion}>
              <span className={estilos.soloLectores}>Estación {numero}: {nombre}{numero > ESTACIONES_CON_PANTALLAS ? ". Próximamente" : actual === numero ? ". Estás aquí" : ""}</span>
              <span className={estilos.numero} aria-hidden="true">{numero}</span>
              <span className={estilos.nombre} aria-hidden="true">{nombre}{numero > ESTACIONES_CON_PANTALLAS ? " · Próximamente" : ""}</span>
              {actual === numero && <span className={estilos.actual} aria-hidden="true">Estás aquí</span>}
            </li>
          );
        })}
        <li className={estilos.resumenMovil} aria-hidden="true">{resumenMovil(actual)}</li>
      </ol>
    </nav>
  );
}
