# Arquitectura

Una sola aplicación web (PWA) sobre una sola base de datos, con los datos de cada institución aislados por la propia base de datos. Esa decisión es la que permite empezar con tres personas y crecer a muchas instituciones sin reescribir.

Cada decisión de esta página tiene su registro en [`docs/decisiones/`](decisiones/). Los diagramas usan Mermaid y GitHub los dibuja solo.

---

## 1. Contexto: quién usa qué

```mermaid
flowchart LR
    E["Estudiante<br/>(cualquier edad)"] -->|"explora, simula,<br/>conversa"| P["Plataforma"]
    T["Padre, madre<br/>o tutor"] -->|"autoriza datos<br/>de menores"| P
    A["Equipo de la agencia"] -->|"acompaña y<br/>hace seguimiento"| P
    I["Institución cliente"] -->|"ve solo a sus<br/>estudiantes autorizados"| P
    P -->|"descarga datos<br/>abiertos"| F["Fuentes oficiales<br/>DEMRE · SIES · Mineduc · CNA"]
    P -->|"preguntas sin<br/>datos personales"| G["Gemini API<br/>(nivel pagado)"]
```

---

## 2. Componentes

```mermaid
flowchart TB
    subgraph Navegador["Teléfono o computador"]
        PWA["Next.js PWA<br/>portal · panel agencia · panel institucional"]
    end
    subgraph Cloudflare
        SSR["Páginas y funciones<br/>(Workers)"]
    end
    subgraph Supabase["Supabase · región São Paulo"]
        DB[("PostgreSQL<br/>+ Row Level Security")]
        AUTH["Autenticación"]
    end
    ETL["Scripts Python<br/>datos/"]
    PWA -->|"HTTPS"| SSR
    SSR -->|"consultas con<br/>identidad del usuario"| DB
    PWA -->|"inicio de sesión"| AUTH
    SSR -->|"pregunta + documentos<br/>oficiales relevantes"| IA["lib/ia → Gemini"]
    ETL -->|"carga con fuente<br/>y fecha"| DB
```

| Componente | Responsabilidad | Carpeta |
|---|---|---|
| Portal | Explorador de carreras, comparador, simulador, beneficios, asistente | `app/(portal)/` |
| Panel agencia | Casos, seguimiento, alertas | `app/(agencia)/` |
| Panel institucional | Cohortes de la institución, solo estudiantes que autorizaron | `app/(institucion)/` |
| Cálculos | Puntaje ponderado, ranking, elegibilidad | `lib/calculos/` |
| Asistente IA | Interfaz única hacia el proveedor, protocolo de crisis | `lib/ia/` |
| Carga de datos | Descarga y limpieza de datos oficiales | `datos/` |
| Esquema | Tablas, políticas de seguridad, migraciones | `supabase/migrations/` |

**Páginas de carreras pre-generadas:** las fichas de carrera son públicas y cambian pocas veces al año. Se generan como páginas estáticas: cargan rápido con poca señal, cuestan casi nada servir y aparecen en Google.

---

## 3. Modelo de datos

Dos mundos separados: **datos públicos oficiales** (sin datos personales) y **datos de personas** (protegidos).

```mermaid
erDiagram
    FUENTE ||--o{ INDICADOR : "respalda"
    INSTITUCION ||--o{ PROGRAMA : "imparte"
    PROGRAMA ||--o{ INDICADOR : "tiene"
    BENEFICIO ||--o{ PLAZO : "tiene"
    FUENTE ||--o{ BENEFICIO : "respalda"
```

```mermaid
erDiagram
    PERSONA ||--o| FICHA_TRAYECTORIA : "es dueña de"
    PERSONA ||--o{ CONSENTIMIENTO : "otorga o revoca"
    ORGANIZACION ||--o{ CONSENTIMIENTO : "recibe"
    ORGANIZACION ||--o{ MIEMBRO : "tiene"
    PERSONA ||--o{ SEGUIMIENTO : "recibe"
    SEGUIMIENTO }o--|| MIEMBRO : "registrado por"
```

