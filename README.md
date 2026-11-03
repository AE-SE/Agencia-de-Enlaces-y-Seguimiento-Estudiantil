# Agencia de Enlace & Seguimiento Estudiantil

Plataforma gratuita que reúne en un solo lugar la información oficial para entrar a la educación superior en Chile, y acompaña al estudiante antes, durante y después de entrar.

- **Explorar:** fichas de carrera con empleabilidad, ingresos, aranceles, puntajes de corte y acreditación, cada dato con su fuente oficial.
- **Postular:** simulador de puntaje y ranking, beneficios y calendario de plazos.
- **Llegar y avanzar:** acompañamiento psicosocial, psicoeducativo y psicolaboral; seguimiento para no desertar.

La **Ficha de Trayectoria pertenece al estudiante**: él decide qué compartir y con quién.

## Para el equipo

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

```bash
python3 scripts/tokens.py          # genera diseno/tokens.css y verifica contraste WCAG
python3 scripts/tokens.py --check  # solo verifica (lo corre la integración continua)
node --test "tests/**/*.test.ts"   # pruebas de TypeScript, como el protocolo de crisis (Node 24 o superior)
```

## Propiedad

Software propietario. © 2026 Agencia de Enlace & Seguimiento Estudiantil. Todos los derechos reservados. Ver [`LICENSE`](LICENSE).
