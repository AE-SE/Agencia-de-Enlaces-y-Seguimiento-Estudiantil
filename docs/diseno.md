# Sistema de diseño · "Mapa de trayecto"

> Regla de este proyecto: **ningún elemento visual existe porque "se ve bonito"**. Cada color, letra, espacio y borde responde a una de estas cuatro razones, y aquí queda escrita cuál:
>
> 1. **Accesibilidad medible** (WCAG 2.2, daltonismo, legibilidad).
> 2. **Comprensión** (que una persona sin ayuda entienda qué hacer).
> 3. **Rendimiento** (teléfonos básicos, datos móviles limitados).
> 4. **Identidad** (el concepto propio y el logo de la agencia).
>
> Si una propuesta no puede justificarse con una de las cuatro, no entra.

Fuente de verdad de los valores: [`diseno/tokens.json`](../diseno/tokens.json). El CSS se genera y verifica con `python3 scripts/tokens.py`.

---

## 1. La idea central

**La trayectoria del estudiante es una línea de transporte con estaciones.**

La señalética del transporte público está hecha para que cualquier persona, sin importar su edad, escolaridad o de dónde venga, sepa dónde está, hacia dónde va y qué viene después, sin preguntarle a nadie. Ese es exactamente nuestro problema: que una persona de Santiago y una de un sector rural entiendan lo mismo, igual de rápido.

De la idea salen reglas concretas:

| Elemento del metro | En la plataforma | Razón |
|---|---|---|
| Línea continua | Barra vertical de 4 px que recorre el flujo del estudiante | Comprensión: muestra progreso y orden sin leer |
| Estaciones | Las 4 etapas: **Explorar → Postular → Llegar → Avanzar** | Comprensión: el estudiante siempre sabe en qué etapa está |
| "Usted está aquí" | Estación actual marcada en el encabezado de cada página | Comprensión: orientación inmediata |
| Letreros con una sola instrucción | Una acción principal por pantalla | Comprensión: menos decisiones, menos abandono |
| Placas de señalética | Esquinas de 4 px, bordes nítidos | Identidad (ver sección 5) |

La idea también encaja con el logo: un **enlace** (la conexión, nuestro nombre) y una **flecha** (avanzar). El enlace se traduce en la *línea*; la flecha, en la *acción*.

---

## 2. Color

### 2.1 Por qué NO partimos de la "psicología del color"

Sería fácil escribir "el azul transmite confianza". No lo hacemos porque la evidencia no lo sostiene con la solidez que exige este proyecto: una revisión de Andrew Elliot en *Frontiers in Psychology* (2015) concluye que la investigación sobre color y funcionamiento psicológico está en una etapa incipiente y recomienda prudencia al aplicarla al mundo real. Usar esas afirmaciones como justificación sería justamente lo que queremos evitar: decidir por intuición disfrazada de ciencia.

Nuestras razones para el color son verificables: **contraste medido**, **distinción para personas con daltonismo** y **coherencia con el logo**.

### 2.2 Base: paleta de Diseño Universal del Color (Okabe e Ito)

Masataka Okabe y Kei Ito propusieron una paleta pensada para que la distingan personas con todos los tipos de visión del color. El daltonismo rojo-verde afecta a cerca del 8% de los hombres de origen europeo y al 5% de los de origen asiático, según su guía. Nuestros tonos principales salen de esa paleta:

| Token | Valor (claro) | Tono de origen | Uso |
|---|---|---|---|
| `linea` | `#0072B2` | Azul Okabe-Ito | La línea de trayecto, encabezados de estación, botón secundario |
| `accion` | `#E69F00` | Naranja Okabe-Ito | Botón de la acción principal (la "flecha") |
| `alerta` | `#D55E00` | Bermellón Okabe-Ito | Errores, plazos que vencen |
| `exito` | `#009E73` | Verde azulado Okabe-Ito | Confirmaciones, requisito cumplido |
| `estacion-avanzar` | `#CC79A7` | Púrpura rojizo Okabe-Ito | Estación 4 |

**Azul + naranja** es la pareja central porque: (a) coincide con el logo (enlace azul, flecha naranja); (b) es un par cálido-frío que la guía de Okabe e Ito recomienda alternar; (c) se distingue con los tipos de daltonismo más comunes.

**Error en bermellón y no en rojo puro:** la guía desaconseja el rojo frente al verde para personas con daltonismo; el bermellón se distingue mejor del verde azulado de éxito.

### 2.3 Variantes "texto": el mismo tono, oscurecido para leerse

Varios tonos Okabe-Ito no alcanzan el contraste mínimo de WCAG para texto (4,5:1) sobre fondo claro. Por eso cada uno tiene una variante más oscura **solo para texto**:

