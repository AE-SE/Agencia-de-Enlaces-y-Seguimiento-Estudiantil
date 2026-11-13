# 0033 — Cuenta con correo, sin edad ni datos sensibles
Fecha: 2026-11-13 · Estado: propuesta (decidida por el líder el 2026-11-13; sujeta a revisión legal) · Reemplaza a: [ADR 0022](0022-autorizacion-de-tutor-para-menores.md) · Ajusta: [ADR 0015](0015-cuenta-del-estudiante-y-vinculo-institucional.md) · Relacionado: [ADR 0032](0032-agencia-independiente-y-publico-egresado.md), [ADR 0020](0020-derechos-del-titular.md)

## Contexto
El ADR 0022 fijó que todo menor de 18 años necesita autorización de su madre, padre o tutor (opción A1). Esa regla exige conocer la fecha de nacimiento. El 13 de noviembre el líder decidió que la cuenta no pide edad ni datos personales: **solo un correo y dónde estudia o estudió la persona**. Con eso la regla A1 no se puede aplicar, y hay que decidir qué la reemplaza sin salirse de la ley.

Ya no hay panel de colegios ni Ficha compartida ([ADR 0032](0032-agencia-independiente-y-publico-egresado.md)): nada de lo que guarda la cuenta se comparte con terceros.

### Lo que dice la ley (verificado)
Ley 19.628 según el texto de la Ley 21.719, leído en la Biblioteca del Congreso Nacional (idNorma 1209272, versión del 2026-02-05) el 2026-11-13:

- **Artículo 12 (consentimiento).** Debe ser «libre, informado y específico en cuanto a su finalidad o finalidades», y manifestarse «en forma previa y de manera inequívoca, mediante una declaración verbal, escrita o expresada a través de un medio electrónico equivalente, o mediante un acto afirmativo». Se puede revocar «en cualquier momento y sin expresión de causa», por medios «expeditos, fidedignos, gratuitos» y «permanentemente disponibles». «Corresponde al responsable probar que contó con el consentimiento del titular». Se presume que no es libre si se pide para un servicio «en que no es necesario efectuar esa recolección».
- **Artículo 3 (principios).** Finalidad («fines específicos, explícitos y lícitos») y proporcionalidad: los datos deben «limitarse estrictamente a aquéllos que resulten necesarios, adecuados y pertinentes», y conservarse solo el tiempo necesario.
- **Artículo 14 ter (información).** El responsable mantiene en su sitio, entre otros: política de tratamiento con fecha y versión, identificación y contacto del responsable, categorías de datos, finalidades, base de licitud, destinatarios, derechos del titular, período de conservación y cómo retirar el consentimiento.
- **Artículo 2, letra g (datos sensibles).** La lista incluye origen étnico, afiliación política, **situación socioeconómica**, salud, datos biométricos, vida y orientación sexual, entre otros. Un correo y el nombre de una institución de estudios no figuran. Un correo sí es dato personal (letra f).
- **Artículo 16 quáter (niños, niñas y adolescentes).** Menores de 14 años: se necesita el consentimiento de sus padres o representantes. De 14 a 17 años: se tratan «de acuerdo a las normas de autorización previstas en esta ley para los adultos», salvo los datos sensibles de menores de 16 años. Todo tratamiento atiende a su interés superior y a su autonomía progresiva.
- **Artículos 4 a 11 (derechos).** Acceso, rectificación, supresión, oposición, portabilidad y bloqueo.
- **Vigencia.** El primer día del mes vigésimo cuarto desde la publicación (13-dic-2024), es decir, el 1 de diciembre de 2026. Hay un proyecto de ley en trámite que la postergaría (boletín 18.623-07); **no se pudo verificar** que esté aprobado ni publicado. Se diseña como si rigiera el 1 de diciembre de 2026.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| A. Mantener el ADR 0022: pedir fecha de nacimiento y autorización de tutor a todo menor de 18 | La más protectora | Contradice la decisión de no pedir edad; guarda un dato más de cada persona; frena a jóvenes de 16 y 17 que la ley deja decidir |
| **B. Cuenta mínima: correo y lugar de estudio, sin datos sensibles, con declaración de tener 14 años o más** | Guarda menos datos que A; coincide con el artículo 16 quáter, que trata a los adolescentes como adultos cuando no hay datos sensibles; todo lo público sigue sin cuenta | No verifica la edad: se apoya en una declaración. Quien tiene menos de 14 no puede crear cuenta |
| C. Sin cuentas: todo se guarda en el dispositivo | Cero datos personales | La persona pierde su meta al cambiar de teléfono; no hay forma de avisarle un plazo |

