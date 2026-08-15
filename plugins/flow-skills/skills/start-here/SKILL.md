---
name: start-here
description: Start here — which skill in this plugin fits the situation you are in, and how the set hangs together.
disable-model-invocation: true
---

# Start Here

You will not remember every skill in this plugin. Start here instead.

This plugin is one **spine** with **stations** on it and one policy layer underneath. Start at the spine; reach for a station directly when you already know which stretch of work you're in.

## The spine: /execute-flow

The session operating procedure — four phases: sharpen the brief, route to a flow, staff it, set the rest point. Type it at the start of any work session; it reaches every station below at the right phase, and carries a short form of each companion skill so a route still executes when its skill isn't installed.

## Stations

Each maps to a moment you'll recognise:

- **An idea, plan, or decision — still in your head** → `grilling` (model-invoked; say "grill me"). A relentless interview, one question at a time, each with a recommended answer, until the understanding is shared. Nothing is acted on before that.
- **A finished draft, concept, or prompt — on the table** → `scrutinize` (model-invoked; say "tear this apart"). Four passes — steelman, verify the load-bearing assumptions, multi-lens attack, referee report — ending in an earned verdict: sound, salvageable, or unsound.

  The pair splits on where the thinking lives: `grilling` interrogates *you*; `scrutinize` works on *what is written* and asks you nothing until the report.
- **A rough idea worth more than one attempt** → **`/tournament`**. Competing variants built from disjoint lenses, scored against a yardstick you approved, your redline deciding each round, grafts and kills recorded, until a round comes back dry. Reach for it when anchoring on the first draft is the real risk.
- **Scope growing instead of progress toward done** → `think-simple` (model-invoked; say "MVP" or "keep it simple"). One done-sentence, cut to the smallest version that ships today; everything struck lands on a parking list.
- **A result is filed, the context is switching, or the window is getting tight** → `session-wrap` (model-invoked; say "wrap" or "handover"). Evidence-checked backlog sync, open promises collected out of the transcript, and a handover file — so the next session starts fresh instead of inheriting this one.

## Underneath: frugal-frontier

Not a station — a policy layer for sessions running on the installation's top model (model-invoked). Judgment stays with the frontier model; heavy verifiable work fans out to cheaper tiers, and results come back through files instead of context windows. `/execute-flow` runs it as the standard check in its staffing phase. One hard rule: it and Ultracode are opposites — never together.

## Companions (not vendored here)

`/execute-flow` names these when a route needs them; missing ones degrade to inline work rather than failing:

- `research` — background agent over primary sources, one cited Markdown file.
- `prototype` — throwaway code that answers exactly one design question.
- `/wayfinder` — chart work too big for one session as a map of decision tickets.
- `/entscheidungsvorlage` — turn an idea into a one-pager a named decider can say yes or no to.
- `/writing-great-skills` — write or rework a skill.
