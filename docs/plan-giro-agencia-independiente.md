# Plan de trabajo: giro a agencia independiente

Fecha: 13 de noviembre de 2026 · Decide: el líder (@rafajaque) · Estado: en curso.
Reemplaza a la idea del 11 de noviembre (ADR 0031) cuando se acepte el ADR 0032. Hasta entonces, `docs/plan.md` sigue describiendo el calendario.

## 1. La idea, en limpio

| Punto | Antes (11-nov) | Ahora (13-nov) |
|---|---|---|
| Qué somos | Fundación sin fines de lucro | **Agencia independiente**, constituida como sociedad por acciones (SpA) |
| Público | Estudiantes de 3.º y 4.º medio de liceos con financiamiento público | **Toda persona que egresa de 4.º medio y no entra a la educación superior** (y quien está por egresar) |
| Problema | Brecha de acceso por tipo de liceo | **Desinformación al egresar**: no se ingresa, y eso trae consecuencias (salud mental, aislamiento, inactividad), cada una con su fuente |
| Cliente | Colegios y sostenedores, por suscripción | **Nadie se sale a buscar.** La agencia publica datos y gana credibilidad; quien necesite informes o asesoría llega solo |
| Ingreso | Suscripción, fondos públicos, filantropía | **Venta de informes (BI) y asesorías.** Sin avisos en el sitio |
| Referente | Portal de transparencia del Estado | Un centro de estudios que publica y es consultado (como Libertad y Desarrollo) |
| Dato fuerte | Seguimiento por estudiante | **Tiempo**: reunir empleabilidad, duración, malla y comparación de una carrera toma mucho en las fuentes oficiales; en el sitio es un trámite corto. Se mide con cronómetro, no se afirma |
| Estilo visual | Andén urbano (metro y estaciones) | **Igual.** Los PR 157 a 168 de Cristóbal siguen |

Decisiones del líder del 13-nov: «publicidad» significa darse a conocer, no vender avisos; el versus de empleabilidad compara la carrera con su área, ambas cifras del SIES; el Avance 2 del martes 17 se entrega con la idea nueva; para el 19 de diciembre se construye el núcleo acotado (sección 3).

## 2. Supuestos que tomo mientras no digas otra cosa

1. **El uso gratuito para la persona y la neutralidad se mantienen.** Con el modelo nuevo la neutralidad es lo que se vende: un informe vale porque nadie compró su resultado.
2. **Cuenta solo con correo, sin pedir edad.** Guarda correo, si estudia o ya estudió, dónde, la meta y las 3 preferencias. Ningún dato sensible. La regla «todo menor de 18 con autorización de tutor» (ADR 0022, opción A1) no se puede cumplir sin preguntar la edad: se propone pasar a la regla de la ley (artículo 16 quáter de la Ley 21.719: de 14 a 17 años consienten como adultos, salvo datos sensibles) con una casilla «tengo 14 años o más». Necesita ADR y revisión legal. La cuenta queda diseñada, no construida, así que hay tiempo.
3. **Lenguaje.** Fuera «vulnerable», «pobreza», «clase social», «liceos pobres». Se habla de personas que egresan, de información y de decisiones. Las cifras oficiales por tipo de establecimiento se pueden citar como dato, sin adjetivos.
4. **«Empleabilidad real» no se usa como frase.** Se muestra la cifra de la carrera, la de su área, y una nota de qué mide el SIES y qué no (por ejemplo, no dice si la persona trabaja en lo que estudió).
5. **Test vocacional**: solo un instrumento cuya licencia permita uso comercial (una SpA lo es). Candidato por verificar: O*NET Interest Profiler. Quedan fuera la EAEC (sin licencia declarada) y la EPEV (sin uso comercial).
6. **Noticias**: resúmenes propios con enlace a la fuente. No se copian notas de prensa.
7. **Simulador de becas**: el tramo socioeconómico se calcula en el dispositivo y no se guarda.
8. **Se archiva**: panel de seguimiento para colegios, encuesta escolar EAEC, cartas y consentimientos para colegios, propuesta para liceos, estándar de transición, convenio piloto.

## 3. Qué se construye para el 19 de diciembre

**Ya existe y se mantiene:** fichas de carrera, comparador, simulador de puntaje, beneficios y calendario del FUAS, hoja de decisión.

**Se construye (núcleo acotado):**

