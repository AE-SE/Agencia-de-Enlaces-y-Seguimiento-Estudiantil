# 0015 — Cuenta del estudiante y vínculo con instituciones de educación superior

Fecha: 2026-11-07 · Estado: aceptada (2026-11-09, por el líder) · ajustada el 2026-11-11

> **Nota del 2026-11-13.** Ajustado por los ADR [0032](0032-agencia-independiente-y-publico-egresado.md) y [0033](0033-cuenta-con-correo-sin-edad.md). Sigue vigente la cuenta sin contraseña (A1). Quedan sin efecto el vínculo con una institución o un colegio y la Ficha compartida por capas: la cuenta no se comparte con nadie y guarda solo la lista cerrada del ADR 0033.

> **Nota del 2026-11-11.** Siguen vigentes sin cambio: la cuenta del estudiante sin contraseña (A1), la Ficha compartida por capas con consentimiento propio y revocable, y las reglas que no se negocian (nada depende de compartir la Ficha, el estudiante ve quién consulta, las alertas las revisa una persona, nada de predicción). Cambia el destinatario: el vínculo ya no es con una institución de educación superior sino con el colegio, y lo que el colegio ve es el resumen para el docente de los estudiantes que lo autorizan ([ADR 0031](0031-producto-y-organizacion.md)). El vínculo por correo institucional (B1) y la lista de dominios de instituciones de educación superior quedan fuera del alcance actual; cómo se vincula un estudiante con su colegio (por ejemplo, el código de invitación B2) está por diseñar y requiere el flujo de menores del ADR 0022.

## Contexto

La Ficha de Trayectoria pertenece al estudiante (AGENTS.md, sección 1). Para que el estudiante la guarde, la comparta, la revoque y la exporte, la plataforma necesita identificarlo. Además, la plataforma tiene un panel institucional (SaaS) donde una institución de educación superior hace seguimiento de sus estudiantes.

Surgieron tres preguntas:

1. ¿Cómo se guarda la Ficha si el estudiante no tiene cuenta?
2. ¿Cómo se vincula un estudiante con la institución donde estudia?
3. ¿Qué ve la institución de esa Ficha, y con qué garantías?

Las respuestas afectan directamente la protección de datos personales y sensibles (AGENTS.md, secciones 2.2 y 2.4), por lo que se registran aquí antes de implementarse.

## Opciones evaluadas

### A. Cuenta del estudiante

| Opción | A favor | En contra |
|---|---|---|
| **A1. Cuenta sin contraseña (código o enlace enviado al correo, con Supabase Auth)** | Hay un titular identificable para ejercer derechos de acceso, rectificación, supresión, oposición y portabilidad. Permite revocar consentimientos. La Ficha no depende de un navegador | Requiere un correo válido; el estudiante debe confiar en la plataforma para guardar sus datos |
| A2. Ficha solo en el navegador del estudiante | La plataforma no guarda datos personales. Máxima minimización | Si se borran los datos del navegador o se cambia de equipo, la Ficha se pierde. Para compartirla con una institución hay que enviarla al servidor, con lo que la minimización desaparece en ese momento. No se puede revocar un envío ya descargado |
| A3. Sesión anónima de Supabase, sin correo | Más simple que A1 | Si se borra el navegador se pierde el acceso. No hay forma de recuperar la cuenta desde otro equipo. No permite ejercer derechos sobre un titular identificado |

### B. Vínculo con la institución

| Opción | A favor | En contra |
|---|---|---|
| **B1. El estudiante se vincula a la institución con su correo institucional (dominio) y confirma el vínculo** | Prueba que el estudiante controla esa casilla y que pertenece a la comunidad de la institución. El estudiante decide el vínculo | Un dominio no prueba matrícula: lo tienen también académicos, funcionarios, egresados y postulantes en algunos casos |
| B2. La institución envía un código de invitación opaco, que el estudiante ingresa | No depende del dominio. La institución no conoce el correo del estudiante | Requiere que la institución distribuya códigos; no verifica pertenencia por sí solo |
| B3. La institución busca o agrega estudiantes por correo | Simple para la institución | **Descartada.** Permite compartir datos sin consentimiento del estudiante |

### C. Qué ve la institución de la Ficha

| Opción | A favor | En contra |
|---|---|---|
| C1. Toda la Ficha, por defecto | Seguimiento máximo | Incumple minimización. Expone datos sensibles sin consentimiento separado |
| C2. Ficha por capas, cada una con consentimiento propio y revocable | Permite que el estudiante decida qué comparte. Cumple minimización y separa lo sensible | Más complejo de implementar y de explicar |

