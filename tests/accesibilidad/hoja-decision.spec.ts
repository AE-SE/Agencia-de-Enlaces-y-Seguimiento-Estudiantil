import { expect, test } from '@playwright/test';

const CARRERA_LARGA = 'I915S4C10J1V2';
const ARANCEL_MAS_ALTO = 'I87S1C49J1V3';
const RUTA = `/hoja?carreras=${CARRERA_LARGA},${ARANCEL_MAS_ALTO}`;

test.use({ viewport: { width: 360, height: 900 }, reducedMotion: 'reduce' });

test('la hoja conserva nombres completos y anuncia palabras a 200 %', async ({ page }) => {
  await page.goto(RUTA);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });

  const nombres = page.locator('[class*="nombreCarrera"]');
  await expect(nombres).toHaveCount(2);
  await expect(nombres.first()).toHaveText('técnico de nivel superior en trabajo social · cft de la región del biobío · san pedro · diurna');
  await expect(nombres.nth(1)).toHaveText('ingeniería civil informática · universidad de concepción · casa central · diurna');
  expect(await page.locator('[class*="grupoCifra"]').count()).toBeGreaterThan(0);
  await expect(page.getByText('$7.422.393', { exact: true })).toBeVisible();

  const partidas = await nombres.evaluateAll(elementos => elementos.flatMap(elemento => Array.from(elemento.textContent!.matchAll(/\S+/gu)).filter(palabra => {
    const rango = document.createRange();
    rango.setStart(elemento.firstChild!, palabra.index!);
    rango.setEnd(elemento.firstChild!, palabra.index! + palabra[0].length);
    return new Set(Array.from(rango.getClientRects(), caja => Math.round(caja.top))).size > 1;
  }).map(palabra => palabra[0])));
  expect(partidas).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
