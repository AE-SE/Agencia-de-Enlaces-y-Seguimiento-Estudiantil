# Protocolo para revisar los PR de Cristóbal y Alejandro

> Este protocolo es para quien revisa (Claude y el líder) y para quien abre el PR (Cristóbal y Alejandro). No cambia ninguna regla de `AGENTS.md`: si algo aquí contradice ese archivo, gana `AGENTS.md`.

Fecha de esta versión: 2026-11-13 (alineada con el giro del ADR 0032 y con `docs/plan.md`: ver la sección 2.1).

---

## Cómo leer este protocolo

Está escrito para que cualquier persona del equipo lo entienda sin conocimientos técnicos. Hay cuatro partes:

1. **Antes de abrir el PR** (para Cristóbal y Alejandro): qué revisar tú antes de pedir revisión.
2. **Cuando llega un PR** (para quien revisa): en qué orden mirar cada cosa.
3. **Qué decir al final**: los tres veredictos y cómo se confirma el cambio.
4. **Lo que más se rechaza**: errores comunes y cómo evitarlos.

El flujo completo de un cambio (fork, rama, PR, revisión, fusión) está en [`docs/equipo/README.md`](equipo/README.md). Aquí solo está lo que hace falta para revisar bien.

---

## 1. Antes de abrir el PR (para quien escribe)

Haz esto antes de avisar en el grupo. Un PR que llega incompleto se devuelve, y eso cuesta un día.

**Si eres Cristóbal (datos y contenido):**
- [ ] La tarea cumple **todos** sus criterios de aceptación, no solo algunos.
- [ ] Cada dato nuevo tiene fuente oficial, URL, período y fecha de consulta.
- [ ] No hay archivos originales (`datos/crudos/`) ni datos personales en el PR.
- [ ] Un valor que falta queda vacío con su motivo. Nunca como 0.
- [ ] Los scripts se pueden repetir y tienen pruebas.
- [ ] Si usaste una fuente nueva, `docs/fuentes.md` y `datos/registro_descargas.md` están actualizados.
- [ ] La plantilla del PR está completa, incluida la sección de IA que usaste.
- [ ] Leíste y entiendes todo el código, también el que escribió tu IA.

**Si eres Alejandro (interfaz y diseño):**
- [ ] La tarea cumple todos sus criterios de aceptación.
- [ ] `npm run build`, `npm run lint` y `python3 scripts/tokens.py --check` pasan.
- [ ] Lo probaste a 360 px de ancho, solo con teclado y en modo oscuro.
- [ ] No escribiste colores, tamaños ni espacios a mano: solo las variables de diseño.
- [ ] Los textos de los botones dicen qué pasa al tocarlos, y están revisados con la skill `lenguaje-claro` o con Cristóbal.
- [ ] Hay capturas de pantalla en el PR (teléfono y computador).
- [ ] La plantilla del PR está completa, incluida la sección de IA.
- [ ] Leíste y entiendes todo el código, también el que escribió tu IA.

**Para los dos:**
- Un PR es **una sola cosa**. Si supera unas 400 líneas cambiadas, se divide.
- Cada PR nuevo sale de `main` actualizado, en una rama con el nombre correcto (`feat/…`, `fix/…`, `docs/…` o `datos/…`).

---

## 2. Cuando llega un PR (para quien revisa)

Revisa en este orden. Si encuentras algo grave en un paso, puedes parar y pedir cambios antes de seguir.

**Paso 1. Entender el cambio.**
- Lee el título, la descripción y la plantilla. ¿Se entiende qué cambia y por qué?
- ¿Es una sola cosa? Si mezcla dos temas, pedir que se separe.
- ¿Tiene más de 400 líneas cambiadas? Pedir que se divida, salvo que haya una razón clara.

**Paso 2. Datos personales y seguridad (si falla, es crítico).**
- ¿Agrega datos personales sin justificación?
- ¿Hay claves, contraseñas o archivos `.env`?
- ¿Hay datos personales en URL, en registros de errores o en la analítica? ¿La meta o las preferencias salen del dispositivo?
- ¿Hay una tabla nueva sin reglas de acceso (RLS)?

**Paso 3. Datos oficiales (si falla, es alto).**
- ¿Cada dato nuevo tiene fuente oficial, URL, período y fecha?
- ¿Se publica algo que no está verificado en una fuente oficial? Si no se puede verificar, no se publica.
- ¿Un valor que falta se convirtió en 0? Eso es falso y se rechaza.
- ¿Se mezclan períodos o indicadores distintos en una misma comparación?

