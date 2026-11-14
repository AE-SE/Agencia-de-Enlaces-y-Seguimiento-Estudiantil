# Propuesta a colegios y sostenedores (vigente) y propuesta a educación superior (proyección)

> **Archivado el 2026-11-13.** Describe una idea anterior del proyecto (la propuesta de venta a colegios y sostenedores y a instituciones de educación superior). No es el alcance vigente: ver [ADR 0032](../../decisiones/0032-agencia-independiente-y-publico-egresado.md). Se conserva como historia.

Fecha: 2026-11-07 · Actualizado: 2026-11-11 · Estado: **borrador**. Requiere la decisión del líder (@rafajaque) y revisión de asesoría legal antes de cualquier uso con un colegio, un sostenedor o una institución. · Relacionado: [ADR 0018](../../decisiones/archivo/0018-producto-de-planificacion-de-oferta.md) (parte B)

> **Cambio de enfoque (11-nov-2026).** El cliente es el colegio o sostenedor. La propuesta a instituciones de educación superior (planificación de oferta) pasa a la parte B, como proyección y escalabilidad. Texto de referencia: `docs/entregable/Entregable_Parte_I.md`, puntos 8 y 9. Reemplazado en parte por el ADR 0031 (producto y organización). No se nombra a ningún colegio ni sostenedor: no hay convenio firmado.

## Parte A. Propuesta a colegios y sostenedores

### A.1 Qué recibe el colegio

- **Panel de seguimiento** de meta vocacional y avance de los estudiantes de 3.º y 4.º medio **que autorizan** compartir su información (consentimiento granular y revocable; autorización del tutor para menores de 18).
- **Resumen para el docente** o el orientador, con la meta del estudiante y su avance.
- **Ensayo con prueba oficial publicada** y estimación de puntaje comparada con la meta de la carrera. La estimación es referencial, no una predicción de resultado.
- **Aislamiento de datos por colegio** a nivel de base de datos (RLS).
- Para el estudiante, sin costo: ficha de carrera con fuente, comparación, simulación de puntaje, hoja de decisión y guía de trámites y plazos del Formulario Único de Acreditación Socioeconómica (FUAS).

### A.2 Qué no hace el producto

- No muestra datos de un estudiante que no lo autorizó.
- No ordena, destaca ni recomienda instituciones por ser clientes (neutralidad, AGENTS.md 1).
- No promete aumentar el ingreso a la educación superior ni predecir deserción o resultados de un estudiante.
- No etiqueta al estudiante («en riesgo» no es visible para él; internamente se habla de señales de alerta).
- No vende ni cede datos a terceros.

### A.3 Cómo se financia (orden)

1. **Colegios y sostenedores**, por suscripción. Argumento: el estándar 7.3 y el gasto en actividades de información y orientación del Plan de Mejoramiento Educativo 2026 (para la comunidad educativa; no define orientación vocacional) (Entregable Parte I, 8.1).
2. **Fondos públicos** (por ejemplo, Semilla Inicia de CORFO, sujeta a convocatoria y a que una fundación pueda postular; Entregable Parte I, 8.4).
3. **Filantropía**, como último recurso.

### A.4 Precio y vía de compra

- **Precio de partida (supuesto, no decidido):** $232.000 mensuales por colegio, más IVA si corresponde, con punto de equilibrio de 3 colegios (Entregable Parte I, 9.1). El precio final lo decide el líder después de las entrevistas. No hay precio público de referencia ni cobro ligado a resultados.
- **Quién firma:** hasta el 19-dic-2026 no existe entidad, y el piloto 2027 se haría por **convenio de colaboración** con uno o dos liceos de Colchagua. La **fundación sin fines de lucro** se constituye en 2027 y desde entonces firma contratos de suscripción.
- **Vía de compra de un sostenedor público:** Mercado Público (Ley 19.886); la Compra Ágil sube a 100 UTM desde el 12-dic-2024 y el proveedor debe estar inscrito y activo en el Registro de Proveedores (Entregable Parte I, 8.2.3). Los sostenedores privados contratan directamente. Confirmar con asesoría legal.