## Decisión

Se propone:

1. **Cuenta por correo, sin contraseña (A1).** El portal público sigue abierto sin login para explorar carreras, beneficios y plazos. La cuenta se pide cuando el estudiante guarda o comparte su Ficha.

2. **Vínculo con la institución por correo institucional y confirmación del estudiante (B1), con código de invitación (B2) como alternativa** para instituciones que no entreguen correos a todos sus estudiantes. La institución nunca busca ni agrega estudiantes por correo (B3 descartada).
   - Un estudiante puede tener varios correos vinculados, pero con un único titular: su cuenta personal.
   - Los dominios institucionales son datos oficiales: se obtienen de la institución o de una fuente verificable, con fecha de vigencia (AGENTS.md, sección 2.1). Ningún dominio se escribe en el código.
   - El vínculo prueba pertenencia, no matrícula. Si el seguimiento depende de la matrícula, la institución la confirma por un mecanismo aparte.

3. **Ficha compartida por capas (C2).** Con la institución vinculada, el estudiante elige qué capas comparte. Cada capa tiene consentimiento propio, fecha y revocación:
   - **Capa 1, académica básica** (carrera, avance, beneficios vigentes): consentimiento general, revocable.
   - **Capa 2, acompañamiento** (lo que el estudiante elija compartir sobre su trayectoria): consentimiento aparte.
   - **Capa 3, datos sensibles** (salud mental, situación socioeconómica, discapacidad, origen étnico): consentimiento explícito y separado. Cifrado según ADR 0007 y acceso restringido, con registro de quién accede.

4. **Reglas que no se negocian:**
   - **Ningún servicio, beneficio, cupo o acompañamiento de la institución depende de compartir la Ficha.** Si el estudiante no comparte, la institución puede ofrecerle acompañamiento general, pero no seguimiento personalizado. El consentimiento debe ser libre e informado (Ley 19.628, modificada por la Ley 21.719).
   - **El estudiante ve qué se comparte y quién lo consulta,** y puede revocar en cualquier momento. Al revocar, la institución deja de ver los datos desde ese momento.
   - **La institución solo ve a los estudiantes vinculados y con consentimiento vigente.** Eso lo impone la base con Row Level Security (ADR 0002), no el frontend.
   - **Las alertas las revisa una persona.** No hay puntajes automáticos ni etiquetas que definan al estudiante. Para el estudiante no existe la palabra "en riesgo" (AGENTS.md, sección 2.4).
   - **Nada de predicción.** Ningún texto de interfaz, documento comercial o respuesta del asistente puede describir el seguimiento como predicción de deserción (ADR 0010).

5. **Menores de 18 años.** El vínculo y el consentimiento de capas 2 y 3 requieren autorización de padre, madre o tutor antes de cualquier uso. Este flujo está pendiente de diseño (ver abajo).

## Justificación

- La cuenta sin contraseña (A1) es la única opción que permite ejercer derechos sobre un titular identificado y revocar consentimientos sin depender del navegador. A2 minimiza mejor hasta que la Ficha debe llegar a una institución; en ese momento, minimización y revocación se contradicen.
- B3 viola el principio de consentimiento: compartir datos de una persona sin que ella lo decida.
- C1 no cumple la minimización exigida en AGENTS.md, sección 2.2.
- La regla de que ningún servicio depende de compartir la Ficha es la que hace que el consentimiento sea libre. Sin ella, la capacidad de elegir del estudiante es nominal.

## Consecuencias

- Hay que crear un flujo de registro con correo sin contraseña, y definir la política de sesiones y recuperación de cuenta.
- Hay que crear tablas para: vínculos estudiante–institución, consentimientos por capa (con fecha y revocación), dominios institucionales con vigencia y registro de acceso. Todas con RLS.
- Los dominios institucionales deben conseguirse con cada institución cliente. Los dominios de ejemplo mencionados en la conversación no están verificados y no se usan.
- Las capas de consentimiento se revisan con el profesional validador antes de definir qué información entra en la capa 2.
- Se requiere revisión legal de los flujos de menores y de la capa 3 antes de implementarlos.
- Esta propuesta también debe reflejarse en `docs/privacidad.md`.

## Pendiente

- Diseño del flujo de autorización para menores de 18 años.
- Lista de dominios institucionales, con fuente y fecha, por cada institución cliente.
- Definición exacta de los campos de cada capa de la Ficha.
- Revisión legal de la capa 3.
- Decidir si la matrícula se confirma por la institución o por otro mecanismo.
