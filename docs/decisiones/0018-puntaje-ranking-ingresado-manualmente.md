# 0018 — El Puntaje Ranking se ingresa manualmente en el simulador

Fecha: 2026-11-07 · Estado: propuesta

## Contexto

El simulador de puntaje necesita el Puntaje Ranking de cada estudiante. La
fórmula vigente hasta el Proceso de Admisión 2027 está en el
[Acta de la sesión N.º 75 del Comité Técnico de Acceso](https://acceso.mineduc.cl/wp-content/uploads/2025/10/Acta-sesion-N%C2%B075-10-de-septiembre-del-2025.pdf),
anexo N.º 4, sección 2.1 «Puntaje Ranking hasta el proceso de admisión 2027»,
páginas 53 a 55. Para una persona que cursó toda la enseñanza media en el mismo
establecimiento, la fórmula es:

- Si su Promedio Acumulado (PA) es menor o igual al Promedio Histórico (PH), su Puntaje Ranking es igual a su Puntaje NEM.
- Si `PH < PA <= PMH`, el Puntaje Ranking es `b + m × PA`, donde `PNHist` es el Puntaje NEM equivalente al PH, `m = (1000 − PNHist) / (PMH − PH)` y `b = 1000 − m × PMH`.
- Si el Promedio Acumulado es mayor que el Promedio Máximo Histórico (PMH), el Puntaje Ranking es 1000.
- Si cursó en distintos establecimientos, se pondera el ranking de cada contexto por la cantidad de cursos aprobados allí: `Σ(PRᵢ × Lᵢ) / 4`.

El ejemplo oficial publicado en
[«Instrumentos de acceso, especificaciones y procedimientos»](https://acceso.mineduc.cl/wp-content/uploads/2022/06/2.-INSTRUMENTOS-ACCESO-ADM-2023.pdf),
sección 1.2, página 9, usa PA 6,33, PH 6,00 y PMH 6,86, y obtiene un Puntaje
Ranking aproximado de 824. El Acta N.º 75 confirma que esa fórmula continúa
vigente hasta la Admisión 2027; la fórmula por niveles R1 a R4 comienza en la
Admisión 2028 (sección 2.2, páginas 55 a 59).

Calcularlo en la aplicación exige dos cosas que no tenemos:

1. Los valores PH y PMH de la población de referencia de cada contexto educativo. El DEMRE los calcula, pero no los publica en una fuente que podamos citar ni descargar.
2. Una implementación de la fórmula que coincida con el documento oficial. La que se escribió en el PR 61 usa otra expresión en el tramo intermedio y no reproduce el ejemplo del documento.

Sin esos dos puntos, cualquier valor calculado podría estar mal y el estudiante tomaría decisiones con un número que no es el oficial. AGENTS.md (sección 2.1) pide no publicar lo que no se puede verificar en una fuente oficial.

## Opciones evaluadas

### Opción A — Calcular el Puntaje Ranking en la aplicación
- Pros: la experiencia es automática y no depende de que el estudiante conozca su número.
- Contras: exige datos de referencia que no tenemos y una fórmula verificada. Hoy ninguno de los dos está resuelto.

### Opción B — El estudiante ingresa su Puntaje Ranking
- Pros: usa el número oficial que el estudiante ya recibió. No necesita fórmulas ni datos de colegios. Es verificable.
- Contras: el estudiante tiene que saber su número, y un error al escribirlo afecta el resultado. Se mitiga con validación de rango (100 a 1000) y con una explicación de dónde encontrarlo.

### Opción C — Calcular con PROM y MAX que ingresa el estudiante
- Pros: sirve a quien tiene esos valores.
- Contras: casi nadie los tiene. Agrega complejidad sin resolver la falta de datos oficiales.

## Decisión

Para la primera versión del simulador se elige la **opción B**. La aplicación no calcula el Puntaje Ranking. Se ingresa como dato del estudiante, validado entre 100 y 1000.

## Justificación

- Evita publicar un valor que no es el oficial, en línea con AGENTS.md 2.1.
- La fórmula aplicable a la Admisión 2027 está verificada en el documento normativo, pero implementarla no basta: faltan los datos de referencia.
- El ranking es un dato que el estudiante ya tiene. Ingresarlo no pide datos personales adicionales (RUN, contraseña o datos del colegio).

## Consecuencias

- El simulador muestra el Puntaje Ranking como «el que ingresaste», nunca como un valor calculado por la plataforma.
- Hay que explicar en la interfaz, en lenguaje claro, dónde encontrar el puntaje y que la plataforma no lo calcula.
- El ponderado sí se calcula en la aplicación, porque usa ponderaciones oficiales cargadas desde el DEMRE y no depende de los datos de colegios.
- Cuando el DEMRE publique los datos de referencia por colegio, o cuando el nuevo ranking entre en vigencia, este ADR debe revisarse. Ese cambio se decide en un ADR nuevo.
- El PR 61 deja de implementar el cálculo del ranking y mantiene solo la validación del valor ingresado y el cálculo del ponderado.
