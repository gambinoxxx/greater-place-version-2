'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendAdmin } from '@/components/admin/api'
import { slugify } from '@/lib/admin-validation'

// State and submit logic shared by the admin editors. `validate` is one of the lib/admin-validation.js
// validators (the same rules the API enforces). After a failed save, focus moves to the first invalid
// field (element id `${idPrefix}-${field}`) or, failing that, to the error summary.
export default function useAdminForm({ initial, validate, endpoint, method, redirectTo, idPrefix, slugFrom }) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | saving | error
  const [message, setMessage] = useState('')
  const [outcome, setOutcome] = useState(0)
  const alertRef = useRef(null)
  const focusField = useRef(null)
  const slugTouched = useRef(!slugFrom) // the slug follows the title only while creating, until edited
  const saving = useRef(false) // synchronous double-submit guard

  useEffect(() => {
    if (outcome === 0) return
    const target = focusField.current ? document.getElementById(`${idPrefix}-${focusField.current}`) : null
    ;(target ?? alertRef.current)?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per failed save, not on every keystroke
  }, [outcome])

  const set = (field, value) => {
    setValues((current) => {
      const next = { ...current, [field]: value }
      if (field === 'slug') slugTouched.current = true
      else if (field === slugFrom && !slugTouched.current) next.slug = slugify(value)
      return next
    })
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  const fail = (fieldErrors, text) => {
    setErrors(fieldErrors ?? {})
    setMessage(text)
    setStatus('error')
    focusField.current = Object.keys(fieldErrors ?? {}).find((key) => fieldErrors[key]) ?? null
    setOutcome((count) => count + 1)
  }

  // overrides: values applied for this save only (e.g. isPublished from the Save Draft / Publish buttons).
  const submit = async (overrides = {}) => {
    if (saving.current) return
    const payload = { ...values, ...overrides }
    const result = validate(payload)
    if (!result.ok) return fail(result.errors, 'Please check the highlighted fields.')

    saving.current = true
    setStatus('saving')
    setErrors({})
    setMessage('')
    const response = await sendAdmin(method, endpoint, payload)
    saving.current = false
    if (response.ok) {
      router.push(redirectTo)
      router.refresh()
      return
    }
    fail(response.fields, response.message)
  }

  return { values, set, errors, status, message, alertRef, submit, saving: status === 'saving' }
}
