# Greater Place V2 — UI Context

## 1. Design Language
Greater Place V2 uses an **Editorial African Performing Arts** visual language combining editorial typography, strong image-led storytelling, contemporary African cultural context, performance energy, restrained interface chrome, premium composition, and intentional whitespace.

The interface should feel like an arts organization with a strong point of view, not a generic nonprofit template.

## 2. Core Principles
- Human first: people, movement, stories, and transformation lead the visual hierarchy.
- Editorial over template: use asymmetric composition, large headlines, intentional cropping, varied section rhythms, and strong visual pacing.
- Restraint: avoid excessive cards, pills, shadows, gradients, and decorative UI.
- Motion with purpose: animation should reinforce movement and storytelling.
- Accessibility: contrast, focus states, keyboard navigation, reduced motion, semantic HTML, and usable touch targets are required considerations.

## 3. Typography
**Fraunces** for hero headlines, major headings, editorial statements, and high-emphasis quotes.

**Manrope** for body copy, navigation, buttons, labels, metadata, and forms.

Small uppercase labels may be used for categories, section identifiers, metadata, and navigation context.

## 4. Color System
Foundation:
- Black #0A0D12
- Navy #101826
- Navy Deep #0B121C
- Ivory #F3F5F8
- White #FFFFFF
- Footer #06080B

Accents:
- Red #E5484D
- Red Deep #C23238
- Green #3FBF6F
- Purple #A78BFA
- Gold #D9A441
- Teal #4FD1C5
- Stories Blue #5B9BD5

Do not introduce additional brand colors casually.

## 5. Borders and Radius
Default border radius is 0. Use sharp editorial geometry for cards, buttons, sections, image frames, and containers. Circular shapes are appropriate for semantic circular elements such as avatars, icon controls, and status indicators.

## 6. Layout
Use a responsive editorial grid. Desktop may use large media columns, offset text blocks, asymmetric image compositions, generous whitespace, and strong horizontal rules. Mobile should preserve hierarchy rather than mechanically stacking desktop elements.

## 7. Header
Direction:
- logo/brand on the left
- primary navigation
- clear Get Involved action
- search/menu controls where appropriate

Maintain strong contrast against editorial surfaces.

## 8. Hero
The hero should establish Greater Place identity, performing arts/movement, youth development/opportunity, and a clear next action.

Working reference copy: “A greater place to move, grow & lead.”

This is working copy and may change.

## 9. Section Headers
Use a consistent editorial pattern:
- small contextual label
- large serif heading
- concise supporting copy
- optional action/link

The pattern can vary between sections while the typography remains coherent.

## 10. Cards
Cards are useful for structured content such as programs, events, stories, and classes, but should not dominate the page. Prefer image, category/metadata, editorial title, concise description, and clear action.

Use borders and spacing rather than heavy shadows.

## 11. Imagery
Preferred subject matter:
- dance
- performance
- rehearsal
- movement
- young people
- teachers/mentors
- backstage moments
- cultural moments
- community
- transformation

Do not invent real people, events, performances, awards, or organizational history. Use placeholders until real assets are supplied.

## 12. Motion
Recommended:
- subtle reveal-on-scroll
- image entrance
- restrained text stagger
- hover transitions
- navigation transitions

Avoid excessive parallax, constant looping movement, distracting effects, or animation that blocks access to content. Respect prefers-reduced-motion.

## 13. Forms
Forms should use clear labels, required indicators, error messages, success feedback, and focus states. Do not rely on placeholder text as the only label.

## 14. Responsive Behavior
Check small mobile, large mobile, tablet, laptop, and large desktop. Images should use appropriate responsive sizing and cropping.

## 15. MUI + Tailwind Boundary
MUI owns component behavior, accessible controls, form primitives, theme-aware component styling, and complex interactive UI.

Tailwind owns page composition, spacing, grid/flex layouts, responsive utility styling, and section-level layout.

Avoid two competing styling systems for the same responsibility.

## 16. Theme Rule
The project remains dark-only at the global theme level until a real light palette is designed. Do not add a theme toggle simply because next-themes exists. Light/ivory sections are allowed as intentional editorial sections.

## 17. Do Not
- copy Ailey or another site's design directly
- use fake testimonials
- invent statistics
- invent team members
- invent programs or event details
- use stock imagery as if it were Greater Place
- overuse rounded cards
- add decorative gradients without rationale
- turn the site into a dashboard