### A.5 Piloto 2027: criterios de éxito

Se acuerdan con el colegio antes de empezar. Propuesta, por validar:

- Porcentaje de estudiantes de 3.º y 4.º medio que activan su meta y la mantienen actualizada. TODO(fuente): meta numérica por definir con el colegio; no se inventa.
- Estudiantes que completan el FUAS a tiempo, medido por el propio colegio y solo entre quienes autorizan.
- Uso del resumen por el docente u orientador y su utilidad percibida (encuesta breve).
- Medidas de accesibilidad y rendimiento en pantalla de 360 px y conexión lenta.

### A.6 Salida y datos (cláusula propuesta)

- Al término del contrato, exportación de los datos del colegio en CSV dentro de 30 días y borrado con constancia escrita.
- Roles frente a la Ley 21.719 (responsable o encargado) y tratamiento de datos de menores: a definir con asesoría legal.
- Estatutos de la fundación con tres cláusulas: uso gratuito para el estudiante, prohibición de ordenar o destacar instituciones por ser clientes y reinversión de excedentes.

### A.7 Pendientes

| Pendiente | Responsable |
|---|---|
| Carta de interés de un colegio o sostenedor de Colchagua y convenio de colaboración del piloto | Líder |
| Decisión de precio y de vía de compra | Líder y asesoría legal |
| Revisión legal de estatutos, titularidad del código, cláusula de salida y datos de menores | Asesoría legal |
| Verificar con CORFO si una fundación puede postular a Semilla Inicia antes de constituirse | Líder |
| Metas numéricas del piloto | Líder, con el colegio |

## Parte B. Propuesta a instituciones de educación superior (proyección)

Lo que sigue responde a lo que una institución de educación superior necesitaría saber antes de contratar un producto de planificación de oferta. **Está fuera del alcance actual** y se conserva como escalabilidad futura. En la versión actual, instituciones como estas no son el cliente principal. No nombra a ninguna institución.

## 1. Qué recibe la institución

- **Primer año estimado** para el siguiente proceso, por carrera, sede, jornada y región, con su intervalo y su error histórico.
- **Permanencia de primer año** de esa cohorte, por tipo de institución.
- **Tendencia de retención** por carrera y jornada, descrita como tendencia de la cohorte. No se etiqueta a ningún estudiante.
- **Informe anual de comparación**: lo estimado frente a lo observado, con el error publicado.

Formato: planilla (CSV y XLSX) y un informe de 4 a 6 páginas. Cada cifra lleva fuente, URL y fecha de consulta (AGENTS.md 2.1).

## 2. Qué no hace el producto

- No entrega datos personales de estudiantes, ni de la institución ni de otras.
- No cruza variables protegidas para decidir (sexo, edad, situación socioeconómica, origen escolar, discapacidad). La proporción por sexo aparece solo como dato de planificación, nunca para seleccionar (Ley 20.609, art. 2°).
- No sirve para admitir, seleccionar ni priorizar personas (ADR 0018, límite 3).
- No ordena ni compara instituciones clientes.
- No predice el riesgo de un estudiante (eso es el ADR 0016, que no está habilitado).

## 3. Respuestas a las cuatro preguntas de la institución

**¿Ahorra tiempo o plata?**
- *Hoy:* no está demostrado. Hay que comparar con el método que la institución usa.
- *Cómo se demuestra:* tomar la última planificación de la institución (su previsión frente a la matrícula real) y comparar su error con el del producto. Si el producto no es mejor, no hay argumento económico, y eso debe decirse.
- *Falta:* la serie histórica de la institución.

