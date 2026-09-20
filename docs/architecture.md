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
- Markdown: react-markdown (renders `Post.body` to React elements; see Blog)
- Carousel: react-multi-carousel is installed but not used for the homepage Events carousel; see "Homepage data flow" below
- ORM: Prisma 5.22.0
- Database: Neon serverless PostgreSQL via @neondatabase/serverless
- Authentication: Clerk (`@clerk/nextjs`) for the admin area, plus an email allowlist for authorization (see "Authentication and server writes"). Firebase was removed in Phase 10
- Images: @imagekit/nodejs for server-side operations and @imagekit/javascript for client-side operations
- Diagnostics: debug

## System boundaries

- `app/`: routes, layouts, loading/error/not-found files, and Route Handlers
- `components/`: reusable shared components; props-driven; no direct Prisma access (the only Clerk use is the small `AdminSignOutButton`)
- `lib/`: server helpers, Prisma singleton, ImageKit helpers, admin access/auth helpers, validation and other focused utilities
- `proxy.js` (repo root): the request gate in front of `/admin/**` and admin APIs (security-sensitive; see "Authentication and server writes")
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

Initial field sets in `prisma/schema.prisma` (all models also carry `createdAt`; all except `ContactSubmission` carry `updatedAt`; no relations between models; `image` / `coverImage` are optional ImageKit ID/URL strings):

- `Program`, `Class`: `slug` (unique), `title`, `description`, `image`
- `Event`: `slug` (unique), `title`, `description`, `startsAt`, `location`, `image`
- `Post`: `slug` (unique), `title`, `excerpt`, `body` (`@db.Text`), `category`, `coverImage`, `isPublished` (`Boolean`, default `true`; added in Phase 11), `publishedAt` (defaults to now), `authorName`
- `TeamMember`: `name`, `role`, `bio`, `image`
- `ContactSubmission`: `name`, `email`, `message` (`@db.Text`), `isRead` (`Boolean`, default `false`; added in Phase 11)

The datasource reads `DATABASE_URL` only. `directUrl` and any Neon driver-adapter configuration are intentionally not present until those open decisions are resolved.

## Homepage data flow

`app/page.js` (the homepage route file is `.js`; shared components are `.jsx`, and that split is intentional) is a Server Component that queries Prisma directly through the `lib/prisma.js` singleton and passes rows to shared components as props.

- Queries: `event.findMany({ orderBy: { startsAt: 'asc' } })`, `program.findMany({ orderBy: { createdAt: 'asc' } })`, `teamMember.findMany({ orderBy: { createdAt: 'asc' } })`, run in one `Promise.all`. `createdAt` ordering is used where the schema has no display-order field. The On Stage list reuses the events array; it does not re-query.
- Rendering: the page exports `dynamic = 'force-dynamic'`, so content is always fresh and `next build` has no database dependency. Revisit with `revalidate` if request-time latency becomes a problem.
- Empty tables render an explicit empty state; nothing is seeded or invented.
- Local constants (no Prisma model, deliberately): the four Pathway/Training stages and the Culture grid (`app/page.js`). Culture has no model; adding one is an open decision.
- Images are placeholders until real assets exist. Cards render `image` only when it is an absolute `http(s)` URL, through `components/ImageKitImage.jsx` (see "Images (Phase 9)").
- Events carousel: `components/EventsCarousel.jsx` is a native scroll-snap client component that receives server-rendered `EventCard`s as children. `react-multi-carousel` was evaluated and rejected because it selects breakpoints from `screen.width` (not the viewport) and leaves focusable links inside `aria-hidden` slides.
- WhatsApp links: `lib/whatsapp.js` builds RSVP and chat links from the `WHATSAPP_NUMBER` environment variable (server-only). If it is unset, RSVP and WhatsApp buttons are not rendered. Never hardcode the number.

## Inner routes: Programs / Classes / Training (Phase 4)

`app/programs/page.js`, `app/classes/page.js`, and `app/training/page.js` are Server Components. Approved copy and structure come from `docs/design-references/*.html` (there is no `classes.html`); the routes translate the mockups into the shared components rather than copying their markup.

