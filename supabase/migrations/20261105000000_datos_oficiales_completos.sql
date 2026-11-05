-- =============================================================================
-- Datos oficiales completos: niveles, trazabilidad y restricciones
-- Decisión: ADR 0014. No traslada datos: la oferta pública sigue vacía.
-- =============================================================================

do $$ begin
  if exists (select 1 from programa) then
    raise exception 'La tabla programa ya tiene filas: esta migración necesita una versión que las traslade';
  end if;
end $$;

-- Cada carrera genérica SIES pertenece a una institución, no a un título.
create table programa_generico (
  id                  uuid primary key default gen_random_uuid(),
  institucion_id      uuid not null references institucion (id) on delete cascade,
  nombre              text not null,
  nombre_normalizado  text not null,
  fuente_id           uuid not null references fuente (id),
  actualizada_el      timestamptz not null default now(),
  unique (institucion_id, nombre_normalizado)
);
create index programa_generico_institucion_idx on programa_generico (institucion_id);

-- El título se identifica por su nombre normalizado; el código Mineduc no es
-- clave porque no es uno a uno con los títulos publicados.
alter table programa
  add column nombre_normalizado text not null;
alter table programa drop constraint programa_institucion_nombre_key;
alter table programa add constraint programa_institucion_nombre_normalizado_key
  unique (institucion_id, nombre_normalizado);

-- La variante tiene una genérica, aunque un título pueda aparecer en más de una.
alter table programa_variante
  add column programa_generico_id uuid not null references programa_generico (id),
  add column carrera_codigo_mineduc text,
  add column codigo_demre text unique;
create index programa_variante_generico_idx on programa_variante (programa_generico_id);

alter type tipo_indicador add value if not exists 'continuidad_estudios';
alter type tipo_indicador add value if not exists 'matricula_inscripcion';

-- Los indicadores simples pueden aplicar al título, a la variante o a la
-- carrera genérica. SIES usa siempre programa_generico_id.
alter table indicador alter column programa_id drop not null;
alter table indicador add column programa_generico_id uuid references programa_generico (id) on delete cascade;
alter table indicador drop constraint indicador_unico;
alter table indicador add constraint indicador_unico
  unique nulls not distinct (programa_generico_id, programa_id, variante_id, tipo, periodo);
alter table indicador add constraint indicador_nivel_valido check (
  (programa_generico_id is not null and programa_id is null and variante_id is null)
  or (programa_generico_id is null and programa_id is not null)
);
create index indicador_generico_idx on indicador (programa_generico_id);

-- Arancel anual por variante: conserva la cifra calculada y la cifra publicada.
create table arancel_variante (
  id                uuid primary key default gen_random_uuid(),
  variante_id       uuid not null references programa_variante (id) on delete cascade,
  valor_pesos       numeric,
  unidad_original   text check (unidad_original in ('pesos', 'uf')),
  valor_original    numeric,
  uf_valor          numeric,
  uf_fecha          date,
  periodo           text not null,
  fuente_id         uuid not null references fuente (id),
  url               text not null,
  fecha_consulta    date not null,
  motivo_sin_dato   text,
  unique (variante_id, periodo),
  check ((valor_pesos is null) = (motivo_sin_dato is not null)),
  check (valor_pesos is null or valor_pesos >= 0),
  check (valor_pesos is null or (unidad_original is not null and valor_original is not null)),
  check ((unidad_original = 'uf') = (uf_valor is not null and uf_fecha is not null)),
  check (valor_original is null or valor_original >= 0)
);

-- El tramo SIES no es un promedio exacto: puede no tener techo.
create table tramo_ingreso_sies (
  id                    uuid primary key default gen_random_uuid(),
  programa_generico_id  uuid not null references programa_generico (id) on delete cascade,
  tramo_publicado       text,
  desde_pesos           numeric,
  hasta_pesos           numeric,
  periodo               text not null,
  fuente_id             uuid not null references fuente (id),
  url                   text not null,
  fecha_consulta        date not null,
  motivo_sin_dato       text,
  unique (programa_generico_id, periodo),
  check ((desde_pesos is null and hasta_pesos is null) = (motivo_sin_dato is not null)),
  check ((desde_pesos is null and hasta_pesos is null) or tramo_publicado is not null),
  check (desde_pesos is null or desde_pesos >= 0),
  check (hasta_pesos is null or hasta_pesos >= 0),
  check (hasta_pesos is null or hasta_pesos > desde_pesos)
);

