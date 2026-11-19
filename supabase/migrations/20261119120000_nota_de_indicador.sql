-- Nota que acompaña una cifra oficial cuando hay algo que la persona debe saber para leerla (ADR 0038).
-- Primer uso: las carreras que pasaron de CFT INACAP a IP INACAP muestran las cifras que el SIES publica
-- para CFT INACAP, con una nota que lo dice. Vacía en todo lo demás.
-- Solo agrega columnas que aceptan nulos: no cambia ninguna fila existente ni los permisos. Las políticas
-- de lectura pública de indicador y tramo_ingreso_sies cubren las columnas nuevas.

alter table indicador add column nota text;
alter table tramo_ingreso_sies add column nota text;

comment on column indicador.nota is 'Nota visible junto a la cifra (ADR 0038). Nula si no hay nada que advertir.';
comment on column tramo_ingreso_sies.nota is 'Nota visible junto al tramo (ADR 0038). Nula si no hay nada que advertir.';
