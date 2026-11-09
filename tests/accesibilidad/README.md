# Pruebas de accesibilidad

Revisan cada página pública del portal con [axe-core](https://github.com/dequelabs/axe-core) dentro de [Playwright](https://playwright.dev/). Justificación y licencias: [ADR 0021](../../docs/decisiones/0021-pruebas-automaticas-de-accesibilidad.md).

## Qué prueban

Para cada ruta de [`rutas.ts`](rutas.ts):

| Prueba | Qué exige |
|---|---|
| axe, tema claro y oscuro | Cero incumplimientos de WCAG 2.2 nivel AA que axe pueda detectar |
| Estructura | Idioma `es-CL`, título, un solo `h1` y `main#contenido` |
| 360 px | Sin desplazamiento horizontal |
| Teclado | El primer Tab va a «Ir al contenido» y cada control enfocable tiene contorno de foco visible |

## Cómo correrlas

Desde la raíz del repositorio. La primera vez, instala el navegador:

```bash
npx playwright install chromium
```

```bash
npm run test:a11y
```

Compila la aplicación y la prueba. Si tienes Microsoft Edge o Google Chrome instalados, puedes evitar la descarga de Chromium:

```bash
PLAYWRIGHT_CANAL=msedge npm run test:a11y
```

En PowerShell: `$env:PLAYWRIGHT_CANAL = "msedge"; npm run test:a11y`.

Para ver el detalle de un fallo, el mensaje indica la regla de axe, qué dice y qué elementos la incumplen. Las reglas están explicadas en [dequeuniversity.com/rules/axe](https://dequeuniversity.com/rules/axe/).

## Cómo agregar una página

Suma una línea a `RUTAS` en [`rutas.ts`](rutas.ts). Una página que no está en la lista no se revisa. No incluyas páginas de prueba interna.

## Qué no cubren

- Las herramientas automáticas detectan solo una parte de los problemas. Falta siempre la revisión con **lector de pantalla** y el recorrido con **teclado real**.
- No evalúan si un texto es claro ni si una alternativa de texto describe bien la imagen. Eso lo revisa una persona (skill `lenguaje-claro`).
- No comprueban a 200 % de zoom ni lo visual: el líder revisa lo subjetivo (AGENTS.md, sección 4).
