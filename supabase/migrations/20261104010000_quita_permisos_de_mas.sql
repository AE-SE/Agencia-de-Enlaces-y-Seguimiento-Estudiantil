-- =============================================================================
-- Quita los permisos que Supabase otorga por defecto y deja solo los explícitos
--
-- Problema (detectado el 2026-11-04 al verificar la migración de variantes):
-- aunque el proyecto se creó con "Automatically expose new tables" desactivado,
-- los privilegios por defecto del esquema public siguen otorgando TODO
-- (select, insert, update, delete, truncate, references, trigger) a anon y
-- authenticated en cada tabla nueva. Los `grant` de las migraciones se sumaban a
-- eso en vez de ser lo único otorgado. RLS seguía protegiendo las filas, pero se
-- perdía la segunda capa: lo que cada rol puede hacer sobre la tabla.
--
-- Esta migración:
--   1. Quita todo a anon y authenticated en tablas y secuencias de public.
--   2. Vuelve a otorgar exactamente lo que definen el esquema base y la
--      migración de variantes (sin cambios de fondo).
--   3. Cambia los privilegios por defecto para que las tablas, secuencias y
--      funciones futuras no den nada a esos roles: cada migración otorga lo suyo.
--
-- service_role no se toca: es la clave de servicio de los scripts de carga.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Quitar todo
-- -----------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. Volver a otorgar solo lo necesario (igual que las migraciones anteriores)
-- -----------------------------------------------------------------------------
-- A. Datos públicos: solo lectura, para visitantes y usuarios con sesión.
grant select on fuente, institucion, programa, programa_variante, indicador, beneficio, plazo
  to anon, authenticated;

-- B. Datos de personas: solo usuarios con sesión, y solo las operaciones necesarias.
grant select on organizacion, miembro to authenticated;
grant select, insert, update, delete on persona, autorizacion_tutor, ficha_trayectoria to authenticated;
grant select, insert on consentimiento to authenticated;
grant update (revocado_el) on consentimiento to authenticated;   -- revocar = marcar la fecha
grant insert on seguimiento to authenticated;                    -- leer: solo con ver_seguimientos()
grant select on registro_acceso to authenticated;                -- ver quién consultó mis datos

-- -----------------------------------------------------------------------------
-- 3. Nada por defecto para los objetos que creen las próximas migraciones
-- -----------------------------------------------------------------------------
-- Aplica a los objetos que cree el rol que corre las migraciones (postgres).
-- Supabase guarda otra regla igual para su rol interno (supabase_admin), que este
-- proyecto no puede modificar; solo afecta objetos que crea la plataforma.
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from anon, authenticated, public;
