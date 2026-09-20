import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

// Shared admin shell (sidebar + content column) for every /admin/* page. proxy.js is the gate; this
// re-verifies the admin server-side (defence in depth) and never renders the shell for anyone else.
// Layouts do not re-run on client-side navigation, so each page also calls getAdminSession() itself.
export const metadata = {
  title: 'Admin — Greater Place',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }) {
  const session = await getAdminSession()
  if (!session.ok) {
    if (session.reason === 'signed-out') redirect('/sign-in')
    if (session.reason === 'not-allowed') redirect('/not-authorized')
    return <p className="p-8 text-brand-ivory">Admin access is not configured.</p>
  }

  const unread = await prisma.contactSubmission.count({ where: { isRead: false } })

  return (
    <div data-theme="dark" className="min-h-screen bg-brand-black text-brand-ivory lg:flex">
      <AdminSidebar unread={unread} email={session.email} />
      <div className="flex min-w-0 grow flex-col lg:ml-[260px]">{children}</div>
    </div>
  )
}