**Paso 3b. Alcance y promesas (si falla, es alto).**
- ¿El cambio construye algo fuera del alcance del 19 de diciembre (permanencia, pulso de check-in, predicción o riesgo de deserción, cuenta con correo, asistente, simulación de beneficios, cuestionario vocacional, noticias, panel o código dirigido a colegios)? Pedir que se retire o que lo apruebe el líder con un ADR.
- ¿Un texto de pantalla o de documento promete predecir, etiqueta a una persona como «en riesgo», dice que la gente no ingresa *por* desinformación o que quedar fuera *causa* problemas de salud mental? Se rechaza (AGENTS.md, sección 1 y 2.4).
- ¿Una cifra calculada por el equipo se presenta como dato del organismo? Debe decir «elaboración propia» y cómo se calculó.
- ¿Una cita o dato viene de prensa, un blog o un resumen de terceros? Solo se aceptan fuentes oficiales, primarias o académicas.

**Paso 4. Neutralidad (si falla, es alto).**
- ¿Algún orden o destaque favorece a una institución cliente? El sitio nunca ordena, destaca ni recomienda por ser cliente. Solo por criterios explícitos y documentados.

**Paso 5. Diseño (si falla, es medio).**
- ¿Hay colores, tamaños o espacios escritos a mano? Solo se usan las variables de diseño.
- ¿Hay información que se entiende solo por color?
- ¿Los botones miden al menos 44 píxeles?
- ¿El foco del teclado se ve?

**Paso 6. Lenguaje (si falla, es medio).**
- ¿Hay siglas sin explicar la primera vez?
- ¿Los botones tienen verbo y dicen qué pasa?
- ¿Los mensajes de error dicen cómo arreglar el problema?

**Paso 7. Calidad (si falla, es medio o menor).**
- ¿La lógica nueva tiene pruebas?
- ¿Una dependencia nueva está justificada, con licencia compatible (MIT, Apache-2.0 o BSD)?
- ¿Las pruebas de la CI pasan?

**Paso 8. Plantilla.**
- ¿Está completa, incluida la sección de IA utilizada?

**Paso 9. Escribir el informe.** Ver la sección 3.

### 2.1 Qué se mira con más cuidado hasta el 19 de diciembre

Cada PR se relaciona con una fila de la Tabla 3.10 del entregable. Si no corresponde a ninguna, se pregunta por qué existe.

| Entregable | Qué mirar antes de aprobar |
|---|---|
| Datos de las comparaciones y vista de carrera (N1, N2, N9; OE1, 27 nov) | Fuente, enlace, fecha y qué mide en cada dato; cifras calculadas rotuladas «elaboración propia»; ningún 0 falso; sin mezclar indicadores ni períodos; postulaciones del DEMRE solo si se documentó que se pueden mostrar |
| Cálculo del puntaje ponderado (27 nov) | Casos verificados contra el documento oficial; ponderaciones desde los datos |
| Criterio de alternativas, meta y preferencias (N6, N10; OE3, 27 nov) | Función pura con pruebas; el criterio (área, región, puntaje) es explícito y la condición de cliente no entra; la meta se guarda solo en el dispositivo, sin cuenta |
| Calendario, preguntas frecuentes y «Quiénes somos» (N3, N4, N7, N11) | Cada plazo y cada respuesta con fuente y fecha de vigencia; fechas no publicadas en `null`, nunca estimadas; sin promesas ni siglas sin explicar |
| Medición con personas (N13, N15; 30 nov al 4 dic) | Sin nombres ni datos identificables; «P1…P10»; consentimiento fuera del repositorio; protocolo ante señal de riesgo (`docs/pruebas-usuarios.md`) |

---

## 3. Qué decir al final

El informe tiene siempre el mismo orden:

1. **Veredicto en una línea:** se puede aprobar, requiere cambios, o se rechaza.
2. **Hallazgos por gravedad:** Crítico, Alto, Medio y Menor. Cada uno con el archivo y la línea, qué pasa, por qué importa y el arreglo mínimo.
3. **Lo que está bien:** solo si conviene decirlo para conservarlo.

**Regla que no se negocia:** si hay dudas sobre un punto Crítico o Alto, **no se aprueba**. Se pregunta en el PR.

**Confirmación y fusión:**
1. Quien revisa entrega el informe al líder.
2. El líder confirma el informe o pide cambios.
3. Con la confirmación, el PR se fusiona a `main` como un solo commit.
4. Quien escribió el PR no fusiona su propio PR.

**Tiempos:** si el autor avisa antes de las 20:00, la revisión está el mismo día.

---

## 4. Lo que más se rechaza

