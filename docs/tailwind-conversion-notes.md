# Greater Place V2 — Tailwind Conversion Notes

## Purpose
These notes define how the Greater Place visual system should be expressed with Tailwind CSS while MUI remains the primary component library.

## 1. Styling Responsibilities
### Tailwind
Use Tailwind for page layout, containers, grid/flex composition, spacing, responsive behavior, section backgrounds, typography utilities, positioning, image sizing/cropping, and simple borders.

### MUI
Use MUI for buttons where reusable variants are appropriate, form controls, menus, dialogs, accessible interactive components, component states, and theme-aware primitives.

## 2. Semantic Tokens
Recommended Tailwind semantic mappings:
- bg-base → #0A0D12
- bg-surface → #101826
- bg-deep → #0B121C
- bg-footer → #06080B
- bg-ivory → #F3F5F8
- text-white → #FFFFFF
- accent-red → #E5484D
- accent-red-deep → #C23238
- accent-green → #3FBF6F
- accent-purple → #A78BFA
- accent-gold → #D9A441
- accent-teal → #4FD1C5
- accent-stories-blue → #5B9BD5

Semantic names are preferred over arbitrary color names.

Implementation notes:
- Tailwind scans `app/`, `components/`, and `lib/`. Class names must appear as complete strings (no `bg-${x}` interpolation). The shared accent-name → class map lives in `lib/accents.js`.
- Opacity modifiers must be on Tailwind v3's scale (0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100). Off-scale values such as `/15` or `/85` silently generate no CSS.

## 3. Typography
Register project fonts through next/font/google:
- Fraunces
- Manrope

Do not manually import Google Fonts from CSS.

Conceptual hierarchy:
- display: Fraunces
- heading: Fraunces
- body: Manrope
- UI: Manrope
- metadata: Manrope

## 4. Container Pattern
Use a consistent responsive container: full-width section, centered inner container, responsive horizontal padding, and a controlled maximum width. Determine the maximum width from the composition rather than a generic template.

## 5. Spacing
Use the Tailwind spacing scale consistently. Prefer deliberate section spacing over excessive utility accumulation. Put spacing on the layout parent when the spacing belongs to the layout.

## 6. Editorial Grid
Use one-column mobile layouts, two-column editorial layouts, asymmetric desktop compositions, media/text splits, and full-bleed image sections. Use CSS Grid when column relationships matter and Flexbox for linear alignment.

## 7. Images
Typical treatment:
- object-cover for editorial photography
- explicit aspect ratios when composition requires consistency
- overflow-hidden only when cropping is intentional
- responsive image sizing through Next.js Image

## 8. Borders
Use borders sparingly for horizontal section rules, subtle card borders, navigation separators, and form fields. Avoid borders around every element.

## 9. Radius
Default project radius is zero. Do not add rounded-lg, rounded-xl, or rounded-2xl to ordinary editorial surfaces unless a documented component calls for it. Circular elements may use rounded-full.

## 10. Shadows
Shadows should be rare. The design relies on contrast, spacing, borders, imagery, and typography more than elevation.

## 11. Responsive Strategy
Use mobile-first classes. Prefer base mobile styles, md for intermediate layouts, and lg/larger breakpoints for desktop composition. Every breakpoint override should have a layout reason.

## 12. State Styling
Consider hover, focus-visible, active, disabled, validation/error, and loading states. Keyboard focus must remain visible.

## 13. Dark Editorial Sections
The core site is dark, but selected sections may use ivory/light surfaces for rhythm. These are page-level composition decisions, not a global theme switch.

