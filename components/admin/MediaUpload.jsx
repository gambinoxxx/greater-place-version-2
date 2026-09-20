'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import useImageUpload, { IMAGE_UPLOAD_ACCEPT } from '@/components/useImageUpload'
import { BTN_RED, FOCUS } from '@/components/admin/ui'

// Upload control for the Media Library: the "Upload Image" button and the "Upload new" tile share one
// upload (Phase 9's useImageUpload). A finished upload refreshes the grid.
export function MediaUploadButton({ folder = '/library', tile = false }) {
  const router = useRouter()
  const input = useRef(null)
  const { upload, uploading, progress, error, result } = useImageUpload({ folder, tags: ['admin', 'library'] })

  const send = async (file) => {
    if (!file) return
    const uploaded = await upload(file)
    if (uploaded) router.refresh()
  }

  return (
    <div className={tile ? 'contents' : 'flex flex-col items-end gap-1'}>
      {tile ? (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className={`flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-brand-ivory/25 text-[11px] text-brand-ivory/40 hover:text-brand-ivory/70 disabled:opacity-60 ${FOCUS}`}
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
          {uploading ? `Uploading… ${progress}%` : 'Upload new'}
        </button>
      ) : (
        <button type="button" onClick={() => input.current?.click()} disabled={uploading} className={BTN_RED}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          {uploading ? `Uploading… ${progress}%` : 'Upload Image'}
        </button>
      )}
      <input ref={input} type="file" accept={IMAGE_UPLOAD_ACCEPT} hidden data-testid={tile ? 'media-file-tile' : 'media-file'} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; send(f) }} />
      <span role="status" aria-live="polite" className="sr-only">{uploading ? 'Uploading image' : result ? 'Upload finished' : ''}</span>
      {error && <p role="alert" className="max-w-[16rem] text-right text-xs text-brand-red">{error}</p>}
    </div>
  )
}

// "Copy URL" under each image: the stored value for a post or event image is this URL.
export function CopyUrlButton({ url, name }) {
  const [state, setState] = useState('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2000)
  }
  return (
    <button type="button" onClick={copy} aria-label={`Copy URL of ${name}`} className={`text-[10px] font-bold uppercase tracking-[0.06em] text-brand-storiesBlue hover:underline ${FOCUS}`}>
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy URL'}
    </button>
  )
}
