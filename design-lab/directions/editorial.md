# Editorial

## Thesis
The portfolio reads like a well-set publication — a magazine profile and its case studies — not a SaaS landing page. Typography carries the hierarchy; everything else gets out of its way.

## Why This Direction Exists
Erik's case studies are long-form narrative writing (problem → method → decision → result → lesson). The current homepage treats that writing as one section among many animated ones (typewriter hero, cascading chips, dot-grid canvas). Editorial tests whether the writing reads better when the page is built to *typeset* it well rather than to *animate around* it.

## Visual Principles
- Type is the primary design material. Color, motion, and iconography are secondary and used sparingly.
- Asymmetric grids over centered, symmetric hero blocks.
- Whitespace is structural (separates sections, signals pace), not decorative padding.
- A visible editorial "masthead" identity for the site (kicker labels, rule lines, drop caps or oversized section numerals) — evokes a publication without literally imitating one outlet's brand.

## Typography
- A serif or high-contrast display face for headlines and case-study titles; the existing Space Grotesk / DM Sans pairing may stay for UI chrome (nav, buttons, metadata) to avoid a total font-loading rebuild — evaluate cost/benefit before adding a third typeface.
- A real type scale (not just `text-xl`/`text-2xl` Tailwind defaults) with deliberate ratios, tested at case-study body-copy size first — long-form readability is the hard requirement here, not the hero.
- Generous line-length limits (~65–75ch) on body copy; the current layout has no enforced measure.

## Composition
- Homepage: a masthead-style header, a lead "feature" case study treated like a cover story (large title, dek, hero image), followed by a river/index of remaining work.
- Case studies: pull quotes, side-notes/margin annotations for asides (e.g. tradeoffs, metrics), numbered section markers instead of icon+heading blocks.
- Intentional asymmetry — do not center every block; let images and pull-quotes break the grid on one side while text holds the other.

## Grid
A multi-column editorial grid (e.g. 12-col with a narrower text column and a wider image/sidebar column) rather than the current single centered `max-w-*` column repeated for every section.

## Color
Reduce the current cyan/purple gradient system to a restrained ink-on-paper palette (near-black text, one accent used only for links/labels — could keep `--primary` as that single accent). Drop the gradient headline text and gradient chip rings entirely; a design that already looks like a publication doesn't need a gradient to look "AI."

## Imagery
Treat photography/screenshots as editorial plates — full-bleed or grid-breaking, captioned, consistent crop ratios — rather than uniformly-rounded cards.

## Navigation
Keep `GlobalNav`'s actual link structure and routes untouched; restyle it as a masthead strip (wordmark + rule + slim link row) instead of the current nav treatment. The floating table-of-contents (`HomeToc`) can stay conceptually but should look like a printed folio/running-header index, not a rounded pill sidebar.

## Case Studies
This is the direction's real test. Reading experience is the success metric, not the homepage hero. Section headers become editorial dividers (numerals, rules, kickers) instead of icon+colored-heading blocks currently used per case study.

## AI / Chatbot Presentation
If re-enabled, the chatbot should look like a "letters to the editor" / annotation panel rather than a floating bubble — text-forward, quiet entry point, no glow. Must not visually compete with the masthead.

## Voice Presentation
Voice mode entry point should be minimal — a small labeled control, not an orb with motion effects. If the orb visual is kept, it should be restyled to match the ink/paper palette rather than the current cyan/purple glow.

## Motion
Restrained: fades and precise cross-fades on section/page transitions, no scroll-triggered cascades, no typewriter-per-character hero animation. Motion marks *transitions*, not attention-grabbing.

## Interaction
Hover states are typographic (underline, weight shift, color) rather than card lift/shadow. Fewer, more deliberate interactive moments.

## Responsive Behavior
The asymmetric grid must have a clear, tested collapse to single-column on mobile that preserves reading order and pull-quote placement — this is the direction's biggest responsive risk.

## Accessibility Considerations
Serif/display faces at small sizes need contrast and x-height checks. Margin annotations must have a sane reading order for screen readers (test with the existing `--border`/`--foreground` tokens, don't rely on visual position alone to convey relationship to body copy).

## What This Direction Rejects
Gradient headline text, floating chat orb, dot-grid canvas animation, card-based homepage composition, icon+heading+paragraph feature blocks, symmetric hero centering.

## Risks
- Can collapse into "serif font + whitespace" if principles aren't enforced (explicitly called out as the failure mode to avoid).
- Long-form typographic layout is easy to get subtly wrong (measure, rhythm, baseline grid) — needs real content in place to evaluate, not lorem ipsum.
- Reduced motion/color may read as "less impressive" to a skimming recruiter if hierarchy isn't sharp enough to guide the eye without animation doing that work.

## Success Criteria
- A case study is more pleasant to read start-to-finish than the current layout, judged by an actual read-through, not a glance.
- The homepage clearly signals "this person can typeset and structure information" within the first screen.
- No gradient-on-text, no glow, no card-in-card nesting anywhere in the direction.
