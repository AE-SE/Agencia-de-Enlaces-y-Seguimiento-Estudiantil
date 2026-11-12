# Guía de Alejandro · Interfaz y diseño

> **Para la IA que acompaña a Alejandro:** este documento es tu hoja de ruta hasta el entregable del **2 de diciembre de 2026**. Antes de proponer cualquier cosa, lee `AGENTS.md`, `docs/equipo/README.md`, `docs/diseno.md` (base visual **Andén urbano**, ADR 0029) y la skill indicada en cada tarea. Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`. Si una tarea te pide inventar un dato, un color o una medida, detente y pregunta.

Estado verificado el **11 de noviembre de 2026** con `gh pr list` (solo lectura).

---

## 1. Qué se entrega y qué te toca

El producto del 2 de diciembre (ADR 0031, Entregable Parte I): un sitio gratuito para estudiantes de 3.º y 4.º medio de liceos con financiamiento público y un **panel interactivo de seguimiento para colegios**. Tu rol es **interfaz**: todo lo que el estudiante y el docente ven y tocan, en cualquier teléfono y con cualquier conexión.

Según la Matriz RACI (Tabla 3.8) y los entregables (Tabla 3.10), tú eres:

| Tarea | Tu papel | Entregable y criterio de aceptación | Fecha |
|---|---|---|---|
| Guía de trámites y calendario del FUAS (OE2) | **R** (Rafael aprueba; Cristóbal, consultado) | Cada hito con fuente y fecha de vigencia | 30 nov |
| Panel de seguimiento y consentimientos (OE3) | **R** (con Rafael) | Panel con datos ficticios que muestra meta y avance de cada estudiante y qué estudiantes necesitan apoyo; el colegio pierde el acceso al revocar | 30 nov |
| Pruebas con estudiantes y profesionales | **R** (con Cristóbal) | Informe de la prueba: tareas, resultados, hallazgos y limitaciones | 2 dic |
| Informe y presentación | **R** (con Cristóbal; Rafael aprueba) | Entrega completa | 2 dic |
| Indicadores I-OG, I-OE1b, I-OE2a (Anexo 3.A) | Responsable | 16 de 20 tareas sin ayuda; 4 de 5 identifican puntaje, arancel y beneficio; 4 de 5 identifican el próximo plazo del FUAS | 30 nov |

**No te toca** (pídeselo a quien corresponde): datos oficiales, fórmulas y textos finales → Cristóbal. Base de datos, autenticación, RLS, consentimientos en la base, asistente IA y claves → Rafael. Las fórmulas de puntaje las usas, no las escribes.

---

## 2. Tu hoja de ruta, semana por semana (Gantt, Tabla 3.7)

| Semana | Qué entregas | Criterio de aceptación |
|---|---|---|
| **S2 (10 al 16 nov)** | Cerrar el simulador (PR 132); probar la ficha y el comparador a 360 px, con teclado y lector de pantalla | La ficha de una carrera real se ve en el teléfono con fuente y fecha (lunes 16) |
| **S3 (17 al 23 nov)** | **OE1 completo:** ficha con puntaje ponderado, arancel y beneficio aplicable bien visibles; simulador fusionado. Pantallas de consentimiento (T4) | Un estudiante identifica los tres datos sin ayuda (4 de 5 en la prueba); 100 % de los datos con fuente (lunes 23) |
| **S3 y S4** | **OE2:** revisar la guía de trámites y el calendario del FUAS a 360 px, con el próximo plazo visible en la portada | Se identifica el próximo plazo del FUAS en menos de un minuto (T3) |
| **S3 y S4 (17 al 30 nov)** | **OE3:** pantallas del panel de seguimiento con datos ficticios, marcadas «Datos de demostración». Primera versión lunes 23 | Ver sección 4, tarea A12 |
| **S4 (24 al 30 nov)** | Aplicar la **prueba de uso** con Cristóbal; corregir con ramas `fix/…` lo que falle; auditoría de accesibilidad | 16 de 20 tareas completadas sin ayuda (sección 5) |
| **Cierre (1 y 2 dic)** | Informe de la prueba y presentación | Entrega el 2 de diciembre |

---

## 3. Estado de tus tareas (según los PR)

| Tarea | Estado | Referencia |
|---|---|---|
| A1 a A4 · Proyecto Next.js como PWA, tipografías, componentes base y despliegue en Cloudflare | **Hechas y fusionadas** (histórico) | PR 15, 28, 32, 49, 52 |
| A5 · Ficha de carrera, A6 · Explorador | Fusionadas; rediseñadas con el líder (explorador más ancho, resultados primero, consulta por región y comuna) | PR 35, 36, 104 a 110, 116 a 118, 128 |
| A7 · Comparador | **Fusionado** | PR 57, 67, 68 |
| A11 · Beneficios y calendario | **Fusionado** | PR 69 |
| Hoja de decisión y guía del FUAS según la situación | Fusionadas (hechas por el líder con Claude; tú las revisas a 360 px) | PR 150, 152 |
| **A8 · Simulador de puntaje (pantallas)** | **Abierto:** la CI pasó el 11 de noviembre y espera revisión del líder | **PR 132** |
| A9 · Pantalla del asistente | **Fuera del alcance del entregable.** No está en las Tablas 3.7 ni 3.10; no la empieces salvo que el líder la pida | — |
| A10 · Consentimientos (T4) | Pendiente | — |
| A12 · Panel de seguimiento (pantallas) | Pendiente | PR 153 (propuesta, abierta) |
| A13 · Auditoría de accesibilidad | Pendiente | — |
| A14 · Prueba de uso | Pendiente | Sección 5 |

**Próximos pasos, en orden:**
1. Si el líder pide cambios en el PR 132, respóndelos en la misma rama.
2. Prueba la ficha, el comparador, la guía del FUAS y la hoja de decisión del sitio publicado a 360 px, con teclado y lector de pantalla. Anota los fallos ordenados por gravedad y pásalos al líder.
3. Empieza A10 y A12 solo cuando el líder fije el alcance del panel (miércoles 18). Mientras, avanza con la auditoría.

---

## 4. Tareas pendientes, con criterios de aceptación

### A8 · Simulador de puntaje (pantallas) · PR 132
**Skills:** `mapa-de-trayecto`, `lenguaje-claro` · **Fecha:** fusionado antes del lunes 23 nov

Las fórmulas viven en `lib/calculos/2027/` (Cristóbal). Tú solo las llamas.
- [ ] Mensaje correcto: «El año pasado el último matriculado tuvo X. Con tus puntajes simulados tendrías Y.» Nunca «quedas» o «no quedas».
- [ ] Si la persona no ha rendido la prueba, la simulación avisa que es estimación.
- [ ] Rangos válidos y errores que dicen cómo corregir.
- [ ] Nada se guarda si la persona no inició sesión.
- [ ] El puntaje ponderado de una carrera se ve junto a su arancel y beneficio aplicable (es lo que mide I-OE1b).

### A10 · Consentimiento: «decidir qué compartir con el colegio y revocarlo» (T4)
**Skills:** `asistente-seguro`, `lenguaje-claro` · **Fecha:** viernes 20 nov (con Rafael, que hace la base de datos y la RLS)
- Consentimientos **separados y sin casillas premarcadas**, cada uno con explicación simple de qué se comparte, con quién y cómo revocarlo.
- El estudiante elige qué comparte (por ejemplo, su meta de carrera, su avance), y puede revocar en cualquier momento.
- Flujo para menores de 18: pedir los datos del adulto responsable; el menor **no se autoriza a sí mismo** (ADR 0022).
- Pantalla «Mis datos»: ver, descargar, corregir y eliminar.

**Criterios de aceptación:**
- [ ] Revocar en pantalla quita el acceso del colegio (lo verifica la prueba automática de Rafael).
- [ ] Un estudiante de prueba completa «compartir y revocar» sin ayuda (T4).
- [ ] 360 px, teclado y lector de pantalla.

### A12 · Panel de seguimiento para colegios (pantallas)
**Skills:** `mapa-de-trayecto`, `asistente-seguro`, `lenguaje-claro` · **Fechas:** primera versión lunes 23; final lunes 30 nov

Alcance acordado (ADR 0031 y propuesta del PR 153; el líder lo confirma el 18 de noviembre): meta vocacional de cada estudiante, su avance (ensayo con prueba oficial publicada, por enlace, y estimación comparada con la meta de la carrera) y un **resumen para el docente**. Solo de estudiantes que lo autorizan. Datos **ficticios** y etiqueta visible «Datos de demostración».

**Criterios de aceptación** (Tabla 3.10):
- [ ] Muestra meta y avance de cada estudiante.
- [ ] Muestra qué estudiantes necesitan apoyo **y por qué** (regla visible, por ejemplo «sin actividad en 5 días»; nunca «en riesgo» ni etiquetas que definan a la persona).
- [ ] Las alertas dicen «sin actividad» o «pidió ayuda», no «riesgo».
- [ ] Un grupo pequeño no muestra cifra (mínimo que fije el líder).
- [ ] Ningún ranking entre colegios.
- [ ] Tablas accesibles: encabezados reales (`<th>`), ordenables con teclado.
- [ ] Un profesional de colegio, en un caso ficticio, identifica a quién apoyar (I-OE3a, 2 de 2).

**Fuera del alcance** (escalabilidad): permanencia en educación superior, pulso de check-in, predicción o riesgo de deserción, panel para instituciones de educación superior, pruebas propias por colegio. No diseñes pantallas para ellos.

### A13 · Auditoría de accesibilidad y rendimiento
**Rama:** `fix/auditoria-final` · **Fecha:** del 16 al 23 nov una primera pasada; final antes de la prueba (24 nov)

Recorre **todas** las pantallas del entregable (ficha, explorador, comparador, simulador, hoja de decisión, FUAS y calendario, consentimiento, panel) y deja un informe en `docs/auditoria-accesibilidad.md`:

| Revisión | Herramienta | Meta |
|---|---|---|
| Automática | Pruebas Playwright con axe-core de la CI, axe DevTools, Lighthouse | 0 errores, Accesibilidad 100 |
| Teclado | Manual | Todo alcanzable y operable, foco siempre visible |
| Lector de pantalla | TalkBack (Android) y/o VoiceOver | Cada pantalla se entiende sin verla |
| Zoom | Texto del teléfono al 200 % | Nada se corta ni se superpone |
| Ancho mínimo | 360 px | Sin desplazamiento horizontal (salvo el comparador) |
| Rendimiento | Lighthouse móvil, «4G lenta» | 90 o más; menos de 3 s de carga |
| Modo oscuro | Teléfono en modo oscuro | Todo legible |

Corrige lo que encuentres y anota lo que quede pendiente. Cumple WCAG 2.2 nivel AA.

### A15 · Indicador de etapas del proceso en la portada
Hay una decisión pendiente del líder sobre **qué estaciones muestra el indicador** (con el alcance vigente, «Llegar» y «Avanzar» no tienen pantallas). **No cambies el indicador** hasta que la decida (ver `docs/diseno.md` y la skill `mapa-de-trayecto`). La función de fechas depende de `datos/calendario/` (tarea C14 de Cristóbal), que aún no existe.

---

## 5. Prueba de uso (24 al 30 de noviembre)

Eres el responsable de los indicadores **I-OG, I-OE1b e I-OE2a**. Cristóbal organiza las sesiones (guion en [`docs/pruebas-usuarios.md`](../pruebas-usuarios.md)); tú observas, anotas problemas de interfaz y los corriges.

**Muestra:** 5 estudiantes y 2 profesionales de colegios. Si un estudiante es menor de 18, se necesita autorización escrita de su tutor (guardada fuera del repositorio).

**Cuatro tareas centrales** (Anexo 3.A): T1 encontrar una carrera y leer su fuente y fecha; T2 identificar su puntaje ponderado, arancel y beneficio; T3 identificar el próximo plazo del FUAS; T4 decidir qué compartir con el colegio y revocarlo. 5 estudiantes × 4 tareas = 20; la meta es **16 sin ayuda (80 %)**.

**Antes del 24 de noviembre** deben estar fusionados: ficha con puntaje, arancel y beneficio; simulador; calendario y guía del FUAS; consentimiento. Si falta algo, avisa en el grupo **ese mismo día**; no se esconde el atraso.

---

## 6. Lo que debes dominar (40 minutos, una vez)

1. [`AGENTS.md`](../../AGENTS.md), sobre todo las secciones 2.5 (diseño) y 2.6 (accesibilidad).
2. [`docs/diseno.md`](../diseno.md): la idea «Mapa de trayecto» con la base visual Andén urbano, y por qué cada color, letra y medida existe.
3. [`.claude/skills/mapa-de-trayecto/SKILL.md`](../../.claude/skills/mapa-de-trayecto/SKILL.md) y [`.claude/skills/lenguaje-claro/SKILL.md`](../../.claude/skills/lenguaje-claro/SKILL.md).
4. [`docs/arquitectura.md`](../arquitectura.md): dónde va cada cosa.

**Tres ideas que guían todo tu trabajo:**
1. **La persona con menos recursos es la medida.** Si funciona en un teléfono básico, con datos móviles lentos y para alguien que nunca ha postulado, funciona para todos.
2. **Nada visual «porque se ve bonito».** Cada elemento se justifica por accesibilidad medible, comprensión, rendimiento o identidad.
3. **Solo tokens.** Cada color, tamaño y espacio sale de `diseno/tokens.css`. Si necesitas uno que no existe, se pide con un ADR (y se corre `python3 scripts/tokens.py`).

---

## 7. Antes de abrir cada PR

- [ ] La tarea cumple **todos** sus criterios de aceptación.
- [ ] `npm run build`, `npm run lint` y `python3 scripts/tokens.py --check` pasan.
- [ ] Probado a 360 px, con teclado y en modo oscuro.
- [ ] Sin colores, tamaños ni espacios escritos a mano (`grep -rn "#[0-9A-Fa-f]\{6\}" app/`).
- [ ] Textos revisados con la skill `lenguaje-claro` (o pedidos a Cristóbal).
- [ ] Capturas de pantalla en el PR (teléfono y escritorio).
- [ ] Plantilla del PR completa, incluida la IA que usaste.
- [ ] Leíste y entiendes todo el código, incluido el que escribió tu IA.

**Texto base para tu IA** (cambia la tarea):
> Lee AGENTS.md, docs/diseno.md, las skills mapa-de-trayecto y lenguaje-claro y la tarea [código] de docs/equipo/guia-alejandro.md. Construye solo lo que pide esa tarea, usando los componentes existentes en app/_componentes y solo variables de diseno/tokens.css. Accesible con teclado y lector de pantalla, objetivos táctiles de 44 px, foco visible, 360 px. No escribas ningún dato a mano en el código ni inventes colores o medidas; si falta un token, dímelo. No agregues librerías que no te pida. Al final, dime cada archivo creado y por qué.

## 8. Errores comunes que hacen rechazar un PR

| Error | Por qué se rechaza | Cómo evitarlo |
|---|---|---|
| `color: #333` o `text-gray-700` | Rompe el sistema de diseño y el modo oscuro | Solo `var(--color-…)` |
| Ícono sin texto | Ambiguo para muchas personas | Ícono + palabra |
| `outline: none` | Quien usa teclado se pierde | Foco con `--anillo-foco` |
| Botón «Continuar» o «Aceptar» | No dice qué pasa al tocarlo | Verbo + resultado |
| Mostrar 0 cuando no hay dato | Información falsa | «Sin datos suficientes» |
| Etiquetas «en riesgo» en el panel | Estigma y promesa de predicción (AGENTS.md 2.4) | «Sin actividad», «pidió ayuda» |
| Librería nueva sin justificar | Peso, seguridad y licencias | Justificarla en el PR o no usarla |
| Datos de ejemplo con nombres reales | Privacidad | Siempre ficticios |

