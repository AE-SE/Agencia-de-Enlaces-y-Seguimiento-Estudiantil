# Tratamiento de datos personales

Este documento describe cómo la plataforma trata datos personales. Se basa en el [ADR 0033](decisiones/0033-cuenta-con-correo-sin-edad.md) y en AGENTS.md, sección 2.2. Se diseñó para cumplir la **Ley 21.719** (que modifica la Ley 19.628).

**Vigencia.** Según el ADR 0033, la ley rige desde el 1 de diciembre de 2026 (el primer día del mes vigésimo cuarto desde su publicación, el 13 de diciembre de 2024). Hay un proyecto de ley en trámite que la postergaría (boletín 18.623-07); **no se pudo verificar** que esté aprobado ni publicado. Se diseña como si rigiera el 1 de diciembre de 2026.

> Este documento no es asesoría legal. Antes de abrir cuentas al público debe revisarlo un abogado (ver la sección 10).

**Estado.** El líder aceptó el ADR 0033 el 13 de noviembre de 2026, sujeto a revisión legal antes de abrir cuentas al público. La cuenta está **diseñada y no se construye antes del 19 de diciembre de 2026**. Hoy el sitio no pide ningún dato personal a quien lo usa.

## 1. Idea central

- **Todo lo público funciona sin cuenta**: buscar carreras, compararlas, simular el puntaje, ver beneficios y plazos, y fijar la meta y las tres preferencias, que se guardan en el dispositivo.
- La cuenta es opcional y sirve solo para conservar la meta y las preferencias entre dispositivos.
- **Nada de lo que guarda la cuenta se comparte con terceros.** Ya no existe el panel para colegios ni la Ficha compartida con instituciones ([ADR 0032](decisiones/0032-agencia-independiente-y-publico-egresado.md)). Los informes para clientes se hacen solo con datos oficiales públicos.

## 2. Qué datos guarda la cuenta (lista cerrada)

| Dato | Para qué |
|---|---|
| Correo | Ingresar con un enlace de un solo uso, sin contraseña ([ADR 0015](decisiones/0015-cuenta-del-estudiante-y-vinculo-institucional.md), opción A1) |
| Situación: estudia o ya estudió | Ajustar lo que se muestra |
| Institución, elegida de una lista oficial (no escrita a mano) | Lo mismo |
| Meta y tres preferencias | Conservarlas entre dispositivos |
| Registro del consentimiento: fecha, hora y versión del texto aceptado | Probar que hubo consentimiento (artículo 12) |

Un correo es dato personal (artículo 2, letra f, según el ADR 0033). Un correo y el nombre de una institución de estudios no son datos sensibles.

**Cada campo nuevo requiere un ADR y su justificación en el PR.** Esta lista no se amplía por costumbre.

## 3. Qué NO se guarda

Nombre, edad, fecha de nacimiento, RUT, teléfono, dirección, género ni ningún dato sensible. Tampoco se guarda el tramo socioeconómico, las conversaciones con el asistente, los resultados de la simulación de beneficios ni las respuestas del cuestionario de intereses.

Nunca datos personales en URLs, registros (logs), mensajes de error ni analítica (AGENTS.md 2.2).

## 4. Base de licitud y casillas

La base es el **consentimiento** (artículo 12 de la Ley 19.628, según la Ley 21.719): libre, informado y específico en cuanto a su finalidad, previo y manifestado por un acto afirmativo. Se puede revocar «en cualquier momento y sin expresión de causa», por medios expeditos, gratuitos y siempre disponibles. Corresponde al responsable probar que contó con el consentimiento: por eso se guarda su registro.

La cuenta no condiciona el servicio (todo lo público funciona sin ella), así que el consentimiento es libre.

Al crear la cuenta se muestran, **sin marcar por defecto**:

1. **Obligatoria:** «Acepto que la Agencia guarde mi correo y dónde estudio o estudié, para conservar mi meta y mis preferencias. Puedo borrar mi cuenta cuando quiera.» Con enlace a esta política.
2. **Obligatoria:** «Declaro que tengo 14 años o más.»
3. **Opcional y separada:** «Quiero recibir avisos de plazos por correo.» Es otra finalidad y se puede retirar sola.

La cuenta no se crea si falta una de las dos obligatorias.

## 5. Menores de 14 años

El artículo 16 quáter exige, para menores de 14 años, el consentimiento de sus padres o representantes. De 14 a 17 años, el tratamiento se rige por las normas de los adultos, salvo los datos sensibles de menores de 16 años; todo tratamiento atiende al interés superior y a la autonomía progresiva.

Regla del proyecto: **quien tiene menos de 14 años no crea cuenta**; usa el sitio sin ella y no se le pide el dato de un adulto. No se pide ni se guarda la edad: se apoya en la declaración de la casilla 2. El riesgo residual (alguien menor de 14 que declare tener 14) está descrito en el ADR 0033; si la declaración basta como diligencia es una consulta pendiente a un abogado.

La regla anterior (todo menor de 18 con autorización de tutor, [ADR 0022](decisiones/0022-autorizacion-de-tutor-para-menores.md)) ya no se aplica.

