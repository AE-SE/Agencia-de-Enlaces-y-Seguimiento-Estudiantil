# 0040 — Avisos de servicios educativos en el sitio

Fecha: 2026-11-25 · Estado: aceptada (2026-11-25, por el líder) · Modifica: [ADR 0032](0032-agencia-independiente-y-publico-egresado.md) (las líneas «no vender avisos» y «sin avisos») · Relacionado: [ADR 0033](0033-cuenta-con-correo-sin-edad.md), [AGENTS.md 1, 2.2 y 2.5](../../AGENTS.md)

## Contexto

El ADR 0032 dejó un solo ingreso: informes de datos y asesorías a pedido. El Entregable Parte I descartó los avisos (tablas 4.2 y 8.4) porque «quien avisa compraría visibilidad». En la revisión del Entregable Parte I, el docente tutor observó dos cosas: el precio del informe no estaba defendido con un análisis de mercado, y la parte de ingresos debía volver a considerar publicidad en el sitio.

El problema de fondo es que el único ingreso es una hipótesis: ninguna organización ha encargado un informe. Si no se vende ninguno, el sitio queda sostenido solo con las horas de los socios.

El riesgo que hizo descartar los avisos sigue vigente: un anunciante que compra un lugar junto a la información de carreras puede torcer la decisión de la persona, o parecer que la tuerce. La independencia es lo que vende la agencia (ADR 0032). La pregunta es quién puede avisar, dónde y con qué datos, para que el aviso no compre un resultado.

El ADR 0032 dice que no se reabre antes del 19 de diciembre. Esta decisión no lo reabre: cambia una línea, a pedido del docente, y deja intactos el público, el problema, la SpA y la neutralidad.

## Opciones evaluadas

- **A. Mantener el sitio sin avisos.** Pros: no hay ningún riesgo para la independencia. Contras: el ingreso sigue dependiendo de una sola hipótesis sin validar, y no responde a la observación del docente.
- **B. Red publicitaria automática (por ejemplo, avisos servidos por un tercero según el perfil de quien navega).** Pros: no hay que vender cada espacio; el ingreso escala con las visitas. Contras: carga código de terceros que rastrea a la persona entre sitios (perfilamiento) y la expone a la Ley 21.719 y a AGENTS.md 2.2; no se controla quién avisa, así que puede aparecer una institución de educación superior junto a su propia ficha; además hace más pesadas las páginas que se abren con datos limitados. **Descartada.**
- **C. Avisos de instituciones de educación superior.** Pros: son los anunciantes con más presupuesto del sector. Contras: comprarían visibilidad junto a la información que el sitio compara, que es justo lo que AGENTS.md 1 prohíbe. **Descartada.**
- **D. Avisos contratados a pedido del anunciante interesado, solo servicios educativos que no son instituciones de educación superior (preuniversitarios, preparación de pruebas y servicios afines), contextuales, sin rastreo, rotulados y fuera de las pantallas donde se compara o se decide (elegida).** Pros: diversifica el ingreso con un anunciante cuyo producto no compite con la información que el sitio muestra; no usa datos personales; el anunciante no puede influir en ningún orden ni dato. Contras: el ingreso depende de que algún anunciante llegue por su cuenta, y una persona que egresa podría leer un aviso de preuniversitario como recomendación del sitio. Esto último se mitiga con el rótulo y la ubicación (reglas 3 y 4).

## Decisión

Se elige la opción D, con estas reglas:

