# 0023 — Cómo compartir el tablero del pronóstico sin publicarlo

Fecha: 2026-11-09 · Estado: propuesta (pendiente de decisión del líder y de revisión legal para la opción C)

## Contexto

El tablero del pronóstico (`datos/pronosticos/dashboard/`) es de uso interno (ADR 0017 y 0018). El líder quiere que el equipo y los socios puedan verlo fuera del computador del líder, sin publicarlo en el sitio.

Restricciones que aplican:
- El repositorio es privado.
- El tablero trae nombres de instituciones y cifras que aún no están verificadas en fuente oficial. AGENTS.md 2.1 prohíbe mostrar datos que no se pueden verificar.
- Las cifras son de un pronóstico registrado el 2026-11-07 y no se han comparado con lo observado (ADR 0018).
- Cualquier servicio externo que reciba el contenido tiene que cumplir AGENTS.md 2.2 (no enviar datos personales ni claves a servicios sin aprobación).
- La revisión legal de la Ley 21.719 entra en vigencia el 1 de diciembre de 2026.

## Opciones evaluadas

**A. Solo en el repositorio, cada persona lo genera en su equipo.**
- Pros: no sale nada del repositorio privado; no hay servicio nuevo que configurar.
- Contras: cada persona necesita `datos/procesados/`, que sale de los scripts y no está en el repositorio.

**B. Enviar el HTML por un canal privado (correo o almacenamiento compartido).**
- Pros: inmediato.
- Contras: una copia sin control; no se puede revocar ni saber quién la abrió.

**C. Subdominio privado en Cloudflare, con acceso restringido por correo (Cloudflare Access).**
- Pros: acceso revocable por persona; el acceso queda registrado; no cambia el sitio público.
- Contras: lo configura el líder en su cuenta; hay que confirmar los límites del plan gratuito de Cloudflare Access (TODO(fuente): verificar en la documentación de Cloudflare antes de decidir); requiere revisión legal antes de poner datos de instituciones detrás de él.

**D. Página privada en Claude (Artifact).**
- Pros: fácil de compartir.
- Contras: el contenido queda alojado fuera de la infraestructura del proyecto; no está evaluado contra los ADR 0003 ni 0018. No se recomienda hasta que haya una decisión propia.

## Decisión propuesta

1. **Ahora: opción A.** El tablero sigue solo en el repositorio. Cada persona del equipo lo genera en su equipo con el README de la carpeta.
2. **Después, si el equipo lo necesita fuera del equipo: opción C.** Solo después de la revisión legal y de cumplir la lista de la sección siguiente.

## Lista antes de activar la opción C

- [ ] Revisión legal (ADR 0018, Ley 21.719) del uso del tablero con datos de instituciones.
- [ ] Límites del plan de Cloudflare Access verificados en la documentación oficial, con fecha.
- [ ] Nombres de instituciones: decidir si se mantienen o se reemplazan por códigos.
- [ ] Cifras no verificadas: rotuladas en el tablero o retiradas.
- [ ] Lista de personas con acceso, aprobada por el líder, con revisión periódica.

## Consecuencias

- Lo que hoy sale del repositorio es solo lo que el líder decide. Ningún cambio entra al sitio público por esta vía.
- Si se aprueba la opción C, el ADR 0018 necesita una enmienda que diga quién puede ver el tablero y con qué datos.
- La opción D queda descartada hasta que tenga su propio ADR.
