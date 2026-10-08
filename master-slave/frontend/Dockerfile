FROM node:22-bookworm AS dev

# Use non-root user to avoid permission issues on mounted volumes
USER node

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY --chown=node:node master-slave/frontend/package.json master-slave/frontend/package.json

# Enable pnpm via corepack and install deps
RUN corepack enable pnpm && pnpm install --filter frontend --frozen-lockfile

# Source code will be mounted as a volume in docker-compose for hot-reload
EXPOSE 5173

CMD ["npx", "pnpm", "--filter", "frontend", "run", "dev", "--host", "0.0.0.0"]
