import { defineConfig } from "@playwright/test";

// Pruebas de accesibilidad (ADR 0021). Corren contra la aplicación ya compilada:
//   npm run test:a11y        (compila y prueba)
// En una máquina con Edge o Chrome instalado se puede evitar la descarga de Chromium:
//   PLAYWRIGHT_CANAL=msedge npm run test:a11y
const puerto = process.env.PUERTO_A11Y ?? "3200";

export default defineConfig({
  testDir: "./tests/accesibilidad",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${puerto}`,
    channel: process.env.PLAYWRIGHT_CANAL || undefined,
    locale: "es-CL",
  },
  webServer: {
    command: `npm run start -- --port ${puerto}`,
    url: `http://localhost:${puerto}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