**¿Sirve para lo que nos exigen?**
- *Hoy:* no hay un mapeo verificado.
- *Cómo se hace:* listar los reportes que la institución entrega al Mineduc, a la CNA y a sus programas de permanencia que dependan de matrícula de primer año o de retención. Verificar cada exigencia en la fuente oficial. Luego indicar cuáles alimenta el producto y cuáles no.
- *Estado:* trabajo de investigación pendiente. No se afirma ningún cumplimiento.

**¿Puedo auditar el método sin depender de quien lo vende?**
- *Sí, en parte, y ya existe:*
  - El registro de pronósticos es append-only, con cadena de hash SHA-256. `verificar_cadena()` comprueba que nada se alteró.
  - Los scripts están en el repositorio y las fuentes son públicas (SIES, Mineduc, DEMRE, INE). Cualquiera puede rehacer el cálculo.
- *Falta:* un instructivo para que la institución corra el método con sus propios datos sin nuestra ayuda.

**¿Qué pasa con mis datos si me voy?**
- *Por diseño:* el producto trabaja con datos públicos y solo agregados. Lo que la institución sube, si sube algo, es lo único que hay que devolver o borrar.
- *Falta:* la cláusula de salida (sección 10) y su revisión legal.

## 4. Historial verificable: calendario

La credibilidad se gana comparando con resultados reales. Las fechas de publicación son estimadas y deben verificarse en cada fuente.

| Cuándo | Qué se compara | Registro previo | Estado de la fecha |
|---|---|---|---|
| 30-nov a 2-dic-2026 | Rendición PAES regular 2027 | Línea base registrada (PAES-REGULAR-2027-DEF2) | Confirmada en la página oficial de DEMRE (calendario de 2027, revisado el 2026-11-08) |
| 4-ene-2027, 08:00 (hora de Chile continental) | Publicación de puntajes PAES regular 2027, por región | Pronóstico regional registrado | Confirmada en la página oficial de DEMRE (2026-11-08) y en la captura del líder (el inicio de postulaciones es el mismo día, 09:00); la URL de origen no está registrada. Una segunda búsqueda encontró la misma fecha en extractos de demre.cl y del afiche; las páginas no se pudieron abrir desde aquí |
| abr–may-2027 (patrón por confirmar) | Cuarto medio 2027 por residencia (matrícula Mineduc) | PRIMER-ANIO… y 4TO-MEDIO-2027-RESIDENCIA registrados | **No verificada**: no se encontró la fecha de publicación de la matrícula de educación superior |
| mediados de 2027 (inferencia) | Primer año de pregrado 2027 (SIES) | 382.725 (357.992 a 387.869), registrado | **No verificada**: el informe de matrícula de 2026 no apareció |
| ago-2028 (sin respaldo) | Retención de primer año de la cohorte 2027 | 296.601 (277.434 a 300.588), registrado | **No verificada**: no se pudo confirmar el patrón de años anteriores |

Verificación pendiente: abrir a mano el afiche DEMRE antes de citar la fecha del 4-ene-2027. Ninguna de las otras fechas se publica como confirmada.

Regla: cada comparación se publica tenga o no buen resultado, con el error y la cobertura del intervalo. Si el resultado es malo, se dice.

## 5. Competencia y neutralidad

Compromisos (algunos aún no implementados; se indica cuáles):

1. Solo agregados. Ninguna celda con menos de 10 estudiantes se entrega. *Implementado en el cálculo.*
2. Cada institución cliente ve solo sus cifras y las públicas.
   - *En la entrega por archivo:* el aislamiento es por entrega. Cada institución recibe su informe y nada más; no hay una base compartida donde se mezclen las salidas.
   - *En la base de datos:* el esquema ya tiene `organizacion` (con tipo institución) y `miembro`, con políticas RLS (`ver_mi_organizacion`, `consentimiento_ver_dirigido_a_mi_organizacion`). **Pendiente:** no existe todavía una tabla de salidas o de datos subidos por institución, así que no hay nada que aislar en la base. Antes de guardar salidas por institución en la base, hay que agregar sus políticas RLS y una prueba en `supabase/tests/`. Esa prueba no se ha ejecutado aquí.
