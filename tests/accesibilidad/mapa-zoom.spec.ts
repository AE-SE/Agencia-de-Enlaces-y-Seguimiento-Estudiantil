import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 360, height: 900 }, reducedMotion: "reduce" });

test("el mapa se reajusta sin desborde horizontal con texto al 200 %", async ({ page }) => {
  await page.goto("/mapa");
  await page.locator("html").evaluate(elemento => { elemento.style.fontSize = "200%"; });

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByRole("img", { name: /Mapa de Chile por región/ })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
});
