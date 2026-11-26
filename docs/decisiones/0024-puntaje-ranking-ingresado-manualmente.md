# 0024 — El Puntaje Ranking se ingresa manualmente en el simulador

Fecha: 2026-11-07 · Estado: aceptada (2026-11-09, por el líder, tras [revisión legal](../revision-legal-adr-pendientes.md))

> Renumerado el 2026-11-10: se publicó como 0018, número que ya usaba el ADR de planificación de oferta.

## Contexto

El simulador de puntaje necesita el Puntaje Ranking de cada estudiante. Para la Admisión 2027, el sistema oficial compara su rendimiento con el de generaciones anteriores de su contexto educativo. Si cursó toda la enseñanza media en un mismo establecimiento, usa la fórmula de la sección siguiente. Si estudió en más de uno, combina los puntajes de cada contexto según la cantidad de cursos aprobados. Desde la Admisión 2028, el sistema usa el promedio de los cuatro rankings por curso.

La aplicación carece de los datos históricos que usa el sistema oficial para calcular el puntaje. Sin ellos, el número puede diferir del que el estudiante recibe y afectar sus decisiones. Por eso el simulador usa el puntaje oficial ingresado por la persona.

### Fuentes verificadas para la Admisión 2027

Consulta del 26 de noviembre de 2026.

- [Acta de la sesión N.º 75 del Comité Técnico de Acceso](https://acceso.mineduc.cl/wp-content/uploads/2025/10/Acta-sesion-N%C2%B075-10-de-septiembre-del-2025.pdf) (10 de septiembre de 2025), anexo 4, sección 2.1, páginas 53 a 55. Para toda la enseñanza media en un mismo establecimiento, la fórmula está en la letra a), página 54. El Puntaje Ranking iguala al Puntaje NEM cuando el Promedio Acumulado (PA) no supera el Promedio Histórico (PH). Si el PA supera el PH y no supera el Promedio Máximo Histórico (PMH), se usa `b + m × PA`, con `m = (1000 − PNHist) / (PMH − PH)` y `b = 1000 − m × PMH`. PNHist es el puntaje NEM que corresponde al PH. Por encima del PMH se asignan 1.000 puntos.
- [Instrumentos de acceso, especificaciones y procedimientos, Admisión 2027](https://acceso.mineduc.cl/wp-content/uploads/2026/03/INSTRUMENTOS-ACCESO-MARZO-2027.pdf), sección 1.2, apartado I.b. El ejemplo oficial usa PA 6,33, PH 6,00, PMH 6,86 y PNHist 715 para una persona egresada de enseñanza técnico-profesional. El resultado es aproximadamente 824 puntos. La prueba del proyecto comprueba que el validador acepte ese valor.
- El promedio de cuatro rankings por nivel se aplica desde la **Admisión 2028**, según el anexo 4 del Acta N.º 75, sección 2.2.

## Opciones evaluadas

### Opción A — Calcular el Puntaje Ranking en la aplicación
- Pros: la experiencia es automática y no depende de que el estudiante conozca su número.
- Contras: exige los datos de referencia que usa el sistema oficial y que la aplicación no tiene.

### Opción B — El estudiante ingresa su Puntaje Ranking
- Pros: usa el número oficial que el estudiante ya recibió. No necesita fórmulas ni datos de colegios. Es verificable.
- Contras: el estudiante tiene que saber su número, y un error al escribirlo afecta el resultado. Se mitiga con validación de rango (100 a 1000) y con una explicación de dónde encontrarlo.

### Opción C — Calcular con datos históricos que ingresa el estudiante
- Pros: sirve a quien tiene esos valores.
- Contras: casi nadie los tiene. Agrega complejidad sin resolver la falta de datos oficiales.

## Decisión

Para la primera versión del simulador se elige la **opción B**. La aplicación no calcula el Puntaje Ranking. Se ingresa como dato del estudiante, validado entre 100 y 1000.

## Justificación

- Evita publicar un valor que no es el oficial, en línea con AGENTS.md 2.1.
- La fórmula oficial para la Admisión 2027 está documentada arriba. Para aplicarla se necesitan los datos de referencia de cada contexto educativo.
- El ranking es un dato que el estudiante ya tiene. Ingresarlo no pide datos personales adicionales (RUN, contraseña o datos del colegio).

## Consecuencias

- El simulador muestra el Puntaje Ranking como «el que ingresaste», nunca como un valor calculado por la plataforma.
- Hay que explicar en la interfaz, en lenguaje claro, dónde encontrar el puntaje y que la plataforma no lo calcula.
- El ponderado sí se calcula en la aplicación, porque usa ponderaciones oficiales cargadas desde el DEMRE y no depende de los datos de colegios.
- Cuando el DEMRE publique los datos de referencia por colegio, o cuando el nuevo ranking entre en vigencia, este ADR debe revisarse. Ese cambio se decide en un ADR nuevo.
- El PR 61 deja de implementar el cálculo del ranking y mantiene solo la validación del valor ingresado y el cálculo del ponderado.
