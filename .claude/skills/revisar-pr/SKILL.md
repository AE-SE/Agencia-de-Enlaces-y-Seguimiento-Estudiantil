---
name: revisar-pr
description: Pauta para revisar un pull request de este repositorio. Úsala cuando el líder o un revisor (persona o IA) revise un PR antes de aprobarlo.
---

# Revisar un PR

## Formato del informe

1. **Veredicto en una línea:** se puede aprobar / requiere cambios / se rechaza.
2. **Hallazgos por severidad:** Crítico, Alto, Medio, Menor. Cada uno con `archivo:línea`, qué pasa, por qué importa y el arreglo mínimo propuesto.
3. Solo menciona lo bueno si conviene conservarlo explícitamente.

## Qué revisar, en este orden

1. **Datos personales y seguridad (Crítico si falla):** ¿agrega datos personales sin justificación? ¿hay secretos en el código? ¿una tabla nueva sin política RLS? ¿datos personales hacia la IA, logs o URLs?
2. **Protocolo de crisis (Crítico si falla):** si toca `lib/ia/`, ¿siguen pasando las pruebas de crisis?
3. **Datos oficiales (Alto):** ¿cada dato mostrado tiene fuente, URL, período y fecha? ¿se publica algo sin verificar? ¿un nulo convertido en 0? ¿todas las fuentes son oficiales, primarias o académicas (nunca prensa, columnas, blogs ni agregadores)?
   - **Alcance (Alto):** ¿el cambio respeta el alcance del [ADR 0031](../../docs/decisiones/0031-producto-y-organizacion.md) (sitio para estudiantes de 3.º y 4.º medio, panel de seguimiento para colegios; permanencia, pulso de check-in, predicción de deserción y panel para instituciones de educación superior son escalabilidad)?
4. **Neutralidad (Alto):** ¿algún orden o destaque favorece a una institución o a un cliente (colegio, sostenedor)?
5. **Diseño (Medio):** ¿colores o medidas escritos a mano en vez de tokens? ¿información solo por color? ¿objetivos táctiles menores a 44 px? ¿foco visible?
6. **Lenguaje (Medio):** ¿siglas sin explicar? ¿botones sin verbo? ¿errores que no dicen cómo arreglarlo?
7. **Calidad (Medio/Menor):** ¿pruebas para la lógica nueva? ¿dependencia nueva justificada y con licencia compatible? ¿PR de más de 400 líneas que debería dividirse?
8. **Plantilla del PR completa**, incluida la IA utilizada.

## Regla final

Si tienes dudas sobre un punto Crítico o Alto, no se aprueba: se pregunta en el PR.