3. No hay ranking de clientes ni de instituciones. La condición de cliente no ordena ni destaca nada en el portal (AGENTS.md, sección 1). *Compromiso de diseño.*
4. No se venden datos ni se comparte la información de una institución con otra. *Compromiso contractual.*

## 6. Límites obligatorios (del ADR 0018)

- Intervalo visible en cada cifra, junto con el error histórico.
- Auditoría anual del uso que la institución le da al informe.
- Sin lenguaje de etiqueta sobre grupos de estudiantes ("dispuestos", "en riesgo").
- Cuando el uso contradiga la finalidad, el contrato termina.

## 7. Integración

- **Entrega inicial:** por archivo. No requiere integrar sistemas de la institución.
- **U+:** las bases de la licitación desierta de referencia pedían integración con U+ como requisito habilitante. Esa integración **no se asume**. Hay que preguntar si la institución la exige, porque cambiaría el costo y el plazo.

## 8. Precio y vía de compra

- **Rango propuesto, no decidido:** entre $11,9 y $13,7 millones de pesos anuales por institución (ADR 0018, sección de precio). El precio final lo decide el líder después de la validación.
- **Estimación de costo, de abajo hacia arriba** (aproximada; los supuestos no son cifras de mercado verificadas):

  | Componente | Supuesto | Costo anual aprox. (CLP) |
  |---|---|---|
  | Actualizar el pronóstico y el registro cada año | 160 h de análisis a $30.000/h | 4,8 M |
  | Auditoría y informe de comparación con lo observado | 40 h a $30.000/h | 1,2 M |
  | Soporte y reuniones con la institución | 60 h a $30.000/h | 1,8 M |
  | Revisión legal anual del contrato y de la finalidad | Honorarios externos, supuesto | 1,0 M |
  | Infraestructura y servicios | Plan de datos y alojamiento, supuesto | 0,5 M |
  | **Subtotal** | | **9,3 M** |
  | Margen sobre costo (30 %) | Supuesto | 2,8 M |
  | **Total aproximado** | | **≈ 12,1 M (rango razonable de 10 a 14 M)** |

  El total cae dentro del rango de compras públicas (11,9 a 13,7 M). Eso es coherencia, no prueba de precio: el costo depende de las horas reales, que hoy no se han medido.
- **Vías de contratación posibles** (a verificar con asesoría legal):
  - **a)** Licitación pública nueva. Es la vía formal para una institución estatal.
  - **b)** Trato directo, solo si existe una causal verificada en la Ley 19.886 y su reglamento.
  - **c)** Convenio de colaboración o piloto sin pago. Debe ser un convenio real y no una compra disfrazada.
- **Bases técnicas mínimas** que el producto debe poder cumplir: objeto; entregables (sección 1); método documentado y reproducible; criterios de éxito del piloto; plazo; precio unitario; soporte; auditoría anual; cláusula de salida; garantía.

## 9. Piloto: criterios de éxito

Propuesta para acordar con la institución **antes** de empezar:

- Error mediano de primer año menor o igual a 5 % a nivel de carrera y sede, con al menos 30 casos por celda. La validación 2022-2026 da 11,9 %, así que este criterio es exigente y puede no cumplirse. Si no se cumple, el piloto dice que no se cumplió.
- Cobertura del intervalo de al menos 90 % en las celdas evaluadas. **Medido** (`datos/pronosticos/cobertura_entrada_sede.py`, validación hacia atrás 2022-2026, 18.178 casos con ≥30 entrantes): cobertura 94,8 % con el total conocido. Ese resultado es optimista, porque el total real del año también tiene incertidumbre.
- Precisión: el intervalo mediano por celda es de **×3,2** (es decir, el límite superior es casi cuatro veces el inferior). Con esa amplitud, la cifra por celda sirve como orden de magnitud y no para decidir una sección. El criterio de piloto debe exigir un ancho mediano menor, por ejemplo ×1,5, y eso todavía no se alcanza. Agregar no lo arregla: por sede el ancho es ×4,9 y por institución ×5,5 (el error viene del cambio de participación entre años, no del tamaño de la muestra). Por eso no conviene publicar cifras por carrera; lo honesto hoy son tendencias y totales nacionales o regionales con su intervalo.
- Error mediano por celda: 11,9 % (12,4 % en celdas de 30 a 99 alumnos; 9,3 % en las de 100 o más).
- Al menos una decisión de capacidad documentada con la cifra del producto.
- Tiempo de planificación ahorrado, medido por la propia institución.

