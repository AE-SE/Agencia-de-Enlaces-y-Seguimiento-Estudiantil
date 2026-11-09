// Gráficos hechos con HTML y CSS (no SVG con texto): las etiquetas son texto normal, escalan con el
// zoom y se leen bien en 360 px. Cada gráfico va acompañado de su tabla (TablaDatos).
import type { ReactNode } from "react";

import { anchoBarra, columnasHistograma, posicionEje, posicionEnRango, type Histograma } from "./transparencia";
import estilos from "./transparencia.module.css";

export type FilaBarra = { etiqueta: string; valor: number; texto: string; trama?: boolean };

export function BarrasHorizontales({
  descripcion,
  filas,
  maximo,
  referencia,
}: {
  descripcion: string;
  filas: FilaBarra[];
  maximo?: number;
  /** Línea punteada vertical (por ejemplo, el 95 % que se declara). */
  referencia?: number;
}) {
  const tope = maximo ?? Math.max(...filas.map((f) => f.valor), 1);
  return (
    <ul className={estilos.barras} aria-label={descripcion}>
      {filas.map((f) => (
        <li key={f.etiqueta} className={estilos.filaBarra}>
          <span className={estilos.etiquetaBarra}>{f.etiqueta}</span>
          <span className={estilos.pista}>
            <span className={`${estilos.barra} ${f.trama ? estilos.trama : ""}`} style={{ inlineSize: `${anchoBarra(f.valor, tope)}%` }} />
            {referencia !== undefined ? <span className={estilos.referencia} style={{ insetInlineStart: `${anchoBarra(referencia, tope)}%` }} /> : null}
          </span>
          <span className={estilos.valorBarra}>{f.texto}</span>
        </li>
      ))}
    </ul>
  );
}

export function Leyenda({ items }: { items: { texto: string; tipo: "barra" | "trama" | "referencia" | "fuera" }[] }) {
  const clase = { barra: estilos.muestraBarra, trama: estilos.muestraTrama, referencia: estilos.muestraReferencia, fuera: estilos.muestraTrama };
  return (
    <ul className={estilos.leyenda}>
      {items.map((i) => (
        <li key={i.texto}><span className={clase[i.tipo]} aria-hidden="true" />{i.texto}</li>
      ))}
    </ul>
  );
}

export function RangoEstimado({ valor, inferior, superior, descripcion, formato }: {
  valor: number; inferior: number; superior: number; descripcion: string; formato: (n: number) => string;
}) {
  return (
    <div>
      <div className={estilos.rango} role="img" aria-label={descripcion}>
        <span className={estilos.rangoPista} />
        <span className={estilos.rangoPunto} style={{ insetInlineStart: `${posicionEnRango(valor, inferior, superior)}%` }} />
      </div>
      <p className={estilos.rangoExtremos}><span>{formato(inferior)}</span><span>{formato(superior)}</span></p>
    </div>
  );
}

export function GraficoHistograma({ descripcion, h, qBajo, qAlto, etiquetaBajo, etiquetaAlto, ticks }: {
  descripcion: string; h: Histograma; qBajo: number; qAlto: number; etiquetaBajo: string; etiquetaAlto: string;
  ticks: { valor: number; texto: string }[];
}) {
  const columnas = columnasHistograma(h, qBajo, qAlto);
  return (
    <div className={estilos.histograma} role="img" aria-label={descripcion}>
      <div className={estilos.columnas}>
        {columnas.map((c) => (
          <span key={c.desde} className={`${estilos.columna} ${c.dentro ? estilos.barra : estilos.trama}`} style={{ blockSize: `${c.altura}%` }} />
        ))}
        <span className={estilos.corte} style={{ insetInlineStart: `${posicionEje(qBajo, h)}%` }}><span className={estilos.etiquetaCorte}>{etiquetaBajo}</span></span>
        <span className={estilos.corte} style={{ insetInlineStart: `${posicionEje(qAlto, h)}%` }}><span className={estilos.etiquetaCorte}>{etiquetaAlto}</span></span>
      </div>
      <div className={estilos.ejeX}>
        {ticks.map((t) => (
          <span key={t.valor} style={{ insetInlineStart: `${posicionEje(t.valor, h)}%` }}>{t.texto}</span>
        ))}
      </div>
    </div>
  );
}

export function TablaDatos({ resumen, titulo, columnas, filas }: {
  resumen: string; titulo: string; columnas: { nombre: string; numerica?: boolean }[]; filas: ReactNode[][];
}) {
  return (
    <details className={estilos.detalle}>
      <summary>{resumen}</summary>
      <div className={estilos.tablaCaja} tabIndex={0} role="region" aria-label={titulo}>
        <table className={estilos.tabla}>
          <caption>{titulo}</caption>
          <thead><tr>{columnas.map((c) => <th key={c.nombre} scope="col" className={c.numerica ? estilos.numerica : undefined}>{c.nombre}</th>)}</tr></thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i}>{fila.map((celda, j) => <td key={j} className={columnas[j]?.numerica ? estilos.numerica : undefined}>{celda}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
