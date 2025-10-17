/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // 🧠 Developer safety
  reactStrictMode: true,

  // ⚡ Performance
  swcMinify: true,

  // 📜 Scroll compatibility
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // 🧪 Experimental rituals
  experimental: {
    serverActions: true,
  },

  // 🧭 Routing rituals
  trailingSlash: true,

  // 🖼️ Image optimization
  images: {
    domains: ['vauntico.com', 'cdn.vauntico.com', 'res.cloudinary.com'],
  },

  // 🌍 Internationalization
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  // 🔁 Redirect rituals
  async redirects() {
    return [
      {
        source: '/codex',
        destination: '/codex/today',
        permanent: true,
      },
      {
        source: '/vault',
        destination: '/vaults',
        permanent: false,
      },
    ];
  },

  // 🔃 Rewrite rituals
  async rewrites() {
    return [
      {
        source: '/api/webhook',
        destination: 'https://api.vauntico.com/webhook',
      },
    ];
  },

  // 🧪 TypeScript validation
  typescript: {
    ignoreBuildErrors: false,
  },

  // 🧼 Telemetry opt-out (branded)
  telemetry: false,

  // 🧾 Environment-based config
  env: {
    VAUNTICO_ENV: isProd ? 'production' : 'development',
    VAULT_BASE_URL: isProd
      ? 'https://vault.vauntico.com'
      : 'http://localhost:3000',
  },

  // 🧨 Custom error page fallback (optional)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Vauntico-Legacy',
            value: 'true',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;