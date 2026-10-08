FROM node:22-bookworm AS build
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY docs/slides/package.json docs/slides/package.json
RUN pnpm install --filter slides --frozen-lockfile
COPY docs/slides docs/slides
RUN pnpm --filter slides build

FROM nginx:alpine AS prod
COPY --from=build /app/docs/slides/dist /usr/share/nginx/html
RUN sed -i 's/index.html;/index.html;\n        try_files $uri $uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
