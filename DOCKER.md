# Docker - EventosWiki

Este documento explica cómo ejecutar EventosWiki usando Docker.

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) instalado (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (versión 2.0 o superior)

## Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura todas las variables necesarias:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales reales:

- **BASE_URL**: URL pública de tu aplicación
- **ASTRO_DB_REMOTE_URL**: URL de conexión a Astro DB
- **ASTRO_DB_APP_TOKEN**: Token de autenticación para Astro DB
- **GITHUB_CLIENT_ID/SECRET**: Credenciales OAuth de GitHub
- **GOOGLE_CLIENT_ID/SECRET**: Credenciales OAuth de Google
- **GOOGLE_MAPS_PLACES_API_KEY**: API key para Google Maps Places
- **PUBLIC_GOOGLE_MAPS_EMBED_API_KEY**: API key pública para Google Maps Embed
- **TWITTER_CLIENT_ID/SECRET**: Credenciales OAuth de Twitter
- **PINATA_JWT**: JWT para autenticación con Pinata
- **PINATA_GATEWAY_URL**: URL del gateway de Pinata

## Uso

### Con Docker Compose (Recomendado)

#### Construir y ejecutar

```bash
docker-compose up --build
```

#### Ejecutar en segundo plano

```bash
docker-compose up -d
```

#### Ver logs

```bash
docker-compose logs -f
```

#### Detener la aplicación

```bash
docker-compose down
```

### Con Docker directamente

#### Construir la imagen

```bash
docker build \
  --build-arg BASE_URL="https://eventos.wiki" \
  --build-arg ASTRO_DB_REMOTE_URL="tu_url" \
  --build-arg ASTRO_DB_APP_TOKEN="tu_token" \
  --build-arg GITHUB_CLIENT_ID="tu_github_id" \
  --build-arg GITHUB_CLIENT_SECRET="tu_github_secret" \
  --build-arg GOOGLE_CLIENT_ID="tu_google_id" \
  --build-arg GOOGLE_CLIENT_SECRET="tu_google_secret" \
  --build-arg GOOGLE_MAPS_PLACES_API_KEY="tu_maps_key" \
  --build-arg PUBLIC_GOOGLE_MAPS_EMBED_API_KEY="tu_maps_embed_key" \
  --build-arg TWITTER_CLIENT_ID="tu_twitter_id" \
  --build-arg TWITTER_CLIENT_SECRET="tu_twitter_secret" \
  --build-arg PINATA_JWT="tu_pinata_jwt" \
  --build-arg PINATA_GATEWAY_URL="tu_pinata_url" \
  -t eventoswiki:latest .
```

#### Ejecutar el contenedor

```bash
docker run -d \
  -p 4321:4321 \
  --name eventoswiki \
  -e BASE_URL="https://eventos.wiki" \
  -e ASTRO_DB_REMOTE_URL="tu_url" \
  -e ASTRO_DB_APP_TOKEN="tu_token" \
  -e GITHUB_CLIENT_ID="tu_github_id" \
  -e GITHUB_CLIENT_SECRET="tu_github_secret" \
  -e GOOGLE_CLIENT_ID="tu_google_id" \
  -e GOOGLE_CLIENT_SECRET="tu_google_secret" \
  -e GOOGLE_MAPS_PLACES_API_KEY="tu_maps_key" \
  -e PUBLIC_GOOGLE_MAPS_EMBED_API_KEY="tu_maps_embed_key" \
  -e TWITTER_CLIENT_ID="tu_twitter_id" \
  -e TWITTER_CLIENT_SECRET="tu_twitter_secret" \
  -e PINATA_JWT="tu_pinata_jwt" \
  -e PINATA_GATEWAY_URL="tu_pinata_url" \
  eventoswiki:latest
```

## Acceso

Una vez que el contenedor esté en ejecución, accede a la aplicación en:

```
http://localhost:4321
```

## Arquitectura del Dockerfile

El Dockerfile utiliza un build multi-stage para optimizar el tamaño de la imagen:

1. **deps**: Instala las dependencias del proyecto usando pnpm
2. **builder**: Construye la aplicación Astro con todas las variables de entorno necesarias
3. **runner**: Imagen de producción optimizada con solo lo necesario para ejecutar

### Características de Seguridad

- Utiliza usuario no privilegiado (`astro:nodejs`)
- Ejecuta con permisos mínimos necesarios
- Expone solo el puerto 4321
- No incluye herramientas de desarrollo en la imagen final

### Optimizaciones

- **pnpm**: Usa pnpm en versión específica (9.15.2) para instalación rápida y eficiente de dependencias
- **Caché de capas**: Docker cachea cada etapa para builds más rápidos en iteraciones sucesivas
- **Multi-stage build**: Reduce el tamaño final de la imagen al ~50% comparado con single-stage
- **Alpine Linux**: Base ligera que reduce el footprint de ~1GB a ~300MB
- **Production only**: Solo incluye dependencias necesarias para ejecutar, no para desarrollar

## Troubleshooting

### Error: "corepack prepare pnpm@latest --activate" failed

Si recibes un error similar a:

```
ERROR: failed to build: failed to solve: process "/bin/sh -c corepack enable && corepack prepare pnpm@latest --activate" did not complete successfully: exit code: 1
```

Este error se ha solucionado en el Dockerfile actual usando una versión específica de pnpm (9.15.2) en lugar de `@latest` y configurando correctamente las variables de entorno de pnpm.

### El contenedor no inicia

Verifica los logs:

```bash
docker-compose logs eventoswiki
```

### Problemas de conexión a la base de datos

Asegúrate de que las variables `ASTRO_DB_REMOTE_URL` y `ASTRO_DB_APP_TOKEN` estén configuradas correctamente.

### Puerto 4321 ya en uso

Cambia el puerto en `docker-compose.yml`:

```yaml
ports:
  - '3000:4321' # Usa el puerto 3000 en tu máquina local
```

### Variables de entorno no se cargan

Verifica que el archivo `.env` esté en el mismo directorio que `docker-compose.yml` y que tenga el formato correcto (sin espacios alrededor del `=`).

### Error de permisos en Alpine Linux

Si encuentras errores de permisos, puede ser debido a que Alpine usa musl en lugar de glibc. El Dockerfile ya está configurado para usar un usuario no root con los permisos adecuados.

## Producción

Para desplegar en producción, considera:

1. Usar un orquestador como Kubernetes o Docker Swarm
2. Configurar un reverse proxy (Nginx, Traefik, Caddy)
3. Habilitar HTTPS con certificados SSL
4. Configurar volúmenes para persistencia de datos si es necesario
5. Implementar monitoreo y logging centralizado
6. Configurar health checks y restart policies

## Limpieza

Para limpiar recursos de Docker:

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar imágenes
docker rmi eventoswiki:latest

# Limpiar todo (cuidado: elimina todos los recursos no utilizados)
docker system prune -a
```
