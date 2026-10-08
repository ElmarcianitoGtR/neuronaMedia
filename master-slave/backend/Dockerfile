FROM node:22-bookworm AS dev

# Enable pnpm via corepack while still root
RUN corepack enable pnpm

# Switch to non-root user to avoid permission issues on mounted volumes
USER node

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY --chown=node:node master-slave/backend/package.json master-slave/backend/package.json

# Install deps
RUN pnpm install --filter backend --frozen-lockfile

# Source code will be mounted as a volume in docker-compose for hot-reload
EXPOSE 3000

CMD ["pnpm", "--filter", "backend", "run", "start:dev"]