## Decisión
Se elige la opción B, con estas reglas:

1. **Todo lo público funciona sin cuenta**: buscar, comparar, simular, ver plazos, fijar la meta y las tres preferencias (se guardan en el dispositivo). La cuenta es opcional y sirve solo para conservar la meta y las preferencias entre dispositivos.
2. **La cuenta guarda**: correo; situación (estudia o ya estudió); institución, elegida de la lista oficial y no escrita a mano; la meta y las tres preferencias; y el registro del consentimiento (fecha, hora y versión del texto aceptado). Nada más: sin nombre, edad, fecha de nacimiento, RUT, teléfono, dirección, género ni dato sensible alguno.
3. **Ingreso sin contraseña**: enlace de un solo uso al correo (ADR 0015, opción A1, sigue vigente).
4. **Dos casillas, ambas sin marcar por defecto**, y la cuenta no se crea si falta alguna:
   - «Acepto que la Agencia guarde mi correo y dónde estudio o estudié, para conservar mi meta y mis preferencias. Puedo borrar mi cuenta cuando quiera.» Con enlace a la política de datos.
   - «Declaro que tengo 14 años o más.»
5. **Una tercera casilla, separada y opcional**: «Quiero recibir avisos de plazos por correo». Es otra finalidad y se puede retirar sola.
6. **Quien tiene menos de 14 años no crea cuenta**; usa el sitio sin ella. No se le pide el dato de un adulto.
7. **Borrar la cuenta** está siempre a la vista y es inmediato. Las solicitudes de acceso, rectificación y portabilidad siguen el ADR 0020.
8. **El asistente, la simulación de beneficios y el cuestionario de intereses no escriben en la cuenta.** El tramo socioeconómico es dato sensible: se calcula en el dispositivo y no se guarda ni se envía.
9. **Ningún dato de la cuenta se entrega a quien encarga un informe.** Los informes se hacen con datos oficiales públicos.

## Justificación
- **Proporcionalidad (artículo 3):** la edad no es necesaria para conservar una meta; pedirla sería recolectar de más.
- **Licitud (artículo 12):** el consentimiento es previo, por acto afirmativo, específico por finalidad y con prueba guardada. La cuenta no condiciona el servicio, así que es libre.
- **Adolescentes (artículo 16 quáter):** al no haber datos sensibles, de 14 a 17 años rigen las reglas de los adultos. La regla anterior del proyecto era más estricta que la ley; esta coincide con ella y guarda menos datos.
- **Riesgo residual:** una persona menor de 14 puede declarar que tiene 14. La ley no exige verificar la edad con documentos y hacerlo obligaría a guardar más datos; el daño posible es bajo porque la cuenta no tiene datos sensibles ni se comparte.

## Consecuencias
- **Pendiente de asesoría legal** (antes de abrir cuentas al público): (1) si la declaración de 14 años o más basta como diligencia; (2) el plazo de conservación de cuentas inactivas (`TODO(legal)`; propuesta: 24 meses, con aviso previo); (3) el texto de la política de datos del artículo 14 ter; (4) si la sociedad debe designar un encargado de prevención.
- **Pendiente del líder:** si alguna vez se usan estadísticas agregadas de uso (por ejemplo, carreras más buscadas) en informes. Hoy la respuesta es no. Si cambia, exige un ADR, anonimización irreversible (artículo 2, letra k), un mínimo de casos por celda (ADR 0025) y decirlo en la política.
- La tabla `autorizacion_tutor`, la función `consentimiento_otorgar` y sus pruebas quedan sin uso. No se borran en este ADR: se retiran en una migración aparte cuando se construya la cuenta.
- La cuenta **no se construye para el 19 de diciembre de 2026**; queda diseñada. La meta y las preferencias se guardan en el dispositivo.
- AGENTS.md 2.2 («Nunca asumir mayoría de edad», flujo de tutor) se reescribe cuando este ADR se acepte: la regla pasa a ser «no pedir ni guardar la edad; ningún dato sensible en la cuenta».
- `docs/privacidad.md` se actualiza con la lista cerrada de datos de la cuenta.
