# Frontend Redesign — OAuthFlow Tiendanube Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign OAuthFlow with a 240px sticky sidebar for navigation + progress tracking, an animated inline SVG diagram of the OAuth cycle, premium light-mode aesthetics (TN blue + indigo accent + JetBrains Mono), and localStorage-persisted step completion.

**Architecture:** Single-page vanilla HTML + CSS custom properties + JavaScript ES6+. Sidebar (sticky left column) handles step navigation and progress. Main wrapper contains hero with SVG diagram, 5 step cards, errors grid, and footer. No build step, no framework.

**Tech Stack:** HTML5, CSS custom properties, JavaScript ES6+, Prism.js (CDN), Google Fonts (Plus Jakarta Sans + JetBrains Mono), localStorage

---

## File Map

| File | Change |
|------|--------|
| `index.html` | Full structural rewrite — sidebar, hero SVG, new layout |
| `css/style.css` | Full CSS rewrite — new tokens, layout, all components |
| `js/app.js` | Extend — replace timeline with sidebar, add progress/complete |
| `data/steps.js` | No changes |

---

### Task 1: Update design tokens and font imports

**Files:**
- Modify: `css/style.css` — replace `:root` block
- Modify: `index.html` — update Google Fonts `<link>`

- [ ] **Step 1: Replace Google Fonts `<link>` in `index.html`**

Replace lines 9–11 (the three font `<link>` tags) with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Replace the entire `:root` block in `css/style.css`**

Replace lines 1–44 with:

```css
/* ─── Design Tokens ──────────────────────────────────────── */
:root {
  /* Primary — Tiendanube blue */
  --color-primary:          #0059d5;
  --color-primary-hover:    #0047b0;
  --color-primary-surface:  #EEF5FF;
  --color-primary-highlight:#96c1fc;

  /* Accent — indigo (technical personality) */
  --color-accent:           #6366f1;
  --color-accent-surface:   #EEF2FF;

  /* Success */
  --color-success:          #00c87b;
  --color-success-surface:  #DEFEF2;
  --color-success-text:     #007447;

  /* Neutrals */
  --color-bg:               #F8FAFC;
  --color-card:             #FFFFFF;
  --color-border:           #E2E8F0;
  --color-border-strong:    #CBD5E1;
  --color-text-high:        #0F172A;
  --color-text-low:         #475569;
  --color-text-muted:       #94A3B8;

  /* Danger */
  --color-danger-surface:   #FEE2E2;
  --color-danger-text:      #DC2626;

  /* Warning */
  --color-warning-surface:  #FEF3C7;
  --color-warning-text:     #D97706;

  /* Code */
  --color-code-bg:          #0F172A;
  --color-code-var:         #93c5fd;
  --color-code-string:      #6ee7b7;
  --color-code-comment:     #64748b;

  /* Layout */
  --sidebar-width:          240px;
  --header-height:          60px;
  --content-max-w:          720px;

  /* Radii */
  --radius-sm:              8px;
  --radius-md:              12px;
  --radius-lg:              20px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,89,213,0.10), 0 2px 4px rgba(0,0,0,0.05);
  --shadow-lg: 0 8px 24px rgba(0,89,213,0.12), 0 4px 8px rgba(0,0,0,0.06);
}
```

- [ ] **Step 3: Verify**

Open `index.html` in the browser. Open DevTools → Elements → select `<html>` → Computed → confirm `--color-accent: #6366f1` and `--sidebar-width: 240px` are present. The page will look broken — that's expected.

- [ ] **Step 4: Commit**

```bash
git add css/style.css index.html
git commit -m "style: update design tokens — indigo accent, slate neutrals, layout vars, JetBrains Mono font"
```

---

### Task 2: Rewrite HTML structure

**Files:**
- Modify: `index.html` — full `<body>` rewrite

- [ ] **Step 1: Replace the entire `<body>` content**

Replace everything from `<body>` to `</body>` with:

```html
<body>

  <!-- HEADER -->
  <header class="site-header">
    <div class="header-logo">
      <div class="header-logo-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path fill="#fff" d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7zm-1 14v-1h2v1h-2zm3-3.1V15h-4v-2.1C8.48 12.07 7 10.67 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.67-1.48 3.07-3 3.9z"/>
        </svg>
      </div>
      <span class="header-logo-name">OAuthFlow</span>
      <span class="header-badge">Guía para partners</span>
    </div>
    <nav class="header-nav" aria-label="Links externos">
      <a href="https://tiendanube.github.io/api-documentation/" target="_blank" rel="noopener" class="header-link">Docs API</a>
      <a href="https://github.com" target="_blank" rel="noopener" class="btn-ghost" aria-label="Ver en GitHub">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub
      </a>
    </nav>
  </header>

  <!-- TWO-COLUMN LAYOUT -->
  <div class="layout">

    <!-- SIDEBAR -->
    <aside class="sidebar" role="navigation" aria-label="Pasos del flujo OAuth">
      <nav id="sidebar-steps" class="sidebar-steps">
        <!-- Rendered by app.js -->
      </nav>
      <div class="sidebar-footer">
        <hr class="sidebar-divider" />
        <p class="progress-label">Progreso</p>
        <div class="progress-track" role="progressbar"
             aria-valuemin="0" aria-valuemax="5" aria-valuenow="0" id="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <p class="progress-text" id="progress-text">0 de 5 pasos completados</p>
      </div>
    </aside>

    <!-- MAIN WRAPPER -->
    <div class="main-wrapper">

      <!-- HERO -->
      <section class="hero">
        <span class="hero-eyebrow">Guía técnica · Partners Tiendanube</span>
        <h1>¿Cómo funciona OAuth<br>en Tiendanube?</h1>
        <p class="hero-subtitle">Guía paso a paso para que tu app pueda acceder a los datos de una tienda con autorización del dueño.</p>

        <!-- Inline SVG — OAuth Flow Diagram -->
        <div class="diagram-wrap">
          <svg class="oauth-diagram" viewBox="0 0 620 175" xmlns="http://www.w3.org/2000/svg"
               role="img" aria-labelledby="oauth-diagram-title" width="100%">
            <title id="oauth-diagram-title">Flujo OAuth: Tu App redirige al dueño a Tiendanube para aprobar acceso; Tiendanube devuelve un access_token a Tu App.</title>
            <defs>
              <marker id="arr-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#0059d5"/>
              </marker>
              <marker id="arr-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#007447"/>
              </marker>
            </defs>

            <!-- Node: Tu App -->
            <rect x="10" y="28" width="130" height="64" rx="12" fill="#EEF2FF" stroke="#6366f1" stroke-width="1.5"/>
            <text x="75" y="56" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="600" fill="#4338ca">Tu App</text>
            <text x="75" y="76" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#6366f1">cliente OAuth</text>

            <!-- Node: Tiendanube -->
            <rect x="230" y="28" width="160" height="64" rx="12" fill="#EEF5FF" stroke="#0059d5" stroke-width="1.5"/>
            <text x="310" y="56" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="600" fill="#003d99">Tiendanube</text>
            <text x="310" y="76" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#0059d5">servidor OAuth</text>

            <!-- Node: Dueño tienda -->
            <rect x="470" y="28" width="140" height="64" rx="12" fill="#F0FDF4" stroke="#16a34a" stroke-width="1.5"/>
            <text x="540" y="56" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="600" fill="#15803d">Dueño tienda</text>
            <text x="540" y="76" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#16a34a">aprueba acceso</text>

            <!-- Node: access_token -->
            <rect x="230" y="118" width="160" height="44" rx="10" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>
            <text x="310" y="145" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" fill="#92400e">access_token</text>

            <!-- Path 1: Tu App → Tiendanube -->
            <path id="d-path1" d="M 140 60 H 230" stroke="#0059d5" stroke-width="2" fill="none" marker-end="url(#arr-blue)"/>
            <text x="185" y="50" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="#64748b">1. redirige</text>

            <!-- Path 2: Tiendanube → Dueño -->
            <path id="d-path2" d="M 390 60 H 470" stroke="#0059d5" stroke-width="2" fill="none" marker-end="url(#arr-blue)"/>
            <text x="430" y="50" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="#64748b">2. aprueba</text>

            <!-- Path 3: Dueño → Token (down then left) -->
            <path id="d-path3" d="M 540 92 V 140 H 390" stroke="#007447" stroke-width="2" fill="none" marker-end="url(#arr-green)"/>
            <text x="495" y="128" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="#64748b">3. code →</text>

            <!-- Path 4: Token → Tu App (left then up) -->
            <path id="d-path4" d="M 230 140 H 75 V 92" stroke="#007447" stroke-width="2" fill="none" marker-end="url(#arr-green)"/>
            <text x="135" y="158" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="#64748b">4. ← token</text>
          </svg>
        </div>

        <p class="hero-hint">Usá la barra lateral para navegar entre los pasos ↗</p>
      </section>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <p class="context-banner">
          Esta guía es una <strong>demo educativa</strong>. No reemplaza la
          <a href="https://tiendanube.github.io/api-documentation/" target="_blank" rel="noopener">documentación oficial de Tiendanube</a>.
          Los ejemplos usan Node.js, pero el flujo aplica a cualquier lenguaje.
        </p>

        <div id="steps-container"><!-- Rendered by app.js --></div>

        <section class="errors-section" id="errores">
          <h2 class="errors-header">Errores frecuentes y cómo resolverlos</h2>
          <div class="errors-grid" id="errors-container"><!-- Rendered by app.js --></div>
        </section>
      </main>

      <!-- FOOTER -->
      <footer class="site-footer">
        <span>OAuthFlow · Demo educativa · No es un producto oficial de Tiendanube</span>
        <nav class="footer-links" aria-label="Links del footer">
          <a href="https://tiendanube.github.io/api-documentation/" target="_blank" rel="noopener" class="footer-link-primary">Docs oficiales TN ↗</a>
          <a href="https://github.com" target="_blank" rel="noopener" class="footer-link">GitHub</a>
        </nav>
      </footer>

    </div><!-- /main-wrapper -->
  </div><!-- /layout -->

  <!-- Scripts -->
  <script src="data/steps.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
  <script src="js/app.js"></script>

</body>
```

