// Idempotent seed: node prisma/seed.js (reads DATABASE_URL from .env).
// Rows are created only if their slug does not exist; existing rows are never overwritten.
//
// - Programs / Classes: titles and descriptions are the approved copy from
//   docs/design-references/programs.html.
// - Posts: PLACEHOLDER rows so the /programs and /classes blog teasers have data. Replace or
//   delete them once real blog content exists (they all have a "placeholder-" slug prefix).
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const programs = [
  {
    slug: 'faith-and-character',
    title: 'Faith & Character',
    description:
      "Every rehearsal opens with a short devotion — not a separate class, but a lens for how we train. Dancers learn that discipline, integrity and service aren't opposed to artistry; they're what make it sustainable.",
  },
  {
    slug: 'leadership',
    title: 'Leadership',
    description:
      "By Stage Four of the Pathway, dancers aren't just performing — they're teaching warm-ups, mentoring newer members and helping shape rehearsal. Leadership here is a responsibility every dancer grows into, not a title handed to a few.",
  },
  {
    slug: 'wellness',
    title: 'Wellness',
    description:
      "We treat wellness as part of training, not an add-on. Instructors are trained to recognize burnout and stress, rehearsals include space to check in, and dancers are taught healthy coping skills alongside technique.",
  },
]

const classes = [
  { slug: 'ogene', title: 'Ogene', description: 'Percussive call-and-response rooted in Igbo tradition.' },
  { slug: 'liturgical-dance', title: 'Liturgical Dance', description: 'Worship expressed through choreographed movement.' },
  { slug: 'praise-and-worship', title: 'Praise & Worship', description: 'Contemporary gospel movement for group and solo work.' },
  { slug: 'drama-and-skits', title: 'Drama & Skits', description: 'Storytelling and theatre alongside dance technique.' },
]

const PLACEHOLDER_BODY = 'Placeholder post. Real blog content coming soon.'
const posts = [
  { slug: 'placeholder-community-spotlight', title: 'Community Spotlight', category: 'Community' },
  { slug: 'placeholder-culture-notes', title: 'Culture Notes', category: 'Culture' },
  { slug: 'placeholder-pathway-notes', title: 'Pathway Notes', category: 'Pathway' },
  { slug: 'placeholder-wellness-notes', title: 'Wellness Notes', category: 'Wellness' },
].map((post) => ({
  ...post,
  excerpt: 'Placeholder excerpt — real blog content coming soon.',
  body: PLACEHOLDER_BODY,
  authorName: 'Greater Place',
}))

async function seed(model, rows) {
  let created = 0
  for (const row of rows) {
    const existing = await prisma[model].findUnique({ where: { slug: row.slug } })
    if (!existing) {
      await prisma[model].create({ data: row })
      created += 1
    }
  }
  console.log(`${model}: ${created} created, ${rows.length - created} already present`)
}

async function main() {
  await seed('program', programs)
  await seed('class', classes)
  await seed('post', posts)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