---

## Anexo histórico: tareas ya hechas (3 al 10 de noviembre)

Se conservan como registro; ya están fusionadas. El detalle de cada una está en su PR.

- **A1 · Proyecto Next.js como PWA** (PR 15): Tailwind leyendo `diseno/tokens.css`, manifiesto, íconos, `allowImportingTsExtensions` para que `lib/ia/` importe con `.ts`.
- **A2 · Tipografías alojadas** (PR 28): Atkinson Hyperlegible Next y Mono en `woff2`, sin Google Fonts en línea, licencia OFL declarada.
- **A3 · Componentes base y `/componentes`** (PR 49): `Boton`, `Enlace`, `Encabezado`, `IndicadorEstacion`, `DatoOficial`, `Aviso`, `PiePagina`. La página `/componentes` es la guía viva.
- **A4 · Despliegue en Cloudflare** (PR 32, 52; ADR 0003 aceptado con reservas): el líder conecta el repositorio a su cuenta y el sitio se despliega al fusionar a `main`. Nadie del equipo crea cuentas a nombre de la agencia.
- **A5 · Ficha de carrera, A6 · Explorador, A7 · Comparador, A11 · Beneficios y calendario**: fusionados (ver sección 3). Reglas que siguen vigentes: cada cifra muestra qué mide, su período y su fuente; sin dato se muestra «Sin datos suficientes» con su motivo; el orden por defecto nunca favorece instituciones; el comparador no mezcla períodos sin advertirlo.
