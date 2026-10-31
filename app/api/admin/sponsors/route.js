import { crudRoutes } from '@/lib/admin-crud'
import { validateSponsor } from '@/lib/admin-validation'

// POST /api/admin/sponsors: add a sponsor. Admin-only (proxy.js matcher + adminRoute re-check).
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'sponsor', label: 'Sponsor', validate: validateSponsor })
export const POST = routes.POST
