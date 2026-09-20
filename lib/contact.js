// Server-only helpers for the /contact page. The email address comes from the CONTACT_EMAIL env var
// (like WHATSAPP_NUMBER, it is never hardcoded); each helper returns undefined when it is unset or malformed.
const SAFE_EMAIL = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/

export function getContactEmail() {
  const email = (process.env.CONTACT_EMAIL ?? '').trim()
  return SAFE_EMAIL.test(email) ? email : undefined
}

export function buildMailtoHref() {
  const email = getContactEmail()
  return email ? `mailto:${email}` : undefined
}
