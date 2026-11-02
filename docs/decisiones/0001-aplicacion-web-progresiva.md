# 0001 — Aplicación web progresiva en lugar de app de tienda

Fecha: 2026-11-02 · Estado: aceptada

## Contexto
El estudiante debe poder usar la plataforma sin descargar nada. Muchos tienen teléfonos con poco espacio y datos limitados. Aun así, queremos que quien quiera la tenga "como app" y reciba recordatorios de plazos.

## Opciones evaluadas
| Opción | A favor | En contra |
|---|---|---|
| App nativa (Android/iOS) | Notificaciones, ícono | Obliga a descargar; dos códigos; publicación en tiendas; 3 personas, 4 semanas |
| Sitio web común | Sin descarga | Sin instalación ni notificaciones |
| **PWA** | Sin descarga obligatoria; instalable desde el navegador; notificaciones; un solo código | Notificaciones en iPhone solo si la instala |

## Decisión
PWA con Next.js y TypeScript.

## Justificación
Cumple el requisito del líder ("no algo que sí o sí tenga que descargar") y cabe en el plazo. Next.js permite pre-generar las fichas de carrera como páginas estáticas: rápidas con poca señal y encontrables en buscadores.

## Consecuencias
- Recordatorios críticos (plazos FUAS) también por correo, porque no todos instalarán la PWA.
- Si en el futuro se pide app de tienda, la PWA se puede empaquetar sin reescribir.
