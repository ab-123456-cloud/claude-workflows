FROM node:22-bookworm

# git and curl ship with node:22-bookworm; apt is unavailable behind this
# environment's egress policy (deb.debian.org is blocked), so nothing extra
# is installed. The issue tracker is file-based (.issues/ in the repo) and
# its list command uses node instead of jq.

# Trust the environment's TLS-intercepting agent proxy so HTTPS works during
# the build (build with --network host and HTTP(S)_PROXY build-args).
COPY ca-bundle.crt /usr/local/share/ca-certificates/agent-proxy-ca.crt
RUN update-ca-certificates
# Node/npm don't read the system trust store — point them at the CA directly.
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/agent-proxy-ca.crt

# Build-args for UID/GID alignment: sandcastle docker build-image
# defaults these to the host user's UID/GID so image-built files
# and bind-mounted files share an owner without runtime chown.
ARG AGENT_UID=1000
ARG AGENT_GID=1000

# Rename the base image's "node" user to "agent" and align UID/GID.
RUN groupmod -o -g $AGENT_GID node && usermod -o -u $AGENT_UID -g $AGENT_GID -d /home/agent -m -l agent node

# Install Claude Code CLI via npm (downloads.claude.ai is blocked by this
# environment's egress policy, so the install.sh route is unavailable).
RUN npm install -g @anthropic-ai/claude-code

USER ${AGENT_UID}:${AGENT_GID}

# Add Claude to PATH
ENV PATH="/home/agent/.local/bin:$PATH"

WORKDIR /home/agent

# In worktree sandbox mode, Sandcastle bind-mounts the git worktree at /home/agent/workspace
# and overrides the working directory to /home/agent/workspace at container start.
# Structure your Dockerfile so that /home/agent/workspace can serve as the project root.
ENTRYPOINT ["sleep", "infinity"]
