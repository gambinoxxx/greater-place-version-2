// Cash App is used directly for now — no payment processor is connected yet
// (see docs/design-references/donate.html's original placeholder note). A Cash App payment link
// takes the form https://cash.app/$<cashtag>/<amount>, which pre-fills the amount on Cash App's
// side; the org's cashtag is not a secret, so it's a plain constant rather than an env var.
const CASHTAG = 'BrandyOnwuzuruike'

// amount: a positive number (dollars, decimals allowed). Returns undefined for anything else, so
// callers never build a link with a missing or invalid amount.
export function buildCashAppHref(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return undefined
  // Cash App reads the amount as a plain decimal segment; trim to cents and drop a trailing ".00".
  // The check runs after rounding so a sub-cent amount like 0.004 can't become a $0 link.
  const rounded = Math.round(value * 100) / 100
  if (rounded <= 0) return undefined
  const formatted = rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2)
  return `https://cash.app/$${CASHTAG}/${formatted}`
}
