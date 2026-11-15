# 0009 — Fuente de la oferta académica: Datos Abiertos Mineduc en vez del CNED

Fecha: 2026-11-03 · Estado: aceptada · ajustada el 2026-11-11

> **Nota del 2026-11-11.** La decisión (Datos Abiertos Mineduc como fuente; nada del CNED sin autorización escrita) sigue vigente sin cambio. Donde el texto habla del «panel institucional» que se arrienda, hoy el cliente que paga son los colegios y sostenedores (ADR 0031); como igualmente hay cobro por el panel, la duda sobre el uso comercial persiste y la regla se mantiene.

## Contexto
La tarea C5 carga la oferta académica (instituciones, carreras, aranceles, vacantes y matrícula) desde la base INDICES del Consejo Nacional de Educación (CNED). Al revisar los términos de uso (PR #16), Cristóbal encontró que las condiciones del CNED permiten el uso informativo, académico, educacional, de investigación o personal, pero **prohíben los fines comerciales** y restringen modificar o distribuir sus contenidos fuera de contexto. Condiciones citadas: https://cned.cl/politicas-de-privacidad/ (revisadas el 2026-11-03 por Cristóbal y confirmadas por el líder el mismo día). Estas condiciones, fechadas en diciembre de 2014, rigen también para eligecarrera.cl.

El portal es gratuito para el estudiante, pero la agencia arrienda el panel institucional (AGENTS.md, sección 1). Mostrar datos del CNED en el panel pagado es uso comercial. Mostrarlos en el portal gratuito de una empresa que cobra a instituciones es, como mínimo, dudoso. Ante la duda, no se usa.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| **Datos Abiertos Mineduc como fuente principal; pedir autorización al CNED en paralelo** | Organismo oficial que publica oferta, aranceles y matrícula (`docs/fuentes.md`); no publica una prohibición comercial; no frena el calendario | Tampoco publica una licencia de reutilización; la cobertura y las columnas pueden diferir de INDICES y hay que rehacer el diccionario (C3) para esas columnas |
| Usar el CNED solo en el portal gratuito | Base conocida, con serie 2005-2026 ya descargada | Ambiguo: el portal es parte de un negocio; obligaría a separar datos por producto; si el CNED lo objeta, hay que retirar las fichas |
| Esperar la autorización escrita del CNED | Mantiene el plan original | Sin plazo de respuesta conocido; bloquea C5, el hito del 9 de noviembre y todo lo que depende de la oferta |

## Decisión
1. La oferta académica se carga desde **Datos Abiertos Mineduc**. C5 pasa a llamarse "Primer script de carga: oferta académica (Mineduc)".
2. Se escribe al CNED pidiendo autorización para el uso descrito. Si la otorga por escrito, se evalúa en un ADR nuevo usarlo como fuente complementaria.
3. Mientras no haya autorización, **ningún dato del CNED se muestra en el portal ni en los paneles**, ni se usa en los datos de ejemplo (C4).

## Justificación
- AGENTS.md, sección 2.1: solo fuentes oficiales y con trazabilidad. Ambas lo son; la diferencia está en los términos de uso.
- Una prohibición expresa (CNED) pesa más que la ausencia de licencia (Mineduc). La ausencia de licencia no autoriza ni prohíbe expresamente; se mitiga citando siempre la fuente, sin alterar los valores y con descarga manual registrada en `datos/registro_descargas.md`.
- Cambiar de fuente ahora cuesta poco: C3 y C5 aún no empiezan.

## Consecuencias
- Solicitud de autorización enviada a `consulta@cned.cl` el 2026-11-03 por el líder. Respuesta pendiente.
- **Verificado por Cristóbal el 2026-11-04 (#16):** Datos Abiertos Mineduc no publica un conjunto de oferta académica. El más cercano, "Matrícula en educación superior 2026", trae arancel y valor de matrícula, pero no vacantes, y viene con una fila por estudiante. Por minimización (AGENTS.md, sección 2.2), C5 usa primero una base de oferta agregada del SIES si existe; si no, la base de matrícula, cargando solo totales por carrera con una regla de conteo aprobada por el líder.
- Si Datos Abiertos Mineduc no trae algún indicador (por ejemplo, vacantes), ese indicador se toma del DEMRE (oferta definitiva) o queda "sin datos suficientes", nunca del CNED.
- Con la aceptación se actualizaron `docs/equipo/guia-cristobal.md` (fuentes, C3, C4, C5 y C6) y el calendario de `docs/equipo/primeros-pasos-github.md`. La fila del CNED en `docs/fuentes.md` dice "No usar hasta autorización escrita" desde #16.
- El archivo del CNED ya descargado no se usa para nada, ni siquiera para contrastar valores, porque sus condiciones prohíben modificar o distribuir los datos fuera de contexto. Cristóbal lo borró de `datos/crudos/` el 2026-11-04.
