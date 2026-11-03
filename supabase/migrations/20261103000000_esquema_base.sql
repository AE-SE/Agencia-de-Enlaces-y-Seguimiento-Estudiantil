-- =============================================================================
-- Esquema base · Agencia de Enlace & Seguimiento Estudiantil
-- Decisiones: docs/arquitectura.md (secciones 3 y 4), ADR 0002, docs/privacidad.md
--
-- Dos mundos separados:
--   A. Datos públicos oficiales (carreras, indicadores, beneficios): los lee
--      cualquiera; solo se escriben con la clave de servicio (scripts de carga).
--   B. Datos de personas: cada persona ve lo suyo; una organización (agencia o
--      institución) ve a una persona SOLO si esa persona le dio consentimiento
--      vigente. La regla vive en la base de datos (Row Level Security), no en la página.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
create type tipo_institucion as enum ('universidad', 'instituto_profesional', 'centro_formacion_tecnica');

create type tipo_indicador as enum (
  'empleabilidad_1er_anio', 'empleabilidad_2do_anio', 'ingreso_promedio_4to_anio',
  'arancel_anual', 'matricula', 'vacantes', 'puntaje_corte', 'retencion_1er_anio',
  'duracion_real_semestres'
);

create type unidad_indicador as enum ('porcentaje', 'pesos', 'puntos', 'semestres', 'cupos');

create type tipo_organizacion as enum ('agencia', 'institucion');

create type rol_miembro as enum ('administrador', 'acompanante', 'lector');

-- Cada finalidad se consiente por separado (Ley 21.719: consentimiento específico).
create type finalidad_consentimiento as enum (
  'compartir_ficha',            -- la organización puede ver la Ficha de Trayectoria
  'datos_socioeconomicos',      -- dato sensible
  'acompanamiento_bienestar'    -- dato sensible: la organización puede registrar seguimiento
);

create type tipo_seguimiento as enum ('nota', 'senal_alerta', 'contacto');

-- =============================================================================
-- A. DATOS PÚBLICOS OFICIALES
-- =============================================================================

create table fuente (
  id                     uuid primary key default gen_random_uuid(),
  organismo              text not null,                 -- ej.: "SIES, Mineduc"
  nombre                 text not null,                 -- ej.: "Buscador de Empleabilidad e Ingresos"
  url                    text not null,
  terminos_de_uso        text,                          -- resumen; detalle en docs/fuentes.md
  terminos_revisados_el  date,
  creada_el              timestamptz not null default now(),
  unique (organismo, nombre)
);

create table institucion (
  id                     uuid primary key default gen_random_uuid(),
  codigo_oficial         text not null unique,          -- texto: conserva ceros a la izquierda
  nombre                 text not null,
  tipo                   tipo_institucion not null,
  anios_acreditacion     smallint check (anios_acreditacion between 0 and 7),
  acreditada_hasta       date,
  fuente_acreditacion_id uuid references fuente (id),
  actualizada_el         timestamptz not null default now()
);

create table programa (
  id                  uuid primary key default gen_random_uuid(),
  codigo_sies         text not null unique,             -- llave para cruzar CNED, SIES y DEMRE
  institucion_id      uuid not null references institucion (id),
  nombre              text not null,
  sede                text,
  comuna              text,
  region              text,
  jornada             text,
  area                text,
  duracion_semestres  smallint check (duracion_semestres > 0),
  fuente_id           uuid not null references fuente (id),
  actualizada_el      timestamptz not null default now()
);
create index programa_institucion_idx on programa (institucion_id);
create index programa_region_idx on programa (region);

-- Un valor medido. Regla central del proyecto: sin dato NO es cero.
create table indicador (
  id               uuid primary key default gen_random_uuid(),
  programa_id      uuid not null references programa (id) on delete cascade,
  tipo             tipo_indicador not null,
  valor            numeric,
  unidad           unidad_indicador not null,
  periodo          text not null,                       -- ej.: "titulados 2023", "admisión 2026"
  fuente_id        uuid not null references fuente (id),
  url              text not null,                       -- enlace exacto al archivo o página
  fecha_consulta   date not null,
  motivo_sin_dato  text,
  unique (programa_id, tipo, periodo),
  -- Si no hay valor, debe decirse por qué; si hay valor, no puede haber motivo.
  constraint indicador_valor_o_motivo check ((valor is null) = (motivo_sin_dato is not null)),
  constraint indicador_porcentaje_valido check (unidad <> 'porcentaje' or valor between 0 and 100),
  constraint indicador_no_negativo check (valor is null or valor >= 0)
);
create index indicador_programa_idx on indicador (programa_id);

