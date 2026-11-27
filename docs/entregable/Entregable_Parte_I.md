# ENTREGABLE: PARTE I

| ESCUELA: | Escuela de Ingeniería |
|---|---|
| CARRERA: | Ingeniería de Ejecución en Informática, mención Desarrollo de Sistemas |
| SECCIÓN: | [1] |
| NOMBRES INTEGRANTES DEL EQUIPO: | 1. Rafael Jaque · 2. Alejandro Tapia · 3. Cristóbal Rojas |
| PROYECTO: | Agencia de Enlace & Seguimiento Estudiantil (AE-SE) |

# AVANCE 1

## 1. Bases del proyecto

Una de cada dos personas que terminan la enseñanza media en Chile no entra a la educación superior al año siguiente. De las 276.509 personas que egresaron en 2025, 137.237 (49,6 %) no ingresaron en 2026 (Servicio de Información de Educación Superior [SIES], 2026a). Y no es solo una postergación: 26,9 % de quienes egresaron en 2021 no había ingresado cinco años después (SIES, 2026a). Para decidir si estudia, qué y dónde, esa persona debe reunir por su cuenta datos que el Estado publica en sitios distintos, y lo hace cuando ya no tiene a nadie a cargo de orientarla. Este punto define para quién se trabaja, qué se innova y bajo qué condiciones. El problema se demuestra con datos en el Punto 2 y los objetivos medibles se formulan en el Punto 3.

### 1.1 Grupos de interés, segmento y necesidades

**Segmento objetivo.** Personas que egresaron de 4.º medio y no han ingresado a la educación superior, y quienes cursan 4.º medio y están por egresar. El alcance es nacional. Para medir, el segmento se acota a quienes egresaron en los últimos cinco años, que es la ventana que sigue el SIES.

**Tabla 1.0.** Ingreso a la educación superior según el tiempo transcurrido desde el egreso de enseñanza media (total nacional).

| Momento | Ingresó | No ha ingresado | Cohorte |
|---|---|---|---|
| Al año siguiente del egreso (acceso inmediato) | 50,4 % (139.272 personas) | 49,6 % (137.237 personas) | Egreso 2025, matrícula 2026 |
| Hasta el segundo año | 63,1 % | 36,9 % | Egreso 2021 |
| Hasta el tercer año | 68,9 % | 31,1 % | Egreso 2021 |
| Hasta el quinto año (acceso acumulado) | 73,1 % | 26,9 % | Egreso 2021 |

*Nota.* Fuente: SIES (2026a), Tabla 1, p. 8, y Tabla 12, pp. 22-23. «No ha ingresado» = 100 − «Ingresó». Es la edición más reciente del informe (octubre de 2026). El informe advierte que la cohorte 2021 fue afectada por la pandemia y que sus cifras se revisan entre ediciones.

**Por qué el alcance es nacional y sin distinción de establecimiento.** El no ingreso inmediato existe en todos los tipos de establecimiento: va de 33,8 % a 53,5 % según la dependencia (100 menos el acceso inmediato de cada dependencia, egreso 2025; SIES, 2026a, p. 6). Los datos de carreras, requisitos y beneficios son nacionales, de modo que el problema de reunirlos y compararlos es el mismo en cualquier región.

**El segmento no limita el acceso.** Lo que el proyecto ofrezca a las personas será gratuito y abierto a cualquiera. El segmento define para quién se diseña, a quién se consulta y sobre quién se miden las metas del Punto 3.

**Necesidades por actor.** Los grupos de interés son quienes afectan o son afectados por el logro del proyecto (Freeman, 1984). Las necesidades se formulan como verbo más objeto, sin nombrar una solución, y se tipifican como funcionales, emocionales o sociales (Osterwalder et al., 2014). Las que no tienen respaldo en datos secundarios se declaran **hipótesis a confirmar** con el levantamiento primario del Punto 2. Los puntajes de poder e interés (1 a 5) son una estimación del equipo; se considera «alto» un valor igual o superior a 4.

**Tabla 1.1.** Actores, necesidades y puntajes.

| N.º | Actor (quién) | Clasificación | Necesidad (verbo + objeto) | Tipo | Evidencia inicial | Poder | Interés |
|---|---|---|---|---|---|---|---|
| 1 | Personas que egresaron de 4.º medio y no han ingresado a la educación superior | Grupo objetivo | Reunir y comparar la empleabilidad, la duración, el arancel y los requisitos de las carreras que les interesan | Funcional | 49,6 % no ingresa al año siguiente del egreso (SIES, 2026a); los datos se publican en sitios distintos (Punto 2) | 2 | 5 |
| 2 | Las mismas personas, al decidir | Grupo objetivo | Sentir seguridad de que la decisión se apoya en datos confiables | Emocional | Hipótesis a confirmar con la encuesta y las entrevistas | 2 | 5 |
| 3 | Las mismas personas, mientras están fuera del estudio | Grupo objetivo | Mantener un proyecto y un vínculo que eviten quedar al margen | Social | 19,5 % de los jóvenes de 18 a 24 años no estudia ni está ocupado, frente a 14,1 % en el promedio de la Organización para la Cooperación y el Desarrollo Económicos (OCDE) (OCDE, s. f.); el vínculo con el aislamiento es hipótesis a confirmar con entrevistas | 2 | 5 |
| 4 | Personas que cursan 4.º medio y están por egresar | Grupo objetivo | Conocer a tiempo los pasos y plazos de la admisión y de los beneficios | Funcional | Hipótesis a confirmar con entrevistas a personas de 18 años o más que egresaron hace poco | 2 | 4 |
| 5 | Familias de quienes egresan | Grupo de interés directo | Decidir con información clara sobre los estudios y su financiamiento | Funcional | Hipótesis a confirmar con entrevistas | 3 | 4 |
| 6 | Organizaciones que necesitan análisis de datos de educación superior | Cliente potencial | Contar con análisis verificable e independiente para sus propias decisiones | Funcional | Hipótesis comercial sin validar: ninguna organización ha encargado un informe | 4 | 3 |
| 7 | Ministerio de Educación (Mineduc), SIES y el Departamento de Evaluación, Medición y Registro Educacional (DEMRE) | Regulador y proveedor de datos | Ver sus datos abiertos reutilizados con fuente, sin sobrecargar sus servicios ni contradecir sus condiciones de uso | Funcional | Condiciones de uso de cada portal de datos | 5 | 2 |
| 8 | Portales públicos y organizaciones que ya informan u orientan | Referente | Complementar su trabajo sin duplicarlo | Funcional | Descripción de sus servicios en sus sitios institucionales (Punto 4) | 3 | 3 |
| 9 | Instituto Profesional AIEP (AIEP), sede San Fernando: carrera de Ingeniería de Ejecución en Informática y docente tutor | Interno | Verificar que el proyecto demuestre las competencias del perfil de egreso | Social | Perfil de egreso de la carrera (AIEP, s. f.) | 4 | 5 |
| 10 | Preuniversitarios y otros servicios educativos que no son instituciones de educación superior | Cliente potencial (avisos) | Llegar a las personas que preparan su ingreso a la educación superior | Funcional | 138 empresas en el rubro «Enseñanza preuniversitaria» en 2025 (Servicio de Impuestos Internos [SII], 2026b); hipótesis comercial sin validar | 2 | 3 |

**Roles del cliente en este proyecto.** Quien usa el servicio no es quien paga.

**Tabla 1.2.** Roles del cliente en este proyecto.

| Rol | Quién es | Observación |
|---|---|---|
| Usuario | Personas que egresan (actores 1 a 4) y sus familias (5) | Nunca pagan: lo que usan es gratuito. Los avisos van rotulados, no usan sus datos y nunca aparecen donde se compara o se decide (4.2) |
| Beneficiario | Las mismas personas | El beneficio es decidir con información completa y en menos tiempo |
| Cliente o pagador | Organizaciones que encarguen informes de datos o asesorías (6), y servicios educativos que no son instituciones de educación superior que compren un espacio publicitario (10) | Hipótesis comerciales aún no validadas: nadie es cliente hoy. El equipo no sale a buscarlos |
| Decisor | Cada persona, sobre su propia decisión de estudio; cada organización, sobre encargar un análisis | Ningún cliente decide qué ve la persona ni en qué orden |

**Mapa de actores (matriz de Mendelow, 1991).** Los números remiten a la Tabla 1.1.

| | Interés bajo (1 a 3) | Interés alto (4 a 5) |
|---|---|---|
| **Poder alto (4 a 5)** | **Mantener satisfechos:** 6 Organizaciones que necesitan análisis; 7 Mineduc, SIES y DEMRE | **Gestionar de cerca:** 9 AIEP y docente tutor |
| **Poder bajo (1 a 3)** | **Monitorear:** 8 Portales y organizaciones que ya informan | **Mantener informados:** 1, 2, 3 y 4 Personas que egresan; 5 Familias |

La estrategia de relación y el responsable de cada actor están en la Tabla 1.5 (Anexo 1.A).

### 1.2 Bases de la innovación

**Tabla 1.3.** Clasificación de la innovación (OECD/Eurostat, 2018).

| Criterio | Respuesta |
|---|---|
| Objeto | De proceso: cambia la forma en que una persona obtiene y compara la información que necesita para decidir sus estudios, hoy repartida en sitios y archivos distintos |
| Grado | Incremental: reúne y ordena información oficial que ya existe; no cambia las reglas del sistema de acceso |
| Alcance de la novedad | Nueva para las personas que la usen; no se afirma novedad para el mercado |
| Qué cambia respecto de hoy | La persona consulta en un solo recorrido los datos oficiales de una carrera, con su fuente y fecha, y los compara con otra |
| Competencias de la carrera que la sustentan | Ciclo completo del desarrollo de software, con pruebas, calidad y seguridad de la información; análisis y diseño de sistemas, bases de datos y plataformas digitales con visión de usuario; formulación y gestión de proyectos informáticos (AIEP, s. f.) |

El proyecto propone una innovación de proceso, de carácter incremental, nueva para quienes la usen, que consiste en acortar el camino entre una persona que egresa y la información oficial verificable que necesita para decidir. Se sustenta en las competencias de desarrollo de software con seguridad de la información, análisis y diseño de sistemas con bases de datos, y gestión de proyectos informáticos de la carrera.

**Tabla 1.3b.** Competencias del perfil de egreso (AIEP, s. f.) y su aporte al proyecto.

| Área | Lo que dice el perfil | Aporte al proyecto |
|---|---|---|
| Ciclo del software | Programación, metodologías, pruebas, aseguramiento de la calidad y criterios de seguridad de la información | Construir y mantener el servicio con datos verificables y seguros |
| Análisis y diseño | Integrar componentes tecnológicos, bases de datos y plataformas con visión orientada al usuario y a estándares técnicos | Modelar los datos oficiales y diseñar el recorrido de quien busca información |
| Gestión de proyectos | Formular, evaluar y gestionar proyectos informáticos | Planificar las mediciones, los indicadores y el presupuesto |
| Trabajo con el cliente | Colaborar en equipos multidisciplinarios y apoyar decisiones tecnológicas según los requerimientos del cliente | Atender a las organizaciones que encarguen un análisis |
| Transformación digital | Mejora de procesos y eficiencia operativa | Acortar una búsqueda que hoy exige recorrer varios sitios |
| Ética y actualización | Principios éticos, calidad técnica y actualización permanente | Pedir los datos personales mínimos y trabajar con evidencia verificable |

### 1.3 Los siete ejes del proyecto

**Calidad.** Para este proyecto, calidad es que cada dato mostrado tenga fuente, enlace y fecha de consulta, que los cálculos se contrasten con la fuente oficial y que la interfaz cumpla las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 nivel AA (World Wide Web Consortium [W3C], 2023). Decisión: un dato que no se pueda verificar en una fuente oficial no se publica. La accesibilidad con lector de pantalla y el rendimiento en conexión lenta aún no se miden.

**Tiempo.** El prototipo se presenta el 19 de diciembre de 2026 (Entregable II) y la ejecución cubre siete semanas, del 3 de noviembre al 19 de diciembre. Decisión: el alcance se limita a lo que permite medir el problema y su reducción (Punto 3); lo demás queda diseñado y se declara como proyección.

**Factibilidad.** La viabilidad técnica tiene respaldo parcial: el equipo cuenta con un prototipo funcional y con programas que procesaron 11.364 variantes de carrera de pregrado (oferta por sede, jornada y versión del plan) con datos oficiales (elaboración propia con archivos del Mineduc, el SIES y el DEMRE, 2026). La dimensión legal condiciona el diseño: la Ley 21.719 (2024) exige tratar solo los datos personales necesarios. Decisión: lo público se usa sin cuenta; la cuenta, cuando exista, guarda solo el correo, si la persona estudia o ya estudió, la institución elegida de la lista oficial, su meta y preferencias, y el registro de su consentimiento, sin edad ni datos sensibles. El análisis completo queda para el Punto 9.

**Cadena de valor.** Las actividades que crean valor son: obtener datos oficiales, cargarlos con su fuente, dejarlos comparables, mostrar el camino hacia la meta de cada persona y publicar análisis con el método a la vista (Porter, 1985). Participan Cristóbal (datos y contenido), Alejandro (interfaz) y Rafael (arquitectura y privacidad). Decisión: los datos públicos y los datos de personas se mantienen separados.

**Incertidumbre de mercado.** Hay tres supuestos sin validar: que las personas que egresan usen el servicio, que con él reúnan la información en menos tiempo, y que alguna organización encargue informes o asesorías. Decisión: medir los dos primeros con personas reales antes de afirmar utilidad, y no publicar cifras de ventas ni de impacto que el proyecto no pueda medir.

**Marco estratégico.** La oportunidad es que el Estado publica datos abiertos de carreras, admisión y beneficios, pero en sitios y formatos distintos, y que hay evidencia experimental de que la información personalizada cambia decisiones de estudio (Hastings et al., 2015). Decisión: independencia: nunca ordenar ni destacar instituciones por ser clientes, y no prometer resultados que dependen de terceros. La misión, la visión y los valores se formulan en el Punto 7.

**Presupuesto y recursos.** Se comparan dos alternativas. La alternativa A, elegida, es una aplicación web con servicios de infraestructura de plan gratuito, sin desembolso directo durante el prototipo. La alternativa B son aplicaciones nativas para dos sistemas operativos, con más costo y plazo. Los recursos humanos son los tres integrantes del equipo. Los montos, con su fuente, se presentan en el Punto 10. Decisión: alternativa A, con la infraestructura aislada para poder cambiar de proveedor.

### 1.4 Bases de desarrollo

Cada decisión nace de una necesidad de la Tabla 1.1 y de un eje.

**Tabla 1.4.** Bases de desarrollo.

| Necesidad (actor) | Eje | Base de desarrollo (decisión) |
|---|---|---|
| Reunir y comparar los datos de las carreras (1) | Calidad | Todo dato mostrado lleva fuente, enlace y fecha; se indica qué mide cada cifra y de qué año es |
| Sentir seguridad de que los datos son confiables (2) | Marco estratégico | Ningún resultado se ordena por conveniencia comercial; los criterios de orden son explícitos |
| Mantener un proyecto mientras se está fuera del estudio (3) | Cadena de valor | La persona puede fijar una meta y ver las alternativas cercanas; el servicio orienta y deriva, no diagnostica |
| Conocer a tiempo pasos y plazos (4) | Tiempo | Los plazos se guardan como datos con fecha de vigencia, no dentro del programa |
| Decidir con información clara (5) | Calidad | Textos en lenguaje claro, con las siglas explicadas la primera vez |
| Contar con análisis verificable e independiente (6) | Incertidumbre de mercado | Se publica el método antes de ofrecer cualquier análisis; no se afirma demanda |
| Proteger los datos de quien usa el servicio (1 a 5) | Factibilidad | Uso sin cuenta; cuenta solo con la lista cerrada de datos (correo, situación de estudio, institución, meta y preferencias, consentimiento); sin edad, RUT ni datos sensibles |

### Anexo 1.A Estrategia y responsable por actor

**Tabla 1.5.** Estrategia y responsable por actor. Reparto según los roles del equipo.

| Actor | Estrategia | Responsable |
|---|---|---|
| 1 a 4 Personas que egresan | Mediciones y pruebas de uso con personas de 18 años o más; recogida de su opinión durante el desarrollo | Alejandro |
| 5 Familias | Explicar en lenguaje claro qué muestra cada dato; una entrevista | Alejandro |
| 6 Organizaciones que necesitan análisis | No se las busca: se publica el método y los datos, y se responde a quien consulte | Rafael |
| 7 Mineduc, SIES y DEMRE | Cumplir los términos de uso de cada portal y citar fuente y fecha | Cristóbal |
| 8 Portales y organizaciones que ya informan | Revisar su oferta y complementarla | Rafael |
| 9 AIEP y docente tutor | Reportes de avance en las fechas del módulo | Rafael |

## 2. Diagnóstico

Este punto describe y mide el problema antes de proponer cómo se aborda. Contrasta tres fuentes (Hernández-Sampieri y Mendoza, 2018): datos secundarios oficiales, una encuesta estandarizada y una medición directa del tiempo de búsqueda, complementadas con entrevistas. Los apartados 2.1 a 2.4 describen el problema sin la solución; el 2.5 evalúa al equipo y al entorno con un FODA, y la respuesta desde la especialidad se explica en 2.6 y 2.7.

**Estado de la investigación primaria.** La encuesta, la medición de tiempo y las entrevistas se aplican solo a personas de 18 años o más (la encuesta y las entrevistas entre el 23 de noviembre y el 4 de diciembre de 2026, y la medición de tiempo entre el 30 de noviembre y el 4 de diciembre), y sus resultados se informan en el Entregable II. Este documento no informa resultados de ninguna: las conclusiones se apoyan en datos secundarios oficiales y en estudios publicados, y lo que solo se podrá saber con trabajo de campo se declara como hipótesis.

### 2.1 Contexto y descripción del desafío

**Grupo afectado y territorio.** Personas que egresan de 4.º medio y no ingresan a la educación superior, en todo Chile (segmento de la Tabla 1.0). Los actores se numeran como en la Tabla 1.1.

**Problema central.** Las personas que egresan de 4.º medio deciden si estudian, qué y dónde con información insuficiente, dispersa y difícil de comparar. Una de cada dos no ingresa a la educación superior al año siguiente, y quedar fuera del estudio y del trabajo se asocia con inactividad, aislamiento y peor salud mental.

**Qué muestran los datos.**

- De 276.509 personas que egresaron de enseñanza media en 2025, 139.272 (50,4 %) ingresaron a la educación superior en 2026 y 137.237 (49,6 %) no. En 2006 no ingresaba de inmediato el 62,7 %: la proporción ha bajado, pero sigue cerca de la mitad (SIES, 2026a, Tabla 1, p. 8, y p. 5).
- No es solo una postergación: de quienes egresaron en 2021, 63,1 % había ingresado al segundo año, 68,9 % al tercero y 73,1 % al quinto. El 26,9 % no ingresó en los cinco años posteriores a su egreso (SIES, 2026a, Tabla 12, pp. 22-23). El informe advierte que esa cohorte fue afectada por la pandemia.
- Ocurre en todos los tipos de establecimiento: el no ingreso inmediato va de 33,8 % a 53,5 % según la dependencia (SIES, 2026a, p. 6). Entre quienes egresan de la enseñanza para personas adultas, solo 21 % ingresa de inmediato, frente a 57 % de quienes egresan de la enseñanza para jóvenes (SIES, 2026a, p. 10).
- Cuando la encuesta oficial de hogares pregunta a las personas de 18 a 24 años por qué no asisten a la educación superior, 60,7 % responde razones personales, 34,1 % económicas, 0,9 % de rendimiento y 0,3 % de acceso a un establecimiento (Ministerio de Desarrollo Social y Familia, 2026). La encuesta no tiene una categoría sobre información, y no detalla qué incluyen las razones personales.
- En Chile, 19,5 % de los jóvenes de 18 a 24 años no estudiaba ni estaba ocupado en 2024, frente a 14,1 % en el promedio de la OCDE (OCDE, s. f.). Con otra definición, que no cuenta a quienes buscan trabajo, la encuesta nacional de juventudes registra 10,0 % entre los 15 y los 29 años en 2025 (Instituto Nacional de la Juventud [INJUV], 2025).
- 26,9 % de las personas jóvenes presentó síntomas moderados o severos de ansiedad o depresión en 2022, frente a 13,0 % de la población adulta; y 36,9 % declaró haberse sentido falta de compañía, excluida o aislada al menos una vez en las últimas dos semanas, frente a 20,8 % de la población adulta (INJUV, 2022, pp. 124-127). Las cifras describen a toda la juventud: la encuesta no las cruza con la situación de estudio o trabajo.

**Qué dice la evidencia sobre las causas y las consecuencias.**

