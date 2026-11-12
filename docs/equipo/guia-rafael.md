# Guía de Rafael · Líder de arquitectura

> **Para la IA que acompaña a Rafael:** este documento es la hoja de ruta del líder hasta el entregable del **19 de diciembre de 2026**. Antes de proponer cualquier cosa, lee `AGENTS.md`, `BITACORA.md`, `docs/entregable/Entregable_Parte_I.md` (puntos 3, 8, 9 y 10) y [`docs/decisiones/0031-producto-y-organizacion.md`](../decisiones/0031-producto-y-organizacion.md). Rafael decide y aprueba; tú propones, verificas y declaras lo que no pudiste comprobar. Lo que **no se delega** a otra herramienta: `lib/ia/`, las políticas de Row Level Security (RLS) y los consentimientos ([reparto](reparto.md)). Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`.

Estado verificado el **11 de noviembre de 2026** con `gh pr list` (solo lectura). La tabla de PR de la sección 3 se actualiza cada vez que se fusiona algo.

---

## 1. Qué se entrega el 19 de diciembre y qué te toca

Producto acordado (ADR 0031): sitio gratuito para estudiantes de 3.º y 4.º medio de liceos con financiamiento público (O'Higgins, Colchagua, sede San Fernando de AIEP) y un **panel interactivo de seguimiento para colegios**, solo de los estudiantes que lo autorizan. Organización: fundación sin fines de lucro en 2027; hasta el 19 de diciembre, proyecto de título, sin entidad.

**Tu rol:** arquitectura y privacidad. Eres **A (aprueba)** de todas las filas de la Tabla 3.8 y **R (ejecuta)** de dos: el panel de seguimiento con sus consentimientos y el informe final con la presentación.

| Tarea (Tabla 3.8) | Tú | Alejandro | Cristóbal |
|---|---|---|---|
| Datos oficiales y ficha de carrera (OE1) | A | I | R |
| Guía de trámites y calendario (OE2) | A | R | C |
| Panel de seguimiento y consentimientos (OE3) | **A/R** | R | I |
| Pruebas con estudiantes y profesionales | A | R | R |
| Informe y presentación | **A/R** | R | R |

**No te toca hacerlo tú** (pero sí revisarlo): pantallas, estilos y accesibilidad (Alejandro); datos oficiales, fórmulas y textos (Cristóbal).

**Riesgo del rol:** el proyecto avanza al ritmo de una sola persona si todo pasa por ti. Meta: ningún PR de Alejandro o Cristóbal pasa más de 3 días hábiles sin primera revisión.

---

## 2. Tu hoja de ruta (Tablas 3.7 y 3.10 del entregable)

| Fase (Gantt) | Semana | Tu parte | Criterio de aceptación | Estado al 11 nov |
|---|---|---|---|---|
| **F1 Datos y ficha de carrera (OE1)** | S1 y S2 (3 al 16 nov) | Aprobar y fusionar la ficha, el explorador, el comparador y la carga de oferta; base de datos y RLS | Ficha se abre en teléfono con fuente, enlace y fecha | Hecha en lo central: ficha en vivo desde Supabase, 11.364 carreras procesadas. Pendiente: confirmar 360 px y teclado en el sitio publicado |
| **F2 Guía de trámites del FUAS (OE2)** | S2 y S3 (10 al 23 nov) | Aprobar; verificar fechas del FUAS 2027 | Cada hito con fuente y fecha de vigencia (100 %) | Hecha en lo central: portada con acceso a plazos (PR 141, 146), calendario corregido (PR 142), guía según la situación (PR 152) |
| **F3 Panel de seguimiento (OE3)** | S3 y S4 (17 al **27 nov**, congelamiento de funciones) | **Diseñar y programar** el panel con datos ficticios; **consentimiento y aislamiento** con pruebas | Panel muestra meta y avance y quién necesita apoyo; el colegio pierde el acceso al revocar; pruebas aprobadas (I-OE3b 100 %) | **Pendiente.** Hay propuesta (PR 153, abierto) y tablas en la base; falta la interfaz, la meta de carrera, el resumen para el docente y la prueba de revocación |
| **F4 Validación** | S4 (24 al 30 nov) | Consentimientos y autorizaciones; aprobar el informe de la prueba | 5 estudiantes y 2 profesionales; menores con autorización del tutor | Pendiente: el reclutamiento depende de ti (colegios, carta formal) |
| **F5a Fusión y correcciones** | Mar 1 dic y 1 al 4 dic | Fusionar todo a `main`; revisar las ramas `fix/…` de la prueba de uso | Ningún PR de función abierto el 1 dic; hallazgos graves corregidos el 4 dic | Pendiente |
| **F5b Pruebas y privacidad** | 7 al 11 dic | Revisión de privacidad; repetir las pruebas de consentimiento y aislamiento sobre `main`; revisar mejoras leves | Pruebas 100 % aprobadas; sin datos personales en URL, logs ni analítica | Pendiente |
| **F5c Informe** | 14 al 17 dic | Informe final; último PR de código el mar 15 dic | Sin marcas `[COMPLETAR]`; cifras coinciden con la prueba y los datos | Pendiente |
| **F5d Cierre** | 18 y 19 dic | Revisión final y presentación (Tabla 3.10, fila OG) | Entrega completa | Pendiente |

### Hitos con fecha

| Fecha | Qué debe estar | Verificación |
|---|---|---|
| **Lun 16 nov** | Cierre de F1: ficha con fuente en teléfono | Revisión en el sitio publicado |
| **Lun 23 nov** | OE1 completo (I-OE1a 100 %): ficha, puntaje ponderado con pruebas (simulador, PR 132) y arancel y beneficio visibles. **Clave de Gemini en el nivel pagado** (ADR 0004) antes de cualquier prueba con personas | Revisión por muestra de las cifras |
| **Lun 23 nov** | Carta a colegios enviada y 7 participantes confirmados (invitar a más de los necesarios) | Lista sin nombres en el repositorio |
| **Vie 27 nov** | Congelamiento de funciones: OE2 y OE3 completos, con pruebas automáticas de consentimiento y aislamiento aprobadas | Informe de las pruebas automáticas |
| **Lun 30 nov** | Prueba de uso terminada (24 al 30); hallazgos con gravedad | Lista de hallazgos |
| **Mar 1 dic** | Todo fusionado a `main` y publicado | `main` pasa lint, pruebas y `tokens.py --check` |
| **Vie 4 dic** | Hallazgos graves de la prueba corregidos | Revisión de las ramas `fix/…` |
| **Vie 11 dic** | Revisión de privacidad hecha; pruebas 100 % aprobadas sobre `main` | Informe corto de la revisión |
| **Mar 15 dic** | Último PR de código fusionado | `main` sin PR de código abiertos |
| **Jue 17 dic** | Informe final y presentación listos | Sin marcas pendientes |
| **Sáb 19 dic** | Informe final y presentación | Entrega |

---

## 3. Estado de los PR (verificado el 11 de noviembre)

**Fusionados desde el 9 de noviembre** (los más relevantes para el entregable): oferta y datos (PR 95, 97, 98, 99, 103, 109, 116, 117, 118, 121, 126, 127, 128, 144), tablero interno y pronósticos (PR 77, 79, 129), rendimiento de RLS (PR 86), flujo de tutor (PR 82), validación del Puntaje Ranking (PR 61, de Cristóbal), beneficios y calendario, comparador y componentes de Alejandro (PR 49, 57, 69), propuesta general y versión para liceos (PR 143), calendario y portada del FUAS (PR 141, 142, 146), hoja de decisión (PR 150), guía del FUAS (PR 152), tokens de Andén urbano (PR 151, de Cristóbal) y alineación visual (PR 154).

**Abiertos y esperando una acción tuya:**

| PR | Qué es | Acción |
|---|---|---|
| **132** | Simulador de puntaje (Alejandro). La CI pasó el 11 nov | Revisar: es parte del cálculo de OE1 (fecha clave: 23 nov) |
| **96** | Cita de la fórmula oficial del ranking 2027 (Cristóbal) | Revisar en la ventana del viernes |
| **153** | Propuesta del panel de seguimiento escolar | Decidir el alcance (ver sección 5) |
| **155** | Reescritura del entregable y alineación de documentos | Revisar y fusionar |
| **149** | Bitácora de cierre del 11 de noviembre | Fusionar |
| **139** | ADR 0028 sobre la visibilidad del repositorio | Decidir |
| **140** | CI: reportar siempre los checks obligatorios en cambios de solo documentación | Revisar |

Cerrados sin fusionar (reemplazados por otros): PR 62 (por 92), 119 (por 121), 133 a 138 (por 142 a 147). No los reabras.

---

## 4. Tus tareas, en orden

| # | Tarea | Fecha | Criterio de aceptación | Estado |
|---|---|---|---|---|
| R1 | Revisar el PR 132 (simulador) y el PR 96 (ranking) | Vie 13 nov | Fórmula citada de DEMRE con página; casos oficiales pasan | Pendiente |
| R2 | Confirmar en el sitio publicado la ficha a 360 px y con teclado | Lun 16 nov | Sin desplazamiento horizontal; foco visible | Pendiente |
| R3 | **Decidir el alcance del panel** (PR 153) y escribir el ADR corto si cambia algo | Mié 18 nov | Alcance: ensayo oficial publicado por enlace y estimación comparada con la meta de la carrera, meta de carrera, resumen para el docente. Lo demás, escalabilidad | Pendiente |
| R4 | **Consentimiento del estudiante** (ADR 0015) en la interfaz: sin casillas premarcadas, por finalidad, revocable; flujo del tutor para menores (ADR 0022) | Vie 20 nov | El menor no se autoriza a sí mismo; revocar quita el acceso del colegio | Base de datos hecha; interfaz pendiente |
| R5 | **Panel de seguimiento** con datos ficticios, marcado «Datos de demostración» | Lun 23 nov (primera versión), **Vie 27 nov** (final) | Muestra meta y avance de cada estudiante y quién necesita apoyo y por qué; solo de quienes autorizan; grupos pequeños sin cifra | Pendiente |
| R6 | **Pruebas automáticas de consentimiento y aislamiento** (I-OE3b) | Vie 27 nov | 100 % aprobadas; incluyen revocación y un colegio que no ve a otro | Aislamiento por institución probado; consentimiento pendiente |
| R7 | Pasar Gemini al nivel pagado y verificar variables del despliegue (`GEMINI_API_KEY`, `GEMINI_MODELO`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) | Lun 23 nov | Ninguna clave en el repositorio | Pendiente |
| R8 | **Reclutar** a 5 estudiantes y 2 profesionales de colegios; carta formal; autorizaciones de tutores guardadas fuera del repositorio | Lun 23 nov | 7 confirmados | Pendiente |
| R9 | Sesión de validación del panel con los 2 profesionales | 24 al 30 nov | 2 de 2 identifican a quién apoyar en un caso ficticio (I-OE3a) | Pendiente |
| R10 | Completar el entregable con los resultados de la encuesta, las entrevistas y la prueba de uso (los `[COMPLETAR]`) | 4 dic (primer borrador) y 17 dic (final) | Sin marcas pendientes | Pendiente |
| R12 | **Fusionar todo a `main`**: revisar y fusionar cada PR de función abierto; decidir qué pasa a proyección | Mar 1 dic | Ningún PR de función abierto; `main` pasa lint, pruebas y `tokens.py --check` | Pendiente |
| R13 | **Revisión de PR** de las correcciones y mejoras leves (martes y viernes) | 1, 4, 8, 11 y 15 dic | Cada PR con primera revisión en la ventana; una mejora leve no agrega pantallas, tablas ni dependencias y no toca consentimiento ni aislamiento | Pendiente |
| R14 | **Revisión de privacidad** sobre `main`: campos personales justificados, menores con autorización del tutor, sin datos personales en URL, logs, errores ni analítica; repetir las pruebas de consentimiento y aislamiento | Vie 11 dic | Pruebas 100 % aprobadas; el colegio pierde el acceso al revocar; informe corto con lo verificado | Pendiente |
| R15 | **Verificar el panel** con datos ficticios tras las correcciones: etiqueta «Datos de demostración», solo estudiantes que autorizan, grupos pequeños sin cifra | Vie 11 dic | Sin cambios en el comportamiento de consentimiento después del 27 nov | Pendiente |
| R11 | Informe final y presentación (ensayo el 17 dic; revisión final el 18) | 19 dic | Entrega completa | Pendiente |

---

## 5. Qué quedó fuera del alcance del 19 de diciembre, y por qué

Se conserva la historia (los ADR no se borran); no se construye ni se promete:

| Fuera del alcance | Por qué | Dónde queda |
|---|---|---|
| Permanencia en educación superior y pulso de check-in | Exige profesionales y evidencia que el equipo no tiene; se descartó como objetivo (entregable 3.1) | ADR 0010, `docs/evidencia-permanencia.md` (proyección) |
| Predicción o riesgo de deserción | Sin evidencia ni capacidad; nunca se promete predicción (AGENTS.md 2.4) | ADR 0012 y 0013 (historia) |
| Panel para instituciones de educación superior | El cliente es el colegio o sostenedor, no la institución de educación superior (ADR 0031) | Proyección |
| Pruebas propias de ensayo por colegio | Escalabilidad; hoy solo se enlaza una prueba oficial publicada | Proyección |
| Portal de transparencia (tablero de pronósticos rediseñado) | Idea acordada el 11 nov; falta diseñarlo; los datos son del Estado y el aporte es el proceso | ADR 0031, consecuencias; no entra al 19 dic |

Decisiones que solo tú tomas: aceptar los ADR propuestos que sigan abiertos, la excepción de licencia MPL-2.0 de axe-core (ADR 0021), el respaldo de los códigos DEMRE 17074 y 32012, la forma jurídica (con validación de un abogado antes de constituir) y los plazos `TODO(profesional)` y `TODO(legal)` de alertas y derechos.

---

## 6. Riesgos abiertos (Tabla 3.12 del entregable)

- **No se consiguen 5 estudiantes y 2 profesionales** (impacto alto). Control: invitar a más y enviar la carta formal. Plan B: 5 personas mayores de 18, declarando muestra por conveniencia.
- **CPU de Cloudflare:** la mediana medida es de 29,47 ms frente al límite de 10 ms del plan gratuito (reserva 2 del ADR 0003). Confirmar el límite vigente. Plan B: demostración grabada.
- **Revisión profesional de contenidos y del protocolo de crisis:** solicitarla en la semana 3. Sin ella, el contenido va con la nota «pendiente de revisión profesional». El documento de una página está en `docs/revision-profesional-una-pagina.md`.
- **Respuesta de Mineduc a la solicitud sobre el FUAS** (folio AJ025T0003786): vence cerca del 2 de diciembre; si no llega, la cifra se declara como no disponible.
- **Ley 21.719 (vigencia prevista el 1 de diciembre de 2026):** los artículos que se citen salen de la ley publicada, no de resúmenes. Verificar antes de citar.

---

## 7. Cómo revisas un PR

1. Ventanas de revisión: **martes y viernes**. Un PR abierto antes de la ventana se revisa en ella. Detalle en [`docs/protocolo-revision-prs-equipo.md`](../protocolo-revision-prs-equipo.md).
2. Claude revisa con la pauta [`revisar-pr`](../../.claude/skills/revisar-pr/SKILL.md) y te entrega el informe. Tú confirmas o rechazas.
3. Con tu confirmación, Claude aplica los arreglos acordados y fusiona a `main` en un solo commit.
4. Si Claude es autor de la rama, lo declara en el informe y tú revisas además lo subjetivo (lo visual, los textos).
5. Cada encargo al equipo se manda por escrito, con la fecha de cada paso, y se cierra con lo que hay que arreglar antes de la próxima ventana.

---

## 8. Errores que ya pasaron y no deben repetirse

Tomados de la [bitácora](../../BITACORA.md).

- **Cambiar un dato por una nota sin mirarlo en la fuente:** pasó con la empleabilidad de Derecho y se revirtió.
- **Apilar PR de documentación:** nunca corrieron su CI. Ábrelos todos contra `main`.
- **Duplicar lógica al resolver conflictos con `-X theirs`:** pasó con `lib/datos/ruta.ts` y `fechas.ts`.
- **Contar como revisión independiente la que hace el propio autor de la carga:** pasó con la fila 12070 del DEMRE.
- **Confiar en la respuesta de una herramienta de IA sin verificarla:** Antigravity se equivocó con el adaptador de Cloudflare y Codex se colgó horas esperando una entrada.
- **Sumar documentos mientras el producto no avanza:** el 5 de noviembre, cinco commits seguidos fueron de documentación y el portal tenía una sola página. A 3 semanas del cierre, lo que falta es el panel, no más texto.
- **Citar fuentes que no son oficiales, primarias o académicas:** prensa y resúmenes de terceros no son fuente de ningún dato ni artículo de ley.

---

## Anexo histórico: lo que ya se hizo (3 al 10 de noviembre)

Se conserva para el informe de título; no son tareas vigentes. Todo aplicado en Supabase (São Paulo).

| Área | Qué quedó hecho | Referencia |
|---|---|---|
| Reglas del proyecto | `AGENTS.md`, skills, plantilla de PR, CI de verificación, repositorio en la organización AE-SE | PR 6; ADR 0008 |
| Base de datos y privacidad | Esquema con RLS y pruebas en CI; alertas y derivación; derechos del titular; nota de cierre estructurada; flujo de tutor; rendimiento de políticas e índices | PR 3, 25, 23, 46, 72, 73, 81, 82, 86; ADR 0002, 0011, 0014, 0015, 0019, 0020, 0022 |
| Asistente IA | Protocolo de crisis con pruebas (\*4141 y 600 360 7777), proveedor de IA tras una interfaz, limpieza de datos personales, endpoint y registro de alertas | PR 8, 9, 11, 12, 13, 74; ADR 0004 |
| Datos oficiales | Cargas de oferta (Mineduc), empleabilidad e ingresos (SIES), ponderaciones y vacantes (DEMRE 2027, corregida y verificada); lotes SQL; el portal lee la base; celdas suprimidas con nombre y sin cifra | PR 39, 40, 43, 45, 92, 95 a 99, 103, 121; ADR 0025 |
| Portal | Despliegue en Cloudflare con OpenNext, ficha, explorador, consulta por región y comuna, comparador con medida comparativa, indicador de etapas, pie común, pruebas de accesibilidad (Playwright y axe-core) | PR 32, 35, 36, 38, 76, 104 a 108, 110, 116 a 118, 128; ADR 0003, 0021, 0023 |
| Pronóstico (uso interno) | Plan de análisis, pronósticos 2027-2028, tablero interactivo y manual. La página pública se retiró por ser de uso interno | PR 77, 79, 89, 129; ADR 0016 a 0018 |
| Documentos | Entregable Parte I, encuesta con instrumento único, verificación de cifras, propuestas general y para liceos | PR 24, 29, 30, 51, 71, 111, 112, 143 |
| Coordinación | Guías del equipo, reparto, protocolo de revisión de PR | PR 31, 55, 63 a 65, 131 |
