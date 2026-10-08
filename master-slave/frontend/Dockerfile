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
RUN sed -i 's|index  index.html index.htm;|index  index.html index.htm;\n        try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
