# Anexo de evidencia: desinformación, acceso y salud mental

Documento de respaldo para la cadena causal que sostiene la propuesta de valor de
la plataforma, en su uso comercial y académico. **Versión 4 — 4 de noviembre de
2026.** Correcciones de la revisión final aplicadas.

Mismo criterio que `docs/evidencia-permanencia.md` (ADR 0010): se distingue
evidencia causal de correlacional, y se declara el alcance de cada afirmación.

> **Correcciones aplicadas en esta versión.**
> 1. La cifra del tramo joven pasa de 28,9% (18-24 años, ronda 10, noviembre de
>    2024) a **23% en menores de 30 años** (ronda 12, junio-agosto de 2026), que
>    es la vigente. Los tramos no son comparables entre sí: citar siempre el
>    tramo exacto.
> 2. Se retira el 23,4% de jóvenes fuera de estudio y trabajo (edición antigua
>    de *Education at a Glance*, y además colisiona con otro indicador del EAG
>    2026). La cifra vigente es **19%** (datos 2025), verificada contra la nota
>    país de la OCDE.
> 3. La sección de pendientes se remite a `cierre-de-pendientes.md` y
>    `revision-final.md`.

---

## 1. El embudo: seis datos, un solo recorrido

| Paso | Dato | Fuente |
|---|---|---|
| 1. No sabe | **48%** de estudiantes de cuarto medio en establecimientos de alta vulnerabilidad no sabe cómo postular a gratuidad y beneficios | Fundación por una Carrera, 2026 (n > 2.500) |
| 2. No postula | **~80.000** jóvenes no postulan a beneficios cada año | Fundación por una Carrera |
| 3. No entra | **>120.000** egresan sin ingresar a educación superior | Fundación por una Carrera |
| 3b. Contraste oficial | **97.602** seleccionados que egresaron el año anterior, Admisión 2026 (≈27.000 más que en 2022) | Mineduc |
| 4. Queda fuera | **19%** de los jóvenes de 18 a 24 años no estudia ni trabaja, contra **13%** del promedio OCDE | OCDE, *Education at a Glance 2026* (datos 2025) |
| 5. Se deteriora | **23%** de los menores de 30 años presenta síntomas depresivos moderados o severos: el tramo más alto de todos los evaluados | Termómetro Achs-UC, duodécima ronda (junio-agosto 2026) |

Lectura del embudo: por cada joven que entra seleccionado, hay aproximadamente
uno que no entra. El paso 1 es donde la plataforma interviene. El paso 5 es el
costo que justifica intervenir.

### Datos de refuerzo del paso 4

- Chile está **6 puntos porcentuales sobre el promedio OCDE** en el tramo 18-24, y
  en **21% contra 16%** en el tramo 25-29.
- Tendencia nacional reciente: el Barómetro Laboral y Previsional (CIES-UDD y
  Asociación de AFP, con datos del INE) registró **21,6%** en el tramo 25-34 en el
  trimestre mayo-julio de 2026, alza de 1,7 puntos en doce meses. El empleo entre
  18 y 34 años cayó 4,7%, unos 135.000 ocupados menos.
- Matiz que conviene decir en el pitch antes de que lo digan por ti: estar en esa
  condición **no significa no querer trabajar**. El 41% de quienes están ahí entre
  25 y 34 años busca empleo sin conseguirlo.

### Dato de refuerzo del paso 5

El gradiente socioeconómico de la duodécima ronda: **11%** de prevalencia de
depresión en el quintil de mayores ingresos contra **22%** en el quintil de
menores ingresos. El doble. Es el dato que conecta empíricamente la
desinformación y la salud mental en la misma población, y es verificado.

---

## 2. La capa económica: lo que esto le cuesta al país

- **Costo de oportunidad de la deserción de primer año: US$ 2.660 millones
  anuales** (Facultad de Economía y Negocios, Universidad de Chile, promedio del
  período 2008-2016).
