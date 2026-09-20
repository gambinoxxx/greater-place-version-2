'use client'

import { previewUrl } from '@/components/admin/api'

// Admin-only image preview (the editors are client components, so they cannot use the server-side
// ImageKitImage). ImageKit URLs get a small resized rendition; anything else is shown as stored.
export default function AdminImage({ src, endpoint, width = 800, alt = '', className }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={previewUrl(src, endpoint, width)} alt={alt} loading="lazy" decoding="async" className={className} />
  )
}
