# Resumen interno del pronóstico para la propuesta (uso interno)

> **Uso interno. No publicar.** Este resumen no se muestra en el portal ni se cita fuera del equipo (ADR 0017 y 0018). Las cifras son registradas y no comparadas todavía con lo observado. Ninguna institución va nombrada aquí.

> **Estado (11-nov-2026): proyección.** El producto vigente es el sitio para estudiantes y el panel de seguimiento para colegios, y su cliente son colegios y sostenedores. Este resumen describe un producto de planificación de oferta para instituciones de educación superior, que queda fuera del alcance actual y se conserva como escalabilidad futura. Reemplazado en parte por el ADR 0031 (producto y organización).

Fecha: 2026-11-09 · Fuente de las cifras: [`datos/pronosticos/dashboard/cifras_nacionales.json`](../../datos/pronosticos/dashboard/cifras_nacionales.json) · Propuesta completa: [`propuesta-institucional.md`](propuesta-institucional.md)

## 1. Qué decir en una frase

Estimamos cuántos estudiantes entrarán a primer año en 2027 y cuántos seguirán en 2028, con un rango, y publicaremos la comparación con lo observado aunque salga mal. Hoy no hay ningún resultado observado todavía, así que la prueba está en el historial de validación, no en un ahorro demostrado.

## 2. Cifras que se pueden mencionar

| Qué mide | Valor | Rango (intervalo) | Registro | Fuente |
|---|---|---|---|---|
| Primer año de pregrado 2027, total nacional | 382.725 | 357.992 a 387.869 | 2026-11-07 | SIES y Mineduc, elaboración propia |
| Permanencia de primer año 2028, total nacional | 296.601 | 277.434 a 300.588 | 2026-11-07 | SIES (retención cohorte 2025), elaboración propia |
| Rendidores PAES regular 2027, por región | Línea base registrada | Error mediano de validación 1,7 % a 7,2 % en años normales | 2026-11-07 | DEMRE, elaboración propia |

Retención de primer año de la cohorte 2025 (SIES): universidades 84,7 %, institutos profesionales 72,5 %, CFT 69,9 %, total 77,9 %. Con la mezcla de tipos de 2026, el promedio ponderado es 77,5 %. La diferencia entre 77,5 % y 77,9 % no está desglosada.

## 3. Qué tan bien ha funcionado (historial de validación)

- **Por carrera y sede** (18.178 casos con 30 o más entrantes, años 2022 a 2026): error mediano de 11,9 %. El intervalo cubre el 94,8 % de los casos, pero supone que el total del año ya se conoce. Un pronóstico real tiene más incertidumbre, así que la cobertura real es menor.
- **Ancho del intervalo por carrera y sede:** unas ×3,2 veces. Son cifras de orden de magnitud. No sirven para decidir la apertura o el cierre de una sección.
- **PAES:** la validación entre 2022 y 2023 es el punto más débil (error de 13,3 % en el registro regional), y su causa no está confirmada. Se informa, no se oculta.
- **Cinco años de prueba.** Es poca evidencia.

## 4. Qué no decimos

- No decimos que el producto ahorra tiempo o dinero. No está demostrado.
- No decimos que cumple las exigencias de Mineduc o de la CNA. El mapeo no está hecho.
- No decimos que predice la deserción de ningún estudiante (ADR 0010 y 0016).
- No usamos la proporción de mujeres para decidir ni para seleccionar (ADR 0018, Ley 20.609 art. 2°).
- No ordenamos ni destacamos instituciones.

## 5. Preguntas que nos harán y respuesta honesta

| Pregunta | Respuesta actual | Qué falta |
|---|---|---|
| ¿Es mejor que lo que usamos hoy? | No sabemos. | La serie histórica de la institución para comparar error. |
| ¿Sirve para lo que nos exige el Mineduc o la CNA? | No está verificado. | Listar cada reporte y verificarlo en la fuente oficial. |
| ¿Podemos auditarlo sin depender de ustedes? | Sí, en parte: registro con cadena de hash, scripts en el repositorio, fuentes públicas. | Un instructivo para correrlo con sus propios datos. |
| ¿Qué pasa con nuestros datos si nos vamos? | El producto trabaja solo con datos públicos y agregados. | Cláusula de salida y revisión legal. |

## 6. Calendario de comparación (fechas que se pueden citar)

- **4 de enero de 2027, 08:00 (hora de Chile continental):** publicación de resultados PAES regular 2027. Confirmada en la página de DEMRE, revisada el 2026-11-08. Antes de citarla en un documento externo, abrir a mano el afiche DEMRE; la URL de origen no está registrada.
- **Abril a mayo de 2027:** cuarto medio por residencia (Mineduc). **Fecha no verificada.**
- **Mediados de 2027:** primer año de pregrado 2027 (SIES). **Fecha no verificada.**
- **Agosto de 2028:** retención de la cohorte 2027. **Fecha no verificada.**

Solo se cita como confirmada la primera fecha.

## 7. Pendientes antes de usar esto con una institución

1. Revisión legal (ADR 0018: Ley 21.719, que entra en vigencia el 1 de diciembre de 2026; y el artículo 8° bis de decisiones automatizadas).
2. Decisión del líder sobre precio y vía de compra (rango propuesto en la propuesta institucional, sin decidir).
3. Confirmar la institución de validación y su autorización por escrito. Sin eso no se usa su nombre.
4. Verificar a mano las fechas de la sección 6 antes de citarlas.

## 8. Dónde están los números

- Cifras y límites: [`cifras_nacionales.json`](../../datos/pronosticos/dashboard/cifras_nacionales.json)
- Tablero de uso interno, con todas las validaciones: [`datos/pronosticos/dashboard/`](../../datos/pronosticos/dashboard/) (se abre en local, no se sube)
- Método y decisiones: [`informe-pronostico-2027.md`](../analisis/informe-pronostico-2027.md) y [ADR 0018](../decisiones/0018-producto-de-planificacion-de-oferta.md)
