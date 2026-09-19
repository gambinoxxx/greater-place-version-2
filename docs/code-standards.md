# Greater Place V2 — Code Standards

## Core rules

- JavaScript only: `.js` and `.jsx`. Do not introduce TypeScript.
- Keep implementations small and single-purpose.
- Fix root causes instead of adding `!important` or other workaround CSS.
- Do not make unrelated changes while implementing a roadmap unit.
- Validate external input at the system boundary.
- Follow the approved visual system; do not invent a new design language.

## Next.js / React

- Use the App Router.
- Server Components are the default.
- Add `"use client"` only when browser APIs, local interactive state, DOM events, or another client-only requirement exists.
- Keep data fetching in the page or a focused server helper and pass data into shared components through props.
- Route Handlers should remain focused on request parsing, validation, authorization, and response formatting.
- Use the repository-root `app/` directory. Do not add `src/` unless explicitly approved.
- Target Next.js 16.3.3 and React 19.2.0 for this project.

## MUI and styling

- MUI 9.4.0 is the primary component library.
- Use `@mui/material-nextjs` 9.4.0 for App Router integration.
- Use `AppRouterCacheProvider` where MUI's Next.js integration requires it.
- Do not copy the old custom Emotion SSR `ThemeRegistry` from the Next.js 13 project.
- Keep the MUI theme centralized in `lib/theme.js`.
- Tailwind CSS 3.3.2 is used primarily for layout, spacing, and utility composition.
- Avoid duplicating the same design-token definitions in arbitrary component files.
- Never hardcode Greater Place hex values in individual components when an approved MUI/Tailwind token exists.
- Global shape is square (`borderRadius: 0`) except for intentionally circular UI elements.
- Typography uses Fraunces for display headings and Manrope for body/UI text.
- The application is dark-only until a deliberately designed light palette is approved. `next-themes` is not the current source of truth for application theming.

## Database / Prisma

- Prisma 5.22.0.
- Keep a single Prisma client singleton in `lib/prisma.js`.
- Neon/Postgres is the source of truth for structured content.
- Use migrations for schema changes.
- Do not manually alter an applied migration.
- Database access belongs in server code, not shared presentational components.
- Keep models minimal until requirements are explicit.
- Use string `cuid()` IDs unless the architecture is explicitly changed.
- Keep image fields as ImageKit IDs/URLs only; never store image binaries in Postgres.
- `Post.category` remains a string until the final category vocabulary is approved.

## API conventions

- Validate all external input.
- Return the standard `{ data, error }` shape.
- Use appropriate HTTP status codes.
- Do not leak secrets or server-only environment values to the client.

## ImageKit

- Use `@imagekit/nodejs` for server-side ImageKit operations.
- Use `@imagekit/javascript` for browser/client functionality where required.
- Keep server credentials and signing logic server-side.
- Store only ImageKit file IDs/URLs in Postgres.

## Firebase

- Firebase is intentionally unscoped until its exact role is confirmed.
- Do not assume Firebase Auth, Firestore, or Storage responsibilities.
- Do not add auth/user models to Prisma based only on the existence of Firebase dependencies.

## Components

Shared components should be reusable and props-driven.

`components/` must not directly query Prisma or Firebase.

Keep route-specific data and composition in the route.

## Documentation and workflow

- `docs/architecture.md` defines technical structure and dependency roles.
- `docs/ui-context.md` defines visual tokens and interaction patterns.
- `docs/project-overview.md` defines product scope.
- `docs/implementation-roadmap.md` defines implementation order.
- `docs/ai-workflow-rules.md` defines incremental workflow.
- `docs/progress-tracker.md` is user-maintained and read-only for agents.

Before moving to another implementation unit, verify the current unit renders/builds as applicable and surface a concise checkpoint summary for the progress tracker.

## Version modernization decision

The V2 restart uses Next.js 16.3.3 + React 19.2.0 + MUI 9.4.0. This is an implementation-stack change only. The approved Greater Place content model, visual direction, route plan, and design tokens remain unchanged.
