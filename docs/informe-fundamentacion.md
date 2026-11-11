# Informe integral: fundamentación del problema, evidencia y promesa verificable

**Agencia de Enlace & Seguimiento Estudiantil**
4 de noviembre de 2026

Documento de síntesis del expediente de evidencia. Consolida y resume
`evidencia-acceso-salud-mental.md`, `series-y-proyeccion.md`,
`decisiones/0012-cadena-causal-y-promesa.md`, `cierre-de-pendientes.md` y
`revision-final.md`. Cada afirmación remite al documento que la respalda.

> **Alineación con la idea final (11-nov-2026).** El producto es un sitio gratuito
> para estudiantes de 3.º y 4.º medio de liceos con financiamiento público y un
> panel de seguimiento para colegios; el cliente son colegios y sostenedores, y la
> organización es una fundación sin fines de lucro (texto de referencia:
> `docs/entregable/Entregable_Parte_I.md`, puntos 2, 4.7, 8 y 9). La evidencia de
> las secciones 1 a 4 respalda ese problema. Lo que este informe dice del módulo de
> permanencia, el pulso de check-in y la venta a instituciones de educación
> superior es **proyección o escalabilidad**, no oferta vigente. Reemplazado en
> parte por el ADR 0031 (producto y organización).

---

## Resumen ejecutivo

El proyecto partió de una hipótesis intuitiva: el estudiante desinformado no
entra a la educación superior, y no entrar lo deprime; por lo tanto, ayudarlo a
entrar reduciría la depresión. La verificación contra la evidencia disponible
mostró que **esa cadena no se sostiene en su último eslabón**, y que sostenerla
expondría al proyecto en cuatro frentes: ético, regulatorio, académico y
comercial.

La cadena se reformuló con un desenlace distinto —la **exclusión**, no la
depresión— y el resultado es más defendible y, además, medible por la propia
plataforma.

Tres conclusiones ordenan el resto del informe:

1. **La desinformación es una causa evitable y demostrada de exclusión.** Hay
   evidencia experimental, incluida evidencia chilena producida con el Mineduc.
2. **El sistema está mejorando en acceso mientras la salud mental juvenil se
   deteriora.** Esa divergencia, y no un relato de empeoramiento general, es el
   argumento que resiste.
3. **No existe obligación legal de acompañamiento en educación superior, pero sí
   un estándar de acreditación que lo premia.** Es un argumento de la proyección
   hacia instituciones de educación superior, hoy fuera del alcance. Para el
   cliente actual (colegios y sostenedores) el argumento es otro: el estándar 7.3
   y el gasto en actividades de información y orientación del Plan de Mejoramiento Educativo (Entregable
   Parte I, punto 8.1).

---

## 1. El problema, en seis datos

| Paso | Dato | Fuente |
|---|---|---|
| No sabe | *Sin cifra publicable por ahora.* La encuesta de Fundación por una Carrera mide cuántos estudiantes se sienten «poco o nada informados», no cuántos «no saben postular», y no tiene informe público | Pendiente: informe de la fundación |
| No postula | *Sin cifra publicable por ahora.* No existe un denominador oficial de «jóvenes con derecho que no postularon» | Pendiente: fuente de la fundación |
| No entra | De **258.418** egresados de enseñanza media en 2020, **143.191 (55,4%)** no estaban matriculados en educación superior en 2021. Mide ingreso inmediato, no «nunca» | Centro de Estudios del Mineduc, *Evidencias 55* (2022), Tabla 10, p. 80 |
| Contraste oficial | **97.602** seleccionados que egresaron el año anterior, Admisión 2026 | Mineduc |
| Queda fuera | **19%** de los jóvenes de 18 a 24 años no estudia ni trabaja. Comparación con el promedio OCDE en revisión (13% o 14%) | OCDE, *Education at a Glance 2026* |
| Se deteriora | **26,9%** de las personas jóvenes presenta síntomas moderados o severos de ansiedad o depresión, contra 13,0% de los adultos (2022). Mide ambos juntos (escala PHQ-4, el Cuestionario de Salud del Paciente de cuatro preguntas), no solo depresión | INJUV, 10.ª Encuesta Nacional de Juventudes 2022, p. 126 |

De los egresados de 2020, más de la mitad no estaba en educación superior un año
después.

