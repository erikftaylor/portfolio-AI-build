import { validateOpsAuth } from '../_shared/ops-auth.js'
import evalResults from './_eval-results.js'

export default async function handler(req) {
  const auth = await validateOpsAuth(req)
  if (!auth.ok) return auth.response

  try {
    return json(evalResults)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
