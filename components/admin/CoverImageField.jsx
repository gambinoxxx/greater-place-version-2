'use client'

import { useRef, useState } from 'react'
import useImageUpload, { IMAGE_UPLOAD_ACCEPT } from '@/components/useImageUpload'
import AdminImage from '@/components/admin/AdminImage'
import { BTN_SMALL, FIELD_ERROR, INPUT, LABEL } from '@/components/admin/ui'

// Image field for the editors: a labelled dropzone ("Drag & drop an image, or browse files") that uploads
// through Phase 9's useImageUpload (signed by /api/imagekit-auth, straight to ImageKit), plus a URL box
// for reusing an image copied from the Media Library. Stores the delivered URL in the field.
export default function CoverImageField({ label = 'Cover Image', value, onChange, error, folder, imageEndpoint, hint = 'JPG, PNG, WebP, GIF or AVIF, up to 10 MB' }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)
  const { upload, uploading, progress, error: uploadError } = useImageUpload({ folder, tags: ['admin'] })

  const send = async (file) => {
    if (!file) return
    const result = await upload(file)
    if (result?.url) onChange(result.url)
  }

  return (
    <div>
      <span className={LABEL}>{label}</span>
      {value ? (
        <div className="overflow-hidden rounded-lg border border-brand-ivory/[0.14]">
          <AdminImage src={value} endpoint={imageEndpoint} width={900} className="aspect-[16/9] w-full bg-brand-navyDeep object-cover" />
          <div className="flex items-center justify-between gap-3 border-t border-brand-ivory/[0.14] px-3 py-2">
            <span className="min-w-0 truncate text-xs text-brand-ivory/[0.55]" title={value}>{value}</span>
            <div className="flex shrink-0 gap-2">
              <button type="button" className={BTN_SMALL} onClick={() => inputRef.current?.click()} disabled={uploading}>Replace</button>
              <button type="button" className={BTN_SMALL} onClick={() => onChange('')} disabled={uploading}>Remove</button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => { event.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={(event) => { event.preventDefault(); setOver(false); send(event.dataTransfer.files?.[0]) }}
          className={`flex flex-col items-center gap-2.5 rounded-lg border-[1.5px] border-dashed p-8 text-center ${over ? 'border-brand-storiesBlue bg-brand-storiesBlue/10' : 'border-brand-ivory/25'}`}
        >
          <div aria-hidden="true" className="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-brand-ivory/[0.06]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-brand-ivory/60">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
          </div>
          <p className="text-[13px] font-semibold">
            Drag &amp; drop an image, or{' '}
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="text-brand-storiesBlue underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-ivory">
              browse files
            </button>
          </p>
          <p className="text-[11.5px] text-brand-ivory/[0.38]">{hint}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={IMAGE_UPLOAD_ACCEPT} hidden data-testid="cover-file" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; send(file) }} />

      <div role="status" aria-live="polite" className="mt-2 text-xs text-brand-ivory/70">
        {uploading ? `Uploading… ${progress}%` : ''}
      </div>
      {(uploadError || error) && <p role="alert" className={FIELD_ERROR}>{uploadError || error}</p>}

      <label className="mt-3 block text-[11px] text-brand-ivory/[0.55]" htmlFor={`${label}-url`}>Or paste an image URL</label>
      <input id={`${label}-url`} type="url" inputMode="url" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder="https://" className={`${INPUT} mt-1`} />
    </div>
  )
}
