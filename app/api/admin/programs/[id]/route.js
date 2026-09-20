import { crudRoutes } from '@/lib/admin-crud'
import { validateProgramLike } from '@/lib/admin-validation'

// PUT /api/admin/programs/[id]: update a Program. DELETE: remove it. Admin-only.
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'program', label: 'Program', validate: validateProgramLike })
export const PUT = routes.PUT
export const DELETE = routes.DELETE
