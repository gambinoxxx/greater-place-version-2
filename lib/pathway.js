// Local constant: the Pathway has no Prisma model (open decision). Copy is taken verbatim from
// docs/design-references/programs.html and training.html. Several details here are factual claims
// (rehearsal frequency, named shows, term lengths) that should be verified before launch.
export const PATHWAY = [
  {
    slug: 'discover',
    number: 'Stage One',
    name: 'Discover',
    track: 'Training',
    headline: 'Where every dancer begins.',
    description:
      'No prior experience required. Discover is built to meet a dancer exactly where they are: learning foundational technique, rhythm and basic choreography in a low-pressure group setting, while building the discipline habits that carry through every later stage.',
    meta: [
      { label: 'Typical Length', value: '2 Terms' },
      { label: 'Class Size', value: 'Small Group' },
      { label: 'Age Range', value: '8–33' },
    ],
    bullets: [
      'Foundational technique and rhythm work',
      'Introduction to devotion and Pathway character values',
      'First group performance opportunity at a community event',
    ],
    photo: 'First class, learning the basics',
    cta: { label: 'Ask About Starting Here', href: '/contact' },
  },
  {
    slug: 'develop',
    number: 'Stage Two',
    name: 'Develop',
    track: 'JV',
    headline: 'Technique sharpens, choreography deepens.',
    description:
      "Dancers who've built a foundation in Discover move into more demanding choreography and a faster rehearsal pace. This is where technical growth accelerates, and where character mentorship starts pairing newer dancers with more experienced ones.",
    meta: [
      { label: 'Typical Length', value: '2–3 Terms' },
      { label: 'Rehearsal', value: '2x / Week' },
      { label: 'Performs In', value: '2+ Shows' },
    ],
    bullets: [
      'Multi-style choreography: liturgical, praise, contemporary',
      'Paired mentorship with a Stage Three or Four dancer',
      'Eligible for smaller community performances',
    ],
    photo: 'Sharpening technique, JV rehearsal',
    cta: { label: 'Ask About This Stage', href: '/contact' },
  },
  {
    slug: 'perform',
    number: 'Stage Three',
    name: 'Perform',
    track: 'Varsity',
    headline: 'Company-level performance readiness.',
    description:
      "Perform-stage dancers are full company members: carrying lead and ensemble roles across the season's major performances, including the Winter Showcase and Annual Gala, while continuing to refine technique at an advanced level.",
    meta: [
      { label: 'Typical Length', value: 'Ongoing' },
      { label: 'Rehearsal', value: '3x / Week' },
      { label: 'Performs In', value: 'All Major Shows' },
    ],
    bullets: [
      'Lead and featured ensemble roles',
      'Advanced technique and choreography ownership',
      'First opportunities to co-lead warm-ups',
    ],
    photo: 'Full company rehearsal, ahead of a showcase',
    cta: { label: 'See Where They Perform', href: '/events' },
  },
  {
    slug: 'lead',
    number: 'Stage Four',
    name: 'Lead',
    track: 'Leadership',
    headline: 'Leadership as a responsibility, not a title.',
    description:
      'The final stage of the Pathway hands real responsibility to dancers: leading warm-ups, mentoring newer members, helping shape rehearsal, and modeling the character values the whole program is built on. Many Stage Four dancers go on to instruct.',
    meta: [
      { label: 'Typical Length', value: 'Ongoing' },
      { label: 'Role', value: 'Mentor / Co-Lead' },
      { label: 'Path Beyond', value: 'Instructor Track' },
    ],
    bullets: [
      'Leads warm-ups and mentors Stage One–Two dancers',
      'Shapes rehearsal structure alongside instructors',
      'Eligible for instructor and volunteer leadership roles',
    ],
    photo: 'A senior dancer mentoring a newer one',
    cta: { label: 'Meet Our Leaders', href: '/#team' },
  },
]
