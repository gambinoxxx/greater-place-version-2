import { Resend } from 'resend'

// Server-side Resend client for the footer newsletter signup. This is the ONLY module that reads
// RESEND_API_KEY; never import it from a client component. The client is created lazily (same idea as
// getImageKit() in lib/imagekit.js) so `next build` and the site work before Resend credentials exist.
const globalForResend = globalThis

// { apiKey, audienceId } when both variables are set, otherwise null.
export function getNewsletterCredentials() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim()
  return apiKey && audienceId ? { apiKey, audienceId } : null
}

// One client per API key, reused across hot reloads in development (same idea as lib/prisma.js).
function getResend(apiKey) {
  const cached = globalForResend.resend
  if (cached?.apiKey === apiKey) return cached.client
  const client = new Resend(apiKey)
  if (process.env.NODE_ENV !== 'production') globalForResend.resend = { apiKey, client }
  return client
}

// Returns null when Resend isn't configured, { ok: true } on success, or
// { ok: false, message } on failure. Resend's create-contact call updates an
// existing contact rather than erroring on a repeat signup, so no special
// duplicate-handling is needed here.
export async function subscribeToNewsletter(email) {
  const credentials = getNewsletterCredentials()
  if (!credentials) return null

  const { error } = await getResend(credentials.apiKey).contacts.create({
    audienceId: credentials.audienceId,
    email,
    unsubscribed: false,
  })

  if (!error) return { ok: true }
  console.error('[lib/newsletter] Resend rejected the subscribe request:', error.name ?? 'unknown')
  return { ok: false, message: 'Something went wrong on our side. Please try again.' }
}
