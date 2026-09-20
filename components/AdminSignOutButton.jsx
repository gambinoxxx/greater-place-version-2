'use client'

import { SignOutButton } from '@clerk/nextjs'
import Button from '@mui/material/Button'

// Signs the current Clerk session out and returns to the public site. Only render it when Clerk is
// configured (it needs <ClerkProvider>, which the root layout mounts only then).
export default function AdminSignOutButton() {
  return (
    <SignOutButton redirectUrl="/">
      <Button variant="outline">Sign out</Button>
    </SignOutButton>
  )
}