1. *La información cambia decisiones de estudio.* En un experimento con postulantes a crédito estudiantil en Chile, con una encuesta a 49.166 personas, una parte de quienes postulaban a carreras con bajos ingresos esperados sobreestimaba esos ingresos en más de 100 %, e informarles los ingresos y costos de cada carrera redujo en 4,6 % su demanda por esas carreras (Hastings et al., 2015). En Estados Unidos, ayudar a completar el formulario de beneficios aumentó en 8 puntos porcentuales la probabilidad de haber completado dos años de universidad, de 28 % a 36 %, mientras que entregar solo información general no tuvo efecto (Bettinger et al., 2012). **Límite:** el estudio chileno midió a quienes ya postulaban; no hay un experimento chileno que mida el efecto de la información sobre el ingreso mismo. Es un supuesto crítico.
2. *Quedar fuera del estudio y del trabajo se asocia con peor salud mental.* Una revisión sistemática con metaanálisis de 24 estudios encontró que no estudiar ni trabajar se asocia con más síntomas de salud mental (razón de probabilidades de 1,28), en especial con ideación y conducta suicida (2,84) (Gariépy et al., 2022). En un metaanálisis de 237 estudios transversales y 87 longitudinales, 34 % de las personas desempleadas presentaba problemas psicológicos, frente a 16 % de las empleadas, y el malestar disminuía al reinsertarse (Paul y Moser, 2009). En una muestra probabilística de adolescentes de Ciudad de México, quienes no estudiaban ni trabajaban tenían más probabilidades de presentar un trastorno psiquiátrico, consumo de sustancias y conducta suicida que quienes solo estudiaban (Benjet et al., 2012). **Límite:** es una asociación, no una causa demostrada. Según la misma revisión, lo más documentado es que los problemas de salud mental anteceden a quedar fuera, y la evidencia de la relación inversa es escasa. Ninguno de estos estudios es chileno, y no ingresar a la educación superior no es lo mismo que estar desempleado.
3. *Estudiar no trata un problema de salud mental.* La evidencia no permite afirmar que ingresar a la educación superior mejore la salud mental. Por eso el proyecto no promete efectos sobre ella: la trata como parte de lo que está en juego al quedar fuera y como motivo para derivar a servicios públicos cuando aparece una señal de riesgo.

**Por qué la persona no resuelve esto sola hoy.**

1. *La información oficial existe, pero está repartida.* La empleabilidad, los ingresos y la duración real de cada carrera están en el portal Mi Futuro del SIES; las ponderaciones, las vacantes y los puntajes, en el DEMRE; la postulación, en el portal Acceso; los beneficios y sus plazos, en el portal de Beneficios Estudiantiles (Ministerio de Educación, s. f.-a, s. f.-b; Subsecretaría de Educación Superior, s. f.). Cada sitio usa su propio formato, sus propios nombres de carrera y sus propios períodos.
2. *Comparar exige saber qué mide cada cifra.* La empleabilidad al primer año que publica el SIES es el porcentaje de personas tituladas que, teniendo información de ingresos, ganaron el sueldo mínimo o más en el primer año después de titularse; el propio SIES la describe como un indicador aproximado (SIES, 2025). No dice si la persona trabaja en lo que estudió ni cuenta a quienes no tienen información de ingresos. Cuánto se entiende esto al leer la cifra es hipótesis a confirmar.
3. *No hay medición oficial de cuánto cuesta informarse.* No se encontró ninguna cifra oficial del tiempo que toma reunir estos datos, de cuántas personas lo logran ni de cuánto conocen los beneficios quienes egresan. Por eso se mide directamente (2.3).
4. *Después de egresar, nadie está a cargo.* Mientras cursa la enseñanza media, la persona tiene a su establecimiento; una vez que egresa, la búsqueda depende solo de ella. Cuánto pesa esto es hipótesis a confirmar con entrevistas.

**Lo que no se sabe.** No hay cifra pública de cuántas personas no ingresan por falta de información: la encuesta oficial no lo pregunta. Tampoco hay medición del tiempo que toma informarse, ni una medición chilena de la salud mental o del aislamiento de quienes no ingresan en particular. Esos vacíos se reconocen y orientan el levantamiento primario (2.3).

### 2.2 Magnitud del problema

Fórmulas: Porcentaje = (parte ÷ total) × 100; Brecha = valor de referencia − valor observado.

**Tabla 2.1.** Matriz de datos secundarios.

| Indicador | Valor (Chile) | Referencia | Período | Fuente |
|---|---|---|---|---|
| Personas que egresan de enseñanza media y no ingresan a la educación superior al año siguiente | 137.237 de 276.509 = 49,6 % | Ingresan: 139.272 = 50,4 %. En 2006 no ingresaba el 62,7 % | Egreso 2025, matrícula 2026 | SIES (2026a), Tabla 1, p. 8, y p. 5 |
| Personas que no han ingresado cinco años después del egreso | 26,9 % | Han ingresado: 73,1 % | Egreso 2021 | SIES (2026a), Tabla 12, pp. 22-23 |
| No ingreso inmediato según dependencia del establecimiento | De 33,8 % a 53,5 % | Total: 49,6 % | Egreso 2025 | SIES (2026a), p. 6 |
| Acceso inmediato desde la enseñanza para personas adultas | 21 % | Enseñanza para jóvenes: 57 %, brecha de 36 pp | Egreso 2025 | SIES (2026a), p. 10 |
| Razón declarada para no asistir a la educación superior, 18 a 24 años | Personales 60,7 %; económicas 34,1 % | Rendimiento 0,9 %; acceso a un establecimiento 0,3 %; otra 3,6 % | 2024 | Ministerio de Desarrollo Social y Familia (2026) |
| Jóvenes de 18 a 24 años que no estudian ni están ocupados | 19,5 % | Promedio OCDE 14,1 %: +5,4 pp | 2024 (Chile); el promedio figura con referencia 2025 | OCDE (s. f.) |
| Jóvenes de 15 a 29 años que no estudian ni trabajan (sin contar a quienes buscan trabajo) | 10,0 % | 10,7 % en 2022; 17,3 % en 2018 | 2025 | INJUV (2025), p. 16 |
| Jóvenes con síntomas moderados o severos de ansiedad o depresión | 26,9 % | Población adulta 13,0 %: +13,9 pp | 2022 | INJUV (2022), pp. 124-127 |
| Jóvenes que se sintieron faltos de compañía, excluidos o aislados al menos una vez en dos semanas | 36,9 % | Población adulta 20,8 %: +16,1 pp | 2022 | INJUV (2022), pp. 124-127 |
| Asociación entre no estudiar ni trabajar y síntomas de salud mental | Razón de probabilidades de 1,28 (suicidalidad: 2,84) | 1,00 = sin asociación | Metaanálisis de 24 estudios | Gariépy et al. (2022) |
| Problemas psicológicos en personas desempleadas | 34 % | Personas empleadas 16 %: +18 pp | Metaanálisis internacional | Paul y Moser (2009) |

**Lectura.** (a) Una de cada dos personas no ingresa al año siguiente de egresar; la proporción ha bajado en veinte años, pero son 137.237 personas en un solo año. (b) El no ingreso no es solo una postergación: más de una de cada cuatro (26,9 %) sigue sin haber ingresado cinco años después. (c) Cuando se pregunta por qué, la mayoría declara razones personales que la encuesta no detalla: no hay dato oficial que atribuya el no ingreso a la falta de información, y por eso el proyecto la trata como una causa posible que debe medirse, no como un hecho. (d) La proporción de jóvenes fuera del estudio y del trabajo en Chile supera en 5,4 puntos al promedio de la OCDE. (e) Las cifras de salud mental y de aislamiento describen a poblaciones más amplias que el segmento, y la relación con quedar fuera es una asociación: muestran lo que está en juego, no un efecto medido del no ingreso.

**Localización.** Los datos son nacionales. No hay dato comunal publicado sobre ingreso a la educación superior. Las limitaciones de los datos están en el Anexo 2.D.

### 2.3 Levantamiento primario: método

El levantamiento primario cubre lo que los datos oficiales no muestran: cuánto tiempo toma hoy reunir la información, cuánta confianza tiene una persona egresada para elegir carrera y cómo se vive quedar fuera. Participan solo personas de 18 años o más.

#### 2.3.1 Plan

**Tabla 2.2.** Plan de levantamiento primario.

| Instrumento | Actor (Tabla 1.1) | Objetivo | Cuántos (meta) | Condición para aplicarlo |
|---|---|---|---|---|
| Medición de tiempo de búsqueda (tarea estandarizada con cronómetro) | 1: personas de 18 años o más que egresaron en los últimos cinco años | Medir cuánto demora una persona en reunir, en los sitios oficiales, cuatro datos de una carrera en dos instituciones y compararlos | 10 | Consentimiento informado |
| Encuesta estandarizada en línea: Escala de Autoeficacia para la Elección de Carrera (EAEC) | 1, 2 y 3: personas de 18 años o más que egresaron en los últimos cinco años | Medir la confianza para elegir carrera, con énfasis en la confianza para obtener información | Al menos 96 | Consentimiento informado en la primera pantalla; permiso de los autores del instrumento |
| Entrevista semiestructurada | 1 a 3: una persona que no ingresó y otra que ingresó después de uno o más años | Entender cómo se vivió la decisión, la búsqueda de información y el tiempo fuera del estudio | 2 | Consentimiento informado |
| Entrevista semiestructurada | 5: familiar de una persona que egresó | Entender qué información usó la familia y dónde la buscó | 1 | Consentimiento informado |
| Entrevista semiestructurada | 6: profesional de una organización que usa datos de educación superior | Conocer qué análisis necesita y de dónde lo obtiene hoy | 1 | Consentimiento informado |
| Entrevista semiestructurada | 8: profesional de una organización que ya informa u orienta | Conocer qué ofrece hoy y qué no cubre | 1 | Consentimiento informado |

En total son 5 entrevistas. Se eligen entrevistas y no *focus group* porque el tema toca decisiones familiares y salud mental, que son sensibles (Krueger y Casey, 2015).

#### 2.3.2 Medición de tiempo de búsqueda

Mide directamente la causa 2 del árbol de problemas, para la que no existe cifra oficial.

- **Tarea.** Con un computador o teléfono y acceso libre a los sitios oficiales, la persona debe encontrar, para una misma carrera en dos instituciones: (1) la empleabilidad al primer año, (2) la duración formal y la duración real, (3) el arancel anual y (4) el puntaje del último seleccionado o el requisito de ingreso; y decir cuál de las dos instituciones tiene mayor empleabilidad. La carrera y las instituciones se asignan al azar de una lista fija, igual para todos.
- **Qué se registra.** Tiempo total hasta completar la tarea, con un máximo de 20 minutos; cuántos de los cuatro datos se encontraron y si son correctos según la fuente; cuántos sitios se visitaron. No se registra nada personal de quien participa.
- **Indicadores.** Mediana del tiempo, proporción de personas que completa la tarea dentro del máximo y proporción de datos correctos.
- **Tamaño de muestra.** 10 personas, por conveniencia. Con ese tamaño la medición describe el orden de magnitud del problema, y en un diseño pareado solo permite detectar diferencias grandes (tamaño del efecto cercano a 1,0, con α = 0,05 y potencia de 0,80; Cohen, 1988). No estima el tiempo de la población.
- **Limitaciones.** Quien participa sabe que lo están midiendo; la tarea es de laboratorio y no reproduce la búsqueda real, que se hace en varios días.

#### 2.3.3 Encuesta

Se usa **un instrumento estandarizado, completo y en español**: la Escala de Autoeficacia para la Elección de Carrera (EAEC) (Ramírez Dorantes y Canto, 2007). Tiene 55 ítems con respuesta de 0 (ninguna confianza) a 9 (confianza absoluta) en cinco subescalas: Autoconocimiento, Información ocupacional, Establecimiento de metas, Solución de problemas y Planeación. Se desarrolló a partir de la versión en español del *Career Decision-Making Self-Efficacy Scale* (Taylor y Betz, 1983), con 343 estudiantes de México con una edad promedio de 18,5 años, y su confiabilidad es α = 0,95 en la escala total y de 0,79 a 0,88 en las subescalas. Se agregan cuatro preguntas de clasificación. Los ítems están en el Anexo 2.A.

- **Por qué este instrumento.** Mide la confianza para realizar las tareas que exige elegir una carrera, y su subescala de Información ocupacional (ítems 12 a 21) corresponde a la causa 1 del árbol de problemas. Está en español, con ítems publicados textualmente y evidencia de confiabilidad y estructura factorial.
- **Adaptación.** Se aplica completo y en su orden original. Solo se adapta el vocabulario de México a Chile («licenciatura» por «carrera», «maestro» por «profesor») y cada cambio queda documentado.
- **Aplicación.** En línea, por invitación abierta. La primera pregunta confirma que la persona tiene 18 años o más; si no, el cuestionario termina ahí. De esa persona solo queda registrada esa respuesta, que no contiene ningún dato personal y se elimina antes del análisis.
- **Tamaño de muestra.** Con Z = 1,96, p = q = 0,5 y error de 10 %: n₀ = (1,96² × 0,25) ÷ 0,10² = 96,04, es decir 96 personas. Si se reúnen 128 respuestas, con 64 personas que no han ingresado y 64 que sí, se podrán comparar ambos grupos con un tamaño del efecto medio (d = 0,5), α = 0,05 y potencia de 0,80 (Cohen, 1988).
- **Limitaciones.** El muestreo es por conveniencia y no es representativo del país. La escala no tiene validación ni normas en Chile y mide confianza por autoinforme, no conducta. Es una medición única: muestra asociaciones, no causas.
- **Ética.** Consentimiento informado en la primera pantalla. La encuesta es anónima (sin nombre, RUT, correo, edad exacta ni dirección IP), no pregunta por salud ni por situación económica, y solo se publican resultados agregados, sin grupos de menos de cinco respuestas (Ley 19.628, 1999; Ley 21.719, 2024). Si el permiso de los autores no llega, la encuesta no se aplica y se declara.

#### 2.3.4 Entrevistas

Se prevén 5 entrevistas semiestructuradas de 30 a 40 minutos, con consentimiento y, si la persona lo autoriza, grabación de audio. Todas son con personas de 18 años o más. El guion está en el Anexo 2.B y los actores a entrevistar, en la Tabla 2.D.2.

#### 2.3.5 Análisis y triangulación

Los tiempos se describen con mediana, mínimo y máximo. Las respuestas de la encuesta se describen con promedios por subescala e intervalo de confianza de 95 %, y se comparan entre quienes han ingresado y quienes no, con tamaño del efecto. Las entrevistas se codifican por temas (Hernández-Sampieri y Mendoza, 2018). Cada hipótesis del árbol de problemas se confronta con un instrumento y un criterio (Anexo 2.C). Si una fuente primaria contradice a la oficial, se explica como hallazgo.

### 2.4 Causas y efectos: árbol de problemas

Sigue la Metodología de Marco Lógico (Ortegón et al., 2005). Las causas salen de preguntar «¿por qué?» dos o tres veces; cada una se marca **verificada** (tiene fuente) o **hipótesis** (se confirma con el levantamiento primario), y las hipótesis no se afirman como hechos.

**Tabla 2.3.** Árbol de problemas.

| Nivel | Contenido | Estado de la evidencia |
|---|---|---|
| **Efectos (copa)** | E1. Una de cada dos personas no ingresa al año siguiente (49,6 %) y 26,9 % no ha ingresado cinco años después | Verificado (SIES, 2026a). Qué parte se debe a la falta de información es hipótesis: la encuesta oficial no lo pregunta |
| | E2. Jóvenes fuera del estudio y del trabajo: 19,5 % frente a 14,1 % en la OCDE | Verificado (OCDE, s. f.) |
| | E3. Peor salud mental asociada a quedar fuera del estudio y del trabajo: razón de probabilidades de 1,28 para síntomas de salud mental y de 2,84 para suicidalidad | Asociación verificada con estudios de otros países (Gariépy et al., 2022; Paul y Moser, 2009; Benjet et al., 2012); no es una causa demostrada ni está medida en el segmento |
| | E4. Aislamiento de quien queda fuera del estudio | Hipótesis: entrevistas. Referencia general: 36,9 % de la juventud se sintió aislada o falta de compañía en dos semanas (INJUV, 2022) |
| | E5. Elecciones de carrera basadas en expectativas equivocadas: ingresos esperados sobreestimados en más de 100 % | Verificado en Chile entre quienes ya postulaban (Hastings et al., 2015) |
| **Problema central (tronco)** | **Las personas que egresan de 4.º medio deciden si estudian, qué y dónde con información insuficiente, dispersa y difícil de comparar** | La dispersión está verificada; que la información sea insuficiente para decidir es hipótesis a confirmar con la encuesta |
| **Causa 1** | **La información oficial de cada carrera está repartida entre varios organismos, con formatos, nombres y períodos distintos** | Verificada: el SIES, el DEMRE y el Mineduc publican por separado (Ministerio de Educación, s. f.-a, s. f.-b; Subsecretaría de Educación Superior, s. f.) |
| 1.1 | La persona no confía en poder obtener la información por sí misma | Hipótesis: encuesta (subescala Información ocupacional) |
| **Causa 2** | **Reunir y comparar los datos toma tiempo y exige saber dónde buscar** | Hipótesis central: no hay medición oficial; se mide con la tarea cronometrada |
| 2.1 | Hay que visitar varios sitios para una sola carrera | Hipótesis: tarea cronometrada (sitios visitados) |
| 2.2 | Una parte de quienes buscan no llega a reunir todos los datos | Hipótesis: tarea cronometrada (proporción que completa) |
| **Causa 3** | **Los indicadores son difíciles de interpretar: no es evidente qué mide cada cifra** | Verificado que la definición es técnica (SIES, 2025); cuánto se entiende es hipótesis: tarea cronometrada y entrevistas |
| **Causa 4** | **Los pasos y plazos de la admisión y de los beneficios no se conocen a tiempo** | Hipótesis: entrevistas. Verificado en parte: los plazos cambian cada año y se publican en sitios distintos (Ministerio de Educación, 2026a) |
| **Causa 5** | **Después de egresar, la persona busca sin acompañamiento** | Hipótesis: encuesta (pregunta de clasificación) y entrevistas |
| **Fuera del alcance** | Ingreso del hogar, existencia y monto de los beneficios, puntajes obtenidos, oferta de carreras en cada zona, conectividad, motivos de salud, trabajo o cuidado de otras personas | Suposiciones críticas del Punto 3 |

### 2.5 Análisis FODA

Lo interno lo controla el equipo; lo externo es del entorno.

**Tabla 2.4.** Matriz FODA.

| | Positivos | Negativos |
|---|---|---|
| **Internos** | **Fortalezas.** F1. Procesamiento de datos oficiales (elaboración propia con archivos del Mineduc, el SIES y el DEMRE, 2026): 11.364 variantes de carrera de pregrado procesadas, 7.299 con indicadores del SIES y 2.086 con ponderaciones y vacantes del DEMRE. F2. Cada cifra mostrada con fuente, enlace y fecha, y cifras sin origen retiradas. F3. Prototipo funcional. F4. Privacidad desde el diseño: datos personales mínimos. F5. Competencias del equipo en desarrollo de software, bases de datos y gestión de proyectos | **Debilidades.** D1. Tres integrantes y siete semanas de ejecución (3 de noviembre al 19 de diciembre). D2. Sin profesional de psicología o psicopedagogía en el equipo para validar contenidos de orientación. D3. Investigación primaria sin aplicar y con muestra por conveniencia. D4. Sin trayectoria pública: la credibilidad de un análisis independiente se construye con el tiempo. D5. Sin figura jurídica constituida: el equipo no puede facturar ni firmar contratos |
| **Externos** | **Oportunidades.** O1. Datos abiertos oficiales del Mineduc, el SIES y el DEMRE. O2. Evidencia de que la información personalizada cambia decisiones de estudio (Hastings et al., 2015; Bettinger et al., 2012). O3. Calendario oficial de beneficios 2027 publicado (Ministerio de Educación, 2026a). O4. Infraestructura de plan gratuito que permite uso comercial. O5. Las personas de 18 años o más pueden participar en las mediciones con su solo consentimiento | **Amenazas.** A1. Vigencia de la Ley 21.719, postergada al 15 de octubre de 2027 por la Ley 21.855 (2026), que exige cuidado en todo dato personal. A2. Reglas, montos y plazos que cambian cada año. A3. Proveedores cuyo plan gratuito puede cambiar. A4. Los portales públicos, que son gratuitos, podrían integrar sus datos y reducir el vacío. A5. Ninguna organización ha pedido un análisis ni ningún anunciante un espacio: la demanda no está demostrada. A6. Parte de los datos oficiales no declara una licencia de reutilización |

**Tabla 2.5.** FODA cruzado (Weihrich, 1982).

| Cruce | Estrategia formulada |
|---|---|
| F + O (ofensiva) | FO-1. Usar los datos oficiales procesados y trazables (F1, F2) para dejar comparable lo que hoy está repartido (O1). FO-2. Medir con personas de 18 años o más (O5) el tiempo de búsqueda con y sin el prototipo (F3) |
| D + O (reorientación) | DO-1. Construir credibilidad (D4) publicando el método y las fuentes de cada cifra (O1). DO-2. Publicar sobre infraestructura gratuita (O4) mientras no haya figura jurídica ni ingresos (D5) |
| F + A (defensiva) | FA-1. Pedir los datos personales mínimos (F4) para que la vigencia de la Ley 21.719 (A1) no obligue a rehacer el sistema. FA-2. Mantener los datos con fecha de vigencia (F2) frente a los cambios anuales (A2). FA-3. Complementar a los portales públicos (A4) citándolos como fuente, sin competir con ellos |
| D + A (supervivencia) | DA-1. Limitar el alcance (D1) y mantener la infraestructura tras interfaces intercambiables (A3). DA-2. Sin profesional clínico (D2), delimitar el servicio como información que orienta y deriva, sin aconsejar ni diagnosticar. DA-3. No depender de ventas (A5) durante el prototipo: el costo se cubre con horas del equipo |

**Nota.** Las debilidades (D1 a D5) y las amenazas (A1 a A6) pasan como factores de riesgo al Entregable II.

