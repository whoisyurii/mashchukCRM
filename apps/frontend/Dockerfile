# dockerfile for a FE using vite, ts and nginx
FROM node:18 AS build

# working directory for the build stage
WORKDIR /app

# Copy package.json and other config files first to leverage Docker cache
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./
COPY public ./public
COPY src ./src

# Install dependencies and build the application
RUN npm install
RUN npm run build

# 2. Nginx stage to serve the built application
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный nginx.conf для SPA роутинга
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80