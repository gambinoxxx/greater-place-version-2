import prisma from '@/lib/prisma'
import { adminRoute, fail, isNotFound, isRecordId, isUniqueViolation, respond } from '@/lib/admin-api'
import { CATEGORY_NAMES } from '@/components/CategoryTag'

// One CRUD implementation for the four admin resources (posts, events, programs, classes) so their
// Route Handlers cannot drift apart. `model` is a Prisma delegate name; `validate` is one of the
// lib/admin-validation.js validators. Exposes collection (POST) and item (PUT, DELETE) handlers.
export function crudRoutes({ model, label, validate }) {
  const delegate = () => prisma[model]

  const validation = async (body, id) => {
    // A post may keep an older free-form category it already has; new values must be a known one.
    let options
    if (model === 'post' && id) {
      const existing = await delegate().findUnique({ where: { id }, select: { category: true } })
      options = { categories: existing ? [...CATEGORY_NAMES, existing.category] : CATEGORY_NAMES }
    }
    return validate(body, options)
  }

  const invalid = (result) => fail(400, 'Please check the highlighted fields.', result.errors)
  const slugTaken = () => fail(409, 'Please check the highlighted fields.', { slug: 'That URL is already in use. Choose another.' })

  const POST = adminRoute(async ({ body }) => {
    const result = await validation(body)
    if (!result.ok) return invalid(result)
    try {
      const record = await delegate().create({ data: result.value, select: { id: true } })
      return respond(201, { id: record.id }, null)
    } catch (error) {
      if (isUniqueViolation(error)) return slugTaken()
      throw error
    }
  })

  const PUT = adminRoute(async ({ params, body }) => {
    if (!isRecordId(params.id)) return fail(404, `${label} not found.`)
    const result = await validation(body, params.id)
    if (!result.ok) return invalid(result)
    try {
      const record = await delegate().update({ where: { id: params.id }, data: result.value, select: { id: true } })
      return respond(200, { id: record.id }, null)
    } catch (error) {
      if (isUniqueViolation(error)) return slugTaken()
      if (isNotFound(error)) return fail(404, `${label} not found.`)
      throw error
    }
  })

  const DELETE = adminRoute(async ({ params }) => {
    if (!isRecordId(params.id)) return fail(404, `${label} not found.`)
    try {
      await delegate().delete({ where: { id: params.id } })
      return respond(200, { id: params.id }, null)
    } catch (error) {
      if (isNotFound(error)) return fail(404, `${label} not found.`)
      throw error
    }
  })

  return { POST, PUT, DELETE }
}