### 2.6 Abordaje desde la especialidad

La carrera de Ingeniería de Ejecución en Informática, mención Desarrollo de Sistemas, de AIEP San Fernando, aporta las competencias del perfil de egreso (Tabla 1.3b). Cada una se conecta con una causa del árbol.

**Tabla 2.6.** Causa, competencia y aporte.

| Causa (Tabla 2.3) | Competencia del perfil | Cómo la aborda | Estado hoy |
|---|---|---|---|
| 1. Información repartida | Ciclo del software; análisis y diseño (bases de datos y plataformas) | Integrar la oferta, los indicadores y los requisitos oficiales en un solo modelo de datos, con fuente, enlace y fecha | Programas de carga ejecutados con datos reales |
| 2. Tiempo para reunir y comparar | Análisis y diseño con visión de usuario; transformación digital | Presentar los datos de una carrera en una sola vista y permitir compararla con otra | Vista de carrera y comparación construidas |
| 3. Indicadores difíciles de interpretar | Análisis y diseño con visión de usuario; ética | Indicar junto a cada cifra qué mide, de qué año es y con qué se compara | Construida |
| 4. Pasos y plazos | Ciclo del software (pruebas) | Calendario con datos vigentes y cálculos probados contra la fuente oficial | Calendario de beneficios construido |
| 5. Búsqueda sin acompañamiento | Gestión de proyectos; ética | Permitir que la persona fije una meta y vea los pasos y las alternativas cercanas, con derivación a servicios públicos cuando corresponde | Construida |

### 2.7 Abordaje sostenible, innovador y tecnológico

**Sostenible.** *Económica:* lo que usan las personas es gratuito, y los avisos permitidos no condicionan su uso (4.2); el financiamiento previsto proviene de informes de datos y asesorías que encarguen organizaciones, sin que el equipo salga a buscarlas, y de espacios publicitarios para servicios educativos que no son instituciones de educación superior (Punto 8). *Social:* aborda el no ingreso a la educación superior y la proporción de jóvenes que no estudian ni trabajan, en coherencia con los Objetivos de Desarrollo Sostenible (ODS) 4 y 8 (Naciones Unidas, 2015). *Ambiental:* páginas livianas que consumen pocos datos; no se afirma una huella de carbono.

**Innovador.** Innovación de proceso, incremental (Tabla 1.3): reúne datos oficiales dispersos con su fuente y fecha, y los deja comparables. Se apoya en que la información personalizada cambia decisiones, mientras el material genérico muestra efectos nulos (Bettinger et al., 2012). La promesa se limita a acortar el camino hacia la información; **no** promete que las personas ingresen, ni mejorar su salud mental.

**Tecnológico.** Aplicación web instalable en Next.js con TypeScript; base de datos PostgreSQL en Supabase con seguridad por filas en región São Paulo; procesamiento de datos oficiales en Python; Cloudflare para el alojamiento, y accesibilidad según WCAG 2.2 nivel AA (W3C, 2023).

### 2.8 Declaración de uso de inteligencia artificial

Se usó inteligencia artificial (IA) para acelerar el trabajo; no es fuente de datos. Las cifras se citan desde el organismo que las publica (American Psychological Association [APA], 2023).

**Tabla 2.7.** Uso de herramientas de IA.

| Herramienta | Para qué se usó | Cómo se verificó |
|---|---|---|
| Claude (Anthropic, 2026) | Apoyo en la redacción, la organización del texto y la búsqueda de fuentes oficiales; extracción de cifras desde los documentos originales; escritura y revisión de código | Cada cifra se contrastó con el documento oficial citado; el equipo revisó y aprobó el texto |
| Codex (OpenAI, 2026) | Revisión de código en solo lectura y rastreo del origen de cifras con búsqueda web | Sus resultados se tratan como pista hasta abrir el documento original |
| Antigravity (Google, 2026) | Lectura de documentos y segunda opinión sobre el diseño y los textos | Sus resultados se tratan como pista hasta verificarlos contra el documento oficial |

**Control.** Se retiraron cifras sin origen verificable, entre ellas las que circulan en medios de prensa sin un informe público detrás, y las que provenían de muestras de programas particulares.

**Salvaguardas.** No se subieron datos personales a herramientas de IA, no se usaron cifras de IA sin verificar y no se simularon respuestas de encuestados ni entrevistados.

### Anexo 2.A Encuesta: instrumento estandarizado

**Instrumento.** Escala de Autoeficacia para la Elección de Carrera (EAEC) (Ramírez Dorantes y Canto, 2007), de acceso abierto (se pide permiso a los autores para la adaptación de vocabulario y la aplicación), que se aplicará completa: 55 ítems en su orden original, con respuesta de 0 (ninguna confianza) a 9 (confianza absoluta). La instrucción es «¿Cuánta confianza tienes de que podrías…?».

**Tabla 2.A.1.** Ficha técnica (datos de la fuente).

| Atributo | Valor |
|---|---|
| Base | Versión en español del *Career Decision-Making Self-Efficacy Scale* (Taylor y Betz, 1983): 28 ítems de ese instrumento y 27 nuevos, revisados por tres expertos en orientación |
| Muestra de validación | 343 estudiantes de la Universidad Autónoma de Yucatán (México), edad promedio de 18,5 años |
| Validez | Análisis factorial con 5 factores que explican el 42,2 % de la varianza; Kaiser-Meyer-Olkin (KMO) = 0,896; 49 de 55 ítems con carga ≥ 0,40 |
| Confiabilidad (α) | Total 0,95; subescalas de 0,79 a 0,88 |
| Puntuación | Promedio de 0 a 9 por subescala y total; sin puntos de corte |

**Tabla 2.A.2.** Subescalas e ítems.

| Subescala | Ítems | Ejemplos textuales | α en la fuente |
|---|---|---|---|
| Autoconocimiento | 1 a 11 | «Evaluar con exactitud tus habilidades»; «Identificar algunas carreras que te interesan» | 0,79 |
| Información ocupacional | 12 a 21 | «Obtener información acerca de instituciones de educación superior»; «Asistir a charlas que proporcionen información acerca de las carreras que te interesan» | 0,86 |
| Establecimiento de metas | 22 a 34 | «Seleccionar una carrera entre varias en las que estás interesado»; «Determinar el nivel académico que te gustaría obtener» | 0,87 |
| Solución de problemas | 35 a 46 | «Encontrar alternativas de carrera si no pudieras ingresar a la que elegiste primero» | 0,87 |
| Planeación | 47 a 55 | «Hacer un plan de tus metas vocacionales para los próximos cinco años» | 0,88 |

**Clasificación (no es parte de la escala).** Año de egreso de 4.º medio; región; situación actual (estudia en la educación superior, trabaja, ambas o ninguna); y si recibió orientación de alguna institución después de egresar (sí o no). Sin edad exacta, género, comuna ni nombre del establecimiento.

**Qué no mide.** Conocimiento de requisitos, beneficios o plazos; no existe una escala validada para ello. Esos temas se exploran en las entrevistas (Anexo 2.B).

**Limitaciones.** La EAEC no tiene validación ni normas en Chile; su estructura factorial no reproduce del todo las cinco subescalas, y mide confianza por autoinforme. Es una limitación declarada: no se encontró una escala validada en Chile sobre elección de carrera.

**Control adicional.** Juicio de expertos sobre la adaptación del vocabulario (Escobar-Pérez y Cuervo-Martínez, 2008), prueba previa con 10 personas y cálculo del α de Cronbach con los datos propios.

### Anexo 2.B Guion de entrevista semiestructurada

Duración: 30 a 40 minutos. Se piden hechos y ejemplos («cuénteme la última vez que…»), no opiniones generales; no se presenta ninguna solución; se repregunta con «¿por qué?» y «¿cómo así?».

**Tabla 2.B.1.** Guion general.

| Momento | Propósito | Preguntas |
|---|---|---|
| Apertura (5 min) | Presentarse y pedir consentimiento | «Estamos haciendo un proyecto de título de Informática sobre cómo se decide qué hacer después de 4.º medio. Su participación es voluntaria y anónima. ¿Acepta participar? ¿Podemos grabar el audio?» |
| Contexto (5 min) | Conocer su relación con el problema | «¿Cuándo egresó de 4.º medio? ¿Qué ha hecho desde entonces?» |
| Experiencia (15 min) | Relatos concretos | «Cuénteme la última vez que tuvo que averiguar o decidir sobre una carrera. ¿Qué hizo primero? ¿Qué información usó y dónde la buscó? ¿Cuánto tiempo le tomó? ¿Qué pasó después?» |
| Causas y efectos (10 min) | Explorar por qué ocurre | «¿Qué fue lo más difícil de ese proceso? ¿Por qué cree que ocurrió? ¿Cómo le afectó a usted o a su familia?» |
| Cierre (5 min) | Abrir espacio y agradecer | «¿Hay algo que no le pregunté y que sea importante? ¿Conoce a otra persona que pueda contarnos su experiencia?» |

**Tabla 2.B.2.** Preguntas adicionales por actor.

| Actor (Tabla 1.1) | Pregunta adicional |
|---|---|
| 1 a 3 Personas que egresaron | «Cuénteme cómo fue el día en que supo que no entraría a estudiar ese año. ¿Con quién lo conversó? ¿Cómo fueron los meses siguientes?» |
| 5 Familias | «¿Qué ayuda tuvo su familia para informarse y cuánto tiempo tomó?» |
| 6 Organizaciones que usan datos | «Cuénteme la última vez que necesitó un dato de educación superior para decidir algo. ¿De dónde lo obtuvo y cuánto demoró?» |
| 8 Organizaciones que ya informan | «¿Qué le ofrecen hoy a una persona que ya egresó y qué no cubren?» |

**Ética.** Consentimiento informado; sin nombre, RUT, teléfono ni dirección en los registros; citas anónimas del tipo «Persona egresada en 2023, Región del Maule»; grabaciones y transcripciones con acceso restringido, eliminadas al terminar el levantamiento. Si en una entrevista aparece una señal de riesgo, se entrega el número de la Línea de Prevención del Suicidio (*4141) y de Salud Responde (600 360 7777), y la entrevista se detiene.

### Anexo 2.C Plan de análisis de hipótesis

Cada hipótesis del árbol de problemas (Tabla 2.3) se confronta con un instrumento y un criterio para confirmarla, refutarla o matizarla. Los umbrales son un criterio del equipo, fijado antes de medir.

**Tabla 2.C.1.** Hipótesis, instrumento y criterio.

| Hipótesis (Tabla 2.3) | Instrumento | Criterio |
|---|---|---|
| 1.1 Poca confianza para obtener información | EAEC, subescala Información ocupacional (ítems 12 a 21) | Se confirma si el promedio de la subescala es menor que el de las demás, y menor entre quienes no han ingresado |
| Causa 2: reunir y comparar toma tiempo | Tarea cronometrada | Se confirma si la mediana del tiempo supera los 10 minutos |
| 2.1 Varios sitios para una carrera | Tarea cronometrada | Se confirma si la mediana de sitios visitados es de 3 o más |
| 2.2 No todos reúnen los datos | Tarea cronometrada | Se confirma si menos de 8 de 10 personas completan la tarea en 20 minutos |
| Causa 3: indicadores difíciles de interpretar | Tarea cronometrada y entrevistas | Se confirma si menos de 8 de 10 personas explican correctamente qué mide la empleabilidad al primer año |
| Causa 4: pasos y plazos no conocidos a tiempo | Entrevistas a personas que egresaron | Se confirma si al menos la mitad declara haberse enterado de un plazo cuando ya había cerrado |
| Causa 5: búsqueda sin acompañamiento | Encuesta (pregunta de clasificación) y entrevistas | Se confirma si más de la mitad de quienes responden declara no haber recibido orientación después de egresar |
| E4: aislamiento | Entrevistas a personas que egresaron | Se describe; con dos entrevistas no se confirma ni se refuta |

### Anexo 2.D Limitaciones de los datos y actores a entrevistar

**Tabla 2.D.1.** Limitaciones.

| Tema | Situación |
|---|---|
| OCDE | La cifra se tomó de la base de datos oficial en línea, no del informe impreso; el dato de Chile es de 2024 y el promedio figura con referencia 2025 |
| Alcance de los datos | El 49,6 % mide ingreso inmediato y no «nunca»; el acceso acumulado es de otra cohorte (egreso 2021), afectada por la pandemia según el propio informe; el SIES revisa sus cifras entre ediciones, por lo que siempre se cita la edición usada |
| Razones del no ingreso | La encuesta oficial agrupa las razones en cinco categorías, ninguna sobre información, y abarca a todas las personas de 18 a 24 años que no asisten, incluidas las que ya terminaron estudios |
| Salud mental y aislamiento | Las cifras son de la juventud en general (INJUV) o de estudios de otros países; la relación con quedar fuera es una asociación y puede ir en ambos sentidos (Gariépy et al., 2022); no hay medición del segmento |
| Causalidad | Ningún dato permite decir qué parte del no ingreso se debe a la falta de información |
| Tiempo de búsqueda | No existe medición oficial; la del proyecto es de 10 personas y por conveniencia |

**Tabla 2.D.2.** Actores a entrevistar (meta de 5; ninguna entrevista realizada). Detalle de objetivos en la Tabla 2.2.

| Actor (Tabla 1.1) | Perfil previsto | Entrevistas |
|---|---|---|
| 1 a 3 | Dos personas de 18 años o más: una que no ingresó a la educación superior y otra que ingresó después de uno o más años | 2 |
| 5 | Familiar de una persona que egresó | 1 |
| 6 | Profesional de una organización que usa datos de educación superior | 1 |
| 8 | Profesional de una organización que ya informa u orienta | 1 |

## 3. Fundamentación del proyecto

Este punto convierte el diagnóstico en objetivos, metas y una forma de trabajo. Los objetivos se formulan sobre el problema (la situación de las personas que egresan), no sobre un producto. Las metas miden lo que se puede verificar antes del 19 de diciembre de 2026; los efectos de largo plazo (ingreso a la educación superior, permanencia fuera de la inactividad) quedan como fin y como proyección, no como compromiso de este período.

### 3.1 Del árbol de problemas al árbol de objetivos

Cada situación negativa del árbol de problemas se convierte en una situación positiva (Ortegón et al., 2005).

**Tabla 3.1.** Árbol de problemas y árbol de objetivos.

| Árbol de problemas (Punto 2) | Árbol de objetivos |
|---|---|
| Efectos: una de cada dos personas no ingresa al año siguiente; jóvenes fuera del estudio y del trabajo; peor salud mental y aislamiento asociados a quedar fuera | Fin: más personas que egresan de 4.º medio continúan estudios o deciden con información completa, y menos quedan fuera del estudio y del trabajo (metas ODS 4.3 y 8.6; proyección, no medición de este período) |
| Problema central: las personas que egresan deciden con información insuficiente, dispersa y difícil de comparar | Objetivo general: las personas que egresan de 4.º medio reúnen y comparan, con información oficial verificable y en poco tiempo, las opciones de estudio que les interesan |
| Causas 1 y 3: información repartida e indicadores difíciles de interpretar | OE1: las personas conocen, con fuente verificable, la empleabilidad, la duración, el arancel y los requisitos de las carreras que les interesan, y saben qué mide cada cifra |
| Causa 2: reunir y comparar toma tiempo | OE2: las personas reúnen y comparan esos datos en menos tiempo que hoy |
| Causas 4 y 5: pasos y plazos no conocidos a tiempo; búsqueda sin acompañamiento | OE3: las personas saben qué pasos y plazos siguen para la carrera que fijaron como meta y qué alternativas cercanas tienen |
| Fuera del alcance: ingreso del hogar, beneficios, puntajes, oferta por zona, conectividad, salud, trabajo o cuidado | Suposiciones críticas (3.9) |

Se descartan como objetivos predecir quién ingresará, mejorar la salud mental y reemplazar la orientación profesional, por falta de evidencia o de capacidad del equipo.

### 3.2 Objetivo general y objetivos específicos

Se redactan con el criterio SMART (Doran, 1981). Fórmula: verbo + qué + para quién y dónde + para qué + cuándo + cuánto. Cada objetivo describe una situación lograda; su medio de ejecución se detalla en los entregables (3.7).

**Objetivo general (OG).** Lograr que las personas que egresan de 4.º medio en Chile y no han ingresado a la educación superior reúnan y comparen, con información oficial verificable, las opciones de estudio que les interesan, para que decidan con información completa y verificable, validado al 4 de diciembre de 2026 en una medición con 10 personas de 18 años o más, con al menos el 80 % de las tareas centrales (32 de 40) completadas sin ayuda.

**OE1.** Lograr que las personas conozcan la empleabilidad, la duración, el arancel y los requisitos de las carreras que les interesan y sepan qué mide cada cifra, medido con el 100 % de los datos mostrados con su fuente, enlace y fecha al 27 de noviembre de 2026, y con al menos 8 de 10 personas que, al 4 de diciembre, identifican los cuatro datos de una carrera y explican correctamente qué mide su empleabilidad.

**OE2.** Lograr que las personas reúnan y comparen los datos de una carrera en dos instituciones en menos tiempo que hoy, medido al 4 de diciembre de 2026 con una reducción de al menos 50 % en la mediana del tiempo respecto de la línea base que se mide en los sitios oficiales con las mismas 10 personas.

**OE3.** Lograr que las personas sepan qué pasos y plazos siguen para la carrera que fijaron como meta y qué alternativas cercanas tienen, medido al 4 de diciembre de 2026 con al menos 8 de 10 personas que identifican el próximo plazo que les corresponde y al menos una alternativa a su primera opción, y con el 100 % de los plazos publicados con fuente y fecha de vigencia.

**Tabla 3.2.** Verificación SMART.

| Objetivo | S (específico) | M (medible) | A (alcanzable) | R (relevante) | T (plazo) |
|---|---|---|---|---|---|
| OG | Reunir y comparar opciones de estudio con información verificable | 32 de 40 tareas sin ayuda (10 personas × 4 tareas) | Prototipo funcional ya probado en sus componentes; participan personas de 18 años o más, sin autorizaciones de terceros | Ataca el problema central en sus causas | 4 dic 2026 |
| OE1 | Empleabilidad, duración, arancel y requisitos, con fuente | 100 % con fuente; 8 de 10 identifican y explican | 11.364 variantes de carrera ya procesadas con datos oficiales | Causas 1 y 3 | 27 nov (datos); 4 dic (medición) |
| OE2 | Tiempo para reunir y comparar | Reducción ≥ 50 % de la mediana frente a la línea base | La línea base y la medición usan la misma tarea y las mismas personas | Causa 2 | 4 dic 2026 |
| OE3 | Pasos, plazos y alternativas hacia la meta | 8 de 10 identifican plazo y alternativa; 100 % de plazos con fuente | Calendario oficial de beneficios 2027 publicado | Causas 4 y 5 | 4 dic 2026 |

Prueba lógica: si se cumplen OE1, OE2 y OE3, la persona tiene información verificable, la reúne en menos tiempo y sabe qué pasos seguir, que es lo que el OG pide validar. Los efectos reales sobre el ingreso y sobre la salud mental no se afirman: se proyectan como fin.

### 3.3 Metas e indicadores de logro

Las fichas técnicas completas están en el Anexo 3.A. Donde no hay línea base publicable se declara, porque una cifra de partida no verificada no se usa.

**Tabla 3.3.** Indicadores.

| Código | Objetivo | Indicador y fórmula | Línea base | Meta y plazo | Medio de verificación | Meta ODS |
|---|---|---|---|---|---|---|
| I-OG | OG | Tareas centrales completadas sin ayuda = (tareas completadas sin ayuda ÷ 40) × 100 | 0: sin medición con personas | 80 % (32 de 40), del 30 nov al 4 dic | Registro de la medición | 4.3 |
| I-OE1a | OE1 | Datos con fuente = (datos mostrados con fuente, enlace y fecha ÷ datos mostrados) × 100 | 10 carreras de ejemplo verificadas contra archivos oficiales | 100 % al 27 nov | Revisión automática y por muestra | 4.3 |
| I-OE1b | OE1 | Personas que identifican los cuatro datos y explican la empleabilidad = (personas ÷ 10) × 100 | 0: medición no aplicada | 80 % (8 de 10) al 4 dic | Registro de la medición | 4.3 |
| I-OE2 | OE2 | Reducción del tiempo = ((mediana en sitios oficiales − mediana con el prototipo) ÷ mediana en sitios oficiales) × 100 | Se mide en la misma sesión; no existe cifra oficial | ≥ 50 % al 4 dic | Registro de tiempos con cronómetro | 4.3 |
| I-OE3a | OE3 | Personas que identifican su próximo plazo y una alternativa = (personas ÷ 10) × 100 | 0: medición no aplicada | 80 % (8 de 10) al 4 dic | Registro de la medición | 4.3 y 8.6 |
| I-OE3b | OE3 | Plazos con respaldo = (plazos con fuente y fecha de vigencia ÷ plazos publicados) × 100 | Calendario oficial de beneficios 2027 publicado | 100 % al 27 nov | Revisión de los datos | 4.3 |

Son indicadores de resultado inmediato: miden el problema (tiempo, comprensión) en una muestra pequeña y no estiman efectos en la población. La subescala Información ocupacional de la encuesta (Punto 2) será la línea base de la causa 1.1. El marco lógico completo está en el Anexo 3.B.

**Indicadores de impacto (proyección).** Acceso inmediato y acumulado a la educación superior (SIES) y proporción de jóvenes de 18 a 24 años que no estudian ni trabajan (OCDE). Son cifras nacionales de referencia: el proyecto no puede atribuirse sus cambios.

