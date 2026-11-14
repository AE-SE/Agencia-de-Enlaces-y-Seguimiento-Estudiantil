# 0032 — Agencia independiente, público egresado y sociedad por acciones
Fecha: 2026-11-13 · Estado: aceptada por el líder el 2026-11-13, al ordenar que AGENTS.md y los demás documentos se alinearan con ella · Reemplaza a: [ADR 0031](0031-producto-y-organizacion.md) · Relacionado: [ADR 0033](0033-cuenta-con-correo-sin-edad.md)

## Contexto
El ADR 0031 (11 de noviembre) acotó el proyecto a estudiantes de 3.º y 4.º medio de liceos con financiamiento público de O'Higgins, con un panel de seguimiento vendido a colegios y una fundación como forma jurídica. Dos días después el líder vuelve al problema de origen, por tres razones:

1. **El problema es más ancho que un tipo de liceo.** De 276.509 personas que egresaron de enseñanza media en 2025, 137.237 (49,6 %) no ingresaron a la educación superior en 2026, y 26,9 % de quienes egresaron en 2021 no había ingresado cinco años después (SIES, *Acceso a la Educación Superior en Chile 2026*, octubre de 2026, Tabla 1, p. 8, y Tabla 12, pp. 22-23). Ocurre en todos los tipos de establecimiento.
2. **El cliente colegio nunca se validó.** No hay carta de interés, convenio ni precio aceptado por ningún colegio o sostenedor, y el piloto dependía de autorizaciones de colegios y tutores que no controlamos.
3. **La persona que ya egresó queda sin nadie a cargo.** El panel escolar no la alcanza.

