# 0004 — Asistente IA con Gemini en nivel pagado, detrás de una interfaz propia

Fecha: 2026-11-02 · Estado: aceptada

## Contexto
Necesitamos un asistente que responda preguntas sobre admisión y beneficios. Los usuarios incluyen menores y pueden escribir sobre su salud mental.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| Gemini nivel gratuito | Costo cero | El contenido se usa para mejorar productos de Google y puede ser leído por revisores humanos |
| **Gemini nivel pagado** | Los datos no se usan para mejorar productos; mayores límites | Prepago mínimo de 5 USD |
| Modelo propio | Control total | Requiere servidores con GPU; fuera de presupuesto y plazo |

Fuente: https://www.developersdigest.tech/models/free-api/google (verificado 2026-10-18).

## Decisión
Gemini en nivel pagado (prepago de 5 USD, aprobado por el líder), llamado solo a través de `lib/ia/proveedor.ts`.

## Justificación
El costo es mínimo frente al riesgo de exponer conversaciones de menores. La interfaz propia permite cambiar de proveedor sin tocar el resto del código.

## Consecuencias
- Igual se eliminan datos personales antes de enviar la pregunta (minimización).
- La detección de crisis corre antes de llamar a la IA y no depende de ella.
- La clave de la API vive solo en variables de entorno del servidor, nunca en el navegador.
- Fijar un tope de gasto mensual en la consola de Google.
