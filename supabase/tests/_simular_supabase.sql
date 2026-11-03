-- SOLO PARA PRUEBAS LOCALES. No se aplica en Supabase.
--
-- Por qué existe: las políticas de seguridad dependen de piezas que Supabase ya trae
-- (los roles anon y authenticated, el esquema auth y la función auth.uid()).
-- Este archivo las imita en un PostgreSQL común para poder probar las políticas
-- antes de aplicarlas en el proyecto real.

-- Los roles son de todo el servidor: se crean solo si no existen (pruebas repetibles).
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;

create schema auth;
create table auth.users (id uuid primary key, email text);

-- En Supabase, auth.uid() lee el usuario del token de sesión. Aquí lo leemos de una
-- variable que cada prueba fija con: select set_config('request.jwt.claim.sub', '<uuid>', true);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;

-- Supabase otorga por defecto acceso a las tablas del esquema public a estos roles:
-- por eso TODA tabla debe tener Row Level Security activado.
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
