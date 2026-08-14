export const meta = {
  name: 'frugal-frontier-fanout',
  description: 'Frugal Frontier fan-out template: route independent slices to the cheapest sufficient model, verify, synthesize. COPY AND ADAPT per task — do not run blind.',
  phases: [
    { title: 'Work', detail: 'one agent per slice, model chosen by slice.tier, writes to scratch file' },
    { title: 'Verify', detail: 'Sonnet adversarial pass on high-stakes slices only' },
    { title: 'Synthesize', detail: 'no agents here — builds the manifest; the frontier model integrates in the main loop after return' },
  ],
}

// ── How to use ──────────────────────────────────────────────────────────────
// Pass `args` as an array of slice specs. The frontier model (the orchestrator)
// fills these in after decomposing the task — that decomposition is the part
// worth frontier tokens; this script just executes the fan-out cheaply.
//
//   args = [
//     { id: 'scan-auth',  tier: 'haiku',  highStakes: false,
//       prompt: 'Inventory every call site of `authToken` ...',
//       scratch: '.frugal/scan-auth/findings.md' },
//     { id: 'patch-login', tier: 'sonnet', highStakes: true,
//       prompt: 'Apply this bounded change to src/login.ts ... run `npm test -- login`.',
//       scratch: '.frugal/patch-login/report.md' },
//     ...
//   ]
//
// Each slice's `tier` comes from the routing table (haiku | sonnet | opus).
// Score stakes/reversibility/ambiguity → highest sets the floor. When unsure,
// go up one tier. Keep architectural/one-way slices OUT of this fan-out — the
// frontier owns those directly.
//
// Optional per-slice `effort` ('low'|'medium'|'high'): haiku slices default to
// 'low' (scans don't need deep thought); sonnet/opus inherit the session effort.
// ─────────────────────────────────────────────────────────────────────────────

const slices = Array.isArray(args) ? args : []
if (slices.length === 0) {
  return { error: 'No slices passed. args must be an array of { id, tier, highStakes, prompt, scratch, effort? }.' }
}

// ── Budget gate (secondary brake — the slice list you pass in is the primary one) ──
// budget.total is only set when the user gave a "+Nk" output target; without one,
// remaining() is Infinity and the gate stays inert. The reserve keeps headroom for
// the integration/review the frontier still owes after this returns. Estimates are per-slice
// OUTPUT tokens. A high-stakes slice must afford its verify pass too: if you can't
// afford the verification, you can't afford the slice — skipping verify to save
// tokens would break the quality floor.
const RESERVE_OUT = 20_000
const EST_OUT = { haiku: 4_000, sonnet: 8_000, opus: 12_000 }
const sliceCost = s => (EST_OUT[s.tier] || 8_000) + (s.highStakes ? 5_000 : 0)
const canAfford = s => !budget.total || budget.remaining() - RESERVE_OUT > sliceCost(s)
const skippedForBudget = []

const RESULT_SCHEMA = {
  type: 'object',
  required: ['path', 'summary', 'confidence'],
  properties: {
    path: { type: 'string', description: 'scratch file the agent wrote (NOT the full content)' },
    summary: { type: 'string', description: '<=3 lines: what was done / found' },
    confidence: { enum: ['high', 'medium', 'low'] },
    verifyPassed: { type: 'boolean', description: 'did the required build/tests pass?' },
    stoppedShort: { type: 'boolean', description: 'true if a stop condition was hit' },
  },
}
const VERDICT_SCHEMA = {
  type: 'object',
  required: ['sound', 'evidence'],
  properties: {
    sound: { type: 'boolean' },
    evidence: { type: 'string' },
    confidence: { enum: ['high', 'medium', 'low'] },
  },
}

const tierToModel = t => (t === 'opus' ? 'opus' : t === 'sonnet' ? 'sonnet' : 'haiku')

