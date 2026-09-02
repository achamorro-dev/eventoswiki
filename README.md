**English** | [Español](README.es-ES.md)

<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://eventos.wiki">
    <img src="docs/icon.png" alt="Icon" width="80" height="80">
  </a>
  <h1 align="center">eventos.wiki</h1>
  <h3>all technological events in one place</h3>

  <h3>Supported by</h3>

  <div align="center">
    <a href="https://codely.com" align="center">
      <img src="docs/sponsors/codely.png" alt="Codely" width="300" align="center">
    </a>
  </div>

  <h3>An initiative driven by <a href="https://wearenext.es">We Are Next</a></h3>

  <div align="center">
    <a href="https://sirviendocodigo.com" align="center">
      <img src="docs/sponsors/sirviendo-codigo.png" alt="Sirviendo Código" width="240" align="center">
    </a>
  </div>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

eventos.wiki gathers the technological events and meetups happening in Spain, published by the community itself.
Organizations keep their own agenda, and anyone can browse by province, by date or through the calendar.

Everything published is also available as open data — see [Public feeds](#public-feeds).

<p align="right"><a style="font-size: 0.75rem" href="#readme-top">back to top</a></p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This project uses [pnpm](https://pnpm.io/installation) as its package manager, and the version is pinned in the
`packageManager` field, so the easiest way to get the right one is Corepack:

```shell
corepack enable
```

The Node version is pinned in `.nvmrc` and in the `volta` field of `package.json`. If you use
[volta](https://volta.sh) or `nvm`, they will pick it up on their own.

| Requirement | Version    |
| ----------- | ---------- |
| Node        | >= 24.16.0 |
| pnpm        | >= 11.23.0 |

### Tools and libraries used

- [Astro](https://astro.build/) web framework, rendering on the server with the Node adapter
- [Astro DB](https://docs.astro.build/en/guides/astro-db/) over libSQL, with [Drizzle](https://orm.drizzle.team/) for queries
- [React](https://reactjs.org/) for dynamic components
- [Lucia](https://lucia-auth.com/) for sessions, with GitHub, Google and X as providers
- [Tailwind CSS](https://tailwindcss.com/) v4 and [Radix UI](https://www.radix-ui.com/) primitives
- [TipTap](https://tiptap.dev/) as the rich text editor
- [React Email](https://react.email/) plus [Resend](https://resend.com/) for transactional email
- [Zod](https://zod.dev/) for validation, and [React Hook Form](https://react-hook-form.com/) for forms
- [MDX](https://mdxjs.com/) for the changelog content
- [TypeScript](http://www.typescriptlang.org)
- [Biome](https://biomejs.dev/) for linting and formatting, with Prettier covering the `.astro` files

### Installation

To install the required dependencies you should execute the following command:

```shell
pnpm i --frozen-lockfile
```

### Environment variables

Copy the example file and fill in the values you need:

```shell
cp .env.example .env
```

| Variable                                          | What it is for                                  |
| ------------------------------------------------- | ----------------------------------------------- |
| `BASE_URL`                                        | Public base URL, used to build OAuth callbacks  |
| `ASTRO_DB_REMOTE_URL`, `ASTRO_DB_APP_TOKEN`       | Remote Astro DB connection                      |
| `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET` | Sign in with GitHub                        |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`        | Sign in with Google                             |
| `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`      | Sign in with X                                  |
| `GOOGLE_MAPS_PLACES_API_KEY`                      | Place lookup on the server                      |
| `PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`                | Embedded map on the event page                  |
| `PINATA_JWT`, `PINATA_GATEWAY_URL`                | Image upload and serving                        |
| `RESEND_API_KEY`                                  | Sending notification emails                     |

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">back to top</a></p>

### Run

To run the application in develop mode (in your local machine enabling hot reload) you can use:

```shell
pnpm dev
```

That command works against a local database. To point at the remote one instead, use `pnpm start`, which is the same
dev server with the `--remote` flag. The production build also reads from the remote database:

```shell
pnpm build
pnpm preview
```

### Code quality

Biome handles linting and formatting for TypeScript, JavaScript, JSON and CSS:

```shell
pnpm lint       # check
pnpm lint:fix   # check and apply the safe fixes
pnpm format     # format only
```

`.astro` files sit outside Biome's scope — `biome.json` ignores `**/*.astro` — so they are formatted by Prettier
through `prettier-plugin-astro`. Tailwind class order is normalized by `prettier-plugin-tailwindcss`.

Types and Astro collections are checked separately:

```shell
pnpm astro check
```

Installing the git hooks with `pnpm hooks` adds two checks: Biome over the staged files, and commitlint over the
message, which follows [Conventional Commits](https://www.conventionalcommits.org/).

### Docker

There is a `Dockerfile` and a `docker-compose.yml` to run the project in containers. The steps are in
[DOCKER.md](DOCKER.md).

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">back to top</a></p>

## Public feeds

Published content is also exposed as open data, with CORS enabled so third parties can read it:

| Route                                    | Format                                                              |
| ---------------------------------------- | ------------------------------------------------------------------- |
| `/events.json`                           | [OpenTechEvents](https://opentechevents.org) v0.4.0 feed, plus JSON-LD      |
| `/events.ics`                            | iCalendar, to subscribe from any calendar app                       |
| `/organizations/<handle>/events.json`    | The same feed limited to one organization                           |
| `/organizations/<handle>/events.ics`     | The same calendar limited to one organization                       |

## Documentation

| File                         | What it covers                                             |
| ---------------------------- | ---------------------------------------------------------- |
| [DESIGN.md](DESIGN.md)       | Design system: colors, typography, components              |
| [DOCKER.md](DOCKER.md)       | Running the project in containers                          |
| [CHANGELOG.md](CHANGELOG.md) | Notable changes                                            |
| [AGENTS.md](AGENTS.md)       | Architecture and conventions to follow when contributing   |

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes following Conventional Commits (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Before opening it, give [AGENTS.md](AGENTS.md) a read: it describes the module structure and the conventions the
codebase follows.

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">back to top</a></p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">back to top</a></p>

## Contact

Alberto Chamorro - [albertochamorro.dev](https://albertochamorro.dev)

<p align="right"><a style="font-size: 0.5rem" href="#readme-top">back to top</a></p>