### Page atmosphere (scroll-driven dark → light → dark)
The homepage background is one page-wide "atmosphere", not per-section backgrounds. `components/PageAtmosphere.jsx` (mounted once in `app/page.js`) maps the viewport's centre line onto a value `--atmos-t` (0 = dark, 1 = light) that eases across about 70% of a viewport of scrolling around each dark/light boundary. `app/globals.css` turns it into the `<body>` background (`brand-black` ↔ `brand-ivory`) and into the text colours below.
- Sections do not set their own background or text colour. `data-theme="dark|light"` on a `<section>` only declares where the atmosphere should be dark or light (and `SiteHeader` follows `html[data-atmosphere]`, which flips at `t = 0.5`).
- Content colour must follow the atmosphere, otherwise it is unreadable mid-transition. Use the semantic utilities: `text-atmos` (set on `<main>`), `text-atmos-muted`, `border-atmos-line`, `bg-atmos-tint`, or `currentColor`. Do not use `text-brand-black` / `text-brand-ivory` (or their opacity variants) for content that lives inside an atmosphere page; self-contained surfaces (`EventCard`, `ProgramCard`, the footer) keep their own dark colours.
- Do not put `transition` / `transition-colors` on wrappers around content: the text colour flips at `t = 0.5`, and a colour transition would cross-fade it through mid-gray. `RevealOnScroll` therefore transitions only `opacity` and `transform`.
- `solidWhite` buttons are for dark surfaces only; keep them in sections that stay on the dark atmosphere, or inside dark surfaces such as the footer.
- Without JavaScript (or on pages that do not mount `PageAtmosphere`, such as `/admin` and `/sign-in`) the page keeps the dark theme background. With `prefers-reduced-motion`, the atmosphere switches at the boundary instead of easing.
- Verified contrast at the flip point is about 3.2:1 for small muted text and higher elsewhere; outside the transition it is 7:1 or better.

### Inner pages: one dark → light transition
Every public inner route (`/programs`, `/classes`, `/training`, `/events`, `/blog`, `/blog/[slug]`, `/contact`, `/our-story`) uses the same mechanism as the homepage, not a second one: mount `<PageAtmosphere hero />` right after `<SiteHeader />`, mark the hero band `data-theme="dark"` and every section below it `data-theme="light"`. One transition per page; do not add the homepage's multi-section alternation to an inner page.
- The hero band is `PageHero` (or, on `/blog/[slug]`, the article `<header>`; on `/our-story`, the opening full-bleed band). `CtaBand` and `BlogTeaser` are always below the hero, so they are light. The boundary is the end of the mockup's `<!-- HERO -->` block on every page, including `/events`.
- `hero` moves the sampling line from the viewport centre (0.5) to 0.2. At 0.5 a hero shorter than about 85% of the viewport is already part-light on first load, so the page never reads as dark at the top; at 0.2 the page opens fully dark (`--atmos-t` = 0 on all eight routes at 1280×800 and 390×844) and reaches full light as the hero scrolls out of view. The homepage keeps 0.5.
- `PageAtmosphere` ignores the footer. The footer is a fixed dark surface with its own background, so an inner page that ends on a light section stays light down to it instead of darkening just above it. The footer carries `atmos-dark-surface`, which re-declares the `--atmos-*` tokens so MUI fields and muted text inside it stay ivory-on-dark whatever the page is doing. `SiteHeader` also forces its dark variant while its midline is over the footer (on a phone the footer is taller than the viewport, so the header can sit over it while the atmosphere is light).
- Extra tokens: `atmos-inverse` (fill for an active pill: `bg-atmos text-atmos-inverse`), `--atmos-field` (form-control borders), `--atmos-error` (error text: brand red on dark, the deeper red on ivory). The active blog category pill must use these, not `bg-brand-ivory`.
- MUI form controls follow the atmosphere through overrides in `lib/theme.js` (`MuiInputLabel`, `MuiOutlinedInput`, `MuiSelect`, `MuiFormHelperText`), all scoped to `html[data-atmosphere]`, so admin, sign-in and pre-hydration keep their dark colours. `Alert` (contact form) and the FAQ accordion (divider, chevron, focus outline) use the tokens through `sx`. A MUI select's menu is a dark `Paper` and stays dark on purpose.
- Self-contained dark cards (`ProgramCard`, `EventCard`) stay dark on the light zone, as they already do on the homepage's light sections.
- Known limitations: (1) The atmosphere is set by JavaScript, so a hard load or reload at a scroll position or `#hash` inside a light zone paints dark until hydration (about 0.3 s locally) and then switches. Text stays legible throughout; it is a flash, not a contrast failure. Soft navigation to such an anchor can show one dark frame. (2) `/our-story`'s founder-quote band is a full-bleed photo band in the light zone; once a real photograph is placed there, give the overlaid text a scrim and a fixed colour instead of `text-atmos`.

## 14. Avoid
Do not use Tailwind for arbitrary decorative gradients, excessive shadows, generic rounded dashboard cards, inconsistent one-off colors, duplicate component systems, or unexplained large spacing values.

## 15. Conversion Rule
When converting a design reference:
1. Identify the semantic section.
2. Identify its responsive layout.
3. Identify reusable components.
4. Apply project tokens.
5. Implement structure with Tailwind.
6. Use MUI for behavior/components where appropriate.
7. Verify mobile and desktop.
8. Remove unnecessary utility classes after the layout is stable.
