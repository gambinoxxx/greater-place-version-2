'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendAdmin } from '@/components/admin/api'
import { FOCUS } from '@/components/admin/ui'

// Toggles ContactSubmission.isRead through PATCH /api/admin/contact/[id]. The inbox has no other action:
// no edit, reply, or delete. Refreshing the route also updates the sidebar's unread badge.
export default function MarkReadButton({ id, isRead, name }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(false)

  const toggle = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    setError('')
    const result = await sendAdmin('PATCH', `/api/admin/contact/${id}`, { isRead: !isRead })
    inFlight.current = false
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.message)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={`${isRead ? 'Mark as unread' : 'Mark as read'}: message from ${name}`}
        className={`rounded border px-3.5 py-[7px] text-[10.5px] font-bold uppercase tracking-[0.06em] disabled:opacity-50 ${FOCUS} ${isRead ? 'border-brand-ivory/[0.14] text-brand-ivory/[0.55] hover:text-brand-ivory' : 'border-transparent bg-brand-green/15 text-brand-green hover:bg-brand-green/25'}`}
      >
        {busy ? 'Saving…' : isRead ? 'Mark as Unread' : 'Mark as Read'}
      </button>
      {error && <span role="alert" className="text-xs text-brand-red">{error}</span>}
    </div>
  )
}
