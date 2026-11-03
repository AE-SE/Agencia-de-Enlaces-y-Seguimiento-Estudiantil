#!/usr/bin/env bash
# Corre las pruebas de seguridad en un PostgreSQL local (no toca Supabase).
# Uso: PGHOST=... PGPORT=... PGUSER=postgres bash supabase/tests/correr_pruebas.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
BD=prueba_rls
psql -q -d postgres -c "drop database if exists $BD" -c "create database $BD"
psql -q -d $BD -v ON_ERROR_STOP=1 -f supabase/tests/_simular_supabase.sql
for m in supabase/migrations/*.sql; do psql -q -d $BD -v ON_ERROR_STOP=1 -f "$m"; done
# Solo se muestran los resultados de cada prueba.
psql -q -t -A -d $BD -v ON_ERROR_STOP=1 -f supabase/tests/pruebas_rls.sql 2>&1 \
  | sed -n 's/^.*NOTICE:  //p; s/^.*ERROR:  //p; /^---/p; /^===/p'
psql -q -d postgres -c "drop database $BD"
