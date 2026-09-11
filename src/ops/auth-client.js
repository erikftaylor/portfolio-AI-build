async function requestAuth(method, fetchImpl) {
  return fetchImpl('/api/ops/auth', {
    method,
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
}

export async function checkOpsSession(fetchImpl = fetch) {
  const response = await requestAuth('GET', fetchImpl)
  return response.ok
}

export async function loginOps(password, fetchImpl = fetch) {
  const response = await fetchImpl('/api/ops/auth', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ password }),
  })
  const body = await readJson(response)
  if (!response.ok) throw new Error(body.error || 'Authentication failed')
  return { ok: body.ok === true }
}

export async function logoutOps(fetchImpl = fetch) {
  const response = await requestAuth('DELETE', fetchImpl)
  const body = await readJson(response)
  if (!response.ok) throw new Error(body.error || 'Logout failed')
  return { ok: body.ok === true }
}

export function fetchOps(url, init = {}, fetchImpl = fetch) {
  return fetchImpl(url, {
    ...init,
    credentials: 'same-origin',
  })
}

async function readJson(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}
