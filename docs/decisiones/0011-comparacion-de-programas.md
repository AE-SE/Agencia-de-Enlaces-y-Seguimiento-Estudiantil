# 0011 — Comparación de programas: ordenar sin rankear

Fecha: 2026-11-04 · Estado: aceptada

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
- **El orden por omisión es alfabético por institución**, nunca un indicador de desempeño: elegir cuál sería por omisión ya es una opinión.
- **Antes del orden va el filtro por región**, que es la primera pregunta real de quien decide dónde estudiar y la que más reduce el universo. Se ofrece como primer paso del listado, con las regiones como opciones visibles, y se puede omitir. La región elegida **no se guarda ni se asocia a la persona**: es un filtro de la consulta, no un dato personal almacenado (AGENTS.md 2.2, minimización).
- Se descarta ordenar por cercanía geográfica por omisión: exigiría pedir la comuna, que es un dato personal que no necesitamos, y el resultado sería menos predecible para el estudiante que un orden alfabético.

### 3. Cada cifra con su contexto

- Cada celda de empleabilidad o ingresos lleva qué mide y el año de medición, no solo el número.
- Donde los indicadores no sean comparables entre sí (años de medición distintos), se marca explícitamente.
- Una nota breve y permanente junto al listado advierte que estas cifras reflejan también de dónde vienen los estudiantes y dónde está la institución, no solo la calidad de la formación.
- Los programas sin datos suficientes se muestran con "sin datos suficientes", nunca con la celda vacía ni con un cero.

### 4. Unidad de comparación: una fila, variantes desplegables

**La fila del listado es carrera + institución.** Sede y jornada no son filas: multiplicarían filas idénticas en casi todo lo que sirve para elegir y obligarían a repetir la misma cifra de empleabilidad en varias filas como si fuera de cada sede.

**Sede y jornada se eligen navegando, no con un desplegable que actualiza en vivo.** Cada variante es una página propia; las variantes disponibles se muestran como opciones visibles y tocables (mínimo 44 × 44 px) que llevan a ella.

Se descarta el desplegable con actualización en vivo pese a ser más elegante: para una persona con poca experiencia digital es un patrón hostil. El cambio ocurre sin aviso y a veces fuera de lo que está mirando, no queda claro qué control afectó a qué, y la ausencia de recarga elimina la señal de que la acción funcionó. La navegación explícita da esa señal, hace que el botón "atrás" del teléfono se comporte como la persona espera y deja un enlace compartible por mensajería sin perder lo que estaba viendo.

**Si el programa tiene una sola sede y una sola jornada, no se muestra ningún control.** Un selector con una opción es ruido que obliga a interpretar algo que no decide nada.

Comparar la misma carrera en la misma institución entre jornadas o sedes distintas sigue siendo posible: se agregan al comparador dos variantes distintas del mismo programa.

**Dos bloques separados y etiquetados en la ficha:**

| Bloque | Contiene | Depende de la sede y jornada elegidas |
|---|---|---|
| Esta sede y jornada | Arancel, puntaje de corte, vacantes, dirección de la sede | Sí |
| Toda la carrera en esta institución | Empleabilidad, ingresos, acreditación, duración real | No |

La separación debe ser explícita, con encabezado propio y no solo por color (AGENTS.md 2.5). Sin ella, el estudiante asume que todos los números corresponden a la jornada que eligió.

**Cada indicador declara el nivel al que lo publica la fuente.** Si la empleabilidad y los ingresos vienen por carrera e institución, se indica que la cifra corresponde al programa completo y no a la sede o jornada seleccionada (AGENTS.md 2.1).

**Cada combinación de sede y jornada tiene su propia dirección web**, pre-generada (ADR 0001). La ficha funciona completa sin JavaScript: es navegación entre páginas, no una aplicación que se actualiza.

El filtro por región del listado opera sobre las sedes: una institución aparece si tiene al menos una sede en la región filtrada, y la ficha abre directamente en esa sede.

### 4.1 El comparador en pantalla angosta

El sistema visual define el comparador como columnas por programa (máximo 3) y filas por indicador. A 360 px, tres columnas de cifras obligan a desplazar horizontalmente, que es el gesto que más se pierde en usuarios con poca experiencia digital: no se nota que hay contenido fuera de la pantalla y la comparación se rompe porque los encabezados se van.

