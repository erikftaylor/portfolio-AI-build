# An AI-Native Design Practice at Tovuti

*Source: `src/ai-native-design-i18n.ts`* · Case Study — AI Workflow & Product Strategy at Tovuti LMS
Date: Tovuti LMS, 2025–2026 · 7 min read
Slug: `building-an-ai-native-design-practice-not-just-using-ai-tools`

Most designers who say they "use AI" mean they've added a tool to their workflow — faster, but the same shape of work. I had a different question: what if AI wasn't a tool in the workflow, but the infrastructure the workflow ran on?

## The problem

Over one year, I built a connected operating model for moving design work from evidence to decisions. Three bottlenecks were connected, even though they appeared in different parts of the practice: research synthesis took 10–15 hours per feature cycle, with evidence living across Zendesk, transcripts, knowledge-base articles, and meeting notes before being manually shaped into a coherent brief; journey maps were static artifacts, disconnected from the evidence that should have built them; and Tovuti's analytics product had no strategic vision — no defined north star for what data should surface, to whom, and why.

None of these were problems a new Figma component would solve. They were translation and decision-design problems.

## The operating model

The work followed three principles. Structural leverage beats generic tooling: look for places where information is being manually translated from one form into another. AI should remove mechanical work without removing judgment: the useful output is a structured draft a designer can validate, not an automated decision. And strategy is design work: defining whose decision a product capability should serve is part of designing the product, even when the interface has not shipped.

The three builds were different layers of the same system: make evidence easier to shape, make experience models easier to work with, and define how product data should support decisions.

**Steps:**

1. **Research infrastructure: 10 custom Claude skills** — Each scoped to a specific slow point in the design cycle — the goal was not a faster general-purpose assistant, but eliminating a translation step and producing an output a designer can actually use. Two representative examples: a research-synthesis skill that shapes Zendesk content, transcripts, knowledge-base articles, and meeting notes into a coherent brief — the workflow associated with the change from 10–15 hours to under 2 hours of typical synthesis effort per feature cycle — and a component-specification and design-handoff review skill whose value is a structured review draft for the designer to validate, not an autonomous implementation decision.
2. **Journey modeling: JEM** — The product layer of the operating model: a 0→1 web product that ingests multi-source research and generates living, evidence-backed journey maps through guided AI conversation. I owned the product design across the system — the product architecture and data model, the scoping interface, the map canvas, and collaboration with engineering through the build. Shipped to jem-test.tovuti.ai; in its first week JEM surfaced 20 friction points, and 10 were shipped as quick wins immediately.
3. **Decision intelligence: analytics strategy** — An AI-assisted intelligence layer that could surface friction by feature, persona, and stage: audience-by-surface coverage maps, analytics-user journey maps, and a strategic brief connecting those artifacts to a north star and an AI-integration roadmap. Together they framed analytics around the decisions it should support rather than the data available to display. This was strategy work, not a shipped interface: the vision produced no post-launch product metrics.

**Tradeoffs:** The same principle governed all 10 skills: does this remove a mechanical translation step, or does it merely make the step faster? The narrower scope meant less flexibility than a general-purpose tool, but it produced outputs that required minimal editing and could be used in the standard design workflow.

## Results

| Metric | Detail |
|---|---|
| **10–15 hrs → <2 hrs** typical research-synthesis effort per feature cycle | After introducing the AI-assisted synthesis workflow — a description of that workflow, not a claim that every one of the 10 skills independently produced the reduction |
| **20** friction points surfaced in JEM's first week | 10 shipped as quick wins immediately |
| **10** custom Claude skills shipped | In active use as part of the standard design workflow |

More important than the individual outputs, the work created a research-to-decision pipeline that did not exist at the start of the year: evidence could be synthesized into structured understanding, modeled as a living journey, and connected to a strategy for decision intelligence.

## Where judgment stayed human

The AI-assisted workflows did not decide which findings represented meaningful product opportunities. They organized evidence, surfaced patterns, and produced structured drafts to validate. Determining what to trust, what to prioritize, and what decision a product should support remained design judgment.

That boundary was intentional: AI infrastructure should eliminate mechanical translation, not replace the reasoning that gives the translation meaning.

## FAQ

**Is this the same case study as JEM?**
JEM is one of the three builds this piece covers, with its own full case study elsewhere on this site. This piece is the broader story: JEM plus the 10 custom Claude skills plus the analytics vision, told as one narrative about building AI infrastructure rather than adopting AI tools one at a time.

**Did the analytics vision ship as a product?**
No — it's a strategic brief with a defined north star and an AI-integration roadmap, not a shipped interface. This case study represents the vision and the method, not post-launch metrics, and doesn't claim otherwise.

## Want the details?

Happy to walk through any of the three pieces — JEM's architecture, how the Claude skills were scoped, or the analytics strategy brief. [Get in touch](/#contact)
