# Auditoría de accesibilidad del portal — 14 de noviembre de 2026

Alcance: portada, carreras, ficha, comparador, beneficios, FUAS, hoja de decisión y ocupaciones sobre `main` (commit `4b4dc57`). Revisión de código; la corrida automática queda pendiente porque el build local no completó sin credenciales de Supabase. Las pruebas manuales de 360 px, teclado, zoom al 200 %, modo oscuro y lector de pantalla quedan pendientes de Alejandro.

## Hallazgos

| Página | Gravedad | Hallazgo | Arreglo propuesto | Estado |
|---|---|---|---|---|
| Ocupaciones | Moderada | La ruta no estaba en `tests/accesibilidad/rutas.ts`; por eso no recibía axe, revisión de 360 px ni foco automático exigidos por ADR 0021. | Agregar `/ocupaciones` a la lista de rutas auditadas. | Corregido en esta rama. |
| Ocupaciones | Moderada | El pie nombraba la elaboración propia, pero no explicaba el criterio del cruce ni entregaba un enlace directo al catálogo oficial del SIES. | Indicar que el cruce se revisa por grupo de ocupaciones contra las áreas del catálogo del SIES, con enlace y fecha de consulta. | Corregido en esta rama. |
| Portada | Pendiente de revisión manual | El PR #159 modifica navegación, carrusel y estructura Andén urbano. Axe no sustituye comprobar el orden, anuncio y estado del carrusel en lector de pantalla. | Recorrer con lector de pantalla, teclado y zoom al 200 %; registrar foco, nombres anunciados y pérdida de contenido. | Pendiente de Alejandro. |
| Todas las páginas del alcance | Pendiente de revisión manual | No es posible certificar lectura de contenido, foco visible real y reflujo al 200 % mediante inspección estática. | Aplicar la matriz manual siguiente y registrar cualquier resultado por gravedad. | Pendiente de Alejandro. |

## Matriz de revisión manual

Para cada página, a 360 px y a 200 % de zoom: no debe haber desplazamiento horizontal, contenido recortado ni pérdida de controles. Con teclado: `Tab`, `Shift+Tab`, `Enter`, `Espacio` y foco visible. Con TalkBack o VoiceOver: confirmar un título principal, etiquetas de controles, orden lógico y avisos anunciados sin repetición.

| Página | 360 px | Teclado | Zoom 200 % | Lector de pantalla | Modo oscuro |
|---|---|---|---|---|---|
| Portada | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Carreras | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Ficha | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Comparador | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Beneficios | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| FUAS | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Hoja de decisión | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Ocupaciones | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

## Revisión del PR #159

Veredicto: requiere actualización y revisión manual antes de aprobar. La solicitud está abierta contra una base anterior (`57b51ed`); `main` actual está en `4b4dc57`. Mantener los enlaces de FUAS y ocupaciones al actualizar la portada. No se encontraron hilos de revisión abiertos en GitHub al momento de esta revisión.
