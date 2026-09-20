'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendAdmin } from '@/components/admin/api'
import { BTN_SMALL, ICON_BTN } from '@/components/admin/ui'

// Trash button with an inline confirm step. Deleting is permanent, so the first click only asks; the
// second calls DELETE on `endpoint` and refreshes the list. `name` is used in the accessible labels.
export default function ConfirmDelete({ endpoint, name, kind }) {
  const router = useRouter()
  const [state, setState] = useState('idle') // idle | confirming | deleting
  const [error, setError] = useState('')
  const cancelRef = useRef(null)

  useEffect(() => {
    if (state === 'confirming') cancelRef.current?.focus()
  }, [state])

  const remove = async () => {
    setState('deleting')
    setError('')
    const result = await sendAdmin('DELETE', endpoint)
    if (result.ok || result.status === 404) {
      router.refresh() // a 404 means it is already gone: the list should just catch up
      return
    }
    setError(result.message)
    setState('confirming')
  }

  if (state === 'idle') {
    return (
      <button type="button" aria-label={`Delete ${kind}: ${name}`} onClick={() => setState('confirming')} className={`${ICON_BTN} text-brand-red/80 hover:text-brand-red`}>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
        </svg>
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onKeyDown={(event) => { if (event.key === 'Escape' && state !== 'deleting') { setState('idle'); setError('') } }}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-delete-title" className="w-full max-w-sm rounded-lg border border-brand-ivory/25 bg-brand-navyDeep p-5 text-left normal-case shadow-2xl">
        <h2 id="confirm-delete-title" className="font-serif text-lg">Delete this {kind}?</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-ivory/80">
          <strong className="font-bold">{name}</strong> will be deleted permanently. This cannot be undone.
        </p>
        {error && <p role="alert" className="mt-3 text-xs text-brand-red">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={() => { setState('idle'); setError('') }} disabled={state === 'deleting'} className={BTN_SMALL}>
            Cancel
          </button>
          <button type="button" onClick={remove} disabled={state === 'deleting'} className={`${BTN_SMALL} border-brand-red/60 bg-brand-red/10 text-brand-red hover:bg-brand-red/20`}>
            {state === 'deleting' ? 'Deleting…' : `Delete ${kind}`}
          </button>
        </div>
      </div>
    </div>
  )
}
