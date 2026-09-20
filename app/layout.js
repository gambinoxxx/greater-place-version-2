import './globals.css'
import { Fraunces, Manrope } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'
import { isClerkConfigured } from '@/lib/admin-access'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata = {
  title: 'Greater Place',
  description:
    'Greater Place is a performing arts, ministry, and youth-development nonprofit serving young people approximately ages 8–33.',
}

export default function RootLayout({ children }) {
  const page = (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )

  // Clerk (admin authentication) wraps the app only once its keys are set. Without them the provider
  // would throw during the production build and start Clerk's keyless mode in `next dev`, and the
  // public site must keep working with no Clerk configuration. /admin stays closed meanwhile (proxy.js).
  if (!isClerkConfigured()) return page
  return (
    <ClerkProvider signInUrl="/sign-in" signInFallbackRedirectUrl="/admin" afterSignOutUrl="/">
      {page}
    </ClerkProvider>
  )
}
