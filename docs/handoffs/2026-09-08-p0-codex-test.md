# P0 Runtime Security Handoff

Date: 2026-09-08

Branch: `codex/p0-codex-test`

The user requested the display name "P0 Codex Test". Git branch names cannot
contain spaces, so the repository-safe branch name is `codex/p0-codex-test`.

## Outcome

This branch moves the P0 security boundary into the Cloudflare Worker without
changing the portfolio's visual design or preventing Claude Code from working
with the repository.

- Paid AI routes are disabled unless `AI_FEATURES_ENABLED` is exactly `true`.
- Every request, including static assets, passes through the Worker so security
  and cache headers are applied consistently.
- Paid AI and ops routes use an atomic Durable Object rate limiter keyed by a
  salted hash of the client address.
- `/ops` authentication now exchanges the dashboard password for a signed,
  30-minute, `HttpOnly`, `Secure`, `SameSite=Strict` cookie. The password is no
  longer retained in browser storage or sent as a bearer token on every call.
- A credential-free P0 test suite covers the policy, limiter, Worker boundary,
  signed sessions, and browser client behavior.

## Commits

- `4ebb7ec` — `docs: define P0 runtime security design`
- `c2eaf0e` — `docs: plan P0 runtime security implementation`
- `7b48f6c` — `feat: add runtime security policy`
- `e9ec110` — `feat: add atomic worker rate limiter`
- `c97b4c6` — `feat: protect worker routes and assets`
- `6ab91fd` — `feat: replace ops bearer secret with signed session`
- `ef8d8af` — `feat: use secure ops cookie sessions`
- `245009d` — `test: update ops integration auth contract`
- The final documentation/configuration commit contains this handoff.

## Architecture

`worker/index.js` declares the route table and delegates to the injectable app
in `worker/app.js`. The app performs these checks in order:

1. Resolve the request to an API policy or a static-asset fallback.
2. Reject paid AI routes when the server-side kill switch is off.
3. Hash the client key with `RATE_LIMIT_SALT` and atomically consume the route's
   Durable Object allowance.
4. Run the route handler or fetch the asset from `env.ASSETS`.
5. Apply security and cache headers to the response.

The limiter implementation lives in `worker/rate-limiter.js`; pure policy and
header helpers live in `worker/runtime-security.js`. Ops session creation and
validation live in `worker/_shared/ops-auth.js`. The browser-side session API is
centralized in `src/ops/auth-client.js`.

## Configuration

For local Worker development, copy `.dev.vars.example` to `.dev.vars` and
replace the placeholders. Never commit `.dev.vars`.

For production, configure these as Wrangler secrets except for the feature
flag:

- `AI_FEATURES_ENABLED`: keep `false` until paid AI calls are intentionally
  enabled; only the exact string `true` enables them.
- `RATE_LIMIT_SALT`: random secret of at least 32 characters.
- `OPS_SESSION_SECRET`: a different random secret of at least 32 characters.
- `OPS_DASHBOARD_SECRET`: the password entered on `/ops`.
- `ANTHROPIC_API_KEY` and other service credentials remain required only for
  the routes that use them.

The `RATE_LIMITER` Durable Object binding and its first SQLite migration are
declared in `wrangler.jsonc`; a normal Worker deployment applies them.

The front-end `CHAT_ENABLED` setting in `src/main.tsx` remains a separate UI
decision. Enabling the Worker flag does not display the chat, and displaying
the chat does not bypass the Worker flag.

## Verification

Final verification on 2026-09-08:

- `npm run test:p0` — 33 tests passed, 0 failed.
- `./node_modules/.bin/tsc -b` — passed.
- `./node_modules/.bin/vite build` — passed; 2,977 modules transformed.
- Targeted ESLint over every changed JavaScript/TypeScript source and test —
  passed.
- Worker dry-run deployment — passed; 61 assets and all expected bindings were
  recognized.
- Browser source scan for `ops_token` or bearer authorization — no matches.
- `git diff --check` — passed.

A local Wrangler smoke test was also completed with throwaway credentials. Ten
end-to-end checks passed against the real Worker runtime:

- HTML delivery with CSP and `no-cache`.
- Immutable caching for a built, hashed asset.
- Server-side AI shutdown before the paid handler.
- Secured JSON handling for an unknown API route.
- Rejection of an unauthenticated protected ops request.
- Generic rejection and rate-limit metadata for a wrong ops password.
- Successful exchange for a signed `HttpOnly` session cookie with no token in
  the response body.
- Successful session-status request using that cookie.
- `429 Too Many Requests` with retry metadata after repeated login attempts.
- Logout response clearing the browser cookie.

The Worker request log contained the expected statuses and no runtime errors.
The local server was stopped after the test, and `npm run test:p0` was green
again afterward.

The repository-wide `npm run lint` still reports pre-existing findings outside
this P0 change. The targeted lint command below is the clean signal for this
branch.

`npm run test:ops` remains a live integration check that requires a running
Worker plus configured service credentials. Its contract was updated to the
cookie session flow, but it was not counted as a credential-free passing test.
`npm run test:contract` likewise requires live Langfuse credentials.

```sh
./node_modules/.bin/eslint \
  worker/runtime-security.js \
  worker/rate-limiter.js \
  worker/app.js \
  worker/index.js \
  worker/_shared/ops-auth.js \
  worker/ops/auth.js \
  worker/ops/evals.js \
  worker/ops/prompts.js \
  worker/ops/rag-stats.js \
  worker/ops/stats.js \
  worker/ops/trace.js \
  worker/ops/traces.js \
  src/ops/auth-client.js \
  src/ops/OpsAuth.tsx \
  src/ops/hooks/useOpsApi.ts \
  src/ops/OpsDashboard.tsx \
  tests/p0-runtime-security.test.mjs \
  tests/p0-rate-limiter.test.mjs \
  tests/p0-worker-app.test.mjs \
  tests/p0-ops-auth.test.mjs \
  tests/ops-dashboard.test.ts
```

## Compatibility and Known Follow-ups

- `CLAUDE.md` remains intentionally ignored. A local dated section was appended
  with links to the design, plan, and this handoff; it was not force-added.
- No Claude Code hooks, settings, permissions, commands, or memory formats were
  changed.
- `worker/voice-token.js` retains its older Supabase-backed voice quota as a
  second, stricter guard. The new Durable Object limit is the authoritative
  perimeter check. Removing the legacy quota can be considered separately
  after production observation.
- No deployment or secret rotation has been performed from this branch.

## Next Safe Action

Review this branch against `main`, provision the three security secrets in the
target Cloudflare environment, keep `AI_FEATURES_ENABLED=false`, then perform a
staging deployment and exercise `/`, a hashed asset, a disabled AI route, and
the `/ops` login/logout flow. Enable paid AI only after that staging check.
