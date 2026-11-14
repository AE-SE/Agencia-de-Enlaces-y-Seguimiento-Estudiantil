import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

test.use({ viewport: { width: 360, height: 900 }, reducedMotion: "reduce" });
test.beforeEach(async ({ page }) => {
  await page.goto("/componentes/navegacion");
  await expect(page.locator("header[data-medida]")).toBeVisible();
});

test("el menú cierra con Escape, clic fuera y salida del foco", async ({ page }) => {
  const menu = page.locator("details");
  const resumen = page.getByText("Menú", { exact: true });
  await resumen.click();
  const enlaces = page.getByRole("navigation", { name: "Navegación móvil" }).getByRole("link");
  await expect(enlaces).toHaveText(["Carreras", "Comparador", "Beneficios y plazos"]);
  await enlaces.first().focus();
  await enlaces.first().press("Escape");
  await expect(menu).not.toHaveAttribute("open");
  await expect(resumen).toBeFocused();
  await resumen.click();
  await page.getByRole("button", { name: "Ir a diapositiva 2", exact: true }).click();
  await expect(menu).not.toHaveAttribute("open");
  await resumen.click();
  await enlaces.last().focus();
  await enlaces.last().press("Tab");
  await expect(menu).not.toHaveAttribute("open");
});

test("el carrusel responde al teclado y al desplazamiento nativo", async ({ page }) => {
  const carrusel = page.getByRole("region", { name: "Encuentra tu próximo paso" });
  const pista = carrusel.getByLabel("Diapositivas. Usa las flechas para avanzar o retroceder.", { exact: true });
  const indicador = (numero: number) => carrusel.getByRole("button", { name: `Ir a diapositiva ${numero}` });
  await pista.focus();
  await pista.press("ArrowRight");
  await expect(indicador(2)).toHaveAttribute("aria-pressed", "true");
  await pista.press("End");
  await expect(indicador(4)).toHaveAttribute("aria-pressed", "true");
  await pista.press("ArrowLeft");
  await expect(indicador(3)).toHaveAttribute("aria-pressed", "true");
  await pista.press("Home");
  await expect(indicador(1)).toHaveAttribute("aria-pressed", "true");
  await pista.evaluate(elemento => {
    elemento.scrollLeft = elemento.clientWidth * 2;
    for (let i = 0; i < 10; i++) elemento.dispatchEvent(new Event("scroll"));
  });
  await expect(indicador(3)).toHaveAttribute("aria-pressed", "true");
  await expect(carrusel.getByRole("group", { name: "3 de 4" })).toBeVisible();
  await expect(carrusel.getByRole("status")).toContainText("Diapositiva 3 de 4");
});

test("el tren sigue las anclas con la altura real del encabezado y texto ampliado", async ({ page }) => {
  const cabecera = page.locator("header[data-medida]");
  const tren = page.locator("[data-tren]");
  const inicio = await tren.getAttribute("style");
  const destino = page.getByRole("navigation", { name: "Estaciones de esta página" }).getByRole("link", { name: "Beneficios", exact: true });
  for (const ancho of [360, 768, 1280]) {
    await page.setViewportSize({ width: ancho, height: 900 });
    for (const fuente of ["100%", "200%"]) {
      await page.locator("html").evaluate((elemento, valor) => { elemento.style.fontSize = valor; }, fuente);
      await expect.poll(async () => page.locator("main").evaluate(elemento => {
        const cabecera = document.querySelector("header")!;
        return Math.abs(parseFloat(getComputedStyle(elemento.parentElement!).getPropertyValue("--alto-cabecera-portal")) - cabecera.getBoundingClientRect().height);
      })).toBeLessThan(1);
      await destino.click();
      await expect(destino).toHaveAttribute("aria-current", "location");
      await expect(tren).not.toHaveAttribute("style", inicio!);
      const seccion = await page.locator("#beneficios").boundingBox();
      const caja = await cabecera.boundingBox();
      expect(seccion!.y).toBeGreaterThanOrEqual(caja!.y + caja!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

function contraste(a: number[], b: number[]) {
  function luminancia(rgb: number[]) {
    const [r, g, azul] = rgb.map(valor => {
      const canal = valor / 255;
      return canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
    });
    return r * 0.2126 + g * 0.7152 + azul * 0.0722;
  }
  const valores = [luminancia(a), luminancia(b)];
  return (Math.max(...valores) + 0.05) / (Math.min(...valores) + 0.05);
}

for (const tema of ["light", "dark"] as const) {
  test(`logo, contraste y captura de 360 px en tema ${tema}`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: tema });
    const logo = page.getByRole("img", { name: "Agencia de Enlace & Seguimiento Estudiantil", exact: true });
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((imagen: HTMLImageElement) => imagen.complete && imagen.naturalWidth > 0)).toBe(true);
    const fondo = await page.locator("header").evaluate(elemento => getComputedStyle(elemento).backgroundColor.match(/\d+/g)!.map(Number));
    const svg = readFileSync("public/marca/logo-horizontal-oscuro.svg", "utf8");
    const azul = svg.match(/\.a\{fill:(#[\da-f]{6})/i)![1];
    const coral = svg.match(/\.c\{fill:(#[\da-f]{6})/i)![1];
    const rgb = (hex: string) => hex.slice(1).match(/../g)!.map(canal => parseInt(canal, 16));
    expect(contraste(rgb(azul), fondo)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(rgb(coral), fondo)).toBeGreaterThanOrEqual(3);
    const informe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(informe.violations).toEqual([]);
    const captura = info.outputPath(`navegacion-360-${tema}.png`);
    await page.screenshot({ path: captura });
    await info.attach(`navegacion-360-${tema}`, { path: captura, contentType: "image/png" });
  });
}

test("el contenido y las anclas siguen disponibles sin JavaScript", async ({ browser }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 900 } });
  const pagina = await contexto.newPage();
  await pagina.goto(test.info().project.use.baseURL! + "/componentes/navegacion");
  await expect(pagina.locator('[aria-roledescription="diapositiva"]')).toHaveCount(4);
  expect(await pagina.locator("header").evaluate(elemento => getComputedStyle(elemento).position)).toBe("static");
  await pagina.getByRole("navigation", { name: "Estaciones de esta página" }).getByRole("link", { name: "Beneficios", exact: true }).click();
  expect((await pagina.locator("#beneficios").boundingBox())!.y).toBeGreaterThanOrEqual(0);
  await contexto.close();
});