- `/programs`: `program.findMany` (`createdAt` asc) rendered with `ProgramCard` (`expanded`, so approved descriptions are not truncated); a Culture teaser that queries the first four `Class` rows (`take: 4`) and links to `/classes`; the Pathway stage bar and Training CTAs to `/training`; a blog teaser; the FAQ; a closing CTA band.
- `/classes`: `class.findMany` rendered with `ProgramCard` (`href` = `/classes#<slug>`) and a blog teaser. No FAQ (the mockups have none).
- `/training`: local constant only (`lib/pathway.js`), no database access, statically prerendered. Contains the Pathway stages and the FAQ from `training.html`.
- Culture has no model. The `/programs` Culture section is a teaser over `Class` records, not a new content type.
- Blog teaser: there is no `Blog` model. Teasers use the existing `Post` model (`post.findMany`, `publishedAt` desc, `take: 3`) so they and the future `/blog` page read the same data. `components/BlogTeaser.jsx` renders them through `ProgramCard` with a `CategoryTag` badge; every card and "View all" links to `/blog`.
- Classes, Training, and Blog are intentionally absent from the header navigation. They are reached through CTAs on `/programs`, the homepage, the footer, and the blog teasers.
- These routes are plain dark pages (`data-theme="dark"`); they do not mount `PageAtmosphere`. `SiteHeader` and `SiteFooter` are rendered by each page (there is no shared layout for them yet).
- Enrollment via WhatsApp uses `buildEnrollHref()` in `lib/whatsapp.js` (the `WHATSAPP_NUMBER` env var). The number in the mockups is not used.

### Seed data
`node prisma/seed.js` (reads `DATABASE_URL`) is idempotent: it creates a row only if its slug is missing and never overwrites existing rows. It seeds the three Programs and four Classes from the approved mockup copy, and four placeholder `Post` rows (slugs prefixed `placeholder-`, generic excerpt "Placeholder excerpt — real blog content coming soon.", author "Greater Place"). Replace or delete the placeholder posts once real blog content exists.

## Events (Phase 5)

`app/events/page.js` is a Server Component (`force-dynamic`). Copy and structure come from `docs/design-references/events.html`; event data comes only from the database.

- Single source: `lib/events.js` `getEvents()` runs one `prisma.event.findMany({ orderBy: { startsAt: 'asc' } })` and partitions it at request time into `upcoming` (soonest first) and `past` (most recent first). The homepage and `/events` both use it, so there is one notion of "events" in the app.
- `/events` shows upcoming events as `EventCard` rows (`layout="row"`, `showDescription`) and a separate "Past Highlights" list of `Title — Year` rows (mockup policy). The section is hidden when there are no past events.
- Anchors: every event has an element with `id=<slug>` on `/events` (upcoming cards and past-highlight rows), so every `/events#<slug>` link resolves, including links to past events. Anchor targets use `scroll-mt-32` because `RevealOnScroll` settles 24px after the browser scrolls.
- Homepage: the Performances carousel shows upcoming events only; On Stage lists upcoming events first, then the most recent past ones (up to six); every row and card links to `/events#<slug>`.
- `EventCard` props: `layout` (`card` | `row`), `showDescription`, and `secondaryAction` (`undefined` = "Learn more" → `/events#<slug>`, an object `{ label, href }` replaces it, `null` hides it).
- WhatsApp: all links come from `lib/whatsapp.js` and the server-side `WHATSAPP_NUMBER` env var (no `NEXT_PUBLIC_` variant, no hardcoded number, no fallback). `buildRsvpHref(event)` prefills `Hello Greater Place, I would like to RSVP for "<title>" on <full date and time>.`, URL-encoded, so every link is event-specific. `buildGeneralRsvpHref()` and `buildGroupHref()` serve the hero and closing CTA. When the variable is unset every WhatsApp button is omitted rather than rendered broken.
- Event dates are formatted in the server's timezone (`Event.startsAt` has no timezone). Decide a display timezone before real events are entered.
- The mockup's per-event category tag and per-event secondary links (Read More / Support the Gala) have no `Event` field; `/events` uses "Ask a question" → `/contact` for every event and no tag.
- Test-data note: verifying pages with data uses a temporary schema in Neon (see the tracker); because `DATABASE_URL` is a connection pooler, run `RESET search_path` on fresh connections after dropping it.