-- Requisitos de una variante en un proceso DEMRE. Los puntajes permiten decimales.
create table requisito_admision (
  id                                  uuid primary key default gen_random_uuid(),
  variante_id                         uuid not null references programa_variante (id) on delete cascade,
  nem                                 smallint check (nem between 0 and 100),
  ranking                             smallint check (ranking between 0 and 100),
  competencia_lectora                 smallint check (competencia_lectora between 0 and 100),
  matematica_1                        smallint check (matematica_1 between 0 and 100),
  matematica_2                        smallint check (matematica_2 between 0 and 100),
  historia_cs_sociales                smallint check (historia_cs_sociales between 0 and 100),
  ciencias                            smallint check (ciencias between 0 and 100),
  historia_o_ciencias                 boolean not null default false,
  prueba_especial                     smallint check (prueba_especial between 0 and 100),
  asignacion_especial_pedagogia       smallint check (asignacion_especial_pedagogia between 0 and 100),
  puntaje_ponderado_minimo            numeric check (puntaje_ponderado_minimo between 150 and 1000),
  puntaje_promedio_minimo             numeric check (puntaje_promedio_minimo between 150 and 1000),
  pagina_pdf                          integer check (pagina_pdf > 0),
  periodo                             text not null,
  fuente_id                           uuid not null references fuente (id),
  url                                 text not null,
  fecha_consulta                      date not null,
  unique (variante_id, periodo),
  check (
    coalesce(nem, 0) + coalesce(ranking, 0) + coalesce(competencia_lectora, 0)
    + coalesce(matematica_1, 0) + coalesce(matematica_2, 0)
    + coalesce(prueba_especial, 0) + coalesce(asignacion_especial_pedagogia, 0)
    + case when historia_o_ciencias then greatest(coalesce(historia_cs_sociales, 0), coalesce(ciencias, 0))
      else coalesce(historia_cs_sociales, 0) + coalesce(ciencias, 0) end = 100
  )
);

create type via_vacante_admision as enum ('regular', 'regular_2do_semestre', 'mc', 'bea', 'pace');
create table vacante_admision (
  id                uuid primary key default gen_random_uuid(),
  variante_id       uuid not null references programa_variante (id) on delete cascade,
  via               via_vacante_admision not null,
  cupos             integer check (cupos >= 0),
  periodo           text not null,
  fuente_id         uuid not null references fuente (id),
  url               text not null,
  fecha_consulta    date not null,
  motivo_sin_dato   text,
  unique (variante_id, via, periodo),
  check ((cupos is null) = (motivo_sin_dato is not null))
);

-- La acreditación es una situación fechada, no una promesa de vigencia actual.
create table acreditacion_institucion (
  id                uuid primary key default gen_random_uuid(),
  institucion_id    uuid not null references institucion (id) on delete cascade,
  estado            text not null check (estado in ('acreditada', 'no_acreditada', 'bajo_tutela')),
  anios             smallint check (anios between 1 and 7),
  desde             date,
  hasta             date,
  situacion_al      date not null,
  periodo           text not null,
  fuente_id         uuid not null references fuente (id),
  url               text not null,
  fecha_consulta    date not null,
  motivo_sin_dato   text,
  unique (institucion_id, situacion_al),
  check (hasta is null or desde is null or hasta >= desde),
  check ((anios is null) = (motivo_sin_dato is not null))
);

-- Datos públicos: RLS habilitada, lectura pública y sin escritura desde la web.
alter table programa_generico enable row level security;
alter table arancel_variante enable row level security;
alter table tramo_ingreso_sies enable row level security;
alter table requisito_admision enable row level security;
alter table vacante_admision enable row level security;
alter table acreditacion_institucion enable row level security;

create policy lectura_publica on programa_generico for select to anon, authenticated using (true);
create policy lectura_publica on arancel_variante for select to anon, authenticated using (true);
create policy lectura_publica on tramo_ingreso_sies for select to anon, authenticated using (true);
create policy lectura_publica on requisito_admision for select to anon, authenticated using (true);
create policy lectura_publica on vacante_admision for select to anon, authenticated using (true);
create policy lectura_publica on acreditacion_institucion for select to anon, authenticated using (true);

grant select on programa_generico, arancel_variante, tramo_ingreso_sies, requisito_admision,
  vacante_admision, acreditacion_institucion to anon, authenticated;