create table beneficio (
  id                    uuid primary key default gen_random_uuid(),
  nombre                text not null,
  explicacion_simple    text not null,                  -- lenguaje claro
  requisitos_simples    text,
  requisitos_oficiales  text,                           -- texto de la fuente, sin reinterpretar
  fuente_id             uuid not null references fuente (id),
  url                   text not null,
  vigente_desde         date not null,
  vigente_hasta         date,
  fecha_consulta        date not null,
  check (vigente_hasta is null or vigente_hasta >= vigente_desde)
);

create table plazo (
  id               uuid primary key default gen_random_uuid(),
  beneficio_id     uuid references beneficio (id) on delete cascade,
  proceso          text not null,                       -- ej.: "Admisión 2027"
  descripcion      text not null,
  inicio           date not null,
  termino          date not null,
  fuente_id        uuid not null references fuente (id),
  url              text not null,
  fecha_consulta   date not null,
  check (termino >= inicio)
);

-- =============================================================================
-- B. DATOS DE PERSONAS
-- =============================================================================

-- La agencia y cada institución cliente.
create table organizacion (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  tipo            tipo_organizacion not null,
  institucion_id  uuid references institucion (id),     -- solo si tipo = 'institucion'
  creada_el       timestamptz not null default now(),
  check ((tipo = 'institucion') = (institucion_id is not null))
);

create table miembro (
  organizacion_id  uuid not null references organizacion (id) on delete cascade,
  usuario_id       uuid not null references auth.users (id) on delete cascade,
  rol              rol_miembro not null,
  creado_el        timestamptz not null default now(),
  primary key (organizacion_id, usuario_id)
);
create index miembro_usuario_idx on miembro (usuario_id);

-- Datos mínimos de quien se registra (minimización: sin RUT ni teléfono en el MVP).
-- El correo vive en auth.users; no se duplica.
create table persona (
  id                 uuid primary key references auth.users (id) on delete cascade,
  nombre             text not null,
  fecha_nacimiento   date not null,                     -- define si requiere autorización de tutor
  region             text,
  creada_el          timestamptz not null default now()
);

-- Autorización del adulto responsable para menores de 18.
create table autorizacion_tutor (
  persona_id       uuid primary key references persona (id) on delete cascade,
  nombre_tutor     text not null,
  contacto_tutor   text not null,
  otorgada_el      timestamptz not null default now(),
  metodo           text not null                        -- cómo se verificó (ej.: "correo confirmado")
);

-- Le pertenece a la persona. Formato flexible mientras el MVP define sus campos.
create table ficha_trayectoria (
  persona_id            uuid primary key references persona (id) on delete cascade,
  intereses             jsonb not null default '[]',
  simulaciones          jsonb not null default '[]',
  beneficios_postulados jsonb not null default '[]',
  actualizada_el        timestamptz not null default now()
);

create table consentimiento (
  id               uuid primary key default gen_random_uuid(),
  persona_id       uuid not null references persona (id) on delete cascade,
  organizacion_id  uuid not null references organizacion (id) on delete cascade,
  finalidad        finalidad_consentimiento not null,
  otorgado_el      timestamptz not null default now(),
  revocado_el      timestamptz,
  check (revocado_el is null or revocado_el >= otorgado_el)
);
-- Solo un consentimiento vigente por persona, organización y finalidad.
create unique index consentimiento_vigente_unico
  on consentimiento (persona_id, organizacion_id, finalidad) where revocado_el is null;

-- Notas de acompañamiento. Dato sensible.
-- PENDIENTE (antes de datos reales): cifrado de la columna "contenido" con Supabase
-- Vault o pgsodium, decisión a registrar en un ADR. Hoy se protege con RLS, sin
-- lectura directa y con registro obligatorio de cada acceso.
create table seguimiento (
  id               uuid primary key default gen_random_uuid(),
  persona_id       uuid not null references persona (id) on delete cascade,
  organizacion_id  uuid not null references organizacion (id) on delete cascade,
  autor_id         uuid not null references auth.users (id),
  tipo             tipo_seguimiento not null,
  contenido        text not null,
  creado_el        timestamptz not null default now()
);
create index seguimiento_persona_idx on seguimiento (persona_id);

