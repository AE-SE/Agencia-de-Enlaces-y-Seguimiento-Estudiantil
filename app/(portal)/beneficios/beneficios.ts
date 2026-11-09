export type Beneficio = {
  codigo: string;
  nombre_oficial: string;
  explicacion_simple: string;
  requisitos_simples: string[];
  cobertura: { descripcion: string };
  postulacion: string;
  fuente: string;
  url: string;
  fecha_consulta: string;
};

export type Plazo = {
  codigo: string;
  proceso: string;
  descripcion: string;
  inicio: string | null;
  termino: string | null;
  estado: string;
  periodo_referencial?: string;
  motivo_sin_fecha: string | null;
  fuente: string;
  url: string;
  fecha_consulta: string;
};

export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es-CL");
}

export function filtrarBeneficios(beneficios: Beneficio[], consulta: string): Beneficio[] {
  const busqueda = normalizarTexto(consulta.trim());
  if (!busqueda) return beneficios;
  return beneficios.filter((beneficio) => normalizarTexto(`${beneficio.nombre_oficial} ${beneficio.explicacion_simple}`).includes(busqueda));
}

export function ordenarPlazos(plazos: Plazo[]): Plazo[] {
  return [...plazos].sort((primero, segundo) => {
    if (!primero.inicio) return segundo.inicio ? 1 : 0;
    if (!segundo.inicio) return -1;
    return primero.inicio.localeCompare(segundo.inicio);
  });
}
