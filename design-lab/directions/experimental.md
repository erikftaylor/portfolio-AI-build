# Experimental

## Thesis
Question the portfolio's basic conventions — linear scroll, fixed navigation, one-page-per-case-study — to find out whether a fundamentally different structure communicates Erik's work and thinking better, while staying fully usable.

## Why This Direction Exists
The other four directions restyle the same underlying shape: a scrolling homepage plus a set of case-study pages, reachable via a persistent nav. Experimental exists to challenge that shape itself, not just its skin — because the highest-permission exploration is the only place in Design Lab where structural conventions (not just visual ones) are allowed to be questioned.

## Visual Principles
- Structure is the variable under test, not just typography/color/motion — this direction is the outlier among the five for that reason.
- Every structural departure must still resolve to a clear, navigable experience — "experimental" describes the hypothesis being tested, not a license for confusion.
- Should feel like a considered thesis (e.g. "case studies as a single continuous timeline," "navigation as a command palette instead of a nav bar," "work presented as an explorable map instead of a list") rather than a grab-bag of novel effects.

## Typography
Typography choices follow from whatever structural idea is being tested — no fixed prescription here, but must remain legible and support whatever navigation model replaces the conventional nav (e.g. if navigation becomes command-palette-driven, in-page typographic wayfinding cues become more important, not less).

## Composition
Candidate structural ideas (pick one thesis per experiment, don't combine all of them):
- Case studies as a single continuous scroll/timeline instead of separate routed pages.
- Homepage as an index/map of decisions rather than a chronological "experience then projects" list.
- Non-linear entry — visitor picks a lens (e.g. "by outcome," "by skill," "by industry") that reorders the same underlying content.

## Grid
Follows from the chosen structural thesis; may deliberately abandon a conventional grid if the experiment's whole point is a different spatial/organizational logic — but must still explain itself visually within a few seconds.

## Color
Not the focus of this direction — reuse or adapt tokens from whichever other direction pairs naturally with the structural idea being tested, rather than inventing a sixth palette from scratch.

## Imagery
Follows from the structural thesis (e.g. a map-based structure implies imagery-as-waypoints; a timeline structure implies imagery-as-milestones).

## Navigation
This is the most likely target of a structural experiment. If navigation itself is being reinvented (e.g. keyboard-driven, search-first, command-palette-style), it must still be discoverable without documentation — a first-time visitor with no instructions has to find their way to the case studies and back within seconds.

## Case Studies
Explicitly open to reinterpreting how case studies are sequenced and entered — but the actual content (`registry.ts`-driven copy, metrics, decisions) must remain sourced from the same i18n files as every other direction. Experimental changes structure and presentation, not the underlying facts.

## AI / Chatbot Presentation
Highest-permission direction for this too — e.g. the chatbot could become a primary navigation method ("ask me what to look at") rather than a floating add-on — but must degrade to something usable if the visitor doesn't want to use it (a portfolio that's only navigable via chat fails the "must remain usable" constraint).

## Voice Presentation
Same latitude as above; any structural role given to voice must have a text/visual equivalent for visitors who won't or can't use it.

## Motion
Motion may play a structural role here (e.g. driving the "map" or "timeline" navigation model) rather than being purely decorative — but must respect `prefers-reduced-motion` with a real fallback, same as every other direction.

## Interaction
The riskiest direction for interaction cost — novel interaction models take longer to learn. Every unconventional interaction needs an escape hatch (a way back to a familiar list/index) for visitors who bounce off the novel model.

## Responsive Behavior
Whatever structural idea is chosen must be designed mobile-first or verified extremely early on mobile — several plausible experimental structures (maps, command palettes, non-linear canvases) are desktop-biased by default and need real rethinking for touch/small-screen use, not just a breakpoint patch.

## Accessibility Considerations
The highest-scrutiny direction for accessibility: novel navigation models are the most likely to accidentally break keyboard/screen-reader flows. A structural experiment is not acceptable to ship or even fully evaluate if it fails basic keyboard-only and screen-reader navigation.

## What This Direction Rejects
Novelty for its own sake, structural change that isn't in service of a stated hypothesis, anything that makes the case studies harder to find or read than a conventional site would.

## Risks
- Highest risk of all five directions for hurting recruiter usability if the structural bet doesn't pay off — must be evaluated especially harshly against "does a hiring manager still quickly find and understand the work."
- Hardest to estimate implementation cost for, since it may require new routing/data-shape decisions rather than pure styling — flag any change that would require touching `articles/registry.ts`'s structure (not just its content) before proceeding, per the "must not casually rewrite FUNCTIONALITY" rule.
- Easy to conflate "experimental" with "random" — every version of this direction needs a one-sentence hypothesis it's testing, written down before implementation starts.

## Success Criteria
- A stated hypothesis exists before any code is written, and the shipped experiment can be evaluated against it directly.
- A first-time visitor, unprompted, can still find and read a case study and find contact info.
- Passes a basic keyboard-only and screen-reader pass, not just a mouse-driven demo.
