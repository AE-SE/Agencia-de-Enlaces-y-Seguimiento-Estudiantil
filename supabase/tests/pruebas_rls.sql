-- Pruebas de las políticas de seguridad (Row Level Security) del esquema base.
-- Cada prueba intenta ROMPER una regla de privacidad y verifica que la base lo impide.
-- Todos los datos son ficticios.
--
-- Cómo correrlas: ver supabase/tests/README.md
\set ON_ERROR_STOP on
\set QUIET on
set client_min_messages = warning;

-- -----------------------------------------------------------------------------
-- Herramientas de prueba
-- -----------------------------------------------------------------------------
create schema prueba;
grant usage on schema prueba to anon, authenticated;

create function prueba.afirmar(condicion boolean, descripcion text) returns void
language plpgsql as $$
begin
  if condicion is not true then
    raise exception 'FALLA: %', descripcion;
  end if;
  raise notice 'ok  %', descripcion;
end $$;

-- Ejecuta una instrucción que DEBE ser rechazada.
create function prueba.debe_fallar(instruccion text, descripcion text) returns void
language plpgsql as $$
begin
  begin
    execute instruccion;
  exception when others then
    raise notice 'ok  %  (rechazado: %)', descripcion, sqlerrm;
    return;
  end;
  raise exception 'FALLA: % (la instrucción no fue rechazada)', descripcion;
end $$;

-- Cuenta filas visibles para el rol y usuario actuales.
create function prueba.contar(instruccion text) returns bigint
language plpgsql as $$
declare n bigint;
begin
  execute 'select count(*) from (' || instruccion || ') t' into n;
  return n;
end $$;

grant execute on all functions in schema prueba to anon, authenticated;
set client_min_messages = notice;

-- -----------------------------------------------------------------------------
-- Datos ficticios (como administrador, igual que los scripts de carga)
-- -----------------------------------------------------------------------------
insert into auth.users (id, email) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'ana@ejemplo.cl'),           -- estudiante adulta
  ('bbbbbbbb-0000-0000-0000-000000000002', 'benja@ejemplo.cl'),         -- estudiante menor de edad
  ('cccccccc-0000-0000-0000-000000000003', 'admision-x@ejemplo.cl'),    -- miembro institución X
  ('dddddddd-0000-0000-0000-000000000004', 'admision-y@ejemplo.cl');    -- miembro institución Y

insert into fuente (id, organismo, nombre, url) values
  ('f0000000-0000-0000-0000-000000000001', 'Fuente ficticia', 'Base de prueba', 'https://ejemplo.cl');

insert into institucion (id, codigo_oficial, nombre, tipo) values
  ('10000000-0000-0000-0000-000000000001', '0001', 'Instituto X (ficticio)', 'instituto_profesional'),
  ('10000000-0000-0000-0000-000000000002', '0002', 'Instituto Y (ficticio)', 'instituto_profesional');

insert into programa (id, institucion_id, nombre, fuente_id) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Carrera ficticia', 'f0000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Otra carrera ficticia', 'f0000000-0000-0000-0000-000000000001');

