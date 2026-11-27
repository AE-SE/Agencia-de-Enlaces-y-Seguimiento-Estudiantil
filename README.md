# Agencia de Enlace & Seguimiento Estudiantil

https://agencia-de-enlace.rafajaqued.workers.dev/

Una agencia independiente que reúne, explica y deja comparable la información oficial de la educación superior chilena, gratis, para toda persona que egresa de 4.º medio y no ha ingresado a la educación superior. Alcance nacional. Es un proyecto de título; en 2027 se constituye como sociedad por acciones (SpA).

- **Para la persona que egresa (gratis, sin cuenta):** los datos oficiales de cada carrera con su fuente y sus comparaciones (empleabilidad, duración formal y real, vacantes, arancel), comparador, simulación del puntaje ponderado, meta y hasta dos preferencias (tres carreras en total) y alternativas cercanas, y calendario de admisión y beneficios.
- **Para organizaciones que lo encarguen:** informes de datos y asesorías, con el método y las fuentes a la vista. La agencia no sale a venderlos.
- **Para servicios educativos que no son instituciones de educación superior:** un espacio de aviso rotulado, sin rastreo y fuera de las pantallas donde se compara o se decide ([ADR 0040](docs/decisiones/0040-avisos-de-servicios-educativos.md)).

**Independencia:** el sitio no ordena, destaca ni recomienda instituciones por ser clientes.

**Qué hay publicado hoy (26 de noviembre de 2026):** portada, explorador de carreras con buscador y filtros, ficha de cada carrera (empleabilidad, ingreso, retención, continuidad, duración formal y real, arancel, costo del primer año, vacantes, puntaje de corte, ponderaciones del DEMRE y acreditación, cada dato con fuente y fecha), comparador, hoja de decisión imprimible, simulador de puntaje, beneficios con su calendario, guía del FUAS, explorador de ocupaciones, mapa de carreras por región, preguntas frecuentes con glosario, meta y hasta dos preferencias (tres carreras en total) con alternativas cercanas y próximos plazos, comparaciones de empleabilidad en la ficha, calendario de admisión, la página «Quiénes somos» y un espacio publicitario sin anunciante ([ADR 0040](docs/decisiones/0040-avisos-de-servicios-educativos.md)). Estado al día de cada tarea en [`docs/plan.md`](docs/plan.md).

Alcance, problema y fuentes: [`docs/entregable/Entregable_Parte_I.md`](docs/entregable/Entregable_Parte_I.md). Decisión vigente: [ADR 0032](docs/decisiones/0032-agencia-independiente-y-publico-egresado.md). La cuenta con correo, el asistente, las noticias, el tablero de transparencia y los informes están diseñados y no son parte de la entrega del 19 de diciembre de 2026.

## Para el equipo

La guía viva de componentes está en `/componentes` (solo en desarrollo: `npm run dev`). Incluye opciones de tema,
texto al 200% y estación actual. Contratos de uso y pruebas pendientes en
[`docs/componentes.md`](docs/componentes.md).

Empieza por [`AGENTS.md`](AGENTS.md) y luego por [`docs/equipo/README.md`](docs/equipo/README.md). Son obligatorios para personas y para cualquier IA que trabaje aquí.

| Documento | Para qué |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Reglas del proyecto, flujo de Git, definición de "terminado" |
| [`docs/equipo/`](docs/equipo/) | Forma de trabajo y guía personal de cada integrante |
| [`docs/plan.md`](docs/plan.md) | Plan de trabajo y entregables |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Cómo se arma el sistema |
| [`docs/diseno.md`](docs/diseno.md) | Sistema visual «Mapa de trayecto» con la base Andén urbano, y su justificación |
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
npm test           # pruebas unitarias de TypeScript (cálculos, datos, asistente)
npm run test:a11y  # compila y corre accesibilidad (axe) y navegación con Playwright
```

La portada usa App Router, los tokens de `diseno/tokens.css` y el logo existente,
que adapta su color al modo oscuro. Las tipografías Atkinson Hyperlegible Next
(400 y 700) y Mono (400) se sirven desde `public/fuentes/`, con `font-display: swap`.
Solo se precarga Next 400. La portada carga 17.704 bytes de fuentes; las tres
suman 51.236 bytes. Licencias, procedencia y reproducción en
[`public/fuentes/README.md`](public/fuentes/README.md).

Los caracteres del español se verifican con `python3 scripts/fuentes.py --check` (lo corre la CI).

El manifiesto se sirve en `/manifest.webmanifest`. La instalación requiere HTTPS
(o localhost para desarrollo) y depende del navegador. Queda pendiente comprobar
la oferta de instalación en Chrome de Android sobre la URL publicada.

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

Software propietario. © 2026 Agencia de Enlace & Seguimiento Estudiantil (hasta que se constituya la sociedad, proyecto de título sin entidad jurídica). Todos los derechos reservados. El repositorio es público solo para lectura ([ADR 0028](docs/decisiones/0028-repositorio-publico.md)). Ver [`LICENSE`](LICENSE).
