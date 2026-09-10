# etaylor.co Design System

This portable system supports an editorial portfolio for a senior product designer and enterprise design leader: work that turns ambiguous product problems into defensible decisions and shipped systems. Its visual hierarchy should clarify the argument of each page, not decorate it.

The package is intentionally separate from the live site. It is the source for shared design decisions in GitHub and Figma; it does not yet replace application styles under `src/` or the existing legacy theme profiles.

## Architecture

Tokens move in one direction:

1. **Core** tokens are raw values: color primitives, Instrument Sans typography, spacing, layout, shape, texture, and motion.
2. **Semantic** tokens express a purpose, such as canvas, primary text, a primary action, focus, or status. They provide Parchment and Aubergine modes.
3. **Component** tokens map those roles to repeatable portfolio patterns such as buttons, navigation, evidence frames, decision callouts, and the Direction Band.

Use component tokens in components and semantic tokens for a meaningful UI role. Use core tokens only when defining an alias or an approved brand graphic. This keeps brand expression separate from interface behavior.

## Install and choose a surface

Import the generated CSS once, then put a surface mode on every contextual surface root. Parchment is the default page ground. Aubergine is a deliberate nested narrative shift—for example, a decision, working-principles, or outcome section. These modes coexist within the same page; each component subtree inherits one mode at a time.

```html
<link rel="stylesheet" href="/design-system/tokens/tokens.css">

<main data-et-surface="parchment">
  <section class="portfolio-hero">Portfolio content</section>
  <section data-et-surface="aubergine">Decision narrative</section>
</main>
```

Do not treat these as a global light/dark toggle. Keep the page mostly Parchment, use Aubergine for a meaningful change in narrative, and use raised or subtle surfaces to create hierarchy before adding another card.

Component CSS consumes mappings rather than raw color values:

```css
.button-primary {
  min-height: var(--et-button-shared-min-height);
  padding-inline: var(--et-button-shared-padding-x);
  color: var(--et-button-primary-foreground);
  background: var(--et-button-primary-background);
  border-radius: var(--et-button-shared-radius);
}
```

## Interface hierarchy

Actions have a deliberately restrained hierarchy:

- **Primary**: the one highest-priority action in a context. Use the filled primary mapping; a hero has at most one, with an optional secondary action.
- **Secondary**: an alternative action that needs visible framing. Use the transparent, bordered secondary mapping.
- **Tertiary**: a low-emphasis action. Use an underlined link treatment with a 44 by 44px minimum target.

All interactive controls need visible focus, a 44 by 44px minimum target, and the approved focus-ring token with its offset. Disabled controls do not respond to hover or active input.

## Direction Band: a brand motif, not UI color

The Direction Band represents the design process: **Research → Decide → Design → Ship**. It is four equal-width, 18-degree stripes in that fixed order, with square ends and no outline, keyline, per-stripe animation, recoloring, cropping, or reordering.

Use it as a large brand graphic: once in a hero or major evidence frame, with a second appearance only at a major decision point. Do not use it on every card.

The Direction Band is not buttons, links, navigation, charts, status, form feedback, or a semantic color system. Its signal colors are non-text graphic accents; do not communicate meaning with color alone. The approved focus ring uses Research Cyan and is the intentional Direction Band signal-color exception because it provides a visible, non-text keyboard-focus indicator in both surface modes.

## Typography, layout, and evidence

Instrument Sans is the only system family. Display styles use sentence case; reserve uppercase eyebrows for sparse orientation (no more than one per three sections). Use the supplied display, heading, body, label, eyebrow, and caption component typography mappings instead of introducing a second display or condensed family.

Use the spacing scale and responsive layout tokens: a 1200px page maximum, 680px reading measure, 12/6/4-column desktop/tablet/mobile grids, and the matching responsive edges, gutters, and section rhythm. Surfaces and evidence frames are square; controls and small tags have a 2px radius. Pills are not part of this system, and shadows are reserved for overlays.

Evidence frames are intentionally flexible. They may contain product UI, research artifacts, journey maps, system diagrams, or contextual photography in 4:3 or 16:9 ratios. Give them the approved strong border and caption treatment rather than forcing all evidence into one visual format.

## Motion and accessibility

Use the tokenized 120ms, 220ms, and 360ms durations with the standard easing only when motion helps orientation or feedback. Active controls may move down 1px when motion is allowed. Under `prefers-reduced-motion`, make non-essential transitions immediate and remove movement-based reveals.

Use approved semantic text, surface, status, and focus pairings. Body text must meet 4.5:1 contrast (AAA is preferred); large text must meet 3:1. Direction Band colors are not text colors. Focus must remain visible in both modes, and no status, process, or interaction meaning may rely on color alone.

## Figma workflow

Use [`figma/variables.md`](./figma/variables.md) to create and update the matching Figma source:

1. Create `ET / Core` with its `Value` mode, then add the documented core variable rows.
2. Create `ET / Semantic` and `ET / Component`, each with `Parchment` and `Aubergine` modes; keep aliases and native types aligned with the handoff table.
3. Add the documented Instrument Sans text styles, responsive grid styles, and overlay effect style.
4. Import or update the Direction Band as a component using its fixed process order and permitted placements.
5. When a token changes, update JSON first, regenerate CSS, validate it, then update the corresponding Figma row and confirm one-to-one parity.

## GitHub source of truth

GitHub JSON is the source of truth. Change the token layer that owns the decision—`tokens/core.json`, `tokens/semantic.json`, or `tokens/components.json`—rather than editing generated CSS. Regenerate and verify from the repository root:

```bash
npm run tokens:validate
npm run tokens:build
npm run tokens:test
npm run tokens:check
git diff --check
```

`npm run tokens:check` validates aliases and accessibility rules, regenerates `tokens.css`, confirms CSS parity, and runs the package contracts. A clean regeneration must leave no diff in `design-system/tokens/tokens.css`. Run the scoped ESLint command for modified package JavaScript as part of a change review; the repository-wide lint command may report unrelated application baseline findings.

## Migration boundary

This package does not yet replace live-site styles. A later migration will self-host Instrument Sans, import this CSS into the application, replace legacy variables in shared components, validate responsive pages, and remove old theme profiles only after references reach zero. Keep routes, content, URLs, navigation labels, SEO metadata, accessibility behavior, and analytics hooks stable during that migration.
