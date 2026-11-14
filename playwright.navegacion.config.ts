import { defineConfig } from "@playwright/test";
import accesibilidad from "./playwright.config";

const puerto = process.env.PUERTO_NAVEGACION ?? "3231";

export default defineConfig({
  ...accesibilidad,
  testDir: "./tests/navegacion",
  use: { ...accesibilidad.use, baseURL: `http://localhost:${puerto}` },
  webServer: {
    command: `npm run dev -- --port ${puerto}`,
    url: `http://localhost:${puerto}/componentes/navegacion`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