### 3.4 Vínculo con los Objetivos de Desarrollo Sostenible (ODS)

Se vincula a nivel de meta, con un ODS principal y uno secundario (Naciones Unidas, 2015).

**Tabla 3.4.** Vínculo con los ODS.

| ODS | Meta | Cómo aporta | Indicador |
|---|---|---|---|
| 4 Educación de calidad (principal) | 4.3: «De aquí a 2030, asegurar el acceso igualitario de todos los hombres y las mujeres a una formación técnica, profesional y superior de calidad, incluida la enseñanza universitaria» | Reduce la barrera de información para acceder a la educación superior | I-OG, I-OE1a, I-OE1b, I-OE2, I-OE3a, I-OE3b |
| 8 Trabajo decente y crecimiento económico (secundario) | 8.6: «De aquí a 2020, reducir considerablemente la proporción de jóvenes que no están empleados y no cursan estudios ni reciben capacitación» | Ayuda a que quien egresa mantenga una meta de estudio y conozca sus alternativas | I-OE3a |

Los indicadores globales de estas metas no pueden medirse con un prototipo; por eso los indicadores del proyecto son de resultado inmediato y el aporte a los ODS se declara como proyección.

### 3.5 Sustentabilidad: impactos y requerimientos

Se analiza el triple resultado (Elkington, 1997). No se incluyen cifras de emisiones porque no hay fuente oficial verificada; lo ambiental se trata como requerimiento de diseño.

**Tabla 3.5.** Sustentabilidad.

| Dimensión | Impactos positivos | Impactos negativos y mitigación | Requerimientos para mantenerse |
|---|---|---|---|
| Económica | Acceso gratuito a información hoy dispersa; desembolso directo mínimo en el prototipo por el uso de planes gratuitos | Dependencia de planes gratuitos que pueden cambiar. Mitigación: infraestructura portable. Ingresos no demostrados. Mitigación: el costo del prototipo se cubre con horas del equipo | Ingresos por informes de datos y asesorías; el acceso de las personas sigue siendo gratuito |
| Social | Personas mejor informadas, en menos tiempo | Exclusión de quien no tiene teléfono o datos móviles: se diseña para pantallas de 360 px y páginas livianas. Riesgo de que una estimación se tome como resultado oficial: cada resultado se rotula como estimación con su fuente. Riesgo de que un indicador se lea como promesa: junto a cada cifra se indica qué mide | Accesibilidad WCAG 2.2 AA, lenguaje claro, datos personales mínimos, derivación a servicios públicos cuando corresponde |
| Ambiental | Menos desplazamientos y papel para informarse, hipótesis cualitativa que no se mide | Consumo de energía de servidores y almacenamiento. Mitigación: guardar solo los datos necesarios | Páginas livianas y minimización de datos; el peso de página tiene como meta menos de 1 MB en la primera carga, que se mide con Lighthouse y aún no es un logro |

### 3.6 Estrategia de organización

#### 3.6.1 Instrumentos de gestión

**Tabla 3.6.** Instrumentos de gestión.

| Instrumento | Para qué se usa | Herramienta |
|---|---|---|
| Carta Gantt | Planificar fases y semanas hasta la entrega | Tabla siguiente |
| Tablero Kanban | Ver el estado de cada tarea (por hacer, en curso, en revisión, hecha) | Tablero digital con una columna por estado y una tarjeta por tarea |
| Matriz RACI | Definir quién ejecuta, aprueba, es consultado e informado | Tabla siguiente |
| Control de versiones y revisión | Un cambio por rama y por solicitud de cambios, con revisión escrita con pauta (Claude y Codex como apoyo) y confirmación de la jefatura; los cambios de la jefatura no tienen un segundo revisor humano | Plataforma de control de versiones |

**Tabla 3.7.** Carta Gantt.

| Fase | S1 (3-9 nov) | S2 (10-16 nov) | S3 (17-23 nov) | S4 (24-30 nov) | 30 nov-4 dic | 7-17 dic | 18-19 dic | Hito |
|---|---|---|---|---|---|---|---|---|
| F1 Datos oficiales de cada carrera, con fuente (OE1) | X | X | X | | | | | Datos de carrera con fuente y fecha |
| F2 Comparación de carreras y explicación de cada cifra (OE1, OE2) | | X | X | X | | | | Comparación disponible |
| F3 Meta, alternativas, pasos y plazos (OE3), con congelamiento de funciones el 27 nov | | | X | X | | | | Calendario y alternativas disponibles |
| F4 Levantamiento primario: encuesta, medición de tiempo y entrevistas | | | | X | X | | | Registro de la medición |
| F5 Correcciones y mejoras leves, sin funciones nuevas (7 al 11 de diciembre, con reserva hasta el 17) | | | | | | X | | Correcciones de los hallazgos |
| F6 Cierre: informe y presentación | | | | | | X | X | Entrega el 19 dic |

**Tabla 3.8.** Matriz RACI. R: ejecuta; A: aprueba (uno por tarea); C: consultado; I: informado.

| Tarea | Rafael Jaque | Alejandro Tapia | Cristóbal Rojas | Docente tutor |
|---|---|---|---|---|
| Datos oficiales de cada carrera | A | I | R | I |
| Comparación y explicación de cada cifra | A/R | C | R | I |
| Meta, alternativas, pasos y plazos | A/R | C | R | I |
| Protección de datos personales | A/R | I | I | C |
| Encuesta, medición de tiempo y entrevistas | A | R | R | C |
| Informe y presentación | A/R | R | R | C |

Actualizada al 27 de noviembre de 2026. El 22 de noviembre, para cumplir el congelamiento de funciones del 27, la vista de carrera con su bloque de comparaciones, la meta con sus alternativas y la página «Quiénes somos» pasaron a Rafael Jaque. Cristóbal Rojas mantiene el cálculo de las comparaciones y el calendario de plazos; Alejandro Tapia, la accesibilidad del comparador y la medición con personas.

#### 3.6.2 Sustentabilidad del proyecto y responsabilidad social (ISO 26000)

La norma ISO 26000 organiza la responsabilidad social en siete materias fundamentales (International Organization for Standardization [ISO], 2010). Se priorizan cuatro.

**Tabla 3.9.** Responsabilidad social.

| Materia | Acción concreta |
|---|---|
| Gobernanza de la organización | Decisiones registradas; roles definidos en la matriz RACI; revisión con pauta escrita antes de integrar cambios |
| Asuntos de consumidores | Uso gratuito; avisos solo de servicios educativos que no son instituciones de educación superior, rotulados «Publicidad», sin uso de datos personales y fuera de las pantallas donde se compara o se decide; datos personales mínimos (solo la lista cerrada de datos de la cuenta, y solo si la persona la crea); sin venta de datos personales |
| Prácticas justas de operación | Independencia: ningún resultado se ordena ni se destaca por ser cliente; el método de cada análisis es público |
| Participación y desarrollo de la comunidad | Mediciones con personas reales, con su consentimiento; información abierta y gratuita |

### 3.7 Entregables

**Tabla 3.10.** Entregables por objetivo.

| Objetivo | Entregable | Criterio de aceptación | Fecha | Responsable |
|---|---|---|---|---|
| OE1 | Vista de carrera con su empleabilidad comparada con la de la misma carrera en otras instituciones y con la de su área, duración formal y real, arancel, requisitos y vacantes | Se abre en un teléfono; cada dato muestra fuente, enlace, fecha y qué mide; toda cifra calculada por el equipo se rotula como elaboración propia | 27 nov | Cristóbal (datos y cálculo), Rafael (bloque de comparaciones) |
| OE1 | Cálculo del puntaje ponderado | Casos verificados contra la fuente oficial, todos aprobados | 27 nov | Cristóbal |
| OE2 | Comparación de hasta 3 carreras | Cada indicador con fuente y fecha; no se comparan indicadores distintos entre sí | 27 nov | Rafael, Alejandro (accesibilidad) |
| OE3 | Meta con hasta dos preferencias (tres carreras en total) y alternativas cercanas | El criterio de cercanía es explícito y no depende de ningún cliente; se guarda en el dispositivo, sin cuenta | 27 nov | Rafael |
| OE3 | Calendario de admisión y de beneficios, y preguntas frecuentes | Cada plazo y cada respuesta con fuente y fecha de vigencia | 27 nov | Cristóbal |
| OG | Registro del levantamiento primario | Tiempos, tareas, respuestas y limitaciones registrados | 4 dic | Alejandro, Cristóbal |
| OG | Informe final y presentación | Entrega completa | 19 dic | Rafael |

Quedan diseñados, sin construir en este período: la cuenta con correo, el cuestionario de intereses vocacionales, la simulación de beneficios, el asistente conversacional, la sección de noticias de educación superior, el tablero público de transparencia de datos y el primer informe de muestra.

### 3.8 Resultados esperados

**Tabla 3.11.** Resultados esperados.

| Objetivo | Resultado esperado |
|---|---|
| OE1 | Al 27 de noviembre de 2026, todos los datos mostrados traen su fuente; al 4 de diciembre, al menos 8 de 10 personas identifican los cuatro datos de una carrera y explican qué mide su empleabilidad |
| OE2 | Al 4 de diciembre de 2026, la mediana del tiempo para reunir y comparar los datos baja al menos a la mitad respecto de la línea base medida en los sitios oficiales |
| OE3 | Al 4 de diciembre de 2026, al menos 8 de 10 personas identifican su próximo plazo y una alternativa |
| OG | Al 4 de diciembre de 2026, 32 de 40 tareas centrales se completaron sin ayuda y los hallazgos quedaron registrados |

Limitación: con 10 personas por conveniencia, los resultados son una validación de uso y una primera medida del problema; no estiman efectos en la población.

### 3.9 Suposiciones críticas

Son condiciones del entorno; los riesgos internos del equipo se gestionan en el Entregable II. Las probabilidades son estimaciones del equipo.

**Tabla 3.12.** Suposiciones críticas.

| Suposición | Impacto si no se cumple | Probabilidad | Control | Plan B |
|---|---|---|---|---|
| El Mineduc, el SIES y el DEMRE mantienen sus archivos abiertos con estructura similar | Alto: se detiene la carga de datos | Media | Validar el esquema en cada carga | Cargar a mano de 5 a 10 carreras reales con su fuente |
| Los plazos y reglas de admisión y de beneficios se publican a tiempo | Alto: calendario desactualizado | Media | Datos con fecha de vigencia | Mostrar el último proceso vigente rotulado como tal |
| Se consiguen 10 personas de 18 años o más que egresaron en los últimos cinco años | Alto: no hay medición | Media | Invitar a más de las necesarias | Medir con las que se consigan, con un mínimo de 6, y declararlo |
| Los autores de la EAEC autorizan su aplicación | Medio: no hay encuesta | Media | Solicitar el permiso con anticipación | Declarar que no se aplicó; el diagnóstico se apoya en la medición de tiempo y en las entrevistas |
| Los planes gratuitos de infraestructura se mantienen hasta el 19 de diciembre | Medio: se interrumpe la demostración | Baja | Revisar los términos | Demostración grabada |
| La falta de información es una de las causas del no ingreso | Alto: reducir el tiempo de búsqueda no cambiaría el ingreso | Media: la encuesta oficial registra sobre todo razones personales y económicas | Evidencia experimental de otros contextos (Bettinger et al., 2012; Hastings et al., 2015); encuesta y entrevistas | Declarar el límite: el proyecto mejora la información, no garantiza el ingreso |
| Alguna organización se interesa en informes o asesorías | Medio: sin ingresos después del prototipo | Alta | Publicar datos y método; entrevista al actor 6 | Mantener el servicio con horas del equipo y postular a fondos públicos de emprendimiento |

### Anexo 3.A Fichas técnicas de los indicadores

Frecuencia: la revisión de datos y las pruebas automáticas corren en cada cambio; la medición con personas se aplica una vez, entre el 30 de noviembre y el 4 de diciembre.

**Tabla 3.A.1.** Fichas técnicas.

| Código | Nombre | Fórmula | Línea base | Meta y plazo | Medio de verificación | Responsable |
|---|---|---|---|---|---|---|
| I-OG | Tareas centrales completadas sin ayuda | (tareas sin ayuda ÷ 40) × 100; 10 personas y 4 tareas | 0 | 80 % (32 de 40), 30 nov a 4 dic | Registro de la medición | Alejandro (A: Rafael) |
| I-OE1a | Datos con fuente | (datos con fuente, enlace y fecha ÷ datos mostrados) × 100 | 10 carreras de ejemplo verificadas | 100 % al 27 nov | Revisión automática y por muestra | Cristóbal |
| I-OE1b | Personas que identifican los cuatro datos y explican la empleabilidad | (personas ÷ 10) × 100 | 0 | 80 % al 4 dic | Registro de la medición | Alejandro |
| I-OE2 | Reducción del tiempo para reunir y comparar | ((mediana en sitios oficiales − mediana con el prototipo) ÷ mediana en sitios oficiales) × 100 | Se mide en la sesión | ≥ 50 % al 4 dic | Registro de tiempos | Alejandro (A: Rafael) |
| I-OE3a | Personas que identifican su próximo plazo y una alternativa | (personas ÷ 10) × 100 | 0 | 80 % al 4 dic | Registro de la medición | Alejandro |
| I-OE3b | Plazos con respaldo | (plazos con fuente y vigencia ÷ plazos publicados) × 100 | Calendario oficial publicado | 100 % al 27 nov | Revisión de los datos | Cristóbal (A: Rafael) |

**Las cuatro tareas centrales.** (T1) Encontrar una carrera y leer la fuente y la fecha de uno de sus datos; (T2) identificar su empleabilidad, duración, arancel y requisito de ingreso, y explicar qué mide la empleabilidad; (T3) compararla con la misma carrera en otra institución y decir cuál tiene mayor empleabilidad; (T4) fijarla como meta e identificar el próximo plazo y una alternativa; si ninguna alternativa cumple lo que la persona necesita (por ejemplo, la región), decirlo correctamente cuenta como completada. «Sin ayuda» significa sin intervención del equipo y en un máximo de 5 minutos por tarea.

**Cómo se mide el tiempo (I-OE2).** Cada persona hace dos veces la tarea del apartado 2.3.2: una en los sitios oficiales y otra con el prototipo, con carreras distintas en cada vez. La mitad de las personas empieza por los sitios oficiales y la otra mitad por el prototipo, y la asignación de carreras se alterna, para que el aprendizaje y la dificultad de cada carrera no favorezcan a una condición.

### Anexo 3.B Matriz de marco lógico

**Tabla 3.B.1.** Marco lógico.

| Nivel | Resumen narrativo | Indicador y meta | Medio de verificación | Supuestos |
|---|---|---|---|---|
| Fin | Más personas que egresan de 4.º medio continúan estudios o deciden con información completa, y menos quedan fuera del estudio y del trabajo (ODS 4.3 y 8.6) | Acceso inmediato y acumulado (SIES); jóvenes que no estudian ni trabajan (OCDE). Referencia, no atribución | Cifras oficiales | La falta de información es una de las causas del no ingreso |
| Propósito (OG) | Las personas que egresan reúnen y comparan, con información verificable, las opciones de estudio que les interesan | I-OG: 80 % | Registro de la medición | Se consiguen 10 personas |
| Componente OE1 | Las personas conocen empleabilidad, duración, arancel y requisitos, y saben qué mide cada cifra | I-OE1a 100 %; I-OE1b 80 % | Revisión de datos; medición | Archivos oficiales abiertos y estables |
| Componente OE2 | Las personas reúnen y comparan en menos tiempo | I-OE2 ≥ 50 % | Registro de tiempos | La tarea de laboratorio se parece a la búsqueda real |
| Componente OE3 | Las personas saben qué pasos, plazos y alternativas tienen | I-OE3a 80 %; I-OE3b 100 % | Medición; revisión de datos | Plazos y reglas publicados a tiempo |
| Actividades | Procesar datos oficiales, diseñar las vistas, medir con personas, revisar cambios | Avance en la carta Gantt y el tablero | Tablero y registros del equipo | Dedicación del equipo hasta el 19 de diciembre |

# AVANCE 2

## 4. Oportunidades de transferencia tecnológica

La transferencia tecnológica es el camino por el cual lo que desarrolla el equipo llega a ser usado por otras personas y organizaciones (Mankins, 1995, para la escala de madurez; Osterwalder y Pigneur, 2010, para el modelo de ingresos). El problema define dos destinatarios con lógicas distintas: la persona que egresa, que necesita la información gratis y sin condiciones, y la organización que necesita un análisis de esos mismos datos y puede pagarlo. El mecanismo elegido es **la publicación abierta y gratuita para las personas, más servicios de análisis (informes de datos y asesorías) para las organizaciones que los encarguen**, prestados por una sociedad por acciones. Como segunda fuente de ingresos se venden **espacios publicitarios** a servicios educativos que no son instituciones de educación superior, con las reglas del apartado 4.2. El modelo de ingresos es una propuesta que se validará: hoy no hay cliente ni precio aceptado.

### 4.1 Mecanismo elegido

**Tabla 4.1.** Mecanismo elegido.

| Campo | Respuesta |
|---|---|
| Mecanismo elegido y por qué | Publicación abierta más servicios de análisis: la sociedad mantiene el sistema, publica gratis los datos de carreras con su método, y elabora informes o asesorías a pedido. Como segunda fuente, espacios publicitarios rotulados para servicios educativos que no son instituciones de educación superior (4.2). Se elige porque el problema afecta a personas que no pueden ni deben pagar por informarse, y porque el mismo procesamiento de datos sirve a ambos destinatarios |
| Licencia propuesta | Código: propio de la sociedad, con todos los derechos reservados. Contenidos propios: licencia abierta de contenido (Creative Commons BY). Los datos oficiales conservan las condiciones de su fuente y se citan siempre |
| Quién es dueño del resultado | La sociedad, una vez constituida, mediante cesión escrita de los derechos de cada integrante del equipo. Antes de la cesión se revisa el reglamento de titulación de AIEP para confirmar que no la limita |
| Madurez esperada al terminar el módulo | Nivel de madurez tecnológica (TRL, *Technology Readiness Level*) 4: prototipo validado con usuarios en entorno controlado (4.5) |
| Relación con el área de especialidad | Desarrollo de sistemas: requisitos, arquitectura web, bases de datos, procesamiento de datos y accesibilidad (4.6) |

### 4.2 Mecanismos evaluados

**Tabla 4.2.** Mecanismos evaluados.

| Mecanismo | Aplicación al proyecto | Decisión |
|---|---|---|
| Publicación abierta | Sitio gratuito con los datos de cada carrera, su fuente y el método con que se procesan | Elegido: es la respuesta directa al problema y el único canal de difusión |
| Servicios de análisis | Informes de datos y asesorías a pedido para organizaciones | Elegido como fuente de ingresos (a validar) |
| Servicio por suscripción a una herramienta | Acceso pagado a un panel para instituciones | Descartado: exige salir a vender a un cliente que no se ha validado |
| Avisos de servicios educativos que no son instituciones de educación superior | Espacios publicitarios de preuniversitarios y servicios afines, con las reglas que siguen | Elegido como segunda fuente de ingresos (a validar) |
| Avisos de instituciones de educación superior o de una red publicitaria automática | Espacios vendidos a quienes el sitio compara, o asignados por un tercero según el perfil de quien navega | Descartado: una institución compraría visibilidad junto a lo que el sitio compara, y una red automática rastrea a la persona y no deja elegir quién avisa |
| Licenciamiento del software | Derecho de uso del sistema para un tercero | Descartado por ahora: no hay interesado |
| Licencia de código abierto | Facilitaría la réplica | Descartado para el código por ahora; se revisa cuando haya ingresos estables. El método de procesamiento sí se publica |
| Cesión o venta de derechos | Solo si un tercero exigiera ser dueño del código | Descartado |

La independencia es condición de cualquier mecanismo: el sitio público nunca ordena ni destaca instituciones por ser clientes, y quien encarga un informe no obtiene posición, mención ni trato distinto en él.

**Reglas de los avisos.** Los avisos se incorporan porque el único ingreso, los informes, es una hipótesis sin validar, y solo con reglas que eviten que quien avisa compre visibilidad:

1. **Quién avisa.** Solo servicios educativos que no son instituciones de educación superior ni pertenecen a una. Un preuniversitario no vende una carrera ni una institución, así que su interés no choca con los datos que el sitio compara.
2. **Sin rastreo.** El aviso depende de la página, no de la persona. No se usan scripts, cookies ni píxeles de terceros, y el enlace al anunciante no lleva datos de quien lo abre. Así no hay elaboración de perfiles con fines de mercadotecnia, a la que la Ley 19.628, modificada por la Ley 21.719, da derecho a oponerse (art. 8, letra b).
3. **Rotulado.** Cada aviso dice «Publicidad» antes de su contenido y no imita una ficha, una cifra ni un botón del sitio. Según la circular del Servicio Nacional del Consumidor (SERNAC), el principio de autenticidad prescribe que la publicidad sea «fácilmente identificable como tal» (SERNAC, 2022), y la Ley 19.496 sanciona la publicidad que induce a error (art. 28).
4. **Dónde.** Un aviso como máximo por página, solo en la portada, el calendario y los beneficios, y las preguntas frecuentes. Nunca en la ficha de carrera, el comparador, el simulador ni la meta: ahí la persona compara o decide.
5. **Nada más se compra.** El anunciante no obtiene posición, mención ni trato distinto, y no revisa contenido del sitio. El sitio sí revisa cada aviso, solo para verificar estas reglas. Se guarda el registro de quién compró cada aviso, porque, ante publicidad falsa o engañosa, la Ley 19.496 permite al tribunal exigir al medio la identificación del anunciante en 48 horas (art. 34).

