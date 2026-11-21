-- Vista para buscar y ordenar carreras en el explorador y el comparador.
--
-- Por qué existe: PostgREST no puede unir con «o» condiciones de tablas distintas, así que la
-- búsqueda solo alcanzaba el nombre de la carrera («enfermería u chile» daba 0 resultados).
-- Esta vista junta en una columna la carrera, la institución, la sede y la comuna, y expone
-- columnas para ordenar alfabéticamente (carrera, luego institución), sin depender del código SIES.
--
-- security_invoker: la vista se ejecuta con los permisos de quien consulta, así que se aplican
-- las políticas RLS de las tablas base. No agrega datos nuevos ni abre nada que ya no fuera público.
-- El texto se normaliza con los mismos pasos que `normalizar()` de lib/datos/buscar.ts, para que
-- toda palabra que la app envía pueda coincidir: descomponer (NFD), quitar los acentos combinados
-- (U+0300 a U+036F), minúsculas y todo lo que no sea a-z o 0-9 pasa a espacio. Una lista fija de
-- letras con tilde dejaba fuera casos como «ç» o textos guardados ya descompuestos.

create view public.variante_busqueda
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
  )) as orden_institucion
from public.programa_variante v
join public.programa p on p.id = v.programa_id
join public.institucion i on i.id = p.institucion_id;

comment on view public.variante_busqueda is
  'Variantes de carrera con texto normalizado (carrera, institución, sede, comuna) y columnas de orden. Solo lectura, para el buscador público.';

-- Los privilegios por defecto del esquema dan todo a anon; aquí solo se permite leer.
revoke all on public.variante_busqueda from anon, authenticated;
grant select on public.variante_busqueda to anon, authenticated;
