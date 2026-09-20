import { NextResponse } from 'next/server'
import { createUploadAuth } from '@/lib/imagekit'

// Never cache: every call must return a fresh token, and a static GET would be built once.
export const dynamic = 'force-dynamic'

// Signs a short-lived (10 minute) parameter set that lets the browser upload one file straight to
// ImageKit (see components/useImageUpload.js).
//
// TODO(Phase 10/11): THIS ROUTE IS NOT AUTHENTICATED. Anyone who can reach it can obtain a signature
// and upload to the project's ImageKit account. Before ImageKit credentials are set in any deployed
// environment, add an admin check here (Clerk) and return 401/403 for everyone else. Until then the
// route is safe only because it answers 503 while IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY are unset.
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
