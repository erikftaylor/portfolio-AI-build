# Arc Design System Repository Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Arc Design System into its own private repository and remove its source, tooling, tests, and planning documents from the portfolio repository.

**Architecture:** Copy the self-contained token package and its required Node scripts into `erikftaylor/arc-design-system`, where a lightweight package manifest owns validation. Verify and push that repository before making a separate cleanup commit on the portfolio feature branch. Figma remains unchanged.

**Tech Stack:** Git, GitHub CLI, Node.js built-in test runner, JSON design tokens, generated CSS.

**Spec:** `docs/superpowers/specs/2026-09-10-arc-design-system-repository-split.md`

## Global Constraints

- Keep `erikftaylor/arc-design-system` private.
- Do not modify the Figma file.
- Do not change portfolio application source, content, or runtime dependencies.
- Push and validate the standalone system before deleting its portfolio copy.
- Do not push or merge directly to the portfolio `main` branch.

---

### Task 1: Establish the standalone Arc Design System repository

**Files:**
- Create: `arc-design-system/package.json`
- Create: `arc-design-system/README.md`
- Create: `arc-design-system/design-system/**`
- Create: `arc-design-system/scripts/build-design-tokens.mjs`
- Create: `arc-design-system/scripts/validate-design-tokens.mjs`
- Create: `arc-design-system/scripts/lib/design-tokens.mjs`
- Create: `arc-design-system/tests/design-system-tokens.test.mjs`
- Create: `arc-design-system/docs/superpowers/specs/2026-09-09-etaylor-tokenized-design-system-design.md`
- Create: `arc-design-system/docs/superpowers/specs/2026-09-10-arc-design-system-repository-split.md`
- Create: `arc-design-system/docs/superpowers/plans/2026-09-09-etaylor-tokenized-design-system.md`
- Create: `arc-design-system/docs/superpowers/plans/2026-09-10-arc-design-system-repository-split.md`

**Interfaces:**
- Consumes: the validated source files in the `codex/etaylor-design-system` worktree.
- Produces: a standalone repository where the four `tokens:*` commands own the token lifecycle.

- [ ] **Step 1: Verify the destination is the empty private `erikftaylor/arc-design-system` repository.**

Run: `gh repo view erikftaylor/arc-design-system --json nameWithOwner,isPrivate,url`

Expected: `nameWithOwner` is `erikftaylor/arc-design-system` and `isPrivate` is `true`.

- [ ] **Step 2: Clone the empty destination without overwriting an existing directory.**

Run: `git clone https://github.com/erikftaylor/arc-design-system.git /Users/cerebra/Documents/GitHub/arc-design-system`

Expected: the new directory has `.git` and no copied portfolio application files.

- [ ] **Step 3: Copy only the approved system files and documentation.**

Copy the exact directories/files listed above from the source worktree. Do not copy `src/`, `public/`, portfolio content, or the source app’s dependency manifest.

- [ ] **Step 4: Add a minimal standalone manifest.**

Create `package.json` with this command surface:

```json
{
  "name": "arc-design-system",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "tokens:build": "node scripts/build-design-tokens.mjs",
    "tokens:test": "node --test tests/design-system-tokens.test.mjs",
    "tokens:validate": "node scripts/validate-design-tokens.mjs",
    "tokens:check": "npm run tokens:validate && npm run tokens:build && git diff --exit-code -- design-system/tokens/tokens.css && npm run tokens:test"
  }
}
```

- [ ] **Step 5: Add a root README.**

State that this repository is the source of truth for Arc tokens and Figma handoff, and link to `design-system/README.md`, token commands, and the Figma file URL.

- [ ] **Step 6: Validate the standalone package.**

Run: `npm run tokens:validate && npm run tokens:build && npm run tokens:test && git diff --check`

Expected: validation succeeds, all 36 tests pass, generated CSS is current, and the working tree contains only intentional new files.

- [ ] **Step 7: Commit and push the standalone repository.**

Run: `git add . && git commit -m "feat: establish arc design system" && git push -u origin main`

Expected: the private GitHub repository contains the complete, validated system.

### Task 2: Remove the system from the portfolio branch

**Files:**
- Delete: `design-system/**`
- Delete: `scripts/build-design-tokens.mjs`
- Delete: `scripts/validate-design-tokens.mjs`
- Delete: `scripts/lib/design-tokens.mjs`
- Delete: `tests/design-system-tokens.test.mjs`
- Delete: `docs/superpowers/specs/2026-09-09-etaylor-tokenized-design-system-design.md`
- Delete: `docs/superpowers/specs/2026-09-10-arc-design-system-repository-split.md`
- Delete: `docs/superpowers/plans/2026-09-09-etaylor-tokenized-design-system.md`
- Delete: `docs/superpowers/plans/2026-09-10-arc-design-system-repository-split.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: successful standalone repository push from Task 1.
- Produces: a portfolio branch with no Arc package/tooling/docs and no token package commands.

- [ ] **Step 1: Reconfirm the standalone repository’s pushed commit.**

Run: `git -C /Users/cerebra/Documents/GitHub/arc-design-system log --oneline -1 && git -C /Users/cerebra/Documents/GitHub/arc-design-system status --short`

Expected: a clean working tree with the standalone establishment commit at `HEAD`.

- [ ] **Step 2: Delete only the approved Arc package files in the portfolio worktree.**

Run: `git rm -r -- design-system scripts/build-design-tokens.mjs scripts/validate-design-tokens.mjs scripts/lib/design-tokens.mjs tests/design-system-tokens.test.mjs docs/superpowers/specs/2026-09-09-etaylor-tokenized-design-system-design.md docs/superpowers/specs/2026-09-10-arc-design-system-repository-split.md docs/superpowers/plans/2026-09-09-etaylor-tokenized-design-system.md docs/superpowers/plans/2026-09-10-arc-design-system-repository-split.md`

Expected: only the listed system artifacts are staged for removal.

- [ ] **Step 3: Remove the token commands from the portfolio manifest.**

Delete `tokens:build`, `tokens:test`, `tokens:validate`, and `tokens:check` from `package.json`; leave all other scripts unchanged.

- [ ] **Step 4: Check that there are no operational Arc references left.**

Run: `rg -n 'build-design-tokens|validate-design-tokens|design-system/tokens|tokens:(build|test|validate|check)' package.json scripts tests docs || true`

Expected: no result. Generic narrative references to “design system” in case-study content are allowed.

- [ ] **Step 5: Validate the portfolio remains buildable.**

Run: `npx tsc -b && git diff --check`

Expected: the TypeScript project succeeds and the staged diff has no whitespace errors.

- [ ] **Step 6: Commit and push the portfolio cleanup branch.**

Run: `git add package.json && git commit -m "chore: remove arc design system source" && git push origin codex/etaylor-design-system`

Expected: the cleanup is available on the existing feature branch; `main` is unchanged until a separately approved merge.
