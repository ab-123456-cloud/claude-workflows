---
name: tournament
description: Develop a best draft from a rough idea through competing concept variants and redline rounds — wide net, elimination, convergence.
disable-model-invocation: true
---

# Tournament

A funnel in rounds: first the wide net (competing variants from disjoint lenses), then elimination and convergence on a best draft. The user judges via redline; Claude generates, scores and synthesizes. Every round lands as a file — chats are disposable, the funnel history is not.

## 0. Frame

From the brief (if something is missing: ask in one batch, each question with a recommendation):

- **Topic** and **filing location** for the version files.
- **Stakes.** External impact or a one-way-door decision → subagent mode (real context separation per lens); otherwise lenses run inline in the same window.
- **Size.** Default: 3 variants, 2 convergence rounds. More only when the user asks for it, with a price tag (agent count × tier) next to it.

Variant generation may go to work-tier agents; scoring, synthesis and everything user-facing stays on the frontier model (`frugal-frontier` split).

## 0b. Fact base (when needed)

If the idea rests on existing material — inventory, current state, data — that is collected before the yardstick: gather read-only (fanning out allowed, work tier), show the user a compact list, work in corrections. **Done when the user has confirmed the fact base — it is then fixed and does not compete.** All variants build on the same facts and differ in interpretation, not in the record.

## 1. Yardstick

Before the first variant: derive 3–5 evaluation dimensions from the rough idea, each with one sentence on how "good" is recognizable on that dimension. Present them to the user. **Done when the user has approved the yardstick** — only then is anything generated.

## 2. Wide net

One **lens** per variant: a named perspective with a hard constraint the other lenses do not share (e.g. MVP-first / risk-first / user-first — or sharper task-specific ones). Fix the lenses first, then generate. In subagent mode each agent receives only the rough idea and its lens — the neighboring variants stay unknown to it.

Each variant as a one-pager: core idea, mechanics, what it sacrifices, its self-named strongest weakness.

**Distinctness test:** if two variants could be merged without loss, one of them is not a variant in its own right — regenerate it with a sharpened lens. Done when all variants are pairwise distinct.

## 3. Scoring

All variants against the yardstick, in a table, plus a recommendation: the winner candidate and which ideas from the losers should be grafted in. Present to the user.

## 4. Redline

The user decides: winner, grafts, kills. Every kill moves to the **graveyard** (a cumulative section in the version file) with a one-sentence kill reason. A killed idea only returns if the user explicitly brings it back. Done when the redline is in.

## 5. Convergence rounds

Per round: a new version file V(n+1) with the redline worked in, plus — exclusively where the redline marked a weakness — targeted **challengers** against exactly that spot. Then score the challengers (step 3 in miniature) and redline again (step 4).

**Exit:** one **dry round** — no challenger beats the current state, no improvement worth adopting — or a user stop. The current version is thereby the best draft and is marked as such in the file.

## 6. Filing

- File name: `Concept_<topic>_V<n>_<YYYY-MM-DD>.md` at the location from step 0.
- Every version file carries: status, delta to the previous version, graveyard (cumulative), open redline items.
- Done when the best draft is filed and the graveyard lists every kill with its reason.
