export const AI_PATHS = new Set([
  '/api/chat',
  '/api/rag-search',
  '/api/voice-token',
  '/api/voice-trace',
])

export const RATE_LIMIT_POLICIES = Object.freeze({
  chat: Object.freeze({ bucket: 'chat', limit: 20, windowSeconds: 24 * 60 * 60 }),
  'rag-search': Object.freeze({ bucket: 'rag-search', limit: 60, windowSeconds: 24 * 60 * 60 }),
  'voice-token': Object.freeze({ bucket: 'voice-token', limit: 3, windowSeconds: 24 * 60 * 60 }),
  'voice-trace': Object.freeze({ bucket: 'voice-trace', limit: 120, windowSeconds: 24 * 60 * 60 }),
  'ops-login': Object.freeze({ bucket: 'ops-login', limit: 10, windowSeconds: 15 * 60 }),
})

const SECURITY_HEADERS = Object.freeze({
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https:",
    "media-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com https://api.openai.com wss://api.openai.com",
    "frame-src 'self' https://player.mux.com https://www.youtube.com",
    'upgrade-insecure-requests',
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',
})

export function isAiEnabled(env) {
  return env?.AI_FEATURES_ENABLED === 'true'
}

export function rateLimitPolicy(request) {
  if (request.method !== 'POST') return null

  switch (new URL(request.url).pathname) {
    case '/api/chat': return RATE_LIMIT_POLICIES.chat
    case '/api/rag-search': return RATE_LIMIT_POLICIES['rag-search']
    case '/api/voice-token': return RATE_LIMIT_POLICIES['voice-token']
    case '/api/voice-trace': return RATE_LIMIT_POLICIES['voice-trace']
    case '/api/ops/auth': return RATE_LIMIT_POLICIES['ops-login']
    default: return null
  }
}

export async function hashClientKey(request, salt) {
  if (!salt) throw new Error('Rate-limit salt is not configured')

  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const clientIp = request.headers.get('cf-connecting-ip') || forwarded || 'unknown'
  const bytes = new TextEncoder().encode(`${salt}:${clientIp}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export function securityUnavailable() {
  return Response.json(
    { error: 'security_unavailable' },
    { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' } },
  )
}

export function rateLimited(result, nowMs = Date.now()) {
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - nowMs) / 1000))
  return withRateLimitHeaders(
    Response.json(
      { error: 'rate_limited', retryAfter },
      { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retryAfter) } },
    ),
    result,
  )
}

export function withRateLimitHeaders(response, result) {
  const headers = new Headers(response.headers)
  headers.set('RateLimit-Limit', String(result.limit))
  headers.set('RateLimit-Remaining', String(Math.max(0, result.remaining)))
  headers.set('RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)))
  return copyResponse(response, headers)
}

export function applySecurityHeaders(request, response) {
  const headers = new Headers(response.headers)
  const { pathname, protocol } = new URL(request.url)

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (name === 'Strict-Transport-Security' && protocol !== 'https:') continue
    headers.set(name, value)
  }

  if (pathname.startsWith('/api/')) {
    headers.set('Cache-Control', 'no-store')
  } else if (pathname.startsWith('/fonts/') || isHashedAsset(pathname)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (headers.get('content-type')?.includes('text/html')) {
    headers.set('Cache-Control', 'no-cache')
  }

  return copyResponse(response, headers)
}

function isHashedAsset(pathname) {
  return /^\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[A-Za-z0-9]+$/.test(pathname)
}

function copyResponse(response, headers) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
