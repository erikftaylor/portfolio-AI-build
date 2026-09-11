import {
  constantTimeEqual,
  createOpsSession,
  expiredSessionCookie,
  sessionCookie,
  validateOpsAuth,
} from '../_shared/ops-auth.js'

export default async function handler(request) {
  if (request.method === 'GET') {
    const auth = await validateOpsAuth(request)
    return auth.ok ? json({ ok: true }) : auth.response
  }

  if (request.method === 'DELETE') {
    const response = json({ ok: true })
    response.headers.set('Set-Cookie', expiredSessionCookie(request))
    return response
  }

  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET, POST, DELETE' })
  }

  const dashboardSecret = process.env.OPS_DASHBOARD_SECRET
  const sessionSecret = process.env.OPS_SESSION_SECRET
  if (!dashboardSecret || !sessionSecret || new TextEncoder().encode(sessionSecret).length < 32) {
    return json({ error: 'security_unavailable' }, 503)
  }

  try {
    const { password } = await request.json()
    if (typeof password !== 'string' || !constantTimeEqual(password, dashboardSecret)) {
      return json({ error: 'invalid_credentials' }, 401)
    }

    const token = await createOpsSession(sessionSecret)
    const response = json({ ok: true })
    response.headers.set('Set-Cookie', sessionCookie(token, request))
    return response
  } catch {
    return json({ error: 'invalid_request' }, 400)
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extraHeaders },
  })
}
