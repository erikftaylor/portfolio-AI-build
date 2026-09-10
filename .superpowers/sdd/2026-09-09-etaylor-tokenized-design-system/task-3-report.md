# Task 3 report: Component Mappings and Brand-Use Guardrails

## Implementation summary

- Added all 75 required component token paths to matching Parchment and Aubergine branches: navigation, buttons, hero, case cards, evidence patterns, decision and contact patterns, footer, and Direction Band.
- Added component-only core primitives for 44px controls, navigation (68px height, 32px monogram, 28px link gap), Direction Band geometry (18deg; 8/5/40, 12/6/74, and 22/10/120px), and action-count limits.
- Added `validateTokenBundle(bundle)`, which checks recursive alias resolution, semantic/component mode-path parity, an exact allowlist for signal-dependent semantic/component paths, and required status/signal contrast thresholds.
- Added mutation coverage for direct and transitive chart/form-feedback misuse, arbitrary component misuse, action/navigation misuse, and unresolved aliases.

## Files changed

- `design-system/tokens/core.json`
- `design-system/tokens/components.json`
- `scripts/lib/design-tokens.mjs`
- `tests/design-system-tokens.test.mjs`

## TDD RED / GREEN evidence

- RED: `node --test tests/design-system-tokens.test.mjs` failed before implementation because `validateTokenBundle` was not exported: `SyntaxError: The requested module '../scripts/lib/design-tokens.mjs' does not provide an export named 'validateTokenBundle'` (1 file failed).
- GREEN: after adding the core primitives, component mappings, and validator, the same command passed: 14 tests passed, 0 failed, 0 skipped, with no warnings or diagnostics.

## Verification output

- `node --test tests/design-system-tokens.test.mjs` — 14 passed, 0 failed.
- Independent component audit — `Component parity: 75 paths per mode; aliases resolve; transitive guard rejects status, button, and navigation misuse.`
- `git diff --check` — passed with no output.

## Self-review

- Both component mode trees have the same 75 flattened paths and every required root/path from the brief is present.
- Appearance mappings use mode-local semantic aliases; geometric and count mappings use core aliases. The Direction Band’s four color paths are the only component paths that reference `color.signal.*` directly.
- The validator traces aliases to their final source rather than checking only direct strings. It permits only semantic `color.focus.ring` and the four Direction Band component colors to resolve to signals; `{color.focus.ring}` correctly triggers the boundary rule when assigned elsewhere.
- Status checks require 4.5:1 against each mode’s canvas; all four signals require 3:1 against both grounds.

## Concerns

None.

## Fix Round 1 recovery

### Review finding addressed

Replaced the partial denylist with an exact allowlist for any semantic or component token that directly or transitively resolves to `color.signal.*`. The only approved paths are semantic `color.focus.ring` (the authoritative Research Cyan focus-ring definition) and component `direction-band.{research,decide,design,ship}.color`. Actions, status, buttons, navigation, charts, form feedback, and arbitrary component paths are rejected.

### Covering test

- Test file: `tests/design-system-tokens.test.mjs`
- Command: `node --test tests/design-system-tokens.test.mjs`
- Exact passing output:

```text
✔ core tokens contain the approved brand and Direction Band values (1.154541ms)
✔ core typography uses Instrument Sans without a condensed family (0.640875ms)
✔ core aliases are limited to the approved display-family alias (0.44675ms)
✔ resolveValue rejects an unresolved alias (0.29825ms)
✔ resolveValue rejects a direct circular alias (0.092083ms)
✔ resolveValue rejects an indirect circular alias (0.070167ms)
✔ semantic modes expose identical paths (0.521583ms)
✔ approved semantic pairings meet their contrast thresholds (0.651375ms)
✔ status and Direction Band colors meet their intended-use contrast thresholds (0.425667ms)
✔ component modes expose identical paths (0.290167ms)
✔ all aliases resolve and Direction Band colors stay out of UI semantics (0.91625ms)
✔ validator rejects a Direction Band color used as an action (1.210459ms)
✔ validator rejects a transitive Direction Band color used by navigation (0.96675ms)
✔ validator rejects a Direction Band color used directly by a chart (0.895334ms)
✔ validator rejects a Direction Band color used directly for form feedback (0.825042ms)
✔ validator rejects a Direction Band color used transitively for form feedback (0.8255ms)
✔ validator rejects a Direction Band color used transitively by a chart (0.853416ms)
✔ validator rejects a Direction Band color in an arbitrary component path (0.806291ms)
✔ validator rejects unresolved aliases (0.876083ms)
ℹ tests 19
ℹ suites 0
ℹ pass 19
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 52.898542
```

`git diff --check` also passed with no output.

### Changed files

- `scripts/lib/design-tokens.mjs`
- `tests/design-system-tokens.test.mjs`

The partial `design-system/tokens/core.json` and `design-system/tokens/semantic.json` edits were reverted because the authoritative `color.focus.ring` definition already correctly aliases Research Cyan and is handled as an explicit validator exception.

### Self-review

- Verified the validator checks every flattened semantic and component token in both modes, so future paths cannot bypass the boundary through a naming omission.
- Verified direct and transitive mutations for charts and form feedback, plus an arbitrary non-Direction-Band component path, all produce the boundary error.
- Verified the four Direction Band component colors and semantic focus ring remain valid under the exact allowlist.
