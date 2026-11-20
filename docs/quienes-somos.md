# Texto de «Quiénes somos» (N7)

Borrador del 19 de noviembre de 2026. Lo escribe Rafael (N7). Lo revisa Cristóbal con `lenguaje-claro` y Alejandro lo pone en la página (N11, miércoles 25 de noviembre). Lo que va entre las líneas de «Texto de la página» se copia tal cual; las notas del final no se publican.

---

## Texto de la página

### Qué es la Agencia

La Agencia de Enlace y Seguimiento Estudiantil reúne en un solo lugar la información oficial de las carreras de educación superior en Chile. La explicamos y la dejamos lista para comparar.

Aquí puedes buscar una carrera, compararla con otras, simular tu puntaje y fijar una meta. Cada cifra dice qué mide, de qué organismo viene y en qué fecha la consultamos. Si una cifra la calculamos nosotros, lo decimos: «elaboración propia».

Es gratis, no pide cuenta y no tiene avisos.

Somos independientes. Ninguna universidad, instituto profesional ni centro de formación técnica paga por aparecer, por salir primero o por recibir un trato distinto. Cuando ordenamos carreras, te decimos con qué criterio.

### Quiénes la hacemos

Somos tres estudiantes de Ingeniería de Ejecución en Informática, mención Desarrollo de Sistemas, de AIEP, sede San Fernando:

- **Rafael Jaque**: arquitectura del sitio y cuidado de los datos.
- **Alejandro Tapia**: pantallas y pruebas con personas.
- **Cristóbal Rojas**: datos oficiales y contenido.

Hoy la Agencia es nuestro proyecto de título, que entregamos el 19 de diciembre de 2026. Todavía no es una empresa. En 2027 queremos formar una sociedad por acciones (SpA). Sus estatutos dirán que el sitio es gratis para ti y que nadie puede comprar un lugar en él.

### Por qué la hicimos

Casi una de cada dos personas que terminan 4.º medio no entra a la educación superior al año siguiente. De las 276.509 que egresaron en 2025, 139.272 ingresaron en 2026 (50,4 %). Las otras 137.237 (49,6 %) no lo hicieron.

Fuente: Servicio de Información de Educación Superior (SIES), [Informe de Acceso a la Educación Superior en Chile 2026](https://www.mifuturo.cl/wp-content/uploads/2026/10/Informe-de-Acceso-a-la-Educaci%C3%B3n-Superior.pdf), Tabla 1, página 8. Consultado el 13 de noviembre de 2026. Las 137.237 personas y el 49,6 % son elaboración propia: la resta entre quienes egresaron y quienes ingresaron.

Hay muchas razones para no entrar, y no sabemos cuántas tienen que ver con la información. Lo que sí sabemos es que, para decidir qué estudiar y dónde, hay que reunir datos que publican organismos distintos: el Departamento de Evaluación, Medición y Registro Educacional (DEMRE), el SIES, el Ministerio de Educación (Mineduc) y la Comisión Nacional de Acreditación (CNA). Hay que entender qué mide cada uno. Y muchas veces se hace después de egresar, sin nadie a cargo de orientarte.

Queremos que ese trabajo te tome menos tiempo. Lo estamos midiendo con personas reales antes de decir que lo logramos.

### Cómo tratamos tus datos

- Usas todo el sitio sin cuenta. No te pedimos tu nombre, tu RUT, tu edad, tu correo ni tu teléfono.
- Tu meta y tus preferencias se guardan solo en tu teléfono o computador. No salen de ahí y nosotros no las vemos. Si borras los datos del navegador, se pierden.
- Puedes borrarlas cuando quieras con el botón «Borrar mis datos de este dispositivo».
- Cuando simulas tu puntaje, el cálculo se hace en tu dispositivo. Tus puntajes no se envían ni se guardan.
- No vendemos datos.

### Lo que la Agencia no hace

- No te asegura un cupo ni un beneficio. Eso lo deciden las instituciones y el Estado.
- No te dice qué estudiar. Te muestra la información para que decidas tú.
- No reemplaza a una orientadora o un orientador.

---

## Notas para la revisión (no se publican)

1. **Nombres completos del equipo.** Confirmar con Alejandro y Cristóbal que aceptan aparecer con nombre y apellido. Si no, se usa solo el nombre de pila.
2. **La cifra del SIES** tiene una sola lectura: según `docs/fuentes.md`, «falta una segunda lectura». Hay que confirmarla contra la Tabla 1 del informe antes de publicar.
3. **El botón «Borrar mis datos de este dispositivo»** todavía no existe: llega con N10. Si N10 no está fusionado cuando se publique esta página, se quita esa línea.
4. **«No salen de ahí y nosotros no las vemos»** depende de cómo quede N10 (almacenamiento local, sin analítica sobre la meta). Revisarlo al fusionar N10.
5. **Simulador**: comprobado el 19 de noviembre en `app/(portal)/simulador/`. La dirección solo lleva el código de la carrera y la búsqueda; los puntajes no salen del navegador.
6. **Límites que este texto respeta** (AGENTS.md, sección 1): no dice que la gente no entra *por* desinformación («no sabemos cuántas tienen que ver con la información»), no promete resultados («lo estamos midiendo antes de decir que lo logramos») y no presenta la SpA como si ya existiera.
7. **Siglas**: cada una se explica la primera vez que aparece en la página.
