# Tratamiento de datos personales

Este documento describe cómo la plataforma trata datos personales. Se diseñó para cumplir la **Ley 21.719** (que modifica la Ley 19.628). Su entrada en vigencia está fijada para el 1 de diciembre de 2026; existe un proyecto de ley (Boletín 18.623-07) que propone postergarla al 1 de diciembre de 2027, pero mientras no se apruebe la fecha vigente sigue siendo 2026. Diseñamos cumpliendo desde ya.

> Este documento no es asesoría legal. Antes de operar con instituciones, debe revisarlo un abogado.

## 1. Principios aplicados

| Principio | Cómo se aplica |
|---|---|
| Minimización | Solo se pide lo necesario para cada función. Cada campo nuevo se justifica en el PR. |
| Finalidad | Los datos se usan para orientar y acompañar al estudiante. Nunca para publicidad ni se venden. |
| Consentimiento | Explícito, separado por tipo de dato y por organización receptora, revocable en cualquier momento. |
| Seguridad | Cifrado en tránsito y de datos sensibles, aislamiento por institución, registro de accesos. |
| Transparencia | El estudiante ve qué datos tiene la plataforma, quién los vio y con quién los comparte. |

## 2. Qué datos tratamos

| Categoría | Ejemplos | Base | Nivel |
|---|---|---|---|
| Uso anónimo | Carreras consultadas sin sesión | No identifica a nadie | Público |
| Identificación mínima | Nombre, correo, fecha de nacimiento, región | Consentimiento al registrarse | Personal |
| Ficha de Trayectoria | Intereses, simulaciones, beneficios postulados | Consentimiento | Personal |
| Situación socioeconómica | Tramo para gratuidad | Consentimiento explícito y separado | **Sensible** |
| Bienestar | Notas de acompañamiento psicosocial | Consentimiento explícito y separado | **Sensible** |

No pedimos RUT en el MVP. Si se necesita más adelante, se justifica con un ADR.

## 3. Menores de 18 años

- La fecha de nacimiento determina si la persona es menor.
- Para datos que lo requieran, se pide autorización del padre, madre o tutor antes de guardarlos.
- Sin autorización, el menor puede usar todo lo público (explorar, simular, consultar beneficios) sin registrarse.

## 4. Compartir con instituciones

- La institución **no** ve a ningún estudiante por defecto.
- El estudiante elige qué partes de su ficha compartir y con qué institución.
- Revocar es inmediato: desde ese momento la institución deja de ver los datos (lo impone la base de datos, ver `docs/arquitectura.md`).

## 5. Derechos del titular

Desde su perfil, la persona puede: ver sus datos, corregirlos, exportarlos (portabilidad), oponerse a un tratamiento y eliminarlos. Las solicitudes que requieran revisión humana se responden en el plazo que fije la ley.

## 6. Proveedores que tratan datos

| Proveedor | Para qué | Ubicación | Condiciones revisadas |
|---|---|---|---|
| Supabase | Base de datos y autenticación | São Paulo | Pendiente (semana 1) |
| Cloudflare | Servir la aplicación | Red global | Pendiente (semana 1) |
| Google (Gemini, nivel pagado) | Asistente IA, **sin datos personales** | Según Google | Nivel pagado: no usa contenido para mejorar productos |

## 7. Incidentes

Si se sospecha un acceso indebido: avisar de inmediato al líder, registrar qué pasó y cuándo, contener (rotar claves, revocar accesos), evaluar a quién afecta y notificar según exija la ley. Procedimiento detallado: pendiente, alineado con la Ley Marco de Ciberseguridad (Ley 21.663).

## Fuentes

- Ley 21.719, vigencia y proyecto de postergación: https://www.diarioconstitucional.cl/estudios-juridicos/alerta-legal-proyecto-posterga-entrada-en-vigencia-de-ley-de-proteccion-de-datos-personales-por-carla-illanes/
- Cámara de Diputados, Ley 21.719: https://camara.cl/transparencia/leydatospersonales.aspx
