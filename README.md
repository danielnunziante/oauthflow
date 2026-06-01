# OAuthFlow — Guía interactiva de OAuth para Tiendanube

Guía paso a paso para que partners y agencias implementen el flujo OAuth de Tiendanube en sus aplicaciones. Incluye ejemplos de código en Node.js, diagrama interactivo del ciclo completo y referencias a los errores más frecuentes.

> Demo educativa. No es un producto oficial de Tiendanube.

---

## ¿Qué cubre la guía?

1. **Registrar tu app** — portal de partners, `client_id` y `client_secret`
2. **Generar la URL de autorización** — redirigir al dueño de la tienda
3. **Recibir el callback** — extraer el `code` temporal
4. **Intercambiar el código por un token** — POST a Tiendanube
5. **Usar el token para llamar a la API** — headers requeridos y primer request

Más una sección de **errores frecuentes**: 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, redirect_uri mismatch, invalid_grant, invalid_client, User-Agent requerido.

---

## Features

- **Diagrama SVG animado** del ciclo OAuth completo
- **Navegación lateral** con scroll tracking automático
- **Progress tracker** — marcá pasos como completados, persiste en `localStorage`
- **Syntax highlighting** en todos los bloques de código
- **Copy button** en cada ejemplo
- **Responsive** — funciona en mobile, tablet y desktop

---

## Cómo correrlo localmente

No requiere instalación ni servidor. Abrí el archivo directo en el navegador:

```bash
git clone git@github.com:danielnunziante/oauthflow.git
cd tiendanube-oauth-flow
open index.html        # macOS
# o
start index.html       # Windows
# o
https://danielnunziante.github.io/oauthflow/
```

---

## Estructura del proyecto

```
├── index.html              # página principal
├── css/
│   └── style.css           # design tokens + todos los estilos
├── js/
│   └── app.js              # sidebar, progress tracker, copy buttons
├── data/
│   └── steps.js            # contenido de los 5 pasos y 8 errores
├── assets/
│   └── images/
│       └── tiendanube.svg  # logo oficial
└── docs/
    └── oauth-flow.md       # referencia técnica con diagrama Mermaid
```

---

## Tecnologías

- HTML5 / CSS3 / Vanilla JS (ES6+) — sin dependencias ni build step
- [Prism.js](https://prismjs.com/) — syntax highlighting (CDN)
- [Google Fonts](https://fonts.google.com/) — Plus Jakarta Sans + JetBrains Mono
- Paleta de colores basada en el [Nimbus Design System](https://nimbus.tiendanube.com) de Tiendanube

---

## Recursos oficiales

- [Documentación de la API de Tiendanube](https://tiendanube.github.io/api-documentation/)
- [Portal de partners](https://partners.tiendanube.com)
- [Nimbus Design System](https://nimbus.tiendanube.com)
