---
name: execute-flow
description: Standard operating procedure for a work session — sharpen the brief, choose a flow, staff it, set the rest point.
disable-model-invocation: true
---

# Execute

Four phases, always in this order: **Sharpen → Route → Staffing → Rest point**. The work happens between staffing and rest point.

**Switches.** When something is locked, don't quietly work around it: name the lock, name the switch that releases it, and let the user flip it. Applies in every phase.

## 1. Sharpen

The prompt is sharp when these six points have been reflected back as a written **brief** and the user has agreed. Phase 2 starts only after that agreement.

- **Goal** — what should be true afterwards
- **Result form** — file, ticket, email draft, artifact, table, answer in chat? Including where it gets filed
- **Audience & register** — for whom, which language, which form of address
- **Sources** — what already exists, what is new
- **Out of scope** — what explicitly does not happen
- **Done criterion** — how the user recognizes that it's finished

**Analysis briefs.** When the prompt brings a problem rather than a deliverable — something is broken, contested, or unclear — the six points spec the output but skip the problem. Add the TOSCA points (*Cracked it!*): **Trouble** (what makes it real and present), **Owner** (whose problem it is — Goal and Done belong to that person), **Constraints** (the limits of the solution space), **Actors** (who has a say, and what each wants). Then compress the brief into **one core question**; success criteria with a date are already covered by Done.

Plus two rules:

- **Check status against the system, not against notes.** Handovers and backlog entries may already have been wrong the moment they were written, thanks to parallel sessions. If the prompt contains a status claim, verify it at the source before it enters the brief.
- **Bundle clarifying questions in phase 1**, each with your recommended answer next to it. If a grilling flow from phase 2 is running, its own rule applies instead: one question at a time.

**Shortcut:** If the answer produces no file, no draft and no change in any system, it's information — answer directly, without a brief.

## 2. Route

Pick the flow that fits the sharpened brief. **Every route names the capability first, then the skill that accelerates it.** If that skill isn't installed here, say so in one sentence and work from the short form next to it — the capability doesn't drop out, only the shortcut to it.

- **Sharpen thinking, stress-test an idea, harden a decision** → `grilling` (in this plugin).
  *Short form:* one question at a time, each with your recommended answer next to it, walking the decision tree branch by branch; look facts up yourself, leave decisions to the user; act on nothing before the understanding is shared.
- **A finished draft, concept or prompt needs an adversarial pass** → `scrutinize` (in this plugin).
  *Short form:* build the steelman first, then verify the load-bearing assumptions one by one, then attack from several lenses, and end on a verdict the examination actually earns.
- **The brief looks bigger than its result, scope grows instead of progress** → `think-simple` (in this plugin) — MVP cut before decomposing.
  *Short form:* one sentence, "done means: X", checkable today and from the user's side; everything else goes on a parking list instead of into the brief.
- **Fetch facts from primary sources** → `research`. Runs as a background agent, so the session keeps working meanwhile.
  *Short form:* a background agent under three conditions — primary sources only (official docs, source code, specs, first-party APIs), every claim with its source, the result as **one** Markdown file at the location from the brief.
- **Something you have to see to judge** → `prototype`, or an artifact.
  *Short form:* throwaway code that answers exactly one question — name the question up front, and don't promote the result into the product afterwards.
- **It's actually code work** → say so; this procedure does not cover engineering. If the installation has an engineering router, name it.

**Switch routes.** You cannot invoke these yourself — name them and let the user type. If the skill isn't installed, say what it would do and ask whether the step should happen inline instead:

- **A rough idea, several plausible approaches, one best draft wanted** → `/tournament` (in this plugin) — competing variants, redline rounds, a funnel down to one draft.
- **A big, foggy chunk spanning several sessions** → `/wayfinder`.
- **A yes/no must be won in writing from a named decider** → `/entscheidungsvorlage` — state the problem (TOSCA), price the options including doing nothing, sell answer-first (pyramid).
- **Writing or reworking a skill** → `/writing-great-skills`.

**No flow fits → straight to phase 3.** That's the normal case, not a deficiency.

## 3. Staffing

First the class, then the distribution.

**Class.** The brief from phase 1 dictates it:

- **Top tier** — the installation's strongest model: ambiguous decomposition, weighing contradictory sources against each other, synthesis where a mistake is expensive: concepts, pricing, outward-facing work, one-way-door decisions. If the session runs on a lower class: **switch** (model selector) before any work starts.
- **Work tier** — the class below: executing a decided plan, drafting from an approved outline, working in the connected systems, reconciling against a master document, synthesizing from already-collected sources. The normal case.

The top tier is usually the scarce budget. Upgrading does not fix an unsharp brief — that's what phase 1 is for, and it is a bigger lever than model class.

**Distribution.**

- **One task, tightly coupled or interactive → do it here.** Coordination overhead would eat the savings.
- **Several independent parts, lots of collecting, scanning, reading, comparing → fan out.** One read agent per part, in parallel, read-only. Two wins, not one: wall-clock time, and the raw material lands in other context windows instead of this one — which pushes the phase-4 rest point further out.
- **Session running on the top tier → `frugal-frontier` (in this plugin) is the standard check before the distribution is settled.** Not just when the user brings up cost: the scarce budget is the permanent condition, not the special case. The check may well conclude "stays here" — it just must not be skipped. Check first: if Ultracode is on, **switch** (`/ultracode` or the model selector) — Ultracode orders maximum effort, `frugal-frontier` conserves; together they produce the most expensive case.
  *Short form without the skill:* judgment stays here, verifiable legwork goes to the cheaper class, and results come back through files rather than through full context windows.

If fanning out is the right shape but the session does not allow subagents on its own: **switch** — get the one sentence of approval instead of quietly falling back to inline work.

**Done when the distribution is decided**, named in one sentence: which class works, what gets fanned out, what stays here. "Delegation-shaped, but I'll do it myself" is not a decision — it's an open question to the user.

**Per brief, not per session.** Every new brief from phase 1 gets its own staffing — even mid-session. The previous brief's decision does not carry over.

## 4. Rest point

In a full context window the model gets duller. Set the exit before that happens.

Offer `session-wrap` (in this plugin) as soon as one of these occurs:

- **A result is filed** and the next step would need a new brief from phase 1. A new brief means: a new session.
- **The context switches** — different mandates, projects or areas of life are separate contexts, and the switch is the cheapest cut.
- **The window is getting tight**, or your own answers start repeating what is already known.

How to offer it: one sentence naming what would be saved and what would come next. The user decides. On a "keep going", keep working and offer again at the next rest point.

*Short form without the skill:* write a handover file — where things stand, what was decided, what is open, what comes next — at the location the project already uses for such notes, and name the path.
