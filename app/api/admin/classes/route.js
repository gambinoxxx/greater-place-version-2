import { crudRoutes } from '@/lib/admin-crud'
import { validateProgramLike } from '@/lib/admin-validation'

// POST /api/admin/classes: create a Class. Admin-only (proxy.js matcher + adminRoute re-check).
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'class', label: 'Class', validate: validateProgramLike })
export const POST = routes.POST
