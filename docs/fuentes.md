# Catálogo de fuentes oficiales

Todo dato que muestra la plataforma sale de una fuente de esta tabla. Si una fuente no está aquí, primero se agrega (con PR) y después se usa.

**Estado de términos de uso:** "por verificar" significa que nadie del equipo ha leído aún los términos del sitio. No se automatiza ninguna descarga desde una fuente en ese estado.

| Fuente | Organismo | Qué aporta | Dirección | Formato preferido | Actualización | Términos de uso |
|---|---|---|---|---|---|---|
| Mi Futuro | Subsecretaría de Educación Superior (SIES, Mineduc) | Empleabilidad 1.er y 2.º año, ingreso promedio 4.º año, retención 1.er año, duración real, titulados | https://www.mifuturo.cl/ | Bases descargables del SIES | Anual (antes de admisión) | Por verificar |
| Datos Abiertos Mineduc | Ministerio de Educación | Oferta académica, aranceles, matrícula | https://datosabiertos.mineduc.cl/ | CSV | Anual | Por verificar |
| DEMRE | Universidad de Chile | Ponderaciones, puntajes de corte, vacantes, fórmula de puntaje ranking | https://demre.cl/ | Publicaciones oficiales (PDF/XLSX) | Por proceso de admisión | Por verificar |
| Acceso Mineduc | Subsecretaría de Educación Superior | Sistema de Acceso, calendario de admisión | https://acceso.mineduc.cl/ | Páginas oficiales | Por proceso | Por verificar |
| Beneficios Estudiantiles | Mineduc | Gratuidad, becas, créditos, FUAS y sus plazos | https://portal.beneficiosestudiantiles.cl/ | Páginas oficiales | Por proceso | Por verificar |
| CNA Chile | Comisión Nacional de Acreditación | Acreditación de instituciones y años | https://www.cnachile.cl/ | Buscador / bases | Continua | Por verificar |
| Minsal | Ministerio de Salud | Línea de Prevención del Suicidio *4141, Salud Responde 600 360 7777 | https://www.minsal.cl/linea-de-atencion-4141-no-estas-solo-no-estas-sola/ | Página oficial | Revisar cada semestre | Información pública |

## Reglas de uso

1. **Preferir archivos descargables** sobre leer páginas web. Si una fuente solo existe como página, se carga a mano con la URL y la fecha, hasta que se verifiquen sus términos.
2. **Cada fila cargada guarda** `fuente_id`, URL exacta del archivo y fecha de descarga.
3. **Mostrar siempre qué mide el indicador y su período**: "Empleabilidad al 1.er año, titulados 2023". Nunca comparar indicadores de períodos o definiciones distintas sin advertirlo.
4. **Sin dato no es cero.** Cuando el SIES no publica un valor (por ejemplo, por muestra pequeña), se muestra "sin datos suficientes" y se explica por qué.
5. **Revisión de vigencia:** antes de cada proceso de admisión, el responsable de datos revisa cada fuente y actualiza la columna "Actualización".

## Registro de verificaciones

| Fecha | Fuente | Qué se verificó | Quién |
|---|---|---|---|
| 2026-11-02 | Minsal *4141 | Línea gratuita, 24/7, desde celulares | Claude (revisar) |