## 10. Salida y datos (cláusula propuesta)

- La institución sube solo datos agregados propios, si decide subir alguno.
- **Al término del contrato:**
  - exportación de las salidas en CSV dentro de 30 días;
  - borrado de los datos subidos por la institución dentro de 30 días, con constancia escrita;
  - el registro de pronósticos se conserva porque solo contiene datos públicos y agregados, sin datos personales.
- Roles frente a la Ley 21.719 (encargado o tercero): a definir con asesoría legal.

## 10 bis. Exigencias verificadas (mapeo, 2026-11-07)

Mapeo hecho leyendo textos en BCN (LeyChile). Los criterios de la CNA se leyeron después, en los PDF publicados (ver la sección de verificación posterior).

| Exigencia | Quién | Fuente leída | Relación con el producto |
|---|---|---|---|
| Informar al SIES matrícula, estudiantes que abandonan o suspenden y duración nominal (Decreto 352/2013, art. 2; Ley 21.091, art. 105) | Universidades, IP y CFT | BCN, Decreto 352 (idNorma 1047890) y Ley 21.091 (idNorma 1118991) | Alta: el producto reutiliza esas mismas bases públicas. Plazo anual no verificado |
| Plan de cierre de sede o programa debe incluir matrícula, titulación y retención (Ley 21.091, art. 25 ter b) | Universidades, IP y CFT | BCN, Ley 21.091 | Media: la retención histórica por carrera sirve para ese plan |
| Gratuidad: programas de apoyo que promuevan la retención de estudiantes vulnerables, con al menos 20 % de la matrícula en los cuatro primeros deciles (Ley 21.091, art. 83 d; Decreto 333/2019, art. 2 d) | Instituciones adscritas a gratuidad | BCN, Ley 21.091 y Decreto 333 (leído hasta el art. 6) | Alta: la tutoría focalizada por carrera o jornada responde a esta exigencia. No hay meta numérica de retención |
| Gratuidad: obligación del Estado mientras el estudiante no exceda la duración nominal (Ley 21.091, art. 105 y 108) | Instituciones adscritas a gratuidad | BCN, Ley 21.091 | Baja para el producto; relevante para el cálculo de duración |

**Lo que no se encontró en texto legal:**
- Una meta de retención o de avance curricular como requisito de la institución. No hay convenio de desempeño con metas de retención en la ley leída.
- Criterios de acreditación de la CNA que exijan retención. Las pistas que existen son de carreras y postgrados, y no están verificadas en texto.
- Plazo anual de entrega al SIES. Depende de cada oficio, no del decreto.

