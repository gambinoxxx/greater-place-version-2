// Contact form validation. Pure JavaScript with no server-only imports, so the same rules run in the
// browser (instant feedback) and in /api/contact (authoritative). ContactSubmission stores only
// name, email, and message; "reason" and "phone" are folded into the stored message by
// formatSubmissionMessage().
export const REASONS = ['Enroll a Dancer', 'Volunteer', 'Partnership', 'Media Inquiry', 'General Question']

export const LIMITS = { name: 100, email: 254, phone: 30, messageMin: 10, message: 5000 }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s.-]+$/
const LINE_BREAK_OR_TAB = /[\r\n\t]/
// Control characters other than tab, line feed, and carriage return.
const CONTROL_CHARS = '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]'
const HAS_CONTROL = new RegExp(CONTROL_CHARS)
const STRIP_CONTROL = new RegExp(CONTROL_CHARS, 'g')

const asText = (value) => (typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '')

// Returns { ok: true, value } or { ok: false, errors } where errors maps field name -> message.
export function validateContact(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: { form: 'Invalid request.' } }
  }

  const errors = {}
  const name = asText(input.name)
  const email = asText(input.email)
  const phone = asText(input.phone)
  const reason = typeof input.reason === 'string' ? input.reason : ''
  const message = asText(input.message).replace(STRIP_CONTROL, '')

  if (!name) errors.name = 'Please enter your name.'
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`
  else if (LINE_BREAK_OR_TAB.test(name) || HAS_CONTROL.test(name)) {
    errors.name = 'Please remove line breaks and special characters from your name.'
  }

  if (!email) errors.email = 'Please enter your email address.'
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = 'Please enter a valid email address.'

  if (phone) {
    const digits = phone.replace(/\D/g, '')
    if (phone.length > LIMITS.phone || !PHONE.test(phone) || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Please enter a valid phone number, or leave it blank.'
    }
  }

  if (!REASONS.includes(reason)) errors.reason = 'Please choose a reason for contacting us.'

  if (!message) errors.message = 'Please tell us a little about what you need.'
  else if (message.length < LIMITS.messageMin) errors.message = `Please write at least ${LIMITS.messageMin} characters.`
  else if (message.length > LIMITS.message) errors.message = `Please keep your message under ${LIMITS.message} characters.`

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { name, email, phone, reason, message } }
}

// The single string stored in ContactSubmission.message.
export function formatSubmissionMessage({ reason, phone, message }) {
  return `Reason: ${reason}\n${phone ? `Phone: ${phone}\n` : ''}\n${message}`
}
