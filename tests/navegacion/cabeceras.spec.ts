import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ viewport: { width: 360, height: 900 }, reducedMotion: "reduce" });

for (const pagina of ["carreras", "comparador", "beneficios", "ficha"] as const) {
  test(`cabecera ${pagina} con una navegación y sus acciones`, async ({ page }) => {
    await page.goto(`/componentes/cabeceras?pagina=${pagina}`);
    const cabecera = page.locator("header[data-cabecera-portal]");
    await expect(cabecera.getByRole("navigation")).toHaveCount(1);
    const recorrido = cabecera.getByRole("navigation", { name: "Recorrido del portal" });
    await expect(recorrido.getByRole("link")).toHaveText(["Inicio", "Carreras", "Comparador", "Beneficios"]);
    await expect(recorrido.locator('[aria-current="page"]')).toHaveAttribute("href", pagina === "ficha" ? "/carreras" : `/${pagina}`);
    await expect(page.getByRole("link", { name: /^Volver/ })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Prueba de cabecera" })).toBeVisible();
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
