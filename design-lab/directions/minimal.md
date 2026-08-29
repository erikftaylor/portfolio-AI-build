# Minimal

## Thesis
Remove until only the decision, the work, and the way to reach Erik remain — and make what's left feel deliberate down to the pixel, not empty.

## Why This Direction Exists
The current homepage layers a typewriter hero, a dot-grid canvas animation, gradient text, cascading skill chips, and a floating table-of-contents in the first two screens. Minimal is the direct counter-experiment: strip every decorative system to see whether the actual work (case studies, experience, decisions) is a stronger pitch than the interface around it.

## Visual Principles
- Subtraction is the method, but every remaining element must earn a deliberate, precise treatment — minimal is not "the same layout with less stuff," it's a different layout built from fewer parts.
- One accent color, used with intent (links, active states) — not a two-color gradient system.
- Alignment and spacing consistency are the primary signals of craft, replacing color/motion/iconography as attention tools.

## Typography
- A single type family (the existing DM Sans is a reasonable base) at very few sizes — a compressed scale (e.g. 4–5 sizes total site-wide) forces every size choice to be meaningful.
- No gradient text, no multi-weight decorative treatments. Weight and size alone carry hierarchy.

## Composition
- Homepage: name, one-line positioning, a short list of featured work, contact — in that order, without a typewriter reveal sequence gating access to the content beneath it.
- Case studies: problem/method/result as clean stacked sections with strong whitespace between them, no icon+colored-heading pattern per section.

## Grid
A single-column, tightly-controlled measure for most content, with one deliberate grid moment (e.g. a work index laid out as a precise list/table, not cards) rather than the current repeated card-grid pattern.

## Color
Background/foreground from the existing token system, one primary accent (candidate: keep `--primary` cyan as the sole accent, drop `--accent` purple and the gradient pair entirely). No orb glows (`--hero-orb-primary` / `--hero-orb-accent` tokens unused in this direction).

## Imagery
Minimal, purposeful use — a single strong avatar/portrait treatment, case-study screenshots shown plainly (no rounded-card frame, no drop shadow) with a thin rule or hairline border if any framing is needed at all.

## Navigation
`GlobalNav` reduced to the essential links, no visual weight beyond what's needed to be tappable/clickable. The floating TOC (`HomeToc`) is a strong candidate to cut entirely in this direction — minimal's bet is that a well-structured single scroll doesn't need a floating wayfinding widget.

## Case Studies
Every section styled identically and quietly (no per-section icon or color); the writing and the data (metrics, decisions) carry the interest. Pull numbers/results out as plain, precise text rather than dashboard-style stat tiles.

## AI / Chatbot Presentation
If enabled: a plain text input at the bottom of the page or a quiet labeled link, not a floating orb or bubble. No unread badge, no pulsing indicator.

## Voice Presentation
If shown at all, a single small icon-button with a text label ("Try voice"), no persistent glowing orb (`VoiceOrb.tsx`'s current visual treatment is explicitly out of scope for reuse as-is).

## Motion
Near-none. A single consistent fade/opacity transition on route change is enough. No scroll-triggered stagger, no canvas animation, no cascading chip entrances.

## Interaction
States (hover/focus/active) are precise and consistent everywhere — same easing, same duration, same visual language for every interactive element on the site, so consistency itself becomes the "polish" signal minimal is judged on.

## Responsive Behavior
Because there's little to rearrange, mobile should be nearly identical to desktop in feel — the test is whether spacing/type scale still reads as intentional at narrow widths, not whether anything needs to reflow dramatically.

## Accessibility Considerations
With fewer visual differentiators, hierarchy relies more heavily on semantic HTML (heading levels, landmark regions) and on whitespace/contrast rather than color — verify heading order is meaningful without any visual aid.

## What This Direction Rejects
Gradient text, dot-grid canvas, floating chip cascade, floating TOC, orb glow, multi-accent color system, card-based work index, decorative section icons, badges, pills.

## Risks
- The most likely direction to accidentally read as "unfinished" rather than "restrained" if spacing/alignment isn't meticulous — minimal has zero tolerance for sloppy detail because there's nothing else to distract from it.
- Removing the floating TOC may hurt navigability on very long case-study pages; needs a scroll-length check once real content is in place.
- Risk of reading as *generic* minimal (a common template look) rather than *authored* minimal — needs at least one distinctive structural choice (e.g. the plain work index) to avoid genericness.

## Success Criteria
- A visitor can state Erik's positioning and see his best work within one screen, with zero decorative elements between them and it.
- Every remaining visual choice (spacing value, type size, the one accent color) can be justified individually if asked.
- Feels "authored," not "empty" — validated by an outside reader's gut reaction, not just a spacing audit.
