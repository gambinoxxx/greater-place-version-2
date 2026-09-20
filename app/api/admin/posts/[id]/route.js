import { crudRoutes } from '@/lib/admin-crud'
import { validatePost } from '@/lib/admin-validation'

// PUT /api/admin/posts/[id]: update a Post. DELETE: remove it. Admin-only.
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'post', label: 'Post', validate: validatePost })
export const PUT = routes.PUT
export const DELETE = routes.DELETE
