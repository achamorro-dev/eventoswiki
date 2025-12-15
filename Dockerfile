# Etapa 1: Dependencias
FROM node:20.15.0-alpine AS deps

# Instalar pnpm globalmente de forma más robusta
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    corepack prepare pnpm@9.15.2 --activate && \
    pnpm config set store-dir /pnpm/store

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Etapa 2: Builder
FROM node:20.15.0-alpine AS builder

# Instalar pnpm globalmente
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    corepack prepare pnpm@9.15.2 --activate

WORKDIR /app

# Copiar dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar archivos del proyecto
COPY . .

# Variables de entorno necesarias para el build
# Estas deben ser proporcionadas en tiempo de build
ARG BASE_URL
ARG ASTRO_DB_REMOTE_URL
ARG ASTRO_DB_APP_TOKEN
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_MAPS_PLACES_API_KEY
ARG PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
ARG TWITTER_CLIENT_ID
ARG TWITTER_CLIENT_SECRET
ARG PINATA_JWT
ARG PINATA_GATEWAY_URL

ENV BASE_URL=$BASE_URL
ENV ASTRO_DB_REMOTE_URL=$ASTRO_DB_REMOTE_URL
ENV ASTRO_DB_APP_TOKEN=$ASTRO_DB_APP_TOKEN
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_MAPS_PLACES_API_KEY=$GOOGLE_MAPS_PLACES_API_KEY
ENV PUBLIC_GOOGLE_MAPS_EMBED_API_KEY=$PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
ENV TWITTER_CLIENT_ID=$TWITTER_CLIENT_ID
ENV TWITTER_CLIENT_SECRET=$TWITTER_CLIENT_SECRET
ENV PINATA_JWT=$PINATA_JWT
ENV PINATA_GATEWAY_URL=$PINATA_GATEWAY_URL

# Construir la aplicación
RUN pnpm build

# Etapa 3: Runner - Imagen de producción
FROM node:20.15.0-alpine AS runner

WORKDIR /app

# Crear usuario no root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

# Copiar archivos necesarios desde el builder
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules

# Cambiar al usuario no root
USER astro

# Exponer el puerto (Astro standalone usa el puerto 4321 por defecto)
EXPOSE 4321

# Variables de entorno para runtime
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Comando para iniciar la aplicación
# El adapter de node en modo standalone ejecuta directamente desde dist
CMD ["node", "./dist/server/entry.mjs"]