| Color | Como relleno | Como texto sobre `fondo` |
|---|---|---|
| Azul `linea` | 4,85:1 ✓ | usar `linea-texto` `#005A8C` → 6,92:1 |
| Naranja `accion` | 2,11:1 ✗ como texto | usar `accion-texto` `#8A5A00` → 5,55:1 |
| Bermellón `alerta` | 3,62:1 (vale para íconos y bordes) | usar `alerta-texto` `#A84A00` → 5,39:1 |
| Verde `exito` | 3,20:1 (vale para íconos y bordes) | usar `exito-texto` `#00785A` → 5,13:1 |

Regla práctica: **un color de marca nunca se usa como texto; se usa su variante `-texto`.**

### 2.4 Neutros con temperatura

| Token | Valor | Razón |
|---|---|---|
| `fondo` | `#FAF7F2` (papel) | Un blanco levemente cálido. Razón de identidad: evoca papel impreso y separa la plataforma del blanco puro de los portales genéricos. No atribuimos efectos sobre la fatiga visual porque no los podemos respaldar. |
| `superficie` | `#FFFFFF` | Tarjetas y formularios: se distinguen del fondo sin necesitar sombras. |
| `texto` | `#1C1B19` (tinta) | 16,11:1 sobre `fondo`. Negro cálido coherente con el papel. |
| `texto-suave` | `#5E5A53` | 6,42:1: texto secundario que sigue cumpliendo AA con margen. |
| `borde` | `#8F887D` | 3,28:1: cumple el 3:1 que WCAG 1.4.11 exige a los bordes de componentes. |

### 2.5 Modo oscuro

Se activa según la preferencia del sistema operativo y puede forzarse con `data-tema`. Los tonos se aclaran para mantener contraste; todos los pares están verificados en ambos modos (36 de 36 cumplen; ver `python3 scripts/tokens.py --check`). Razón: accesibilidad (personas con fotofobia o baja visión) y respeto por la configuración del usuario.

### 2.6 Reglas de uso

- **Nunca solo color para transmitir información** (WCAG 1.4.1 y regla 2 de Okabe-Ito). Cada estación lleva color **+ número + nombre**; cada estado lleva color **+ ícono + palabra**.
- **El naranja se gasta poco:** una sola acción principal por pantalla. Si todo es naranja, nada lo es.
- **Sin degradados ni sombras decorativas:** no aportan información, cuestan rendimiento en equipos básicos y son una señal de plantilla genérica.

---

## 3. Tipografía

### 3.1 Familia: Atkinson Hyperlegible Next + Atkinson Hyperlegible Mono

| Uso | Familia | Razón |
|---|---|---|
| Todo el texto | **Atkinson Hyperlegible Next** | Diseñada por el Braille Institute para lectores con baja visión: diferencia formas que suelen confundirse (l, I, 1; O, 0; b, d). Si funciona para baja visión, funciona para todos. |
| Cifras: puntajes, montos, porcentajes | **Atkinson Hyperlegible Mono** | Dígitos de ancho fijo: las columnas de puntajes y aranceles se alinean y se comparan de un vistazo. Es la misma familia, así que se ve coherente. |

**Por qué solo una familia (con su versión mono):** cada familia extra es una descarga más. En un teléfono con datos limitados, cada kilobyte cuenta (razón de rendimiento).

**Fuentes alojadas por nosotros, no cargadas desde Google Fonts:** el navegador del estudiante no le avisa a un tercero que visitó el sitio (privacidad) y no depende de otra conexión (rendimiento). Verificar la licencia (archivo `OFL.txt`) al descargar los archivos.

Pendiente de verificar antes de publicar: que ambas familias incluyan todos los caracteres del español (ñ, á, é, í, ó, ú, ü, ¿, ¡). Prueba: página `/prueba-tipografia` con todos ellos.

### 3.2 Tamaños

| Decisión | Valor | Razón |
|---|---|---|
| Tamaño base | `1rem` (16 px por defecto) | Se expresa en `rem` para respetar el tamaño de letra que la persona configuró en su teléfono (WCAG 1.4.4: el texto debe poder ampliarse al 200%). En campos de formulario, menos de 16 px hace que iPhone haga zoom automático. |
| Escala | razón 1,25 (tercera mayor) | Una escala moderada: los títulos se distinguen del cuerpo sin desbordar pantallas de 360 px. |
| Interlineado del texto | 1,5 | Coincide con el espaciado que WCAG 1.4.12 exige que el texto soporte sin romperse. |
| Interlineado de títulos | 1,2 | Los títulos son cortos; más espacio separaría líneas que deben leerse como una unidad. |
| Largo de línea máximo | 68 caracteres | Dentro del rango de 45 a 75 caracteres que la tipografía editorial (Bringhurst) considera cómodo para leer. |
| Pesos | 400 y 700 | Dos pesos bastan para jerarquía; cada peso extra es otra descarga. |

