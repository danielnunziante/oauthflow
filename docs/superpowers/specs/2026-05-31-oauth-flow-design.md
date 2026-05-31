# OAuthFlow — Guía interactiva de OAuth para Tiendanube

**Fecha:** 2026-05-31  
**Tipo:** Demo educativa para partners/agencias  
**Contexto:** Proyecto personal para demostrar criterio técnico de enablement en entrevista para Technical Partner Enablement Analyst en Tiendanube/Nuvemshop

---

## Propósito

OAuthFlow es una página web estática que explica el flujo OAuth de Tiendanube paso a paso, con lenguaje accesible para audiencia mixta (técnicos y no técnicos), ejemplos de código visibles en todo momento, y una sección de errores frecuentes.

No es un producto de Tiendanube. Es una demo educativa que muestra cómo se reduciría la fricción de onboarding para partners que recién empiezan a integrarse con la API.

**Frase de referencia para la entrevista:**
> "Lo pensé como una demo educativa para partners/agencias. La idea no es hacer una app productiva, sino mostrar cómo resolvería un problema real de enablement técnico: explicar el flujo OAuth en lenguaje simple, con ejemplos de código siempre visibles, y documentar los errores más frecuentes para que el partner pueda resolver solo antes de escalar."

---

## Audiencia

Partners técnicos mixtos: algunos pueden leer código, otros no. La guía debe poder leerse de corrido sin entrar al código, pero el código tiene que estar disponible para quien lo quiera usar directo.

---

## Decisiones de diseño

| Decisión | Elección | Razón |
|----------|----------|-------|
| Estructura | Página larga con diagrama arriba + pasos scrolleables | Todo visible sin clicks adicionales; cada sección anclada |
| Diagrama principal | Timeline horizontal de 5 pasos numerados | Simple y visual para cualquier perfil, sin contexto técnico previo |
| Código | Siempre visible junto a la explicación | La audiencia mixta puede ignorarlo; quien lo necesita no tiene que buscarlo |
| Paleta | Nimbus design system de Tiendanube | Alineación real con la identidad de la marca |
| Stack | HTML/CSS/JS puro, sin frameworks | Sin servidor, deploy en GitHub Pages, cero dependencias que explicar |

---

## Paleta de colores (Nimbus)

| Token | Valor | Uso |
|-------|-------|-----|
| primary-interactive | `#0059d5` | Pasos activos, botones, bordes de sección, links |
| primary-interactive-hover | `#00429f` | Hover de botones y links |
| primary-surface | `#eef5ff` | Fondo del hero |
| primary-surface-highlight | `#96c1fc` | Links en footer, variables en código |
| success-interactive | `#00c87b` | Badge "completado", bordes de tips |
| success-surface | `#defef2` | Fondo de tips |
| success-text | `#007447` | Texto dentro de tips |
| neutral-background | `#ffffff` | Cards |
| neutral-surface | `#f6f6f6` | Fondo general de página |
| neutral-surface-disabled | `#e7e7e7` | Bordes de cards y separadores |
| neutral-text-high | `#0a0a0a` | Títulos, footer background |
| neutral-text-low | `#5d5d5d` | Texto secundario |
| neutral-interactive | `#888888` | Subtítulos, pasos pendientes |
| danger-surface | `#fedede` | Fondo cards de error crítico |
| danger-interactive | `#c80003` | Título de error crítico |
| warning-surface | `#fef2de` | Fondo cards de warning |
| warning-interactive | `#c87b00` | Título de warning |

---

## Estructura de la página

### 1. Header
- Fondo `#ffffff`, borde inferior `#e7e7e7`
- Logo (ícono azul + texto "OAuthFlow")
- Badge "Guía para partners" en gris neutro
- Links: GitHub + botón primario "Docs oficiales ↗" en `#0059d5`

### 2. Hero
- Fondo `#eef5ff` (primary-surface)
- Badge "GUÍA TÉCNICA · PARTNERS TIENDANUBE" en azul sólido
- Título grande: "¿Cómo funciona OAuth en Tiendanube?"
- Subtítulo en `#5d5d5d`
- Timeline horizontal de 5 pasos dentro de una card blanca con sombra suave
  - Pasos completados/activos: círculo `#0059d5` sólido
  - Pasos pendientes: círculo `#f6f6f6` con borde `#d1d1d1` y texto `#888888`
  - Línea entre pasos activos: `#0059d5`; entre pendientes: `#e7e7e7`
- Al hacer click en un número: scroll suave a esa sección

### 3. Banner de contexto
Una sola línea entre el hero y los pasos:
> "Esta guía es una demo educativa. No reemplaza la documentación oficial de Tiendanube. Los ejemplos usan Node.js pero el flujo aplica a cualquier lenguaje."

### 4. Los 5 pasos (cards)

Cada card tiene:
- Borde superior `2px solid #0059d5` cuando es el paso activo
- Círculo numerado en `#0059d5`
- Título del paso + subtítulo en gris
- Badge "✓ Completado" en `#defef2`/`#007447` para pasos anteriores
- Párrafo explicativo en `#5d5d5d` con `line-height: 1.7`
- Bloque de código (fondo `#0a0a0a`, variables en `#96c1fc`, strings en `#7af7c7`)
  - Header del bloque: fondo `#f6f6f6`, botón "Copiar"
