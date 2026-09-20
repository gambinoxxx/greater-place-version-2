import prisma from '@/lib/prisma'
import { adminRoute, fail, isNotFound, isRecordId, respond } from '@/lib/admin-api'
import { validateReadFlag } from '@/lib/admin-validation'

// PATCH /api/admin/contact/[id] { isRead }: mark a submission read or unread. This is the ONLY write
// the contact inbox has: no create, edit, reply, or delete. Admin-only.
export const dynamic = 'force-dynamic'

export const PATCH = adminRoute(async ({ params, body }) => {
  if (!isRecordId(params.id)) return fail(404, 'Message not found.')
  const result = validateReadFlag(body)
  if (!result.ok) return fail(400, 'isRead must be true or false.', result.errors)
  try {
    await prisma.contactSubmission.update({ where: { id: params.id }, data: result.value })
    return respond(200, { id: params.id, isRead: result.value.isRead }, null)
  } catch (error) {
    if (isNotFound(error)) return fail(404, 'Message not found.')
    throw error
  }
})
