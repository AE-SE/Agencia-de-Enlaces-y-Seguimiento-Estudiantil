# Análisis de mercado — seguimiento estudiantil en educación superior (Chile)

Fecha de la primera versión: 2026-11-07 · Estado: en construcción

Este documento separa **datos verificados en fuente oficial** de **hipótesis** y **datos sin verificar**. Cada cifra lleva fuente, URL y fecha de consulta, como exige AGENTS.md 2.1. Lo que no tiene fuente no se usa.

## 1. Datos verificados

### 1.1 Matrícula 2025

Fuente: Subsecretaría de Educación Superior, con datos del SIES. Comunicado del 14-jul-2025. https://educacionsuperior.mineduc.cl/2025/07/14/5-anos-de-crecimiento-sostenido-matricula-en-educacion-superior-crecio-un-5-respecto-al-2024/ (leído el 2026-11-07).

| Indicador | Valor |
|---|---|
| Instituciones vigentes | 132 (58 universidades, 31 IP, 43 CFT) |
| Matrícula total 2025 | 1.455.639 (+5 % respecto de 2024) |
| Matrícula de pregrado 2025 | 1.327.344 (+3,9 %) |
| Pregrado en universidades | 731.981 (55,1 % del pregrado) |
| Pregrado en IP | 442.924 (33,4 %) |
| Pregrado en CFT | 152.439 (11,5 %) |

### 1.2 Retención de primer año, cohorte 2022

Fuente: SIES, *Informe de Retención de 1er año de Pregrado, Cohortes 2018-2022*, agosto 2023. https://bibliotecadigital.mineduc.cl/bitstream/handle/20.500.12365/21395/Retencion_de_Pregrado_2023_SIES.pdf (texto extraído del PDF el 2026-11-07; tabla 1, página 8).

| Tipo de institución | Retención de 1er año | Estudiantes de la cohorte |
|---|---|---|
| Universidades | 81,6 % | 127.274 |
| IP | 72,1 % | 124.967 |
| CFT | 71,7 % | 54.590 |
| **Total** | **76,0 %** | **306.831** |

Otros datos del mismo informe:

- Carreras profesionales: 80,4 %. Técnicas: 70,0 %.
- Estudiantes **con** beneficios (gratuidad, becas o créditos): 82,0 %. **Sin** beneficios: 66,5 %. Diferencia de 15,5 puntos.

**Advertencias:**

1. El texto de la página 6 invierte IP y CFT. La tabla 1 y la página 10 dan CFT 71,7 % e IP 72,1 %. Se usan esas.
2. La diferencia por beneficios es una **asociación**, no un efecto causal. Quienes reciben beneficios suelen tener menos recursos, y la comparación no controla por esa diferencia.
3. El informe es de agosto 2023 y mide la cohorte 2022. Hay que buscar una versión más reciente.

### 1.3 Lectura de estos datos

- IP y CFT concentran **179.557 de 306.831 ingresos (58,5 %)** y tienen la retención más baja. Ese segmento es el de mayor volumen de deserción de primer año.
- Un servicio que solo se venda a universidades llega a menos de la mitad de los ingresos nuevos.

## 2. Competidores (sin verificar)

Fuentes: resultados de búsqueda y sitios de los proveedores, leídos el 2026-11-07. Ninguna cifra de este apartado está verificada.

| Proveedor | Qué ofrece (según su sitio o prensa) | Enfoque | Clientes mencionados |
|---|---|---|---|
| Foris (SATD) | Sistema de alerta temprana de deserción | Predictivo, con indicadores históricos | Implementación pública en la UCN |
| Scitis (EduCore-Retention) | Plataforma de retención | Modelos predictivos ajustables | 25 años de experiencia declarados |
| U-Planner | Software contra la deserción | Algoritmos e inteligencia artificial | Más de 40 instituciones, incluida la UC (nota de prensa) |
| Bettersoft (U+ Alerta Temprana) | Inteligencia de negocios aplicada | Variables que predicen abandono en alumnos nuevos | Sin datos |
| Psicometrix | Indicadores de motivación y autoestima | Predice deserción por perfil | Sin datos |

**Implicancia:** ya existe oferta, y casi toda se vende como predicción. ADR 0010 descarta la predicción, así que la diferenciación posible está en el consentimiento, la derivación y el seguimiento de beneficios. Esa diferenciación hay que validarla con instituciones, no asumirla.

**No usar:** la cifra de 28,8 % de deserción de primer año que cita Psicometrix. Viene de informes antiguos y no coincide con los datos oficiales.

## 3. Lo que falta