- La Cátedra UNESCO sobre Inclusión en la Educación Universitaria (USACH) estima
  que Chile pierde del orden de **$565.000 millones anuales** financiando estudios
  de alumnos que terminan abandonando.
- Tasa de deserción del sistema estimada por el SIES en torno a **27,9%**.
- Estudios nacionales sitúan el costo de la deserción en **más del 20% del gasto
  público en educación superior**.
- El presidente de la Comisión Nacional de Productividad calificó ese costo de
  oportunidad como "hundido", y planteó que el énfasis debería estar en
  **prevenir la deserción mediante mejor orientación** en escuelas e
  instituciones.

Advertencia de uso: estas cifras son de **deserción**, no de **no ingreso**. Son
pertinentes para el módulo de permanencia (ADR 0010) y para dimensionar el costo
sistémico, pero no deben presentarse como el costo de la desinformación en el
acceso.

---

## 3. La cadena, eslabón por eslabón

El desenlace de la cadena **no es la depresión**: es la exclusión. La salud mental
es el costo asociado a esa exclusión, no la variable que la plataforma promete
mover.

### Eslabón A — La desinformación reduce el acceso
**Sostenido con evidencia causal experimental, incluida evidencia chilena.**

- **Chile — Hastings, Neilson y Zimmerman**, ensayo aleatorizado con el Mineduc:
  informar sobre costos y retornos llevó a matricularse en programas de mayor
  valor y alejarse de opciones de baja selectividad y alto incumplimiento. Efecto
  sobre ingresos esperados: **1,4% promedio, 3,0% en nivel socioeconómico bajo**.
- **HAIL, Universidad de Michigan**: los tratados postularon a más del doble (67%
  contra 26%) y se matricularon a más del doble (27% contra 12%). De los 15 puntos
  porcentuales de efecto, **4 puntos son estudiantes que de otro modo no habrían
  entrado a ninguna institución**.
- **Expanding College Opportunities (Hoxby y Turner)**, 3.000 estudiantes
  aleatorizados: aumentó postulaciones, admisiones y matrícula. El grupo de
  control estaba seriamente mal informado sobre costos y alternativas.
- **Experimento FAFSA de H&R Block**: asistencia para completar el formulario más
  información personalizada aumentó postulación, matrícula y permanencia
  (**+8 puntos porcentuales** de seguir estudiando al menos dos años).

Matiz de diseño: las intervenciones de bajo contacto con material genérico
muestran efectos nulos. Funciona la información **personalizada y accionable con
reducción de fricción del trámite**.

### Eslabón B — Quien no entra engrosa la población excluida
**Sostenido, con magnitud chilena oficial.** Ver sección 1, paso 4.

### Eslabón C — La exclusión deteriora la salud mental, y la reinserción la mejora
**Sostenido con evidencia longitudinal causal, por analogía con desempleo.**

Este es el eslabón que hace funcionar la cadena, porque es **reversible en ambas
direcciones**.

- **Paul y Moser**, metaanálisis de 237 estudios transversales y 87
  longitudinales: tamaño de efecto **d = 0,51**. Entre desempleados, **34% presenta
  problemas psicológicos contra 16% entre empleados**.
- Hallazgo decisivo: los metaanálisis longitudinales y los experimentos naturales
  respaldan que el desempleo **no solo se correlaciona con el malestar sino que lo
  causa**, y que **recuperar la inserción mejora la salud mental**. Los efectos de
  selección existen pero son débiles.
- El efecto es **más fuerte en países con distribución desigual del ingreso o
  protección al desempleo débil**. Chile califica.
- Revisión sistemática con metaanálisis (2025): aumento consistente, de pequeño a
  moderado, del riesgo asociado al desempleo, y **reducción comparable al
  reinsertarse**. Declara falta de evidencia de alta certeza.
- **Benjet y coautores**, muestra probabilística: quienes no estudian ni trabajan
  presentan mayores probabilidades de trastorno psiquiátrico, consumo de
  sustancias y conducta suicida que quienes solo estudian, **incluso controlando
  por desventaja social**.

