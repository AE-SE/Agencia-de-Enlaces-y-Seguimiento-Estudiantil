# Agencia de Enlace & Seguimiento Estudiantil

https://agencia-de-enlace.rafajaqued.workers.dev/

Proyecto de una fundación sin fines de lucro (se constituye en 2027) para que los estudiantes de 3.º y 4.º medio de liceos con financiamiento público lleguen al final de la media con una meta vocacional clara, información oficial y seguimiento desde su colegio. Territorio de referencia: región de O'Higgins (Colchagua; AIEP San Fernando).

- **Sitio web gratuito para estudiantes:** ficha de carrera con su fuente oficial, comparación, simulación de puntaje, hoja de decisión y guía de trámites y plazos del Formulario Único de Acreditación Socioeconómica (FUAS).
- **Panel de seguimiento para colegios** (suscripción de colegios y sostenedores): meta vocacional, avance y resumen para el docente, solo de estudiantes que lo autorizan; ensayo con prueba oficial publicada y estimación de puntaje comparada con la meta.

El uso es gratuito para el estudiante, siempre. La **Ficha de Trayectoria pertenece al estudiante**: él decide qué comparte con su colegio.

Alcance, problema y fuentes: [`docs/entregable/Entregable_Parte_I.md`](docs/entregable/Entregable_Parte_I.md). El módulo de permanencia, el pulso de check-in y el panel para instituciones de educación superior son proyección, no parte del alcance actual.

## Para el equipo

La guía viva de componentes está en `/componentes`. Incluye opciones de tema,
texto al 200% y estación actual. Contratos de uso y pruebas pendientes en
[`docs/componentes.md`](docs/componentes.md).

Empieza por [`AGENTS.md`](AGENTS.md) y luego por [`docs/equipo/README.md`](docs/equipo/README.md). Son obligatorios para personas y para cualquier IA que trabaje aquí.

| Documento | Para qué |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Reglas del proyecto, flujo de Git, definición de "terminado" |
| [`docs/equipo/`](docs/equipo/) | Forma de trabajo y guía personal de cada integrante |
| [`docs/plan.md`](docs/plan.md) | Plan de trabajo y entregables |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Cómo se arma el sistema |
| [`docs/diseno.md`](docs/diseno.md) | Sistema visual "Mapa de trayecto" y su justificación |
| [`docs/fuentes.md`](docs/fuentes.md) | Catálogo de fuentes oficiales |
| [`docs/privacidad.md`](docs/privacidad.md) | Tratamiento de datos personales (Ley 21.719) |
| [`docs/decisiones/`](docs/decisiones/) | Registro de decisiones (ADR) |
| [`.claude/skills/`](.claude/skills/) | Instrucciones por tipo de tarea, compartidas por todo el equipo |

## Comandos

### Aplicación web (Node.js 24 LTS)

```bash
npm ci             # instala las versiones del archivo de bloqueo
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compilación de producción
npm run start      # sirve la compilación de producción
npm run lint       # revisa TypeScript y las reglas de Next.js
npm test           # ejecuta las pruebas existentes del asistente
```

La portada usa App Router, los tokens de `diseno/tokens.css` y el logo existente,
que adapta su color al modo oscuro. Las tipografías Atkinson Hyperlegible Next
(400 y 700) y Mono (400) se sirven desde `public/fuentes/`, con `font-display: swap`.
Solo se precarga Next 400. La portada carga 17.704 bytes de fuentes; las tres
suman 51.236 bytes. Licencias, procedencia y reproducción en
[`public/fuentes/README.md`](public/fuentes/README.md).

En `/prueba-tipografia` se pueden revisar los caracteres del español, la negrita
y una tabla de cifras ficticias en pesos chilenos con Mono.

El manifiesto se sirve en `/manifest.webmanifest`. La instalación requiere HTTPS
(o localhost para desarrollo) y depende del navegador. Queda pendiente comprobar
la oferta de instalación en Chrome de Android sobre la URL HTTPS de A4.

Tailwind solo dispone de nuestro tema: `bg-agencia-fondo`, `text-agencia-texto`,
`p-4`, `font-texto` y `rounded-agencia` leen variables del sistema de diseño.
Se elimina todo el tema predeterminado: `text-blue-600` no genera estilos.

Referencias de implementación: [PWA en Next.js](https://nextjs.org/docs/app/guides/progressive-web-apps)
y [temas de Tailwind](https://tailwindcss.com/docs/theme).

### Tokens y comprobaciones

```bash
python3 scripts/tokens.py          # genera diseno/tokens.css y verifica contraste WCAG
python3 scripts/tokens.py --check  # solo verifica (lo corre la integración continua)
node --test "tests/**/*.test.ts"   # pruebas de TypeScript, como el protocolo de crisis (Node 24 o superior)
```

## Propiedad

Software propietario. © 2026 Agencia de Enlace & Seguimiento Estudiantil (hasta que se constituya la fundación, proyecto de título sin entidad jurídica). Todos los derechos reservados. Ver [`LICENSE`](LICENSE).
