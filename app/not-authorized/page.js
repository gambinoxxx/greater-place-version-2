import Button from '@mui/material/Button'
import AdminSignOutButton from '@/components/AdminSignOutButton'
import { isClerkConfigured } from '@/lib/admin-access'

// Where proxy.js sends someone who is signed in but not on the admin allowlist. It lives OUTSIDE
// /admin on purpose (a page under /admin would be gated and redirect back here forever) and never
// runs Clerk on the server. It says nothing about who is on the list or how the list is configured.
export const metadata = {
  title: 'Not authorized — Greater Place',
  robots: { index: false, follow: false },
}

export default function NotAuthorizedPage() {
  return (
    <main
      id="main"
      data-theme="dark"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-black px-5 py-16 text-center text-brand-ivory"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-ivory/60">Admin</p>
      <h1 className="font-serif text-4xl md:text-5xl">Not authorized</h1>
      <p className="max-w-md leading-relaxed text-brand-ivory/75">
        This account does not have access to the admin area. If you should, ask the site owner to add your email
        address. To use a different account, sign out and sign in again.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        {isClerkConfigured() && <AdminSignOutButton />}
        <Button variant="outline" href="/">
          Back to the site
        </Button>
      </div>
    </main>
  )
}
