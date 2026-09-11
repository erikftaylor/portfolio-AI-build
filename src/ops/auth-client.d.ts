export interface OpsAuthResult {
  ok: boolean
}

export function checkOpsSession(fetchImpl?: typeof fetch): Promise<boolean>
export function loginOps(password: string, fetchImpl?: typeof fetch): Promise<OpsAuthResult>
export function logoutOps(fetchImpl?: typeof fetch): Promise<OpsAuthResult>
export function fetchOps(
  url: string | URL,
  init?: RequestInit,
  fetchImpl?: typeof fetch,
): Promise<Response>