Limitación declarada: no acceder a la educación superior no es idéntico a quedar
desempleado. La transferencia es una analogía razonable, no una medición directa.

### Eslabón D — Entrar remueve la exposición; no trata el síntoma
**Sostenido como prevención de incidencia. NO sostenido como reducción de
prevalencia.**

**Lo que la evidencia NO permite decir:** que entrar a estudiar reduzca la
depresión. Un estudio con variables instrumentales sobre la expansión
universitaria en China encontró que la educación superior **no tuvo efecto causal
de mejora** sobre la salud mental. Las revisiones describen la evidencia causal
como escasa, mixta e inconsistente.

**Lo que la evidencia SÍ permite decir:** que entrar **remueve la exposición
documentada en el eslabón C**.

> La plataforma no reduce la prevalencia de depresión en quien ya la tiene.
> Reduce la **incidencia** evitable atribuible a un factor de riesgo documentado:
> la exclusión formativa y laboral por desinformación.

#### La objeción de los universitarios chilenos, y por qué no derriba la cadena

Existe alta prevalencia de síntomas depresivos **dentro** de la educación superior
chilena: una revisión de alcance con metaanálisis (32 estudios, 10 de calidad
suficiente) reporta prevalencia combinada de síntomas depresivos **entre 16,5% y
38,8%**; otras revisiones nacionales señalan que entre 27% y 30% de los
universitarios cumple criterios diagnósticos de depresión.

Parece contradecir la cadena. No la contradice, por un problema de comparación:

- Comparación incorrecta: *universitarios* contra *población general*. Mezcla
  poblaciones distintas, con sesgo de selección, distinta composición etaria y
  distinta tasa de detección.
- Comparación correcta (contrafactual): **este mismo joven estudiando** contra
  **este mismo joven excluido**. Es la comparación del eslabón C, y ahí la
  evidencia longitudinal acompaña.

Consecuencia operativa: la alta prevalencia intrauniversitaria es un argumento **a
favor** del módulo de permanencia del ADR 0010. Entrar no basta; por eso el
proyecto tiene dos etapas.

#### El ajuste importa más que el acceso en bruto

Un estudio con descontinuidad por puntaje de corte en admisión encuentra que el
**campo de estudio asignado** afecta prescripciones de antidepresivos y
hospitalizaciones por salud mental. Refuerza el módulo de orientación vocacional:
no da lo mismo en qué entra.

---

## 4. Material de pitch

### 4.1 Versión de 30 segundos

> El 48% de los estudiantes de cuarto medio en los colegios más vulnerables de
> Chile no sabe cómo postular a la gratuidad. No es que no califiquen: es que no
> saben. Cada año, unos 80.000 jóvenes no postulan a beneficios a los que tienen
> derecho, y más de 120.000 egresan sin entrar a la educación superior — una cifra
> comparable a los 97.602 que sí fueron seleccionados este año.
>
> Los que quedan fuera engrosan el 19% de jóvenes de 18 a 24 años que no estudia
> ni trabaja, seis puntos sobre el promedio OCDE. Y entre los menores de 30, la
> prevalencia de síntomas depresivos moderados o severos es la más alta de todos
> los tramos del país, y se duplica en el quintil de menores ingresos.
>
> Nosotros intervenimos en el primer eslabón, que es el único evitable con
> información.

### 4.2 Estructura de dos minutos

1. **El dato que abre** — 48%. Una sola cifra, sin adjetivos.
2. **El embudo** — 80.000 → 120.000 → contraste con los 97.602 de Mineduc.
3. **El destino** — 19% contra 13% OCDE. Chile no está en el promedio.
4. **El costo humano** — 23% en menores de 30 años (ronda 12, junio-agosto de
   2026), el tramo más afectado; 22% contra 11% entre quintil más bajo y más
   alto. Una o dos frases. No insistir.
5. **El costo económico** — US$ 2.660 millones anuales de costo de oportunidad por
   deserción, y la cita de la Comisión Nacional de Productividad sobre prevenir
   con mejor orientación.
