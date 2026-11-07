# Encuestas del estudio

Dos encuestas miden el problema que aborda el proyecto, sin mencionar la plataforma ni ninguna solución: una para estudiantes de 3.° y 4.° medio y otra para personas de 18 años o más que ya salieron del colegio. Comparten un **núcleo común** de preguntas (módulos 1 a 5) para comparar a los dos grupos y ver dónde aparece o se agrava el problema.

Actualizado: 2026-11-06.

| Archivo | Qué es |
|---|---|
| [`encuesta-escolar.md`](encuesta-escolar.md) | Preguntas, autorizaciones y textos de la encuesta escolar (27 preguntas, unos 6 minutos) |
| [`encuesta-adultos.md`](encuesta-adultos.md) | Preguntas, consentimiento y textos de la encuesta de adultos (39 preguntas, unos 7 minutos) |
| [`ficha-metodologica-escolar.md`](ficha-metodologica-escolar.md) | Objetivo, muestra, respaldo de cada pregunta (fuente, nivel A/B/C/D, adaptación), brechas de la literatura, claves de verdadero o falso, medición y limitaciones |
| [`ficha-metodologica-adultos.md`](ficha-metodologica-adultos.md) | Lo mismo para la encuesta de adultos, más la comparación con la escolar |
| [`carta-colegios.md`](carta-colegios.md) | Carta para pedir la autorización de los colegios |
| [`consentimiento-apoderados.md`](consentimiento-apoderados.md) | Consentimiento informado para los apoderados |
| [`crear_encuestas.gs`](crear_encuestas.gs) | Script de Google Apps Script que crea los dos formularios en Google Forms |

## Decisiones que conviene conocer

- **Ninguna pregunta es propia** (2026-11-06). Cada ítem viene de un instrumento publicado o de una encuesta oficial, en español, con la adaptación mínima declarada. Los niveles de respaldo son: **A** escala publicada con ítems textuales; **B** ítem de encuesta oficial pública (CASEN); **C** ítem adaptado de un estudio de gran muestra (Fundación Luksic, 2025) o formato internacional de ítems (Lusardi–Mitchell y OCDE/INFE); **D** variable administrativa del Mineduc. Si una pregunta no tenía fuente, se eliminó.
- **El juicio de expertos y el piloto son controles adicionales**, no el respaldo (Escobar-Pérez y Cuervo-Martínez, 2008).
- **Brechas de la literatura declaradas:** no existe una escala validada de conocimiento sobre FUAS, gratuidad o CAE, ni una de barreras percibidas validada en español para Chile; nada de lo usado está validado en institutos profesionales ni centros de formación técnica.
- **Se eliminaron** la intención de postular, el conocimiento de plazos, las barreras al FUAS, la pérdida de beneficios y las frases de verdadero o falso del equipo, por no tener fuente publicada. Quedan como pregunta de investigación para la medición con datos administrativos (folio AJ025T0003786).
- **Sin módulos de salud mental.** El PHQ-4 se descartó (ADR 0012). Las líneas de ayuda se muestran igual al cierre de la encuesta de adultos.
- **Sin comité de ética:** la institución no lo exige para este proyecto. La revisión la hace el profesor guía. Con menores de edad se mantienen las tres autorizaciones: colegio, apoderado y estudiante.
- **Claves de verdadero o falso** verificadas en fuentes oficiales el 2026-11-06 (detalle en las fichas). Se revisan antes de cada aplicación.

## Pendientes

- Permiso de adaptación a Ramírez Dorantes y Canto (2007) y los ítems de la E-DTDC de Lozano (2007).
- Ítems de intención de abandono de Chandía-Muñoz et al. (2025), para un módulo 10.
- Listado textual de aspectos (y redacción de las preguntas de preocupaciones y fuentes) de Fundación Luksic.
- Diccionario de datos del Directorio de Establecimientos para citar las categorías de modalidad.
- Umbral del juicio de expertos.

## Los formularios en uso

Están en Google Forms, en la cuenta institucional del líder, junto con sus planillas de respuestas. **Sus enlaces no se guardan aquí**: si el repositorio es público, cualquiera podría responder y contaminar los datos. Se piden al líder. Los formularios ya creados con la versión del 2026-11-04 hay que reemplazarlos con los que genere el script nuevo.

## Antes de aplicar

- [ ] Juicio de expertos sobre las adaptaciones (plantilla en las fichas).
- [ ] Piloto con 10 a 15 personas por encuesta.
- [ ] Revisión del profesor guía.
- [ ] Autorización de los colegios y consentimiento de los apoderados (encuesta escolar).
- [ ] Revisar de nuevo las claves de verdadero o falso.
- [ ] Borrar de las planillas las respuestas de prueba.

Si cambia una pregunta, se cambia aquí, en el formulario (`crear_encuestas.gs`) y en la ficha a la vez.
