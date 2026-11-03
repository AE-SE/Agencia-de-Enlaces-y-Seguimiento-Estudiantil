# Guía de Cristóbal · Datos y contenido

> **Para la IA que acompaña a Cristóbal:** este documento es tu hoja de ruta. Antes de proponer cualquier cosa, lee `AGENTS.md`, `docs/equipo/README.md`, `docs/fuentes.md` y la skill indicada en cada tarea. **Nunca inventes un dato, una fecha, un monto ni una fórmula**: si no tienes la fuente oficial delante, escribe `TODO(fuente)` y avisa. Si algo de aquí contradice `AGENTS.md`, gana `AGENTS.md`.

---

## 1. Tu rol en una frase

Eres el responsable de que **todo lo que la plataforma afirma sea verdad**: cada arancel, puntaje, porcentaje, plazo y requisito sale de una fuente oficial, con su enlace y su fecha.

**Te toca:** fuentes oficiales y sus términos de uso, descarga y limpieza de datos, scripts de carga, fórmulas de puntaje ponderado y ranking, beneficios y plazos, documentos para el asistente IA, revisión de todos los textos, pruebas con usuarios.

**No te toca** (pídeselo a quien corresponde):
- Pantallas y estilos → Alejandro.
- Esquema de la base de datos, claves, asistente IA → el líder.

**Por qué este rol es crítico:** un dato equivocado sobre una carrera puede cambiar la decisión de vida de alguien. La plataforma solo vale si se puede confiar en ella.

---

## 2. Lo que debes dominar antes de la primera tarea

Lee completos, en este orden (unos 40 minutos):

1. [`AGENTS.md`](../../AGENTS.md), sobre todo la sección 2.1 (datos oficiales) y 2.2 (privacidad).
2. [`docs/fuentes.md`](../fuentes.md): el catálogo de fuentes que vas a mantener.
3. [`.claude/skills/datos-oficiales/SKILL.md`](../../.claude/skills/datos-oficiales/SKILL.md): tus reglas de trabajo.
4. [`.claude/skills/lenguaje-claro/SKILL.md`](../../.claude/skills/lenguaje-claro/SKILL.md): cómo se escribe para el estudiante.
5. [`docs/arquitectura.md`](../arquitectura.md), sección 3 (modelo de datos) y 6 (flujo de datos oficiales).

**Cuatro reglas que guían todo tu trabajo:**

1. **Sin fuente no hay dato.** Cada valor guarda: fuente, URL exacta del archivo, período que mide y fecha de descarga.
2. **Sin dato no es cero.** Si la fuente no publica un valor, se guarda vacío (`null`) con el motivo. Un 0 falso es peor que un hueco honesto.
3. **No mezclar peras con manzanas.** Empleabilidad al 1.er año y al 2.º año son indicadores distintos. Titulados 2022 y 2023 son períodos distintos. Nunca se comparan en la misma fila sin advertirlo.
4. **Repetible.** Todo script se puede correr dos veces y deja el mismo resultado.

---

## 3. Las fuentes con las que vas a trabajar