## Blog (Phase 6)

`Post` is the only blog model (no `Blog` model). `Post.body` is stored as **Markdown**. Copy and layout come from `docs/design-references/blog.html` and `blog-post.html`. Fields used: `slug` (unique), `title`, `excerpt`, `body`, `category`, `coverImage`, `publishedAt`, `authorName`. The mockups' author role/bio, avatar, per-post multiple tags, cover caption, and newsletter band have no schema field and are not rendered.

- `/blog` (`app/blog/page.js`, Server Component, dynamic): URL parameters `category` and `q`. `parseBlogParams` in `lib/blog.js` normalises them (`q` trimmed to 100 chars; `category` must be one of `CATEGORY_NAMES` from `components/CategoryTag.jsx`, matched case-insensitively, otherwise ignored; only the first value of a repeated parameter is used). `buildPostWhere` builds the Prisma filter: `category: { equals, mode: 'insensitive' }` AND `OR: [ { title: { contains, mode: 'insensitive' } }, { excerpt: { contains, mode: 'insensitive' } } ]`, ordered by `publishedAt` desc, `take: 48` (no pagination yet). Filtering happens in the database on every request; nothing is filtered in the browser. SQL `LIKE` wildcards (`%`, `_`, `\`) in `q` are escaped so they match literally (Prisma's `contains` does not escape them). The search box is a plain `<form method="get" action="/blog">` (a hidden field preserves `category`); the category pills are links that preserve `q`. Unfiltered, the newest post is featured and the rest form a grid; filtered results are a plain grid; no matches shows the mockup's empty-state message.
- `/blog/[slug]` (`app/blog/[slug]/page.js`, Server Component): `getPostBySlug` (React `cache`, shared with `generateMetadata`) → `notFound()` when missing (standard Next.js 404). Slugs containing a NUL byte or longer than 200 characters are treated as not found (Postgres would otherwise throw and return 500). The page shows breadcrumb, `CategoryTag`, title, excerpt as the dek, author, date, computed reading time (about 200 words per minute, not stored), cover image (placeholder unless `coverImage` is an absolute URL), the share rail, the Markdown body, and up to three related posts (same category first, then newest).
- Markdown rendering: `components/MarkdownBody.jsx` is the only place `Post.body` is rendered, using `react-markdown` (the one dependency added in Phase 6). It outputs React elements only; raw HTML in the Markdown is dropped (`skipHtml`, no `rehype-raw`); URLs go through `defaultUrlTransform` (http, https, irc(s), mailto, xmpp; `javascript:`, `data:`, `vbscript:` and obfuscated variants are removed); images must be absolute http(s) URLs; external links open with `rel="noopener noreferrer"`. `dangerouslySetInnerHTML` must not be used for post content anywhere.
- Share rail: `components/ShareRail.jsx` is the only client component of the blog. Props: `path` (the post path, e.g. `/blog/my-post`) and `title`. It resolves the absolute URL from `window.location.origin` at click time, performs no data fetching, and offers WhatsApp (`wa.me/?text=<title> — <url>`, new tab with `noopener`), email (`mailto:` with subject and body), and copy link (Clipboard API, with a polite live-region status and a failure message).
- Blog teasers (`components/BlogTeaser.jsx`, used on `/programs` and `/classes`) link each card to `/blog/<slug>` and "View all" to `/blog`. Blog is not in the header nav; it is reached from the footer, the homepage Stories link, and the teasers.

## Contact (Phase 7)

`app/contact/page.js` (Server Component, `force-dynamic`), `app/api/contact/route.js` (Route Handler), and `components/ContactForm.jsx` (the page's only client component). Copy comes from `docs/design-references/contact.html`.

- Channels: the WhatsApp channel and the "Message Us on WhatsApp" link use the existing `lib/whatsapp.js` / server-side `WHATSAPP_NUMBER` convention (the same single number as `/events`; the mockup's sample number is not used). The email channel uses the new server-side `CONTACT_EMAIL` env var (`lib/contact.js`, documented in `.env.example`): it must look like a single email address, otherwise the channel is not rendered. Each channel is omitted while its variable is unset. The "Mon–Fri, 9am–5pm" hours line is copied from the mockup and should be verified.
- Storage: `ContactSubmission` has `name`, `email`, and `message` (plus `id`, `createdAt`, and the admin inbox's `isRead` flag from Phase 11). The form also collects an optional phone number and a required "reason for contact" (from the mockup). They are folded into the stored `message` by `formatSubmissionMessage()`: `Reason: <reason>`, then `Phone: <phone>` only if given, a blank line, then the visitor's message. There is no schema change; extra structured columns are an open decision.
- Validation lives in `lib/contact-validation.js`, a pure module with no server-only imports, so the same rules run in the browser (instant feedback) and in the API (authoritative): name 1–100 chars with no line breaks; email ≤ 254 chars and a simple `x@y.zz` shape; optional phone of 7–15 digits (30 chars max, digits and `+ - ( ) .` only); reason must be one of `REASONS`; message 10–5000 chars (control characters are stripped). No validation library was needed.
- `POST /api/contact` response contract: `{ data, error }` always.
  - `201 { data: { received: true }, error: null }` on success (the row id and other stored fields are not returned).
  - `400 { data: null, error: { message, fields } }` when validation fails, or `{ message }` when the body cannot be parsed; no database call is made. `fields` maps field name to a user-facing message (`form` for a non-object body).
  - `413` for bodies over 20,000 characters, `415` unless `Content-Type` is `application/json` (which also blocks cross-site form posts), `405` for other methods.
  - `500 { data: null, error: { message } }` for unexpected failures, with a generic message. Only a coarse error class name is logged server-side; the driver message, connection details, and the submission are never logged or returned.
- Spam: a hidden honeypot field (`website`); if it is filled the API returns the normal 201 and stores nothing. There is no rate limiting or CAPTCHA yet.
- Client states (`ContactForm`): idle, sending (button disabled and labelled "Sending…", fields locked, `aria-busy`, a synchronous ref guard against double submits), success (confirmation replaces the form; "Send another message" resets it), and error (server message, or a network/timeout message, with the input kept). After each finished submission focus moves to the first invalid field or to the outcome message. The form never touches Prisma.
- There is no admin UI or email/WhatsApp notification for new submissions yet: they only accumulate in the `ContactSubmission` table until an admin surface exists (Phases 8–10).

## Our Story (Phase 8)

`app/our-story/page.js` is a Server Component (`force-dynamic`, like the homepage, because it reads Prisma). Copy is from `docs/design-references/our-story.html`. Its only client code is the shared header (`SiteHeader`) and `RevealOnScroll`; there is no new client component.

- Hardcoded (fixed prose, no record shape): hero, intro paragraph, founder copy, leadership heading and paragraph, group-photo caption, history heading and paragraph, and the closing Donate band. The four mission bands ("Performing Arts", "Faith & Character", "Leadership", "Wellness") are a local constant of four labels, not data.
- Prisma-backed: one query, `prisma.teamMember.findMany({ orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] })`. The founder strip (`components/TeamMemberCard.jsx`) shows the first four members; the leadership list (`#leadership`) shows every member as name plus role. `TeamMember` has no display-order or featured field, so `createdAt` order (insertion order) is the ordering and the four-up strip is a layout limit, not a curated selection. Adding a `sortOrder` column is an open decision.
- Fields shown: `name`, `role`, `image` (only when it is an absolute `http(s)` URL; anything else, including `javascript:` and relative paths, falls back to the portrait placeholder). `bio` is stored but the mockup shows no bio on this page, so it is not rendered here (the homepage team tiles show it).
- Member text is rendered as plain React text (never HTML) with `overflow-wrap: anywhere`, so very long unbroken names cannot widen the page.
- Empty table: both sections show "Team profiles are not listed yet."; nothing is seeded or invented.
- Deliberate deviations from the mockup: the founder quote block is a labelled placeholder ("Founder quote to be supplied.") because the mockup's quote and its "Founder Name" attribution are unconfirmed placeholder copy (owner-approved); the mission bands are neutral tiles because the mockup's four fill colours would map programme names to category accents (`ui-context.md` §4); the "Read Our Full History" button (`href="#"`) is omitted because it has no destination; the impact band's warm radial gradient is not used.
- Links: the Donate button points at `/#support` (the homepage Support section; no give page exists). The homepage "Full Team" link now points at `/our-story#leadership`. `SiteFooter` and the homepage Our Story section already linked to `/our-story`; `SiteHeader` has no Our Story entry (its five links follow the homepage mockup).

