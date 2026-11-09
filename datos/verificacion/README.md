# Verificación de la carga DEMRE

El 7 de noviembre de 2026, Cristóbal Rojas Perez verificó manualmente las 258 filas de
`demre_muestra.csv`, equivalentes al 10 % de las 2.159 filas procesadas. Todas coinciden con el PDF oficial
de la Admisión 2027. El archivo conserva, por fila, el resultado, la persona verificadora, la fecha y la
página del PDF revisada.

Cristóbal también verificó las 15 filas de `demre_revision_humana_pendiente.csv`; todas coinciden con el PDF.
No hubo correcciones adicionales que aplicar.

Las filas 17074 y 32012 requieren además abrir el respaldo institucional indicado en
`datos/correcciones/demre_2027.csv`. Esas páginas no publican año ni fecha del proceso, por lo que solo respaldan
el indicador «o» omitido por DEMRE; no son la fuente única de la ponderación.
