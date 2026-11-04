# Cierre de acciones derivadas — ADR 0010 y ADR 0012

4 de noviembre de 2026. Complementa y corrige secciones de
`series-y-proyeccion.md` y `evidencia-acceso-salud-mental.md`.

---

## 1. O'Higgins: la caída de matrícula de primer año — RESUELTA, con advertencia

**Cifra confirmada: -2,62%**, equivalente a 258 estudiantes menos, de **9.853 a
9.595** en matrícula de primer año regional.

### El hallazgo que obliga a cambiar cómo se usa este dato

El desglose por tipo de institución parece catastrófico, pero no lo es:

| Tipo | 2025 | 2026 | Variación |
|---|---|---|---|
| Universidades | 2.645 | 2.289 | -356 (-13,46%) |
| CFT | 3.357 | 1.800 | **-1.557 (-46,38%)** |
| IP | 3.851 | 5.506 | **+1.655 (+42,98%)** |

El desplome de los CFT y el salto de los IP son **principalmente un traspaso
administrativo de INACAP**: el IP sube 1.517 y el CFT baja 1.475. No es una fuga
del subsistema técnico.

**Regla de uso obligatoria:** nunca citar la caída de CFT (-46%) ni el alza de IP
(+43%) como fenómeno real de comportamiento estudiantil. Es un artefacto de
reclasificación institucional. Citarlo sin la advertencia es un error que un
evaluador regional detectaría de inmediato.

### Lo que sí es real y sirve al proyecto

- Caída neta regional de **258 estudiantes** en primer año (-2,62%), contra la
  tendencia nacional al alza.
- Descontando el efecto INACAP, las caídas por institución son: **Universidad de
  O'Higgins (-272)**, Universidad de Aconcagua (-50), CFT de la Región del
  Libertador (-46) y Universidad de Talca (-23). Subieron IP AIEP (+124) y CFT
  Santo Tomás (+13).
- **La matrícula femenina cae 297 (-5,60%) mientras la masculina sube 39
  (+0,86%).** Este es el dato regional más fuerte que apareció: la caída regional
  es casi enteramente una caída de mujeres.
- La jornada diurna baja 390 (-5,37%) y la vespertina sube 132 (+5,09%).

### Advertencia sobre la fuente

El dato proviene de una **columna de opinión firmada por el rector del IP-CFT
Santo Tomás sede Rancagua**, publicada en El Rancagüino. No identifica la fuente
oficial de los datos. Es consistente y detallado, pero:

- **No citarlo como cifra oficial.** Atribuirlo como "análisis regional publicado
  por el rector de Santo Tomás Rancagua" o verificarlo contra el informe SIES
  desagregado por región.
- La discrepancia con el -4,9% del informe CNED **sigue sin resolverse**: son
  probablemente universos distintos (igual que la discrepancia nacional 371.067
  contra 397.381). Usar -2,62% como cifra conservadora y declarar la fuente.

---

## 2. Ley 21.091: ¿obliga a planes de acompañamiento de primer año? — NO

Pendiente heredado del ADR 0010. **La respuesta es negativa, y eso cambia el
argumento comercial en una dirección favorable.**

Revisado el articulado de la Ley 21.091 sobre Educación Superior:

**No existe obligación legal para las instituciones de implementar
acompañamiento, nivelación, tutorías ni programas de retención, ni referencia
específica al primer año.** Lo que hay es más débil:

| Disposición | Contenido | A quién obliga |
|---|---|---|
| Art. 2 letra b) | Las instituciones "deberán tener en el centro a los estudiantes y sus aprendizajes" | Principio orientador, no medida concreta |
| Art. 2 letra k) | Articulación de estudios para un proceso formativo armónico | Principio del Sistema |
| **Art. 8 letra c)** | Proponer políticas que promuevan "permanencia y titulación o graduación oportuna" | **Al Estado (Subsecretaría), no a las instituciones** |

Sobre acceso y equidad sí hay más: el Art. 11 exige un Sistema de Acceso objetivo
y transparente que considere la diversidad de talentos y trayectorias previas; el
Art. 13 establece que los programas especiales de acceso deben "fomentar la
equidad en el ingreso"; el Art. 14 exige resguardar la no discriminación
arbitraria, transparencia, objetividad y accesibilidad universal.

**Pendiente menor:** las dimensiones obligatorias de acreditación institucional
no están en esta ley, sino en el Art. 17 inciso cuarto de la **Ley 20.129**, al
que la 21.091 remite (Art. 6 letra b). Si la permanencia aparece como dimensión
acreditable, estaría ahí. Vale la pena revisarlo: sería el gancho normativo más
fuerte para vender a instituciones.

### Consecuencia para la estrategia comercial

Esto **mejora** la posición del producto, no la empeora:

