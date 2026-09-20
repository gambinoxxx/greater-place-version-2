import ImageKit from '@imagekit/nodejs'

// Server-side ImageKit client and upload signing. This is the ONLY module that reads
// IMAGEKIT_PRIVATE_KEY; never import it from a client component. Components that only render
// images use lib/image-url.js instead.
//
// The client is created lazily: the SDK constructor throws when the private key is missing, and
// `next build` (and the site itself) must work before ImageKit credentials exist.
const globalForImageKit = globalThis

// How long a signed upload is valid. ImageKit requires less than one hour.
const UPLOAD_AUTH_TTL_SECONDS = 10 * 60

// { publicKey, privateKey } when both variables are set, otherwise null.
export function getUploadCredentials() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim()
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim()
  return publicKey && privateKey ? { publicKey, privateKey } : null
}

// One client per private key, reused across hot reloads in development (same idea as lib/prisma.js).
export function getImageKit(privateKey) {
  const cached = globalForImageKit.imagekit
  if (cached?.privateKey === privateKey) return cached.client
  const client = new ImageKit({ privateKey })
  if (process.env.NODE_ENV !== 'production') globalForImageKit.imagekit = { privateKey, client }
  return client
}

// Signed parameters for one browser upload, or null when ImageKit is not configured:
// { token, expire, signature, publicKey }. The signature is HMAC-SHA1(privateKey, token + expire).
// `expire` must be an absolute Unix time in seconds: the SDK's JSDoc says "seconds from now", but
// its implementation signs whatever value it is given, so a relative value would be already expired.
export function createUploadAuth() {
  const credentials = getUploadCredentials()
  if (!credentials) return null
  const expire = Math.floor(Date.now() / 1000) + UPLOAD_AUTH_TTL_SECONDS
  const { token, signature } = getImageKit(credentials.privateKey).helper.getAuthenticationParameters(undefined, expire)
  return { token, expire, signature, publicKey: credentials.publicKey }
}

// Media Library listing (Phase 11): the newest image files in the account, or null when ImageKit is not
// configured. Server-only; called from the admin Media Library page, which is behind proxy.js.
// `skip`/`limit` page through the account's images, newest first.
export async function listMediaFiles({ skip = 0, limit = 40 } = {}) {
  const credentials = getUploadCredentials()
  if (!credentials) return null
  const assets = await getImageKit(credentials.privateKey).assets.list({ type: 'file', fileType: 'image', sort: 'DESC_CREATED', skip, limit })
  return assets
    .filter((asset) => asset && typeof asset.url === 'string' && asset.fileId)
    .map((asset) => ({
      fileId: asset.fileId,
      name: asset.name,
      url: asset.url,
      filePath: asset.filePath,
      width: asset.width ?? null,
      height: asset.height ?? null,
      size: asset.size ?? null,
    }))
}