- Tip en `#defef2` con borde izquierdo `#00c87b`

#### Paso 1 — Registrar tu app
- Texto: cómo registrar una app en el portal de partners, qué datos pide, qué se obtiene
- Código: variables de entorno (`CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`)
- Tip: nunca exponer el `client_secret` en el frontend

#### Paso 2 — Generar la URL de autorización
- Texto: qué hace esta URL, quién la abre (el dueño de la tienda), qué ve
- Código: construcción de la URL con `client_id`, `response_type=code`, `redirect_uri`
- Tip: la `redirect_uri` debe coincidir exactamente con la del portal

#### Paso 3 — Recibir el callback
- Texto: qué es el callback, qué trae (`code`), qué significa que llegue
- Código: route que recibe el callback y extrae el `code` del query string
- Tip: el `code` es de un solo uso y expira — intercambiarlo inmediatamente

#### Paso 4 — Intercambiar el código por un token
- Texto: por qué existe este paso, qué hace el POST, qué devuelve Tiendanube
- Código: POST a `https://www.tiendanube.com/apps/authorize/token` con `client_id`, `client_secret`, `code`
- Dato clave: el response incluye `access_token` y `user_id` (equivale al `store_id`)
- Tip: el token es permanente hasta que se desinstale la app

#### Paso 5 — Usar el token para llamar a la API
- Texto: cómo se usa el token, estructura de un request
- Código: GET a `/v1/{store_id}/products` con `Authentication: bearer {token}` y `User-Agent`
- Advertencia naranja (`warning`): el header es `Authentication`, no `Authorization`
- Tip: integración completa

### 5. Errores frecuentes

Cuatro cards en fila horizontal en desktop, grilla 2x2 en mobile:

| Error | Color | Causa | Solución |
|-------|-------|-------|----------|
| `401 Unauthorized` | danger | Token inválido o header mal formado | Header debe ser `Authentication: bearer TOKEN` |
| `redirect_uri mismatch` | warning | URL de callback no coincide con la del portal | Deben ser idénticas, incluyendo protocolo |
| `invalid_grant` | warning | El `code` ya fue usado o expiró | Reiniciar el flujo OAuth |
| `invalid_client` | warning | `client_id` o `client_secret` incorrectos | Verificar credenciales en el portal |

### 6. Footer
- Fondo `#0a0a0a`
- Texto: "OAuthFlow · Demo educativa · No es un producto oficial de Tiendanube"
- Links: "Docs oficiales TN ↗" en `#96c1fc` + "GitHub" en `#888888`

---

## Estructura de archivos

```
tiendanube-oauth-flow/
├── index.html          # página principal — toda la guía
├── README.md           # qué es, cómo correrlo, cómo contribuir
├── css/
│   └── style.css       # tokens Nimbus, tipografía, cards, código, timeline
├── js/
│   └── app.js          # timeline interactivo: scroll a sección, estado activo/completado
├── data/
│   └── steps.js        # contenido de los 5 pasos y errores como objetos JS
├── docs/
│   └── oauth-flow.md   # explicación técnica del flujo sin UI
└── .gitignore
```

**Principios de la estructura:**
- `data/steps.js` separa contenido de presentación: cambiar un texto no requiere tocar HTML
- `js/app.js` maneja solo la interactividad del timeline
- Sin build tools, sin npm, sin bundler — `open index.html` o GitHub Pages

---

## Dependencias externas

- **Prism.js** (CDN): syntax highlighting del código. Única dependencia. Sin configuración.

---

## Deploy

GitHub Pages sobre rama `main` apuntando a `/`.  
URL resultante: `tuusuario.github.io/tiendanube-oauth-flow`

---

## Documentación incluida en el repo

### README.md (raíz del repo)
- Qué es el proyecto y para qué sirve
- Screenshot de la página
- Cómo correrlo localmente (`open index.html`)
- Qué cubre la guía (lista de los 5 pasos + errores)
- Disclaimer: demo educativa, no producto oficial
- Link a la documentación oficial de Tiendanube

### docs/oauth-flow.md
- Explicación técnica del flujo OAuth completo sin UI
- Diagrama en Mermaid (se renderiza nativo en GitHub)
- Diferencia entre `client_id`, `code` y `access_token`
- Notas específicas de Tiendanube: header `Authentication` (no `Authorization`), `User-Agent` requerido, tokens permanentes

---

## Qué demuestra en la entrevista

| Habilidad | Cómo se ve en el proyecto |
|-----------|--------------------------|
| Frontend | UI limpia con design system real (Nimbus), timeline interactivo, responsive |
| API | Flujo OAuth real de Tiendanube, endpoints y headers correctos |
| Documentación | README claro, docs técnica separada, contenido explicativo en la propia UI |
| Capacitación | La guía en sí es un material de onboarding para partners |
| Soporte | Sección de errores frecuentes con causas y soluciones |
| UX | Pensado para audiencia mixta: texto accesible + código disponible |
| Negocio | Reduce fricción de onboarding, menos consultas básicas de OAuth |
| Iniciativa | Proyecto propio, publicado en GitHub, alineado a la identidad de TN |
