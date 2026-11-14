# 0036 — Mapa de carreras por región en la página principal
Fecha: 2026-11-14 · Estado: propuesta (pendiente de revisión del líder) · Relacionado: [ADR 0017](archivo/0017-pronostico-agregado-piloto-sede-privada.md), [ADR 0025](0025-celdas-suprimidas-visibles-sin-cifra.md), [ADR 0031](0031-producto-y-organizacion.md), [ADR 0032](0032-agencia-independiente-y-publico-egresado.md)

## Contexto
La persona que egresa necesita ver dónde estudian nuevos estudiantes de una carrera y qué empleo declaran sus titulados, por región. Hasta ahora esa información estaba repartida en tablas y en el buscador de Mi Futuro. El [ADR 0031](0031-producto-y-organizacion.md) no contempla este mapa en el núcleo del 19 de diciembre, por lo que se propone incorporarlo mediante este ADR.

## Opciones evaluadas
- **A. Mapa 3D (Three.js desde un CDN).** Permite girar y ver columnas. Pros: vistoso. Contras: depende de una librería externa, pesa más, no es accesible con teclado y las columnas no comunican mejor que un círculo.
- **B. Mapa SVG en el núcleo, por región, con tabla equivalente (elegida).** Pros: sin dependencias nuevas, liviano, accesible (la tabla da las mismas cifras), coherente con el sistema visual. Contras: no baja a comuna en esta versión.
- **C. No publicar el mapa hasta después del 19 de diciembre.** Pros: menos riesgo. Contras: deja fuera la información más útil para la decisión de la persona.

## Decisión
Se incorpora la opción B en la página principal, con estas condiciones:
1. **Solo empleo declarado.** La cifra es el empleo al primer año de los titulados por institución y carrera (Mi Futuro, SIES), promediado por región y ponderado por estudiantes nuevos. Se rotula como elaboración propia. **No** se muestra el empleo real del área: el cruce de áreas con ramas de actividad no está validado.
2. **Entradas.** Estudiantes nuevos de 2026 (SIES, matrícula de primer año). Las zonas con menos de 10 no muestran cifra (ADR 0025, opción B), y se etiquetan «menos de 10 estudiantes nuevos».
3. **Solo cobertura verificada.** Se excluyen las filas de cobertura marcadas `cubierto = 0` (120 registros de 2026). Quedan registradas en el JSON como `registros_excluidos_sin_cobertura`.
4. **Sin ranking ni recomendación.** Las zonas se comparan con la mediana de la carrera en texto («más» o «menos empleo que la mayoría de las regiones»). No se ordena ni se destaca ninguna institución.
5. **Sin nombres de instituciones ni sedes** en el JSON publicado.
6. **Colores solo desde tokens.** Se usan `--color-exito`, `--color-alerta`, `--color-borde` y los demás tokens de `diseno/tokens.css`. Las categorías también se distinguen por línea punteada y por texto, no solo por color.
7. **Sin dependencias nuevas.** El mapa es SVG. Los contornos de regiones vienen del shapefile oficial de la Biblioteca del Congreso Nacional (BCN), simplificados y en `lib/datos/mapa/regiones.json`.

## Justificación
- Son cifras propias calculadas a partir de fuentes oficiales, con su fuente, fecha y qué miden (ver `docs/fuentes.md`).
- La regla de supresión de 10 estudiantes evita identificar a grupos pequeños.
- Dejar el empleo real para después evita publicar una comparación que no ha sido validada; la limitación es explícita en la página.

## Consecuencias
- La página principal gana una sección nueva; se revisa con la pauta `revisar-pr` antes de fusionar.
- Para bajar a comuna hará falta una segunda fase: el JSON por comuna pesaría más y la navegación en móvil se complica.
- El empleo real del área queda pendiente hasta tener el empleo por comuna o región con grupo ocupacional (Censo 2024, solicitud al INE, folio AH007T0014649).
- Si el líder decide otra cosa, este ADR se reemplaza; no se borra.