Por eso: **en pantalla angosta se muestran dos columnas, no tres.** El máximo de 3 se mantiene para pantallas anchas. La tercera opción agregada sigue guardada y el estudiante elige cuáles dos está viendo, sin desplazamiento horizontal en ningún caso.

Cada encabezado de columna identifica carrera, institución, sede y jornada, porque dos columnas pueden ser variantes del mismo programa y se verían idénticas.

### 5. Costo real estimado

Junto al arancel se muestra, cuando el estudiante haya indicado su situación, una estimación de lo que efectivamente pagaría según los beneficios a los que accede. El arancel nominal rara vez es lo que paga el estudiante, y es el dato que más cambia una decisión. Se marca como estimación, con los supuestos a la vista.

## Justificación

- La regla de neutralidad (AGENTS.md sección 1) permite ordenar por criterios explícitos y documentados y prohíbe destacar instituciones. Ordenar por una columna que el estudiante eligió cumple; un puntaje compuesto no, porque esconde una ponderación que nadie declaró.
- AGENTS.md sección 2.1 obliga a indicar qué mide cada indicador y su año, y prohíbe mezclar indicadores distintos en una misma comparación. Un comparador es precisamente donde ese riesgo se materializa.
- Separar listado y comparador no agrega desarrollo significativo: el listado es la consulta del explorador con un filtro fijo por carrera.
- Negarse al ranking no es negarse a ayudar: la ayuda real es reducir el universo a las opciones que cumplen las condiciones del estudiante y mostrarle cada cifra con lo que necesita para leerla.
- **El criterio que ordena las decisiones de interfaz de este ADR es la persona con poca experiencia digital**, que es quien más necesita el portal y quien menos margen tiene para equivocarse al usarlo. De ahí salen las tres decisiones menos obvias: navegación en vez de actualización en vivo, dos columnas en vez de tres en el teléfono, y ningún control cuando no hay nada que elegir. Lo que funciona para alguien habituado a la web no es el criterio: ese usuario se las arregla igual con el patrón simple, mientras que el inverso no es cierto.

## Consecuencias

- El esquema separa el programa (carrera + institución) de sus variantes (sede + jornada), que llevan arancel, puntaje de corte, vacantes y dirección. Si la fuente de oferta no distingue sede o jornada, queda registrado como limitación conocida y no se inventa. TODO(fuente).
- **Pendiente de verificar:** a qué nivel publica el SIES la empleabilidad y los ingresos. De eso depende la etiqueta del bloque "del programa completo", no la estructura, que ya no repite la cifra en varias filas. TODO(fuente).
- La ficha pasa de una página por programa a una por combinación de sede y jornada. Son más páginas pre-generadas, pero ninguna necesita JavaScript: es menos trabajo de interfaz que un selector en vivo, no más.
- El comparador acepta dos columnas del mismo programa con variantes distintas, lo que exige que las columnas se identifiquen por carrera, institución, sede y jornada, no solo por el nombre de la carrera.
- El comparador debe construirse mostrando dos columnas en pantalla angosta y hasta tres en pantalla ancha. El patrón del sistema visual (`mapa-de-trayecto`, "Comparador") se complementa con esta regla; conviene reflejarlo ahí cuando se implemente.
- El alcance de la semana 2 incorpora el listado filtrable y el filtro por región como primer paso.
- El "costo real estimado" depende de los datos de beneficios y de su lógica de elegibilidad, que viven en la semana 3. Si no alcanza, el listado se entrega con arancel nominal y la estimación queda para después; no se entrega una estimación sin respaldo.
- Ningún texto de interfaz puede decir "la mejor opción", "recomendada" ni equivalentes. Esto se verifica en la revisión de PR.
- Si en el futuro una institución cliente pide aparecer destacada, este ADR es la respuesta escrita: no existe el mecanismo y no se construye.
- **Pendiente de verificar:** si Datos Abiertos Mineduc distingue sede y jornada en la oferta académica (relacionado con el ADR 0009). Si no las distingue, la ficha es una sola por programa y el resto del ADR se sostiene igual.
- No se pide la comuna del estudiante para esta función. Si más adelante se quiere ordenar por cercanía, requiere un ADR propio que justifique el dato personal.
