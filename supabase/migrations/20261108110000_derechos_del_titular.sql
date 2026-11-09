-- =============================================================================
-- Derechos del titular (docs/privacidad.md, sección 5; AGENTS.md 2.2)
--
-- Qué da la base de datos:
--   1. Acceso y portabilidad: exportar_mis_datos() devuelve todo lo que la
--      persona tiene en la base, en JSON. Cada exportación queda registrada.
--   2. Solicitudes: solicitar_derecho() registra una solicitud de
--      rectificación, supresión, oposición, acceso o portabilidad. El equipo
--      la resuelve con resolver_solicitud().
--
-- Qué NO da esta migración (y por qué):
--   - Corrección: ya existe. La persona actualiza su registro y su ficha con las
--     políticas persona_propia y ficha_propia (migración base).
--   - Oposición: ya existe. Revocar un consentimiento es marcar revocado_el.
--     La solicitud solo deja constancia.
--   - Supresión física: la cuenta de autenticación (auth.users) solo la borra el
--     servidor con la clave de servicio. El equipo la ejecuta al resolver la
--     solicitud. Ver ADR 0020 sobre los plazos y las excepciones de conservación.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos y tabla
-- -----------------------------------------------------------------------------
create type tipo_derecho as enum ('acceso', 'rectificacion', 'supresion', 'oposicion', 'portabilidad');
create type estado_solicitud as enum ('recibida', 'en_proceso', 'resuelta', 'rechazada');

-- Constancia de cada solicitud. Si la persona se elimina, la solicitud queda
-- sin vínculo (persona_id null) para mostrar que se atendió.
create table solicitud_derecho (
  id              uuid primary key default gen_random_uuid(),
  persona_id      uuid references persona (id) on delete set null,
  tipo            tipo_derecho not null,
  estado          estado_solicitud not null default 'recibida',
  creada_el       timestamptz not null default now(),
  resuelta_por    uuid references auth.users (id),
  resuelta_el     timestamptz,
  respuesta       text check (length(respuesta) <= 1000),
  check ((estado in ('resuelta', 'rechazada')) = (resuelta_el is not null and resuelta_por is not null))
);
-- Una persona no acumula solicitudes del mismo tipo abiertas.
create unique index solicitud_abierta_unica
  on solicitud_derecho (persona_id, tipo) where estado in ('recibida', 'en_proceso');
create index solicitud_derecho_estado_idx on solicitud_derecho (estado, creada_el);

alter table solicitud_derecho enable row level security;
create policy solicitud_propia on solicitud_derecho for select to authenticated
  using (persona_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Funciones
-- -----------------------------------------------------------------------------

-- Registra una solicitud de la persona que la hace.
create function solicitar_derecho(p_tipo tipo_derecho) returns uuid
language plpgsql security definer set search_path = public as $$
declare nueva uuid;
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;
  if not exists (select 1 from persona p where p.id = auth.uid()) then
    raise exception 'Primero crea tu registro de persona';
  end if;

  insert into solicitud_derecho (persona_id, tipo)
  values (auth.uid(), p_tipo)
  returning id into nueva;
  return nueva;
exception when unique_violation then
  raise exception 'Ya tienes una solicitud de este tipo en curso';
end
$$;

-- Devuelve todo lo que la base guarda sobre la persona que llama, y deja registro.
create function exportar_mis_datos() returns jsonb
language plpgsql security definer set search_path = public as $$
declare resultado jsonb;
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;

  insert into registro_acceso (usuario_id, persona_id, tabla, accion)
  values (auth.uid(), auth.uid(), 'exportacion', 'portabilidad');

  resultado := jsonb_build_object(
    'generado_el', now(),
    'persona', (select to_jsonb(p) from persona p where p.id = auth.uid()),
    'ficha', (select to_jsonb(f) from ficha_trayectoria f where f.persona_id = auth.uid()),
    'tutor', (select to_jsonb(t) - 'contacto_tutor' from autorizacion_tutor t where t.persona_id = auth.uid()),
    'consentimientos', coalesce((select jsonb_agg(to_jsonb(c)) from consentimiento c where c.persona_id = auth.uid()), '[]'),
    'seguimientos', coalesce((select jsonb_agg(to_jsonb(s)) from seguimiento s where s.persona_id = auth.uid()), '[]'),
    'accesos_a_mis_datos', coalesce((select jsonb_agg(to_jsonb(r)) from registro_acceso r where r.persona_id = auth.uid()), '[]'),
    'solicitudes', coalesce((select jsonb_agg(to_jsonb(d)) from solicitud_derecho d where d.persona_id = auth.uid()), '[]')
  );
  return resultado;
end
$$;

-- Igual que en 20261108100000_alertas_y_derivacion.sql. Se define en ambas
-- migraciones con "create or replace" para que cada una funcione sola y en
-- cualquier orden de aplicación.
create or replace function es_equipo_de_acompanamiento() returns boolean
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

-- Equipo de la agencia: lista las solicitudes abiertas.
create function ver_solicitudes_abiertas()
returns table (id uuid, persona_id uuid, tipo tipo_derecho, estado estado_solicitud, creada_el timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para ver solicitudes';
  end if;
  return query
    select d.id, d.persona_id, d.tipo, d.estado, d.creada_el
    from solicitud_derecho d
    where d.estado in ('recibida', 'en_proceso')
    order by d.creada_el;
end
$$;

-- Equipo de la agencia: resuelve o rechaza una solicitud con una respuesta breve.
-- La supresión física (borrar auth.users) la hace el servidor con la clave de servicio.
create function resolver_solicitud(p_id uuid, p_estado estado_solicitud, p_respuesta text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para resolver solicitudes';
  end if;
  if p_estado not in ('resuelta', 'rechazada') then
    raise exception 'Estado no válido: %', p_estado;
  end if;

  update solicitud_derecho d
     set estado = p_estado,
         resuelta_por = auth.uid(),
         resuelta_el = now(),
         respuesta = p_respuesta
   where d.id = p_id and d.estado in ('recibida', 'en_proceso');
  if not found then
    raise exception 'La solicitud no existe o ya está resuelta';
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Permisos explícitos (ver supabase/README.md)
-- -----------------------------------------------------------------------------
grant select on solicitud_derecho to authenticated;

revoke execute on function solicitar_derecho(tipo_derecho), exportar_mis_datos(),
  ver_solicitudes_abiertas(), resolver_solicitud(uuid, estado_solicitud, text) from anon, public;
grant execute on function solicitar_derecho(tipo_derecho), exportar_mis_datos(),
  ver_solicitudes_abiertas(), resolver_solicitud(uuid, estado_solicitud, text) to authenticated;
