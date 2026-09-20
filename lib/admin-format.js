// Small formatting helpers for the admin screens (server-rendered).

const DATE = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
const DATE_TIME = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

export const formatAdminDate = (date) => DATE.format(new Date(date))
export const formatAdminDateTime = (date) => DATE_TIME.format(new Date(date))

// "2 hours ago" for the inbox; older than a week falls back to the date.
export function formatRelative(date, now = Date.now()) {
  const seconds = Math.round((now - new Date(date).getTime()) / 1000)
  if (seconds < 45) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days < 8) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatAdminDate(date)
}

// /api/contact stores "Reason: X\nPhone: Y\n\n<message>" in ContactSubmission.message (Phase 7: the model
// has no reason/phone columns). Pull the header lines back out for display; anything else is the body.
export function parseSubmissionMessage(message) {
  const text = String(message ?? '')
  const match = /^Reason: ([^\n]*)\n(?:Phone: ([^\n]*)\n)?\n([\s\S]*)$/.exec(text)
  if (!match) return { reason: null, phone: null, body: text }
  return { reason: match[1] || null, phone: match[2] || null, body: match[3] }
}
