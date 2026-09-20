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

// Button variants: solidRed (primary CTA), outline (secondary), solidWhite (white-filled CTA
// for dark surfaces or photography). Documented in docs/ui-context.md.
const buttonShared = {
  padding: '12px 28px',
  border: '1px solid transparent',
  '&.MuiButton-sizeSmall': { padding: '8px 18px', fontSize: '0.8125rem' },
}

const theme = createTheme(base, {
  components: {
    // Route MUI components that receive an `href` through Next.js client-side navigation.
    MuiButtonBase: { defaultProps: { LinkComponent: NextLink } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      variants: [
        {
          props: { variant: 'solidRed' },
          style: {
            ...buttonShared,
            backgroundColor: palette.error.main,
            color: palette.error.contrastText,
            '&:hover': { backgroundColor: palette.error.dark },
            '&.Mui-disabled': { opacity: 0.45, color: palette.error.contrastText },
            '&.Mui-focusVisible': { outline: `2px solid ${palette.error.main}`, outlineOffset: 2 },
          },
        },
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
