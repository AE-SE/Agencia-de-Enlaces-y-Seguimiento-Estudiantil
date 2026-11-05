# Componentes base · A3

La guía viva está en `/componentes`. Sus opciones permiten cambiar el tema,
ampliar el texto al 200% y recorrer las cuatro estaciones sin guardar preferencias.
Al salir se restaura el tema y el tamaño de texto anteriores.

| Componente | Uso y reglas |
| --- | --- |
| `Boton` | `variante="principal"` o `"secundario"`. Por defecto es `type="button"`; usar `type="submit"` en formularios. `disabled` agrega texto «No disponible» y conserva el contraste legible. Una acción principal por pantalla. |
| `Enlace` | `href` relativo para navegación interna. Las direcciones HTTP/HTTPS se abren en otra pestaña, con ícono Lucide, aviso para lectores de pantalla y `noopener noreferrer`. Siempre subrayado. |
| `Encabezado` | Recibe `estacionActual` y una lista de `navegacion` con `href` y `texto`. Usa el logo correspondiente al tema y contiene el indicador. |
| `IndicadorEstacion` | `actual` es 1, 2, 3 o 4. Número, nombre y color siempre presentes; la actual usa `aria-current="step"` y «Estás aquí». Es una lista de etapas, sin enlaces a páginas que todavía no existen. |
| `DatoOficial` | Con `valor` presente exige medida, período y fuente con nombre, URL y fecha. Con `valor={null}` exige un motivo. Un cero real se conserva; la ausencia de datos nunca se convierte en cero. |
| `Aviso` | `tipo="exito"`, `"error"` o `"plazo"`, título y explicación. Ícono, palabra y color. `anunciar` activa `status` o `alert` para cambios dinámicos; evitarlo en ejemplos estáticos al cargar una página. |
| `PiePagina` | Recibe destinos de privacidad, fuentes y contacto. El consumidor debe proporcionar rutas reales. En la guía apuntan a secciones de la misma página. |

Los estilos están en `app/_componentes/componentes.module.css`. Solo se usan los
tokens existentes. Las estaciones se distribuyen en cuatro columnas flexibles;
sus nombres y etiquetas pueden pasar de línea con texto ampliado. Los controles
tienen objetivo táctil mínimo de 44 px, anillo de foco y estados legibles en ambos temas.
Los íconos son decorativos para el lector de pantalla y siempre acompañan texto.

Dependencia solicitada por A3: `lucide-react` 1.68.0, licencia ISC. Se importan
solamente los íconos usados; no se cargan íconos desde servidores externos.

La cifra del ejemplo corresponde al criterio 2.5.5 de WCAG 2.2, nivel AAA,
recomendación del W3C del 5 de octubre de 2023. Es una norma de accesibilidad,
no un dato de carreras. La variante de empleabilidad no contiene cifras.
El canal de contacto público se deja explícitamente pendiente del equipo.

## Comprobación antes del PR

- Compilar, ejecutar lint, pruebas existentes y verificación de tokens.
- Recorrer con Tab, Enter y Espacio. La guía no utiliza diálogos ni menús que atrapen el foco.
- Probar 360 px, ambos temas y ampliación al 200%, desde las opciones de prueba.
- Probar las cuatro estaciones y escuchar su estado con TalkBack o VoiceOver.
- Ejecutar una auditoría axe o Lighthouse y corregir los resultados.
- Revisar el código y adjuntar capturas en el PR, fuera del repositorio.

Comprobado localmente: build y lint correctos, 128 pruebas existentes aprobadas,
36 contrastes de tokens aprobados, recorrido de las cuatro estaciones, activación
del botón con Enter y Espacio, avisos para enlaces externos, datos ausentes sin
cero y ausencia de desbordamiento a 360 px en claro/oscuro con texto al 200%.
Pendientes: auditoría axe/Lighthouse, TalkBack o VoiceOver y revisión personal
del nuevo código por Alejandro.

A3 parte de `main` actualizado, no de la rama de A2. Hasta incorporar la fusión de
A2, la guía usa las fuentes alternativas definidas por los tokens. Después de la
fusión se debe traer `principal/main` a esta misma rama y verificar con las fuentes locales.
