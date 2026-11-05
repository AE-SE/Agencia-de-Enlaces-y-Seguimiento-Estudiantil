# Bitácora

Memoria de trabajo entre sesiones. Lo más reciente, arriba.

## 2026-11-05 (tarde)

**Hecho**: PR #32 prepara el despliegue en Cloudflare con OpenNext (A4). En local compila, responde y el paquete pesa 4.687 KiB (996 KiB comprimido). Codex escribió `lib/datos/carreras.ts` con pruebas (rama `feat/lib-datos-carreras`, solo en una copia temporal, sin commit; depende de #22).
**Por qué**: Cloudflare ya recomienda `vinext` (build con Vite) y no OpenNext; se probó OpenNext primero porque no cambia el stack. Antigravity afirmó lo contrario y erró; sus límites del plan gratuito sí eran correctos. OpenNext 1.20.15 y no la 1.20.16, porque esta exige `next >=16.4.5`.
**Pendiente**: conectar el repo en el panel de Cloudflare y medir el despliegue real (carga en 4G lenta, 10 ms de CPU). Cristóbal debe corregir la unidad de `matricula` en #22 y alguien verificar tres valores. Alejandro: #28 espera que se aprueben sus verificaciones. Revisión profesional del protocolo de crisis: se pide el 6 de nov.
**Siguiente**: fusionar #32 tras tu revisión, conectar Cloudflare y, con #22 corregido, commitear la rama de Codex y construir la ficha de carrera (A5).

## 2026-11-05

**Hecho**: revisión de puntos fuertes y débiles del proyecto (sin cambios de código). Se crea esta bitácora; las entradas anteriores no se reconstruyeron desde los commits.
**Por qué**: el diagnóstico es que el proyecto tiene buena base (reglas, RLS probado, protocolo de crisis, trazabilidad de datos) pero casi nada de producto: la única página es un título y una frase, y no hay datos oficiales cargados. Quedan 4 semanas hasta la entrega del 2 de diciembre.
**Pendiente**: PR #28 (tipografías, Alejandro) y #22 (carreras de ejemplo, Cristóbal) abiertos esperando revisión. Los PR #29 y #30 (ADR 0013 y cifras) son documentación del líder. Sigue pendiente la revisión profesional del protocolo de crisis y la autorización escrita del CNED (ADR 0009).
**Siguiente**: revisar #28 y #22 el viernes 6 de nov. `docs/equipo/reparto.md` (PR #31) saca a Alejandro y Cristóbal del camino crítico: la meta es una ficha real desplegada el 16 de nov, construida por el líder, Claude y Codex o Antigravity; ellos entregan tareas cortas con fecha. La vía verde de revisión quedó como propuesta para después (necesita un ADR que cambie `AGENTS.md` 4.6).
**Por qué cambió el enfoque**: el primer borrador del reparto asumía que ambos entregarían a tiempo; el líder dijo que van retrasados y que parte del atraso son sus PR esperando revisión.
**Fracaso a evitar**: seguir sumando documentos (los últimos 5 commits fueron `docs:`) mientras la única página del portal es un título.
