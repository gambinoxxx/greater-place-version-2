import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-appearance'
import { isClerkConfigured } from '@/lib/admin-access'

// Admin sign-in. Clerk renders the form (<SignIn />); this page only frames it and the card is
// themed through lib/clerk-appearance.js. The `[[...sign-in]]` catch-all lets Clerk use path routing
// for its multi-step flows (/sign-in/factor-one, ...). Signing in returns to /admin; the proxy then
// checks the email allowlist, so a valid Clerk account alone does not reach the admin area.
export const metadata = {
  title: 'Sign in — Greater Place',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <main
      id="main"
      data-theme="dark"
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-brand-black px-5 py-16 text-brand-ivory"
    >
      <div className="text-center">
        <Link
          href="/"
          className="font-serif text-3xl font-semibold tracking-tight underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ivory"
        >
          Greater Place
        </Link>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-ivory/60">Admin</p>
      </div>

      {isClerkConfigured() ? (
        <SignIn appearance={clerkAppearance} routing="path" path="/sign-in" fallbackRedirectUrl="/admin" />
      ) : (
        <p role="status" className="max-w-sm border border-brand-ivory/20 p-6 text-center text-brand-ivory/75">
          Admin sign-in is not configured yet.
        </p>
      )}

      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ivory/60 underline-offset-4 hover:text-brand-ivory hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ivory"
      >
        ← Back to the site
      </Link>
    </main>
  )
}