| Pendiente | Por qué importa | Estado |
|---|---|---|
| Precios de competidores | Sin precio no se puede estimar el mercado en pesos | Delegado (ver sección 4) |
| Licitaciones públicas de sistemas de alerta temprana | Son la única fuente pública de montos pagados por instituciones chilenas | Sin resultados en la primera búsqueda (Mercado Público) |
| Detalle por institución y carrera | Permite identificar a qué instituciones dirigirse | Pendiente: mifuturo.cl estaba fuera de servicio |
| Disposición a pagar | Es lo que convierte el análisis en decisión | Requiere preguntar a instituciones reales |
| Cifras de retención más recientes | La cohorte 2022 es la última leída | Pendiente |

## 4. Resultados de la búsqueda de compras y precios

Todo lo de esta sección se leyó en la página fuente o se verificó con una segunda lectura. Antigravity no produjo resultados: su búsqueda en Mercado Público quedó bloqueada por permisos del modo headless. La búsqueda se hizo directamente, sobre agregadores que reproducen las fichas de Mercado Público (todolicitaciones.cl, ganalicitaciones.cl). No se pudo acceder al buscador oficial de mercadopublico.cl.

### 4.1 Licitación de una plataforma de permanencia en un CFT (la señal más relevante)

- **Título:** "Adquisición e implementación de plataforma" (código omitido).
- **Comprador:** CFT estatal de una región del norte (nombre omitido: no hay autorización para nombrarlo).
- **Objeto:** "plataforma de gestión estratégica de la permanencia estudiantil", SaaS, con implementación, integración, soporte y mantención. Describe la gestión de la retención, el seguimiento de la progresión y la trayectoria académica.
- **Estado:** **desierta** (declarada desierta conforme al artículo 3 o 9 de la Ley 19.886). No hubo adjudicación.
- **Monto:** entre 100 y 1.000 UTM, en CLP. No hay monto adjudicado.
- **Ofertas:** 2 empresas ofertaron. Sus nombres están reservados a suscriptores.
- **Fuente:** ficha pública de Mercado Público, leída el 2026-11-07 (enlace omitido para no identificar al comprador).

**Lectura:** un comprador público de educación superior técnica buscó exactamente este producto, y dos empresas se presentaron. La licitación se declaró desierta, así que no sabemos si no cumplía requisitos, si el precio era insuficiente o si las ofertas no se ajustaban a las bases. Esa es la pregunta que hay que responder antes de decidir un precio.

**Nota:** existe otra licitación del mismo comprador, "Plataforma de gestión estratégica", en estado cerrada. No la leí.

### 4.1.1 Bases oficiales (ficha, CSV y bases técnicas, entregadas por el líder el 2026-11-07)

Fuentes: ficha de Mercado Público y exportación CSV de la licitación, y el documento "Bases Técnicas de Licitación Pública" del mismo proceso. Son fuentes primarias.

**Cronograma:** publicación 11-ago-2026; cierre de ofertas 1-sep-2026; apertura técnica 2-sep-2026; adjudicación prevista 11-sep-2026. La ficha dice que, si llegaban dos o menos ofertas, el cierre se ampliaba dos días hábiles por una sola vez.

**Estado:** desierta. La ficha no indica la causal ni el motivo, y el documento no lo explica.

**Comprador:** CFT estatal regional (nombre omitido), unidad de compras, con sedes en dos comunas. El CSV registra **2 reclamos por incumplir plazo de pago** en los últimos 12 meses. Es un dato del comprador, no un juicio sobre el proceso.

**Monto:** la ficha estima el monto según "presupuesto disponible", en CLP, entre 100 y 1.000 UTM. Las bases fijan el fiel cumplimiento en "10 % del valor total anual del contrato, esto es, la suma aproximada de $1.370.000". Eso implica un **valor anual de unos $13.700.000 CLP**. Es una cifra derivada del texto, no un precio publicado. Las mismas bases dicen "5 %" en el cuadro de garantías, así que hay una inconsistencia que no resolví.

**Contrato:** 12 meses, prorrogable por hasta 12 meses. Pago a 30 días contra recepción conforme de la factura. Se permite subcontratar.

**Criterios de evaluación:** precio 30 %; calidad técnica 30 %; experiencia 15 %; servicio y asistencia técnica 15 %; cumplimiento de requisitos 5 %; plazo de entrega 5 %. Puntaje mínimo para adjudicar: 60.

**Requisitos habilitantes**, es decir, que si faltan la oferta queda inadmisible:

1. **Integración con U+** por API, ETL o servicios web, con un **certificado del proveedor de U+** que acredite la integración. Esto es un requisito de admisión, no un punto de evaluación.
2. Ninguna otra dimensión está marcada como habilitante en el texto de las bases técnicas. Las demás exigencias son de cumplimiento, con multas.

**Requisitos funcionales relevantes para nosotros:**