## Images (Phase 9)

ImageKit is the image storage, CDN, and transform layer for **admin-uploaded content** (post covers, event photos, team portraits, programme and class images). The site's own design assets do not go through it. No package was installed in Phase 9: `@imagekit/nodejs` 7.12.1 (server) and `@imagekit/javascript` 5.5.1 (URL building and browser upload) have been in `package.json` since Phase 0 and were current when checked. The older `imagekit` and `imagekitio-next` packages are deprecated in favour of these and `@imagekit/next`; `@imagekit/next` was not adopted because it would be an extra dependency for a `<img srcset>` the JavaScript SDK already builds.

Modules:

- `lib/imagekit.js` (server only): the only reader of `IMAGEKIT_PRIVATE_KEY`. `getUploadCredentials()`, a lazily created client (`getImageKit()`, cached in dev like `lib/prisma.js`; the SDK constructor throws without a key, so it is never built at import time), and `createUploadAuth()`. Never import it from a client component.
- `lib/image-url.js` (no credentials): `isImageUrl(value)` (absolute `http(s)`), `getImageEndpoint()`, `isImageKitUrl(src)`, and `getImageAttributes(src, { sizes })`. Reads `IMAGEKIT_URL_ENDPOINT`, so it is for server code.
- `components/ImageKitImage.jsx` (Server Component): renders a stored URL. Props: `src`, `alt`, `sizes`, `className`, `loading`.
- `app/api/imagekit-auth/route.js`: signs a browser upload.
- `components/useImageUpload.js` (client hook): the reusable upload helper.

