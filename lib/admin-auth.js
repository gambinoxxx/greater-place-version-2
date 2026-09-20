import { auth, currentUser } from '@clerk/nextjs/server'
import { decideAdminAccess, getAdminAllowlist, isClerkConfigured, pickVerifiedPrimaryEmail } from '@/lib/admin-access'

// SECURITY-SENSITIVE. Server-side re-check of admin access for Phase 11's pages, Route Handlers, and
// Server Actions. proxy.js already gates /admin/**, but authorization should also be verified next to
// the data it protects, so a matcher mistake or a new entry point cannot expose it.
//
// Server-only (Clerk server APIs): never import this from a client component. auth() only works on
// routes covered by proxy.js's matcher.
//
//   const session = await getAdminSession()
//   if (!session.ok) ...   // 'not-configured' | 'signed-out' | 'not-allowed'
//   session.email, session.userId when ok
export async function getAdminSession() {
  const configured = isClerkConfigured()
  const allowlist = getAdminAllowlist()
  if (!configured || allowlist.length === 0) return { ok: false, reason: 'not-configured' }

  const { userId } = await auth()
  if (!userId) return { ok: false, reason: 'signed-out' }

  let email = null
  try {
    email = pickVerifiedPrimaryEmail(await currentUser())
  } catch (error) {
    console.error('[admin-auth] could not load the signed-in user:', error?.name ?? 'unknown')
  }

  const decision = decideAdminAccess({ configured, signedIn: true, email, allowlist })
  return decision === 'allowed' ? { ok: true, userId, email } : { ok: false, reason: decision }
}
