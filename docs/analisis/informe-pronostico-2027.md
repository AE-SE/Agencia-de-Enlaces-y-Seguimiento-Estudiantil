# Informe del pronóstico 2027-2028: qué se predijo, cómo y por qué

Fecha: 2026-11-07 · Estado: borrador de trabajo para el líder (@rafajaque) · Relacionado: [ADR 0018](../decisiones/0018-producto-de-planificacion-de-oferta.md), [plan de análisis](plan-de-analisis.md), [reproducción](../../datos/pronosticos/REPRODUCIR.md)

Este informe deja constancia de lo que se predijo, con qué método, qué decisiones se tomaron y por qué. También dice qué aún no se puede afirmar. Cada cifra está en el registro append-only `datos/pronosticos/registro_pronosticos.csv`, con su hash y fecha de registro.

## 1. Qué se predijo

| Pronóstico | Valor previsto | Intervalo | Registrado |
|---|---|---|---|
| Primer año de pregrado 2027, nacional | 382.725 | 357.992 a 387.869 | 2026-11-07 |
| Permanencia de primer año 2028, nacional | 296.601 | 277.434 a 300.588 | 2026-11-07 |
| Cuarto medio 2027 por comuna de residencia (334 comunas) | Persistencia con tendencia nacional, factor 1,0314 | ×0,802 a ×1,355 | 2026-11-07 |
| Rendidores PAES Regular 2027, línea base por comuna | Persistencia sobre 2026 (317.700 rendidores) | Empírico, ver sección 3 | Versión DEF2 |
| Primer año 2027 por carrera y sede | 15.043 celdas: 6.961 publicables y 8.082 suprimidas | Solo validado, no registrado por celda | No (uso interno) |

Las cifras de la PAES por comuna no se citan. Solo se citan agregados regionales y nacionales (criterio de citación, plan A7).

## 2. Cómo se hizo

**Primer año 2027.** Se usó la regla del último año observado:

- primer año(t) = cohorte de cuarto medio por residencia(t−1) × tasa(t)
- tasa(t) = primer año(t−1) / cohorte(t−2)

Para 2027: cohorte de residencia 2026 de 236.962 alumnos × tasa 2026 de 1,615 ≈ 382.725. El intervalo sale de los cambios de la tasa entre años consecutivos (cuantiles 2,5 % y 97,5 %).

**Permanencia 2028.** Se aplicó la retención ponderada por la mezcla de tipos de institución de 2026:

- universidades 84,7 %, IP 72,5 %, CFT 69,9 % (retención de la cohorte 2025, informe SIES)
- mezcla 2026: 43,5 % universidades, 44,8 % IP, 11,8 % CFT
- retención ponderada: 77,5 %

Así, 382.725 × 0,775 ≈ 296.601. El intervalo sale del de primer año. No incluye el cambio de retención entre cohortes.

**Carrera y sede.** Se usó la participación del último año (2026) sobre el total nacional. Es el método que ganó la prueba de la sección 5 bis. La proporción de mujeres se calcula con el mismo promedio, solo como dato de planificación.

**Cohorte de residencia.** Se usó la residencia, no el colegio. La razón es que DEMRE asigna la comuna del colegio, y la matrícula de Mineduc cuenta por ubicación del establecimiento. En San Fernando, por ejemplo, la comuna del colegio sobreestimaba la cohorte local en 27 %.

**Validación.** Antes de publicar, se hizo una prueba hacia atrás (2022 a 2026):

- primer año nacional: error entre −7 % y +1,4 %
- por carrera y sede (celdas con al menos 30 alumnos): error mediano 11,9 %, cobertura del intervalo 94,8 % (con el total conocido, optimista)
- por sede: error mediano 11,6 %, ancho mediano ×4,9
- por institución: error mediano 10,4 %, ancho mediano ×5,5

## 3. Por qué se tomaron estas decisiones

| Decisión | Razón | Fuente o prueba |
|---|---|---|
| Unidad de residencia y no de colegio | El colegio sobreestima la cohorte local | Matriz residencia → colegio (Mineduc 2026) |
| Definición de rendidor: fila con al menos un puntaje regular distinto de vacío y de cero | Contar filas incluía a quienes solo rindieron Invierno; el salto 2022→2023 era ese cambio | DEMRE confirmó la definición (2026-11-07) |
| Intervalos empíricos y no de Poisson | Los intervalos de Poisson cubrían solo 62 a 72 % con 95 % declarado | Calibración de cambios logarítmicos entre procesos PAES |
| Ambos intervalos para la PAES, con y sin pandemia | Excluir el par 2020→2021 estrecha la región, pero no la cola alta de la comuna. Se reportan los dos para que quien lee elija | Variante DEF2-SIN-PANDEMIA |
| Supresión de celdas con menos de 10 alumnos | Protege a estudiantes y evita cifras inestables | ADR 0018, límite 1 |
| Sin variables protegidas para decidir (sexo, edad, situación socioeconómica, origen escolar) | Ley 20.609, art. 2°; Ley 21.719 define la elaboración de perfiles y la situación socioeconómica como dato sensible | ADR 0018, sección "Contexto" |
| Registro append-only con cadena de hash | Ninguna cifra se edita; las correcciones son filas nuevas con su motivo | `registro.py`, verificación válida |
| Sin predicción individual | No hay datos individuales que lo respalden y la Ley 21.719 regula las decisiones automatizadas (art. 8° bis) | ADR 0016 (no habilitado) |
| Permanencia calculada por tipo de institución | La retención varía fuerte entre tipos (de 69,9 % a 84,7 %) | Informe SIES de retención 2026 |

