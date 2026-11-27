# Verificación cruzada de fichas (C12)

**Avance de la primera pasada, 26 de noviembre de 2026.** Se revisaron 30 fichas del [sitio publicado](https://agencia-de-enlace.rafajaqued.workers.dev/carreras). El contraste de esta pasada cubre duración formal, arancel anual, costo de matrícula y costo del primer año.

## Método y resultado

- Se sortearon 30 posiciones distintas con semilla `20261126`, entre las 11.350 posiciones de las primeras 454 páginas completas del explorador. El listado tenía 455 páginas y mostraba 25 fichas por página completa.
- El listado tenía 11.364 fichas. Las 14 de la última página quedaron fuera del sorteo. La tabla registra página, posición y código único de variante. Cada enlace lleva a su ficha publicada.
- Se cruzó el código único de cada variante con la hoja `in` de [Oferta Académica 2026, SIES](https://www.mifuturo.cl/wp-content/uploads/2026/06/Oferta_Academica_2026_SIES_05_06_2026_WEB_E.xlsx), consultada el 26 de noviembre. Se compararon «Duración Estudios», «Arancel Anual» y «Matrícula Anual». Se corroboraron los mismos valores en la fuente que enlaza la ficha, [Matrícula en Educación Superior 2026, Datos Abiertos Mineduc](https://datosabiertos.mineduc.cl/wp-content/uploads/2026/09/Matricula-Ed-Superior-2026.rar), revisión del 26 de noviembre. Se contrastaron las columnas `dur_estudio_carr`, `valor_arancel` y `valor_matricula` agrupadas por `codigo_unico`. Las 30 variantes coincidieron en ambas fuentes para esos campos.
- Coincidieron **30 de 30 duraciones**, **30 de 30 aranceles** y los **28 costos de matrícula visibles**. Dos fichas muestran la falta de cifra en lugar del cero de la planilla. En esas dos fichas también se omite el costo del primer año.
- Los **28 costos del primer año visibles** coinciden con la suma de arancel y matrícula. La ficha rotula esa suma como «elaboración propia».
- Las tarjetas auditadas presentan enlaces de fuente y el período. En una ficha de control se comprobó que la fecha de consulta aparece en el bloque «¿De dónde salen estos datos?». La relación entre cada cifra y la fecha debe comprobarse para el resto de indicadores, ya que ese bloque agrupa por URL.

Estos resultados cubren los cuatro campos indicados. Siguen pendientes el contraste de los demás indicadores y comparaciones, la revisión de trazabilidad cifra por cifra y la segunda pasada del 11 de diciembre. En esa pasada el sorteo debe cubrir todas las páginas y registrar el procedimiento exacto de selección. El resultado global de I-OE1a queda pendiente.

## Muestra observada

| Página y posición | Código de variante | Fila SIES | Duración formal (semestres) | Arancel anual | Matrícula | Primer año |
|---|---|---:|---:|---:|---:|---:|
| [221 / 1](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/cft-ceduc-ucn/instrumentacion-y-control-industrial-casa-central-coquimbo-i456s1c17j2v1) | `I456S1C17J2V1` | 27421 | 5 | $2.373.718 | $181.796 | $2.555.514 |
| [315 / 18](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/cft-de-la-region-del-libertador-general-bernardo-o-higgins/tecnico-de-nivel-superior-en-educacion-parvularia-sede-san-vicente-i913s1c2j1v1) | `I913S1C2J1V1` | 28323 | 5 | $1.148.239 | Sin cifra | Sin cifra |
| [181 / 25](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-aiep/ingenieria-en-informatica-sede-puerto-montt-i143s12c15j2v2) | `I143S12C15J2V2` | 16254 | 8 | $2.180.000 | $240.000 | $2.420.000 |
| [419 / 11](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/cft-de-enac/tecnico-en-rehabilitacion-por-uso-de-drogas-casa-central-santiago-i218s1c176j1v1) | `I218S1C176J1V1` | 27734 | 5 | $1.888.000 | $63.000 | $1.951.000 |
| [95 / 5](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-duoc-uc/ilustracion-sede-san-carlos-de-apoquindo-i111s6c67j2v1) | `I111S6C67J2V1` | 22635 | 5 | $3.080.000 | $264.000 | $3.344.000 |
| [323 / 25](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/cft-de-la-region-de-arica-y-parinacota/tecnico-de-nivel-superior-en-gestion-de-recursos-humanos-campus-las-acacias-i902s1c26j2v1) | `I902S1C26J2V1` | 27826 | 5 | $1.929.232 | Sin cifra | Sin cifra |
| [439 / 8](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-de-los-lagos/tecnico-universitario-en-transporte-maritimo-costero-sede-puerto-montt-i84s2c383j1v1) | `I84S2C383J1V1` | 3785 | 5 | $2.529.000 | $140.000 | $2.669.000 |
| [107 / 7](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-de-santiago-de-chile/ingenieria-civil-en-mecanica-casa-central-santiago-i71s1c20j1v1) | `I71S1C20J1V1` | 4231 | 12 | $6.782.000 | $212.000 | $6.994.000 |
| [420 / 13](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-santo-tomas/tecnico-en-sonido-sede-san-joaquin-i116s39c22j2v1) | `I116S39C22J2V1` | 27055 | 5 | $2.801.000 | $94.000 | $2.895.000 |
| [340 / 17](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-aiep/tecnico-en-administracion-de-empresas-mencion-comercio-exterior-sede-bellavista-i143s26c114j2v2) | `I143S26C114J2V2` | 17902 | 5 | $2.590.000 | $240.000 | $2.830.000 |
| [149 / 15](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-san-sebastian/ingenieria-en-administracion-de-empresas-sede-santiago-i39s6c180j4v1) | `I39S6C180J4V1` | 5622 | 5 | $4.982.800 | $265.500 | $5.248.300 |
| [180 / 12](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-de-valparaiso/ingenieria-en-gestion-logistica-casa-central-valparaiso-i72s1c819j1v1) | `I72S1C819J1V1` | 4608 | 8 | $5.024.000 | $226.000 | $5.250.000 |
| [108 / 16](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-catolica-de-temuco/ingenieria-civil-en-obras-civiles-casa-central-temuco-i94s1c207j1v1) | `I94S1C207J1V1` | 1767 | 10 | $5.504.000 | $238.000 | $5.742.000 |
| [303 / 15](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/cft-de-la-region-de-tarapaca/tecnico-de-nivel-superior-electricidad-industrial-sede-central-alto-hospicio-i906s1c20j1v1) | `I906S1C20J1V1` | 28150 | 5 | $2.126.000 | $68.000 | $2.194.000 |
| [286 / 4](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-mayor/psicologia-sede-manuel-montt-i10s7c31j1v1) | `I10S7C31J1V1` | 5384 | 10 | $7.682.056 | $679.700 | $8.361.756 |
| [264 / 24](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-de-o-higgins/pedagogia-en-matematica-sede-rancagua-i895s1c9j1v1) | `I895S1C9J1V1` | 3996 | 10 | $3.905.000 | $294.000 | $4.199.000 |
| [228 / 3](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/pontificia-universidad-catolica-de-chile/licenciatura-en-astronomia-campus-san-joaquin-i86s5c62j1v1) | `I86S5C62J1V1` | 131 | 9 | $6.560.000 | $195.000 | $6.755.000 |
| [336 / 16](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-aiep/tecnico-deportivo-sede-barrio-universitario-i143s15c42j1v2) | `I143S15C42J1V2` | 16751 | 4 | $2.450.000 | $240.000 | $2.690.000 |
| [337 / 9](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-aiep/tecnico-deportivo-sede-vina-del-mar-i143s6c42j2v2) | `I143S6C42J2V2` | 19363 | 4 | $2.440.000 | $240.000 | $2.680.000 |
| [321 / 22](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-de-los-lagos/tecnico-de-nivel-superior-en-enfermeria-casa-central-osorno-i84s1c485j1v1) | `I84S1C485J1V1` | 3734 | 5 | $2.974.000 | $140.000 | $3.114.000 |
| [452 / 10](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-san-sebastian/trabajo-social-sede-concepcion-i39s2c6j2v1) | `I39S2C6J2V1` | 5593 | 5 | $3.805.200 | $264.000 | $4.069.200 |
| [240 / 25](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-catolica-del-norte/nutricion-y-dietetica-sede-coquimbo-i91s2c106j1v1) | `I91S2C106J1V1` | 2054 | 10 | $5.542.000 | $195.000 | $5.737.000 |
| [193 / 1](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-inacap/ingenieria-en-mantenimiento-industrial-sede-talca-i100s29c21j1v1) | `I100S29C21J1V1` | 24024 | 8 | $3.419.000 | $310.000 | $3.729.000 |
| [355 / 17](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-inacap/tecnico-en-construccion-sede-valdivia-i100s9c366j1v1) | `I100S9C366J1V1` | 25309 | 4 | $2.897.000 | $310.000 | $3.207.000 |
| [15 / 24](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-inacap/administracion-turistica-internacional-sede-concepcion-talcahuano-i100s33c272j1v1) | `I100S33C272J1V1` | 24411 | 8 | $2.903.296 | $310.000 | $3.213.296 |
| [166 / 9](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-escuela-de-comercio-de-santiago/ingenieria-en-comercio-internacional-casa-central-santiago-i171s1c26j1v1) | `I171S1C26J1V1` | 22821 | 8 | $1.984.500 | $168.000 | $2.152.500 |
| [342 / 25](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-iacc/tecnico-en-administracion-financiera-casa-central-santiago-i117s1c45j4v1) | `I117S1C45J4V1` | 23003 | 5 | $1.850.000 | $100.000 | $1.950.000 |
| [198 / 17](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-de-chile/ingenieria-en-mecanica-automotriz-y-autotronica-casa-central-santiago-i123s2c50j1v1) | `I123S2C50J1V1` | 20243 | 8 | $2.072.000 | $156.000 | $2.228.000 |
| [348 / 25](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/ip-inacap/tecnico-en-automatizacion-y-robotica-sede-san-pedro-de-la-paz-i100s41c364j1v1) | `I100S41C364J1V1` | 25026 | 4 | $3.050.000 | $310.000 | $3.360.000 |
| [170 / 15](https://agencia-de-enlace.rafajaqued.workers.dev/carreras/universidad-de-magallanes/ingenieria-en-construccion-casa-central-punta-arenas-i77s1c76j1v1) | `I77S1C76J1V1` | 3948 | 10 | $4.834.000 | $166.000 | $5.000.000 |