6. **La evidencia de que se puede** — experimento chileno con el Mineduc; HAIL, de
   cuyos 15 puntos de efecto 4 son jóvenes que no habrían entrado a ninguna parte.
7. **El cierre honesto** — "No prometemos bajar la depresión juvenil. Prometemos
   sacar del camino el obstáculo que sí podemos sacar."

El punto 7 no es una concesión: es lo que diferencia el pitch de la competencia
que promete impacto en bienestar sin poder medirlo.

### 4.3 Línea roja de comunicación

**Prohibido en todo material del producto**, comercial o académico:

- Afirmar o insinuar que la plataforma reduce la depresión, mejora la salud mental
  o previene trastornos.
- Usar la prevalencia de depresión juvenil (el 23%, o cualquier cifra del
  Termómetro) como si fuera el problema que el producto resuelve.
- Testimonios, imágenes o relatos que presenten sufrimiento psíquico como gancho.
- Cualquier formulación en que un joven con depresión aparezca como caso de uso.

**Formulación autorizada:** la de la sección 4.1, más la frase de la sección 3,
eslabón D.

Razón, en orden de importancia:

1. **Ética.** La prevalencia de depresión juvenil no es material de marketing.
2. **Riesgo regulatorio.** Prometer efectos en salud mental posiciona a la agencia
   como interviniente en salud. Contradice el ADR 0010: puente, no tratante.
3. **Riesgo de defensa académica.** Es el flanco por donde una comisión desarma el
   proyecto: basta preguntar por evidencia causal.
4. **Riesgo de pitch.** Una audiencia sofisticada detecta la sobrepromesa, y
   cuando la detecta desconfía de todo el resto, incluida la parte sólida.

Sobre "generar conciencia sobre salud mental": es un objetivo legítimo, pero **no
es el mismo objetivo que vender el producto**, y mezclarlos daña a ambos. Si la
agencia quiere hacerlo, debe ser contenido separado, sin llamado a la acción
comercial, con derivación a la red pública y asesoría de criterio profesional.
Coherente con la escalera de derivación del ADR 0010 (componente 3).

---

## 5. Consecuencias de diseño

1. Información **personalizada y accionable**, no genérica.
2. El valor está en **reducir la fricción del trámite**, no solo en informar.
3. **Orientación vocacional** como componente, no adorno.
4. El pulso de check-in (ADR 0010, componente 4) se mantiene como **sensor, nunca
   como predictor ni instrumento diagnóstico**.
5. La métrica de éxito del producto es **postulación completada, beneficio
   obtenido, matrícula efectiva**. Nunca un indicador de salud mental.

## 6. Pendientes

El estado de pendientes de este expediente se lleva en `cierre-de-pendientes.md`
y `revision-final.md`. No duplicar aquí.

**Advertencia de rigor permanente:** las cifras de 48%, 80.000 y 120.000 provienen
de Fundación por una Carrera, organización de la sociedad civil, con muestra
intencionada en establecimientos vulnerables. Citar siempre con ese alcance
explícito y junto a las cifras oficiales de Mineduc. Nunca presentarlas como
estadística estatal.

## 7. Fuentes

**Chile — desinformación y acceso**
- Encuesta Fundación por una Carrera, 48% desconoce cómo postular.
  https://www.biobiochile.cl/noticias/servicios/beneficios/2026/10/07/perderse-la-gratuidad-por-no-saber-como-funciona-revisa-los-requisitos-y-postula-hoy-con-el-fuas.shtml
- Estimación de 120.000 no ingresantes y 80.000 que no postulan.
  https://tierramarillano.cl/2024/10/24/extienden-plazo-para-el-fuas-cinco-cosas-que-los-estudiantes-no-saben-al-postular-a-gratuidad-becas-y-creditos/
- Mineduc, Admisión 2026: 97.602 seleccionados.
  https://www.mineduc.cl/admision-2026-desde-el-retorno-a-la-presencialidad-se-multiplica-la-cantidad-de-jovenes-de-menores-ingresos-que-acceden-a-universidades/
