-- =============================================================================
-- Alertas de crisis y derivación (protocolo de crisis, AGENTS.md 2.4)
--
-- Decisiones: docs/decisiones/0019-alertas-de-crisis-y-derivacion.md y
-- docs/revision-profesional-derivacion.md (pendiente de revisión profesional).
--
-- Flujo:
--   1. El asistente detecta una señal de riesgo y registra una alerta
--      (escritura solo con la clave de servicio, desde el servidor).
--   2. Solo el equipo de acompañamiento de la agencia (administrador o
--      acompañante) ve las alertas, y cada lectura queda registrada.
--   3. El equipo registra una derivación, la sigue y la cierra. Cada paso
--      queda registrado.
--
-- Principios:
--   - La alerta no guarda el texto del mensaje (crisis.ts). Puede guardar a la
--     persona solo si tenía sesión; si no, persona_id queda vacío.
--   - Ninguna institución cliente ve alertas: el riesgo es de la agencia.
--   - Nadie lee alertas con un select directo: solo por funciones que verifican
--     permiso y dejan registro.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
create type senal_crisis as enum ('suicidio', 'autolesion');          -- espejo de SenalDeCrisis
create type estado_alerta as enum ('pendiente', 'en_revision', 'derivada', 'cerrada');
create type tipo_derivacion as enum ('red_de_apoyo', 'persona_de_confianza', 'urgencia', 'otro');
create type estado_derivacion as enum ('abierta', 'cerrada');

-- -----------------------------------------------------------------------------
-- Tablas
-- -----------------------------------------------------------------------------

-- Dato sensible (AGENTS.md 2.2): la alerta no lleva el mensaje.
create table alerta_crisis (
  id              uuid primary key default gen_random_uuid(),
  senales         senal_crisis[] not null check (cardinality(senales) > 0),
  detectada_el    timestamptz not null,
  persona_id      uuid references persona (id) on delete set null,   -- null si no había sesión
  estado          estado_alerta not null default 'pendiente',
  revisada_por    uuid references auth.users (id),
  revisada_el     timestamptz,
  creada_el       timestamptz not null default now(),
  check ((revisada_por is null) = (revisada_el is null))
);
create index alerta_crisis_estado_idx on alerta_crisis (estado, detectada_el);

-- Cada derivación pertenece a una alerta. Una alerta puede tener varias.
-- detalle: lo mínimo para seguir el caso, sin el relato de la persona.
create table derivacion (
  id              uuid primary key default gen_random_uuid(),
  alerta_id       uuid not null references alerta_crisis (id) on delete restrict,
  tipo            tipo_derivacion not null,
  estado          estado_derivacion not null default 'abierta',
  responsable_id  uuid not null references auth.users (id),
  detalle         text not null check (length(detalle) between 1 and 1000),
  nota_cierre     text check (length(nota_cierre) between 1 and 1000),
  creada_el       timestamptz not null default now(),
  cerrada_el      timestamptz,
  check ((estado = 'cerrada') = (cerrada_el is not null and nota_cierre is not null))
);
create index derivacion_alerta_idx on derivacion (alerta_id);

-- Quién vio o cambió una alerta y cuándo. Solo se agrega (como registro_acceso).
create table registro_acceso_alerta (
  id           bigint generated always as identity primary key,
  usuario_id   uuid not null references auth.users (id),
  alerta_id    uuid not null references alerta_crisis (id) on delete restrict,
  accion       text not null check (accion in ('lectura', 'revision', 'derivacion', 'cierre')),
  ocurrido_el  timestamptz not null default now()
);
create index registro_acceso_alerta_idx on registro_acceso_alerta (alerta_id);

-- -----------------------------------------------------------------------------
-- Funciones
-- -----------------------------------------------------------------------------

-- ¿El usuario actual es del equipo de acompañamiento de la agencia?
create function es_equipo_de_acompanamiento() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from miembro m
    join organizacion o on o.id = m.organizacion_id
    where m.usuario_id = auth.uid()
      and o.tipo = 'agencia'
      and m.rol in ('administrador', 'acompanante')
  )
$$;

-- Lista alertas (opcionalmente por estado) y deja registro de cada una.
create function ver_alertas(p_estado estado_alerta default null)
returns table (
  id uuid, senales senal_crisis[], detectada_el timestamptz, persona_id uuid,
  estado estado_alerta, revisada_por uuid, revisada_el timestamptz, creada_el timestamptz
)
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;
  if not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para ver alertas';
  end if;

  insert into registro_acceso_alerta (usuario_id, alerta_id, accion)
  select auth.uid(), a.id, 'lectura'
  from alerta_crisis a
  where p_estado is null or a.estado = p_estado;

  return query
    select a.id, a.senales, a.detectada_el, a.persona_id, a.estado,
           a.revisada_por, a.revisada_el, a.creada_el
    from alerta_crisis a
    where p_estado is null or a.estado = p_estado
    order by a.detectada_el desc;
