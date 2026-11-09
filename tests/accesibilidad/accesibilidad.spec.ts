import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { ETIQUETAS_WCAG, RUTAS } from "./rutas";

const ESQUEMAS = ["light", "dark"] as const;
const MAX_TABULACIONES = 120;

async function abrir(page: Page, ruta: string, esquema: (typeof ESQUEMAS)[number] = "light") {
  await page.emulateMedia({ colorScheme: esquema, reducedMotion: "reduce" });
  await page.goto(ruta);
  await page.waitForLoadState("networkidle");
}

for (const { ruta, nombre } of RUTAS) {
  test.describe(`${nombre} (${ruta})`, () => {
    // 1. Reglas de WCAG 2.2 AA con axe, en tema claro y oscuro (el contraste cambia con el tema).
    for (const esquema of ESQUEMAS) {
      test(`axe: sin incumplimientos de WCAG 2.2 AA en tema ${esquema === "light" ? "claro" : "oscuro"}`, async ({ page }) => {
        await abrir(page, ruta, esquema);
        const { violations } = await new AxeBuilder({ page }).withTags(ETIQUETAS_WCAG).analyze();
        const informe = violations.map(
          (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join("\n    ")}`,
        );
        expect(informe, `Incumplimientos de accesibilidad en ${ruta}:\n${informe.join("\n")}`).toEqual([]);
      });
    }

    // 2. Estructura mínima de la página.
    test("estructura: idioma, título, un solo h1 y contenido principal", async ({ page }) => {
      await abrir(page, ruta);
      await expect(page.locator("html")).toHaveAttribute("lang", "es-CL");
      expect((await page.title()).trim().length).toBeGreaterThan(0);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#contenido")).toHaveCount(1);
    });

    // 3. Sin desplazamiento horizontal a 360 px (AGENTS.md 2.6, mobile first).
    test("a 360 px de ancho no hay desplazamiento horizontal", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await abrir(page, ruta);
      const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(desborde, "la página es más ancha que la pantalla").toBeLessThanOrEqual(0);
    });

    // 4. Teclado: el primer Tab va al enlace «Ir al contenido» y todo lo enfocable muestra foco.
    test("teclado: el foco se ve en cada control y el primero salta al contenido", async ({ page }) => {
      await abrir(page, ruta);
      await page.keyboard.press("Tab");
      const primero = await page.evaluate(() => document.activeElement?.textContent?.trim());
      expect(primero).toBe("Ir al contenido");

      const sinFoco: string[] = [];
      for (let i = 0; i < MAX_TABULACIONES; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const e = document.activeElement as HTMLElement | null;
          if (!e || e === document.body) return null;
          const estilo = getComputedStyle(e);
          const caja = e.getBoundingClientRect();
          return {
            texto: (e.getAttribute("aria-label") || e.textContent || e.tagName).trim().slice(0, 40),
            visible: caja.width > 0 && caja.height > 0,
            contorno: estilo.outlineStyle !== "none" && parseFloat(estilo.outlineWidth) > 0,
          };
        });
        if (info === null) break;
        if (info.texto === "Ir al contenido") break; // dio la vuelta completa
        if (!info.visible) sinFoco.push(`${info.texto}: está enfocado pero no se ve`);
        else if (!info.contorno) sinFoco.push(`${info.texto}: sin contorno de foco`);
      }
      expect(sinFoco, `Controles sin foco visible en ${ruta}`).toEqual([]);
    });
  });
}
