FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run docs:build

# Unprivileged nginx: runs as non-root (uid 101) and serves on 8080.
# See SECURITY_AUDIT_V2.md M2.
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
