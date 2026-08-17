# sandcastle-test

A minimal test project for [@ai-hero/sandcastle](https://github.com/mattpocock/sandcastle) —
orchestrating a sandboxed Claude Code agent that works through issues autonomously.

## What's here

- `src/calculator.js` — tiny demo module with one intentional bug
- `.issues/open/` — the "issue tracker": one markdown file per open issue.
  Closing an issue = the agent moves the file to `.issues/closed/`.
- `.sandcastle/` — sandcastle config:
  - `main.ts` — the orchestration script (`run()` with Docker sandbox, Claude Code agent,
    `merge-to-head` branch strategy, max 3 iterations)
  - `prompt.md` — the agent prompt; the open-issues list is injected via a shell
    expression at the start of every iteration
  - `Dockerfile` — sandbox image (`sandcastle:sandcastle-test`)

## Setup notes for this environment

The Dockerfile deviates from the stock scaffold because this remote environment
routes egress through a TLS-intercepting proxy with a domain allowlist:

- `deb.debian.org` is blocked → no `apt-get`; `git`/`curl` come with `node:22-bookworm`,
  and the issue-list command uses `node` instead of `jq`
- `downloads.claude.ai` is blocked → Claude Code is installed via
  `npm install -g @anthropic-ai/claude-code` instead of `install.sh`
- The proxy CA (`.sandcastle/ca-bundle.crt`) is baked into the image trust store,
  plus `NODE_EXTRA_CA_CERTS` for Node/npm

Build the image with:

```bash
docker build --network host \
  --build-arg HTTP_PROXY="$HTTP_PROXY" --build-arg HTTPS_PROXY="$HTTPS_PROXY" \
  --build-arg NO_PROXY="$NO_PROXY" \
  -t sandcastle:sandcastle-test -f .sandcastle/Dockerfile .sandcastle
```

On a normal machine (Docker Desktop, no intercepting proxy) you can drop the
proxy/CA lines and just run `npx @ai-hero/sandcastle docker build-image`.

## Running the agent loop

1. `cp .sandcastle/.env.example .sandcastle/.env` and set `CLAUDE_CODE_OAUTH_TOKEN`
   (from `claude setup-token`) or `ANTHROPIC_API_KEY`
2. `npm install`
3. `npm run sandcastle`

The agent should fix `subtract()` (issue 001), add `multiply()` (issue 002),
commit each fix with a `RALPH:` prefix, and move the issue files to
`.issues/closed/`. Results are merged back to your current branch
(`merge-to-head` strategy).

## Using this outside the original checkout

The project is self-contained. If you copied the folder out of another repo:

```bash
git init -b main && git add -A && git commit -m "init"
```

(sandcastle needs a git repo with at least one commit to create worktrees.)