| Pieza | Qué muestra | Fuente | Responsable |
|---|---|---|---|
| Ficha con versus | Empleabilidad de la carrera frente a su área; duración formal frente a duración real; cupos frente a postulantes; arancel | SIES y DEMRE. Los campos `duracion_real_semestres`, `arancel_anual` y `vacantes` ya están en el esquema. **Por verificar:** que DEMRE publique postulantes por carrera | Cristóbal (datos), Alejandro (pantalla) |
| Meta y 3 preferencias | La persona fija la carrera que quiere; el sitio responde «quieres esto, estas son las opciones más cercanas y disponibles». Se guarda en el dispositivo, sin cuenta | Criterio de cercanía explícito y documentado (misma área, región, puntaje alcanzable); nunca por ser cliente | Alejandro, con Rafael en el criterio |
| Calendario | Fechas de admisión y de beneficios en un solo lugar | DEMRE y Mineduc (tarea C14, ya encargada) | Cristóbal |
| Quiénes somos | Qué es la agencia, quiénes la componen, por qué se hizo | Texto del equipo | Rafael |
| Preguntas frecuentes | Dudas reales de quien egresa | Cada respuesta con su fuente | Cristóbal |
| Portada | Mensaje de agencia y el dato fuerte del tiempo | Prueba cronometrada | Alejandro |

**Queda diseñado (documento o maqueta, no funciona el 19-dic):** cuenta por correo, test vocacional, simulador de becas, chatbot, portal de noticias, tablero de transparencia rediseñado (más legible, para todo público) e informes BI con un índice de informe de muestra.

**Escalabilidad orientada a estudiantes:** se lista en el entregable (avisos de plazos por correo, seguimiento de la postulación, comunidad de egresados, práctica de pruebas).

## 4. Fases

| Fase | Fechas | Qué | Sale |
|---|---|---|---|
| 0. Fijar la idea | Vie 13 nov | ADR 0032 (reemplaza al 0031): SpA, público, negocio, neutralidad, lenguaje | ADR propuesto para tu revisión |
| 1. Entregable | Vie 13 al lun 16 nov | Reescritura completa del Entregable Parte I (detalle abajo) | Documento listo el lunes 16 para entregar el martes 17 |
| 2. Alinear documentos | Lun 16 al vie 20 nov | `AGENTS.md` (secciones 1 y 2.2), `README.md`, `plan.md`, arquitectura, privacidad, guías y reparto del equipo, pruebas de uso, análisis de mercado, skill `lenguaje-claro`; lo obsoleto pasa a archivo | Un PR de documentos por tema |
| 3. Construir el núcleo | Lun 16 al vie 27 nov | Las seis piezas de la sección 3 | Congelamiento de funciones el viernes 27, como en el plan vigente |
| 4. Probar y cerrar | 1 al 19 dic | Prueba de uso con cronómetro, correcciones, informe y presentación | Entrega del 19 de diciembre |

### Fase 1, capítulo por capítulo

| Capítulo | Cambio |
|---|---|
| 1. Bases | Grupos de interés y segmento nuevos: persona que egresa y no ingresa; quien compra informes y asesoría |
| 2. Diagnóstico | Magnitud: cuántos egresan y no ingresan (SIES). Árbol de problemas con las consecuencias (salud mental, aislamiento, inactividad), reutilizando `evidencia-acceso-salud-mental.md`. FODA nuevo. **Método**: la encuesta EAEC a escolares ya no calza; se propone prueba de uso cronometrada y encuesta breve en línea a egresados |
| 3. Fundamentación | Objetivo general y específicos sobre el problema nuevo; metas e indicadores (el principal: tiempo para reunir y comparar la información de una carrera); entregables |
| 4. Transferencia | Se revisa el mecanismo: de convenio con colegios a servicio de informes y asesoría |
| 5 y 6. Propuesta de valor y lienzo | Perfil de la persona egresada; perfil de quien encarga informes. El Canvas Social pasa a un lienzo de modelo de negocio |
| 7. Marco estratégico | Misión, visión y valores de una agencia independiente; la alineación con AIEP se conserva |
| 8. Negocio | SpA en lugar de fundación; estrategia de difusión; fuentes de ingreso |
| 9 y 10. Valorización y presupuesto | Costos de constituir una SpA; se retiran los de la fundación; ingresos por informes y asesoría como hipótesis, sin cifras inventadas |

Reglas que siguen del 11-nov: el entregable no menciona el repositorio, parte por el problema y deja la solución al final, y no trae resultados inventados.

## 5. Riesgos

- **Tercer planteamiento en dos semanas.** El tutor ya dijo que «vacilamos». El ADR 0032 se cierra antes de tocar documentos y no se reabre hasta después del 19-dic.
- **Cuatro días para el entregable.** Se prioriza coherencia interna sobre extensión; lo que no alcance fuente verificada queda marcado como pendiente, no como hecho.
- **Nadie ha dicho que compraría un informe.** El modelo es una hipótesis: el entregable lo dice así.
- **Cifras de consecuencias.** Salud mental y aislamiento solo con fuente oficial o académica; si no hay cifra para Chile, se dice.

