# Brutalist

## Thesis
The system that builds this site is visible in its design — structure, grid lines, and raw typographic scale are shown rather than smoothed over — and that honesty about how it's made is itself part of the pitch of an "AI-native design practice."

## Why This Direction Exists
Erik's case studies are explicitly about process, architecture, and decision logic (see "An AI-Native Design Practice," "Checkpoints Go/No-Go"). Brutalist tests whether exposing structure visually — showing the seams instead of hiding them behind rounded cards and soft shadows — reinforces that positioning better than the current polished-SaaS visual language does.

## Why This Direction Exists (continued)
This is a disciplined, contemporary interpretation of brutalism (exposed grid, hard edges, honest materials) — not the retro "ugly by default" web-brutalism meme. Usability is non-negotiable.

## Visual Principles
- Visible structure: grid lines, section boundaries, and alignment guides can be shown rather than implied through whitespace alone.
- Hard edges everywhere — zero border-radius as a starting rule, deviated from only with explicit justification.
- High contrast, limited palette — the current soft light/dark HSL tokens (`--muted`, `--card` at near-background luminance) move toward starker foreground/background separation.
- Density is deliberate: brutalism here means "nothing is hidden to look calmer," not "cram more in."

## Typography
A single utilitarian/grotesk-style face at a wide type scale with large jumps between levels (not the current fairly-close DM Sans scale); mono or semi-mono treatment for metadata, labels, dates, and tech-stack listings to reinforce the "systems" feel.

## Composition
- Homepage: sections read like a spec sheet or system diagram — labeled blocks, visible section numbers/IDs, structural rules (thin hard lines) separating regions instead of whitespace gaps.
- No card-in-card nesting, no soft shadow elevation — if something needs separation, a hard rule or a background-color block does the job.

## Grid
The grid itself is a visible design element — gutters and columns can be shown with rule lines, and content is allowed to align strictly to a visible baseline/column structure rather than floating within generous padding.

## Color
Move away from the current soft near-black/near-white background tokens toward higher-contrast true black/white or a two-tone system with one hard accent (not a gradient pair) used for emphasis and links only.

## Imagery
Screenshots and diagrams shown at full rectangular crop with a hard border, no rounded corners, no drop shadow — labeled like exhibits (caption/number) rather than styled like product marketing shots.

## Navigation
`GlobalNav` becomes a structural element itself — e.g. a fixed-width labeled bar with hard dividers between links — rather than a floating rounded pill nav. Must remain fully operable with keyboard and screen reader despite the starker visual treatment.

## Case Studies
Strongest fit for this direction: each case study's problem/method/decision/result structure is shown as a visible system (numbered stages, exposed section IDs, a literal "index" of decisions) rather than styled as a soft narrative essay (contrast with Editorial's approach to the same content).

## AI / Chatbot Presentation
If shown, the chat surface should look like a terminal/console rather than a rounded bubble — monospace, hard-edged panel, visible state labels (e.g. "idle," "thinking," "error") rather than soft loading animations.

## Voice Presentation
A functional, labeled control with a visible state indicator (waveform as literal bars, not a glowing orb) — the audio-analyser data already available via `useAudioAnalyser.ts` is well-suited to an honest, technical-looking visualization rather than an ambient glow effect.

## Motion
Sharp, mechanical, and brief — instant or near-instant state changes (hard cuts, snap transitions) rather than eased eases-in/eases-out. If something moves, it should move like a mechanism, not float.

## Interaction
Visible, obvious affordances — buttons look like buttons (hard border, flat fill, clear pressed state), not ambiguous ghost/pill shapes. Hover states can be abrupt (instant color/fill invert) rather than smoothly transitioned.

## Responsive Behavior
The exposed-grid conceit needs a deliberate mobile equivalent (the grid lines/structure should still read as intentional at narrow widths, not just disappear) — this is the direction's main responsive design challenge.

## Accessibility Considerations
High contrast generally helps accessibility, but hard, abrupt motion and dense layouts need care: verify tap-target sizing isn't sacrificed for density, and that "exposed structure" visual noise (rule lines, labels) doesn't create screen-reader clutter — decorative structural marks must be `aria-hidden`.

## What This Direction Rejects
Rounded rectangles, soft drop shadows, card elevation, gradient accents, glassmorphism, pill-shaped buttons/badges, decorative glow, generic SaaS polish.

## Risks
- Highest risk of the five directions for reading as "intentionally ugly" or hostile if taken too far — the brief explicitly forbids this; every harsh choice needs a legibility/usability check.
- Dense, high-contrast layouts can fatigue readers on long case-study pages — needs real reading-session testing, not just a glance.
- Could clash with the chatbot/voice features if those keep any current soft styling — this direction requires restyling those surfaces too, not just the static homepage.

## Success Criteria
- The layout visibly communicates "structure and system thinking" within the first screen, independent of copy.
- No component in the direction uses border-radius, drop shadow, or gradient without an explicit, written justification.
- A usability pass confirms tap targets, contrast, and reading fatigue are still acceptable despite the harder visual language.