Environment (all server-side; see `.env.example`): `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`. The build and the whole site work with none of them set: images then render as plain URLs and uploads answer 503. The public key is returned by the auth route instead of a `NEXT_PUBLIC_` variable, so no rebuild is needed when keys change.

Upload flow: the browser calls `GET /api/imagekit-auth`, then `upload()` from `@imagekit/javascript` posts the file straight to ImageKit (a multipart XHR to `upload.imagekit.io`; the file never passes through this server).

- Route response: `200 { data: { token, expire, signature, publicKey }, error: null }`; `503 { data: null, error: { message } }` while the public or private key is unset; `500` with a generic message (only the error class name is logged); other methods 405. It is `force-dynamic` and sends `Cache-Control: no-store`, because a static GET would be built once and every token would be identical.
- `signature` is HMAC-SHA1 of `token + expire` with the private key (checked independently in tests), and `expire` must be an **absolute Unix time in seconds** under one hour ahead (ten minutes is used). The SDK's JSDoc for `getAuthenticationParameters` says "seconds from now", but the implementation signs the value it is given, so a relative value produces an already-expired (1970) timestamp. `createUploadAuth()` passes an absolute time.
- **Access control:** a signature lets its holder upload to the project's ImageKit account, so since Phase 10 this route is listed in `proxy.js`'s matcher and only an allowlisted admin reaches it (401/403 JSON otherwise; `useImageUpload` maps both to "You do not have permission to upload images."). Keep the path in that matcher. A signature cannot restrict file type, size, or folder, so also set allowed formats and a maximum size in the ImageKit dashboard.

`useImageUpload({ folder, tags })` returns `{ upload, abort, reset, status, progress, error, result, uploading }` and has no markup, so any UI can drive it: `upload(file)` from a file input's `onChange` (an "Upload Image" button, the Media Library) or from a drop handler (the Post Editor's cover dropzone). `upload()` resolves to `{ url, fileId, filePath, name, width, height, size, fileType, thumbnailUrl }` or `null` (it never throws; read `error`). `status` is `idle | uploading | success | error`; `progress` is 0–100. Store `result.url` in the model's image field. One upload runs at a time per hook instance (a second call in the same tick is ignored); use one instance per file for parallel uploads. Cancelling (`abort()`) or unmounting mid-upload returns to `idle` without an error. `validateImageFile`, `IMAGE_UPLOAD_ACCEPT`, `IMAGE_UPLOAD_TYPES`, and `IMAGE_UPLOAD_MAX_BYTES` (JPEG, PNG, WebP, GIF, AVIF; 10 MB; SVG is refused on purpose) are exported for dropzone filters. These checks are fast feedback, not security.