const workPrompt = s =>
  '## Frugal Frontier worker: ' + s.id + '\n\n' +
  s.prompt + '\n\n' +
  '## Output protocol (MANDATORY)\n' +
  '1. Write your full findings / patch / logs to: `' + s.scratch + '` (create dirs as needed).\n' +
  '2. Return ONLY: the path, a <=3-line summary, and your confidence. Do NOT paste the full content back.\n' +
  '3. If your slice requires a build/test, run it and set verifyPassed accordingly.\n' +
  '4. Stop conditions: if the code does not match this prompt, a command fails after one retry, or you need\n' +
  '   out-of-scope files — stop, set stoppedShort=true, and report what blocked you. Do not improvise.\n\n' +
  'Structured output only.'

// ── Work + verify, pipelined (no barrier): each slice verifies as soon as it's done ──
phase('Work')
const done = await pipeline(
  slices,

  s => {
    if (!canAfford(s)) { skippedForBudget.push(s.id); log('budget gate: skipping ' + s.id); return null }
    const effort = s.effort || (s.tier === 'haiku' ? 'low' : null)
    return agent(workPrompt(s), {
      label: 'work:' + s.id,
      phase: 'Work',
      model: tierToModel(s.tier),
      schema: RESULT_SCHEMA,
      ...(effort ? { effort } : {}),
    }).then(r => (r ? { ...s, result: r } : null))
  },

  item => {
    if (!item) return null
    // Only high-stakes slices pay for an adversarial verify pass.
    if (!item.highStakes) return item
    return agent(
      '## Adversarial verifier for slice: ' + item.id + '\n\n' +
      'A worker reported: "' + item.result.summary + '" (confidence ' + item.result.confidence + ').\n' +
      'Its output is at `' + item.result.path + '`. Read it.\n\n' +
      'Be skeptical. Does the file actually accomplish the slice objective below, with evidence?\n' +
      'Check the diff/claims against the stated scope. If it touched out-of-scope files, overreached,\n' +
      'or its tests do not actually cover the change, set sound=false.\n\n' +
      '## Slice objective\n' + item.prompt + '\n\nStructured output only.',
      { label: 'verify:' + item.id, phase: 'Verify', model: 'sonnet', schema: VERDICT_SCHEMA }
    ).then(v => ({ ...item, verdict: v }))
  }
)

const results = done.filter(Boolean)
const flagged = results.filter(r => r.verdict && !r.verdict.sound)
const stopped = results.filter(r => r.result.stoppedShort)
log(results.length + ' slices done · ' + flagged.length + ' flagged by verify · ' + stopped.length + ' stopped short' + (skippedForBudget.length ? ' · ' + skippedForBudget.length + ' skipped (budget gate)' : ''))

// ── Synthesize: inherits the session model (the frontier). This is the call worth full quality. ──
// The frontier reads the scratch files ON DEMAND — the manifest below carries only paths+summaries,
// keeping the context firewall intact. Pull a file in only when integrating it.
phase('Synthesize')
const manifest = results.map(r =>
  '- [' + r.id + '] tier=' + r.tier +
  ' · confidence=' + r.result.confidence +
  (r.verdict ? ' · verify=' + (r.verdict.sound ? 'sound' : 'FLAGGED: ' + r.verdict.evidence) : '') +
  (r.result.stoppedShort ? ' · STOPPED SHORT' : '') +
  '\n  file: ' + r.result.path +
  '\n  summary: ' + r.result.summary
).join('\n')

return {
  task: 'frugal-frontier fan-out',
  sliceCount: slices.length,
  completed: results.length,
  flagged: flagged.map(r => ({ id: r.id, why: r.verdict.evidence, file: r.result.path })),
  stoppedShort: stopped.map(r => ({ id: r.id, file: r.result.path })),
  skippedForBudget,
  manifest,
  next: 'Frontier: read flagged + high-stakes files from the manifest, integrate, run final review. ' +
        'Do NOT trust summaries for high-impact decisions — reopen the file. ' +
        'Slices in skippedForBudget never ran — surface them to the user, do not silently drop them.',
}