## Opciones evaluadas
1. **Mantener el ADR 0031** (fundación, colegios, O'Higgins). Pro: documentos ya alineados. Contra: deja fuera a quien ya egresó; el cliente sigue sin validar; depende de terceros para cada prueba.
2. **Agencia independiente para toda persona que egresa de 4.º medio y no ingresa, de alcance nacional, constituida como sociedad por acciones (SpA), que no sale a buscar clientes: publica datos, gana credibilidad y vende informes y asesorías a quien llegue.** Pro: ataca el problema completo; las pruebas se hacen con personas de 18 años o más; no depende de autorizaciones escolares; puede facturar apenas se constituye. Contra: nadie ha pedido un informe todavía; una sociedad no fija su fin en los estatutos como una fundación.
3. **Solo el sitio gratuito, sin modelo de ingresos.** Pro: lo más simple. Contra: nadie lo sostiene después del título.

## Decisión
Se elige la opción 2.

- **Público:** toda persona que egresa de 4.º medio y no entra a la educación superior, y quien está por egresar. Alcance nacional.
- **Problema que guía todo:** al egresar se decide con información insuficiente, dispersa y difícil de comparar; quien queda fuera del estudio se expone a inactividad, aislamiento y deterioro de su salud mental. Cada consecuencia se cita con su fuente oficial o académica, nunca desde prensa.
- **Qué hace la agencia:** reúne los datos oficiales de cada carrera (empleabilidad, duración, arancel, requisitos, cupos) y los deja comparables en un solo lugar, gratis; acompaña a la persona hasta su meta (por eso el nombre conserva «Seguimiento»); y publica cómo procesa los datos.
- **Negocio:** no se buscan colegios ni instituciones. «Publicidad» significa darse a conocer, no vender avisos. El ingreso viene de **informes de datos (BI) y asesorías** que encarga quien llegue. Referente de forma, no de línea editorial ni de financiamiento: un centro de estudios que publica y es consultado.
- **Organización:** sociedad por acciones (SpA), a constituir en 2027. Hasta el 19 de diciembre de 2026 es un proyecto de título sin entidad.
- **Lenguaje:** se evita «vulnerable», «pobreza», «clase social» y similares. Se habla de personas que egresan, de información y de decisiones. Las cifras oficiales por tipo de establecimiento se citan como dato, sin adjetivos.
- **Estilo visual:** sin cambios (ADR 0029).

## Lo que no cambia
- **Gratis para la persona, siempre**: sin muros de pago, sin avisos, sin venta de datos personales.
- **Neutralidad**: el sitio no ordena, destaca ni recomienda instituciones por ser clientes. Con este modelo la neutralidad es lo que se vende: un informe vale porque nadie compró su resultado. Un cliente de informes no obtiene posición, mención ni trato distinto en el sitio público.
- Solo fuentes oficiales, primarias o académicas; todo dato con fuente, enlace y fecha.
- El protocolo de crisis y los límites del asistente (AGENTS.md 2.4).

## Justificación
- El alcance nacional sale de los datos: el no ingreso inmediato va de 33,8 % a 53,5 % según la dependencia del establecimiento (egreso 2025; SIES, 2026, p. 6), es decir, existe en todas.
- La evidencia experimental respalda que la información personalizada cambia decisiones de estudio (Hastings, Neilson y Zimmerman, en Chile; Bettinger y otros, en Estados Unidos), y que el material genérico no lo hace. Detalle en [`evidencia-acceso-salud-mental.md`](../evidencia-acceso-salud-mental.md).
- **Límite que el proyecto debe decir siempre:** ningún dato oficial atribuye el no ingreso a la falta de información. En la encuesta Casen 2024, las personas de 18 a 24 años que no asisten a la educación superior declaran razones personales (60,7 %) y económicas (34,1 %); la encuesta no pregunta por información. Y la relación entre quedar fuera y la salud mental es una asociación, no una causa demostrada (Gariépy y otros, 2022). La desinformación se trata como causa posible que se mide, no como hecho.
- Una SpA permite facturar informes y asesorías, sumar o retirar socios sin rehacer la sociedad y constituirse en línea. Una fundación no calza con un ingreso por venta de servicios a quien llegue ni con el reparto entre socios que el equipo quiere definir.
- No salir a vender evita ofrecer algo cuya utilidad aún no se ha medido: primero se publica y se mide, después se cobra.

## Consecuencias
- **Riesgo aceptado:** una SpA puede cambiar su fin por acuerdo de los accionistas. Mitigación: la gratuidad para la persona y la neutralidad se escriben en los estatutos y en el pacto de accionistas, y su cambio exige unanimidad. Requiere validación de un abogado.
- **Hipótesis sin validar:** que alguien encargue informes. El entregable lo declara como hipótesis, sin cifras de venta inventadas.
- **Socios y proporciones:** por acordar entre los tres integrantes. Propuesta: participación proporcional al aporte medido de cada uno (horas registradas valorizadas más dinero aportado) a la fecha de constitución, con adquisición gradual de las acciones en el pacto. Ver el Entregable, punto 8.2.
- **Se archiva o elimina:** panel de seguimiento para colegios, encuesta y cartas escolares, propuestas para liceos, estándar de transición, convenio piloto. Se hace en un PR aparte de documentos.
- **Regla de menores:** el ADR 0022 (todo menor de 18 con autorización de tutor) deja de ser aplicable porque la cuenta ya no pide edad; lo reemplaza el [ADR 0033](0033-cuenta-con-correo-sin-edad.md).
- **AGENTS.md** (secciones 1, 2.1, 2.2 y 2.6), `README.md`, `docs/plan.md`, las guías del equipo y las skills ya están alineados con este ADR (2026-11-13).
- **Portal de transparencia** ([ADR 0031](0031-producto-y-organizacion.md), consecuencias): se mantiene como idea y pasa a ser la vitrina de credibilidad de la agencia; se rediseña para todo público. Sigue fuera del alcance del 19 de diciembre.
- Este ADR no se reabre antes del 19 de diciembre de 2026: es el tercer planteamiento en dos semanas y el docente tutor ya observó la falta de foco.