| Qué necesitamos | Fuente | Dónde buscar | Notas |
|---|---|---|---|
| Oferta de carreras: institución, sede, comuna, región, jornada, duración, arancel, matrícula, vacantes, código SIES | **INDICES del Consejo Nacional de Educación (CNED)**, base "Oferta Académica de Pregrado 2026" | https://www.cned.cl (sección INDICES Educación Superior) | Su esquema de campos está en [este PDF del CNED](https://cned.cl/wp-content/uploads/2026/01/Esquema_Registro_Oferta2026_INDICES.pdf). Corte de datos: 8 de enero de 2026. Excluye 5 instituciones (listadas en el PDF). Se cita como "INDICES Educación Superior, Consejo Nacional de Educación". Si no encuentras la descarga, escribe a consultas@cned.cl. |
| Empleabilidad e ingresos por carrera e institución | **Servicio de Información de Educación Superior (SIES), Mineduc**, publicado en mifuturo.cl | https://www.mifuturo.cl (buscador de empleabilidad e ingresos y sus bases) | El 2 de noviembre de 2026 el sitio mostraba un aviso de mantención. Si sigue así, busca las bases en el sitio del Mineduc o del SIES y anótalo en `docs/fuentes.md`. Usa siempre el código SIES para cruzar con el CNED. |
| Ponderaciones, vacantes y carreras del Sistema de Acceso | **DEMRE** (Universidad de Chile) | https://demre.cl/publicaciones | Para la Admisión 2026 publicó la oferta definitiva con ponderaciones el 25 de septiembre de 2025 ([publicación](https://demre.cl/publicaciones/2026/2026-25-09-25-oferta-carreras-vacantes-ponderaciones-p2026)). Busca la equivalente de la **Admisión 2027**, que es el proceso en curso. |
| Puntajes de corte (último matriculado) | **DEMRE** | https://demre.cl/publicaciones | Se publican después de los resultados de cada proceso. Usa los de la Admisión 2026 y muestra siempre "del año anterior". |
| Fórmula del puntaje ranking y del ponderado | **DEMRE** | Documentos oficiales del proceso de admisión | La fórmula exacta se copia desde el documento oficial y se cita en el código. Nunca desde blogs ni calculadoras de terceros. |
| Acreditación institucional | **Comisión Nacional de Acreditación (CNA)** | https://www.cnachile.cl | Años de acreditación y fecha de término. |
| Gratuidad, becas, créditos, FUAS y plazos | **Mineduc**, portal de Beneficios Estudiantiles | https://portal.beneficiosestudiantiles.cl | Carga a mano, con URL y fecha, hasta revisar sus términos de uso. |
| Calendario del proceso de admisión | **Subsecretaría de Educación Superior** | https://acceso.mineduc.cl | Fechas de PAES, resultados y postulación. |

**Cuidado con las fuentes secundarias:** diarios, blogs, calculadoras de puntaje de terceros y foros sirven para *encontrar* el documento oficial, nunca como fuente del dato.

---

## 4. Tus tareas

Cada tarea tiene: objetivo, pasos, archivos, criterios de aceptación (lo que se revisa) y un texto para copiar a tu IA. Hazlas en orden.

### Semana 1 · Cimientos (3 al 9 de noviembre)

#### C1 · Términos de uso de cada fuente
**Rama:** `docs/terminos-de-uso-fuentes` · **Skill:** `datos-oficiales`

**Objetivo:** saber, antes de descargar nada, qué podemos hacer legalmente con cada fuente.

**Pasos:**
1. Por cada fuente de la sección 3, busca sus términos de uso, licencia o aviso legal (pie de página, "Términos", "Aviso legal", "Datos abiertos"). Muchas fuentes del Estado usan licencias Creative Commons.
2. Anota en `docs/fuentes.md`, columna "Términos de uso": la licencia o condición, el enlace donde la leíste y la fecha. Si no encuentras nada, escribe "Sin términos publicados (revisado AAAA-MM-DD)".
3. Agrega el CNED (INDICES) como fuente nueva en la tabla.
4. Si una fuente prohíbe la reutilización, avísale al líder de inmediato.

**Criterios de aceptación:**
- [ ] Ninguna fuente queda en "Por verificar".
- [ ] Cada término tiene enlace y fecha de revisión.
- [ ] Registro de verificaciones de `docs/fuentes.md` actualizado.

**Texto para tu IA:**
> Lee docs/fuentes.md y la skill datos-oficiales. Te voy a pegar el texto de los términos de uso de cada sitio. Para cada uno, resume en una línea qué permite (reutilizar, citar, uso comercial, atribución obligatoria) y redacta la fila para la columna "Términos de uso". No supongas nada que no diga el texto.

---