-- La misma carrera en dos jornadas: dos variantes de un solo programa (ADR 0011).
insert into programa_variante (id, programa_id, codigo_sies, sede, jornada, fuente_id) values
  ('21000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'P001D', 'Sede ficticia', 'diurna', 'f0000000-0000-0000-0000-000000000001'),
  ('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'P001V', 'Sede ficticia', 'vespertina', 'f0000000-0000-0000-0000-000000000001');

insert into organizacion (id, nombre, tipo, institucion_id) values
  ('30000000-0000-0000-0000-000000000001', 'Institución X', 'institucion', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000002', 'Institución Y', 'institucion', '10000000-0000-0000-0000-000000000002');

insert into miembro (organizacion_id, usuario_id, rol) values
  ('30000000-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000003', 'acompanante'),
  ('30000000-0000-0000-0000-000000000002', 'dddddddd-0000-0000-0000-000000000004', 'acompanante');

-- =============================================================================
\echo '--- 1. Datos públicos'
-- =============================================================================
set role anon;
select prueba.afirmar(prueba.contar('select * from programa') = 2, 'un visitante sin sesión ve las carreras');
select prueba.afirmar(prueba.contar('select * from programa_variante') = 2, 'un visitante sin sesión ve las sedes y jornadas');
select prueba.debe_fallar($$insert into programa (institucion_id, nombre, fuente_id)
  values ('10000000-0000-0000-0000-000000000001', 'Falsa', 'f0000000-0000-0000-0000-000000000001')$$,
  'un visitante sin sesión no puede crear carreras');
select prueba.debe_fallar($$insert into programa_variante (programa_id, codigo_sies, fuente_id)
  values ('20000000-0000-0000-0000-000000000001', 'P999', 'f0000000-0000-0000-0000-000000000001')$$,
  'un visitante sin sesión no puede crear sedes ni jornadas');
select prueba.debe_fallar('select * from persona', 'un visitante sin sesión no puede leer personas');
reset role;

-- =============================================================================
\echo '--- 2. Cada persona es dueña de sus datos'
-- =============================================================================
set role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-0000-0000-0000-000000000001', false);
insert into persona (id, nombre, fecha_nacimiento, region) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Ana Prueba', current_date - interval '20 years', 'O''Higgins');
insert into ficha_trayectoria (persona_id) values ('aaaaaaaa-0000-0000-0000-000000000001');
select prueba.afirmar(prueba.contar('select * from persona') = 1, 'Ana ve su propio registro');
select prueba.debe_fallar($$insert into persona (id, nombre, fecha_nacimiento)
  values ('bbbbbbbb-0000-0000-0000-000000000002', 'Suplantación', '2000-01-01')$$,
  'Ana no puede crear un registro a nombre de otra persona');

select set_config('request.jwt.claim.sub', 'bbbbbbbb-0000-0000-0000-000000000002', false);
insert into persona (id, nombre, fecha_nacimiento, region) values
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Benja Prueba', current_date - interval '17 years', 'Maule');
select prueba.afirmar(prueba.contar('select * from persona') = 1, 'Benja ve solo su registro, no el de Ana');
select prueba.afirmar(prueba.contar('select * from ficha_trayectoria') = 0, 'Benja no ve la ficha de Ana');

-- =============================================================================
\echo '--- 3. Las instituciones solo ven con consentimiento vigente'
-- =============================================================================
select set_config('request.jwt.claim.sub', 'cccccccc-0000-0000-0000-000000000003', false);
select prueba.afirmar(prueba.contar('select * from persona') = 0, 'la institución X no ve a nadie sin consentimiento');

select set_config('request.jwt.claim.sub', 'aaaaaaaa-0000-0000-0000-000000000001', false);
insert into consentimiento (persona_id, organizacion_id, finalidad) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'compartir_ficha');

select set_config('request.jwt.claim.sub', 'cccccccc-0000-0000-0000-000000000003', false);
select prueba.afirmar(prueba.contar('select * from persona') = 1, 'con consentimiento, X ve a Ana');
select prueba.afirmar(prueba.contar('select * from ficha_trayectoria') = 1, 'con consentimiento, X ve la ficha de Ana');
select prueba.afirmar(prueba.contar($$select * from persona where id = 'bbbbbbbb-0000-0000-0000-000000000002'$$) = 0,
  'X sigue sin ver a Benja, que no le dio consentimiento');

select set_config('request.jwt.claim.sub', 'dddddddd-0000-0000-0000-000000000004', false);
select prueba.afirmar(prueba.contar('select * from persona') = 0, 'la institución Y no ve a Ana: el consentimiento fue solo para X');
select prueba.afirmar(prueba.contar('select * from consentimiento') = 0, 'Y no ve consentimientos dirigidos a X');

-- =============================================================================
\echo '--- 4. Revocar es inmediato y queda en el historial'
-- =============================================================================
select set_config('request.jwt.claim.sub', 'aaaaaaaa-0000-0000-0000-000000000001', false);
update consentimiento set revocado_el = now() where finalidad = 'compartir_ficha';

select set_config('request.jwt.claim.sub', 'cccccccc-0000-0000-0000-000000000003', false);
select prueba.afirmar(prueba.contar('select * from persona') = 0, 'tras revocar, X deja de ver a Ana');

select set_config('request.jwt.claim.sub', 'aaaaaaaa-0000-0000-0000-000000000001', false);
update consentimiento set revocado_el = null;   -- intento de "des-revocar": la regla no deja tocar filas revocadas
select prueba.afirmar(prueba.contar('select * from consentimiento where revocado_el is null') = 0,
  'un consentimiento revocado no se puede "des-revocar"');
select prueba.debe_fallar($$update consentimiento set finalidad = 'datos_socioeconomicos'$$,
  'no se puede cambiar la finalidad de un consentimiento ya otorgado');
select prueba.debe_fallar($$delete from consentimiento$$,
  'un consentimiento no se borra: se revoca y queda en el historial');
select prueba.afirmar(prueba.contar('select * from consentimiento') = 1, 'el consentimiento revocado sigue en el historial de Ana');

-- =============================================================================
\echo '--- 5. Menores de 18 necesitan autorización de su tutor'
-- =============================================================================
select set_config('request.jwt.claim.sub', 'bbbbbbbb-0000-0000-0000-000000000002', false);
select prueba.debe_fallar($$insert into consentimiento (persona_id, organizacion_id, finalidad)
  values ('bbbbbbbb-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'compartir_ficha')$$,
  'Benja (17 años) no puede compartir su ficha sin autorización de su tutor');
insert into autorizacion_tutor (persona_id, nombre_tutor, contacto_tutor, metodo)
  values ('bbbbbbbb-0000-0000-0000-000000000002', 'Tutora Prueba', 'tutora@ejemplo.cl', 'correo confirmado');
insert into consentimiento (persona_id, organizacion_id, finalidad) values
  ('bbbbbbbb-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'compartir_ficha');
select prueba.afirmar(prueba.contar('select * from consentimiento') = 1, 'con autorización del tutor, Benja sí puede compartir');

-- =============================================================================
\echo '--- 6. Seguimiento: dato sensible, con consentimiento propio y registro de accesos'
-- =============================================================================
select set_config('request.jwt.claim.sub', 'cccccccc-0000-0000-0000-000000000003', false);
select prueba.debe_fallar($$insert into seguimiento (persona_id, organizacion_id, autor_id, tipo, contenido)
  values ('aaaaaaaa-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
          'cccccccc-0000-0000-0000-000000000003', 'nota', 'Nota ficticia')$$,
  'X no puede registrar seguimiento sin consentimiento de acompañamiento');

select set_config('request.jwt.claim.sub', 'aaaaaaaa-0000-0000-0000-000000000001', false);
insert into consentimiento (persona_id, organizacion_id, finalidad) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'acompanamiento_bienestar');

select set_config('request.jwt.claim.sub', 'cccccccc-0000-0000-0000-000000000003', false);
insert into seguimiento (persona_id, organizacion_id, autor_id, tipo, contenido) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
   'cccccccc-0000-0000-0000-000000000003', 'nota', 'Nota ficticia de acompañamiento');
select prueba.debe_fallar($$insert into seguimiento (persona_id, organizacion_id, autor_id, tipo, contenido)
  values ('aaaaaaaa-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
          'dddddddd-0000-0000-0000-000000000004', 'nota', 'Firma ajena')$$,
  'nadie puede registrar seguimiento firmando como otra persona');
select prueba.debe_fallar('select * from seguimiento', 'nadie lee seguimientos directamente (solo con registro de acceso)');
select prueba.afirmar(prueba.contar($$select * from ver_seguimientos('aaaaaaaa-0000-0000-0000-000000000001')$$) = 1,
  'X lee el seguimiento de Ana mediante la función con registro');

select set_config('request.jwt.claim.sub', 'dddddddd-0000-0000-0000-000000000004', false);
select prueba.debe_fallar($$select * from ver_seguimientos('aaaaaaaa-0000-0000-0000-000000000001')$$,
  'Y no puede leer el seguimiento de Ana');

select set_config('request.jwt.claim.sub', 'aaaaaaaa-0000-0000-0000-000000000001', false);
select prueba.afirmar(prueba.contar('select * from registro_acceso') = 1, 'Ana ve que X consultó su seguimiento');
select prueba.debe_fallar($$delete from registro_acceso$$, 'nadie puede borrar el registro de accesos');
select prueba.debe_fallar($$insert into registro_acceso (usuario_id, persona_id, tabla, accion)
  values ('aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'x', 'x')$$,
  'nadie puede escribir registros de acceso falsos');
reset role;

-- =============================================================================
\echo '--- 7. Integridad de los datos oficiales'
-- =============================================================================
select prueba.debe_fallar($$insert into indicador (programa_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta)
  values ('20000000-0000-0000-0000-000000000001', 'empleabilidad_1er_anio', null, 'porcentaje', 'titulados 2023',
          'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date)$$,
  'un indicador sin valor exige el motivo (sin dato no es cero)');
select prueba.debe_fallar($$insert into indicador (programa_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta)
  values ('20000000-0000-0000-0000-000000000001', 'empleabilidad_1er_anio', 140, 'porcentaje', 'titulados 2023',
          'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date)$$,
  'un porcentaje no puede pasar de 100');
insert into indicador (programa_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta, motivo_sin_dato)
  values ('20000000-0000-0000-0000-000000000001', 'ingreso_promedio_4to_anio', null, 'pesos', 'titulados 2021',
          'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date, 'Muestra insuficiente según la fuente');
select prueba.afirmar(true, 'un indicador sin valor y con motivo se acepta');

-- Nivel de cada indicador (ADR 0011): el programa completo o una sede y jornada.
insert into indicador (programa_id, variante_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta) values
  ('20000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'arancel_anual', 3000000, 'pesos',
   'año 2026', 'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date),
  ('20000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000002', 'arancel_anual', 2500000, 'pesos',
   'año 2026', 'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date);
select prueba.afirmar(true, 'cada jornada lleva su propio arancel en el mismo período');
select prueba.debe_fallar($$insert into indicador (programa_id, variante_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta)
  values ('20000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000001', 'arancel_anual', 1, 'pesos',
          'año 2026', 'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date)$$,
  'una cifra de una sede no puede quedar colgada de otra carrera');
select prueba.debe_fallar($$insert into indicador (programa_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta, motivo_sin_dato)
  values ('20000000-0000-0000-0000-000000000001', 'ingreso_promedio_4to_anio', null, 'pesos', 'titulados 2021',
          'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date, 'Duplicado')$$,
  'un indicador del programa completo no se repite en el mismo período');
select prueba.debe_fallar($$insert into programa (institucion_id, nombre, fuente_id)
  values ('10000000-0000-0000-0000-000000000001', 'Carrera ficticia', 'f0000000-0000-0000-0000-000000000001')$$,
  'una carrera aparece una sola vez por institución');
insert into indicador (programa_id, variante_id, tipo, valor, unidad, periodo, fuente_id, url, fecha_consulta) values
  ('20000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'matricula', 120, 'estudiantes',
   'año 2026', 'f0000000-0000-0000-0000-000000000001', 'https://ejemplo.cl', current_date);
select prueba.afirmar(true, 'la matrícula se cuenta en estudiantes, no en cupos');

-- =============================================================================
\echo '--- 8. Permisos: solo los otorgados explícitamente'
-- =============================================================================
-- Segunda capa de protección, además de RLS: lo que cada rol puede hacer sobre la tabla.
select prueba.afirmar(not exists (
    select 1 from information_schema.role_table_grants
    where table_schema = 'public' and grantee = 'anon' and privilege_type <> 'SELECT'),
  'un visitante sin sesión solo puede leer: ningún otro permiso en ninguna tabla');
select prueba.afirmar((
    select array_agg(table_name::text order by table_name) from information_schema.role_table_grants
    where table_schema = 'public' and grantee = 'anon') =
  array['beneficio', 'fuente', 'indicador', 'institucion', 'plazo', 'programa', 'programa_variante'],
  'un visitante sin sesión lee solo las 7 tablas de datos públicos');
select prueba.afirmar(not exists (
    select 1 from information_schema.role_table_grants
    where table_schema = 'public' and grantee in ('anon', 'authenticated')
      and privilege_type in ('TRUNCATE', 'REFERENCES', 'TRIGGER')),
  'nadie desde la página puede vaciar tablas ni crear llaves o disparadores');
select prueba.afirmar(not exists (
    select 1 from information_schema.role_table_grants
    where table_schema = 'public' and grantee = 'authenticated'
      and table_name in ('seguimiento', 'registro_acceso', 'consentimiento')
      and privilege_type in ('UPDATE', 'DELETE')),
  'seguimiento, registro de accesos y consentimientos no se editan ni se borran (salvo marcar la revocación)');

-- Una tabla creada por una migración futura no da nada si no se otorga.
create table prueba_tabla_futura (id int);
select prueba.afirmar(not has_table_privilege('anon', 'public.prueba_tabla_futura', 'select')
                  and not has_table_privilege('authenticated', 'public.prueba_tabla_futura', 'select'),
  'una tabla nueva no queda abierta por defecto');
drop table prueba_tabla_futura;

\echo '=== Todas las pruebas pasaron ==='
