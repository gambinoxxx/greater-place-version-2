'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { validateNewsletterEmail } from '@/lib/newsletter-validation'

// The footer newsletter signup. It validates with the shared rule, posts JSON to /api/newsletter, and
// shows sending / success / error states. It never talks to Resend directly: the API key stays server-side.
const GENERIC_ERROR = 'Something went wrong. Please try again.'
const NETWORK_ERROR = 'We could not reach the server. Please check your connection and try again.'
const STATUS_ID = 'footer-newsletter-status'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [outcome, setOutcome] = useState(0) // ticks once per finished submission
  const statusRef = useRef(null)
  const inputRef = useRef(null)
  const honeypotRef = useRef(null)
  // Synchronous guard: React state is not updated yet when a second click arrives in the same tick.
  const submitting = useRef(false)

  // After each finished submission (once the field is enabled again), move focus to the outcome message.
  useEffect(() => {
    if (outcome === 0) return
    statusRef.current?.focus()
  }, [outcome])

  const onSubmit = async (event) => {
    event.preventDefault()
    if (submitting.current) return

    const result = validateNewsletterEmail(email)
    if (!result.ok) {
      setError(result.message)
      setStatus('error')
      inputRef.current?.focus()
      return
    }

    setError('')
    submitting.current = true
    setStatus('sending')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: result.value, company: honeypotRef.current?.value ?? '' }),
        signal: controller.signal,
      })
      let payload = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (response.ok && payload?.data) {
        setEmail('')
        setStatus('success')
      } else {
        setError(payload?.error?.message ?? GENERIC_ERROR)
        setStatus('error')
      }
    } catch {
      setError(NETWORK_ERROR)
      setStatus('error')
    } finally {
      setOutcome((count) => count + 1)
      window.clearTimeout(timeout)
      submitting.current = false
    }
  }

  if (status === 'success') {
    return (
      <p ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="mt-5 text-sm text-atmos-muted">
        Thanks for subscribing — you&apos;re on the list.
      </p>
    )
  }

  const sending = status === 'sending'
  const invalid = status === 'error' && Boolean(error)

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={sending} className="mt-5">
      <div className="flex items-stretch gap-3">
        <TextField
          id="footer-newsletter-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          size="small"
          fullWidth
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={invalid}
          disabled={sending}
          inputRef={inputRef}
          slotProps={{ htmlInput: { maxLength: 254, 'aria-describedby': STATUS_ID } }}
        />
        <Button type="submit" variant="solidWhite" size="small" disabled={sending}>
          {sending ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored by the API. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <p
        id={STATUS_ID}
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="mt-3 text-sm text-atmos-muted"
        style={invalid ? { color: 'var(--atmos-error)' } : undefined}
      >
        {sending ? 'Subscribing…' : invalid ? error : ''}
      </p>
    </form>
  )
}
