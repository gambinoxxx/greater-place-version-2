# Greater Place V2 — AI Workflow Rules

## 1. One Change at a Time
Each implementation unit should have one clear objective: one component, route, Prisma model, styling change, or bug fix. Avoid unrelated refactors.

## 2. Small Verifiable Increments
After meaningful changes:
- run the relevant development/build check
- inspect the result
- verify links/routes
- check responsive behavior when UI changes
- confirm there are no unrelated modifications

If a change cannot reasonably be verified, its scope is probably too large.

## 3. Repository Safety
Active V2 repository: gambinoxxx/greater-place-version-2

The older repository gambinoxxx/greater-place02 must remain untouched for V2 work. Never push V2 work to the old repository.

## 4. Protected Progress Tracker
docs/progress-tracker.md is protected. AI-assisted implementation must not edit, rewrite, reorder, or automatically mark it complete unless explicitly requested by the project owner.

## 5. Protected Applied Migrations
Once a Prisma migration has been applied to a shared database, do not rewrite or delete historical migration files to make local code convenient. Create a new migration for schema changes.

## 6. Architecture Before Implementation
Before introducing a dependency, route, service, or data flow:
1. Check architecture.
2. Check existing components/utilities.
3. Check code standards.
4. Check whether an existing dependency already solves the requirement.
5. Implement the smallest compatible change.

## 7. Documentation Synchronization
Architectural changes should be reflected in:
- project-overview.md
- architecture.md
- ui-context.md
- implementation-roadmap.md
- code-standards.md
- tailwind-conversion-notes.md

Do not modify progress-tracker.md automatically.

## 8. Design Fidelity
AI-generated UI must follow the established Greater Place visual language. Do not introduce generic SaaS styling, excessive rounded cards, random gradients, random brand colors, fake testimonials, or fabricated organizational claims.

## 9. Real Content Boundary
Never invent factual Greater Place information. If source material does not provide event dates, program details, staff identity, statistics, testimonials, awards, history, or contact information, use an explicit placeholder or request the source information.

## 10. Images
Do not present generated or stock images as authentic Greater Place photography. Use placeholders until real assets are supplied. Store image binaries in ImageKit and structured image references in the database where applicable.

## 11. Data Layer
Prisma is the structured content source of truth. Do not introduce a second content database without an explicit architectural decision. Keep database access server-side where appropriate and validate external data before persistence.

## 12. Environment Variables
Secrets must never be committed. Use .env.local for local secrets and .env.example for documented variable names and safe placeholders. Never place API keys, database credentials, private tokens, or service-account secrets directly in source files.

## 13. Authentication
Authentication is Clerk, and admin authorization is an email allowlist (`ADMIN_ALLOWED_EMAILS`); see `architecture.md`. Firebase is not used. Do not add another auth provider, Prisma user/auth models, or a second way into `/admin` without an explicit architectural decision, and do not couple public pages to authentication.

## 14. Next.js Rules
Use App Router conventions. Prefer Server Components by default, Client Components only when interactivity/browser APIs require them, route handlers for server-side API behavior, and clear server/client boundaries. Keep client boundaries as small as practical.

## 15. MUI Rules
Use the current Next.js App Router integration from @mui/material-nextjs and AppRouterCacheProvider. Do not resurrect the old custom Emotion SSR ThemeRegistry approach. Keep MUI theme configuration centralized.

## 16. Tailwind Rules
Tailwind is primarily responsible for layout and utility styling. Avoid duplicating the same styling responsibility in Tailwind and MUI without a reason. Use semantic project tokens instead of arbitrary colors.

## 17. Component Rules
Prefer reusable components when a pattern appears more than once. Avoid components that only wrap one element without meaningful behavior, semantics, consistency, or abstraction. Keep APIs small and explicit.

## 18. Accessibility
Consider semantic HTML, keyboard navigation, focus-visible states, color contrast, accessible names, form labels, and reduced motion in every interactive feature.

## 19. Testing / Verification
Before considering an implementation unit finished:
- verify the relevant route
- run the appropriate lint/build command
- check the browser for UI changes
- check mobile and desktop where relevant
- confirm no console errors

For data changes, verify schema/migration and relevant queries.

## 20. Git Workflow
Before committing:
1. git status
2. inspect the diff
3. confirm no secrets are staged
4. confirm docs/progress-tracker.md was not changed
5. commit one coherent change

Use descriptive commit messages. Do not force-push shared branches to resolve ordinary synchronization problems.

## 21. Dependency Changes
Before installing a dependency:
- confirm it is necessary
- confirm compatibility with Next.js 16 and React 19
- prefer maintained packages
- avoid deprecated packages when an official replacement exists

Do not run npm audit fix --force as a generic troubleshooting step.

## 22. Build Invariant
The application should maintain a production build that passes after each meaningful milestone. If a dependency or architectural change breaks the build, stop unrelated feature work, isolate the failure, fix the smallest root cause, rerun the build, and continue only after the checkpoint is restored.

## 23. Completion Summary
At the end of an implementation unit, report:
- what changed
- files/routes affected
- verification performed
- known limitations
- next logical implementation unit

Do not claim completion for work that was not actually implemented or verified.

## 24. Security-Sensitive Files
An authorization mistake in these places is a real security bug, not a style nit. Treat them as protected: change them only when the task is specifically about access control, and re-run the access checks below afterwards.

- `proxy.js` (the gate in front of `/admin/**`, `/api/admin/**`, and `/api/imagekit-auth`)
- `lib/admin-access.js` and `lib/admin-auth.js` (allowlist decision and server-side re-check)
- everything under `app/admin/**` and `app/api/admin/**` (Phase 11)
- `app/api/imagekit-auth/route.js` and `lib/imagekit.js` (upload signing and the ImageKit private key)
- `.env*` files and anything that reads `CLERK_SECRET_KEY`, `IMAGEKIT_PRIVATE_KEY`, or `ADMIN_ALLOWED_EMAILS`

Rules:
- Never widen the matcher's exclusions, remove `/api/imagekit-auth` from it, or add a code path that lets a request skip the allowlist. Fail closed: missing config, an empty allowlist, or a failed lookup must deny, never admit.
- Every new admin page, Route Handler, or Server Action re-checks with `getAdminSession()`; do not rely on `proxy.js` alone.
- Never return or log secrets, session tokens, the allowlist, or a user's email in responses or server logs (log a coarse error class only).
- Any change here needs a test for each of: signed out, signed in but not on the allowlist, and on the allowlist, plus the unconfigured case.
