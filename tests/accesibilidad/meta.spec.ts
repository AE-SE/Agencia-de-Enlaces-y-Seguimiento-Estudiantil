import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { ETIQUETAS_WCAG } from './rutas';

// Códigos de la muestra local usada en CI con OFERTA_LOCAL=1 (los mismos de comparador.spec.ts).
const FICHA_A = '/carreras/universidad-de-chile/enfermeria-santiago-i70s1c41j1v1';
const COMPARADOR = '/comparador?carreras=I70S1C41J1V1,I87S1C49J1V3,I72S1C75J1V1';

// Espera a que la página termine de cargar y de activarse: un clic antes de eso no hace nada.
async function ir(page: Page, ruta: string) {
  await page.goto(ruta);
  await page.waitForLoadState('networkidle');
}

// En el comparador las tarjetas aparecen con movimiento: se espera a que se asienten antes de tocar.
// El primer botón es de la carrera que ya es la meta, así que se toca el segundo que sigue disponible.
async function fijarEnComparador(page: Page) {
  const boton = page.getByRole('button', { name: 'Fijar como mi meta', exact: true }).nth(1);
  await boton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await boton.click();
}

async function nombresEnLista(page: Page) {
  return page.locator('main ol > li h3').allInnerTexts();
}

async function llenar(page: Page) {
  await ir(page, FICHA_A);
  await page.getByRole('button', { name: 'Fijar como mi meta', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'fijaste tu meta' })).toBeVisible();
  await ir(page, COMPARADOR);
  // En el comparador solo se puede fijar la meta: la segunda carrera pasa a ser la meta y la anterior baja.
  await fijarEnComparador(page);
}

test('fijar la meta en la ficha, verla en /meta, recargar, reordenar y borrar', async ({ page }) => {
  await ir(page, FICHA_A);
  await expect(page.getByRole('button', { name: 'Agregar a mis preferencias', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Fijar como mi meta', exact: true }).click();
  const aviso = page.getByRole('status').filter({ hasText: 'fijaste tu meta' });
  await expect(aviso).toBeVisible();
  // El estado se dice con texto, no solo con color.
  await expect(page.getByRole('button', { name: 'Esta es tu meta', exact: true })).toBeVisible();
  await aviso.getByRole('link', { name: 'Ver mi meta', exact: true }).click();
  await expect(page).toHaveURL('/meta');

  await expect(page.getByText('Tu meta', { exact: true })).toBeVisible();
  const primera = (await nombresEnLista(page))[0];
  await page.reload();
  expect(await nombresEnLista(page)).toEqual([primera]);

  // Segunda: desde el comparador, «Fijar como mi meta» de otra carrera la pone primera y la anterior baja a 2.ª.
  await ir(page, COMPARADOR);
  await fijarEnComparador(page);
  await ir(page, '/meta');
  const dos = await nombresEnLista(page);
  expect(dos).toHaveLength(2);
  expect(dos[1]).toBe(primera);
  await expect(page.getByText('2.ª preferencia', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /^Bajar / }).first().click();
  expect(await nombresEnLista(page)).toEqual([dos[1], dos[0]]);
  await page.getByRole('button', { name: /^Subir / }).first().click();
  expect(await nombresEnLista(page)).toEqual(dos);

  await page.getByRole('button', { name: 'Borrar mis datos de este dispositivo', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'borramos tus datos de este dispositivo' })).toBeVisible();
  expect(await nombresEnLista(page)).toEqual([]);
  await page.reload();
  await expect(page.getByText('Todavía no tienes una meta', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buscar una carrera', exact: true })).toHaveAttribute('href', '/carreras');
});

test('agregar: con la lista vacía queda como meta; después va al final y no se repite', async ({ page }) => {
  await ir(page, FICHA_A);
  await page.getByRole('button', { name: 'Agregar a mis preferencias', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'porque la primera de la lista es tu meta' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Esta es tu meta', exact: true })).toBeVisible();
  await ir(page, COMPARADOR);
  await fijarEnComparador(page);
  await ir(page, FICHA_A);
  await expect(page.getByRole('button', { name: 'Ya está en tus preferencias (lugar 2)', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Agregar a mis preferencias', exact: true })).toHaveCount(0);
  await ir(page, '/meta');
  expect(await nombresEnLista(page)).toHaveLength(2);
});

test('la lista llena no tiene fallas de axe en claro y oscuro ni desborda a 360 px', async ({ page }) => {
  await llenar(page);
  await ir(page, '/meta');
  expect((await nombresEnLista(page)).length).toBeGreaterThanOrEqual(2);
  for (const tema of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    const { violations } = await new AxeBuilder({ page }).withTags(ETIQUETAS_WCAG).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`), `axe en tema ${tema}`).toEqual([]);
  }
  await page.setViewportSize({ width: 360, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('html').evaluate((e) => { e.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('lo guardado no viaja: /meta no hace peticiones con los códigos', async ({ page }) => {
  await llenar(page);
  // Página nueva del mismo contexto: no arrastra las precargas de la anterior.
  const otra = await page.context().newPage();
  const peticiones: string[] = [];
  otra.on('request', (r) => peticiones.push(`${r.url()} ${r.postData() ?? ''}`));
  await ir(otra, '/meta');
  await expect(otra.locator('main ol > li')).not.toHaveCount(0);
  const guardados = ['I70S1C41J1V1', 'I87S1C49J1V3', 'I72S1C75J1V1'];
  for (const peticion of peticiones) {
    for (const codigo of guardados) expect(peticion.toLowerCase(), 'una petición lleva un código guardado').not.toContain(codigo.toLowerCase());
  }
  // La clave tampoco está en la URL ni en las cookies.
  expect((await page.context().cookies()).map((c) => c.value).join('')).not.toContain('I70S1C41J1V1');
});

test('si el navegador bloquea el almacenamiento, lo dice y no se rompe', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('bloqueado', 'SecurityError'); } });
  });
  await ir(page, FICHA_A);
  await page.getByRole('button', { name: 'Fijar como mi meta', exact: true }).click();
  await expect(page.getByText('tu navegador no deja guardar', { exact: false })).toBeVisible();
  await ir(page, '/meta');
  await expect(page.getByText('tu navegador no deja guardar', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Borrar mis datos de este dispositivo', exact: true })).toBeVisible();
});
