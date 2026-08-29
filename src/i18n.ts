/**
 * SITE CONTENT (EN / ES)
 * ──────────────────────
 * All user-facing homepage copy. Identity constants (name, domain, email,
 * socials) live in `site.config.ts` — do not duplicate them here.
 *
 * Sections are uniform ARRAYS. Add a job by appending to `experience.items`;
 * the page renders it. No JSX changes required.
 *
 * ── EDITORIAL RULES (from PRODUCT.md, confirmed 2026-08-06) ────────────────
 * These are not style preferences. They are the reason the work reads as
 * credible, and breaking them costs more than the copy gains:
 *
 *   1. THE BET IS THE STORY. Lead with the decision, the tradeoff, and its
 *      open status — never with a process description.
 *   2. UNPROVEN STAYS UNPROVEN. The case studies state plainly that their
 *      metrics are not yet realized. Do not convert research-backed *goals*
 *      into achieved outcomes, and do not attach numbers to any of them.
 *   3. ONE HONEST CLAIM BEATS TWO IMPRESSIVE ONES. Tenure is counted from IBM
 *      in 2008 — update the "X+ years" figure as the years turn rather than
 *      letting it go stale. The old "8+ years" line is retired; conflicting
 *      figures must never appear together.
 *   4. Erik is **freelance** — no longer at Tovuti LMS. All Tovuti copy is
 *      past tense.
 *   5. Ridgeframe Strategies and his co-founder are deliberately OFF this
 *      surface. Do not add them.
 *   6. Availability is stated quietly, in the contact section only. No banner,
 *      no badge, no urgency device.
 */
import { site } from './site.config'

/** Single-language site. See site.config.ts. */
export type Lang = 'en'

