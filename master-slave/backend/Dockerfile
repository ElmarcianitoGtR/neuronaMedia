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

FROM node:22-bookworm AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY master-slave/backend/package.json master-slave/backend/package.json
RUN pnpm install --filter backend --frozen-lockfile
COPY master-slave/backend master-slave/backend
RUN pnpm --filter backend build

FROM node:22-bookworm-slim AS prod
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY master-slave/backend/package.json master-slave/backend/package.json
RUN pnpm install --filter backend --frozen-lockfile --prod
COPY --from=build /app/master-slave/backend/dist ./master-slave/backend/dist
EXPOSE 3000
CMD ["node", "master-slave/backend/dist/main.js"]
