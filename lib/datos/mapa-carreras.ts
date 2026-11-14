// Mapa de carreras por región: lógica pura. Sin dependencias de React ni de red.
// Cifras propias calculadas a partir de SIES y Mi Futuro (ver ADR 0036).

export type Cruce =
  | 'entradas_altas_empleabilidad_alta'
  | 'entradas_altas_empleabilidad_baja'
  | 'entradas_bajas_empleabilidad_alta'
  | 'entradas_bajas_empleabilidad_baja'
  | 'sin_cifra';

export type FilaRegion = {
  codigo_region: string;
  entradas: number | null;
  entradas_estado: 'publicable' | 'menos_de_10';
  empleabilidad_pct: number | null;
  cobertura_empleabilidad_pct: number | null;
  cruce: Cruce;
};

export type CarreraMapa = {
  regiones: FilaRegion[];
  mediana_entradas_regionales: number | null;
  mediana_empleabilidad_regional_pct: number | null;
};

export type DatosMapa = {
  anio_entradas: number;
  umbral_entradas: number;
  fuente_empleabilidad: { fuente: string; url: string; periodo: string; nota: string };
  carreras: Record<string, CarreraMapa>;
};

export type Categoria = 'sobre' | 'bajo' | 'sin_dato';

const fmtEntero = new Intl.NumberFormat('es-CL');
const fmtDecimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Empleo «sobre» o «bajo» frente a la mayoría de las regiones: compara con la mediana de la carrera.
// Sin cifra de entradas (menos de 10) o sin empleo, la zona queda como «sin_dato».
export function categoriaZona(fila: FilaRegion, medianaEmpleo: number | null): Categoria {
  if (fila.entradas === null || fila.empleabilidad_pct === null) return 'sin_dato';
  if (medianaEmpleo === null) return 'sobre';
  return fila.empleabilidad_pct < medianaEmpleo ? 'bajo' : 'sobre';
}

export type TextosZona = { entradas: string; empleo: string; comparacion: string; resumen: string };

// Textos en lenguaje claro: qué se mide y cómo se compara, sin jerga.
export function textosZona(fila: FilaRegion, medianaEmpleo: number | null): TextosZona {
  const entradas =
    fila.entradas === null ? 'menos de 10 estudiantes nuevos' : `${fmtEntero.format(fila.entradas)} estudiantes nuevos`;
  const empleo =
    fila.empleabilidad_pct === null
      ? 'sin datos de empleo'
      : `${fmtDecimal.format(fila.empleabilidad_pct)} de cada 100 titulados con empleo al primer año`;
  const categoria = categoriaZona(fila, medianaEmpleo);
  const comparacion =
    categoria === 'sin_dato'
      ? 'Sin comparación: faltan datos.'
      : categoria === 'bajo'
        ? 'Menos empleo que la mayoría de las regiones.'
        : 'Igual o más empleo que la mayoría de las regiones.';
  return { entradas, empleo, comparacion, resumen: `${entradas}; ${empleo}. ${comparacion}` };
}

// Radio del círculo proporcional a las entradas (raíz cuadrada para que el área sea proporcional).
export function radioZona(entradas: number | null, maximo: number, minimo = 6, maxRadio = 22): number | null {
  if (entradas === null || maximo <= 0) return null;
  return minimo + (maxRadio - minimo) * Math.sqrt(entradas / maximo);
}

export function nombresCarreras(datos: DatosMapa): string[] {
  return Object.keys(datos.carreras).sort((a, b) => a.localeCompare(b, 'es'));
}