- **Analítica predictiva** para identificar factores de riesgo de progresión, retención y permanencia, con alertas configurables. **Esto contradice ADR 0010**, que descarta la predicción. El comprador la pide explícitamente.
- Herramientas de IA para consultas en lenguaje natural, reportes automáticos y visualizaciones.
- SSO institucional, auditoría por usuario, trazabilidad de derivaciones, agendamiento y encuestas.
- Cumplimiento de Ley 19.628 y Ley 21.719, con TLS 1.2 o superior y respaldo diario con retención de 90 días. Informar brechas de seguridad dentro de 2 horas.
- Disponibilidad de 99 % mensual, respuesta de sistema de 5 segundos o menos, y soporte con tiempos de respuesta de hasta 24, 48 y 90 horas según la gravedad.
- Programa de Integridad y Ética Empresarial (PIEE) vigente.
- Multas en UF por incumplimiento de cada estándar.

**Lectura para el análisis:**

1. **El requisito de U+ es un filtro fuerte.** Solo quien tenga el certificado del proveedor de U+ puede ofertar, o quien tenga un convenio con él. Eso reduce la competencia y puede explicar por qué la licitación quedó desierta, aunque no hay prueba de eso.
2. **El comprador quiere predicción.** Los competidores que venden predicción están alineados con lo que pide. Nuestra propuesta sin predicción no cumple las bases, y ADR 0010 tendría que revisarse si quisiéramos competir en esta clase de compra.
3. **El monto implícito es bajo para lo que se pide.** Unos $13,7 millones al año para una plataforma con IA, integración, SSO y SLA es un techo, no un precio de mercado. Hay que compararlo con la oferta de Bettersoft antes de sacar conclusiones.

### 4.2 Precio de referencia de un proveedor (Bettersoft / U+)

- Dirección General de Aeronáutica Civil, Escuela Técnica Aeronáutica: "Servicio de soporte técnico plataforma U+ ETA 2026", adjudicada a Bettersoft Consultores SpA por **$11.900.000 CLP** (monto total). Fuente: https://www.todolicitaciones.cl/licitacion/2251-3-LE26/servicio-de-soporte-tecnico-plataforma-u-eta-2026 (leída el 2026-11-07).
- **Limitación:** es soporte anual de la plataforma académica U+, no el módulo de alerta temprana, y el comprador es una escuela de aeronáutica, no una institución de educación superior de retención. No sirve como precio del servicio que proponemos, pero sí como referencia de cuánto pagan los organismos públicos por soporte de software académico.

### 4.3 Clientes confirmados en fuentes primarias

- **Facultad de Ingeniería, Universidad de Concepción (2019):** implementación de U-Planner con el módulo "U Retention", que detecta alumnos en riesgo de deserción y genera alertas tempranas. Piloto con 28 académicos, 48 asignaturas y más de 1.300 alumnos. Fuente: https://fi.udec.cl/u-planner-partio-esta-semana-en-la-fi-udec/ (leída el 2026-11-07). Es el único cliente chileno de alerta temprana verificado en una fuente de la propia institución.
- **Otros clientes de Foris, Scitis, Nimbi o Prosigue** (incluida la Universidad del Alba, la USEK, la UCN y la UNIACC): no verificados en fuentes primarias. Las fuentes que citó Codex son PDFs que no pudieron extraerse como texto.

### 4.4 Precio de U-Planner (no vigente)

- **US$5 por alumno** es un acuerdo de 2020 con universidades públicas de Perú, financiado por el BID. Fuente: https://www.df.cl/df-mas/punto-de-partida/la-ed-tech-que-cambio-el-excel-por-inteligencia-artificial (texto leído el 2026-11-07). **No es una tarifa chilena ni vigente.**

### 4.5 Lo que no se encontró

- **Adjudicaciones de Foris, Scitis, U-Planner, Nimbi o Prosigue** en licitaciones públicas chilenas: ninguna.
- **Precio de lista** de ningún proveedor: ninguno publicado.
- **Licitaciones adjudicadas de alerta temprana en universidades:** ninguna. La única licitación de alerta temprana encontrada es de una municipalidad (Angol) y no es de educación superior.

### 4.6 Qué cambia el análisis

1. **Hay demanda pública explícita por el producto**, en un CFT, que es el segmento con menor retención (ver sección 1.3). Eso es más fuerte que la presencia de competidores.
2. **La licitación quedó desierta.** Es una señal de que la oferta no cumplió, o de que el precio o el alcance no calzaron. Antes de cotizar hay que averiguarlo: las bases del proceso, la resolución de declaración desierta y la razón.
3. **El precio sigue sin estimarse** con una fuente confiable. La banda de 100 a 1.000 UTM de la licitación desierta es el rango más cercano que tenemos, y sirve como estimación del presupuesto de un CFT, no del precio de venta.

## 5. Preguntas para entrevistas

*(Pendiente. Las entrevistas a DAE y vicerrectorías complementan los datos, no los reemplazan.)*
