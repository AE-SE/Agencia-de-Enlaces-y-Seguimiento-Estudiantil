import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { FILAS_INDICADORES, GRUPOS_DE_FILAS } from '../../lib/datos/indicadores-vista';

// Códigos de la muestra local usada en CI con OFERTA_LOCAL=1.
const rutaConTres = '/comparador?carreras=I70S1C41J1V1,I87S1C49J1V3,I72S1C75J1V1';
// Esta combinación incluye carreras sin cifras del SIES y fuera del sistema de admisión centralizado: hay datos faltantes que mostrar.
const rutaConDatosFaltantes = '/comparador?carreras=I70S1C41J1V1,I111S4C39J1V1,I915S4C10J1V2';

async function abrirComparacion(pagina: Page) {
  await pagina.goto(rutaConTres);
  await expect(pagina.locator('main').getByRole('alert'), 'La fuente de datos debe estar disponible para comprobar este flujo.').toHaveCount(0);
  await expect(pagina.getByRole('link', { name: 'Quitar carrera', exact: true })).toHaveCount(3);
}

test('la búsqueda GET funciona sin JavaScript', async ({ browser, baseURL }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false });
  const pagina = await contexto.newPage();
  await pagina.goto(`${baseURL}/comparador`);
  const formulario = pagina.locator('form');
  await expect(formulario).toHaveAttribute('method', 'get');
  await formulario.getByRole('textbox').fill('Enfermería');
  await formulario.getByRole('button', { name: 'Buscar', exact: true }).click();
  expect(new URL(pagina.url()).searchParams.get('q')).toBe('Enfermería');
  await expect(pagina.getByRole('textbox')).toHaveValue('Enfermería');
  if (await pagina.locator('main').getByRole('alert').count()) {
    await expect(pagina.getByText('No encontramos carreras', { exact: false })).toHaveCount(0);
  }
  await contexto.close();
});

test('quitar una carrera conserva las otras dos sin JavaScript', async ({ browser, baseURL }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const pagina = await contexto.newPage();
  await abrirComparacion(pagina);
  const quitar = pagina.getByRole('link', { name: 'Quitar carrera', exact: true });
  const destino = await quitar.first().getAttribute('href');
  await quitar.first().click();
  await expect(pagina).toHaveURL(`${baseURL}${destino}`);
  await expect(quitar).toHaveCount(2);
  await expect(pagina.locator('input[name="carreras"]')).toHaveValue('I87S1C49J1V3,I72S1C75J1V1');
  await contexto.close();
});

test('la hoja de decisión recibe las carreras elegidas en el comparador', async ({ page }) => {
  await abrirComparacion(page);
  const enlace = page.getByRole('link', { name: 'Usar estas carreras en mi hoja', exact: true });
  await expect(enlace).toHaveAttribute('href', '/hoja?carreras=I70S1C41J1V1,I87S1C49J1V3,I72S1C75J1V1');
  await enlace.click();
  await expect(page.getByRole('heading', { name: 'Mi hoja de decisión', exact: true })).toBeVisible();
  expect(new URL(page.url()).searchParams.get('carreras')).toBe('I70S1C41J1V1,I87S1C49J1V3,I72S1C75J1V1');
});

test('agregar una carrera desde la búsqueda funciona sin JavaScript', async ({ browser, baseURL }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const pagina = await contexto.newPage();
  await pagina.goto('/comparador?q=Enfermer%C3%ADa');
  await expect(pagina.locator('main').getByRole('alert'), 'La fuente de datos debe estar disponible para comprobar este flujo.').toHaveCount(0);
  const agregar = pagina.getByRole('list', { name: 'Resultados para agregar' }).getByRole('link').first();
  const destino = await agregar.getAttribute('href');
  await agregar.click();
  await expect(pagina).toHaveURL(`${baseURL}${destino}`);
  await expect(pagina.getByRole('link', { name: 'Quitar carrera', exact: true })).toHaveCount(1);
  expect(new URL(pagina.url()).searchParams.get('carreras')).toBeTruthy();
  await contexto.close();
});

test('en teléfono hay un bloque por carrera, sin desborde ni con texto ampliado', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await abrirComparacion(page);
  const bloques = page.getByRole('region', { name: 'Datos comparados por carrera' });
  await expect(bloques.getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('region', { name: 'Datos comparados', exact: true })).toBeHidden();
  await page.locator('html').evaluate(elemento => { elemento.style.fontSize = '200%'; });
  const fuente = bloques.getByRole('link').first();
  await fuente.focus();
  await expect.poll(() => fuente.evaluate(enlace => {
    const caja = enlace.getBoundingClientRect();
    return caja.top >= 0 && caja.bottom <= innerHeight;
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const tema of ['light', 'dark'] as const) {
  test(`las columnas y los datos son accesibles en tema ${tema}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
    await page.goto(rutaConDatosFaltantes);
    await expect(page.getByRole('link', { name: 'Quitar carrera', exact: true })).toHaveCount(3);
    for (const ancho of [360, 375, 768, 1024, 1280]) {
      await page.setViewportSize({ width: ancho, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    for (const ancho of [375, 1280]) {
      await page.setViewportSize({ width: ancho, height: 900 });
      const informe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(informe.violations).toEqual([]);
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    const tabla = page.getByRole('region', { name: 'Datos comparados', exact: true });
    await expect(tabla.getByRole('heading', { level: 2 })).toHaveCount(GRUPOS_DE_FILAS.length);
    await expect(tabla.getByRole('heading', { level: 3 })).toHaveCount(FILAS_INDICADORES.length);
    await expect(page.getByText('Sin datos suficientes', { exact: true }).first()).toBeVisible();
  });
}
