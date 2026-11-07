# Propuesta institucional: planificación de oferta y apoyo (borrador)

Fecha: 2026-11-07 · Estado: **borrador**. Requiere la decisión del líder (@rafajaque) y revisión de asesoría legal antes de cualquier uso con una institución. · Relacionado: [ADR 0018](../decisiones/0018-producto-de-planificacion-de-oferta.md)

Este documento responde a lo que una institución de educación superior necesitaría saber antes de contratar el producto. No nombra a ninguna institución: la validación se hará con una institución a definir.

## 1. Qué recibe la institución

- **Primer año estimado** para el siguiente proceso, por carrera, sede, jornada y región, con su intervalo y su error histórico.
- **Permanencia de primer año** de esa cohorte, por tipo de institución.
- **Tendencia de retención** por carrera y jornada, descrita como tendencia de la cohorte. No se etiqueta a ningún estudiante.
- **Informe anual de comparación**: lo estimado frente a lo observado, con el error publicado.

Formato: planilla (CSV y XLSX) y un informe de 4 a 6 páginas. Cada cifra lleva fuente, URL y fecha de consulta (AGENTS.md 2.1).

## 2. Qué no hace el producto

- No entrega datos personales de estudiantes, ni de la institución ni de otras.
- No cruza variables protegidas para decidir (sexo, edad, situación socioeconómica, origen escolar, discapacidad). La proporción por sexo aparece solo como dato de planificación, nunca para seleccionar (Ley 20.609, art. 2°).
- No sirve para admitir, seleccionar ni priorizar personas (ADR 0018, límite 3).
- No ordena ni compara instituciones clientes.
- No predice el riesgo de un estudiante (eso es el ADR 0016, que no está habilitado).

## 3. Respuestas a las cuatro preguntas de la institución

**¿Ahorra tiempo o plata?**
- *Hoy:* no está demostrado. Hay que comparar con el método que la institución usa.
- *Cómo se demuestra:* tomar la última planificación de la institución (su previsión frente a la matrícula real) y comparar su error con el del producto. Si el producto no es mejor, no hay argumento económico, y eso debe decirse.
- *Falta:* la serie histórica de la institución.

**¿Sirve para lo que nos exigen?**
- *Hoy:* no hay un mapeo verificado.
- *Cómo se hace:* listar los reportes que la institución entrega al Mineduc, a la CNA y a sus programas de permanencia que dependan de matrícula de primer año o de retención. Verificar cada exigencia en la fuente oficial. Luego indicar cuáles alimenta el producto y cuáles no.
- *Estado:* trabajo de investigación pendiente. No se afirma ningún cumplimiento.

**¿Puedo auditar el método sin depender de quien lo vende?**
- *Sí, en parte, y ya existe:*
  - El registro de pronósticos es append-only, con cadena de hash SHA-256. `verificar_cadena()` comprueba que nada se alteró.
  - Los scripts están en el repositorio y las fuentes son públicas (SIES, Mineduc, DEMRE, INE). Cualquiera puede rehacer el cálculo.
- *Falta:* un instructivo para que la institución corra el método con sus propios datos sin nuestra ayuda.

**¿Qué pasa con mis datos si me voy?**
- *Por diseño:* el producto trabaja con datos públicos y solo agregados. Lo que la institución sube, si sube algo, es lo único que hay que devolver o borrar.
- *Falta:* la cláusula de salida (sección 10) y su revisión legal.

## 4. Historial verificable: calendario

La credibilidad se gana comparando con resultados reales. Las fechas de publicación son estimadas y deben verificarse en cada fuente.

| Cuándo | Qué se compara | Registro previo |
|---|---|---|
| Antes del 30-nov-2026 | Rendición PAES regular 2027 | Línea base registrada (PAES-REGULAR-2027-DEF2) |
| ene-2027 (fecha de resultados por verificar en DEMRE) | Rendidores regulares 2027 por región | Pronóstico regional registrado |
| abr–may-2027 | Cuarto medio 2027 por residencia (matrícula Mineduc) | PRIMER-ANIO… y 4TO-MEDIO-2027-RESIDENCIA registrados |
| jul-2027 (por verificar en SIES) | Primer año de pregrado 2027 | 382.725 (357.992 a 387.869), registrado |
| ago-2028 (informe de retención por verificar) | Retención de primer año de la cohorte 2027 | 296.601 (277.434 a 300.588), registrado |

