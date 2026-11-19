// Área del SIES de cada carrera genérica (la genera datos/exportar_areas_sies.py).
// La clave es programa_generico.nombre_normalizado. Una genérica que el SIES no publica no tiene área.
import datos from './areas-sies.json' with { type: 'json' };

export const AREA_POR_GENERICA: Readonly<Record<string, string>> = datos.areas;

export const FUENTE_AREA = { fuente: datos.fuente, url: datos.url, fecha_consulta: datos.fecha_consulta, que_es: datos.que_es } as const;