1. **Quién puede avisar.** Servicios relacionados con la educación que no son instituciones de educación superior: preuniversitarios, preparación de pruebas, ensayos y servicios afines. Quedan fuera las instituciones de educación superior y todo servicio que pertenezca a una de ellas (un preuniversitario de una universidad vende, en el fondo, esa universidad).
2. **Contextual y sin rastreo.** El aviso depende de la página, no de la persona. No se cargan scripts, cookies ni píxeles de terceros. El aviso es una imagen y un texto que se sirven desde el propio sitio, y el enlace al anunciante no lleva datos de la persona. Si se mide, se mide en forma agregada (cuántas veces se mostró), sin identificar a nadie y sin registrar direcciones IP. Rige completa la sección 2.2 de AGENTS.md.
3. **Rotulado.** Cada aviso dice «Publicidad» a la vista, antes del contenido del anunciante, y se distingue del contenido del sitio por su forma, no solo por el color. No usa el coral, que está reservado a la acción principal (AGENTS.md 2.5), ni imita una ficha, una cifra o un botón del sitio. Si el aviso fuera difícil de distinguir del contenido, el anunciante podría inducir a error, que es lo que prohíbe la Ley 19.496 sobre publicidad.
4. **Dónde va y dónde no.** Permitido, un aviso como máximo por página: portada, calendario de admisión y beneficios (`/beneficios`) y preguntas frecuentes. Prohibido: listado y ficha de carrera, comparador, simulador, meta y alternativas, mapa, ocupaciones, FUAS, la hoja de registro de la medición y Quiénes somos. En esas pantallas la persona compara o decide, y un aviso junto a «tu puntaje está bajo el corte» sería presión, no información.
5. **El anunciante no compra nada más.** No obtiene posición, mención, dato ni trato distinto. No revisa ni aprueba contenido del sitio. El sitio sí revisa cada aviso, solo para verificar las reglas 1 a 4. Se guarda el registro de quién compró cada aviso: ante publicidad falsa o engañosa, el tribunal puede exigir al medio la identificación del anunciante (Ley 19.496, art. 34). Esto queda escrito en el contrato del aviso, igual que para los clientes de informes.
6. **Gratis para la persona, siempre.** El aviso nunca condiciona el uso del sitio ni tapa contenido, y se puede seguir sin tocarlo.
7. **Precio.** El espacio se vende por mes (tarifa plana por página), no por persona alcanzada: sin rastreo no hay cómo cobrar por perfil. El valor y su análisis de mercado están en el Entregable, punto 9.1. `TODO(fuente)` hasta cerrar ese análisis.

## Justificación

- La opción D es la única de las cuatro que suma un ingreso sin usar datos personales y sin que nadie compre visibilidad sobre lo que el sitio compara. El anunciante vende preparación, no una carrera ni una institución, así que su interés no choca con los datos de la ficha.
- Sin código de terceros, la página sigue siendo liviana para quien entra desde el teléfono con datos limitados (AGENTS.md 2.6), y no hay que pedir consentimiento de cookies publicitarias.
- El rótulo y la ubicación responden al riesgo que hizo descartar los avisos en la Parte I: que el aviso se confunda con una recomendación del sitio.

## Consecuencias

- **AGENTS.md**: la sección 1 deja de decir «nada de anuncios» y remite a este ADR; la skill `revisar-pr` revisa las reglas 1 a 5.
- **Sitio**: un componente de aviso que cumpla las reglas 2 a 4, sin anunciante real hasta que se firme el primer contrato. Mientras no haya anunciante, el espacio dice que está disponible, sin simular un aviso. «Quiénes somos» deja de decir «no tiene avisos» y explica estas reglas.
- **Entregable Parte I**: se corrigen las tablas 4.2 y 8.4, el lienzo del modelo de negocio (fuentes de ingresos), el valor de independencia y el punto 9.1. En la Parte II, los avisos entran en la segmentación, el proceso de ventas y las cinco fuerzas (cap. 8), y en la sostenibilidad económica (cap. 11).
- **Medición del 30 de noviembre al 4 de diciembre**: si el espacio ya está en el sitio, se registra si alguna persona confunde el aviso con contenido del sitio, dentro del mismo protocolo y consentimiento de la medición. Ese es el dato que dice si la regla 3 funciona.
- **Hipótesis sin validar**: que algún preuniversitario pague por el espacio. Se declara así, sin ingresos inventados.
- **Riesgo aceptado**: depender de anunciantes de preparación de pruebas puede tentar a suavizar lo que el sitio diga sobre ellos. Mitigación: el sitio no publica comparaciones de preuniversitarios.
