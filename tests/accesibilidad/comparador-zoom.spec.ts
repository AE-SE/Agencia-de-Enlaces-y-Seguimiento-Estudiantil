import { expect, test } from '@playwright/test';

const CARRERA_LARGA = 'I915S4C10J1V2';
const ARANCEL_MAS_ALTO = 'I87S1C49J1V3';
const RUTA = `/comparador?carreras=${CARRERA_LARGA},${ARANCEL_MAS_ALTO}`;

test.use({ viewport: { width: 320, height: 900 }, reducedMotion: 'reduce' });

test('el comparador muestra el nombre y arancel más largos sin desbordarse a 200 %', async ({ page }) => {
  await page.goto(RUTA);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });

  const nombre = page.locator('[class*="descripcionCarrera"]').first();
  await expect(nombre).toHaveText('técnico de nivel superior en trabajo social · cft de la región del biobío · san pedro · diurna');
  await expect(page.getByRole('region', { name: 'Datos comparados por carrera' }).getByText('$7.422.393', { exact: true })).toBeVisible();

  const partidas = await nombre.evaluate(elemento => Array.from(elemento.textContent!.matchAll(/\S+/gu)).filter(palabra => {
    const rango = document.createRange();
    rango.setStart(elemento.firstChild!, palabra.index!);
    rango.setEnd(elemento.firstChild!, palabra.index! + palabra[0].length);
    return new Set(Array.from(rango.getClientRects(), caja => Math.round(caja.top))).size > 1;
  }).map(palabra => palabra[0]));
  expect(partidas).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
