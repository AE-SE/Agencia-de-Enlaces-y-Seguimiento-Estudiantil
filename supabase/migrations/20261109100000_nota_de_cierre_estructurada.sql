-- =============================================================================
-- Nota de cierre estructurada para las derivaciones (decisión P8, 2026-11-09)
--
-- Docs: docs/revision-profesional-derivacion.md (sección 3, P8) y ADR 0019.
--
-- Antes, cerrar_derivacion recibía un texto libre. Ahora la nota tiene tres datos
-- mínimos: si la persona fue contactada, a qué red se derivó y la fecha de
-- seguimiento. La nota se arma en la base de datos, así la página no puede
-- cerrar con una nota vacía o con el relato de la persona.
--
-- Reemplaza cerrar_derivacion(uuid, text) por una firma nueva. Se elimina la
-- anterior para que no quede un camino con texto libre.
-- =============================================================================

alter table derivacion
  add column contactada   boolean,
  add column seguimiento_el date;

drop function cerrar_derivacion(uuid, text);

create function cerrar_derivacion(
  p_derivacion uuid,
  p_contactada boolean,
  p_red tipo_derivacion,
  p_seguimiento date
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  alerta uuid;
  nota text;
begin
  if auth.uid() is null then
    raise exception 'Se requiere iniciar sesión';
  end if;
  if not es_equipo_de_acompanamiento() then
    raise exception 'Sin autorización para cerrar derivaciones';
  end if;
  if p_contactada is null or p_red is null or p_seguimiento is null then
    raise exception 'La nota de cierre necesita: si la persona fue contactada, la red y la fecha de seguimiento';
  end if;
  if p_seguimiento < current_date then
    raise exception 'La fecha de seguimiento no puede ser anterior a hoy';
  end if;

  nota := 'Contactada: ' || case when p_contactada then 'sí' else 'no' end
       || '. Red: ' || p_red::text
       || '. Seguimiento: ' || to_char(p_seguimiento, 'YYYY-MM-DD') || '.';

  update derivacion d
     set estado = 'cerrada',
         cerrada_el = now(),
         nota_cierre = nota,
         contactada = p_contactada,
         seguimiento_el = p_seguimiento
   where d.id = p_derivacion and d.estado = 'abierta'
  returning d.alerta_id into alerta;
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

revoke execute on function cerrar_derivacion(uuid, boolean, tipo_derivacion, date) from anon, public;
grant execute on function cerrar_derivacion(uuid, boolean, tipo_derivacion, date) to authenticated;
