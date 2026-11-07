# Asistente con fuentes, sin entrenamiento propio

Fecha de revisión: 2026-11-05

El asistente no se entrena con reglamentos, plazos ni conversaciones. Busca primero documentos oficiales vigentes y solo responde con los fragmentos que respaldan lo que dice. Así una fuente se puede reemplazar cuando cambie, sin reentrenar un modelo ni perder trazabilidad.

## Recorrido obligatorio de cada mensaje

1. Detectar señales de crisis sin llamar a la inteligencia artificial.
2. Si hay riesgo, entregar *4141 y Salud Responde 600 360 7777, generar alerta humana y detener la conversación normal.
3. Si no hay riesgo, quitar nombre, RUT, teléfono, correo y dirección.
4. Buscar fragmentos de documentos oficiales versionados. Cada fragmento guarda su texto, URL, fecha de descarga, período e identificador.
5. Enviar a Gemini solo la pregunta limpia y esos fragmentos.
6. Mostrar la respuesta únicamente si devuelve identificadores de fragmentos entregados y estos respaldan la afirmación. Si no, indicar que no hay certeza y ofrecer derivación humana.

Este orden extiende la arquitectura vigente; no reemplaza `lib/ia/crisis.ts`, `lib/ia/datos-personales.ts` ni `lib/ia/proveedor.ts`. Las reglas de crisis y privacidad permanecen en código determinista, antes del modelo.

## Repositorios de referencia

### Gemini Cookbook: implementar recuperación y citas

Repositorio: [google-gemini/cookbook](https://github.com/google-gemini/cookbook) · licencia Apache-2.0 · revisado el 2026-11-05.

Es la referencia principal porque la decisión actual ya usa Gemini pagado. Sus ejemplos cubren búsqueda en documentos, embeddings, reordenamiento de resultados y comprobación de fidelidad de citas. Se toman patrones pequeños; no se copia una aplicación completa ni se cambia de proveedor.

Punto de partida: [ejemplos de RAG y citas](https://github.com/google-gemini/cookbook/tree/main/examples).

### Promptfoo: probar que el asistente se niega cuando corresponde

Repositorio: [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) · licencia MIT · revisado el 2026-11-05.

Sirve para convertir reglas del asistente en pruebas repetibles: no inventar plazos, rechazar citas inexistentes, resistir instrucciones que intenten ignorar las reglas y no filtrar datos personales. También permite probar que las respuestas de crisis no dependen del proveedor.

Se evalúa antes de abrir el asistente a personas externas. Sus pruebas usan mensajes inventados y documentos públicos; nunca casos reales de estudiantes.

Fuente: [Promptfoo](https://github.com/promptfoo/promptfoo).

### Vercel Chatbot: tomar solo patrones de interfaz

Repositorio: [vercel/chatbot](https://github.com/vercel/chatbot) · licencia Apache-2.0 · revisado el 2026-11-05.

Ofrece ejemplos de streaming, estados de carga y presentación de fuentes. No se adopta como plantilla: depende de Vercel, Neon y Auth.js, mientras la Agencia usa Cloudflare y Supabase. Si se reutiliza una idea, la interfaz debe seguir los tokens de diseño, funcionar con teclado y mostrar el fragmento citado junto a la respuesta.

Fuente: [Vercel Chatbot](https://github.com/vercel/chatbot).

### Ragas: medir antes de hacer el sistema más complejo

Repositorio: [vibrantlabsai/ragas](https://github.com/vibrantlabsai/ragas) · licencia Apache-2.0 · revisado el 2026-11-05.

Ayuda a medir si el buscador encuentra el fragmento pertinente y si la respuesta se mantiene fiel a él. Se evalúa después de contar con preguntas revisadas por el equipo y una primera versión del buscador. No decide si una respuesta es segura para publicar: las reglas deterministas anteriores siguen mandando.

Fuente: [evaluación de RAG](https://github.com/vibrantlabsai/ragas/blob/main/docs/tutorials/rag.md).

## Límites que no se negocian

- No entrenar ni afinar el modelo con fuentes oficiales: cambian y deben corregirse por documento, URL y fecha.
- No usar conversaciones reales, datos personales ni textos de crisis como datos de prueba o evaluación.
- No permitir que el modelo navegue libremente, elija fuentes nuevas o responda montos y plazos fuera de los fragmentos recuperados.
- No usar una puntuación automática como sustituto de revisión humana de crisis, privacidad o contenido psicoeducativo.

La decisión de Gemini pagado y sus resguardos sigue en el [ADR 0004](decisiones/0004-ia-gemini-nivel-pagado.md). El flujo de seguridad detallado está en [la arquitectura](arquitectura.md#5-asistente-ia).
