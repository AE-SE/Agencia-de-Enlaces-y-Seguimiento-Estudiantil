import { expect, test } from "@playwright/test";

for (const tema of ["light", "dark"] as const) {
  test(`los títulos de tarjetas conservan palabras completas en tema ${tema}`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: "reduce" });
    await page.goto("/carreras");
    await page.evaluate(() => document.fonts.ready);
    const titulo = page.getByRole("article").first().getByRole("heading", { level: 3 });
    await titulo.evaluate(elemento => { elemento.textContent = "Administración de Empresas"; });
    for (const ancho of [360, 375, 768, 1024, 1280]) {
      await page.setViewportSize({ width: ancho, height: 900 });
      for (const porcentaje of [100, 200]) {
        await page.evaluate(valor => { document.documentElement.style.fontSize = `${valor}%`; }, porcentaje);
        const partidas = await titulo.evaluate(elemento => Array.from(elemento.textContent!.matchAll(/\S+/gu)).filter(palabra => {
          const rango = document.createRange();
          rango.setStart(elemento.firstChild!, palabra.index);
          rango.setEnd(elemento.firstChild!, palabra.index + palabra[0].length);
          return new Set(Array.from(rango.getClientRects(), caja => Math.round(caja.top))).size > 1;
        }).map(palabra => palabra[0]));
        expect(partidas, `${ancho}px, texto ${porcentaje}%`).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (ancho === 360 && porcentaje === 200) {
          await titulo.scrollIntoViewIfNeeded();
          await page.screenshot({ path: info.outputPath(`tarjeta-360-200-${tema}.png`) });
        }
      }
    }
  });
}

test("cada indicador de la tarjeta declara su nivel de origen", async ({ page }) => {
  await page.goto("/carreras");
  // La oferta de muestra (OFERTA_LOCAL=1) incluye para Enfermería un indicador
  // de toda la carrera y otro de sede y jornada; ambos son necesarios en este caso.
  const tarjeta = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Enfermería", exact: true }) });
  await expect(tarjeta.getByText("Toda la carrera en esta institución.", { exact: true })).toBeVisible();
  await expect(tarjeta.getByText("Esta sede y jornada.", { exact: true })).toBeVisible();
});