-- Quién vio qué dato sensible y cuándo. Solo se agrega: nunca se edita ni se borra.
create table registro_acceso (
  id           bigint generated always as identity primary key,
  usuario_id   uuid not null,
  persona_id   uuid not null,
  tabla        text not null,
  accion       text not null,
  ocurrido_el  timestamptz not null default now()
);
create index registro_acceso_persona_idx on registro_acceso (persona_id);

-- =============================================================================
-- Funciones auxiliares (security definer: consultan tablas protegidas sin
-- quedar atrapadas en sus propias políticas; search_path fijo por seguridad)
-- =============================================================================

create function es_miembro(p_organizacion uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from miembro m
    where m.organizacion_id = p_organizacion and m.usuario_id = auth.uid()
  )
$$;

create function tiene_consentimiento(p_persona uuid, p_organizacion uuid, p_finalidad finalidad_consentimiento)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from consentimiento c
    where c.persona_id = p_persona
      and c.organizacion_id = p_organizacion
      and c.finalidad = p_finalidad
      and c.revocado_el is null
  )
$$;

-- ¿El usuario actual pertenece a alguna organización a la que esta persona le
-- dio consentimiento vigente para la finalidad indicada?
create function organizacion_autorizada(p_persona uuid, p_finalidad finalidad_consentimiento)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from consentimiento c
    join miembro m on m.organizacion_id = c.organizacion_id
    where c.persona_id = p_persona
      and c.finalidad = p_finalidad
      and c.revocado_el is null
      and m.usuario_id = auth.uid()
  )
$$;

-- Solo responde sobre el usuario actual: no permite averiguar la edad de otra persona.
create function soy_menor_de_edad() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select fecha_nacimiento > (current_date - interval '18 years') from persona where id = auth.uid()),
    false)
$$;

create function tengo_autorizacion_tutor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from autorizacion_tutor where persona_id = auth.uid())
$$;

