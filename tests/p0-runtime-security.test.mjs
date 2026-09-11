import test from 'node:test'
import assert from 'node:assert/strict'

import {
  applySecurityHeaders,
  hashClientKey,
  isAiEnabled,
  rateLimited,
  rateLimitPolicy,
  securityUnavailable,
  withRateLimitHeaders,
} from '../worker/runtime-security.js'

test('AI features require the exact string true', () => {
  assert.equal(isAiEnabled({ AI_FEATURES_ENABLED: 'true' }), true)
  assert.equal(isAiEnabled({ AI_FEATURES_ENABLED: 'TRUE' }), false)
  assert.equal(isAiEnabled({ AI_FEATURES_ENABLED: '1' }), false)
  assert.equal(isAiEnabled({}), false)
})

test('rate-limit policy applies only to protected endpoint methods', () => {
  assert.deepEqual(
    rateLimitPolicy(new Request('https://example.com/api/chat', { method: 'POST' })),
    { bucket: 'chat', limit: 20, windowSeconds: 86400 },
  )
  assert.deepEqual(
    rateLimitPolicy(new Request('https://example.com/api/rag-search', { method: 'POST' })),
    { bucket: 'rag-search', limit: 60, windowSeconds: 86400 },
  )
  assert.deepEqual(
    rateLimitPolicy(new Request('https://example.com/api/voice-token', { method: 'POST' })),
    { bucket: 'voice-token', limit: 3, windowSeconds: 86400 },
  )
  assert.deepEqual(
    rateLimitPolicy(new Request('https://example.com/api/voice-trace', { method: 'POST' })),
    { bucket: 'voice-trace', limit: 120, windowSeconds: 86400 },
  )
  assert.deepEqual(
    rateLimitPolicy(new Request('https://example.com/api/ops/auth', { method: 'POST' })),
    { bucket: 'ops-login', limit: 10, windowSeconds: 900 },
  )
  assert.equal(rateLimitPolicy(new Request('https://example.com/api/ops/auth')), null)
  assert.equal(rateLimitPolicy(new Request('https://example.com/api/ops/stats')), null)
})

test('client keys are deterministic hashes and never expose the IP', async () => {
  const request = new Request('https://example.com/api/chat', {
    headers: { 'cf-connecting-ip': '203.0.113.42' },
  })
  const first = await hashClientKey(request, 'test-rate-limit-salt')
  const second = await hashClientKey(request, 'test-rate-limit-salt')
  const differentSalt = await hashClientKey(request, 'different-salt')

  assert.match(first, /^[a-f0-9]{64}$/)
  assert.equal(first, second)
  assert.notEqual(first, differentSalt)
  assert.equal(first.includes('203.0.113.42'), false)
})

test('security-unavailable response fails closed without leaking details', async () => {
  const response = securityUnavailable()
  assert.equal(response.status, 503)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), { error: 'security_unavailable' })
})

test('rate-limited response exposes only retry metadata', async () => {
  const nowMs = 1_700_000_000_000
  const response = rateLimited({
    allowed: false,
    limit: 20,
    remaining: 0,
    resetAt: nowMs + 45_000,
  }, nowMs)

  assert.equal(response.status, 429)
  assert.equal(response.headers.get('retry-after'), '45')
  assert.equal(response.headers.get('ratelimit-limit'), '20')
  assert.equal(response.headers.get('ratelimit-remaining'), '0')
  assert.deepEqual(await response.json(), { error: 'rate_limited', retryAfter: 45 })
})

test('successful responses receive rate-limit metadata without changing content', async () => {
  const original = new Response('ok', { status: 201, headers: { 'x-existing': 'yes' } })
  const protectedResponse = withRateLimitHeaders(original, {
    allowed: true,
    limit: 3,
    remaining: 2,
    resetAt: 1_700_000_060_000,
  })

  assert.equal(protectedResponse.status, 201)
  assert.equal(protectedResponse.headers.get('x-existing'), 'yes')
  assert.equal(protectedResponse.headers.get('ratelimit-limit'), '3')
  assert.equal(protectedResponse.headers.get('ratelimit-remaining'), '2')
  assert.equal(await protectedResponse.text(), 'ok')
})

test('HTML receives active security headers and no-cache', () => {
  const response = applySecurityHeaders(
    new Request('https://example.com/about'),
    new Response('<h1>About</h1>', { headers: { 'content-type': 'text/html' } }),
  )

  assert.equal(response.headers.get('cache-control'), 'no-cache')
  assert.equal(response.headers.get('strict-transport-security'), 'max-age=63072000; includeSubDomains; preload')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin')
  assert.equal(response.headers.get('permissions-policy'), 'camera=(), microphone=(self), geolocation=()')
  assert.match(response.headers.get('content-security-policy'), /default-src 'self'/)
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'self'/)
  assert.match(response.headers.get('content-security-policy'), /object-src 'none'/)
})

test('ops and general API responses are never cached', () => {
  const ops = applySecurityHeaders(
    new Request('https://example.com/api/ops/stats'),
    Response.json({ ok: true }),
  )
  const chat = applySecurityHeaders(
    new Request('https://example.com/api/chat', { method: 'POST' }),
    Response.json({ ok: true }),
  )

  assert.equal(ops.headers.get('cache-control'), 'no-store')
  assert.equal(chat.headers.get('cache-control'), 'no-store')
})

test('hashed assets and fonts receive immutable caching', () => {
  const asset = applySecurityHeaders(
    new Request('https://example.com/assets/index-C6CMVt-Z.js'),
    new Response('js'),
  )
  const font = applySecurityHeaders(
    new Request('https://example.com/fonts/dm-sans-latin.woff2'),
    new Response('font'),
  )

  assert.equal(asset.headers.get('cache-control'), 'public, max-age=31536000, immutable')
  assert.equal(font.headers.get('cache-control'), 'public, max-age=31536000, immutable')
})
