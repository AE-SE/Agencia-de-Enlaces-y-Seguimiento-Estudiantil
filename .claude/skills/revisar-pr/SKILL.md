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

1. **Datos personales y seguridad (Crítico si falla):** ¿agrega datos personales sin justificación? ¿pide o guarda la edad, o algo fuera de la lista cerrada de la cuenta ([ADR 0033](../../../docs/decisiones/0033-cuenta-con-correo-sin-edad.md))? ¿algo público deja de funcionar sin cuenta? ¿hay secretos en el código? ¿una tabla nueva sin política RLS? ¿datos personales hacia la IA, logs o URLs?
2. **Protocolo de crisis (Crítico si falla):** si toca `lib/ia/`, ¿siguen pasando las pruebas de crisis?
3. **Datos oficiales (Alto):** ¿cada dato mostrado tiene fuente, URL, período y fecha? ¿se publica algo sin verificar? ¿un nulo convertido en 0? ¿todas las fuentes son oficiales, primarias o académicas (nunca prensa, columnas, blogs ni agregadores)?
   - **Cifras propias (Alto):** ¿toda cifra calculada por nosotros dice «elaboración propia» y cómo se calculó? ¿algún texto afirma una causa que la fuente no mide (que no se ingresa por desinformación, que quedar fuera causa problemas de salud mental)?
   - **Alcance (Alto):** ¿el cambio respeta el alcance del [ADR 0032](../../../docs/decisiones/0032-agencia-independiente-y-publico-egresado.md) (sitio gratuito y sin cuenta para personas que egresan de 4.º medio; nada para colegios; cuenta, asistente, noticias, tablero de transparencia e informes quedan diseñados; permanencia y predicción son escalabilidad)?
4. **Independencia (Alto):** ¿algún orden o destaque favorece a una institución o a quien encargó un informe? ¿hay avisos o texto de venta?
5. **Diseño (Medio):** ¿colores o medidas escritos a mano en vez de tokens? ¿información solo por color? ¿objetivos táctiles menores a 44 px? ¿foco visible?
6. **Lenguaje (Medio):** ¿siglas sin explicar? ¿botones sin verbo? ¿errores que no dicen cómo arreglarlo? ¿aparece «vulnerable», «pobreza», «clase social» o un equivalente?
7. **Calidad (Medio/Menor):** ¿pruebas para la lógica nueva? ¿dependencia nueva justificada y con licencia compatible? ¿PR de más de 400 líneas que debería dividirse?
8. **Plantilla del PR completa**, incluida la IA utilizada.

## Regla final

Si tienes dudas sobre un punto Crítico o Alto, no se aprueba: se pregunta en el PR.
