# Frontend Redesign — OAuthFlow Tiendanube

**Date:** 2026-06-01  
**Status:** Approved  
**Stack:** HTML vanilla + CSS custom + JS puro (sin framework)

---

## Objetivo

Rediseñar completamente el frontend de la guía interactiva OAuth para partners de Tiendanube. El resultado debe destacarse visualmente, mejorar la experiencia de usuario y agregar dos features nuevas: diagrama de flujo animado y progress tracker.

---

## Decisiones de diseño

| Dimensión | Decisión |
|-----------|----------|
| Tema | Light mode premium |
| Layout | Sidebar fijo (240px) + área de contenido |
| Marca | Inspirada en TN (#0059d5) con accent indigo (#6366f1) |
| Tipografía heading | Plus Jakarta Sans |
| Tipografía body | Plus Jakarta Sans |
| Tipografía código | JetBrains Mono (nueva) |
| Features nuevas | Diagrama SVG animado + Progress tracker |

---

## Design Tokens

### Colores

```css
/* Primarios */
--color-primary:         #0059d5
--color-primary-hover:   #0047b0
--color-primary-surface: #EEF5FF

/* Accent técnico */
--color-accent:          #6366f1
--color-accent-surface:  #EEF2FF

/* Success */
--color-success:         #00c87b
--color-success-surface: #DEFEF2
--color-success-text:    #007447

/* Neutrals */
--color-bg:              #F8FAFC
--color-card:            #FFFFFF
--color-border:          #E2E8F0
--color-border-strong:   #CBD5E1
--color-text-high:       #0F172A
--color-text-low:        #475569
--color-text-muted:      #94A3B8

/* Danger */
--color-danger-surface:  #FEE2E2
--color-danger-text:     #DC2626

/* Warning */
--color-warning-surface: #FEF3C7
--color-warning-text:    #D97706

/* Code */
--color-code-bg:         #0F172A
```

### Espaciado y radios

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 20px

--shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 4px 12px rgba(0,89,213,0.10), 0 2px 4px rgba(0,0,0,0.05)
--shadow-lg: 0 8px 24px rgba(0,89,213,0.12), 0 4px 8px rgba(0,0,0,0.06)
```

### Tipografía

```css
/* Google Fonts import */
Plus Jakarta Sans: wght@400;500;600;700;800
JetBrains Mono:   wght@400;500;600

/* Escalas */
h1:          3rem / 700 / letter-spacing: -0.03em
h2 (cards):  1.25rem / 600
body:        1rem (16px) / 400 / line-height: 1.6
code inline: 0.875em (JetBrains Mono)
label/badge: 0.6875rem / 700 / uppercase
```

---

## Layout

### Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────┐
│ HEADER (sticky, 60px)                            │
│  logo + badge          | Docs API  | GitHub ↗   │
├────────────┬─────────────────────────────────────┤
│            │ HERO                                │
│  SIDEBAR   │  diagrama SVG animado               │
│  (240px,   │  eyebrow · h1 · subtitle            │
│  sticky    ├─────────────────────────────────────┤
│  top:60px) │ context-banner                      │
│            ├─────────────────────────────────────┤
│  ● 01      │ STEP CARDS (5x)                     │
│  ○ 02      │                                     │
│  ○ 03      ├─────────────────────────────────────┤
│  ○ 04      │ ERRORS SECTION                      │
│  ○ 05      ├─────────────────────────────────────┤
│  ────────  │ FOOTER                              │
│  Progress  │                                     │
│  1/5       └─────────────────────────────────────┘
└────────────┘
```

### Tablet (768px – 1023px)

Sidebar colapsa: los 5 pasos se muestran como tab-strip horizontal sticky debajo del header. Progress tracker desaparece (solo visible en desktop). Contenido full width con `max-width: 680px`.

### Mobile (< 768px)

Tab-strip sigue visible pero muestra solo los círculos numerados (sin labels). Content: padding 16px. Hero h1 a 2rem. Errors grid: 1 columna.

---

## Componentes

### Header

- `position: sticky; top: 0; z-index: 50`
- Fondo `#FFFFFF` con `border-bottom: 1px solid var(--color-border)` y `backdrop-filter: blur(8px)` para efecto glass sutil al hacer scroll
- Logo: ícono SVG de llave (16×16, fill blanco, bg `--color-primary`, `border-radius: 8px`) + "OAuthFlow" (Plus Jakarta Sans 700) + badge "Guía para partners"
- Nav: "Docs API" (link texto) + "GitHub ↗" (btn-ghost con ícono SVG de GitHub)

### Sidebar

- `width: 240px; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto`
- Fondo `--color-bg`, `border-right: 1px solid var(--color-border)`
- Padding `24px 20px`

**Lista de pasos:**
- Línea vertical conectora (2px, `--color-border`) que une los círculos
- Cada ítem: círculo (32px) + label
  - `pending`: borde `--color-border-strong`, texto `--color-text-muted`
  - `active`: fondo `--color-primary`, texto blanco, `box-shadow: 0 0 0 4px var(--color-primary-surface)`
  - `done`: fondo `--color-success-surface`, ícono check SVG en `--color-success-text`
- Label: nombre corto del paso, `font-size: 0.875rem`
- Hover: `cursor: pointer`, background sutil en el ítem

**Progress tracker** (debajo de separador `<hr>`):
- Label: "Progreso"
- Barra: `height: 6px; border-radius: 3px`, fondo `--color-border`, fill `--color-primary` con `transition: width 0.4s ease`
- Texto: "X de 5 pasos completados", `font-size: 0.75rem`, `--color-text-muted`
- Persistencia: `localStorage.setItem('oauth-progress', stepId)` al marcar un paso como done

**Marcar como completado:**
- Cada step-card tiene un botón "Marcar como completado" al final
- Al hacer click: el paso pasa a `done` en sidebar + se guarda en localStorage + el siguiente paso pasa a `active`

### Hero

- Fondo: `linear-gradient(135deg, #EEF5FF 0%, #F8FAFC 60%, #EEF2FF 100%)`
- `padding: 48px 40px; text-align: center`
- Contenido (de arriba a abajo):
  1. Eyebrow pill (azul, uppercase)
  2. H1: "¿Cómo funciona OAuth en Tiendanube?"
  3. Subtítulo (max-width: 480px, centrado)
  4. **Diagrama SVG animado** (ver sección abajo)
  5. Hint text "Usá la barra lateral para navegar entre pasos"

### Diagrama SVG animado

Diagrama horizontal del ciclo OAuth con 4 nodos conectados por flechas:

```
[Tu App]  →→→  [Tiendanube]  →→→  [Dueño tienda]
    ↑                                      ↓
    ←←←←←←←←←  [Token]  ←←←←←←←←←←←←←←←←
```

- Cada nodo: rectángulo redondeado (`rx: 12`) con ícono SVG + label de 2 líneas
- Flechas: `stroke-dasharray` + `stroke-dashoffset` animado con `@keyframes draw` (CSS animation, 2s ease, staggered)
- Animación se dispara una vez al cargar (`animation-fill-mode: forwards`)
- Respetar `prefers-reduced-motion: reduce` — si activo, mostrar el diagrama estático sin animación
- SVG inline en HTML (no img) para que la animación CSS funcione
- Dimensiones: `viewBox="0 0 640 160"`, `max-width: 640px`, responsive con `width: 100%`

**Colores del diagrama:**
- Nodo "Tu App": fondo `--color-accent-surface`, borde `--color-accent`
- Nodo "Tiendanube": fondo `--color-primary-surface`, borde `--color-primary`
- Nodo "Dueño tienda": fondo `#F0FDF4`, borde `#16A34A`
- Nodo "Token": fondo `--color-warning-surface`, borde `--color-warning-text`
- Flechas: `stroke: --color-primary`, `stroke-width: 2`

### Step Cards

Cada card tiene `id="paso-N"` para anchor desde la sidebar.

**Header:**
- `border-bottom: 2px solid var(--color-primary)`
- Número grande: `"01"` en JetBrains Mono, `font-size: 2rem`, `color: --color-accent`, `opacity: 0.4` (decorativo, top-right)
- Ícono de estado SVG a la izquierda del título (círculo, check, etc.)
- Título (`font-size: 1.25rem / 600`) + subtítulo (`font-size: 0.875rem / --color-text-muted`)
- Badge "Completado" en `--color-success-surface` (visible solo cuando done)

**Body** (`padding: 24px`):
- Descripción (`font-size: 1rem, line-height: 1.6, --color-text-low`)
- Code block:
  - Header: `background: #1E293B`, texto `--color-text-muted`, label de lenguaje + botón copiar con ícono SVG clipboard
  - `pre/code`: JetBrains Mono, `font-size: 0.8125rem`, Prism.js con tema `prism-tomorrow`
  - Botón copiar: al éxito muestra ícono check durante 2s
- Tip: `background: --color-success-surface`, ícono SVG de bombilla, borde izquierdo `3px solid --color-success`
- Warning (si aplica): igual pero con ícono SVG de triángulo, color warning
- Botón "Marcar como completado": `width: 100%`, estilo `btn-primary`, al final del body

### Errors Section

- Título: "Errores frecuentes y cómo resolverlos"
- Grid: `grid-template-columns: repeat(2, 1fr)` (desktop), `1fr` (mobile)
- Cada error-card:
  - Ícono SVG: X en círculo (danger) / triángulo (warning)
  - Código de error en negrita
  - Causa en texto secundario
  - Solución separada por línea, con `code` inline

### Footer

- Fondo `--color-text-high` (#0F172A)
- Texto muted, links en `--color-primary-highlight`
- Flex row con disclaimer izq + links der

---

## Interacciones

| Acción | Comportamiento |
|--------|----------------|
| Click en ítem sidebar | Scroll suave al step-card + marcar como `active` |
| Scroll al 40% de un step-card | IntersectionObserver activa el paso en sidebar |
| Click "Marcar como completado" | Paso → `done`, siguiente → `active`, guardar en localStorage |
| Click "Copiar" en code block | Copia al clipboard, ícono cambia a check por 2s |
| Recargar página | localStorage restaura el progreso al último paso visto |
| Keyboard nav | `Tab` navega por ítems sidebar; `Enter`/`Space` activan el paso |

---

## Animaciones

- Transiciones de estado sidebar: `transition: all 0.25s ease`
- Barra de progreso: `transition: width 0.4s ease`
- Diagrama SVG: `animation: draw 2s ease forwards` (staggered por nodo)
- Step-card hover: `box-shadow` transition `0.2s`
- Botón copiar: cambio de ícono instantáneo, sin animación
- `prefers-reduced-motion: reduce` → deshabilitar diagrama y barra animados

---

## Accesibilidad

- Sidebar: `role="navigation"` + `aria-label="Pasos del flujo OAuth"`
- Ítems de sidebar: `role="button"` + `tabindex="0"` + `aria-label="Ir al paso N: Título"`
- Paso activo: `aria-current="step"` en el ítem de sidebar
- Diagrama SVG: `role="img"` + `<title>Diagrama del flujo OAuth</title>` + `aria-labelledby`
- Botón copiar: `aria-label="Copiar código del paso N"`
- Contraste texto/fondo: todos los colores cumplen 4.5:1 mínimo en light mode

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `index.html` | Nuevo layout (header + sidebar + main), SVG diagrama inline, nuevos elementos HTML |
| `css/style.css` | Reescritura completa de estilos |
| `js/app.js` | Sidebar rendering, progress tracker, localStorage, diagrama trigger |
| `data/steps.js` | Sin cambios |

---

## Out of scope

- Dark mode toggle
- Framework JS (React, Vue, etc.)
- Backend / mock mode
- Cambios en el contenido textual de los pasos
