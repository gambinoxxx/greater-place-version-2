import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

// SECURITY-SENSITIVE. Shared wrapper for every /api/admin/* Route Handler. proxy.js already gates these
// paths; this re-verifies the admin next to the data (defence in depth), and applies the same request
// hygiene as /api/contact: JSON only, a size cap, and a same-origin check for state-changing requests.
//
// Responses are always { data, error }: 401 signed out, 403 not on the allowlist, 503 not configured,
// 415/413/400 for a bad request, 500 with a generic message (only an error class name is logged).

const NO_STORE = { 'Cache-Control': 'private, no-store' }
const MAX_BODY_CHARS = 500000

export function respond(status, data, error) {
  return NextResponse.json({ data, error }, { status, headers: NO_STORE })
}

export const fail = (status, message, fields) => respond(status, null, fields ? { message, fields } : { message })

// A browser sends Origin on cross-origin and on same-origin POST/PUT/PATCH/DELETE, and Sec-Fetch-Site
// on all fetches. Reject anything that is clearly cross-site; requests without either header cannot be
// carrying a victim's cookies from a browser.
function sameOrigin(request) {
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin' && site !== 'none') return false
  const origin = request.headers.get('origin')
  return !origin || origin === request.nextUrl.origin
}

// handler({ request, params, session, body }) -> Response. `body` is the parsed JSON for writes.
export function adminRoute(handler, { write = true } = {}) {
  return async function route(request, context) {
    try {
      const session = await getAdminSession()
      if (!session.ok) {
        if (session.reason === 'signed-out') return fail(401, 'Sign in is required.')
        if (session.reason === 'not-allowed') return fail(403, 'This account is not allowed to do that.')
        return fail(503, 'Admin access is not configured.')
      }

      let body
      if (write) {
        if (!sameOrigin(request)) return fail(403, 'Cross-site requests are not allowed.')
        if (request.method !== 'DELETE') {
          if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
            return fail(415, 'Send the request as JSON.')
          }
          const text = await request.text()
          if (text.length > MAX_BODY_CHARS) return fail(413, 'That request is too large.')
          try {
            body = JSON.parse(text)
          } catch {
            return fail(400, 'The request could not be read.')
          }
        }
      }

      const params = context?.params ? await context.params : {}
      return await handler({ request, params, session, body })
    } catch (error) {
      console.error('[api/admin] request failed:', error?.code ?? error?.name ?? 'unknown')
      return fail(500, 'Something went wrong on our side. Please try again.')
    }
  }
}

// Prisma error codes worth mapping: P2002 unique constraint, P2025 record not found.
export const isUniqueViolation = (error) => error?.code === 'P2002'
export const isNotFound = (error) => error?.code === 'P2025'

// Record ids are cuid()s: reject anything else before it reaches the database.
export const isRecordId = (value) => typeof value === 'string' && /^[a-z0-9]{10,40}$/i.test(value)
