# Standing pitfalls

Two traps that reliably turn a wrap-up into damage. Project-specific ones
belong in the handover, not here.

## The line-ending illusion

When the shell runs in a container over a mounted host folder, `git status` can
report hundreds of "changed" files that differ only in line endings.
Counter-check: `git diff --numstat | head` — if every file shows changes with
no substantive difference, the tree is clean. **Do not "clean it up"**, or you
produce a line-ending commit across half the repo. When in doubt, treat the
host's git as the truth.

## The mutation counter-check

A test that cannot reproduce the failure documents an opinion, not a fact, and
a regex over the source is not proof of effect. The check: lift the gate in the
source briefly ⇒ the test must go red ⇒ restore it exactly. Only that makes a
security, gate or payload test count as evidence.
