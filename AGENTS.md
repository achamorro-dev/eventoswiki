# EventosWiki Agent Guidelines

## Project Overview

This is an Astro-based event management platform built with TypeScript, React, and a clean architecture pattern. The project follows Domain-Driven Design (DDD) principles with a modular structure.

## Project Structure & Module Organization

Astro handles routing from `src/pages`, with shared layout primitives in `src/layouts` and global styles in `src/styles`. Domain logic is grouped under `src/modules` (e.g. `events`, `meetups`, `organizations`) while cross-cutting utilities live in `src/modules/shared`. Database schemas, content migrations, and seeds live in `db/`, and static assets are split between `public/` for runtime delivery and `docs/` for marketing collateral.

### Clean Architecture Structure

- **Domain Layer**: Contains business logic, entities, value objects, and domain services
- **Application Layer**: Contains use cases, commands, and application services
- **Infrastructure Layer**: Contains database repositories and external service implementations
- **Presentation Layer**: Contains UI components, forms, and server actions

### Module Organization

Each feature module follows this structure:

```
src/modules/{module-name}/
??? domain/           # Business logic, entities, value objects
??? application/      # Use cases, commands, queries
??? infrastructure/   # Database repositories, external services
??? presentation/     # UI components, forms, server actions
```

### Shared Module

The shared module contains:

- `src/modules/shared/domain/` - Common domain utilities (DateTime, Primitives, ValueObject)
- `src/modules/shared/presentation/ui/` - Reusable UI components (shadcn/ui based)
- `src/modules/shared/application/` - Common use case patterns

## Build, Test, and Development Commands

Install dependencies with `pnpm install --frozen-lockfile` to stay aligned with CI. Use `pnpm dev` for hot-reload development, `pnpm build` for production bundles, and `pnpm preview` to inspect the compiled output. Run `pnpm astro check` whenever you touch Astro collections or TypeScript types to catch regressions early.

### Development Workflow

- **Git Hooks**: Use simple-git-hooks for pre-commit formatting
- **Code Formatting**: Use Prettier with Tailwind plugin
- **Linting**: Use commitlint for conventional commits
- **Type Checking**: Run `pnpm astro check` regularly

## Coding Standards

### TypeScript Configuration

- Use strict TypeScript configuration
- Follow the established path aliases:
  - `@/ui/*` ? `./src/modules/shared/presentation/ui/*`
  - `@/shared/*` ? `./src/modules/shared/*`
  - `@/{module}/*` ? `./src/modules/{module}/*`
  - `@/*` ? `./src/*`

### Coding Style & Naming Conventions

Prettier enforces two-space indentation, single quotes, trailing commas, and no semicolons; format large sets of changes with `pnpm exec prettier --write .`. Tailwind utility order is normalized by `prettier-plugin-tailwindcss`, so keep class lists descriptive rather than rearranging manually.

#### Clean Code Principles

- **No Line-by-Line Comments**: Write self-documenting code that explains intent through clear naming and structure
- **Semantic Code**: Use descriptive variable, function, and class names that explain purpose without comments
- **Single Responsibility**: Each function/class should have one reason to change
- **Meaningful Names**: Use pronounceable, searchable names that reveal intent
- **Small Functions**: Keep functions under 20 lines with descriptive names
- **No Magic Numbers**: Extract constants with meaningful names
- **Explicit Intent**: Code should read like well-written prose

**Example of Clean Code:**
```typescript
// ❌ Avoid this
const calculate = (a: number, b: number): number => {
  // Calculate the total price including tax
  const tax = 0.21 // 21% tax rate
  return a * b * (1 + tax)
}

// ✅ Prefer this
const calculateTotalPriceWithTax = (unitPrice: number, quantity: number): number => {
  const STANDARD_TAX_RATE = 0.21
  return unitPrice * quantity * (1 + STANDARD_TAX_RATE)
}
```

**File Naming Conventions:**

- **Components**: PascalCase (e.g., `EventEditForm.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useUploadFile.ts`)
- **Utilities**: camelCase (e.g., `datetime.ts`)
- **Types**: PascalCase (e.g., `EventData.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DATE_FORMATS.ts`)
- **Route-level `.astro` files**: kebab-case to match Astro expectations
- **React components**: PascalCase
- **Hooks and utilities**: camelCase

### Domain Layer Patterns

- **Entities**: Use private constructors with static factory methods
- **Value Objects**: Extend the base `ValueObject<T>` class
- **Primitives**: Use the `Primitives<T>` type for serialization/deserialization
- **Validation**: Implement domain validators for business rules
- **IDs**: Use dedicated ID classes (e.g., `EventId`, `OrganizationId`)

Example Entity Pattern:

