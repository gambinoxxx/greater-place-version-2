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
- Keep the MUI theme centralized in `lib/theme.js`. It is a client module (`'use client'`) because the theme object contains functions and cannot cross the Server→Client boundary as a prop; `app/layout.js` remains a Server Component that imports it into `ThemeProvider`.
- Tailwind CSS 3.3.2 is used primarily for layout, spacing, and utility composition.
- Avoid duplicating the same design-token definitions in arbitrary component files.
- Never hardcode Greater Place hex values in individual components when an approved MUI/Tailwind token exists.
- Global shape is square (`borderRadius: 0`) except for intentionally circular UI elements.
- Typography uses Fraunces for display headings and Manrope for body/UI text.
- The application is dark-only until a deliberately designed light palette is approved. `next-themes` is not the current source of truth for application theming.

## Rendering stored content

- `Post.body` is Markdown and is rendered only through `components/MarkdownBody.jsx` (`react-markdown`, React elements out, raw HTML dropped, URLs sanitized).
- Never use `dangerouslySetInnerHTML` with database or user-supplied content. Do not add `rehype-raw` or other raw-HTML passthrough to the Markdown pipeline.
- Search and filter parameters are read from `searchParams` on the server, validated/normalised, and passed to Prisma; escape SQL `LIKE` wildcards in free-text search terms.

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

- Validate all external input, on the server, before any database call. Put field rules in a pure module (see `lib/contact-validation.js`) so the browser can reuse them for instant feedback; the server remains authoritative.
- Return the standard `{ data, error }` shape: success is `{ data, error: null }`; failure is `{ data: null, error: { message, fields? } }` where `fields` maps field names to user-facing messages.
- Use appropriate HTTP status codes (400 validation or unreadable body, 413 too large, 415 wrong content type, 201 created, 500 unexpected).
- Never return raw database or driver errors, stack traces, or connection details to the client. Return a generic message and log only a coarse error class name (never the request body).
- JSON write endpoints require `Content-Type: application/json` (415 otherwise) and cap the body size.
- Do not leak secrets or server-only environment values to the client.

## ImageKit

- Use `@imagekit/nodejs` for server-side ImageKit operations.
- Use `@imagekit/javascript` for browser/client functionality where required.
- Keep server credentials and signing logic server-side: only `lib/imagekit.js` reads `IMAGEKIT_PRIVATE_KEY`, and it is never imported from a client component. Delivery helpers that need no secret live in `lib/image-url.js`.
- Store only ImageKit file IDs/URLs in Postgres. The convention is the delivered `url` returned by an upload.
- Render stored image URLs with `components/ImageKitImage.jsx` (pass a `sizes` hint), not a raw `<img>`. Gate with `isImageUrl()` and show a placeholder otherwise. Do not use ImageKit for the site's own design assets.
- Upload from the browser with `components/useImageUpload.js`; do not write a second upload path. Any route that hands out an upload signature must be admin-only (`/api/imagekit-auth` is listed in `proxy.js`'s matcher).
- The SDK's `getAuthenticationParameters` treats `expire` as an absolute Unix time (its JSDoc says "seconds from now"); keep passing an absolute time.

## Authentication (Clerk)

- Clerk authenticates; the email allowlist (`ADMIN_ALLOWED_EMAILS`, evaluated in `lib/admin-access.js`) authorizes. Being signed in is never enough for admin access.
- `proxy.js` is Next 16's `proxy` (the deprecated `middleware.js`). It runs only on the protected paths in its matcher; never make it match the public site.
- New admin pages, Route Handlers, and Server Actions re-check with `getAdminSession()` (`lib/admin-auth.js`) and keep admin APIs under `/api/admin/**` so the matcher covers them. Return JSON 401/403 from APIs, never redirects.
- Fail closed: missing keys, an empty allowlist, or a failed user lookup deny.
- Do not add auth or user models to Prisma; Clerk owns identity. Firebase is not used.
- Set the Clerk keys before `next build` (the publishable key is inlined). Never hardcode keys or allowlist addresses.

## Components

Shared components should be reusable and props-driven.

`components/` must not directly query Prisma. Clerk server APIs (`auth()`, `currentUser()`) belong in `proxy.js` and `lib/admin-auth.js`, not in shared components.

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
