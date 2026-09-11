import test from 'node:test'
import assert from 'node:assert/strict'

import { createWorkerApp } from '../worker/app.js'

function createLimiter(result) {
  const calls = []
  return {
    calls,
    idFromName(name) {
      calls.push({ type: 'id', name })
      return `id:${name}`
    },
    get(id) {
      calls.push({ type: 'get', id })
      return {
        async fetch(_url, init) {
          calls.push({ type: 'fetch', body: JSON.parse(init.body) })
          return Response.json(result)
        },
      }
    },
  }
}

function createTestApp(handler) {
  return createWorkerApp({ routes: { '/api/chat': handler } })
}

test('disabled AI route never invokes the paid handler', async () => {
  let calls = 0
  const app = createTestApp(async () => {
    calls++
    return Response.json({ reached: true })
  })

  const response = await app.fetch(
    new Request('https://example.com/api/chat', { method: 'POST' }),
    { AI_FEATURES_ENABLED: 'false' },
  )

  assert.equal(calls, 0)
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'ai_disabled' })
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.match(response.headers.get('content-security-policy'), /default-src 'self'/)
})

test('limited endpoint fails closed when its binding is missing', async () => {
  let calls = 0
  const app = createTestApp(async () => {
    calls++
    return Response.json({ reached: true })
  })

  const response = await app.fetch(
    new Request('https://example.com/api/chat', { method: 'POST' }),
    { AI_FEATURES_ENABLED: 'true', RATE_LIMIT_SALT: 'test-salt' },
  )

  assert.equal(calls, 0)
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'security_unavailable' })
})

test('exhausted limiter returns 429 before invoking the handler', async () => {
  let calls = 0
  const limiter = createLimiter({
    allowed: false,
    limit: 20,
    remaining: 0,
    resetAt: Date.now() + 60_000,
  })
  const app = createTestApp(async () => {
    calls++
    return Response.json({ reached: true })
  })

  const response = await app.fetch(
    new Request('https://example.com/api/chat', {
      method: 'POST',
      headers: { 'cf-connecting-ip': '203.0.113.7' },
    }),
    { AI_FEATURES_ENABLED: 'true', RATE_LIMIT_SALT: 'test-salt', RATE_LIMITER: limiter },
  )

  assert.equal(calls, 0)
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('ratelimit-limit'), '20')
  assert.equal(limiter.calls.some(call => JSON.stringify(call).includes('203.0.113.7')), false)
})

test('allowed request reaches its handler with rate metadata', async () => {
  const limiter = createLimiter({
    allowed: true,
    limit: 20,
    remaining: 19,
    resetAt: 1_900_000_000_000,
  })
  const app = createTestApp(async (_request, env) => {
    return Response.json({ environmentPassed: env.MARKER })
  })

  const response = await app.fetch(
    new Request('https://example.com/api/chat', { method: 'POST' }),
    {
      AI_FEATURES_ENABLED: 'true',
      RATE_LIMIT_SALT: 'test-salt',
      RATE_LIMITER: limiter,
      MARKER: 'yes',
    },
  )

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('ratelimit-remaining'), '19')
  assert.deepEqual(await response.json(), { environmentPassed: 'yes' })
})

test('static requests delegate to assets and receive HTML security policy', async () => {
  const requested = []
  const app = createWorkerApp({ routes: {} })
  const response = await app.fetch(
    new Request('https://example.com/about'),
    {
      ASSETS: {
        async fetch(request) {
          requested.push(request.url)
          return new Response('<h1>About</h1>', { headers: { 'Content-Type': 'text/html' } })
        },
      },
    },
  )

  assert.deepEqual(requested, ['https://example.com/about'])
  assert.equal(await response.text(), '<h1>About</h1>')
  assert.equal(response.headers.get('cache-control'), 'no-cache')
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'self'/)
})

test('unknown API route returns secured JSON 404 without hitting assets', async () => {
  let assetCalls = 0
  const app = createWorkerApp({ routes: {} })
  const response = await app.fetch(
    new Request('https://example.com/api/not-real'),
    { ASSETS: { fetch: async () => { assetCalls++; return new Response('asset') } } },
  )

  assert.equal(assetCalls, 0)
  assert.equal(response.status, 404)
  assert.deepEqual(await response.json(), { error: 'not_found' })
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('dynamic trace path is dispatched to the trace handler', async () => {
  const app = createWorkerApp({
    routes: {},
    traceHandler: async request => Response.json({ path: new URL(request.url).pathname }),
  })
  const response = await app.fetch(
    new Request('https://example.com/api/ops/trace/trace-123'),
    {},
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { path: '/api/ops/trace/trace-123' })
})
