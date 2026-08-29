# Design Lab

## 1. What Design Lab is

A permanent system for exploring radically different visual directions for this portfolio, using isolated Git branches and (optionally) isolated Cloudflare Worker preview deployments. It is infrastructure and process, not a design itself — Design Lab doesn't have an opinion about what the portfolio should look like. It exists so that opinion can be tested cheaply, several ways at once, without risk to the live site at etaylor.co.

## 2. Why it exists

This portfolio is more than a static page: React 19, TypeScript, a chatbot with RAG over the case studies, a voice mode, evals, prompt-injection defenses, SEO/GEO infrastructure, and an ops dashboard all live in this one repository (see [ADR-002](../docs/adr/002-cloudflare-workers-architecture.md) for the deployment architecture). A visual redesign attempted directly on `main` risks that machinery — one bad merge and the chatbot, RAG ingestion, or prerendered SEO output breaks along with the redesign. Design Lab separates "trying a new art direction" from "touching the things that make the site work," so failed experiments cost nothing and successful ones can be promoted deliberately.

## 3. What may change

Design Lab directions have full license to reinterpret: typography, type scale, font pairing, spacing, grids, composition, visual hierarchy, color, surfaces, borders, navigation *presentation*, responsive composition, image treatment, case-study layout, homepage composition, density, visual rhythm, motion, transitions, microinteractions, component styling, information presentation, conversational UI presentation, chatbot visual treatment, and voice-mode presentation.

Each direction should feel like a genuinely different art direction — not a palette swap of the same layout.

## 4. What may not change

Design experiments must not casually modify: identity data, portfolio facts, case-study content, the case-study registry's *structure* (its content can flow through unchanged), RAG content, chatbot persona, prompts, eval datasets, API behavior, Supabase schema, Langfuse instrumentation, security controls, prompt-injection defenses, SEO/GEO content, JSON-LD, sitemap behavior, RSS, voice functionality (the underlying mechanics — its *presentation* is fair game), `/ops`, analytics, environment variables, or deployment secrets.

If a direction genuinely requires touching one of these, **stop and flag it explicitly before doing so** — in the direction's brief under "Risks," and to Erik directly if you're an AI session working in this repo. See §8–9 below for exactly which files this maps to in this codebase.

## 5. Branch naming

```
design-lab/<direction>
```

Examples already scaffolded with briefs in [`directions/`](directions/): `design-lab/editorial`, `design-lab/minimal`, `design-lab/spatial`, `design-lab/brutalist`, `design-lab/experimental`. None of these branches are created yet — see §6.

## 6. Creating an experiment