## 6. Derechos del titular

Los artículos 4 a 11 reconocen los derechos de acceso, rectificación, supresión, oposición, portabilidad y bloqueo. En la plataforma:

- **Borrar la cuenta** está siempre a la vista y es inmediato.
- Las solicitudes de acceso, rectificación y portabilidad siguen el [ADR 0020](decisiones/0020-derechos-del-titular.md).
- **Existe hoy en la base:** la tabla `solicitud_derecho` y las funciones `solicitar_derecho()`, `exportar_mis_datos()`, `ver_solicitudes_abiertas()` y `resolver_solicitud()` (migración `20261108110000_derechos_del_titular.sql`, corregida por `20261109000000_correcciones_alertas_y_exportacion.sql`). La exportación hoy incluye la ficha, los consentimientos y los seguimientos del esquema anterior; **hay que ajustarla** a la lista cerrada de la sección 2 cuando se construya la cuenta.
- **Diseñado, sin construir:** la página donde la persona ejerce estos derechos, que depende de la cuenta.

## 7. Situación socioeconómica

El tramo socioeconómico es dato sensible (artículo 2, letra g). Se **calcula en el dispositivo** y no se guarda ni se envía. La simulación de beneficios y el cuestionario de intereses no escriben en la cuenta.

## 8. Asistente IA

- **No escribe en la cuenta.**
- Solo procesa preguntas sin datos identificables: antes de enviarla al proveedor se quitan nombre, RUT, teléfono, correo y dirección (`lib/ia/datos-personales.ts`).
- Gemini en nivel pagado, sin datos personales ([ADR 0004](decisiones/0004-ia-gemini-nivel-pagado.md)).
- Si un mensaje sugiere riesgo de suicidio o autolesión, el asistente entrega el *4141 y Salud Responde 600 360 7777 y genera una alerta para el equipo. **La alerta guarda solo el tipo de señal y la hora, nunca el texto del mensaje** (`lib/ia/crisis.ts`; tabla `alerta_crisis`, [ADR 0019](decisiones/0019-alertas-de-crisis-y-derivacion.md)).

## 9. Proveedores y ubicación de los datos

| Proveedor | Para qué | Ubicación | Condiciones revisadas |
|---|---|---|---|
| Supabase | Base de datos y autenticación | São Paulo | Pendiente |
| Cloudflare | Servir la aplicación | Red global | Pendiente |
| Google (Gemini, nivel pagado) | Asistente IA, **sin datos personales** | Según Google | Nivel pagado: no usa contenido para mejorar productos |

## 10. Pendientes

Del ADR 0033, antes de abrir cuentas al público:

1. **Asesoría legal:** si la declaración de 14 años o más basta como diligencia; el plazo de conservación de cuentas inactivas (`TODO(legal)`; propuesta del ADR: 24 meses, con aviso previo); el texto de la política de datos del artículo 14 ter; y si la sociedad debe designar un encargado de prevención.
2. **Decisión del líder:** si alguna vez se usan estadísticas agregadas de uso (por ejemplo, carreras más buscadas) en informes. Hoy la respuesta es no. Si cambia, exige un ADR, anonimización irreversible, un mínimo de casos por celda ([ADR 0025](decisiones/0025-celdas-suprimidas-visibles-sin-cifra.md)) y decirlo aquí.
3. **Documento por escribir:** la política de tratamiento que exige el artículo 14 ter (con fecha y versión, responsable y contacto, categorías de datos, finalidades, base de licitud, destinatarios, derechos, período de conservación y cómo retirar el consentimiento). Este documento es su base, no la reemplaza.
4. **Revisar** las condiciones de tratamiento de datos de Supabase y Cloudflare.

## 11. Datos del esquema anterior, sin uso

La base conserva tablas del diseño anterior, que guardaban datos que la cuenta mínima ya no pide: `persona` (con `nombre` y `fecha_nacimiento`), `autorizacion_tutor`, `consentimiento` (por organización), `ficha_trayectoria` y `seguimiento`. **Siguen existiendo; desde el ADR 0032 y el ADR 0033 no se usan y se retiran en una migración aparte.** Hoy están vacías en producción (revisión del 2026-11-09, ver [`supabase/README.md`](../supabase/README.md)). Antes de abrir cuentas hay que migrar `persona` para que no exija nombre ni fecha de nacimiento.

## 12. Incidentes

Si se sospecha un acceso indebido: avisar de inmediato al líder, registrar qué pasó y cuándo, contener (rotar claves, revocar accesos), evaluar a quién afecta y notificar según exija la ley. Procedimiento detallado: pendiente, alineado con la Ley Marco de Ciberseguridad (Ley 21.663).

## Fuentes

- Ley 19.628 según el texto de la Ley 21.719, Biblioteca del Congreso Nacional (idNorma 1209272, versión del 2026-02-05), leída el 2026-11-13 según el ADR 0033. Cualquier postergación se verifica en la tramitación oficial (https://www.camara.cl y https://www.senado.cl) antes de afirmarla.
- Cámara de Diputados, Ley 21.719: https://camara.cl/transparencia/leydatospersonales.aspx
