-- Agrega a variante_busqueda el largo del nombre de la institución, para ordenar por relevancia.
--
-- Por qué: con orden alfabético, «enfermería u chile» dejaba la Universidad de Chile en el lugar 11
-- de 26 (antes salían la Católica, la Adventista y la Austral, que también contienen «chile»).
-- Cuando hay texto de búsqueda, dentro de cada carrera se muestran primero las instituciones de
-- nombre más corto que contienen todas las palabras: es la coincidencia más directa. Es un criterio
-- neutro y explícito (AGENTS.md, sección 1): no depende de quién es la institución.
--
-- `create or replace view` solo permite agregar columnas al final; las demás quedan iguales y los
-- permisos (solo lectura para anon) se conservan.

create or replace view public.variante_busqueda
with (security_invoker = true) as
select
  v.*,
  trim(regexp_replace(
    lower(regexp_replace(
      normalize(concat_ws(' ', p.nombre_normalizado, i.nombre, v.sede, v.comuna), NFD),
      '[̀-ͯ]', '', 'g'
    )),
    '[^a-z0-9]+', ' ', 'g'
  )) as texto_busqueda,
  p.nombre_normalizado as orden_carrera,
  trim(regexp_replace(
    lower(regexp_replace(normalize(i.nombre, NFD), '[̀-ͯ]', '', 'g')),
    '[^a-z0-9]+', ' ', 'g'
  )) as orden_institucion,
  char_length(i.nombre) as largo_institucion
from public.programa_variante v
join public.programa p on p.id = v.programa_id
join public.institucion i on i.id = p.institucion_id;
