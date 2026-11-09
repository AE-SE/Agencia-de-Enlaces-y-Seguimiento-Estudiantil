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
| Cada cifra queda en su nivel: programa completo o sede y jornada ([ADR 0011](../docs/decisiones/0011-comparacion-de-programas.md)) | `programa_variante` guarda sede y jornada; un indicador de una variante debe ser de su mismo programa y no se repite por período | Sección 7 |
| Las alertas de crisis solo las ve el equipo de la agencia, y cada acción queda registrada ([ADR 0019](../docs/decisiones/0019-alertas-de-crisis-y-derivacion.md)) | Sin permisos directos: todo pasa por funciones que verifican el rol y dejan registro en `registro_acceso_alerta` | Secciones 9 y 11 |
| Cada rol tiene solo los permisos otorgados explícitamente (segunda capa, además de RLS) | Se quitan los permisos que Supabase da por defecto y las tablas nuevas no dan nada si no se otorga | Sección 8 |

## Configuración del proyecto Supabase

Al crear el proyecto se eligió (2026-11-02):

| Opción | Valor | Por qué |
|---|---|---|
| Región | South America (São Paulo) | Datos cerca de Chile y menor latencia (ADR 0002) |
| Enable Data API | Activada | La aplicación web accede a la base por esta API |
| Automatically expose new tables | **Desactivada** | Se buscaba que nada quedara accesible por defecto. **No bastó:** los privilegios por defecto del esquema `public` seguían dando todo a `anon` y `authenticated` (revisado el 2026-11-04). Lo corrige `20261104010000_quita_permisos_de_mas.sql` |
| Enable automatic RLS | Activada | Red de seguridad: toda tabla nueva nace con Row Level Security |

Consecuencia: **toda migración que cree una tabla debe otorgar sus permisos explícitamente** (ver la sección "Permisos explícitos" de la migración base). Si una tabla nueva "no aparece" desde la aplicación, lo primero es revisar sus `grant`. La simulación de pruebas (`tests/_simular_supabase.sql`) imita los privilegios por defecto reales, los más permisivos, para que la sección 8 de las pruebas falle si una migración deja permisos de más.

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
| `20261104000000_variantes_de_programa.sql` | 2026-11-04 | Líder (@rafajaque) | 15 tablas, ninguna sin RLS; `programa` sin sede ni jornada; `indicador.variante_id` existe; unidad `estudiantes` agregada; `programa_variante` con política de lectura pública. Al verificar se detectaron los permisos de más |
| `20261104010000_quita_permisos_de_mas.sql` | 2026-11-04 | Líder (@rafajaque) | `anon` solo con SELECT en las 7 tablas públicas; 0 permisos TRUNCATE, REFERENCES o TRIGGER; seguimiento, registro de accesos y consentimientos sin UPDATE ni DELETE de tabla; revocar (`revocado_el`) sigue permitido; 15 tablas con RLS |
| `20261105000000_datos_oficiales_completos.sql` | 2026-11-07 | Líder (@rafajaque), con asistencia de Claude | 21 tablas con RLS activado y 0 sin RLS; las 6 tablas nuevas existen; `programa` sigue vacía (0 filas). Aplicada desde el editor SQL del proyecto de São Paulo, sin respaldo previo (plan gratuito, sin copias automáticas) |
| `20261109100000_autorizacion_tutor_no_autodeclarada.sql` | 2026-11-09 | Líder (@rafajaque), con asistencia de Claude | Antes: `autorizacion_tutor` con 0 filas, política `tutor_propio` (ALL) y INSERT/UPDATE/DELETE para `authenticated`. Después: solo la política `tutor_ver_propio` (SELECT) y `authenticated` solo con SELECT. Aplicada desde el editor SQL, sin respaldo previo (no había filas que perder) |
| `20261108100000_alertas_y_derivacion.sql` | 2026-11-09 | Líder (@rafajaque), con asistencia de Claude | Tablas `alerta_crisis`, `derivacion` y `registro_acceso_alerta` con RLS activado y sin permisos de tabla para `anon` ni `authenticated`; funciones solo con EXECUTE para `authenticated`. Aplicada desde el editor SQL, comprobando antes que el texto pegado tenía el mismo hash que el archivo de `main` |
| `20261108110000_derechos_del_titular.sql` | 2026-11-09 | Líder (@rafajaque), con asistencia de Claude | Tabla `solicitud_derecho` con RLS y 4 funciones (`solicitar_derecho`, `exportar_mis_datos`, `ver_solicitudes_abiertas`, `resolver_solicitud`); `anon` sin EXECUTE. Mismo control de hash |
| `20261109000000_correcciones_alertas_y_exportacion.sql` | 2026-11-09 | Líder (@rafajaque), con asistencia de Claude | Reemplaza `cambiar_estado_alerta` y `exportar_mis_datos` (sin `autor_id`). Mismo control de hash |
| `20261109100000_nota_de_cierre_estructurada.sql` | 2026-11-09 | Líder (@rafajaque), con asistencia de Claude | `cerrar_derivacion` solo con la firma nueva `(uuid, boolean, tipo_derivacion, date)`; columnas `contactada` y `seguimiento_el` en `derivacion`; EXECUTE solo para `authenticated`. Al final: 25 tablas, 0 sin RLS. Mismo control de hash |

## Correr las pruebas en tu computador

Necesitas PostgreSQL 16 instalado localmente.

```bash
PGHOST=localhost PGPORT=5432 PGUSER=postgres bash supabase/tests/correr_pruebas.sh
```

Crea una base temporal, simula las piezas de Supabase (`tests/_simular_supabase.sql`), aplica todas las migraciones, corre `tests/pruebas_rls.sql` y borra la base. Cada línea `ok` es una regla que se intentó romper sin éxito. Si una regla falla, el script se detiene con `FALLA:` y la descripción.

## Pendiente antes de cargar datos reales de personas

- [ ] Cifrado de la columna `seguimiento.contenido` en el servidor de la aplicación, según el [ADR 0007](../docs/decisiones/0007-cifrado-del-seguimiento.md) (aceptado; falta implementarlo).
- [ ] Revisar las condiciones de tratamiento de datos de Supabase y anotarlas en `docs/privacidad.md`.
- [ ] Configurar el inicio de sesión (enlace por correo, sin contraseñas).