**Verificación posterior (2026-11-07):**
- **Ley 21.850: verificada en el texto de BCN (idNorma 1229250).** Se llama "para la reconstrucción nacional y el desarrollo económico y social", del Ministerio de Hacienda. Promulgada el 9-oct-2026 y publicada el 17-oct-2026 (BCN indica D.O. 17.10.2026; no abrí el Diario Oficial directamente). Su **artículo 20** dice: "Suspéndese, para los años 2028 y 2029, el ingreso de nuevas instituciones de educación superior al sistema de financiamiento institucional para la gratuidad regulado en el Título V de la ley N° 21.091". Leí el texto completo (copia de BCN del 2026-11-07). El resto trata de impuestos, medio ambiente, tribunales, capacitación y otras materias. Su artículo 19 modifica el artículo trigésimo cuarto transitorio de la Ley 21.091 (PIB tendencial no minero y varios porcentajes de financiamiento de la gratuidad). La Contraloría tomó razón del decreto promulgatorio el 16-oct-2026. Las normas que el Tribunal Constitucional declaró inconstitucionales no son de educación superior. Una nota de BCN en la Ley 21.091 mencionaba la eliminación de los artículos 52 a 54 de esa ley, pero ese cambio **no está** en el texto de la Ley 21.850; no lo atribuyo a ella.
- **Efecto para la oferta:** la suspensión afecta a instituciones *nuevas* en gratuidad, no a las ya adscritas. Nuestras instituciones clientes serían existentes, pero el mercado de nuevas instituciones queda cerrado en 2028 y 2029.
- **Criterios de acreditación CNA: leídos en el PDF de la CNA, con dos matices.**
  - *Subsistema técnico-profesional* (PDF publicado; vigencia no confirmada): el criterio 3, "Acceso y progresión de los estudiantes", pide "indicadores de seguimiento de la progresión (retención, aprobación, titulación, tiempos de titulación, entre otros)". No fija umbrales numéricos.
  - *Universidades*: el borrador de criterios (marcado "BORRADOR") fija umbrales de retención de primer año de 65 %, de retención de cohorte al tercer año de 60 % y de titulación oportuna de 50 %. El PDF publicado de criterios para universidades (CyE Institucional del Subsistema Universitario, revisado el 2026-11-08) no fija cifras: pide definir y monitorear indicadores de progresión. Los umbrales solo aparecen en el borrador.
  - Pendiente: confirmar la versión vigente para universidades y la guía procedimental de junio de 2025.
- **Convenios de desempeño con metas de retención (CFT e IP): no existe meta de retención en los indicadores 2026.** Revisé el documento de indicadores de desempeño 2026 de la Subsecretaría (DIPRES, Partida 09, Capítulo 90; cinco indicadores, ninguno de retención ni permanencia). El PMG 2026 de la misma partida no se pudo leer. No encontré convenios vigentes con esa meta. El único caso hallado es antiguo (un CFT con meta de 72 % en un plan de mejoramiento, cerrado en 2019; visto solo en un resumen).
- **Plazo anual de entrega al SIES:** no encontrado. Lo único verificable es la regla del Decreto 352 (art. 6 c): entre la fecha de entrega y el envío del oficio debe haber al menos 20 días hábiles. La fecha de este año depende del oficio que la Superintendencia emita. Una segunda búsqueda tampoco la encontró; superdesuc.cl no respondió desde aquí. Hay que revisar a mano esa página y mifuturo.cl.
- Retención de las cohortes 2023 y 2024 (77,3 % y 76,5 %): viene de resúmenes secundarios.

**Conclusión:** la exigencia más fuerte que hoy se puede citar es la de apoyo a la retención para gratuidad, no una meta numérica. Ese es el argumento que la propuesta puede usar, sin decir que la institución está obligada a cumplir una meta de retención.

## 11. Pendientes

| Pendiente | Responsable |
|---|---|
| Decisión de precio y de vía de compra | Líder y asesoría legal |
| Revisión legal de la cláusula de salida, roles de datos y artículo 8° bis | Asesoría legal |
| Políticas RLS y prueba antes de guardar salidas o datos por institución en la base | Equipo técnico |
| Leer los PDF de la CNA; abrir la Ley 21.850 en el Diario Oficial; buscar convenios de desempeño | Investigación |
| Instructivo para correr el método con datos propios de la institución | Equipo de datos |
| Abrir a mano el afiche DEMRE y confirmar la fecha del 4-ene-2027; verificar el resto de la sección 4 | Investigación |
| Reducir el ancho del intervalo por celda (hoy ×3,2) antes de publicar cifras por carrera | Equipo de datos |
| Institución piloto y su autorización por escrito | Líder |
