import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ viewport: { width: 360, height: 900 }, reducedMotion: "reduce" });

for (const pagina of ["carreras", "comparador", "beneficios", "ficha"] as const) {
  test(`cabecera ${pagina} con una navegación y sus acciones`, async ({ page }) => {
    await page.goto(`/componentes/cabeceras?pagina=${pagina}`);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    const cabecera = page.locator("header[data-cabecera-portal]");
    await expect(cabecera).toHaveCSS("position", "static");
    await expect(page.getByRole("region", { name: "Prueba de cabecera" })).toHaveCount(0);
    await expect(cabecera.getByRole("navigation")).toHaveCount(1);
    const recorrido = cabecera.getByRole("navigation", { name: "Recorrido del portal" });
    await expect(recorrido.getByRole("link")).toHaveText(["Inicio", "Carreras", "Comparador", "Beneficios"]);
    await expect(recorrido.locator('[aria-current="page"]')).toHaveAttribute("href", pagina === "ficha" ? "/carreras" : `/${pagina}`);
    await expect(page.getByRole("link", { name: /^Volver/ })).toHaveCount(0);
    const titulo = page.getByRole("heading", { name: pagina === "ficha" ? "Administración de Empresas" : "Prueba de cabecera" });
    await expect(titulo).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(await titulo.evaluate(elemento => {
      const rango = document.createRange();
      rango.setStart(elemento.firstChild!, 0);
      rango.setEnd(elemento.firstChild!, elemento.textContent!.indexOf(" "));
      return rango.getClientRects().length;
    })).toBe(1);
    if (pagina === "beneficios") {
      const accion = page.getByRole("link", { name: "Revisar plazos de prueba" });
      await accion.focus();
      const foco = await accion.evaluate(elemento => ({
        outlineStyle: getComputedStyle(elemento).outlineStyle,
        outlineWidth: getComputedStyle(elemento).outlineWidth,
      }));
      expect(foco.outlineStyle).toBe("solid");
      expect(parseFloat(foco.outlineWidth)).toBeGreaterThan(0);
      await accion.click();
      await expect(page).toHaveURL(/#prueba-accion$/);
    }
    const informe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(informe.violations).toEqual([]);
  });
}

test("simulador cuelga de la parada Beneficios con aria-current true y el tren ahí", async ({ page }) => {
  await page.goto("/componentes/cabeceras?pagina=simulador");
  const recorrido = page.locator("header[data-cabecera-portal]").getByRole("navigation", { name: "Recorrido del portal" });
  await expect(recorrido.locator('[aria-current="page"]')).toHaveCount(0);
  const madre = recorrido.locator('[aria-current="true"]');
  await expect(madre).toHaveCount(1);
  await expect(madre).toHaveAttribute("href", "/beneficios");
  await expect(madre.locator("svg")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Etapas de tu trayectoria" })).toHaveCount(1);
});

test("meta cuelga de la parada Comparador con aria-current true y la estación 1", async ({ page }) => {
  await page.goto("/componentes/cabeceras?pagina=meta");
  const recorrido = page.locator("header[data-cabecera-portal]").getByRole("navigation", { name: "Recorrido del portal" });
  await expect(recorrido.locator('[aria-current="page"]')).toHaveCount(0);
  const madre = recorrido.locator('[aria-current="true"]');
  await expect(madre).toHaveCount(1);
  await expect(madre).toHaveAttribute("href", "/comparador");
  await expect(madre.locator("svg")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Etapas de tu trayectoria" })).toHaveCount(1);
});

// En teléfono el recorrido tiene dos filas; el tren de una parada de abajo tapaba la etiqueta de arriba.
for (const pagina of ["comparador", "beneficios"] as const) {
  test(`en ${pagina} el tren no tapa ninguna etiqueta del recorrido`, async ({ page }) => {
    await page.goto(`/componentes/cabeceras?pagina=${pagina}`);
    const recorrido = page.locator("header[data-cabecera-portal]").getByRole("navigation", { name: "Recorrido del portal" });
    const choques = await recorrido.evaluate(nav => {
      const tren = nav.querySelector("svg")!.getBoundingClientRect();
      return [...nav.querySelectorAll("a")].map(a => a.lastElementChild!).filter(etiqueta => {
        const e = etiqueta.getBoundingClientRect();
        return tren.left < e.right && e.left < tren.right && tren.top < e.bottom && e.top < tren.bottom;
      }).map(etiqueta => etiqueta.textContent);
    });
    expect(choques).toEqual([]);
  });
}

test("preguntas no marca ninguna parada y no muestra indicador de estación", async ({ page }) => {
  await page.goto("/componentes/cabeceras?pagina=preguntas");
  const recorrido = page.locator("header[data-cabecera-portal]").getByRole("navigation", { name: "Recorrido del portal" });
  await expect(recorrido.locator("[aria-current]")).toHaveCount(0);
  await expect(recorrido.locator("svg")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Etapas de tu trayectoria" })).toHaveCount(0);
});

test("quienes no marca ninguna parada y no muestra indicador de estación", async ({ page }) => {
  await page.goto("/componentes/cabeceras?pagina=quienes");
  const recorrido = page.locator("header[data-cabecera-portal]").getByRole("navigation", { name: "Recorrido del portal" });
  await expect(recorrido.locator("[aria-current]")).toHaveCount(0);
  await expect(recorrido.locator("svg")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Etapas de tu trayectoria" })).toHaveCount(0);
});
