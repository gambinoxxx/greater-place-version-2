import tailwindConfig from '@/tailwind.config'

// Restyles Clerk's <SignIn /> to the Greater Place dark palette. Colours come from the Tailwind brand
// tokens (tailwind.config.js), so there is one source of truth. Clerk renders the form itself; this
// only themes it (variables + elements). Plain style objects are used because Clerk's own CSS would
// out-rank Tailwind utility classes.
const { brand } = tailwindConfig.theme.extend.colors

function alpha(hex, opacity) {
  const value = parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${opacity})`
}

const SERIF = 'var(--font-fraunces), serif'
const SANS = 'var(--font-manrope), sans-serif'
const LINE = `1px solid ${alpha(brand.ivory, 0.14)}`

export const clerkAppearance = {
  variables: {
    colorPrimary: brand.red,
    colorBackground: brand.navy,
    colorText: brand.ivory,
    colorTextSecondary: alpha(brand.ivory, 0.6),
    colorTextOnPrimaryBackground: brand.white,
    colorNeutral: brand.ivory,
    colorInputBackground: brand.navyDeep,
    colorInputText: brand.ivory,
    colorDanger: brand.red,
    colorSuccess: brand.green,
    borderRadius: '0px',
    fontFamily: SANS,
    fontFamilyButtons: SANS,
  },
  elements: {
    rootBox: { width: '100%' },
    cardBox: { width: '100%', maxWidth: '26rem', boxShadow: 'none', border: LINE, borderRadius: 0 },
    card: { boxShadow: 'none', borderRadius: 0 },
    headerTitle: { fontFamily: SERIF, fontWeight: 400, fontSize: '1.75rem' },
    headerSubtitle: { color: alpha(brand.ivory, 0.6) },
    socialButtonsBlockButton: { border: LINE, borderRadius: 0, backgroundColor: 'transparent' },
    dividerLine: { backgroundColor: alpha(brand.ivory, 0.14) },
    formFieldLabel: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' },
    formFieldInput: { border: LINE, borderRadius: 0 },
    formButtonPrimary: {
      backgroundColor: brand.red,
      borderRadius: 0,
      boxShadow: 'none',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      '&:hover, &:focus, &:active': { backgroundColor: brand.redDeep },
    },
    // Sign-up is not offered: /admin access is by allowlist, not by creating an account.
    footerAction: { display: 'none' },
  },
}
