# 0002 — Supabase (PostgreSQL) con Row Level Security para multi-institución

Fecha: 2026-11-02 · Estado: aceptada · ajustada el 2026-11-11

> **Nota del 2026-11-13.** Ya no hay instituciones clientes cuyos datos aislar ([ADR 0032](0032-agencia-independiente-y-publico-egresado.md)). La decisión técnica sigue vigente: la seguridad por filas aísla los datos de cada cuenta. Las tablas de organización y membresía quedan sin uso hasta que una migración las retire.

> **Nota del 2026-11-11.** Lo que se aísla por institución ahora son los colegios y sostenedores (cliente definido en el [ADR 0031](0031-producto-y-organizacion.md)), no las instituciones de educación superior. La decisión técnica (Supabase, RLS en la base, región São Paulo) sigue vigente sin cambio; solo cambia quién es la «institución» que se aísla.

## Contexto
Varias instituciones usarán la misma plataforma. Una institución jamás debe ver estudiantes de otra, ni estudiantes que no la autorizaron. Hay datos de menores y datos sensibles (Ley 21.719).

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| Una base de datos por institución | Aislamiento total | Costo y mantención multiplicados; no cabe en 4 semanas |
| Filtrar por institución en el código | Simple al inicio | Un solo error de código expone datos de otra institución |
| **Una base con Row Level Security (RLS)** | El aislamiento lo impone PostgreSQL; un error en la página no filtra datos | Las políticas deben probarse con cuidado |

## Decisión
Supabase (PostgreSQL gestionado + autenticación) con políticas RLS en todas las tablas de personas, alojado en la región de São Paulo.

## Justificación
RLS hace que la regla de aislamiento viva en la base de datos. Supabase tiene plan gratuito y región en Sudamérica (cercanía de los datos, menor latencia).

## Consecuencias
- Cada política RLS tiene prueba automatizada (`supabase/tests/`).
- El plan gratuito pausa el proyecto tras 7 días de baja actividad (https://supabase.com/docs/guides/platform/free-project-pausing). En desarrollo no es grave; al tener una institución pagando, pasar a plan pagado.
- Verificar en semana 1 las condiciones de tratamiento de datos de Supabase y dejarlas en `docs/privacidad.md`.
