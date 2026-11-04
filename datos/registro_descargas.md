# Registro de descargas oficiales

Los archivos originales se guardan en `datos/crudos/` y no se suben al repositorio.

| Archivo local | Fuente | URL exacta | Fecha de descarga | Período | Observación |
|---|---|---|---|---|---|
| `01_BaseINDICES_Pregrado.xlsx` (eliminado) | INDICES Educación Superior, CNED | https://cned.cl/indices_New_~/bbdd/01_BaseINDICES_Pregrado.xlsx | 2026-11-03 | 2005-2026 | Eliminado de `datos/crudos/` el 2026-11-04. No usar hasta autorización escrita ([ADR 0009](../docs/decisiones/0009-fuente-de-oferta-academica.md)). |
| `Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx` | SIES / Mi Futuro | https://mifuturo.cl/wp-content/uploads/2025/12/Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx | 2026-11-03 | 2025-2026 | XLSX; base más reciente publicada para el buscador. |
| `Matricula-Ed-Superior-2026.rar` | Datos Abiertos Mineduc | https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar | 2026-11-04 | 2026 | Conjunto “Matrícula en educación superior”. El CSV trae `valor_arancel` y `valor_matricula`; no trae vacantes. La matrícula por carrera no viene agregada: puede calcularse contando registros por `codigo_unico` o carrera, con una regla de agregación documentada. |
| `2027-26-09-24-oferta-definitiva-carreras-p2027.pdf` | DEMRE / Acceso Mineduc | https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf | 2026-11-03 | Admisión 2027 | Solo PDF; requiere revisión manual adicional al extraer ponderaciones y vacantes. |
| `PROCESO-DE-ADMISIÓN-2026-POSTULACIÓN-19-01-2026T11-16-18.rar` | Datos abiertos DEMRE | https://portal-transparencia.demre.cl/portal-base-datos | 2026-11-03 | Admisión 2026 | RAR “Estadísticas de Selección”; el portal genera una URL firmada temporal, por eso se registra la página estable y el nombre exacto. Informa el promedio de pruebas obligatorias del último seleccionado, no el puntaje ponderado del último matriculado. |

## Pendiente de fuente

No se encontró una base oficial del DEMRE que publique literalmente el “puntaje de corte del último matriculado” para la Admisión 2026. La base descargada usa otra definición: promedio de pruebas obligatorias del último seleccionado. No se debe mostrar como puntaje de corte ni mezclar ambos indicadores sin confirmación del líder y una fuente oficial equivalente.
