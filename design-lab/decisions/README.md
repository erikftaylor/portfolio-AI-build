# Decisions

The durable output of Design Lab. Experiments are disposable; decisions are not.

## Why this file exists

A design-lab branch can be abandoned entirely and still be worth having run, if it produced even one decision worth keeping. This log is where that value survives after the branch itself is deleted. Six months from now, this file — not any individual branch — is the record of what Design Lab actually changed about the site.

## Format

```
## DL-<number> — <short decision title>

**Date:**
**Source:** design-lab/<direction> (or: cross-direction synthesis)
**Status:** Proposed / Adopted / Rejected

**Decision:**
<one or two sentences — what was decided>

**Why:**
<the reasoning, especially anything non-obvious a future reader would otherwise have to rediscover>

**Scope:**
<what this touches — a component, a token, a pattern — specific enough that "is this decision still honored?" can be checked later>
```

## Example (illustrative only — not a real decision)

```
## DL-001 — Adopt the editorial direction's type scale sitewide

**Date:** 2026-09-02
**Source:** design-lab/editorial
**Status:** Adopted

**Decision:** Replace the current ad-hoc Tailwind text-size classes with editorial's
defined type scale, applied to both the promoted homepage and every case study.

**Why:** Case-study readability scored highest under this type scale in evaluation
(see /design-lab/evaluations/), independent of whether editorial's overall visual
direction was promoted.

**Scope:** `src/index.css` `@theme` font-size tokens; does not affect color,
motion, or layout.
```

## Rules

- Number decisions sequentially (`DL-001`, `DL-002`, ...) — never reuse a number, even for a rejected decision. The rejection is itself worth recording.
- A winning direction contributing only two or three decisions to the record — with everything else about it discarded — is a completely normal, successful outcome. Do not force a direction to be adopted wholesale just because it produced *some* good ideas.
- Log rejections too, briefly, when the reasoning is non-obvious (e.g. "rejected the floating chatbot orb — it drew attention away from the case-study content it was meant to complement"). A rejected idea with no recorded reason gets re-proposed and re-litigated the next time someone forgets why it didn't work.
