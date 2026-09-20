import { crudRoutes } from '@/lib/admin-crud'
import { validateProgramLike } from '@/lib/admin-validation'

// POST /api/admin/programs: create a Program. Admin-only (proxy.js matcher + adminRoute re-check).
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'program', label: 'Program', validate: validateProgramLike })
export const POST = routes.POST
