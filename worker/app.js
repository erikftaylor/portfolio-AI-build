import {
  AI_PATHS,
  applySecurityHeaders,
  hashClientKey,
  isAiEnabled,
  rateLimited,
  rateLimitPolicy,
  securityUnavailable,
  withRateLimitHeaders,
} from './runtime-security.js'

export function createWorkerApp({ routes, traceHandler = null }) {
  return {
    async fetch(request, env = {}) {
      const pathname = new URL(request.url).pathname
      const handler = resolveHandler(pathname, routes, traceHandler)

      if (!handler && pathname.startsWith('/api/')) {
        return secure(request, Response.json({ error: 'not_found' }, { status: 404 }))
      }

      if (!handler) {
        if (!env.ASSETS?.fetch) {
          return secure(request, Response.json({ error: 'assets_unavailable' }, { status: 503 }))
        }
        return secure(request, await env.ASSETS.fetch(request))
      }

      if (AI_PATHS.has(pathname) && !isAiEnabled(env)) {
        return secure(request, Response.json(
          { error: 'ai_disabled' },
          { status: 503, headers: { 'Retry-After': '300' } },
        ))
      }

      const policy = rateLimitPolicy(request)
      let limitResult = null
      if (policy) {
        try {
          limitResult = await consumeBoundRateLimit(request, env, policy)
        } catch {
          return secure(request, securityUnavailable())
        }

        if (!limitResult.allowed) {
          return secure(request, rateLimited(limitResult))
        }
      }

      let response = await handler(request, env)
      if (limitResult) response = withRateLimitHeaders(response, limitResult)
      return secure(request, response)
    },
  }
}

function resolveHandler(pathname, routes, traceHandler) {
  if (traceHandler && pathname.startsWith('/api/ops/trace/')) return traceHandler
  return routes[pathname] || null
}

async function consumeBoundRateLimit(request, env, policy) {
  if (!env.RATE_LIMITER || !env.RATE_LIMIT_SALT) {
    throw new Error('Rate limiting is not configured')
  }

  const key = await hashClientKey(request, env.RATE_LIMIT_SALT)
  const id = env.RATE_LIMITER.idFromName(key)
  const stub = env.RATE_LIMITER.get(id)
  const response = await stub.fetch('https://rate-limiter.internal/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, policy }),
  })

  if (!response.ok) throw new Error('Rate limiter rejected the request')
  const result = await response.json()
  if (!isLimitResult(result)) throw new Error('Rate limiter returned an invalid response')
  return result
}

function isLimitResult(result) {
  return result
    && typeof result.allowed === 'boolean'
    && Number.isInteger(result.limit)
    && Number.isInteger(result.remaining)
    && Number.isFinite(result.resetAt)
}

function secure(request, response) {
  return applySecurityHeaders(request, response)
}
