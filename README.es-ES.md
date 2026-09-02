[English](README.md) | **Español**

<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://eventos.wiki">
    <img src="docs/icon.png" alt="Icono" width="80" height="80">
  </a>
  <h1 align="center">eventos.wiki</h1>
  <h3>todos los eventos tecnológicos en un solo lugar</h3>

  <h3>Con el apoyo de</h3>

  <div align="center">
    <a href="https://codely.com" align="center">
      <img src="docs/sponsors/codely.png" alt="Codely" width="300" align="center">
    </a>
  </div>

  <h3>Iniciativa impulsada por <a href="https://wearenext.es">We Are Next</a></h3>

  <div align="center">
    <a href="https://sirviendocodigo.com" align="center">
      <img src="docs/sponsors/sirviendo-codigo.png" alt="Sirviendo Código" width="240" align="center">
    </a>
  </div>
</div>

<!-- ABOUT THE PROJECT -->

## Acerca del Proyecto

eventos.wiki reúne los eventos y meetups tecnológicos que se celebran en España, publicados por la propia comunidad.
Las organizaciones mantienen su agenda y cualquiera puede buscar por provincia, por fecha o desde el calendario.

Todo lo publicado está además disponible como datos abiertos: mira [Feeds públicos](#feeds-públicos).

<p align="right"><a style="font-size: 0.75rem" href="#readme-top">volver arriba</a></p>

<!-- GETTING STARTED -->

## Primeros pasos

### Requisitos previos

Este proyecto usa [pnpm](https://pnpm.io/installation) como gestor de paquetes, y la versión está fijada en el campo
`packageManager`, así que la forma más cómoda de tener la correcta es Corepack:

```shell
corepack enable
```

La versión de Node está fijada en `.nvmrc` y en el campo `volta` de `package.json`. Si usas
[volta](https://volta.sh) o `nvm`, la cogerán solos.

| Requisito | Versión    |
| --------- | ---------- |
| Node      | >= 24.16.0 |
| pnpm      | >= 11.23.0 |

### Herramientas y bibliotecas utilizadas

- [Astro](https://astro.build/) como framework web, renderizando en servidor con el adaptador de Node
- [Astro DB](https://docs.astro.build/en/guides/astro-db/) sobre libSQL, con [Drizzle](https://orm.drizzle.team/) para las consultas
- [React](https://reactjs.org/) para los componentes dinámicos
- [Lucia](https://lucia-auth.com/) para las sesiones, con GitHub, Google y X como proveedores
- [Tailwind CSS](https://tailwindcss.com/) v4 y primitivas de [Radix UI](https://www.radix-ui.com/)
- [TipTap](https://tiptap.dev/) como editor de texto enriquecido
- [React Email](https://react.email/) y [Resend](https://resend.com/) para el correo transaccional
- [Zod](https://zod.dev/) para validación y [React Hook Form](https://react-hook-form.com/) para formularios
- [MDX](https://mdxjs.com/) para el contenido del changelog
- [TypeScript](http://www.typescriptlang.org)
- [Biome](https://biomejs.dev/) para linter y formateo, con Prettier cubriendo los ficheros `.astro`

### Instalación

Para instalar las dependencias requeridas debes ejecutar el siguiente comando:

```shell
pnpm i --frozen-lockfile
```

### Variables de entorno

Copia el fichero de ejemplo y rellena los valores que necesites:

```shell
cp .env.example .env
```

| Variable                                          | Para qué sirve                                    |
| ------------------------------------------------- | ------------------------------------------------- |
| `BASE_URL`                                        | URL base pública, con la que se arman los callbacks de OAuth |
| `ASTRO_DB_REMOTE_URL`, `ASTRO_DB_APP_TOKEN`       | Conexión con la Astro DB remota                   |
| `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET` | Inicio de sesión con GitHub                  |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`        | Inicio de sesión con Google                       |
| `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`      | Inicio de sesión con X                            |
| `GOOGLE_MAPS_PLACES_API_KEY`                      | Búsqueda de lugares en el servidor                |
| `PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`                | Mapa embebido en la página de evento              |
| `PINATA_JWT`, `PINATA_GATEWAY_URL`                | Subida y servido de imágenes                      |
| `RESEND_API_KEY`                                  | Envío de los correos de notificación              |

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">volver arriba</a></p>

### Ejecutar

Para ejecutar la aplicación en modo de desarrollo (en tu máquina local habilitando la recarga en caliente) puedes usar:

```shell
pnpm dev
```

Ese comando trabaja contra una base de datos local. Para apuntar a la remota usa `pnpm start`, que es el mismo
servidor de desarrollo con el flag `--remote`. La compilación de producción también lee de la remota:

```shell
pnpm build
pnpm preview
```

### Calidad de código

Biome se encarga del linter y el formateo de TypeScript, JavaScript, JSON y CSS:

```shell
pnpm lint       # comprobar
pnpm lint:fix   # comprobar y aplicar las correcciones seguras
pnpm format     # solo formatear
```

Los ficheros `.astro` quedan fuera del alcance de Biome —`biome.json` ignora `**/*.astro`—, así que los formatea
Prettier con `prettier-plugin-astro`. El orden de las clases de Tailwind lo normaliza `prettier-plugin-tailwindcss`.

Los tipos y las colecciones de Astro se comprueban aparte:

```shell
pnpm astro check
```

Instalar los hooks de git con `pnpm hooks` añade dos comprobaciones: Biome sobre los ficheros en staging y commitlint
sobre el mensaje, que sigue [Conventional Commits](https://www.conventionalcommits.org/).

### Docker

Hay un `Dockerfile` y un `docker-compose.yml` para levantar el proyecto en contenedores. Los pasos están en
[DOCKER.md](DOCKER.md).

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">volver arriba</a></p>

## Feeds públicos

El contenido publicado se expone también como datos abiertos, con CORS habilitado para que terceros puedan leerlo:

| Ruta                                     | Formato                                                             |
| ---------------------------------------- | ------------------------------------------------------------------- |
| `/events.json`                           | Feed [OpenTechEvents](https://opentechevents.org) v0.4.0, más JSON-LD |
| `/events.ics`                            | iCalendar, para suscribirse desde cualquier calendario              |
| `/organizations/<handle>/events.json`    | El mismo feed limitado a una organización                           |
| `/organizations/<handle>/events.ics`     | El mismo calendario limitado a una organización                     |

## Documentación

| Fichero                      | Qué cubre                                                  |
| ---------------------------- | ---------------------------------------------------------- |
| [DESIGN.md](DESIGN.md)       | Sistema de diseño: colores, tipografía, componentes        |
| [DOCKER.md](DOCKER.md)       | Levantar el proyecto en contenedores                       |
| [CHANGELOG.md](CHANGELOG.md) | Cambios destacados                                         |
| [AGENTS.md](AGENTS.md)       | Arquitectura y convenciones a seguir al contribuir         |

## Contribución

Las contribuciones son lo que hacen de la comunidad de código abierto un lugar tan increíble para aprender, inspirarse y crear. Cualquier contribución que hagas es **muy apreciada**.

Si tienes una sugerencia que mejoraría esto, por favor haz un fork del repositorio y crea un pull request. También puedes simplemente abrir un issue con la etiqueta "enhancement".
¡No olvides darle una estrella al proyecto! ¡Gracias de nuevo!

1. Haz un fork del Proyecto
2. Crea tu rama de funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Realiza los commits siguiendo Conventional Commits (`git commit -m 'feat: add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Antes de abrirlo, échale un ojo a [AGENTS.md](AGENTS.md): describe la estructura de módulos y las convenciones que
sigue el código.

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">volver arriba</a></p>

## Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">volver arriba</a></p>

## Contacto

Alberto Chamorro - [albertochamorro.dev](https://albertochamorro.dev)

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">volver arriba</a></p>
