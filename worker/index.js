/**
 * Worker entry point — routes /api/* to the matching handler; everything
 * else falls through to static assets (see wrangler.jsonc `assets` config).
 *
 * Each handler below was ported from the Vercel Edge Function of the same
 * name under api/. Only two things changed in that port: waitUntil now
 * comes from 'cloudflare:workers' instead of '@vercel/functions', and the
 * Vercel-only `export const config = { runtime: 'edge' }` was dropped.
 * Everything else (process.env, Request/Response, crypto.randomUUID) is
 * Web-standard and needed no changes.
 *
 * Not ported: api/cron/* (scheduled eval job) — not called by the site,
 * doesn't run at request time anyway.
 */
import chatHandler from './chat.js'
import ragSearchHandler from './rag-search.js'
import voiceTokenHandler from './voice-token.js'
import voiceTraceHandler from './voice-trace.js'
import opsAuthHandler from './ops/auth.js'
import opsEvalsHandler from './ops/evals.js'
import opsPromptsHandler from './ops/prompts.js'
import opsRagStatsHandler from './ops/rag-stats.js'
import opsStatsHandler from './ops/stats.js'
import opsTracesHandler from './ops/traces.js'
import opsTraceHandler from './ops/trace.js'
import { createWorkerApp } from './app.js'

export { RateLimiter } from './rate-limiter.js'

const ROUTES = {
  '/api/chat': chatHandler,
  '/api/rag-search': ragSearchHandler,
  '/api/voice-token': voiceTokenHandler,
  '/api/voice-trace': voiceTraceHandler,
  '/api/ops/auth': opsAuthHandler,
  '/api/ops/evals': opsEvalsHandler,
  '/api/ops/prompts': opsPromptsHandler,
  '/api/ops/rag-stats': opsRagStatsHandler,
  '/api/ops/stats': opsStatsHandler,
  '/api/ops/traces': opsTracesHandler,
}

export default createWorkerApp({ routes: ROUTES, traceHandler: opsTraceHandler })
