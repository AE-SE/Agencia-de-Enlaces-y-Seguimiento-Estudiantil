import { expect, test } from "@playwright/test";

test("preguntas frecuentes no se desbordan con texto al 200 %", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/preguntas");
  await page.locator("html").evaluate((elemento) => { elemento.style.fontSize = "200%"; });

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator(".indice h2, .indice h3, .grupo h2, .glosario h2").evaluateAll((titulos) => titulos.every((titulo) => {
    const rectangulo = titulo.getBoundingClientRect();
    return rectangulo.left >= 0 && rectangulo.right <= innerWidth;
  }))).toBe(true);
  expect(await page.locator(".indice a").evaluateAll((enlaces) => enlaces.every((enlace) => {
    const rango = document.createRange();
    rango.selectNodeContents(enlace);
    const finDelTexto = Math.max(...Array.from(rango.getClientRects(), (rectangulo) => rectangulo.right));
    const limite = enlace.getBoundingClientRect().right - parseFloat(getComputedStyle(enlace).paddingInlineEnd);
    return finDelTexto <= limite + 1;
  }))).toBe(true);
  expect(await page.locator(".pregunta h3, .pregunta p, .fuentes a[target='_blank'], .fuentes svg[aria-hidden='true']").evaluateAll((elementos) => elementos.every((elemento) => {
    const tarjeta = elemento.closest("article");
    if (!tarjeta) return false;

    const limite = tarjeta.getBoundingClientRect().right - parseFloat(getComputedStyle(tarjeta).paddingInlineEnd);
    if (elemento instanceof SVGElement) return elemento.getBoundingClientRect().right <= limite + 1;

    const rango = document.createRange();
    rango.selectNodeContents(elemento);
    return Array.from(rango.getClientRects()).every((rectangulo) => rectangulo.right <= limite + 1);
  }))).toBe(true);
});
