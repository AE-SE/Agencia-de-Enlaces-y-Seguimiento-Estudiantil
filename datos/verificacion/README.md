# Verificación de la carga DEMRE

`demre_muestra.csv` conserva la revisión visual hecha por Codex y declara su responsable real. No cuenta como
verificación humana.

Una persona debe abrir el PDF oficial de la Admisión 2027 y completar las 15 filas de
`demre_revision_humana_pendiente.csv`:

1. comparar código, carrera, lugar, ponderaciones, requisitos, puntajes mínimos y vacantes;
2. escribir `si` o `no` en `coincide_con_el_pdf (si/no)`;
3. registrar su nombre, la fecha y cualquier diferencia en `observacion`;
4. si encuentra una diferencia, corregir el cargador o el archivo de correcciones y volver a generar la muestra.

Las filas 17074 y 32012 requieren además abrir el respaldo institucional indicado en
`datos/correcciones/demre_2027.csv`. Esas páginas no publican año ni fecha del proceso, por lo que solo respaldan
el indicador «o» omitido por DEMRE; no son la fuente única de la ponderación.
