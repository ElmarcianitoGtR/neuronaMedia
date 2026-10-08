FROM node:22-bookworm AS dev

# Enable pnpm via corepack while still root
RUN corepack enable pnpm

# Switch to non-root user to avoid permission issues on mounted volumes
USER node

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY --chown=node:node master-slave/frontend/package.json master-slave/frontend/package.json

# Install deps
RUN pnpm install --filter frontend --frozen-lockfile

# Source code will be mounted as a volume in docker-compose for hot-reload
EXPOSE 5173

CMD ["pnpm", "--filter", "frontend", "run", "dev", "--host", "0.0.0.0"]

FROM node:22-bookworm AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY master-slave/frontend/package.json master-slave/frontend/package.json
RUN pnpm install --filter frontend --frozen-lockfile
COPY master-slave/frontend master-slave/frontend
ARG VITE_BACKEND_URL
ARG VITE_REPORTS_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_REPORTS_URL=$VITE_REPORTS_URL
RUN pnpm --filter frontend build

FROM nginx:alpine AS prod
COPY --from=build /app/master-slave/frontend/dist /usr/share/nginx/html
# SPA routing fallback
RUN sed -i 's/index.html;/index.html;\n        try_files $uri $uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
