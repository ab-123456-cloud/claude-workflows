---
name: frugal-frontier
description: Use on a frontier-tier session when the work is token-heavy — many files, sources, or subagents. Judgment stays on the frontier; verifiable legwork goes to cheaper tiers. Triggers: "be efficient", "don't burn tokens", delegate/orchestrate subagents.
---

# Frugal Frontier

**The frontier** is the model this session runs on — the top tier of the
installation. It is expensive because it is good: spend it on judgment, not on
scans, boilerplate, and log-reading. **The deal:** cheaper agents *gather
signal and produce candidate work to files*; the frontier *decides, integrates,
and reviews*. Truth-judgment and final quality stay with the frontier, always.

## ⚠️ Turn Ultracode OFF before using this skill

Ultracode's standing order is "run workflows for everything, token cost is no
constraint"; this skill conserves. Together they produce the most expensive
case — cheap workers fan out *and* the frontier layers exhaustive passes on top.

- If Ultracode is on, **say so and stop** — ask the user to toggle it off, then proceed.
- A guide cannot beat a "spend everything" directive. The only real ceiling is a **token budget in the workflow** (below).
- After a delegated workflow returns, read the saved files, synthesize, **stop** — no autonomous "gap-fill" second round. Widen scope only if the user asks.

## Budget discipline (the real brake)

- For research, run the bundled **`references/frugal-research.js`** via the `Workflow` tool with `{scriptPath}` (hard caps: 4 angles / 8 fetches / 10 claims / 2 votes; `budget.remaining()` gate; synthesis pinned to the work tier), or copy it to `~/.claude/workflows/` to invoke by name.
- In any custom `Workflow`, gate fan-out on `budget.remaining()` and keep a reserve for synthesis — see `references/fanout-template.js`.
- **Scope is a cost lever.** Split mega-asks into focused runs or cap the angles; tell the user the tradeoff instead of silently fanning out.
- "Cheap model" ≠ "cheap run": 75 small agents are still millions of tokens. Watch the *count*, not just the tier.

## What stays with the frontier (never delegated)

- Decomposing ambiguous work into clean, independent slices.
- Architecture, product, and safety tradeoffs.
- Shared-file coordination and integrating partial work into one coherent whole.
- Resolving conflicting subagent reports — deciding what's actually true.
- Final review, risk assessment, and user-facing synthesis.

## Model routing — decide per slice, at runtime

Score each slice on three axes; the highest sets the **floor** (go higher, never lower): **stakes** (ships? architectural? correctness-critical?), **reversibility** (one-way door? destructive?), **ambiguity** (fuzzy spec, real judgment?).

| Slice | Owner | Gate before the frontier accepts |
|---|---|---|
| Scans, grep, repo/web inventory, log & test-output reduction, doc summaries | **Bottom tier** (cheapest) | low-stakes; sanity-check only |
| Bounded, well-specified patches; adversarial verification; targeted tests | **Work tier** (mid) | build + relevant tests pass |
| Hard refactors, correctness/security-critical code, slices the work tier visibly struggles with | **Sub-frontier** — strongest model *below* the session's | frontier reviews the diff |
| Decompose, architect, coordinate, integrate, final review | **Frontier** | — |

**Conservative build floor (default here):** cheap models do mechanical work and bounded patches with passing tests; anything architectural, high-stakes, or one-way stays at sub-frontier or above. Unsure → go up one tier.

**Effort is the second cost axis.** `Agent` and Workflow `agent()` accept `effort`: `low` for mechanical bottom-tier work, inherit the session effort for construction, `high`+ only for genuinely hard verify/judge slices. Never pair a bottom-tier model with max effort to "compensate" — that slice needs a better model.

## The context firewall (the main token saver)

Subagent output landing in the frontier's context is what nukes the budget — so don't return it there.

- Delegated agents **write findings/patches/logs to a scratch dir** (`.frugal/<task>/`, gitignored) and **return only** path + 3-line summary + confidence.
- The frontier reads files **on demand** at synthesis/review time — only the ones that matter, never all of them up front.
- Every delegated prompt is written for zero chat context: objective, in/out of scope, where to write, what to return, verification commands, stop conditions.

## Choosing the harness — not every task needs a workflow

- **1 slice, tightly coupled, or interactive** → the frontier does it directly; coordination cost would exceed savings.
- **A few independent slices** → inline `Agent` calls, model per the table.
- **Many independent slices / heavy fan-out** → author a `Workflow` (agents run outside the frontier's context). Adapt `references/fanout-template.js`.
- **Research:** a one-off lookup → one bottom-tier agent writing to a scratch file, or a `research`-type background skill if installed. A multi-angle sweep under budget pressure → `frugal-research.js`. Probe for the Bright Data CLI **once** in the orchestrator (`command -v bdata` / `where.exe bdata`) and tell agents the result; if absent they use WebSearch/WebFetch — never let each agent burn a turn discovering a missing CLI.

**Vetting:** treat subagent reports as leads, not facts — before relying on a finding or calling work done, reopen the cited files and review the final diff yourself.

*Adapted from BuilderIO's `efficient-fable`, extended with model tiers, a conservative build floor, the context firewall, and the budget-capped research workflow.*
