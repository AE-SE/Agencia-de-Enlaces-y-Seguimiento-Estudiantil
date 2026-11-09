-- =============================================================================
-- Rendimiento de las políticas RLS e índices de claves foráneas
--
-- Origen: asesor de rendimiento de Supabase (2026-11-09), sobre la base vacía,
-- antes de cargar datos reales. Ver la sección "Revisión de la base en
-- producción" de supabase/README.md.
--
-- Esta migración NO cambia quién puede ver o escribir qué. Solo:
--   1. Envuelve auth.uid() en (select auth.uid()), para que Postgres lo evalúe
--      una vez por consulta y no una vez por fila (aviso auth_rls_initplan).
--   2. Une las políticas de lectura que se sumaban para un mismo rol y acción
--      (aviso multiple_permissive_policies). Dos políticas permisivas de SELECT
--      equivalen a una sola con "o": el resultado es el mismo.
--      Las políticas "for all" de persona y ficha_trayectoria se separan por
--      operación para poder unir solo la de lectura; las otras tres operaciones
--      quedan con la misma condición de antes.
--   3. Crea los índices de las claves foráneas que el asesor marcó sin índice.
--
-- Todo va en una sola transacción: no hay un instante sin políticas.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1 y 2. Políticas
-- -----------------------------------------------------------------------------

-- persona: dueña de sus datos; una organización la ve solo con consentimiento vigente.
drop policy persona_propia on persona;
drop policy persona_con_consentimiento on persona;
create policy persona_ver on persona for select to authenticated
  using (id = (select auth.uid()) or organizacion_autorizada(id, 'compartir_ficha'));
create policy persona_insertar on persona for insert to authenticated
  with check (id = (select auth.uid()));
create policy persona_actualizar on persona for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy persona_borrar on persona for delete to authenticated
  using (id = (select auth.uid()));

-- ficha_trayectoria: igual que persona.
drop policy ficha_propia on ficha_trayectoria;
drop policy ficha_con_consentimiento on ficha_trayectoria;
create policy ficha_ver on ficha_trayectoria for select to authenticated
  using (persona_id = (select auth.uid()) or organizacion_autorizada(persona_id, 'compartir_ficha'));
create policy ficha_insertar on ficha_trayectoria for insert to authenticated
  with check (persona_id = (select auth.uid()));
create policy ficha_actualizar on ficha_trayectoria for update to authenticated
  using (persona_id = (select auth.uid())) with check (persona_id = (select auth.uid()));
create policy ficha_borrar on ficha_trayectoria for delete to authenticated
  using (persona_id = (select auth.uid()));

-- consentimiento: la persona los ve; la organización ve los dirigidos a ella.
drop policy consentimiento_ver_propio on consentimiento;
drop policy consentimiento_ver_dirigido_a_mi_organizacion on consentimiento;
create policy consentimiento_ver on consentimiento for select to authenticated
  using (persona_id = (select auth.uid()) or es_miembro(organizacion_id));

-- Un menor de 18 solo puede otorgar consentimientos con autorización de su tutor.
drop policy consentimiento_otorgar on consentimiento;
create policy consentimiento_otorgar on consentimiento for insert to authenticated
  with check (
    persona_id = (select auth.uid())
    and revocado_el is null
    and (not soy_menor_de_edad() or tengo_autorizacion_tutor())
  );

-- Revocar = marcar la fecha. No se puede editar nada más ni "des-revocar".
drop policy consentimiento_revocar on consentimiento;
create policy consentimiento_revocar on consentimiento for update to authenticated
  using (persona_id = (select auth.uid()) and revocado_el is null)
  with check (persona_id = (select auth.uid()) and revocado_el is not null);

-- seguimiento: sin lectura directa. Registra solo con consentimiento y con su propio usuario.
drop policy seguimiento_registrar on seguimiento;
create policy seguimiento_registrar on seguimiento for insert to authenticated
  with check (
    autor_id = (select auth.uid())
    and es_miembro(organizacion_id)
    and tiene_consentimiento(persona_id, organizacion_id, 'acompanamiento_bienestar')
  );

drop policy registro_ver_propio on registro_acceso;
create policy registro_ver_propio on registro_acceso for select to authenticated
  using (persona_id = (select auth.uid()));

drop policy tutor_ver_propio on autorizacion_tutor;
create policy tutor_ver_propio on autorizacion_tutor for select to authenticated
  using (persona_id = (select auth.uid()));

drop policy solicitud_propia on solicitud_derecho;
create policy solicitud_propia on solicitud_derecho for select to authenticated
  using (persona_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- 3. Índices de claves foráneas
-- -----------------------------------------------------------------------------
create index acreditacion_institucion_fuente_idx on acreditacion_institucion (fuente_id);
create index alerta_crisis_persona_idx           on alerta_crisis (persona_id);
create index alerta_crisis_revisada_por_idx      on alerta_crisis (revisada_por);
create index arancel_variante_fuente_idx         on arancel_variante (fuente_id);
create index beneficio_fuente_idx                on beneficio (fuente_id);
create index consentimiento_organizacion_idx     on consentimiento (organizacion_id);
create index derivacion_responsable_idx          on derivacion (responsable_id);
create index indicador_fuente_idx                on indicador (fuente_id);
create index indicador_variante_programa_idx     on indicador (variante_id, programa_id);
create index institucion_fuente_acreditacion_idx on institucion (fuente_acreditacion_id);
create index organizacion_institucion_idx        on organizacion (institucion_id);
create index plazo_beneficio_idx                 on plazo (beneficio_id);
create index plazo_fuente_idx                    on plazo (fuente_id);
create index programa_fuente_idx                 on programa (fuente_id);
create index programa_generico_fuente_idx        on programa_generico (fuente_id);
create index programa_variante_fuente_idx        on programa_variante (fuente_id);
create index registro_acceso_alerta_usuario_idx  on registro_acceso_alerta (usuario_id);
