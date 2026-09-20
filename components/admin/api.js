// Browser helper for the /api/admin/* endpoints. Resolves to { ok: true, data } or
// { ok: false, status, message, fields } and never throws, so forms can show the outcome.
const GENERIC = 'Something went wrong. Please try again.'
const NETWORK = 'We could not reach the server. Check your connection and try again.'
const SESSION = 'Your session has expired or you no longer have access. Sign in again.'

export async function sendAdmin(method, url, body) {
  try {
    const response = await fetch(url, {
      method,
      cache: 'no-store',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    let payload = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }
    if (response.ok && payload?.data) return { ok: true, data: payload.data }
    const expired = response.status === 401 || response.status === 403
    return { ok: false, status: response.status, message: payload?.error?.message ?? (expired ? SESSION : GENERIC), fields: payload?.error?.fields ?? {} }
  } catch {
    return { ok: false, status: 0, message: NETWORK, fields: {} }
  }
}

// ImageKit thumbnails for previews: only URLs under our own endpoint get a transformation.
export function previewUrl(src, endpoint, width = 800) {
  if (endpoint && typeof src === 'string' && src.startsWith(`${endpoint}/`) && !src.includes('?')) return `${src}?tr=w-${width},q-70,f-auto`
  return src
}
