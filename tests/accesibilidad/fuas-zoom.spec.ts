import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 360, height: 900 }, reducedMotion: 'reduce' });

test('las tarjetas del FUAS conservan palabras completas a 200 %', async ({ page }) => {
  await page.goto('/fuas');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });

  const tarjetas = page.locator('[class*="pasos"] li').filter({ has: page.locator('[class*="estado"]') });
  await expect(tarjetas.filter({ hasText: 'Próximo paso' })).toHaveCount(1);
  await expect(tarjetas.filter({ hasText: 'Más adelante' })).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Información de nivel socioeconómico', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Preselección', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Resultados de asignación', exact: true })).toBeVisible();

  const partidas = await tarjetas.locator('[class*="estado"] strong, h3, p').evaluateAll((elementos) => elementos.flatMap((elemento) => {
    const textos = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
    const partidas: string[] = [];
    let nodo: Text | null;
    while ((nodo = textos.nextNode() as Text | null)) {
      for (const palabra of nodo.data.matchAll(/\S+/gu)) {
        const rango = document.createRange();
        rango.setStart(nodo, palabra.index!);
        rango.setEnd(nodo, palabra.index! + palabra[0].length);
        if (new Set(Array.from(rango.getClientRects(), (caja) => Math.round(caja.top))).size > 1) partidas.push(palabra[0]);
      }
    }
    return partidas;
  }));
  expect(partidas).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
