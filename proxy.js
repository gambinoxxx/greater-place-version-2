import { NextResponse } from 'next/server'
import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server'
import { decideAdminAccess, getAdminAllowlist, isClerkConfigured, pickVerifiedPrimaryEmail } from '@/lib/admin-access'

// SECURITY-SENSITIVE: this file is the gate in front of /admin. An authorization mistake here is a
// real security bug, not a style nit.
//
// This is Next 16's `proxy.js` (the renamed, deprecated `middleware.js`; same behaviour). It runs
// ONLY for the paths in `config.matcher` below, so the public site never touches Clerk and keeps
// working with no Clerk keys at all.
//
// A request is let through only when ALL of these hold: Clerk is configured, there is a Clerk
// session, and that user's verified primary email is on ADMIN_ALLOWED_EMAILS (lib/admin-access.js).
// A signed-in user who is not on the list is turned away exactly like a signed-out one.
//
//   pages   signed out -> Clerk sign-in (/sign-in) and back;   not allowed -> /not-authorized
//   APIs    signed out -> 401 JSON;  not allowed -> 403 JSON;  never a redirect
//   either  Clerk keys missing or allowlist empty -> 503 (fails closed, never open)

const NO_STORE = { 'Cache-Control': 'private, no-store' }

const isApiRequest = (request) => request.nextUrl.pathname.startsWith('/api/')

function apiError(status, message) {
  return NextResponse.json({ data: null, error: { message } }, { status, headers: NO_STORE })
}

function notConfigured(request) {
  if (isApiRequest(request)) return apiError(503, 'Admin access is not configured.')
  return new NextResponse('Admin access is not configured.', {
    status: 503,
    headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

const guard = clerkMiddleware(
  async (auth, request) => {
    const session = await auth()

    let email = null
    if (session.userId) {
      try {
        const client = await clerkClient()
        email = pickVerifiedPrimaryEmail(await client.users.getUser(session.userId))
      } catch (error) {
        // Could not read the user: keep the address unknown, which denies access. Class name only.
        console.error('[proxy] could not load the signed-in user:', error?.name ?? 'unknown')
      }
    }

    const decision = decideAdminAccess({
      configured: true, // proxy() below only reaches this handler when Clerk is configured
      signedIn: Boolean(session.userId),
      email,
      allowlist: getAdminAllowlist(),
    })

    if (decision === 'allowed') {
      const response = NextResponse.next()
      response.headers.set('Cache-Control', NO_STORE['Cache-Control'])
      return response
    }
    if (decision === 'not-configured') return notConfigured(request)
    if (decision === 'signed-out') {
      if (isApiRequest(request)) return apiError(401, 'Sign in is required.')
      return session.redirectToSignIn({ returnBackUrl: request.url })
    }
    if (isApiRequest(request)) return apiError(403, 'This account is not allowed to do that.')
    return NextResponse.redirect(new URL('/not-authorized', request.url), { headers: NO_STORE })
  },
  { signInUrl: '/sign-in' }
)

export default function proxy(request, event) {
  // clerkMiddleware() throws on every request when its keys are missing, so do not call it then.
  if (!isClerkConfigured()) return notConfigured(request)
  return guard(request, event)
}

// Protected paths (must be static constants). /api/admin/** is reserved for Phase 11's admin routes.
// /api/imagekit-auth signs ImageKit uploads and must be admin-only. Nothing else is listed: the
// public site, /sign-in, and /not-authorized never run this file.
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/imagekit-auth'],
}
