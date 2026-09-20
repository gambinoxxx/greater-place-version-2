# Greater Place V2 — Implementation Roadmap

## Source of truth

This roadmap governs implementation order. Read `docs/ai-workflow-rules.md`, `docs/architecture.md`, `docs/code-standards.md`, `docs/ui-context.md`, `docs/project-overview.md`, and `docs/tailwind-conversion-notes.md` before implementing a unit.

`docs/progress-tracker.md` is maintained by the user and is read-only for agents.

## Phase 0 — Project foundation

- Fresh repository and Next.js App Router scaffold
- Next.js 16.3.3
- React 19.2.0
- JavaScript only; no TypeScript
- Repository-root `app/` directory; no `src/` directory unless explicitly approved
- Tailwind CSS 3.3.2
- MUI 9.4.0
- `@mui/material-nextjs` 9.4.0 for Next.js App Router integration
- Prisma 5.22.0
- Neon serverless Postgres client
- Firebase 12.7.0 with role still TBD
- ImageKit packages: `@imagekit/nodejs` and `@imagekit/javascript`
- nextjs-progressbar
- react-multi-carousel
- debug
- Create `.env.example`; never commit secrets
- Establish app/components/lib/prisma/public boundaries
- Verify the empty app runs and `npm run build` passes before Phase 1

## Phase 1 — Foundations

### Unit 1 — Tailwind design tokens

Update `tailwind.config.js` with the approved Greater Place brand palette and `serif` / `sans` font families from the UI context.

Do not change the visual tokens.

### Unit 2 — Root typography

Use `next/font/google` in `app/layout.js` for Fraunces and Manrope and expose them as:

- `--font-fraunces`
- `--font-manrope`

Use the existing approved typography mapping.

### Unit 3 — MUI theme

Create `lib/theme.js` with the approved Greater Place palette, `shape.borderRadius: 0`, Fraunces on h1–h4, and Manrope as the default typography.

The application remains dark-only. Do not invent or implement a global light palette.

### Unit 4 — App Router MUI integration

Use the supported `@mui/material-nextjs` App Router integration and `AppRouterCacheProvider` where required, then wrap the application with the MUI `ThemeProvider` and `CssBaseline`.

Do not recreate the legacy custom Emotion SSR cache from the previous Next 13 project unless a specific incompatibility requires it.

### Unit 5 — Prisma schema

Create `prisma/schema.prisma` with minimal models:

- `Program`
- `Class`
- `Event`
- `Post`
- `TeamMember`
- `ContactSubmission`

Use the minimal field sets described by `docs/architecture.md`. Keep relations and auth models out of scope.

### Unit 6 — Initial migration

Once `DATABASE_URL` is available, run the first migration and generate the Prisma client.

If the Neon setup requires a separate migration URL, make the `directUrl` decision before migrating.

### Unit 7 — Phase checkpoint

Run:

- Prisma validation
- Prisma generate
- `npm run build`

The Phase 1 checkpoint is complete when the app builds successfully with the theme/font foundation and Prisma schema/migration in place.

## Phase 2 — Shared components

Implement one shared component at a time:

1. `SiteHeader`
2. `SiteFooter`
3. `RevealOnScroll`
4. `SectionHeader`
5. Button/theme-level variants
6. `EventCard`
7. `ProgramCard`
8. `CategoryTag`

`SiteHeader` may use IntersectionObserver/data-theme behavior from the approved page reference. Keep the application theme dark-only; section-level visual changes are a page design behavior, not a global theme switch.

## Phase 3 — Homepage

Create `app/page.js` as a Server Component (the route file stays `.js`; shared components under `components/` are `.jsx`) using shared components and Prisma-backed content.

Maintain the approved dark → light → dark section rhythm. Every CTA must be a real route or anchor; placeholders for Donate, Volunteer, Partner, Read Story, and Newsletter must be explicitly flagged rather than silently wired.

## Phase 4 — Programs / Classes / Training

- `/programs`: Faith & Character, Leadership, Wellness, Culture, FAQ Accordion, Prisma data
- `/classes`: Ogene, Liturgical Dance, Praise & Worship, Drama & Skits; not main navigation
- `/training`: Discover → Develop → Perform → Lead; not main navigation
- Classes and Training are reached through Programs-related CTAs as defined by the project specification

## Phase 5 — Events

- `/events`: full Prisma-backed list
- WhatsApp RSVP links generated from event data
- Homepage event links must resolve to matching event anchors/slugs

## Phase 6 — Blog

- `/blog`: server-side search/category filtering through URL parameters + Prisma
- `/blog/[slug]`: Server Component, `notFound()` for missing content
- Sanitize rendered body content
- Isolate the client share rail

## Phase 7 — Contact

- `/contact`: WhatsApp, `mailto:`, and MUI form
- `/api/contact`: validate input, create `ContactSubmission`, return `{ data, error }`
- Client success/error states

## Phase 8 — Our Story & Team

- `/our-story`: hero, quote, founder strip, mission bands, leadership, history
- Reuse `TeamMember`; do not duplicate hardcoded team data

## Phase 9 — Images

- `lib/imagekit.js`: server SDK singleton using `@imagekit/nodejs` (lazy; the only reader of the private key) and `createUploadAuth()`
- `GET /api/imagekit-auth`: returns `{ data: { token, expire, signature, publicKey }, error: null }` (503 while unconfigured). **Not authenticated yet: Phase 10/11 must make it admin-only before any ImageKit key is set in a deployed environment**
- `components/useImageUpload.js`: reusable client upload hook (button or dropzone UIs; progress, cancel, validation) for the Phase 11 Post Editor and Media Library
- `lib/image-url.js` and `components/ImageKitImage.jsx`: responsive, auto-format rendering of stored URLs, used by every card, the homepage team tile, the blog cover, and Markdown body images
- Store ImageKit URLs, not image binaries: the existing image fields are unchanged (no migration)
- Replace gradient placeholders incrementally when approved photos/assets are available (still open: no real assets exist yet)
- Not done: a real upload against a live ImageKit account (no credentials yet); `/admin/**` UI (Phase 11)

## Phase 10 — Auth / Firebase

Blocked until the Firebase role is explicitly confirmed: Auth, Firestore, Storage, or a defined combination.

## Phase 11 — QA

- Production build passes
- No broken internal links
- No `href="#"` placeholders
- WhatsApp/email links verified
- Visual consistency with approved prototype
- Prisma-backed content is not hardcoded in place of database data
- Responsive checks at approximately 900px and 560px

## Open decisions

1. Firebase role
2. Donate / Partner / Volunteer destinations
3. Newsletter scope
4. Neon migration connection strategy / `directUrl`
5. Prisma Neon driver-adapter strategy, to be revisited before `lib/prisma.js` if needed
6. Authentication for `/api/imagekit-auth` (currently open to anyone who can reach it): add the admin check in Phase 10/11 before any `IMAGEKIT_*` key is set in a deployed environment

Next.js version is no longer an open decision for this V2 restart: the project baseline is Next.js 16.3.3 / React 19.2.0.