end
$$;

-- Marca una alerta como en revisión, o la cierra sin derivación.
create function cambiar_estado_alerta(p_alerta uuid, p_estado estado_alerta)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;
  if not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para cambiar alertas';
  end if;
  if p_estado not in ('en_revision', 'cerrada') then
    raise exception 'Estado no válido para este cambio: %', p_estado;
  end if;

  update alerta_crisis a
     set estado = p_estado,
         revisada_por = coalesce(a.revisada_por, auth.uid()),
         revisada_el = coalesce(a.revisada_el, now())
   where a.id = p_alerta;
  if not found then
    raise exception 'La alerta no existe';
  end if;

  insert into registro_acceso_alerta (usuario_id, alerta_id, accion)
  values (auth.uid(), p_alerta, case when p_estado = 'cerrada' then 'cierre' else 'revision' end);
end
$$;

-- Abre una derivación para una alerta y deja la alerta como derivada.
create function registrar_derivacion(p_alerta uuid, p_tipo tipo_derivacion, p_detalle text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare nueva uuid;
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;
  if not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para derivar alertas';
  end if;
  if not exists (select 1 from alerta_crisis a where a.id = p_alerta and a.estado <> 'cerrada') then
    raise exception 'La alerta no existe o ya está cerrada';
  end if;

  insert into derivacion (alerta_id, tipo, responsable_id, detalle)
  values (p_alerta, p_tipo, auth.uid(), p_detalle)
  returning id into nueva;

  update alerta_crisis a
     set estado = 'derivada',
         revisada_por = coalesce(a.revisada_por, auth.uid()),
         revisada_el = coalesce(a.revisada_el, now())
   where a.id = p_alerta;

  insert into registro_acceso_alerta (usuario_id, alerta_id, accion)
  values (auth.uid(), p_alerta, 'derivacion');

  return nueva;
end
$$;

-- Cierra una derivación con una nota final. La alerta se cierra si ya no
-- tiene derivaciones abiertas.
create function cerrar_derivacion(p_derivacion uuid, p_detalle text)
returns void
language plpgsql security definer set search_path = public as $$
declare alerta uuid;
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;
  if not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para cerrar derivaciones';
  end if;

  update derivacion d
     set estado = 'cerrada',
         cerrada_el = now(),
         nota_cierre = p_detalle
   where d.id = p_derivacion and d.estado = 'abierta'
  returning d.alerta_id into alerta;
  -- La nota de cierre se guarda aparte: el detalle de apertura no se pisa.
  if alerta is null then
    raise exception 'La derivación no existe o ya está cerrada';
  end if;

  if not exists (select 1 from derivacion d where d.alerta_id = alerta and d.estado = 'abierta') then
    update alerta_crisis a set estado = 'cerrada' where a.id = alerta;
  end if;

  insert into registro_acceso_alerta (usuario_id, alerta_id, accion)
  values (auth.uid(), alerta, 'cierre');
end
$$;

-- -----------------------------------------------------------------------------
-- Seguridad de la base de datos
-- -----------------------------------------------------------------------------
alter table alerta_crisis          enable row level security;
alter table derivacion             enable row level security;
alter table registro_acceso_alerta enable row level security;

-- Sin políticas de lectura ni escritura directa: todo pasa por las funciones.
-- Solo el servidor (clave de servicio) registra alertas nuevas.

-- Permisos explícitos (ver supabase/README.md): sin grants a anon ni a authenticated
-- sobre las tablas. Solo las funciones se abren a usuarios con sesión.
revoke all on alerta_crisis, derivacion, registro_acceso_alerta from anon, authenticated;

revoke execute on function es_equipo_de_acompanamiento(), ver_alertas(estado_alerta),
  cambiar_estado_alerta(uuid, estado_alerta), registrar_derivacion(uuid, tipo_derivacion, text),
  cerrar_derivacion(uuid, text) from anon, public;
grant execute on function es_equipo_de_acompanamiento(), ver_alertas(estado_alerta),
  cambiar_estado_alerta(uuid, estado_alerta), registrar_derivacion(uuid, tipo_derivacion, text),
  cerrar_derivacion(uuid, text) to authenticated;
