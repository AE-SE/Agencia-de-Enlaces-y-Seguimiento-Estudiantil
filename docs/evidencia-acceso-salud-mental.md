# Anexo de evidencia: desinformación, acceso y salud mental

Documento de respaldo para la cadena causal que sostiene la propuesta de valor de
la plataforma, en su uso comercial y académico. **Versión 5 — 5 de noviembre de
2026.** Correcciones de la revisión final aplicadas y cifras sin origen verificable
retiradas (ver [verificación de cifras](verificacion-de-cifras.md)).

> **Regla de esta versión.** La prensa solo sirve para llegar al origen del dato.
> Toda cifra de este anexo se cita desde el informe, la base o el documento del
> organismo que la mide. Lo que no tiene origen verificable no se publica
> ([AGENTS.md](../AGENTS.md), 2.1).
>
> **Cifras leídas por Codex que Claude aún no abrió en el original:** informe
> USACH, estudio IESALC-UNESCO, *Evidencias 55* del Mineduc, Barómetro Laboral y
> minuta de selección 2026. Estado y pendientes en
> [verificación de cifras](verificacion-de-cifras.md).
>
> **El pitch no usa prevalencias de salud mental** (ADR 0012): las cifras del paso 5
> del embudo son informativas, no material comercial.

> **Alcance actual (11-nov-2026).** El producto vigente es el sitio gratuito
> para estudiantes de 3.º y 4.º medio de liceos con financiamiento público y un
> panel de seguimiento para colegios; su cliente son colegios y sostenedores
> (ver `docs/entregable/Entregable_Parte_I.md`, puntos 2, 4.7 y 8). Los eslabones
> A y B de la cadena (desinformación y exclusión) sostienen ese producto. El
> módulo de permanencia, el pulso de check-in y las menciones al ADR 0010 de este
> anexo describen una **proyección o escalabilidad**, no una promesa vigente.
> Reemplazado en parte por el ADR 0031 (producto y organización).

Mismo criterio que `docs/evidencia-permanencia.md` (ADR 0010): se distingue
evidencia causal de correlacional, y se declara el alcance de cada afirmación.