## 6. Respuestas del líder (13-nov, segunda ronda)

1. **Territorio:** nacional, completo.
2. **Nombre:** se mantiene. «Seguimiento» es acompañar a la persona en los pasos hasta su meta.
3. **Socios:** los tres integrantes. La proporción se propone en el punto 8.2.2 del entregable: mitad en partes iguales, mitad según el aporte medido (horas registradas más dinero), con permanencia en el pacto. Falta el acuerdo de los tres y un abogado.
4. **Cuenta:** solo correo y dónde estudia o estudió; sin edad ni otros datos; con casillas de consentimiento y base legal. Queda en el [ADR 0033](decisiones/0033-cuenta-con-correo-sin-edad.md).
5. **Método:** medición de tiempo con cronómetro, encuesta en línea a personas egresadas de 18 años o más y entrevistas. Nada escolar.
6. **Reglas de escritura:** todo dato medible y con fuente oficial o académica, nunca prensa; el entregable y los objetivos se escriben desde el problema, no desde la solución.

## 8. Fase 2 hecha (13 de noviembre)

`AGENTS.md`, `README.md`, `docs/plan.md`, las guías del equipo, el reparto, el protocolo de medición, la encuesta, arquitectura, privacidad, fuentes y las skills ya describen la idea vigente. Lo antiguo está en [`archivo/`](archivo/README.md). El calendario y las tareas N1 a N16 viven en [`plan.md`](plan.md); este documento queda como registro de cómo se hizo el giro.

## 7. Estado al cierre del 13 de noviembre (fase 1)

- **Hecho:** ADR 0032 y 0033 (propuestos); Entregable Parte I reescrito completo; cifras nuevas registradas en `verificacion-de-cifras.md`; eliminados del repositorio la carta a colegios, el consentimiento de apoderados y las propuestas para liceos, del panel escolar y del estándar de transición.
- **Cambió respecto de este plan:**
  - *Versus de empleabilidad.* El SIES no publica un promedio por área: publica cada carrera por institución. La comparación será con la misma carrera en otras instituciones y con su área, calculada por nosotros y rotulada «elaboración propia».
  - *Cupos frente a postulantes.* Las vacantes están en el SIES y las postulaciones en bases del DEMRE que traen filtros y condiciones de uso. Solo se puede mostrar para carreras del sistema centralizado y diciendo que las cifras no cuadran exacto con las oficiales.
  - *Medición con personas.* Pasa del 24-30 de noviembre al 30 de noviembre-4 de diciembre, con 10 personas de 18 años o más.
  - *Test vocacional.* El O*NET Interest Profiler se puede usar sin cambios (licencia CC BY-ND) o adaptado con una licencia de desarrollador que exige un estudio de validación; hay una versión corta en español. El uso comercial no está dicho de forma expresa: hay que preguntarlo.
- **Lo que los datos no permiten decir** (y el entregable ya no lo dice): que la gente no ingresa *por* desinformación (la encuesta Casen registra razones personales, 60,7 %, y económicas, 34,1 %, y no pregunta por información), ni que quedar fuera *cause* problemas de salud mental (es una asociación; Gariépy y otros, 2022).
- **SpA, verificado en la BCN, el SII y ChileAtiende:** una o más personas, sin capital mínimo, cinco años para pagar el capital, estatutos libres (Código de Comercio, arts. 424 a 446); constituir en el Registro de Empresas y Sociedades es gratis y solo cuesta la firma ante notario de quien no tenga firma electrónica avanzada (sin arancel oficial encontrado); los informes llevan IVA de 19 % porque una SpA no puede ser sociedad de profesionales (Circular SII 50 de 2022); tasa de 12,5 % en 2026 y 2027 para empresas de menor tamaño (Circular SII 53 de 2025); patente municipal de 2,5 a 5 por mil del capital propio, mínimo 1 UTM. No existe ley de empresas de beneficio colectivo (boletín 11273-03, detenido desde 2021): la gratuidad y la independencia se amarran en los estatutos.
- **Pendiente:** segunda lectura de las cifras nuevas; abogado y contador para estatutos, pacto y régimen tributario; acuerdo de los tres sobre el reparto; reescribir los documentos de la encuesta para personas egresadas; pedir el permiso a los autores de la EAEC; decidir qué se hace con `docs/panel-seguimiento-escolar-borrador.md` (sin commit, no se puede recuperar si se borra) y con las dos figuras que el entregable ya no usa; fases 2 a 4.