```typescript
export class Event implements EventProps {
  private constructor(props: EventProps) {
    /* ... */
  }

  static fromPrimitives(primitives: Primitives<Event>): Event {
    /* ... */
  }
  toPrimitives(): Primitives<Event> {
    /* ... */
  }
  static create(data: EventData, organizationId: string): Event {
    /* ... */
  }
}
```

### Application Layer Patterns

- **Use Cases**: Extend the base `UseCase<Param, Result>` class
- **Commands**: Extend the `Command<Param, Result>` class for write operations
- **Queries**: Use regular functions for read operations
- **Dependency Injection**: Use constructor injection for dependencies

Example Use Case Pattern:

```typescript
export class CreateEventCommand extends Command<Param, void> {
  constructor(private readonly eventsRepository: EventsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    /* ... */
  }
}

### Infrastructure Layer Patterns

- **Mappers**: Use mapper classes to convert between database objects and domain entities.
- **DTOs (Data Transfer Objects)**: Define interfaces for raw database objects to ensure type safety in mappers.
- **Organization**:
  - Place mappers in `infrastructure/mappers/`.
  - Place DTOs in `infrastructure/dtos/`.
  - Always extract DTO interfaces to their own files.
- **Naming Conventions**:
  - DTOs: `AstroDb{Entity}Dto` (e.g., `AstroDbBugDto`)
  - Mappers: `AstroDb{Entity}Mapper` (e.g., `AstroDbBugMapper`)

Example Mapper Pattern:

```typescript
import { Bug } from '../../domain/bug'
import type { AstroDbBugDto } from '../dtos/astro-db-bug.dto'

export class AstroDbBugMapper {
  static toDomain(raw: AstroDbBugDto, userName?: string): Bug {
    return new Bug({
      /* ... mapping logic ... */
    })
  }

  static toPersistence(bug: Bug) {
    return {
      /* ... mapping logic ... */
    }
  }
}
```
```

## Dependency Injection Patterns

The project uses **diod** library for dependency injection without decorators. Dependencies are manually defined in containers and resolved through constructor injection.

### Container Setup

- **No Decorators**: Avoid using `@Service` or similar decorators
- **Manual Registration**: Define all dependencies manually in container files
- **Constructor Injection**: Dependencies are injected through constructors
- **Module Containers**: Each module has its own container definition
- **ContainerBuilder**: Use ContainerBuilder for creating containers
- **CamelCase Exports**: Container names must be in CamelCase (e.g., `provincesContainer`)

Example Container Pattern:

```typescript
import { ContainerBuilder } from 'diod'

export const eventsContainer = new ContainerBuilder()
  .register(
    EventsRepository,
    AstroDBEventsRepository,
    { scope: 'singleton' }
  )
  .register(
    CreateEventCommand,
    CreateEventCommand,
    { scope: 'transient' }
  )
  .build()
```

### Using Dependencies

Resolve dependencies from the appropriate container when needed:

```typescript
const createEventCommand = eventsContainer.get(CreateEventCommand)
await createEventCommand.execute(eventData)
```

### Presentation Layer Patterns

- **React Components**: Use functional components with TypeScript
- **Forms**: Use react-hook-form with Zod validation
- **Server Actions**: Use Astro's server actions for form submissions
- **Client Components**: Mark with `'use client'` directive when needed

### UI Component Patterns

- **shadcn/ui**: Use the established component library
- **Styling**: Use Tailwind CSS with the `cn()` utility for class merging
- **Variants**: Use class-variance-authority for component variants
- **Icons**: Use Lucide React icons consistently

Example Component Pattern:

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: { /* ... */ },
    defaultVariants: { /* ... */ }
  }
)

function Button({ className, variant, size, ...props }: Props) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

## Database Patterns

- **Schema**: Define tables in `db/config.ts` using Astro DB
- **Migrations**: Use the content migration system
- **IMPORTANT**: Never run database migrations automatically. After modifying `db/config.ts`, only run `pnpm exec astro db push` when explicitly instructed by the user
- **Repositories**: Define interfaces as abstract classes in domain layer, implement in infrastructure layer
- **Primitives**: Convert between domain objects and database primitives
- When altering database tables or seeds, run the relevant script in `db/` and document the dataset or migration steps in your PR

## Form Patterns

- **Validation**: Use Zod schemas for form validation
- **Error Handling**: Display errors using FormMessage components
- **File Uploads**: Use the `useUploadFile` hook for image uploads
- **Date Handling**: Use the `Datetime` utility class for date operations

## State Management

- **Local State**: Use React hooks (useState, useEffect)
- **Form State**: Use react-hook-form
- **Server State**: Use Astro server actions
- **Global State**: Use React Context when needed

## Error Handling

- **Domain Errors**: Create specific error classes (e.g., `InvalidEventError`)
- **Form Errors**: Use react-hook-form error handling
- **Toast Notifications**: Use Sonner for user feedback
- **Validation**: Use Zod for runtime validation

