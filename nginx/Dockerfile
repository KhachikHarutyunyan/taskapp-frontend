# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Stage 2: Nginx with frontend
FROM nginxinc/nginx-unprivileged:1.25-alpine

USER root
RUN apk add --no-cache gettext
USER nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx/nginx-prod.conf /etc/nginx/conf.d/
COPY nginx/docker-entrypoint.sh /docker-entrypoint.d/40-runtime-env.sh

USER root
RUN chmod +x /docker-entrypoint.d/40-runtime-env.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]