- [ ] **Step 2: Verify**

Open `index.html`. The SVG diagram with 4 nodes should be visible in the hero (unstyled but present). Sidebar area appears on the left (no styling yet). The old timeline card is gone.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite HTML — sidebar layout, inline SVG OAuth diagram, progress tracker markup"
```

---

### Task 3: Reset, body, header, and layout CSS

**Files:**
- Modify: `css/style.css` — replace lines 46–189 (reset through header section)

- [ ] **Step 1: Replace reset + body + header + layout CSS**

Replace from `/* ─── Reset base ─────... */` through the end of `/* ─── Header ─────... */` section with:

```css
/* ─── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  background: var(--color-bg);
  color: var(--color-text-high);
  -webkit-font-smoothing: antialiased;
}

a { color: var(--color-primary); text-decoration: none; }
a:hover { color: var(--color-primary-hover); text-decoration: underline; }

code {
  font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
  font-size: 0.875em;
  background: var(--color-primary-surface);
  color: var(--color-primary);
  padding: 2px 6px;
  border-radius: 4px;
}

/* ─── Site Header ────────────────────────────────────────── */
.site-header {
  height: var(--header-height);
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-logo { display: flex; align-items: center; gap: 10px; }

.header-logo-icon {
  width: 30px;
  height: 30px;
  background: var(--color-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-logo-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-high);
}

.header-badge {
  font-size: 0.6875rem;
  color: var(--color-text-low);
  background: var(--color-bg);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  font-weight: 500;
}

.header-nav { display: flex; align-items: center; gap: 16px; }

.header-link {
  font-size: 0.875rem;
  color: var(--color-text-low);
  font-weight: 500;
  transition: color 0.15s;
}

.header-link:hover { color: var(--color-primary); text-decoration: none; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--color-text-high);
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  text-decoration: none;
}

.btn-ghost:hover {
  background: var(--color-bg);
  border-color: var(--color-border-strong);
  color: var(--color-text-high);
  text-decoration: none;
}

/* ─── Two-column layout ──────────────────────────────────── */
.layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: calc(100vh - var(--header-height));
  align-items: start;
}

