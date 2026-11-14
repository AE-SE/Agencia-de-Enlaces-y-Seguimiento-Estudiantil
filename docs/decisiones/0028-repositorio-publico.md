# 0028 — Visibilidad del repositorio: público o privado

Fecha: 2026-11-11 · Estado: propuesta (el líder indicó mantener el repositorio público; ver «Decisión», pendiente de las condiciones) · Relacionado: [ADR 0003](0003-hosting-cloudflare.md), [ADR 0017](archivo/0017-pronostico-agregado-piloto-sede-privada.md), [ADR 0018](archivo/0018-producto-de-planificacion-de-oferta.md), [`LICENSE`](../../LICENSE)

## Contexto

El 11 de noviembre de 2026 los presupuestos de la organización en GitHub (Actions, Packages, Codespaces y Git LFS) figuraban en $0 con "uso bloqueado". Con repositorio privado, Actions solo da los minutos gratis del plan; con repositorio público, Actions con ejecutores estándar es gratis e ilimitado. Eso abrió la pregunta de hacerlo público.

Un motivo de costos no basta para una decisión difícil de revertir: al publicarse, el repositorio puede ser clonado y copiado, y esas copias no se recogen después. Por eso se revisó el contenido antes de decidir.

**Resultado de la revisión (11 de noviembre, 399 confirmaciones y todas las ramas):**

- Sin claves, tokens ni archivos `.env` en el historial. `.env.example` tiene los valores vacíos y `.gitignore` bloquea los `.env`.
- Los RUT, teléfonos y correos que aparecen son inventados y sirven para probar que el asistente los censura.
- No hay datos de estudiantes. Los CSV de `datos/` son cifras oficiales y los pronósticos del proyecto.
- **Material que choca con decisiones ya aceptadas:**
  - `docs/mercado/resumen-interno-oferta.md` (retirado), `docs/manual-tablero-pronostico.md` (retirado) y el tablero de `datos/pronosticos/dashboard/` están marcados "Uso interno. No publicar" (ADR 0017 y 0018).
  - El ADR 0017, aceptado por el líder, dice que el nombre de la institución del piloto "no sale del repositorio sin autorización escrita". Esa autorización no existe todavía (figura como pendiente en `docs/mercado/propuesta-institucional.md`).
  - [`BITACORA.md`](../../BITACORA.md) y los documentos de `docs/mercado/` contienen estimaciones de precio y anclas de compra pública antes de negociar con ninguna institución.
  - [`docs/encuestas/solicitud-permiso-eaec.md`](../encuestas/solicitud-permiso-eaec.md) trae los correos institucionales de dos académicos de la UADY (México).
- Ese material está también en el **historial**, no solo en los archivos actuales.

## Opciones evaluadas

**A. Mantener privado.**
Pros: nada que revisar, no contradice ningún ADR. Contras: los minutos de Actions se agotan; cuesta dinero o obliga a esperar el reinicio mensual y a correr pruebas en local.

**B. Hacer público este repositorio tal como está.**
Pros: Actions gratis. Contras: publica material marcado "no publicar", viola el ADR 0017 y expone precios y estrategia comercial. **Descartada.**

**C. Publicar un repositorio nuevo, con el código y la documentación publicable, sin el historial; este repositorio queda privado como archivo interno.**
Pros: no se reescribe nada, el historial sensible no sale, se pueden decidir archivo por archivo. Contras: hay que mantener dos repositorios o decidir cuál es el principal; se pierde el historial público y los PR existentes.

**D. Reescribir el historial de este repositorio (quitar el material interno con `git filter-repo`) y publicarlo.**
Pros: un solo repositorio, con historial. Contras: cambia todos los identificadores de confirmación y rompe las ramas y forks de Alejandro y Cristóbal; es difícil de revertir y arriesgado con trabajo en curso. Solo conviene si se hace en un momento sin PR abiertos.

