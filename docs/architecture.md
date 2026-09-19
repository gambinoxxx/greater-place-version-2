# Greater Place — Architecture

## Overview

Greater Place is an editorial performing-arts, ministry, and youth-development nonprofit website. The application uses the Next.js App Router and JavaScript, with structured content stored in Neon Postgres through Prisma and images managed through ImageKit.

## Stack

- Framework: Next.js 16.3.3
- UI runtime: React 19.2.0
- Language: JavaScript (.js / .jsx); no TypeScript
- Routing: Next.js App Router
- UI library: MUI 9.4.0
- MUI App Router integration: @mui/material-nextjs 9.4.0
- Styling utilities: Tailwind CSS 3.3.2, PostCSS, Autoprefixer
- Theming: MUI theme; the application is dark-only until a designed light palette is explicitly approved. next-themes is not wired into the current theme system.
- Navigation/progress: nextjs-progressbar
- Carousel: react-multi-carousel
- ORM: Prisma 5.22.0
- Database: Neon serverless PostgreSQL via @neondatabase/serverless
- Firebase: role intentionally TBD (Auth / Firestore / Storage / combination); do not make assumptions
- Images: @imagekit/nodejs for server-side operations and @imagekit/javascript for client-side operations
- Diagnostics: debug

## System boundaries

- `app/`: routes, layouts, loading/error/not-found files, and Route Handlers
- `components/`: reusable shared components; props-driven; no direct Prisma/Firebase access
- `lib/`: server helpers, Prisma singleton, ImageKit helpers, validation and other focused utilities
- `prisma/`: Prisma schema and migrations
- `public/`: static assets that are not stored in ImageKit
- `.env`: local server-side environment variables; never commit secrets

The scaffold uses the repository-root `app/` directory. Do not reintroduce `src/` unless explicitly approved.

## MUI and styling integration

Use `@mui/material` as the primary component/UI system and Tailwind for layout, spacing, and utility composition without duplicating token definitions.

For the Next.js App Router, use `AppRouterCacheProvider` from `@mui/material-nextjs` where the MUI cache provider is required. Do not copy the previous custom Emotion SSR `ThemeRegistry` implementation from the Next 13 project unless a specific compatibility requirement is identified.

Centralize Greater Place design tokens in the MUI theme and mirror the approved palette in Tailwind. Components should consume theme tokens rather than hardcoding hex values.

## Typography and visual system

The design system is defined by `docs/ui-context.md` and `docs/tailwind-conversion-notes.md`.

- Display/headline family: Fraunces
- UI/body family: Manrope
- Sharp editorial geometry: `borderRadius: 0` globally, with circular treatment only where semantically required
- Dark editorial identity with approved section-level dark/light visual rhythm
- Do not invent a global light theme palette. The site theme remains dark-only until such a palette is designed and approved.

Approved brand colors remain the source of truth in `ui-context.md`.

## Data model and storage

Neon/Postgres is the source of truth for structured content. Image binaries do not belong in Postgres; store ImageKit IDs/URLs only.

Initial Prisma models:

- `Program`
- `Class`
- `Event`
- `Post`
- `TeamMember`
- `ContactSubmission`

Use string `cuid()` identifiers unless a later decision changes this convention. Keep category values as strings until the category set is finalized.

## Blog

`Post` content is Prisma-backed. Blog search/filtering should use URL parameters and Prisma queries. `/blog/[slug]` is a Server Component route, uses `notFound()` for missing posts, and sanitizes rendered body content according to `docs/code-standards.md`.

Suggested Post fields include a unique slug, title, excerpt, body text, category, cover image ID/URL, published timestamp, and author name. There is no application user/auth model yet.

## Authentication and server writes

Public pages are public. Any future authenticated/admin write must be performed server-side with boundary validation and explicit authorization.

Firebase's role is still an open architecture decision. Phase 10 is blocked until that role is explicitly confirmed.

## Route and component conventions

Server Components are the default. Client Components are used only for browser APIs, local interactive state, events, or other client-only behavior.

Data fetching belongs in the page or a focused server helper and is passed into reusable components through props.

Route Handlers should validate external input and use the standard `{ data, error }` API shape.

## Environment

The Prisma CLI reads `.env`, so `DATABASE_URL` belongs in `.env`. Keep `.env` ignored and document variable names in `.env.example`.

Migration connectivity may require a separate direct Neon URL (`directUrl`) depending on the final Neon connection strategy. Do not invent or hardcode credentials.

## Build invariant

A production build must pass before moving between implementation units. Avoid unrelated changes, dependency upgrades, or architectural rewrites while implementing an individual roadmap unit.

## Version modernization decision

The V2 repository was restarted on 2026-09-19 with Next.js 16.3.3 and React 19.2.0 rather than the original Next.js 13.4.8 / React 18 stack. MUI was modernized to 9.4.0 with `@mui/material-nextjs` for App Router integration. This changes implementation details, not the Greater Place product scope or approved visual design direction.
