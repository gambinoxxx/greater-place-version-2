// Shared class strings for the admin screens (Tailwind + the brand tokens). The admin UI has its own
// visual context (sidebar shell, slightly rounded panels) per docs/design-references/admin-*.html, so
// unlike the public site it uses small border radii. Kept in one place so the screens stay consistent.
export const CONTENT = 'grow px-5 py-7 md:px-9'
export const HAIR = 'border-brand-ivory/[0.14]'
export const PANEL = 'rounded-lg border border-brand-ivory/[0.14] bg-brand-ivory/[0.03]'
export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ivory'

const BTN = `inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`
export const BTN_RED = `${BTN} bg-brand-red text-white hover:bg-brand-redDeep`
export const BTN_OUTLINE = `${BTN} border border-brand-ivory/40 text-brand-ivory hover:bg-brand-ivory/10`
export const BTN_SMALL = `inline-flex items-center justify-center rounded border border-brand-ivory/[0.14] px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-brand-ivory/75 transition-colors hover:bg-brand-ivory/10 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`
export const ICON_BTN = `flex h-8 w-8 items-center justify-center rounded border border-brand-ivory/[0.14] text-brand-ivory/70 transition-colors hover:bg-brand-ivory/10 hover:text-brand-ivory disabled:opacity-50 ${FOCUS}`

export const LABEL = 'mb-2 mt-6 block text-[10.5px] uppercase tracking-[0.1em] text-brand-ivory/[0.55]'
export const INPUT = `w-full rounded-md border border-brand-ivory/[0.14] bg-brand-ivory/[0.03] px-3.5 py-3 text-[13px] leading-relaxed text-brand-ivory placeholder:text-brand-ivory/[0.38] ${FOCUS}`
export const FIELD_ERROR = 'mt-1.5 text-xs text-brand-red'

// Segmented filter (All / Published / Draft ...): links, so filters are shareable URLs.
export const SEGMENT_WRAP = 'flex w-fit gap-1.5 rounded-md bg-brand-ivory/[0.04] p-[3px]'
export const segment = (active) =>
  `rounded px-3.5 py-1.5 text-[11.5px] font-bold transition-colors ${FOCUS} ${active ? 'bg-brand-ivory text-brand-navyDeep' : 'text-brand-ivory/[0.55] hover:text-brand-ivory'}`