#### C2 · Descargar las bases oficiales
**Rama:** ninguna (los archivos crudos **no** se suben al repositorio)

**Objetivo:** tener en tu computador los archivos originales de cada fuente.

**Pasos:**
1. Descarga a `datos/crudos/` (está en `.gitignore`):
   - Base de oferta 2026 del CNED.
   - Base de empleabilidad e ingresos del SIES (la más reciente).
   - Oferta definitiva con ponderaciones del DEMRE (Admisión 2027 si existe; si no, 2026).
   - Puntajes de corte de la Admisión 2026 del DEMRE.
2. Crea `datos/registro_descargas.md` (este archivo **sí** se sube): una fila por archivo con nombre, fuente, URL exacta, fecha de descarga y período que cubre.
3. Si algún archivo es solo PDF, anótalo: la extracción desde PDF requiere revisión manual extra.

**Criterios de aceptación:**
- [ ] `datos/registro_descargas.md` completo.
- [ ] Ningún archivo crudo en el repositorio.

---

#### C3 · Diccionario de datos
**Rama:** `docs/diccionario-de-datos` · **Skill:** `datos-oficiales`
**Depende de:** esquema de tablas del líder (miércoles 4 de noviembre)

**Objetivo:** un mapa de qué columna de qué archivo oficial termina en qué campo de nuestra base de datos.

**Crea `docs/datos/diccionario.md`** con, para cada campo de nuestras tablas (`institucion`, `programa`, `indicador`, `fuente`):

| Nuestro campo | Fuente | Columna original | Tipo | Unidad | Transformación | Ejemplo |
|---|---|---|---|---|---|---|

Ejemplos de transformaciones a documentar: arancel en UF o en pesos (el CNED informa el tipo de moneda: hay que convertir y documentar con qué valor de UF y de qué fecha); textos con mayúsculas inconsistentes; códigos con ceros a la izquierda que Excel borra.

**Criterios de aceptación:**
- [ ] Todos los campos del esquema mapeados o marcados "sin fuente aún".
- [ ] Cada transformación explicada y justificada.

---

#### C4 · Datos de ejemplo para Alejandro (urgente: jueves 5 de noviembre)
**Rama:** `datos/ejemplos` · **Skill:** `datos-oficiales`

**Objetivo:** que Alejandro pueda construir pantallas con datos **reales y verificados** mientras la base de datos se termina.

**Pasos:**
1. Elige **10 carreras** variadas: al menos una universidad, un instituto profesional y un centro de formación técnica; al menos 3 regiones distintas; al menos una sin datos de ingreso (para probar "Sin datos suficientes"); incluye Enfermería y una carrera técnica del área de salud (es el caso de uso que inspira el proyecto).
2. Para cada una, busca a mano cada valor en la fuente oficial y escríbelo en `datos/ejemplos/carreras.json` con este formato:

```json
{
  "generado": "AAAA-MM-DD",
  "carreras": [
    {
      "codigo_sies": "texto, tal como aparece en la fuente",
      "carrera": "nombre del programa",
      "institucion": { "nombre": "…", "tipo": "universidad | instituto_profesional | centro_formacion_tecnica" },
      "sede": "…", "comuna": "…", "region": "…",
      "jornada": "diurna | vespertina | …",
      "duracion_semestres": "número entero",
      "indicadores": [
        {
          "tipo": "empleabilidad_1er_anio | ingreso_promedio_4to_anio | arancel_anual | matricula | vacantes | puntaje_corte | retencion_1er_anio | duracion_real_semestres",
          "valor": "número, o null si la fuente no lo publica",
          "unidad": "porcentaje | pesos | puntos | semestres | cupos",
          "periodo": "por ejemplo: titulados 2023, admisión 2026, año 2026",
          "fuente": "SIES | CNED | DEMRE | CNA",
          "url": "enlace exacto donde se ve o descarga el dato",
          "fecha_consulta": "AAAA-MM-DD",
          "motivo_sin_dato": "solo si valor es null"
        }
      ]
    }
  ]
}
```