.main-wrapper {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 2: Verify**

Open `index.html`. The header should be styled (glass blur, sticky, GitHub SVG icon). The page should be in a 2-column grid — left side blank (sidebar not styled yet), right side unstyled main content.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "style: reset, body, glass header, two-column grid layout"
```

---

### Task 4: Sidebar CSS

**Files:**
- Modify: `css/style.css` — replace the old Hero section onward with new sidebar CSS first

- [ ] **Step 1: Delete the old CSS from `.hero {` to end of file**

Delete everything from `/* ─── Hero ─────────... */` (currently around line 191) to the end of the file. We will rebuild all sections in tasks 4–8.

- [ ] **Step 2: Append sidebar CSS**

Add to `css/style.css`:

```css
/* ─── Sidebar ────────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  background: var(--color-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
}

.sidebar-steps {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.sidebar-item:hover { background: var(--color-bg); }

.sidebar-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.sidebar-connector-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 32px;
}

.sidebar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  flex-shrink: 0;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.sidebar-circle.pending {
  background: var(--color-card);
  color: var(--color-text-muted);
  border: 2px solid var(--color-border-strong);
}

.sidebar-circle.active {
  background: var(--color-primary);
  color: #fff;
  border: 2px solid transparent;
  box-shadow: 0 0 0 4px var(--color-primary-surface);
}

.sidebar-circle.done {
  background: var(--color-success-surface);
  color: var(--color-success-text);
  border: 2px solid var(--color-success);
}

.sidebar-line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: var(--color-border);
  margin: 4px 0;
  transition: background 0.4s;
}

.sidebar-line.active { background: var(--color-primary); }

.sidebar-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-muted);
  line-height: 1.35;
  padding-top: 6px;
  transition: color 0.25s, font-weight 0.25s;
}

.sidebar-label.active { color: var(--color-primary); font-weight: 600; }
.sidebar-label.done   { color: var(--color-success-text); }

/* Progress tracker */
.sidebar-footer { margin-top: 8px; }

.sidebar-divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 16px 0 14px;
}

.progress-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.progress-track {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
```

- [ ] **Step 3: Verify**

Open `index.html`. The sidebar should now be white, 240px wide, sticky, with a border-right. The step circles will appear once JS renders them (next tasks). The progress track should be visible at the bottom.

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "style: sidebar — sticky column, step circles, connector lines, progress tracker"
```

---

### Task 5: Hero section CSS and diagram animation

**Files:**
- Modify: `css/style.css` — append hero + diagram CSS

- [ ] **Step 1: Append hero and diagram CSS**

```css
/* ─── Hero ───────────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, #EEF5FF 0%, #F8FAFC 55%, #EEF2FF 100%);
  padding: 48px 40px 40px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.hero-eyebrow {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 12px;
  margin-bottom: 16px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-text-high);
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 1.0625rem;
  color: var(--color-text-low);
  max-width: 480px;
  margin: 0 auto 32px;
  line-height: 1.6;
}

.hero-hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 16px;
}

/* ─── OAuth Diagram ──────────────────────────────────────── */
.diagram-wrap {
  max-width: 620px;
  margin: 0 auto;
  padding: 0 16px;
}

.oauth-diagram { display: block; width: 100%; }

@keyframes draw { to { stroke-dashoffset: 0; } }

#d-path1 {
  stroke-dasharray: 92;
  stroke-dashoffset: 92;
  animation: draw 0.45s 0.3s ease forwards;
}

#d-path2 {
  stroke-dasharray: 82;
  stroke-dashoffset: 82;
  animation: draw 0.4s 0.85s ease forwards;
}

#d-path3 {
  stroke-dasharray: 205;
  stroke-dashoffset: 205;
  animation: draw 0.55s 1.4s ease forwards;
}

#d-path4 {
  stroke-dasharray: 210;
  stroke-dashoffset: 210;
  animation: draw 0.55s 2.05s ease forwards;
}

@media (prefers-reduced-motion: reduce) {
  #d-path1, #d-path2, #d-path3, #d-path4 {
    animation: none;
    stroke-dashoffset: 0;
  }
}
```

- [ ] **Step 2: Verify**

Open `index.html` and reload. The hero should have a blue→indigo gradient background. The SVG diagram arrows should animate sequentially: right arrow (Tu App→Tiendanube), then right (Tiendanube→Dueño), then down+left (Dueño→Token), then left+up (Token→Tu App). Open DevTools → toggle `prefers-reduced-motion: reduce` → confirm arrows appear static instantly.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "style: hero gradient + SVG diagram draw animation with prefers-reduced-motion support"
```

---

### Task 6: Step cards CSS and updated renderStep()

**Files:**
- Modify: `css/style.css` — append step card CSS
- Modify: `js/app.js` — replace `renderStep()` + add SVG icon constants

- [ ] **Step 1: Append step card and main content CSS**

```css
/* ─── Main content area ──────────────────────────────────── */
.main-content {
  max-width: var(--content-max-w);
  margin: 0 auto;
  padding: 0 32px 48px;
  width: 100%;
}

.context-banner {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px 20px;
  margin: 24px 0;
  font-size: 0.9375rem;
  color: var(--color-text-low);
  line-height: 1.55;
}

.context-banner a { color: var(--color-primary); font-weight: 600; }

/* ─── Step Card ──────────────────────────────────────────── */
.step-card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  margin-bottom: 16px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.step-card:hover { box-shadow: var(--shadow-md); }

.step-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 2px solid var(--color-primary);
  position: relative;
}

.step-number-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-header-text { flex: 1; }

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-high);
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin-bottom: 3px;
}

.step-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.step-decorative-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-accent);
  opacity: 0.25;
  line-height: 1;
  flex-shrink: 0;
  user-select: none;
  aria-hidden: true;
}

.step-badge {
  display: none;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--color-success-surface);
  color: var(--color-success-text);
  white-space: nowrap;
  flex-shrink: 0;
}

.step-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-description {
  font-size: 0.9375rem;
  color: var(--color-text-low);
  line-height: 1.65;
}

/* Mark-complete button */
.complete-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  align-self: flex-start;
}

.complete-btn:hover { background: var(--color-primary-hover); }
.complete-btn:active { transform: scale(0.98); }
```

- [ ] **Step 2: Replace `renderStep()` in `js/app.js` and add SVG icon constants**

Add these constants before the `renderStep` function (replace lines 11–41):

```javascript
// ─── SVG icon constants ────────────────────────────────────

const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12" aria-hidden="true"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/></svg>`;

const COPY_ICON = `<svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>`;

const COPIED_ICON = `<svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>`;

const INFO_ICON = `<svg class="callout-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd"/></svg>`;

const WARN_ICON = `<svg class="callout-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd"/></svg>`;

// ─── Render step card ──────────────────────────────────────