### 4.3 Licencias de lo que usa el proyecto

**Tabla 4.3.** Licencias de los componentes (revisadas en cada paquete el 6 de noviembre de 2026).

| Componente | Licencia | Consecuencia |
|---|---|---|
| Next.js, React, Tailwind CSS, OpenNext para Cloudflare y ESLint | MIT | Permiten uso en un producto cerrado y comercial, con aviso de autoría |
| TypeScript | Apache-2.0 | Compatible; conserva avisos |
| Wrangler | MIT o Apache-2.0 | Compatible |
| Tipografías Atkinson Hyperlegible | Licencia de fuentes abierta SIL (OFL) | Se pueden alojar en el proyecto |
| Supabase (PostgreSQL) | Servicio contratado, no código incorporado | Se rige por los términos de servicio del proveedor; la licencia del cliente se verifica al incorporarlo |
| Cloudflare (alojamiento) | Plan gratuito con límites diarios (Cloudflare, s. f.); sus términos de uso comercial se revisan antes de atender público real | El cobro de los servicios iría por contrato y factura, no por tarjeta en el sitio; antes de atender público real se evalúa el plan de pago |
| Datos oficiales (Mineduc, SIES, DEMRE, Beneficios Estudiantiles) | Sin licencia de reutilización explícita en la mayoría; según los términos de uso del sitio del Consejo Nacional de Educación, revisados por el equipo, su base no puede usarse con fines comerciales y por eso no se usa | Riesgo declarado para los informes pagados: se mitiga citando siempre la fuente, sin alterar los valores, y consultando al organismo antes de vender un análisis hecho con sus datos. Las bases abiertas del DEMRE exigen citar la fuente y prohíben cualquier intento de identificar a postulantes (DEMRE, s. f.-a) |

### 4.4 Propiedad intelectual en Chile

**Tabla 4.4.** Instrumentos de propiedad intelectual.

| Instrumento | Qué protegería | Pasos y estado |
|---|---|---|
| Derecho de autor (Ley 17.336) | Código fuente y objeto, documentación preparatoria, descripción técnica y manuales (art. 3 n.° 16); bases de datos y diseños originales; los informes que la sociedad elabore. Nace con la creación | Inscripción opcional como prueba, en el Departamento de Derechos Intelectuales (DDI) del Servicio Nacional del Patrimonio Cultural. El DDI pide copia del código fuente, manual de funcionamiento y copia de las licencias de terceros. **No inscrito.** El costo y la posibilidad de mantener reservado el código se consultan al DDI antes de inscribir |
| Marca (Ley 19.039) | Nombre y logo, ante el Instituto Nacional de Propiedad Industrial (INAPI) | Solicitud en línea, búsqueda previa de marcas similares, examen formal, publicación en el Diario Oficial y pago de derechos; vigencia de 10 años renovables (ChileAtiende, s. f.). **No presentada.** El nombre actual es descriptivo y podría rechazarse; se consulta antes de solicitar |
| Patente | Un programa computacional por sí solo, en general, no se protege por patente | No se persigue |
| Secreto empresarial y contratos | Código privado y reglas de procesamiento de datos | Acuerdos de confidencialidad y contrato de prestación de servicios con cada cliente; sin firmar |

**Titularidad frente a la institución.** El Departamento de Derechos Intelectuales (s. f.) informa que, según el art. 8 de la Ley 17.336, el empleador es titular del software producido por sus dependientes salvo pacto escrito, y que en las obras por encargo los derechos se entienden cedidos a quien encargó la obra salvo pacto distinto. Un trabajo de título no es necesariamente ninguno de los dos casos. Por eso la cesión a la sociedad se hará después de revisar el reglamento de titulación de AIEP. Esta lectura no reemplaza una asesoría legal.

### 4.5 Madurez tecnológica (TRL)

**Tabla 4.5.** Escala de madurez.

| TRL | Estado | Situación del proyecto | Condición |
|---|---|---|---|
| 1 a 3: idea, concepto y prueba de concepto | Logrado | Diagnóstico con datos oficiales; programas que procesaron 11.364 variantes de carrera de pregrado, 7.299 con indicadores del SIES y 2.086 con datos del DEMRE | Hecho |
| 4: prototipo validado en entorno controlado | Parcial hoy | Sitio desplegado con vista de carrera, explorador, comparación, simulación de puntaje y calendario de beneficios | Meta al 4 de diciembre de 2026: tareas recorridas y tiempos medidos con 10 personas de 18 años o más |
| 5: validación en entorno relevante | No comprometido | Requeriría uso espontáneo por personas que no fueron invitadas por el equipo | Posible techo, no prometido |
| 6 y 7: operación piloto en entorno real | Proyección 2027 | Sitio abierto al público con medición de uso y un primer informe de muestra publicado | Sin fecha comprometida |
| 8 y 9: sistema operando y adoptado | Proyección | Servicio en operación, con organizaciones que encargan análisis | Proyección |

La meta de TRL 4 es menor que el rango de 5 a 7 que sugiere la guía, porque el prototipo es parcial y la medición es con 10 personas invitadas, no con uso real.

### 4.6 Relación con el área de especialidad

**Tabla 4.6.** Competencias de la carrera aplicadas (AIEP, s. f.).

| Competencia | Cómo se aplica en el proyecto |
|---|---|
| Ciclo del software | Programación, pruebas automáticas y criterios de seguridad de la información |
| Análisis y diseño | Modelo de datos que une fuentes oficiales con nombres y períodos distintos; diseño centrado en el usuario con contraste verificado y pantallas desde 360 px |
| Gestión de proyectos | Planificación por fases, indicadores y presupuesto (puntos 3, 9 y 10) |
| Trabajo con el cliente | Entrevistas a personas que egresaron y a organizaciones que usan datos; elaboración de análisis a pedido |
| Transformación digital | Una búsqueda que hoy exige recorrer varios sitios se resuelve en un solo recorrido |
| Ética y actualización | Datos personales mínimos, trazabilidad de cada cifra y revisión periódica de reglas y plazos |

La accesibilidad con lector de pantalla, el rendimiento en conexión lenta y el puntaje Lighthouse aún no se miden.

### 4.7 Soluciones y emprendimientos existentes

Se revisaron los sitios oficiales de cada referente. Solo se atribuye lo que aparece en la página consultada; «no se observó» indica ausencia en esa página, no que el referente no lo tenga.

**Tabla 4.7.** Referentes.

| Referente | Qué hace | Modelo | Fortaleza | Vacío observado | Fuente |
|---|---|---|---|---|---|
| Búsqueda por cuenta propia en varios portales | Cada persona junta información de fuentes distintas | Gratuito | Costo cero | Sin un recorrido único; el tiempo que toma no está medido (Punto 2) | Punto 2 |
| Portales del Mineduc: Mi Futuro, Acceso y Beneficios Estudiantiles | Buscadores de carreras, empleabilidad e ingresos, postulación, calendario, simulador y guía de beneficios | Público y gratuito | Datos oficiales y cobertura nacional | Repartido en tres sitios, cada uno con su formato | Ministerio de Educación (s. f.-a, s. f.-b); Subsecretaría de Educación Superior (s. f.) |
| Elige Carrera (Consejo Nacional de Educación, versión beta) | Buscador de alternativas, simulador de puntajes, fechas y documentos de orientación | Sitio institucional; sin cobro indicado | Simulador y buscador en un mismo sitio | No se observó información de beneficios ni una explicación de qué mide cada indicador | Consejo Nacional de Educación (2026) |
| Fundación Por Una Carrera | Orientación vocacional y apoyo para postular a becas | Fundación; invita a donar | Acompañamiento presencial | No se observó un sitio que reúna y compare los datos oficiales de cada carrera | Fundación Por Una Carrera (2026) |
| Servicio de Información de Educación Superior (SIES) | Informes anuales (matrícula, titulación, retención, acceso, duración real) y bases de datos descargables | Público y gratuito | Es la fuente oficial de las estadísticas del sistema | Informes y bases pensados para análisis, no para quien decide qué estudiar | SIES (s. f.) |
| Centros de estudio que publican análisis (Libertad y Desarrollo; Acción Educar) | Libertad y Desarrollo se describe como un centro de estudios e investigación privado dedicado al análisis de los asuntos públicos; Acción Educar, como una fundación sin fines de lucro que contribuye con evidencia y análisis al debate de las políticas educativas | Libertad y Desarrollo declara financiarse principalmente con suscripciones de personas naturales y jurídicas; Acción Educar no declara su financiamiento en la página consultada | Publicación continua, que los vuelve una fuente consultada | Se dirigen al debate de política pública, no a la persona que debe decidir sus estudios | Libertad y Desarrollo (s. f.); Acción Educar (s. f.) |

**Conclusión: el vacío que se observa.** Existen portales públicos gratuitos con los datos y organizaciones que acompañan en persona. Lo que no se observó es un recorrido único que reúna los datos oficiales de una carrera, explique qué mide cada cifra y permita compararla con otra, junto con el método publicado. Es una observación sobre sitios públicos, no un estudio exhaustivo del mercado. El proyecto complementa a los portales oficiales, que son su fuente, y no los reemplaza.

---

## 5. Propuesta de valor aplicable al producto y/o servicio

La segmentación sigue los factores de Kotler y Keller (2016) y el perfil, el mapa de valor y el encaje siguen el lienzo de Osterwalder et al. (2014). Hay dos perfiles porque quien se beneficia no es quien paga: la **persona que egresa** (usuaria, gratis) y la **organización que encarga un análisis** (cliente). Las frustraciones se toman del diagnóstico solo cuando tienen un dato verificado detrás; las demás son hipótesis que el levantamiento del Punto 2 permite confirmar, y por eso se ordenan por solidez de la evidencia y no por número de menciones.

### 5.1 Perfil de la persona que egresa

**Tabla 5.1.** Perfil de la persona que egresa.

| Factor | Descripción | Fuente o estado |
|---|---|---|
| Demográfico | Personas que egresaron de 4.º medio en los últimos cinco años y no han ingresado a la educación superior, y quienes cursan 4.º medio. Al año siguiente del egreso, 49,6 % no ha ingresado; a los cinco años, 26,9 % | SIES (2026a) |
| Geográfico | Todo Chile; los datos oficiales, la admisión y los beneficios son nacionales | Decisión de alcance |
| Psicográfico | Hipótesis: incertidumbre al elegir, temor a equivocarse, desconfianza hacia la información con interés comercial | Hipótesis a validar con la encuesta y las entrevistas |
| Conductual | Hipótesis: busca en varios sitios y en redes sociales, tarda en reunir los datos y no siempre los completa | Hipótesis a validar con la medición de tiempo |
| Tecnográfico | Supuesto de diseño: acceso mayoritario desde teléfono, a veces con datos limitados; por eso el sitio es liviano y funciona sin descarga | Supuesto, no medido |

### 5.2 Perfil del cliente: organización que encarga un análisis

**Tabla 5.2.** Perfil de la organización.

| Factor | Descripción | Fuente o estado |
|---|---|---|
| Tipo de organización | Hipótesis: instituciones de educación superior, establecimientos y sus sostenedores, municipios, medios de comunicación y otras organizaciones que usan datos de educación superior | Hipótesis comercial; nadie ha encargado un análisis |
| Geográfico | Todo Chile | Decisión de alcance |
| Psicográfico | Hipótesis: necesitan respaldar decisiones con datos y valoran que el análisis no venga de una parte interesada | Hipótesis a confirmar con la entrevista al actor 6 |
| Conductual | Hipótesis: hoy arman sus análisis con equipos propios, a partir de archivos oficiales que cruzan a mano | Hipótesis a confirmar con la entrevista al actor 6 |
| Cómo llega | Por iniciativa propia, después de conocer lo que la agencia publica; el equipo no la busca | Decisión de estrategia (Punto 8) |

### 5.3 Trabajos del cliente

**Tabla 5.3.** Trabajos del cliente.

| Trabajo | Persona que egresa | Organización |
|---|---|---|
| Funcional | Reunir y comparar los datos de las carreras que le interesan; saber qué pasos y plazos le tocan | Obtener un análisis de datos de educación superior para una decisión propia |
| Social | Mostrar a su familia que decide con información | Mostrar a su comunidad o a su directorio que decide con datos verificables |
| Emocional | Sentir que no se equivoca por falta de información | Confiar en que el análisis es independiente |

### 5.4 Frustraciones (ordenadas por solidez de la evidencia)

**Tabla 5.4.** Frustraciones.

| N.° | Frustración | Respaldo | Estado |
|---|---|---|---|
| F1 | «Los datos de una carrera están en sitios distintos y no sé por dónde partir» | Observación de portales (4.7) | Verificada |
| F2 | «Me toma mucho tiempo y no sé si encontré todo» | Sin medición oficial | Hipótesis: medición de tiempo (2.3.2) |
| F3 | «No sé qué significa cada cifra ni si puedo compararlas» | Sin dato | Hipótesis: medición de tiempo y entrevistas |
| F4 | «No sé qué pasos ni qué plazos me tocan» | Los plazos cambian cada año (Ministerio de Educación, 2026a) | Hipótesis: entrevistas |
| F5 | «Desde que egresé, busco por mi cuenta» | Sin dato | Hipótesis: encuesta y entrevistas |
| C1 | (Organización) «Los datos oficiales vienen en archivos separados y cruzarlos toma tiempo» | La separación está verificada (Punto 2) | El costo para la organización es hipótesis |
| C2 | (Organización) «Necesito un análisis que no venga de una parte interesada» | Sin dato | Hipótesis: entrevista al actor 6 |

### 5.5 Alegrías

**Tabla 5.5.** Alegrías.

| N.° | Alegría esperada | Perfil |
|---|---|---|
| A1 | Ver en un solo lugar los datos de una carrera, con la fuente a la vista | Persona |
| A2 | Entender qué mide cada cifra y con qué compararla | Persona |
| A3 | Saber cuál es el próximo paso hacia su meta y qué alternativas tiene | Persona |
| A4 | Usar el servicio sin entregar datos personales | Persona |
| A5 | Recibir un análisis con el método y las fuentes a la vista | Organización |

### 5.6 Mapa de valor

**Tabla 5.6.** Productos y servicios, y su estado.

| Producto o servicio | Estado al 26 de noviembre de 2026 | Plan |
|---|---|---|
| Vista de carrera con datos oficiales y su fuente | Existe con 11.364 variantes de carrera cargadas, verificadas por muestra | Medir con personas |
| Comparaciones dentro de la vista de carrera: empleabilidad de la carrera frente a la de la misma carrera en otras instituciones y a la de su área (elaboración propia con datos del SIES, porque el SIES no publica un promedio por área); duración formal frente a duración real; vacantes frente a postulaciones, donde las bases del DEMRE lo permiten; arancel | Construida | Medir con personas |
| Comparación de hasta 3 carreras | Construida | Medir con personas |
| Simulación del puntaje ponderado | Cálculo disponible | Medir con personas |
| Meta con hasta dos preferencias (tres carreras en total) y alternativas cercanas | Construida | Medir con personas |
| Calendario de admisión y de beneficios, y preguntas frecuentes | Calendarios de beneficios y de admisión construidos con los calendarios oficiales 2027 | Completar y mantener actualizado |
| Página «Quiénes somos», con el equipo, el motivo y el método | Construida | Medir con personas |
| Cuenta con correo; cuestionario de intereses vocacionales; simulación de beneficios; asistente conversacional; noticias de educación superior | Diseñados | Proyección 2027 |
| Tablero público de transparencia de datos e informes de datos a pedido | Diseñados; existe un tablero interno de análisis | Proyección 2027: primer informe de muestra |

**Tabla 5.7.** Aliviadores de frustración.

| Aliviador | Alivia | Producto |
|---|---|---|
| Un solo lugar con los datos oficiales de cada carrera, cada uno con fuente y fecha | F1, F2 | Vista de carrera |
| Junto a cada cifra, qué mide, de qué año es y con qué se compara | F3 | Vista de carrera y comparación |
| Pasos y plazos en lenguaje claro, según la meta fijada | F4, F5 | Meta y calendario |
| Análisis con método y fuentes publicados | C1, C2 | Informes de datos |

**Tabla 5.8.** Creadores de alegría.

| Creador | Crea | Producto |
|---|---|---|
| Comparar la empleabilidad de una carrera con la de la misma carrera en otras instituciones y con la de su área, y su duración formal con la real | A1, A2 | Vista de carrera |
| «Quieres esto; estas son las opciones más cercanas y disponibles» | A3 | Meta y alternativas |
| Todo lo público funciona sin cuenta | A4 | Sitio |
| Tablero público que muestra cómo se procesa cada dato | A5 | Tablero de transparencia |

### 5.7 Encaje

**Tabla 5.9.** Encaje.

| Frustración o alegría | Aliviador o creador | Evidencia del encaje |
|---|---|---|
| F1 y F2: dispersión y tiempo | Vista única con fuentes | Observación de portales (4.7); se mide con el indicador I-OE2 |
| F3 y A2: entender las cifras | Explicación junto a cada cifra | Informar sobre costos e ingresos esperados cambió la elección de programa en Chile (Hastings et al., 2015); se mide con el indicador I-OE1b |
| F4, F5 y A3: pasos y alternativas | Meta, calendario y alternativas | La información personalizada con ayuda en el trámite tuvo efecto, y el material general no (Bettinger et al., 2012); se mide con el indicador I-OE3a |
| C1, C2 y A5: análisis independiente | Informes con método publicado | Sin evidencia: hipótesis comercial |

No se atienden todas las frustraciones: el proyecto no diagnostica ni predice, no reemplaza la orientación profesional y deriva a servicios públicos cuando corresponde.

### 5.8 Declaración de propuesta de valor

La redacción adapta la plantilla de Moore (1991).

**Para las personas** que egresan de 4.º medio y deben decidir si estudian, qué y dónde, con datos repartidos en varios sitios, la agencia ofrece un servicio gratuito que reúne la información oficial de cada carrera con su fuente, explica qué mide cada cifra y muestra el camino y las alternativas hacia su meta. A diferencia de recorrer varios portales por separado, lo resuelve en un solo recorrido y sin pedir datos personales.

**Para las organizaciones** que necesitan decidir con datos de educación superior, la agencia elabora informes y asesorías a pedido, con el método y las fuentes a la vista. A diferencia de un análisis hecho por una parte interesada, quien lo encarga no compra el resultado ni un lugar en el sitio público.

Promesa del proyecto: acortar el camino hacia información verificable. No se promete que las personas ingresen a la educación superior, ni mejorar su salud mental, ni predecir su trayectoria.

---

## 6. Lienzo de propuesta de valor

### 6.1 Elección del lienzo

Se usa el **lienzo de modelo de negocio** (Osterwalder y Pigneur, 2010) y no el Lean Canvas (Maurya, 2012), por dos razones que salen del problema: hay dos segmentos distintos, la persona que usa gratis y la organización que paga, y el lienzo de modelo de negocio permite describir cada uno con su propuesta; y sus bloques de canales y de relación con los clientes son donde se juega la estrategia de no salir a vender. No se usa un lienzo social porque la organización será una sociedad con fines de lucro; el compromiso con el uso gratuito y con la independencia se asegura por otra vía (8.2).

### 6.2 Lienzo de modelo de negocio

**Tabla 6.1.** Lienzo de modelo de negocio.

| Bloque | Contenido |
|---|---|
| Segmentos | Usuarias: personas que egresan de 4.º medio y no han ingresado a la educación superior, en todo Chile. Clientes: organizaciones que necesitan análisis de datos de educación superior, y preuniversitarios y servicios afines que no son instituciones de educación superior y quieren llegar a esas personas (hipótesis) |
| Propuesta de valor | Persona: los datos oficiales de cada carrera en un solo recorrido, explicados y comparables, gratis. Organización: análisis independiente, con método y fuentes a la vista |
| Canales | El sitio público, el tablero de transparencia de datos y las publicaciones periódicas de la agencia. No hay venta directa |
| Relación con los clientes | Persona: autoservicio, sin cuenta obligatoria. Organización: llega por iniciativa propia; se le responde con una propuesta de análisis a medida. Anunciante: contrata un espacio con la tarifa y las reglas publicadas, y recibe el conteo agregado de veces que se mostró su aviso |
| Fuentes de ingresos | Informes de datos y asesorías, cobrados por contrato y factura ($632.000 + impuesto al valor agregado [IVA] por informe; $26.333 + IVA por hora en encargos mayores). Espacios publicitarios a $200.000 + IVA al mes (9.1). Nunca se cobra a las personas |
| Recursos clave | Código propio, datos oficiales procesados con su fuente, método documentado, credibilidad (aún por construir) e infraestructura contratada |
| Actividades clave | Actualizar los datos oficiales, mantener el sistema, publicar análisis, elaborar informes a pedido y revisar que cada aviso cumpla sus reglas |
| Socios clave | Mineduc, SIES y DEMRE como fuentes; AIEP San Fernando; una persona profesional de psicología o psicopedagogía que revise el contenido de orientación (por conseguir) |
| Estructura de costos | Desarrollo y análisis (horas del equipo), operación (alojamiento, base de datos y dominio) y servicios profesionales (revisión de contenido, asesoría legal y contable, constitución de la sociedad). Detalle en el Punto 10 |

### 6.3 Coherencia con los puntos anteriores

