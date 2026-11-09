-- =============================================================================
-- Correcciones tras la revisión de #72 y #73 (2026-11-09)
--
-- 1. cambiar_estado_alerta: no cierra una alerta con derivaciones abiertas y no
--    reabre una alerta cerrada. Antes, cualquier acompañante podía dejar una
--    derivación abierta bajo una alerta "cerrada".
-- 2. exportar_mis_datos: no incluye autor_id de los seguimientos. Ese campo
--    identifica a quien escribió la nota, que es personal de una institución.
--
-- Se usa "create or replace" porque las funciones originales están en
-- 20261108100000 y 20261108110000. Verificar antes de aplicar si ya se aplicaron
-- en Supabase: esta migración sirve en ambos casos.
-- =============================================================================

create or replace function cambiar_estado_alerta(p_alerta uuid, p_estado estado_alerta)
returns void
language plpgsql security definer set search_path = public as $$
declare actual estado_alerta;
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

  select a.estado into actual from alerta_crisis a where a.id = p_alerta;
  if not found then
    raise exception 'La alerta no existe';
  end if;
  if actual = 'cerrada' then
    raise exception 'La alerta ya está cerrada';
  end if;
  if p_estado = 'cerrada' and exists (
       select 1 from derivacion d where d.alerta_id = p_alerta and d.estado = 'abierta') then
    raise exception 'Hay derivaciones abiertas: ciérralas antes de cerrar la alerta';
  end if;

  update alerta_crisis a
     set estado = p_estado,
         revisada_por = coalesce(a.revisada_por, auth.uid()),
         revisada_el = coalesce(a.revisada_el, now())
   where a.id = p_alerta;

  insert into registro_acceso_alerta (usuario_id, alerta_id, accion)
  values (auth.uid(), p_alerta, case when p_estado = 'cerrada' then 'cierre' else 'revision' end);
end
$$;

create or replace function exportar_mis_datos() returns jsonb
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
    -- Sin autor_id: identifica a quien escribió la nota (personal de una institución).
    'seguimientos', coalesce((select jsonb_agg(to_jsonb(s) - 'autor_id') from seguimiento s where s.persona_id = auth.uid()), '[]'),
    'accesos_a_mis_datos', coalesce((select jsonb_agg(to_jsonb(r)) from registro_acceso r where r.persona_id = auth.uid()), '[]'),
    'solicitudes', coalesce((select jsonb_agg(to_jsonb(d)) from solicitud_derecho d where d.persona_id = auth.uid()), '[]')
  );
  return resultado;
end
$$;
