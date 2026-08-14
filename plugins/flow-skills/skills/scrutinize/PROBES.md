# Probes by artifact type

Pick the section matching the artifact; run every probe in it. A mixed
artifact (a pitch that embeds a prompt) gets every matching section.

## Idea — concept, plan, business case

- **Binding constraint** — name the scarcest resource (capital, time,
  attention, permission). The idea must spend within it.
- **Opportunity cost** — what the same budget buys elsewhere; the idea beats
  the best alternative, not zero.
- **Who pays, who decides** — the person with the pain and the person with
  the budget: same person? If not, the bridge between them is named.
- **Kill experiment** — the cheapest test that could kill the idea. A missing
  kill experiment is itself a finding.
- **Base rate** — what usually happens to attempts of this shape, and why
  this one lands in the surviving tail.

## Prompt — system prompt, skill, agent instruction

- **Two readings** — read each instruction as a lazy, literal executor;
  wherever two readings diverge, the prompt has a bug.
- **Determinism** — same input, same process: which line varies across runs?
- **Negation** — prohibitions name the very behavior they ban; each wants a
  positive rephrase.
- **No-op** — lines the model already does by default: token cost, zero
  steering.
- **Injection surface** — which inputs can smuggle instructions, and what
  happens when they do.
- **Observable fire** — for each requirement, the output that proves it
  fired. An unobservable requirement is an untestable one.

## Draft — document, mail, concept paper, pitch

- **Thesis** — one sentence. Needing three is a finding.
- **Evidence chain** — each claim labeled: supported, sourced, or asserted.
  The asserted ones are the findings.
- **Audience fit** — what the named reader knows, wants, fears — and the
  paragraph that loses them.
- **Requested action** — what the reader should do afterward, stated in the
  draft.
- **Cut test** — any section the thesis survives without, goes.