Los segmentos, las frustraciones y la declaración de valor son los del Punto 5. Son supuestos por validar que alguna organización encargue un análisis, que algún preuniversitario compre un espacio, cuánto pagaría cada uno y que las publicaciones basten como canal; se exploran con la entrevista al actor 6 y con el primer informe de muestra.

---

## 7. Marco estratégico del proyecto

El marco estratégico parte del problema (Punto 2) y de la propuesta de valor (Punto 5), y se alinea con la misión, la visión y los valores de AIEP, la institución en la que se desarrolla el proyecto.

### 7.1 Misión y visión

**Tabla 7.1.** Misión y visión.

| Elemento | Redacción |
|---|---|
| Misión (presente) | Ayudamos a las personas que egresan de 4.º medio a reunir, entender y comparar la información oficial que necesitan para decidir sus estudios, y las acompañamos hasta su meta, con datos verificables y de forma gratuita e independiente, para que cada persona que egresa pueda decidir sus estudios con información oficial clara |
| Visión (3 a 5 años) | Al 2031, ser una fuente independiente y consultada de información sobre educación superior en Chile, con el método y los resultados publicados |

La misión responde a la fórmula de qué hacemos (ayudar a reunir, entender y comparar información oficial, y acompañar hasta la meta), para quién (personas que egresan de 4.º medio), cómo (gratis, con datos citados a su fuente y con independencia) y para qué (que cada persona que egresa pueda decidir sus estudios con información oficial clara). El nombre del proyecto recoge ambas partes: el enlace con la información y el seguimiento de los pasos hasta la meta. La visión no fija una cifra de uso porque hoy no hay línea base; se ajustará con las primeras mediciones.

### 7.2 Alineación con la misión y los valores de AIEP

El Plan Estratégico Institucional 2025-2029 de AIEP declara como misión formar a lo largo de la vida para el trabajo y el emprendimiento, con educación de calidad, potenciada por la tecnología y la innovación, «para dar oportunidades sin distinciones ni fronteras y contribuir al desarrollo sostenible de cada territorio» (AIEP, 2025a). Sus valores son calidad, compromiso, respeto, transparencia y colaboración.

**Tabla 7.2.** Alineación con la misión y los valores de AIEP.

| Elemento de AIEP | Cómo lo expresa el proyecto |
|---|---|
| Oportunidades sin distinciones ni fronteras | Información gratuita y abierta a cualquier persona que egresa, en todo el país |
| Trabajo y emprendimiento | El proyecto se proyecta como una empresa creada por tres titulados de la carrera |
| Desarrollo sostenible de cada territorio | Datos nacionales con detalle por región, institución y sede; metas ligadas a los ODS 4 y 8 |
| Tecnología e innovación | Plataforma web con datos oficiales, desarrollada con las competencias del perfil de egreso |
| Calidad | Cada dato con fuente, enlace y fecha; cálculos probados contra la fuente oficial; accesibilidad WCAG 2.2 AA |
| Compromiso | El proyecto promete solo lo que puede medir |
| Respeto | Sin etiquetas ni rankings de personas; se piden los datos personales mínimos |
| Transparencia | El método con que se procesa cada dato es público; las cifras muestran su fuente y sus límites |
| Colaboración | Trabajo complementario con los portales oficiales, que son la fuente |

### 7.3 Valores del proyecto

**Tabla 7.3.** Valores y cómo se ven en la práctica.

| Valor | Definición para el proyecto | Cómo se ve en la práctica |
|---|---|---|
| Independencia | Nadie compra un resultado ni un lugar | El sitio no ordena ni destaca instituciones por ser clientes; las instituciones de educación superior no pueden avisar, y los avisos permitidos van rotulados y fuera de las pantallas donde se compara; el método de cada análisis es público |
| Gratuidad para la persona | Informarse no cuesta | Todo lo que usa la persona es gratis y funciona sin cuenta |
| Rigor y trazabilidad | Un dato que no se puede verificar en una fuente oficial no se publica | Todo dato lleva fuente, enlace y fecha; las cifras sin origen se retiran |
| Privacidad mínima | Solo se pide lo necesario | La cuenta, cuando exista, guarda solo correo, situación de estudio, institución, meta y preferencias y consentimiento; sin edad, RUT ni datos sensibles |
| Cuidado con límites claros | El servicio informa y deriva; no diagnostica, no trata ni predice | Derivación a la Línea de Prevención del Suicidio *4141 y a Salud Responde 600 360 7777 ante una señal de crisis |
| Accesibilidad | Nadie queda fuera por el dispositivo, la conexión o la forma de leer | Diseño desde 360 px, tipografía legible y contraste verificado |

---

## 8. Estrategias de negocio

### 8.1 Estrategia competitiva

**Tabla 8.1.** Estrategia competitiva.

| Campo | Respuesta |
|---|---|
| Estrategia genérica (Porter, 1985) | Diferenciación: un servicio que otros no combinan, para todo el país |
| Segmento | Personas que egresan de 4.º medio y no han ingresado a la educación superior; y, como clientes, las organizaciones que necesiten análisis de esos datos y los servicios educativos que no son instituciones de educación superior y quieran avisar |
| Vacío que aprovecha | Los datos oficiales están repartidos en varios sitios y no se observó un recorrido único que los reúna, explique qué mide cada cifra y permita comparar (4.7). La información personalizada tiene respaldo experimental, mientras el material general no (Bettinger et al., 2012) |
| Diferenciación | Independencia (nadie compra un resultado), trazabilidad de cada dato y método publicado |
| Costos | No compite por precio: el uso de las personas es gratuito y la infraestructura usa planes gratuitos hasta el prototipo y planes de pago desde la puesta en marcha |

**Cómo llegan los clientes.** El equipo no sale a vender. La estrategia es darse a conocer con lo que publica: el sitio, el tablero de transparencia de datos y análisis periódicos con el método a la vista. Una organización que necesite un análisis llega por iniciativa propia. Es el modo en que operan los centros de estudio que son consultados porque publican de forma continua (4.7). Dos razones salen del problema: ofrecer un análisis antes de haber medido su utilidad sería prometer de más, y buscar clientes entre las instituciones cuyos datos se muestran pondría en duda la independencia. Con los avisos se sigue la misma lógica: el sitio publica el espacio disponible, su tarifa y sus reglas, y el anunciante interesado escribe. El costo de esta decisión es que los ingresos pueden tardar; por eso el prototipo y la puesta en marcha no dependen de ventas (Punto 10).

### 8.2 Operaciones societarias: sociedad por acciones

#### 8.2.1 Formas jurídicas evaluadas

**Tabla 8.2.** Formas jurídicas evaluadas.

| Forma | Fines de lucro | Ventajas | Desventajas | Evaluación |
|---|---|---|---|---|
| Sin entidad (proyecto académico) | No aplica | Sin costo ni trámite | No puede facturar ni firmar contratos como organización | Adecuada solo hasta el título |
| Fundación | No | Su fin queda fijado en los estatutos; puede recibir donaciones | Requiere patrimonio inicial y directorio; su trámite es más lento; no permite que quienes la crean sean dueños de lo que construyen | Descartada |
| Empresa individual de responsabilidad limitada | Sí | Trámite simple | Admite un solo titular, y el equipo es de tres | Descartada |
| Sociedad de responsabilidad limitada | Sí | Conocida y simple | Ceder la participación sin autorización de todos los socios es nula, y sumar un socio exige modificar el contrato por escritura pública (Código de Comercio, arts. 350 y 404) | Descartada |
| **Sociedad por acciones (SpA)** | **Sí** | La crean una o más personas y sus estatutos se pactan con libertad (Código de Comercio, art. 424); cada accionista responde solo hasta el monto de su aporte (art. 429); admite acciones ordinarias y preferidas (art. 436), lo que permite repartir la propiedad según el aporte de cada integrante y sumar socios sin rehacer la sociedad; se constituye en línea y sin costo de inscripción | Su objeto y sus reglas pueden cambiar por acuerdo de los accionistas: no asegura por sí sola el uso gratuito ni la independencia | **Elegida** |

#### 8.2.2 Decisión y justificación

Se elige constituir una **sociedad por acciones (SpA)**. Hay tres razones. (1) **Poder operar:** para elaborar un informe a pedido hay que poder firmar un contrato y emitir una factura, y la SpA lo permite desde que se constituye e inicia actividades. (2) **Tres personas con aportes distintos:** la SpA permite repartir la propiedad en acciones según lo que cada integrante aporta, y sumar o retirar socios sin rehacer la sociedad. (3) **Independencia:** la agencia no depende de donaciones ni de fondos que condicionen lo que publica; se sostiene con su propio trabajo.

**El riesgo de esta forma y cómo se controla.** Una sociedad con fines de lucro no fija su fin para siempre. Por eso los estatutos y el pacto de accionistas incluirán tres cláusulas, cuyo cambio exigirá el acuerdo de todos los accionistas: (a) el uso del sitio es gratuito para las personas; (b) el sitio no ordena, destaca ni recomienda instituciones por ser clientes, y solo admite avisos de servicios educativos que no son instituciones de educación superior, con las reglas de 4.2; (c) no se venden datos personales. En Chile no hay una ley vigente que permita a una sociedad con fines de lucro fijar un propósito social: el proyecto que regula las empresas de beneficio e interés colectivo sigue en primer trámite desde 2017 (Senado de la República, s. f.). Por eso el compromiso se asegura en los estatutos, que la ley permite pactar con libertad. La redacción requiere la validación de un abogado.

**Cómo se constituye.** La sociedad por acciones está regulada en los artículos 424 a 446 del Código de Comercio. La ley no le fija un capital mínimo: exige que el capital esté precisado en el estatuto y dividido en acciones, y da cinco años para pagarlo si el estatuto no dice otra cosa (art. 434). El estatuto debe indicar el nombre terminado en «SpA», el objeto, el capital y la forma de administración (art. 425). Se constituye con un formulario en el Registro de Empresas y Sociedades (Ley 20.659, 2013, arts. 4 y 13), que firman los accionistas con firma electrónica avanzada o ante notario (art. 9); al quedar incorporado, el Servicio de Impuestos Internos (SII) asigna el RUT y en el mismo formulario se puede pedir el inicio de actividades. Constituir es gratuito; la firma ante notario tiene un costo (ChileAtiende, 2026). Una sociedad nueva de este tamaño puede acogerse al régimen para empresas de menor tamaño del artículo 14 D de la Ley sobre Impuesto a la Renta, cuya tasa es de 12,5 % para los ejercicios 2026 y 2027, sujeta a las condiciones de la ley (SII, 2025). El equipo no ha iniciado ningún trámite. La redacción de los estatutos y el régimen tributario se confirman con un abogado y un contador antes de constituir.

**Socios y participación: propuesta por acordar.** Los socios son los tres integrantes del equipo. La participación no se fija por intuición sino con un criterio medible:

- **La mitad de las acciones, en partes iguales.** Reconoce que los tres asumen el mismo riesgo y el mismo compromiso hacia adelante.
- **La otra mitad, en proporción al aporte medido de cada uno** hasta el día de la constitución: horas de trabajo registradas, valorizadas al costo hora del Punto 9, más el dinero aportado. Fórmula: participación por aporte de cada socio = (aporte del socio ÷ suma de los aportes) × 50 %.
- **Permanencia:** cada socio consolida sus acciones de forma gradual mientras siga trabajando en la sociedad, y el estatuto dice qué ocurre con las acciones de quien se retira. La ley da dos herramientas para eso: acciones suscritas que se pagan en un plazo de hasta cinco años y que no dan derechos mientras no se paguen (Código de Comercio, art. 434), y la posibilidad de que el estatuto exija la venta de las acciones bajo circunstancias que él mismo define (art. 435).

Los porcentajes finales no se escriben en este documento porque dependen del registro de horas a la fecha de constitución. El criterio, el pacto y el reparto requieren el acuerdo de los tres integrantes y la validación de un abogado.

**Etapas.**

**Tabla 8.3.** Forma jurídica por etapa.

| Etapa | Forma | Por qué |
|---|---|---|
| Hasta el 19 de diciembre de 2026 | Sin entidad nueva | Es un prototipo sin ingresos |
| 2027: puesta en marcha | Constitución de la SpA e inicio de actividades; sitio abierto al público y primer informe de muestra | Se constituye cuando haya algo que facturar o un fondo al que postular |
| Operación | SpA, con ingresos por informes y asesorías | Permite facturar y firmar contratos |

#### 8.2.3 Alianzas

**Tabla 8.4.** Alianzas.

| Tipo | Con quién | Para qué | Estado |
|---|---|---|---|
| Contrato de prestación de servicios | Organizaciones que encarguen un informe o una asesoría | Elaborar el análisis | Sin clientes; precio de referencia en el Punto 9 |
| Contrato de publicidad | Preuniversitarios y servicios afines que no son instituciones de educación superior | Publicar un aviso con las reglas de 4.2 | Sin anunciantes; tarifa de referencia en el Punto 9 |
| Convenio con AIEP | AIEP San Fernando | Respaldo académico y revisión del reglamento de titulación | En conversación con el docente tutor |
| Contrato de honorarios | Profesional de psicología o psicopedagogía | Revisar los contenidos de orientación antes de publicarlos | Por contratar |
| Proveedores tecnológicos | Cloudflare (alojamiento) y Supabase (base de datos) | Infraestructura | Planes gratuitos |
| Fuentes de datos | Mineduc, SIES y DEMRE | Uso de sus datos abiertos según sus condiciones | Sin convenio; se citan como fuente |

Si quien encarga un informe es un organismo público, la compra se realiza mediante Mercado Público (Ley 19.886, 2003). Desde el 12 de diciembre de 2024 la Compra Ágil sube de 30 a 100 unidades tributarias mensuales (UTM), y el proveedor debe estar inscrito en el Registro de Proveedores con estado activo (ChileCompra, 2024). Las organizaciones privadas contratan directamente.

### 8.3 Cadena de valor del proyecto

Adaptación de Porter (1985) a un servicio digital. La columna de estado distingue lo que existe hoy de lo planificado.

**Tabla 8.5.** Actividades primarias.

| Actividad | Qué hace el proyecto | Quién | Estado | Ventaja |
|---|---|---|---|---|
| Captura de datos | Descarga y limpieza de archivos oficiales: oferta, aranceles y vacantes (SIES, 2026b), empleabilidad y duración real (SIES, 2025), ponderaciones y postulaciones (DEMRE), con cada dato guardado con fuente, enlace y fecha | Cristóbal | 11.364 variantes de carrera procesadas | Sí: trazabilidad de cada dato |
| Operaciones | Vista de carrera, comparación, simulación de puntaje, meta con alternativas y calendario | Rafael (arquitectura y privacidad), Alejandro (interfaz) | Vista, comparación, simulación, meta con alternativas y calendarios construidos | Sí: un solo recorrido, sin datos personales |
| Entrega del servicio | Aplicación web instalable, sin descarga obligatoria, en Cloudflare | Equipo | Sitio desplegado | No |
| Difusión | Publicación del método, del tablero de transparencia y de análisis periódicos; sin venta directa | Rafael, Cristóbal | Planificado | Sí: independencia |
| Servicio a clientes | Informes de datos y asesorías a pedido | Equipo | Planificado; sin clientes | Por demostrar |

**Tabla 8.6.** Actividades de apoyo.

| Actividad | Qué hace el proyecto | Quién |
|---|---|---|
| Infraestructura de la organización | Revisión de cada cambio con pauta escrita y confirmación de la jefatura; constitución de la sociedad a futuro | Rafael |
| Gestión de recursos humanos | Reparto de tareas con fechas y registro de horas por integrante | Rafael |
| Desarrollo de tecnología | Pruebas automáticas, verificación de contraste y uso declarado de herramientas de IA | Rafael, Alejandro, Cristóbal |
| Abastecimiento | Alojamiento, base de datos y dominio; hoy sin desembolso directo por planes gratuitos | Rafael |

La ventaja descansa en la captura de datos con trazabilidad y en la independencia. Son ventajas por diseño y no por resultado: ninguna se ha medido con usuarios ni con clientes.

### 8.4 Perfil de inversores y fuentes de financiamiento

Los datos de instrumentos públicos se consultaron en el sitio oficial de la Corporación de Fomento de la Producción (CORFO) el 6 de noviembre de 2026; las bases cambian en cada convocatoria y se releen antes de postular. **El orden de las fuentes es: (1) recursos propios de los socios, (2) ingresos por informes, asesorías y espacios publicitarios, (3) fondos públicos de emprendimiento.** No se consideran donaciones.

**Tabla 8.7.** Financista por etapa.

| Etapa | Financista elegido | Coherencia con la forma jurídica |
|---|---|---|
| Prototipo (hasta el 19 de diciembre de 2026) | Recursos propios y planes gratuitos | No requiere entidad |
| Puesta en marcha (2027) | Recursos propios (horas del equipo) y, si se obtiene, un fondo público de emprendimiento | Requiere la SpA para postular como persona jurídica |
| Operación | Ingresos por informes, asesorías y espacios publicitarios | Requiere la SpA para facturar |

#### Ficha 1. Recursos propios de los socios

| Campo | Contenido |
|---|---|
| Tipo | Aporte de los socios, en horas de trabajo y en dinero |
| Qué financia | El prototipo y la puesta en marcha: 98 % del costo son horas del equipo (Punto 10) |
| Qué espera a cambio | Participación en la sociedad según el criterio del apartado 8.2.2 |
| Por qué calza | No condiciona lo que se publica |
| Requisito clave | Registro de horas por integrante desde ahora |

#### Ficha 2. Organizaciones que encargan informes o asesorías (cliente)

| Campo | Contenido |
|---|---|
| Tipo | Cliente (contrato de prestación de servicios) |
| Qué financiaría | La operación continua: actualización de datos, mantención e infraestructura de pago, de modo que el sitio siga gratuito para las personas |
| Qué espera a cambio | Un análisis con método y fuentes a la vista. No obtiene posición ni mención en el sitio público |
| Por qué calza | Usa el mismo procesamiento de datos que el sitio gratuito |
| Requisito clave | Trayectoria pública y un primer informe de muestra; hoy no hay cliente |

#### Ficha 3. Servicios educativos que compran un espacio publicitario (cliente)

| Campo | Contenido |
|---|---|
| Tipo | Cliente (contrato de publicidad por mes) |
| Qué financiaría | Los costos pecuniarios del sitio ($29.491 al mes) desde el primer espacio vendido, y parte de las horas de operación (9.1.4) |
| Qué espera a cambio | Que su aviso se muestre a quienes preparan su ingreso a la educación superior, y el conteo agregado de veces que se mostró. No obtiene posición, mención ni trato distinto, y no revisa contenido del sitio |
| Por qué calza | Vende preparación, no una carrera ni una institución, así que su interés no choca con los datos que el sitio compara |
| Requisito clave | No ser una institución de educación superior ni pertenecer a una; aceptar las reglas de 4.2; hoy no hay anunciante |

#### Ficha 4. Fondo público no reembolsable: Semilla Inicia (CORFO)

| Campo | Contenido |
|---|---|
| Tipo | Subsidio público no reembolsable |
| Instrumento o actor | Semilla Inicia, CORFO (s. f.), consultada el 6 de noviembre de 2026 |
| Qué financiaría | Hasta el 75 % del costo total del proyecto, con tope de $15.000.000 |
| Qué espera a cambio | Validación técnica y, antes del término, primeras ventas o un contrato firmado; participación en mentoría |
| Por qué calza | Cubre «desde una idea a las primeras ventas» |
| Requisito clave | Persona natural mayor de 18 años residente en Chile, o persona jurídica constituida en Chile con menos de 18 meses de inicio de actividades y sin ventas. La convocatoria 2026 de O'Higgins cerró el 16 de marzo de 2026; se espera, sin garantía, una convocatoria en 2027 |

#### Instrumentos considerados y no incluidos

| Instrumento | Dato verificado | Decisión |
|---|---|---|
| Suscripciones de personas y organizaciones | Es la fuente principal que declara un centro de estudios consultado (Libertad y Desarrollo, s. f.) | No incluido por ahora: supone una trayectoria que la agencia aún no tiene |
| Otros (Sercotec, ANID, inversionistas ángeles, capital de riesgo, créditos) | No se verificaron condiciones vigentes | No incluidos |

## 9. Valorización y factibilidad del proyecto

### 9.1 Valorización en base a costos operativos

La valorización responde dos preguntas: cuánto cuesta mantener funcionando el servicio y cuánto se puede cobrar por lo que se vende. El proyecto tiene dos fuentes de ingresos: **informes de datos a pedido** para organizaciones y **espacios publicitarios** en el sitio, reservados a servicios educativos que no son instituciones de educación superior (4.2). Cada precio se fija con los tres enfoques de Kotler y Keller (2016): el **costo** pone el piso, la **competencia** muestra cuánto paga hoy el mercado por algo comparable, y el **valor para quien compra** pone el techo. Un precio está defendido cuando los tres enfoques lo dejan dentro de un mismo rango.

#### 9.1.1 Supuestos de cálculo

