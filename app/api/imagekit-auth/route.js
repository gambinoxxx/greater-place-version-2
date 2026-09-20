import { NextResponse } from 'next/server'
import { createUploadAuth } from '@/lib/imagekit'

// Never cache: every call must return a fresh token, and a static GET would be built once.
export const dynamic = 'force-dynamic'

// Signs a short-lived (10 minute) parameter set that lets the browser upload one file straight to
// ImageKit (see components/useImageUpload.js).
//
// ADMIN-ONLY: proxy.js (Phase 10) lists this path in its matcher, so only a signed-in Clerk user whose
// verified email is on ADMIN_ALLOWED_EMAILS reaches this handler (401/403 JSON otherwise, 503 while
// Clerk or the allowlist is unconfigured). Keep this path in that matcher: a signature lets the holder
// upload to the project's ImageKit account. Phase 11 may also re-check with getAdminSession()
// (lib/admin-auth.js) for defence in depth.
export async function GET() {
  try {
    const auth = createUploadAuth()
    if (!auth) return respond(503, null, { message: 'Image uploads are not configured.' })
    return respond(200, auth, null)
  } catch (error) {
    // Class name only: the message could echo configuration details.
    console.error('[api/imagekit-auth] could not sign an upload:', error?.name ?? 'unknown')
    return respond(500, null, { message: 'Could not start the upload. Please try again.' })
  }
}

function respond(status, data, error) {
  return NextResponse.json({ data, error }, { status, headers: { 'Cache-Control': 'no-store' } })
}
