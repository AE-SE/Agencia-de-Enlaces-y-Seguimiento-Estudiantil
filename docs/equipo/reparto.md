# Reparto de trabajo y de revisión hasta el 2 de diciembre

Propuesta del 5 de noviembre de 2026, **pendiente de confirmación del líder**. Complementa las guías de [Alejandro](guia-alejandro.md) y [Cristóbal](guia-cristobal.md); no las reemplaza.

**Problema que resuelve:** el líder escribe la mayor parte del código y además revisa todos los PR, así que Alejandro y Cristóbal quedan esperando. La meta es que el trabajo de ellos no dependa de que el líder esté disponible.

## 1. Dos vías de revisión

| Vía | Qué toca | Quién fusiona |
|---|---|---|
| **Verde** | Pantallas sin datos personales (`app/`), datos con fuente y fecha (`datos/`), documentación del equipo, pruebas de cálculos | Claude, con la pauta [`revisar-pr`](../../.claude/skills/revisar-pr/SKILL.md) y la CI en verde. El líder recibe un resumen semanal, no un PR por PR |
| **Roja** | `supabase/`, `lib/ia/`, registro y consentimientos, `AGENTS.md`, tokens de diseño, dependencias nuevas, cambios de stack | Claude revisa, **el líder confirma** (como hoy) |

Reglas:

- Si un PR verde toca algo de la vía roja, pasa a roja.
- Lo subjetivo (textos y aspecto) de una rama escrita por Claude lo mira el líder, como ya dice `AGENTS.md` 4.6.4.
- Ventanas de revisión: **martes y viernes**. Un PR abierto antes de esa ventana se revisa en ella; no hay que revisarlo en el momento.
- Cambiar esto modifica `AGENTS.md` sección 4.6, así que necesita un ADR corto antes de aplicarse.

## 2. Quién hace qué

### Semana 1 (hasta el 9 de nov)

| Persona | Tarea |
|---|---|
| Líder | Revisar #28 y #22 en la ventana del viernes. Aplicar las migraciones en el Supabase real. A4 (despliegue en Cloudflare) junto con Alejandro |
| Alejandro | Cerrar A2 (#28) y A3 (componentes base). Con el líder, A4 |
| Cristóbal | Cerrar C4 (#22) y C3 (diccionario de datos). Empezar C5 (oferta de Mineduc) |

### Semana 2 (10 al 16 de nov): explorar

| Persona | Tarea |
|---|---|
| Líder | Funciones de lectura en `lib/datos/` (consultas de ficha y explorador) que Alejandro consume. Revisar C5 |
| Alejandro | A5 ficha de carrera, A6 explorador. A7 y A8 solo si las funciones de `lib/datos/` ya existen |
| Cristóbal | C5 cerrada, C6 (empleabilidad), C7 (puntaje y ranking, con pruebas), C8 (ponderaciones, solo si aparece fuente en tabla) |

### Semana 3 (17 al 23 de nov): acompañar

| Persona | Tarea |
|---|---|
| Líder | Ruta del asistente con el protocolo de crisis conectado. Registro y consentimientos del lado del servidor. Revisión profesional del protocolo de crisis (se pide ya, no en la semana 3) |
| Alejandro | A9 pantalla del asistente, A10 registro y consentimientos (vía roja), A11 beneficios y calendario |
| Cristóbal | C9 beneficios y plazos, C9b documentos para el asistente, C10 revisión de textos |

### Semana 4 (24 al 30 de nov): seguir y vender

| Persona | Tarea |
|---|---|
| Líder | Permanencia mínima: pulso de check-in y alerta a revisión humana. Panel de agencia mínimo |
| Alejandro | A12 paneles (solo lo que el líder deje funcionando), A13 auditoría, A14 pruebas con usuarios |
| Cristóbal | C11 pruebas con usuarios, C12 verificación cruzada, C13 informe de datos |

## 3. Lo que se recorta o se difiere

- **Panel institucional:** una sola pantalla de demostración con datos de ejemplo, marcada como tal. Sin seguimiento real de cohortes.
- **Módulo de permanencia:** solo beneficios de mantención (datos de C9) y el pulso mínimo. Relatos de pares y escalera de derivación quedan como diseño en el ADR 0010.
- **Documentos nuevos (ADR, informes):** ninguno hasta que una carrera real se vea en el portal desplegado, salvo que cambie una regla de `AGENTS.md`.

## 4. Qué se delega a otras IA

- **Pantallas repetitivas** (A6, A7, A11) y barridos de verificación de cifras: Codex o Antigravity con la skill correspondiente; el resultado pasa por la misma vía de revisión que el de una persona.
- **Lo que no se delega:** `lib/ia/`, RLS y consentimientos.

## 5. Cómo saber si funciona

- Ningún PR del equipo espera más de 3 días hábiles sin primera revisión.
- Al cierre de la semana 2 hay una ficha de carrera con datos oficiales y su fuente, desplegada en Cloudflare.
- Menos del 50% de los commits de la semana son del líder.
