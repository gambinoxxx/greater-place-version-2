// Shared newsletter rule: pure JS with no server-only imports, so the footer form (client) and
// /api/newsletter (server) apply exactly the same check. The pattern mirrors lib/contact-validation.js.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_EMAIL_LENGTH = 254

export function validateNewsletterEmail(input) {
  const email = typeof input === 'string' ? input.trim() : ''
  if (!email) return { ok: false, message: 'Please enter your email address.' }
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL.test(email)) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }
  return { ok: true, value: email }
}
