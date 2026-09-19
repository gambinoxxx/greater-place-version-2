# Greater Place V2 — Project Overview

## 1. Project
Greater Place V2 is the redesigned website for Greater Place, a performing arts, ministry, and youth-development nonprofit serving young people approximately ages 8–33.

Working positioning:
- Dance is the vehicle.
- Empowerment is the purpose.
- Culture is part of the identity.
- Opportunity is the outcome.

Working creative line: “Where movement becomes opportunity.”

## 2. Product Goals
- Present Greater Place as a credible, premium, culturally grounded organization.
- Make programs, training, pathway opportunities, events, stories, and ways to get involved easy to discover.
- Use photography and editorial composition to communicate movement, people, culture, and transformation.
- Support structured content rather than hard-coded page content.
- Provide a foundation for enrollment, contact, authentication, and administrative workflows.

## 3. Primary Audience
- Young people and prospective participants.
- Parents and guardians.
- Donors and supporters.
- Partners and community organizations.
- Schools and institutions.
- People interested in performances, training, culture, and youth development.

## 4. Information Architecture
Primary navigation direction:
- Programs
- Pathway
- About
- Events
- Stories
- Get Involved
- Search/menu

The original client navigation included About, Programs, Pathway, Events, Get Involved, and Enroll.

## 5. Homepage Direction
Planned areas:
1. Header/navigation
2. Hero
3. Our Story
4. Performances
5. Training
6. Programs
7. Movement & Culture
8. Team
9. On Stage / repertory
10. Stories of Change
11. Support Greater Place
12. Contact
13. Footer

## 6. Visual Direction
Creative direction: **Editorial African Performing Arts**

The site should feel premium, editorial, human, cultural, energetic, cinematic, and contemporary.

Avoid generic startup layouts, excessive rounded cards, template gradients, unnecessary glassmorphism, dense dashboard UI, and invented photography or organizational facts.

## 7. Technology
- Next.js 16.3.3
- React 19.2.0
- JavaScript
- Next.js App Router
- MUI 9.4.0
- @mui/material-nextjs 9.4.0
- Tailwind CSS 3.3.2
- Prisma 5.22.0
- PostgreSQL / Neon
- Firebase 12.7.0 — role TBD
- ImageKit via @imagekit/nodejs and @imagekit/javascript

## 8. Application Structure
Intended structure:
- app/
- components/
- lib/
- prisma/
- public/
- docs/

The project should use the root App Router structure rather than an unnecessary src/ layer.

## 9. Data Architecture
Prisma is the structured content source of truth.

Initial models:
- Program
- Class
- Event
- Post
- TeamMember
- ContactSubmission

Image binaries belong in ImageKit. The database stores the relevant ImageKit identifier and/or URL.

## 10. Authentication
Authentication and role-based administration are planned, but the exact Firebase role is unresolved. Do not implement the final authentication architecture until that role is confirmed.

## 11. Fonts
- Fraunces — display/headings
- Manrope — body/UI

## 12. Brand Palette
- Black #0A0D12
- Navy #101826
- Deep Navy #0B121C
- Ivory #F3F5F8
- White #FFFFFF
- Red #E5484D
- Deep Red #C23238
- Green #3FBF6F
- Purple #A78BFA
- Gold #D9A441
- Teal #4FD1C5
- Stories Blue #5B9BD5
- Footer Background #06080B

## 13. Theme
The global design system is dark-only until a formally designed light palette exists. Selected light/ivory sections are allowed as intentional page-level editorial rhythm. next-themes is installed for future flexibility but is not currently wired into the application.

## 14. Component System
MUI is the primary component system. Tailwind is used primarily for layout, spacing, responsive composition, utility styling, and section-level visual treatment.

Reusable patterns include:
- SiteHeader
- SiteFooter
- SectionHeader
- Button variants
- RevealOnScroll
- EventCard
- ProgramCard
- CategoryTag

## 15. Development Principle
Build in small, verifiable increments. Each unit should have one clear purpose, avoid unrelated refactors, be testable or visually verifiable, respect the established architecture, and keep documentation synchronized.

docs/progress-tracker.md is protected and must not be edited by automated implementation work unless explicitly requested.

## 16. Success Criteria
V2 should clearly communicate Greater Place's mission, make key journeys easy to understand, feel distinctive and culturally grounded, perform well on mobile and desktop, use real structured content, maintain a coherent component system, pass production builds, keep secrets out of source control, and support future content/enrollment/administrative workflows.
