# 0011 — Comparación de programas: ordenar sin rankear

Fecha: 2026-11-04 · Estado: propuesta

## Contexto

El MVP contempla un comparador de hasta 3 carreras lado a lado. Al revisar el caso de uso real apareció que ese no es el caso principal: quien está decidiendo rara vez compara carreras distintas entre sí, compara **la misma carrera en distintas instituciones**. "Quiero estudiar Enfermería, ¿dónde?" es la pregunta que trae a la persona al portal.

Ese caso tensiona tres cosas del proyecto a la vez:

1. **Tres columnas no alcanzan.** En Enfermería hay decenas de programas en el país. Comparar tres exige haber preseleccionado tres, y preseleccionar es justamente lo que el estudiante no sabe hacer todavía.
2. **La neutralidad (AGENTS.md sección 1).** El portal nunca ordena, destaca ni recomienda instituciones por ser clientes, y todo orden debe usar criterios explícitos y documentados. La petición "ver cuál es mejor" va directo contra esa regla si se resuelve con un puntaje compuesto.
3. **La comparabilidad de los indicadores (AGENTS.md sección 2.1).** La empleabilidad y los ingresos del SIES no son comparables de forma ingenua entre instituciones: una institución selectiva muestra mejores cifras en parte porque recibe estudiantes con más redes y capital social de entrada, y una institución en una región con mercado laboral estrecho muestra peores cifras aunque forme igual de bien. Poner las cifras lado a lado sin decirlo entrega una conclusión falsa con apariencia de dato oficial.

La unidad de comparación también está sin definir: una misma carrera en una misma institución puede dictarse en varias **sedes y jornadas**, con aranceles y puntajes de corte distintos. Esto debe fijarse en el esquema antes de cargar datos.

## Opciones evaluadas

| Opción | A favor | En contra |
|---|---|---|
| **Listado filtrable y ordenable de la misma carrera, más comparador de 3 para el detalle** | Responde la pregunta real ("¿dónde estudio esto?"); el orden lo elige el estudiante, con criterios explícitos; reutiliza la consulta del explorador con un filtro fijo, por lo que cuesta poco | Dos superficies en vez de una; exige decidir el orden por omisión, que no es neutro por sí solo |
| Solo el comparador de 3, como estaba | Ya está en el alcance; más simple | Obliga a preseleccionar; no responde el caso principal; empuja al estudiante a buscar la preselección en otro sitio |
| Puntaje compuesto o nota única por programa ("cuál es mejor") | Es lo que el usuario pide literalmente; fácil de leer | Es un ranking: viola la regla de neutralidad. La ponderación entre empleabilidad, arancel y acreditación no es un hecho sino una preferencia personal: para quien no puede endeudarse el arancel pesa más que la empleabilidad, para otro al revés. Nos haría responsables de una recomendación que no podemos justificar con fuente |
| Recomendador personalizado ("según tu perfil, te conviene X") | Diferenciador de producto | Mismo problema de ranking, agravado: requiere un modelo que no tenemos cómo validar y que quedaría expuesto a presión comercial futura |

## Decisión

### 1. Dos superficies distintas

- **Listado de la misma carrera**: filtrable por región, tipo de institución y acreditación; ordenable por cualquier indicador disponible. Es la vista que responde "¿dónde estudio esto?".
- **Comparador de hasta 3**: para el detalle de opciones que el estudiante ya preseleccionó desde el listado.

### 2. Ordenar sí, rankear no

- El estudiante elige el criterio de orden (empleabilidad, ingresos, arancel, puntaje de corte, duración). El criterio activo se muestra siempre en pantalla.
- **No se construye puntaje compuesto, nota única, ranking ni recomendación de "la mejor opción".**
- El orden por omisión es alfabético o por cercanía geográfica si el estudiante indicó su comuna: nunca por un indicador de desempeño, porque elegir ese indicador por omisión ya es una opinión.

### 3. Cada cifra con su contexto

- Cada celda de empleabilidad o ingresos lleva qué mide y el año de medición, no solo el número.
- Donde los indicadores no sean comparables entre sí (años de medición distintos), se marca explícitamente.
- Una nota breve y permanente junto al listado advierte que estas cifras reflejan también de dónde vienen los estudiantes y dónde está la institución, no solo la calidad de la formación.
- Los programas sin datos suficientes se muestran con "sin datos suficientes", nunca con la celda vacía ni con un cero.

### 4. Unidad de comparación

La fila del listado es **programa = carrera + institución + sede + jornada**. Esto se fija en el esquema antes de cargar datos.

### 5. Costo real estimado

Junto al arancel se muestra, cuando el estudiante haya indicado su situación, una estimación de lo que efectivamente pagaría según los beneficios a los que accede. El arancel nominal rara vez es lo que paga el estudiante, y es el dato que más cambia una decisión. Se marca como estimación, con los supuestos a la vista.

## Justificación

- La regla de neutralidad (AGENTS.md sección 1) permite ordenar por criterios explícitos y documentados y prohíbe destacar instituciones. Ordenar por una columna que el estudiante eligió cumple; un puntaje compuesto no, porque esconde una ponderación que nadie declaró.
- AGENTS.md sección 2.1 obliga a indicar qué mide cada indicador y su año, y prohíbe mezclar indicadores distintos en una misma comparación. Un comparador es precisamente donde ese riesgo se materializa.
- Separar listado y comparador no agrega desarrollo significativo: el listado es la consulta del explorador con un filtro fijo por carrera.
- Negarse al ranking no es negarse a ayudar: la ayuda real es reducir el universo a las opciones que cumplen las condiciones del estudiante y mostrarle cada cifra con lo que necesita para leerla.

## Consecuencias

- El esquema debe incluir sede y jornada como parte de la identidad del programa. Si la fuente de oferta no distingue sede, queda registrado como limitación conocida y no se inventa. TODO(fuente).
- El alcance de la semana 2 incorpora el listado filtrable. El comparador de 3 se mantiene.
- El "costo real estimado" depende de los datos de beneficios y de su lógica de elegibilidad, que viven en la semana 3. Si no alcanza, el listado se entrega con arancel nominal y la estimación queda para después; no se entrega una estimación sin respaldo.
- Ningún texto de interfaz puede decir "la mejor opción", "recomendada" ni equivalentes. Esto se verifica en la revisión de PR.
- Si en el futuro una institución cliente pide aparecer destacada, este ADR es la respuesta escrita: no existe el mecanismo y no se construye.
- **Pendiente de verificar:** si Datos Abiertos Mineduc distingue sede y jornada en la oferta académica (relacionado con el ADR 0009).
- **Pendiente de decidir (líder):** el orden por omisión entre alfabético y cercanía geográfica, que depende de si pediremos la comuna del estudiante y de la minimización de datos (AGENTS.md 2.2).
