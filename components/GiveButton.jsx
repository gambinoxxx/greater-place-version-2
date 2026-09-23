'use client'

import { useId, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { buildCashAppHref } from '@/lib/cashapp'

// A "give" CTA that expands into an amount field instead of linking straight out. Submitting opens
// Cash App in a new tab with the amount pre-filled (lib/cashapp.js) — there's no payment processor
// connected yet, so this is the direct-to-Cash-App flow until one is.
// suggestedAmounts: numbers shown as quick-pick chips before the free-form field.
export default function GiveButton({ ctaLabel, buttonVariant = 'solidRed', suggestedAmounts = [], note }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const inputId = useId()

  const openCashApp = (value) => {
    const href = buildCashAppHref(value)
    if (!href) {
      setError('Enter an amount greater than $0.')
      return
    }
    setError('')
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const onPick = (value) => {
    setAmount(String(value))
    openCashApp(value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    openCashApp(amount)
  }

  // Closing resets the card, so reopening starts from an empty field with no stale error.
  const onCancel = () => {
    setOpen(false)
    setAmount('')
    setError('')
  }

  if (!open) {
    return (
      <Button variant={buttonVariant} onClick={() => setOpen(true)}>
        {ctaLabel}
      </Button>
    )
  }

  // noValidate: the browser's own min/step checks would otherwise block submit before the inline
  // error below can show.
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-4 border border-atmos-line bg-atmos-card p-6"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-atmos-card-muted">{ctaLabel}</p>
        {suggestedAmounts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onPick(value)}
                className="border border-atmos-line px-3 py-1.5 text-sm font-semibold hover:bg-atmos-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                ${value}
              </button>
            ))}
          </div>
        )}
      </div>
      <TextField
        id={inputId}
        label="Amount (USD)"
        type="number"
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value)
          if (error) setError('')
        }}
        slotProps={{ htmlInput: { min: 0.01, step: '0.01', inputMode: 'decimal' } }}
        error={Boolean(error)}
        helperText={error || undefined}
        autoFocus
        fullWidth
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="solidRed">
          Continue to Cash App →
        </Button>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {note && <p className="text-xs text-atmos-card-muted">{note}</p>}
    </form>
  )
}