Rendering: `ImageKitImage` builds a responsive `srcSet` (widths 640–2048, `q-80`, `f-auto`, `c-at_max` so images are never upscaled) for URLs that live under `IMAGEKIT_URL_ENDPOINT`. Any other absolute `http(s)` URL is rendered untouched, and `javascript:`, `data:`, and relative values are never rendered (the callers show a placeholder). The SDK's `buildSrc` appends `?tr=` to any absolute URL, so the endpoint check in `isImageKitUrl` matters: it compares origin and path prefix with `URL` (lookalike hosts, userinfo tricks, and `..` traversal are not treated as ours) and skips URLs that already carry a transformation. Each call site passes a `sizes` hint that matches its layout so the browser picks the smallest sufficient candidate. Sites: `ProgramCard` (also Classes and the blog teasers), `EventCard`, `PostCard`, `TeamMemberCard`, the homepage team tile, the `/blog/[slug]` cover (`loading="eager"`), and Markdown body images in `MarkdownBody` (the existing http(s)-only guard still applies). `next/image` is not used, so `next.config.js` needs no `remotePatterns` or loader. `ImageKitImage` must render on the server (the endpoint is a server-side variable) and every page that uses it is already `force-dynamic`, so a changed endpoint needs no rebuild.

Storage: the existing optional string fields hold the delivered URL (`Program.image`, `Class.image`, `Event.image`, `Post.coverImage`, `TeamMember.image`); no field or migration was added. No `fileId` is stored: the ImageKit API returns it when listing files, which is where a Media Library would delete from.

Verification: everything above was tested against a local fake ImageKit (an HTTPS upload host that checks the signature, expiry, and token reuse, and an image host that logs the transformed URLs the browser requests), not against a real ImageKit account. A real upload has not been performed.

## Authentication and server writes

Public pages are public. Any authenticated/admin write must be performed server-side with boundary validation and explicit authorization.

Authentication (Phase 10): Clerk proves who someone is; an email allowlist decides whether they may enter the admin area. Being signed in to Clerk is never enough on its own, because Clerk sign-up is open unless the Clerk dashboard says otherwise. Firebase was never used and was removed.

- Gate: `proxy.js` runs only for `/admin/:path*`, `/api/admin/:path*` (reserved for Phase 11), and `/api/imagekit-auth`. The public site, `/sign-in`, and `/not-authorized` never run it: `clerkMiddleware()` throws on every request when its keys are missing, so it must not run site-wide. Next 16 renamed `middleware.js` to `proxy.js` (the old name is deprecated and behaves the same); Clerk does not care which name is used.
- Decision: `lib/admin-access.js` is pure logic (no Clerk or Next imports). A request is admitted only when Clerk is configured (both keys), the allowlist is not empty, a Clerk session exists, and the account's **verified primary** email, lowercased, exactly equals an entry of `ADMIN_ALLOWED_EMAILS`. The variable is a comma-separated list; entries are trimmed and lowercased, entries that are not full addresses are dropped, and there are no wildcards or domain rules. The address comes from Clerk's Backend API on each protected request (the session token does not carry it); a failed lookup denies.
- Outcomes: pages send signed-out visitors to `/sign-in` (returning to the requested page) and signed-in-but-not-allowlisted ones to `/not-authorized`; APIs answer `401 { data: null, error: { message } }` or `403`, never a redirect; missing Clerk keys or an empty allowlist answer `503` for both (the system fails closed, never open). Protected responses carry `Cache-Control: private, no-store`.
- Defence in depth: `lib/admin-auth.js` exports `getAdminSession()` (`{ ok: true, userId, email }` or `{ ok: false, reason }`) for Phase 11 pages, Route Handlers, and Server Actions to re-verify next to the data they touch. Clerk's `auth()` only works on routes the matcher covers and throws elsewhere, so a route outside the matcher cannot use it by accident.
- Sign-in: `app/sign-in/[[...sign-in]]/page.js` renders Clerk's `<SignIn />`, themed by `lib/clerk-appearance.js` from the Tailwind brand tokens (the sign-up link is hidden: access is by allowlist, not by creating an account). Signing in returns to `/admin`; signing out returns to `/` (props on `<ClerkProvider>`). `/not-authorized` lives outside `/admin` on purpose (a page under `/admin` would be gated and redirect to itself) and offers `components/AdminSignOutButton.jsx`.
- Configuration: `<ClerkProvider>` wraps the root layout only when both keys are set, so the site and `next build` work with none of the Clerk variables. The publishable key is inlined at build time, so set both keys before `next build`. When Clerk is configured its script loads (async) on every page, public ones included; scoping the provider to the admin and sign-in layouts is an option for Phase 11.
- Owner setup: use a Clerk development instance locally, put the keys and `ADMIN_ALLOWED_EMAILS` in the environment, and consider disabling open sign-up in the Clerk dashboard.

