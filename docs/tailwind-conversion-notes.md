# Greater Place V2 — Tailwind Conversion Notes

## Purpose
These notes define how the Greater Place visual system should be expressed with Tailwind CSS while MUI remains the primary component library.

## 1. Styling Responsibilities
### Tailwind
Use Tailwind for page layout, containers, grid/flex composition, spacing, responsive behavior, section backgrounds, typography utilities, positioning, image sizing/cropping, and simple borders.

### MUI
Use MUI for buttons where reusable variants are appropriate, form controls, menus, dialogs, accessible interactive components, component states, and theme-aware primitives.

## 2. Semantic Tokens
Recommended Tailwind semantic mappings:
- bg-base → #0A0D12
- bg-surface → #101826
- bg-deep → #0B121C
- bg-footer → #06080B
- bg-ivory → #F3F5F8
- text-white → #FFFFFF
- accent-red → #E5484D
- accent-red-deep → #C23238
- accent-green → #3FBF6F
- accent-purple → #A78BFA
- accent-gold → #D9A441
- accent-teal → #4FD1C5
- accent-stories-blue → #5B9BD5

Semantic names are preferred over arbitrary color names.

## 3. Typography
Register project fonts through next/font/google:
- Fraunces
- Manrope

Do not manually import Google Fonts from CSS.

Conceptual hierarchy:
- display: Fraunces
- heading: Fraunces
- body: Manrope
- UI: Manrope
- metadata: Manrope

## 4. Container Pattern
Use a consistent responsive container: full-width section, centered inner container, responsive horizontal padding, and a controlled maximum width. Determine the maximum width from the composition rather than a generic template.

## 5. Spacing
Use the Tailwind spacing scale consistently. Prefer deliberate section spacing over excessive utility accumulation. Put spacing on the layout parent when the spacing belongs to the layout.

## 6. Editorial Grid
Use one-column mobile layouts, two-column editorial layouts, asymmetric desktop compositions, media/text splits, and full-bleed image sections. Use CSS Grid when column relationships matter and Flexbox for linear alignment.

## 7. Images
Typical treatment:
- object-cover for editorial photography
- explicit aspect ratios when composition requires consistency
- overflow-hidden only when cropping is intentional
- responsive image sizing through Next.js Image

## 8. Borders
Use borders sparingly for horizontal section rules, subtle card borders, navigation separators, and form fields. Avoid borders around every element.

## 9. Radius
Default project radius is zero. Do not add rounded-lg, rounded-xl, or rounded-2xl to ordinary editorial surfaces unless a documented component calls for it. Circular elements may use rounded-full.

## 10. Shadows
Shadows should be rare. The design relies on contrast, spacing, borders, imagery, and typography more than elevation.

## 11. Responsive Strategy
Use mobile-first classes. Prefer base mobile styles, md for intermediate layouts, and lg/larger breakpoints for desktop composition. Every breakpoint override should have a layout reason.

## 12. State Styling
Consider hover, focus-visible, active, disabled, validation/error, and loading states. Keyboard focus must remain visible.

## 13. Dark Editorial Sections
The core site is dark, but selected sections may use ivory/light surfaces for rhythm. These are page-level composition decisions, not a global theme switch.

## 14. Avoid
Do not use Tailwind for arbitrary decorative gradients, excessive shadows, generic rounded dashboard cards, inconsistent one-off colors, duplicate component systems, or unexplained large spacing values.

## 15. Conversion Rule
When converting a design reference:
1. Identify the semantic section.
2. Identify its responsive layout.
3. Identify reusable components.
4. Apply project tokens.
5. Implement structure with Tailwind.
6. Use MUI for behavior/components where appropriate.
7. Verify mobile and desktop.
8. Remove unnecessary utility classes after the layout is stable.
