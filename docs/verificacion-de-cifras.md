# Verificación de cifras contra su origen

Fecha de la verificación: 2026-11-05 · Responsable: Claude, con confirmación pendiente del líder.

Regla del proyecto: **la prensa solo sirve para llegar al origen del dato; nunca es la fuente citada.** Un dato sin origen verificable no se publica ([AGENTS.md](../AGENTS.md), 2.1; regla 8 del [ADR 0012](decisiones/0012-cadena-causal-y-promesa.md)).

## Cómo se verificó

- **Codex** (tres ejecuciones con búsqueda web, solo lectura) rastreó los orígenes.
- **Claude** abrió los PDF originales que pudo descargar y leyó el texto y las posiciones del gráfico.
- **Antigravity** no devolvió resultados: necesitaba un permiso de comandos que el modo sin interfaz no puede pedir, y no se saltó.
- Dos documentos no pudieron ser abiertos por Claude (servidor con certificado que solo cubre un nombre de dominio, y bloqueo de la biblioteca de la UNESCO). Se marcan como «leído por Codex».

## Estado de cada cifra

### Verificadas contra el original

| Cifra | Original | Valor textual | Observaciones |
|---|---|---|---|
| Sintomatología ansiosa o depresiva moderada o severa, O'Higgins | Instituto Nacional de la Juventud (INJUV), [10.ª Encuesta Nacional de Juventudes 2022](https://www.injuv.gob.cl/sites/default/files/10ma_encuesta_nacional_de_juventudes_2022.pdf), sección 4.2.1.5, p. 127 | O'Higgins 24,8%; total nacional 26,9% | Mide ansiedad y depresión juntas (escala PHQ-4, últimas dos semanas). Por valor O'Higgins queda séptima y no sexta, pero el informe aclara que las diferencias regionales no son significativas respecto del promedio nacional: no citar el lugar en el ranking. Reemplaza el dato en cuarentena. |
| Depresión moderada o severa, ronda 10 del Termómetro | Achs–UC, [presentación de la ronda 10](https://encuestas.uc.cl/wp-content/uploads/2025/01/Presentacion-TSM-R10.pdf) | 13,7% en noviembre de 2024; n = 2.373 | El 18,7% corresponde a otra ronda (agosto de 2021, según la serie de la misma presentación). |
| Depresión y ansiedad, ronda 11 | Achs, [página oficial del Termómetro](https://www.achs.cl/termometro-salud-mental) y documento de resultados de la ronda 11 | Depresión 13%; ansiedad 25,8% (abril de 2025, más de 2.300 personas) | La ansiedad de la ronda 11 es 25,8%. |
| Retención de primer año, cohorte 2023 | Servicio de Información de Educación Superior (SIES), [informe de retención 2019-2023](https://bibliotecadigital.mineduc.cl/bitstream/handle/20.500.12365/22088/SIES_Retencion_2019-2023.pdf) | Retención 76,5%; persistencia en educación superior 83,6%; «16 no tuvieron matrícula en educación terciaria en 2024» | Es la cifra vigente que reemplaza al 27,9%. |
| Egresados de enseñanza media que no entran a la educación superior | Centro de Estudios del Mineduc, [Evidencias 55 (2022)](https://centroestudios.mineduc.cl/wp-content/uploads/sites/100/2022/11/EVIDENCIAS-55_2022_fd01.pdf), Tabla 10, p. 80 | Egresados 2020: 258.418; no matriculados en 2021: 143.191 (55,4%); matriculados: 115.227 (44,6%) | Claude abrió el PDF el 2026-11-10 y leyó la tabla. La tabla solo desagrega por sexo, no por dependencia. Mide ingreso inmediato, no «nunca». |
| Acceso a la educación superior según dependencia del establecimiento de origen | SIES, [Acceso a la Educación Superior en Chile 2022](https://www.mifuturo.cl/wp-content/uploads/2023/01/Acceso_a_Educacion_Superior_2022_SIES.pdf) (enero de 2023), Tabla 3, p. 8, y Tabla 12, p. 16 | Acceso inmediato, egreso 2021: municipal 37,8%; SLEP 36,3%; particular subvencionado 41,9%; administración delegada 40,1%; particular pagado 68,7%; total 42,5%. Acumulado al 5.º año, egreso 2017: 68,3%, 79,2%, 73,9% y 94,0%; total 76,4% (Tabla 9, p. 14) | Claude abrió el PDF el 2026-11-10. En la Tabla 3 la fila de SLEP trae cuatro valores, porque su primera cohorte es de 2018; el 36,3% de 2021 se confirma en el texto de la p. 7 y en la Tabla 12. Justifica el segmento del Punto 1 (Tabla 1.0). Falta buscar ediciones posteriores del informe. |

### Leídas por Codex con cita textual (falta que Claude las abra)

| Cifra | Original | Valor textual | Observaciones |
|---|---|---|---|
| Pérdida anual por abandono | Cátedra UNESCO de Inclusión en la Educación Universitaria (USACH), *Gratuidad responsable y universal en Chile*, noviembre de 2016, [PDF](https://www.paiep.usach.cl/sites/paiep/files/documentos/gratuidad_responsable_y_universal_camara_diputados_noviembre_2016.pdf), Tabla 6, p. 44 | «la pérdida originada por el abandono en la educación superior chilena bordea los 546 mil millones de pesos, equivalente a 780 millones de dólares cada año» | **No es $565.000 millones**: esa cifra no aparece en el informe. Dos ejecuciones independientes de Codex coinciden. |
| Costo del abandono universitario | Instituto Internacional de la UNESCO para la Educación Superior en América Latina y el Caribe (IESALC-UNESCO), *Estudio sobre la repitencia y deserción en la educación superior chilena*, [UNESDOC](https://unesdoc.unesco.org/ark:/48223/pf0000140087), L. E. González con D. Uribe y S. González (2005; una ficha posterior indica 2006) | US$ 96,2 millones; equivale al 26% del gasto público en educación universitaria y al 10,2% del gasto total | Reemplaza el «más del 20%». Discrepancia abierta: una ejecución indica datos de 1998-2002 con costos de 2002; otra, año 2004. La página del original no fue legible. |

| Barómetro Laboral y Previsional | CIES-UDD y Asociación de AFP con datos del INE, [agosto de 2026](https://negocios.udd.cl/cies/files/2026/09/v1_030926_barometro-previsional-agosto-2026.pdf) | 25-34 años que no estudian ni trabajan: 21,6% (+1,7 puntos); 41% busca empleo; ocupados de 18 a 34 años: −4,7%, unos 135 mil menos | Trimestre mayo-julio 2026. Reemplaza la cita desde prensa. |
| Seleccionados Admisión 2026 | Subsecretaría de Educación Superior, [Minuta de resultados de selección](https://educacionsuperior.mineduc.cl/wp-content/uploads/sites/49/2026/01/Minuta-General-Resultados-Seleccion-Admision-2026.pdf), Tablas 2 y 3 | «Promoción del año… 97.602» | Es la promoción del año, no «quienes egresaron el año anterior» en general. El «≈27.000 más que en 2022» no está en el documento: retirado. |

### Discrepancia abierta: jóvenes que no estudian ni trabajan (OCDE)

El anexo cita 19% (Chile, 18-24 años) contra 13% del promedio OCDE. Codex leyó la tabla de la OCDE (*Education at a Glance 2026*, capítulo sobre la transición de la educación al trabajo) y reporta: Chile 19%, **promedio OCDE 14%** (18-24) y 16% (25-29), con referencia de datos **2024**, no 2025. Claude no pudo abrir la página (error 403). Hasta confirmarlo, el «seis puntos sobre el promedio» queda en duda: puede ser cinco.

### Sin origen verificable: no publicar

| Cifra | Por qué no se publica |
|---|---|
| 48% «no sabe cómo postular» (Fundación por una Carrera) | No hay informe, cuestionario ni ficha metodológica publicados. La publicación de la propia fundación dice «poco o nada informado», es decir, autopercepción, no desconocimiento. |
| ~80.000 jóvenes no postulan cada año | No se puede reconstruir con datos oficiales: no existe un denominador de «jóvenes elegibles que no postularon». |
| US$ 2.660 millones anuales de costo de oportunidad (2008-2016) | Solo existe la nota de 2018 de la revista Economía y Negocios de la Facultad de Economía y Negocios de la Universidad de Chile; no se encontró el estudio ni su metodología. |
| 27,9% de deserción del sistema (SIES) | No aparece en el informe SIES vigente. Ver la retención de arriba. |
| Más del 20% del gasto público | Proviene de una revisión que cita estudios de 2002 a 2011 sin nombrarlos. Usar el 26% del IESALC-UNESCO. |
| «Costo hundido» y prevenir con mejor orientación (Comisión Nacional de Productividad) | No se encontró ningún informe, estudio ni acta de la Comisión que contenga la frase; solo una atribución de prensa de 2018. |

Ronda 12 del Termómetro: retirada de los documentos por no tener informe público (solo una nota institucional); se incorporará si se publica el informe.

## Verificación del 13 de noviembre de 2026 (giro a público egresado)

Cifras que usa el Entregable Parte I desde el 13-nov. **Las leyó un subagente de Claude** en el documento original (PDF con pypdf, Excel o API oficial), no en un buscador. **Falta una segunda lectura** por el líder o por otra herramienta antes de la entrega: es el mismo criterio de la tabla «leídas por Codex».

| Cifra | Original | Valor | Observaciones |
|---|---|---|---|
| Acceso inmediato, egreso 2025 | SIES, [Acceso a la Educación Superior en Chile 2026](https://www.mifuturo.cl/wp-content/uploads/2026/10/Informe-de-Acceso-a-la-Educaci%C3%B3n-Superior.pdf) (octubre de 2026), Tabla 1, p. 8 | 276.509 egresados; 139.272 con acceso inmediato (50,4 %); 49,6 % sin acceso (gráfico 1, p. 9). En 2006: 62,7 % sin acceso (p. 5) | 137.237 = 276.509 − 139.272, cálculo propio. Las divisiones cuadran (139.272 ÷ 276.509 = 50,37 %). El informe atribuye la baja de 2025 a más egresados por certificación y regularización |
| Acceso acumulado, egreso 2021 | Mismo informe, Tabla 12, p. 23, y texto p. 22 | 42,8 % al 1.er año; 63,1 % al 2.º; 68,9 % al 3.º; 71,5 % al 4.º; 73,1 % al 5.º. Textual: «un 26,9 % de la cohorte que no ingresó a la educación terciaria en los cinco años posteriores a su egreso escolar» | Cohorte afectada por la pandemia según el informe (p. 4). **El SIES revisa cifras entre ediciones:** la cohorte 2021 figuraba con 42,5 % hasta la edición 2025. Citar siempre la edición |
| Acceso inmediato por dependencia, egreso 2025 | Mismo informe, p. 6 | Particular pagado 66,2 %; corporaciones 52,8 %; particular subvencionado 50,3 %; público 46,5 % | El entregable usa el rango de no ingreso: 33,8 % a 53,5 % (100 menos cada valor) |
| Acceso inmediato según modalidad | Mismo informe, p. 5 y 10 | Enseñanza para jóvenes 57 %; para adultos 21 % | |
| Razones de no asistencia a educación superior, 18 a 24 años | Ministerio de Desarrollo Social y Familia, [tablas Educación Casen 2024](https://observatorio.ministeriodesarrollosocial.gob.cl/storage/docs/casen/2024/Educacion_Casen_2024.xlsx), hoja «100» | Personales 60,65 %; económicas 34,13 %; rendimiento 0,87 %; acceso a un establecimiento 0,34 %; otra 3,58 %; no sabe 0,44 % | No hay categoría sobre información. La hoja no detalla qué incluye «personales». Abarca a todos los de 18 a 24 que no asisten, incluidos quienes ya terminaron. La fecha de publicación (2026) viene del buscador: confirmar en la portada |
| Jóvenes de 18 a 24 que no estudian ni están ocupados | OCDE, base *Education at a Glance* por la API oficial (`sdmx.oecd.org`, flujo `DF_LSO_TRANS`) | Chile 19,47 % (2024); promedio OCDE 14,13 % (referencia 2025 según la API) | Cierra la discrepancia abierta más abajo: coincide con la lectura de Codex (19 % y 14 %). No se leyó el capítulo impreso ni se confirmó la edición. El 26,1 % y 14,7 % (2020) de la nota de país 2023 deja de usarse |
| Jóvenes de 15 a 29 que no estudian ni trabajan | INJUV, [11.ª Encuesta Nacional de Juventudes 2025, informe ejecutivo](https://www.injuv.gob.cl/sites/default/files/informe_ejecutivo_enj_11_sintesis_dn.pdf), p. 16 | 10,0 % (2025); 10,7 % (2022); 17,3 % (2018) | Definición distinta de la OCDE: no cuenta a quienes buscan trabajo |
| Aislamiento en jóvenes | INJUV, 10.ª Encuesta Nacional de Juventudes 2022, pp. 124-127 del PDF | «Falto(a) de compañía, excluido(a), aislado(a)»: 36,9 % al menos una vez en dos semanas (adultos 20,8 %) | Toda la juventud; el informe no lo cruza con estudio o trabajo. Página del PDF, que es la impresa más 1 |
| No estudiar ni trabajar y salud mental | Gariépy, Danna, Hawke, Henderson e Iyer (2022), *Social Psychiatry and Psychiatric Epidemiology*, 57, 1107-1121, [DOI](https://doi.org/10.1007/s00127-021-02212-8) | Razón de probabilidades 1,28 para síntomas de salud mental; 2,84 para suicidalidad; 24 estudios | **Solo asociación.** Los datos longitudinales indican que los problemas de salud mental predicen quedar fuera; la relación inversa es «equívoca y escasa». No decir nunca que quedar fuera «causa» depresión |
| Información y elección de carrera en Chile | Hastings, Neilson y Zimmerman (2015), [NBER Working Paper 21300](https://www.nber.org/papers/w21300) | Encuesta a 49.166 postulantes a crédito; sobreestimación de ingresos «by over 100 %» en un subgrupo; el tratamiento reduce 4,6 % la demanda por carreras de bajo retorno | Documento de trabajo, sin revisión por pares. Mide a quienes ya postulan, no a quienes no ingresan |
| Qué mide la empleabilidad del SIES | SIES, [Metodología del Buscador de Empleabilidad e Ingresos 2025-2026](https://mifuturo.cl/wp-content/uploads/2025/12/Metodologia-Buscador-Empleabilidad-e-Ingresos_2025-2026.pdf) | Porcentaje de titulados de las cohortes 2021 a 2023 que, «teniendo información sobre ingresos, obtuvieron ingresos iguales o superiores al sueldo mínimo en el primer año después de su titulación»; «indicador proxy» | El SIES **no publica promedio por área** en el buscador: la unidad es carrera genérica por institución. Un promedio por área sería elaboración propia. La descarga masiva pide registro; condiciones de uso sin encontrar |

**No se encontró** (y el entregable lo dice): medición oficial del tiempo o la dificultad de informarse; conocimiento de beneficios entre egresados; cifra oficial del INE de jóvenes que no estudian ni trabajan; cruce entre no ingresar y salud mental o aislamiento en Chile.

**Dejan de usarse en el entregable:** Evidencias 55 (egreso 2020, cohorte de pandemia), la edición 2022 del informe de acceso, la nota de país OCDE 2023 y la encuesta de Formando Chile (solo se llegó a ella por una nota de prensa).

## Compras públicas usadas como antecedente (13 de noviembre de 2026)

Leídas por un subagente de Claude en el registro de datos abiertos de ChileCompra (formato OCDS). Las usa el punto 9.1 del entregable y [`difusion-e-informes.md`](difusion-e-informes.md).

| Licitación | Registro | Valor textual | Observaciones |
|---|---|---|---|
| 1028871-35-LE20 | [Adjudicación](https://apis.mercadopublico.cl/OCDS/data/award/1028871-35-LE20) | Comprador: Servicio Local de Educación Pública de Huasco. Título: «ESTUDIO PERTINENCIA DE LA OFERTA EDUCATIVA DE EMTP». Proveedor: Centro de Estudios Sociales CIDPA Limitada. Monto: en el registro (no transcrito). Fecha: 2021-08-03. Estado: «active» | Un solo adjudicado. Es el monto adjudicado, no el pagado |
| 868-31-LQ16 | [Adjudicación](https://apis.mercadopublico.cl/OCDS/data/award/868-31-LQ16) | Comprador: Gobierno Regional de Aysén. Título: «Estudio Fortalecimiento de Educación Técnica». Proveedor: Asesorías para el Desarrollo S.A. Monto: en el registro (no transcrito). Fecha: 2016-12-13. Estado: «active» | **Corrección:** un documento de trabajo lo describía como un estudio de preferencias de egresados y de la información que usan para decidir. El registro dice otra cosa: un diagnóstico de la formación técnica de nivel medio y superior de la región. Se cita como dice el registro |

No se usan como precio de referencia. Otras dos adjudicaciones del mismo documento de trabajo (preuniversitarios municipales) se descartaron por no ser comparables y no se verificaron.

## Pendientes

- [ ] Segunda lectura de las cifras del 13 de noviembre (tabla de arriba), en especial las del informe de acceso 2026 del SIES.
- [ ] Abrir con herramienta propia el informe USACH (p. 44) y el estudio IESALC-UNESCO.
- [ ] Pedir a la Fundación por una Carrera su informe de línea base y la fuente de las cifras de 80.000 y 120.000.
- [ ] Pedir a la Facultad de Economía y Negocios el estudio detrás de los US$ 2.660 millones.
- [ ] Encontrar la repartición oficial de causas de deserción (SIES o Mineduc).
- [ ] Confirmar la cifra de la OCDE (14% contra 13%, referencia 2024 contra 2025).
- [ ] Archivar el PDF del informe SIES de matrícula 2026 antes de citar cifras de él.

### Cifras de esos documentos que esta verificación no auditó

Siguen en los documentos sin haberse rastreado hasta su origen; no deben circular como verificadas hasta hacerlo:

- Series del Termómetro de las rondas 8 a 11 de `series-y-proyeccion.md` (no se cotejaron una por una con las presentaciones).
- Cifras regionales de O'Higgins (matrícula de primer año: −2,62%, de 9.853 a 9.595; programa PACE; habilitados PAES): provienen de una columna de opinión y notas locales. Los enlaces a prensa se retiraron de las listas de fuentes y las cifras quedan marcadas «origen pendiente»; falta el informe SIES, CNED, DEMRE o de la Subsecretaría.
- `cierre-de-pendientes.md` (líneas 167 y 169) sigue enlazando dos notas de prensa sobre la matrícula de O'Higgins; no se tocó porque es el registro histórico de ese pendiente.
- Otras citas desde prensa y blogs en las listas de fuentes (por ejemplo, las de `series-y-proyeccion.md` sobre oferta regional y PACE).
