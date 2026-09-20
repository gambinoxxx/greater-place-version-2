import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { formatSubmissionMessage, validateContact } from '@/lib/contact-validation'

// Standard response shape: { data, error }.
//   201 { data: { received: true }, error: null }
//   400 { data: null, error: { message, fields } }   validation failed (no database call)
//   413 / 415 { data: null, error: { message } }     body too large / not JSON
//   500 { data: null, error: { message } }           unexpected failure (generic; details stay in the server log)
const MAX_BODY_CHARS = 20_000

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
    if (raw.length > MAX_BODY_CHARS) return respond(413, null, { message: 'Your message is too long.' })
    body = JSON.parse(raw)
  } catch {
    return respond(400, null, { message: 'The request could not be read.' })
  }

  const result = validateContact(body)
  if (!result.ok) {
    return respond(400, null, { message: 'Please check the highlighted fields.', fields: result.errors })
  }

  // Honeypot: real visitors never see or fill this field. Pretend success and store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return respond(201, { received: true }, null)
  }

  try {
    const { name, email } = result.value
    await prisma.contactSubmission.create({
      data: { name, email, message: formatSubmissionMessage(result.value) },
    })
    return respond(201, { received: true }, null)
  } catch (error) {
    // Log only a coarse identifier: never the submission, and never the driver's message, to the client.
    console.error('[api/contact] could not save submission:', error?.code ?? error?.name ?? 'unknown')
    return respond(500, null, {
      message: 'Something went wrong on our side. Please try again, or contact us directly.',
    })
  }
}