**Advertencia de rigor obligatoria:** las cifras del 48%, 80.000 y 120.000 que
circulan atribuidas a Fundación por una Carrera no tienen informe público detrás y
quedan fuera de este informe. Si la fundación lo entrega, se citan con su alcance
(organización de la sociedad civil, muestra intencionada en establecimientos
vulnerables) y junto a cifras oficiales. Nunca como estadística estatal. Detalle
en [verificación de cifras](verificacion-de-cifras.md).

### El dato que conecta los dos problemas (retirado)

El gradiente de 11% en el quintil de mayores ingresos contra 22% en el de menores
(ronda 12 del Termómetro) no figura en ningún documento oficial publicado, así que
se retira hasta tener el informe de la ronda.

---

## 2. La cadena causal, eslabón por eslabón

El desenlace es la **exclusión**. La salud mental es el costo asociado, no la
variable que la plataforma promete mover.

### A. La desinformación reduce el acceso — causal, experimental en Estados Unidos

- **Chile**: ensayo aleatorizado de Hastings, Neilson y Zimmerman con el Mineduc.
  Informar sobre costos y retornos cambió las matrículas hacia programas de mayor
  valor; efecto sobre ingresos esperados de 1,4% promedio y 3,0% en nivel
  socioeconómico bajo. Mide la **elección de programa**, no el acceso: no se cita
  como evidencia chilena de que entren más personas.
- **HAIL (Michigan)**: los tratados postularon y se matricularon a más del doble.
  De los 15 puntos de efecto, **4 puntos son estudiantes que no habrían entrado a
  ninguna institución**.
- **Expanding College Opportunities**: aumentó postulaciones, admisiones y
  matrícula en 3.000 estudiantes aleatorizados.
- **FAFSA / H&R Block**: la asistencia para completar el formulario aumentó
  postulación, matrícula y permanencia (**+8 puntos** de seguir al menos dos
  años).

Matiz de diseño decisivo: las intervenciones de bajo contacto con material
genérico muestran **efectos nulos**. Funciona la información personalizada y
accionable con reducción de fricción del trámite.

### B. Quien no entra engrosa la población excluida — documentado

Chile está 5 o 6 puntos sobre el promedio OCDE en el tramo 18-24 (pendiente de confirmar), y en 21% contra 16%
en el tramo 25-29. El Barómetro CIES-UDD registró 21,6% en el tramo 25-34 en
mayo-julio de 2026, con el empleo de 18 a 34 años cayendo 4,7% en doce meses.

Matiz honesto: estar en esa condición no significa no querer trabajar. El 41% de
quienes están ahí entre 25 y 34 años busca empleo sin conseguirlo.

### C. La exclusión deteriora la salud mental, y la reinserción la mejora — causal longitudinal

Metaanálisis de Paul y Moser sobre 237 estudios transversales y 87
longitudinales: tamaño de efecto **d = 0,51**; 34% de problemas psicológicos
entre desempleados contra 16% entre empleados. Los diseños longitudinales y los
experimentos naturales respaldan que el desempleo **causa** el malestar, y que
**recuperar la inserción lo mejora**. El efecto es más fuerte en países con
distribución desigual del ingreso: Chile califica.

Limitación declarada: no acceder a la educación superior no es idéntico a quedar
desempleado. La transferencia es una analogía razonable, no una medición directa.

### D. Entrar remueve la exposición; no trata el síntoma

**No se puede afirmar** que entrar a estudiar reduzca la depresión: un estudio
con variables instrumentales no encontró efecto causal de la educación superior
sobre la salud mental, y las revisiones describen la evidencia como escasa y
mixta.

**Sí se puede afirmar** que entrar remueve la exposición del eslabón C:

> La plataforma no reduce la prevalencia de depresión en quien ya la tiene.
> Reduce la **incidencia** evitable atribuible a un factor de riesgo documentado:
> la exclusión formativa y laboral por desinformación.

### La objeción previsible, y su respuesta

*"Pero los universitarios chilenos también están mal."* Cierto: la prevalencia
combinada de síntomas depresivos en educación superior chilena está entre 16,5% y
38,8%. No contradice la cadena, porque la comparación correcta no es
*universitarios contra población general* —poblaciones distintas, sesgo de
selección, distinta tasa de detección— sino **este mismo joven estudiando contra
este mismo joven excluido**, que es la comparación del eslabón C.

Además, esa objeción es argumento **a favor** del módulo de permanencia del
ADR 0010: entrar no basta. Ese módulo queda como proyección, fuera del alcance
actual.

