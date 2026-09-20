import { crudRoutes } from '@/lib/admin-crud'
import { validateProgramLike } from '@/lib/admin-validation'

// PUT /api/admin/classes/[id]: update a Class. DELETE: remove it. Admin-only.
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'class', label: 'Class', validate: validateProgramLike })
export const PUT = routes.PUT
export const DELETE = routes.DELETE
