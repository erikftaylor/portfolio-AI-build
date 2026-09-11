import test from 'node:test'
import assert from 'node:assert/strict'

import { RateLimiter, consumeRateLimit } from '../worker/rate-limiter.js'

class MemoryStorage {
  values = new Map()

  async get(key) {
    return this.values.get(key)
  }

  async put(key, value) {
    this.values.set(key, structuredClone(value))
  }
}

const policy = { bucket: 'chat', limit: 2, windowSeconds: 10 }

test('counter allows requests through the limit and then rejects', async () => {
  const storage = new MemoryStorage()

  assert.deepEqual(await consumeRateLimit(storage, 'client-a', policy, 1_000), {
    allowed: true,
    limit: 2,
    remaining: 1,
    resetAt: 11_000,
  })
  assert.deepEqual(await consumeRateLimit(storage, 'client-a', policy, 2_000), {
    allowed: true,
    limit: 2,
    remaining: 0,
    resetAt: 11_000,
  })
  assert.deepEqual(await consumeRateLimit(storage, 'client-a', policy, 3_000), {
    allowed: false,
    limit: 2,
    remaining: 0,
    resetAt: 11_000,
  })
})

test('counter opens a fresh window at the reset boundary', async () => {
  const storage = new MemoryStorage()
  await consumeRateLimit(storage, 'client-a', policy, 1_000)
  await consumeRateLimit(storage, 'client-a', policy, 2_000)

  assert.deepEqual(await consumeRateLimit(storage, 'client-a', policy, 11_000), {
    allowed: true,
    limit: 2,
    remaining: 1,
    resetAt: 21_000,
  })
})

test('counter isolates clients and policy buckets', async () => {
  const storage = new MemoryStorage()
  const voicePolicy = { bucket: 'voice-token', limit: 1, windowSeconds: 30 }

  await consumeRateLimit(storage, 'client-a', policy, 1_000)
  const otherClient = await consumeRateLimit(storage, 'client-b', policy, 1_000)
  const otherBucket = await consumeRateLimit(storage, 'client-a', voicePolicy, 1_000)

  assert.equal(otherClient.remaining, 1)
  assert.equal(otherBucket.remaining, 0)
  assert.equal(otherBucket.allowed, true)
})

test('Durable Object adapter rejects malformed requests without writing state', async () => {
  const storage = new MemoryStorage()
  const limiter = new RateLimiter({ storage }, {})
  const response = await limiter.fetch(new Request('https://rate-limiter.internal/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: '', policy: { limit: 0 } }),
  }))

  assert.equal(response.status, 400)
  assert.deepEqual(await response.json(), { error: 'invalid_rate_limit_request' })
  assert.equal(storage.values.size, 0)
})

test('Durable Object adapter returns the real counter result', async () => {
  const storage = new MemoryStorage()
  const limiter = new RateLimiter({ storage }, {})
  const response = await limiter.fetch(new Request('https://rate-limiter.internal/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'client-a', policy, nowMs: 5_000 }),
  }))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    allowed: true,
    limit: 2,
    remaining: 1,
    resetAt: 15_000,
  })
})
