# Handover format

File name: `HANDOVER_<YYYY-MM-DD>.md` in the project root; several on one day
get a `_2` or `_<topic>` suffix.

```markdown
# HANDOVER <project> — <YYYY-MM-DD>

**State (3 sentences):** what was worked on, what works, what doesn't.
**Last green commit:** <hash> — <message>   <!-- non-code: key artefacts + paths -->
**Tests:** green/red (<n> tests) | uncommitted: <n> files   <!-- non-code: drop -->
**Migrations:** up to date / <n> pending | **Deploy:** <live SHA>   <!-- if applicable -->

## Open promises
- [ ] <item> (source: "<short quote>")

## Next steps (3 at most, concrete)
1. ...

## Recommended skills
<!-- what the next session will probably need, one line each with a reason -->
- /<skill> — <what for>
- Model/effort: <model> @ <effort> — <reason, one line, from the model retro>

## Known pitfalls
- <only the ones relevant to the next session; the standing ones live in
  PITFALLS.md and are not repeated here>

## References (do not duplicate)
- <tickets, specs, ADRs, commits, build-log sections: path or id + one line>

## Env & access (pointers only, never values)
- <.env variable names, where to find them>
```

**Stamp the end of the file:** model, date, method. Without it the next audit
has to guess how the artefact came about.
