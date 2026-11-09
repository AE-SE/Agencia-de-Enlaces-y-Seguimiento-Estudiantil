-- La autorización del tutor NO la puede declarar el propio menor (ADR 0022).
--
-- Antes: la política tutor_propio (esquema base) y los permisos de la migración
-- 20261104010000 dejaban que cualquier persona insertara su propia fila en
-- autorizacion_tutor. Un menor de 18 podía escribir un nombre y un contacto
-- inventados y así saltarse la regla de consentimiento_otorgar, que pide esa
-- autorización. La prueba 5 de supabase/tests/pruebas_rls.sql lo hacía como el menor.
--
-- Ahora: la persona solo puede VER su autorización. La registra el servidor (rol de
-- servicio) después de confirmar con el adulto. El flujo completo (solicitud, enlace de
-- un solo uso, vigencia y revocación) se define en el ADR 0022 y no se implementa aquí.

drop policy if exists tutor_propio on autorizacion_tutor;

create policy tutor_ver_propio on autorizacion_tutor for select to authenticated
  using (persona_id = auth.uid());

revoke insert, update, delete on autorizacion_tutor from authenticated;
