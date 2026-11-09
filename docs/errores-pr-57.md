# Errores y pendientes del PR 57

Fecha de revisión: 7 de noviembre de 2026.

Este registro distingue los problemas confirmados del producto de las limitaciones
de la prueba local. No incluye datos personales.

## Verificado en sitio desplegado

### Quitar carrera no responde en teléfono

- **Fecha de verificación:** 7 de noviembre de 2026.
- **URL:** `https://agencia-de-enlace.rafajaqued.workers.dev/comparador`.
- **Pasos reproducibles:** con el viewport a 360 px, agregar Enfermería (Universidad
  de Chile) e Ingeniería Civil Informática (Universidad de Concepción); tocar el
  primer botón «Quitar carrera».
- **Resultado observado:** quedó solo Ingeniería Civil Informática y la URL cambió
  de `?carreras=I70S1C41J1V1,I87S1C49J1V3` a `?carreras=I87S1C49J1V3`.
- **Estado:** verificado en el sitio desplegado: el botón responde en esta prueba.
- **Resultado observado en desarrollo:** tras una recarga completa tampoco se
  reprodujo el problema.
- **Contexto de la prueba:** el registro de `next dev` indicó que bloqueó HMR para
  el origen local `10.131.158.36`. Eso puede dejar el teléfono con una versión
  anterior; por eso la verificación anterior en desarrollo no bastaba.

## Problemas de entorno de desarrollo

### Build local interrumpido por la terminal integrada

- **Comando:** `npm run build`.
- **Resultado observado:** Next inicia la compilación, pero la terminal integrada
  corta el proceso después de 30 segundos antes del resumen final.
- **Comprobación adicional:** `npx next build --webpack` compiló correctamente y
  alcanzó la comprobación de TypeScript antes del mismo límite.
- **Estado:** pendiente de confirmar con CI o una terminal sin ese límite.

## Resueltos

### Dependencia `lucide-react` ausente en CI

- **Error original:** `Module not found: Can't resolve 'lucide-react'`.
- **Causa:** la rama del comparador no incluía el cambio de `main` que agregó la
  dependencia.
- **Corrección aplicada:** se fusionó `origin/main` en `feat/comparador` y se
  instaló `lucide-react@1.68.0`.
- **Pendiente:** que CI confirme el build del commit de merge.

### Ruta `/componentes` devolvía 404

- **Causa:** la ruta vivía en `feat/componentes-base` y no estaba incluida en la
  base anterior del comparador.
- **Corrección aplicada:** la fusión de `origin/main` incorporó
  `app/(portal)/componentes/page.tsx`.
- **Verificación:** la prueba posterior confirmó que `/componentes` funciona.

## Deuda técnica documentada

### Breakpoint `64rem` del comparador

- **Archivo:** `app/(portal)/comparador/comparador.module.css`.
- **Estado:** no se modifica en este PR. `diseno/tokens.json` no define
  breakpoints y agregar uno requiere ADR, según `AGENTS.md` sección 2.5.
- **Siguiente paso:** resolver en un PR separado con el ADR y el token aprobados.
