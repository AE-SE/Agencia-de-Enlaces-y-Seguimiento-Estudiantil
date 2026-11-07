# Herramientas por necesidad comprobada

Fecha de revisión: 2026-11-05

La Agencia no adopta herramientas por tendencia. Cada una entra cuando elimina una incertidumbre concreta del proyecto y queda cubierta por una prueba o una decisión revisable.

## Orden de adopción

### 1. Supabase CLI: antes de conectar la base real

Repositorio: [supabase/cli](https://github.com/supabase/cli) · licencia MIT · revisado el 2026-11-05.

Es la siguiente herramienta a incorporar. Levanta una instancia local de Supabase, aplica las migraciones y ejecuta las pruebas SQL con pgTAP. Así las políticas de seguridad por filas y las restricciones de las migraciones se comprueban antes de la integración continua, en vez de descubrir errores solo allí.

Se adopta cuando el líder entregue el proyecto de Supabase. La primera condición de salida es que `supabase test db` ejecute las pruebas de `supabase/tests/` en local y en la integración continua. No se conecta a producción para probar.

Fuente: [pruebas de base de datos de Supabase](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/testing.mdx).

### 2. Playwright: cuando el portal lea la oferta real

Repositorio: [microsoft/playwright](https://github.com/microsoft/playwright) · licencia Apache-2.0 · revisado el 2026-11-05.

Las pruebas unitarias no alcanzan para confirmar que una persona vea una ficha completa. Playwright serviría para recorrer el explorador y una ficha en un navegador: buscar, abrir una carrera, revisar fuente y período, y confirmar el estado correcto cuando falte una cifra.

Se evalúa al reemplazar las diez carreras de ejemplo por la oferta real. El primer caso debe correr en ancho de 360 px y con teclado. No se agrega para probar pantallas que todavía no existen.

Fuente: [repositorio de Playwright](https://github.com/microsoft/playwright).

### 3. Lighthouse CI: cuando exista una ruta estable para medir

Repositorio: [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) · licencia Apache-2.0 · revisado el 2026-11-05.

Las fichas públicas prometen cargar con poca señal y ser accesibles. Lighthouse CI permite convertir esa promesa en umbrales repetibles de rendimiento, accesibilidad y posicionamiento en buscadores. Una baja visible en el PR evita descubrirla después de publicar.

Se evalúa después de Playwright y con rutas públicas estables. Los umbrales se definen a partir de una primera medición real; no se inventan porcentajes para hacer pasar o caer una compilación.

Fuente: [configuración de aserciones de Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md).

## Herramientas en espera

### Pandera

Repositorio: [unionai-oss/pandera](https://github.com/unionai-oss/pandera) · licencia MIT · revisado el 2026-11-05.

Ayuda a declarar esquemas y rangos de archivos tabulares. Podría reducir repetición cuando varias cargas compartan validaciones de columnas, tipos y nulos. Hoy los scripts Python y sus pruebas ya cubren el tamaño del problema, por lo que agregar una dependencia no se justifica.

Se reevalúa si la misma regla de validación aparece en tres o más cargadores.

### Vercel AI SDK

Repositorio: [vercel/ai](https://github.com/vercel/ai) · licencia Apache-2.0 · revisado el 2026-11-05.

Puede facilitar streaming y respuestas estructuradas en la interfaz del asistente. No reemplaza la capa propia `lib/ia/`, que existe para controlar proveedor, privacidad, crisis y fuentes. Tampoco se incorpora antes de tener un caso de interfaz que las utilidades actuales no resuelvan.

Se reevalúa al construir la pantalla pública del asistente con respuestas en streaming.

## Regla de descarte

Una herramienta no entra si solo reemplaza código que ya funciona, obliga a cambiar Cloudflare, Supabase o Gemini, o recibe datos personales. Toda dependencia nueva requiere justificación en el PR, licencia compatible y pruebas que demuestren el problema que resuelve.