---

## 3. El hallazgo de series: divergencia, no empeoramiento

| Serie | Dirección | Magnitud |
|---|---|---|
| Matrícula de pregrado | mejora | +13% entre 2022 y 2026 |
| Retención de primer año | mejora | 75,6% → 77,3% (cohortes 2020-2024) |
| Jóvenes fuera de estudio y trabajo (18-24) | mejora | 26,1% (2020) → 19% (2025) |
| Salud mental | **deterioro abrupto** | Quiebre en 2026 tras mínimos históricos |

El quiebre está documentado, no proyectado: el indicador general de problemas de
salud mental pasó de **12,7% en abril de 2025 —el mejor registro de toda la serie
desde 2020— a 18,5% en junio-agosto de 2026**. La depresión moderada o severa
llegó a 16,2%. Según la ACHS, es el primer empeoramiento simultáneo de esta
amplitud desde la pandemia, consistente en cinco instrumentos distintos.

**El encuadre que resiste:**

> El sistema está logrando que entren más jóvenes, que se queden más, y que menos
> queden fuera de todo. Y aun así, los jóvenes están peor que nunca desde la
> pandemia. El problema ya no es solo de acceso: es de acompañamiento.

Un relato de "todo empeora" se desmonta con las cifras de matrícula. Este no.

### Sobre proyecciones

La serie **no soporta extrapolación** (cambio de universo entre rondas,
periodicidad irregular, estacionalidad, no monotonía). En su lugar, tres
argumentos verificables:

- **Aritmética de brecha:** Chile está 5 o 6 puntos sobre la OCDE (pendiente de
  confirmar el promedio); en una década la brecha se redujo 2 puntos. A ese ritmo,
  cerrarla tomaría unas dos o tres décadas.
- **Aritmética de stock:** 143.191 egresados al año sin matrícula un año después
  son unos 430.000 en tres cohortes **aunque la tasa no suba** (parte de ellos
  ingresará más tarde: es una cota del flujo, no de quienes nunca entran).
- **Divergencia:** las cuatro series con sus direcciones reales.

> No hace falta que la cifra suba para que haya urgencia. Basta con que se
> mantenga: cada año sin intervenir agrega una cohorte completa.

---

## 4. El dato que conecta acceso con permanencia

De los informes de retención del SIES:

| Cohorte | Persistencia CON beneficios | SIN beneficios | Brecha |
|---|---|---|---|
| 2020 | 86,3% | 74,2% | 12,1 pp |
| 2022 | 88,2% | 74,4% | **13,8 pp** |

> Conseguir el beneficio no solo permite entrar. Los estudiantes con beneficios
> persisten casi 14 puntos porcentuales más. El trámite de postular a los
> beneficios no decide solo el ingreso: acompaña la permanencia.

**Advertencia obligatoria:** es una diferencia observada, **no un efecto causal**.
Quienes obtienen beneficios difieren sistemáticamente (selección socioeconómica,
requisitos de renovación). La magnitud causal real es con certeza menor. La
evidencia causal del vínculo ayuda-persistencia es la del experimento FAFSA
(+8 puntos), que sí está identificada.

---

## 5. Marco normativo: lo que obliga y lo que premia

> Esta sección sirve a la proyección hacia instituciones de educación superior
> (fuera del alcance actual). El cliente vigente son colegios y sostenedores; su
> argumento normativo está en el Entregable Parte I, punto 8.1.

### No existe obligación legal de acompañamiento

Revisada la Ley 21.091 sobre Educación Superior: **no hay obligación para las
instituciones** de implementar acompañamiento, nivelación, tutorías ni
retención, ni referencia al primer año. El Art. 8 letra c) encarga promover
"permanencia y titulación o graduación oportuna" **a la Subsecretaría, no a las
instituciones**.

### Pero la acreditación sí lo exige como estándar

El **Criterio 2 (Procesos y resultados de enseñanza y aprendizaje)**, dentro de
la **Dimensión I (Docencia y resultados del proceso de formación), obligatoria**,
exige:

- acciones de apoyo a la **progresión estudiantil** en todos los niveles
  formativos, con apoyos de bienestar administrativo, académico y socioafectivo;
- indicadores de progresión **definidos y evaluados periódicamente**;
- en su nivel más alto, **evidencia de la eficacia** de esas estrategias.

