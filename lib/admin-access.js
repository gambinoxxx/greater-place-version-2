// Admin access rules shared by proxy.js and server code (lib/admin-auth.js). Pure on purpose: no Clerk
// or Next imports, so the decision that guards /admin can be tested without a Clerk instance.
//
// Being signed in to Clerk is NOT enough: Clerk's own sign-up is open unless the Clerk dashboard says
// otherwise, so /admin is gated by an explicit email allowlist (ADMIN_ALLOWED_EMAILS) as well.

const EMAIL_SHAPE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/

// "a@x.org, B@x.org" -> ["a@x.org", "b@x.org"]. Entries are trimmed, lowercased, and de-duplicated;
// anything that is not a full address (blank, "@x.org", "*", a bare domain) is dropped, so a
// malformed entry can never match more people than intended. There are no wildcards or domain rules.
export function parseAllowlist(raw) {
  if (typeof raw !== 'string') return []
  const emails = raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => EMAIL_SHAPE.test(entry))
  return [...new Set(emails)]
}

export function getAdminAllowlist() {
  return parseAllowlist(process.env.ADMIN_ALLOWED_EMAILS)
}

// Clerk needs both keys. The publishable key is inlined at build time (NEXT_PUBLIC_), so set both
// before `next build`. Everything auth-related stays off, and /admin stays closed, until they exist.
export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() && process.env.CLERK_SECRET_KEY?.trim())
}

// The address to check: the account's PRIMARY email, and only if Clerk has verified it. An unverified
// address proves nothing about who owns it. `user` is a Clerk user (backend or currentUser()) or any
// object with the same fields.
export function pickVerifiedPrimaryEmail(user) {
  const primary = user?.emailAddresses?.find((address) => address.id === user.primaryEmailAddressId)
  if (!primary || primary.verification?.status !== 'verified') return null
  const email = String(primary.emailAddress ?? '').trim().toLowerCase()
  return EMAIL_SHAPE.test(email) ? email : null
}

// One decision for every caller. Order matters: an unconfigured system fails closed before anything
// else, and only an exact allowlist match (lowercase, verified) reaches "allowed".
//   'not-configured'  Clerk keys missing, or the allowlist is empty: nobody can be admitted.
//   'signed-out'      no Clerk session.
//   'not-allowed'     signed in, but the verified primary email is missing or not on the list.
//   'allowed'
export function decideAdminAccess({ configured, signedIn, email, allowlist }) {
  if (!configured || !Array.isArray(allowlist) || allowlist.length === 0) return 'not-configured'
  if (!signedIn) return 'signed-out'
  if (typeof email !== 'string' || !allowlist.includes(email.toLowerCase())) return 'not-allowed'
  return 'allowed'
}