**E. Mantener privado y reducir el uso de CI.**
Pros: sin riesgo. Contras: no elimina el límite; ya se aplicó el filtro para cambios solo de documentación ([#130](https://github.com/AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil/pull/130)).

## Decisión

**Decisión pendiente.** El líder indicó (14 de noviembre de 2026) que el repositorio debe seguir público por la limitante de los commits. Ese detalle técnico no está documentado aquí. Como el repositorio ya es público y contiene material que este ADR marca para no publicar (ver «Contexto»), el ADR no se acepta hasta cumplir estas condiciones:

1. Retirar del árbol actual el material de la lista de «Contexto» (el historial no se reescribe sin una decisión aparte, opción D).
2. Obtener la autorización escrita de la institución del piloto, o quitar su nombre de todo el material publicado (ADR 0017).
3. Quitar o pedir permiso por los correos de terceros.
4. Confirmar la licencia (siguiente sección).

Retirado en el commit `919efb7` (el historial sigue igual): el tablero de pronóstico (`datos/pronosticos/dashboard/` y su prueba), `docs/manual-tablero-pronostico.md`, `docs/analisis/informe-pronostico-2027.md`, `docs/archivo/mercado/resumen-interno-oferta.md`, `docs/archivo/mercado/analisis-mercado.md` y `docs/archivo/mercado/propuesta-institucional.md` (con cifras de precio). En `BITACORA.md` se reemplazaron las cifras de precio por «[cifra retirada]». En `docs/encuestas/solicitud-permiso-eaec.md` se quitaron los correos de dos académicos. Los enlaces a estos archivos se corrigieron en el commit `3a4d894`. Antes de cualquier cambio de visibilidad, se revisa de nuevo este ADR.

Lista de lo que se debía cumplir antes de publicar (opciones C o D):

1. Excluir o dejar privados los documentos de la lista de arriba y `BITACORA.md`, o quitarles el material interno.
2. Obtener la autorización escrita de la institución del piloto, o quitar su nombre de todo el material publicado.
3. Quitar o pedir permiso por los correos de terceros.
4. Avisar a Alejandro y Cristóbal, porque sus forks y ramas dejan de apuntar al mismo historial en la opción D.
5. Confirmar la licencia (siguiente sección).

## Justificación

- El proyecto declara trazabilidad y no publicar lo que no se puede verificar (AGENTS.md, sección 2.1); con el mismo rigor, lo que se marcó "no publicar" no se publica por un asunto de facturación.
- La [`LICENSE`](../../LICENSE) ya es propietaria y prohíbe copiar, modificar, distribuir o usar sin autorización, que es lo que se busca con un repositorio visible pero no reutilizable. En Chile el código queda protegido por derecho de autor sin trámite. Publicarlo en GitHub permite a cualquiera verlo y hacer *fork* dentro de GitHub (condiciones de uso de GitHub), pero no reutilizarlo fuera de ellas.
- Fuente de las condiciones de Actions: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), consultada el 2026-11-11. Dice que los ejecutores estándar en repositorios públicos son gratis y no descuentan del uso incluido, y que en repositorios privados el uso se descuenta del monto mensual incluido en el plan, que se reinicia cada ciclo de facturación. Los ejecutores grandes se cobran también en repositorios públicos. Falta confirmar el plan vigente de la organización AE-SE antes de decidir.

## Consecuencias

- Si se publica, el código es visible para instituciones competidoras y futuras clientes. El valor protegido pasa a estar en el servicio (SaaS), los datos curados y los contratos, no en la ocultación del código. El principio "el software es nuestro" (AGENTS.md, sección 1) se mantiene por la licencia, no por el secreto.
- **Si se publica, se propone agregar esta frase a la `LICENSE`**, para que "visible" no se lea como "reutilizable": *"Este repositorio es público solo para lectura y revisión. Ver el código no otorga licencia de uso, copia ni distribución."* Requiere revisión legal antes de aplicarse.
- Cada archivo nuevo de `docs/mercado/` o con datos comerciales debe decidir en su PR si es público o interno.
- Revisar este ADR si cambian el plan de GitHub, el modelo de negocio o la situación del piloto.
