import { expect, test } from "@playwright/test";
import { RUTAS } from "./rutas";

const ficha = RUTAS.find(({ nombre }) => nombre === "Ficha de carrera")!.ruta;
test.use({ viewport: { width: 360, height: 900 }, reducedMotion: "reduce" });

test("la ficha tiene enlaces de recorrido utilizables con teclado", async ({ page }) => {
  await page.goto(ficha);
  const cabecera = page.locator("header[data-cabecera-portal]");
  await expect(cabecera.getByRole("navigation")).toHaveCount(1);
  const enlaces = cabecera.getByRole("navigation").getByRole("link");
  await expect(enlaces).toHaveText(["Inicio", "Carreras", "Comparador", "Beneficios"]);
  await expect(enlaces).toHaveCount(4);
  for (const [indice, ruta] of ["/", "/carreras", "/comparador", "/beneficios"].entries()) {
    await expect(enlaces.nth(indice)).toHaveAttribute("href", ruta);
  }
  await expect(cabecera.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(cabecera.locator('[aria-current="page"]')).toHaveText("Carreras");
  await page.keyboard.press("Tab");
  const salto = page.getByRole("link", { name: "Ir al contenido", exact: true });
  await expect(salto).toBeFocused();
  await salto.press("Enter");
  await expect(page.locator("main#contenido")).toBeFocused();
  await enlaces.first().focus();
  for (let indice = 0; indice < 4; indice++) {
    await expect(enlaces.nth(indice)).toBeFocused();
    const foco = await enlaces.nth(indice).evaluate(elemento => ({
      estilo: getComputedStyle(elemento).outlineStyle,
      grosor: parseFloat(getComputedStyle(elemento).outlineWidth),
      alto: elemento.getBoundingClientRect().height,
      ancho: elemento.getBoundingClientRect().width,
    }));
    expect(foco.estilo).toBe("solid");
    expect(foco.grosor).toBeGreaterThan(0);
    expect(foco.alto).toBeGreaterThanOrEqual(44);
    expect(foco.ancho).toBeGreaterThanOrEqual(44);
    await page.keyboard.press("Tab");
  }
  const fuente = page.locator("main a").last();
  await fuente.focus();
  await expect(fuente).toBeFocused();
  expect((await fuente.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  await expect(cabecera).toHaveCSS("position", "static");
  await enlaces.first().click();
  await expect(page).toHaveURL("/");
});

for (const tema of ["light", "dark"] as const) {
  test(`ficha legible y sin desbordamiento en tema ${tema}`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: tema });
    await page.goto(ficha);
    for (const ancho of [360, 768, 1280]) {
      await page.setViewportSize({ width: ancho, height: 900 });
      for (const fuente of ["100%", "200%"]) {
        await page.locator("html").evaluate((elemento, valor) => { elemento.style.fontSize = valor; }, fuente);
        const fuera = await page.locator("body *").evaluateAll(elementos => elementos.filter(elemento => {
          const caja = elemento.getBoundingClientRect();
          return caja.width > 0 && caja.right > innerWidth + 1;
        }).map(elemento => ({ elemento: elemento.tagName, clase: elemento.className, texto: elemento.textContent?.slice(0, 50) })).slice(0, 10));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${ancho}px, texto ${fuente}: ${JSON.stringify(fuera)}`).toBe(true);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const partidas = await page.locator("h1, main h2, main h3").evaluateAll(titulos => titulos.flatMap(titulo => {
          const nodo = titulo.firstChild;
          if (nodo?.nodeType !== Node.TEXT_NODE) return [];
          return Array.from(nodo.textContent!.matchAll(/\S+/gu)).filter(palabra => {
            const rango = document.createRange();
            rango.setStart(nodo, palabra.index);
            rango.setEnd(nodo, palabra.index + palabra[0].length);
            return new Set(Array.from(rango.getClientRects(), caja => Math.round(caja.top))).size > 1;
          }).map(palabra => palabra[0]);
        }));
        expect(partidas, `${ancho}px, texto ${fuente}`).toEqual([]);
        await expect(page.getByRole("link", { name: "Beneficios", exact: true })).toBeVisible();
      }
    }
    const nombres = await page.locator('[data-estacion="3"] > span[aria-hidden="true"], [data-estacion="4"] > span[aria-hidden="true"]').allTextContents();
    const proximas = nombres.filter(nombre => nombre.includes("Próximamente")).map(nombre => nombre.split(" · ")[0]);
    await expect(page.getByText(/^Explorar · Estás aquí\./)).toHaveText(`Explorar · Estás aquí. ${proximas.join(" y ")}, próximamente.`);
    await page.locator("html").evaluate(elemento => { elemento.style.fontSize = "100%"; });
    await page.setViewportSize({ width: 360, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`ficha-360-${tema}.png`) });
  });
}

test("tarjetas de la ficha visibles con y sin movimiento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(ficha);
  const tarjeta = page.locator('[data-reveal="tarjeta"]').last();
  await tarjeta.scrollIntoViewIfNeeded();
  await expect(tarjeta).not.toHaveAttribute("data-pendiente");
  await expect(tarjeta).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-pendiente]')).toHaveCount(0);
});

test("la prueba interna de cabeceras responde 404 en producción", async ({ page }) => {
  const respuesta = await page.goto("/componentes/cabeceras");
  expect(respuesta?.status()).toBe(404);
});

test("la ficha conserva el recorrido y los datos sin JavaScript", async ({ browser }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 900 } });
  const page = await contexto.newPage();
  await page.goto(test.info().project.use.baseURL! + ficha);
  await expect(page.getByRole("navigation", { name: "Recorrido del portal" }).getByRole("link")).toHaveCount(4);
  await expect(page.locator('[data-reveal="tarjeta"]').last()).toHaveCSS("opacity", "1");
  await page.getByRole("navigation", { name: "Recorrido del portal" }).getByRole("link", { name: "Inicio", exact: true }).click();
  await expect(page).toHaveURL(test.info().project.use.baseURL! + "/");
  await contexto.close();
});