3. Pide a otra persona del equipo (o al líder) que verifique 3 valores al azar contra la fuente. Anota quién y cuándo en el PR.

**Criterios de aceptación:**
- [ ] 10 carreras con la variedad pedida.
- [ ] Cada valor con fuente, URL, período y fecha.
- [ ] 3 valores verificados por otra persona.
- [ ] Ningún 0 donde falta el dato.

**Texto para tu IA:**
> Lee la skill datos-oficiales y la tarea C4 de docs/equipo/guia-cristobal.md. Ayúdame a armar datos/ejemplos/carreras.json con el formato indicado. Yo te voy a pegar los valores que copio de cada fuente oficial con su URL. Tú solo los ordenas en el formato y me avisas si falta fuente, período o fecha en alguno. No completes ningún valor por tu cuenta.

---

#### C5 · Primer script de carga: oferta académica (CNED)
**Rama:** `datos/carga-oferta` · **Skill:** `datos-oficiales`

**Objetivo:** convertir la base del CNED en filas limpias para nuestras tablas `institucion` y `programa`, y para los indicadores de arancel, matrícula y vacantes.

**Pasos:**
1. Script `datos/cargar_oferta.py` que:
   - Lee el archivo crudo desde `datos/crudos/` (ruta como argumento, no escrita en el código).
   - Valida: tipos (arancel entero), rangos (arancel mayor que 0, vacantes mayor o igual a 0), códigos SIES no vacíos y sin perder ceros a la izquierda.
   - Normaliza textos (espacios, mayúsculas) sin cambiar el significado.
   - Convierte UF a pesos si corresponde, con el valor de UF y la fecha usados escritos en la salida.
   - Escribe `datos/procesados/oferta.csv` (en `.gitignore` hasta que el líder conecte la base).
   - Imprime un resumen: filas leídas, válidas, descartadas y por qué.
2. Pruebas en `tests/datos/test_cargar_oferta.py`: al menos 3 valores verificados a mano contra la fuente, con su URL en un comentario.
3. Documenta en el PR las instituciones que el CNED excluye y cómo lo mostraremos.

**Criterios de aceptación:**
- [ ] Correr el script dos veces produce exactamente el mismo archivo.
- [ ] Ninguna fila con dato inválido pasa en silencio: queda en el resumen.
- [ ] Pruebas pasan.

**Texto para tu IA:**
> Lee la skill datos-oficiales y docs/datos/diccionario.md. Escribe datos/cargar_oferta.py en Python que lea la base de oferta del CNED desde una ruta que recibe como argumento, valide tipos, rangos y códigos según el diccionario, normalice textos sin cambiar su significado, y escriba datos/procesados/oferta.csv. Debe ser repetible e imprimir un resumen de filas válidas y descartadas con motivo. Escribe pruebas con pytest para 3 valores que yo verifiqué a mano (te los paso). No uses librerías fuera de las de scripts/requirements.txt sin preguntarme.

---

### Semana 2 · Explorar (10 al 16 de noviembre)

#### C6 · Script de empleabilidad e ingresos (SIES)
**Rama:** `datos/carga-empleabilidad` · **Skill:** `datos-oficiales`

- Igual que C5, para la base del SIES: empleabilidad al 1.er (y 2.º) año, ingreso promedio al 4.º año, retención, duración real.
- **Cruce con el CNED por código SIES.** Reporta cuántos programas cruzaron y cuántos no, y por qué.
- Los valores que el SIES no publica por muestra pequeña quedan en `null` con motivo "Muestra insuficiente según SIES".
- Los ingresos se guardan en pesos con el año de referencia que indique la fuente (por ejemplo, "pesos de septiembre de 2025"): no se ajustan por inflación sin un ADR.

