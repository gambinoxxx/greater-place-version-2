import { getResponsiveImageAttributes } from '@imagekit/javascript'

// Delivery side of the ImageKit integration: URL checks and responsive attributes. No credentials
// live here (see lib/imagekit.js for the private key), so this is safe to import from components.
// It reads IMAGEKIT_URL_ENDPOINT, which is server-side only: use it from Server Components.
const ABSOLUTE_URL = /^https?:\/\//i

// Widths the browser may pick from. Cards are at most ~1280 CSS px wide, so 3840 is left out.
const DEVICE_BREAKPOINTS = [640, 750, 828, 1080, 1200, 1920, 2048]
const DEFAULT_TRANSFORMATION = [{ quality: 80, format: 'auto' }]

// True for an absolute http(s) URL, the only kind of value stored in image fields that is rendered.
export function isImageUrl(value) {
  return typeof value === 'string' && ABSOLUTE_URL.test(value)
}

// The configured ImageKit URL endpoint (origin + path, no trailing slash), or undefined when unset
// or not an http(s) URL.
export function getImageEndpoint() {
  const raw = process.env.IMAGEKIT_URL_ENDPOINT?.trim()
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined
    return `${url.origin}${url.pathname}`.replace(/\/+$/, '')
  } catch {
    return undefined
  }
}

// True only for a URL that lives under our own ImageKit endpoint and carries no transformation yet.
// buildSrc() would append ?tr= to ANY absolute URL, so foreign hosts must be filtered out here.
export function isImageKitUrl(src, endpoint = getImageEndpoint()) {
  if (!endpoint || !isImageUrl(src)) return false
  try {
    const target = new URL(src)
    const base = new URL(endpoint)
    if (target.origin !== base.origin) return false
    const prefix = base.pathname.replace(/\/+$/, '')
    return target.pathname.startsWith(`${prefix}/`) && !target.searchParams.has('tr') && !target.pathname.includes('/tr:')
  } catch {
    return false
  }
}

// { src, srcSet, sizes } for an <img>. ImageKit URLs get width-based candidates (never upscaled) in
// an auto format; anything else is returned untouched as { src }.
export function getImageAttributes(src, { sizes = '100vw', transformation = DEFAULT_TRANSFORMATION } = {}) {
  const endpoint = getImageEndpoint()
  if (!isImageKitUrl(src, endpoint)) return { src }
  const attributes = getResponsiveImageAttributes({
    urlEndpoint: endpoint,
    src,
    sizes,
    transformation,
    deviceBreakpoints: DEVICE_BREAKPOINTS,
  })
  return { src: attributes.src, srcSet: attributes.srcSet, sizes: attributes.sizes }
}