## 4. Límites que deben acompañar cualquier cifra

- **Supuesto de total conocido** en la validación: en un pronóstico real, el total también tiene incertidumbre. La cobertura real es menor que la medida.
- **Cinco años de prueba** y un quiebre no explicado en 2022→2023 en la PAES. Por eso el intervalo de la PAES por comuna es amplio y no se cita.
- **Ancho por carrera y sede de ×3,2 (método del último año).** Agregar no lo reduce (ver sección 2). Las cifras por carrera son un orden de magnitud, no una cifra para decidir una sección.
- **La mezcla de tipos de institución** se mantiene constante en 2028.
- **Cohortes de matrícula de Mineduc** se toman con corte al 30 de abril de cada año. Las fechas de publicación de las fuentes futuras no están verificadas (ver sección 5).

## 5. Qué falta para verificar

| Qué se compara | Cuándo (por verificar) | Estado |
|---|---|---|
| Rendidores PAES Regular 2027 | Resultados el 4-ene-2027, 08:00 | Confirmada en la página oficial de DEMRE (revisada el 2026-11-08): calendario 2027 y resultados PAES Regular |
| Cuarto medio 2027 por residencia | Matrícula Mineduc, abril a mayo de 2027 | No verificada |
| Primer año de pregrado 2027 | Matrícula SIES, mediados de 2027 | No verificada |
| Permanencia 2028 | Informe de retención de la cohorte 2027, agosto de 2028 | No verificada |

Cada comparación se publicará tenga buen o mal resultado, con el error y la cobertura del intervalo.

## 5 bis. Mejoras probadas (2026-11-07)

Se probaron tres formas de estimar la participación de cada carrera y sede, y dos supuestos para el total del año (`datos/pronosticos/mejora_sede.py`). La validación es hacia atrás (2023-2026) y el intervalo sale de los errores de los otros años.

| Participación | Total | Error mediano | Cobertura | Ancho mediano |
|---|---|---|---|---|
| Promedio de 3 años (método actual) | Conocido | 15,5 % | 95,0 % | ×3,84 |
| **Último año** | Conocido | **11,6 %** | 94,7 % | **×3,23** |
| Tendencia amortiguada | Conocido | 14,1 % | 94,7 % | ×4,31 |
| Promedio de 3 años | Honesto | 15,8 % | 94,8 % | ×3,91 |
| **Último año** | Honesto | **11,9 %** | 94,7 % | **×3,27** |
| Tendencia amortiguada | Honesto | 14,4 % | 94,7 % | ×4,36 |

**Lectura:**

- Usar solo el último año reduce el error mediano de 15,8 % a 11,9 % y el ancho de ×3,9 a ×3,3. Es el mejor método de los probados. Conviene adoptarlo en el informe.
- La tendencia amortiguada empeora. Los cambios de participación entre años no siguen una tendencia estable.
- El total honesto (crecimiento del último año) cuesta solo 0,2 a 0,3 puntos de error. El total no es la fuente principal del error por carrera.
- **Advertencia de comparación:** el método del último año tiene más casos (14.775 frente a 13.532), porque requiere menos años con datos. Para una comparación exacta hay que repetir la prueba solo con las celdas que tienen los tres métodos.
- El ancho sigue siendo ×3,3. Cambiar el método no vuelve publicable la cifra por carrera. Lo que sí se puede decir es que el error bajó.

### Segunda ronda (celdas comunes)

Para cerrar la advertencia de comparación, se repitió la prueba solo con las celdas que tienen los tres métodos (`datos/pronosticos/mejora_sede_2.py`, 13.466 casos en total):

| Participación | Intervalo | Error mediano | Cobertura | Ancho mediano |
|---|---|---|---|---|
| **Último año** | Fijo (cuantiles de todos los errores) | **11,6 %** | 94,7 % | **×3,14** |
| Último año | Por volatilidad de la celda | 11,4 % | 94,5 % | ×3,31 |
| Contracción 0,6 / 0,4 | Fijo | 12,5 % | 94,7 % | ×3,09 |
| Contracción 0,6 / 0,4 | Por volatilidad | 12,2 % | 94,6 % | ×3,27 |

**Conclusiones:**

- El último año sigue siendo el mejor método en las celdas comunes. Confirma la mejora de la ronda anterior.
- El intervalo por volatilidad no angosta el intervalo. Además, esa variante usa menos casos (12.120), así que su comparación no es exacta. Por ahora no se adopta.
- El ancho por celda queda en ×3,1 a ×3,3 con cualquiera de los métodos probados. Esto indica un límite de los datos disponibles: la variación de la participación entre años es casi toda la incertidumbre. Reducirla exige información externa, por ejemplo la oferta de vacantes por carrera o la demanda por sede.

## 6. Qué no se ha hecho

- No se ha publicado ni citado ninguna cifra fuera del repositorio.
- No se ha probado el pronóstico con una institución.
- No se ha decidido el precio ni la vía de compra; eso es del líder y de asesoría legal.
- El ADR 0018 sigue como propuesta, pendiente de revisión legal.
