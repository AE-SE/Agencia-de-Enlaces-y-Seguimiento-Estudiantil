-- =============================================================================
-- Variantes de programa (sede + jornada) y unidad "estudiantes"
-- Decisión: ADR 0011, sección 4 ("una fila, variantes desplegables") y sus consecuencias.
--
-- Qué cambia:
--   1. `programa` pasa a ser carrera + institución. Sede, comuna, región, jornada,
--      duración formal y código SIES se mueven a la tabla nueva `programa_variante`.
--   2. `indicador` puede apuntar a una variante (arancel, puntaje de corte, vacantes)
--      o solo al programa (empleabilidad, ingresos). El nivel no se fija por tipo de
--      indicador: lo declara cada fila según cómo lo publica la fuente (ADR 0011).
--   3. Nueva unidad `estudiantes` para la matrícula, que cuenta personas y no cupos.
--
-- Por qué el código SIES va en la variante: el código único que publican Mineduc y
-- el SIES identifica carrera, sede y jornada a la vez (en los datos de ejemplo de C4
-- cada código trae su propia sede y jornada). Si quedara en `programa`, dos jornadas
-- de la misma carrera no podrían convivir. TODO(fuente): confirmarlo en el
-- diccionario de datos (C3) contra la documentación oficial del código.
-- =============================================================================

-- Esta migración reorganiza columnas sin trasladar filas: solo es segura con la
-- oferta vacía, que es el estado registrado en supabase/README.md (sin carga aún).
-- Si ya hubiera carreras cargadas, se detiene en vez de perder sede y jornada.
do $$ begin
  if exists (select 1 from programa) then
    raise exception 'La tabla programa ya tiene filas: esta migración necesita una versión que traslade los datos';
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 1. Unidad para contar personas matriculadas
-- -----------------------------------------------------------------------------
alter type unidad_indicador add value 'estudiantes';

-- -----------------------------------------------------------------------------
-- 2. Variantes: cada combinación de sede y jornada de un programa
-- -----------------------------------------------------------------------------
create table programa_variante (
  id                  uuid primary key default gen_random_uuid(),
  programa_id         uuid not null references programa (id) on delete cascade,
  codigo_sies         text not null unique,             -- llave para cruzar SIES, Mineduc y DEMRE
  sede                text,                             -- null si la fuente no lo distingue (no se inventa)
  comuna              text,
  region              text,
  jornada             text,
  direccion           text,                             -- dirección de la sede (dato institucional)
  duracion_semestres  smallint check (duracion_semestres > 0),
  fuente_id           uuid not null references fuente (id),
  actualizada_el      timestamptz not null default now(),
  -- Permite que `indicador` exija que la variante sea del mismo programa.
  unique (id, programa_id)
);
create index programa_variante_programa_idx on programa_variante (programa_id);
-- El filtro por región del listado opera sobre las sedes (ADR 0011).
create index programa_variante_region_idx on programa_variante (region);

-- -----------------------------------------------------------------------------
-- 3. El programa queda como carrera + institución
-- -----------------------------------------------------------------------------
drop index programa_region_idx;
alter table programa
  drop column codigo_sies,
  drop column sede,
  drop column comuna,
  drop column region,
  drop column jornada,
  drop column duracion_semestres;
-- Una carrera aparece una sola vez por institución (la fila del listado, ADR 0011).
alter table programa add constraint programa_institucion_nombre_key unique (institucion_id, nombre);

-- -----------------------------------------------------------------------------
-- 4. Indicadores a nivel de programa o de variante
-- -----------------------------------------------------------------------------
alter table indicador add column variante_id uuid;
-- La variante debe pertenecer al mismo programa del indicador: así una cifra de
-- una sede nunca queda colgada de otra carrera.
alter table indicador add constraint indicador_variante_del_programa
  foreign key (variante_id, programa_id) references programa_variante (id, programa_id) on delete cascade;
create index indicador_variante_idx on indicador (variante_id);

-- Un mismo dato no se repite: por programa (variante null) o por variante.
-- "nulls not distinct" hace que dos filas de programa sin variante choquen entre sí.
alter table indicador drop constraint indicador_programa_id_tipo_periodo_key;
alter table indicador add constraint indicador_unico
  unique nulls not distinct (programa_id, variante_id, tipo, periodo);

-- -----------------------------------------------------------------------------
-- 5. Seguridad: datos públicos, igual que el resto de la oferta
-- -----------------------------------------------------------------------------
alter table programa_variante enable row level security;
-- Sin políticas de escritura: solo la clave de servicio (scripts de carga) escribe.
create policy lectura_publica on programa_variante for select to anon, authenticated using (true);
grant select on programa_variante to anon, authenticated;
