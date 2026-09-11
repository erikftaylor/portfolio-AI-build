export async function consumeRateLimit(storage, key, policy, nowMs = Date.now()) {
  const storageKey = `${policy.bucket}:${key}`
  const existing = await storage.get(storageKey)
  const windowMs = policy.windowSeconds * 1000
  const current = !existing || nowMs >= existing.resetAt
    ? { count: 0, resetAt: nowMs + windowMs }
    : existing

  if (current.count >= policy.limit) {
    return {
      allowed: false,
      limit: policy.limit,
      remaining: 0,
      resetAt: current.resetAt,
    }
  }

  const next = { count: current.count + 1, resetAt: current.resetAt }
  await storage.put(storageKey, next)

  return {
    allowed: true,
    limit: policy.limit,
    remaining: policy.limit - next.count,
    resetAt: next.resetAt,
  }
}

export class RateLimiter {
  constructor(state) {
    this.storage = state.storage
  }

  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'method_not_allowed' }, { status: 405 })
    }

    try {
      const { key, policy, nowMs } = await request.json()
      if (!isValidRequest(key, policy, nowMs)) {
        return Response.json({ error: 'invalid_rate_limit_request' }, { status: 400 })
      }

      const result = await consumeRateLimit(this.storage, key, policy, nowMs ?? Date.now())
      return Response.json(result)
    } catch {
      return Response.json({ error: 'invalid_rate_limit_request' }, { status: 400 })
    }
  }
}

function isValidRequest(key, policy, nowMs) {
  return typeof key === 'string'
    && key.length > 0
    && key.length <= 256
    && policy
    && typeof policy.bucket === 'string'
    && policy.bucket.length > 0
    && Number.isInteger(policy.limit)
    && policy.limit > 0
    && Number.isInteger(policy.windowSeconds)
    && policy.windowSeconds > 0
    && (nowMs === undefined || (Number.isFinite(nowMs) && nowMs >= 0))
}