## Testing Guidelines

An automated suite is not in place yet; add coverage alongside the feature you touch (e.g. `src/modules/events/__tests__/event-form.spec.ts`) and keep fixtures small. At minimum, exercise critical flows (creating events, joining meetups, auth) against `pnpm dev` before requesting a review.

- **Unit Tests**: Test domain logic and use cases
- **Integration Tests**: Test server actions and API endpoints
- **Component Tests**: Test React components with user interactions
- **E2E Tests**: Test complete user flows

## Performance Considerations

- **Code Splitting**: Use dynamic imports for large components
- **Image Optimization**: Use Sharp for image processing
- **Bundle Size**: Monitor and optimize bundle size
- **Lazy Loading**: Implement lazy loading for heavy components

## Security Guidelines

- **Input Validation**: Always validate user input
- **Authentication**: Use Lucia for session management
- **Authorization**: Check permissions before operations
- **CSRF Protection**: Use Astro's built-in CSRF protection

## Commit & Pull Request Guidelines

This repo uses `@commitlint/config-conventional`, so follow `type(scope): subject` (`feat(events): add recurring schedules`) and keep subjects under 72 characters. Enable the local hooks with `pnpm exec simple-git-hooks`; the `pre-commit` hook runs `pretty-quick` to enforce formatting prior to linting. PRs should describe the problem, the approach, any manual testing, and include screenshots for UI work; call out new `.env` keys or config changes so reviewers can reproduce.

## Common Patterns to Follow

### Creating a New Entity

1. Create domain entity with private constructor
2. Add value objects for IDs and complex types
3. Implement fromPrimitives/toPrimitives methods
4. Add domain validators
5. Create repository interface
6. Implement infrastructure repository
7. Create use cases for operations
8. Set up dependency injection container for the module
9. Add presentation components

### Creating a New Form

1. Define Zod schema for validation
2. Create form component with react-hook-form
3. Add server action for form submission
4. Implement error handling and loading states
5. Add proper accessibility attributes

### Creating a New UI Component

1. Use shadcn/ui as base when possible
2. Add proper TypeScript types
3. Use class-variance-authority for variants
4. Add proper accessibility support
5. Export from appropriate index files

## File Organization Rules

### No Barrel Files

Do not create barrel files (index.ts files that re-export modules). Import directly from the source files to maintain clear dependencies and avoid circular imports. This applies to:

- Domain entities and value objects
- Application use cases and commands
- Infrastructure repositories
- Presentation components
- Shared utilities

**Example of correct imports:**
```typescript
// ❌ Don't do this
import { Event, EventId } from '@/events/domain'

// ✅ Do this instead
import { Event } from '@/events/domain/event'
import { EventId } from '@/events/domain/event-id'
```

### Prohibited Patterns

- **No `window.location.reload()`**: Do not use full page reloads for refreshing data. Instead, use Astro's View Transitions `navigate()` function with `{ history: 'replace' }` option to refresh data without a full page reload.

**Correct pattern for refreshing data:**
```typescript
import { navigate } from 'astro:transitions/client'

const refreshPage = () => {
  const currentUrl = new URL(window.location.href)
  navigate(currentUrl.pathname + currentUrl.search, { history: 'replace' })
}
```

## Dependencies

- **Astro**: 5.14.8 (SSG/SSR framework)
- **React**: 18.2.0 (UI library)
- **TypeScript**: 5.3.3 (Type system)
- **Tailwind CSS**: 4.1.3 (Styling)
- **shadcn/ui**: UI component library
- **Zod**: 3.24.2 (Validation)
- **react-hook-form**: 7.55.0 (Form management)
- **Lucia**: 3.2.2 (Authentication)
- **Astro DB**: 0.18.0 (Database)
- **diod**: Dependency injection container

## Environment Variables

- `BASE_URL`: Public base URL
- `ASTRO_DB_REMOTE_URL`: Database connection
- `ASTRO_DB_APP_TOKEN`: Database token
- `OAUTH_GITHUB_CLIENT_ID/SECRET`: GitHub OAuth
- `GOOGLE_CLIENT_ID/SECRET`: Google OAuth
- `TWITTER_CLIENT_ID/SECRET`: Twitter OAuth
- `PINATA_JWT`: IPFS storage
- `PINATA_GATEWAY_URL`: IPFS gateway
- `GOOGLE_MAPS_PLACES_API_KEY`
- `PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`
- `RESEND_API_KEY`

## Build & Deployment

- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Preview**: `pnpm preview`
- **Deployment**: Netlify with server-side rendering
- **Database**: Astro DB with remote connection

Remember to follow these patterns consistently throughout the codebase to maintain code quality and architectural integrity.
