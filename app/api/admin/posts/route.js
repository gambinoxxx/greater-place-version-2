import { crudRoutes } from '@/lib/admin-crud'
import { validatePost } from '@/lib/admin-validation'

// POST /api/admin/posts: create a Post. Admin-only (proxy.js matcher + adminRoute re-check).
export const dynamic = 'force-dynamic'

const routes = crudRoutes({ model: 'post', label: 'Post', validate: validatePost })
export const POST = routes.POST