function renderStep(step) {
  const warningHtml = step.warning
    ? `<div class="warning-inline">${WARN_ICON}${step.warning}</div>`
    : '';
  const stepNum = String(step.id).padStart(2, '0');

  return `
    <article class="step-card" id="paso-${step.id}">
      <div class="step-card-header">
        <div class="step-number-badge">${step.id}</div>
        <div class="step-header-text">
          <div class="step-title">${step.title}</div>
          <div class="step-subtitle">${step.subtitle}</div>
        </div>
        <span class="step-decorative-num" aria-hidden="true">${stepNum}</span>
        <span class="step-badge" id="badge-${step.id}">${CHECK_ICON} Completado</span>
      </div>
      <div class="step-body">
        <p class="step-description">${step.description}</p>
        <div class="code-block">
          <div class="code-block-header">
            <span>${step.codeLabel}</span>
            <button class="copy-btn" data-step="${step.id}" aria-label="Copiar código del paso ${step.id}">
              ${COPY_ICON}<span class="copy-text">Copiar</span>
            </button>
          </div>
          <pre><code class="language-${step.codeLang}">${escapeHtml(step.code)}</code></pre>
        </div>
        ${warningHtml}
        <div class="tip">${INFO_ICON}${step.tip}</div>
        <button class="complete-btn" data-complete="${step.id}">
          ${CHECK_ICON} Marcar como completado
        </button>
      </div>
    </article>
  `;
}
```

- [ ] **Step 3: Verify**

Open `index.html`. The 5 step cards should render with: blue circle badge (1–5), title + subtitle, faint indigo "01"–"05" decorative number on the right, copy button with SVG clipboard icon, green tip with info icon, and blue "Marcar como completado" button at the bottom.

- [ ] **Step 4: Commit**

```bash
git add css/style.css js/app.js
git commit -m "feat: step cards — decorative numbers, SVG icons, mark-complete button"
```

---

### Task 7: Code block, callouts, errors section CSS and updated renderError()

**Files:**
- Modify: `css/style.css` — append code block, callout, errors CSS
- Modify: `js/app.js` — replace `renderError()` and update `initCopyButtons()`

- [ ] **Step 1: Append code block + callout + errors CSS**

```css
/* ─── Code Block ─────────────────────────────────────────── */
.code-block {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.code-block-header {
  background: #1E293B;
  padding: 8px 14px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #94A3B8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-family: 'JetBrains Mono', monospace;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: color 0.15s, background 0.15s;
}

.copy-btn:hover { color: #94A3B8; background: rgba(255,255,255,0.06); }
.copy-btn.copied { color: #6ee7b7; }

.code-block pre[class*="language-"] {
  margin: 0;
  border-radius: 0;
  background: var(--color-code-bg) !important;
  padding: 16px;
  font-size: 0.8125rem;
  line-height: 1.75;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
}

.code-block code[class*="language-"] {
  background: none;
  padding: 0;
  font-size: inherit;
  color: #e2e8f0;
  border-radius: 0;
  font-family: inherit;
}

.token.comment   { color: var(--color-code-comment); }
.token.string    { color: var(--color-code-string); }
.token.variable,
.token.attr-name { color: var(--color-code-var); }
.token.keyword   { color: #c084fc; }
.token.function  { color: #60a5fa; }
.token.number    { color: #fb923c; }
.token.operator  { color: #67e8f9; }
.token.punctuation { color: #67e8f9; }
.token.property  { color: var(--color-code-var); }

/* ─── Callouts ───────────────────────────────────────────── */
.tip,
.warning-inline {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.9rem;
  line-height: 1.55;
}

.tip {
  background: var(--color-success-surface);
  border-left: 3px solid var(--color-success);
  color: var(--color-success-text);
}

.warning-inline {
  background: var(--color-warning-surface);
  border-left: 3px solid var(--color-warning-text);
  color: var(--color-warning-text);
}

.callout-icon { flex-shrink: 0; margin-top: 2px; }

.tip code { background: rgba(0,200,123,0.12); color: var(--color-success-text); }
.warning-inline code { background: rgba(217,119,6,0.12); color: var(--color-warning-text); }

/* ─── Errors section ─────────────────────────────────────── */
.errors-section {
  background: var(--color-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
  margin-bottom: 16px;
}

.errors-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-high);
  letter-spacing: -0.01em;
}

.errors-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 24px;
}

.error-card {
  border-radius: var(--radius-sm);
  padding: 14px;
}

.error-card.danger {
  background: var(--color-danger-surface);
  border: 1px solid #fca5a5;
}

.error-card.warning {
  background: var(--color-warning-surface);
  border: 1px solid #fcd34d;
}

.error-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.error-icon { flex-shrink: 0; }
.error-card.danger .error-icon  { color: var(--color-danger-text); }
.error-card.warning .error-icon { color: var(--color-warning-text); }

.error-code {
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.error-card.danger .error-code  { color: var(--color-danger-text); }
.error-card.warning .error-code { color: var(--color-warning-text); }

.error-cause,
.error-solution {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-low);
}

.error-solution {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.error-card.danger .error-solution  { color: #7f1d1d; }
.error-card.warning .error-solution { color: #78350f; }

.error-card code { background: rgba(0,0,0,0.07); padding: 1px 4px; border-radius: 3px; }
```

- [ ] **Step 2: Replace `renderError()` in `js/app.js`**

Replace the entire `renderError` function (lines 44–53) with:

```javascript
function renderError(error) {
  const isDanger = error.type === 'danger';
  const iconPath = isDanger
    ? 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22z'
    : 'M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z';

  return `
    <div class="error-card ${error.type}">
      <div class="error-card-header">
        <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path fill-rule="evenodd" d="${iconPath}" clip-rule="evenodd"/>
        </svg>
        <span class="error-code">${error.code}</span>
      </div>
      <div class="error-cause">${error.cause}</div>
      <div class="error-solution">${error.solution}</div>
    </div>
  `;
}
```

- [ ] **Step 3: Replace `initCopyButtons()` in `js/app.js`**

Replace the existing `initCopyButtons` function with:

```javascript
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const stepId = parseInt(btn.dataset.step, 10);
      const step   = STEPS.find((s) => s.id === stepId);
      if (!step) return;

      try {
        await navigator.clipboard.writeText(step.code);
        btn.innerHTML = `${COPIED_ICON}<span class="copy-text">¡Copiado!</span>`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `${COPY_ICON}<span class="copy-text">Copiar</span>`;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.innerHTML = `<span class="copy-text">Error al copiar</span>`;
        setTimeout(() => {
          btn.innerHTML = `${COPY_ICON}<span class="copy-text">Copiar</span>`;
        }, 2000);
      }
    });
  });
}
```

- [ ] **Step 4: Verify**

Open `index.html`. Check:
- Code blocks have dark slate header (#1E293B) with JetBrains Mono font + clipboard SVG icon
- Clicking "Copiar" shows the check SVG + "¡Copiado!" for 2s then reverts
- Tip callouts show the info circle icon on the left (inline with text)
- Warning callout on Paso 5 shows triangle icon
- Errors grid shows 2 columns; each card has SVG icon (X for danger, triangle for warning)

- [ ] **Step 5: Commit**

```bash
git add css/style.css js/app.js
git commit -m "style: dark code block header, callout icons, errors 2-col grid with SVG icons; fix copy button innerHTML"
```

---

### Task 8: Footer and responsive CSS

**Files:**
- Modify: `css/style.css` — append footer + media queries

- [ ] **Step 1: Append footer and responsive CSS**

```css
/* ─── Footer ─────────────────────────────────────────────── */
.site-footer {
  background: var(--color-text-high);
  color: var(--color-text-muted);
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

.footer-links { display: flex; gap: 20px; }

.footer-link {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  transition: color 0.15s;
}

.footer-link:hover { color: #e2e8f0; text-decoration: none; }

.footer-link-primary {
  color: var(--color-primary-highlight);
  font-weight: 600;
  font-size: 0.8125rem;
  transition: color 0.15s;
}

.footer-link-primary:hover { color: #fff; text-decoration: none; }

/* ─── Responsive — tablet (768–1023px) ───────────────────── */
@media (max-width: 1023px) {
  .layout { grid-template-columns: 1fr; }

  .sidebar {
    position: sticky;
    top: var(--header-height);
    height: auto;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;
    overflow-x: auto;
    z-index: 40;
  }

  .sidebar-steps {
    flex-direction: row;
    gap: 0;
    flex: 1;
    overflow-x: auto;
  }

  .sidebar-item {
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    min-width: fit-content;
  }

  .sidebar-connector-wrap {
    flex-direction: row;
    align-items: center;
    width: auto;
  }

  .sidebar-line {
    width: 32px;
    height: 2px;
    min-height: unset;
    margin: 0 4px;
  }

  .sidebar-label { padding-top: 0; font-size: 0.75rem; }

  .sidebar-footer { display: none; }

  .hero { padding: 32px 24px; }
  .main-content { padding: 0 24px 40px; }
}

/* ─── Responsive — mobile (< 768px) ─────────────────────── */
@media (max-width: 767px) {
  .hero { padding: 28px 16px; }
  .hero h1 { font-size: 1.875rem; }

  .sidebar { padding: 8px 12px; }
  .sidebar-item { padding: 4px 8px; }
  .sidebar-label { display: none; }
  .sidebar-line { width: 20px; }

  .main-content { padding: 0 16px 32px; }

  .errors-grid { grid-template-columns: 1fr; }

  .site-footer { flex-direction: column; align-items: flex-start; padding: 16px; }

  .header-badge { display: none; }
  .step-decorative-num { display: none; }
}
```

- [ ] **Step 2: Verify at 3 breakpoints with DevTools**

Use browser DevTools responsive mode:
- **1440px**: sidebar is 240px left column + main right ✓
- **900px**: sidebar becomes horizontal tab-strip at top; labels visible; progress tracker hidden ✓
- **375px**: tab-strip shows only numbered circles (labels hidden); errors 1 column; "Guía para partners" badge hidden ✓

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "style: footer dark, responsive — tab-strip tablet, circles-only mobile"
```

---

### Task 9: Sidebar JS — render, navigation, scroll observer

**Files:**
- Modify: `js/app.js` — replace timeline functions with sidebar functions, update `init()`

- [ ] **Step 1: Replace timeline functions with sidebar functions**

Remove: `renderTimeline()` (lines 57–76), `activateStep()` (lines 80–101), `initTimeline()` (lines 103–124), `initScrollObserver()` (lines 127–144).

Add in their place:

```javascript
// ─── State ─────────────────────────────────────────────────
let currentActiveStep = 1;
let completedSteps = new Set(); // expanded with localStorage in task 10

// ─── Sidebar render ────────────────────────────────────────

function renderSidebar() {
  const container = document.getElementById('sidebar-steps');
  if (!container) return;

  let html = '';
  STEPS.forEach((step, index) => {
    const hasLine = index < STEPS.length - 1;
    html += `
      <div class="sidebar-item" data-step="${step.id}"
           role="button" tabindex="0"
           aria-label="Ir al paso ${step.id}: ${step.title}">
        <div class="sidebar-connector-wrap">
          <div class="sidebar-circle pending" id="sc-${step.id}">${step.id}</div>
          ${hasLine ? `<div class="sidebar-line" id="sl-${step.id}"></div>` : ''}
        </div>
        <span class="sidebar-label" id="slabel-${step.id}">${step.title}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ─── Sidebar state ──────────────────────────────────────────

function updateSidebarState(activeStepId) {
  currentActiveStep = activeStepId;

  STEPS.forEach((step) => {
    const circle = document.getElementById(`sc-${step.id}`);
    const label  = document.getElementById(`slabel-${step.id}`);
    const line   = document.getElementById(`sl-${step.id}`);
    if (!circle) return;

    const isDone   = completedSteps.has(step.id);
    const isActive = step.id === activeStepId;

    if (isDone) {
      circle.className = 'sidebar-circle done';
      circle.innerHTML = CHECK_ICON;
    } else if (isActive) {
      circle.className = 'sidebar-circle active';
      circle.textContent = step.id;
    } else {
      circle.className = 'sidebar-circle pending';
      circle.textContent = step.id;
    }

    if (label) {
      label.className = isActive ? 'sidebar-label active'
                      : isDone  ? 'sidebar-label done'
                      :           'sidebar-label';
    }

    if (line) {
      line.className = (step.id < activeStepId || isDone)
        ? 'sidebar-line active'
        : 'sidebar-line';
    }
  });
}

// ─── Sidebar navigation ─────────────────────────────────────

function initSidebar() {
  document.querySelectorAll('.sidebar-item').forEach((item) => {
    const handler = () => {
      const stepId = parseInt(item.dataset.step, 10);
      const target = document.getElementById(`paso-${stepId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateSidebarState(stepId);
      }
    };

    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

// ─── Scroll observer ───────────────────────────────────────

function initScrollObserver() {
  const cards = document.querySelectorAll('.step-card');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepId = parseInt(entry.target.id.replace('paso-', ''), 10);
          updateSidebarState(stepId);
        }
      });
    },
    { threshold: 0.35 }
  );

  cards.forEach((card) => observer.observe(card));
}
```

- [ ] **Step 2: Replace `init()` with sidebar-aware version (without progress calls yet)**

Replace the entire `init()` function with:

```javascript
function init() {
  renderSidebar();

  const stepsContainer = document.getElementById('steps-container');
  if (stepsContainer) {
    stepsContainer.innerHTML = STEPS.map(renderStep).join('');
  }

  const errorsContainer = document.getElementById('errors-container');
  if (errorsContainer) {
    errorsContainer.innerHTML = ERRORS.map(renderError).join('');
  }

  updateSidebarState(1);
  initSidebar();
  initScrollObserver();
  initCopyButtons();

  if (typeof Prism !== 'undefined') Prism.highlightAll();
}
```

- [ ] **Step 3: Verify**

Open `index.html`. The sidebar should now show 5 numbered circles connected by vertical lines with step labels. Paso 1 circle should be blue (active). Clicking any sidebar item scrolls to that step and highlights it blue. Scrolling past a step card should update the active circle.

- [ ] **Step 4: Commit**

```bash
git add js/app.js
git commit -m "feat: sidebar JS — render steps, click navigation, scroll observer replaces timeline"
```

---

### Task 10: Progress tracker and mark-as-complete with localStorage

**Files:**
- Modify: `js/app.js` — replace `completedSteps` declaration, add localStorage functions, `markStepDone()`, `initCompleteButtons()`, update `init()`

- [ ] **Step 1: Replace `let completedSteps = new Set()` declaration with full state block**

Replace the line `let completedSteps = new Set(); // expanded with localStorage in task 10` with:

```javascript
const STORAGE_KEY = 'oauth-flow-completed-steps';
let completedSteps = new Set();
```

- [ ] **Step 2: Add progress and persistence functions before `renderSidebar()`**

Insert after the state declarations and before `renderSidebar()`:

```javascript
// ─── localStorage persistence ───────────────────────────────

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps]));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    completedSteps = new Set(raw ? JSON.parse(raw) : []);
  } catch {
    completedSteps = new Set();
  }
}

function updateProgress() {
  const count = completedSteps.size;
  const total = STEPS.length;
  const pct   = total > 0 ? (count / total) * 100 : 0;

  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  const bar  = document.getElementById('progress-bar');

  if (fill) fill.style.width = `${pct}%`;
  if (text) text.textContent = `${count} de ${total} pasos completados`;
  if (bar)  bar.setAttribute('aria-valuenow', String(count));
}

function restoreCompletedBadges() {
  completedSteps.forEach((stepId) => {
    const badge = document.getElementById(`badge-${stepId}`);
    if (badge) badge.style.display = 'inline-flex';

    const btn = document.querySelector(`.complete-btn[data-complete="${stepId}"]`);
    if (btn) btn.style.display = 'none';
  });
}

// ─── Mark step as done ──────────────────────────────────────

function markStepDone(stepId) {
  if (completedSteps.has(stepId)) return;

  completedSteps.add(stepId);
  saveProgress();
  updateProgress();
  updateSidebarState(currentActiveStep);

  const badge = document.getElementById(`badge-${stepId}`);
  if (badge) badge.style.display = 'inline-flex';

  const btn = document.querySelector(`.complete-btn[data-complete="${stepId}"]`);
  if (btn) btn.style.display = 'none';
}

// ─── Wire complete buttons ──────────────────────────────────

function initCompleteButtons() {
  document.querySelectorAll('.complete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepId = parseInt(btn.dataset.complete, 10);
      markStepDone(stepId);
    });
  });
}
```

- [ ] **Step 3: Replace `init()` with full version that includes progress calls**

Replace `init()` with:

```javascript
function init() {
  loadProgress();
  renderSidebar();

  const stepsContainer = document.getElementById('steps-container');
  if (stepsContainer) {
    stepsContainer.innerHTML = STEPS.map(renderStep).join('');
  }

  const errorsContainer = document.getElementById('errors-container');
  if (errorsContainer) {
    errorsContainer.innerHTML = ERRORS.map(renderError).join('');
  }

  updateSidebarState(1);
  updateProgress();
  restoreCompletedBadges();

  initSidebar();
  initScrollObserver();
  initCopyButtons();
  initCompleteButtons();

  if (typeof Prism !== 'undefined') Prism.highlightAll();
}
```

- [ ] **Step 4: Verify the complete flow**

Open `index.html` and test:
1. Click "Marcar como completado" on Paso 1 → button disappears, green "Completado" badge appears on the card header, Paso 1 circle in sidebar turns green with check icon, progress bar moves to 20%, text reads "1 de 5 pasos completados"
2. Complete Paso 2 → progress bar moves to 40%
3. Hard-reload the page (`Cmd+Shift+R`) → progress is fully restored: green sidebar circles, badges visible, buttons hidden, bar at 40%
4. Open DevTools → Application → Local Storage → confirm key `oauth-flow-completed-steps` contains `[1,2]`

- [ ] **Step 5: Commit**

```bash
git add js/app.js
git commit -m "feat: progress tracker with localStorage persistence — mark complete, restore on reload"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Light mode premium — `#F8FAFC` bg, white cards, slate neutrals
- ✅ Sidebar fijo (240px) — Tasks 3+4+9
- ✅ JetBrains Mono — Task 1 (fonts) + Task 7 (code blocks)
- ✅ Indigo accent `#6366f1` — Task 1 tokens + Task 6 decorative number
- ✅ SVG animated diagram — Task 2 (HTML) + Task 5 (CSS animation)
- ✅ Progress tracker — Task 4 (CSS) + Task 10 (JS + localStorage)
- ✅ Mark as complete button — Task 6 (HTML in renderStep) + Task 10 (JS)
- ✅ `prefers-reduced-motion` — Task 5 (`@media` rule disables SVG animation)
- ✅ Responsive — Task 8 (tab-strip tablet, circles-only mobile)
- ✅ Accessibility — aria-label on sidebar items, aria-current via active class, progressbar role, SVG titles
- ✅ renderError() with SVG icons — Task 7
- ✅ initCopyButtons() uses innerHTML for SVG — Task 7
- ✅ `CHECK_ICON` used in both renderStep (Task 6) and updateSidebarState (Task 9) — consistent name ✓
- ✅ `completedSteps` declared in Task 9 as `new Set()`, expanded in Task 10 with `STORAGE_KEY` — no ReferenceError ✓
- ✅ `init()` in Task 9 doesn't call Task 10 functions; Task 10 replaces `init()` — safe incremental execution ✓
