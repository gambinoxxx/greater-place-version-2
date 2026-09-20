import { crudRoutes } from '@/lib/admin-crud'
import { validateEvent } from '@/lib/admin-validation'

// POST /api/admin/events: create a Event. Admin-only (proxy.js matcher + adminRoute re-check).
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'event', label: 'Event', validate: validateEvent })
export const POST = routes.POST
