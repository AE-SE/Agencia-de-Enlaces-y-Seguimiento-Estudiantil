# Insumos para la revisión profesional del protocolo de crisis

> **Nota del 2026-11-13.** Sigue vigente: el protocolo de crisis no cambia (AGENTS.md 2.4). El público ya no son solo estudiantes de 3.º y 4.º medio, sino toda persona que egresa de 4.º medio. Idea vigente: [ADR 0032](decisiones/0032-agencia-independiente-y-publico-egresado.md).

> **Estado frente a la idea final (11-nov-2026): vigente.** El protocolo de crisis y la derivación no cambian (AGENTS.md 2.4) y el asistente sigue en el sitio para estudiantes de 3.º y 4.º medio. Idea final y ADR 0031: [`Entregable_Parte_I.md`](entregable/Entregable_Parte_I.md), [ADR 0031](decisiones/0031-producto-y-organizacion.md).

5 de noviembre de 2026. Preparado para quien revise el protocolo ([`lib/ia/crisis.ts`](../lib/ia/crisis.ts)) con un profesional de salud mental, como exige `AGENTS.md` 2.4. **No cambia el código.** Es una lista de preguntas con evidencia de lo que hoy hace el detector.

## Cómo se obtuvo

Una IA (Antigravity) propuso frases de prueba leyendo el código. Después se ejecutó cada una contra `detectarCrisis()` el 2026-11-05. La columna "Resultado" es lo que hizo el código; **que las frases sean expresiones reales de jóvenes en Chile no está verificado** y debe confirmarlo el profesional o personas jóvenes.

## 1. Frases que el detector hoy NO marca (posibles omisiones)

| Frase de prueba | Resultado | Comentario |
|---|---|---|
| me voy a ahorcar | no detecta | **Omisión clara.** El detector reconoce "ahorcarme", pero no esta forma, que es la más natural |
| me voy a colgar | no detecta | Expresión plausible; confirmar con el profesional |
| me voy a tirar a las vías | no detecta | El patrón exige palabras exactas como "metro" o "tren" |
| me quemo a propósito | no detecta | No hay patrón de quemaduras |
| ya no doy más con mi vida | no detecta | Desesperanza sin mención de morir |
| no quiero estar más acá | no detecta | Ídem |
| esta es mi despedida, gracias por todo | no detecta | No hay patrones de despedida |
| kortarme, m4tarme, matrme | no detecta | Faltas de ortografía y sustituciones de letras anulan la detección |
| me voy a corbatear, me quiero desvivir, me ando tajando, tirarme del Costanera | no detecta | **Sin verificar que existan** como expresiones reales; propuestas por la IA |

## 2. Frases inocentes que el detector SÍ marca (falsos positivos)

| Frase de prueba | Resultado |
|---|---|
| jugando fútbol me lastimo siempre | detecta |
| me corté cocinando / me corté con un papel | detecta |
| tengo sobredosis de ramos | detecta |
| quiero terminar con todo antes del viernes | detecta |

**Costo:** la persona recibe las líneas de ayuda en vez de la respuesta que buscaba. El diseño acepta esto a propósito ("preferimos mostrar las líneas de ayuda a alguien que no las necesitaba"); la pregunta es cuánto es demasiado.

## 3. Límites del flujo

- Cada mensaje se evalúa solo: una idea repartida en dos envíos no se detecta.
- Mayúsculas y tildes se normalizan bien; las faltas de ortografía no.
- Si la persona escribe sobre un tercero, recibe las mismas líneas, sin orientación para ayudar a esa persona.

## 4. Preguntas para el profesional

1. ¿Qué nivel de falsos positivos es aceptable a cambio de no dejar pasar un mensaje de riesgo? ¿Cambia para menores de 18?
2. ¿Qué expresiones usan hoy los jóvenes chilenos para hablar de suicidio y autolesión? Las de la sección 1 marcadas "sin verificar" son hipótesis.
3. Si alguien escribe preocupado por otra persona, ¿qué debe decirle el asistente además de las líneas de ayuda?
4. ¿El texto de `RESPUESTA_CRISIS` es adecuado en tono y calidez para jóvenes de 17 a 20 años?
5. ¿Debe el protocolo mirar el mensaje anterior, además del actual?

## 5. Qué hacer con esto

Ninguna corrección del detector debe fusionarse sin esa revisión (`AGENTS.md` 2.4). Excepción a decidir por el líder: la omisión de "me voy a ahorcar" parece un error del patrón y no una cuestión clínica, así que podría corregirse antes, con su prueba.