El **Criterio 7** (Dimensión II, obligatoria) exige política de diversidad e
inclusión con resultados demostrables.

**Consecuencia estratégica:** sin mandato legal, el producto no se vende como
cumplimiento normativo —lo que lo volvería un costo obligatorio que se compra al
precio más bajo—. Con colegios y sostenedores se plantea como herramienta de apoyo
al estándar 7.3 y a el gasto en actividades de información y orientación del Plan de Mejoramiento Educativo;
la versión «ventaja competitiva en acreditación» queda para una etapa futura con
instituciones de educación superior.

**Vocabulario obligatorio:** decir **progresión**, no retención ni deserción, al
argumentar acreditación ante una universidad. Es el término del estándar
institucional.

---

## 6. Promesa autorizada y límites

### Lo que la agencia promete

> La plataforma reduce la exclusión de la educación superior causada por
> desinformación sobre beneficios estudiantiles.

(La segunda parte de la versión anterior, «y acompaña la permanencia de quienes
ingresan», se retira de la promesa vigente: pertenece a la proyección.)

### Lo que la agencia no promete nunca

Prohibido afirmar o insinuar que la plataforma reduce la depresión, mejora la
salud mental o previene trastornos; que detecta, evalúa o predice el estado de
salud mental de una persona; que sustituye atención profesional; que ayuda a
cumplir una obligación legal de acompañamiento (no existe); o que garantiza la
acreditación.

Prohibido además usar la prevalencia de depresión juvenil como gancho comercial,
y presentar a un joven con depresión como caso de uso.

**Razones, en orden:** ética (la prevalencia de depresión juvenil no es material
de marketing); riesgo regulatorio (posicionaría a la agencia como interviniente
en salud, contra el ADR 0010); defensa académica (es el flanco por donde una
comisión desarma el proyecto en una pregunta); eficacia del pitch (una audiencia
sofisticada detecta la sobrepromesa y desconfía de todo el resto).

### Métricas de éxito

Solo lo que la plataforma puede medir sobre sí misma: postulaciones FUAS
completadas, beneficios obtenidos, matrícula efectiva, renovación de beneficios y
continuidad en segundo año (las dos últimas, de la proyección). **Ningún indicador de salud mental es métrica de
producto.**

---

## 7. Caso regional: O'Higgins

- **La oferta académica se concentra en 6 de las 33 comunas** de la región.
- **Caída de matrícula de primer año 2026: -2,62%**, de 9.853 a 9.595 (258
  estudiantes menos), contra la tendencia nacional al alza.
- **La caída es casi enteramente de mujeres:** la matrícula femenina baja en 297
  (-5,60%) mientras la masculina sube en 39 (+0,86%).
- Descontado el efecto de reclasificación de INACAP, la Universidad de O'Higgins
  cae en 272 estudiantes.
- PAES 2026: 10.004 personas habilitadas para postular en la región.
- El programa PACE facilitó el acceso de más de 1.000 jóvenes regionales en diez
  años, e incorporó 11 comunas nuevas en 2025 que antes no estaban cubiertas.

**Advertencias de uso:** no citar la caída de CFT (-46%) ni el alza de IP (+43%)
como fenómeno real: es un traspaso administrativo de INACAP. La fuente es un
análisis regional publicado por el rector del IP-CFT Santo Tomás sede Rancagua,
no un informe oficial; atribuirla como tal. La discrepancia con el -4,9% del
informe CNED sigue abierta.

**Dato verificado (antes en cuarentena):** en la 10.ª Encuesta Nacional de
Juventudes 2022 (INJUV, p. 127), **24,8%** de las personas jóvenes de O'Higgins
presenta síntomas ansiosos o depresivos moderados o severos (escala PHQ-4, últimas
dos semanas), contra 26,9% nacional. El indicador junta ansiedad y depresión: no
citar como «depresión». Por valor O'Higgins queda séptima y no sexta, pero **no
usar el lugar en el ranking**: el informe aclara que las diferencias regionales no
son significativas respecto del promedio nacional.

---

## 8. Consecuencias de diseño del producto

1. Información **personalizada y accionable**, no genérica: las intervenciones
   genéricas muestran efectos nulos.
2. El valor está en **reducir la fricción del trámite**, no solo en informar.
3. **Orientación vocacional** como componente, no adorno: el campo de estudio
   asignado tiene efectos documentados sobre salud mental que el acceso en bruto
   no tiene.
