# 0007 — Cifrado de las notas de seguimiento

Fecha: 2026-11-03 · Estado: aceptada

## Contexto
La columna `seguimiento.contenido` guarda las notas de acompañamiento que una organización registra sobre un estudiante. Pueden incluir salud mental y situación socioeconómica: datos sensibles según la Ley 21.719, que `AGENTS.md` (sección 2.2) exige cifrar.

Hoy la protección es solo de acceso: Row Level Security (RLS), ningún rol puede leer la tabla directamente y la única vía de lectura es `ver_seguimientos()`, que verifica el consentimiento y deja registro en `registro_acceso`. Pero el texto queda **en claro** dentro de la base. Lo puede leer quien tenga la clave de servicio, quien entre al editor SQL del panel de Supabase o quien obtenga una copia de seguridad.

La migración base dejó esto pendiente "antes de datos reales".

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| Supabase Vault + pgcrypto dentro de la base | Sin código nuevo en la aplicación; la clave raíz la custodia Supabase fuera de la base | Quien tenga la clave de servicio o el editor SQL puede leer `vault.decrypted_secrets` y descifrar; cambia `ver_seguimientos()` e inserta un disparador |
| pgsodium (cifrado transparente de columnas) | Integrado en PostgreSQL | **En vías de quedar obsoleto**: Supabase recomienda no usarlo; sus vistas descifradas abrirían una lectura que se salta `ver_seguimientos()` y su registro |
| **Cifrado en el servidor de la aplicación** (AES-256-GCM, clave en un secreto de Cloudflare) | La base solo guarda texto cifrado: ni la clave de servicio, ni el panel, ni una copia de seguridad bastan para leerlo; `ver_seguimientos()` y su registro no cambian | Si se pierde la clave, las notas se pierden; quien comprometa el servidor de la aplicación puede leerlas; no se puede buscar dentro de las notas |

Fuentes (consultadas el 2026-11-03):
- pgsodium "pending deprecation", "Use Supabase Vault instead": https://supabase.com/docs/guides/database/extensions/pgsodium
- Vault: la clave "never stored in the database alongside the encrypted data"; quien accede a la vista ve los secretos descifrados: https://supabase.com/docs/guides/database/vault
- AES-GCM disponible en Cloudflare Workers con Web Crypto (`crypto.subtle`), sin activar `nodejs_compat`: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
- TODO(verificar): si Vault viene activado por defecto en el plan gratuito. La página de Vault no lo dice. No cambia la recomendación.

## Decisión
Se elige la tercera opción: cifrar y descifrar en el servidor de la aplicación, con AES-256-GCM a través de Web Crypto. La clave vive en un secreto de Cloudflare y en ningún otro lugar del sistema.

Aceptada por el líder (@rafajaque) el 2026-11-02.

## Justificación
El riesgo que interesa cubrir es que alguien con acceso a la base, sea legítimo o robado, lea las notas. Las dos opciones dentro de la base dejan la capacidad de descifrar en el mismo lugar que los datos, así que no lo cubren. pgsodium además va a quedar obsoleto. Cifrando en la aplicación, la base se vuelve un depósito que no puede leer lo que guarda, y la regla "solo se lee con `ver_seguimientos()`, que deja registro" sigue intacta.

Se usa Web Crypto y no `node:crypto` porque es lo que Cloudflare Workers trae de serie (ADR 0003). Cifrar una nota corta cabe holgado en los 10 ms de CPU por solicitud del plan gratuito.

## Consecuencias
- **Todo pasa por el servidor.** Las notas se registran y se leen solo desde el servidor de la aplicación, incluida la persona cuando lee las suyas. El navegador nunca recibe la clave ni el texto cifrado.
- **Migración nueva** (no se edita la base):
  - Una restricción `check` que exija el formato cifrado en `contenido` (por ejemplo `^v[0-9]+:`). Así, un `insert` hecho desde el navegador con texto en claro falla, porque hoy el rol `authenticated` tiene permiso de inserción.
  - Actualizar el comentario "PENDIENTE" de la tabla.
- **Formato con versión de clave** (`v1:iv:texto_cifrado`). Así se puede rotar la clave: se cifra con la nueva, se descifra con cualquiera vigente y un script recifra las notas antiguas.
- **Copia de la clave** fuera de Cloudflare, en un gestor de contraseñas del líder. Sin ella, las notas no se recuperan. Hay que anotar en `docs/privacidad.md` quién la custodia.
- **Código:** `lib/seguridad/cifrado.ts` con `cifrar()` y `descifrar()`, y pruebas que verifiquen que se descifra lo cifrado, que un texto alterado se rechaza y que una versión de clave desconocida falla.
- **Pruebas nuevas en `supabase/tests/pruebas_rls.sql`:** que se rechace un `contenido` sin el formato cifrado y que uno con el formato correcto se acepte. Las pruebas de consentimiento, de lectura directa denegada y de registro de acceso ya existen y no cambian.
- **Búsqueda:** no se podrá buscar dentro de las notas. Se acepta: no es una función del MVP.
- El pendiente de `supabase/README.md` apunta a este ADR y se marca cuando la migración y `lib/seguridad/cifrado.ts` estén en `main`.
