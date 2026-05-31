# OAuthFlow — Guía interactiva de OAuth para Tiendanube

Página web estática que explica el flujo OAuth de Tiendanube paso a paso, con ejemplos de código, errores frecuentes y paleta de colores del design system Nimbus.

> Demo educativa. No es un producto oficial de Tiendanube.

---

## ¿Qué cubre la guía?

1. **Registrar tu app** — portal de partners, client_id y client_secret
2. **Generar la URL de autorización** — redirigir al dueño de la tienda
3. **Recibir el callback** — extraer el code temporal
4. **Intercambiar el código por un token** — POST a Tiendanube
5. **Usar el token para llamar a la API** — headers correctos y primer request

Más una sección de **errores frecuentes**: 401, redirect_uri mismatch, invalid_grant, invalid_client.

---

## Cómo correrlo localmente

No requiere instalación. Abrí el archivo directo en el navegador:

```bash
git clone https://github.com/TU_USUARIO/tiendanube-oauth-flow.git
cd tiendanube-oauth-flow
open index.html        # macOS
# o
start index.html       # Windows
```

---

## Estructura del proyecto

```
├── index.html          # página principal
├── css/style.css       # tokens Nimbus + estilos de componentes
├── js/app.js           # render, timeline interactivo, copy buttons
├── data/steps.js       # contenido de los 5 pasos y 4 errores
└── docs/
    └── oauth-flow.md   # referencia técnica con diagrama Mermaid
```

---

## Tecnologías

- HTML5 / CSS3 / Vanilla JS (ES6+)
- [Prism.js](https://prismjs.com/) — syntax highlighting (CDN)
- [Nimbus Design System](https://nimbus.tiendanube.com) — paleta de colores oficial de Tiendanube

---

## Recursos oficiales

- [Documentación de la API de Tiendanube](https://tiendanube.github.io/api-documentation/)
- [Portal de partners](https://partners.tiendanube.com)
- [Nimbus Design System](https://nimbus.tiendanube.com)
