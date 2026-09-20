import { crudRoutes } from '@/lib/admin-crud'
import { validateEvent } from '@/lib/admin-validation'

// PUT /api/admin/events/[id]: update a Event. DELETE: remove it. Admin-only.
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'event', label: 'Event', validate: validateEvent })
export const PUT = routes.PUT
export const DELETE = routes.DELETE