| Quién | Error | Por qué se rechaza | Cómo evitarlo |
|---|---|---|---|
| Cristóbal | Dato copiado de un diario o de una calculadora de terceros | No es fuente oficial | Buscar el documento oficial y citarlo |
| Cristóbal | Valor que falta guardado como 0 | Es información falsa | Dejarlo vacío con su motivo |
| Cristóbal | Fórmula escrita de memoria o por la IA | Puede estar mal y nadie lo notaría | Copiarla del documento oficial y citarlo |
| Cristóbal | Ponderaciones escritas en el código | Cambian cada año | Leerlas de los datos oficiales |
| Cristóbal | Excel abierto y guardado de nuevo | Borra los ceros de los códigos | Leer siempre el archivo original con un script |
| Cristóbal | Cifra calculada por el equipo presentada como dato oficial | Atribuye al organismo algo que no publicó | «Elaboración propia» y método |
| Cristóbal | Nombres reales en la medición con personas | Privacidad | «P1», «P2» |
| Cristóbal | Fuente que no es oficial, primaria o académica (prensa, blogs) | No es verificable | Buscar el documento original |
| Alejandro | Etiqueta «en riesgo», promesa de predicción o de resultados que no se midieron | Estigma y promesa sin respaldo | Decir solo lo medido y con su fuente |
| Alejandro | Color escrito a mano, como `color: #333` | Rompe el sistema de diseño y el modo oscuro | Usar solo las variables de color |
| Alejandro | Ícono sin texto | Es ambiguo para muchas personas | Ícono con su palabra |
| Alejandro | `outline: none` | Quien usa el teclado se pierde | Dejar el foco visible |
| Alejandro | Botón que dice «Continuar» o «Aceptar» | No dice qué pasa al tocarlo | Verbo y resultado |
| Alejandro | Mostrar 0 cuando no hay dato | Es información falsa | «Sin datos suficientes» |
| Alejandro | Librería nueva sin justificar | Peso, seguridad y licencias | Justificarla en el PR o no usarla |

---

## 5. Ejemplos de cómo quedaría un informe

> Son ejemplos inventados para mostrar el formato. No describen PR reales ni sus líneas.

**Ejemplo sin problemas graves:**

> **Veredicto:** se puede aprobar tras corregir dos Medios.
> **Medio:** la tabla nueva no tiene prueba automática (`tablero.js`, línea 120). Arreglo: mover el filtro a `filtros.js` y probarlo.
> **Lo que está bien:** las cifras no cambian y el PR tiene 120 líneas.

**Ejemplo con un Alto:**

> **Veredicto:** requiere cambios.
> **Alto:** la cifra nueva en la columna de entrantes no tiene fuente ni fecha (`index.html`, línea 88). Arreglo: agregar el pie de fuente con la URL y la fecha de consulta.
> Hasta que esto se resuelva, el PR no se aprueba.

---

## 6. Dudas y costos

- **Minutos de Actions:** hasta el 1 de diciembre de 2026 el plan está casi agotado. Los PR que solo cambian documentación (`docs/` o archivos `.md`) no corren la CI, desde el PR #130. Los que cambian código sí la corren completa.
- **Entrega final:** 19 de diciembre de 2026. Todo lo que se mide con personas debe estar fusionado y publicado el martes 1 de diciembre (congelamiento de funciones el viernes 27 de noviembre; la medición es del 30 de noviembre al 4 de diciembre). Último PR de código: martes 15 de diciembre; el jueves 17 no se fusiona código.
- **Si tienes una duda,** pregunta en el grupo antes de inventar. Una pregunta de un minuto evita un PR rechazado.
- **Si tu IA propone algo que contradice `AGENTS.md`,** gana `AGENTS.md`.

---

## 7. Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Reglas del proyecto | `AGENTS.md` |
| Flujo completo de un cambio | `docs/equipo/README.md` |
| Guía de Cristóbal | `docs/equipo/guia-cristobal.md` |
| Guía de Alejandro | `docs/equipo/guia-alejandro.md` |
| Guía de Rafael y reparto | `docs/equipo/guia-rafael.md`, `docs/equipo/reparto.md` |
| Plan, calendario y tareas N1 a N16 | `docs/plan.md` |
| Protocolo de la medición con personas | `docs/pruebas-usuarios.md` |
| Entregable (Tablas 3.7, 3.8 y 3.10) | `docs/entregable/Entregable_Parte_I.md` |
| Pauta de revisión | `.claude/skills/revisar-pr/SKILL.md` |
| Plantilla del PR | `.github/pull_request_template.md` |
| Fuentes y registro de descargas | `docs/fuentes.md` y `datos/registro_descargas.md` |