## Admin CMS (Phase 11)

The team's protected `/admin` area. Every route is behind Phase 10's gate (`proxy.js`: Clerk sign-in plus the `ADMIN_ALLOWED_EMAILS` allowlist); this phase adds no new auth. Copy and layout follow `docs/design-references/admin-*.html` (dashboard, posts, post editor, media, events, programs, contact). The admin UI is its own visual context: a fixed sidebar shell and slightly rounded panels (`components/admin/ui.js`), not `SiteHeader` / `SiteFooter`. There is **no Settings page and no Settings link** (deferred).

Routes (all Server Components unless noted; every page starts with `requireAdminPage()`):

- `/admin`: dashboard (post counts, recent posts, newest unread messages).
- `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]/edit`: full `Post` CRUD. The list shows drafts too and filters by `q`, `status` (all / published / draft) and `category`.
- `/admin/media`: Media Library (ImageKit).
- `/admin/events`, `/admin/events/new`, `/admin/events/[id]/edit`: full `Event` CRUD; Upcoming / Past is computed from `startsAt`.
- `/admin/programs` (`?tab=programs|classes`), `/admin/programs/new?type=program|class`, `/admin/programs/[id]/edit?type=program|class`: ONE section over TWO separate models (`Program`, `Class`). They have the same four fields (title, slug, description, image) and are never merged.
- `/admin/contact` (`?filter=unread`): read-only inbox with mark read / unread.

Shell: `app/admin/layout.js` (re-checks admin access, fetches the unread count) plus `components/admin/AdminSidebar.jsx` (client: active link, Log out) and `AdminTopbar.jsx`. The nav is Dashboard, Blog Posts, Media Library, Events, Programs & Classes, Contact (unread badge). On phones the sidebar becomes a scrollable top bar.

