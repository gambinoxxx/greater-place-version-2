import { crudRoutes } from '@/lib/admin-crud'
import { validateSponsor } from '@/lib/admin-validation'

// PUT /api/admin/sponsors/[id]: update a sponsor. DELETE: remove it. Admin-only.
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'sponsor', label: 'Sponsor', validate: validateSponsor })
export const PUT = routes.PUT
export const DELETE = routes.DELETE