4. El pulso de check-in (ADR 0010), en proyección y fuera del alcance actual, se
   mantiene como **sensor, nunca predictor ni instrumento diagnóstico**.
5. La **escalera de derivación** (ADR 0010, componente 3): el respaldo que citaba
   la ronda 12 (45,9% sin identificar la necesidad de consultar; 73,8% de mejoría
   y 75,4% de satisfacción entre quienes recibieron atención) **se retiró** hasta
   tener el informe de la ronda. Las rondas 8 y 9 sí publican la brecha de
   reconocimiento (ver `series-y-proyeccion.md`).

---

## 9. Estado de verificación

**Verificado y cerrado**
- Serie del Termómetro desde los informes originales (rondas 8 a 11). La ronda 12
  no tiene informe público y pasa a «Abierto».
- Cifra OCDE contra la nota país: 26,1% (2020). El 19% de Chile coincide con la
  nota país; el promedio OCDE (13% o 14%) y el año de referencia (2024 o 2025)
  quedan en revisión.
- Serie de retención de primer año por cohorte (SIES).
- Persistencia con y sin beneficios (SIES).
- Discrepancia de matrícula de primer año: universos distintos, ambas series
  internamente consistentes.
- Ley 21.091: no obliga a acompañamiento.
- Criterios de acreditación: la progresión sí es estándar obligatorio.
- Caída de matrícula de primer año en O'Higgins: -2,62%, con efecto INACAP.
- Solicitud de transparencia FUAS: presentada el 4 de noviembre de 2026 (folio AJ025T0003786); la respuesta vence el 2 de diciembre de 2026.

**Errores detectados y corregidos**
- El 18,7% que circula como depresión de la ronda 10 es incorrecto: el valor es
  13,7%.
- El 23,4% de jóvenes fuera de estudio y trabajo venía de una edición antigua y
  colisiona con otro indicador del EAG 2026. Retirado.
- El 28,9% del tramo 18-24 corresponde a noviembre de 2024 y no es vigente. El
  reemplazo por 23% en menores de 30 también se retiró: no tiene informe público
  de la ronda. Se usa la cifra de la Encuesta Nacional de Juventudes 2022.
- El dato regional del INJUV se verificó (24,8%, indicador PHQ-4; el lugar en el ranking no se cita).
- Se retiraron las cifras sin origen verificable (48%, 80.000, 120.000 de la
  fundación; 22% contra 11% por ingreso; 27,9%; US$ 2.660 millones). Ver
  [verificación de cifras](verificacion-de-cifras.md).

**Abierto**
- Informe de la ronda 12 del Termómetro, con tablas por edad e ingreso, y las
  cifras de reconocimiento de necesidad y mejoría que se citaban de esa ronda.
- Cifras leídas por Codex y aún no abiertas por Claude (informe USACH, estudio
  IESALC-UNESCO, *Evidencias 55*, Barómetro Laboral, minuta de selección): ver
  [verificación de cifras](verificacion-de-cifras.md).
- Dato de ansiedad de la ronda 12: 17,9% según la nota de la UC, contra 25,8% de
  la ronda 11 según Achs; la escala se calcula con bases distintas, no comparar.
- Discrepancia O'Higgins -2,62% contra -4,9%.
- Respuesta de Mineduc a la solicitud FUAS: vence en torno al 2 de diciembre de
  2026, misma fecha de entrega del proyecto.
- Preguntas del pulso con revisión de criterio legal (ADR 0010).

---

## 10. Documentos del expediente

| Documento | Contenido |
|---|---|
| `evidencia-acceso-salud-mental.md` | Evidencia por eslabón, capa económica, material de pitch y línea roja de comunicación |
| `series-y-proyeccion.md` | Series verificadas, capítulo regional, escenarios y límites de la proyección |
| `decisiones/0012-cadena-causal-y-promesa.md` | Decisión: promesa autorizada, prohibiciones, métricas y ocho reglas de citación |
| `cierre-de-pendientes.md` | O'Higgins, Ley 21.091 y vía de cierre de lo que falta |
| `revision-final.md` | Revisión cruzada, corrección del dato regional y hallazgo de acreditación |
| `solicitud-transparencia-fuas.md` | Solicitud presentada a la Subsecretaría de Educación Superior por la serie FUAS (folio AJ025T0003786) |
