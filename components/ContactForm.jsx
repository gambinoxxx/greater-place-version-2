'use client'

import { useEffect, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { LIMITS, REASONS, validateContact } from '@/lib/contact-validation'

// The only client-side surface of /contact. It validates with the shared rules, posts JSON to
// /api/contact, and shows sending / success / error states. It never touches the database.
const EMPTY = { name: '', email: '', phone: '', reason: '', message: '' }
const FIELD_ORDER = ['name', 'email', 'phone', 'reason', 'message']
const GENERIC_ERROR = 'Something went wrong. Please try again, or contact us directly.'
const NETWORK_ERROR = 'We could not reach the server. Please check your connection and try again, or contact us directly.'

// MUI's outlined alerts use pale severity tints that vanish on the light atmosphere: the text follows
// the page instead, and only the border and icon carry the severity colour.
const ALERT_SX = { color: 'var(--atmos-fg)', borderColor: 'var(--atmos-field)' }

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [serverMessage, setServerMessage] = useState('')
  const [outcome, setOutcome] = useState(0) // ticks once per finished submission
  const alertRef = useRef(null)
  const honeypotRef = useRef(null)
  const formRef = useRef(null)
  // Synchronous guard: React state is not updated yet when a second click arrives in the same tick.
  const submitting = useRef(false)

  // After each finished submission (once the fields are enabled again), move focus to the outcome:
  // the first invalid field when the server rejected specific fields, otherwise the message.
  useEffect(() => {
    if (outcome === 0) return
    const fieldErrors = Object.values(errors).some(Boolean)
    if (status === 'error' && fieldErrors) focusFirstInvalid(errors)
    else alertRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per finished submission, not on every keystroke
  }, [outcome])

  const onChange = (field) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const focusFirstInvalid = (fieldErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field])
    if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus()
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (submitting.current) return

    const result = validateContact(values)
    if (!result.ok) {
      setErrors(result.errors)
      setStatus('idle')
      focusFirstInvalid(result.errors)
      return
    }

    setErrors({})
    submitting.current = true
    setStatus('sending')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website: honeypotRef.current?.value ?? '' }),
        signal: controller.signal,
      })
      let payload = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (response.ok && payload?.data) {
        setValues(EMPTY)
        setStatus('success')
      } else {
        setErrors(payload?.error?.fields ?? {})
        setServerMessage(payload?.error?.message ?? GENERIC_ERROR)
        setStatus('error')
      }
    } catch {
      setServerMessage(NETWORK_ERROR)
      setStatus('error')
    } finally {
      setOutcome((count) => count + 1)
      window.clearTimeout(timeout)
      submitting.current = false
    }
  }

  if (status === 'success') {
    return (
      <div>
        <Alert ref={alertRef} tabIndex={-1} severity="success" variant="outlined" sx={ALERT_SX}>
          Thanks — we&apos;ve received your message and will get back to you.
        </Alert>
        <div className="mt-6">
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </div>
      </div>
    )
  }

  const sending = status === 'sending'
  const fieldProps = (field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: onChange(field),
    error: Boolean(errors[field]),
    helperText: errors[field] || undefined,
    disabled: sending,
    fullWidth: true,
  })

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={sending} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TextField {...fieldProps('name')} label="Full Name" required autoComplete="name" slotProps={{ htmlInput: { maxLength: LIMITS.name } }} />
        <TextField {...fieldProps('email')} label="Email Address" type="email" required autoComplete="email" slotProps={{ htmlInput: { maxLength: LIMITS.email } }} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <TextField {...fieldProps('phone')} label="Phone Number (optional)" type="tel" autoComplete="tel" slotProps={{ htmlInput: { maxLength: LIMITS.phone } }} />
        <TextField {...fieldProps('reason')} label="Reason For Contact" select required>
          {REASONS.map((reason) => (
            <MenuItem key={reason} value={reason}>
              {reason}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <TextField
        {...fieldProps('message')}
        label="Message"
        required
        multiline
        minRows={5}
        placeholder="Tell us a bit about what you need..."
        slotProps={{ htmlInput: { maxLength: LIMITS.message } }}
      />

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored by the API. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {status === 'error' && (
        <Alert
          ref={alertRef}
          tabIndex={-1}
          severity="error"
          variant="outlined"
          sx={{ ...ALERT_SX, borderColor: 'var(--atmos-error)', '& .MuiAlert-icon': { color: 'var(--atmos-error)' } }}
        >
          {serverMessage}
        </Alert>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="solidRed" disabled={sending}>
          {sending ? 'Sending…' : 'Send Message'}
        </Button>
        <span role="status" aria-live="polite" className="text-sm text-atmos-muted">
          {sending ? 'Sending your message…' : ''}
        </span>
      </div>
    </form>
  )
}
