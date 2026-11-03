# Base de datos (Supabase)

| Carpeta | Contenido |
|---|---|
| `migrations/` | Cambios al esquema, en orden por fecha. **Nunca se edita una migración ya aplicada**: se crea una nueva. |
| `tests/` | Pruebas de seguridad que corren en un PostgreSQL local y en la integración continua. |

Diseño y justificación: [`docs/arquitectura.md`](../docs/arquitectura.md), secciones 3 y 4, y [ADR 0002](../docs/decisiones/0002-supabase-con-rls.md).

## Qué protege el esquema

Las reglas viven en la base de datos (Row Level Security), así que aunque una página tenga un error, la base no entrega datos a quien no corresponde.

| Regla | Cómo se cumple | Prueba |
|---|---|---|
| Los datos de carreras son públicos, pero nadie los modifica desde la página | Lectura para todos; escritura solo con la clave de servicio (scripts de carga) | Sección 1 |
| Cada persona es dueña de sus datos | Solo ve y edita lo suyo | Sección 2 |
| Una institución ve a un estudiante solo con su consentimiento vigente | Política sobre `consentimiento`, por organización y por finalidad | Sección 3 |
| Revocar es inmediato y queda historial | Solo se puede marcar la fecha de revocación; no se borra ni se "des-revoca" | Sección 4 |
| Menores de 18 necesitan autorización del tutor | Un menor no puede otorgar consentimientos sin `autorizacion_tutor` | Sección 5 |
| El seguimiento es sensible y cada lectura queda registrada | Sin lectura directa; solo con `ver_seguimientos()`, que registra quién y cuándo; la persona ve ese registro | Sección 6 |
| Sin dato no es cero | Un indicador sin valor exige el motivo; porcentajes entre 0 y 100 | Sección 7 |

## Configuración del proyecto Supabase

Al crear el proyecto se eligió (2026-11-02):

| Opción | Valor | Por qué |
|---|---|---|
| Región | South America (São Paulo) | Datos cerca de Chile y menor latencia (ADR 0002) |
| Enable Data API | Activada | La aplicación web accede a la base por esta API |
| Automatically expose new tables | **Desactivada** | Nada queda accesible por defecto: la migración otorga cada permiso de forma explícita |
| Enable automatic RLS | Activada | Red de seguridad: toda tabla nueva nace con Row Level Security |

Consecuencia: **toda migración que cree una tabla debe otorgar sus permisos explícitamente** (ver la sección "Permisos explícitos" de la migración base). Si una tabla nueva "no aparece" desde la aplicación, lo primero es revisar sus `grant`.

## Aplicar el esquema en Supabase (lo hace el líder)

1. En el panel de Supabase del proyecto (región São Paulo), abre **SQL Editor → New query**.
2. Copia el contenido completo de `migrations/20261103000000_esquema_base.sql`, pégalo y presiona **Run**.
3. Revisa en **Table Editor** que aparezcan las 14 tablas y que cada una muestre "RLS enabled".
4. Anota en el PR o en el grupo la fecha y hora en que se aplicó.

Más adelante, cuando haya más migraciones, conviene usar la línea de comandos de Supabase (`supabase db push`), que aplica solo las que faltan.

**Nunca** apliques una migración que no esté fusionada en `main`.

### Registro de aplicación

| Migración | Aplicada | Por | Verificación |
|---|---|---|---|
| `20261103000000_esquema_base.sql` | 2026-11-02 | Líder (@rafajaque) | 14 tablas con RLS activado; sin sesión solo se ven las 6 tablas públicas |

## Correr las pruebas en tu computador

Necesitas PostgreSQL 16 instalado localmente.

```bash
PGHOST=localhost PGPORT=5432 PGUSER=postgres bash supabase/tests/correr_pruebas.sh
```

Crea una base temporal, simula las piezas de Supabase (`tests/_simular_supabase.sql`), aplica todas las migraciones, corre `tests/pruebas_rls.sql` y borra la base. Cada línea `ok` es una regla que se intentó romper sin éxito. Si una regla falla, el script se detiene con `FALLA:` y la descripción.

## Pendiente antes de cargar datos reales de personas

- [ ] Cifrado de la columna `seguimiento.contenido` (Supabase Vault o pgsodium), con su ADR.
- [ ] Revisar las condiciones de tratamiento de datos de Supabase y anotarlas en `docs/privacidad.md`.
- [ ] Configurar el inicio de sesión (enlace por correo, sin contraseñas).
