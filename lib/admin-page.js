import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'

// Every admin page calls this first. The layout also checks, but layouts do not re-run on client-side
// navigation, so the page verifies the admin itself. Server-only.
export async function requireAdminPage() {
  const session = await getAdminSession()
  if (!session.ok) redirect(session.reason === 'signed-out' ? '/sign-in' : '/not-authorized')
  return session
}
