/** Shared signed-session authentication for /api/ops/* endpoints. */

export const OPS_SESSION_TTL_MS = 30 * 60 * 1000
export const OPS_SESSION_COOKIE = 'ops_session'

export function constantTimeEqual(left, right) {
  const leftBytes = new TextEncoder().encode(String(left))
  const rightBytes = new TextEncoder().encode(String(right))
  const length = Math.max(leftBytes.length, rightBytes.length)
  let difference = leftBytes.length ^ rightBytes.length

  for (let index = 0; index < length; index++) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0)
  }

  return difference === 0
}

export async function createOpsSession(secret, nowMs = Date.now()) {
  requireSigningSecret(secret)
  const payload = {
    iat: nowMs,
    exp: nowMs + OPS_SESSION_TTL_MS,
    sid: crypto.randomUUID(),
  }
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const signature = await sign(encodedPayload, secret)
  return `${encodedPayload}.${encodeBase64Url(signature)}`
}

export async function verifyOpsSession(token, secret, nowMs = Date.now()) {
  try {
    requireSigningSecret(secret)
    if (typeof token !== 'string') return null
    const [encodedPayload, encodedSignature, extra] = token.split('.')
    if (!encodedPayload || !encodedSignature || extra) return null

    const key = await importSigningKey(secret)
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    )
    if (!valid) return null

    const payloadText = new TextDecoder().decode(decodeBase64Url(encodedPayload))
    const payload = JSON.parse(payloadText)
    if (!isSessionPayload(payload, nowMs)) return null
    return payload
  } catch {
    return null
  }
}

export function sessionCookie(token, request) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : ''
  return `${OPS_SESSION_COOKIE}=${token}; HttpOnly${secure}; SameSite=Strict; Path=/api/ops; Max-Age=${OPS_SESSION_TTL_MS / 1000}`
}

export function expiredSessionCookie(request) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : ''
  return `${OPS_SESSION_COOKIE}=; HttpOnly${secure}; SameSite=Strict; Path=/api/ops; Max-Age=0`
}

export async function validateOpsAuth(request) {
  const secret = process.env.OPS_SESSION_SECRET
  if (!hasStrongSigningSecret(secret)) {
    return {
      ok: false,
      response: json({ error: 'security_unavailable' }, 503),
    }
  }

  const token = readCookie(request.headers.get('cookie'), OPS_SESSION_COOKIE)
  const session = await verifyOpsSession(token, secret)
  if (!session) {
    const response = json({ error: 'unauthorized' }, 401)
    response.headers.set('Set-Cookie', expiredSessionCookie(request))
    return { ok: false, response }
  }

  return { ok: true, session }
}

/** Langfuse REST API Basic Auth header value. */
export function langfuseAuth() {
  const pk = process.env.LANGFUSE_PUBLIC_KEY
  const sk = process.env.LANGFUSE_SECRET_KEY
  if (!pk || !sk) return null
  return `Basic ${btoa(`${pk}:${sk}`)}`
}

export function langfuseBaseUrl() {
  return process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
}

function hasStrongSigningSecret(secret) {
  return typeof secret === 'string' && new TextEncoder().encode(secret).length >= 32
}

function requireSigningSecret(secret) {
  if (!hasStrongSigningSecret(secret)) {
    throw new Error('OPS_SESSION_SECRET must contain at least 32 bytes')
  }
}

function isSessionPayload(payload, nowMs) {
  return payload
    && Number.isFinite(payload.iat)
    && Number.isFinite(payload.exp)
    && typeof payload.sid === 'string'
    && payload.sid.length > 0
    && payload.iat <= nowMs
    && payload.exp > nowMs
    && payload.exp - payload.iat === OPS_SESSION_TTL_MS
}

function readCookie(header, name) {
  if (!header) return null
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    if (part.slice(0, separator).trim() === name) {
      return part.slice(separator + 1).trim()
    }
  }
  return null
}

function shouldUseSecureCookie(request) {
  const url = new URL(request.url)
  return url.protocol === 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1'
}

async function sign(value, secret) {
  const key = await importSigningKey(secret)
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)))
}

function importSigningKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function encodeBase64Url(bytes) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

function decodeBase64Url(value) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, character => character.charCodeAt(0))
}

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}