**Current production baseline: `main`.** This was verified, not assumed — as of this writing `main` is the most recent branch, every other branch in the repository (`cloudflare-workers-port`, `rebrand/erik-identity`, `portfolio-fixes`, `fix/lockfile-identity-leak`, `feat/voice-mode-v2`) is fully merged into it, and its latest commit matches the code actually serving etaylor.co (verified against the live Cloudflare Worker's last-modified timestamp). Re-verify this if a lot of time has passed — branches drift.

By hand:
```bash
git switch main
git pull
git switch -c design-lab/editorial
```

Or via the helper script (does the same three commands, plus copies the direction brief template if one doesn't already exist at `design-lab/directions/<name>.md`):
```bash
npm run lab:new -- editorial
```
(The `--` is required — it's how npm passes `editorial` through to the script instead of trying to parse it as an npm flag.)

Before writing any UI code in a new direction, read that direction's brief in [`directions/`](directions/) and fill in its **Thesis** section for real if it's still a placeholder. A direction without a stated thesis is not ready to implement.

## 7. Using Git worktrees

Worktrees let you run two or more directions side by side without stashing or switching branches back and forth in one working copy. **Optional — not required.** A single working copy with `git switch` between branches works fine if you're only ever looking at one direction at a time.

Recommended layout (siblings, outside this repo):
```
portfolio-AI-build/       (this repo — usually stays on main or one lab branch)
portfolio-labs/
  editorial/
  minimal/
  spatial/
```

Create a worktree:
```bash
git worktree add ../portfolio-labs/editorial design-lab/editorial
cd ../portfolio-labs/editorial
npm install
cp ../../portfolio-AI-build/.env.local .env.local   # env files are gitignored — not shared automatically
```

Each worktree is a fully separate working directory with its own `node_modules` and needs its own `npm install` and its own copy of `.env.local`/`.dev.vars` (see §9 on why these must never be committed). Skip the env copy if you only need the frontend/static parts — the chatbot API routes simply won't have keys and will degrade the same way they do in any environment without them.

Remove a worktree when you're done with it:
```bash
git worktree remove ../portfolio-labs/editorial
```
(Uncommitted changes block removal — commit, stash, or discard them first. `git worktree remove` is safe by default; it won't silently discard work.)

Delete an abandoned branch (only after removing any worktree using it):
```bash
git branch -D design-lab/editorial
```

## 8. Running locally

Each direction runs on Vite's normal dev server, just on a different port so multiple directions can be open in the browser at once:

```bash
# in the main working copy (e.g. on main, as the baseline)
npm run dev                    # localhost:5173

# in the editorial worktree
npm run dev -- -- port 5174    # or just: npm run dev -- --port 5174

# in the spatial worktree
npm run dev -- --port 5175
```
This is Vite's own `--port` flag — nothing custom was built for this, per the instruction not to build a bespoke comparison app. Suggested convention:

| Port | Branch |
|---|---|
| 5173 | current production baseline (`main`) |
| 5174 | first direction being actively worked |
| 5175 | second direction being actively compared |

Reassign as needed — this is a convention, not an enforced mapping.

## 9. Preview deployments

**Production is Cloudflare Workers, not Vercel — verified, not assumed.** `wrangler.jsonc` deploys a Worker named `portfolio-site` with static assets served from `dist/`, and that Worker's custom domains are `etaylor.co` / `www.etaylor.co`. A `vercel.json` and a stale `.vercel/project.json` (pointing at an old `cv-santiago-clone` project) still exist in this repo from the upstream template it was forked from — [ADR-002](../docs/adr/002-cloudflare-workers-architecture.md) documents the move away from Vercel explicitly. There is **no Vercel git integration** connected to this repository (no deployments, commit statuses, or check-runs from Vercel show up on GitHub) and **no Cloudflare Workers Builds git integration** either (only one build on record, from the original migration). Deploys are manual, via `wrangler deploy`, run locally.

Given that, the simplest preview mechanism available *without* introducing new hosting infrastructure is the same pattern the repo already uses for its staging Worker (`portfolio-site-staging`), extended per-direction:

```bash
git switch design-lab/editorial
npm run lab:preview
```

This runs `npm run worker:prerender` (the same build step production uses) and then `wrangler deploy --name portfolio-site-lab-editorial` — a Worker with its own name and its own `*.workers.dev` URL, entirely separate from the `portfolio-site` Worker that owns etaylor.co. Find the exact URL in the Cloudflare dashboard under Workers & Pages, or via `npx wrangler deployments list --name portfolio-site-lab-editorial`.

```
Production (etaylor.co) ── Worker: portfolio-site
        |
        +── design-lab/editorial  ── Worker: portfolio-site-lab-editorial   (*.workers.dev)
        +── design-lab/minimal    ── Worker: portfolio-site-lab-minimal     (*.workers.dev)
        +── design-lab/spatial    ── Worker: portfolio-site-lab-spatial     (*.workers.dev)
```

Note on the API layer: the preview Worker deploys the same `worker/` code as production (chat, RAG, voice, ops routes), since design-lab branches aren't meant to touch that code (§4). It won't have production secrets bound unless you explicitly run `wrangler secret put <NAME> --name portfolio-site-lab-editorial` for that preview — without them, API-dependent features degrade gracefully, the same way the site already documents running without AI keys locally. The chatbot is currently shipped disabled in production anyway (`CHAT_ENABLED = false` in `src/main.tsx`, per ADR-002), so this is a non-issue for now.

## 10. Evaluating a design

Use [`evaluations/TEMPLATE.md`](evaluations/TEMPLATE.md). Copy it to `evaluations/<direction>.md`, fill it out against a direction that's actually running (locally or as a preview) — not from memory or a screenshot. The framework deliberately does not reduce to a single average score; a strong average can hide one disqualifying weakness. Read the qualitative questions at the bottom ("Does the interface outshine the work?", "Does this feel AI-generated?") as seriously as the numeric ones — they're the ones most likely to catch a direction that's technically polished but wrong for this portfolio.

## 11. Updating an experiment

A design-lab branch is a normal branch — commit to it as normal, rebase on `main` if the baseline has moved and you want to pick up unrelated fixes:

```bash
git switch design-lab/editorial
git fetch origin
git rebase origin/main
```

Rebase rather than merge if practical — it keeps each direction's diff against the baseline easy to read with `npm run lab:status` or `git diff main...HEAD --stat`, which matters when several directions exist at once and you're trying to compare them.

## 12. Abandoning an experiment

Before deleting, check whether anything in it is worth a decision entry (§14) — a direction can fail entirely as a whole and still be worth mining for one idea. Once that's done:

```bash
git branch -D design-lab/editorial          # delete the local branch
git push origin --delete design-lab/editorial   # if it was ever pushed
```

If a preview Worker was deployed for it, delete that too so it doesn't linger:
```bash
npx wrangler delete --name portfolio-site-lab-editorial
```

A failed experiment costing "essentially nothing" includes cleaning up after it — an abandoned branch left on the remote or an orphaned preview Worker is a small tax that adds up.

## 13. Combining ideas from multiple experiments

Don't merge one design-lab branch into another directly — their diffs against `main` will conflict in unhelpful ways since they're independent reinterpretations of the same files, not incremental changes to each other. Instead: identify the specific idea (a component, a token set, a layout pattern), and hand-port just that piece into whichever branch is closer to being promoted, or into a fresh branch built specifically to synthesize the winning pieces. Record what was taken from where as a decision entry (§14) so the provenance isn't lost.

## 14. Promoting a winning direction

Promotion is always a deliberate, separate action — nothing in Design Lab auto-promotes (see §15).

1. Make sure the direction's content actually flows through the real data sources (`site.identity.json`, the `*-i18n.ts` files, `articles/registry.ts`) rather than hardcoded placeholder copy introduced during experimentation.
2. Merge (or rebase and fast-forward) the winning `design-lab/*` branch into `main` through a normal PR — same as any other change to this repo.
3. Deploy to production the same way this repo always has: `npm run worker:staging` to check the staging Worker, then `npm run worker:deploy` to promote to `portfolio-site` / etaylor.co.
4. Record the promotion, and the decisions that drove it, in [`decisions/README.md`](decisions/README.md).

## 15. Production QA

Before running `npm run worker:deploy` after a promotion, at minimum:
- `npm run identity:check:strict` — must pass; a promoted direction is a real production deploy, and unfilled placeholders in JSON-LD/`llms.txt` are exactly what this check exists to catch.
- `npm run build` locally, watching for failures anywhere in the pipeline (RAG sync, sitemap/RSS generation, prerender, `validate-prerender.ts`, `validate-articles.ts`) — a visual direction that breaks the prerender step will silently degrade SEO/GEO even if it looks correct in the browser.
- A manual pass over the promoted direction against §4's "what may not change" list — confirm the chatbot, voice mode, and `/ops` still function as before if they were touched at all during promotion.
- Check `npm run worker:staging` output before `npm run worker:deploy` — this staging step already exists in the repo for exactly this reason; Design Lab doesn't change that convention, it just adds more to verify before using it.

## 16. Anti-AI-slop standards

This portfolio is AI-enabled, which makes it more important — not less — to avoid the aesthetic that makes a site look AI-generated. Every direction should actively check itself against this list and be able to say, for each item, "we deliberately don't have this" rather than "we didn't think about it":

purple/blue gradient backgrounds · glowing blobs · decorative orbs · generic glassmorphism · gradient headline text · generic SaaS hero sections · oversized vague headlines · excessive cards · cards nested inside cards · endless rounded rectangles · excessive pill UI · unnecessary badges · generic bento grids · repetitive three-column layouts · decorative dashboards · meaningless metrics · floating UI for visual effect · arbitrary blur · gratuitous shadows · random glow · excessive scroll animation · meaningless parallax · identical spacing everywhere · generic icon+headline+paragraph feature blocks · AI-generated marketing language · visual complexity without hierarchy · trendy treatments without conceptual justification

**Note on the current codebase:** the existing homepage already has a few of these — a two-color cyan/purple gradient system (`--gradient-from`/`--gradient-to` in `src/index.css`), gradient-highlighted headline text (the `*text*`/`+text+`/`**text**` markup system in `App.tsx`'s `renderHighlightedText`), and radial "orb" glow tokens (`--hero-orb-primary`/`--hero-orb-accent`). None of the five scaffolded directions inherit these by default — see each brief's "What This Direction Rejects" section. This is named explicitly so no direction reintroduces them by accident, mistaking "what's already there" for "the correct baseline to build on."

Removing these patterns isn't the goal by itself — replace them with a deliberate choice in typography, composition, proportion, rhythm, hierarchy, contrast, imagery, or motion. **Every direction needs a visual thesis** (its brief's "Thesis" section) that a removed gradient or card grid was standing in for, not a hole where decoration used to be.

Finally: the interface cannot become more important than the work. A hiring manager should be able to quickly tell (1) who Erik is, (2) what kind of designer he is, (3) what he's worked on, (4) how he thinks, (5) what decisions and tradeoffs he made, (6) how AI fits into his practice, and (7) how to reach him. If a direction is technically impressive but makes any of those seven things harder to find than they are today, that's a finding for the evaluation (§10), not a detail to gloss over.

---

## Separating product from presentation

Design Lab operates primarily on **design system** and **presentation**. It should not casually rewrite **content**, **data**, or **functionality**. Mapped to this codebase, as inspected:

| Layer | What it is here | Design Lab may... |
|---|---|---|
| **Content** | `site.identity.json`, `src/i18n.ts` + every `src/*-i18n.ts` file, `chatbot-prompt.txt`, `public/llms.txt`/`humans.txt` | ...render it differently. Not edit the words or the identity values. |
| **Data** | Supabase RAG store + `scripts/export-chunks.ts`/`ingest-rag.ts`, `evals/` datasets, Langfuse traces | ...leave entirely alone. |
| **Functionality** | `worker/` (all `/api/*` routes: chat, RAG search, voice token/trace, ops), `src/ops/*`, `src/useVoiceMode.ts`/`useAudioAnalyser.ts` (voice *mechanics*), the `scripts/` build pipeline, `.github/workflows/*` | ...restyle the *presentation* of anything user-facing here (e.g. the chatbot's visual treatment, voice mode's visual treatment — explicitly invited under §3). Not change routing, request/response behavior, or build steps. |
| **Design system** | `src/index.css` (Tailwind v4 — config lives here via `@theme` and `@layer base`, there is no separate `tailwind.config.js`; the HSL custom-property tokens and color-profile system) | ...reinterpret aggressively. This is Design Lab's primary territory. |
| **Presentation** | `src/App.tsx` (homepage composition), `src/GlobalNav.tsx`, `src/AboutPage.tsx`, `src/PrivacyPolicy.tsx`, the seven case-study components (`*CaseStudy.tsx`), `src/VoiceOrb.tsx`, `src/tech-icons.ts` | ...reinterpret aggressively. This is Design Lab's other primary territory. |

**A boundary worth strengthening, not yet done:** the shared visual/motion primitives a homepage redesign would want to reuse or replace (`StaggerIn`, `CascadeChip`, `AnimatedSection`, `BeamPill`, the `SectionInView` context, `GridSnakes`) currently live inline inside `src/App.tsx` — a single 2,000+ line file that also handles hydration- and prerender-safety concerns documented in its own comments. Extracting them into their own module (e.g. `src/motion-primitives.tsx`) would make it possible to restyle homepage *composition* without having to read the entire file first, and is a small, mechanical, zero-content-risk change. It was deliberately **not done** as part of this setup, because this task was scoped as infrastructure-and-workflow-only and `App.tsx` is exactly the kind of hydration-sensitive file that shouldn't be touched outside of a change specifically reviewed for that risk. Flagged here as a good first candidate for a small, high-leverage PR before or during the first real design-lab experiment that needs it.

---

## 22. Claude Code behavior in Design Lab

This section is also mirrored, in short form, in a repo-root `CLAUDE.md` — that's the file Claude Code sessions read automatically. **This repo's `.gitignore` deliberately excludes `**/CLAUDE.md`** (an existing convention, not something Design Lab changed), so that file is local to whichever machine has it and won't reach other clones, collaborators, or CI. This document is the durable, shared source of truth; treat any local `CLAUDE.md` as a convenience pointer to it, not the other way around.

**When the current branch starts with `design-lab/`, you are in Design Exploration Mode.**

Before changing any UI:
1. Read the matching brief in `design-lab/directions/<name>.md`. If it's still the unfilled template, stop and ask for the thesis rather than inventing one.
2. Skim `src/index.css` and the relevant presentation file(s) (§ table above) so changes build on the actual current design system, not a guess at it.
3. Identify the direction's visual thesis and hold every change up against it — a change that doesn't serve the thesis probably belongs in a different direction, not this one.
4. Preserve product/content truth — content flows from the sources listed as **Content** and **Data** above. Restyle their presentation; don't rewrite, invent, or paraphrase them, and don't fill in placeholder copy on their behalf.
5. Before touching anything listed as **Functionality**, stop and flag it explicitly, per §4 — don't silently "improve" API routes, build scripts, or `/ops` while chasing a visual change.
6. Never deploy to the `portfolio-site` Worker or the etaylor.co custom domains from a `design-lab/*` branch. Use `npm run lab:preview` (§9), which is hard-coded to refuse to do this.
7. When the branch is `main` (or being merged back into it), you are out of Design Exploration Mode and back under this repo's normal rules — including the full "what may not change" list applying at full strength, since promotion is a production change.
