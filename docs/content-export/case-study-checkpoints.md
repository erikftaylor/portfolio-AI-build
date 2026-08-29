# Five Gates Before GA: Discovery on an Approval Workflow

*Source: `src/checkpoints-i18n.ts`* · Case Study — Product Discovery at Tovuti LMS
Date: August 2026 · 8 min read
Slug: `a-go-no-go-discovery-for-a-500k-arr-approval-workflow`

An approval-workflow feature was "broken again" in support channels, and nobody could say precisely how. I synthesized 60+ tickets, case notes, and team signals into four journey maps and five go/no-go gates — before more code shipped.

## The problem

Checkpoints lets course creators embed human approval gates inside courses: learners submit work, approvers review it against rubrics, submissions route through org roles, rejections trigger resubmission cycles, and approvals mint certificates. For compliance-heavy customers — pharma, financial services, franchises — it is the difference between an LMS and a system of record. It was also carrying real weight, with several at-risk accounts depending on it.

The failure mode was epistemic, not just technical. Individual tickets each looked like a one-off — a submission that vanished, an approval that could not be undone. Support channels said "broken again," which is the sound of a systemic problem nobody has mapped. Worse, the quietest signal was the most expensive one: customers deprioritizing their Checkpoints rollouts without filing tickets at all. The team did not need more opinions about what to build. It needed a defensible read of what was actually broken, for whom, and what had to be true before the feature could responsibly reach GA.

## The method

This was a synthesis problem wearing a design-request costume, so the work ran as a four-phase discovery — about five weeks end to end — before any interface work was proposed.

**Steps:**

1. **Synthesis — 2 weeks** — Read and catalogued every support ticket mentioning the feature (60+), internal support case notes on at-risk accounts, team-channel signals, and the original specification, end to end. The goal: one corpus instead of five fragments.
2. **Persona mapping — 1 week** — Four journey maps — approver, learner, course creator, and administrator — each tracing actions, touchpoints, thoughts and feelings, challenges, pain points, and opportunities, in both current and desired state.
3. **Gap analysis — 1 week** — Current-state pain mapped against desired-state workflows, with every challenge tagged by root cause: UX, bug, workflow, or training. The tags mattered — they split what looked like one broken feature into separately ownable problems.
4. **Risk assessment — 2 days** — Five go/no-go gates the feature had to clear before GA: a routing audit, required-field enforcement, approval reversibility, feature-flag monitoring with alert thresholds, and an end-to-end smoke-test pass.

**Tradeoffs:** What I deliberately did not do: propose UI. Pixels drawn before the approval state machine was understood would have made the silent-approval problem prettier, not gone. The go/no-go framing also meant recommending the feature not reach GA until the gates cleared — an uncomfortable deliverable when accounts are waiting, and the honest one.

## What it surfaced

| Metric | Detail |
|---|---|
| **5** go/no-go gates before GA | Routing audit, required fields, reversibility, flag monitoring, smoke tests |
| **4** persona journey maps | Approver, learner, course creator, admin — current state to desired state |
| **60+** support tickets synthesized | Plus internal case notes, team-channel signals, and the original spec |

Three findings were critical. Approvals were irreversible — undoing one meant resetting a learner's entire course. Routing silently misdelivered — submissions reached the wrong approvers or vanished, and customers did not know work was missing. And under certain conditions, submissions auto-approved without any human review: a compliance risk for exactly the customers who bought the feature for compliance, and one no ticket had named — it only appeared when sources were crossed. The gates went to leadership with root causes and severities attached; the fixes and their sequencing are theirs, and this case study does not claim outcomes that have not shipped.

## Lessons

- **The worst risk had no ticket.** Silent auto-approval never appeared in any single source — it emerged only when tickets, case notes, and channel chatter were crossed. Synthesis from one source is just reading; triangulation is what finds the things nobody wrote down.
- **Root-cause tags changed the conversation.** Tagging every finding as UX, bug, workflow, or training turned "the feature is broken" into four scoped problems with four different owners. Taxonomy is a leadership tool, not a filing habit.
- **"Broken again" is data.** The sigh in a support channel is a signal class tickets never capture, and quiet customer disengagement is the most expensive feedback there is. Discovery that only reads tickets measures the customers who still bother to complain.

## FAQ

**Did the feature ship?**
Core flows were already in production while discovery ran — that was part of the problem. My work defined what had to be true before general availability: five gates, each with root cause and severity. Sequencing the fixes was leadership's call, and I do not claim outcomes I did not verify.

**Is this design work or research work?**
For a workflow product they are the same surface. The state machine, the error recovery, and the routing rules are the design; the journey maps are design artifacts engineers and product owners worked from. Interface polish on top of an unmapped state machine is how the feature got into this condition.

## Want the full method?

Happy to walk through the synthesis approach, the journey-map structure, or how the go/no-go framing landed. [Get in touch](/#contact)
