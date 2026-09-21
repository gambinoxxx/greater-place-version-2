import { NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/newsletter'
import { validateNewsletterEmail } from '@/lib/newsletter-validation'

// Standard response shape: { data, error }.
//   201 { data: { subscribed: true }, error: null }
//   400 { data: null, error: { message } }   invalid email (no Resend call)
//   413 / 415 { data: null, error: { message } }   body too large / not JSON
//   502 { data: null, error: { message } }   Resend rejected the request
//   503 { data: null, error: { message } }   RESEND_API_KEY / RESEND_AUDIENCE_ID not set
//   500 { data: null, error: { message } }   unexpected failure (generic; details stay in the server log)
const MAX_BODY_CHARS = 2_000

const respond = (status, data, error) => NextResponse.json({ data, error }, { status })

export async function POST(request) {
  // Browsers cannot send application/json cross-site without a CORS preflight, which this endpoint does not grant.
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return respond(415, null, { message: 'Requests must be sent as JSON.' })
  }

  let body
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_CHARS) return respond(413, null, { message: 'That request is too large.' })
    body = JSON.parse(raw)
  } catch {
    return respond(400, null, { message: 'The request could not be read.' })
  }

  // Honeypot: real visitors never see or fill this field. Pretend success and subscribe nobody.
  if (typeof body?.company === 'string' && body.company.trim() !== '') {
    return respond(201, { subscribed: true }, null)
  }

  const result = validateNewsletterEmail(body?.email)
  if (!result.ok) return respond(400, null, { message: result.message })

  try {
    const outcome = await subscribeToNewsletter(result.value)
    if (!outcome) return respond(503, null, { message: 'Newsletter signups are not set up yet.' })
    if (!outcome.ok) return respond(502, null, { message: outcome.message })
    return respond(201, { subscribed: true }, null)
  } catch (error) {
    // Log only a coarse identifier: never the address, and never the SDK's message, to the client.
    console.error('[api/newsletter] could not subscribe:', error?.name ?? 'unknown')
    return respond(500, null, { message: 'Something went wrong on our side. Please try again.' })
  }
}
