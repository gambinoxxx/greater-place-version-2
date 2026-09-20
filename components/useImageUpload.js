'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload as imagekitUpload,
} from '@imagekit/javascript'

// Client-side image upload for admin surfaces (Post Editor cover dropzone, Media Library button).
// The hook has no markup, so any UI can drive it: call `upload(file)` from a file input's onChange,
// a button, or a drop handler.
//
//   const { upload, abort, reset, status, progress, error, result } = useImageUpload({ folder: '/posts' })
//   const uploaded = await upload(file) // { url, fileId, ... } or null (see `error`)
//
// Flow: GET /api/imagekit-auth (signed, short-lived parameters) -> upload straight to ImageKit ->
// resolve with the stored file. Store `result.url` in the model's image field: that is what
// <ImageKitImage> and the isImageUrl() guard expect. One upload runs at a time per hook instance;
// use one instance per file for parallel uploads.
//
// The type and size checks below are conveniences for fast feedback, not security: the browser can
// misreport a file's type, so enforce allowed formats and size in the ImageKit dashboard as well.

// SVG is left out on purpose: it can carry script and is served as a document.
export const IMAGE_UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
// For <input accept> and dropzone filters.
export const IMAGE_UPLOAD_ACCEPT = IMAGE_UPLOAD_TYPES.join(',')
export const IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024

const NETWORK_ERROR = 'We could not reach the image service. Check your connection and try again.'
const GENERIC_ERROR = 'The image could not be uploaded. Please try again.'
const UNAVAILABLE_ERROR = 'Image uploads are not set up yet.'

// Returns a user-facing message when the file should not be uploaded, otherwise null.
export function validateImageFile(file) {
  if (!file || typeof file.size !== 'number') return 'Choose an image to upload.'
  if (!IMAGE_UPLOAD_TYPES.includes(file.type)) return 'Use a JPEG, PNG, WebP, GIF, or AVIF image.'
  if (file.size === 0) return 'That file is empty.'
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) return `Images must be ${IMAGE_UPLOAD_MAX_BYTES / 1024 / 1024} MB or smaller.`
  return null
}

// An error whose message is safe to show to the person uploading.
class UploadError extends Error {}

async function fetchUploadAuth(signal) {
  let response
  try {
    response = await fetch('/api/imagekit-auth', { cache: 'no-store', signal })
  } catch (error) {
    if (signal.aborted) throw error
    throw new UploadError(NETWORK_ERROR)
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  const data = payload?.data
  if (response.ok && data?.token && data?.signature && data?.publicKey && Number.isFinite(data?.expire)) return data
  if (response.status === 503) throw new UploadError(UNAVAILABLE_ERROR)
  if (response.status === 401 || response.status === 403) throw new UploadError('You do not have permission to upload images.')
  throw new UploadError(payload?.error?.message ?? GENERIC_ERROR)
}

function messageFor(error) {
  if (error instanceof UploadError) return error.message
  if (error instanceof ImageKitInvalidRequestError) return 'The image was rejected. Check the file type and size, then try again.'
  if (error instanceof ImageKitServerError) return 'The image service had a problem. Please try again.'
  if (error instanceof ImageKitUploadNetworkError) return NETWORK_ERROR
  return GENERIC_ERROR
}

const IDLE = { status: 'idle', progress: 0, error: null, result: null }

// Options: `folder` (e.g. '/posts'; created if missing) and `tags` (array of strings). Both are read
// at upload time, so passing new literals on each render is fine.
export default function useImageUpload({ folder, tags } = {}) {
  const [state, setState] = useState(IDLE)
  const options = useRef({ folder, tags })
  const controller = useRef(null)
  // Synchronous guard: state is not updated yet when a second call arrives in the same tick.
  const busy = useRef(false)
  const mounted = useRef(true)

  useEffect(() => {
    options.current = { folder, tags }
  })

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      controller.current?.abort()
    }
  }, [])

  const update = useCallback((next) => {
    if (mounted.current) setState((current) => ({ ...current, ...next }))
  }, [])

  const upload = useCallback(
    async (file) => {
      if (busy.current) return null

      const invalid = validateImageFile(file)
      if (invalid) {
        update({ ...IDLE, status: 'error', error: invalid })
        return null
      }

      busy.current = true
      const abortController = new AbortController()
      controller.current = abortController
      update({ ...IDLE, status: 'uploading' })

      try {
        const auth = await fetchUploadAuth(abortController.signal)
        const response = await imagekitUpload({
          file,
          fileName: file.name || 'upload',
          publicKey: auth.publicKey,
          token: auth.token,
          expire: auth.expire,
          signature: auth.signature,
          useUniqueFileName: true,
          folder: options.current.folder,
          tags: options.current.tags,
          abortSignal: abortController.signal,
          onProgress: (event) => {
            if (event.lengthComputable) update({ progress: Math.round((event.loaded / event.total) * 100) })
          },
        })

        if (typeof response?.url !== 'string' || !response.fileId) throw new UploadError(GENERIC_ERROR)
        const result = {
          url: response.url,
          fileId: response.fileId,
          filePath: response.filePath,
          name: response.name,
          width: response.width,
          height: response.height,
          size: response.size,
          fileType: response.fileType,
          thumbnailUrl: response.thumbnailUrl,
        }
        update({ status: 'success', progress: 100, error: null, result })
        return result
      } catch (error) {
        if (error instanceof ImageKitAbortError || error?.name === 'AbortError') {
          update(IDLE) // cancelled on purpose: not an error
        } else {
          update({ ...IDLE, status: 'error', error: messageFor(error) })
        }
        return null
      } finally {
        busy.current = false
        controller.current = null
      }
    },
    [update]
  )

  const abort = useCallback(() => controller.current?.abort(), [])
  const reset = useCallback(() => {
    if (!busy.current) update(IDLE)
  }, [update])

  return { upload, abort, reset, ...state, uploading: state.status === 'uploading' }
}