Regla: cada comparación se publica tenga o no buen resultado, con el error y la cobertura del intervalo. Si el resultado es malo, se dice.

## 5. Competencia y neutralidad

Compromisos (algunos aún no implementados; se indica cuáles):

1. Solo agregados. Ninguna celda con menos de 10 estudiantes se entrega. *Implementado en el cálculo.*
2. Cada institución cliente ve solo sus cifras y las públicas. *Pendiente: requiere control de acceso por institución en la base de datos (RLS, ADR 0002).* Hasta que exista, no se ofrece acceso a más de una institución a la vez.
3. No hay ranking de clientes ni de instituciones. La condición de cliente no ordena ni destaca nada en el portal (AGENTS.md, sección 1). *Compromiso de diseño.*
4. No se venden datos ni se comparte la información de una institución con otra. *Compromiso contractual.*

## 6. Límites obligatorios (del ADR 0018)

- Intervalo visible en cada cifra, junto con el error histórico.
- Auditoría anual del uso que la institución le da al informe.
- Sin lenguaje de etiqueta sobre grupos de estudiantes ("dispuestos", "en riesgo").
- Cuando el uso contradiga la finalidad, el contrato termina.

## 7. Integración

- **Entrega inicial:** por archivo. No requiere integrar sistemas de la institución.
- **U+:** las bases de la licitación desierta de referencia pedían integración con U+ como requisito habilitante. Esa integración **no se asume**. Hay que preguntar si la institución la exige, porque cambiaría el costo y el plazo.

## 8. Precio y vía de compra

- **Rango propuesto, no decidido:** entre $11,9 y $13,7 millones de pesos anuales por institución (ADR 0018, sección de precio). El precio final lo decide el líder después de la validación.
- **Vías de contratación posibles** (a verificar con asesoría legal):
  - **a)** Licitación pública nueva. Es la vía formal para una institución estatal.
  - **b)** Trato directo, solo si existe una causal verificada en la Ley 19.886 y su reglamento.
  - **c)** Convenio de colaboración o piloto sin pago. Debe ser un convenio real y no una compra disfrazada.
- **Bases técnicas mínimas** que el producto debe poder cumplir: objeto; entregables (sección 1); método documentado y reproducible; criterios de éxito del piloto; plazo; precio unitario; soporte; auditoría anual; cláusula de salida; garantía.

## 9. Piloto: criterios de éxito

Propuesta para acordar con la institución **antes** de empezar:

- Error mediano de primer año menor o igual a 5 % a nivel de carrera y sede, con al menos 30 casos por celda. La validación 2022-2026 da 15,9 %, así que este criterio es exigente y puede no cumplirse. Si no se cumple, el piloto dice que no se cumplió.
- Cobertura del intervalo de al menos 90 % en las celdas evaluadas. Hoy no hay cobertura medida para celdas de primer año: la calibración disponible es la de los intervalos PAES (90 % a 99,7 % por par de procesos, bitácora del 2026-11-07), no la de primer año por carrera y sede.
- Al menos una decisión de capacidad documentada con la cifra del producto.
- Tiempo de planificación ahorrado, medido por la propia institución.

## 10. Salida y datos (cláusula propuesta)

- La institución sube solo datos agregados propios, si decide subir alguno.
- **Al término del contrato:**
  - exportación de las salidas en CSV dentro de 30 días;
  - borrado de los datos subidos por la institución dentro de 30 días, con constancia escrita;
  - el registro de pronósticos se conserva porque solo contiene datos públicos y agregados, sin datos personales.
- Roles frente a la Ley 21.719 (encargado o tercero): a definir con asesoría legal.

## 11. Pendientes

| Pendiente | Responsable |
|---|---|
| Decisión de precio y de vía de compra | Líder y asesoría legal |
| Revisión legal de la cláusula de salida, roles de datos y artículo 8° bis | Asesoría legal |
| Control de acceso por institución (RLS) antes de un segundo cliente | Equipo técnico |
| Mapeo de exigencias de Mineduc, CNA y permanencia | Investigación |
| Instructivo para correr el método con datos propios de la institución | Equipo de datos |
| Confirmar fechas de publicación de la sección 4 en cada fuente | Investigación |
| Institución piloto y su autorización por escrito | Líder |