#### C7 · Cálculos de puntaje ponderado y ranking
**Rama:** `feat/calculos-puntaje` · **Skill:** `datos-oficiales`
**Fecha clave:** Alejandro los necesita el viernes 13 de noviembre.

**Objetivo:** funciones en TypeScript, en `lib/calculos/`, que calculen el puntaje ranking y el puntaje ponderado de una carrera, exactamente como el DEMRE.

**Pasos:**
1. Consigue el documento oficial del DEMRE que define cada fórmula para la **Admisión 2027**. Guarda el enlace.
2. Escribe las funciones **puras** (sin pantallas ni base de datos): reciben números, devuelven números.
3. Las ponderaciones de cada carrera **no van en el código**: vienen como parámetro (desde los datos del DEMRE).
4. En la cabecera de cada archivo: enlace al documento oficial, página o sección de la fórmula y año de admisión.
5. Pruebas con **casos tomados de ejemplos oficiales** del DEMRE (si los publica) y casos borde: puntajes mínimos y máximos, ponderaciones que suman 100 %, prueba electiva Ciencias o Historia, carreras con requisitos mínimos.
6. Si la fórmula cambia entre años, versiona por año: `lib/calculos/2027/…`.

**Criterios de aceptación:**
- [ ] Cada fórmula cita su documento oficial.
- [ ] Pruebas con casos oficiales pasan.
- [ ] Ningún número mágico sin explicación en el código.

**Texto para tu IA:**
> Lee la skill datos-oficiales y la tarea C7 de docs/equipo/guia-cristobal.md. Te voy a pegar el texto oficial del DEMRE con la fórmula del puntaje ranking y del puntaje ponderado para la Admisión 2027. Implementa funciones puras en TypeScript en lib/calculos/2027/, citando el documento en la cabecera, sin escribir ponderaciones de carreras en el código. Escribe pruebas con los ejemplos oficiales que te pego y con casos borde. Si el texto oficial es ambiguo en algo, no lo resuelvas por tu cuenta: dime qué parte y por qué.

#### C8 · Ponderaciones y puntajes de corte
**Rama:** `datos/carga-demre` · **Skill:** `datos-oficiales`

- Carga ponderaciones, vacantes del Sistema de Acceso y puntajes de corte del año anterior, cruzando con la oferta.
- Si la fuente es PDF: extrae, y luego **verifica a mano el 10% de las filas** (anota cuáles en el PR).

---

### Semana 3 · Acompañar (17 al 23 de noviembre)

#### C9 · Beneficios y plazos
**Rama:** `datos/beneficios-plazos` · **Skills:** `datos-oficiales`, `lenguaje-claro`

- Lista de beneficios vigentes (gratuidad, becas, créditos) con: nombre oficial, requisitos explicados en lenguaje claro **y** en su texto oficial, monto o cobertura si la fuente lo dice, fuente, URL y fecha.
- Plazos del proceso en curso (FUAS, postulación, resultados) con fecha de inicio y término.
- Formato acordado con el líder (archivo de datos o tabla). **Nada en el código.**
- Los requisitos que dependen de situaciones personales se redactan como "podrías", nunca como promesa.

#### C9b · Documentos oficiales para el asistente IA
**Rama:** `datos/corpus-asistente` · **Skill:** `asistente-seguro`

- El asistente solo responde con documentos que tú cargas. Arma `datos/asistente/documentos.json` con: título, organismo, URL, fecha de publicación, fecha de consulta y tema (admisión, beneficios, carreras, plazos).
- Solo documentos oficiales y vigentes. Marca con fecha de vencimiento los que tienen fecha (por ejemplo, calendarios de un proceso).
- Coordina con el líder el formato exacto.

#### C10 · Revisión de textos de todas las pantallas
**Skill:** `lenguaje-claro` · **Durante todo el proyecto**

