# 0038 — Cifras del SIES de la institución anterior de una carrera, con nota

Fecha: 2026-11-19 · Estado: aceptada (2026-11-19, por el líder) · Relacionado: [ADR 0014](0014-esquema-de-los-datos-oficiales.md), [AGENTS.md 2.1](../../AGENTS.md)

## Contexto

El Buscador de Empleabilidad e Ingresos 2025-2026 del SIES publica las cifras con la institución donde se titularon las cohortes medidas. Las carreras técnicas de INACAP aparecen bajo **CFT INACAP** (código 430). La oferta 2026 de Mineduc ya las trae bajo **IP INACAP** (código 100), por el traspaso de esas carreras de una institución a la otra. Como el cruce es por institución y carrera genérica, 974 de las 1.447 variantes de IP INACAP quedaban sin empleabilidad, retención, continuidad, duración real ni tramo de ingreso, y el sitio mostraba «Sin datos suficientes» en carreras con miles de titulados.

## Opciones evaluadas

- **A. Dejarlas sin dato.** Pros: no se atribuye nada a una institución distinta de la que publica el SIES. Contras: la persona no ve cifras que existen y son de la misma carrera; el motivo («no pudimos asociarla») no explica por qué.
- **B. Usar las cifras de CFT INACAP para IP INACAP, con una nota visible junto a cada cifra (elegida).** Pros: la persona ve el dato y sabe de dónde sale. Contras: es una asociación nuestra, no del SIES; hay que mantener la lista de traspasos y una columna nueva.
- **C. Escribir el aviso en el período.** Pros: no cambia el esquema. Contras: el comparador avisa «Los períodos no son iguales» cuando los períodos difieren, y lo haría por error.

## Decisión

Opción B. Una carrera de la oferta recibe la fila del SIES de su institución anterior **solo si** su institución actual no tiene fila propia para esa carrera genérica. Cada cifra asociada así lleva esta nota: «Cifra que el SIES publica para CFT INACAP: esta carrera pasó de CFT INACAP a IP INACAP. La asociamos nosotros a IP INACAP (elaboración propia).»

- La lista de traspasos está en `TRASPASOS` (`datos/cargar_empleabilidad.py`). Hoy tiene un solo par: 100 ← 430.
- `datos/generar_lotes_sies.py` escribe la nota en `indicador.nota` y `tramo_ingreso_sies.nota` (migración `20261119120000_nota_de_indicador.sql`). Se detiene si encuentra un cruce entre instituciones que no está en la lista.
- La ficha, el comparador, la hoja de decisión y el buscador muestran la nota junto al período.

## Justificación

AGENTS.md 2.1 pide que toda cifra mostrada tenga fuente y que lo calculado o asociado por nosotros diga «elaboración propia». La cifra es oficial; la asociación con IP INACAP es nuestra, y la nota lo dice. Con los datos del 5 de noviembre: 649 de las 974 variantes reciben cifras (28 carreras genéricas). Las carreras con indicadores del SIES pasan de 7.299 a 7.948. Las 325 restantes no aparecen en el SIES bajo ninguna de las dos instituciones.

## Consecuencias

- La migración tiene que estar aplicada en Supabase **antes** de publicar el código que pide la columna `nota`: si no, las consultas fallan.
- Hay que volver a cargar los lotes 07 y 08. Como sus `insert` no hacen nada si la fila existe, solo entran las filas nuevas.
- Cuando el SIES publique las cifras bajo IP INACAP, la fila propia gana y la nota desaparece sola en la siguiente carga.
- Un traspaso nuevo se agrega a `TRASPASOS`, con su nota, y se anota aquí.
