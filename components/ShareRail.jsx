'use client'

import { useEffect, useRef, useState } from 'react'

// The only client-side surface of the blog post page. It receives just `path` (the post's path, e.g.
// "/blog/my-post") and `title`, resolves the absolute URL in the browser, and does no data fetching.
// Share actions: WhatsApp, email, and copy link.
const BUTTON =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-atmos-line transition-colors hover:bg-atmos-line motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function ShareRail({ path, title }) {
  const [status, setStatus] = useState('')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const announce = (message) => {
    setStatus(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus(''), 2500)
  }
  const absoluteUrl = () => new URL(path, window.location.origin).toString()

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${absoluteUrl()}`)}`, '_blank', 'noopener,noreferrer')
  }
  const shareEmail = () => {
    const body = `Thought you'd like this from Greater Place:\n\n${absoluteUrl()}`
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  }
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl())
      announce('Link copied')
    } catch {
      announce('Could not copy the link')
    }
  }

  return (
    <div className="flex items-center gap-3 lg:flex-col">
      <p className="sr-only">Share this article</p>
      <button type="button" className={BUTTON} onClick={shareWhatsApp} aria-label="Share on WhatsApp">
        <Icon>
          <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5.2A8.5 8.5 0 1 1 21 11.5Z" />
        </Icon>
      </button>
      <button type="button" className={BUTTON} onClick={shareEmail} aria-label="Share by email">
        <Icon>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m3 7 9 6 9-6" />
        </Icon>
      </button>
      <button type="button" className={BUTTON} onClick={copyLink} aria-label="Copy link">
        <Icon>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
          <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </Icon>
      </button>
      <span role="status" aria-live="polite" className="text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">
        {status}
      </span>
    </div>
  )
}