- Cada vez que Alejandro termina una pantalla, revisas sus textos con la skill y le entregas los cambios (comentario en su PR o rama `fix/textos-…`).
- Lleva una lista de términos en `docs/datos/glosario.md`: palabra oficial → explicación simple (ejemplo: "Puntaje de corte → el puntaje del último estudiante que entró el año pasado").

---

### Semana 4 · Seguir y vender (24 al 30 de noviembre)

#### C11 · Pruebas con usuarios
**Rama:** `docs/pruebas-usuarios`

**Objetivo:** ver a 5 personas reales usar la plataforma y corregir lo que no entienden.

**Pasos:**
1. **Guion** en `docs/pruebas-usuarios.md`: 3 tareas concretas ("Encuentra una carrera de Enfermería en tu región y compárala con otra", "Simula tu puntaje para esa carrera", "Encuentra hasta cuándo puedes postular a beneficios"). Sin ayudar durante la tarea.
2. **Participantes:** 5 personas, al menos una de zona rural y al menos una que nunca haya postulado a la educación superior. Si alguien es menor de 18, necesitas autorización escrita de su madre, padre o tutor.
3. **Consentimiento:** antes de empezar, explica para qué es la prueba y pide permiso para tomar notas. **No grabes pantalla ni voz sin consentimiento explícito.** No guardes nombres en el repositorio: usa "Participante 1, 2…".
4. **Registra:** si completó cada tarea, cuánto tardó, dónde dudó, qué dijo (sin datos que lo identifiquen).
5. **Informe:** problemas ordenados por gravedad y propuesta de arreglo. Con Alejandro, convierte cada problema en una rama `fix/…`.

#### C12 · Verificación cruzada final
**Rama:** `datos/verificacion-final`

- Elige 30 fichas de carrera al azar en la plataforma ya cargada.
- Compara cada cifra mostrada con su fuente oficial.
- Informe en `docs/datos/verificacion.md`: cuántas cifras revisadas, cuántas correctas, errores encontrados y su corrección.
- Meta: 100 % de coincidencia. Cualquier error se corrige antes de la entrega.

#### C13 · Informe de datos para el proyecto de título
**Rama:** `docs/informe-datos`

Un capítulo en `docs/datos/informe.md` con: fuentes usadas y sus términos, proceso de carga, validaciones, cobertura (cuántas carreras e instituciones, qué falta y por qué), resultados de la verificación cruzada y limitaciones conocidas.

---

## 5. Antes de abrir cada PR

- [ ] La tarea cumple **todos** sus criterios de aceptación.
- [ ] Cada dato nuevo tiene fuente, URL, período y fecha.
- [ ] Ningún archivo crudo ni dato personal en el PR.
- [ ] Ningún valor faltante convertido en 0.
- [ ] Los scripts son repetibles y tienen pruebas.
- [ ] `docs/fuentes.md` y `datos/registro_descargas.md` actualizados si usaste una fuente nueva.
- [ ] Plantilla del PR completa, incluida la IA que usaste.
- [ ] Leíste y entiendes todo el código, incluido el que escribió tu IA.

## 6. Errores comunes que hacen rechazar un PR

| Error | Por qué se rechaza | Cómo evitarlo |
|---|---|---|
| Dato copiado de un diario o calculadora de terceros | No es fuente oficial | Buscar el documento oficial y citarlo |
| Valor ausente guardado como 0 | Información falsa | `null` + motivo |
| Fórmula escrita "de memoria" o por la IA | Puede estar mal y nadie lo notaría | Copiar del documento oficial del DEMRE y citarlo |
| Ponderaciones escritas en el código | Cambian cada año | Vienen de los datos |
| Archivo de Excel abierto y guardado de nuevo | Excel borra ceros a la izquierda de los códigos | Leer siempre el archivo original con el script |
| Mezclar períodos en una comparación | Engaña al estudiante | Mostrar el período y advertir |
| Nombres reales en pruebas con usuarios | Privacidad | "Participante 1, 2…" |
