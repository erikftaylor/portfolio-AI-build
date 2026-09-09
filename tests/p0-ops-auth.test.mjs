import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'

import authHandler from '../worker/ops/auth.js'
import {
  OPS_SESSION_TTL_MS,
  constantTimeEqual,
  createOpsSession,
  expiredSessionCookie,
  sessionCookie,
  validateOpsAuth,
  verifyOpsSession,
} from '../worker/_shared/ops-auth.js'

const originalDashboardSecret = process.env.OPS_DASHBOARD_SECRET
const originalSessionSecret = process.env.OPS_SESSION_SECRET

afterEach(() => {
  restoreEnv('OPS_DASHBOARD_SECRET', originalDashboardSecret)
  restoreEnv('OPS_SESSION_SECRET', originalSessionSecret)
})

test('constant-time password comparison reports equality without prefix matches', () => {
  assert.equal(constantTimeEqual('correct horse', 'correct horse'), true)
  assert.equal(constantTimeEqual('correct horse', 'correct house'), false)
  assert.equal(constantTimeEqual('correct horse', 'correct horse extra'), false)
  assert.equal(constantTimeEqual('', ''), true)
})

test('signed session validates before expiry', async () => {
  const now = 1_700_000_000_000
  const token = await createOpsSession('session-secret-at-least-32-characters', now)
  const session = await verifyOpsSession(token, 'session-secret-at-least-32-characters', now + 1_000)

  assert.equal(session.iat, now)
  assert.equal(session.exp, now + OPS_SESSION_TTL_MS)
  assert.match(session.sid, /^[a-f0-9-]{36}$/)
})

test('tampered and expired sessions are rejected', async () => {
  const now = 1_700_000_000_000
  const secret = 'session-secret-at-least-32-characters'
  const token = await createOpsSession(secret, now)
  const [payload, signature] = token.split('.')
  const tampered = `${payload}.${signature.startsWith('a') ? 'b' : 'a'}${signature.slice(1)}`

  assert.equal(await verifyOpsSession(tampered, secret, now + 1_000), null)
  assert.equal(await verifyOpsSession(token, secret, now + OPS_SESSION_TTL_MS), null)
  assert.equal(await verifyOpsSession('not-a-session', secret, now), null)
})

test('session cookie is browser-only and secure in production', async () => {
  const cookie = sessionCookie('signed-token', new Request('https://example.com/api/ops/auth'))
  assert.match(cookie, /^ops_session=signed-token;/)
  assert.match(cookie, /HttpOnly/)
  assert.match(cookie, /Secure/)
  assert.match(cookie, /SameSite=Strict/)
  assert.match(cookie, /Path=\/api\/ops/)
  assert.match(cookie, /Max-Age=1800/)

  const localCookie = sessionCookie('signed-token', new Request('http://localhost:8787/api/ops/auth'))
  assert.equal(localCookie.includes('Secure'), false)
  assert.match(expiredSessionCookie(new Request('https://example.com/api/ops/auth')), /Max-Age=0/)
})

test('protected ops validation accepts only a valid cookie', async () => {
  process.env.OPS_SESSION_SECRET = 'session-secret-at-least-32-characters'
  const token = await createOpsSession(process.env.OPS_SESSION_SECRET)

  const accepted = await validateOpsAuth(new Request('https://example.com/api/ops/stats', {
    headers: { Cookie: `other=value; ops_session=${token}; theme=dark` },
  }))
  assert.equal(accepted.ok, true)
  assert.match(accepted.session.sid, /^[a-f0-9-]{36}$/)

  const rejected = await validateOpsAuth(new Request('https://example.com/api/ops/stats'))
  assert.equal(rejected.ok, false)
  assert.equal(rejected.response.status, 401)
  assert.match(rejected.response.headers.get('set-cookie'), /Max-Age=0/)
})

test('auth endpoint fails closed when session configuration is absent', async () => {
  process.env.OPS_DASHBOARD_SECRET = 'dashboard-password'
  delete process.env.OPS_SESSION_SECRET

  const response = await authHandler(jsonRequest('https://example.com/api/ops/auth', 'POST', {
    password: 'dashboard-password',
  }))

  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'security_unavailable' })
})

test('auth endpoint returns a generic rejection for a wrong password', async () => {
  configureAuth()
  const response = await authHandler(jsonRequest('https://example.com/api/ops/auth', 'POST', {
    password: 'wrong-password',
  }))

  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), { error: 'invalid_credentials' })
})

test('successful login returns no browser-readable token and supports status and logout', async () => {
  configureAuth()
  const login = await authHandler(jsonRequest('https://example.com/api/ops/auth', 'POST', {
    password: 'dashboard-password',
  }))

  assert.equal(login.status, 200)
  assert.deepEqual(await login.json(), { ok: true })
  const setCookie = login.headers.get('set-cookie')
  assert.match(setCookie, /^ops_session=/)
  assert.match(setCookie, /HttpOnly/)
  assert.equal(setCookie.includes('dashboard-password'), false)

  const cookie = setCookie.split(';')[0]
  const status = await authHandler(new Request('https://example.com/api/ops/auth', {
    headers: { Cookie: cookie },
  }))
  assert.equal(status.status, 200)
  assert.deepEqual(await status.json(), { ok: true })

  const logout = await authHandler(new Request('https://example.com/api/ops/auth', {
    method: 'DELETE',
    headers: { Cookie: cookie },
  }))
  assert.equal(logout.status, 200)
  assert.deepEqual(await logout.json(), { ok: true })
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/)
})

function configureAuth() {
  process.env.OPS_DASHBOARD_SECRET = 'dashboard-password'
  process.env.OPS_SESSION_SECRET = 'session-secret-at-least-32-characters'
}

function jsonRequest(url, method, body) {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}