---

## 4. Espacio y tamaño de toque

| Decisión | Valor | Razón |
|---|---|---|
| Unidad base | 4 px, escala 4·8·12·16·24·32·48·64 | Un solo sistema evita decisiones arbitrarias ("¿13 o 15 px?") y mantiene alineación. |
| Objetivo táctil mínimo | **44 × 44 px** | WCAG 2.2 exige 24 px como mínimo (2.5.8, AA) y recomienda 44 px (2.5.5, AAA). Elegimos 44: pantallas pequeñas, dedos en movimiento, personas con temblor. |
| Anillo de foco | 3 px, color `foco` | Quien navega con teclado o lector de pantalla siempre ve dónde está. Contraste ≥ 3:1. |

---

## 5. Forma

| Decisión | Valor | Razón |
|---|---|---|
| Radio de esquinas | 4 px | Identidad: las placas de señalética son rectángulos de esquinas casi rectas. También diferencia la plataforma del estilo genérico de esquinas muy redondeadas. Es una razón de identidad, no de usabilidad, y así se declara. |
| Borde de componentes | 1 px `borde` | Separa sin sombras; cumple 3:1. |
| Línea de trayecto | 4 px `linea` | Debe verse como una línea de metro: gruesa y continua. |
| Sombras | Ninguna, salvo menús flotantes | No aportan información y cuestan rendimiento. |

---

## 6. Íconos

- **Librería:** Lucide (licencia ISC, permite uso comercial). Una sola librería = estilo consistente.
- **Siempre con texto al lado.** Un ícono solo es ambiguo: la lupa puede ser "buscar" o "ampliar". Excepción: botón de cerrar, con `aria-label`.
- Tamaño 20 o 24 px, trazo de 2 px, dentro de un objetivo táctil de 44 px.
- Prohibidos: emojis como íconos o viñetas.

---

## 7. Movimiento

- Duraciones de 150 y 220 ms: lo suficiente para entender qué cambió, sin hacer esperar.
- Solo para explicar un cambio (algo aparece, se abre, avanza la línea). Nunca decorativo.
- Con `prefers-reduced-motion`, las duraciones pasan a 0 (WCAG 2.3.3). Ya está en `tokens.css`.

---

## 8. Escritura (también es diseño)

- **Tuteo, español de Chile, frases cortas** (menos de 20 palabras cuando se pueda).
- **Siglas explicadas la primera vez:** "Formulario Único de Acreditación Socioeconómica (FUAS)".
- **Botones con verbo y resultado:** "Comparar carreras", no "Continuar" ni "Enviar".
- **Errores que dicen qué pasó y cómo arreglarlo:** "Falta tu puntaje de Matemática 1. Escríbelo para calcular", no "Error de validación".
- **Nunca culpar ni etiquetar** al estudiante (AGENTS.md, sección 2.4).

---

## 9. Pendientes

- [ ] Obtener los valores exactos del logo y compararlos con `linea` y `accion`. Si difieren, decidir en un ADR si se ajusta el logo o se ajustan los tokens (verificando contraste de nuevo).
- [ ] Verificar cobertura de caracteres del español en ambas familias.
- [ ] Probar la paleta con al menos una persona con daltonismo (recomendación de Okabe e Ito: los simuladores son solo aproximaciones).
- [ ] Prueba con 5 usuarios reales, al menos uno de zona rural.

---

## Fuentes

- Okabe, M. e Ito, K. *Color Universal Design: How to make figures and presentations that are friendly to colorblind people.* https://jfly.uni-koeln.de/color/
- Valores hexadecimales de la paleta Okabe-Ito (documentación del paquete `see`, R): https://rdrr.io/cran/see/man/palette_okabeito.html
- Elliot, A. J. (2015). *Color and psychological functioning: a review of theoretical and empirical work.* Frontiers in Psychology, 6. https://doi.org/10.3389/fpsyg.2015.00368
- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2.* https://www.w3.org/TR/WCAG22/ — criterios 1.4.1, 1.4.3, 1.4.4, 1.4.11, 1.4.12, 2.3.3, 2.5.5, 2.5.8.
- Braille Institute. *Atkinson Hyperlegible Next y Mono.* https://www.brailleinstitute.org/freefont/ · reseña: https://christiantietze.de/posts/2025/02/atkinson-hyperlegible-font-next-mono/
- Bringhurst, R. *The Elements of Typographic Style* (largo de línea de 45–75 caracteres).
- Lucide. https://lucide.dev (licencia ISC).