- SIES, Informe de Matrícula en Educación Superior 2026.
  https://educacionsuperior.mineduc.cl/2026/07/30/matricula-en-educacion-superior-crece-por-quinto-ano-consecutivo/
- Mineduc, portal oficial FUAS. https://postulacion.beneficiosestudiantiles.cl/fuas/

**OCDE**
- Education at a Glance 2026, publicado el 29 de septiembre de 2026.
  https://www.oecd.org/en/publications/2026/09/education-at-a-glance-2026_3bce4131.html
- Capítulo de transición educación-trabajo (promedios OCDE 2025).
  https://www.oecd.org/en/publications/2026/09/education-at-a-glance-2026_3bce4131/full-report/transition-from-education-to-work-where-are-today-s-youth_57b67a9a.html
- Nota país de Chile, EAG 2023 (NEET 2020 y desglose por género).
  https://gpseducation.oecd.org/Content/EAGCountryNotes/EAG2023_CN_CHL_pdf.pdf

**Chile — exclusión y salud mental**
- Barómetro Laboral y Previsional, CIES-UDD y Asociación de AFP con datos INE.
  https://www.elmostrador.cl/agenda-pais/agenda-social/2026/09/16/ni-estudian-ni-trabajan-jovenes-de-25-a-34-anos-alcanzan-nivel-record-de-ninis-en-chile
- Termómetro Achs-UC, duodécima ronda: tramo joven y gradiente socioeconómico.
  https://www.theclinic.cl/2026/10/29/la-juventud-en-punto-de-quiebre-menores-de-30-anos-lideran-el-peor-registro-de-depresion-en-cuatro-anos/
- Termómetro Achs-UC, duodécima ronda: indicadores generales.
  https://www.cnnchile.com/pais/termometro-de-salud-mental-achs-uc-185-sospecha-o-tiene-problemas-de-salud-mental-la-cifra-mas-alta-en-los-ultimos-cuatro-anos/
- Salud mental en estudiantes de educación superior en Chile, revisión de alcance
  con metaanálisis. https://teps.cl/index.php/teps/article/view/394

**Costo económico**
- Costo de oportunidad de la deserción, FEN Universidad de Chile.
  http://www.economiaynegocios.cl/noticias/noticias.asp?id=460411
- Cátedra UNESCO sobre Inclusión en la Educación Universitaria, USACH.
  https://otrasvoceseneducacion.org/archivos/270082
- Deserción estudiantil y costo económico en universidades chilenas.
  https://ve.scielo.org/pdf/uct/v27n118/2542-3401-uct-27-118-17.pdf

**Evidencia causal sobre información y acceso**
- Hastings, Neilson y Zimmerman, experimento con el Mineduc, vía J-PAL.
  https://www.povertyactionlab.org/evaluation/informing-students-about-degree-costs-and-earnings-improve-educational-choices-chile
- Hoxby y Turner, NBER. https://www.nber.org/papers/w20861
- Dynarski y coautores, HAIL, NBER.
  https://www.nber.org/system/files/working_papers/w25349/revisions/w25349.rev0.pdf
- Experimento FAFSA de H&R Block, vía J-PAL.
  https://www.povertyactionlab.org/evaluation/role-application-assistance-and-information-college-decisions-results-hr-block-fafsa

**Evidencia sobre exclusión y salud mental**
- Paul y Moser, *Journal of Vocational Behavior*. https://eric.ed.gov/?id=EJ836788
- Revisión sistemática y metaanálisis (2025).
  https://pmc.ncbi.nlm.nih.gov/articles/PMC12505101/
- Benjet y coautores, *Salud Pública de México*.
  https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0036-36342012000400011

**Evidencia que delimita el eslabón D**
- Wang, variables instrumentales. https://pubmed.ncbi.nlm.nih.gov/40226726/
- Universidad de York, educación y salud mental.
  https://www.york.ac.uk/media/economics/documents/hedg/workingpapers/1710.pdf
- Campo de estudio y salud mental, IZA DP 16701. https://docs.iza.org/dp16701.pdf