- **Remuneración de referencia.** Se usan tres ofertas de empleo publicadas en Get on Board el 11 de noviembre de 2026 (Get on Board, 2026), una por perfil del equipo, con su sueldo bruto mensual en dólares: *Full-Stack Developer*, semi senior, Santiago (híbrido), US$ 2.500 a 2.700 (referencia para Rafael); *Data Scientist Junior*, Santiago (presencial), US$ 1.400 a 2.300, publicada con nivel semi senior (referencia para Cristóbal); e *Ingeniero/a de Proyecto — Implementación*, junior, Santiago (presencial), US$ 1.100 a 1.600 (referencia para Alejandro). Con el punto medio de cada rango (US$ 2.600, US$ 1.850 y US$ 1.350) el promedio es **US$ 1.933 al mes**, que al supuesto de $950 por dólar equivale a **$1.836.667**. Son sueldos brutos de ofertas, no de contratos.
- **Horas mensuales.** Jornada de 42 horas semanales desde abril de 2026 (Ley 21.561): 42 × 4,33 ≈ 182 horas al mes.
- **Costo hora.** Costo base = $1.836.667 ÷ 182 = $10.092. Con 30 % de costos adicionales (factor 1,30), el costo hora es $10.092 × 1,30 = **$13.120**.
- **Tipo de cambio.** Los servicios en la nube se cobran en dólares. Se usa un supuesto de $950 por dólar, que se reemplaza por el dólar observado del Banco Central del día de entrega.
- **Servicios de infraestructura.** Cloudflare Workers, plan de pago: US$ 5 al mes (Cloudflare, s. f.). Supabase, plan Pro: US$ 25 al mes por organización (Supabase, s. f.). Dominio .cl: $9.990 al año, tarifa de NIC Chile vigente desde el 1 de noviembre de 2023 (NIC Chile, 2023); se confirma al inscribir.
- **Horas por informe.** 24 horas de trabajo por informe a pedido. Es un supuesto del equipo: ningún informe se ha elaborado. Se reemplaza por las horas reales cuando se termine el primer informe de muestra.
- **Horas por espacio publicitario.** 2 horas al mes por espacio vendido: revisar que el aviso cumpla las reglas (4.2), publicarlo y entregar al anunciante el conteo agregado de veces que se mostró. Es un supuesto del equipo.
- **Unidad Tributaria Mensual (UTM).** $72.440 en noviembre de 2026 (Servicio de Impuestos Internos [SII], 2026a). Se usa para comparar con los montos de las compras públicas, que se ordenan por UTM.

**Tabla 9.1.** Costos operativos mensuales (con plan de pago, desde la puesta en marcha).

| Concepto | Tipo | Cálculo | Monto mensual |
|---|---|---|---|
| Cloudflare Workers (plan de pago) | Fijo, pecuniario | US$ 5 × $950 | $4.750 |
| Supabase Pro | Fijo, pecuniario | US$ 25 × $950 | $23.750 |
| Dominio .cl | Fijo, pecuniario | $9.990 × 1,19 ÷ 12 | $991 |
| Actualización de datos y publicación | Fijo, valorizado | 10 h × $13.120 | $131.200 |
| Mantención y mejora del sistema | Fijo, valorizado | 20 h × $13.120 | $262.400 |
| **Costos fijos mensuales** | | | **$423.091** |
| Elaboración de un informe a pedido | Variable por informe | 24 h × $13.120 | $314.880 |
| Gestión de un espacio publicitario | Variable por espacio y mes | 2 h × $13.120 | $26.240 |

Los planes gratuitos de Cloudflare y Supabase alcanzan para el prototipo, pero el plan gratuito de Supabase pausa los proyectos inactivos por siete días y el de Cloudflare tiene límites diarios y restricciones de uso que se verifican antes de atender público real; por eso los costos operativos parten del plan de pago. Los avisos no agregan costo fijo: se sirven desde el mismo sitio, sin herramientas de terceros. No se incluyen aún la contabilidad mensual, que se cotiza al constituir la sociedad, ni la patente municipal, que cuesta al año entre 2,5 y 5 por mil del capital propio, con un mínimo de una unidad tributaria mensual (Decreto Ley 3.063, 1979, art. 24), y cuya tasa fija cada municipalidad.

#### 9.1.2 Precio del informe a pedido

**Enfoque de costo (piso).** Unidad de venta: un informe a pedido. Meta: 2 informes al mes (supuesto de partida; no hay cliente).

- Costo total mensual = $423.091 + 2 × $314.880 = $1.052.851.
- Costo unitario = $1.052.851 ÷ 2 = $526.426 por informe.
- Margen de 20 % (factor 1,20): $526.426 × 1,20 = $631.711, redondeado a **$632.000 por informe**, más el impuesto al valor agregado (IVA) de 19 %, es decir, $752.080. Desde el 1 de enero de 2023 los servicios están gravados con IVA, y según el SII una sociedad por acciones no puede acogerse a la exención de las sociedades de profesionales (SII, 2022).

Este cálculo supone 24 informes al año. El costo unitario depende del volumen, porque los costos fijos se reparten entre los informes vendidos: con 11 informes al año sería $5.077.092 ÷ 11 + $314.880 = $776.434, y con 6, $1.161.062 (elaboración propia). Con el volumen que se supone alcanzable (6 a 11 al año, más abajo), ningún precio razonable cubre por sí solo los costos fijos. Por eso el piso que sí exige cada informe es su **costo variable, $314.880**, y los costos fijos se cubren con las dos fuentes de ingresos juntas (9.1.4). El costo dice cuánto necesita el proyecto, pero no si alguien pagaría eso. Para responderlo se miran las compras reales.

**Enfoque de competencia: lo que paga hoy el Estado.** No se encontró un precio público de un informe de datos educativos ofrecido por un centro de estudios o una consultora chilena. Sí hay un registro oficial de lo que pagan los organismos públicos: las adjudicaciones de Mercado Público, que se leyeron en su registro de datos abiertos el 25 de noviembre de 2026. Se buscaron estudios y análisis de datos adjudicados desde 2024 en licitaciones de menos de 100 UTM (tipo L1), que son las compras públicas más pequeñas que se adjudican por licitación.

**Tabla 9.1a.** Estudios y análisis de datos adjudicados por organismos públicos, licitaciones de menos de 100 UTM, 2024 a 2026 (ChileCompra, 2026a).

| Código | Comprador | Objeto | Monto adjudicado | Adjudicación | Comparabilidad con un informe del proyecto |
|---|---|---|---|---|---|
| 895072-17-L124 | Subsecretaría de Educación Parvularia | Actualización de un estudio de estimación de brecha en educación parvularia | $3.490.000 | 9-sep-2024 | Alta: estudio cuantitativo acotado, con datos oficiales y del área de educación |
| 1422041-7-L125 | Corporación Regional de Turismo de Valparaíso | Análisis y mejora de una base de datos y su metodología | $4.000.000 | 12-nov-2025 | Media: análisis de datos, de otro sector |
| 2833-16-L125 | Municipalidad de Quillota | Diagnóstico institucional y análisis de datos para el proyecto educativo de un colegio | $5.400.005 | 28-oct-2025 | Media: educación, con trabajo en terreno |
| 162-21-L124 | Subsecretaría de Salud Pública | Estudio sobre competencias de equipos de salud | $3.000.000 | 28-may-2024 | Media: estudio acotado, de otro sector |
| 2428-33-L124 | Municipalidad de Quilpué | Aplicación, digitación y análisis de una encuesta de caracterización | $2.000.000 | 22-abr-2024 | Baja: incluye encuestar |
| 564162-114-L126 | Universidad de Santiago | Estudio de mercado y orientación técnico-comercial | $4.000.000 | 21-sep-2026 | Baja: estudio de mercado de otro tema |
| 561704-21-L125 | Corporación Municipal de Desarrollo Social de Antofagasta | Capacitación en análisis de datos pedagógicos | $3.900.000 | 24-jul-2025 | Baja: es una capacitación |
| 1110404-87-L126 | Servicio Local de Educación Pública Chinchorro | Evaluación y orientación vocacional en línea para 522 estudiantes | $2.787.480 | 2-jul-2026 | Baja: es un servicio por estudiante, no un informe |

En los ocho casos de la tabla, el monto va de $2.000.000 a $5.400.005, con una **mediana de $3.695.000 (51 UTM)** (elaboración propia con los montos adjudicados). El registro no indica si los montos incluyen IVA. Para medir el precio de la hora se usaron dos contratos de horas de profesionales senior de tecnologías de la información adjudicados por la Tesorería General de la República: 622-4-LQ24, $184.395.600 por 9.936 horas, y 622-113-LR24, $151.060.310 por 7.765 horas, es decir, **$18.558 y $19.454 por hora** (ChileCompra, 2026b; elaboración propia).

**Lectura.** El precio de $632.000 equivale a **$26.333 por hora** facturada (632.000 ÷ 24). Las mismas 24 horas pagadas al valor de la hora senior de esos contratos costarían entre $445.392 y $466.896. El precio del proyecto queda entre 35 % y 42 % sobre ese valor.

La diferencia se explica porque esos contratos compran miles de horas de dedicación continua, mientras que un informe es un encargo corto que carga con su propia preparación; es una interpretación del equipo, no un dato.

Frente a los estudios de la Tabla 9.1a, el informe cuesta entre 3 y 8,5 veces menos. No es que esté mal calculado: es más pequeño. A $26.333 por hora, el estudio más barato ($2.000.000) equivale a unas 76 horas, y la mediana, a unas 140. Por eso los encargos de mayor alcance se cotizan por hora con el mismo valor: un encargo de 150 horas costaría unos $3.950.000, en el rango de lo que hoy pagan los organismos públicos.

**Enfoque de valor para quien compra (techo).**

- **Compra más simple.** Con IVA, el informe cuesta 10,4 UTM. Queda bajo el tope de 100 UTM de la Compra Ágil ($7.244.000 en noviembre de 2026), el procedimiento más corto que tiene un organismo público para comprar (ChileCompra, 2024). Un estudio por licitación, en cambio, exige bases, publicación y evaluación de ofertas.
- **Respuesta acotada a menor costo.** Quien hoy necesita una respuesta sobre la oferta de educación superior de su territorio la compra dentro de un estudio que cuesta desde $2.000.000. El informe le entrega esa respuesta, con su método y sus fuentes, por cerca de un tercio de ese monto.
- **Sin validar.** Cuánto vale para cada organización se consultará en la entrevista al actor 6 (Anexo 2.B). Hasta entonces, el techo se apoya en las compras públicas, no en una disposición a pagar declarada.

**Decisión de precio.** Se mantiene **$632.000 + IVA por un informe de 24 horas**. Los tres enfoques lo dejan dentro de un mismo rango: está sobre su costo variable ($314.880) y sobre el valor de las mismas horas en los contratos públicos ($445.392 a $466.896), y bajo el estudio más barato que compró un organismo ($2.000.000). Sin avisos, cubre los costos fijos desde 17 informes al año; con menos, depende de los avisos (9.1.4). Los encargos mayores y las asesorías se cotizan a **$26.333 por hora** más IVA. Si las horas reales del informe de muestra difieren de 24, se recalcula con las horas reales.

**Tamaño del mercado de informes.** Las organizaciones que pueden encargar un análisis de datos de educación superior suman **557**: 345 municipalidades (Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE], s. f.), 70 Servicios Locales de Educación Pública creados por la Ley 21.040, de los cuales 36 funcionaban al 1 de enero de 2026 (Ministerio de Educación, 2026b), 16 gobiernos regionales, uno por región (Ley 21.033, 2017), y 126 instituciones de educación superior con matrícula en 2024 (Fiscalía Nacional Económica, 2025). No se encontró un dato oficial de cuántas de ellas compran estudios cada año, por lo que no se estima un mercado disponible. Como mercado alcanzable se supone entre 1 % y 2 % de esas organizaciones, es decir, **6 a 11 informes al año**. Es un supuesto del equipo, sin validar.

#### 9.1.3 Precio del espacio publicitario

**A quién llega el aviso.** Se inscribieron 300.678 personas en la Prueba de Acceso a la Educación Superior (PAES) Regular de 2026, para la Admisión 2027 (cifra preliminar). El 26,1 % ya había egresado, unas 78.477 personas (Ministerio de Educación, 2026c; elaboración propia). Entre las personas de 16 a 29 años, el 99,3 % usa un teléfono inteligente a diario (Subsecretaría de Telecomunicaciones [Subtel], 2025).

**Quién puede avisar.** En 2025 el SII registró **138 empresas** en el rubro «Enseñanza preuniversitaria» (código 854901), con ventas por 1.635.415 unidades de fomento (UF). Las 10 empresas medianas y grandes concentran cerca del 81 % de esas ventas (SII, 2026b; elaboración propia; cifras preliminares). El código lo declara cada empresa, así que puede haber preuniversitarios registrados en otros rubros. Se excluyen los preuniversitarios que pertenecen a una institución de educación superior: por ejemplo, el servicio de preuniversitario que la Municipalidad de Vitacura adjudicó en 2025 a la Pontificia Universidad Católica de Chile (código 2667-149-LP24; ChileCompra, 2026c).

**Enfoque de costo (piso).** Gestionar un espacio cuesta $26.240 al mes (Tabla 9.1).

**Enfoque de competencia.** Los medios digitales chilenos de nicho que publican sus tarifas cobran entre **$300.000 y $600.000 + IVA al mes** por un aviso (En Estrado, 2024), y hasta $850.000 a $1.330.000 + IVA en un medio sectorial con más de cuatro millones de visitas al año (Redagrícola, s. f.). Son referencias de precio publicadas por los propios medios, no tarifas de un sitio de educación.

**Enfoque de valor para el anunciante (techo).** Un preuniversitario gana en cada persona que se matricula. Los planes anuales publicados para 2027 cuestan $783.780 (Filadd, 2026) y $799.992 (Preuniversitario M30M, 2026), con los descuentos vigentes al 25 de noviembre de 2026; sus precios de lista son $922.094 y $999.990. En cinco compras públicas de preuniversitario de 2025 y 2026 (cuatro municipales y una del Instituto Nacional de Deportes), cuyo registro indica el número de estudiantes, el precio por estudiante fue de $158.333 a $560.000, con una **mediana de $428.429** (ChileCompra, 2026c; elaboración propia).

**Decisión de precio.** **$200.000 + IVA por espacio al mes.** Está sobre el costo de gestión ($26.240). Queda bajo la tarifa más baja de los medios de nicho ($300.000), porque el sitio aún no tiene una audiencia medida ni trayectoria. Y es menos de la mitad de lo que se pagó en mediana por estudiante ($428.429). Es un ingreso bruto del preuniversitario: su margen no se conoce, así que la comparación solo muestra el orden de magnitud. Cada temporada se publicará cuántas veces se mostró cada aviso, contadas en forma agregada y sin identificar a nadie, y la tarifa se ajustará con ese dato.

**Capacidad.** El aviso solo va en tres páginas (portada, calendario y beneficios, y preguntas frecuentes) y una vez por página (4.2). Por lo tanto, el ingreso máximo es de 3 × $200.000 × 12 = $7.200.000 al año.

**Tabla 9.1b.** Ingresos por avisos en tres escenarios (supuestos del equipo: espacios vendidos y meses activos).

| Escenario | Espacios vendidos | Meses al año | Ingreso anual | Espacios vendidos en promedio al mes |
|---|---|---|---|---|
| Bajo | 1 | 6 | $1.200.000 | 0,50 |
| Medio | 2 | 8 | $3.200.000 | 1,33 |
| Alto | 3 | 10 | $6.000.000 | 2,50 |

Se supone que los meses activos se concentran en la temporada de preparación de la PAES: la inscripción a la PAES Regular de 2026 cerró el 27 de julio (Ministerio de Educación, 2026c).

#### 9.1.4 Punto de equilibrio con las dos fuentes

Cada informe aporta $632.000 − $314.880 = **$317.120** a los costos fijos. Cada espacio vendido aporta $200.000 − $26.240 = **$173.760** por mes. El equilibrio se calcula por año, porque los avisos se concentran en algunos meses: los costos fijos anuales son $423.091 × 12 = **$5.077.092**.

**Tabla 9.1c.** Informes al año necesarios para cubrir los costos fijos anuales ($5.077.092), según el escenario de avisos (elaboración propia).

| Escenario de avisos | Aporte de los avisos al año | Falta cubrir | Informes al año necesarios |
|---|---|---|---|
| Sin avisos | $0 | $5.077.092 | 16,01 → **17** |
| Bajo (1 espacio × 6 meses) | 6 × $173.760 = $1.042.560 | $4.034.532 | 12,72 → **13** |
| Medio (2 espacios × 8 meses) | 16 × $173.760 = $2.780.160 | $2.296.932 | 7,24 → **8** |
| Alto (3 espacios × 10 meses) | 30 × $173.760 = $5.212.800 | $0 | **0** |

**Lectura.** Sin avisos, el equilibrio exige 17 informes al año, por sobre el mercado alcanzable que se supone (6 a 11). Con el escenario medio de avisos baja a **8 informes al año**, dentro de ese rango. Con el escenario alto, los avisos cubren por sí solos los costos fijos. Casi todo el costo fijo son horas valorizadas: el dinero que exige el sitio son $29.491 al mes, y un solo espacio vendido lo cubre. Por eso el sitio gratuito sigue funcionando aunque no se venda ningún informe. Todos los volúmenes son supuestos del equipo, sin validar.

### 9.2 Análisis de factibilidad

Se analizan los seis aspectos que pide la guía (Sapag Chain et al., 2014). Semáforo: 🟢 factible; 🟡 factible con condiciones; 🔴 no factible.

**Tabla 9.2.** Factibilidad.

| Aspecto | Pregunta central | Evidencia | Conclusión |
|---|---|---|---|
| Técnico | ¿Podemos construirlo y operarlo con la tecnología y el conocimiento disponibles? | Prototipo desplegado; 11.364 variantes de carrera procesadas; competencias del perfil de egreso (Tabla 4.6) | 🟢 Factible. Pendiente: medir accesibilidad con lector de pantalla y rendimiento en conexión lenta |
| Legal | ¿Cumple la normativa y tenemos los permisos y derechos? | Ley 21.719 (datos personales; rige desde el 15 de octubre de 2027, fecha fijada por la Ley 21.855, de 2026): el sitio funciona sin cuenta, la cuenta no pide edad ni datos sensibles y los avisos no usan datos personales; Ley 19.496 y circular del SERNAC (2022): los avisos van rotulados «Publicidad» y se guarda quién compró cada uno (4.2); Ley 17.336 y licencias de los componentes revisadas (4.3); condiciones de uso de los datos abiertos del DEMRE revisadas; sociedad aún no constituida (8.2) | 🟡 Factible con condiciones: constituir la sociedad antes de firmar contratos; validar con un abogado los estatutos, el pacto de accionistas, la titularidad del código y la política de datos; confirmar con cada organismo el uso de sus datos en informes pagados |
| Económico | ¿Los beneficios justifican los costos? ¿Es sostenible? | Costos fijos de $423.091 al mes, de los cuales $29.491 son dinero; precio de $632.000 + IVA por informe, defendido por costo, por compras públicas comparables y por valor (9.1.2); espacio publicitario a $200.000 + IVA al mes (9.1.3); punto de equilibrio de 17 informes al año sin avisos y de 8 con el escenario medio de avisos (9.1.4) | 🟡 Factible con condiciones: el sitio gratuito es sostenible con horas de los socios, y un solo espacio vendido cubre su costo en dinero. Las horas se cubren con 8 informes al año y el escenario medio de avisos, dentro del mercado que se supone alcanzable (6 a 11 informes); sin avisos haría falta un fondo público |
| De mercado | ¿Existe demanda y alguien dispuesto a usarlo o pagarlo? | 137.237 personas no ingresaron al año siguiente de egresar en 2026 (SIES, 2026a); no se observó un recorrido único que reúna los datos (4.7); hay organismos públicos que compran estudios de $2.000.000 a $5.400.005 (9.1.2) y 138 empresas en el rubro preuniversitario (9.1.3); ninguna organización ha pedido un análisis ni un aviso | 🟡 Factible con condiciones para el uso por personas, que se mide el 4 de diciembre; existe gasto en estudios y en preparación de la PAES, pero la demanda de informes y de avisos de este proyecto es una hipótesis sin evidencia |
| Social | ¿La comunidad lo acepta y le beneficia? ¿Excluye a alguien? | Sitio gratuito, liviano y desde 360 px; participan personas de 18 años o más con su solo consentimiento; sin medición con personas aún | 🟡 Factible con condiciones: conseguir a las 10 personas de la medición; revisión profesional de los contenidos de orientación |
| Ambiental | ¿Genera impactos ambientales y cómo se manejan? | Páginas livianas, datos mínimos y proveedores de nube en lugar de servidores propios; el consumo no se mide | 🟢 Factible: impacto bajo; el peso de página es una meta por medir |

Las condiciones de los aspectos legal, económico, de mercado y social pasan como supuestos críticos y riesgos al Entregable II.

---

## 10. Presupuesto del proyecto

El presupuesto estima los recursos para la **puesta en marcha de 2027: dos meses (8 semanas) con el sitio abierto al público, dos análisis publicados y un primer informe de muestra**, y muestra quién los financia. Usa los mismos valores unitarios de la valorización (9.1). Valores en pesos chilenos; los montos de Cloudflare y Supabase se dan sin IVA, que se confirma con cada proveedor; el dominio incluye IVA. Los **aportes pecuniarios** son dinero; los **no pecuniarios** son horas del equipo valorizadas a $13.120 por hora.

**Tabla 10.1.** Presupuesto de la puesta en marcha.

