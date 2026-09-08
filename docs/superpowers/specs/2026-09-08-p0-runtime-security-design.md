# P0 Runtime Security Design

**Date:** 2026-09-08  
**Status:** Approved for implementation  
**Workstream:** P0 Codex Test  
**Branch:** `codex/p0-codex-test`

## Goal

Close the four highest-priority production exposures without reducing Claude
Code's ability to understand, run, test, or continue the project locally:

1. make the AI-off state authoritative on the server;
2. limit abuse of paid and sensitive endpoints atomically;
3. apply security and cache headers through the active Cloudflare runtime; and
4. replace the ops dashboard's password-as-token flow with a short-lived,
   signed, browser-only session.

## Non-negotiable constraints

- Security behavior must be represented in committed repository code and
  `wrangler.jsonc`, not only in a provider dashboard.
- Local tests must run without Anthropic, OpenAI, Supabase, Langfuse, Resend,
  or Cloudflare account credentials.
- No normal verification command may mutate production data or call paid APIs.
- `site.identity.json`, the `*-i18n.ts` content files, the article registry,
  and `chatbot-prompt.txt` remain the content sources of truth.
- Existing `CLAUDE.md` guidance remains in place and receives a concise local
  handoff. A tracked handoff document must contain enough context for a fresh
  Claude Code session or clone.
- This work does not delete the legacy `api/` tree, rewrite Git history, or
  combine P1/P2 cleanup into the security change.

## Architecture

### 1. Worker-owned static responses and headers

The Worker will run before all requests. API routes remain explicitly routed;
non-API requests are delegated to `env.ASSETS.fetch(request)`. A small response
policy module will clone the asset or API response and apply headers based on
the request path and content type.

The policy will provide:

- a Content Security Policy matching the resources the live application uses;
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and
  `Permissions-Policy`;
- `frame-ancestors` and `object-src` restrictions through CSP;
- `Cache-Control: public, max-age=31536000, immutable` for hashed assets and
  fonts;
- `Cache-Control: no-cache` for HTML so deployments do not strand visitors on
  stale bundle references; and
- `Cache-Control: no-store` for authentication and ops responses.

Headers are applied in Worker code so local Wrangler runs and production share
the same behavior. Unit tests exercise the policy as a pure function.

### 2. Authoritative AI feature gate

`AI_FEATURES_ENABLED` is read from the Worker environment. Only the exact
string `"true"` enables paid AI routes. The following endpoints return a JSON
`503` response with `Retry-After` when disabled:

- `/api/chat`
- `/api/rag-search`
- `/api/voice-token`
- `/api/voice-trace`

The front-end `CHAT_ENABLED` constant remains off in this branch. Enabling the
UI and enabling the backend are deliberately separate operations. Local tests
pass explicit environment objects and do not depend on shell secrets.

### 3. Atomic endpoint rate limiting

A Cloudflare Durable Object provides one serialized counter namespace. The
Worker derives a privacy-preserving key by hashing the client IP with a secret
salt and combines it with a policy bucket. Raw IP addresses are not stored in
the Durable Object.

Initial policies:

| Bucket | Limit | Window |
|---|---:|---:|
| Text chat | 20 requests | 24 hours |
| RAG search | 60 requests | 24 hours |
| Voice token | 3 requests | 24 hours |
| Voice trace | 120 requests | 24 hours |
| Ops login | 10 attempts | 15 minutes |

The limiter returns `allowed`, `limit`, `remaining`, and `resetAt`. Rejections
use HTTP `429` and include `Retry-After`, `RateLimit-Limit`,
`RateLimit-Remaining`, and `RateLimit-Reset` headers. Successful limited API
responses receive the same informational headers.

If the Durable Object binding is missing, paid AI routes fail closed with a
`503`; the ops login also fails closed. Unit tests use an in-memory namespace
implementing the same small interface. No production bypass header is added.

### 4. Signed ops sessions

`POST /api/ops/auth` accepts the existing dashboard password only for login.
After a successful constant-time comparison, it returns no reusable password
and sets a signed session cookie with:

- `HttpOnly`
- `Secure` outside local development
- `SameSite=Strict`
- `Path=/api/ops`
- a 30-minute lifetime

The cookie payload contains only issued-at time, expiry time, and a random
session identifier. It is authenticated with HMAC-SHA-256 using
`OPS_SESSION_SECRET`; the dashboard password is not used as the signing key.
`DELETE /api/ops/auth` expires the cookie.

Protected ops handlers validate the cookie and expiry. The front end stops
storing `OPS_DASHBOARD_SECRET` or a bearer equivalent in `sessionStorage` and
uses same-origin cookie credentials. A local-only cookie mode is selected from
the request URL, keeping Wrangler development functional without weakening the
production cookie.

### 5. Request validation boundary

The router-level P0 layer owns only gating, rate limiting, and response policy.
It does not rewrite each AI handler. Existing handler behavior stays intact
after a request passes the boundary. Broader payload-schema validation remains
P1 so this branch stays reviewable.

## Modules and responsibilities

- `worker/runtime-security.js`: pure feature-gate, client-key, header, and
  rate-limit response helpers.
- `worker/rate-limiter.js`: Durable Object implementation and policy lookup.
- `worker/_shared/ops-auth.js`: cookie parsing, signing, constant-time compare,
  and protected-request validation.
- `worker/index.js`: orchestration only—route selection, gates, limiter calls,
  asset delegation, and response policy.
- `worker/ops/auth.js`: login/logout HTTP semantics.
- `src/ops/OpsAuth.tsx`, `src/ops/hooks/useOpsApi.ts`, and
  `src/ops/OpsDashboard.tsx`: cookie-session client behavior.
- `wrangler.jsonc`: asset-first routing change, Durable Object binding,
  migrations, and documented non-secret variables.
- `tests/p0-*.test.mjs`: dependency-free Node tests for the new JavaScript
  boundaries.

## Error behavior

- Disabled AI route: `503 { error: "ai_disabled" }`.
- Missing limiter or limiter failure: `503 { error: "security_unavailable" }`.
- Rate limit exhausted: `429 { error: "rate_limited", retryAfter: number }`.
- Invalid ops login: `401` with no indication whether configuration exists.
- Invalid or expired ops session: `401` and an expired session cookie.
- Static asset failure: preserve the asset binding's status/body while still
  applying safe response headers.

Errors must not reveal secrets, raw IP addresses, cookie contents, Durable
Object identifiers, or upstream stack traces.

## Testing strategy

Implementation follows test-driven development:

1. pure Node tests first for feature gates, headers, client-key hashing, rate
   policy selection, signed cookie validation, expiry, and constant-time
   comparison behavior;
2. handler tests for ops login/logout and disabled/rate-limited responses;
3. Worker routing tests using fake asset and limiter bindings;
4. TypeScript and Vite checks for the front end; and
5. a local Wrangler smoke check when the installed toolchain permits it.

Tests must be runnable through committed npm scripts and must not use `npx` to
download undeclared tools. Any pre-existing lint failures outside changed files
are recorded separately; new and modified files must be clean.

## Claude Code handoff

The branch will include `docs/handoffs/2026-09-08-p0-codex-test.md` containing:

- the objective and branch name;
- the approved architecture and invariants;
- files changed and why;
- environment variables and local defaults;
- commands run with their exact outcomes;
- remaining risks or unfinished work; and
- the next safe action.

The local ignored `CLAUDE.md` will point to that tracked handoff and summarize
the new runtime boundaries. This ensures continuity both in the current
workspace and in a fresh Claude Code session that only has committed files.

## Acceptance criteria

- Paid AI endpoints cannot run while the server feature flag is off.
- Paid and login endpoints are atomically rate-limited with correct response
  headers.
- Static, API, ops, and auth responses receive their intended active headers.
- The browser never receives or stores the dashboard password as a token.
- Expired, tampered, or missing ops cookies are rejected.
- Local automated tests require no cloud account or paid API.
- The existing front-end production build still succeeds.
- A tracked and local Claude Code handoff accurately describes the final state.