| Tabla | Qué guarda | Regla clave |
|---|---|---|
| `fuente` | Organismo, URL, fecha de descarga, licencia | Todo dato público apunta a una fuente |
| `institucion`, `programa` | Oferta académica | Código oficial como identificador |
| `indicador` | Un valor medido: empleabilidad 1.er año, ingreso 4.º año, arancel, puntaje de corte, retención | Siempre con `tipo`, `periodo`, `fuente_id`; sin dato → `null` + motivo, nunca 0 |
| `beneficio`, `plazo` | Gratuidad, becas, créditos y sus fechas | Vigencia con fecha de inicio y término |
| `persona` | Datos mínimos de quien se registra | Fecha de nacimiento → define si requiere tutor |
| `ficha_trayectoria` | Intereses, simulaciones guardadas, beneficios postulados | Le pertenece a la persona |
| `consentimiento` | Qué comparte, con qué organización, cuándo, revocado o no | Sin consentimiento vigente, la institución no ve nada |
| `organizacion`, `miembro` | La agencia y cada institución cliente; sus usuarios y roles | Base del aislamiento |
| `seguimiento` | Notas y señales de alerta | Dato sensible: cifrado y con registro de acceso |
| `registro_acceso` | Quién vio qué dato sensible y cuándo | Solo se agrega, nunca se borra |

---

## 4. Aislamiento entre instituciones

La regla vive **en la base de datos**, no en el código de la página. Aunque el frontend tenga un error, PostgreSQL no entrega filas de otra institución.

```mermaid
flowchart LR
    U["Miembro de<br/>Institución A"] -->|"consulta seguimientos"| RLS{"Política RLS"}
    RLS -->|"¿es de su organización<br/>Y hay consentimiento vigente?"| OK["Filas de A<br/>con consentimiento"]
    RLS -->|"cualquier otro caso"| NO["0 filas"]
```

Cada política tiene su prueba automatizada en `supabase/tests/`: un usuario de A no ve datos de B; una institución no ve a un estudiante que revocó su consentimiento.

---

## 5. Asistente IA

```mermaid
flowchart TB
    M["Mensaje del estudiante"] -->|"primero"| C{"¿Señales de crisis?"}
    C -->|"sí"| K["Responde con *4141 y<br/>600 360 7777 + alerta humana"]
    C -->|"no"| S["Quita datos personales<br/>(nombre, RUT, teléfono)"]
    S -->|"pregunta limpia"| R["Busca en documentos<br/>oficiales cargados"]
    R -->|"pregunta + fragmentos<br/>con fuente"| G["Gemini"]
    G -->|"respuesta"| V{"¿Cita una fuente?"}
    V -->|"sí"| OK["Muestra respuesta<br/>con enlace a la fuente"]
    V -->|"no"| D["No sé con certeza;<br/>deriva a una persona"]
```

Reglas:

- **La detección de crisis corre antes que todo y no depende del proveedor de IA.** Si Gemini no responde, el protocolo igual funciona.
- La IA no recibe datos personales. Gemini en nivel pagado no usa los datos para mejorar sus productos, pero igual minimizamos.
- Toda llamada pasa por `lib/ia/proveedor.ts`. Cambiar de proveedor = cambiar un archivo.
- Las respuestas sin fuente no se muestran como hechos.

---

## 6. Flujo de datos oficiales

```mermaid
flowchart LR
    D["Archivo oficial<br/>CSV / XLSX"] -->|"descarga"| B["datos/crudos/<br/>(no versionado)"]
    B -->|"limpieza y<br/>validación"| V["Script Python"]
    V -->|"filas + fuente<br/>+ fecha"| DB[("Base de datos")]
    V -->|"errores"| L["Reporte de carga"]
```

- Cada carga es **repetible**: correrla dos veces deja el mismo resultado.
- Cada script valida tipos, rangos (una empleabilidad no puede ser 140%) y nulos antes de escribir.
- El catálogo de fuentes, sus URL y términos de uso está en [`docs/fuentes.md`](fuentes.md).

---

## 7. Seguridad (resumen)

| Medida | Dónde |
|---|---|
| HTTPS en todo | Cloudflare |
| Aislamiento por institución | Políticas RLS en PostgreSQL |
| Datos sensibles cifrados | Columnas cifradas en `seguimiento` |
| Registro de accesos a datos sensibles | Tabla `registro_acceso` |
| Secretos fuera del código | Variables de entorno; `.env` ignorado por git |
| Revisión obligatoria | CODEOWNERS + rama `main` protegida |
| Dependencias revisadas | Justificación en cada PR que agregue una |

Detalle de tratamiento de datos personales: [`docs/privacidad.md`](privacidad.md).

---

## 8. Cómo escala

| Etapa | Cambio necesario |
|---|---|
| 1 institución piloto | Ninguno: crear su `organizacion` y miembros |
| 10 instituciones | Ninguno en código; quizás pasar Supabase a plan pagado |
| Tráfico alto en admisión (enero) | Las fichas son estáticas: Cloudflare las sirve desde caché |
| Otro proveedor de IA | Cambiar `lib/ia/proveedor.ts` |
| App en tiendas | La PWA puede empaquetarse sin reescribir; solo si los usuarios lo piden |