export const seo = {
  en: {
    title: `${site.brand} | ${site.tagline}`,
    description:
      'Denver-based senior product designer, in design since 2016 and in tech since 2008, across global enterprise, financial services, and learning platforms. Research through product decisions, systems, and implementation.',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared shapes
// ─────────────────────────────────────────────────────────────────────────────
export interface ExperienceItem {
  company: string
  logo?: string
  location: string
  role: string
  period: string
  desc: string
  highlights: readonly string[]
  badge?: string
  url?: string
  urlLabel?: string
  /** Internal route only — external links belong in `projects`. */
  caseStudyUrl?: string
  caseStudyLabel?: string
}

export interface ProjectItem {
  title: string
  badge?: string
  desc: string
  tech: readonly string[]
  /** Bare host + path, no protocol — the UI adds it. */
  link?: string
  /** Descriptive link text shown instead of the raw URL, e.g. "View JEM case study". */
  linkLabel?: string
  /**
   * Featured-card structure: same facts as `desc`, split into three scannable
   * beats. Optional — only the Featured Work items set these; everything
   * else falls back to rendering `desc` as a paragraph.
   */
  problem?: string
  approach?: string
  result?: string
}

export const translations = {
  // ═══════════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ═══════════════════════════════════════════════════════════════════════════
  en: {
    /** Single static headline — the rotating-roles typewriter is retired. */
    greetingRoles: ['Senior Product Designer for complex, AI-enabled products'],
    /** One-sentence support line under the hero headline. */
    heroSupport:
      'I turn ambiguous research and product problems into clear decisions, usable systems, and experiences teams can ship.',
    /** The three words in the hero's beam pill. */
    // Verbs, not deliverable-nouns (ruled 2026-08-25): the chain reads as
    // things Erik does, ending on the outcome. "Decide" second is the
    // decisions-before-the-build positioning compressed into word order.
    heroPill: ['Research', 'Decide', 'Design', 'Ship'],
    email: site.email,
    location: site.location,
    roles: site.roles,

    // ── Intro animation ──────────────────────────────────────────────────
    story: {
      // Wrapped in +…+ so the whole line is ONE highlight span (a bare "+"
      // mid-line would split the typography). Design tenure counts from 2016.
      context: '+I\'ve been designing data-backed solutions to complex problems since 2016.+',
      // Intentionally empty — the "decision is the story" beat was cut
      // (2026-08-25); the typewriter goes from the tenure line to the hook.
      reflections: [],
      // Positioning ruling (2026-08-25): "I work upstream", "before anything
      // gets built", and "I design the decisions" are retired — clear and
      // natural over conceptual. The hero tagline carries "I help teams make
      // better product decisions before the build starts."; don't repeat it here.
      // Intentionally empty (2026-08-25): the "I help teams turn ambiguous…"
      // hook duplicated the hero support line and was cut. The typewriter
      // finishes after the tenure line. (One sentence = ONE paragraph if a
      // hook returns — a second paragraph opens a mt-4 gap mid-sentence.)
      hookParagraphs: [],
      why: 'My work spans global enterprise at IBM, financial services at Transamerica, and learning platforms at Tovuti LMS — from the early product thinking through the systems, interfaces, and implementation that follow.',
      seeking: [
        'Freelance right now, and open to the right full-time seat.',
        'Most interested in teams where AI is reshaping the design work itself.',
      ],
      skills: ['Product Design', 'UX Research', 'Design Systems', 'AI-Integrated Workflows'],
      skipButton: 'Skip intro',
    },

    // ── What I deliver ───────────────────────────────────────────────────
    coreCompetencies: {
      title: 'How I Work',
      // Three pillars (confirmed 2026-08-25). WCAG 2.2 AA is a supporting
      // practice inside the systems pillar, not a pillar of its own.
      items: [
        {
          title: 'Research into decisions',
          desc: 'Qualitative and quantitative insight shapes the major calls: stakeholder interviews, usability testing, and synthesis of support tickets, transcripts, and field signals into decisions a team can act on — including feedback loops for AI-generated interfaces, where variance is higher and edge cases are less predictable.',
        },
        {
          title: 'Systems into shipped experiences',
          desc: 'Design systems in Figma, from early wireframes to production-ready components: structure, consistency, and specs that do not require a meeting to decode. I translate between design, product, and engineering so decisions survive the handoff. Accessibility to WCAG 2.2 AA is a standing practice — I audit against it and hold my own work to the same bar.',
        },
        {
          title: 'Human judgment in AI-enabled products',
          desc: 'AI products introduce a new class of UX problems — non-deterministic outputs, confidence variance, trust signals, and failure states that do not behave like traditional errors. I design for them directly, and I use AI in my own workflow — research synthesis, design-system documentation, prompt-to-prototype — as working practice rather than commentary.',
        },
      ],
    },

    // ── Work history ─────────────────────────────────────────────────────
    experience: {
      title: 'Experience',
      items: [
        {
          company: 'Freelance',
          location: 'Denver, CO · Remote',
          role: 'Senior Product Designer',
          period: '2026 – Present',
          desc: 'Product design for teams shipping software — discovery through implementation.',
          highlights: [],
        },
        {
          company: 'Tovuti LMS',
          location: 'Remote',
          role: 'Senior Product Designer',
          period: '2025 – 2026',
          desc: 'Led design across admin and learner surfaces, and owned the design system.',
          highlights: [
            'Designed and shipped JEM, an AI journey-mapping tool, after teams were spending an estimated 10–15 hours per discovery cycle hand-synthesizing help docs, transcripts, and support tickets. Built source ingestion, a guided AI scoping chat, and an editable persona-by-stage canvas, defined the data model, and shipped it with the platform\'s lead engineer on Nuxt 3, Vue 3, Cloudflare D1, and the Claude API — ten fixes shipped during the first week of internal use.',
            'Led discovery on Checkpoints, an approval-workflow feature tied to a commercially significant expansion opportunity, with several at-risk accounts depending on it: synthesized 60+ support tickets, Slack signals, and internal case notes into four persona journey maps and five go/no-go gates before GA — including silent auto-approvals, a compliance risk no ticket had named.',
            'Owned the design system, built from scratch on Vuetify 3: token layer defined first, 50–100+ standardized and documented components referenced directly by engineers, and a governance rule that every custom component traces back to a real primitive — so 8–12 engineers build from one shared taxonomy instead of drifting into one-offs. Defined the Component Spec Framework, a repeatable design-to-engineering handoff standard deployed across four product surfaces. Specs held to WCAG 2.2 AA.',
          ],
        },
        {
          company: 'Transamerica',
          location: 'Denver, CO',
          role: 'Senior UX Designer',
          period: '2020 – 2024',
          desc: 'Designed the World Financial Group (WFG) agent portal — the tools licensed agents work in daily.',
          highlights: [
            'Redesigned new-agent onboarding — a card-based homepage over a blank dashboard, with entitlements shaping what recruits versus licensed agents see. Targets were set from research and usability testing; no post-launch numbers were measured.',
            'Joined a redesign whose direction was already set and pushed to add user interviews and usability testing anyway, then built a custom design system for WFG — branding and functional requirements did not map cleanly onto off-the-shelf patterns — while navigating four years of financial-services compliance review and mentoring 3–5 designers on accessibility and systems thinking.',
            'Rebuilt global navigation around a goal-oriented architecture ("Manage My Business," "Grow My Business") rather than the org chart — grounded in card sorting, preference testing, and A/B testing with 100+ licensed agents, accepting that rarely-used tools become harder to reach.',
          ],
        },
        {
          company: 'IBM',
          location: 'Remote',
          role: 'Product Owner / UX Designer',
          period: '2017 – 2020',
          desc: 'Owned the Digital Sellers Guidebook — an adoption problem wearing a platform problem as a disguise.',
          highlights: [
            'Sellers treated the existing platform as overhead rather than help. Stakeholder interviews with sellers and managers surfaced the real constraint: high cognitive load and no time for training. Any fix that asked sellers to learn something new, somewhere new, would have failed the same way.',
            'Built the guidebook on WordPress for easy integration with existing IBM tools, structured around three pillars: product pages, a role-segmented knowledge base, and a searchable video library.',
            'Restructured that knowledge base around seller journeys — Clients, Contacts, Communications, Opportunity — with manager and seller paths separated, instead of mirroring how the content team was organized. Delivered training workshops internationally, including sessions in China and India.',
          ],
        },
        {
          company: 'IBM',
          location: 'Remote',
          role: 'Earlier IBM Experience',
          period: '2008 – 2017',
          desc: 'Copywriter to team lead — managed a global content team producing 2,500+ annual client profiles, improving submission-to-publication workflow efficiency by 50% through process redesign and editorial standards.',
          highlights: [],
        },
      ] as readonly ExperienceItem[],
    },

    // ── Case studies ─────────────────────────────────────────────────────
    // Each leads with the decision and its open status, per PRODUCT.md rule 1.
    // `items` is the single source; App.tsx splits it into Featured Work
    // (by title, see FEATURED_PROJECT_TITLES) and More Work at render time.
    projects: {
      title: 'Case studies',
      featuredTitle: 'Featured Work',
      moreTitle: 'More Work',
      viewCode: 'Read the case study',
      viewPrototype: 'View prototype',
      items: [
        {
          title: 'JEM (Journey Experience Mapper)',
          badge: 'Tovuti LMS',
          desc: 'Product teams were hand-synthesizing help docs, transcripts, and support tickets into journey maps — an estimated 10–15 hours per discovery cycle. I designed JEM — source ingestion, a guided AI scoping chat, an editable persona-by-stage canvas — defined its data model, and shipped it with Tovuti\'s lead engineer inside the eight-week window. Ten fixes shipped during the first week of internal use.',
          problem: 'Teams were hand-synthesizing help docs, transcripts, and support tickets into journey maps — an estimated 10–15 hours per discovery cycle.',
          approach: 'Designed JEM — source ingestion, a guided AI scoping chat, an editable persona-by-stage canvas — defined its data model, and shipped it with Tovuti\'s lead engineer in an eight-week window.',
          result: 'Ten fixes shipped during the first week of internal use. The 10–15 hours is an estimate of time avoided per discovery cycle, not a controlled measurement.',
          tech: ['Journey Mapping', 'Zendesk', 'Slack', 'Research Synthesis', 'AI-Assisted Build'],
          link: 'etaylor.co/i-vibe-coded-a-journey-map-generator-auto-synthesizing-docs-and-demos-into-actionable-friction-maps',
          linkLabel: 'View JEM case study',
        },
        {
          title: 'Checkpoints Go/No-Go',
          badge: 'Tovuti LMS',
          desc: 'An approval-workflow feature tied to a commercially significant expansion opportunity, with several at-risk accounts depending on it, was "broken again" in support channels — and nobody could say precisely how. I synthesized 60+ Zendesk tickets, Slack signals, and internal case notes into four persona journey maps and a five-gate go/no-go assessment — surfacing silent auto-approvals, a compliance risk no ticket had named. The gates went to leadership before GA; the fixes are theirs to sequence.',
          problem: 'An approval-workflow feature tied to a commercially significant expansion opportunity, with several at-risk accounts depending on it, was "broken again" in support channels — and nobody could say precisely how.',
          approach: 'Synthesized 60+ Zendesk tickets, Slack signals, and internal case notes into four persona journey maps and a five-gate go/no-go assessment.',
          result: 'Surfaced silent auto-approvals — a compliance risk no ticket had named — and delivered the gates to leadership before GA.',
          tech: ['Discovery', 'Journey Mapping', 'Zendesk', 'Risk Assessment'],
          link: 'etaylor.co/a-go-no-go-discovery-for-a-500k-arr-approval-workflow',
          linkLabel: 'Read the Checkpoints case study',
        },
        {
          title: 'WFG Agent Portal',
          badge: 'Transamerica',
          desc: 'The agent portal was unintuitive and impersonal — essential tools were hard to find and nothing adapted to the agent using it. I joined after direction was set and argued for user interviews and usability testing anyway, then built a design system tailored to WFG rather than bending the experience into an off-the-shelf component set. Task-completion, engagement, and satisfaction targets were set from that research; no post-launch metrics were measured, so none are claimed here.',
          problem: 'The agent portal was unintuitive and impersonal — essential tools were hard to find and nothing adapted to the agent using it.',
          approach: 'Argued for user interviews and usability testing after direction was already set, then built a custom design system for WFG instead of bending into an off-the-shelf component set.',
          result: 'Task-completion, engagement, and satisfaction targets were set from that research; the targets were aspirational, and no post-launch metrics were measured, so none are claimed here.',
          tech: ['Design Systems', 'Figma', 'Usability Testing', 'Stakeholder Interviews'],
          link: 'etaylor.co/empowering-financial-agents-with-a-redesigned-portal-experience',
          linkLabel: 'View the WFG Agent Portal case study',
        },
        {
          title: 'Advisor Navigation',
          badge: 'Transamerica',
          desc: 'Licensed agents could not get to the tools they used constantly: the global nav was cluttered with links and subcategories, and mobile was worse. I cut links and reordered what remained by frequency of use rather than by org chart. The tradeoff — burying rarely-used tools — is a bet that will not be provable until full rollout data comes in.',
          tech: ['Information Architecture', 'Mobile', 'Usability Testing', 'Figma'],
          link: 'etaylor.co/boosting-advisor-efficiency-with-a-renovated-navigation-experience',
          linkLabel: 'Read the Advisor Navigation case study',
        },
        {
          title: 'IBM Digital Sellers Guidebook',
          badge: 'IBM',
          desc: 'Sellers saw the platform as overhead, not help — the real constraint was cognitive load, not awareness. Built on WordPress for easy integration with existing IBM tools, the guidebook organized product pages, a role-segmented knowledge base, and a searchable video library around what sellers and managers actually needed. Adoption evidence was directional, not a verified percentage.',
          tech: ['WordPress', 'Stakeholder Interviews', 'Content Design', 'Adoption'],
          link: 'etaylor.co/driving-adoption-and-engagement-with-ibms-digital-sellers-guidebook',
          linkLabel: 'View the IBM Digital Sellers Guidebook case study',
        },
        {
          title: 'WFG 365',
          badge: 'Transamerica',
          desc: 'Senior leaders refused to use the mobile app that replaced Pulse — the paycheck tabs and team metrics they ran their business on daily were gone. I led field research with three top-producing leaders, turning "this doesn\'t work" into a prioritized fix list, and those feature requests shipped in the next release. Adoption lift was never formally tracked, so no lift is claimed.',
          tech: ['Field Research', 'Mobile UX', 'Change Management', 'Stakeholder Interviews'],
          link: 'etaylor.co/recovering-a-mobile-app-launch-agents-refused-to-use',
          linkLabel: 'Read the WFG 365 case study',
        },
        {
          title: 'An AI-Native Design Practice',
          badge: 'Tovuti LMS',
          desc: 'Three interlocking builds on one thesis: AI as infrastructure, not a bolted-on tool. JEM turns research into journey maps; 10 custom Claude skills cut an estimated 10–15 hours of synthesis to under 2; an analytics vision reframes reporting as decisions, not dashboards.',
          tech: ['Claude', 'AI Workflow Design', 'Product Strategy', 'Research Synthesis'],
          link: 'etaylor.co/building-an-ai-native-design-practice-not-just-using-ai-tools',
          linkLabel: 'View the AI-Native Design Practice case study',
        },
      ] as readonly ProjectItem[],
    },

    education: {
      title: 'Education',
      items: [
        {
          year: '2020',
          org: 'University of Denver',
          title: 'UX Design Bootcamp Certificate',
          desc: '',
        },
        {
          year: '',
          org: 'University of Massachusetts Amherst',
          title: 'B.A., English Language & Literature',
          desc: '',
        },
      ] as readonly { year: string; org: string; title: string; desc: string }[],
    },

    certifications: {
      title: 'Certifications',
      // Only real credentials with working verification URLs.
      items: [] as readonly { year: string; title: string; org: string; logo?: string; url?: string }[],
    },

    skills: {
      title: 'Skills',
      soft: 'Practice',
      // Concrete methods and tools only — the behavioral/approach side of this
      // lives in coreCompetencies ("How I Work") to avoid saying it twice.
      softSkills: [
        'User interviews',
        'Stakeholder interviews',
        'Usability testing',
        'Card sorting',
        'A/B testing',
        'Journey mapping',
        'Competitive analysis',
        'Research synthesis',
        'Information architecture',
        'Workshop facilitation',
        'Design sprints',
        'SAFe Agile',
      ],
    },

    techStack: {
      title: 'Tools',
      // Mirrors the resume's Skills section (2026-08-25). Research METHODS live
      // in `skills.softSkills` above — these cards are tools and tech only.
      // WCAG stays 2.2 AA site-wide even though the resume says 2.1.
      categories: [
        { name: 'Design', items: ['Figma', 'FigJam', 'Sketch', 'Adobe Creative Suite', 'Miro', 'Lucidspark', 'Lucidchart', 'Design Tokens', 'Auto-layout', 'Dev Mode', 'Prototyping'] },
        { name: 'Design Systems', items: ['Component-Driven Design', 'Atomic Design', 'Vuetify 3', 'Bootstrap 5', 'Material Design 3', 'Apple HIG', 'IBM Carbon', 'Component Spec Framework'] },
        { name: 'AI', items: ['Claude', 'Claude Code', 'Claude API', 'Claude Design', 'ChatGPT', 'Gemini', 'Ollama', 'Cursor', 'NotebookLM', 'Figma Make', 'Custom Skill Authoring', 'Prompt Engineering', 'Workflow Automation'] },
        { name: 'Front-End', items: ['HTML', 'CSS', 'Vue 3', 'Nuxt 3', 'Cloudflare D1', 'React (read)', 'TypeScript (read)'] },
        { name: 'Accessibility', items: ['WCAG 2.2 AA', 'Inclusive Design', 'Accessible Component Architecture'] },
        { name: 'Platforms', items: ['WordPress', 'Zendesk', 'Slack', 'Notion', 'Obsidian', 'VS Code', 'Camtasia', 'Ubuntu Linux'] },
      ],
    },

    cta: {
      title: "Let's talk",
      desc: 'Open to the right full-time role, and available for freelance product design in the meantime.',
      contact: 'Get in touch',
    },

    ui: {
      languageBanner: 'Este sitio está disponible en español',
      languageBannerSwitch: 'Cambiar a ES',
      languageBannerSwitchPrefix: 'Switch to',
      languageBannerSwitchLang: 'ES',
      languageToggle: 'EN',
      typingIndicator: `${site.shortName} is typing...`,
    },

    chat: {
      placeholder: 'Ask me anything...',
      title: site.shortName,
      subtitle: 'Ask me about my work',
      greeting: `Hi! I'm **${site.shortName}**. Ask me anything: the case studies, how I work, what I'm looking for.`,
      error: 'Failed to send. Try again.',
      offline: 'Looks like you are offline. Check your connection and try again.',
      prompts: [
        { icon: 'briefcase', label: 'Experience', query: `What is ${site.fullName}'s background?` },
        { icon: 'rocket', label: 'Case studies', query: `Walk me through ${site.fullName}'s case studies.` },
        { icon: 'target', label: 'What I want next', query: `What roles is ${site.fullName} looking for?` },
      ],
      contactCtaTitle: 'Prefer email?',
      voice: {
        start: `Talk to ${site.shortName}`,
        stop: 'End',
        connecting: 'Connecting...',
        listening: 'Listening...',
        thinking: 'Thinking...',
        searching: 'Searching my case studies...',
        speaking: 'Speaking...',
        timeWarning: '15 seconds left',
        ended: 'Voice session ended',
        rateLimited: 'You have reached the limit of 3 voice sessions per day',
        unsupported: 'Your browser does not support audio input',
        micDenied: 'Microphone access is required for voice mode',
        switchToText: 'Switch to text',
        connection: 'Connection error. Try again.',
      },
    },
  },

} as const
