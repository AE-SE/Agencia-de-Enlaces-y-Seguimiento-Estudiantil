import { expect, test } from "@playwright/test";

// ADR 0040: el aviso «Publicidad» va solo en la portada, /beneficios y /preguntas, uno por página.
const PERMITIDAS = ["/", "/beneficios", "/preguntas"];
const PROHIBIDAS = ["/carreras", "/carreras/universidad-de-chile/enfermeria-santiago-i70s1c41j1v1", "/comparador", "/simulador", "/fuas", "/mapa", "/meta", "/quienes-somos", "/hoja", "/ocupaciones"];

test.use({ viewport: { width: 360, height: 900 } });

for (const ruta of PERMITIDAS) {
  test(`${ruta} muestra un solo espacio «Publicidad», sin desbordar a 360 px`, async ({ page }) => {
    await page.goto(ruta);
    const espacio = page.getByRole("complementary", { name: "Publicidad" });
    await expect(espacio).toHaveCount(1);
    await expect(espacio.getByText("Publicidad", { exact: true })).toBeVisible();
    const enlace = espacio.getByRole("link", { name: "Cómo elegimos los avisos" });
    await enlace.focus();
    await expect(enlace).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  });
}

for (const ruta of PROHIBIDAS) {
  test(`${ruta} no muestra «Publicidad»`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.getByRole("complementary", { name: "Publicidad" })).toHaveCount(0);
  });
}

test("el enlace del aviso llega a la sección #avisos de Quiénes somos", async ({ page }) => {
  await page.goto("/preguntas");
  await page.getByRole("link", { name: "Cómo elegimos los avisos" }).click();
  await expect(page).toHaveURL(/\/quienes-somos#avisos$/);
  await expect(page.getByRole("heading", { name: "Cómo elegimos los avisos" })).toBeVisible();
});
