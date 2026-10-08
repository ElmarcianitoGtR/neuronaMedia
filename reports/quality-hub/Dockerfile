FROM node:22-alpine AS dev
RUN corepack enable pnpm
WORKDIR /app
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
CMD ["pnpm", "--filter", "@reports/quality-hub", "run", "dev"]

FROM node:22-alpine AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY reports/quality-hub/package.json reports/quality-hub/package.json
RUN pnpm install --filter @reports/quality-hub --frozen-lockfile
COPY reports/quality-hub reports/quality-hub
RUN pnpm --filter @reports/quality-hub build

FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/reports/quality-hub/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/reports/quality-hub/node_modules ./reports/quality-hub/node_modules
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
