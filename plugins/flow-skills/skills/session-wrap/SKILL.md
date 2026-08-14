---
name: session-wrap
description: >-
  Land a work session in files — evidence-checked backlog sync, open promises,
  and a handover — so the next session starts fresh instead of dragging this
  one along. Use when the user says "wrap", "backlog sync", "handover" /
  "übergabe", "session end" / "feierabend", "save the state" / "zwischenstand
  sichern", or asks "where do we stand" / "wo stehen wir" at the end of a work
  block.
argument-hint: "What will the next session be needed for?"
---

# Session Wrap

The chat log is not the project's memory. This skill externalises the session's
state into files, so the next session can start small, precise and cheap
instead of dragging an eternal session along.

## Ground rules

- **Evidence, not memory.** Every "done" claim needs a receipt: a commit hash,
  a green test run, or a file that exists. Anything unbacked is marked
  `⚠️ unverified` rather than asserted.
- **Notes are not evidence.** Previous handovers, index files and status notes
  lag behind the repo. Check every status claim from a note against `git` or
  the files on disk before adopting it — otherwise a false state travels from
  handover to handover.
- **Reference, don't duplicate.** Whatever already sits cleanly in tickets,
  specs, ADRs, commits or a build log gets linked (path or id, plus one line),
  not retold. The handover is an index with state, not a second archive.
- **No secrets.** Passwords, API keys, tokens and account numbers never appear
  in a handover, backlog or ticket — only as pointers (`.env: DB_SECRET`,
  "admin password: see the password manager"). If the user pasted a secret into
  the session, say so in the report without repeating the value.
- **No code changes in this run.** Red tests are documented as blockers, not
  quickly fixed on the way out.
- **Read before you write.** Read the backlog or ticket list in full before
  changing it, so you don't file an item that already exists under different
  wording.

## 1 · Gather the evidence

In a git repo:

```bash
git status --short
git rev-parse --short HEAD && git rev-parse --short @{upstream}
git log --oneline -20
```

Add the project's own checks where they exist: the test command, the migration
status command. Record the last commit hash, how `HEAD` relates to its
upstream, the number of uncommitted files, test status (green / red / none) and
migration state. Uncommitted work is its own point in the handover — never left
silently behind. If `git status` suddenly reports hundreds of changed files,
rule out the line-ending illusion before "cleaning up"
([PITFALLS.md](PITFALLS.md)).

A security, gate or payload test written this session counts as evidence only
after the **mutation counter-check** ([PITFALLS.md](PITFALLS.md)).

Outside a repo, evidence is files and indexes: list what this session created
or changed, check the date and version lines, and name the index entries that
point at them. "Written" counts only after you have looked at the file on disk.

**Done when** every claim you plan to carry into the handover has a receipt
next to it, or is marked unverified.

## 2 · Scan the session for promises

Walk the whole session transcript and collect:

- suggestions the user approved that are not yet implemented or committed
- your own announcements — "after that I'll do X", "TODO", "later"
- bugs and findings the user reported that are still open

Result: a list of **open promises**, one line each, with a short quote as its
source. If the session was compacted, the transcript is lossy — say explicitly
that promises from before the compaction may be missing.

**Done when** the transcript has been walked end to end, not sampled.

## 3 · Sync the work backlog

In order of authority:

1. **The repo has an issue tracker** — tickets are the truth. Close what is
   done (only with a receipt), file the open promises from step 2 as new
   tickets. If a backlog file still sits beside the tracker, freeze it with a
   one-line header rather than maintaining both.
2. **Otherwise a backlog or build-log file** — read it in full, tick off what
   is done (with the commit or file that proves it in brackets), add the open
   promises, update the date line.
3. **Neither exists** — offer to start one. Don't create it unasked.

If the project keeps a portfolio or index file above the project, update its
row: status, next action, last touched.

**Done when** every open promise from step 2 is either in the backlog already
or newly filed.

## 4 · Write the handover

`HANDOVER_<YYYY-MM-DD>.md` in the project root; several on one day get a `_2`
or `_<topic>` suffix. Structure and mandatory sections:
[HANDOVER-FORMAT.md](HANDOVER-FORMAT.md).

If the skill was invoked with an argument — what the next session is for — cut
the handover to it: relevant promises to the top, next steps aimed at exactly
that goal, and the goal named in the state line.

## 5 · Verify persistence

- **Look at the disk.** List the deliverables you wrote (`ls`, or read them)
  instead of asserting that they were written. Deliverables have been lost by
  landing outside the mounted folder.
- **Follow the deploy.** If the repo auto-deploys, check after the push that
  the commit is actually live. A pushed commit is only true once it is served.
- **Migration order.** Additive migrations run before the code merge and only
  with explicit approval. Never run a development migration command against
  production — it can drop constraints it reads as drift.

**Done when** each deliverable has been seen on disk, not merely reported.

## 6 · Report and hand off

A short report to the user, six lines at most: commit and file state, test
status, number of open promises, handover path.

**Model retro, two lines, mandatory.** Line 1: what ran — this session's model
and effort, as far as you know it. Line 2: which model at which effort would
have been right, and why, in a few words. The yardstick is cheap scans,
premium judgment:

- scanning, syncing and formatting dominated → a cheaper tier at low or medium
  effort would have done, or delegation via `frugal-frontier`
- building along a known pattern → mid tier at medium
- architecture, hard debugging, expensive decisions → the top tier at high was
  well spent

For a mixed session, judge by the most demanding part that had to stay, and
name the rest as delegable. The forward-looking half of this also goes into the
handover, so the next session starts on the right tier.

Then exactly one recommendation:

> Start a new session with: "Read HANDOVER_<date>.md and <the backlog or the
> open tickets>, then <step 1>."

If this session has already been compacted at least once, or is older than a
working day, mark that recommendation urgent — continuing here costs quality
and budget.