Write API (Route Handlers, all under `/api/admin/**` so `proxy.js`'s matcher covers them; the matcher is a wildcard, so new admin routes need no proxy change):

- `POST /api/admin/{posts,events,programs,classes}`, `PUT` and `DELETE /api/admin/{posts,events,programs,classes}/[id]`, and `PATCH /api/admin/contact/[id]` (`{ isRead }` only: there is no create, edit, reply, or delete for contact).
- `lib/admin-crud.js` implements CRUD once for the four resources; `lib/admin-api.js` (`adminRoute`) wraps every handler: it re-verifies the admin with `getAdminSession()` (401 signed out, 403 not allowlisted, 503 unconfigured), requires `application/json` (415), caps the body at 500,000 characters (413), rejects cross-site writes (`Origin` must match, `Sec-Fetch-Site` must be same-origin or none: 403), and returns a generic 500 (only an error class name is logged). Responses are always `{ data, error }`; `error` may carry `fields` (per-field messages). 400 validation, 404 unknown or malformed id (ids must look like a cuid before reaching Prisma), 409 duplicate slug (Prisma `P2002`).
- `lib/admin-validation.js` is pure and shared with the browser: whitelisted fields only (mass assignment is impossible: `id`, `createdAt` and unknown properties are dropped), strict types, length limits, slug pattern, http(s)-only image URLs, dates between 2000 and 2100. A post may keep an older free-form category it already has; new values must be one of the six known categories.

Schema changes in Phase 11 (both additive, migration `20260920140000_admin_post_status_and_contact_read`): `Post.isPublished` and `ContactSubmission.isRead`. Because a draft must never be public, the public Post queries gained `isPublished: true` (`buildPostWhere` and `getPostBySlug` in `lib/blog.js`, the `/blog/[slug]` related list, and the `/programs` and `/classes` blog teasers). Existing posts default to published; existing submissions default to unread.

Editors are client components (`PostEditor`, `EventEditor`, `ProgramEditor`, sharing `useAdminForm`): the same validators run in the browser, focus moves to the first invalid field or the error summary, and a synchronous guard prevents double submits. The post editor has real Draft / Published states ("Save Draft" stores a post that is not public; "Publish" makes it visible). The publish date is only sent when changed (noon UTC keeps the day stable). Deleting uses an accessible confirm dialog (`ConfirmDelete`, focus on Cancel, Escape closes).

Markdown toolbar: `components/admin/MarkdownField.jsx` is a plain `<textarea>` with Bold, Italic, Heading 2, Quote, Link and Image buttons implemented as string manipulation in `lib/markdown-edit.js` (pure, unit-tested). No editor library and no new dependency. The Image button uploads through Phase 9's `useImageUpload` and inserts `![alt](url)`; parentheses and spaces in URLs are percent-encoded so a URL cannot break the syntax. `Post.body` is still rendered only by `components/MarkdownBody.jsx`.

Images: the cover / event / program image fields use `CoverImageField` (labelled dropzone plus a URL box for reusing a Media Library URL) on top of `useImageUpload` and the gated `/api/imagekit-auth`. The Media Library lists the account's newest image files through `listMediaFiles()` in `lib/imagekit.js` (server SDK `assets.list`, 40 per page; search matches file names within the newest 200), with upload and a Copy URL button. It has no delete. Listing URLs carry `?updatedAt=`, which `ImageKitImage` handles.

Contact inbox: each message shows name, mailto link (only for plain addresses: a stored `?` or `&` never becomes part of a `mailto:` URL), relative time, the Phase 7 folded `Reason:` / `Phone:` header parsed back out (`parseSubmissionMessage`), and the message with line breaks preserved. Unread messages have a red marker and screen-reader text; the sidebar badge updates after each toggle.

Known gaps against the mockups (the schema has nowhere to store them): Programs show no "N classes linked" (no relation between `Program` and `Class`), and Classes show no age group, level or schedule.

## Route and component conventions

Server Components are the default. Client Components are used only for browser APIs, local interactive state, events, or other client-only behavior.

Data fetching belongs in the page or a focused server helper and is passed into reusable components through props.

Route Handlers should validate external input and use the standard `{ data, error }` API shape.

## Environment

The Prisma CLI reads `.env`, so `DATABASE_URL` belongs in `.env`. Keep `.env` ignored and document variable names in `.env.example`.

`WHATSAPP_NUMBER` (digits only, country code included, no `+`) is read on the server by `lib/whatsapp.js` and documented in `.env.example`.

`CONTACT_EMAIL` (a single email address) is read on the server by `lib/contact.js` for the `/contact` mailto link and is documented in `.env.example`.

`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` are read on the server (`lib/imagekit.js`, `lib/image-url.js`) and documented in `.env.example`. Real values are the owner's to supply.

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (Clerk) and `ADMIN_ALLOWED_EMAILS` (the admin allowlist) are read by `proxy.js`, `lib/admin-access.js`, and Clerk itself, and are documented in `.env.example`. Set the Clerk keys before `next build`.

Migration connectivity may require a separate direct Neon URL (`directUrl`) depending on the final Neon connection strategy. Do not invent or hardcode credentials.

## Build invariant

A production build must pass before moving between implementation units. Avoid unrelated changes, dependency upgrades, or architectural rewrites while implementing an individual roadmap unit.

## Version modernization decision

The V2 repository was restarted on 2026-09-19 with Next.js 16.3.3 and React 19.2.0 rather than the original Next.js 13.4.8 / React 18 stack. MUI was modernized to 9.4.0 with `@mui/material-nextjs` for App Router integration. This changes implementation details, not the Greater Place product scope or approved visual design direction.
