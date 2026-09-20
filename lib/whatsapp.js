// Server-only helpers. The number comes from the WHATSAPP_NUMBER env var (digits, country code
// included, no "+"); it is never hardcoded. Every helper returns undefined when it is unset.
function chatUrl(text) {
  const number = (process.env.WHATSAPP_NUMBER ?? '').replace(/\D/g, '')
  if (!number) return undefined
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export function buildRsvpHref(event) {
  const start = new Date(event.startsAt)
  const when = Number.isNaN(start.getTime())
    ? ''
    : ` on ${new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'short' }).format(start)}`
  return chatUrl(`Hello Greater Place, I would like to RSVP for "${event.title}"${when}.`)
}

export function buildChatHref() {
  return chatUrl()
}

export function buildEnrollHref() {
  return chatUrl("Hi Greater Place! I'd like to enroll.")
}

export function buildGeneralRsvpHref() {
  return chatUrl("Hi Greater Place! I'd like to RSVP for an upcoming event.")
}

export function buildGroupHref() {
  return chatUrl("Hi Greater Place! I'd like to bring a group to an upcoming event.")
}

// Contact page: number shown next to the WhatsApp button (formatted only as +<digits>), and its two links.
export function getWhatsAppDisplay() {
  const number = (process.env.WHATSAPP_NUMBER ?? '').replace(/\D/g, '')
  return number ? `+${number}` : undefined
}

export function buildLearnMoreHref() {
  return chatUrl("Hi Greater Place! I'd like to learn more about your programs.")
}

export function buildQuickChatHref() {
  return chatUrl("Hi Greater Place! I'd like to learn more.")
}
