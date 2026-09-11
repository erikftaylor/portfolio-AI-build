# Arc Design System Repository Split

## Goal

Make the Arc Design System an independently owned, private GitHub repository and remove all operational and planning artifacts for it from `portfolio-AI-build` without changing the portfolio application.

## Source and destination

The complete source of truth moves from the `codex/etaylor-design-system` worktree of `portfolio-AI-build` to the private `erikftaylor/arc-design-system` repository. The Figma library remains the shared design reference; its file is not duplicated or modified by this repository split.

## Standalone repository contents

The new repository contains:

- `design-system/` — token JSON, generated CSS, Figma variable handoff, and usage guidance.
- `scripts/build-design-tokens.mjs`, `scripts/validate-design-tokens.mjs`, and `scripts/lib/design-tokens.mjs` — deterministic token build and validation tools.
- `tests/design-system-tokens.test.mjs` — token contract, generated-output, accessibility, and component-state regression tests.
- `docs/superpowers/specs/2026-09-09-etaylor-tokenized-design-system-design.md` and `docs/superpowers/plans/2026-09-09-etaylor-tokenized-design-system.md` — the original design decisions and implementation history.
- A minimal `package.json` with `tokens:build`, `tokens:validate`, `tokens:test`, and `tokens:check` commands, plus a root README that explains the repository boundary.

No portfolio application source, portfolio dependencies, content exports, or site-specific tools move to the standalone repository.

## Portfolio repository cleanup

After the standalone repository passes token validation, build, and test commands and has been pushed successfully, the portfolio branch removes:

- the `design-system/` directory;
- the three token tool files and their supporting library;
- the token regression test;
- the four `tokens:*` package scripts;
- the design-system specification, implementation plan, and this repository-split specification.

Documentation prose elsewhere may retain generic references to a product team’s design system where it describes past work; it is not the Arc package and will not be edited.

## Safety and verification

The system is copied rather than moved until the standalone repository is committed and pushed. The standalone repository must pass `npm run tokens:validate`, `npm run tokens:build`, and `npm run tokens:test`. The portfolio cleanup is then checked for stale package commands or imports and its normal type check is run. Both repositories receive separate commits. The portfolio cleanup lands on the current feature branch; it does not directly alter `main`.

## Out of scope

- Modifying the Figma file or its variables/components.
- Publishing an npm package.
- Changing the portfolio’s visual styling or runtime behavior.
- Rewriting git history; removed files remain recoverable through history.
