// Tipos y funciones puras de la página de transparencia del pronóstico.
// Las cifras vienen de datos/transparencia/pronostico_2027.json; aquí no hay ninguna escrita.

export type Estimacion = {
  codigo: string;
  titulo: string;
  mide: string;
  valor: number;
  inferior: number;
  superior: number;
  registrado: string;
  metodo: string;
  fuente: string;
  url: string;
};

export type Insumo = { valor: number; mide: string; fuente: string; url: string };

export type TipoInstitucion = { clave: string; nombre: string; retencion: number; mezcla_2026: number; ingreso_2026: number };

export type PasoComuna = {
  desde: number;
  hasta: number;
  comunas: number;
  error_mediano: number;
  cobertura_poisson: number;
  cobertura_empirico: number | null;
};

export type SeriePaes = { anio: number; filas: number; regulares: number };

export type Tramo = { tramo: string; casos: number; error_mediano: number; cobertura: number };

export type Histograma = { inicio: number; paso: number; conteos: number[]; fuera_bajo: number; fuera_alto: number };

export type Verificacion = { comparacion: string; cuando: string; estado: string; detalle: string };

/* ----------------------------------------------------------- formato (es-CL) */

// Se escribe a mano para que servidor y navegador den lo mismo (ICU puede omitir el punto en 4 cifras).
export function miles(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function decimal(n: number, cifras = 1): string {
  return n.toFixed(cifras).replace(".", ",");
}

export function porcentaje(fraccion: number, cifras = 1): string {
  return `${decimal(fraccion * 100, cifras)} %`;
}

/** Porcentaje con signo explícito: «+1,4 %» o «−7,0 %» (signo menos real, no guion). */
export function porcentajeConSigno(fraccion: number, cifras = 1): string {
  const signo = fraccion > 0 ? "+" : fraccion < 0 ? "−" : "";
  return `${signo}${decimal(Math.abs(fraccion) * 100, cifras)} %`;
}

/* ------------------------------------------------------------------ cálculos */

/** Cambio entre dos años de una serie, en fracción (0,156 = +15,6 %). */
export function cambioEntre(serie: SeriePaes[], desde: number, hasta: number, campo: "filas" | "regulares"): number {
  const a = serie.find((s) => s.anio === desde);
  const b = serie.find((s) => s.anio === hasta);
  if (!a || !b) throw new Error(`La serie no tiene ${desde} y ${hasta}`);
  return b[campo] / a[campo] - 1;
}

/** Rango (mínimo y máximo) de un campo en los pasos entre años que terminan en `desdeAnio` o después. */
export function rangoCobertura(pasos: PasoComuna[], campo: "cobertura_poisson" | "cobertura_empirico", desdeAnio: number) {
  const valores = pasos
    .filter((p) => p.hasta >= desdeAnio)
    .map((p) => p[campo])
    .filter((v): v is number => v !== null);
  if (!valores.length) throw new Error("Sin pasos para calcular el rango");
  return { minimo: Math.min(...valores), maximo: Math.max(...valores) };
}

/** Ancho relativo de una barra (0 a 100) respecto de un máximo; nunca negativo ni mayor que 100. */
export function anchoBarra(valor: number, maximo: number): number {
  if (!(maximo > 0) || !(valor > 0)) return 0;
  return Math.min(100, (valor / maximo) * 100);
}

/** Posición (0 a 100) de un valor dentro de [inferior, superior]; sirve para ubicar el punto central. */
export function posicionEnRango(valor: number, inferior: number, superior: number): number {
  if (!(superior > inferior)) return 50;
  return Math.min(100, Math.max(0, ((valor - inferior) / (superior - inferior)) * 100));
}

/** Datos de cada columna del histograma: altura relativa y si cae dentro del intervalo de 95 %. */
export function columnasHistograma(h: Histograma, qBajo: number, qAlto: number) {
  const maximo = Math.max(...h.conteos, 1);
  return h.conteos.map((conteo, i) => {
    const desde = h.inicio + i * h.paso;
    const centro = desde + h.paso / 2;
    return { desde, hasta: desde + h.paso, conteo, altura: (conteo / maximo) * 100, dentro: centro >= qBajo && centro <= qAlto };
  });
}

/** Posición horizontal (0 a 100) de un valor del eje del histograma. */
export function posicionEje(valor: number, h: Histograma): number {
  const fin = h.inicio + h.paso * h.conteos.length;
  return Math.min(100, Math.max(0, ((valor - h.inicio) / (fin - h.inicio)) * 100));
}
