'use client'

import { useRef } from 'react'
import useImageUpload, { IMAGE_UPLOAD_ACCEPT } from '@/components/useImageUpload'
import { insertImage, insertLink, prefixLines, wrapSelection } from '@/lib/markdown-edit'
import { FIELD_ERROR, FOCUS, LABEL } from '@/components/admin/ui'

// Markdown body editor: a plain <textarea> with a toolbar (Bold, Italic, Heading 2, Quote, Link, Image).
// The toolbar is string manipulation (lib/markdown-edit.js), not an editor library. The Image button
// uploads through useImageUpload and inserts ![alt](url) at the cursor. Post.body is Markdown and is
// only ever rendered by components/MarkdownBody.jsx (react-markdown, no raw HTML).
const TOOL = `flex h-7 min-w-7 items-center justify-center rounded px-2 text-[13px] text-brand-ivory hover:bg-brand-ivory/10 disabled:opacity-50 ${FOCUS}`

export default function MarkdownField({ value, onChange, error, folder, id = 'md-body' }) {
  const textarea = useRef(null)
  const fileInput = useRef(null)
  const { upload, uploading, error: uploadError } = useImageUpload({ folder, tags: ['admin', 'post-body'] })

  const apply = (transform) => {
    const el = textarea.current
    if (!el) return
    const next = transform({ value: el.value, start: el.selectionStart, end: el.selectionEnd })
    onChange(next.value)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(next.start, next.end)
    })
  }

  const addImage = async (file) => {
    if (!file) return
    const result = await upload(file)
    if (result?.url) apply((state) => insertImage(state, result.url, file.name.replace(/\.[^.]+$/, '')))
  }

  return (
    <div>
      <label htmlFor={id} className={LABEL}>Body (Markdown)</label>
      <div className="overflow-hidden rounded-md border border-brand-ivory/[0.14]">
        <div role="toolbar" aria-label="Markdown formatting" className="flex flex-wrap items-center gap-1 border-b border-brand-ivory/[0.14] bg-brand-ivory/[0.04] px-2.5 py-2">
          <button type="button" aria-label="Bold" title="Bold" className={`${TOOL} font-extrabold`} onClick={() => apply((s) => wrapSelection(s, '**', '**', 'bold text'))}>B</button>
          <button type="button" aria-label="Italic" title="Italic" className={`${TOOL} italic`} onClick={() => apply((s) => wrapSelection(s, '*', '*', 'italic text'))}>I</button>
          <span aria-hidden="true" className="mx-1 h-[18px] w-px bg-brand-ivory/[0.14]" />
          <button type="button" aria-label="Heading 2" title="Heading 2" className={`${TOOL} text-xs font-bold`} onClick={() => apply((s) => prefixLines(s, '## '))}>H2</button>
          <button type="button" aria-label="Quote" title="Quote" className={TOOL} onClick={() => apply((s) => prefixLines(s, '> '))}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 8h10M7 12h6M7 16h10" /><path d="M4 4v16" /></svg>
          </button>
          <span aria-hidden="true" className="mx-1 h-[18px] w-px bg-brand-ivory/[0.14]" />
          <button type="button" aria-label="Link" title="Link" className={TOOL} onClick={() => apply((s) => insertLink(s))}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9.5 14.5l5-5" /><path d="M11 7l1.3-1.3a3 3 0 1 1 4.3 4.3L15 11" /><path d="M13 17l-1.3 1.3a3 3 0 1 1-4.3-4.3L9 13" /></svg>
          </button>
          <button type="button" aria-label="Insert image" title="Insert image" className={TOOL} disabled={uploading} onClick={() => fileInput.current?.click()}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="15" rx="1.5" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 15l-5.5-5.5L4 20" /></svg>
          </button>
          <span className="grow" />
          <span className="pr-1 text-[10.5px] text-brand-ivory/[0.38]">{uploading ? 'Uploading image…' : 'Markdown'}</span>
        </div>
        <textarea
          id={id}
          ref={textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={16}
          spellCheck
          aria-invalid={Boolean(error)}
          className="block w-full resize-y bg-brand-navyDeep px-5 py-4 font-mono text-[13px] leading-[1.8] text-brand-ivory placeholder:text-brand-ivory/[0.38] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-ivory"
        />
      </div>
      <input ref={fileInput} type="file" accept={IMAGE_UPLOAD_ACCEPT} hidden data-testid="body-file" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; addImage(file) }} />
      {(uploadError || error) && <p role="alert" className={FIELD_ERROR}>{uploadError || error}</p>}
    </div>
  )
}
