'use client'

import NextLink from 'next/link'
import { createTheme } from '@mui/material/styles'

// Dark-only. Do not add a light palette or colorSchemes here until one is designed.
// Font variables are registered by next/font in app/layout.js.
const base = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A0D12',
      paper: '#101826',
    },
    text: {
      primary: '#F3F5F8',
      secondary: 'rgba(243,245,248,.55)',
      disabled: 'rgba(243,245,248,.38)',
    },
    divider: 'rgba(243,245,248,.14)',
    primary: { main: '#FFFFFF' },
    secondary: { main: '#A78BFA' },
    error: { main: '#E5484D', dark: '#C23238' },
    success: { main: '#3FBF6F' },
    warning: { main: '#D9A441' },
    info: { main: '#4FD1C5' },
    navyDeep: '#0B121C',
    storiesBlue: '#5B9BD5',
    footerBg: '#06080B',
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: 'var(--font-manrope), sans-serif',
    h1: { fontFamily: 'var(--font-fraunces), serif' },
    h2: { fontFamily: 'var(--font-fraunces), serif' },
    h3: { fontFamily: 'var(--font-fraunces), serif' },
    h4: { fontFamily: 'var(--font-fraunces), serif' },
    button: { fontWeight: 700, letterSpacing: '0.08em' },
  },
})

const { palette } = base

// Button variants: solidNavy (primary CTA), outline (secondary), solidWhite (white-filled CTA
// for dark surfaces or photography). Documented in docs/ui-context.md.
const buttonShared = {
  padding: '12px 28px',
  border: '1px solid transparent',
  '&.MuiButton-sizeSmall': { padding: '8px 18px', fontSize: '0.8125rem' },
}

// The one primary-CTA treatment, site-wide: navy fill with a gold underline, gold on hover. `solidRed`
// is kept as an alias of this same style so every existing `variant="solidRed"` usage (12 of them)
// follows without editing each file.
const primaryButton = {
  ...buttonShared,
  backgroundColor: '#101826',
  color: '#F3F5F8',
  border: '1px solid rgba(243, 245, 248, 0.18)', // keeps the shape visible on dark sections
  borderBottom: '3px solid #D9A441',
  '&:hover': { backgroundColor: '#D9A441', color: '#0A0D12' },
  '&.Mui-disabled': { opacity: 0.45, color: '#F3F5F8' },
  '&.Mui-focusVisible': { outline: '2px solid #D9A441', outlineOffset: 2 },
}

// Form controls follow the page atmosphere (components/PageAtmosphere.jsx, tokens in app/globals.css)
// so they stay legible on the light sections of inner pages. This is not a light palette: every rule
// is scoped to html[data-atmosphere], which only exists on pages that mount PageAtmosphere, so
// everywhere else (admin, sign-in, or before hydration) the controls keep their dark-theme colours.
// A self-contained dark surface inside such a page (the footer) opts out with .atmos-dark-surface.
const atmos = (styles) => ({ 'html[data-atmosphere] &': styles })

const theme = createTheme(base, {
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: atmos({
          color: 'var(--atmos-fg-muted)',
          '&.Mui-focused': { color: 'var(--atmos-fg)' },
          '&.Mui-error': { color: 'var(--atmos-error)' },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: atmos({
          color: 'var(--atmos-fg)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--atmos-field)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--atmos-fg)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--atmos-fg)' },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--atmos-error)' },
          '& input::placeholder, & textarea::placeholder': { color: 'var(--atmos-fg-muted)', opacity: 1 },
        }),
      },
    },
    MuiSelect: { styleOverrides: { icon: atmos({ color: 'var(--atmos-fg-muted)' }) } },
    MuiFormHelperText: {
      styleOverrides: { root: atmos({ color: 'var(--atmos-fg-muted)', '&.Mui-error': { color: 'var(--atmos-error)' } }) },
    },
    // Route MUI components that receive an `href` through Next.js client-side navigation.
    MuiButtonBase: { defaultProps: { LinkComponent: NextLink } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      variants: [
        { props: { variant: 'solidNavy' }, style: primaryButton },
        { props: { variant: 'solidRed' }, style: primaryButton }, // legacy alias
        {
          props: { variant: 'outline' },
          style: {
            ...buttonShared,
            color: 'inherit',
            borderColor: 'currentColor',
            '&.Mui-disabled': { opacity: 0.45, color: 'inherit' },
            '&:hover': { backgroundColor: 'color-mix(in srgb, currentColor 12%, transparent)' },
            '&.Mui-focusVisible': { outline: '2px solid currentColor', outlineOffset: 2 },
          },
        },
        {
          props: { variant: 'solidWhite' },
          style: {
            ...buttonShared,
            backgroundColor: palette.primary.main,
            color: palette.background.default,
            '&:hover': { backgroundColor: palette.text.primary },
            '&.Mui-disabled': { opacity: 0.45, color: palette.background.default },
            '&.Mui-focusVisible': { outline: `2px solid ${palette.primary.main}`, outlineOffset: 2 },
          },
        },
      ],
    },
  },
})

export default theme
