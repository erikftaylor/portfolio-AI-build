# Spatial

## Thesis
Content exists in layered depth rather than a single scrolling column — foreground/background relationships and motion communicate hierarchy and relatedness, so moving through the site feels like moving through a considered space, not down a page.

## Why This Direction Exists
The current homepage already gestures at depth (canvas dot-grid behind the hero, `AnimatedSection`'s in-view reveal system, a sticky floating TOC) but every section still resolves to the same flat centered-column composition. Spatial asks what happens if depth and layering become the actual structuring device instead of a background effect on top of a conventional layout.

## Visual Principles
- Real z-axis relationships: background context, mid-ground content, foreground focal elements — used to group related information, not just for visual interest.
- Motion communicates hierarchy (what's in focus moves least; what's receding/exiting moves most) rather than being decorative entrance animation.
- Selective immersion: one or two moments of real spatial depth (e.g. a case study's key artifact rendered as if placed in front of its context) rather than depth applied uniformly everywhere.

## Typography
Typography stays legible and largely flat even while surrounding elements have depth — text should never be the thing floating/tilting/blurring, or readability breaks. Use the existing Space Grotesk/DM Sans pairing; depth is expressed by layout and layering, not by typographic effects.

## Composition
- Sections can overlap in scroll (a following section's edge appears behind/under the current one) instead of each being a fully separate centered block.
- Case studies could use a "layered artifact" pattern — key screenshots/diagrams sit above supporting context text, with clear depth cues (subtle shadow/offset, not blur-heavy glassmorphism).

## Grid
Layered rather than strictly columnar — grid governs alignment of each layer independently, and layers may be offset from each other deliberately (this is different from Editorial's asymmetric single-plane grid).

## Color
Depth should read primarily through layout, contrast, and subtle scale/shadow — not through blur or glow. Keep the existing token system's light/dark contrast handling; avoid introducing gratuitous blur-heavy "glassmorphism" panels as a shortcut to implying depth.

## Imagery
Case-study screenshots and diagrams are the most natural candidates for real spatial treatment (parallax offset relative to their caption/context, or stacked artifact reveals) — this is where "spatial" should show up concretely, not just as a background hero effect.

## Navigation
`GlobalNav` can use depth on scroll (recede/dim when a section is in focus, return to foreground at rest) but must remain immediately reachable — depth effects on primary navigation are the highest-risk spot for this direction to hurt usability.

## Case Studies
Best-suited section for this direction's payoff: sequential reveal of problem → decision → result as a spatial progression (each stage recedes as the next comes forward) rather than a flat scroll of equal-weight sections.

## AI / Chatbot Presentation
Could occupy genuine foreground/background relationship with page content — e.g. surfaces above the current section in a way that visually signals "layered on top of your context" — without becoming a floating orb or glassmorphic bubble.

## Voice Presentation
Voice mode is a natural fit for a spatial/depth metaphor (audio visualization already exists via `useAudioAnalyser.ts`) — richer interaction states here are explicitly invited, but must avoid generic sci-fi/hologram tropes.

## Motion
Motion is structural here, not supporting — transitions between depth layers, scroll-linked scrubbing, and selective parallax are the direction's core material. Must still respect `prefers-reduced-motion` (the current `useReducedMotion` pattern in `App.tsx` should be the model to extend, not abandon).

## Interaction
Richer interaction states are explicitly in scope (item 3 in this direction's brief) — hover/focus can trigger real depth changes (an element steps forward), not just color/shadow shifts.

## Responsive Behavior
Depth and layering are the hardest thing to translate to small screens with limited GPU/scroll-performance headroom — this direction carries the highest mobile-performance risk of the five and needs early testing on a mid-tier phone, not just desktop Chrome.

## Accessibility Considerations
Parallax and depth-linked motion are common triggers for motion sensitivity — every depth effect needs a static/reduced-motion fallback that preserves the same information hierarchy without relying on layering to convey it. Screen-reader DOM order must reflect logical reading order regardless of visual z-stacking.

## What This Direction Rejects
Generic futuristic dashboards, neon sci-fi treatments, holographic effects, gratuitous 3D transforms, glassmorphism-as-default (blur is a tool for specific moments here, not a global surface treatment).

## Risks
- Easiest of the five directions to drift into generic "AI startup" visual tropes if depth is implemented as blur+glow rather than genuine layered composition — needs continuous anti-slop self-checks during implementation.
- Real risk of motion-sickness / performance complaints if scroll-linked effects aren't heavily throttled and reduced-motion-respecting.
- Depth effects can obscure content hierarchy instead of clarifying it if overused — the test is always "does this layering help me understand what matters," not "does this look cool."

## Success Criteria
- At least one case study demonstrably communicates its problem→decision→result structure better through spatial sequencing than the current flat scroll does.
- Every depth/motion effect has a verified static equivalent for reduced-motion users that loses no information.
- No effect in the direction can be described as "glassmorphism," "hologram," "orb," or "neon" by an independent reviewer.

## Comment on ambiguity
The `--hero-orb-primary` / `--hero-orb-accent` CSS tokens already exist in `src/index.css` for the current hero's radial glow. Spatial should not assume these are safe to reuse as-is — they are literally the "decorative orb" anti-pattern named in the anti-slop standard, and this direction's brief explicitly excludes gratuitous glow. Flag before reusing; likely candidates for removal or radical reinterpretation rather than adoption.