> No existe un mandato legal que obligue a las instituciones a acompañar la
> permanencia. Por lo tanto, el producto no se vende como cumplimiento normativo
> —lo que lo convertiría en un costo obligatorio que se compra al precio más
> bajo— sino como ventaja competitiva en acreditación y en resultados.

**Regla de uso:** prohibido afirmar o insinuar que la plataforma ayuda a cumplir
una obligación legal de acompañamiento. No existe. Afirmarlo sería un argumento
de venta falso y verificable en treinta segundos.

---

## 3. Valores 2020-2023 del Termómetro — NO OBTENIBLES por esta vía

Los valores de las rondas 1 a 7 están en los gráficos de los PDF de las rondas 8
y 9, pero **como etiquetas dentro de la imagen del gráfico**. La extracción de
texto devuelve las cifras sin su posición, mezclando las tres líneas (total,
mujeres, hombres) sin forma de asignarlas a su ronda.

Se intentó también descargar el PDF para rasterizar las láminas: el dominio de la
ACHS no está en la lista de dominios permitidos del entorno de ejecución.

**Cómo cerrarlo (cinco minutos de trabajo manual):**

1. Abrir https://www.achs.cl/docs/librariesprovider2/default-document-library/presentacion-tsm-r9-(3).pdf
2. Ir a la lámina "SÍNTOMAS DE DEPRESIÓN / Patient Health Questionnaire (PHQ-9)".
3. Leer los valores de la línea del **total** (la intermedia entre mujeres y
   hombres) para: julio 2020, noviembre 2020, abril 2021, agosto 2021, mayo 2022,
   noviembre 2022, abril 2023.
4. Anclas de verificación: diciembre 2023 = 13,1% y abril 2024 = 10,4%. Si la
   línea leída no coincide en esos dos puntos, es la línea equivocada.

**Recordatorio al completarla:** la serie solo es estrictamente comparable desde
mayo de 2022. Las rondas 1 a 4 cubren un universo distinto (21 a 68 años frente a
18 y más). Los valores 2020-2021 sirven como contexto histórico, no como parte de
la serie comparable.

---

## 4. Estado consolidado de pendientes

**Cerrados**
- [x] Solicitud de transparencia por la serie FUAS: presentada.
- [x] Caída de matrícula de primer año en O'Higgins: -2,62%, con el efecto
      INACAP identificado y la advertencia de fuente.
- [x] Ley 21.091 y acompañamiento de primer año: no existe obligación.
- [x] PHQ-9 de abril de 2025, cifra OCDE, discrepancia de matrícula, serie de
      retención, persistencia con y sin beneficios (cerrados en la versión
      anterior).

**Abiertos**
- [ ] Valores 2020-2023 del Termómetro: requieren lectura visual del gráfico
      (instrucciones en la sección 3).
- [x] **Acreditación institucional**: cerrado. La progresión estudiantil SÍ es
      estándar dentro de una dimensión obligatoria (Criterio 2, Dimensión I).
      Detalle en `revision-final.md`, sección 2.
- [ ] Dato de ansiedad de la ronda 12: inconsistente entre fuentes de prensa.
- [ ] **Informe regional de la Décima ENJUV (2022)**: el informe disponible es de
      2015 y no respalda el dato regional de salud mental que se le atribuía.
      Dato en cuarentena. Ver `revision-final.md`, sección 1. Prioridad alta.
- [ ] Discrepancia O'Higgins -2,62% contra -4,9%: identificar universos.
- [ ] Respuesta de Mineduc a la solicitud FUAS: plazo de 20 días hábiles, vence
      en torno al **2 de diciembre de 2026**. Coincide con la fecha de entrega
      del proyecto, así que no conviene planificar el informe asumiendo que
      llegará antes.
- [ ] Revisar material existente que use la formulación anterior de la cadena
      causal.
- [ ] Redactar las preguntas del pulso con revisión de criterio legal (ADR 0010).

---

## 5. Fuentes nuevas

- Análisis regional de matrícula de primer año en O'Higgins (columna del rector
  del IP-CFT Santo Tomás, sede Rancagua).
  https://www.elrancaguino.cl/2026/09/25/ohiggins-registra-una-caida-en-la-matricula-de-primer-ano-pero-las-cifras-esconden-cambios-relevantes/
- Cobertura previa sobre matrícula total y de primer año en O'Higgins.
  https://www.elrancaguino.cl/2026/08/30/educacion-superior-en-ohiggins-crece-la-matricula-total-pero-cae-el-ingreso-de-estudiantes-de-primer-ano/
- Ley 21.091 sobre Educación Superior, texto completo.
  https://www.bcn.cl/leychile/navegar?idNorma=1118991
- Copia consultada del articulado.
  https://acreditacion.usm.cl/wp-content/uploads/2021/08/Ley-21.091-Sobre-Educacion-Superior.pdf
