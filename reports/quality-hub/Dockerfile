FROM node:22-alpine AS dev
RUN corepack enable pnpm
WORKDIR /app
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
CMD ["pnpm", "--filter", "@reports/quality-hub", "run", "dev"]
