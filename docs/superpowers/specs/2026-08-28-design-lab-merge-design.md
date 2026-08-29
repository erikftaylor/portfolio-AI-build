# Merge `infra/design-lab` into `main`

## Problem

Erik wants a way to explore multiple, radically different visual styles for
the portfolio without risking or rewriting the content, RAG data, chatbot,
voice mode, or `/ops`. A full framework for exactly this — isolated
`design-lab/*` branches, per-direction preview Workers, direction briefs, an
anti-AI-slop checklist, and explicit promotion rules — already exists on the
`infra/design-lab` branch. It was built once and never merged into `main`.

## Decision

Merge `infra/design-lab` into `main` as-is. Do not build out any direction's
actual styling in this task — that's separate future work once a direction is
chosen. This task only lands the framework.

Rejected alternative: designing a live, visitor-facing theme switcher shipped
in one build. Considered and explicitly turned down in favor of the
explore-then-promote model, which matches how `infra/design-lab` already
works and keeps the live site showing exactly one style at a time.

## What ships

- `design-lab/README.md` — full workflow: branch naming, worktrees, local
  dev ports, preview deploys (`portfolio-site-lab-<direction>`, isolated from
  production's `portfolio-site` Worker), promotion steps, anti-AI-slop
  checklist, and the content/data/functionality/design-system/presentation
  boundary table.
- `design-lab/directions/{editorial,minimal,spatial,brutalist,experimental}.md`
  — five direction briefs with placeholder theses, not built redesigns.
- `design-lab/directions/TEMPLATE.md`, `design-lab/decisions/README.md`,
  `design-lab/evaluations/TEMPLATE.md`, `design-lab/references/README.md`.
- `scripts/design-lab.sh` — helper for `lab:new` / `lab:list` / `lab:status`
  / `lab:preview`, hard-coded to refuse deploying to the production Worker
  name.
- Four new `npm run lab:*` scripts in `package.json`.

No production code, identity data, i18n content, RAG data, or API behavior
changes. Nothing about the live site at etaylor.co changes as a result of
this merge.

## Known conflict risk

`infra/design-lab` branched before commit `e0fd84d` ("Exempt upstream
template attribution from identity-check"), which added an
`identity-check:allow` comment above the upstream-attribution link in
`src/App.tsx`. A real three-way `git merge` should preserve that comment
(the lab branch's diff against its own base never touches that line), but
this must be verified explicitly post-merge rather than assumed.

## Verification

- `src/App.tsx` still contains the `identity-check:allow` comment after
  merging.
- `npm run identity:check:strict` passes.
- `npm run build` passes.
- `package.json` has no duplicated or conflicting script entries.

## Explicitly out of scope

- Filling in any direction's thesis or writing any redesign code.
- Running `lab:preview` (deploys a live preview Worker).
- Any change to `main`'s push/deploy conventions.

## Rollout

Merge on a local working branch first, run verification, then merge into
`main`. Push to `origin` only after explicit confirmation, per this repo's
standing rule that pushes are a confirm-first action.