| Ítem | Descripción | Unidad | Cant. | Valor unitario | Total | Fuente del valor | Financiado por |
|---|---|---|---|---|---|---|---|
| Difusión | Dos análisis de datos para publicar: 2 × 8 h | hora | 16 | $13.120 | $209.920 | Costo hora (9.1) | Equipo (no pecuniario) |
| Difusión | Primer informe de muestra | hora | 24 | $13.120 | $314.880 | Costo hora y supuesto de horas por informe (9.1) | Equipo (no pecuniario) |
| Operaciones | Cloudflare Workers, plan de pago | mes | 2 | $4.750 | $9.500 | Cloudflare (s. f.); US$ 5 a $950 | Equipo (pecuniario) |
| Operaciones | Supabase Pro | mes | 2 | $23.750 | $47.500 | Supabase (s. f.); US$ 25 a $950 | Equipo (pecuniario) |
| Operaciones | Dominio .cl | año | 1 | $11.888 | $11.888 | NIC Chile (2023); $9.990 × 1,19 | Equipo (pecuniario) |
| Personal | Desarrollo, diseño, datos y pruebas: 3 integrantes × 10 h × 8 semanas | hora | 240 | $13.120 | $3.148.800 | Costo hora (9.1) | Equipo (no pecuniario) |
| Infraestructura | Computadores y conexión de los integrantes | global | 1 | $0 | $0 | Equipos propios, sin valorizar | Equipo (en especie) |
| Imprevistos | 10 % de los aportes pecuniarios | % | 10 | — | $6.889 | Regla de la guía (5 % a 10 %) | Equipo (pecuniario) |

**Ítem económico: resumen.**

| Concepto | Monto |
|---|---|
| Aportes pecuniarios (operaciones + imprevistos) | $75.777 |
| Aportes no pecuniarios (horas del equipo) | $3.673.600 |
| **Costo total de la puesta en marcha** | **$3.749.377** |
| Ingresos del período | $0 (no se supone ninguna venta) |
| Resultado del período | Déficit de $3.749.377, cubierto en un 98 % por horas del equipo |

**Ítem financiero: resumen.** Los $75.777 pecuniarios se financian con recursos propios de los socios, en tres partes iguales de $25.259, y se pagan en el orden de la inscripción del dominio, el primer mes de proveedores y el segundo mes. El resto son aportes en horas, que se registran por integrante porque determinan la participación en la sociedad (8.2.2). Con la sociedad constituida se podría postular a Semilla Inicia o a un fondo similar para cubrir hasta el 75 % del costo total (CORFO, s. f.-a), con el aporte propio como contraparte.

**Servicios sin monto.** Se excluyen por ahora, hasta contar con cotizaciones de tres proveedores: la revisión del contenido por una persona profesional de psicología o psicopedagogía, la asesoría legal (estatutos, pacto de accionistas y política de datos) y la contabilidad de la sociedad. Constituir la sociedad y hacer el inicio de actividades no tiene costo; queda por cotizar la firma ante notario de quien no cuente con firma electrónica avanzada, para la que no se encontró un arancel oficial. Son condiciones antes de firmar contratos y se cotizarán antes de postular a fondos.

**Coherencia con los puntos anteriores.**

**Tabla 10.2.** Coherencia.

| Si en… | decía… | el presupuesto… |
|---|---|---|
| Factibilidad técnica | Se usan Cloudflare y Supabase | Incluye ambos servicios en plan de pago |
| Factibilidad legal | Hay que constituir la sociedad y validar estatutos, pacto y política de datos | Los declara sin monto, por cotizar |
| Estrategia (8.1) | Los clientes llegan por lo que la agencia publica | Incluye horas para dos análisis publicados y un informe de muestra, y ninguna hora de venta |
| Perfil de inversores (8.4) | Recursos propios primero | Muestra el aporte propio en dinero y en horas |
| Valorización (9.1) | Costo hora de $13.120 y 24 horas por informe | Usa los mismos valores unitarios |
| Objetivos (Punto 3) | Las personas reúnen y comparan información en menos tiempo | Incluye las horas de desarrollo, datos y pruebas que lo sostienen |

---

## Referencias

- Acción Educar. (s. f.). *Misión* (consultado el 13 de noviembre de 2026). https://www.accioneducar.cl/mision/
- AIEP. (s. f.). *Ingeniería de Ejecución en Informática, mención Desarrollo de Sistemas: Perfil de egreso* [Sede San Fernando]. Instituto Profesional AIEP. https://www.aiep.cl/admision/carrera/ingenieria-en-informatica/
- AIEP. (2025a). *PEI 2025-2029: Claves del Plan Estratégico Institucional*. Instituto Profesional AIEP. https://transparencia.aiep.cl/wp-content/uploads/2020/11/10-claves-PEI-2025-2029_compressed.pdf
- American Psychological Association. (2023, 7 de abril). *How to cite ChatGPT*. APA Style Blog. https://apastyle.apa.org/blog/how-to-cite-chatgpt
- Anthropic. (2026). *Claude* [Modelo de lenguaje de gran tamaño]. https://claude.ai
- Benjet, C., Hernández-Montoya, D., Borges, G., Méndez, E., Medina-Mora, M. E., y Aguilar-Gaxiola, S. (2012). Youth who neither study nor work: Mental health, education and employment. *Salud Pública de México, 54*(4), 410-417. https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0036-36342012000400011
- Bettinger, E. P., Long, B. T., Oreopoulos, P., y Sanbonmatsu, L. (2012). The role of application assistance and information in college decisions: Results from the H&R Block FAFSA experiment. *The Quarterly Journal of Economics, 127*(3), 1205-1242.
- ChileAtiende. (2026, 3 de febrero). *Tu empresa en un día* [Ficha de trámite]. https://www.chileatiende.gob.cl/fichas/21409/1/pdf
- ChileAtiende. (s. f.). *Registro de marca comercial* (consultado el 6 de noviembre de 2026). https://www.chileatiende.gob.cl/fichas/1633-registro-de-marca-comercial
- ChileCompra. (2024, diciembre). *Conoce los 10 cambios clave a la Ley de Compras Públicas que impactan a los proveedores del Estado*. https://www.chilecompra.cl/2024/12/conoce-los-10-cambios-clave-a-la-ley-de-compras-publicas-que-impactan-a-los-proveedores-del-estado/
- ChileCompra. (2026a). *Adjudicaciones de estudios en licitaciones de menos de 100 UTM: 895072-17-L124, 1422041-7-L125, 2833-16-L125, 162-21-L124, 564162-114-L126, 561704-21-L125, 2428-33-L124 y 1110404-87-L126* [Registros de datos abiertos] (consultado el 25 de noviembre de 2026). https://apis.mercadopublico.cl/OCDS/data/award/895072-17-L124
- ChileCompra. (2026b). *Adjudicaciones de las licitaciones 622-4-LQ24 y 622-113-LR24 de la Tesorería General de la República: horas de profesionales de tecnologías de la información* [Registros de datos abiertos] (consultado el 25 de noviembre de 2026). https://apis.mercadopublico.cl/OCDS/data/award/622-4-LQ24
- ChileCompra. (2026c). *Adjudicaciones de servicios de preuniversitario: 2817-23-LE26, 757818-6-LE26, 4315-5-LE26, 4026-18-LE25, 858-49-LE25 y 2667-149-LP24* [Registros de datos abiertos] (consultado el 25 de noviembre de 2026). https://apis.mercadopublico.cl/OCDS/data/award/2817-23-LE26
- Cloudflare. (s. f.). *Workers pricing*. https://developers.cloudflare.com/workers/platform/pricing/
- Código de Comercio, artículos 350, 404 y 424 a 446 [sociedad por acciones]. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idNorma=1974
- Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2.ª ed.). Lawrence Erlbaum.
- Consejo Nacional de Educación. (2026). *Elige Carrera, versión beta* (consultado el 6 de noviembre de 2026). https://www.eligecarrera.cl/
- Corporación de Fomento de la Producción [CORFO]. (s. f.). *Semilla Inicia*. https://www.corfo.gob.cl/sites/cpp/inf/semilla-inicia (consultado el 6 de noviembre de 2026).
- Decreto Ley 3.063. Sobre rentas municipales [texto refundido por el Decreto 2.385 de 1996]. 1979. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idNorma=18967
- Departamento de Derechos Intelectuales, Servicio Nacional del Patrimonio Cultural. (s. f.). *¿Cómo se inscribe un programa de computación / software?* (consultado el 6 de noviembre de 2026). https://www.propiedadintelectual.gob.cl/node/1234
- Departamento de Evaluación, Medición y Registro Educacional [DEMRE]. (s. f.-a). *Condiciones de uso de la información de datos abiertos* (consultado el 13 de noviembre de 2026). Universidad de Chile. https://demre.cl/portales/condiciones-uso-informacion-datos-abiertos
- Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. *Management Review, 70*(11), 35-36.
- Elkington, J. (1997). *Cannibals with forks: The triple bottom line of 21st century business*. Capstone.
- En Estrado. (2024). *Media kit 2024* [Tarifas publicitarias]. https://enestrado.com/wp-content/uploads/2024/06/2024-En-Estrado-Media-Kit.pdf
- Escobar-Pérez, J., y Cuervo-Martínez, Á. (2008). Validez de contenido y juicio de expertos: Una aproximación a su utilización. *Avances en Medición, 6*, 27-36. https://www.humanas.unal.edu.co/lab_psicometria/download_file/view/171/250
- Freeman, R. E. (1984). *Strategic management: A stakeholder approach*. Pitman.
- Filadd. (2026). *Pack Completo Anual 2027* [Página de venta] (consultado el 25 de noviembre de 2026). https://filadd.cl/preuniversitario-paes-pack-completo
- Fiscalía Nacional Económica. (2025, octubre). *Estudio de mercado sobre educación superior (EM09-2024): Resumen ejecutivo del informe preliminar*. https://www.fne.gob.cl/wp-content/uploads/2025/10/00_-Resumen-Ejecutivo_2025_10_30_AM-vf.pdf
- Fundación Por Una Carrera. (2026). Sitio institucional (consultado el 6 de noviembre de 2026). https://www.porunacarrera.cl/
- Gariépy, G., Danna, S. M., Hawke, L., Henderson, J., e Iyer, S. N. (2022). The mental health of young people who are not in education, employment, or training: A systematic review and meta-analysis. *Social Psychiatry and Psychiatric Epidemiology, 57*, 1107-1121. https://doi.org/10.1007/s00127-021-02212-8
- Get on Board. (2026, 11 de noviembre). *Ofertas de empleo: Full-Stack Developer, Data Scientist Junior e Ingeniero/a de Proyecto — Implementación* [Sitio de empleo]. https://www.getonbrd.com/
- Google. (2026). *Antigravity* [Agente de programación basado en un modelo de lenguaje de gran tamaño]. https://antigravity.google
- Hastings, J., Neilson, C. A., y Zimmerman, S. D. (2015). *The effects of earnings disclosure on college enrollment decisions* (NBER Working Paper 21300). National Bureau of Economic Research. https://www.nber.org/papers/w21300
- Hernández-Sampieri, R., y Mendoza, C. P. (2018). *Metodología de la investigación: Las rutas cuantitativa, cualitativa y mixta*. McGraw-Hill.
- Instituto Nacional de la Juventud. (2022). *10.ª Encuesta Nacional de Juventudes 2022: Informe general de resultados*. Ministerio de Desarrollo Social y Familia. https://www.injuv.gob.cl/sites/default/files/10ma_encuesta_nacional_de_juventudes_2022.pdf
- Instituto Nacional de la Juventud. (2025). *11.ª Encuesta Nacional de Juventudes 2025: Informe ejecutivo*. Ministerio de Desarrollo Social y Familia. https://www.injuv.gob.cl/sites/default/files/informe_ejecutivo_enj_11_sintesis_dn.pdf
- International Organization for Standardization. (2010). *ISO 26000:2010 Guidance on social responsibility*. ISO.
- Kotler, P., y Keller, K. L. (2016). *Dirección de marketing* (15.ª ed.). Pearson.
- Krueger, R. A., y Casey, M. A. (2015). *Focus groups: A practical guide for applied research* (5.ª ed.). SAGE.
- Ley 17.336. Sobre propiedad intelectual. 2 de octubre de 1970. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 19.039. Establece normas aplicables a los privilegios industriales y protección de los derechos de propiedad industrial. 25 de enero de 1991. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 19.496. Establece normas sobre protección de los derechos de los consumidores. 7 de marzo de 1997. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idNorma=61438
- Ley 19.628. Sobre protección de la vida privada. 28 de agosto de 1999. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 19.886. De bases sobre contratos administrativos de suministro y prestación de servicios. 30 de julio de 2003. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 20.659. Simplifica el régimen de constitución, modificación y disolución de las sociedades comerciales. 8 de febrero de 2013. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idNorma=1048718
- Ley 21.033. Crea la XVI Región de Ñuble y las provincias de Diguillín, Punilla e Itata. 5 de septiembre de 2017. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 21.040. Crea el Sistema de Educación Pública. 24 de noviembre de 2017. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 21.561. (2023). Modifica el Código del Trabajo con el objeto de reducir la jornada laboral. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile
- Ley 21.719. Regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales. 13 de diciembre de 2024. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idNorma=1209272
- Ley 21.855. Modifica la Ley N.° 21.719, que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales, en el sentido que indica. 23 de noviembre de 2026. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idNorma=1230520
- Libertad y Desarrollo. (s. f.). *Quiénes somos* (consultado el 13 de noviembre de 2026). https://www.lyd.org/quienes-somos/
- Mankins, J. C. (1995). *Technology readiness levels: A white paper*. NASA, Office of Space Access and Technology.
- Maurya, A. (2012). *Running lean: Iterate from plan A to a plan that works* (2.ª ed.). O'Reilly Media.
- Mendelow, A. (1991). Stakeholder mapping. En *Proceedings of the 2nd International Conference on Information Systems*. Cambridge, MA.
- Ministerio de Desarrollo Social y Familia. (2026). *Educación Casen 2024* [Tablas de resultados, hoja 100: razones de no asistencia a educación superior]. Observatorio Social. https://observatorio.ministeriodesarrollosocial.gob.cl/storage/docs/casen/2024/Educacion_Casen_2024.xlsx
- Ministerio de Educación. (s. f.-a). *Mi Futuro* (consultado el 6 de noviembre de 2026). https://www.mifuturo.cl/
- Ministerio de Educación. (s. f.-b). *Portal Beneficios Estudiantiles* (consultado el 6 de noviembre de 2026). https://portal.beneficiosestudiantiles.cl/
- Ministerio de Educación. (2026a). *Calendario FUAS 2027* [Formulario Único de Acreditación Socioeconómica] (consultado el 11 de noviembre de 2026). https://postulacion.beneficiosestudiantiles.cl/fuas
- Ministerio de Educación. (2026b, 1 de enero). *Más del 50% del nuevo sistema de Educación Pública instalado: 10 SLEP inician su administración educacional el 1 de enero de 2026*. https://www.mineduc.cl/?p=42301
- Ministerio de Educación. (2026c, 30 de julio). *PAES Regular 2026 supera los 300 mil inscritos*. https://www.mineduc.cl/?p=43738
- Moore, G. A. (1991). *Crossing the chasm: Marketing and selling technology products to mainstream customers*. HarperBusiness.
- Naciones Unidas. (2015). *Transformar nuestro mundo: La Agenda 2030 para el Desarrollo Sostenible* (A/RES/70/1). https://sdgs.un.org/es/2030agenda
- NIC Chile. (2023, 31 de octubre). *Ajuste de tarifas del registro de dominios .cl*. https://nic.cl/anuncios/20231031-tarifas-eng.html
- OECD/Eurostat. (2018). *Oslo Manual 2018: Guidelines for collecting, reporting and using data on innovation* (4.ª ed.). OECD Publishing. https://doi.org/10.1787/9789264304604-en
- OpenAI. (2026). *Codex* [Agente de programación basado en un modelo de lenguaje de gran tamaño]. https://openai.com/codex
- Organización para la Cooperación y el Desarrollo Económicos [OCDE]. (s. f.). *Education at a Glance: Distribución de jóvenes según situación educacional y laboral* [Base de datos] (consultada el 13 de noviembre de 2026). OECD Data Explorer. https://data-explorer.oecd.org/
- Ortegón, E., Pacheco, J. F., y Prieto, A. (2005). *Metodología del marco lógico para la planificación, el seguimiento y la evaluación de proyectos y programas*. CEPAL.
- Osterwalder, A., y Pigneur, Y. (2010). *Business model generation*. Wiley.
- Osterwalder, A., Pigneur, Y., Bernarda, G., y Smith, A. (2014). *Value proposition design: How to create products and services customers want*. Wiley.
- Paul, K. I., y Moser, K. (2009). Unemployment impairs mental health: Meta-analyses. *Journal of Vocational Behavior, 74*(3), 264-282. https://doi.org/10.1016/j.jvb.2009.01.001
- Porter, M. E. (1985). *Competitive advantage: Creating and sustaining superior performance*. Free Press.
- Preuniversitario M30M. (2026). *Preuniversitario online PAES 2027 según tu carrera* (consultado el 25 de noviembre de 2026). https://www.preuniversitariom30m.com/
- Ramírez Dorantes, M. C., y Canto y Rodríguez, J. E. (2007). Desarrollo y evaluación de una escala de autoeficacia en la elección de carrera en estudiantes mexicanos. *Revista Electrónica de Investigación Psicoeducativa, 5*(1), 37-56. https://www.redalyc.org/articulo.oa?id=293121941004
- Redagrícola. (s. f.). *Media kit Chile* [Tarifas publicitarias] (consultado el 25 de noviembre de 2026). https://publicidad.redagricola.com/usd/mediakit-chile/
- Sapag Chain, N., Sapag Chain, R., y Sapag Puelma, J. M. (2014). *Preparación y evaluación de proyectos* (6.ª ed.). McGraw-Hill.
- Senado de la República. (s. f.). *Boletín 11273-03: Regula la creación y funcionamiento de las empresas de beneficio e interés colectivo* (consultado el 13 de noviembre de 2026). https://tramitacion.senado.cl/wspublico/tramitacion.php?boletin=11273
- Servicio de Impuestos Internos. (2022). *Circular N.° 50: Modificaciones introducidas por la Ley 21.420 a la Ley sobre Impuesto a las Ventas y Servicios*. https://www.sii.cl/normativa_legislacion/circulares/2022/circu50.pdf
- Servicio de Impuestos Internos. (2025). *Circular N.° 53* [tasa del impuesto de primera categoría para el régimen de empresas de menor tamaño]. https://www.sii.cl/normativa_legislacion/circulares/2025/circu53.pdf
- Servicio de Impuestos Internos. (2026a). *Unidad Tributaria Mensual (UTM) 2026*. https://www.sii.cl/valores_y_fechas/utm/utm2026.htm
- Servicio de Impuestos Internos. (2026b). *Estadísticas de empresas por actividad económica* [Archivos PUB_ACT y PUB_TRAM5_ACT, actualizados el 2 de noviembre de 2026; cifras preliminares]. https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html
- Servicio de Información de Educación Superior. (s. f.). *SIES* (consultado el 13 de noviembre de 2026). Subsecretaría de Educación Superior. https://www.mifuturo.cl/sies/
- Servicio de Información de Educación Superior. (2025). *Metodología del Buscador de Empleabilidad e Ingresos 2025-2026*. Subsecretaría de Educación Superior. https://mifuturo.cl/wp-content/uploads/2025/12/Metodologia-Buscador-Empleabilidad-e-Ingresos_2025-2026.pdf
- Servicio de Información de Educación Superior. (2026a, octubre). *Acceso a la educación superior en Chile 2026*. Subsecretaría de Educación Superior. https://www.mifuturo.cl/wp-content/uploads/2026/10/Informe-de-Acceso-a-la-Educaci%C3%B3n-Superior.pdf
- Servicio de Información de Educación Superior. (2026b). *Glosario de oferta académica 2010 al 2026*. Subsecretaría de Educación Superior. https://www.mifuturo.cl/wp-content/uploads/2026/06/Glosario_Oferta_Academica_2010_al_2026_SIES_WEB_EE-1.pdf
- Servicio Nacional del Consumidor [SERNAC]. (2022). *Circular interpretativa sobre publicidad nativa e influencers* (Resolución Exenta N.° 534, 16 de junio de 2022). https://www.sernac.cl/portal/618/w3-article-65742.html
- Subsecretaría de Desarrollo Regional y Administrativo [SUBDERE]. (s. f.). *Sistema de Información Municipal (SIM)* (consultado el 25 de noviembre de 2026). https://www.subdere.gov.cl/programas/sistema-de-informaci%C3%B3n-municipal-sim
- Subsecretaría de Educación Superior. (s. f.). *Acceso a la Educación Superior* (consultado el 6 de noviembre de 2026). https://acceso.mineduc.cl/
- Subsecretaría de Telecomunicaciones [Subtel]. (2025). *Estudio Duodécima Encuesta sobre acceso, usos y usuarios de Internet en Chile*. https://www.subtel.gob.cl/wp-content/uploads/2026/02/Presentacion-Subtel-Acceso-y-Uso-Internet-2025_v1.pdf
- Supabase. (s. f.). *Pricing*. https://supabase.com/pricing
- Taylor, K. M., y Betz, N. E. (1983). Applications of self-efficacy theory to the understanding and treatment of career indecision. *Journal of Vocational Behavior, 22*(1), 63-81.
- Weihrich, H. (1982). The TOWS matrix: A tool for situational analysis. *Long Range Planning, 15*(2), 54-66.
- World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C. https://www.w3.org/TR/WCAG22/

## Anexo: Declaración de uso de inteligencia artificial

La declaración de las herramientas de inteligencia artificial usadas, con su propósito y su verificación, está en la sección 2.8.
