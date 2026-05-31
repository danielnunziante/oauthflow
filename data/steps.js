const STEPS = [
  {
    id: 1,
    title: "Registrar tu app en el portal de partners",
    subtitle: "Primer paso obligatorio antes de cualquier implementación",
    description:
      "Antes de implementar el flujo OAuth necesitás registrar tu aplicación en el portal de partners de Tiendanube. Esto te da el <code>client_id</code> y el <code>client_secret</code> que vas a usar en todos los pasos siguientes. El proceso toma menos de 5 minutos.",
    codeLabel: "Variables de entorno (.env)",
    codeLang: "bash",
    code: `# Obtenés estos datos del portal de partners
TIENDANUBE_CLIENT_ID="12345"
TIENDANUBE_CLIENT_SECRET="abc123xyz"
TIENDANUBE_REDIRECT_URI="https://tu-app.com/auth/callback"`,
    tip: "El <code>client_secret</code> nunca debe ir en código frontend ni en un repositorio público. Guardalo como variable de entorno en tu servidor.",
  },
  {
    id: 2,
    title: "Generar la URL de autorización",
    subtitle: "Redirigir al dueño de la tienda para que apruebe el acceso",
    description:
      "Tu app construye una URL especial y redirige al dueño de la tienda a esa dirección. Tiendanube le muestra una pantalla de aprobación donde puede aceptar o rechazar el acceso. Si aprueba, Tiendanube redirige de vuelta a tu <code>redirect_uri</code> con un código temporal.",
    codeLabel: "Node.js — construir la URL de autorización",
    codeLang: "javascript",
    code: `const clientId = process.env.TIENDANUBE_CLIENT_ID;
const redirectUri = process.env.TIENDANUBE_REDIRECT_URI;

const authUrl = new URL(\`https://www.tiendanube.com/apps/\${clientId}/authorize\`);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('redirect_uri', redirectUri);

// Redirigir al dueño de la tienda
res.redirect(authUrl.toString());`,
    tip: "La <code>redirect_uri</code> debe coincidir exactamente con la que registraste en el portal de partners, incluyendo protocolo (<code>http</code> vs <code>https</code>) y cualquier barra al final.",
  },
  {
    id: 3,
    title: "Recibir el callback",
    subtitle: "Tiendanube redirige de vuelta a tu app con un código temporal",
    description:
      "Si el dueño de la tienda aprobó el acceso, Tiendanube hace un GET a tu <code>redirect_uri</code> con un parámetro <code>code</code> en la URL. Ese código es temporal y de un solo uso. Tu servidor lo recibe y lo usa en el siguiente paso para obtener el token definitivo.",
    codeLabel: "Node.js — recibir el callback (Express)",
    codeLang: "javascript",
    code: `app.get('/auth/callback', (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Acceso denegado o error en la autorización.');
  }

  // El code expira en minutos — intercambialo de inmediato
  exchangeCodeForToken(code);
});`,
    tip: "El <code>code</code> es de un solo uso y expira en pocos minutos. Intercambialo por un token inmediatamente — no lo guardes ni lo reutilices.",
  },
  {
    id: 4,
    title: "Intercambiar el código por un token",
    subtitle: "POST a Tiendanube para obtener el access token definitivo",
    description:
      "Tu servidor hace un POST a Tiendanube enviando el <code>code</code> junto con tus credenciales de app. Tiendanube valida todo y responde con un <code>access_token</code> y el <code>user_id</code> de la tienda (que se usa como <code>store_id</code> en los llamados a la API). Este token no expira salvo que la app se desinstale.",
    codeLabel: "Node.js — intercambiar el código por token",
    codeLang: "javascript",
    code: `async function exchangeCodeForToken(code) {
  const response = await fetch('https://www.tiendanube.com/apps/authorize/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.TIENDANUBE_CLIENT_ID,
      client_secret: process.env.TIENDANUBE_CLIENT_SECRET,
      grant_type:    'authorization_code',
      code:          code,
    }),
  });

  const data = await response.json();
  // data.access_token → el token para llamar a la API
  // data.user_id      → el store_id de la tienda
  return data;
}`,
    tip: "Guardá el <code>access_token</code> y el <code>user_id</code> de forma segura. El token no expira hasta que la app sea desinstalada o se emita uno nuevo.",
  },
  {
    id: 5,
    title: "Usar el token para llamar a la API",
    subtitle: "Tu app ya tiene acceso autorizado a los datos de la tienda",
    description:
      "Con el <code>access_token</code> y el <code>user_id</code> ya podés llamar a cualquier endpoint de la API de Tiendanube. Incluí el token en el header <code>Authentication</code> y agregá un <code>User-Agent</code> identificando tu app — ambos son requeridos por la API.",
    codeLabel: "Node.js — llamar a la API con el token",
    codeLang: "javascript",
    code: `async function getProducts(storeId, accessToken) {
  const response = await fetch(
    \`https://api.tiendanube.com/v1/\${storeId}/products\`,
    {
      headers: {
        'Authentication': \`bearer \${accessToken}\`,
        'User-Agent':     'MiApp/1.0 (contacto@miapp.com)',
      },
    }
  );
  return response.json();
}`,
    warning:
      "El header se llama <code>Authentication</code>, no <code>Authorization</code>. Es un detalle específico de Tiendanube que genera muchos errores 401 en la implementación inicial.",
    tip: "El <code>User-Agent</code> es requerido. Usá el nombre de tu app y un email de contacto — Tiendanube lo usa para identificar el origen de los requests.",
  },
];

const ERRORS = [
  {
    code: "401 Unauthorized",
    type: "danger",
    cause: "Token inválido, ausente, o header mal formado.",
    solution:
      "Verificá que el header sea <code>Authentication: bearer TU_TOKEN</code>. El nombre es <code>Authentication</code>, no <code>Authorization</code>.",
  },
  {
    code: "redirect_uri mismatch",
    type: "warning",
    cause: "La URL de callback no coincide con la registrada en el portal.",
    solution:
      "Deben ser idénticas: mismo protocolo, dominio, puerto y barra final. Sin diferencias.",
  },
  {
    code: "invalid_grant",
    type: "warning",
    cause: "El <code>code</code> de autorización ya fue usado o expiró.",
    solution:
      "Reiniciá el flujo OAuth desde el principio. Cada <code>code</code> funciona una sola vez.",
  },
  {
    code: "invalid_client",
    type: "warning",
    cause: "<code>client_id</code> o <code>client_secret</code> incorrectos.",
    solution:
      "Verificá tus credenciales en el portal de partners. Revisá que no haya espacios extra en las variables de entorno.",
  },
];
