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
COPY reports/quality-hub/package.json ./
RUN npm install --omit=dev
COPY --from=build /app/reports/quality-hub/dist ./dist
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