> **Correcciones aplicadas en esta versión.**
> 1. ~~La cifra del tramo joven pasa de 28,9% a 23% en menores de 30 años (ronda
>    12).~~ **Retirada en la versión 5:** ni el 28,9% ni el 23% tienen un informe
>    público de la ronda detrás. La cifra juvenil que se usa ahora es la de la
>    Encuesta Nacional de Juventudes 2022 (sección 1, paso 5). Citar siempre el
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
| 1. No sabe | *Sin cifra publicable por ahora.* La encuesta de Fundación por una Carrera (2026, más de 2.500 estudiantes de cuarto medio vulnerables) mide cuántos se sienten «poco o nada informados», no cuántos «no saben postular», y no tiene informe público | Pendiente: informe de línea base de la fundación |
| 2. No postula | *Sin cifra publicable por ahora.* La estimación de unos 80.000 no se puede reconstruir con datos oficiales: no existe un denominador de «jóvenes con derecho que no postularon» | Pendiente: fuente de la fundación |
| 3. No entra | De **258.418** egresados de enseñanza media en 2020, **143.191 (55,4%)** no estaban matriculados en educación superior en 2021 (115.227 sí). Mide ingreso inmediato, no «nunca» | Centro de Estudios del Mineduc, [Evidencias 55 (2022)](https://centroestudios.mineduc.cl/wp-content/uploads/sites/100/2022/11/EVIDENCIAS-55_2022_fd01.pdf), Tabla 10, p. 80 |
| 3b. Contraste oficial | **97.602** seleccionados de la promoción del año (egreso 2025) por todas las vías centralizadas, Admisión 2026. El «≈27.000 más que en 2022» no está en el documento y se retiró | Subsecretaría de Educación Superior, [Minuta de resultados de selección, Admisión 2026](https://educacionsuperior.mineduc.cl/wp-content/uploads/sites/49/2026/01/Minuta-General-Resultados-Seleccion-Admision-2026.pdf), Tablas 2 y 3 |
| 4. Queda fuera | **19%** de los jóvenes de 18 a 24 años no estudia ni trabaja. Comparación con el promedio OCDE **en revisión**: los documentos decían 13% (datos 2025); una lectura de la tabla indica 14% (referencia 2024) | OCDE, *Education at a Glance 2026* |
| 5. Se deteriora | **26,9%** de las personas jóvenes presenta síntomas moderados o severos de ansiedad o depresión, contra 13,0% de la población adulta (2022). Mide ambos juntos (escala PHQ-4, el Cuestionario de Salud del Paciente de cuatro preguntas, últimas dos semanas), no solo depresión | Instituto Nacional de la Juventud (INJUV), [10.ª Encuesta Nacional de Juventudes 2022](https://www.injuv.gob.cl/sites/default/files/10ma_encuesta_nacional_de_juventudes_2022.pdf), p. 126 (n = 9.700 jóvenes y 1.000 adultos) |

Lectura del embudo: de los egresados de 2020, más de la mitad no estaba en
educación superior un año después (paso 3). El paso 1 es donde la plataforma
interviene. El paso 5 es el costo que justifica intervenir.

### Datos de refuerzo del paso 4

- Chile está **5 o 6 puntos porcentuales sobre el promedio OCDE** en el tramo
  18-24 (según se confirme 14% o 13%), y en **21% contra 16%** en el tramo 25-29.
- Tendencia nacional reciente: el Barómetro Laboral y Previsional (CIES-UDD y
  Asociación de AFP, con datos del INE) registró **21,6%** en el tramo 25-34 en el
  trimestre mayo-julio de 2026, alza de 1,7 puntos en doce meses. El empleo entre
  18 y 34 años cayó 4,7%, unos 135.000 ocupados menos.
- Matiz que conviene decir en el pitch antes de que lo digan por ti: estar en esa
  condición **no significa no querer trabajar**. El 41% de quienes están ahí entre
  25 y 34 años busca empleo sin conseguirlo.

### Dato de refuerzo del paso 5

**Retirado en la versión 5.** El gradiente socioeconómico de la duodécima ronda
(11% en el quintil de mayores ingresos contra 22% en el de menores) no figura en
ningún documento oficial publicado: la ronda 12 solo tiene una nota institucional
de la Universidad Católica con el total (depresión 16,2%, ansiedad generalizada
17,9%, n = 2.700). No se usa hasta tener el informe de la ronda.

---

## 2. La capa económica: lo que esto le cuesta al país

- **Pérdida anual por abandono: $546.000 millones (US$ 780 millones).** Cátedra
  UNESCO de Inclusión en la Educación Universitaria (USACH), *Gratuidad
  responsable y universal en Chile*, noviembre de 2016, Tabla 6, p. 44. Se estima
  con la matrícula nueva, las tasas de abandono y los aranceles.
- **26% del gasto público en educación universitaria** (US$ 96,2 millones).
  IESALC-UNESCO, *Estudio sobre la repitencia y deserción en la educación
  superior chilena* (2005). Mide solo universidades y es una estimación antigua.
- **Retención de primer año, cohorte 2023: 76,5%**; 16% de la cohorte no tuvo
  matrícula en educación superior al año siguiente. Servicio de Información de
  Educación Superior (SIES), informe de retención 2019-2023.
- **Retirados en la versión 5** por no tener origen verificable: los US$ 2.660
  millones del estudio de la Facultad de Economía y Negocios (solo existe una nota
  de 2018, sin el estudio), el 27,9% de deserción, el «más del 20%» del gasto
  público y la frase de la Comisión Nacional de Productividad sobre un costo
  «hundido». Ver [verificación de cifras](verificacion-de-cifras.md).

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
**Sostenido con evidencia causal experimental de Estados Unidos.** La evidencia chilena es experimental, pero sobre la elección de programa, no sobre el acceso.

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
favor** del módulo de permanencia del ADR 0010, hoy en proyección (no es parte del
alcance actual). Entrar no basta; por eso el proyecto contempla una segunda etapa
a futuro.

#### El ajuste importa más que el acceso en bruto

Un estudio con descontinuidad por puntaje de corte en admisión encuentra que el
**campo de estudio asignado** afecta prescripciones de antidepresivos y
hospitalizaciones por salud mental. Refuerza el módulo de orientación vocacional:
no da lo mismo en qué entra.

---

## 4. Material de pitch

### 4.1 Versión de 30 segundos

> De los 258.418 jóvenes que egresaron de enseñanza media en 2020, 143.191 (55,4%)
> no estaban matriculados en educación superior un año después.
>
> Los que quedan fuera engrosan el 19% de jóvenes de 18 a 24 años que no estudia
> ni trabaja, por sobre el promedio OCDE.
>
> Nosotros intervenimos en el primer eslabón, que es el único evitable con
> información.

### 4.2 Estructura de dos minutos

1. **El dato que abre** — 143.191 de 258.418 egresados de 2020 (55,4%) fuera de la
   educación superior un año después. Una sola cifra, sin adjetivos.
2. **El embudo** — de ahí, quienes no postulan o no entienden el trámite. Sin cifra
   hasta tener el informe de la fundación (ver [verificación de cifras](verificacion-de-cifras.md)).
3. **El destino** — 19% de jóvenes de 18 a 24 años que no estudia ni trabaja,
   por sobre el promedio OCDE (la diferencia exacta, en revisión).
4. **El costo económico** — pérdida anual por abandono de $546.000 millones (US$ 780
   millones, 2016) y el 26% del gasto público universitario (UNESCO, estimación
   antigua), siempre como techo del problema y no como lo que recuperamos
   (ADR 0013).
5. **La evidencia de que se puede** — experimento chileno con el Mineduc; HAIL, de
   cuyos 15 puntos de efecto 4 son jóvenes que no habrían entrado a ninguna parte.
6. **El cierre honesto** — "No prometemos bajar la depresión juvenil. Prometemos
   sacar del camino el obstáculo que sí podemos sacar."

El punto 7 no es una concesión: es lo que diferencia el pitch de la competencia
que promete impacto en bienestar sin poder medirlo.

### 4.3 Línea roja de comunicación

**Prohibido en todo material del producto**, comercial o académico:

- Afirmar o insinuar que la plataforma reduce la depresión, mejora la salud mental
  o previene trastornos.
- Usar la prevalencia de depresión juvenil (el 26,9%, o cualquier cifra del
  Termómetro o de la Encuesta Nacional de Juventudes) como si fuera el problema que el producto resuelve.
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
4. El pulso de check-in (ADR 0010, componente 4), fuera del alcance actual y en
   proyección, se mantiene como **sensor, nunca como predictor ni instrumento
   diagnóstico**.
5. La métrica de éxito del producto es **postulación completada, beneficio
   obtenido, matrícula efectiva**. Nunca un indicador de salud mental.

## 6. Pendientes

El estado de pendientes de este expediente se lleva en `cierre-de-pendientes.md`
y `revision-final.md`. No duplicar aquí.

**Advertencia de rigor permanente:** las cifras del 48%, 80.000 y 120.000 que
circulan atribuidas a Fundación por una Carrera no tienen informe público detrás
y quedan fuera de este anexo. Si la fundación entrega su informe, se citan con su
alcance (organización de la sociedad civil, muestra intencionada en
establecimientos vulnerables) y junto a las cifras oficiales del Mineduc. Nunca
presentarlas como estadística estatal.

## 7. Fuentes

**Chile — desinformación y acceso**
- Centro de Estudios del Mineduc, *Evidencias 55* (2022), Tabla 10, p. 80: egresados
  de media 2020 y matrícula en educación superior 2021.
  https://centroestudios.mineduc.cl/wp-content/uploads/sites/100/2022/11/EVIDENCIAS-55_2022_fd01.pdf
- Las cifras de Fundación por una Carrera (48%, 80.000, 120.000) se retiraron: no
  hay informe público detrás. Pendiente pedirlo a la fundación.
- Subsecretaría de Educación Superior, Minuta de resultados de selección, Admisión
  2026: 97.602 seleccionados de la promoción del año.
  https://educacionsuperior.mineduc.cl/wp-content/uploads/sites/49/2026/01/Minuta-General-Resultados-Seleccion-Admision-2026.pdf
- SIES, informes de matrícula (catálogo oficial). El informe de matrícula 2026
  figura en el catálogo; falta archivar su PDF antes de citar cifras.
  https://www.mifuturo.cl/informes-de-matricula/
- Mineduc, portal oficial FUAS. https://postulacion.beneficiosestudiantiles.cl/fuas/

**OCDE**
- Education at a Glance 2026, publicado el 29 de septiembre de 2026.
  https://www.oecd.org/en/publications/2026/09/education-at-a-glance-2026_3bce4131.html
- Capítulo de transición educación-trabajo (promedios OCDE 2025).
  https://www.oecd.org/en/publications/2026/09/education-at-a-glance-2026_3bce4131/full-report/transition-from-education-to-work-where-are-today-s-youth_57b67a9a.html
- Nota país de Chile, EAG 2023 (NEET 2020 y desglose por género).
  https://gpseducation.oecd.org/Content/EAGCountryNotes/EAG2023_CN_CHL_pdf.pdf

**Chile — exclusión y salud mental**
- Barómetro Laboral y Previsional, CIES-UDD y Asociación de AFP con datos del INE,
  agosto de 2026 (trimestre mayo-julio).
  https://negocios.udd.cl/cies/files/2026/09/v1_030926_barometro-previsional-agosto-2026.pdf
- INJUV, 10.ª Encuesta Nacional de Juventudes 2022 (sintomatología PHQ-4, pp. 126-127).
  https://www.injuv.gob.cl/sites/default/files/10ma_encuesta_nacional_de_juventudes_2022.pdf
- Termómetro Achs-UC, ronda 10 (presentación oficial, noviembre de 2024).
  https://encuestas.uc.cl/wp-content/uploads/2025/01/Presentacion-TSM-R10.pdf
- Termómetro Achs-UC, ronda 11 (abril de 2025). https://www.achs.cl/termometro-salud-mental
- Termómetro Achs-UC, ronda 12: solo existe la nota institucional de la Universidad
  Católica (6 de octubre de 2026), que da los totales; no hay informe público con
  desglose por edad o ingreso.
  https://visionuniversitaria.uc.cl/universidad-y-sociedad/salud-menta-chilenos-decae-peores-niveles-desde-pandemia/
- Salud mental en estudiantes de educación superior en Chile, revisión de alcance
  con metaanálisis. https://teps.cl/index.php/teps/article/view/394

**Costo económico**
- Cátedra UNESCO de Inclusión en la Educación Universitaria (USACH), *Gratuidad
  responsable y universal en Chile* (2016), Tabla 6, p. 44.
  https://www.paiep.usach.cl/sites/paiep/files/documentos/gratuidad_responsable_y_universal_camara_diputados_noviembre_2016.pdf
- IESALC-UNESCO, *Estudio sobre la repitencia y deserción en la educación superior
  chilena* (2005). https://unesdoc.unesco.org/ark:/48223/pf0000140087
- SIES, informe de retención 2019-2023.
  https://bibliotecadigital.mineduc.cl/bitstream/handle/20.500.12365/22088/SIES_Retencion_2019-2023.pdf
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