-- Única vía para leer seguimientos: verifica permiso y deja registro.
create function ver_seguimientos(p_persona uuid)
returns table (id uuid, organizacion_id uuid, tipo tipo_seguimiento, contenido text, creado_el timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;

  if auth.uid() <> p_persona
     and not organizacion_autorizada(p_persona, 'acompanamiento_bienestar') then
    raise exception 'Sin autorización para ver este seguimiento';
  end if;

  insert into registro_acceso (usuario_id, persona_id, tabla, accion)
  values (auth.uid(), p_persona, 'seguimiento', 'lectura');

  -- La persona ve todo lo suyo; una organización ve solo lo que ella misma registró.
  return query
    select s.id, s.organizacion_id, s.tipo, s.contenido, s.creado_el
    from seguimiento s
    where s.persona_id = p_persona
      and (auth.uid() = p_persona or es_miembro(s.organizacion_id))
    order by s.creado_el desc;
end
$$;

-- =============================================================================
-- Row Level Security: activado en TODAS las tablas
-- =============================================================================
alter table fuente              enable row level security;
alter table institucion         enable row level security;
alter table programa            enable row level security;
alter table indicador           enable row level security;
alter table beneficio           enable row level security;
alter table plazo               enable row level security;
alter table organizacion        enable row level security;
alter table miembro             enable row level security;
alter table persona             enable row level security;
alter table autorizacion_tutor  enable row level security;
alter table ficha_trayectoria   enable row level security;
alter table consentimiento      enable row level security;
alter table seguimiento         enable row level security;
alter table registro_acceso     enable row level security;

-- A. Datos públicos: lectura para todos. Sin políticas de escritura: solo la
--    clave de servicio (scripts de carga) puede escribir, porque omite RLS.
create policy lectura_publica on fuente      for select to anon, authenticated using (true);
create policy lectura_publica on institucion for select to anon, authenticated using (true);
create policy lectura_publica on programa    for select to anon, authenticated using (true);
create policy lectura_publica on indicador   for select to anon, authenticated using (true);
create policy lectura_publica on beneficio   for select to anon, authenticated using (true);
create policy lectura_publica on plazo       for select to anon, authenticated using (true);

-- Organizaciones y miembros: cada miembro ve su propia organización y a sus colegas.
create policy ver_mi_organizacion on organizacion for select to authenticated
  using (es_miembro(id));
create policy ver_miembros_de_mi_organizacion on miembro for select to authenticated
  using (es_miembro(organizacion_id));

-- Persona: dueña de sus datos; una organización la ve solo con consentimiento vigente.
create policy persona_propia on persona for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy persona_con_consentimiento on persona for select to authenticated
  using (organizacion_autorizada(id, 'compartir_ficha'));

create policy tutor_propio on autorizacion_tutor for all to authenticated
  using (persona_id = auth.uid()) with check (persona_id = auth.uid());

create policy ficha_propia on ficha_trayectoria for all to authenticated
  using (persona_id = auth.uid()) with check (persona_id = auth.uid());
create policy ficha_con_consentimiento on ficha_trayectoria for select to authenticated
  using (organizacion_autorizada(persona_id, 'compartir_ficha'));

-- Consentimiento: la persona los ve, otorga y revoca. La organización ve los
-- que van dirigidos a ella (para saber a quién puede acompañar).
create policy consentimiento_ver_propio on consentimiento for select to authenticated
  using (persona_id = auth.uid());
-- Un menor de 18 solo puede otorgar consentimientos con autorización de su tutor.
create policy consentimiento_otorgar on consentimiento for insert to authenticated
  with check (
    persona_id = auth.uid()
    and revocado_el is null
    and (not soy_menor_de_edad() or tengo_autorizacion_tutor())
  );
-- Revocar = marcar la fecha. No se puede editar nada más ni "des-revocar"
-- (permiso por columna más abajo): para volver a autorizar se otorga uno nuevo.
create policy consentimiento_revocar on consentimiento for update to authenticated
  using (persona_id = auth.uid() and revocado_el is null)
  with check (persona_id = auth.uid() and revocado_el is not null);
create policy consentimiento_ver_dirigido_a_mi_organizacion on consentimiento for select to authenticated
  using (es_miembro(organizacion_id));

-- Seguimiento: sin lectura directa (solo con ver_seguimientos, que registra).
-- Una organización registra solo si tiene consentimiento de acompañamiento y
-- firma con su propio usuario.
create policy seguimiento_registrar on seguimiento for insert to authenticated
  with check (
    autor_id = auth.uid()
    and es_miembro(organizacion_id)
    and tiene_consentimiento(persona_id, organizacion_id, 'acompanamiento_bienestar')
  );

-- Registro de accesos: la persona ve quién consultó sus datos. Nadie lo edita.
create policy registro_ver_propio on registro_acceso for select to authenticated
  using (persona_id = auth.uid());

-- =============================================================================
-- Permisos: en Supabase, anon y authenticated reciben acceso a las tablas por
-- defecto. Se recorta lo que no deben poder hacer, además de RLS.
-- =============================================================================
revoke all on seguimiento, registro_acceso, consentimiento, persona,
              autorizacion_tutor, ficha_trayectoria, organizacion, miembro from anon;
revoke select, update, delete on seguimiento from authenticated;
revoke insert, update, delete on registro_acceso from authenticated;
revoke delete on consentimiento from authenticated;   -- se revoca, no se borra: queda historial
revoke update on consentimiento from authenticated;
grant update (revocado_el) on consentimiento to authenticated;
revoke insert, update, delete on organizacion, miembro from authenticated;
revoke insert, update, delete on fuente, institucion, programa, indicador, beneficio, plazo
  from anon, authenticated;

-- Las funciones auxiliares no se exponen a visitantes sin sesión.
revoke execute on function ver_seguimientos(uuid), es_miembro(uuid),
  tiene_consentimiento(uuid, uuid, finalidad_consentimiento),
  organizacion_autorizada(uuid, finalidad_consentimiento),
  soy_menor_de_edad(), tengo_autorizacion_tutor() from anon, public;
grant execute on function ver_seguimientos(uuid), es_miembro(uuid),
  tiene_consentimiento(uuid, uuid, finalidad_consentimiento),
  organizacion_autorizada(uuid, finalidad_consentimiento),
  soy_menor_de_edad(), tengo_autorizacion_tutor() to authenticated;
