# P0 Runtime Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the AI kill switch, atomic rate limiting, active Cloudflare security headers, and signed ops sessions into production code while preserving a credential-free local workflow for Claude Code.

**Architecture:** Pure JavaScript policy modules hold security decisions and are tested directly with Node's built-in test runner. The Cloudflare Worker orchestrates those modules, a Durable Object serializes counters, and the ops UI uses a signed `HttpOnly` cookie instead of browser-readable bearer material.

**Tech Stack:** Cloudflare Workers and Durable Objects, Web Crypto, React 19, Node 20 built-in test runner, Wrangler 4.

**Spec:** `docs/superpowers/specs/2026-09-08-p0-runtime-security-design.md`

## Global Constraints

- Security behavior must remain visible in committed repository code and `wrangler.jsonc`.
- Local tests must require no paid APIs, network access, or Cloudflare account credentials.
- The front-end chat stays disabled.
- Do not delete `api/`, rewrite Git history, or alter portfolio content.
- Update both a tracked handoff and the current workspace's ignored `CLAUDE.md`.
- Every production behavior begins with a failing test and uses stable public interfaces.

---

### Task 1: Runtime security policy

**Files:**
- Create: `tests/p0-runtime-security.test.mjs`
- Create: `worker/runtime-security.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `AI_PATHS`, `RATE_LIMIT_POLICIES`, `isAiEnabled(env)`, `rateLimitPolicy(request)`, `hashClientKey(request, salt)`, `securityUnavailable()`, `rateLimited(result)`, `withRateLimitHeaders(response, result)`, and `applySecurityHeaders(request, response)`.

- [x] **Step 1: Write failing policy tests**

Cover exact-true AI enablement, endpoint/method policy selection, deterministic privacy-preserving client hashing, JSON `503`/`429` responses, rate-limit response headers, CSP presence, HTML `no-cache`, ops `no-store`, and immutable hashed-asset/font caching.

- [x] **Step 2: Verify the tests fail because the module does not exist**

Run: `node --test tests/p0-runtime-security.test.mjs`

- [x] **Step 3: Implement the pure policy module**

Use Web-standard `Request`, `Response`, `Headers`, `TextEncoder`, and
`crypto.subtle`. Do not import Cloudflare-only packages.

- [x] **Step 4: Add a local test command and verify green**

Add `"test:p0": "node --test tests/p0-*.test.mjs"` and run both the direct
test and `npm run test:p0`.

- [x] **Step 5: Commit**

Commit message: `feat: add runtime security policy`

### Task 2: Atomic Durable Object limiter

**Files:**
- Create: `tests/p0-rate-limiter.test.mjs`
- Create: `worker/rate-limiter.js`
- Modify: `wrangler.jsonc`

**Interfaces:**
- Consumes: policy objects shaped as `{ bucket, limit, windowSeconds }`.
- Produces: `consumeRateLimit(storage, key, policy, nowMs)` and exported
  `RateLimiter` Durable Object class whose `fetch()` accepts JSON
  `{ key, policy, nowMs? }` and returns `{ allowed, limit, remaining, resetAt }`.

- [x] **Step 1: Write failing counter tests**

Exercise first consumption, last allowed request, rejection, reset after the
window, independent keys, and malformed requests.

- [x] **Step 2: Verify red**

Run: `node --test tests/p0-rate-limiter.test.mjs`

- [x] **Step 3: Implement the storage-agnostic counter and DO adapter**

The counter writes the next `{ count, resetAt }` before returning and relies on
Durable Object serialization for atomicity. Malformed adapter input returns
`400` without touching storage.

- [x] **Step 4: Configure the binding and migration**

Set `assets.run_worker_first` to `true`; add `RATE_LIMITER` bindings for default
and staging environments; add a SQLite Durable Object migration; set
`AI_FEATURES_ENABLED` to `"false"` in both environments.

- [x] **Step 5: Verify tests**

Run: `npm run test:p0`. The Wrangler dry run occurs in Task 3 after the
entrypoint exports the Durable Object class.

- [x] **Step 6: Commit**

Commit message: `feat: add atomic worker rate limiter`

### Task 3: Worker routing, feature gate, and active headers

**Files:**
- Create: `tests/p0-worker-app.test.mjs`
- Create: `worker/app.js`
- Modify: `worker/index.js`

**Interfaces:**
- Consumes: handler map, trace handler, `env.ASSETS`, `env.RATE_LIMITER`, and
  Task 1 helpers.
- Produces: `createWorkerApp({ routes, traceHandler })` returning a Worker
  `{ fetch(request, env) }`; `worker/index.js` exports the configured app and
  re-exports `RateLimiter`.

- [x] **Step 1: Write failing Worker-boundary tests**

With real `Request`/`Response` values and small fake bindings, verify disabled
AI requests never call their handler, missing limiter fails closed, exhausted
limits return `429`, allowed requests reach handlers, assets delegate through
`ASSETS`, unknown APIs return `404`, and all responses receive active headers.

- [x] **Step 2: Verify red**

Run: `node --test tests/p0-worker-app.test.mjs`

- [x] **Step 3: Implement the injectable Worker application**

The order is: resolve route → AI gate → rate limit → handler/asset fetch →
security headers. Hash the Cloudflare client IP with `RATE_LIMIT_SALT`; do not
store or log the raw value.

- [x] **Step 4: Wire the production handlers**

Keep `worker/index.js` declarative: import handlers, create the app, export it,
and re-export the Durable Object class.

- [x] **Step 5: Verify green, verify the Worker bundle, and commit**

Run `npm run test:p0` and
`./node_modules/.bin/wrangler deploy --dry-run --env="" --outdir /tmp/portfolio-p0-worker`,
then commit as `feat: protect worker routes and assets`.

### Task 4: Signed ops session backend

**Files:**
- Create: `tests/p0-ops-auth.test.mjs`
- Modify: `worker/_shared/ops-auth.js`
- Modify: `worker/ops/auth.js`
- Modify: `worker/ops/evals.js`
- Modify: `worker/ops/prompts.js`
- Modify: `worker/ops/rag-stats.js`
- Modify: `worker/ops/stats.js`
- Modify: `worker/ops/trace.js`
- Modify: `worker/ops/traces.js`

**Interfaces:**
- Produces: async `createOpsSession(secret, nowMs?)`,
  `verifyOpsSession(token, secret, nowMs?)`, `sessionCookie(token, request)`,
  `expiredSessionCookie(request)`, `constantTimeEqual(a, b)`, and async
  `validateOpsAuth(request)`.
- Auth handler supports `GET` session status, `POST` login, and `DELETE` logout.

- [ ] **Step 1: Write failing authentication tests**

Cover valid, tampered, expired, and missing sessions; cookie flags on HTTPS and
localhost HTTP; constant-time comparison outcomes; generic failed login; login
without configuration; successful login without a returned token; session
status; and logout expiration.

- [ ] **Step 2: Verify red**

Run: `node --test tests/p0-ops-auth.test.mjs`

- [ ] **Step 3: Implement Web Crypto session helpers**

Use HMAC-SHA-256 over a base64url JSON payload containing only `iat`, `exp`,
and `sid`. Validate payload shape and a 30-minute expiry. Never use
`OPS_DASHBOARD_SECRET` as the signing key.

- [ ] **Step 4: Implement GET/POST/DELETE auth behavior**

Read `OPS_DASHBOARD_SECRET` and `OPS_SESSION_SECRET` from the Worker process
environment. Successful POST returns `{ ok: true }` and `Set-Cookie`; it never
returns the password or token in JSON.

- [ ] **Step 5: Await auth validation in protected handlers**

Change every live Worker ops handler to `const auth = await validateOpsAuth(req)`.

- [ ] **Step 6: Verify and commit**

Run `npm run test:p0`, then commit as `feat: replace ops bearer secret with signed session`.

### Task 5: Cookie-session ops client

**Files:**
- Create: `src/ops/auth-client.js`
- Modify: `src/ops/OpsAuth.tsx`
- Modify: `src/ops/hooks/useOpsApi.ts`
- Modify: `src/ops/OpsDashboard.tsx`

**Interfaces:**
- Consumes: `GET`, `POST`, and `DELETE /api/ops/auth` cookie semantics.
- Produces: no browser-readable authentication value; existing ops data cache
  keys remain session-local and contain no credentials.

- [ ] **Step 1: Add failing client-boundary tests**

Extend `tests/p0-ops-auth.test.mjs` against the real `auth-client.js` API.
Assert that session checks, login, authenticated data requests, and logout use
same-origin credentials; login returns only the server's `{ ok }` result;
logout uses DELETE; and a 401 data response is observable without any bearer
token or browser-readable credential. Use a specific in-memory fetch boundary
that validates each request and returns real `Response` values.

- [ ] **Step 2: Verify red**

Run: `node --test tests/p0-ops-auth.test.mjs`.

- [ ] **Step 3: Update the client flow**

Create `auth-client.js` with `checkOpsSession(fetchImpl?)`,
`loginOps(password, fetchImpl?)`, `logoutOps(fetchImpl?)`, and
`fetchOps(url, init?, fetchImpl?)`. `OpsDashboard` begins in a checking state
and calls the session helper. `OpsAuth` posts through `loginOps` and only
consumes `{ ok }`. `useOpsApi` uses `fetchOps`. Logout calls `logoutOps`, clears
only ops data caches, and returns to the login view.

- [ ] **Step 4: Verify P0 tests, TypeScript, and Vite**

Run `npm run test:p0`, `./node_modules/.bin/tsc -b`, and `./node_modules/.bin/vite build`.

- [ ] **Step 5: Commit**

Commit message: `feat: use secure ops cookie sessions`

### Task 6: Configuration, documentation, and Claude Code handoff

**Files:**
- Create: `.dev.vars.example`
- Create: `docs/handoffs/2026-09-08-p0-codex-test.md`
- Modify: `.gitignore`
- Modify: `.env.local.example`
- Modify: `CLAUDE.md` locally (ignored, do not force-add)
- Modify: this plan's checkboxes

**Interfaces:**
- Documents: `AI_FEATURES_ENABLED`, `RATE_LIMIT_SALT`,
  `OPS_DASHBOARD_SECRET`, `OPS_SESSION_SECRET`, and `RATE_LIMITER` behavior.

- [ ] **Step 1: Add safe configuration examples**

Add `!.dev.vars.example` after the existing `.dev.vars.*` ignore. Examples
contain obvious non-secret placeholders and keep AI disabled by default.
Explain that real secrets belong in `.dev.vars` locally and Wrangler secrets
in production.

- [ ] **Step 2: Write the tracked handoff**

Record branch, commits, architecture, changed files, test commands with exact
results, unresolved items, deployment requirements, and the next safe action.

- [ ] **Step 3: Update the local Claude Code entry point**

Append a dated P0 section to the ignored `CLAUDE.md` pointing to the spec,
plan, and handoff. Do not replace existing project guidance.

- [ ] **Step 4: Run final verification**

Run `npm run test:p0`, `./node_modules/.bin/tsc -b`,
`./node_modules/.bin/vite build`, targeted ESLint on all changed JS/TS/TSX
files, `git diff --check`, and `git status --short`.

- [ ] **Step 5: Commit tracked documentation**

Commit message: `docs: hand off P0 runtime security work`
