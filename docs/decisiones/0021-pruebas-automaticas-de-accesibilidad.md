# 0021 — Pruebas automáticas de accesibilidad con Playwright y axe-core

Fecha: 2026-11-09 · Estado: aceptada (aprobada por el líder, @rafajaque, el 2026-11-09, incluida la excepción de licencia de axe-core)

## Contexto

AGENTS.md 2.6 exige cumplir WCAG 2.2 nivel AA, y la lista de «terminado» pide probar a 360 px y con teclado. Hoy eso se revisa a mano en cada PR y depende de quién lo haga. En el trabajo reciente la revisión visual fue lenta y poco repetible. Además, el contraste cambia con el tema claro y oscuro, y rara vez se mira en los dos.

Una prueba automática no reemplaza la revisión con lector de pantalla ni el criterio del líder, pero evita que vuelvan errores que una máquina sí detecta.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| A. Seguir solo con revisión manual | Cero dependencias nuevas | No es repetible; los errores vuelven sin que nadie lo note |
| **B. Playwright + axe-core** (elegida) | axe cubre las reglas de WCAG 2.2 AA que se pueden automatizar; Playwright permite probar teclado, tema y ancho en la misma corrida | Dos dependencias de desarrollo; la CI descarga un navegador |
| C. Lighthouse CI | Fácil de configurar | Usa axe por dentro y da una nota global; la correspondencia con WCAG 2.2 es parcial y no sirve para exigir «sin incumplimientos» |
| D. Revisión con un servicio externo | Sin mantenimiento propio | Sube páginas a un tercero y suele tener costo; el proyecto usa solo herramientas gratuitas |

## Decisión

Agregar como dependencias **de desarrollo**:

- `@playwright/test` (Apache-2.0).
- `@axe-core/playwright` y su motor `axe-core` (**MPL-2.0**).

Para cada página pública listada en `tests/accesibilidad/rutas.ts` se prueba:

1. **axe con las etiquetas de WCAG 2.2 AA**, en tema claro y en tema oscuro.
2. **Estructura:** idioma `es-CL`, título, un solo `h1` y contenido principal.
3. **360 px:** sin desplazamiento horizontal.
4. **Teclado:** el primer Tab va a «Ir al contenido» y cada control enfocable muestra un contorno de foco.

La prueba corre con `npm run test:a11y` y como trabajo propio de la integración continua. Las pruebas están en archivos `*.spec.ts` para no mezclarse con `node --test "tests/**/*.test.ts"`.

## Justificación

- **Licencias.** Playwright es Apache-2.0, compatible con AGENTS.md 2.3. axe-core es **MPL-2.0**, que no está en la lista de MIT, Apache y BSD de esa regla. MPL-2.0 exige publicar los cambios a los propios archivos de axe-core, no al código que lo usa. Como es una dependencia de desarrollo que no se entrega al usuario ni se modifica, el riesgo es bajo. **Se pide al líder aprobar esta excepción.**
- **Cobertura.** Las herramientas automáticas detectan solo una parte de los problemas (las fuentes consultadas hablan de entre 30 % y 57 %). Por eso esta prueba suma a la revisión manual, no la reemplaza.
- **Sensibilidad comprobada.** Se verificó que las pruebas detectan un `img` sin texto alternativo y texto con poco contraste, antes de confiar en que «todo pasa».

## Consecuencias

- Cada página pública nueva debe sumarse a `tests/accesibilidad/rutas.ts`. Una página fuera de la lista no se revisa.
- La integración continua tarda unos minutos más y descarga Chromium (`npx playwright install --with-deps chromium`).
- En una máquina con Edge o Chrome se puede evitar esa descarga: `PLAYWRIGHT_CANAL=msedge npm run test:a11y`.
- Sigue siendo obligatorio probar con teclado real y con un lector de pantalla antes de dar por buena una pantalla nueva.
- Falta decidir si `npm run test:a11y` se agrega a la lista de «terminado» de AGENTS.md (sección 5). No se tocó ese archivo en este cambio.

## Pendiente

- Agregar `/transparencia` y las rutas nuevas a `rutas.ts` cuando se fusionen sus PR (`/transparencia` ya se probó en local: 35 de 35).
- Decidir si `npm run test:a11y` entra en la lista de «terminado» de AGENTS.md (sección 5).

## Verificación en la integración continua

El trabajo «Accesibilidad del portal (WCAG 2.2 AA)» pasó en la integración continua con el Chromium de Playwright en Linux (2026-11-09), además de la prueba local con Edge.
