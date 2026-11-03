# 0008 — Repositorio en una organización gratuita, con el equipo en solo lectura

Fecha: 2026-11-02 · Estado: aceptada

## Contexto
El repositorio era privado y estaba en la cuenta personal del líder. En una cuenta personal, todo colaborador recibe permiso de escritura: Alejandro y Cristóbal podían hacer push directo a `main`, aunque el flujo acordado es trabajar con forks (AGENTS.md, sección 4). La protección de rama no está disponible para repositorios privados en el plan gratuito; se comprobó con el commit vacío `a978387`, que llegó a `main` sin ser rechazado.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| **Organización gratuita, equipo con rol Read** | Sin costo; con rol Read no se puede escribir en el repositorio principal, pero sí hacer fork y abrir PR | `main` sigue sin protección de rama para el líder y para Claude |
| GitHub Pro en la cuenta del líder (4 USD al mes) | Protección de rama en `main` para todos; sin transferir | El equipo conserva permiso de escritura: puede crear y borrar ramas en el principal |
| Repositorio público | Protección de rama gratuita | Incompatible con la licencia propietaria y el modelo de negocio |

Fuente de los roles y del fork con rol Read: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization (consultada el 2026-11-02).

## Decisión
Se transfirió el repositorio a la organización **AE-SE** (plan gratuito), con "Allow forking of private repositories" activado. Alejandro (@JovenGit) y Cristóbal (@RedKris0) tienen rol **Read** como colaboradores externos.

## Justificación
El riesgo real era un push por error de alguien que recién aprende Git. El rol Read lo elimina sin costo. Los únicos con escritura son el líder y Claude, y Claude fusiona solo con la confirmación del líder.

## Consecuencias
- Las direcciones pasan a `AE-SE/Agencia-de-Enlaces-y-Seguimiento-Estudiantil`; GitHub redirige la antigua. Las guías del equipo ya usan la nueva.
- El fork de Alejandro y su PR #2 siguieron funcionando después de la transferencia.
- Si más adelante se contrata GitHub Team, se puede aplicar además la protección de rama en `main`.
