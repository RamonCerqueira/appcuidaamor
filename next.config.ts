import type { NextConfig } from "next";

/**
 * Headers de segurança HTTP aplicados globalmente.
 *
 * CORREÇÕES DE SEGURANÇA (P1.1):
 * - X-Frame-Options: Previne clickjacking
 * - X-Content-Type-Options: Previne MIME sniffing
 * - Referrer-Policy: Controla informação de referrer
 * - X-XSS-Protection: Ativa proteção XSS do browser (legacy, mas ainda útil)
 * - Permissions-Policy: Desabilita APIs de browser desnecessárias
 * - Strict-Transport-Security: Força HTTPS (em produção)
 *
 * NOTA: Content-Security-Policy foi omitido intencionalmente pois requer
 * ajuste cuidadoso para não quebrar Next.js (chunks, inline scripts, etc.)
 * e deve ser implementado progressivamente.
 */
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  ...(process.env.NODE_ENV === 'production'
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // Aplica headers em todas as rotas
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
}

export default nextConfig;
